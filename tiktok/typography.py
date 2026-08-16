#!/usr/bin/env python3
"""
KAME LIFE GUIDE / 短尺動画のテロップ組版

これまでのテロップが「Web管理画面のバナー」に見えていた原因は3つあった。

  1. **太字が存在しなかった**
     この環境の日本語フォントは IPAゴシック Regular のみ（fc-list で確認）。
     本文用の細いウェイトを見出しに使っていたので、線が細く平板になっていた。
     → サイト本体と同じ Noto Sans JP / Noto Serif JP の **Black** を導入。

  2. **角丸の塗り箱に文字を載せていた**
     ボタン・バッジのUI表現であって、映像のテロップの作法ではない。
     → 箱を廃止。白抜き＋濃いアウトライン＋落ち影で、写真の上に直接置く。

  3. **文字が小さすぎた**
     1080px幅に対して50〜90pxは本文サイズ。
     → 主役の行は 104〜150px。1行の情報量を減らして大きくする。

その他: 行間を詰める（1.34 → 1.16）、字間をわずかに詰める、
出現は「少し大きい状態から縮んで着地」させる（静止画の切替に見せない）。

コントラストは目視で判断しない。文字色とアウトライン色の比を数値で検査する。
"""
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
FONT_DIR = os.path.join(HERE, "fonts")

SANS_BLACK  = os.path.join(FONT_DIR, "NotoSansJP-Black.otf")
SANS_BOLD   = os.path.join(FONT_DIR, "NotoSansJP-Bold.otf")
SERIF_BLACK = os.path.join(FONT_DIR, "NotoSerifJP-Black.otf")

# ブランド色
FG     = (0xf4, 0xef, 0xe2)      # 生成りの白
AMBER  = (0xe8, 0xc4, 0x82)      # 写真の上で沈まないよう、サイトの #d4a96a より少し明るく
INK    = (0x0a, 0x18, 0x14)      # アウトライン（森の深緑に寄せた黒）
SHADOW = (0x00, 0x00, 0x00)

_font_cache = {}


def font(path, size):
    k = (path, size)
    if k not in _font_cache:
        _font_cache[k] = ImageFont.truetype(path, size)
    return _font_cache[k]


def contrast(c1, c2):
    def L(c):
        def f(v):
            v /= 255.0
            return v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
        return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2])
    a, b = L(c1), L(c2)
    return (max(a, b) + 0.05) / (min(a, b) + 0.05)


def fit(text, path, size, maxw):
    """最大幅に収まるまで詰める。文字切れを起こさない。"""
    while size > 24:
        f = font(path, size)
        w = ImageDraw.Draw(Image.new("RGB", (8, 8))).textlength(text, font=f)
        if w <= maxw:
            return f, size
        size -= 2
    return font(path, size), size


def _track(d, xy, text, f, fill, tracking, stroke_width=0, stroke_fill=None):
    """字間を詰めて描く（Pillow は letter-spacing を持たないため1文字ずつ）"""
    x, y = xy
    for ch in text:
        d.text((x, y), ch, font=f, fill=fill,
               stroke_width=stroke_width, stroke_fill=stroke_fill)
        x += d.textlength(ch, font=f) + tracking


def measure(text, f, tracking):
    d = ImageDraw.Draw(Image.new("RGB", (8, 8)))
    return sum(d.textlength(ch, font=f) + tracking for ch in text) - tracking


def render_caption(lines, maxw=940, pad=64):
    """行の配列から RGBA のテロップ画像を1枚作る（毎フレーム描かず使い回す）。

    lines: [dict(t=..., size=..., color=FG|AMBER, face='sans'|'serif')]
    戻り値: (RGBA画像, 各行の高さ合計)
    """
    prepared = []
    for ln in lines:
        path = SERIF_BLACK if ln.get("face") == "serif" else SANS_BLACK
        tracking = -ln["size"] * 0.02          # わずかに詰める
        f, size = fit(ln["t"], path, ln["size"], maxw - pad * 2)
        w = measure(ln["t"], f, tracking)
        prepared.append(dict(t=ln["t"], f=f, size=size, w=w,
                             color=ln.get("color", FG), tracking=tracking,
                             stroke=max(3, int(size * 0.105))))

    lead = lambda s: int(s * 1.16)
    total_h = sum(lead(p["size"]) for p in prepared)
    W = int(max(p["w"] for p in prepared) + pad * 2)
    H = int(total_h + pad * 2)

    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))

    # 落ち影（にじませた濃い影を先に敷く）
    sh = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ds = ImageDraw.Draw(sh)
    y = pad
    for p in prepared:
        x = (W - p["w"]) / 2
        _track(ds, (x, y), p["t"], p["f"], (*SHADOW, 150), p["tracking"],
               stroke_width=p["stroke"], stroke_fill=(*SHADOW, 150))
        y += lead(p["size"])
    sh = sh.filter(ImageFilter.GaussianBlur(13))
    sh = sh.transform(sh.size, Image.AFFINE, (1, 0, 0, 0, 1, -9))   # 少し下へ
    img.alpha_composite(sh)

    # 本体（アウトライン付き）
    d = ImageDraw.Draw(img)
    y = pad
    for p in prepared:
        x = (W - p["w"]) / 2
        _track(d, (x, y), p["t"], p["f"], (*p["color"], 255), p["tracking"],
               stroke_width=p["stroke"], stroke_fill=(*INK, 255))
        y += lead(p["size"])

    return img


def paste_caption(base, cap, cx, bottom, u_elapsed,
                  rise=18, pop=0.055, dur_in=0.16):
    """少し大きい状態から縮んで着地させる。静止画の切替に見せないため。"""
    k = max(0.0, min(1.0, u_elapsed / dur_in))
    e = 1 - (1 - k) ** 3
    if k <= 0:
        return
    scale = 1.0 + pop * (1 - e)
    a = e
    w = int(cap.width * scale)
    h = int(cap.height * scale)
    im = cap.resize((w, h), Image.LANCZOS) if scale != 1.0 else cap
    if a < 1.0:
        im = im.copy()
        alpha = im.getchannel("A").point(lambda v: int(v * a))
        im.putalpha(alpha)
    x = int(cx - w / 2)
    y = int(bottom - h + (1 - e) * rise)
    base.alpha_composite(im, (x, y))


def draw_badge(img, text="カメライフガイド"):
    """角丸ピルをやめ、小さな印＋細い文字にする（画面の主役を邪魔しない）"""
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    f = font(SANS_BOLD, 27)
    x0, y0 = 52, 96
    d.rounded_rectangle([x0, y0 + 2, x0 + 17, y0 + 19], radius=4, fill=(*AMBER, 235))
    d.text((x0 + 29, y0 - 4), text, font=f, fill=(*FG, 235),
           stroke_width=3, stroke_fill=(*INK, 190))
    img.alpha_composite(layer)


def selftest():
    print("=== コントラスト検査（文字色 vs アウトライン色。目視で判断しない）===")
    for name, c in (("白 #f4efe2", FG), ("アンバー #e8c482", AMBER)):
        r = contrast(c, INK)
        print("  %-16s vs アウトライン #0a1814 : %5.2f:1  %s"
              % (name, r, "AA合格" if r >= 4.5 else "★不合格"))
    for p in (SANS_BLACK, SANS_BOLD, SERIF_BLACK):
        print("  フォント %-22s %s" % (os.path.basename(p),
                                      "あり" if os.path.exists(p) else "★なし"))


if __name__ == "__main__":
    selftest()
