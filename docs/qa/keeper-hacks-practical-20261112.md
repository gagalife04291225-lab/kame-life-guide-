# 便利ワザ記事 QA（2026-11-12）



## 2026-11-12 便利ワザ記事の実用化

- BASE: f84fbc2e1894c3c878da618b5580bce0bb182ce7。公開前に main 179b1c19498929bc32964d6096ee3509a44644b6（PR #226）を競合なく取り込み。
- 26サイトの本文調査から8つの工夫を採用。水換え・清掃・温度/記録の3分類、短い効果説明と開閉式3手順。獣医・メーカー・飼育者の出典を区別し、本人の使用体験は追加しない。
- guides/keeper-hacks.html の既存購入URL8本/tagと飼育情報を保持。全ページ必須のGA4欠落とsitemap登録漏れを補修。
- 独立レビューの指摘（排水前の電源停止を手順の先頭へ）を修正済み。内容・HTMLの未修正指摘0。
- Chrome実画面: 320/390/1280pxで横溢れ0、390pxでdetails8件の開閉16操作PASS、Enter開閉と#cleanジャンプPASS、summary高さ52.8px、console error0。外部GA4読込をローカルQA時のみ除去し本物の計測は送信しない。
- 追加テスト7 PASS。KID269/案内人25/寿命90/楽天20 PASS。全Python83件はクラウド82 PASS・既存private_outputテスト1件が/tmp/.gitで失敗、PC81 PASS・既存GA4日時テスト2件がtzdata不足で失敗。実装対象テストに失敗なし。
- 公開はPR/merge後に配信一致と実画面を別途確認し、PRコメントへ記録する。未確認を公開済みとは扱わない。
- NEXTは既存のGA4定刻実測を維持。今回の記事を再調査・再実装しない。

## Scope Lock

- guides/keeper-hacks.html / sitemap.xml / tools/test_keeper_hacks.py / docs/AI-HANDOFF.md / AI_CHANGELOG.md / 本記録の6ファイル。
- 数値の新規飼育基準、商品URL/tag、CITES、他記事の本文は変更しない。
- site-wide GA4は憲法§5.3-R2に従い既存IDの設定を1つ追加。新しいクリックイベントは追加しない。sitemapの自己canonical URLを1件追加。

## 調査・採用

採用: ホース排水／給排水の目印／吸水口スポンジを袋に包む／部分清掃／餌皿で回収／最高最低温度／体重と食欲排泄のメモ／ランプ型番と交換記録。参考URLは各項目に表示。
魚水槽の清掃技法は対応器具への応用と明記。個別種の飼育温度、塩・消毒薬、温浴や治療、出典のない安全保証は転用しない。

## 検証限界

- スマホ実機、VoiceOver/TalkBackは未評価。Chrome viewportによる表示確認と区別する。
- GA4実受信は今回検証しない。既存ID・重複なし・通常の設定コードを確認する。
- 公開確認はmerge後のPRコメントに確定SHAと結果を記録する。
