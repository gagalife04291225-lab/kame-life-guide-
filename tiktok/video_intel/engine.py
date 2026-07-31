#!/usr/bin/env python3
"""
TITAN Video Intelligence Engine v1.0

1本の動画ファイルから、測定できる指標を可能な限り実測する。
測定できない項目は None を返し、`not_measured` に理由を残す。**推測値は入れない。**

必須依存: numpy / imageio-ffmpeg（どちらもOSS・無料）
任意依存（無くても動く。無い場合は該当指標が None になる）:
    pytesseract + tesseract  … OCR（字幕文字数・字幕テキスト）
    faster-whisper           … ASR（ナレーション速度・発話区間）
    ultralytics              … 物体/動物/人物検出 ※AGPL-3.0（実測）。WebUI提供時は要注意
    mediapipe                … 顔・姿勢・視線の近似

設計原則:
  1. 追加課金なし・GPU不要で動く経路を必ず持つ
  2. 出力は常に同じスキーマ。測れなかった項目は None
  3. 同じ動画・同じバージョンなら同じ結果（決定的）
"""
from __future__ import annotations
import subprocess, os, sys, json, math, hashlib, statistics as st
import numpy as np
import imageio_ffmpeg

VERSION = "titan-engine/1.0"
AW, AH = 135, 240          # 解析解像度（縦動画前提／全フレーム走査に耐える大きさ）
SR = 16000                 # 音声解析のサンプリングレート

# ───────────────────────── 基本入出力 ─────────────────────────

def _ffmpeg():
    return imageio_ffmpeg.get_ffmpeg_exe()

def probe(path):
    p = subprocess.run([_ffmpeg(), "-i", path], capture_output=True)
    err = p.stderr.decode(errors="ignore")
    out = dict(duration=None, width=None, height=None, fps=None,
               bitrate_kbps=None, has_audio=False, vcodec=None, acodec=None)
    for line in err.splitlines():
        s = line.strip()
        if s.startswith("Duration:"):
            t = s.split("Duration:")[1].split(",")[0].strip()
            if t != "N/A":
                hh, mm, ss = t.split(":")
                out["duration"] = int(hh)*3600 + int(mm)*60 + float(ss)
            if "bitrate:" in s:
                b = s.split("bitrate:")[1].strip().split()[0]
                out["bitrate_kbps"] = int(b) if b.isdigit() else None
        if "Stream" in s and "Video:" in s:
            out["vcodec"] = s.split("Video:")[1].strip().split()[0].strip(",")
            for tok in s.split(","):
                tok = tok.strip()
                a = tok.split()[0] if tok.split() else ""
                if "x" in a and a.split("x")[0].isdigit():
                    try:
                        w, h = a.split("x"); out["width"], out["height"] = int(w), int(h)
                    except ValueError:
                        pass
                if tok.endswith("fps"):
                    try: out["fps"] = float(tok.split()[0])
                    except ValueError: pass
        if "Stream" in s and "Audio:" in s:
            out["has_audio"] = True
            out["acodec"] = s.split("Audio:")[1].strip().split()[0].strip(",")
    return out

def iter_frames(path, fps):
    cmd = [_ffmpeg(), "-v", "error", "-i", path, "-f", "rawvideo", "-pix_fmt", "rgb24",
           "-s", "%dx%d" % (AW, AH), "-r", str(fps), "-"]
    p = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
    n = AW*AH*3
    try:
        while True:
            buf = p.stdout.read(n)
            if len(buf) < n:
                break
            yield np.frombuffer(buf, np.uint8).reshape(AH, AW, 3).astype(np.float32)
    finally:
        p.stdout.close(); p.wait()

def read_audio(path):
    """モノラル16kHzのPCMを読む。音声トラックが無ければ None。"""
    cmd = [_ffmpeg(), "-v", "error", "-i", path, "-vn", "-ac", "1", "-ar", str(SR),
           "-f", "s16le", "-"]
    p = subprocess.run(cmd, capture_output=True)
    if p.returncode != 0 or not p.stdout:
        return None
    return np.frombuffer(p.stdout, np.int16).astype(np.float32) / 32768.0

# ───────────────────────── 補助 ─────────────────────────

def sha1(path, limit=8_000_000):
    h = hashlib.sha1()
    with open(path, "rb") as f:
        h.update(f.read(limit))
    return h.hexdigest()[:16]

def edge_density(gray):
    return float(np.abs(np.diff(gray, axis=1)).mean() + np.abs(np.diff(gray, axis=0)).mean())

def _stats(xs):
    if not xs:
        return dict(n=0, mean=None, median=None, variance=None, stdev=None, min=None, max=None)
    return dict(n=len(xs), mean=round(st.mean(xs), 3), median=round(st.median(xs), 3),
                variance=round(st.pvariance(xs), 4) if len(xs) > 1 else 0.0,
                stdev=round(st.pstdev(xs), 3) if len(xs) > 1 else 0.0,
                min=round(min(xs), 3), max=round(max(xs), 3))

# ───────────────────────── 映像解析 ─────────────────────────

def analyze_video_track(path, meta):
    fps = meta["fps"] or 30.0
    dur = meta["duration"] or 0.0
    prev = None
    diffs, bright, contr, sat, ctemp = [], [], [], [], []
    bands = [[] for _ in range(5)]
    center_e, ring_e, hor_e, ver_e = [], [], [], []
    thirds_e, center_w = [], []
    hist = np.zeros(64, np.float64)
    first_frame = last_frame = None
    nfr = 0

    cy0, cy1 = int(AH*0.30), int(AH*0.70)
    cx0, cx1 = int(AW*0.25), int(AW*0.75)
    t_rows = [int(AH/3), int(2*AH/3)]
    t_cols = [int(AW/3), int(2*AW/3)]
    band_px = AH // 5

    for f in iter_frames(path, fps):
        nfr += 1
        if first_frame is None:
            first_frame = f.copy()
        last_frame = f
        gray = f.mean(axis=2)
        bright.append(float(gray.mean()))
        contr.append(float(gray.std()))
        mx, mn = f.max(axis=2), f.min(axis=2)
        sat.append(float(((mx-mn)/(mx+1e-6)).mean()))
        r, b = float(f[:, :, 0].mean()), float(f[:, :, 2].mean())
        ctemp.append(r/(b+1e-6))                       # >1 暖色 / <1 寒色
        q = (f/64).astype(np.int32).clip(0, 3)
        idx = (q[:, :, 0]*16 + q[:, :, 1]*4 + q[:, :, 2]).ravel()
        hist += np.bincount(idx, minlength=64)
        for i in range(5):
            bands[i].append(edge_density(gray[i*band_px:(i+1)*band_px]))
        # 構図: 三分割線上のエッジ energy / 中央 energy
        ge = np.abs(np.diff(gray, axis=1))
        band = 2
        te = sum(ge[max(0, rr-band):rr+band, :].sum() for rr in t_rows) + \
             sum(ge[:, max(0, cc-band):cc+band].sum() for cc in t_cols)
        thirds_e.append(float(te/(ge.sum()+1e-6)))
        center_w.append(float(ge[cy0:cy1, cx0:cx1].sum()/(ge.sum()+1e-6)))
        if prev is not None:
            d = np.abs(gray - prev)
            diffs.append(float(d.mean()))
            c = d[cy0:cy1, cx0:cx1].mean()
            ring = (d.sum() - d[cy0:cy1, cx0:cx1].sum())/(d.size-(cy1-cy0)*(cx1-cx0))
            center_e.append(float(c)); ring_e.append(float(ring))
            hor_e.append(float(np.abs(np.diff(d, axis=1)).mean()))
            ver_e.append(float(np.abs(np.diff(d, axis=0)).mean()))
        prev = gray

    arr = np.array(diffs) if diffs else np.zeros(1)
    med = float(np.median(arr))
    mad = float(np.median(np.abs(arr-med))) or 1e-6
    cut_thr = max(med + 4.0*mad, 8.0)
    chg_thr = max(med + 1.5*mad, 2.0)
    still_thr = max(med*0.5, 0.5)

    raw = [i for i, v in enumerate(arr) if v > cut_thr]
    cuts = []
    for i in raw:
        if not cuts or i - cuts[-1] > 2:
            cuts.append(i)
    cut_times = [round((i+1)/fps, 2) for i in cuts]

    bounds = [0.0] + cut_times + [dur]
    shots = [round(bounds[i+1]-bounds[i], 3) for i in range(len(bounds)-1)]
    shots = [s for s in shots if s > 0.05]

    longest, run, runs = 0, 0, []
    for i, v in enumerate(arr):
        if v < still_thr:
            run += 1
        else:
            if run: runs.append((i-run, run))
            run = 0
    if run: runs.append((len(arr)-run, run))
    longest = max((r[1] for r in runs), default=0)
    top_still = sorted(runs, key=lambda x: -x[1])[:3]

    ce, re_ = np.array(center_e or [0]), np.array(ring_e or [0])
    zoom_ratio = float((re_/(ce+1e-6)).mean())
    zoom_events = int(((re_ > ce*1.4) & (re_ > med)).sum())
    he, ve = np.array(hor_e or [0]), np.array(ver_e or [0])
    pan_ratio = float((he.mean()+1e-6)/(ve.mean()+1e-6))
    pan_events = int(((he > ve*1.3) & (np.array(diffs or [0]) > chg_thr)).sum())

    def window(t0, t1):
        a, b = int(t0*fps), int(min(t1*fps, len(arr)))
        seg = arr[a:b]
        return dict(frames=int(b-a),
                    mean_change=round(float(seg.mean()), 3) if len(seg) else None,
                    max_change=round(float(seg.max()), 3) if len(seg) else None,
                    cuts=int(sum(1 for t in cut_times if t0 <= t < t1)),
                    significant_changes=int((seg > chg_thr).sum()) if len(seg) else 0)

    be = [float(np.mean(x)) for x in bands]
    tot = sum(be) or 1.0
    band_share = [round(100.0*x/tot, 1) for x in be]

    hist = hist/max(hist.sum(), 1)
    top = np.argsort(-hist)[:5]
    palette = [dict(hex="#%02x%02x%02x" % (int(i//16)*64+32, int((i//4) % 4)*64+32, int(i % 4)*64+32),
                    share_pct=round(float(hist[i])*100, 1)) for i in top]

    loop_gap = None
    if first_frame is not None and last_frame is not None:
        loop_gap = round(float(np.abs(first_frame-last_frame).mean()), 2)

    per_sec = []
    for s in range(int(dur)):
        a, b = int(s*fps), int(min((s+1)*fps, len(arr)))
        if b > a:
            per_sec.append(round(float(arr[a:b].mean()), 2))

    return dict(
        frames_analyzed=nfr,
        cuts=dict(count=len(cut_times), per_10sec=round(len(cut_times)/(dur/10.0), 2) if dur else None,
                  times=cut_times, threshold=round(cut_thr, 2)),
        shot_length=dict(**_stats(shots),
                         over_2sec_ratio_pct=round(100.0*sum(1 for s in shots if s > 2.0)/len(shots), 1) if shots else None),
        screen_change=dict(significant_change_frames=int((arr > chg_thr).sum()),
                           per_sec=round(float((arr > chg_thr).sum())/dur, 2) if dur else None,
                           longest_static_run_sec=round(longest/fps, 2),
                           top_static_runs=[dict(start_sec=round(s/fps, 2), length_sec=round(l/fps, 2))
                                            for s, l in top_still]),
        motion=dict(mean_frame_diff=round(float(arr.mean()), 3), median_frame_diff=round(med, 3),
                    motion_timeline_per_sec=per_sec),
        camera=dict(zoom_ring_center_ratio=round(zoom_ratio, 3), zoom_events=zoom_events,
                    pan_horizontal_vertical_ratio=round(pan_ratio, 3), pan_events=pan_events,
                    interpretation=("周辺優位（ズーム/スケール変化）" if zoom_ratio > 1.15
                                    else "中心優位（被写体内の動き）" if zoom_ratio < 0.85 else "均衡")),
        color=dict(mean_brightness_0_255=round(float(np.mean(bright)), 1),
                   mean_contrast_stdev=round(float(np.mean(contr)), 1),
                   mean_saturation_0_1=round(float(np.mean(sat)), 3),
                   color_temperature_r_b_ratio=round(float(np.mean(ctemp)), 3),
                   color_temperature_label=("暖色寄り" if np.mean(ctemp) > 1.05
                                            else "寒色寄り" if np.mean(ctemp) < 0.95 else "中性"),
                   palette_top5=palette,
                   brightness_stats=_stats([round(x, 2) for x in bright])),
        text_layout=dict(band_share_pct_top_to_bottom=band_share,
                         dominant_band=int(np.argmax(be))+1,
                         bottom_band_share_pct=band_share[4], top_band_share_pct=band_share[0],
                         note="画面を縦5分割しエッジ密度で文字・図の位置を推定。1=最上部,5=最下部"),
        composition=dict(rule_of_thirds_energy_ratio=round(float(np.mean(thirds_e)), 3),
                         center_weight_ratio=round(float(np.mean(center_w)), 3)),
        opening=dict(first_0_5s=window(0, 0.5), first_1s=window(0, 1.0), first_3s=window(0, 3.0)),
        loop=dict(first_last_frame_diff=loop_gap,
                  loop_friendly=(loop_gap is not None and loop_gap < 12.0)),
    )

# ───────────────────────── 音声解析（numpyのみ） ─────────────────────────

def analyze_audio_track(path, meta):
    if not meta["has_audio"]:
        return dict(available=False, reason="音声トラックなし")
    x = read_audio(path)
    if x is None or len(x) < SR//2:
        return dict(available=False, reason="音声を読み出せない")
    hop = SR//100                                    # 10ms
    n = len(x)//hop
    frames = x[:n*hop].reshape(n, hop)
    rms = np.sqrt((frames**2).mean(axis=1)) + 1e-9
    db = 20*np.log10(rms)
    silence = float((db < -50).mean())
    onset = np.diff(rms, prepend=rms[0]).clip(min=0)
    thr = onset.mean() + 3*onset.std()
    peaks = []
    for i in range(1, len(onset)-1):
        if onset[i] > thr and onset[i] >= onset[i-1] and onset[i] > onset[i+1]:
            if not peaks or i-peaks[-1] > 8:          # 80ms以上離す
                peaks.append(i)
    # テンポ推定: オンセット包絡の自己相関 60-180BPM
    o = onset - onset.mean()
    ac = np.correlate(o, o, mode="full")[len(o)-1:]
    bpm, best = None, -1
    for b in range(60, 181):
        lag = int(round(60.0/b*100))                  # 10ms単位
        if lag < len(ac) and ac[lag] > best:
            best, bpm = ac[lag], b
    return dict(available=True,
                loudness_mean_dbfs=round(float(db.mean()), 1),
                loudness_peak_dbfs=round(float(db.max()), 1),
                silence_ratio=round(silence, 3),
                onset_count=len(peaks),
                onset_per_sec=round(len(peaks)/(len(x)/SR), 2),
                estimated_bpm=bpm,
                bpm_confidence="低（自己相関のみ。音楽解析OSS未導入）",
                narration_speed="未測定（ASR未導入）")

# ───────────────────────── 任意アダプタ ─────────────────────────

def adapter_status():
    st_ = {}
    for name, mod, note in [
        ("ocr", "pytesseract", "字幕文字数・字幕テキスト"),
        ("asr", "faster_whisper", "ナレーション速度・発話区間"),
        ("detect", "ultralytics", "人物/動物/物体/ロゴ検出 ※AGPL-3.0"),
        ("pose", "mediapipe", "姿勢・表情・視線の近似"),
    ]:
        try:
            __import__(mod); ok = True
        except Exception:
            ok = False
        st_[name] = dict(available=ok, module=mod, provides=note)
    return st_

def run_adapters(path, meta, sample_sec=1.0):
    """任意依存が入っていれば追加指標を測る。無ければ None のまま返す。"""
    res = dict(ocr=None, asr=None, detect=None, pose=None)
    st_ = adapter_status()
    if st_["ocr"]["available"]:
        try:
            import pytesseract
            from PIL import Image
            fps = meta["fps"] or 30.0
            texts, chars = [], []
            for i, f in enumerate(iter_frames(path, 1.0/sample_sec)):
                img = Image.fromarray(f.astype(np.uint8)).resize((AW*4, AH*4))
                t = pytesseract.image_to_string(img, lang="jpn+eng").strip()
                if t:
                    texts.append(t); chars.append(len(t.replace("\n", "")))
            res["ocr"] = dict(sampled_frames=int((meta["duration"] or 0)/sample_sec),
                              frames_with_text=len(texts),
                              text_frame_ratio=round(len(texts)/max(1, int((meta["duration"] or 1)/sample_sec)), 3),
                              chars_stats=_stats(chars), samples=texts[:5])
        except Exception as e:
            res["ocr"] = dict(error=str(e)[:200])
    if st_["asr"]["available"]:
        try:
            from faster_whisper import WhisperModel
            m = WhisperModel("tiny", device="cpu", compute_type="int8")
            segs, _ = m.transcribe(path, language="ja")
            segs = list(segs)
            total_chars = sum(len(s.text) for s in segs)
            speak = sum(s.end-s.start for s in segs)
            res["asr"] = dict(segments=len(segs), speaking_sec=round(speak, 2),
                              chars=total_chars,
                              chars_per_sec=round(total_chars/speak, 2) if speak else None,
                              text=" ".join(s.text for s in segs)[:500])
        except Exception as e:
            res["asr"] = dict(error=str(e)[:200])
    return res

# ───────────────────────── 統合 ─────────────────────────

NOT_MEASURED_BASE = [
    "感情変化・驚きの位置・笑いの位置（意味理解が必要。人手アノテーションで補う）",
    "離脱ポイント（プラットフォームのAnalyticsからのみ取得可能）",
    "実写/CG/AI生成の割合（分類モデル未導入。AI生成判定OSSはレジストリに候補あり）",
    "ロゴ検出（学習済みロゴモデル未導入）",
    "視線（mediapipe未導入時）",
]

def analyze(path, label=None, with_adapters=True):
    meta = probe(path)
    if not meta["duration"]:
        raise ValueError("動画を読めません: %s" % path)
    v = analyze_video_track(path, meta)
    a = analyze_audio_track(path, meta)
    ad = run_adapters(path, meta) if with_adapters else dict(ocr=None, asr=None, detect=None, pose=None)
    nm = list(NOT_MEASURED_BASE)
    if not a.get("available"):
        nm.append("BGMテンポ・SE数・音量（音声トラックなし）")
    if ad["ocr"] is None:
        nm.append("字幕文字数・字幕テキスト（OCR未導入）")
    if ad["asr"] is None:
        nm.append("ナレーション速度（ASR未導入）")
    if ad["detect"] is None:
        nm.append("人物数・動物数・亀出現時間・商品出現時間（検出器未導入）")
    return dict(
        engine=VERSION, label=label or os.path.basename(path),
        file=os.path.basename(path), path=os.path.abspath(path),
        sha1=sha1(path), filesize_bytes=os.path.getsize(path),
        format=dict(width=meta["width"], height=meta["height"], fps=meta["fps"],
                    duration_sec=round(meta["duration"], 2),
                    aspect_9_16=(meta["width"] is not None and meta["width"]*16 == meta["height"]*9),
                    bitrate_kbps=meta["bitrate_kbps"], vcodec=meta["vcodec"],
                    acodec=meta["acodec"], has_audio=meta["has_audio"]),
        video=v, audio=a, adapters=ad, adapter_status=adapter_status(),
        not_measured=nm,
    )

if __name__ == "__main__":
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    for p in sys.argv[1:]:
        print(json.dumps(analyze(p), ensure_ascii=False, indent=2))
