#!/usr/bin/env python3
"""
KAME LIFE GUIDE / TikTok 宣伝 v2（実写素材・高速カット・ナレーション付き）

v1 の失敗を実測で特定して作り直したもの。

v1 の何がダメだったか（自社 DS v1.0 で採点した実測値）:
    カット/10秒     2.05  （基準 >= 2.50）  ✗ 違反
    カット長 中央値 4.80s （基準 <= 2.00s） ✗ 違反
    冒頭3秒のカット   1本 （基準 >= 2本）   ✗ 違反
  写真広告の経路だけ DS ゲートを通していなかったため、
  「ゆっくり流れる紙芝居」になっていた。今の短尺動画としては2〜3倍遅い。

  台本も弱かった。規制の告知が主題になっていて、視聴者に当事者性が無い
  （「新しく飼えません」→ 飼っていない人には他人事）。

v2 の方針:
  1. 素材5枚を**寄り・引き・部位違い**で切り出し、16カットに分解して速度を作る
  2. つなぎはハードカット（ディゾルブは廃止）。冒頭3秒に3カット入れる
  3. 台本を「子どもの質問に答えられますか？」の当事者性フックに変更。
     写真の親子・スマホ・驚き・笑顔という並びとも一致する
  4. DS v1.0 をビルド時に検査し、違反したら**動画を作らせない**

台本の根拠（すべてリポジトリ内の実在ページ。新しい主張は足さない）:
    「甲羅は ぬげない」「背骨と肋骨」  kids/fushigi.html / 動画#1 で検証済み
    「漢字ぜんぶに ふりがな」          kids/index.html の JSON-LD
    「商品リンク なし」                kids/chuui.html
    「アカミミガメは新規飼育不可」      compare/painted-vs-red-eared-slider.html
                                       （憲法 §5.3-R3 の MUST を小文字で明示）

  ※ 素材はAI生成の家族写真。運営者本人の家族ではないため、
    「うちの子が」等の一人称の語りは使わない（事実誤認を作らない）。

出力:
  tiktok/tiktok-promo-v2.mp4        映像のみ（音声は Actions の Edge TTS で付与）
  tools/tts/narration-promo.json    ナレーション原稿（男性音声のみ）
"""
import os, sys, json, statistics as st, subprocess
from PIL import Image, ImageDraw, ImageFont
import imageio_ffmpeg

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import make_photo_ad as m           # 配色・バッジ・フォント調整を再利用

W, H, FPS = m.W, m.H, m.FPS
OUT = os.path.join(HERE, "tiktok-promo-v2.mp4")

IMAGES = [
    "c8d53727-1000002572.png",      # 0 親子がプラケースのカメをのぞきこむ
    "3e946837-1000002573.png",      # 1 スマホで調べる
    "eebe9a7e-1000002574.png",      # 2 驚く
    "3a63cbbb-1000002575.png",      # 3 スマホに「カメふしぎ島」
    "01cdbfb8-1000002576.png",      # 4 納得して笑顔
]

# 切り出し: (開始ズーム, 終了ズーム, 中心x, 中心y) — 5枚から多様な画を作る
CROPS = {
    (0, "case"):  (1.34, 1.41, 0.50, 0.78),
    (0, "girl"):  (1.55, 1.62, 0.28, 0.42),
    (0, "wide"):  (1.00, 1.05, 0.50, 0.45),
    (1, "phone"): (1.50, 1.57, 0.42, 0.55),
    (1, "wide"):  (1.02, 1.08, 0.50, 0.45),
    (2, "face"):  (1.45, 1.52, 0.50, 0.40),
    (2, "wide"):  (1.00, 1.06, 0.50, 0.45),
    (3, "scr"):   (1.58, 1.65, 0.48, 0.47),
    (3, "girl"):  (1.50, 1.57, 0.72, 0.42),
    (3, "wide"):  (1.05, 1.10, 0.50, 0.45),
    (4, "face"):  (1.40, 1.47, 0.52, 0.38),
    (4, "wide"):  (1.02, 1.08, 0.50, 0.45),
    (4, "cta"):   (1.10, 1.17, 0.50, 0.45),
}

# ── 台本 ───────────────────────────────────────────────
# bottom: テロップ帯の下端。被写体を隠さない位置を実測で決める。
CUTS = [
    dict(img=0, crop="case",  dur=1.3, bottom=1180, lines=[
        dict(t="カメって、",           size=78, style="dark")]),
    dict(img=0, crop="girl",  dur=1.3, bottom=1440, lines=[
        dict(t="なんで甲羅があるの？", size=60, style="amber")]),
    dict(img=0, crop="wide",  dur=1.4, bottom=1180, lines=[
        dict(t="子どもに聞かれて、",   size=64, style="dark")]),
    dict(img=2, crop="face",  dur=1.4, bottom=1440, lines=[
        dict(t="答えられますか？",     size=68, style="amber")]),
    dict(img=1, crop="phone", dur=1.3, bottom=1440, lines=[
        dict(t="調べても",             size=74, style="dark")]),
    dict(img=1, crop="wide",  dur=1.5, bottom=1440, lines=[
        dict(t="情報がバラバラ",       size=66, style="amber")]),
    dict(img=2, crop="wide",  dur=1.3, bottom=1440, lines=[
        dict(t="そこで作りました",     size=64, style="dark")]),
    dict(img=3, crop="scr",   dur=1.7, bottom=1440, lines=[
        dict(t="カメふしぎ島",         size=82, style="amber")]),
    dict(img=3, crop="wide",  dur=1.5, bottom=1440, lines=[
        dict(t="漢字ぜんぶに ふりがな", size=56, style="dark")]),
    dict(img=3, crop="girl",  dur=1.5, bottom=1440, lines=[
        dict(t="子どもが自分で読める", size=56, style="amber")]),
    dict(img=0, crop="case",  dur=1.3, bottom=1180, lines=[
        dict(t="たとえば",             size=76, style="dark")]),
    dict(img=2, crop="face",  dur=1.6, bottom=1440, lines=[
        dict(t="甲羅は ぬげない",      size=70, style="amber")]),
    dict(img=2, crop="wide",  dur=1.6, bottom=1440, lines=[
        dict(t="背骨と肋骨だから",     size=62, style="dark")]),
    dict(img=4, crop="face",  dur=1.5, bottom=1440, lines=[
        dict(t="商品リンク なし",      size=64, style="amber")]),
    dict(img=4, crop="wide",  dur=1.5, bottom=1440, lines=[
        dict(t="ぜんぶ無料",           size=78, style="dark")]),
    dict(img=4, crop="cta",   dur=2.6, bottom=1470, lines=[
        dict(t="カメライフガイド",              size=68, style="amber"),
        dict(t="プロフィールから",              size=42, style="plain"),
        dict(t="※アカミミガメは新規飼育不可",   size=26, style="plain")]),
]
DUR = sum(c["dur"] for c in CUTS)

# ── ナレーション（テロップの文言のみ。男性音声）──────────
NARRATION = [
    (0.0,  4.0, "カメって、なんで甲羅があるの？"),
    (4.0,  2.7, "答えられますか？"),
    (6.7,  2.8, "調べても、バラバラ"),
    (9.5,  3.2, "そこで作りました"),
    (12.7, 2.8, "漢字ぜんぶに、ふりがな"),
    (15.5, 3.2, "甲羅は、ぬげません"),
    (18.7, 3.0, "ぜんぶ無料"),
    (21.7, 2.6, "カメライフガイド"),
]


# ── DS v1.0 ゲート（違反したら作らせない）──────────────
def ds_gate():
    durs = [c["dur"] for c in CUTS]
    total = sum(durs)
    head = sum(1 for i, _ in enumerate(durs) if sum(durs[:i]) < 3.0)
    checks = [
        ("カット/10秒 >= 2.5",  (len(durs)-1)/(total/10) >= 2.5,
         "%.2f" % ((len(durs)-1)/(total/10))),
        ("カット長 中央値 <= 2.0s", st.median(durs) <= 2.0, "%.2f s" % st.median(durs)),
        ("冒頭3秒のカット >= 2",   head >= 2, "%d 本" % head),
        ("最長カット <= 3.0s",     max(durs) <= 3.0, "%.2f s" % max(durs)),
    ]
    print("=== DS v1.0 検査 ===")
    ng = 0
    for name, ok, val in checks:
        print("  %-24s %-9s %s" % (name, val, "OK" if ok else "★違反"))
        ng += 0 if ok else 1
    print("  総尺 %.1f秒 / %dカット" % (total, len(durs)))
    if ng:
        print("DS違反があるため生成を中止する")
        sys.exit(1)


def crop_frame(base, key, u):
    z0, z1, cx, cy = CROPS[key]
    z = z0 + (z1 - z0) * u
    nw, nh = int(W * z), int(H * z)
    im = base.resize((nw, nh), Image.BILINEAR)
    x = int(cx * nw - W / 2)
    y = int(cy * nh - H / 2)
    x = max(0, min(nw - W, x))
    y = max(0, min(nh - H, y))
    return im.crop((x, y, x + W, y + H))


def layout(lines):
    """行ごとにフォントを確定し、ブロック高さを求める"""
    out, total = [], 0
    for ln in lines:
        f, sz = m.fit_font(ln["t"], ln["size"])
        tw = ImageDraw.Draw(Image.new("RGB", (8, 8))).textlength(ln["t"], font=f)
        pad_x, pad_y = 28, 14
        h = int(sz * 1.34) + pad_y * 2
        out.append(dict(t=ln["t"], font=f, tw=tw, h=h, style=ln["style"],
                        pad_x=pad_x, pad_y=pad_y))
        total += h + 12
    return out, max(0, total - 12)


def draw_lines(img, layers, block_h, bottom, elapsed):
    """高速カット向け: 出現を 0.14秒に詰め、行ごとに 0.06秒だけずらす"""
    d = ImageDraw.Draw(img, "RGBA")
    y = bottom - block_h
    for i, L in enumerate(layers):
        k = max(0.0, min(1.0, (elapsed - i * 0.06) / 0.14))
        if k <= 0:
            y += L["h"] + 12
            continue
        e = 1 - (1 - k) ** 3
        dy = int((1 - e) * 14)
        a = int(255 * e)
        bx0 = (W - (L["tw"] + L["pad_x"] * 2)) / 2
        bx1 = bx0 + L["tw"] + L["pad_x"] * 2
        ty = y + L["pad_y"] + dy
        if L["style"] == "dark":
            m.rr(d, [bx0, y+dy, bx1, y+L["h"]+dy], 14, (*m.DARK_BOX, int(255*m.DARK_A*e)))
            d.text(((W-L["tw"])/2, ty), L["t"], font=L["font"], fill=(*m.FG, a))
        elif L["style"] == "amber":
            m.rr(d, [bx0, y+dy, bx1, y+L["h"]+dy], 14, (*m.AMBER, a))
            d.text(((W-L["tw"])/2, ty), L["t"], font=L["font"], fill=(*m.INK, a))
        else:
            # 明るい木目の上に乗る小文字は暗色プレートでAAを確保する
            m.rr(d, [bx0, y+dy, bx1, y+L["h"]+dy], 10, (*m.DARK_BOX, int(255*0.62*e)))
            d.text(((W-L["tw"])/2, ty), L["t"], font=L["font"], fill=(*m.FG, a))
        y += L["h"] + 12


def render():
    m.IMAGES = IMAGES
    bases = [m.load_bg(n) for n in IMAGES]
    lays = [layout(c["lines"]) for c in CUTS]

    bounds, acc = [], 0.0
    for i, c in enumerate(CUTS):
        bounds.append((acc, acc + c["dur"])); acc += c["dur"]

    exe = imageio_ffmpeg.get_ffmpeg_exe()
    p = subprocess.Popen([exe, "-y", "-f", "rawvideo", "-vcodec", "rawvideo",
                          "-s", "%dx%d" % (W, H), "-pix_fmt", "rgb24", "-r", str(FPS),
                          "-i", "-", "-an", "-vcodec", "libx264", "-preset", "medium",
                          "-crf", "19", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
                          OUT],
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
        u = (t - t0) / (t1 - t0)
        c = CUTS[idx]
        img = crop_frame(bases[c["img"]], (c["img"], c["crop"]), u)
        m.draw_badge(img)
        draw_lines(img, lays[idx][0], lays[idx][1], c["bottom"], t - t0)
        p.stdin.write(img.tobytes())
        if fi % 180 == 0:
            print("  render %4d/%d" % (fi, nfr))
    p.stdin.close()
    if p.wait() != 0:
        print(p.stderr.read().decode()[-800:]); sys.exit(1)
    print("完成: %s  %.2f MB / %.1f秒" % (OUT, os.path.getsize(OUT)/1e6, DUR))


def write_narration():
    spec = {
        "video": "tiktok/tiktok-promo-v2.mp4",
        "total_sec": round(DUR, 2),
        "note": "テロップ文言のみを音声化。新しい事実主張は追加しない。男性音声に決定済み。",
        "voices": [{"id": "keita", "voice": "ja-JP-KeitaNeural"}],
        "segments": [{"start": s, "slot": sl, "text": tx} for s, sl, tx in NARRATION],
    }
    out = os.path.join(os.path.dirname(HERE), "tools", "tts", "narration-promo.json")
    json.dump(spec, open(out, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    end = NARRATION[-1][0] + NARRATION[-1][1]
    assert end <= DUR + 1e-6, "ナレーションが動画尺を超えている: %.2f > %.2f" % (end, DUR)
    print("ナレーション原稿: %s（%d本 / 終端 %.1f秒）" % (out, len(NARRATION), end))


if __name__ == "__main__":
    for n in IMAGES:
        assert os.path.exists(os.path.join(m.UPLOAD, n)), "画像がない: %s" % n
    ds_gate()
    for c in CUTS:
        for ln in c["lines"]:
            f, sz = m.fit_font(ln["t"], ln["size"])
            if sz != ln["size"]:
                print("  自動縮小: %r %d→%dpx" % (ln["t"], ln["size"], sz))
    render()
    write_narration()
