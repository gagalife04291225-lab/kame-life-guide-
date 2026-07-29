# TEST SCENARIOS — Sprint 1

完了条件: Idea作成 → Planning → Script → QA → Ready Package の一連の状態遷移が GitHub 上で確認できる。

## T1: ハッピーパス（一発合格）
- 前提: 明確で検証可能なテーマ（例: 「カメの甲羅は脱げるのか」）。
- 手順: 00-idea 実行 → stage:planning 付与 → 自動連鎖。
- 期待: idea→planning→script→qa→ready と遷移。QA が tech_score≥80 & factuality=pass。
  Ready Package に captions×2/hashtags/post_time_suggestion。status:waiting-owner で停止。

## T2: 差戻し（QA不合格→脚本→再QA）
- 前提: 事実主張の出典が弱くなりやすいテーマ。
- 期待: QA が factuality=fail か tech_score<80 で quality:needs-fix + stage:script。
  脚本が修正して再度 stage:qa。最終的に合格して ready へ（往復は3回以内）。

## T3: ループ上限（3回不合格で停止）
- 前提: 意図的に検証困難／曖昧なテーマ。
- 期待: QA が3回不合格に達したら差戻さず status:waiting-owner + risk:high で停止し、オーナーへ委ねる。

## T4: JSON データ契約の遵守
- 期待: 各工程コメントの JSON が contracts/*.schema.json に適合（余計なフィールドを渡さない）。
  予測値には demand_source/ metric 相当で measured|predicted|unknown が明示される。

## T5: 人間ゲートの遵守
- 期待: publisher は TikTok 投稿を実行しない。stage:published はオーナーが手動で付けるまで付かない。

## 検証観点（憲法整合）
- 品質順（正確性優先）で迷ったら差戻されているか。
- 「不明は不明」「※要検証」が適切に使われ、規約数値を推測断定していないか。
- 全成果物が Issue に記録され、後から誰が何をしたか追跡できるか。
