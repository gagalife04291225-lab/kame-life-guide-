#!/usr/bin/env python3
# KAME LIFE GUIDE / TikTok #1 v2「甲羅、脱げると思ってた？」
# 全フレーム動く モーショングラフィックス版（スライドショー禁止・2秒以上静止禁止に対応）
import subprocess, math, os, sys
from PIL import Image, ImageDraw, ImageFont
import imageio_ffmpeg

W, H, FPS, DUR = 1080, 1920, 30, 29.0
NFR = int(DUR * FPS)
FONT = "/usr/share/fonts/truetype/fonts-japanese-gothic.ttf"
OUT = "/home/user/kame-life-guide-/tiktok/tiktok-01-v2-motion.mp4"

BG     = (0x0d, 0x1f, 0x1a)
FG     = (0xf4, 0xef, 0xe2)
ACCENT = (0xd4, 0xa9, 0x6a)
FOREST = (0x2f, 0x4a, 0x3c)
DARK   = (0x06, 0x10, 0x0d)

SAFE_X0, SAFE_X1 = int(W*0.08), int(W*0.88)
SAFE_Y0, SAFE_Y1 = int(H*0.15), int(H*0.72)
MAXW = SAFE_X1 - SAFE_X0

F = {s: ImageFont.truetype(FONT, s) for s in (34, 40, 48, 56, 64, 76, 92, 104, 150)}
SERIES = "カメの誤解 ｜ #1"

def ease(t):            # easeOutCubic
    return 1 - (1-t)**3
def easeio(t):
    return 3*t*t - 2*t*t*t
def clamp(v, a=0.0, b=1.0):
    return max(a, min(b, v))
def mix(c1, c2, k):
    return tuple(int(c1[i] + (c2[i]-c1[i])*k) for i in range(3))

# ---------- 背景（毎フレーム微妙に動く＝静止画にしない） ----------
def bg_frame(t):
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    for y in range(0, H, 6):
        k = y/H
        g = 0.30*math.sin(math.pi*k + t*0.25)          # ゆっくり呼吸する光
        c = mix(BG, FOREST, max(0.0, g))
        d.rectangle([0, y, W, y+6], fill=c)
    # 斜めのライトスイープ（パターン割り込み用）
    sweep = ((t*0.22) % 1.6) - 0.3
    if 0 <= sweep <= 1.0:
        sx = int(sweep*W*1.9) - 300
        for i in range(0, 220, 6):
            a = (1 - abs(i-110)/110.0) * 0.055
            c = mix(BG, ACCENT, a)
            d.line([(sx+i, 0), (sx+i-420, H)], fill=c, width=6)
    return img

def series_tag(d, t):
    tw = d.textlength(SERIES, font=F[34])
    x = (W-tw)/2
    d.text((x, 232), SERIES, font=F[34], fill=ACCENT)
    wpx = int(tw*clamp(t*1.2))
    d.line([(x-36, 288), (x-36+wpx+72, 288)], fill=ACCENT, width=2)

# ---------- 図形パーツ ----------
def turtle_top(d, cx, cy, s, rot=0.0, col=FG, w=8):
    """上から見たカメ（甲羅＋甲板模様＋頭・四肢・尾）"""
    rw, rh = 300*s, 250*s
    def P(x, y):
        c, sn = math.cos(rot), math.sin(rot)
        return (cx + x*c - y*sn, cy + x*sn + y*c)
    # 四肢
    for ax, ay in ((-0.78, -0.62), (0.78, -0.62), (-0.78, 0.62), (0.78, 0.62)):
        p = P(ax*rw, ay*rh)
        d.ellipse([p[0]-30*s, p[1]-22*s, p[0]+30*s, p[1]+22*s], fill=None, outline=col, width=w)
    # 頭
    hp = P(0, -1.10*rh)
    d.ellipse([hp[0]-38*s, hp[1]-30*s, hp[0]+38*s, hp[1]+30*s], outline=col, width=w)
    # 尾
    tp = P(0, 1.06*rh)
    d.line([tp, P(0, 1.26*rh)], fill=col, width=w)
    # 甲羅
    d.ellipse([cx-rw, cy-rh, cx+rw, cy+rh], outline=col, width=int(w*1.4))
    # 甲板（中央列＋左右）
    for yy in (-0.55, -0.18, 0.19, 0.56):
        d.line([P(-0.20*rw, yy*rh), P(0.20*rw, yy*rh)], fill=col, width=max(2, w//2))
    d.line([P(-0.20*rw, -0.78*rh), P(-0.20*rw, 0.78*rh)], fill=col, width=max(2, w//2))
    d.line([P(0.20*rw, -0.78*rh), P(0.20*rw, 0.78*rh)], fill=col, width=max(2, w//2))
    for yy in (-0.62, -0.24, 0.14, 0.52):
        d.line([P(-0.20*rw, yy*rh), P(-0.86*rw, yy*rh*0.92)], fill=col, width=max(2, w//2))
        d.line([P(0.20*rw, yy*rh), P(0.86*rw, yy*rh*0.92)], fill=col, width=max(2, w//2))

def body_side(d, cx, cy, s, col=FG, w=8):
    """横から見たカメの体（甲羅なし）"""
    d.ellipse([cx-150*s, cy-40*s, cx+150*s, cy+70*s], outline=col, width=w)      # 胴
    d.ellipse([cx+150*s, cy-58*s, cx+238*s, cy+8*s], outline=col, width=w)       # 頭
    for dx in (-92, -20, 62, 118):
        d.line([(cx+dx*s, cy+55*s), (cx+dx*s-14*s, cy+120*s)], fill=col, width=w)

def shell_side(d, cx, cy, s, col=FG, w=10):
    """横から見た甲羅ドーム"""
    rw, rh = 200*s, 120*s
    d.arc([cx-rw, cy-rh, cx+rw, cy+rh], start=180, end=360, fill=col, width=w)
    d.line([(cx-rw+6, cy), (cx+rw-6, cy)], fill=col, width=w)

def skeleton(d, cx, cy, s, prog, col=ACCENT):
    """甲羅の内側: 背骨→肋骨 を prog(0..1) で順に描く"""
    rw, rh = 200*s, 120*s
    sp = clamp(prog/0.30)
    d.line([(cx, cy-rh+10*s), (cx, cy-rh+10*s+72*s*sp)], fill=col, width=int(11*s))
    if sp > 0.9:
        d.ellipse([cx-9*s, cy-rh+2*s, cx+9*s, cy-rh+20*s], fill=col)
    degs = (206, 230, 254, 286, 310, 334)
    for i, deg in enumerate(degs):
        k = clamp((prog-0.28 - i*0.10)/0.16)
        if k <= 0: continue
        a = math.radians(deg)
        ox, oy = cx, cy-rh+66*s
        ex, ey = cx + rw*math.cos(a)*0.95, cy + rh*math.sin(a)*0.95
        d.line([(ox, oy), (ox+(ex-ox)*ease(k), oy+(ey-oy)*ease(k))], fill=col, width=int(6*s))

def cross_mark(d, cx, cy, r, k, col=(0xc8, 0x5a, 0x4a), w=16):
    """✕（誤解の否定）— k で描画進行"""
    k1, k2 = clamp(k*2), clamp(k*2-1)
    if k1 > 0:
        d.line([(cx-r, cy-r), (cx-r+2*r*ease(k1), cy-r+2*r*ease(k1))], fill=col, width=w)
    if k2 > 0:
        d.line([(cx+r, cy-r), (cx+r-2*r*ease(k2), cy-r+2*r*ease(k2))], fill=col, width=w)

def text_c(d, y, txt, size, col=FG, k=1.0, dy=0, stroke=5):
    """中央寄せテキスト（k で出現アニメ）＋幅の数値検証"""
    f = F[size]
    tw = d.textlength(txt, font=f)
    if tw > MAXW:
        print("!! 幅超過:", txt, tw); sys.exit(1)
    if k <= 0: return
    off = (1-ease(clamp(k)))*36
    d.text(((W-tw)/2, y+off+dy), txt, font=f, fill=col, stroke_width=stroke, stroke_fill=DARK)

# ---------- シーン ----------
# (dur, fn)  fn(d, u, t)  u=シーン内0..1, t=全体秒
def s_hook(d, u, t):
    z = 1.0 + 0.32*ease(clamp(u*1.6))                    # 突進ズーム
    turtle_top(d, W//2, 760, 0.62*z, rot=-0.10+0.16*u, col=FG, w=7)
    text_c(d, 1130, "甲羅、脱げると", 104, FG, clamp(u*11))
    text_c(d, 1290, "思ってた？", 104, ACCENT, clamp(u*11-1.6))

def s_wrong(d, u, t):
    flash = 1.0 if u < 0.10 else 0.0                      # パターン割り込み
    if flash:
        d.rectangle([0, 0, W, H], fill=mix(BG, ACCENT, 0.16))
    turtle_top(d, W//2, 780, 0.60*(1+0.05*math.sin(u*9)), rot=0.05, col=FG, w=7)
    text_c(d, 1150, "それ、", 104, FG, clamp(u*11))
    text_c(d, 1310, "間違いです。", 104, ACCENT, clamp(u*11-1.3))

def s_lift(d, u, t):
    """誤解の可視化: 甲羅が持ち上がる → ✕"""
    cy = 820
    body_side(d, W//2-30, cy+40, 1.05, FG, 8)
    lift = ease(clamp(u*1.7))*150
    shell_side(d, W//2, cy-lift, 1.05, FG, 10)
    if u > 0.55:
        cross_mark(d, W//2, cy-60, 210, clamp((u-0.55)/0.32))
    text_c(d, 1230, "甲羅は“服”じゃない", 76, FG, clamp(u*9-0.8))

def s_bone(d, u, t):
    z = 1.0 + 0.10*math.sin(u*3.2)
    shell_side(d, W//2, 800, 1.15*z, FG, 10)
    skeleton(d, W//2, 800, 1.15*z, clamp(u*0.9), ACCENT)
    text_c(d, 1130, "甲羅は", 92, FG, clamp(u*11))
    text_c(d, 1280, "“骨”です", 92, ACCENT, clamp(u*11-1.4))

def s_xray(d, u, t):
    """X線リビール: 背骨→肋骨が順に描かれる（保存価値の核）"""
    s = 1.90
    shell_side(d, W//2, 800, s, FG, 12)
    skeleton(d, W//2, 800, s, clamp(u*1.35), ACCENT)
    scan = 800 - 130*s + (150*s)*clamp(u*1.4)             # スキャンライン
    if u < 0.85:
        d.line([(W//2-210*s, scan), (W//2+210*s, scan)], fill=mix(BG, ACCENT, 0.75), width=4)
    text_c(d, 1240, "背骨と肋骨が", 76, FG, clamp(u*8))
    text_c(d, 1360, "甲羅と一体化", 76, ACCENT, clamp(u*8-1.4))

def s_count(d, u, t):
    """出典の確度に忠実に「およそ50〜60個」のみを提示（中間の数値は出さない）"""
    z = 1.0 + 0.05*math.sin(u*6)
    shell_side(d, W//2, 780, 1.60*z, FG, 11)
    skeleton(d, W//2, 780, 1.60*z, 1.0, ACCENT)
    for i in range(6):                                   # 骨がパルスして「数」を体感させる
        k = clamp((u*2.2) - i*0.10)
        if k > 0 and (u*3 + i*0.4) % 1.0 < 0.5:
            pass
    text_c(d, 1180, "その数", 64, FG, clamp(u*10))
    text_c(d, 1280, "およそ 50〜60個", 92, ACCENT, clamp(u*8-0.5))

def s_conclusion(d, u, t):
    z = 1.0 + 0.22*ease(clamp(u*1.4))
    turtle_top(d, W//2, 780, 0.58*z, rot=0.03*math.sin(u*4), col=FG, w=7)
    text_c(d, 1150, "だから、", 104, FG, clamp(u*11))
    text_c(d, 1310, "脱げません。", 104, ACCENT, clamp(u*11-1.3))

def s_cta(d, u, t):
    z = 1.0 - 0.06*ease(clamp(u))
    turtle_top(d, W//2, 700, 0.42*z, rot=-0.05+0.10*u, col=mix(BG, FG, 0.55), w=6)
    text_c(d, 1010, "あなたに合うカメは？", 76, FG, clamp(u*11))
    text_c(d, 1140, "プロフィールの", 56, FG, clamp(u*9-1.0))
    text_c(d, 1215, "カメライフガイドで診断", 56, ACCENT, clamp(u*11-1.6))
    if u > 0.45:
        k = clamp((u-0.45)*3)
        d.line([(W//2-200, 1330), (W//2-200+400*ease(k), 1330)], fill=ACCENT, width=3)
    text_c(d, 1360, "▶ プロフィールへ", 40, FG, clamp(u*4-1.6), stroke=3)

SCENES = [
 (2.2, s_hook), (1.8, s_wrong), (3.6, s_lift), (3.0, s_bone),
 (5.4, s_xray), (3.8, s_count), (3.6, s_conclusion), (5.6, s_cta),
]
assert abs(sum(s[0] for s in SCENES) - DUR) < 1e-6, "尺不一致 %.2f" % sum(s[0] for s in SCENES)

# ---------- 検証 ----------
def contrast(c1, c2):
    def L(c):
        def f(v):
            v /= 255.0
            return v/12.92 if v <= 0.03928 else ((v+0.055)/1.055)**2.4
        return 0.2126*f(c[0])+0.7152*f(c[1])+0.0722*f(c[2])
    a, b = L(c1), L(c2)
    return (max(a, b)+0.05)/(min(a, b)+0.05)

print("=== 制作前チェック ===")
print("  解像度 %dx%d (9:16=%s) / %dfps / %.1f秒" % (W, H, W*16 == H*9, FPS, DUR))
print("  コントラスト 本文 %.2f:1 / 強調 %.2f:1 (AA 4.5 %s)" %
      (contrast(FG, BG), contrast(ACCENT, BG),
       "合格" if min(contrast(FG, BG), contrast(ACCENT, BG)) >= 4.5 else "不合格"))
longest = max(s[0] for s in SCENES)
print("  シーン数 %d / 最長シーン %.1f秒 (全シーン内で常時モーション)" % (len(SCENES), longest))

# ---------- レンダリング ----------
exe = imageio_ffmpeg.get_ffmpeg_exe()
p = subprocess.Popen([exe, "-y", "-f", "rawvideo", "-vcodec", "rawvideo",
                      "-s", "%dx%d" % (W, H), "-pix_fmt", "rgb24", "-r", str(FPS), "-i", "-",
                      "-an", "-vcodec", "libx264", "-preset", "medium", "-crf", "20",
                      "-pix_fmt", "yuv420p", "-movflags", "+faststart", OUT],
                     stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
bounds = []
acc = 0.0
for dur, fn in SCENES:
    bounds.append((acc, acc+dur, fn)); acc += dur

for i in range(NFR):
    t = i/FPS
    img = bg_frame(t)
    d = ImageDraw.Draw(img)
    series_tag(d, t)
    for t0, t1, fn in bounds:
        if t0 <= t < t1:
            u = (t-t0)/(t1-t0)
            fn(d, u, t)
            # シーン間の短いクロス（黒フラッシュではなく明度で繋ぐ）
            if t - t0 < 0.07:
                k = 1 - (t-t0)/0.07
                img = Image.blend(img, Image.new("RGB", (W, H), DARK), 0.20*k)
            break
    p.stdin.write(img.tobytes())
    if i % 150 == 0:
        print("  render %4d/%d" % (i, NFR))
p.stdin.close()
rc = p.wait()
if rc != 0:
    print(p.stderr.read().decode()[-500:]); sys.exit(1)
print("=== 完成 ===")
print("  %s  %.2f MB" % (OUT, os.path.getsize(OUT)/1e6))
