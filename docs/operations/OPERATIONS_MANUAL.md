# 運営マニュアル（OPERATIONS MANUAL）

> KAME LIFE GUIDE 運営ドキュメント｜これを見れば誰でも運営できる
> 関連: [WEEKLY_REVIEW.md](WEEKLY_REVIEW.md) ・ [MONTHLY_REVIEW.md](MONTHLY_REVIEW.md) ・ [KPI.md](KPI.md) ・ [DECISION_RULE.md](DECISION_RULE.md)

**このサイトは開発フェーズを終え、運営・改善フェーズに入っています。新機能開発ではなく、実ユーザーの行動データ（GSC / GA4 / TikTok / ASP）をもとに毎週少しずつ改善します。**

---

## 前提（最初に一度だけ確認）

- 本番配信：GitHub Pages（`main` ブランチに push で自動デプロイ・約60秒）
- 計測：GA4 `G-QQTE5CVF3K`（全ページ設置済み）／ GSC 登録・sitemap 送信済み
- 収益：Amazonアソシエイト（`kamelife09-22`）／ 楽天アフィリエイト
- 一度だけの設定（[KPI.md](KPI.md) 末尾参照）：GA4拡張計測ON確認・affiliate_clickのカスタムディメンション登録・TikTok bioリンクのUTM付与

---

## 毎日（任意・約2分）

- GSC / GA4 に **異常な急落や通知（手動対策・重大なクロールエラー）** が出ていないかだけ確認
- 通常は何もしない（毎日の細かい数値は追わない）

---

## 毎週（月曜・約15分）→ 詳細は [WEEKLY_REVIEW.md](WEEKLY_REVIEW.md)

1. GSC：Click / CTR / 順位（前週比）、インデックス / 除外 / クロールエラー
2. GA4：流入元・人気ページ・診断開始率・診断完了率・affiliate_click・スクロール率
3. TikTok：投稿数・再生数・プロフィールクリック・(GA4で)TikTok流入
4. [DECISION_RULE.md](DECISION_RULE.md) で **P0を最大3ページ** 選び、改善タイプを割り当てて実装
5. 先週着手ページの効果測定 → 改善履歴シートに記録
6. コンテンツは **週1〜2本まで**（GSCで需要が実在するテーマのみ・カニバリ監査必須）

---

## 毎月（月初・約30分）→ 詳細は [MONTHLY_REVIEW.md](MONTHLY_REVIEW.md)

1. ASPレポートから Amazon / 楽天報酬を入力
2. GSC・GA4 をカテゴリ別・前月比で集計
3. EPC（確定報酬 ÷ affiliate_click）を category / provider 別に算出
4. 当月の改善結果（P0の Before→After）を集計
5. 月次レポート化 → 高EPCカテゴリを翌月の重点に決定

---

## 四半期（3か月ごと・約1時間）

- **サイト全体の健全性チェック**（Phase3-E 監査項目に沿う）：
  - SEO：canonical / title・description重複 / 孤立ページ / 内部リンク切れ / sitemap整合
  - E-E-A-T：運営者情報・Trustページ・実飼育Experience表示の維持
  - Performance：実フィールドCWV（PageSpeed Insights / GSC「ウェブに関する主な指標」）
- **法規制の再確認**：CITES区分・特定外来生物の指定に変更が無いか（環境省・CITES）。変更があれば該当種ページ・診断・除外リストを更新
- クラスタの棚卸し：伸びているクラスタ（比較 / 病気 / Best10 / レビュー）を1つ選び深掘り強化

---

## 年次（1年ごと・半日）

- **UVBライト等の機材情報の見直し**（製品の入れ替わり・交換時期の記述）
- 全 review / best10 の掲載商品が **実在・入手可能** か再確認（終売・改廃）
- 写真ライセンス（[photo-credits] 相当）の維持確認
- 主要種ページの飼育情報を最新の知見で見直し（年数は記載しない方針を維持）
- サイト全体の title / description を再監査し、順位が停滞したページをまとめて改善

---

## やってはいけないこと（品質ガード）

- 実在しない商品を扱う・価格を書く・順位を誇張する
- 「絶対」「最強」等の断定・医療断定（病気記事は「可能性」「早めに受診」）
- 同一テーマの重複ページ作成（**検索カニバリゼーションを最優先で回避**）
- 飼育していない種を実体験のように書く（Experienceは実飼育種のみ）
- CITES I・特定外来・天然記念物を診断に追加する（除外リストを守る）
- `main` への不用意な直接変更（変更は差分確認のうえ、デプロイ後に検証）

---

## 困ったときの参照先

| 目的 | ドキュメント |
|------|-------------|
| 今週やること | [WEEKLY_REVIEW.md](WEEKLY_REVIEW.md) |
| 今月やること | [MONTHLY_REVIEW.md](MONTHLY_REVIEW.md) |
| 何の数値を見るか | [KPI.md](KPI.md) |
| どう直すか判断 | [DECISION_RULE.md](DECISION_RULE.md) |
| 種データ・法規制 | リポジトリ直下 `SHINDAN-SPECIES.md` / `SHINDAN-SPEC.md` |
| コードベース全体 | リポジトリ直下 `CLAUDE.md` |
