#!/usr/bin/env python3
# KAME LIFE GUIDE / TikTok #1「カメって甲羅を脱ぐと思ってない？」
# 出力: 1080x1920 / 30fps / 40.0s / H.264 — テロップ完成版アニマティック（無音）
import subprocess, math, os, sys
from PIL import Image, ImageDraw, ImageFont
import imageio_ffmpeg

W, H, FPS, DUR = 1080, 1920, 30, 40.0
NFR = int(W and DUR * FPS)
FONT = "/usr/share/fonts/truetype/fonts-japanese-gothic.ttf"
OUT = "/home/user/kame-life-guide-/tiktok-01-kourahagenai.mp4"

# ---- ブランドカラー (CLAUDE.md 準拠) ----
BG      = (0x0d, 0x1f, 0x1a)   # --forest-deep
FG      = (0xf4, 0xef, 0xe2)   # --parchment
ACCENT  = (0xd4, 0xa9, 0x6a)   # --accent
FOREST  = (0x2f, 0x4a, 0x3c)   # --forest

def lum(c):
    def f(v):
        v /= 255.0
        return v/12.92 if v <= 0.03928 else ((v+0.055)/1.055)**2.4
    return 0.2126*f(c[0]) + 0.7152*f(c[1]) + 0.0722*f(c[2])
def contrast(a, b):
    la, lb = lum(a), lum(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi+0.05)/(lo+0.05)

# ---- セーフエリア（TikTok UI回避・保守的に設定） ----
SAFE_X0, SAFE_X1 = int(W*0.08), int(W*0.88)     # 右側アクションボタンを回避
SAFE_Y0, SAFE_Y1 = int(H*0.15), int(H*0.72)     # 上部UI / 下部キャプションを回避
MAXW = SAFE_X1 - SAFE_X0                         # = 864px

F_HOOK  = ImageFont.truetype(FONT, 100)
F_BODY  = ImageFont.truetype(FONT, 76)
F_CTA   = ImageFont.truetype(FONT, 64)
F_LABEL = ImageFont.truetype(FONT, 34)
F_DIAG  = ImageFont.truetype(FONT, 40)

SERIES = "カメの誤解 ｜ #1"

# ---- シーン定義（テロップは明示改行＝文字切れ防止） ----
# kind: text / diagram / cta
SCENES = [
 dict(t0=0.0,  t1=3.0,  kind="text", font=F_HOOK,
      lines=["カメって", "甲羅を脱ぐと", "思ってない？"], hl=[2]),
 dict(t0=3.0,  t1=6.5,  kind="text", font=F_BODY,
      lines=["甲羅は", "“服”じゃありません"], hl=[1]),
 dict(t0=6.5,  t1=10.0, kind="text", font=F_BODY,
      lines=["カメの体の一部", "——  骨です"], hl=[1]),
 dict(t0=10.0, t1=15.0, kind="diagram", font=F_BODY,
      lines=["背骨と肋骨が変化して", "甲羅とつながっている"], hl=[]),
 dict(t0=15.0, t1=20.0, kind="diagram", font=F_BODY,
      lines=["その数", "およそ 50〜60個"], hl=[1]),
 dict(t0=20.0, t1=25.0, kind="diagram", font=F_BODY,
      lines=["すぐ内側に肺", "中央に心臓と肝臓"], hl=[]),
 dict(t0=25.0, t1=29.0, kind="text", font=F_HOOK,
      lines=["だから", "脱げません"], hl=[1]),
 dict(t0=29.0, t1=33.0, kind="text", font=F_BODY,
      lines=["“脱げる”は", "誤解です"], hl=[1]),
 dict(t0=33.0, t1=40.0, kind="cta", font=F_CTA,
      lines=["カメの飼育で迷ったら", "プロフィールから", "カメライフガイド"], hl=[2]),
]
FADE = 0.35

def bg_base():
    """背景（微グラデーション＋ビネットで高級感）"""
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    for y in range(0, H, 4):
        k = y / H
        c = tuple(int(BG[i] + (FOREST[i]-BG[i]) * (0.34*math.sin(math.pi*k))) for i in range(3))
        d.rectangle([0, y, W, y+4], fill=c)
    # 上下を締めて視線を中央へ
    for y in range(0, 260, 4):
        a = 1 - y/260.0
        c = tuple(int(BG[i]*a + FOREST[i]*(1-a)*0.25) for i in range(3))
        d.rectangle([0, y, W, y+4], fill=BG if a > 0.5 else c)
    return img

BASE = bg_base()

def draw_series(d):
    tw = d.textlength(SERIES, font=F_LABEL)
    x = (W - tw)/2
    d.text((x, 236), SERIES, font=F_LABEL, fill=ACCENT)
    d.line([(x-40, 292), (x+tw+40, 292)], fill=(ACCENT[0], ACCENT[1], ACCENT[2]), width=2)

def _safe_text(d, xy, txt, font, fill):
    """セーフエリア内であることを数値検証してから描画（図解ラベルの見切れ防止）"""
    x, y = xy
    w = d.textlength(txt, font=font)
    if x < SAFE_X0 or x + w > SAFE_X1:
        print("!! セーフエリア違反: %r x=%.0f..%.0f (許容 %d..%d)" % (txt, x, x+w, SAFE_X0, SAFE_X1))
        sys.exit(1)
    d.text((x, y), txt, font=font, fill=fill, stroke_width=3, stroke_fill=(0x06, 0x10, 0x0d))

def draw_diagram(d, cx, cy, scale=1.0):
    """甲羅の断面図: 背骨・肋骨が甲羅と一体化していることを示す"""
    rw, rh = int(330*scale), int(210*scale)
    d.arc([cx-rw, cy-rh, cx+rw, cy+rh], start=180, end=360, fill=FG, width=10)   # 甲羅(背甲)
    d.line([(cx-rw+8, cy), (cx+rw-8, cy)], fill=FG, width=10)                     # 腹甲
    d.line([(cx, cy-rh+14), (cx, cy-rh+100)], fill=ACCENT, width=14)              # 背骨
    d.ellipse([cx-12, cy-rh+2, cx+12, cy-rh+26], fill=ACCENT)
    for deg in (206, 230, 254, 286, 310, 334):                                    # 肋骨(癒合)
        a = math.radians(deg)
        ex, ey = cx + rw*math.cos(a)*0.96, cy + rh*math.sin(a)*0.96
        d.line([(cx, cy-rh+92), (ex, ey)], fill=ACCENT, width=6)
    # ラベル（すべてセーフエリア内・数値検証つき）
    _safe_text(d, (cx-rw-118, cy-rh+52), "甲羅", F_DIAG, FG)
    d.line([(cx-rw-24, cy-rh+82), (cx-rw+40, cy-rh+104)], fill=FG, width=2)
    _safe_text(d, (cx+56, cy-rh-72), "背骨", F_DIAG, ACCENT)
    d.line([(cx+48, cy-rh-30), (cx+14, cy-rh+10)], fill=ACCENT, width=2)
    _safe_text(d, (cx+rw-92, cy+52), "肋骨", F_DIAG, ACCENT)
    d.line([(cx+rw-52, cy+50), (cx+rw-96, cy-46)], fill=ACCENT, width=2)

def render(sc):
    img = BASE.copy()
    d = ImageDraw.Draw(img)
    draw_series(d)
    lines, font, hl = sc["lines"], sc["font"], sc["hl"]
    lh = int(font.size * 1.55)
    if sc["kind"] == "diagram":
        draw_diagram(d, W//2, 900, 1.0)
        y = 1120
    elif sc["kind"] == "cta":
        y = 860
    else:
        y = (SAFE_Y0 + SAFE_Y1)//2 - (len(lines)*lh)//2
    for i, ln in enumerate(lines):
        col = ACCENT if i in hl else FG
        tw = d.textlength(ln, font=font)
        if tw > MAXW:                                   # 文字切れの数値チェック
            print("!! 幅超過: %r %.0fpx > %dpx" % (ln, tw, MAXW)); sys.exit(1)
        x = (W - tw)/2
        d.text((x, y), ln, font=font, fill=col,
               stroke_width=4, stroke_fill=(0x06, 0x10, 0x0d))   # 縁取り＝可読性
        y += lh
    if sc["kind"] == "cta":
        d.line([(W//2-190, 1240), (W//2+190, 1240)], fill=ACCENT, width=3)
        t = "▶ プロフィールのリンクへ"
        tw = d.textlength(t, font=F_LABEL)
        d.text(((W-tw)/2, 1290), t, font=F_LABEL, fill=FG)
    return img

# ---- 事前検証 ----
print("=== 品質チェック（数値） ===")
print("  解像度: %dx%d  比率: 9:16=%s  fps:%d  尺:%.1fs" % (W, H, (W*16 == H*9), FPS, DUR))
print("  コントラスト 本文(#f4efe2/#0d1f1a): %.2f:1  → WCAG AA(4.5) %s" %
      (contrast(FG, BG), "合格" if contrast(FG, BG) >= 4.5 else "不合格"))
print("  コントラスト 強調(#d4a96a/#0d1f1a): %.2f:1  → WCAG AA(4.5) %s" %
      (contrast(ACCENT, BG), "合格" if contrast(ACCENT, BG) >= 4.5 else "不合格"))
print("  セーフエリア: x %d-%d / y %d-%d (右22%%・下28%%を回避)" % (SAFE_X0, SAFE_X1, SAFE_Y0, SAFE_Y1))
cards = [render(s) for s in SCENES]
print("  テロップ幅チェック: 全%dカード 文字切れなし(最大幅%dpx以内)" % (len(cards), MAXW))
assert abs(SCENES[-1]["t1"] - DUR) < 1e-6, "尺不一致"
for a, b in zip(SCENES, SCENES[1:]):
    assert abs(a["t1"] - b["t0"]) < 1e-6, "タイムライン不連続"
print("  タイムライン連続性: OK / 総尺 %.1fs (40秒以内: %s)" % (DUR, DUR <= 40))

# ---- エンコード ----
exe = imageio_ffmpeg.get_ffmpeg_exe()
cmd = [exe, "-y", "-f", "rawvideo", "-vcodec", "rawvideo", "-s", "%dx%d" % (W, H),
       "-pix_fmt", "rgb24", "-r", str(FPS), "-i", "-",
       "-an", "-vcodec", "libx264", "-preset", "medium", "-crf", "20",
       "-pix_fmt", "yuv420p", "-movflags", "+faststart", OUT]
p = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)

def idx_at(t):
    for i, s in enumerate(SCENES):
        if s["t0"] <= t < s["t1"]:
            return i
    return len(SCENES)-1

cache = {}
prev_key = None
for f in range(NFR):
    t = f / FPS
    i = idx_at(t)
    sc = SCENES[i]
    # フェード（各カードの入り/出）
    a = 1.0
    if t - sc["t0"] < FADE:
        a = (t - sc["t0"]) / FADE
    elif sc["t1"] - t < FADE:
        a = (sc["t1"] - t) / FADE
    a = max(0.0, min(1.0, a))
    key = (i, round(a, 2))
    if key != prev_key:
        if key in cache:
            buf = cache[key]
        else:
            im = cards[i] if a >= 0.999 else Image.blend(BASE, cards[i], a)
            buf = im.tobytes()
            if len(cache) < 90:
                cache[key] = buf
        prev_key = key
    p.stdin.write(buf)
p.stdin.close()
rc = p.wait()
err = p.stderr.read().decode()[-400:]
print("\n=== エンコード ===")
print("  return code:", rc)
if rc != 0:
    print(err); sys.exit(1)
print("  出力:", OUT, "%.2f MB" % (os.path.getsize(OUT)/1e6))
