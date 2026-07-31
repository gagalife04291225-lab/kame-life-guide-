#!/usr/bin/env python3
"""
KAME LIFE GUIDE / TikTok シリーズ「カメの誤解」 #2〜#5

EXECUTION PHASE 1 の Task-3 で制作。
**make_video3.py（承認済み構成）の描画関数・検証ロジック・尺配分をそのまま流用する。**
新しい演出・新しいアルゴリズム・新しいしきい値は追加しない。

  - DS v1.0 の数値要件は make_video3.py と同一（制作前チェックも同一）
  - 24シーンの尺配分は #1 v3 と完全に同じ（DS適合が実測で確認済みのため）
  - 描画は既存の語彙のみ（ellipse / arc / line / rounded_rectangle）

使い方: python3 tiktok/make_series.py 2   → #2 を制作
        python3 tiktok/make_series.py all → #2〜#5 を制作
"""
import subprocess, math, os, sys, statistics as st
from PIL import Image, ImageDraw, ImageFont
import imageio_ffmpeg

W, H, FPS = 1080, 1920, 30
FONT = "/usr/share/fonts/truetype/fonts-japanese-gothic.ttf"
OUTDIR = os.path.dirname(os.path.abspath(__file__))

BG     = (0x0d, 0x1f, 0x1a)
FG     = (0xf4, 0xef, 0xe2)
ACCENT = (0xd4, 0xa9, 0x6a)
FOREST = (0x2f, 0x4a, 0x3c)
DARK   = (0x06, 0x10, 0x0d)
WARN   = (0xe0, 0x70, 0x5c)
AQUA   = (0x8f, 0xc0, 0xd8)
BONE   = (0xd8, 0xd0, 0xb8)

SAFE_X0, SAFE_X1 = int(W*0.08), int(W*0.88)
SAFE_Y0, SAFE_Y1 = int(H*0.15), int(H*0.72)
MAXW = SAFE_X1 - SAFE_X0

F = {s: ImageFont.truetype(FONT, s) for s in (34, 40, 48, 56, 64, 76, 92, 104)}

def ease(t):  return 1 - (1-t)**3
def clamp(v, a=0.0, b=1.0): return max(a, min(b, v))
def mix(c1, c2, k): return tuple(int(c1[i] + (c2[i]-c1[i])*k) for i in range(3))

# ───────── 背景・タグ（make_video3.py と同一） ─────────
def bg_frame(t):
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    for y in range(0, H, 6):
        k = y/H
        g = 0.36*math.sin(math.pi*k + t*2.4)
        d.rectangle([0, y, W, y+6], fill=mix(BG, FOREST, max(0.0, g)))
    sweep = ((t/4.5) % 1.0)
    sx = int(sweep*W*2.2) - 420
    for i in range(0, 200, 6):
        a = (1 - abs(i-100)/100.0) * 0.026
        d.line([(sx+i, 0), (sx+i-460, H)], fill=mix(BG, ACCENT, a), width=6)
    return img

def series_tag(d, label):
    tw = d.textlength(label, font=F[34])
    x = (W-tw)/2
    d.text((x, 232), label, font=F[34], fill=ACCENT)
    d.line([(x-36, 288), (x-36+tw+72, 288)], fill=ACCENT, width=2)

# ───────── 描画パーツ（make_video3.py から流用） ─────────
def turtle_top(d, cx, cy, s, rot=0.0, col=FG, w=8):
    rw, rh = 300*s, 250*s
    def P(x, y):
        c, sn = math.cos(rot), math.sin(rot)
        return (cx + x*c - y*sn, cy + x*sn + y*c)
    for ax, ay in ((-0.78, -0.62), (0.78, -0.62), (-0.78, 0.62), (0.78, 0.62)):
        p = P(ax*rw, ay*rh)
        d.ellipse([p[0]-30*s, p[1]-22*s, p[0]+30*s, p[1]+22*s], outline=col, width=w)
    hp = P(0, -1.10*rh)
    d.ellipse([hp[0]-38*s, hp[1]-30*s, hp[0]+38*s, hp[1]+30*s], outline=col, width=w)
    d.line([P(0, 1.06*rh), P(0, 1.26*rh)], fill=col, width=w)
    d.ellipse([cx-rw, cy-rh, cx+rw, cy+rh], outline=col, width=int(w*1.4))
    for yy in (-0.55, -0.18, 0.19, 0.56):
        d.line([P(-0.20*rw, yy*rh), P(0.20*rw, yy*rh)], fill=col, width=max(2, w//2))
    d.line([P(-0.20*rw, -0.78*rh), P(-0.20*rw, 0.78*rh)], fill=col, width=max(2, w//2))
    d.line([P(0.20*rw, -0.78*rh), P(0.20*rw, 0.78*rh)], fill=col, width=max(2, w//2))
    for yy in (-0.62, -0.24, 0.14, 0.52):
        d.line([P(-0.20*rw, yy*rh), P(-0.86*rw, yy*rh*0.92)], fill=col, width=max(2, w//2))
        d.line([P(0.20*rw, yy*rh), P(0.86*rw, yy*rh*0.92)], fill=col, width=max(2, w//2))

def body_side(d, cx, cy, s, col=FG, w=8):
    d.ellipse([cx-150*s, cy-40*s, cx+150*s, cy+70*s], outline=col, width=w)
    d.line([(cx+140*s, cy-18*s), (cx+178*s, cy-30*s)], fill=col, width=w)
    d.ellipse([cx+170*s, cy-56*s, cx+250*s, cy+6*s], outline=col, width=w)
    d.ellipse([cx+228*s, cy-40*s, cx+238*s, cy-30*s], fill=col)
    d.line([(cx-150*s, cy+20*s), (cx-196*s, cy+34*s)], fill=col, width=w)
    for dx in (-96, -24, 58, 114):
        d.line([(cx+dx*s, cy+55*s), (cx+dx*s-16*s, cy+126*s)], fill=col, width=w)
        d.line([(cx+dx*s-16*s, cy+126*s), (cx+dx*s-4*s, cy+134*s)], fill=col, width=w)

def shell_side(d, cx, cy, s, col=FG, w=10):
    rw, rh = 200*s, 120*s
    d.arc([cx-rw, cy-rh, cx+rw, cy+rh], start=180, end=360, fill=col, width=w)
    d.line([(cx-rw+6, cy), (cx+rw-6, cy)], fill=col, width=w)

def shell_bumpy(d, cx, cy, s, k, col=FG, w=10):
    """甲羅の凸凹（ピラミッディング）。土台のドーム＋その上に盛り上がった甲板を arc で描く。
    目視QCで『段差が滑らかに見えて凸凹と読めない』欠陥が出たため、独立した山に変更した。"""
    rw, rh = 200*s, 120*s
    kk = ease(clamp(k))
    d.line([(cx-rw+6, cy), (cx+rw-6, cy)], fill=col, width=w)
    d.arc([cx-rw, cy-rh, cx+rw, cy+rh], start=180, end=360, fill=col, width=w)
    n = 4
    for i in range(n):
        fx = -0.66 + i*(1.32/(n-1))          # -0.66 .. 0.66
        bx = cx + rw*fx
        base = cy - (rh*0.96)*math.sqrt(max(0.0, 1 - fx*fx))
        bw = 46*s
        bh = (52*s) * kk * (1 - abs(fx)*0.35)
        if bh <= 2: continue
        d.arc([bx-bw, base-bh, bx+bw, base+bh], start=180, end=360, fill=col, width=w)

def spine(d, cx, cy, s, k, col=ACCENT):
    rh = 120*s
    d.line([(cx, cy-rh+10*s), (cx, cy-rh+10*s+72*s*ease(clamp(k)))], fill=col, width=int(11*s))
    if k > 0.9:
        d.ellipse([cx-9*s, cy-rh+2*s, cx+9*s, cy-rh+20*s], fill=col)

def ribs(d, cx, cy, s, prog, col=ACCENT):
    rw, rh = 200*s, 120*s
    for i, deg in enumerate((206, 230, 254, 286, 310, 334)):
        k = clamp((prog - i*0.13)/0.20)
        if k <= 0: continue
        a = math.radians(deg)
        ox, oy = cx, cy-rh+66*s
        ex, ey = cx + rw*math.cos(a)*0.95, cy + rh*math.sin(a)*0.95
        d.line([(ox, oy), (ox+(ex-ox)*ease(k), oy+(ey-oy)*ease(k))], fill=col, width=int(6*s))

def water_dish(d, cx, cy, s, level, col=FG, wcol=AQUA, w=9):
    """水入れ（arc + 水面の線）。既存語彙のみ"""
    rw, rh = 230*s, 90*s
    d.arc([cx-rw, cy-rh, cx+rw, cy+rh], start=0, end=180, fill=col, width=w)
    d.line([(cx-rw, cy), (cx+rw, cy)], fill=col, width=w)
    k = clamp(level)
    if k > 0:
        wy = cy + rh*0.62*(1-k)
        d.line([(cx-rw*0.92, wy), (cx+rw*0.92, wy)], fill=wcol, width=int(7*s))
        for i in range(3):
            xx = cx - rw*0.5 + i*rw*0.5
            d.arc([xx-26*s, wy-14*s, xx+26*s, wy+14*s], start=200, end=340, fill=wcol, width=3)

def droplets(d, cx, cy, s, t, col=AQUA, n=6):
    for i in range(n):
        ph = ((t*0.55) + i/float(n)) % 1.0
        x = cx - 210*s + i*(84*s)
        y = cy - 210*s + 300*s*ph
        r = 9*s
        d.ellipse([x-r, y-r, x+r, y+r*1.5], outline=col, width=3)

def sun_rays(d, cx, cy, s, t, col=ACCENT, n=7, blocked_y=None):
    for i in range(n):
        x = cx - 260*s + i*(86*s)
        y0 = cy - 300*s
        y1 = blocked_y if blocked_y is not None else cy + 120*s
        off = 12*s*math.sin(t*3 + i)
        d.line([(x+off, y0), (x+off, y1)], fill=col, width=int(5*s))
        if blocked_y is not None:
            d.line([(x+off-14*s, y1-16*s), (x+off+14*s, y1-16*s)], fill=col, width=int(4*s))

def glass_pane(d, cx, cy, s, col=AQUA, w=6):
    hw, hh = 300*s, 20*s
    d.rounded_rectangle([cx-hw, cy-hh, cx+hw, cy+hh], radius=int(10*s), outline=col, width=w)
    for i in range(4):
        x = cx - hw*0.7 + i*(hw*0.47)
        d.line([(x, cy-hh), (x+26*s, cy+hh)], fill=mix(BG, col, 0.5), width=3)

def organ(d, cx, cy, r, k, col):
    rr = r*ease(clamp(k))
    if rr > 0:
        d.ellipse([cx-rr, cy-rr, cx+rr, cy+rr], outline=col, width=6)

def cross_mark(d, cx, cy, r, k, col=WARN, w=16):
    k1, k2 = clamp(k*2), clamp(k*2-1)
    if k1 > 0:
        d.line([(cx-r, cy-r), (cx-r+2*r*ease(k1), cy-r+2*r*ease(k1))], fill=col, width=w)
    if k2 > 0:
        d.line([(cx+r, cy-r), (cx+r-2*r*ease(k2), cy-r+2*r*ease(k2))], fill=col, width=w)

def check_mark(d, cx, cy, r, k, col=ACCENT, w=14):
    k1, k2 = clamp(k*2), clamp(k*2-1)
    if k1 > 0:
        d.line([(cx-r, cy), (cx-r+r*0.7*ease(k1), cy+r*0.7*ease(k1))], fill=col, width=w)
    if k2 > 0:
        d.line([(cx-r*0.3, cy+r*0.7), (cx-r*0.3+r*1.3*ease(k2), cy+r*0.7-r*1.5*ease(k2))],
               fill=col, width=w)

def scan_loop(d, cx, cy, s, u, speed=2.0, alpha=0.55):
    rw, rh = 200*s, 120*s
    ph = (u*speed) % 1.0
    ph = ph*2 if ph < 0.5 else (1-ph)*2
    y = cy - rh + (rh*1.1)*ph
    d.line([(cx-rw*1.02, y), (cx+rw*1.02, y)], fill=mix(BG, ACCENT, alpha), width=4)

def pulse_ring(d, cx, cy, u, r0=150, r1=330, n=2, col=None):
    col = col or ACCENT
    for i in range(n):
        k = (u*1.6 + i/float(n)) % 1.0
        r = r0 + (r1-r0)*k
        c = mix(BG, col, 0.42*(1-k))
        d.ellipse([cx-r, cy-r*0.78, cx+r, cy+r*0.78], outline=c, width=3)

def text_c(d, y, txt, size, col=FG, k=1.0, stroke=5):
    """make_video3.py と同一。幅・セーフエリアを数値検証し、違反したらビルドを止める。"""
    f = F[size]
    tw = d.textlength(txt, font=f)
    if tw > MAXW:
        print("!! 幅超過: %r %.0fpx > %dpx" % (txt, tw, MAXW)); sys.exit(1)
    x = (W-tw)/2
    if x < SAFE_X0 or x+tw > SAFE_X1:
        print("!! セーフエリア違反: %r" % txt); sys.exit(1)
    if not (SAFE_Y0 <= y <= SAFE_Y1 - size):
        print("!! 縦セーフエリア違反: %r y=%d" % (txt, y)); sys.exit(1)
    if k <= 0: return
    off = (1-ease(clamp(k)))*36
    d.text((x, y+off), txt, font=f, fill=col, stroke_width=stroke, stroke_fill=DARK)

def lines_(d, u, spec):
    """spec: [(y, text, size, color, speed_offset)]"""
    for y, txt, size, col, sp in spec:
        text_c(d, y, txt, size, col, clamp(u*12 - sp))

def summary_card(d, u, title, rows, sub_turtle=True):
    k = ease(clamp(u*1.6))
    x0, x1 = SAFE_X0+10, SAFE_X1-10
    y0, y1 = 690, 690+int(430*k)
    d.rounded_rectangle([x0, y0, x1, y1], radius=28, outline=ACCENT, width=3,
                        fill=mix(BG, DARK, 0.5))
    if k > 0.5:
        text_c(d, 730, title, 48, ACCENT, clamp(u*3-0.6), stroke=3)
        for i, r in enumerate(rows):
            text_c(d, 830+i*90, r, 56, FG, clamp(u*3-0.9-i*0.2), stroke=4)
    if sub_turtle:
        turtle_top(d, W//2, 1300, (0.30+0.10*u), rot=-0.25+0.55*u, col=mix(BG, FG, 0.6), w=5)
        pulse_ring(d, W//2, 1300, u, r0=130, r1=250, n=2, col=FG)

# ───────── 尺配分（#1 v3 と完全に同一。DS適合が実測済みのため変更しない） ─────────
DURS = [1.0, 0.9, 1.4, 1.8, 1.2, 1.6, 1.8, 1.8, 2.0, 1.6, 1.8, 1.8,
        1.8, 1.6, 1.8, 1.6, 1.8, 1.8, 1.8, 1.4, 2.4, 1.8, 2.2, 2.7]
DUR = sum(DURS)          # = 41.4

# ═══════════════════ #2 水 ═══════════════════
def ep2():
    def s01(d, u, t):
        turtle_top(d, W//2, 740, 0.56*(1.0+0.52*u), rot=-0.26+0.52*u, w=8)
        text_c(d, 1115, "カメは水なしで", 104, FG, clamp(u*22))
    def s02(d, u, t):
        turtle_top(d, W//2, 720, 1.00*(1.0+0.30*u), rot=0.12+0.34*u, w=10)
        text_c(d, 1115, "カメは水なしで", 104, FG, 1.0)
        text_c(d, 1272, "平気だと思ってた？", 76, ACCENT, clamp(u*16))
    def s03(d, u, t):
        if u < 0.12: d.rectangle([0, 0, W, H], fill=mix(BG, ACCENT, 0.16))
        turtle_top(d, W//2, 770, 0.58*(1.0+0.20*u), rot=0.20-0.34*u, w=7)
        lines_(d, u, [(1115, "それ、", 104, FG, 0), (1272, "危険です。", 104, WARN, 1.4)])
    def s04(d, u, t):
        turtle_top(d, W//2, 700, 0.46*(1.0+0.20*u), rot=-0.10+0.28*u, col=mix(BG, FG, 0.6), w=7)
        water_dish(d, W//2, 1000, 1.0*(1.0+0.10*u), 0.0)
        scan_loop(d, W//2, 940, 1.4, u, speed=1.8, alpha=0.35)
        text_c(d, 1210, "水入れが空", 92, FG, clamp(u*11))
    def s05(d, u, t):
        turtle_top(d, W//2, 700, 0.50, rot=0.06, col=mix(BG, FG, 0.45), w=7)
        water_dish(d, W//2, 1000, 1.0, 0.0, col=mix(BG, FG, 0.45))
        cross_mark(d, W//2, 860, 210*(1+0.04*math.sin(u*9)), clamp(u*1.9))
        text_c(d, 1210, "これはNG", 92, WARN, clamp(u*12))
    def s06(d, u, t):
        water_dish(d, W//2, 900, 1.10*(1.0+0.14*u), clamp(u*2.0))
        lines_(d, u, [(1170, "陸のカメも", 92, FG, 0), (1290, "水を飲みます", 92, ACCENT, 1.4)])
    def s07(d, u, t):
        turtle_top(d, W//2, 760, 0.42*(1.0+0.22*u), rot=-0.12+0.30*u, col=FG, w=7)
        water_dish(d, W//2, 980, 1.0*(1.0+0.12*u), 1.0)
        droplets(d, W//2, 900, 1.0, t)
        scan_loop(d, W//2, 930, 1.4, u, speed=1.9, alpha=0.35)
        text_c(d, 1250, "しかも", 76, FG, clamp(u*10))
    def s08(d, u, t):
        turtle_top(d, W//2, 760, 0.46*(1.0+0.10*u), rot=0.05, col=FG, w=7)
        water_dish(d, W//2, 980, 1.05, 1.0)
        for i in range(4):
            k = clamp(u*2.2 - i*0.18)
            if k > 0:
                x = W//2 - 150 + i*100
                d.line([(x, 980), (x, 980-90*ease(k))], fill=AQUA, width=5)
                d.line([(x, 980-90*ease(k)), (x-11, 980-68*ease(k))], fill=AQUA, width=5)
                d.line([(x, 980-90*ease(k)), (x+11, 980-68*ease(k))], fill=AQUA, width=5)
        text_c(d, 1250, "皮膚からも吸収", 76, AQUA, clamp(u*10))
    def s09(d, u, t):
        water_dish(d, W//2, 940, 1.20, 1.0)
        turtle_top(d, W//2, 900, 0.42, rot=0.10*u, col=FG, w=6)
        scan_loop(d, W//2, 940, 1.2, u, speed=1.7, alpha=0.4)
        lines_(d, u, [(1200, "浸かって", 76, FG, 0), (1300, "体に取り込む", 76, ACCENT, 1.2)])
    def s10(d, u, t):
        water_dish(d, W//2, 940, 1.08*(1.0+0.22*u), 1.0)
        check_mark(d, W//2, 880, 120, clamp(u*1.8))
        pulse_ring(d, W//2, 900, u, r0=170, r1=320, n=2, col=AQUA)
        text_c(d, 1240, "だから水入れは必須", 64, FG, clamp(u*10))
    def s11(d, u, t):
        if u < 0.12: d.rectangle([0, 0, W, H], fill=mix(BG, WARN, 0.14))
        turtle_top(d, W//2, 760, 0.54*(1.0+0.26*u), rot=-0.14+0.38*u, w=7)
        lines_(d, u, [(1170, "じゃあ、", 92, FG, 0), (1290, "足りないと？", 92, WARN, 1.3)])
    def s12(d, u, t):
        s = 1.55
        shell_side(d, W//2, 820, s, mix(BG, FG, 0.55), 11)
        body_side(d, W//2-30, 880, 0.9, mix(BG, FG, 0.4), 6)
        organ(d, W//2-90, 850, 46, clamp(u*1.8), WARN)
        organ(d, W//2+90, 850, 46, clamp(u*1.6), WARN)
        scan_loop(d, W//2, 820, s, u, speed=1.6, alpha=0.4)
        text_c(d, 1250, "腎臓に負担", 92, FG, clamp(u*11))
    def s13(d, u, t):
        s = 1.55
        shell_side(d, W//2, 820, s, mix(BG, FG, 0.4), 11)
        organ(d, W//2-90, 850, 46, 1.0, WARN)
        organ(d, W//2+90, 850, 46, 1.0, WARN)
        scan_loop(d, W//2, 820, s, u, speed=1.8, alpha=0.35)
        lines_(d, u, [(1200, "慢性的な脱水は", 76, FG, 0), (1300, "腎不全の主因", 76, WARN, 1.2)])
    def s14(d, u, t):
        s = 1.50
        shell_side(d, W//2, 800, s, mix(BG, FG, 0.4), 10)
        organ(d, W//2-90, 830, 46, 1.0, WARN); organ(d, W//2+90, 830, 46, 1.0, WARN)
        cross_mark(d, W//2, 810, 200*(1+0.03*math.sin(u*10)), clamp(u*2.0))
        text_c(d, 1210, "飼育下で多い", 76, WARN, clamp(u*11))
    def s15(d, u, t):
        turtle_top(d, W//2, 730, 0.48, rot=0.05, col=FG, w=7)
        water_dish(d, W//2, 1000, 1.05*(1.0+0.12*u), 1.0)
        droplets(d, W//2, 940, 1.0, t)
        text_c(d, 1250, "水を切らさない", 76, ACCENT, clamp(u*11))
    def s16b(d, u, t):
        water_dish(d, W//2, 900, 1.22*(1.0+0.10*u), 1.0)
        check_mark(d, W//2, 850, 130, clamp(u*2.0))
        text_c(d, 1210, "毎日入れ替える", 76, FG, clamp(u*11))
    def s17(d, u, t):
        turtle_top(d, W//2, 770, 0.56*(1.0+0.30*u), rot=-0.16+0.34*u, w=7)
        lines_(d, u, [(1115, "だから、", 104, FG, 0), (1272, "水は必須。", 104, ACCENT, 1.3)])
    def s18(d, u, t):
        water_dish(d, W//2, 900, 1.20*(1.0+0.12*u), 1.0)
        text_c(d, 1210, "ただし、", 92, FG, clamp(u*12))
    def s19(d, u, t):
        water_dish(d, W//2, 890, 1.22, 1.0)
        turtle_top(d, W//2, 890, 0.36, rot=0.2*u, col=mix(BG, FG, 0.5), w=5)
        cross_mark(d, W//2, 890, 150, clamp(u*1.6))
        lines_(d, u, [(1180, "深すぎる水は", 76, FG, 0), (1300, "溺れます", 76, WARN, 1.2)])
    def s20(d, u, t):
        turtle_top(d, W//2, 760, 0.48*(1.0+0.24*u), rot=-0.22+0.46*u, col=mix(BG, FG, 0.85), w=7)
        pulse_ring(d, W//2, 760, u, r0=190, r1=340, n=2, col=FG)
        lines_(d, u, [(1160, "知ってた？", 92, ACCENT, 0), (1290, "コメントで教えて", 56, FG, 1.2)])
    def s21(d, u, t):
        summary_card(d, u, "まとめ", ["陸のカメも水が必要", "皮膚からも吸収する", "深すぎる水は危険"])
    def s22(d, u, t):
        turtle_top(d, W//2, 800, (0.40+0.14*u), rot=-0.30+0.62*u, col=mix(BG, FG, 0.7), w=6)
        pulse_ring(d, W//2, 800, u, r0=200, r1=380, n=2, col=ACCENT)
        lines_(d, u, [(1180, "保存して", 92, ACCENT, 0), (1300, "飼う前に見返して", 76, FG, 1.3)])
    def s23(d, u, t):
        turtle_top(d, W//2, 730, (0.38+0.14*u), rot=-0.32+0.66*u, col=mix(BG, FG, 0.55), w=6)
        pulse_ring(d, W//2, 730, u, r0=180, r1=360, n=2, col=ACCENT)
        lines_(d, u, [(1130, "あなたに合うカメは？", 76, FG, 0), (1260, "プロフィールの診断へ", 56, ACCENT, 1.4)])
    def s24(d, u, t):
        turtle_top(d, W//2, int(780-40*u), (0.40+0.16*u), rot=0.20-0.46*u, col=mix(BG, FG, 0.62), w=7)
        pulse_ring(d, W//2, int(780-40*u), u, r0=190, r1=400, n=3, col=ACCENT)
        text_c(d, 1180, "プロフィールへ", 92, FG, clamp(u*12))
        d.line([(W//2-210, 1320), (W//2-210+420*min(1.0, u*1.15), 1320)], fill=ACCENT, width=4)
        if u > 0.35:
            text_c(d, 1340, "カメライフガイド", 40, ACCENT, clamp((u-0.35)*4), stroke=3)
    return [s01, s02, s03, s04, s05, s06, s07, s08, s09, s10, s11, s12,
            s13, s14, s15, s16b, s17, s18, s19, s20, s21, s22, s23, s24]

# ═══════════════════ #3 甲羅の凸凹 ═══════════════════
def ep3():
    def s01(d, u, t):
        turtle_top(d, W//2, 740, 0.56*(1.0+0.52*u), rot=-0.26+0.52*u, w=8)
        text_c(d, 1115, "甲羅の凸凹は", 104, FG, clamp(u*22))
    def s02(d, u, t):
        turtle_top(d, W//2, 720, 1.00*(1.0+0.30*u), rot=0.12+0.34*u, w=10)
        text_c(d, 1115, "甲羅の凸凹は", 104, FG, 1.0)
        text_c(d, 1272, "成長の証だと？", 92, ACCENT, clamp(u*16))
    def s03(d, u, t):
        if u < 0.12: d.rectangle([0, 0, W, H], fill=mix(BG, ACCENT, 0.16))
        turtle_top(d, W//2, 770, 0.58*(1.0+0.20*u), rot=0.20-0.34*u, w=7)
        lines_(d, u, [(1115, "それ、", 104, FG, 0), (1272, "逆です。", 104, WARN, 1.4)])
    def s04(d, u, t):
        shell_side(d, W//2, 820, 1.35*(1.0+0.16*u), FG, 11)
        text_c(d, 1210, "本来はなめらか", 76, FG, clamp(u*11))
    def s05(d, u, t):
        shell_bumpy(d, W//2, 820, 1.35, clamp(u*2.2), FG, 11)
        text_c(d, 1210, "これが凸凹", 92, WARN, clamp(u*12))
    def s06(d, u, t):
        shell_bumpy(d, W//2, 820, 1.40*(1.0+0.10*u), 1.0, FG, 11)
        lines_(d, u, [(1170, "これは", 92, FG, 0), (1290, "育て方の跡", 92, WARN, 1.4)])
    def s07(d, u, t):
        shell_bumpy(d, W//2, 810, 1.55, 1.0, mix(BG, FG, 0.6), 11)
        scan_loop(d, W//2, 810, 1.55, u, speed=2.2, alpha=0.7)
        text_c(d, 1250, "原因のひとつが", 76, FG, clamp(u*10))
    def s08(d, u, t):
        shell_bumpy(d, W//2, 810, 1.55, 1.0, mix(BG, FG, 0.5), 11)
        droplets(d, W//2, 800, 1.3, t)
        text_c(d, 1250, "乾燥した環境", 76, AQUA, clamp(u*10))
    def s09(d, u, t):
        shell_side(d, W//2-230, 830, 0.85, FG, 8)
        shell_bumpy(d, W//2+230, 830, 0.85, 1.0, WARN, 8)
        droplets(d, W//2-230, 800, 0.9, t)
        lines_(d, u, [(1200, "湿度あり／なし", 76, FG, 0), (1300, "結果が分かれた", 76, ACCENT, 1.2)])
    def s10(d, u, t):
        shell_side(d, W//2-230, 830, 0.85, FG, 8)
        shell_bumpy(d, W//2+230, 830, 0.85, 1.0, WARN, 8)
        check_mark(d, W//2-230, 950, 70, clamp(u*1.8), ACCENT)
        cross_mark(d, W//2+230, 950, 70, clamp(u*1.8))
        text_c(d, 1240, "実験で確認された", 64, FG, clamp(u*10))
    def s11(d, u, t):
        if u < 0.12: d.rectangle([0, 0, W, H], fill=mix(BG, WARN, 0.14))
        turtle_top(d, W//2, 760, 0.54*(1.0+0.26*u), rot=-0.14+0.38*u, w=7)
        lines_(d, u, [(1170, "じゃあ、", 92, FG, 0), (1290, "戻せるの？", 92, WARN, 1.3)])
    def s12(d, u, t):
        shell_bumpy(d, W//2, 820, 1.50, 1.0, mix(BG, FG, 0.6), 11)
        spine(d, W//2, 820, 1.50, clamp(u*2.0))
        text_c(d, 1250, "甲羅は骨です", 92, FG, clamp(u*11))
    def s13(d, u, t):
        shell_bumpy(d, W//2, 820, 1.50, 1.0, mix(BG, FG, 0.5), 11)
        spine(d, W//2, 820, 1.50, 1.0); ribs(d, W//2, 820, 1.50, clamp(u*1.2))
        scan_loop(d, W//2, 820, 1.5, u, speed=1.7, alpha=0.4)
        text_c(d, 1250, "一度できた形は", 76, FG, clamp(u*10))
    def s14(d, u, t):
        shell_bumpy(d, W//2, 810, 1.45, 1.0, mix(BG, FG, 0.4), 10)
        cross_mark(d, W//2, 800, 200*(1+0.03*math.sin(u*10)), clamp(u*2.0))
        text_c(d, 1210, "元には戻らない", 76, WARN, clamp(u*11))
    def s15(d, u, t):
        shell_side(d, W//2, 820, 1.35*(1.0+0.12*u), FG, 10)
        droplets(d, W//2, 800, 1.1, t)
        text_c(d, 1250, "だから予防が全て", 64, ACCENT, clamp(u*11))
    def s16(d, u, t):
        shell_side(d, W//2, 810, 1.40*(1.0+0.10*u), FG, 10)
        check_mark(d, W//2, 950, 110, clamp(u*2.0))
        text_c(d, 1210, "湿度を保つ", 92, FG, clamp(u*11))
    def s17(d, u, t):
        turtle_top(d, W//2, 770, 0.56*(1.0+0.30*u), rot=-0.16+0.34*u, w=7)
        lines_(d, u, [(1115, "凸凹は、", 104, FG, 0), (1272, "成長の証じゃない", 76, ACCENT, 1.3)])
    def s18(d, u, t):
        shell_bumpy(d, W//2, 820, 1.30*(1.0+0.12*u), 1.0, FG, 10)
        text_c(d, 1210, "ただし、", 92, FG, clamp(u*12))
    def s19(d, u, t):
        shell_bumpy(d, W//2, 810, 1.30, 1.0, mix(BG, FG, 0.7), 10)
        scan_loop(d, W//2, 810, 1.3, u, speed=1.6, alpha=0.4)
        lines_(d, u, [(1180, "原因は湿度だけと", 76, FG, 0), (1300, "断定はできない", 76, ACCENT, 1.2)])
    def s20(d, u, t):
        turtle_top(d, W//2, 760, 0.48*(1.0+0.24*u), rot=-0.22+0.46*u, col=mix(BG, FG, 0.85), w=7)
        pulse_ring(d, W//2, 760, u, r0=190, r1=340, n=2, col=FG)
        lines_(d, u, [(1160, "知ってた？", 92, ACCENT, 0), (1290, "コメントで教えて", 56, FG, 1.2)])
    def s21(d, u, t):
        summary_card(d, u, "まとめ", ["凸凹は成長の証ではない", "乾燥した環境が関与", "一度できたら戻らない"])
    def s22(d, u, t):
        turtle_top(d, W//2, 800, (0.40+0.14*u), rot=-0.30+0.62*u, col=mix(BG, FG, 0.7), w=6)
        pulse_ring(d, W//2, 800, u, r0=200, r1=380, n=2, col=ACCENT)
        lines_(d, u, [(1180, "保存して", 92, ACCENT, 0), (1300, "飼う前に見返して", 76, FG, 1.3)])
    def s23(d, u, t):
        turtle_top(d, W//2, 730, (0.38+0.14*u), rot=-0.32+0.66*u, col=mix(BG, FG, 0.55), w=6)
        pulse_ring(d, W//2, 730, u, r0=180, r1=360, n=2, col=ACCENT)
        lines_(d, u, [(1130, "あなたに合うカメは？", 76, FG, 0), (1260, "プロフィールの診断へ", 56, ACCENT, 1.4)])
    def s24(d, u, t):
        turtle_top(d, W//2, int(780-40*u), (0.40+0.16*u), rot=0.20-0.46*u, col=mix(BG, FG, 0.62), w=7)
        pulse_ring(d, W//2, int(780-40*u), u, r0=190, r1=400, n=3, col=ACCENT)
        text_c(d, 1180, "プロフィールへ", 92, FG, clamp(u*12))
        d.line([(W//2-210, 1320), (W//2-210+420*min(1.0, u*1.15), 1320)], fill=ACCENT, width=4)
        if u > 0.35:
            text_c(d, 1340, "カメライフガイド", 40, ACCENT, clamp((u-0.35)*4), stroke=3)
    return [s01, s02, s03, s04, s05, s06, s07, s08, s09, s10, s11, s12,
            s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24]

# ═══════════════════ #4 窓辺の日光浴 ═══════════════════
def ep4():
    def s01(d, u, t):
        turtle_top(d, W//2, 740, 0.56*(1.0+0.52*u), rot=-0.26+0.52*u, w=8)
        text_c(d, 1115, "窓辺の日光浴で", 104, FG, clamp(u*22))
    def s02(d, u, t):
        turtle_top(d, W//2, 720, 1.00*(1.0+0.30*u), rot=0.12+0.34*u, w=10)
        text_c(d, 1115, "窓辺の日光浴で", 104, FG, 1.0)
        text_c(d, 1272, "足りると思ってた？", 76, ACCENT, clamp(u*16))
    def s03(d, u, t):
        if u < 0.12: d.rectangle([0, 0, W, H], fill=mix(BG, ACCENT, 0.16))
        turtle_top(d, W//2, 770, 0.58*(1.0+0.20*u), rot=0.20-0.34*u, w=7)
        lines_(d, u, [(1115, "それ、", 104, FG, 0), (1272, "届いていません。", 76, WARN, 1.4)])
    def s04(d, u, t):
        sun_rays(d, W//2, 820, 1.0, t)
        turtle_top(d, W//2, 1000, 0.36, rot=0.05, col=FG, w=6)
        text_c(d, 1240, "日光は届いても", 76, FG, clamp(u*11))
    def s05(d, u, t):
        sun_rays(d, W//2, 800, 1.0, t, blocked_y=920)
        glass_pane(d, W//2, 940, 1.0)
        text_c(d, 1240, "ガラスがある", 92, AQUA, clamp(u*12))
    def s06(d, u, t):
        sun_rays(d, W//2, 800, 1.0, t, blocked_y=920)
        glass_pane(d, W//2, 940, 1.0)
        turtle_top(d, W//2, 1080, 0.32, rot=0.05, col=mix(BG, FG, 0.6), w=5)
        lines_(d, u, [(1210, "UVBは", 92, FG, 0), (1300, "ほぼ通らない", 76, WARN, 1.4)])
    def s07(d, u, t):
        sun_rays(d, W//2, 790, 1.0, t, blocked_y=910)
        glass_pane(d, W//2, 930, 1.0)
        cross_mark(d, W//2, 930, 150, clamp(u*1.8))
        text_c(d, 1250, "ここで止まる", 76, WARN, clamp(u*10))
    def s08(d, u, t):
        turtle_top(d, W//2, 800, 0.46*(1.0+0.10*u), rot=0.05, col=FG, w=7)
        scan_loop(d, W//2, 800, 1.5, u, speed=1.8, alpha=0.45)
        text_c(d, 1250, "UVBがないと", 76, FG, clamp(u*10))
    def s09(d, u, t):
        shell_side(d, W//2, 820, 1.55, FG, 11)
        spine(d, W//2, 820, 1.55, clamp(u*2.0))
        scan_loop(d, W//2, 820, 1.55, u, speed=1.6, alpha=0.4)
        lines_(d, u, [(1200, "ビタミンD3が", 76, FG, 0), (1300, "作れない", 76, ACCENT, 1.2)])
    def s10(d, u, t):
        shell_side(d, W//2, 810, 1.55, FG, 11)
        spine(d, W//2, 810, 1.55, 1.0); ribs(d, W//2, 810, 1.55, clamp(u*1.2))
        text_c(d, 1250, "カルシウムが吸えない", 56, FG, clamp(u*10))
    def s11(d, u, t):
        if u < 0.12: d.rectangle([0, 0, W, H], fill=mix(BG, WARN, 0.14))
        turtle_top(d, W//2, 760, 0.54*(1.0+0.26*u), rot=-0.14+0.38*u, w=7)
        lines_(d, u, [(1170, "じゃあ、", 92, FG, 0), (1290, "どうなる？", 92, WARN, 1.3)])
    def s12(d, u, t):
        shell_side(d, W//2, 820, 1.50, mix(BG, FG, 0.55), 11)
        spine(d, W//2, 820, 1.50, 1.0); ribs(d, W//2, 820, 1.50, 1.0)
        scan_loop(d, W//2, 820, 1.5, u, speed=1.7, alpha=0.4)
        text_c(d, 1250, "骨がもろくなる", 92, WARN, clamp(u*11))
    def s13(d, u, t):
        shell_bumpy(d, W//2, 820, 1.45, clamp(u*1.8), mix(BG, FG, 0.5), 10)
        spine(d, W//2, 820, 1.45, 1.0)
        lines_(d, u, [(1200, "甲羅も変形する", 76, FG, 0), (1300, "代謝性骨疾患", 76, WARN, 1.2)])
    def s14(d, u, t):
        shell_bumpy(d, W//2, 810, 1.40, 1.0, mix(BG, FG, 0.4), 10)
        cross_mark(d, W//2, 800, 200*(1+0.03*math.sin(u*10)), clamp(u*2.0))
        text_c(d, 1210, "進むと戻せない", 76, WARN, clamp(u*11))
    def s15(d, u, t):
        sun_rays(d, W//2, 800, 1.0, t)
        turtle_top(d, W//2, 1000, 0.40*(1.0+0.10*u), rot=0.08, col=FG, w=6)
        text_c(d, 1250, "屋外の直射日光か", 64, ACCENT, clamp(u*11))
    def s16(d, u, t):
        turtle_top(d, W//2, 860, 0.44, rot=0.06, col=FG, w=6)
        sun_rays(d, W//2, 720, 0.8, t, col=ACCENT, n=5)
        check_mark(d, W//2, 1010, 110, clamp(u*2.0))
        text_c(d, 1210, "UVBライトを使う", 76, FG, clamp(u*11))
    def s17(d, u, t):
        turtle_top(d, W//2, 770, 0.56*(1.0+0.30*u), rot=-0.16+0.34*u, w=7)
        lines_(d, u, [(1115, "だから、", 104, FG, 0), (1272, "窓越しは不可。", 76, ACCENT, 1.3)])
    def s18(d, u, t):
        glass_pane(d, W//2, 880, 1.10*(1.0+0.10*u))
        text_c(d, 1210, "ただし、", 92, FG, clamp(u*12))
    def s19(d, u, t):
        glass_pane(d, W//2, 870, 1.10)
        sun_rays(d, W//2, 760, 0.9, t, col=mix(BG, ACCENT, 0.7), n=5)
        lines_(d, u, [(1180, "UVAは通ります", 76, FG, 0), (1300, "UVBだけが別", 76, ACCENT, 1.2)])
    def s20(d, u, t):
        turtle_top(d, W//2, 760, 0.48*(1.0+0.24*u), rot=-0.22+0.46*u, col=mix(BG, FG, 0.85), w=7)
        pulse_ring(d, W//2, 760, u, r0=190, r1=340, n=2, col=FG)
        lines_(d, u, [(1160, "知ってた？", 92, ACCENT, 0), (1290, "コメントで教えて", 56, FG, 1.2)])
    def s21(d, u, t):
        summary_card(d, u, "まとめ", ["普通のガラスはUVBを通さない", "D3が作れず骨がもろくなる", "UVBライトか屋外の直射日光"])
    def s22(d, u, t):
        turtle_top(d, W//2, 800, (0.40+0.14*u), rot=-0.30+0.62*u, col=mix(BG, FG, 0.7), w=6)
        pulse_ring(d, W//2, 800, u, r0=200, r1=380, n=2, col=ACCENT)
        lines_(d, u, [(1180, "保存して", 92, ACCENT, 0), (1300, "飼う前に見返して", 76, FG, 1.3)])
    def s23(d, u, t):
        turtle_top(d, W//2, 730, (0.38+0.14*u), rot=-0.32+0.66*u, col=mix(BG, FG, 0.55), w=6)
        pulse_ring(d, W//2, 730, u, r0=180, r1=360, n=2, col=ACCENT)
        lines_(d, u, [(1130, "あなたに合うカメは？", 76, FG, 0), (1260, "プロフィールの診断へ", 56, ACCENT, 1.4)])
    def s24(d, u, t):
        turtle_top(d, W//2, int(780-40*u), (0.40+0.16*u), rot=0.20-0.46*u, col=mix(BG, FG, 0.62), w=7)
        pulse_ring(d, W//2, int(780-40*u), u, r0=190, r1=400, n=3, col=ACCENT)
        text_c(d, 1180, "プロフィールへ", 92, FG, clamp(u*12))
        d.line([(W//2-210, 1320), (W//2-210+420*min(1.0, u*1.15), 1320)], fill=ACCENT, width=4)
        if u > 0.35:
            text_c(d, 1340, "カメライフガイド", 40, ACCENT, clamp((u-0.35)*4), stroke=3)
    return [s01, s02, s03, s04, s05, s06, s07, s08, s09, s10, s11, s12,
            s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24]

# ═══════════════════ #5 長生きだから丈夫？ ═══════════════════
def ep5():
    def s01(d, u, t):
        turtle_top(d, W//2, 740, 0.56*(1.0+0.52*u), rot=-0.26+0.52*u, w=8)
        text_c(d, 1115, "長生きだから", 104, FG, clamp(u*22))
    def s02(d, u, t):
        turtle_top(d, W//2, 720, 1.00*(1.0+0.30*u), rot=0.12+0.34*u, w=10)
        text_c(d, 1115, "長生きだから", 104, FG, 1.0)
        text_c(d, 1272, "丈夫だと思ってた？", 76, ACCENT, clamp(u*16))
    def s03(d, u, t):
        if u < 0.12: d.rectangle([0, 0, W, H], fill=mix(BG, ACCENT, 0.16))
        turtle_top(d, W//2, 770, 0.58*(1.0+0.20*u), rot=0.20-0.34*u, w=7)
        lines_(d, u, [(1115, "それ、", 104, FG, 0), (1272, "逆に危険です。", 76, WARN, 1.4)])
    def s04(d, u, t):
        turtle_top(d, W//2, 820, 0.46*(1.0+0.26*u), rot=-0.14+0.32*u, col=FG, w=7)
        pulse_ring(d, W//2, 820, u, r0=185, r1=345, n=2, col=FG)
        text_c(d, 1240, "カメは食べられる側", 56, FG, clamp(u*11))
    def s05(d, u, t):
        turtle_top(d, W//2, 820, 0.52, rot=0.06, col=mix(BG, FG, 0.55), w=7)
        cross_mark(d, W//2, 820, 200*(1+0.04*math.sin(u*9)), clamp(u*1.9))
        text_c(d, 1210, "弱ると狙われる", 76, WARN, clamp(u*12))
    def s06(d, u, t):
        turtle_top(d, W//2, 800, 0.50*(1.0+0.14*u), rot=0.05, col=FG, w=7)
        lines_(d, u, [(1170, "だから", 92, FG, 0), (1290, "不調を隠します", 76, ACCENT, 1.4)])
    def s07(d, u, t):
        turtle_top(d, W//2, 800, 0.48, rot=0.05, col=FG, w=7)
        scan_loop(d, W//2, 800, 1.5, u, speed=2.2, alpha=0.7)
        text_c(d, 1250, "見た目は元気", 76, FG, clamp(u*10))
    def s08(d, u, t):
        turtle_top(d, W//2, 790, 0.48, rot=0.05, col=mix(BG, FG, 0.7), w=7)
        for i in range(3):
            k = clamp(u*1.8 - i*0.25)
            if k > 0:
                organ(d, W//2-150+i*150, 800, 40, k, WARN)
        text_c(d, 1250, "でも内側では", 76, WARN, clamp(u*10))
    def s09(d, u, t):
        shell_side(d, W//2, 820, 1.55, mix(BG, FG, 0.6), 11)
        for i in range(3):
            organ(d, W//2-150+i*150, 830, 40, 1.0, WARN)
        scan_loop(d, W//2, 820, 1.55, u, speed=1.6, alpha=0.4)
        lines_(d, u, [(1200, "症状が出た時には", 76, FG, 0), (1300, "かなり進んでいる", 76, WARN, 1.2)])
    def s10(d, u, t):
        shell_side(d, W//2, 810, 1.50, mix(BG, FG, 0.5), 11)
        for i in range(3):
            organ(d, W//2-150+i*150, 820, 40, 1.0, WARN)
        cross_mark(d, W//2, 810, 190*(1+0.03*math.sin(u*10)), clamp(u*1.8))
        text_c(d, 1240, "手遅れになりやすい", 64, WARN, clamp(u*10))
    def s11(d, u, t):
        if u < 0.12: d.rectangle([0, 0, W, H], fill=mix(BG, WARN, 0.14))
        turtle_top(d, W//2, 760, 0.54*(1.0+0.26*u), rot=-0.14+0.38*u, w=7)
        lines_(d, u, [(1170, "じゃあ、", 92, FG, 0), (1290, "何を見る？", 92, WARN, 1.3)])
    def s12(d, u, t):
        turtle_top(d, W//2, 800, 0.42*(1.0+0.22*u), rot=-0.12+0.30*u, col=FG, w=7)
        check_mark(d, W//2-230, 960, 70, clamp(u*1.8), ACCENT)
        pulse_ring(d, W//2, 800, u, r0=175, r1=330, n=2, col=FG)
        text_c(d, 1250, "食欲", 92, FG, clamp(u*11))
    def s13(d, u, t):
        turtle_top(d, W//2, 800, 0.42*(1.0+0.20*u), rot=-0.10+0.28*u, col=FG, w=7)
        check_mark(d, W//2-230, 960, 70, 1.0, ACCENT)
        check_mark(d, W//2, 960, 70, clamp(u*1.8), ACCENT)
        pulse_ring(d, W//2, 800, u, r0=175, r1=330, n=2, col=FG)
        text_c(d, 1250, "体重", 92, FG, clamp(u*11))
    def s14(d, u, t):
        turtle_top(d, W//2, 800, 0.46, rot=0.05+0.06*u, col=FG, w=7)
        for x in (W//2-230, W//2):
            check_mark(d, x, 960, 70, 1.0, ACCENT)
        check_mark(d, W//2+230, 960, 70, clamp(u*1.8), ACCENT)
        text_c(d, 1250, "動きの量", 92, FG, clamp(u*11))
    def s15(d, u, t):
        turtle_top(d, W//2, 790, 0.48*(1.0+0.10*u), rot=0.06, col=FG, w=7)
        pulse_ring(d, W//2, 790, u, r0=180, r1=330, n=2, col=ACCENT)
        text_c(d, 1240, "この3つを毎日見る", 64, ACCENT, clamp(u*11))
    def s16(d, u, t):
        turtle_top(d, W//2, 800, 0.46, rot=0.06, col=FG, w=7)
        scan_loop(d, W//2, 800, 1.5, u, speed=1.7, alpha=0.4)
        text_c(d, 1240, "変化に早く気づく", 64, FG, clamp(u*11))
    def s17(d, u, t):
        turtle_top(d, W//2, 770, 0.56*(1.0+0.30*u), rot=-0.16+0.34*u, w=7)
        lines_(d, u, [(1115, "長生き＝", 104, FG, 0), (1272, "丈夫ではない", 92, ACCENT, 1.3)])
    def s18(d, u, t):
        turtle_top(d, W//2, 800, 0.46*(1.0+0.12*u), rot=0.06, col=FG, w=7)
        text_c(d, 1210, "ただし、", 92, FG, clamp(u*12))
    def s19(d, u, t):
        turtle_top(d, W//2, 790, 0.46, rot=0.06+0.08*u, col=mix(BG, FG, 0.8), w=7)
        scan_loop(d, W//2, 790, 1.4, u, speed=1.6, alpha=0.4)
        lines_(d, u, [(1180, "見た目で判断せず", 76, FG, 0), (1300, "獣医に相談を", 76, ACCENT, 1.2)])
    def s20(d, u, t):
        turtle_top(d, W//2, 760, 0.48*(1.0+0.24*u), rot=-0.22+0.46*u, col=mix(BG, FG, 0.85), w=7)
        pulse_ring(d, W//2, 760, u, r0=190, r1=340, n=2, col=FG)
        lines_(d, u, [(1160, "知ってた？", 92, ACCENT, 0), (1290, "コメントで教えて", 56, FG, 1.2)])
    def s21(d, u, t):
        summary_card(d, u, "まとめ", ["カメは不調を隠す", "症状が出た時は進行済み", "食欲・体重・動きを毎日見る"])
    def s22(d, u, t):
        turtle_top(d, W//2, 800, (0.40+0.14*u), rot=-0.30+0.62*u, col=mix(BG, FG, 0.7), w=6)
        pulse_ring(d, W//2, 800, u, r0=200, r1=380, n=2, col=ACCENT)
        lines_(d, u, [(1180, "保存して", 92, ACCENT, 0), (1300, "飼う前に見返して", 76, FG, 1.3)])
    def s23(d, u, t):
        turtle_top(d, W//2, 730, (0.38+0.14*u), rot=-0.32+0.66*u, col=mix(BG, FG, 0.55), w=6)
        pulse_ring(d, W//2, 730, u, r0=180, r1=360, n=2, col=ACCENT)
        lines_(d, u, [(1130, "あなたに合うカメは？", 76, FG, 0), (1260, "プロフィールの診断へ", 56, ACCENT, 1.4)])
    def s24(d, u, t):
        turtle_top(d, W//2, int(780-40*u), (0.40+0.16*u), rot=0.20-0.46*u, col=mix(BG, FG, 0.62), w=7)
        pulse_ring(d, W//2, int(780-40*u), u, r0=190, r1=400, n=3, col=ACCENT)
        text_c(d, 1180, "プロフィールへ", 92, FG, clamp(u*12))
        d.line([(W//2-210, 1320), (W//2-210+420*min(1.0, u*1.15), 1320)], fill=ACCENT, width=4)
        if u > 0.35:
            text_c(d, 1340, "カメライフガイド", 40, ACCENT, clamp((u-0.35)*4), stroke=3)
    return [s01, s02, s03, s04, s05, s06, s07, s08, s09, s10, s11, s12,
            s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24]

EPISODES = {
    2: ("カメの誤解 ｜ #2", "tiktok-02-mizu.mp4", ep2),
    3: ("カメの誤解 ｜ #3", "tiktok-03-pyramiding.mp4", ep3),
    4: ("カメの誤解 ｜ #4", "tiktok-04-uvb.mp4", ep4),
    5: ("カメの誤解 ｜ #5", "tiktok-05-choju.mp4", ep5),
}

# ───────── DS v1.0 適合チェック（make_video3.py と同一） ─────────
def contrast(c1, c2):
    def L(c):
        def f(v):
            v /= 255.0
            return v/12.92 if v <= 0.03928 else ((v+0.055)/1.055)**2.4
        return 0.2126*f(c[0])+0.7152*f(c[1])+0.0722*f(c[2])
    a, b = L(c1), L(c2)
    return (max(a, b)+0.05)/(min(a, b)+0.05)

def ds_check():
    durs = DURS
    total = sum(durs)
    checks = [
        ("尺 38-45秒", 38.0 <= total <= 45.0, "%.1f秒" % total),
        ("カット/10秒 >= 2.5", (len(durs)-1)/(total/10) >= 2.5, "%.2f" % ((len(durs)-1)/(total/10))),
        ("カット長 中央値 <= 2.0秒", st.median(durs) <= 2.0, "%.2f秒" % st.median(durs)),
        ("2秒超カット <= 35%", 100*sum(1 for x in durs if x > 2.0)/len(durs) <= 35,
         "%.1f%%" % (100*sum(1 for x in durs if x > 2.0)/len(durs))),
        ("最長カット <= 3.0秒", max(durs) <= 3.0, "%.1f秒" % max(durs)),
        ("本文コントラスト >= 4.5", contrast(FG, BG) >= 4.5, "%.2f:1" % contrast(FG, BG)),
        ("強調コントラスト >= 4.5", contrast(ACCENT, BG) >= 4.5, "%.2f:1" % contrast(ACCENT, BG)),
        ("警告色コントラスト >= 4.5", contrast(WARN, BG) >= 4.5, "%.2f:1" % contrast(WARN, BG)),
        ("水色コントラスト >= 4.5", contrast(AQUA, BG) >= 4.5, "%.2f:1" % contrast(AQUA, BG)),
        ("9:16", W*16 == H*9, "%dx%d" % (W, H)),
    ]
    ng = 0
    for name, ok, val in checks:
        print("  [%s] %-24s %s" % ("OK" if ok else "NG", name, val))
        ng += (not ok)
    return ng

def render(ep):
    label, outname, builder = EPISODES[ep]
    scenes = builder()
    assert len(scenes) == len(DURS), "シーン数不一致: %d != %d" % (len(scenes), len(DURS))
    out = os.path.join(OUTDIR, outname)
    nfr = int(DUR*FPS)
    exe = imageio_ffmpeg.get_ffmpeg_exe()
    p = subprocess.Popen([exe, "-y", "-f", "rawvideo", "-vcodec", "rawvideo",
                          "-s", "%dx%d" % (W, H), "-pix_fmt", "rgb24", "-r", str(FPS), "-i", "-",
                          "-an", "-vcodec", "libx264", "-preset", "medium", "-crf", "20",
                          "-pix_fmt", "yuv420p", "-movflags", "+faststart", out],
                         stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
    bounds, acc = [], 0.0
    for dur, fn in zip(DURS, scenes):
        bounds.append((acc, acc+dur, fn)); acc += dur
    for i in range(nfr):
        t = i/FPS
        img = bg_frame(t)
        d = ImageDraw.Draw(img)
        series_tag(d, label)
        for t0, t1, fn in bounds:
            if t0 <= t < t1:
                fn(d, (t-t0)/(t1-t0), t)
                if t0 > 0 and (t - t0) < 1.0/FPS:
                    img = Image.blend(img, Image.new("RGB", (W, H), FOREST), 0.42)
                break
        p.stdin.write(img.tobytes())
    p.stdin.close()
    rc = p.wait()
    if rc != 0:
        print(p.stderr.read().decode()[-600:]); sys.exit(1)
    print("  完成: %s  %.2f MB" % (outname, os.path.getsize(out)/1e6))
    return out

if __name__ == "__main__":
    print("=== DS v1.0 適合チェック（#1 v3 と同一の尺配分） ===")
    if ds_check():
        print("DS違反のため制作を中止します。"); sys.exit(1)
    args = sys.argv[1:] or ["all"]
    eps = sorted(EPISODES) if args[0] == "all" else [int(a) for a in args]
    for e in eps:
        print("\n--- #%d %s ---" % (e, EPISODES[e][0]))
        render(e)
