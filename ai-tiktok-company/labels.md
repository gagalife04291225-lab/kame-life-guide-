# GitHub Labels セットアップ（Sprint 1 で使う最小サブセット）

正典は PHASE_0.5 ⑤。Sprint 1 の状態遷移に必要なラベルのみ以下に列挙。
稼働リポで一度だけ実行（例。`gh` は認証済み前提）。**私は実行していません（オーナー稼働時に実施）。**

```bash
# stage（工程）
gh label create "stage:idea"      -c "#c5def5" -d "企画の種"
gh label create "stage:planning"  -c "#c5def5" -d "企画中（承認で付与）"
gh label create "stage:script"    -c "#c5def5" -d "脚本中"
gh label create "stage:qa"        -c "#c5def5" -d "品質チェック中"
gh label create "stage:ready"     -c "#c5def5" -d "Ready Package 生成済み"
gh label create "stage:published" -c "#0e8a16" -d "オーナー投稿済み"

# type / department / quality / status / risk（Sprint1 で参照する分）
gh label create "type:idea"           -c "#fbca04"
gh label create "department:strategy" -c "#d4c5f9"
gh label create "quality:pass"        -c "#0e8a16"
gh label create "quality:needs-fix"   -c "#e99695"
gh label create "status:waiting-owner" -c "#fef2c0" -d "人間ゲート待ち"
gh label create "risk:high"           -c "#b60205"
```

## 状態遷移（Sprint 1）
stage:idea →(オーナーが stage:planning 付与=承認)→ 企画 → stage:script → 脚本 → stage:qa → QA
- QA 合格 → stage:ready + quality:pass → 投稿 → status:waiting-owner
- QA 不合格 → quality:needs-fix + stage:script（脚本へ差戻し、上限3回）
- 3回不合格 → status:waiting-owner + risk:high（停止・オーナーへ）
