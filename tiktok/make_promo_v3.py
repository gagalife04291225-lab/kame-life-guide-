#!/usr/bin/env python3
"""
KAME LIFE GUIDE / TikTok 30秒動画 v3 — 評価基準 v2.0 準拠

docs/marketing/tiktok/EVALUATION-STANDARD-v2.md のレイヤーA（事前ゲート）を
ビルド時に検査し、違反したら生成を中止する。

v2 からの変更点と根拠:
  尺 24.3s → 30.0s     TikTok 2026 の最適帯 15-30秒。構成も研究どおりに割る
                       （0-3秒フック / 4-20秒本編 / 21-25秒交流 / 26-30秒保存CTA）
  構成       クイズ型フック    「最初の1秒で次の5秒を予測させる」（ごっこ倶楽部）を
                       満たす形。問い→選択肢→答え は続きが読めるので離脱しにくく、
                       知識・教育系は 2026 のレコメンドで優遇される傾向
  A8 追加    保存CTAを末尾6秒に配置。第3段階拡散は保存・シェアが鍵
  A9 追加    最終カットを冒頭と同じ画・同じ文言に戻してループ接続（再視聴シグナル）
  A7 追加    全発話に画面テキスト（字幕で平均視聴時間 +12%）

台本の根拠（すべて検証済み。新しい主張は足さない）:
  「甲羅は50〜60個の骨」「背骨と肋骨が一体化」「だから脱げない」
       … 動画#1（tiktok-01-v3-ds）で検証済みの内容と同一
  「漢字ぜんぶに ふりがな」        kids/index.html の JSON-LD
  「アカミミガメは新規飼育不可」    compare/painted-vs-red-eared-slider.html

  ※ 素材はAI生成の家族写真。運営者本人ではないため一人称の語りは使わない。

未解決（亀好きさんの判断待ち）:
  A13「1アカウント1ニッチ」は本動画単体では満たすが、
  アカウント全体の方針が未決のため **保留** として扱う。

出力:
  tiktok/tiktok-30s-v3.mp4       映像のみ（音声は Actions の Edge TTS で付与）
  tools/tts/narration-promo.json ナレーション原稿（男性音声）
"""
import os, sys, json, statistics as st

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import make_photo_ad as m
import make_promo_v2 as v2

OUT = os.path.join(HERE, "tiktok-30s-v3.mp4")

IMAGES = [
    "c8d53727-1000002572.png",      # 0 親子がプラケースのカメをのぞきこむ
    "3e946837-1000002573.png",      # 1 スマホで調べる
    "eebe9a7e-1000002574.png",      # 2 驚く
    "3a63cbbb-1000002575.png",      # 3 スマホに「カメふしぎ島」
    "01cdbfb8-1000002576.png",      # 4 納得して笑顔
]

# 21カットぶんの画を5枚から作るため、切り出しを追加する
v2.CROPS.update({
    (0, "turtle"): (1.95, 2.05, 0.40, 0.80),   # カメだけに寄る
    (1, "girl"):   (1.52, 1.59, 0.70, 0.45),
    (2, "girl"):   (1.52, 1.59, 0.72, 0.44),
    (4, "girl"):   (1.50, 1.57, 0.70, 0.42),
    (3, "hand"):   (1.70, 1.78, 0.42, 0.62),
})

# ── 台本（0-3秒フック / 本編 / 交流 / 26-30秒 保存CTA）──────
CUTS = [
    # ── 0-3秒: フック（問いを3カットで出し切る）
    dict(img=0, crop="case",   dur=1.0, bottom=1180, lines=[
        dict(t="カメの甲羅",        size=80, style="dark")]),
    dict(img=0, crop="turtle", dur=1.0, bottom=1180, lines=[
        dict(t="何個の骨で",        size=76, style="dark")]),
    dict(img=2, crop="face",   dur=1.0, bottom=1440, lines=[
        dict(t="できてる？",        size=80, style="amber")]),
    # ── 選択肢（続きが読める＝離脱しにくい）
    dict(img=0, crop="wide",   dur=1.5, bottom=1440, lines=[
        dict(t="① 1個",            size=58, style="dark"),
        dict(t="② 10個",           size=58, style="dark"),
        dict(t="③ 50個以上",       size=58, style="dark")]),
    dict(img=1, crop="phone",  dur=1.5, bottom=1440, lines=[
        dict(t="答えは…",           size=78, style="dark")]),
    # ── 答え（驚きのピーク）
    dict(img=2, crop="face",   dur=1.6, bottom=1440, lines=[
        dict(t="50〜60個",          size=88, style="amber")]),
    dict(img=2, crop="wide",   dur=1.5, bottom=1440, lines=[
        dict(t="背骨と肋骨が",      size=68, style="dark")]),
    dict(img=0, crop="turtle", dur=1.5, bottom=1180, lines=[
        dict(t="一体化してる",      size=70, style="amber")]),
    dict(img=0, crop="case",   dur=1.4, bottom=1180, lines=[
        dict(t="だから",            size=80, style="dark")]),
    dict(img=3, crop="wide",   dur=1.6, bottom=1440, lines=[
        dict(t="甲羅は脱げない",    size=72, style="amber")]),
    # ── 危険の提示（実用価値＝保存動機）
    dict(img=1, crop="wide",   dur=1.5, bottom=1440, lines=[
        dict(t="はがそうとすると",  size=64, style="dark")]),
    dict(img=2, crop="girl",   dur=1.6, bottom=1440, lines=[
        dict(t="背骨をはがすこと",  size=64, style="amber")]),
    dict(img=0, crop="turtle", dur=1.5, bottom=1180, lines=[
        dict(t="絶対にダメ",        size=80, style="dark")]),
    # ── 交流（コメント誘導）
    dict(img=1, crop="girl",   dur=1.4, bottom=1440, lines=[
        dict(t="知ってた？",        size=76, style="amber")]),
    dict(img=4, crop="face",   dur=1.5, bottom=1440, lines=[
        dict(t="コメントで教えて",  size=60, style="dark")]),
    # ── 価値の提示
    dict(img=3, crop="scr",    dur=1.5, bottom=1440, lines=[
        dict(t="カメのふしぎ、まだある", size=52, style="amber")]),
    dict(img=3, crop="hand",   dur=1.5, bottom=1440, lines=[
        dict(t="漢字ぜんぶに ふりがな", size=54, style="dark")]),
    dict(img=3, crop="girl",   dur=1.5, bottom=1440, lines=[
        dict(t="こどもが自分で読める",  size=54, style="amber")]),
    # ── 26-30秒: 保存CTA
    dict(img=4, crop="girl",   dur=1.4, bottom=1440, lines=[
        dict(t="保存して あとで見せて", size=54, style="amber")]),
    dict(img=4, crop="cta",    dur=2.0, bottom=1470, lines=[
        dict(t="カメライフガイド",            size=66, style="amber"),
        dict(t="プロフィールから",            size=42, style="plain"),
        dict(t="※アカミミガメは新規飼育不可", size=26, style="plain")]),
    # ── ループ接続（冒頭と同じ画・同じ文言に戻す）
    dict(img=0, crop="case",   dur=1.0, bottom=1180, lines=[
        dict(t="カメの甲羅",        size=80, style="dark")]),
]
DUR = sum(c["dur"] for c in CUTS)

# ── ナレーション（男性・全発話に対応する画面テキストがある）──
NARRATION = [
    (0.0,  4.5, "カメの甲羅、何個の骨でできてる？"),
    (4.5,  3.1, "答えは、五十から六十個"),
    (7.6,  3.0, "背骨と肋骨が一体化"),
    (10.6, 3.0, "だから、甲羅は脱げない"),
    (13.6, 3.1, "背骨をはがすのと同じ"),
    (16.7, 2.9, "絶対にダメ"),
    (19.6, 3.0, "コメントで教えて"),
    (22.6, 3.0, "漢字ぜんぶに、ふりがな"),
    (25.6, 1.4, "保存して"),   # 実測: 「保存してね」は+0.38s超過
    (27.0, 3.0, "カメライフガイド"),
]


def _cut_windows():
    """各カットの [開始, 終了) を返す"""
    out, acc = [], 0.0
    for c in CUTS:
        out.append((acc, acc + c["dur"], c)); acc += c["dur"]
    return out


def _covered(seg):
    """その発話が流れている間、画面にテロップが出ているか（A7の実検査）。
    常に真になる書き方をしないこと。前回 `ffmpeg -version | head -1` で
    欠落を見逃した反省による。"""
    s, sl, _ = seg
    e = s + sl
    for t0, t1, c in _cut_windows():
        if t0 < e and t1 > s and c["lines"]:
            return True
    return False


def text_covers_speech():
    return all(_covered(n) for n in NARRATION)


def gate():
    """評価基準 v2.0 レイヤーA のうち、機械判定できる項目"""
    d = [c["dur"] for c in CUTS]
    total = sum(d)
    head = sum(1 for i, _ in enumerate(d) if sum(d[:i]) < 3.0)
    save_cta = any(sum(d[:i]) >= total - 6.0 and
                   any("保存" in ln["t"] or "シェア" in ln["t"] for ln in c["lines"])
                   for i, c in enumerate(CUTS))
    loop = (CUTS[0]["img"] == CUTS[-1]["img"] and
            CUTS[0]["crop"] == CUTS[-1]["crop"])
    checks = [
        ("A1  尺 15-34秒",            15.0 <= total <= 34.0, "%.1f s" % total),
        ("A3  冒頭3秒のカット >=3",    head >= 3,             "%d 本" % head),
        ("A4  変化の中央値 <=1.8s",    st.median(d) <= 1.8,   "%.2f s" % st.median(d)),
        ("A5  最長カット <=2.2s",      max(d) <= 2.2,         "%.2f s" % max(d)),
        ("A6  カット/10秒 >=5.0",      (len(d)-1)/(total/10) >= 5.0,
                                       "%.2f" % ((len(d)-1)/(total/10))),
        ("A7  全発話に画面テキスト",    text_covers_speech(), "%d/%d 発話" %
                                       (sum(1 for n in NARRATION if _covered(n)), len(NARRATION))),
        ("A8  末尾6秒に保存CTA",       save_cta,              "あり" if save_cta else "なし"),
        ("A9  ループ接続",             loop,                  "あり" if loop else "なし"),
    ]
    print("=== 評価基準 v2.0 レイヤーA ===")
    ng = 0
    for name, ok, val in checks:
        print("  %-26s %-10s %s" % (name, val, "OK" if ok else "★違反"))
        ng += 0 if ok else 1
    print("  総尺 %.1f秒 / %dカット" % (total, len(d)))
    print("  A13 1アカウント1ニッチ … **保留**（アカウント方針が未決のため）")
    if ng:
        print("違反があるため生成を中止する")
        sys.exit(1)


def write_narration():
    end = NARRATION[-1][0] + NARRATION[-1][1]
    assert end <= DUR + 1e-6, "ナレーションが尺を超えている: %.2f > %.2f" % (end, DUR)
    prev = 0.0
    for s, sl, _ in NARRATION:
        assert s + 1e-9 >= prev, "ナレーションが重なっている"
        prev = s + sl
    spec = {
        "video": "tiktok/tiktok-30s-v3.mp4",
        "total_sec": round(DUR, 2),
        "note": "評価基準v2.0準拠の30秒版。テロップ文言のみを音声化。男性音声。",
        "voices": [{"id": "keita", "voice": "ja-JP-KeitaNeural"}],
        "segments": [{"start": s, "slot": sl, "text": t} for s, sl, t in NARRATION],
    }
    out = os.path.join(os.path.dirname(HERE), "tools", "tts", "narration-promo.json")
    json.dump(spec, open(out, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    print("ナレーション原稿: %s（%d本 / 終端 %.1f秒）" % (out, len(NARRATION), end))


if __name__ == "__main__":
    for n in IMAGES:
        assert os.path.exists(os.path.join(m.UPLOAD, n)), "画像がない: %s" % n
    gate()
    for c in CUTS:
        for ln in c["lines"]:
            f, sz = m.fit_font(ln["t"], ln["size"])
            if sz != ln["size"]:
                print("  自動縮小: %r %d→%dpx" % (ln["t"], ln["size"], sz))
    # v2 の描画エンジンをそのまま使う（映像ロジックは再実装しない）
    v2.IMAGES, v2.CUTS, v2.DUR, v2.OUT = IMAGES, CUTS, DUR, OUT
    v2.render()
    write_narration()
