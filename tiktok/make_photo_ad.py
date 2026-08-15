#!/usr/bin/env python3
"""
KAME LIFE GUIDE / TikTok 実写素材版「カメふしぎ島」（こども向けページの告知）

オーナー提供の写真5枚から TikTok 用縦動画を生成する。
テロップの配色・形状は**オーナーの参考動画から実測した値**に合わせる。

参考動画から抽出した実測値:
  強調ボックス   #d4a96a 系（サンプル最頻値 #d9a65e / #d4a257 → ブランドaccent #d4a96a と一致）
  暗色ボックス   #0d1f1a 系（サンプル #0b150e / #0f1912）半透明
  本文文字       #f4efe2 ／ 強調ボックス内の文字は暗色
  レイアウト     左上に角丸バッジ、テロップは画面下寄り（縦の約65〜80%）にボックスで重ねる

誘導先: https://kamelifeguide.com/kids/index.html
        （「カメふしぎ島へ ようこそ｜こどもの カメずかん」）

  ※ リポジトリには紛らわしい2つのパスがある。取り違えないこと。
      kid/index.html   … 大人向けツール「その容器、うちの子にまだ使える？」
      kids/index.html  … こども向け「カメふしぎ島」← 提供写真のスマホ画面はこちら

台本の根拠（すべてリポジトリ内の実在ページから）:
  「甲羅は ぬげない」        kids/fushigi.html の5つのふしぎの1つ
  「漢字ぜんぶに ふりがな」  kids/index.html の JSON-LD「すべての漢字にふりがなを振ったカメのページ」
  「商品リンクなし」          kids/chuui.html「このページには商品を買うリンクはありません」

**「川で捕まえてきた」設定は使わない。**
  kids/chuui.html が「そとの カメを 持って かえる」を"やってはいけない4つ"の1つとして
  子どもに教えているため、それを肯定する動画は自社の教育方針と矛盾する。
  本動画は「もう家にいるカメ」を前提にしている。

出力:
  tiktok/tiktok-kid-container.mp4      完成動画（そのまま投稿可）
  tiktok/capcut/                       CapCut用の素材一式（1080x1920 の静止画5枚）
  tiktok/capcut/telop-script.md        CapCut で組み直すためのテロップ台本（秒数・色・サイズ）
"""
import os, sys, math, json, subprocess
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import imageio_ffmpeg

W, H, FPS = 1080, 1920, 30
HERE = os.path.dirname(os.path.abspath(__file__))
UPLOAD = "/root/.claude/uploads/721c8ebe-8b98-5c8f-a670-248644c164b5"
OUT = os.path.join(HERE, "tiktok-kids-fushigijima.mp4")
CAPCUT = os.path.join(HERE, "capcut")
FONT = "/usr/share/fonts/truetype/fonts-japanese-gothic.ttf"

# ── 参考動画から実測した配色 ─────────────────────────────
DARK_BOX = (0x0d, 0x1f, 0x1a)      # 暗色ボックス
DARK_A   = 0.86                    # その不透明度
AMBER    = (0xd4, 0xa9, 0x6a)      # 強調ボックス（実測 #d9a65e/#d4a257 と一致）
FG       = (0xf4, 0xef, 0xe2)      # 白文字
INK      = (0x0d, 0x1f, 0x1a)      # 強調ボックス内の文字
SHADOW   = (0x00, 0x00, 0x00)

SAFE_L, SAFE_R = 72, 1008          # 左右の余白
MAXW = 900                         # テロップの最大幅（右のUIボタン列を避ける）
BLOCK_BOTTOM = 1500                # テロップ帯の下端（実測した「静かな帯」1150〜1500に収める）

IMAGES = [                          # 提供順（物語順）
    "c8d53727-1000002572.png",      # 1 親子がプラケースのカメを見ている
    "3e946837-1000002573.png",      # 2 スマホで調べる
    "eebe9a7e-1000002574.png",      # 3 驚く
    "3a63cbbb-1000002575.png",      # 4 画面を指差す
    "01cdbfb8-1000002576.png",      # 5 納得して笑顔
]

# ── 台本（style: dark / amber / plain）────────────────────
CUTS = [
    dict(img=0, dur=4.6, lines=[
        dict(t="この子のこと、",     size=72, style="dark",  at=0.10),
        dict(t="どこまで知ってる？", size=66, style="amber", at=0.95),
    ]),
    dict(img=1, dur=4.4, lines=[
        dict(t="カメには",           size=72, style="dark",  at=0.10),
        dict(t="ふしぎが たくさん",  size=68, style="amber", at=0.95),
    ]),
    dict(img=2, dur=4.4, lines=[
        dict(t="甲羅は ぬげない",    size=70, style="dark",  at=0.10),
        dict(t="知ってた？",         size=72, style="amber", at=0.95),
    ]),
    dict(img=3, dur=4.6, lines=[
        dict(t="こどもが 自分で読める", size=60, style="dark",  at=0.10),
        dict(t="漢字ぜんぶに ふりがな", size=60, style="amber", at=0.95),
    ]),
    dict(img=4, dur=5.5, lines=[
        dict(t="こども向けページ「カメふしぎ島」", size=34, style="plain", at=0.10),
        dict(t="「カメライフガイド」で検索",       size=58, style="amber", at=0.55),
        dict(t="無料・登録不要／商品リンクなし",   size=32, style="plain", at=1.30),
    ]),
]

DUR = sum(c["dur"] for c in CUTS)
XF = 0.35                            # クロスディゾルブ

BADGE = "カメライフガイド"

def fit_font(txt, size):
    """最大幅に収まるまでサイズを下げる（文字切れを起こさない）"""
    while size > 22:
        f = ImageFont.truetype(FONT, size)
        if ImageDraw.Draw(Image.new("RGB", (10, 10))).textlength(txt, font=f) <= MAXW - 56:
            return f, size
        size -= 2
    return ImageFont.truetype(FONT, size), size

def load_bg(name):
    """1080x1920 に合わせる（アスペクトがほぼ同一なのでリサイズのみ）"""
    im = Image.open(os.path.join(UPLOAD, name)).convert("RGB")
    sc = max(W/im.width, H/im.height)
    im = im.resize((int(im.width*sc+0.5), int(im.height*sc+0.5)), Image.LANCZOS)
    x = (im.width - W)//2
    y = (im.height - H)//2
    return im.crop((x, y, x+W, y+H))

def ken_burns(base, u):
    """ゆっくりした寄り（1.00→1.06）。静止画の並びに見せないため全フレームで変化させる"""
    z = 1.00 + 0.06*u
    nw, nh = int(W*z), int(H*z)
    im = base.resize((nw, nh), Image.BILINEAR)
    x = (nw - W)//2
    y = int((nh - H)*0.42)
    return im.crop((x, y, x+W, y+H))

def rr(d, box, r, fill):
    d.rounded_rectangle(box, radius=r, fill=fill)

def draw_badge(img):
    d = ImageDraw.Draw(img, "RGBA")
    f = ImageFont.truetype(FONT, 30)
    tw = d.textlength(BADGE, font=f)
    x0, y0 = 48, 92
    w = int(30 + 12 + tw + 26)
    rr(d, [x0, y0, x0+w, y0+56], 13, (*DARK_BOX, 225))
    rr(d, [x0+14, y0+15, x0+40, y0+41], 7, (*AMBER, 255))
    d.text((x0+52, y0+13), BADGE, font=f, fill=(*FG, 255))

def line_layers(lines):
    """行のサイズを先に確定して、ブロック全体の高さを求める"""
    out, total = [], 0
    for ln in lines:
        f, size = fit_font(ln["t"], ln["size"])
        d = ImageDraw.Draw(Image.new("RGB", (10, 10)))
        tw = d.textlength(ln["t"], font=f)
        pad_x, pad_y = (18, 9) if ln["style"] == "plain" else (28, 15)
        h = int(size*1.30) + pad_y*2
        out.append(dict(**ln, font=f, size2=size, tw=tw, h=h, pad_x=pad_x, pad_y=pad_y))
        total += h + 14
    return out, total - 14

def draw_lines(img, layers, block_h, elapsed):
    d = ImageDraw.Draw(img, "RGBA")
    y = BLOCK_BOTTOM - block_h
    for L in layers:
        k = max(0.0, min(1.0, (elapsed - L["at"]) / 0.28))
        if k <= 0:
            y += L["h"] + 14
            continue
        e = 1 - (1-k)**3
        dy = int((1-e)*16)
        a = int(255*e)
        bx0 = (W - (L["tw"] + L["pad_x"]*2))/2
        bx1 = bx0 + L["tw"] + L["pad_x"]*2
        ty = y + L["pad_y"] + dy
        if L["style"] == "dark":
            rr(d, [bx0, y+dy, bx1, y+L["h"]+dy], 14, (*DARK_BOX, int(255*DARK_A*e)))
            d.text(((W-L["tw"])/2, ty), L["t"], font=L["font"], fill=(*FG, a))
        elif L["style"] == "amber":
            rr(d, [bx0, y+dy, bx1, y+L["h"]+dy], 14, (*AMBER, a))
            d.text(((W-L["tw"])/2, ty), L["t"], font=L["font"], fill=(*INK, a))
        else:
            # 小文字は明るい木目の上に乗るため、実測でコントラスト3.15:1（AA不合格）だった。
            # 薄い暗色プレートを敷いて数値でAAを満たす（目視で判断しない）。
            rr(d, [bx0, y+dy, bx1, y+L["h"]+dy], 10, (*DARK_BOX, int(255*0.58*e)))
            d.text(((W-L["tw"])/2, ty), L["t"], font=L["font"], fill=(*FG, a))
        y += L["h"] + 14

def render():
    bases = [load_bg(n) for n in IMAGES]
    layers = []
    for c in CUTS:
        L, bh = line_layers(c["lines"])
        layers.append((L, bh))

    bounds, acc = [], 0.0
    for i, c in enumerate(CUTS):
        bounds.append((acc, acc+c["dur"], i)); acc += c["dur"]

    exe = imageio_ffmpeg.get_ffmpeg_exe()
    p = subprocess.Popen([exe, "-y", "-f", "rawvideo", "-vcodec", "rawvideo",
                          "-s", "%dx%d" % (W, H), "-pix_fmt", "rgb24", "-r", str(FPS), "-i", "-",
                          "-an", "-vcodec", "libx264", "-preset", "medium", "-crf", "19",
                          "-pix_fmt", "yuv420p", "-movflags", "+faststart", OUT],
                         stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
    nfr = int(DUR*FPS)
    for fi in range(nfr):
        t = fi/FPS
        idx = 0
        for t0, t1, i in bounds:
            if t0 <= t < t1:
                idx = i; break
        else:
            idx = len(CUTS)-1
        t0, t1, _ = bounds[idx]
        u = (t - t0)/(t1 - t0)
        img = ken_burns(bases[idx], u)
        # クロスディゾルブ（前カットから）
        if idx > 0 and (t - t0) < XF:
            pt0, pt1, _ = bounds[idx-1]
            pu = min(1.0, (t - pt0)/(pt1 - pt0))
            prev = ken_burns(bases[idx-1], pu)
            img = Image.blend(prev, img, (t - t0)/XF)
        draw_badge(img)
        draw_lines(img, layers[idx][0], layers[idx][1], t - t0)
        p.stdin.write(img.tobytes())
        if fi % 150 == 0:
            print("  render %4d/%d" % (fi, nfr))
    p.stdin.close()
    rc = p.wait()
    if rc != 0:
        print(p.stderr.read().decode()[-600:]); sys.exit(1)
    print("完成: %s  %.2f MB / %.1f秒" % (OUT, os.path.getsize(OUT)/1e6, DUR))

def export_capcut():
    """CapCut に持ち込むための素材と台本を書き出す"""
    os.makedirs(CAPCUT, exist_ok=True)
    for i, n in enumerate(IMAGES, 1):
        load_bg(n).save(os.path.join(CAPCUT, "cut%02d.png" % i))
    L = ["# CapCut用 テロップ台本 — カメふしぎ島", "",
         "素材: `cut01.png` 〜 `cut05.png`（1080x1920 に変換済み）",
         "総尺: **%.1f秒** ／ 1080x1920 / 30fps" % DUR, "",
         "## 共通設定", "",
         "| 項目 | 値 |", "|------|-----|",
         "| 暗色ボックス | `#0d1f1a` 不透明度 86% / 角丸14px / 左右padding 28px |",
         "| 強調ボックス | `#d4a96a` 不透明度 100% / 角丸14px / 文字色 `#0d1f1a` |",
         "| 白文字 | `#f4efe2` |",
         "| 補助の小文字 | 暗色プレート `#0d1f1a` 不透明度 58% ＋ 白文字（明るい木目の上でAAを満たすため）|",
         "| フォント | 太めのゴシック（源ノ角ゴシック Bold 等） |",
         "| テロップ帯の下端 | 画面上から **1500px**（下から420px）|",
         "| 左上バッジ | 暗色ピル＋アンバー角丸四角＋白文字「カメライフガイド」 |",
         "| 画の動き | 各カット 1.00→1.06 のゆっくりした寄り |",
         "| つなぎ | クロスディゾルブ 0.35秒 |", "",
         "## タイムライン", "",
         "| カット | 素材 | 開始 | 終了 | テロップ | 出現 | スタイル | サイズ |",
         "|-------|------|------|------|---------|------|---------|--------|"]
    acc = 0.0
    for i, c in enumerate(CUTS, 1):
        for j, ln in enumerate(c["lines"]):
            _, sz = fit_font(ln["t"], ln["size"])
            L.append("| %s | cut%02d.png | %s | %s | %s | +%.2fs | %s | %dpx |" % (
                str(i) if j == 0 else "", i,
                "%.2fs" % acc if j == 0 else "", "%.2fs" % (acc+c["dur"]) if j == 0 else "",
                ln["t"], ln["at"],
                {"dark": "暗色ボックス", "amber": "強調ボックス", "plain": "白文字のみ"}[ln["style"]], sz))
        acc += c["dur"]
    L += ["", "## 投稿時の設定（案）", "",
          "- キャプション: カメのふしぎ、こどもが自分で読めるページを作りました🐢 ぜんぶの漢字にふりがな付き",
          "- ハッシュタグ: #カメ #亀 #こども #自由研究 #親子 #カメライフガイド",
          "- 誘導先: https://kamelifeguide.com/kids/index.html", "",
          "## 注意", "",
          "- 音声は入れていません。CapCut でナレーションまたはBGM（80〜100BPM）を追加してください。",
          "- 画面右側と下部はTikTokのUIが重なるため、テロップは中央〜下寄り（下端1500px）に固定しています。"]
    open(os.path.join(CAPCUT, "telop-script.md"), "w", encoding="utf-8").write("\n".join(L) + "\n")
    print("CapCut素材: %s（画像5枚 + telop-script.md）" % CAPCUT)

if __name__ == "__main__":
    print("=== 事前チェック ===")
    for n in IMAGES:
        pth = os.path.join(UPLOAD, n)
        assert os.path.exists(pth), "画像がありません: %s" % pth
    print("  素材5枚 OK / 総尺 %.1f秒 / %dx%d" % (DUR, W, H))
    for c in CUTS:
        for ln in c["lines"]:
            f, sz = fit_font(ln["t"], ln["size"])
            if sz != ln["size"]:
                print("  自動縮小: %r %d→%dpx（幅%dpxに収めるため）" % (ln["t"], ln["size"], sz, MAXW))
    render()
    export_capcut()
