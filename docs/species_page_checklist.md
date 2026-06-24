# species_page_checklist.md
# カメライフガイド — speciesページ 作成チェックリスト
# バージョン: 1.0 | 策定日: 2026-06-24

---

## 使い方

1ページを作成するたびに、このチェックリストを上から順に実施する。
- ✅ = 完了・問題なし
- ❌ = 問題あり → 対処してから次へ
- — = 該当なし（スキップ可）

---

## PHASE 1: 作成前チェック（コーディング開始前に必須）

### 1-1. 対象種の基本情報確認

```
[ ] species.jsのエントリを取得した
    → name: {種名}
    → latin: {学名}
    → difficulty: {難易度}
    → size: {サイズ}
    → cites: {CITES区分 または null}
    → legal: {法的ステータス または null}
    → slug: null（hasPage:falseであることを確認）
```

### 1-2. 学名・分類の確認

```
[ ] 学名（属・種・亜種）が正しいか確認した
    → 確認方法: Wikipedia / IUCN RedList / Reptile Database
    → 亜種の場合、3語（三名法）か確認
    
[ ] 英語名が一般的に使われる名称か確認した

[ ] 日本語名と学名が一致しているか確認した
    （species.jsの name と latin のペアを確認）
```

### 1-3. 法規制の確認

```
[ ] CITES区分を確認した
    → I: 商業取引禁止（このページは作らない）
    → II: CB証明書が必要 → info-boxまたはwarn-boxで案内
    → 非掲載: 制限なし

[ ] 国内法規制を確認した
    → 特定外来生物: 新規購入禁止 → warn-boxで赤字警告必須
    → 条件付特定外来: 新規購入不可・継続飼育可 → warn-boxで詳細説明
    → 天然記念物: 原則飼育不可 → ページ作成しない
    → 問題なし: info-boxで「合法」を明記

[ ] species.jsの legal フィールドと一致しているか確認した
    → 'cites' / 'conditional_invasive' / null
```

### 1-4. 国内流通の確認

```
[ ] 現在の国内流通状況を確認した
    → CB流通あり: 専門店・ぶりくら等で入手可能
    → WC主体: 健康リスクを本文で注意喚起
    → 流通ほぼなし: ページ作成の優先度を再検討

[ ] 入手価格帯を把握した（affilate戦略に影響）
    → 低価格（〜5,000円）: 機材アフィリエイトが主収益
    → 中価格（5,000〜30,000円）: 種購入後の機材需要が高い
    → 高価格（30,000円〜）: マニア向けコンテンツ、機材より情報価値
```

### 1-5. 比較表候補の確認

```
[ ] 比較に使う近縁種を2〜3種選んだ
[ ] 選んだ近縁種が species/ フォルダに実在するか確認した
    → 確認コマンド: curl -s -o /dev/null -w "%{http_code}" {URL}
    → 200: 使用可
    → 404: 使用不可（別の種に変更）
```

### 1-6. gear-card の ASIN 選定

```
[ ] ルートを判定した（species-template.md の ASIN早見表を参照）
    → land_dry / land_humid / land_large
    → aquatic_small / aquatic_medium / aquatic_large
    → forest_cool / box_na / box_asia
    → softshell / brackish / snakeneck

[ ] 使用するASINを5つ決めた（equipment.jsで確認済みのもののみ）:
    1. {カテゴリ}: {ASIN}
    2. {カテゴリ}: {ASIN}
    3. {カテゴリ}: {ASIN}
    4. {カテゴリ}: {ASIN}
    5. {カテゴリ}: {ASIN}

[ ] ケージASINが必要な場合、検索リンクで代替することにした
    （ケージASINは全て未登録のため）
```

### 1-7. warn-box / info-box の内容決定

```
[ ] 最大リスク1点を決めた（warn-boxの内容）:
    → {内容: 大型化/脱走/攻撃性/規制/長寿等}

[ ] info-boxが必要か判断した:
    → CITES II種: 「CB証明書確認」案内
    → 条件付特定外来: warn-boxのみ（info不要）
    → 規制なし: 「飼育合法」の確認 → info-boxで明示
    → 必要なし: スキップ
```

### 1-8. hero の色決定

```
[ ] hero グラデーションを種カテゴリで決めた:
    → 水棲（池・川）:   #0c1a10 → #142a1a → #081208（深緑）
    → 水棲（海・汽水）: #0c1a2a → #183040 → #081420（青系）
    → リクガメ（乾燥）: #1a140a → #2a1e0a → #100e04（茶系）
    → リクガメ（多湿）: #0a1a10 → #1a2e18 → #081208（深緑）
    → ヤマガメ・ハコガメ: #0c1a10 → #142a1a → #081208（深緑）
    → スッポン: #0c1414 → #142828 → #081010（青緑）
```

---

## PHASE 2: コーディング中チェック

```
[ ] ファイル名が slug と一致している: species/{slug}.html

[ ] title が「{種名}の飼い方｜{KW}｜カメライフガイド」形式

[ ] canonical が正しいURLになっている

[ ] hero の h1 が日本語種名と一致している

[ ] stats-bar の4値（甲長・難易度・寿命・食性）が正確

[ ] warn-box / info-box の内容が事実と一致している

[ ] 比較表の内部リンクが実在するページのみ（PHASE 1-5 で確認済み）

[ ] gear-cards の全5件に Amazon リンク + 楽天リンクがある

[ ] 全 Amazon URL に tag=kamelife09-22 が付いている

[ ] 全 Amazon aタグに rel="nofollow sponsored noopener" が付いている

[ ] 全 gear-card に <p class="pr-note"> が付いている

[ ] FAQ が6問ある

[ ] species-nav に4リンクが揃っている
    ① shindan/index.html
    ② guide-beginner.html
    ③ [カテゴリガイド]
    ④ species-list.html

[ ] closing/footer が固定テンプレのまま（変更していない）
```

---

## PHASE 3: 作成後チェック（push前に必須）

### 3-1. HTML バリデーション

```
[ ] 開きタグと閉じタグが対応している
    → <div class="gear-card"> が5つ・</div> が対応している
    → <details class="faq"> が6つ・</details> が対応している

[ ] Amazon URL を全件チェックした
    → tag=kamelife09-22 の有無（5件）
    → rel="nofollow sponsored noopener" の有無（5件）
    → ASIN が equipment.js の確認済みASINと一致

[ ] 内部リンクを全件チェックした
    → ../index.html / ../species-list.html 等が相対パス ../で正しい
    → species/xxx.html の同階層リンクが実在するページのみ
```

### 3-2. species.js の変更確認

```
[ ] 対象エントリを特定した（行番号: {行番号}）

[ ] 以下のみ変更した:
    slug: null → slug: '{slug}'
    hasPage: false → hasPage: true

[ ] 他のフィールド（name/latin/match/score等）は変更していない
```

---

## PHASE 4: push後チェック（push完了後に実施）

### 4-1. 公開確認

```
[ ] ページ本体が200を返すことを確認した
    → URL: https://gagalife04291225-lab.github.io/kame-life-guide-/species/{slug}.html

[ ] species.js が更新されていることを確認した
    → raw.githubusercontent.com で slug/hasPage を確認
```

### 4-2. リンク確認

```
[ ] 同階層の比較種リンクが全て200を返す（curl HEAD確認）

[ ] 内部リンク（../）が全て実在するページを指している

[ ] Amazon リンクが正しいASINにリンクしていること（目視確認推奨）
```

### 4-3. 診断ツール連携確認

```
[ ] 診断ツールで当該種が出る条件を確認した
    → species.jsの match: function を参照

[ ] match条件を満たす回答で診断を実施した
    → 結果に対象種が表示された: ✅
    → 「Species Guide」CTAが表示された: ✅
    → CTAリンクが species/{slug}.html に飛んだ: ✅
```

### 4-4. QA Snapshot 作成

```
[ ] qa_snapshot_{slug}.md を qa_snapshot_template.md を使って作成した

[ ] 全6セクションを埋めた:
    1. Changed Files
    2. species.js Diff
    3. Critical HTML Blocks（title/description/hero/stats/warn/affiliate）
    4. Validation（6項目）
    5. Self Score（5指標 + 根拠）
    6. Template Deviation

[ ] QA Snapshotを提出した
```

---

## PHASE 5: 作成完了後の記録

### 5-1. 完了記録

```
完了日:
対象種: {種名}
ファイル: species/{slug}.html
species.js変更: slug='{slug}', hasPage=true
commit hash: {10桁}
```

### 5-2. 次の作業候補

```
hasPage:false で優先度Sの残り種を確認:
→ Tier Sで未作成の種: （毎回 species.js を確認して記載）

関連ページとして内部リンクできる:
→ 今回作成した {slug} を比較表に含められる種:
   （今後作成するページの比較表候補）
```

---

## クイックリファレンス

### 確認済み ASIN 一覧

| ASIN | 商品名 | カテゴリ |
|---|---|---|
| B00JZFJ5R0 | ビバリア スパイラルUVB デザート 26W | UVB（リクガメ乾燥） |
| B00JZFJ5LQ | ビバリア スパイラルUVB フォレスト 26W | UVB（水棲・ヤマガメ） |
| B0043AYZL8 | GEX サングロータイトビーム 100W | バスキング（大型） |
| B0043B0AU2 | マルカン バスキングライト 50W | バスキング（中型） |
| B0043B2AJQ | マルカン バスキングライト 30W | バスキング（小型） |
| B0DF2SJMCJ | ビバリア リクガメフード 907g | フード（リクガメ） |
| B00E0GMQAM | キョーリン カメプロス 200g | フード（水棲・汎用） |
| B00I0MM9MC | あかぎ園芸 赤玉土 小粒 20L | 床材（リクガメ乾燥） |
| B005J94WEM | ジクラ ヤシガラマット 細目 8L | 床材（ヤマガメ・多湿） |
| B00XVP3TPO | 水作 大磯砂 2.4kg | 底床（水棲） |
| B004WH8YBO | 水作 川砂 2.4kg | 底床（スッポン） |
| B0012UO6Q6 | テトラ オートワンタッチフィルター AT-50 | フィルター（水棲） |

### Amazon リンクフォーマット

```
https://www.amazon.co.jp/dp/{ASIN}?tag=kamelife09-22
```

### 楽天検索リンクフォーマット

```
https://search.rakuten.co.jp/search/mall/{検索語句}/
```

### hasPage:false 残存種（2026-06-24現在 51種）

Tier S（最優先）:
- ニシキマゲクビガメ（ピンクベリー）
- スッポン（シナスッポン）
- スパイニースッポン
- マンヤマガメ
- キボシイシガメ
- アカスジヤマガメ
- タイワンセマルハコガメ
- ヒラリーカエルガメ

Tier A（次優先）:
- ミスジドロガメ / アルビノシナスッポン
- テラピン3種（ノーザン・カロリナ・オルナータ）
- フトマユチズガメ / ヤエヤマイシガメ / ヨーロッパヌマガメ
- マレーハコガメ / ヘビクビガメ / アフリカヨコクビガメ
- ホオアカドロガメ / ミナミイシガメ / エロンガータリクガメ
- ミシシッピアカミミガメ（条件付特定外来・情報ページとして）
