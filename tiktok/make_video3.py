#!/usr/bin/env python3
"""
KAME LIFE GUIDE / TikTok #1 v3「甲羅、脱げると思ってた？」
TikTok Design System v1.0 準拠版。

DS v1.0 の数値要件（根拠は tiktok/DESIGN-SYSTEM.md）:
  尺 38-45秒 / カット/10秒 >= 2.5 / カット長中央値 <= 2.0秒 /
  2秒超カット <= 35% / 最長静止 <= 1.5秒 / 有意な画面変化 >= 0.8回/秒 /
  冒頭0.5秒でテロップ表示済み / 冒頭3秒で3回以上変化 /
  中盤(40-50%地点)にリフック1回 / 終盤に保存用まとめカード /
  CTAは最後2-3秒に2-3語 / AI生成画像の使用禁止
"""
import subprocess, math, os, sys
from PIL import Image, ImageDraw, ImageFont
import imageio_ffmpeg

W, H, FPS, DUR = 1080, 1920, 30, 41.4
NFR = int(DUR * FPS)
FONT = "/usr/share/fonts/truetype/fonts-japanese-gothic.ttf"
OUT = "/home/user/kame-life-guide-/tiktok/tiktok-01-v3-ds.mp4"

BG     = (0x0d, 0x1f, 0x1a)
FG     = (0xf4, 0xef, 0xe2)
ACCENT = (0xd4, 0xa9, 0x6a)
FOREST = (0x2f, 0x4a, 0x3c)
DARK   = (0x06, 0x10, 0x0d)
WARN   = (0xe0, 0x70, 0x5c)   # AA検証で #c85a4a(4.09:1) が不合格 → 5.41:1 の暖色赤に変更

SAFE_X0, SAFE_X1 = int(W*0.08), int(W*0.88)
SAFE_Y0, SAFE_Y1 = int(H*0.15), int(H*0.72)
MAXW = SAFE_X1 - SAFE_X0

F = {s: ImageFont.truetype(FONT, s) for s in (34, 40, 48, 56, 64, 76, 92, 104)}
SERIES = "カメの誤解 ｜ #1"

def ease(t):  return 1 - (1-t)**3
def clamp(v, a=0.0, b=1.0): return max(a, min(b, v))
def mix(c1, c2, k): return tuple(int(c1[i] + (c2[i]-c1[i])*k) for i in range(3))

# ---------- 背景（毎フレーム変化。静止フレームを作らない） ----------
def bg_frame(t):
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    # 全画面の光がゆっくり呼吸する（周期約2.6秒）。
    # 実測で「細い線の動きは平均差分に現れない＝静止と判定される」ことが分かったため、
    # 画面が止まって見えないよう大面積の変化を常時入れる設計にした。
    for y in range(0, H, 6):
        k = y/H
        g = 0.36*math.sin(math.pi*k + t*2.4)
        d.rectangle([0, y, W, y+6], fill=mix(BG, FOREST, max(0.0, g)))
    # 斜めのライトスイープは常時走らせる（周期4.5秒）
    sweep = ((t/4.5) % 1.0)
    sx = int(sweep*W*2.2) - 420
    for i in range(0, 200, 6):
        a = (1 - abs(i-100)/100.0) * 0.026
        d.line([(sx+i, 0), (sx+i-460, H)], fill=mix(BG, ACCENT, a), width=6)
    return img

def series_tag(d, t):
    tw = d.textlength(SERIES, font=F[34])
    x = (W-tw)/2
    d.text((x, 232), SERIES, font=F[34], fill=ACCENT)
    d.line([(x-36, 288), (x-36+tw+72, 288)], fill=ACCENT, width=2)

# ---------- 図形パーツ（すべてコード描画。AI生成画像を一切使わない） ----------
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
    """横から見たカメの体（甲羅を外した状態）。首・尾をつないで『カメ』と読めるようにする。"""
    d.ellipse([cx-150*s, cy-40*s, cx+150*s, cy+70*s], outline=col, width=w)
    d.line([(cx+140*s, cy-18*s), (cx+178*s, cy-30*s)], fill=col, width=w)      # 首
    d.ellipse([cx+170*s, cy-56*s, cx+250*s, cy+6*s], outline=col, width=w)     # 頭
    d.ellipse([cx+228*s, cy-40*s, cx+238*s, cy-30*s], fill=col)                # 目
    d.line([(cx-150*s, cy+20*s), (cx-196*s, cy+34*s)], fill=col, width=w)      # 尾
    for dx in (-96, -24, 58, 114):
        d.line([(cx+dx*s, cy+55*s), (cx+dx*s-16*s, cy+126*s)], fill=col, width=w)
        d.line([(cx+dx*s-16*s, cy+126*s), (cx+dx*s-4*s, cy+134*s)], fill=col, width=w)

def shell_side(d, cx, cy, s, col=FG, w=10):
    rw, rh = 200*s, 120*s
    d.arc([cx-rw, cy-rh, cx+rw, cy+rh], start=180, end=360, fill=col, width=w)
    d.line([(cx-rw+6, cy), (cx+rw-6, cy)], fill=col, width=w)

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

def lungs(d, cx, cy, s, k, col=(0x8f, 0xc0, 0xa8)):
    """背甲のすぐ内側に位置する肺（確度: 高）"""
    rh = 120*s
    for sgn in (-1, 1):
        w_ = 78*s*ease(clamp(k)); h_ = 52*s*ease(clamp(k))
        ox = cx + sgn*92*s
        oy = cy - rh + 78*s
        d.ellipse([ox-w_, oy-h_, ox+w_, oy+h_], outline=col, width=int(6*s))

def organs(d, cx, cy, s, k, col=(0xd0, 0x8f, 0x8f)):
    rh = 120*s
    r = 46*s*ease(clamp(k))
    d.ellipse([cx-r, cy-rh+150*s-r, cx+r, cy-rh+150*s+r], outline=col, width=int(6*s))
    r2 = 34*s*ease(clamp(k*1.3-0.3))
    if r2 > 0:
        d.ellipse([cx-110*s-r2, cy-rh+168*s-r2, cx-110*s+r2, cy-rh+168*s+r2], outline=col, width=int(5*s))

def cross_mark(d, cx, cy, r, k, col=WARN, w=16):
    k1, k2 = clamp(k*2), clamp(k*2-1)
    if k1 > 0:
        d.line([(cx-r, cy-r), (cx-r+2*r*ease(k1), cy-r+2*r*ease(k1))], fill=col, width=w)
    if k2 > 0:
        d.line([(cx+r, cy-r), (cx+r-2*r*ease(k2), cy-r+2*r*ease(k2))], fill=col, width=w)

def text_c(d, y, txt, size, col=FG, k=1.0, stroke=5):
    """中央寄せ。幅とセーフエリアを数値検証し、違反したらビルドを失敗させる。"""
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

def breathe(u, amp=0.05, sp=5.0):
    """全シーン共通の微小モーション。静止フレームを作らないための保険。"""
    return 1.0 + amp*math.sin(u*sp*math.pi)

def scan_loop(d, cx, cy, s, u, speed=2.0, alpha=0.55):
    """シーン全体を通して往復し続けるスキャンライン。
    実測で『シーン後半が静止する』欠陥が出たため、全尺で動き続ける形に変更した。"""
    rw, rh = 200*s, 120*s
    ph = (u*speed) % 1.0
    ph = ph*2 if ph < 0.5 else (1-ph)*2          # 往復
    y = cy - rh + (rh*1.1)*ph
    d.line([(cx-rw*1.02, y), (cx+rw*1.02, y)], fill=mix(BG, ACCENT, alpha), width=4)

def pulse_ring(d, cx, cy, u, r0=150, r1=330, n=2, col=None):
    """一定周期で広がり続けるリング。CTAの視線誘導と『静止させない』を兼ねる。"""
    col = col or ACCENT
    for i in range(n):
        k = (u*1.6 + i/float(n)) % 1.0
        r = r0 + (r1-r0)*k
        c = mix(BG, col, 0.42*(1-k))
        d.ellipse([cx-r, cy-r*0.78, cx+r, cy+r*0.78], outline=c, width=3)

# ---------- シーン ----------
def s_hook1(d, u, t):
    """0.0-1.0秒: まず『カメだと一目で分かる画』。0.5秒以内にテロップ1行目を出し切る。"""
    turtle_top(d, W//2, 740, 0.56*(1.0+0.52*u), rot=-0.26+0.52*u, w=8)
    text_c(d, 1115, "甲羅、脱げると", 104, FG, clamp(u*22))

def s_hook2(d, u, t):
    """1.0-1.9秒: 同じ被写体へハードな押し込み（寄り）。2行目で問いを完成させる。"""
    turtle_top(d, W//2, 720, 1.00*(1.0+0.30*u), rot=0.12+0.34*u, w=10)
    text_c(d, 1115, "甲羅、脱げると", 104, FG, 1.0)
    text_c(d, 1272, "思ってた？", 104, ACCENT, clamp(u*16))

def s_wrong(d, u, t):
    if u < 0.12:
        d.rectangle([0, 0, W, H], fill=mix(BG, ACCENT, 0.16))
    turtle_top(d, W//2, 770, 0.58*(1.0+0.20*u), rot=0.20-0.34*u, w=7)
    text_c(d, 1115, "それ、", 104, FG, clamp(u*12))
    text_c(d, 1272, "間違いです。", 104, ACCENT, clamp(u*12-1.4))

def s_lift(d, u, t):
    body_side(d, W//2-30, 880, 1.05, FG, 8)
    lift = ease(clamp(u*1.6))*160
    shell_side(d, W//2, 840-lift, 1.05, FG, 10)
    for i in range(4):                                   # 引き上げの動線
        x = W//2 - 150 + i*100
        d.line([(x, 900-lift*0.2), (x, 830-lift*0.9)], fill=mix(BG, ACCENT, 0.55), width=4)
        d.line([(x, 830-lift*0.9), (x-12, 852-lift*0.9)], fill=mix(BG, ACCENT, 0.55), width=4)
        d.line([(x, 830-lift*0.9), (x+12, 852-lift*0.9)], fill=mix(BG, ACCENT, 0.55), width=4)
    text_c(d, 1210, "持ち上げても", 76, FG, clamp(u*10))

def s_cross(d, u, t):
    body_side(d, W//2-30, 880, 1.05, mix(BG, FG, 0.55), 8)
    shell_side(d, W//2, 700, 1.05, mix(BG, FG, 0.55), 10)
    cross_mark(d, W//2, 790, 230*(1+0.04*math.sin(u*9)), clamp(u*1.9))
    text_c(d, 1210, "外れません", 92, WARN, clamp(u*12))

def s_notclothes(d, u, t):
    shell_side(d, W//2, 800, 1.12*(1.0+0.20*u), FG, 10)
    text_c(d, 1170, "甲羅は", 92, FG, clamp(u*12))
    text_c(d, 1290, "“服”じゃない", 92, ACCENT, clamp(u*12-1.4))

def s_bone(d, u, t):
    sc = 1.16*(1.0+0.18*u)
    shell_side(d, W//2, 800, sc, FG, 10)
    spine(d, W//2, 800, sc, clamp(u*2.2))
    text_c(d, 1170, "甲羅は", 92, FG, clamp(u*12))
    text_c(d, 1290, "“骨”です", 92, ACCENT, clamp(u*12-1.2))

def s_xray1(d, u, t):
    s = 1.85
    shell_side(d, W//2, 810, s, FG, 12)
    spine(d, W//2, 810, s, clamp(u*2.0))
    scan_loop(d, W//2, 810, s, u, speed=2.2, alpha=0.75)
    text_c(d, 1260, "中には背骨", 76, ACCENT, clamp(u*10))

def s_xray2(d, u, t):
    s = 1.85
    shell_side(d, W//2, 810, s, FG, 12)
    spine(d, W//2, 810, s, 1.0)
    ribs(d, W//2, 810, s, clamp(u*1.25))
    scan_loop(d, W//2, 810, s, u, speed=1.8, alpha=0.45)
    text_c(d, 1260, "そこから肋骨", 76, ACCENT, clamp(u*10))

def s_fused(d, u, t):
    s = 1.62*(1.0+0.11*u)
    shell_side(d, W//2, 800, s, FG, 11)
    spine(d, W//2, 800, s, 1.0); ribs(d, W//2, 800, s, 1.0)
    for i in range(4):
        k = clamp(u*2.4 - i*0.18)
        if k > 0:
            r = 26*ease(k)
            a = math.radians(215 + i*36)
            d.ellipse([W//2+200*s*math.cos(a)*0.95-r, 800+120*s*math.sin(a)*0.95-r,
                       W//2+200*s*math.cos(a)*0.95+r, 800+120*s*math.sin(a)*0.95+r],
                      outline=ACCENT, width=3)
    scan_loop(d, W//2, 800, s, u, speed=1.6, alpha=0.40)
    text_c(d, 1240, "甲羅と一体化", 76, FG, clamp(u*10))

def s_count(d, u, t):
    s = 1.54*(1.0+0.12*u)
    shell_side(d, W//2, 790, s, FG, 11)
    spine(d, W//2, 790, s, 1.0); ribs(d, W//2, 790, s, 1.0)
    scan_loop(d, W//2, 790, s, u, speed=1.6, alpha=0.40)
    text_c(d, 1180, "その数", 64, FG, clamp(u*12))
    text_c(d, 1280, "およそ 50〜60個", 92, ACCENT, clamp(u*10-0.4))

def s_rehook(d, u, t):
    """中盤リフック（全体の約42%地点）"""
    if u < 0.12:
        d.rectangle([0, 0, W, H], fill=mix(BG, WARN, 0.14))
    turtle_top(d, W//2, 760, 0.54*(1.0+0.26*u), rot=-0.14+0.38*u, w=7)
    text_c(d, 1170, "じゃあ、", 92, FG, clamp(u*12))
    text_c(d, 1290, "はがしたら？", 92, WARN, clamp(u*12-1.3))

def s_lung(d, u, t):
    s = 1.80
    shell_side(d, W//2, 810, s, FG, 12)
    spine(d, W//2, 810, s, 1.0); ribs(d, W//2, 810, s, 1.0)
    lungs(d, W//2, 810, s, clamp(u*1.8))
    scan_loop(d, W//2, 810, s, u, speed=1.7, alpha=0.40)
    text_c(d, 1250, "すぐ内側に肺", 76, FG, clamp(u*10))

def s_organs(d, u, t):
    s = 1.80
    shell_side(d, W//2, 810, s, FG, 12)
    spine(d, W//2, 810, s, 1.0); ribs(d, W//2, 810, s, 1.0)
    lungs(d, W//2, 810, s, 1.0)
    organs(d, W//2, 810, s, clamp(u*1.8))
    scan_loop(d, W//2, 810, s, u, speed=1.7, alpha=0.40)
    text_c(d, 1250, "心臓も内臓もある", 76, FG, clamp(u*10))

def s_peel(d, u, t):
    s = 1.55
    shell_side(d, W//2, 800, s, mix(BG, FG, 0.5), 11)
    spine(d, W//2, 800, s, 1.0); ribs(d, W//2, 800, s, 1.0)
    k = ease(clamp(u*1.5))
    d.arc([W//2-200*s, 800-120*s-70*k, W//2+200*s, 800+120*s-70*k],
          start=180, end=360, fill=WARN, width=int(11))
    text_c(d, 1210, "甲羅をはがす＝", 76, FG, clamp(u*10))

def s_danger(d, u, t):
    shell_side(d, W//2, 790, 1.5, mix(BG, FG, 0.4), 10)
    spine(d, W//2, 790, 1.5, 1.0); ribs(d, W//2, 790, 1.5, 1.0)
    cross_mark(d, W//2, 790, 210*(1+0.03*math.sin(u*10)), clamp(u*2.0))
    text_c(d, 1200, "背骨をはがすこと", 76, WARN, clamp(u*11))

def s_conclusion(d, u, t):
    turtle_top(d, W//2, 770, 0.56*(1.0+0.30*u), rot=-0.16+0.34*u, w=7)
    text_c(d, 1160, "だから、", 104, FG, clamp(u*12))
    text_c(d, 1272, "脱げません。", 104, ACCENT, clamp(u*12-1.3))

def s_except1(d, u, t):
    """例外を隠さない = 専門性と誠実さ（ブランド要件）"""
    s = 1.28*(1.0+0.16*u)
    shell_side(d, W//2, 800, s, FG, 10)
    for i in range(5):
        k = clamp(u*2.2 - i*0.12)
        if k > 0:
            off = 26*ease(k)
            d.arc([W//2-200*s+off, 800-120*s-off, W//2+200*s+off, 800+120*s-off],
                  start=200, end=250, fill=mix(BG, ACCENT, 0.8), width=4)
    text_c(d, 1210, "ただし、", 92, FG, clamp(u*12))

def s_except2(d, u, t):
    s = 1.28*(1.0+0.16*u)
    shell_side(d, W//2, 790, s, FG, 10)
    for i in range(5):
        off = 26 + 10*math.sin(u*6 + i)
        d.arc([W//2-200*s+off, 790-120*s-off, W//2+200*s+off, 790+120*s-off],
              start=200, end=250, fill=mix(BG, ACCENT, 0.8), width=4)
    text_c(d, 1180, "表面の甲板が", 76, FG, clamp(u*11))
    text_c(d, 1300, "はがれる種はいる", 76, ACCENT, clamp(u*11-1.2))

def s_comment(d, u, t):
    """コメント誘導。コメントは『深い関心』シグナルであり、入力中も視聴時間に算入される。"""
    turtle_top(d, W//2, 760, 0.48*(1.0+0.24*u), rot=-0.22+0.46*u,
               col=mix(BG, FG, 0.85), w=7)
    pulse_ring(d, W//2, 760, u, r0=190, r1=340, n=2, col=FG)
    text_c(d, 1160, "知ってた？", 92, ACCENT, clamp(u*14))
    text_c(d, 1290, "コメントで教えて", 56, FG, clamp(u*12-1.2))

def s_summary(d, u, t):
    """保存誘導カード（保存はいいねより重み大 / 出典: 2026 ranking signal）"""
    k = ease(clamp(u*1.6))
    x0, x1 = SAFE_X0+10, SAFE_X1-10
    y0, y1 = 690, 690+int(430*k)
    d.rounded_rectangle([x0, y0, x1, y1], radius=28, outline=ACCENT, width=3,
                        fill=mix(BG, DARK, 0.5))
    if k > 0.5:
        text_c(d, 730, "まとめ", 48, ACCENT, clamp(u*3-0.6), stroke=3)
        text_c(d, 830,  "甲羅＝背骨と肋骨", 56, FG, clamp(u*3-0.9), stroke=4)
        text_c(d, 920,  "およそ50〜60個", 56, FG, clamp(u*3-1.1), stroke=4)
        text_c(d, 1010, "脱げない・はがせない", 56, FG, clamp(u*3-1.3), stroke=4)
    turtle_top(d, W//2, 1300, (0.30+0.10*u), rot=-0.25+0.55*u,
               col=mix(BG, FG, 0.6), w=5)
    pulse_ring(d, W//2, 1300, u, r0=130, r1=250, n=2, col=FG)

def s_save(d, u, t):
    turtle_top(d, W//2, 800, (0.40+0.14*u), rot=-0.30+0.62*u,
               col=mix(BG, FG, 0.7), w=6)
    pulse_ring(d, W//2, 800, u, r0=200, r1=380, n=2, col=ACCENT)
    text_c(d, 1180, "保存して", 92, ACCENT, clamp(u*12))
    text_c(d, 1300, "飼う前に見返して", 76, FG, clamp(u*12-1.3))

def s_cta1(d, u, t):
    turtle_top(d, W//2, 730, (0.38+0.14*u), rot=-0.32+0.66*u, col=mix(BG, FG, 0.55), w=6)
    pulse_ring(d, W//2, 730, u, r0=180, r1=360, n=2, col=ACCENT)
    text_c(d, 1130, "あなたに合うカメは？", 76, FG, clamp(u*12))
    text_c(d, 1260, "プロフィールの診断へ", 56, ACCENT, clamp(u*12-1.4))

def s_cta2(d, u, t):
    # ループ接続: u=1 で冒頭カット(scale 0.56 / rot -0.26 / cy 740)に一致させる
    turtle_top(d, W//2, int(780-40*u), (0.40+0.16*u), rot=0.20-0.46*u, col=mix(BG, FG, 0.62), w=7)
    pulse_ring(d, W//2, int(780-40*u), u, r0=190, r1=400, n=3, col=ACCENT)
    text_c(d, 1180, "プロフィールへ", 92, FG, clamp(u*12))
    d.line([(W//2-210, 1320), (W//2-210+420*min(1.0, u*1.15), 1320)], fill=ACCENT, width=4)
    if u > 0.35:
        text_c(d, 1340, "カメライフガイド", 40, ACCENT, clamp((u-0.35)*4), stroke=3)

SCENES = [
    (1.0, s_hook1), (0.9, s_hook2), (1.4, s_wrong), (1.8, s_lift), (1.2, s_cross),
    (1.6, s_notclothes), (1.8, s_bone), (1.8, s_xray1), (2.0, s_xray2),
    (1.6, s_fused), (1.8, s_count), (1.8, s_rehook), (1.8, s_lung),
    (1.6, s_organs), (1.8, s_peel), (1.6, s_danger), (1.8, s_conclusion),
    (1.8, s_except1), (1.8, s_except2), (1.4, s_comment),
    (2.4, s_summary), (1.8, s_save),
    (2.2, s_cta1), (2.7, s_cta2),
]

# ---------- DS v1.0 適合の事前検証（違反したら作らせない） ----------
def contrast(c1, c2):
    def L(c):
        def f(v):
            v /= 255.0
            return v/12.92 if v <= 0.03928 else ((v+0.055)/1.055)**2.4
        return 0.2126*f(c[0])+0.7152*f(c[1])+0.0722*f(c[2])
    a, b = L(c1), L(c2)
    return (max(a, b)+0.05)/(min(a, b)+0.05)

import statistics as st
durs = [s[0] for s in SCENES]
total = sum(durs)
checks = [
    ("尺 38-45秒",           38.0 <= total <= 45.0,       "%.1f秒" % total),
    ("カット/10秒 >= 2.5",   (len(SCENES)-1)/(total/10) >= 2.5,
                             "%.2f" % ((len(SCENES)-1)/(total/10))),
    ("カット長 中央値 <= 2.0秒", st.median(durs) <= 2.0,   "%.2f秒" % st.median(durs)),
    ("2秒超カット <= 35%",   100*sum(1 for x in durs if x > 2.0)/len(durs) <= 35,
                             "%.1f%%" % (100*sum(1 for x in durs if x > 2.0)/len(durs))),
    ("最長カット <= 3.0秒",  max(durs) <= 3.0,             "%.1f秒" % max(durs)),
    ("本文コントラスト >= 4.5", contrast(FG, BG) >= 4.5,    "%.2f:1" % contrast(FG, BG)),
    ("強調コントラスト >= 4.5", contrast(ACCENT, BG) >= 4.5, "%.2f:1" % contrast(ACCENT, BG)),
    ("警告色コントラスト >= 4.5", contrast(WARN, BG) >= 4.5, "%.2f:1" % contrast(WARN, BG)),
    ("9:16",                 W*16 == H*9,                  "%dx%d" % (W, H)),
]
print("=== DS v1.0 適合チェック（制作前） ===")
ng = 0
for name, ok, val in checks:
    print("  [%s] %-24s %s" % ("OK" if ok else "NG", name, val))
    ng += (not ok)
if abs(total - DUR) > 1e-6:
    print("  [NG] 尺不一致 %.2f != %.2f" % (total, DUR)); ng += 1
if ng:
    print("DS違反のため制作を中止します。"); sys.exit(1)

# ---------- レンダリング ----------
exe = imageio_ffmpeg.get_ffmpeg_exe()
p = subprocess.Popen([exe, "-y", "-f", "rawvideo", "-vcodec", "rawvideo",
                      "-s", "%dx%d" % (W, H), "-pix_fmt", "rgb24", "-r", str(FPS), "-i", "-",
                      "-an", "-vcodec", "libx264", "-preset", "medium", "-crf", "20",
                      "-pix_fmt", "yuv420p", "-movflags", "+faststart", OUT],
                     stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
bounds, acc = [], 0.0
for dur, fn in SCENES:
    bounds.append((acc, acc+dur, fn)); acc += dur

for i in range(NFR):
    t = i/FPS
    img = bg_frame(t)
    d = ImageDraw.Draw(img)
    series_tag(d, t)
    for t0, t1, fn in bounds:
        if t0 <= t < t1:
            fn(d, (t-t0)/(t1-t0), t)
            # カット感を作る 1フレームのフラッシュ（黒落ちさせない）
            if t0 > 0 and (t - t0) < 1.0/FPS:
                img = Image.blend(img, Image.new("RGB", (W, H), FOREST), 0.42)
            break
    p.stdin.write(img.tobytes())
    if i % 200 == 0:
        print("  render %4d/%d" % (i, NFR))
p.stdin.close()
rc = p.wait()
if rc != 0:
    print(p.stderr.read().decode()[-600:]); sys.exit(1)
print("=== 完成 ===")
print("  %s  %.2f MB" % (OUT, os.path.getsize(OUT)/1e6))
