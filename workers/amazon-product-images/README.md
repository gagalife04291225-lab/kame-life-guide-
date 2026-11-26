# Amazon JP 商品画像表示の候補（無効・未公開）

写真が読み込めたときだけ、元のAmazon商品リンク内に通常は200×200pxの範囲に収め、細長い画像は長辺を最大260pxまで広げる。元画像の解像度を超えて拡大せず、文字・ラベルを切らない。320px幅など狭い端末では親幅を上限に縮める。実写の判読性は別途確認する。画像が出ている間は、画像と一致するASIN・既存タグを検証したAPI返却URLを改変せず使用する。写真が読み込めない・期限切れなら元のリンクに戻す。楽天と同じ商品枠にある販売リンク、購入に条件のあるカード、検索リンク、型番の照合前の素材は対象外。既存の購入条件、Amazonタグ、計測、楽天画像・リンクは変更しない。

このコードだけでは公開されない。HTMLのサービス指定・CSS・JSの読み込みは追加していない。Workerのルート、Cron、KV、Secretも設定していない。GitHub Pagesは静的配信で、認証情報や期限のある画像URLを公開ファイルに書けない。

## 有効化前に確認すること
1. Amazonアソシエイトの利用資格、正規登録済みの掲載先と運用アカウント、認証バージョンを確認する。Workerは公式JP LwA 3.3のみ。既存鍵の同方式による1件での成功記録はあるが、Workerでの本番認証は未実施。未承認の場所へ鍵を移さない。
2. 実物の型番・容量・写真の一致を確認したASINのみ KLG_APPROVED_ASINS に指定する。ASINが同じだけではサイト表記と実物が一致するとは限らない。混在カードには、別売先と近接しないAmazon専用枠、または許諾済みの独立素材が必要。別サイズや無許可の写真を流用しない。
3. 承認済みの同一オリジン /api/amazon-product-images に限定する。Workersの別公開入口は無効とし、SecretとKVを含む権限・費用を確認する。メタ名 klg-amazon-image-service で値を正確にこの同一オリジン相対パスとして設定する。写真ブラウザには鍵を渡さない。KVの KLG_AMAZON_IMAGES と専用Secret KLG_CREATORS_CLIENT_ID / KLG_CREATORS_CLIENT_SECRET を利用し、18時間より短い間隔で更新する。閲覧者リクエストからAmazon APIは呼ばない。10 ASINずつ、2.2秒以上空けて取得し、429は短いRetry-Afterを尊重して回数制限付きで再試行する。HTTP 200でも、10 ASINごとに応答全体を検証する。正常な組だけ更新し、失敗した組の既存写真は元の期限までとする。確認済みの取得不可・画像なしは削除する。無料CronのCPU上限10msに収まるか初回実測を必須とする。既存の診断Workerと分ける。全商品対応は、既存の1商品向けの承認やプレビュー条件と区別する。別ホスト構成の候補は下記。
4. 定時取得の成功・取得不可・期限切れとスマホの表示、各カードの正しいリンクを確認する。画像データや期限URLを公開Gitに残さない。ログには集計のみ。7件の例外と全体の表示件数を分ける。問題時は有効化メタやルートを外して元のまま復旧する。

公式: https://affiliate.amazon.co.jp/help/operating/policies および https://affiliate.amazon.co.jp/creatorsapi/docs/en-us/get-started/using-curl

購入リンク条件とレート: https://affiliate.amazon.co.jp/creatorsapi/docs/en-us/concepts/api-rates 。稼働に必要なCloudflareの上限: https://developers.cloudflare.com/workers/platform/limits/ 。

## 代替経路の候補：既存サイトを移管しない Pages 読み取り口（未配備）

現行の名前サーバーや GitHub Pages を変更せず、新設の専用サブドメイン `amazon-images.kamelifeguide.com` にだけ、Cloudflare Pages の外部DNS CNAMEを利用する候補。アカウント確認、費用と検証環境を確認し、実際のDNS変更はOwner判断後。

- 読み取りは `pages/_worker.js` をブラウザ用入口とし、空の専用出力ディレクトリに、単一ESモジュールとしてバンドルした `_worker.js` だけを置く。リポジトリ全体をこのプロジェクトに配信しない。KV と型番照合済み許可リストのみをバインドし、APIの秘密情報やCronは設定しない。
- 更新専用の別Workerにだけ秘密情報、同じKV、同じ許可リストとCronを設定し、HTTPの入口を公開しない。末尾が `pages.dev` の既定ホストからは読めない。専用ホストでも、カメライフガイド本番のオリジンからのGET以外、未知のASIN、期限切れを返さない。CORSはブラウザの制限であって、認証の代わりではない。
- 実環境での読取・更新・障害時の復旧テストと公開承認まではHTMLを切り替えない。専用ホストで公開する場合だけ、メタの値を `https://amazon-images.kamelifeguide.com/api/amazon-product-images` にする。元サイト、メール、他レコードは触らない。

バンドル例（このコマンドは配備しない）: `npx --yes esbuild@0.25.12 workers/amazon-product-images/pages/_worker.js --bundle --format=esm --platform=browser --outfile=/tmp/klg-amazon-images-pages/_worker.js`。

公式: https://developers.cloudflare.com/pages/configuration/custom-domains/ / https://developers.cloudflare.com/pages/functions/advanced-mode/ / https://developers.cloudflare.com/pages/functions/bindings/

Amazon部分応答の公式例: https://affiliate.amazon.co.jp/creatorsapi/docs/en-us/troubleshooting/processing-of-errors#does-creators-api-return-partial-response

## スターターガイドの混在カード（写真を公開する前の確認）

`node tools/test-amazon-image-starter-kit-coverage.mjs` で現行の各飼育グループと3段階を実データから描画し、この候補の判定に通す。結果はグループ×段階で繰り返すカードの数であり、公開ページ数や全サイトのASIN数ではない。「APIから写真が取得できた」は「カードで表示できた」に含めない。楽天の検索リンクも、別売先へのボタンとして扱う。

- **同じカードに写真を置く案を優先**：製品の型番・容量・販売リンクと合致し、商用サイトでAmazon・楽天の両方を案内するカードに使えると権利を確認した独立素材のみ。写真は中立の製品写真とし、既存のAmazon・楽天の購入ボタン、クリック計測、確認チェックを残す。Amazonや楽天のAPI提供画像を中立画像に転用しない。掲載可能な素材の確認には、素材識別子・出典・許諾範囲と型番の証拠を記録する。
- **Amazon画像しかない場合**：両店のカードに入れず、楽天への誘導がない独立したAmazon専用ページなどを候補とする。画像のクリックは同じASINのAmazon商品だけに行く。混在カードの隣に箱を足す、HTML上で見かけだけ区切る、または楽天検索だけを例外扱いする案は採用しない。独立ページだけでは混在カードへの写真掲載を達成したとしない。公開前に運用アカウント・掲載先・規約との適合を確認する。
- **代表検証**：楽天検索と併設のGEX 45cmケージ（ASIN `B00E0GLJAK`）、楽天の個別商品と併設のUVB100 26W（`B00BF91Q1W`、写真未確認で負例）、楽天個別商品との併設カードのテトラ AT-50（`B0012UO6Q6`、許諾済みの同型写真を得られた場合の正例）を選ぶ。現行版の実カードで、狭い画面と通常幅で写真のラベル・向き、読み上げ・タブ順、両店リンクと計測、写真が出ない場合の既存導線を確認する。確認済み件数、混在枠の未確認件数、元の7件の例外は区別する。

出典: [Amazonアソシエイト規約・知的財産ライセンス §2、§3](https://affiliate.amazon.co.jp/help/operating/policies#Associates%20Program%20IP%20License%20and%20Usage%20Requirements)。

## 2026-11-25 JP Creators API: 取得不可7件の同一商品照合

下記はAPI照会時点の確認。購入先・写真候補の同一性であり、写真の公開や読者の配送日を確認したものではない。返却された期限付きURL・画像ファイルは保存しない。

| 商品 | 旧ASIN → 一致先 | 確認点 |
|---|---|---|
| GEX 標準6030 | B00CB8KY78 → B00BF91SQK | PT2604 / JAN 4972547026583、公式写真あり。PROとは別。 |
| Zoo Med 水入れ LG | B00167XQLG → B00BUFVR56 | RRB-11 / UPC 097612924114、公式写真あり。XLとは別、実際の色の指定可否は販売先で確認。 |
| GEX レプタイルUVB100 26W | B00BF91Q1W → B088X2HCGG | PT2187 / JAN 4972547026514、公式写真あり。取得時は在庫切れ。 |
| カメプロス 沈下性 小ペレット120g | B0CSD6VR97 → B00BR05SFO | JAN 4971618205445、1袋の公式写真あり。大スティック・複数セットには置換しない。 |

別件：レプトミンスーパー大粒の比較枠は、型番70276の280g（B093CY2D93、取得時在庫切れ）から、メーカー掲載中の260g（B0F31XT1KJ / JAN 4004218320413）へ、商品名・容量・購入先を一緒に変更。どちらも公式写真あり、別容量の写真を流用しない。

残り3件は保留。ソラリウム50Wは交換球（JAN 4934743004987）だけが見つかり、全セット（JAN 4934743004956）と異なる。120×60×60cmのTakimiケージは同じブランド名でも寸法・扉が異なる候補しか確認できなかった。INKBIRDは通常版が公式APIで B0B429N9L2 と確認され、旧楽天掲載先の末尾が同じため、PLUSのカードでは旧画像と直リンクを外し、PLUS指定の検索に戻した。楽天自動更新で未照合の直リンクに戻らないよう同一性保留を設定。PLUSの購入先と写真は未確定。

一次照合: https://product.gex-fp.co.jp/exoterra/index.php?cid=395&id=935&m=ProductListDetail ・ https://product.gex-fp.co.jp/exoterra/index.php?cid=402&id=957&m=ProductListDetail ・ https://zoomed.com/repti-ramp-bowl/ ・ https://spectrumbrands.jp/products-aqua/food/76828/ ・ https://www.zensui.co.jp/products/reptiles/solarium.html

## 6-hour refresh candidate / first item only

The wrangler.refresh.example.toml file is an inactive refresh-only configuration: a six-hour schedule, no public worker URL or preview URL, and a single approved ASIN. Bind the read-only route to the same KV namespace and verify the serving origin separately. Validate using Wrangler deploy with --config workers/amazon-product-images/wrangler.refresh.example.toml and --dry-run; do not deploy the example as-is. Do not retain credentials, image files, or returned URLs in Git or workflow artifacts.

2026-11-26 JST: the Japanese Creators API returned INKBIRD IBS-TH3 PLUS WIFI (large-display model) for B0BZVLB6R4, with a primary photo and OUT_OF_STOCK at lookup. B0CZ42FLXM was invalid. The draft uses the replacement product link, not the ordinary IBS-TH3; do not present it as in stock or reuse the retail photo. The original Zensui and Takimi ASINs still returned invalid responses; there is no safe photo substitution yet.

Before expanding: photo records expire independently 18 hours after their batch starts. A whole-batch 404 or invalid/incomplete response preserves that batch's old expiry and does not hold up other batches. Authentication or exhausted rate limits stop further requests without rolling back valid updates; failures are surfaced without logging photo URLs or credentials. Per-ASIN storage bounds a six-hour schedule to four writes per approved ASIN daily (up to 960 at the 240-item cap), before other account usage. Bulk reads are billed per key. Confirm shared free-tier headroom, live Cron runtime and failure alerts with the deployed pilot before enabling the full catalog.

### Pilot placement gate (no site changes)

- The actual rendered Starter Kit offers ReptoFilter 10i (B000NGQZU0) in the standard tiers for semi_aquatic_small and japanese_pond. Both include an existing Rakuten search link, so the mixed-retailer guard must block the Amazon image on both. Do not delete either retailer link to make this test pass.
- Use a dedicated Amazon-only product surface for the first approved preview. Check it with the production scripts after rendering, and test at 320px and 390px with the exact ASIN, existing tracking tag, no competing retailer inside the pilot surface, and the original purchase link still usable during an outage. Keep the rest of the site disabled. The existing local test page is not a production placement.
- For the 260g Tetra and 120g Kyorin food cards, inspect hydrated cards, not static anchors: food-best10.html adds retailer search at runtime. The pilot does not unblock those cards or count toward site-wide coverage.
