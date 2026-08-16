#!/usr/bin/env python3
"""
KAME LIFE GUIDE / TikTok 30秒動画 v5 — 組版のやり直し

台本（v4: 「かわいい」→ 大きさ 20〜30cm → 甲長ツール）は維持し、
**文字の見え方だけ**を作り直す。指摘は「フォントと文字サイズがWeb屋の仕事」。

原因と対処は tiktok/typography.py に記録した。要点:
  ・この環境に日本語の太字が無く、本文用の細いゴシックを見出しに使っていた
    → サイト本体と同じ Noto Sans JP / Noto Serif JP の Black を導入
  ・角丸の塗り箱に文字を載せていた（UIの作法）
    → 箱を廃止し、白抜き＋濃いアウトライン＋落ち影で写真に直接置く
  ・文字が小さすぎた（50〜90px）
    → 主役は 104〜150px。1行の情報量を減らして大きくする

配色は「白＝地の文 / アンバー＝その回の核」に統一する。
行ごと箱で塗り分けるのをやめ、色で強弱をつける。

出力: tiktok/tiktok-30s-v5.mp4（無音。音声は付けない）
"""
import os, sys, subprocess
from PIL import Image
import imageio_ffmpeg

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import make_photo_ad as m
import make_promo_v2 as v2
import make_promo_v3 as v3
import make_promo_v4 as v4
import typography as T

W, H, FPS = m.W, m.H, m.FPS
OUT = os.path.join(HERE, "tiktok-30s-v5.mp4")
IMAGES = v4.IMAGES

FG, AM = T.FG, T.AMBER

# ── 台本（v4と同一。色とサイズだけ組み直す）────────────────
# color: FG=白（地の文） / AM=アンバー（その回の核）
CUTS = [
    dict(img=0, crop="case",   dur=1.2, bottom=1150, lines=[
        dict(t="かわいい",             size=132, color=FG)]),
    dict(img=0, crop="turtle", dur=1.0, bottom=1150, lines=[
        dict(t="でも この子",          size=112, color=FG)]),
    dict(img=2, crop="face",   dur=1.2, bottom=1470, lines=[
        dict(t="どこまで",             size=104, color=FG),
        dict(t="大きくなる？",         size=104, color=AM)]),
    dict(img=0, crop="wide",   dur=1.5, bottom=1470, lines=[
        dict(t="① 10cm",      size=86, color=FG),
        dict(t="② 15cm",      size=86, color=FG),
        dict(t="③ 20cm以上",  size=86, color=FG)]),
    dict(img=1, crop="phone",  dur=1.5, bottom=1470, lines=[
        dict(t="答えは…",              size=118, color=FG)]),
    # 答え＝この動画の核。最大サイズで置く
    dict(img=2, crop="face",   dur=1.9, bottom=1470, lines=[
        dict(t="20〜30cm",             size=152, color=AM)]),
    dict(img=2, crop="wide",   dur=1.7, bottom=1470, lines=[
        dict(t="お皿くらいに",         size=100, color=FG),
        dict(t="なります",             size=100, color=FG)]),
    dict(img=0, crop="turtle", dur=1.7, bottom=1150, lines=[
        dict(t="手のひらサイズは",     size=84,  color=FG),
        dict(t="今だけ",               size=112, color=AM)]),
    dict(img=0, crop="case",   dur=1.4, bottom=1150, lines=[
        dict(t="この容器だと",         size=104, color=FG)]),
    dict(img=1, crop="wide",   dur=1.8, bottom=1470, lines=[
        dict(t="すぐ狭くなる",         size=118, color=AM)]),
    dict(img=3, crop="girl",   dur=1.5, bottom=1470, lines=[
        dict(t="知ってた？",           size=118, color=AM)]),
    dict(img=3, crop="scr",    dur=1.4, bottom=1470, lines=[
        dict(t="コメントで教えて",     size=88,  color=FG)]),
    dict(img=2, crop="girl",   dur=1.7, bottom=1470, lines=[
        dict(t="かわいいと",           size=96,  color=FG),
        dict(t="思ったなら",           size=96,  color=FG)]),
    dict(img=1, crop="phone",  dur=1.5, bottom=1470, lines=[
        dict(t="甲長を入れるだけで",   size=84,  color=AM)]),
    dict(img=1, crop="wide",   dur=1.5, bottom=1470, lines=[
        dict(t="今 使える？",          size=112, color=FG)]),
    dict(img=0, crop="case",   dur=1.5, bottom=1150, lines=[
        dict(t="そろそろ卒業？",       size=104, color=AM)]),
    dict(img=4, crop="girl",   dur=1.4, bottom=1470, lines=[
        dict(t="が わかります",        size=96,  color=FG)]),
    dict(img=4, crop="face",   dur=1.4, bottom=1470, lines=[
        dict(t="保存して",             size=104, color=AM),
        dict(t="測ってみて",           size=104, color=AM)]),
    # CTA はサイトと同じ明朝で締める（ブランドを揃える）
    dict(img=4, crop="cta",    dur=2.2, bottom=1500, lines=[
        dict(t="カメライフガイド",             size=92, color=FG, face="serif"),
        dict(t="プロフィールから",             size=52, color=AM),
        dict(t="※アカミミガメは新規飼育不可",  size=30, color=FG)]),
    dict(img=0, crop="case",   dur=1.0, bottom=1150, lines=[
        dict(t="かわいい",             size=132, color=FG)]),
]
DUR = sum(c["dur"] for c in CUTS)


def render():
    bases = [m.load_bg(n) for n in IMAGES]
    caps = [T.render_caption(c["lines"]) for c in CUTS]

    bounds, acc = [], 0.0
    for c in CUTS:
        bounds.append((acc, acc + c["dur"])); acc += c["dur"]

    exe = imageio_ffmpeg.get_ffmpeg_exe()
    p = subprocess.Popen([exe, "-y", "-f", "rawvideo", "-vcodec", "rawvideo",
                          "-s", "%dx%d" % (W, H), "-pix_fmt", "rgb24", "-r", str(FPS),
                          "-i", "-", "-an", "-vcodec", "libx264", "-preset", "medium",
                          "-crf", "19", "-pix_fmt", "yuv420p",
                          "-movflags", "+faststart", OUT],
                         stdin=subprocess.PIPE, stdout=subprocess.DEVNULL,
                         stderr=subprocess.PIPE)
    nfr = int(DUR * FPS)
    for fi in range(nfr):
        t = fi / FPS
        idx = len(CUTS) - 1
        for i, (t0, t1) in enumerate(bounds):
            if t0 <= t < t1:
                idx = i; break
        t0, t1 = bounds[idx]
        c = CUTS[idx]
        frame = v2.crop_frame(bases[c["img"]], (c["img"], c["crop"]),
                              (t - t0) / (t1 - t0)).convert("RGBA")
        T.draw_badge(frame)
        T.paste_caption(frame, caps[idx], W // 2, c["bottom"], t - t0)
        p.stdin.write(frame.convert("RGB").tobytes())
        if fi % 180 == 0:
            print("  render %4d/%d" % (fi, nfr))
    p.stdin.close()
    if p.wait() != 0:
        print(p.stderr.read().decode()[-900:]); sys.exit(1)
    print("完成: %s  %.2f MB / %.1f秒（無音）"
          % (OUT, os.path.getsize(OUT) / 1e6, DUR))


if __name__ == "__main__":
    for n in IMAGES:
        assert os.path.exists(os.path.join(m.UPLOAD, n)), "画像がない: %s" % n
    T.selftest()
    print()
    v3.CUTS, v3.NARRATION = CUTS, v4.NARRATION
    v3.gate()
    # 実寸を確認（小さすぎ・はみ出しを数値で見る）
    print("=== テロップ実寸 ===")
    for i, c in enumerate(CUTS):
        cap = T.render_caption(c["lines"])
        flag = "★幅超過" if cap.width > W - 60 else ""
        print("  cut%02d  %4dx%-4d  上端y=%4d  %s %s"
              % (i + 1, cap.width, cap.height, c["bottom"] - cap.height,
                 c["lines"][0]["t"][:14], flag))
    render()
