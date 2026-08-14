#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
カメライフガイド TikTok 動画ビルダー
「夏休み、子どもがカメを拾ってきた」1080x1920 / 30fps / 8カット / 24.6秒 / 無音

台本・根拠: docs/marketing/tiktok/red-eared-slider-family-video-script.md
素材:       写真4枚を a.png / b.png / c.png / d.png として作業ディレクトリの src/ に置く
            （red-eared-slider-family-concept.md のプロンプトで生成したもの）
必要環境:   ffmpeg / fonts-noto-cjk

  KAME_TIKTOK_DIR=~/work python3 scripts/tiktok/build-video.py   # 全カット
  ONLY=3,6 python3 scripts/tiktok/build-video.py                 # 4・7カット目だけ作り直す
"""
import os, subprocess

BASE = os.environ.get("KAME_TIKTOK_DIR") or os.path.dirname(os.path.abspath(__file__))
SRC  = os.path.join(BASE, "src")
WORK = os.path.join(BASE, "work")
OUT  = os.path.join(BASE, "out")
TXT  = os.path.join(WORK, "txt")
for d in (WORK, OUT, TXT):
    os.makedirs(d, exist_ok=True)

W, H, FPS = 1080, 1920, 30
FONT_B = "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc"     # 見出し
FONT_R = "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc"  # 補足
SUPER = 2                           # zoompan 用の内部倍率（滑らかさ確保）
SW, SH = W * SUPER, H * SUPER       # 2160 x 3840

# ── カラー ─────────────────────────────────────────────
WHITE  = "white"
YELLOW = "#FFE44D"   # 強調（黒フチ上で 15:1 超）
RED    = "#FF6B6B"   # NG
CREAM  = "#F4EFE2"   # ブランド（parchment）
GOLD   = "#D4A96A"   # ブランド（accent）
FOREST = "#0D1F1A"   # ブランド（forest-deep）
CHIP_R = "#D62839"   # 白文字とのコントラスト 4.97:1（AA）
CHIP_G = "#1F7A4D"   # 白文字とのコントラスト 5.32:1（AA）

# ── シーン定義 ──────────────────────────────────────────
# img   : src ファイル名（拡張子なし）
# dur   : 秒
# base  : 追い込み倍率（1.0 = 全体、大きいほど寄り）
# cx,cy : クロップ中心（0..1）
# z0,z1 : ズーム開始/終了
# chip  : (ラベル文言, 色, y) or None
# lines : [(文字列, サイズ, 色, y)]
# box   : 下部ブランドバー（最終カットのみ）
SCENES = [
    dict(img="a", dur=2.6, base=1.00, cx=0.50, cy=0.50, z0=1.00, z1=1.07,
         chip=None,
         lines=[("夏休み。",         84, WHITE, 300),
                ("子どもがカメを",   84, WHITE, 404),
                ("拾ってきた。",     84, WHITE, 508)]),

    dict(img="a", dur=2.4, base=1.42, cx=0.62, cy=0.34, z0=1.00, z1=1.06,
         chip=None,
         lines=[("「ねぇ、飼っていい？」", 68, YELLOW, 330)]),

    dict(img="b", dur=3.0, base=1.00, cx=0.50, cy=0.50, z0=1.06, z1=1.00,
         chip=None,
         lines=[("でも、その前に。",           78, WHITE,  300),
                ("調べるのは飼い方じゃない。", 56, WHITE,  424),
                ("まず「種類」。",             86, YELLOW, 512)]),

    dict(img="c", dur=3.0, base=1.70, cx=0.856, cy=1.00, z0=1.00, z1=1.07,
         chip=None,
         lines=[("目の後ろに赤い模様＝",       58, WHITE,  300),
                ("ミシシッピアカミミガメ",     66, YELLOW, 384),
                ("（通称：ミドリガメ）",       48, WHITE,  482)]),

    dict(img="c", dur=3.4, base=1.00, cx=0.50, cy=0.50, z0=1.00, z1=1.06,
         chip=("ここが一番大事", CHIP_R, 278),
         lines=[("川や池に返す",         82, WHITE, 412),
                ("→ それ、法律違反です", 64, RED,   524)]),

    dict(img="b", dur=3.4, base=1.22, cx=0.45, cy=0.30, z0=1.00, z1=1.05,
         chip=None,
         lines=[("アカミミガメは",         56, WHITE,  300),
                ("条件付特定外来生物",     78, YELLOW, 380),
                ("一度持ち帰ったら",       56, WHITE,  504),
                ("“逃がす”はもう選べない", 56, WHITE,  580)]),

    # カット7は寄り、カット8は引き。同じ写真Dでも画角を変えないと切れ目が見えなくなる
    dict(img="d", dur=3.6, base=1.20, cx=0.50, cy=0.42, z0=1.00, z1=1.05,
         chip=("じゃあ、どうする？", CHIP_G, 278),
         lines=[("飼うのはOK。許可もいらない", 54, WHITE,  412),
                ("ただし甲長は最大28cm",       56, WHITE,  494),
                ("30年生きることも。",         76, YELLOW, 580)]),

    dict(img="d", dur=3.2, base=1.00, cx=0.50, cy=0.50, z0=1.00, z1=1.03,
         chip=None,
         lines=[("その容器、まだ使える？", 72, WHITE, 300),
                ("甲長で調べられます",     48, WHITE, 402)],
         box=True),
]

# ── ユーティリティ ─────────────────────────────────────
_tc = [0]
def textfile(s):
    """drawtext のエスケープ地獄を避けるため文言はファイル渡し"""
    _tc[0] += 1
    p = os.path.join(TXT, "t%03d.txt" % _tc[0])
    with open(p, "w", encoding="utf-8") as f:
        f.write(s)
    return p

def dt(path, size, color, y, delay, x="(w-text_w)/2", borderw=None, bold=True):
    """中央寄せ drawtext。delay 秒かけてフェードイン（スタガー演出）"""
    if borderw is None:
        borderw = max(5, int(size * 0.10))
    alpha = "clip((t-%.2f)/0.16\\,0\\,1)" % delay
    return (
        "drawtext=fontfile='%s':textfile='%s':fontsize=%d:fontcolor=%s"
        ":borderw=%d:bordercolor=black@0.9"
        ":shadowx=0:shadowy=4:shadowcolor=black@0.45"
        ":x=%s:y=%d:alpha='%s'"
        % (FONT_B if bold else FONT_R, path, size, color, borderw, x, y, alpha)
    )

def make_base(i, sc):
    """カバースケール＋クロップ済みのベース画像を1回だけ作る（毎フレーム拡大を避ける）"""
    b = sc["base"]
    tw, th = int(SW * b), int(SH * b)
    p = os.path.join(WORK, "base%02d.png" % i)
    subprocess.run([
        "ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
        "-i", os.path.join(SRC, sc["img"] + ".png"),
        "-vf", "scale=%d:%d:force_original_aspect_ratio=increase:flags=lanczos,"
               "crop=%d:%d:'(iw-%d)*%.4f':'(ih-%d)*%.4f'"
               % (tw, th, SW, SH, SW, sc["cx"], SH, sc["cy"]),
        "-frames:v", "1", p], check=True)
    return p


def build_scene(i, sc):
    nf = int(round(sc["dur"] * FPS))
    base_png = make_base(i, sc)
    f = []
    # 1) 高解像度ベースのまま zoompan（サブピクセル相当で滑らかに）
    f.append(
        "zoompan=z='%.4f+(%.4f-%.4f)*on/%d':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'"
        ":d=%d:s=%dx%d:fps=%d" % (sc["z0"], sc["z1"], sc["z0"], max(nf - 1, 1), nf, W, H, FPS)
    )
    # 2) 仕上げ（軽いシャープ＋夏らしい色味）
    f.append("unsharp=5:5:0.55:5:5:0.0")
    f.append("eq=saturation=1.08:contrast=1.04")
    f.append("[v]")
    chain = ",".join(f[:-1]) + f[-1]

    parts = ["[0:v]" + chain,
             "[1:v]scale=%d:%d[scrim]" % (W, H),
             "[v][scrim]overlay=0:0[vs]"]
    last = "[vs]"

    ov = []
    # ブランドバー（最終カット）
    if sc.get("box"):
        ov.append("drawbox=x=0:y=1176:w=%d:h=178:color=%s@0.93:t=fill" % (W, FOREST))
        ov.append("drawbox=x=0:y=1176:w=%d:h=5:color=%s@0.95:t=fill" % (W, GOLD))
        ov.append(dt(textfile("「カメライフガイド」で検索"), 56, CREAM, 1216, 0.30))
        ov.append(dt(textfile("kamelifeguide.com"),         38, GOLD,  1292, 0.42, bold=False))

    # ラベルチップ
    if sc.get("chip"):
        label, ccol, cy = sc["chip"]
        cw = int(len(label) * 46 * 1.02) + 72
        ov.append("drawbox=x=%d:y=%d:w=%d:h=76:color=%s@0.95:t=fill"
                  % ((W - cw) // 2, cy, cw, ccol))
        ov.append(dt(textfile(label), 46, WHITE, cy + 12, 0.05, borderw=0))

    # 本文（0.10秒ずつ遅らせて順に出す）
    for k, (s, size, col, y) in enumerate(sc["lines"]):
        ov.append(dt(textfile(s), size, col, y, 0.10 + 0.10 * k))

    # ウォーターマーク（最終カット以外）
    if not sc.get("box"):
        ov.append("drawtext=fontfile='%s':textfile='%s':fontsize=32"
                  ":fontcolor=white@0.72:borderw=4:bordercolor=black@0.55:x=56:y=1320"
                  % (FONT_B, textfile("カメライフガイド")))

    parts.append(last + ",".join(ov) + "[out]")
    fc = ";".join(parts)

    dst = os.path.join(WORK, "s%02d.mp4" % i)
    # ベース画像は「1フレームだけ」渡す。-loop で複数フレーム流すと zoompan が
    # 入力フレームごとに d 枚を作り、on が nf を超えてズーム倍率が発散する。
    cmd = ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
           "-i", base_png,
           "-loop", "1", "-t", "%.3f" % sc["dur"], "-i", os.path.join(WORK, "scrim.png"),
           "-filter_complex", fc, "-map", "[out]", "-frames:v", str(nf),
           # 中間ファイルは高品質・高速（最終段で本エンコード）
           "-c:v", "libx264", "-crf", "14", "-preset", "veryfast",
           "-pix_fmt", "yuv420p", "-r", str(FPS), dst]
    subprocess.run(cmd, check=True)
    return dst


def make_scrim():
    """上部の可読性用グラデーション（最大 55% の黒）を1枚だけ生成"""
    p = os.path.join(WORK, "scrim.png")
    subprocess.run([
        "ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
        "-f", "lavfi", "-i", "color=c=black:s=%dx%d:d=1" % (W, H),
        "-vf", "format=rgba,geq=r=0:g=0:b=0:"
               "a='255*0.55*max(0\\,min(1\\,(820-Y)/820))^1.3'",
        "-frames:v", "1", p], check=True)
    return p


def main():
    # ONLY=... で特定カットだけ作り直す（例: ONLY=6 python3 build.py）
    only = os.environ.get("ONLY")
    only = set(int(x) for x in only.split(",")) if only else None

    make_scrim()
    segs = []
    t = 0.0
    print("=== カット表 ===", flush=True)
    for i, sc in enumerate(SCENES):
        dst = os.path.join(WORK, "s%02d.mp4" % i)
        if only is not None and i not in only and os.path.exists(dst):
            segs.append(dst)
        else:
            segs.append(build_scene(i, sc))
        print("  #%d  %5.2f–%5.2fs  (%.1fs)  %s" % (i + 1, t, t + sc["dur"], sc["dur"], sc["img"]),
              flush=True)
        t += sc["dur"]
    print("  合計 %.1f 秒" % t)

    lst = os.path.join(WORK, "concat.txt")
    with open(lst, "w") as f:
        for s in segs:
            f.write("file '%s'\n" % s)

    final = os.path.join(OUT, "kame-hirotta-tiktok.mp4")
    subprocess.run([
        "ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
        "-f", "concat", "-safe", "0", "-i", lst,
        "-f", "lavfi", "-i", "anullsrc=channel_layout=stereo:sample_rate=48000",
        "-shortest",
        "-c:v", "libx264", "-profile:v", "high", "-level", "4.1", "-crf", "19",
        "-preset", "medium", "-maxrate", "12M", "-bufsize", "24M",
        "-pix_fmt", "yuv420p", "-r", str(FPS),
        "-c:a", "aac", "-b:a", "128k",
        "-movflags", "+faststart", final], check=True)
    print("\n出力: %s" % final)


if __name__ == "__main__":
    main()
