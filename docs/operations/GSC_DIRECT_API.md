# Search Console公式API・無料レポート

目的: 有料のGSC Wizardを介さず、Google公式のSearch Analytics APIから直近90日間の**確定済み**Web検索実績を取得する。APIは読み取り専用。既存サイトや商品データは一切変更しない。

## 状態（2026-10-11）

- 実装: `scripts/gsc_direct_report.py`
- 自動実行: `.github/workflows/gsc-direct-report.yml` （毎週月曜 11:00 JST、手動実行も可能）
- オフラインテスト: `tests/test_gsc_direct_report.py`
- 取得: 全体合計、ページ、検索クエリ、ページ×クエリ、改善候補の上位10件。P0=平均掲載順位11〜20位、P1=4〜10位かつCTR3%未満。20表示未満は候補から除外。
- 現時点では**Google認証情報を未設定のため、実サイトのSearch Consoleへの接続・データ取得は未確認（BLOCKED_SETUP）**。オフラインテストと実データ取得を混同しない。

## Ownerの初回操作（Google側・GitHub側）

1. Google Cloud Consoleで専用プロジェクトを用意し、**Google Search Console API**（旧Webmasters API）を有効化する。課金が必要な他のAPIを有効化する必要はない。検索データのAPIにはGoogleの使用量制限がある。
2. サービスアカウントを作成。**必要な範囲だけ**のJSONキーを作る。鍵はサイトやIssues/PR/Actionsログに貼らない。
3. Google Search Console の対象プロパティを開き、設定 → ユーザーと権限 → ユーザーを追加。サービスアカウントの `client_email` を対象サイトの**制限付きユーザー**として追加する。APIが権限拒否する場合は、プロパティ種別（ドメイン/URLプレフィックス）と権限を再確認する。サイトの所有権やDNS設定は勝手に変更しない。
4. GitHubの対象リポジトリ `gagalife04291225-lab/kame-life-guide-` → Settings → Secrets and variables → Actions を開く。
   - Repository secret **`GSC_SERVICE_ACCOUNT_JSON`**: JSONキーの全文を登録。
   - Repository variable **`GSC_SITE_URL`**: Search Consoleに登録したプロパティの**完全一致**値（ドメインなら `sc-domain:kamelifeguide.com`、URLプレフィックスなら `https://kamelifeguide.com/` など、既存設定に合わせる）。**どちらが登録済みか推測しない。**
5. PRがmainに反映されたら、GitHub Actions → **GSC Direct Search Report** → Run workflow → days=90で初回実行する。成功したこと・最終確定日・Google API応答を確認する。最初から実データがあると決めつけない。

## 秘密とデータ保護

- OAuthスコープは `webmasters.readonly`。リポジトリ書き込みは不要で、ワークフローは `contents: read`。
- 認証JSONはGitHub Actions secret経由の環境変数だけで受け取る。**秘密鍵の本文をIssue/PR/commit/ログに表示しない。**
- 公開リポジトリでは、検索クエリ・アクセス実数のJSONをアーティファクト/commit/ログに公開しない。生成レポートはRunnerの一時領域にだけ存在し、実行終了後に消える。
- 公開リポジトリのActionsサマリーに検索合計値と改善候補を出したい場合、Ownerが公開範囲を理解したうえでRepository variable `GSC_ALLOW_PUBLIC_SUMMARY=true` を明示的に設定する。これを設定するとサマリーは一般公開され得るため、**初期値は空/falseのまま**とする。
- 秘密のレポートを保存したければ、**別のprivateリポジトリ**等への転送設計が必要。今回は認証鍵/PAT追加・公開漏洩を避けるため、自動転送は実装しない。

## 検証基準

- `python -m unittest discover -s tests -p test_gsc_direct_report.py`
- 実サイト検証は、認証設定後のActions run成功、APIからのRows取得、期間・プロパティ一致を見てPASS判定する。**テストのPASSはGSC実取得のPASSを意味しない**。
- Google APIの行はクリック数の多い順の上位行であり、すべての検索クエリの網羅取得は保証されない。合計クリック数は全体合計クエリを正とする。ページ/検索クエリ/組合せ行を合計して二重計上しない。
- 日本国内のCITES表記修正PR #207、完了済みの餌/用品監査、クローズ済みPR #189の作業は再開しない。

## 使えるようになったあとの1工程

実測済み検索実績と、既設GA4 `affiliate_click`・Amazonアソシエイトの実績を別ソースで対応づけ、**検索上位に近く、購入意向が強く、導線が改善可能な3ページ**を特定。ページ・クエリ・表示・クリック・順位の数値を記録してから編集する。商品ランキングや飼育データを推測で書き換えない。

公式仕様: https://developers.google.com/webmaster-tools/v1/searchanalytics/query
