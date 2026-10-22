# GSC Direct Export

GSC Wizardに依存せず、Google Search Console APIをGitHub Actionsから読み取るための仕組み。

## 取得内容

`scripts/gsc-export.py` が既定90日分の以下を取得する。

- page
- query
- page × query
- clicks / impressions / CTR / average position

API scopeは読み取り専用 `https://www.googleapis.com/auth/webmasters.readonly`。

## 公開リポジトリでのデータ保護

このリポジトリは公開のため、Search Consoleの生CSV/JSONはcommitもartifact uploadもしない。
Workflow実行中のrunner一時領域だけに生成し、終了時に削除する。

## 必要なSecret

GitHub Actions Secret:

`GSC_SERVICE_ACCOUNT_JSON`

値はGoogle service accountのJSON全文。Issue / PR / commit / Actionsログへ値を出さない。

service accountの`client_email`には、Kame Life GuideのSearch Console propertyへの読み取り権限が必要。

## 実行

Workflow: `.github/workflows/gsc-direct-export.yml`

- PR: 認証不要のself-testのみ
- 手動: workflow_dispatch
- 自動: 毎週月曜06:15 JST

Secret未設定時は `BLOCKED: repository secret GSC_SERVICE_ACCOUNT_JSON is not configured.` と明示して失敗する。
