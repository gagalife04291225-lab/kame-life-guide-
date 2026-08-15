# アクセス数を取るための手順（オーナー作業）

所要 約10分 ／ **費用は無料**（GA4 Data API・Search Console API とも無料枠内）

## なぜこの手順が要るのか

この実行環境からは GA4 と Search Console の**画面**に到達できない（組織のegressポリシーで遮断）。
一方で **API は到達できる**ことを実測済み。

| 経路 | 結果 | 意味 |
|------|------|------|
| analytics.google.com（画面） | HTTP 000 | 遮断。迂回はしない |
| search.google.com（画面） | HTTP 000 | 遮断。迂回はしない |
| kamelifeguide.com（サイト本体） | HTTP 000 | 遮断 |
| **analyticsdata.googleapis.com（API）** | **HTTP 401** | **到達可。認証が要るだけ** |
| **searchconsole.googleapis.com（API）** | **HTTP 401** | **到達可。認証が要るだけ** |
| **oauth2.googleapis.com/token** | **HTTP 400** | **到達可（正常応答）** |

署名（RS256）→ トークン交換までは**ダミー鍵で実際に通して動作確認済み**。
残っているのは「本物の鍵」だけ。

## 手順

### 1. サービスアカウントを作る
1. https://console.cloud.google.com/ → プロジェクトを選ぶ（無ければ新規作成）
2. 「APIとサービス」→「ライブラリ」で次の2つを**有効化**
   - Google Analytics Data API
   - Google Search Console API
3. 「IAMと管理」→「サービスアカウント」→ 作成
4. 作ったアカウントの「キー」→「鍵を追加」→「JSON」→ ダウンロード
5. **アカウントのメールアドレスを控える**（`xxx@yyy.iam.gserviceaccount.com`）

### 2. GA4 に閲覧権限を渡す
1. GA4 → 管理 → プロパティのアクセス管理 → 「+」
2. 上のメールアドレスを追加、役割は **閲覧者**
3. 管理 → プロパティ設定 → 右上の **数値のプロパティID**（10桁前後）を控える
   ※ `G-QQTE5CVF3K` は測定IDで、これとは**別物**

### 3. Search Console に閲覧権限を渡す
1. Search Console → 設定 → ユーザーと権限 → ユーザーを追加
2. 同じメールアドレスを「制限付き」以上で追加

### 4. 実行
```bash
python3 tools/analytics_fetch.py \
  --key /path/to/service-account.json \
  --ga4-property 123456789 \
  --site https://kamelifeguide.com/ \
  --days 28
```

出力: `tiktok/research/analytics-report.md` と `.json`
- 全体（ユーザー数・セッション・PV・エンゲージメント時間）
- よく見られたページ 上位20
- 流入元 上位15（**utm_source=tiktok は自動で合計**）
- 検索のクリック / 表示 / CTR / 平均順位
- 検索クエリ 上位15 ／ 検索で表示されたページ 上位15

## セキュリティ（PATと同じ運用）

- 鍵は**一時的に**渡す
- 取得が終わったら **Google Cloud でその鍵を削除（失効）**
- **使い回さない**
- このツールは鍵をリポジトリに書き込まない。標準出力にも出さない

## 鍵を渡したくない場合（方法A）

GA4 の画面を見て、次の4つを教えてもらえれば同じことができます。

- 期間: 過去28日間
- ユーザー数 / セッション数 / 平均エンゲージメント時間
- 参照元/メディア 上位5件
