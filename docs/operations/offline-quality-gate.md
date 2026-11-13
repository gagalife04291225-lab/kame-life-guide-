# オフライン品質ゲートと価格更新の競合

## 同じ検査を手元と PR で実行する

```sh
python scripts/run-offline-checks.py
```

Python 3.12、Node.js 22、Git が必要。外部 API・秘密情報・ブラウザーのインストールは不要。
Git の過去コミットを比較する既存回帰検査があるので、浅い clone ではなく履歴込みで取得する。
Python unittest、`tools/test-*.mjs` 全件、種データ・容器同期、内容ハッシュ参照、空白エラーを順番に検査する。
途中の失敗も一覧に残し、失敗が一つでもあれば終了コード 1。検査対象の件数は新規テストの追加に追随する。
実ブラウザー・実機読み上げ・外部 API 資格・実商品の適合試験の代わりにはならない。

`Site offline checks` は PR、main への push、手動実行が対象。
秘密情報を渡さず、checkout の認証も残さない。公開リポジトリの標準 Ubuntu runner を使い、
artifact とキャッシュは追加しない。private 化された場合は新ゲートを実行しない。
同じ PR の古い検査だけを取り消し、最新変更を優先する。branch protection や課金設定は変更しない。
このチェックの追加だけで「失敗時にはマージ不能」になるわけではない。必須化は別途 Owner の設定判断が必要。

料金根拠（2026-11-13 確認）：
https://docs.github.com/en/billing/concepts/product-billing/github-actions
公開 repo の標準 runner は無料。大型 runner は別扱い。ログは artifact 容量ではない。
この変更による実課金は未発生であり、アカウント全体の既存請求を 0 円と保証するものではない。

## 楽天同期の競合

既存の実行時刻・取得方法・秘密設定・価格判定は変えない。
同じ楽天 workflow は同時実行せず、実行中を取り消さない。
生成コミット後は `scripts/push-rakuten-update.py` が通常 push を行う。

- main 以外、未コミット変更、生成対象外ファイルを含むコミットは公開しない。
- push が失敗して main が進んでいた場合だけ、両履歴を通常 merge する。
- 非競合ならハッシュ参照を再生成し、全オフライン検査後に再度通常 push。
- 同じ箇所の編集が競合したら merge を中止し、remote main を変更しない。
- 認証・通信等による失敗で main が進んでいなければ、別の方法で push せず停止する。
- push 自体が成功し応答だけ失われた場合は、remote が同じ commit か確認して重複しない。
- push は最大 3 回。force push・reset・rebase による上書きはしない。

競合停止は、どちらの正当な変更を捨てるかを自動で決めないための仕様。
停止後の価格は未反映として扱う。既存公開データは残る。失敗 runner 内の生成 commit はログに記録するが、
永続保管とは主張しない。必要なら新しい main から通常の同期を行う。古い価格データを強制上書きしない。

## 検証方法

`tools/test_push_rakuten_update.py` は一時的な bare repo と 2 clone を使う。
通常成功、非競合更新、同一商品の競合、統合後検査失敗、対象外変更、dirty tree、
非 main、push 成功後の応答喪失、remote 非進行時の拒否を検証する。
テストはローカルのみで、GitHub や楽天へ接続しない。

GA4 の出力先保護コードは変更しない。既存テストは runner の親ディレクトリが Git 管理される環境でも
合成ファイル構造を使い、private 出力・直下 Git・祖先 Git の各ケースを検証する。
