# AI_CHANGELOG

> AI協働による変更の意思決定トレーサビリティ記録（append-only）。
> Development Constitution v2.0 §9.3 に基づく。1エントリ = Merge済み変更1件。改ざん禁止・追記のみ。
> 各エントリは Date / Actor / Change / Reason / PR・Commit / Approver / Conforms を含む。

---

## [2026-07-16] Development Constitution v2.0 導入（Migration Phase 1 / U1）

- **Actor:** Claude Code（実装） / TeTe（承認）
- **Change:** `DEVELOPMENT_CONSTITUTION.md`（v2.0, Status: DRAFT）と本 `AI_CHANGELOG.md` を新規追加。
- **Reason:** 散在する開発ルール（CLAUDE.md / SHINDAN-SPEC.md / docs）を単一の最上位規範へ一元化するため。Operational Readiness Audit / Migration Execution Plan の Phase 1 として、サイトに影響しない新規文書追加から着手。
- **PR/Commit:** branch `claude/readme-test-line-9tbkht`（本コミット）
- **Approver:** TeTe（"go" 指示）
- **Conforms:** Constitution v2.0
- **備考:** F1（デプロイ経路）・F2（正規URL）は【CONFIRM_REQUIRED】として保留。批准（Status: ACTIVE 化）と既存文書の書換え（Phase 2 以降）は F1/F2 確定後に実施する。

---

## [2026-07-16] F2（正規URL）正式批准（Migration P2c）

- **Actor:** Claude Code（実装） / TeTe（承認）
- **Change:** `DEVELOPMENT_CONSTITUTION.md` §7.4 の【CONFIRM_REQUIRED: F2】を解除し、canonical = `https://kamelifeguide.com/`（apex / non-www / HTTPS）を確定記載。Status を F2=CONFIRMED へ更新。
- **Reason:** F2監査（読み取り専用）で、canonical 165件・sitemap 158URL・robots・CNAME・内部リンクが全て `https://kamelifeguide.com`（apex/non-www/https）で統一され、http/www/github.io 混在ゼロ、❌修正必須ゼロを確認したため。
- **PR/Commit:** branch `claude/readme-test-line-9tbkht`（本コミット）
- **Approver:** TeTe（P2c 指示）
- **Conforms:** Constitution v2.0
- **備考:** GitHub Pages「Enforce HTTPS」設定と www→apex ライブ挙動はリポジトリ外の残確認（§7.4-R3）。canonical 確定値には影響しない。
