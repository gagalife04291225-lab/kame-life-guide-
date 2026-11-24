# Amazon JP 商品画像表示の候補（無効・未公開）

写真が読み込めたときだけ、元のAmazon商品リンク内に通常は200×200pxの範囲に収め、細長い画像は長辺を最大260pxまで広げる。元画像の解像度を超えて拡大せず、文字・ラベルを切らない。320px幅など狭い端末では親幅を上限に縮める。実写の判読性は別途確認する。画像が出ている間は、画像と一致するASIN・既存タグを検証したAPI返却URLを改変せず使用する。写真が読み込めない・期限切れなら元のリンクに戻す。楽天と同じ商品枠にある販売リンク、購入に条件のあるカード、検索リンク、型番の照合前の素材は対象外。既存の購入条件、Amazonタグ、計測、楽天画像・リンクは変更しない。

このコードだけでは公開されない。HTMLのサービス指定・CSS・JSの読み込みは追加していない。Workerのルート、Cron、KV、Secretも設定していない。GitHub Pagesは静的配信で、認証情報や期限のある画像URLを公開ファイルに書けない。

## 有効化前に確認すること
1. Amazonアソシエイトの利用資格、正規登録済みの掲載先と運用アカウント、認証バージョンを確認する。Workerは公式JP LwA 3.3のみ。既存鍵の同方式による1件での成功記録はあるが、Workerでの本番認証は未実施。未承認の場所へ鍵を移さない。
2. 実物の型番・容量・写真の一致を確認したASINのみ KLG_APPROVED_ASINS に指定する。ASINが同じだけではサイト表記と実物が一致するとは限らない。混在カードには、別売先と近接しないAmazon専用枠、または許諾済みの独立素材が必要。別サイズや無許可の写真を流用しない。
3. 承認済みの同一オリジン /api/amazon-product-images に限定する。Workersの別公開入口は無効とし、SecretとKVを含む権限・費用を確認する。メタ名 klg-amazon-image-service で値を正確にこの同一オリジン相対パスとして設定する。写真ブラウザには鍵を渡さない。KVの KLG_AMAZON_IMAGES と専用Secret KLG_CREATORS_CLIENT_ID / KLG_CREATORS_CLIENT_SECRET を利用し、18時間より短い間隔で更新する。閲覧者リクエストからAmazon APIは呼ばない。10 ASINずつ、2.2秒以上空けて取得し、429は短いRetry-Afterを尊重して回数制限付きで再試行する。途中で失敗したら保存を更新せず、既存URLは元の期限で失効する。無料CronのCPU上限10msに収まるか初回実測を必須とする。既存の診断Workerと分ける。全商品対応は、既存の1商品向けの承認やプレビュー条件と区別する。
4. 定時取得の成功・取得不可・期限切れとスマホの表示、各カードの正しいリンクを確認する。画像データや期限URLを公開Gitに残さない。ログには集計のみ。7件の例外と全体の表示件数を分ける。問題時は有効化メタやルートを外して元のまま復旧する。

公式: https://affiliate.amazon.co.jp/help/operating/policies および https://affiliate.amazon.co.jp/creatorsapi/docs/en-us/get-started/using-curl

購入リンク条件とレート: https://affiliate.amazon.co.jp/creatorsapi/docs/en-us/concepts/api-rates 。稼働に必要なCloudflareの上限: https://developers.cloudflare.com/workers/platform/limits/ 。
