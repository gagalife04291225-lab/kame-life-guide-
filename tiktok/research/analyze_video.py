#!/usr/bin/env python3
"""
KAME LIFE GUIDE / TikTok研究開発部
動画フレーム解析器 v1.0 — 「多い/少ない」を禁止し、すべて数値で出すための測定器。

目的:
  TikTok動画（自作・他者作を問わず）を1ファイル受け取り、
  カット長・画面遷移・ズーム・字幕・色彩・明度を **実測** して JSON と Markdown で出力する。

使い方:
  python3 analyze_video.py <video.mp4> [--label 名前] [--out 出力ディレクトリ]
  複数本まとめる場合:
  python3 analyze_video.py a.mp4 b.mp4 c.mp4 --out research/out

前提:
  numpy / imageio-ffmpeg のみ。OpenCV 不要。
  本スクリプトは **ローカル環境で他者の公開動画を解析する用途** も想定している。
  （このリポジトリの実行環境からは tiktok.com へ到達できないため、
    他者動画の解析はオーナーのローカル環境で実行する必要がある。）

測定できること / できないこと（正直に明記する）:
  [測定可] カット数・カット長(平均/中央値/分散)・画面遷移頻度・動きの量・
           ズーム傾向(中心/周辺の動きエネルギー比)・字幕帯の占有率と位置・
           明度・彩度・コントラスト・支配色・冒頭0.5/1/3秒の挙動
  [測定不可] ナレーション速度・BGMのBPM・SEの位置（音声解析は本バージョン未対応）
           実写/CG/AI生成の割合（判定には別のモデルが必要。目視分類で補う）
           「驚きの位置」「笑いの位置」（意味理解が必要。人手アノテーションで補う）
  → 測定不可の項目に数値を書かない。空欄のままにする。これが本測定器の設計方針。
"""
import subprocess, sys, os, json, math, statistics as st
import numpy as np
import imageio_ffmpeg

# ---- 解析解像度（縦動画を想定して縮小。カット検出には十分） ----
AW, AH = 135, 240

def probe(path):
    exe = imageio_ffmpeg.get_ffmpeg_exe()
    p = subprocess.run([exe, "-i", path], capture_output=True)
    err = p.stderr.decode(errors="ignore")
    dur, w, h, fps = None, None, None, None
    for line in err.splitlines():
        if "Duration:" in line:
            t = line.split("Duration:")[1].split(",")[0].strip()
            hh, mm, ss = t.split(":")
            dur = int(hh) * 3600 + int(mm) * 60 + float(ss)
        if "Video:" in line and "fps" in line:
            for tok in line.split(","):
                tok = tok.strip()
                if "x" in tok and tok.split("x")[0].strip().isdigit():
                    try:
                        a, b = tok.split()[0].split("x")
                        w, h = int(a), int(b)
                    except Exception:
                        pass
                if tok.endswith("fps"):
                    try:
                        fps = float(tok.split()[0])
                    except Exception:
                        pass
    return dur, w, h, fps

def frames(path, fps):
    """rawvideo で全フレームを縮小して読み出す"""
    exe = imageio_ffmpeg.get_ffmpeg_exe()
    cmd = [exe, "-v", "error", "-i", path, "-f", "rawvideo", "-pix_fmt", "rgb24",
           "-s", "%dx%d" % (AW, AH), "-r", str(fps), "-"]
    p = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
    n = AW * AH * 3
    while True:
        buf = p.stdout.read(n)
        if len(buf) < n:
            break
        yield np.frombuffer(buf, dtype=np.uint8).reshape(AH, AW, 3).astype(np.float32)
    p.stdout.close(); p.wait()

def edge_density(gray):
    """縦横の1次差分の強度。テロップ（高コントラストの細かい構造）の指標"""
    gx = np.abs(np.diff(gray, axis=1)).mean()
    gy = np.abs(np.diff(gray, axis=0)).mean()
    return float(gx + gy)

def analyze(path, label=None):
    dur, W, H, fps = probe(path)
    if not dur:
        raise SystemExit("動画を読めません: %s" % path)
    fps = fps or 30.0
    label = label or os.path.basename(path)

    prev = None
    diffs, bright, sat, contr = [], [], [], []
    band_edges = [[], [], [], [], []]   # 画面を縦5分割した各帯のエッジ密度
    center_e, ring_e = [], []
    colors = np.zeros((3,), dtype=np.float64)
    nfr = 0

    cy0, cy1 = int(AH * 0.30), int(AH * 0.70)
    cx0, cx1 = int(AW * 0.25), int(AW * 0.75)

    for f in frames(path, fps):
        nfr += 1
        gray = f.mean(axis=2)
        bright.append(float(gray.mean()))
        contr.append(float(gray.std()))
        mx, mn = f.max(axis=2), f.min(axis=2)
        sat.append(float(((mx - mn) / (mx + 1e-6)).mean()))
        colors += f.reshape(-1, 3).mean(axis=0)
        for i in range(5):
            y0, y1 = int(AH * i / 5), int(AH * (i + 1) / 5)
            band_edges[i].append(edge_density(gray[y0:y1]))
        if prev is not None:
            d = np.abs(gray - prev)
            diffs.append(float(d.mean()))
            c = d[cy0:cy1, cx0:cx1].mean()
            ring = (d.sum() - d[cy0:cy1, cx0:cx1].sum()) / (d.size - (cy1 - cy0) * (cx1 - cx0))
            center_e.append(float(c)); ring_e.append(float(ring))
        prev = gray

    # ---- カット検出（適応閾値: 中央値 + 4×MAD、下限8.0） ----
    arr = np.array(diffs)
    med = float(np.median(arr))
    mad = float(np.median(np.abs(arr - med))) or 1e-6
    thr = max(med + 4.0 * mad, 8.0)
    cut_idx = [i for i, v in enumerate(arr) if v > thr]
    # 連続フレームは1カットにまとめる
    cuts = []
    for i in cut_idx:
        if not cuts or i - cuts[-1] > 2:
            cuts.append(i)
    cut_times = [(i + 1) / fps for i in cuts]

    bounds = [0.0] + cut_times + [dur]
    shots = [round(bounds[i + 1] - bounds[i], 3) for i in range(len(bounds) - 1)]
    shots = [s for s in shots if s > 0.05]

    # ---- 「画面変化」= カットに満たないが有意な変化（テロップ差替え・ズーム等） ----
    chg_thr = max(med + 1.5 * mad, 2.0)
    changes = int((arr > chg_thr).sum())

    # ---- 静止判定: 変化が閾値未満のフレームが連続する最長区間 ----
    still_thr = max(med * 0.5, 0.5)
    longest_still, run = 0, 0
    for v in arr:
        run = run + 1 if v < still_thr else 0
        longest_still = max(longest_still, run)
    longest_still_sec = longest_still / fps

    # ---- ズーム傾向: 周辺/中心の動きエネルギー比 ----
    ce, re_ = np.array(center_e), np.array(ring_e)
    zoom_ratio = float((re_ / (ce + 1e-6)).mean())

    # ---- 字幕帯: エッジ密度が全体平均を上回る帯 = 文字が置かれている位置 ----
    be = [float(np.mean(b)) for b in band_edges]
    be_total = sum(be) or 1.0
    band_share = [round(100.0 * x / be_total, 1) for x in be]

    def window(t0, t1):
        a, b = int(t0 * fps), int(min(t1 * fps, len(arr)))
        seg = arr[a:b]
        return dict(
            frames=int(b - a),
            mean_change=round(float(seg.mean()), 2) if len(seg) else None,
            max_change=round(float(seg.max()), 2) if len(seg) else None,
            cuts=int(sum(1 for t in cut_times if t0 <= t < t1)),
            significant_changes=int((seg > chg_thr).sum()) if len(seg) else 0,
        )

    mean_rgb = (colors / max(nfr, 1)).round(1).tolist()
    res = dict(
        label=label, file=os.path.basename(path),
        duration_sec=round(dur, 2), width=W, height=H, fps=fps,
        aspect_9_16=(W is not None and H is not None and W * 16 == H * 9),
        frames_analyzed=nfr,
        cuts=dict(
            count=len(cut_times),
            per_10sec=round(len(cut_times) / (dur / 10.0), 2),
            times=[round(t, 2) for t in cut_times],
        ),
        shot_length=dict(
            n=len(shots),
            mean=round(st.mean(shots), 3) if shots else None,
            median=round(st.median(shots), 3) if shots else None,
            variance=round(st.pvariance(shots), 3) if len(shots) > 1 else 0.0,
            stdev=round(st.pstdev(shots), 3) if len(shots) > 1 else 0.0,
            min=min(shots) if shots else None,
            max=max(shots) if shots else None,
            over_2sec_ratio_pct=round(100.0 * sum(1 for s in shots if s > 2.0) / len(shots), 1) if shots else None,
        ),
        screen_change=dict(
            significant_change_frames=changes,
            per_sec=round(changes / dur, 2),
            longest_static_run_sec=round(longest_still_sec, 2),
        ),
        motion=dict(
            mean_frame_diff=round(float(arr.mean()), 2),
            median_frame_diff=round(med, 2),
            zoom_ring_center_ratio=round(zoom_ratio, 3),
            zoom_interpretation=("周辺優位（ズーム/スケール変化あり）" if zoom_ratio > 1.15
                                 else "中心優位（被写体内の動き主体）" if zoom_ratio < 0.85
                                 else "均衡（全画面フェード/静的）"),
        ),
        caption_bands=dict(
            share_pct_top_to_bottom=band_share,
            dominant_band=int(int(np.argmax(be)) + 1),
            note="画面を縦5分割し、エッジ密度の分布から文字・図の存在位置を推定。1=最上部, 5=最下部",
        ),
        color=dict(
            mean_rgb=mean_rgb,
            mean_hex="#%02x%02x%02x" % tuple(int(c) for c in mean_rgb),
            mean_brightness_0_255=round(float(np.mean(bright)), 1),
            mean_contrast_stdev=round(float(np.mean(contr)), 1),
            mean_saturation_0_1=round(float(np.mean(sat)), 3),
        ),
        opening=dict(
            first_0_5s=window(0.0, 0.5),
            first_1s=window(0.0, 1.0),
            first_3s=window(0.0, 3.0),
        ),
        not_measured=[
            "ナレーション速度（音声解析 未対応）",
            "BGMテンポ/BPM（音声解析 未対応）",
            "SE使用箇所・効果音（音声解析 未対応）",
            "実写/CG/AI生成の割合（分類モデル未導入。目視分類で補完すること）",
            "驚き・笑いの位置、感情変化（意味理解が必要。人手アノテーション必須）",
            "離脱ポイント（TikTok Analytics の保持率グラフからのみ取得可能）",
        ],
    )
    return res

def to_markdown(rs):
    L = ["# 動画フレーム解析レポート（実測）", "",
         "> 測定器: `tiktok/research/analyze_video.py` v1.0 / 解析解像度 %dx%d / 全フレーム走査" % (AW, AH), "",
         "| 指標 | " + " | ".join(r["label"] for r in rs) + " |",
         "|------|" + "|".join(["------"] * len(rs)) + "|"]
    def row(name, fn):
        L.append("| %s | %s |" % (name, " | ".join(str(fn(r)) for r in rs)))
    row("尺(秒)", lambda r: r["duration_sec"])
    row("解像度", lambda r: "%sx%s" % (r["width"], r["height"]))
    row("9:16", lambda r: "○" if r["aspect_9_16"] else "×")
    row("カット数", lambda r: r["cuts"]["count"])
    row("カット/10秒", lambda r: r["cuts"]["per_10sec"])
    row("カット長 平均(秒)", lambda r: r["shot_length"]["mean"])
    row("カット長 中央値(秒)", lambda r: r["shot_length"]["median"])
    row("カット長 分散", lambda r: r["shot_length"]["variance"])
    row("カット長 標準偏差", lambda r: r["shot_length"]["stdev"])
    row("2秒超カットの割合(%)", lambda r: r["shot_length"]["over_2sec_ratio_pct"])
    row("有意な画面変化/秒", lambda r: r["screen_change"]["per_sec"])
    row("最長静止(秒)", lambda r: r["screen_change"]["longest_static_run_sec"])
    row("平均フレーム差分", lambda r: r["motion"]["mean_frame_diff"])
    row("ズーム比(周辺/中心)", lambda r: r["motion"]["zoom_ring_center_ratio"])
    row("文字・図の主帯(1-5)", lambda r: r["caption_bands"]["dominant_band"])
    row("平均輝度(0-255)", lambda r: r["color"]["mean_brightness_0_255"])
    row("平均コントラスト", lambda r: r["color"]["mean_contrast_stdev"])
    row("平均彩度(0-1)", lambda r: r["color"]["mean_saturation_0_1"])
    row("0.5秒: 変化量", lambda r: r["opening"]["first_0_5s"]["mean_change"])
    row("1秒: 有意変化数", lambda r: r["opening"]["first_1s"]["significant_changes"])
    row("3秒: カット数", lambda r: r["opening"]["first_3s"]["cuts"])
    L += ["", "## 本測定器で測定していない項目（数値を書かない）", ""]
    L += ["- " + x for x in rs[0]["not_measured"]]
    return "\n".join(L) + "\n"

if __name__ == "__main__":
    args = [a for a in sys.argv[1:]]
    out = "."
    if "--out" in args:
        i = args.index("--out"); out = args[i + 1]; del args[i:i + 2]
    labels = {}
    if "--label" in args:
        i = args.index("--label"); lb = args[i + 1]; del args[i:i + 2]
        labels[args[0]] = lb
    if not args:
        raise SystemExit(__doc__)
    os.makedirs(out, exist_ok=True)
    rs = []
    for p in args:
        print("解析中: %s" % p)
        rs.append(analyze(p, labels.get(p)))
    json.dump(rs, open(os.path.join(out, "measurements.json"), "w"), ensure_ascii=False, indent=2)
    open(os.path.join(out, "measurements.md"), "w").write(to_markdown(rs))
    print(to_markdown(rs))
    print("出力: %s/measurements.json, measurements.md" % out)
