#!/usr/bin/env python3
"""
KAME LIFE GUIDE / TikTok 30秒動画 v4 — 「かわいい」から入る大きさの話

v3（甲羅は何個の骨か）への指摘: **視聴者が知りたいことではない**。
作り手が作りやすいネタを選んでいた。正しい批判なので着眼点を変える。

v4 の着眼点:
  写真に写っているのは「小さなプラケースの中の、手のひらサイズのカメ」。
  そして自社データでは **アカミミガメの成体は 20〜30cm**（shindan/species.js）。
  つまり **この容器はいずれ必ず狭くなる**。
  これは
    ・写真そのものが問いになっている（容器が全カットに写っている）
    ・答えが意外（手のひら → お皿サイズ）
    ・カメを飼っている人には実用価値がある＝保存される
    ・サイトに答えがある（kid/index.html は甲長から容器の可否を判定するツール）
  という条件をすべて満たす。「かわいい」という感情から入り、
  「かわいいと思ったなら、今のうちに知っておこう」で着地する。

**「捕まえてきた」設定は使わない。**
  kids/chuui.html が「そとの カメを 持って かえる」を
  子ども向けに"やってはいけないこと"として教えているため、
  それを肯定する動画は自社の教育方針と矛盾する。

台本の根拠（すべてリポジトリ内の実データ。新しい主張は足さない）:
  「20〜30cm」          shindan/species.js
                        ミシシッピアカミミガメ size: 'L（20〜30cm）'
  「甲長を入れるだけ / 今使える・そろそろ卒業」
                        kid/index.html
                        「その容器、うちの子にまだ使える？｜甲長で選ぶ亀の飼育用品」
                        「うちの子の甲長から『今使えるもの・そろそろ卒業・
                          使わない方がいいもの』を確認」
  「新規飼育不可」      compare/painted-vs-red-eared-slider.html
  ※「お皿くらい」は 20〜30cm を直感的に伝えるための**大きさの比喩**であり、
    測定値ではない（一般的な大皿が23〜27cm前後）。

  ※ 素材はAI生成の家族写真。運営者本人ではないため一人称の語りは使わない。
  ※ 画面に「カメふしぎ島」が映る img3 は、甲長ツールの説明には使わない
    （画面と説明が食い違うため）。

出力:
  tiktok/tiktok-30s-v4.mp4
  tools/tts/narration-promo.json
"""
import os, sys, json, statistics as st

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import make_photo_ad as m
import make_promo_v2 as v2
import make_promo_v3 as v3          # ゲートと切り出し定義を再利用

OUT = os.path.join(HERE, "tiktok-30s-v4.mp4")
IMAGES = v3.IMAGES

CUTS = [
    # ── 0-3.4秒: 感情から入る → 問いを立てる（3カット）
    dict(img=0, crop="case",   dur=1.2, bottom=1180, lines=[
        dict(t="かわいい",              size=84, style="dark")]),
    dict(img=0, crop="turtle", dur=1.0, bottom=1180, lines=[
        dict(t="でも この子",           size=76, style="dark")]),
    dict(img=2, crop="face",   dur=1.2, bottom=1440, lines=[
        dict(t="どこまで大きくなる？",  size=58, style="amber")]),
    # ── 選択肢（続きが読める）
    dict(img=0, crop="wide",   dur=1.5, bottom=1440, lines=[
        dict(t="① 10cm",       size=58, style="dark"),
        dict(t="② 15cm",       size=58, style="dark"),
        dict(t="③ 20cm以上",   size=58, style="dark")]),
    dict(img=1, crop="phone",  dur=1.5, bottom=1440, lines=[
        dict(t="答えは…",               size=78, style="dark")]),
    # ── 答え（驚きのピーク）
    dict(img=2, crop="face",   dur=1.9, bottom=1440, lines=[
        dict(t="20〜30cm",              size=90, style="amber")]),
    dict(img=2, crop="wide",   dur=1.7, bottom=1440, lines=[
        dict(t="お皿くらいになる",      size=64, style="dark")]),
    dict(img=0, crop="turtle", dur=1.7, bottom=1180, lines=[
        dict(t="手のひらサイズは 今だけ", size=50, style="amber")]),
    # ── 自分ごと化（容器が全カットに写っているのが効く）
    dict(img=0, crop="case",   dur=1.4, bottom=1180, lines=[
        dict(t="この容器だと",          size=72, style="dark")]),
    dict(img=1, crop="wide",   dur=1.8, bottom=1440, lines=[
        dict(t="すぐ狭くなる",          size=74, style="amber")]),
    # ── 交流
    dict(img=3, crop="girl",   dur=1.5, bottom=1440, lines=[
        dict(t="知ってた？",            size=76, style="amber")]),
    dict(img=3, crop="scr",    dur=1.4, bottom=1440, lines=[
        dict(t="コメントで教えて",      size=58, style="dark")]),
    # ── 感情で受ける
    dict(img=2, crop="girl",   dur=1.7, bottom=1440, lines=[
        dict(t="かわいいと思ったなら",  size=56, style="dark")]),
    # ── 解決（甲長ツール。画面に別ページが映る img3 は使わない）
    dict(img=1, crop="phone",  dur=1.5, bottom=1440, lines=[
        dict(t="甲長を入れるだけで",    size=56, style="amber")]),
    dict(img=1, crop="wide",   dur=1.5, bottom=1440, lines=[
        dict(t="今 使える？",           size=72, style="dark")]),
    dict(img=0, crop="case",   dur=1.5, bottom=1180, lines=[
        dict(t="そろそろ卒業？",        size=66, style="amber")]),
    dict(img=4, crop="girl",   dur=1.4, bottom=1440, lines=[
        dict(t="が わかります",         size=64, style="dark")]),
    # ── 保存CTA（末尾6秒以内）
    dict(img=4, crop="face",   dur=1.4, bottom=1440, lines=[
        dict(t="保存して 測ってみて",   size=54, style="amber")]),
    dict(img=4, crop="cta",    dur=2.2, bottom=1470, lines=[
        dict(t="カメライフガイド",            size=66, style="amber"),
        dict(t="プロフィールから",            size=42, style="plain"),
        dict(t="※アカミミガメは新規飼育不可", size=26, style="plain")]),
    # ── ループ接続（冒頭と同じ画・同じ文言）
    dict(img=0, crop="case",   dur=1.0, bottom=1180, lines=[
        dict(t="かわいい",              size=84, style="dark")]),
]
DUR = sum(c["dur"] for c in CUTS)

NARRATION = [
    (0.0,  3.4, "この子、どこまで大きくなる？"),
    (3.4,  4.9, "答えは、二十から三十センチ"),
    (8.3,  3.4, "お皿くらいになります"),
    (11.7, 3.2, "この容器だと狭くなる"),
    (14.9, 2.9, "知ってた？"),
    (17.8, 3.2, "かわいいと思ったなら"),
    (21.0, 3.0, "甲長を入れるだけ"),
    (24.0, 2.8, "今使えるかわかります"),
    (26.8, 3.2, "保存して、測ってみて"),
]


if __name__ == "__main__":
    for n in IMAGES:
        assert os.path.exists(os.path.join(m.UPLOAD, n)), "画像がない: %s" % n

    # v3 のゲートをそのまま使う（基準は1本に保つ）
    v3.CUTS, v3.NARRATION = CUTS, NARRATION
    v3.gate()

    for c in CUTS:
        for ln in c["lines"]:
            f, sz = m.fit_font(ln["t"], ln["size"])
            if sz != ln["size"]:
                print("  自動縮小: %r %d→%dpx" % (ln["t"], ln["size"], sz))

    v2.IMAGES, v2.CUTS, v2.DUR, v2.OUT = IMAGES, CUTS, DUR, OUT
    v2.render()

    v3.DUR = DUR
    v3.write_narration()
    spec = json.load(open(os.path.join(os.path.dirname(HERE),
                                       "tools", "tts", "narration-promo.json"),
                          encoding="utf-8"))
    spec["video"] = "tiktok/tiktok-30s-v4.mp4"
    spec["note"] = ("v4: 「かわいい」から入り大きさ(20〜30cm)で驚かせ、"
                    "甲長ツールへ着地する構成。テロップ文言のみを音声化。男性音声。")
    json.dump(spec, open(os.path.join(os.path.dirname(HERE),
                                      "tools", "tts", "narration-promo.json"), "w",
                         encoding="utf-8"), ensure_ascii=False, indent=2)
    print("原稿の対象動画を v4 に更新")
