# GA4 日次取得と私的レポート

`scripts/ga4_daily.py` は既存の認証を使う読み取り専用CLI。サイトの計測コード・GA4設定・カスタム定義・アクセス権を変更しない。公開Actionsの `ga4-offline-check.yml` は合成データのテストのみを実行する。

## 実行経路と保存先

日次の実測取得・配信は、Ownerが認可した私的ランナーで実行する。本リポジトリはpublicなので、実測JSON/Markdown、CSV、収益詳細をcommit・PR本文・Actionsログ・artifact・job summaryへ置かない。CLIは標準出力に固定の完了コードだけを返し、例外本文・トークン・取得データを出力しない。出力先がこのリポジトリまたは別のGit管理領域内なら拒否する。保存先の共有権限・バックアップ・保持期間はランナー管理者が確認する。Windowsのchmodは完全なACL管理ではないため、私的なユーザーフォルダを使う。

Python 3.11以上で、承認済み環境へ `python -m pip install -r scripts/requirements-ga4.txt` を実行する。既存ADC（Application Default Credentials）または環境変数 `GA4_ACCESS_TOKEN` の短命トークンを使用する。CLI引数には秘密を渡さない。ADCには `analytics.readonly` を要求し、ライブラリが既存認証を更新する。キー作成・OAuth grant・IAM/GA4アクセス追加・認証保存の手順はこのCLIに含めない。新規設定や継続利用はOwnerの具体的承認を得てから行う。

```text
python scripts/ga4_daily.py --property-id <PROPERTY_ID> --output-dir <PRIVATE_DIRECTORY_OUTSIDE_ANY_REPOSITORY>
```

実行ごとに一意な時刻付きJSON（取得条件・全明細・metadata・集計）とMarkdown（日次報告）を保存する。過去スナップショットを上書きしない。外部宛て自動送信は実装していない。既存の私的配信先が未確認な間は、ローカルMarkdownが報告先となる。

日次起動は既存の私的ランナーのスケジューラーを使う。例としてcron `0 0 * * *`（UTC 00:00、日本時間09:00）から上のコマンドを絶対パスで実行する。ランナーのタイムゾーンをUTCと明示し、多重起動を禁止する。これは設定例であり、公開repoのスケジュール・私的cron・Windowsタスクを登録済みという意味ではない。認証と保存先・配信先の承認後、まず手動実行の成功と私的ファイルを確認し、それから日次登録・翌日の実行履歴を確認する。

## 取得条件・遅延

- Admin APIでプロパティのIANAタイムゾーンと、指定した計測IDに一致するWebストリームを照合。ストリームが一意でなければ停止。レポートは `hostName` / `streamId` / `eventName` の完全一致で限定する。設定URLだけから対象ホストを推測しない。
- 現期間はプロパティ日付の3日前までの28日間。前期はその直前の等長28日間で、重複しない。`--end-date` に未終了・遅延除外期間を指定すれば停止。LA時間等を日本時間へ読み替えず、DSTもIANA定義で計算する。
- **3日除外は確定保証ではない。全出力は暫定スナップショット。** 毎日両期間を再取得し、後着データを取り込む。固定期間の改訂を調べる場合は同じ `--end-date` を指定して過去ファイルと比較する。取得日時・期間・timezoneを必ず保持する。
- Admin APIのカスタム定義とData API metadata双方を照合したイベント範囲の `customEvent:<実キー>` だけを使う。旧定義名を別の送信キーへ自動対応しない。各レポートは `checkCompatibility` 成功後に取得する。
- Adminのイベント作成・変更ルールも読み取る。権限等で取れなければ `unavailable` と記録し、ゼロ件とは扱わない。登録日の証拠はAdmin customDimensionsのリソースだけから得られない。外部Looker Studio等の依存一覧もAPIから完全取得できたとは扱わない。

## 指標と品質制限

PV = `eventName=page_view` の `eventCount`。クリック = `eventName=affiliate_click` の `eventCount`。別クエリでそれぞれページ・日別と独立総計を取得する。`starter_kit_click` 等を加算しない。

回/100PV = クリック数 ÷ PV × 100。PV=0ではnull（算出不能）。購入率・ユニークCTRではなく100超も正常。前期0の増減率もnull、絶対増減は保持。前期にだけ存在したページ・商品も比較対象に残す。

商品IDは生IDを保持し、ASIN・内部ID・ガイドIDを統合しない。商品次元の総数を独立クリック総計と照合。`(not set)` bucket率は全行・総計一致かつ品質制限なし・曖昧な空文字/otherなしの場合にだけ算出する。残差や未登録を0とせず、未送信パラメータ率とも断定しない。

APIのoffset/rowCountで全行を取得し、安定した次元順序、重複キー、取得中のrowCount変動、空ページによる打切りを検出。429/一時的5xxは有限リトライ、認証拒否は停止。リダイレクト先へ認証ヘッダーを転送しない。

`subjectToThresholding` / `samplingMetadatas` / `dataLossFromOtherRow` / `emptyReason` / schema restrictionと全ページmetadataを記録する。品質制限やページ総計不一致があれば比率・比較・改善順位を保留する。商品次元だけの不一致なら商品未設定率・商品比較を保留し、独立ページ集計を保持する。

改善候補は「20PV以上のページで回/100PVが低い順」の明示的な確認規則。導線と計測を確認する候補であり、増収の因果・期待収益を推計しない。商品生ID別クリック数と併用し、収益判断には私的ASP確定実績を別途照合する。

## 計測互換性と現在の停止点

4ガイド13CTAの既存ID・イベント名・旧キー値は保持する。`location` / `category` の新しい分類値、種非依存の値、登録キーとの対応、既存外部レポート依存が未確定な間は本番HTMLを書き換えない。カスタム定義の登録・旧定義の改名・過去データ補完も行わない。これはCLI実装から独立した停止点。

運用開始の受入は、承認済み認証による実取得、metadata/総計照合、私的報告保存、日次スケジュールの実行記録で判定する。オフラインCIやCLIの未認証停止は本番成功の証拠にならない。

## 検証

`python -m unittest discover -s tools -p test_ga4_daily.py -v`。合成データによる境界・失敗ケースの検証であり実測結果ではない。既存207HTML・商品監査やPR #211の文書是正は繰り返さない。

一次資料: [Data API runReport](https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/runReport)、[checkCompatibility](https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/checkCompatibility)、[応答metadata](https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/ResponseMetaData)、[レポート品質](https://developers.google.com/analytics/devguides/reporting/data/v1/reporting-data-expectations)、[CustomDimensionリソース](https://developers.google.com/analytics/devguides/config/admin/v1/rest/v1beta/properties.customDimensions)、[google-auth ADC](https://google-auth.readthedocs.io/en/latest/user-guide.html)。
