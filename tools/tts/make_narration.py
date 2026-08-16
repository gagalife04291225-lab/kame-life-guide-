#!/usr/bin/env python3
"""
カメライフガイド — 日本語ナレーション合成（Edge TTS / 無料・APIキー不要）

背景:
  自作 TikTok 動画 8本すべてに音声トラックが無い（ffprobe 実測）。
  TikTok は音声ありが事実上の標準のため、ここが実測で確認できた欠落。
  Edge TTS は鍵不要・無料・日本語音声あり。ただし本セッション環境からは
  エンドポイントへ到達できない（HTTP 000 実測）ため、GitHub Actions の
  ランナー上で実行する（画像生成で実証済みの手法）。

方針（推測しない）:
  - 原稿は既存テロップの文言のみ。新しい事実主張は足さない。
  - 合成した音声は**実測**し、割り当て時間(slot)を超えたら話速を上げて
    再合成する。超過が解消しない場合は WARN として必ず記録する（隠さない）。
  - 元の映像トラックは再エンコードせず copy する（品質劣化を避ける）。

使い方:
  python3 tools/tts/make_narration.py tools/tts/narration-01.json
"""
import sys, os, json, glob, shutil, asyncio, subprocess

OUT_DIR = "tiktok/voiced"
TMP_DIR = "/tmp/kame_tts"
MAX_RATE_STEPS = ["+0%", "+10%", "+20%", "+30%", "+40%"]
OVERRUN_TOLERANCE = 0.15          # 秒。これ以下の超過は許容する


def ffprobe_duration(path):
    r = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", path],
        capture_output=True, text=True)
    try:
        return float(r.stdout.strip())
    except ValueError:
        return 0.0


async def synth(text, voice, rate, path):
    import edge_tts
    for attempt in range(1, 4):
        try:
            await edge_tts.Communicate(text, voice, rate=rate).save(path)
            if os.path.exists(path) and os.path.getsize(path) > 512:
                return True
        except Exception as e:
            print(f"      合成エラー(試行{attempt}): {e}")
        await asyncio.sleep(2 * attempt)
    return False


async def build_voice(cfg, vo):
    """1つの声で全セグメントを合成し、実測して必要なら話速を上げる。"""
    vid_id, voice = vo["id"], vo["voice"]
    workdir = os.path.join(TMP_DIR, vid_id)
    os.makedirs(workdir, exist_ok=True)
    clips, warns = [], []

    for i, seg in enumerate(cfg["segments"]):
        slot = float(seg["slot"])
        chosen = None
        for rate in MAX_RATE_STEPS:
            path = os.path.join(workdir, f"seg{i:02d}.mp3")
            if not await synth(seg["text"], voice, rate, path):
                continue
            dur = ffprobe_duration(path)
            chosen = (path, dur, rate)
            if dur <= slot + OVERRUN_TOLERANCE:
                break                       # 収まったので確定
        if not chosen:
            warns.append(f"seg{i:02d} 合成失敗: {seg['text'][:20]}")
            print(f"  FAIL seg{i:02d}")
            continue
        path, dur, rate = chosen
        over = dur - slot
        flag = "OK  " if over <= OVERRUN_TOLERANCE else "WARN"
        if over > OVERRUN_TOLERANCE:
            warns.append(f"seg{i:02d} 超過 {over:+.2f}s (slot {slot}s, rate {rate}): {seg['text'][:24]}")
        print(f"  {flag} seg{i:02d} start={seg['start']:5.1f}s slot={slot:4.1f}s "
              f"実測={dur:4.2f}s rate={rate:5s} {seg['text'][:26]}")
        clips.append({"path": path, "start": float(seg["start"]), "dur": dur})

    return clips, warns


def mux(video, clips, out_path, total):
    """各クリップを開始時刻に配置して1本の音声にまとめ、映像へ多重化する。"""
    if not clips:
        print("  クリップが無いため多重化をスキップ")
        return False
    args = ["ffmpeg", "-y", "-i", video]
    for c in clips:
        args += ["-i", c["path"]]

    parts, labels = [], []
    for n, c in enumerate(clips, start=1):
        ms = int(round(c["start"] * 1000))
        parts.append(f"[{n}:a]aresample=48000,adelay={ms}|{ms}[a{n}]")
        labels.append(f"[a{n}]")
    parts.append(
        "".join(labels) +
        f"amix=inputs={len(clips)}:normalize=0:dropout_transition=0,"
        f"apad,atrim=0:{total},alimiter=limit=0.95[aout]"
    )
    args += ["-filter_complex", ";".join(parts),
             "-map", "0:v", "-map", "[aout]",
             "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
             "-shortest", out_path]

    r = subprocess.run(args, capture_output=True, text=True)
    if r.returncode != 0:
        print("  ffmpeg 失敗:\n" + r.stderr[-1500:])
        return False
    return True


async def main():
    cfg_path = sys.argv[1] if len(sys.argv) > 1 else "tools/tts/narration-01.json"
    cfg = json.load(open(cfg_path, encoding="utf-8"))
    video, total = cfg["video"], float(cfg["total_sec"])

    if not os.path.exists(video):
        print(f"元動画が見つからない: {video}")
        sys.exit(1)
    os.makedirs(OUT_DIR, exist_ok=True)
    os.makedirs(TMP_DIR, exist_ok=True)

    print(f"元動画: {video} ({ffprobe_duration(video):.2f}s) / "
          f"{len(cfg['segments'])}セグメント\n")

    report, made = [], 0
    for vo in cfg["voices"]:
        print(f"=== 声: {vo['voice']} ===")
        clips, warns = await build_voice(cfg, vo)
        base = os.path.splitext(os.path.basename(video))[0]
        out = os.path.join(OUT_DIR, f"{base}-{vo['id']}.mp4")
        ok = mux(video, clips, out, total)
        if ok:
            made += 1
            print(f"  完成: {out} ({ffprobe_duration(out):.2f}s)\n")
        report.append({"voice": vo["voice"], "id": vo["id"], "output": out if ok else None,
                       "segments": len(clips), "warnings": warns})

    # 実測レポートを残す（隠さない）
    with open(os.path.join(OUT_DIR, "narration-report.json"), "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)

    print("=== まとめ ===")
    for r in report:
        print(f"  {r['id']:8s} 出力={'あり' if r['output'] else '★なし'} "
              f"セグメント={r['segments']} 警告={len(r['warnings'])}")
        for w in r["warnings"]:
            print(f"      - {w}")

    sys.exit(0 if made > 0 else 1)


if __name__ == "__main__":
    asyncio.run(main())
