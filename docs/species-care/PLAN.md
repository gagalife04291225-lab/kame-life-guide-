# 飼育データ基盤 実装計画（species-master v1.1 / 2026-08-17）

目標: 海外情報の翻訳サイトではなく、**世界の飼育知見を検証し、日本の環境・法律・
商品事情に合わせて再構成した、日本で最も実用的なカメ飼育情報基盤**。

## 1. 海外情報源の採用基準（master _meta.care_schema.source_criteria が正本）

優先順:
1. 学術文献・査読誌
2. 公的機関（USFWS・環境省 等）
3. IUCN-TFTSG 種アカウント（CRM series・無償PDF・種ごとの標準資料）
4. 動物園・保全機関の飼育マニュアル（AZA / EAZA 等）
5. 専門団体・専門書（TTWG チェックリスト / DGHT 等）
6. メーカー一次仕様（UVB照度分布表・ヒーター定格 等）
7. 長期飼育者の一致した経験（独立2名以上 = keeper_consensus）

規則:
- 海外飼育者の経験談は keeper 系 provenance で記録し、確定事実と区別する
- そのまま転載しない。全項目に **japan_fit（日本適合判定）** を必ず併記
- ショップ記事・Wikipedia 単独で CONFIRMED にしない
- 質の高い根拠同士の対立は conflict として残す（多数決で潰さない）

## 2. 日本適合判定（japan_fit）

判定4値: `ok_as_is / adjust_for_japan / not_recommended_jp / UNPROVEN`
判定根拠に使う日本固有条件:
- 夏の高温多湿（スペングラー型の「冷やす方が難しい」種の識別）
- 冬の室温低下（無加温室は10℃前後まで下がる前提）
- 梅雨（湿度・蒸れ・水カビ）
- 住宅スペース（ケヅメ型の「終生飼育警告」）
- 水槽規格への換算（30/45/60/90/120cm。海外のガロン・平米表記は必ず換算）
- 国内法規制（特定外来・条件付特定外来・CITES・対面販売義務）
- 国内で買える餌・UVB・保温・濾過用品（買えない前提の飼育法は載せない）

## 3. 商品接続（equipment_policy が正本）

原則: **飼育条件 → 必要性能 → 条件を満たす国内流通品** の順。逆算禁止。

- Amazon: PA-API は 2026-05-15 廃止済み。現行正式は **Creators API**（要販売実績）。
  現サイトは価格を表示しない静的リンク（`/dp/ASIN/?tag=kamelife09-22`）のため
  API なしで規約適合。価格の自動表示を始める場合のみ Creators API を申請する。
- 楽天: 楽天ウェブサービス **IchibaItem Search 20260701版** で
  `.github/workflows/rakuten-sync.yml` が稼働中（週次で data/products.js を自動更新・
  main 直 push は Automation 経路②として憲法上許可済み・Secret redaction 実装済み）。
  飼育データ層はこの既存経路を再利用する。新規開発は不要。
- 商品DB: data/products.js（87商品・Schema v4）と shindan/equipment.js
  （web_search 実在確認済みASIN）が既存資産。要件を満たす商品が無いカテゴリは
  掲載しない（例: ケヅメ用大型ケージ→自作前提と明記）。
- 価格・在庫・仕様の固定値捏造は禁止（楽天APIの自動値のみ表示）。

## 4. データ設計

- 正本: `data/species-master.json`（schema 1.1）。`care` ブロックに項目別
  `{value, verification, provenance, sources, japan_fit{judgment, basis, jp_note}}`。
- 105ページへの手入力はしない。ページ本文は master と矛盾しないことを
  `tools/validate_species.py` で照合していく（段階的にケア項目の照合を追加）。
- パイロット3種を実装済み: スペングラーヤマガメ / ケヅメリクガメ /
  ヒメハコヨコクビガメ（docs/shindan-redesign の出典つき値を移植）。

## 5. 優先順位（master _meta.priority_top10 が正本）

GSC90日実測の需要 + 実飼育 + 法規制/安全リスクで選定:
1. ミシシッピニオイガメ（検索需要クラスタ最大）
2. カブトニオイガメ（110impr・改善Opportunity）
3. スペングラーヤマガメ（S群1位・パイロット済）
4. ヒメハコヨコクビガメ（S群2位・パイロット済）
5. ミツユビハコガメ（SEO実験種・飼育中）
6. ロシアリクガメ（ランキング1位種）
7. ヘルマンリクガメ
8. クサガメ（国内最大需要・pos75の長期戦）
9. ニホンイシガメ（RL2026 VU・保全情報の需要）
10. ケヅメリクガメ（購入前警告の社会的価値・パイロット済）

## 6. 自動化と人間確認の分担

自動化できる部分:
- 海外一次資料の取得（GitHub Actions 経由。本作業環境は主要DBへ egress 不可）
- 楽天価格・在庫の週次更新（稼働済み）
- master ↔ species.js / MD / ページの矛盾検出（validator・拡張継続）
- 単位換算（°F→℃・ガロン→L・インチ→cm）と水槽規格へのマッピング

人間確認（亀好きさん）が必要な部分:
- japan_fit の最終判定（特に not_recommended_jp の掲載トーン）
- keeper 経験の妥当性判断（デマ除外の最終判断）
- 商品候補の採用可否（要件適合でも品質・入手性の実感）
- NEEDS_REVIEW の実体確認（Cuora ornata 等）

## 7. 105種完成までの実装計画

- Phase C1（済）: schema v1.1 + パイロット3種
- Phase C2: TOP10 残り7種の care 構築（Actions で TFTSG アカウント等を取得→
  値の抽出→japan_fit 判定→master 反映。週2〜3種）
- Phase C3: 種ページへの反映方式を確立（1種で実験: master の care から
  「日本での飼い方」セクションを生成し、既存ページの良い部分を壊さず追記）
- Phase C4: S/A 群の残り（検索実績あり約30種）
- Phase C5: 残り全種（B/C群。需要が薄い種は要点のみ: サイズ・寿命・法規制・
  日本適合の4点セット）
- 継続: validator に care 照合を追加し「ページと master の飼育数値の矛盾」を
  自動検出対象へ
