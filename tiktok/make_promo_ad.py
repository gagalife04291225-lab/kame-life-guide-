#!/usr/bin/env python3
"""
KAME LIFE GUIDE / TikTok 実写素材版「カメライフガイド」宣伝（ナレーション付き）

make_photo_ad.py（テロップ配色・レイアウトはオーナーの参考動画から実測済み）を
土台にして、素材はそのまま、**台本だけ差し替える**。映像生成ロジックは再実装しない。

台本の方針（重要）:
  写っているのは **ミシシッピアカミミガメ**。自社サイト
  compare/painted-vs-red-eared-slider.html が次のように明記している。

    「2023年6月から条件付特定外来生物に指定され、新規の購入・入手・販売・譲渡・放流が
      禁止されました。ただし、すでに飼っている個体を届け出等の条件のもとで
      終生飼育することは認められています。」

  したがって本動画を「飼ってみよう」の宣伝にすることは **できない**
  （DEVELOPMENT_CONSTITUTION §5.3-R3: 条件付特定外来は「新規購入不可」を強調 MUST）。
  この規制事実そのものをフックにし、「今いる子は終生飼育できる → だから正しく育てよう」
  という導線にする。専門サイトとしての誠実さと、TikTok のフック要件を同時に満たす。

  「川で捕まえてきた」設定は使わない（kids/chuui.html の教育方針と矛盾するため）。

ナレーション:
  tools/tts/narration-promo.json を GitHub Actions 上の Edge TTS で合成して多重化する
  （本セッション環境からは Edge TTS へ到達できないため）。

出力:
  tiktok/tiktok-promo-akamimi.mp4   映像のみ（音声は Actions で付与）
"""
import os, sys, json

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import make_photo_ad as m

# ── 素材（提供順＝物語順）──────────────────────────────
m.IMAGES = [
    "c8d53727-1000002572.png",      # 1 親子がプラケースのカメをのぞきこむ
    "3e946837-1000002573.png",      # 2 スマホで調べる
    "eebe9a7e-1000002574.png",      # 3 驚く
    "3a63cbbb-1000002575.png",      # 4 スマホに「カメふしぎ島」の画面
    "01cdbfb8-1000002576.png",      # 5 納得して笑顔
]

# ── 台本 ───────────────────────────────────────────────
# style: dark（暗色ボックス+白文字）/ amber（アンバー地+暗色文字）/ plain（薄い暗色プレート）
m.CUTS = [
    dict(img=0, dur=4.8, lines=[
        dict(t="このカメ、実は",        size=72, style="dark",  at=0.10),
        dict(t="もう新しく飼えません",  size=62, style="amber", at=1.05),
    ]),
    dict(img=1, dur=4.6, lines=[
        dict(t="ミシシッピアカミミガメ", size=54, style="dark",  at=0.10),
        dict(t="条件付特定外来生物",     size=62, style="amber", at=1.00),
    ]),
    dict(img=2, dur=4.8, lines=[
        dict(t="でも、今いる子は",      size=68, style="dark",  at=0.10),
        dict(t="終生飼育できます",      size=66, style="amber", at=1.00),
    ]),
    dict(img=3, dur=4.8, lines=[
        dict(t="正しい飼い方は",        size=68, style="dark",  at=0.10),
        dict(t="カメライフガイド",      size=66, style="amber", at=1.00),
    ]),
    dict(img=4, dur=5.4, lines=[
        dict(t="飼育ガイド・診断・こども向けページ", size=34, style="plain", at=0.10),
        dict(t="「カメライフガイド」で検索",         size=56, style="amber", at=0.60),
        dict(t="無料・登録不要",                     size=32, style="plain", at=1.35),
    ]),
]
m.DUR = sum(c["dur"] for c in m.CUTS)

# ── 1カット目だけテロップ帯を上げる ──────────────────────
# 実測（フレーム確認）: 既定の帯（下端1500px）はプラケースのカメに重なり、
# 「このカメ」と言っている冒頭で主役が見えなくなる。冒頭3秒は最重要なので、
# このカットだけ帯を上げて被写体を残す。他カットは既定のまま。
_HOOK_BOTTOM = 1180
_orig_draw_lines = m.draw_lines

def _draw_lines_patched(img, layers, block_h, elapsed):
    hook = bool(layers) and layers[0]["t"] == m.CUTS[0]["lines"][0]["t"]
    keep = m.BLOCK_BOTTOM
    m.BLOCK_BOTTOM = _HOOK_BOTTOM if hook else keep
    try:
        _orig_draw_lines(img, layers, block_h, elapsed)
    finally:
        m.BLOCK_BOTTOM = keep

m.draw_lines = _draw_lines_patched
m.OUT = os.path.join(HERE, "tiktok-promo-akamimi.mp4")
m.CAPCUT = os.path.join(HERE, "capcut-promo")

# ── ナレーション原稿（テロップの文言のみ。新しい主張は足さない）──
# 各カットの開始時刻に合わせる。slot はそのカットの尺。
def narration_spec():
    segs, acc = [], 0.0
    texts = [
        "このカメ、実はもう新しく飼えません",
        # 実測: フルネームだと nanami 音声で +0.70s 超過（slot 4.6s）。
        # サイト全体で通称「アカミミガメ」を併用しているため短い方を読む。
        # テロップは正式名「ミシシッピアカミミガメ」のまま表示する。
        "アカミミガメ。条件付特定外来生物です",
        "でも、今いる子は終生飼育できます",
        "正しい飼い方は、カメライフガイド",
        "カメライフガイドで検索。無料、登録不要",
    ]
    for c, t in zip(m.CUTS, texts):
        segs.append({"start": round(acc, 2), "slot": c["dur"], "text": t})
        acc += c["dur"]
    return {
        "video": "tiktok/tiktok-promo-akamimi.mp4",
        "total_sec": round(m.DUR, 2),
        "note": "テロップ文言のみを音声化。新しい事実主張は追加しない。"
                "規制の記述は compare/painted-vs-red-eared-slider.html に準拠。",
        "voices": [{"id": "nanami", "voice": "ja-JP-NanamiNeural"},
                   {"id": "keita",  "voice": "ja-JP-KeitaNeural"}],
        "segments": segs,
    }

if __name__ == "__main__":
    print("=== 事前チェック ===")
    for n in m.IMAGES:
        p = os.path.join(m.UPLOAD, n)
        assert os.path.exists(p), "画像がありません: %s" % p
    print("  素材5枚 OK / 総尺 %.1f秒 / %dx%d" % (m.DUR, m.W, m.H))
    for c in m.CUTS:
        for ln in c["lines"]:
            f, sz = m.fit_font(ln["t"], ln["size"])
            if sz != ln["size"]:
                print("  自動縮小: %r %d→%dpx" % (ln["t"], ln["size"], sz))

    m.render()

    spec = narration_spec()
    out = os.path.join(os.path.dirname(HERE), "tools", "tts", "narration-promo.json")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    json.dump(spec, open(out, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    print("ナレーション原稿: %s（%d本 / 総尺 %.1f秒）"
          % (out, len(spec["segments"]), spec["total_sec"]))
