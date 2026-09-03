# AI-HANDOFF — AI作業の現在状態（単一正本）

> **このファイルが「今どこまで終わっていて、次に何をするか」の唯一の正本。**
> ChatGPT → Claude Code → 完了報告 → ChatGPT の往復で、
> 完了済み作業の再調査・次工程の取り違え・固定事項の再検証を防ぐために置いている。
>
> - **作業開始前に必ず読む。** ルールは `CLAUDE.md`「重複作業防止ゲート」と
>   `.claude/rules/chatgpt-handoff.md` にある。
> - **作業終了時に必ず更新する。** 更新手順は本ファイル末尾「更新ルール」。
> - **現在状態だけを書く。** 履歴は `AI_CHANGELOG.md`（append-only）、
>   規範は `DEVELOPMENT_CONSTITUTION.md`、恒久ルールは `CLAUDE.md`。ここに重複させない。

---

## CURRENT_BASE

| 項目 | 値 |
|------|-----|
| 基準 | `origin/main` = **cfd2915**（rakuten 自動更新 2026-09-02 まで反映済み・実測値） |
| サイトファイルの状態 | 本PRは**ドキュメントのみ**の変更。サイトファイル（HTML/CSS/JS/data/assets）は無変更 |
| 確認方法 | `git log --oneline -1 origin/main` で**実測する** |
| 最終更新日 | 2026-09-03 |
| 掲載種数 | **119種**（通常一覧 115 ＋ 参考掲載 4） |
| 作業ブランチ | `claude/claude-md-split-pr1` |

---

## COMPLETED — 完了済み。**再調査禁止**

### CLAUDE.md 整理 PR-1 — 完了記録の分離（2026-09-03 / 本PR）

CLAUDE.md 905行のうち約3分の1が過去の完了記録で占められていたため、
恒久ルールと作業記録を分離した。**移動のみで、本文は一切改変していない。**

- CLAUDE.md **905行 → 646行**
- 新規 `docs/archive/COMPLETED-PROJECTS.md`（296行）へ移動:
  生体写真の全数監査（2026-08-22）／生体写真監査の完了（2026-08-23）／
  亜種PROJECT Phase B 完了記録／同 Phase C 完了記録／title 重複の修正／
  HOLD案件の外部ソース完全調査／HOLD 4件の写真素材 最終確定
- CLAUDE.md 側には要約と参照リンクを残した。**再監査禁止の効力は維持している。**
- 恒久ルール（写真の選定基準・絶対に使わない写真・採用する写真・手順・
  正式クローズ方針・再開条件・写真監査の鉄則5項目・NO-REWORK GATE）は
  すべて CLAUDE.md に残した
- 移動に伴う相互参照の修正1件のみ実施（「下記『HOLD 4件の写真素材 最終確定』」→
  アーカイブへのパス）

**検証（実測）**: 移動対象の非空行209行はアーカイブ側に改変・欠落0。
残す対象の非空行468行は新 CLAUDE.md に欠落0。

**移動先について**: 当初 `AI_CHANGELOG.md` へ移す計画だったが、同ファイルは
PR単位の定型ログ（Actor / Change / Reason / PR・Commit / Approver / Conforms）であり
判定表・出典表を流し込むと形式が壊れるため、`docs/archive/` に分離した。


### 成体サイズ監査の修正・正本化（2026-08-31 / 本PR）

全119種サイズ監査（READ ONLY・確定済み）の指摘を修正した。**再監査はしていない。**

- **チェリーヘッド**: 30〜40cm → **20〜30cm 基準**（ページ4箇所＋species.js）。
  基準種アカアシ（30〜35cm）より大きい自己矛盾を解消
- **スベスッポン**: 上限45cm → **メス最大35.6cm** 基準（ページ11箇所＋species.js）。
  meta の「20〜25cm」という別方向の誤りも同時に是正
- **イベラギリシャ**: 20〜30cm → **成体18〜25cm＋大型個体群30cm超の補足**
  （ページ8箇所＋species.js）。「最大35cm」は一般サイズとして表示しない
- **スッポンモドキ**: 50〜70cm → **成体30〜55cm・最大70cm**（最大70は維持）
- **アラバマチズガメ**: species.js を文献値（♂11.3〜12.7/♀27.3〜29.2）と同水準の
  オス〜12cm/メス〜27cm へ。ページは元から正しく無変更
- **master 正本化**: 上記4種の `max_shell_length_cm` を UNPROVEN → **LIKELY**
  （value・provenance・sources・note・last_verified を記録）。アラバマは既存 27.3 LIKELY を維持。
  **対象外101件の UNPROVEN には手を付けていない**

**監査の訂正（重要・再発防止）**: 監査報告の「species.js 誤り2件（アラバマ ♂7/♀12・
イベラ 12〜15cm）」は**私の抽出バグによる誤検出**だった。species.js には slug を持たない
6レコード（インドホシ・ビルマホシ・エジプト・マダガスカル・ヒラタニオイ・テキサスチズ）があり、
非貪欲 regex がその size を次レコードに誤帰属させていた。正しいレコード分割で再照合した結果、
**page↔species.js の20%超乖離は0件**。実在した誤りは「全層で同じ間違い」型
（チェリーヘッド・スベスッポン等）のみで、これは外部文献との照合でしか発見できない。

### READABILITY — 種ページ113枚に「このページの目次」を生成（2026-08-30 / 本PR）

NEXT PROJECT DISCOVERY（READ ONLY）の候補4を Owner 指示「3で」で着手・CLOSE した。

- **`tools/gen-species-toc.js` を新設**（既存 generator 4本と同じ設計様式:
  BEGIN/END マーカー・`--check`・冪等）。入力は各ページ自身の `<h2>` だけ。
  **本文・見出しの文言は一切変更していない**
- 目次対象の h2 に `id="sec-N"` を付与し、最初の対象 h2 の直前に
  `<nav class="sp-toc">` を挿入。目次から除外: `lp-heading`（ヒーロー）／
  関連ページ／ほかの飼育ガイド／Kame Life Guide（回遊・フッター見出し）
- `css/species.css` に `.sp-toc` スタイルと `[id^="sec-"]{scroll-margin-top:64px}`
  を追加（固定ナビ `--klg-nav-h:52px` に隠れない着地位置）
- 実測: **113/113 ページ・目次項目868件**。anchor↔id 不整合0・id重複0。
  冪等（2回目実行で書き込み0）。全 generator `--check` 差分0。
  `gen_related_links.py --apply` もスクラッチで無干渉を確認（更新0・壊れたURL0）
- **DISCOVERY の「目次あり2/113」は誤検出だった**と訂正: 2件は外部URL
  `iucn-tftsg.org/toc/` の部分一致で、実際の目次は **0/113** だった

### 公開表示の破損2件 CLOSE（2026-08-30 / 本PR）

PUBLIC IMPACT 棚卸し（READ ONLY）で「4条件（未解決／外部入力不要／Owner判断不要／公開影響あり）を
すべて満たす」と確定した2件だけを処理した。**新しい監査は行っていない。**

- **guide-moist.html の対象種リストを generator から同期。** 見出し「22種」→「23種」、
  ヒラセガメの直後にオプストヒラセガメ（`species/obsti-hirase-turtle.html` /
  *Cuora mouhotii obsti*）を1行追加。**手編集はせず `node tools/gen-guide-species.js` の
  再実行で生成**（ブロックに「手で編集しない」と明記されているため）
- **`species/canton-reeves-turtle.html` の meta description の破損を除去。**
  正常な100文字の後ろに残っていた置換残骸53文字（未対応の `'` と開き括弧を欠いた
  「Turtle）」を含む）を削除しただけ。**新しい文言は作っていない。**
  og:description / title / og:title は無変更

**確定した事実（再調査しない）:**

- **乖離の原因はデータ不足ではなく generator の再実行漏れ。** オプストヒラセガメは
  `shindan/species.js:874-880` に `hasPage: true` で以前から存在していた。
  **種を追加したら `tools/gen-guide-species.js` を再実行する**運用が抜けやすい
- 公開ページを生成する generator 4系統のうち、乖離していたのは gen-guide-species.js だけ。
  gen-species-list / gen-guide-nav / gen-category-ui は修正前後とも差分0
- description の破損は全 species ページ中この1件のみ（修正後は0件）。
  meta description を生成するスクリプトは存在せず、過去の手作業置換の失敗が残ったもの
- 実測: 全 generator --check 差分0 / ranking QA 18/18 PASS / validator MISMATCH 0・WARN 0・
  `--strict` exit 0 / `test_validate_species.py` 10 PASS /
  公開HTML差分は上記2ページのみ / data・shindan・ranking・js・css・sitemap 差分0 /
  CITES・Amazon・楽天の該当行差分0

**CLOSED と確定したもの（棚卸しの実測結果。再調査しない）:**

- `CLAUDE.md` が「次工程」として残していた**クレジット表記ゆれ10件は解消済み**。
  Wikimedia 由来とされた5件はいずれも iNaturalist 出典＋CC ライセンスリンク付きの
  figcaption になっており、alt の和名5件も photo-credits.html の見出しと一致していた
- `photo-credits.html` の「ヒメハコヨコクビガメ / *Pelusios castaneus*」は、
  同ページ956行目の近縁種代替の注記でこの事例が名指しで開示されており**欠陥ではない**
- `ranking-beginner-top10.html` 9位の公開スコア **62.00 は species_scores × type0 で
  完全一致**する。10位の 61.90 と違い正しい種のレコードに由来し、他8枚と同素性。
  **撤去対象にあたらない**

### Species Scores Phase 1A — 既存スコア基盤の安全化（2026-08-30 / 本PR）

Phase 0（READ ONLY・**判定C**）で確定した既知の危険だけを除去した。
**119種への拡張・6軸再設計・既存20件の再採点は一切していない。**

- **legacy 2件を隔離。** `data/species_scores.json` の `reimanns-side-neck` と
  `yellow-spotted-river-turtle` に `ranking_eligible: false` ＋ `quarantine_reason` を付与。
  **レコードは削除していない**（GA/履歴互換を保持）。評価値10軸は**差分0**
- **`has_page:false` を自動隔離条件にはしなかった。** `has_page` は掲載上の事実で
  スコアの妥当性とは別の軸。自動条件にすると両方向で誤る
- **`js/ranking-engine.js`**: `isQuarantined()` を追加し、`getTopByType` は `formula.filter`
  より**前**に隔離レコードを除外。`calculateScore` は隔離レコードで throw
- **type10 long_life を封鎖。** `unavailable: true` ＋ `weights: {}`。
  friendliness を寿命の代理に使う旧式を撤去し、`assertUsable()` が
  unavailable／weights空の type を必ず throw させる。**0点代入で計算できるように見せていない**
- **type0 の式・他typeの式・friendliness の値は無変更**
- QA に Check 13〜18 を追加（隔離フラグ / 全typeからの不在 / 61.90 の再生成不可 /
  type10 の失敗 / 利用可能11type / type0 重み不変）

**確定した事実（再調査しない）:**

- **61.90 の出所はキメラレコード `reimanns-side-neck`。** slug・species_name_ja は
  ライマンヘビクビガメだが、評価値と notes はヒメハコヨコクビガメ由来。
  **どちらの種の正解データにもならない。120値を修正・転用してはならない**
- **`ranking-engine.js` を読み込む HTML は0ページ**（現在も過去も）。公開ランキングは静的HTML。
  エンジンの出力変化は公開物に波及しない
- QA Check 6 は `species_page_url` に文字列を必須としており、PR #118/#123 で正当に null に
  した2件で **BASE 時点から exit 1** になっていた。null を許容するよう修正済み
- 実測: ranking QA **18/18 PASS** / validator MISMATCH 0・WARN 0・`--strict` exit 0 /
  `test_validate_species.py` 10 PASS / 公開HTML・ranking HTML・species-master 差分0 /
  楽天 available 36・search 65・pending 3 / Amazon 77本

### 公開データ整合・事実性の連続CLOSE（2026-08-29〜30 / PR #115〜#123）

`AI-HANDOFF.md` の同期が PR #114 で止まっていたため、以下をまとめて COMPLETED に記録する。

| PR | merge | 内容と確定した結論 |
|----|-------|------------------|
| #115 | `cd06642` | `ranking-beginner-top10.html` 10位カードのレイヤ不整合を1種へ統一（学名 `Elseya schultzei` → `Pelusios nanus`、GA識別子 `reimanns-side-neck` → `west-african-mud-turtle`）。9位の species.js 不在は**推測でデータを作らず**現状維持 |
| #116 | `1daefcb` | 10位の水槽サイズ 30cm → **60cm**。Owner 指摘「終生飼育で30cmは小さい」。自サイトの種ページが 60cm〜 と記載しており、45cm ではなく**自サイトの canonical に合わせた** |
| #117 | `c00189d` | 10位 Cons を「泳ぎが苦手で水深13〜15cmと逃げ場が必須・入手はイベント中心」へ是正 |
| #118 | `dbb4646` | モンキヨコクビガメの slug 二重化を解消。master は **113/113 で slug == ページのファイル名**という規則が成立していることを実測。GA履歴を壊さない範囲で統一し、`podocnemis-unifilis` は `page: null` と確定。あわせて guides 4ページのアフィリエイトリンク **rel 未付与12本**を付与（href・商品・表示文言・ID は無変更） |
| #119 | `5317a18` | `tools/validate_species.py` の TypeError を最小修正。**原因は `r["cites"]` ではなく `cites_label()` が返す `None`** だった。null を「CITES未掲載」等へ**意味変換していない**。WARN として可視化する。回帰テスト `tools/test_validate_species.py` を新設（10 PASS） |
| #120 | `40040b7` | 10位の**裏づけの無い公開数値を撤去**。score `61.90 / 100` → 表示削除、初期費用 `¥25,000〜` → `未算出`。**根拠のない価格を新しく推測していない** |
| #121 | `68a79c2` | チュウブニシキガメ・スワニークーターの CITES を **`not_listed` / CONFIRMED** で確定（Owner 提供の一次資料を固定入力として使用。egress 再試行はしていない） |
| #122 | `0d9f962` | `SHINDAN-SPECIES.md` に Phase B/C 亜種8件を独立行として追加。**推測値で埋めず**、親種の値を無条件コピーもしていない。validator WARN の抑制・除外もしていない |
| #123 | `640791d` | 汽水ガメの表記重複を解消（独立行になったマングローブを「その他」に重複させない）＋ `species_scores.json` の `species_page_url` 不整合4件を是正。**slug・GA識別子・score・6軸評価値は無変更。URLだけを是正** |

### RAKUTEN-ID Phase 5 — 型番検索の発火条件拡張（2026-08-29 / PR #114 / merge `e8bf58b`）

Phase 4 では型番単独クエリが「主検索0件」のときしか撃たれず、それが理由で救えていなかった
2件を回収した。**available 34 → 36。**

- **発火条件を2つ追加**（いずれも `rakutenModelNo` 宣言商品に限定・1商品につき最大1回）:
  ① 主検索が**非致命エラー**（BAD_RESPONSE / API_ERROR / NETWORK / 5xx retry 使い切り）で落ちた場合。
  **AUTH / RATE_LIMIT は従来どおり同期全体を中断**する（この2つは到達しない）。
  ② 主検索の候補が **AMBIGUOUS / REJECT にしかならない**場合。型番側で EXACT/STRONG を
  特定できたときだけ候補集合を差し替え、それ以外は Phase 4 までと完全に同一挙動
- 昇格条件は**不変**（allowlist ＋ EXACT/STRONG ＋ scoreCandidate ＋ 成果対象 affiliateUrl）。
  `CONFIDENCE_THRESHOLD` 8.0 と identity 定義は無変更。**型番一致だけでは昇格しない**
- PROMOTE_ALLOWLIST 30→31（`basking_100w`。Owner が Phase 5 の対象として明示指定）

**実昇格2件**（dry-run 33277758200 → 本適用 33277932962 / commit 36457ec）:

| ID | 判定 | 決め手 | 出品 |
|----|------|--------|------|
| `basking_100w` | EXACT / qual 4.9 | `rakutenModelNo: 'PT2138'` の宣言だけで**主検索の候補が AMBIGUOUS → EXACT に確定**。型番クエリは不要だった | GEX サングロー タイトビーム バスキングスポットランプ 100W PT2138 / プロツールショップヤブモト ¥2,280 |
| `shelter_small` | EXACT / qual 7.7 | 主検索が **API_ERROR** → 新設の①経路が型番 `RX-191` で回復 | ロックシェルターSP S RX-191 スドー / 爬虫類用品店 トップクリエイト ¥760 |

**昇格しなかったものと実測理由:**

| ID | 結果 | 理由 |
|----|------|------|
| `heater_aqua_100w` | 未昇格（search 維持） | 新設の②経路は正しく発火したが、**型番クエリ "SH55" の10件は「今治タオル 今治謹製至福タオル SH55030」等の無関係商品**だった。identity gate が AMBIGUOUS を返して差し替えを拒否し、誤リンクは発生していない。**SH55 の宣言は撤回済み**（commit a50eb1f） |
| `food_tortoise_staple` | 未昇格 | 本適用時に候補を確保できず（dry-run では STRONG qual 6.3 に到達）。Phase 2・3・4 と合わせ**4回連続**で本適用時だけ落ちる |
| `substrate_cypress` | 未昇格 | Phase 4 で PT2752 が使えないと確定済み。型番ルートなし |

**確定した事実（再調査しない）:**

- **`SH55` は楽天の検索キーとして機能しない。** 第2次救出調査の「SH55 → 67件」は
  PT2752 と同じく**件数だけを見た誤判定**だった。Phase 4 の教訓
  「候補件数だけで型番ルートの有効性を判定してはならない」が再確認された
- **`PT2138` は自サイト商品と同一SKU。** GEX公式製品DB「サングロータイトビームバスキング
  スポットランプ100W PT2138」と商品名・W数が一致。同シリーズ75W(PT2136)は watt 競合で REJECT、
  「PT2138用」アクセサリは適合表記で REJECT されることを fixture で確認済み
- **型番宣言が価値を持つのは2通り**: ①型番クエリが正商品を引く（RX-191）
  ②宣言そのものが identity の根拠になり主検索の候補を EXACT へ引き上げる（PT2138）。
  ②は追加のAPI呼び出しすら不要で、**①より確実**
- available **36** / search 65 / pending 3。available 36件すべて成果対象URL。
  既存 available の降格0。Amazon差分0（affiliateUrl / asin 行の変更0）。誤商品0

### RAKUTEN-ID Phase 4 — 型番ルートの追加と B確定5件の処理（2026-08-29 / PR #113 / merge `8c7cdca`）

第2次救出調査（READ-ONLY・確定済み）の B確定5件＋承認済み food_tortoise_staple を処理した。

- **`rakutenModelNo` を導入**。0件時の代替クエリ1本目に「型番単独」を置く。総本数の上限2本は据え置き。
  適用経路(main)へも配線したが**型番を宣言した商品に限定**したため、他101商品の代替クエリ・identity は
  旧実装と1件も差分なし（機械照合で確認）
- CATEGORY_GUARDS 最小追加: `enclosure` に パンテオン/テラリウム、`substrate` に デザートベース
- PROMOTE_ALLOWLIST 25→30（Owner承認のB確定5件）

**実昇格2件**（run 33276960299 / commit 0ec4e46）:

| ID | 判定 | 決め手 | 出品 |
|----|------|--------|------|
| `enclosure_kayuso_90` | EXACT / qual 6.6 | ガード語彙「パンテオン」追加 | 三晃商会 パンテオン ブラック BK9045 E15 / ネオス ¥26,750 |
| `substrate_grassland_mix` | STRONG / qual 5.9 | ガード語彙「デザートベース」追加 | エキゾテラ デザートベース 細目 3L / アルメリア ¥1,994 |

**昇格しなかった4件と実測理由（推測ではなく実行ログ）:**

| ID | 結果 | 理由 |
|----|------|------|
| `substrate_cypress` | 未昇格 | **PT2752 は楽天の検索キーとして機能しない**。型番クエリの結果は「【中古】廣瀬裕子のしあわせになるDVD」等の無関係商品で、identity gate が AMBIGUOUS で正しく阻止。宣言を撤回済み（第2次調査の「PT2752→5件＝有効」は件数のみを見た誤判定で、本Phaseで訂正） |
| `heater_aqua_100w` | 未昇格 | 主クエリ「水中ヒーター 100W 亀 水槽」が4件返すため**0件フォールバックに到達しない**。→ Phase 5 で②経路を追加して到達させた結果、**SH55 自体が使えない**と判明（Phase 5 参照） |
| `shelter_small` | 未昇格 | 本適用時に主クエリが **API_ERROR**。main() の非致命エラー処理はその商品をスキップするため型番フォールバックに到達しなかった。→ **Phase 5 の①経路で解消・昇格済み** |
| `food_tortoise_staple` | 未昇格 | 本適用時に **NO_RESULT**（Phase 2・3・4 と3回連続。dry-run では毎回 STRONG に到達するため時間帯による在庫変動とみられる） |

**確定した事実（再調査しない）:**

- **型番検索の成否は「楽天の出店者が商品名に型番を併記するか」で決まる。** 件数がヒットしても
  正商品とは限らない（PT2752 が実例）。**候補件数だけで型番ルートの有効性を判定してはならない。**
- 実際に正商品へ到達した型番は **RX-191 のみ**（dry-run 実測）。
  ※ Phase 5 で **PT2138 が2例目**として追加された（ただし型番クエリ経由ではなく
  identity の根拠としての採用）。
- Phase 4 終了時点で available **34** / search 67 / pending 3。**現在値は Phase 5 を参照**。

### RAKUTEN-ID Phase 3 — 日次レガシー経路の identity gate 統一（2026-08-29 / PR #112 / merge `346bd57`）

日次 rakuten-sync の 8.0 経路にも identity gate を適用し、誤商品CTAが再発しない構造にした。

- **既存 available**: EXACT/STRONG を特定できれば検証済み出品で更新（誤商品CTAの是正差し替えを含む）。
  現CTAの出品（itemCode一致）が REJECT で代替を特定できなければ search へ安全降格。
  AMBIGUOUS/未確証は**勝手に更新しない**（無変更）。旧経路の「スコア<8.0のavailableを無条件降格」は
  廃止（この旧仕様のままだと identity 昇格済み24商品が次の日次で誤降格されるところだった）
- **search→available**: 従来の 8.0 閾値（据え置き）＋ identity EXACT/STRONG ＋ 成果対象URL を全要求
- 誤検出対策3件を実API dry-run で発見し修正: 消耗品/入数判定を itemName 限定（catchcopyの
  「ろ材」言及で本体を誤REJECT）／寸法「600×295×360」の×Nを入数と誤認／容量「リットル」表記の解析追加
- **本適用結果**（run 33254770061 / commit 026355a）: 降格3（filter_canister_medium・large =
  ろ材付セット出品 / substrate_soil = 容量不一致14L≠3L）、是正差し替え1（**filter_canister_premium**:
  ろ材セットCTA → 2217本体EXACT出品 charm ¥26,997）、昇格1（food_tortoise_herbs = STRONG・9.1 →
  下記 DECISION R3）、KEEP 4（tank_60/substrate_coco/thermometer_digital/analog = AMBIGUOUS）。
  **available 32 / search 69 / pending 3**。全32件が成果対象URL。fixture 41+38 PASS

### RAKUTEN-ID Phase 1＋Phase 2 — 楽天アフィリエイト自動収益化（2026-08-29）

| 工程 | 状態 | 確定した結論 |
|------|------|-------------|
| Phase 1（identity gate 実装＋dry-run） | **PR #110 / merge `fbefc1d`** | `scripts/rakuten-identity.js` 新規（EXACT/STRONG/AMBIGUOUS/REJECT）。既存 8.0 閾値・レガシー経路は無変更。実API dry-run 101件: 誤マッチ6件を特定し候補仕分け（◎24/△5/❌6）。Owner が ◎24＋thermostat 条件付き承認・△❌HOLD 非承認を決定 |
| Phase 2（本適用） | 本PR | **承認 allowlist 25ID を IDENTITY_PROMOTE の必須ゲート化**（承認外は EXACT/STRONG でも昇格禁止・昇格モードでは allowlist 外に API 照会もしない）。誤マッチ防止（消耗品/適合表記/照明系/変種SKU/series=itemName限定）を実装し fixture 38/38 PASS。再dry-run（run 33248746005）で ❌6件の PROMOTE 消滅と新規誤マッチ0を確認後、identity_promote 実行（run 33248895442）で **24商品を search→available 化**（commit `14e9ffd`・全件 `hb.afl.rakuten.co.jp` 成果対象URL・楽天API 返却値のみ使用） |

**再実行しない事実:**

- 昇格24: tank_90 / uvb_compact / uvb_t5_desert_12 / uvb_mvb_100 / basking_50w / basking_75w /
  basking_halogen_50w / heater_panel_30w / 45 / 60 / heater_radiant_panel / heater_cord_20w /
  thermostat_digital / **thermostat_kotobuki_hydra**（Phase 0 降格→EXACT+ガード通過で正規URLに復帰）/
  filter_submersible_medium / substrate_gex_terrarium_soil / shelter_medium /
  supplement_calcium_d3 / calcium_no_d3 / supplement_calcium_plus / supplement_multivitamin /
  thermometer_dual_probe / thermometer_wifi / hydrometer_tetra
- **food_tortoise_staple のみ承認済みだが未昇格**（promote 実行時に API 0件 = NO_RESULT。
  allowlist に残してあり、次回 identity_promote 実行で昇格できる）→ UNRESOLVED
- rakutenStatus: available 34 / search 67 / pending 3（計104。**この工程終了時点の値**。現在値は Phase 5 を参照）。Amazon 系フィールドの変更 0
- CATEGORY_GUARDS(heating) に「サーモスタット」を追加した（閾値 8.0 は数値・条件とも無変更）
- 日次 schedule 実行では identity_promote は構造的に無効（workflow の式が必ず 'false' になる）
- `data/rakuten-diag.json` に25件の診断記録（secret / affiliateUrl / itemUrl なし）

### VISUAL SYSTEM Phase 3 — 公開表示の欠陥CLOSE（2026-08-29 / PR #109 / merge `386f86e`）

デザインは作り直していない。**実在する表示欠陥だけ**を潰した。
配色・書体・トップ構成・写真は変更していない。

| 欠陥 | 原因 | 修正 |
|------|------|------|
| **トップのクリーム帯** | Phase 2 の `header.hero{padding:38px…!important}` が species 以外にも適用。**さらに `index.html` 自身に旧ナビ用 `padding-top:56px /* nav height */` が残り、`body.klg-has-nav` の 52px と二重**になっていた | CSSを `body.klg-species header.hero` へスコープ（generator が全 species に `klg-species` を付与）＋ index の旧ナビ補正を 0 に。**hero 上部の空白 56px → 0px** |
| **Kids の見出し異常折返し** | `.k-card h2` `.k-dont h2` `.k-link b` `.k-sec h1/h2` が `display:flex`。テキストと `<ruby>` が別々のフレックスアイテムになり、2行になった瞬間にベースラインが崩れて縦に散らばる | `display:block` に戻し、アイコンは `inline-block`、丸番号は `float:left`（2行目も右に回り込み横並びを維持）。**320/360/390px で再現していた破綻が解消** |
| **review系6ページの PC グリッド不一致** | `css/style.css` の `.article-hero-inner` が `max-width:840px` の左寄せ、本文 `.article-body-wrap` は `760px` 中央寄せ。1920px で h1=left48 / 本文=left645 | hero-inner を `760px` 中央寄せ＋内側 padding を本文と一致。狭幅の padding 二重も解消。**390/750/1440/1920 すべてで ずれ 0px** |

**同時に実測確認した8項目**（再現しなかったものは変更していない）:

| 項目 | 結果 |
|------|------|
| スマホナビの overflow | **再現せず**（360/390/412px で `scrollWidth == clientWidth`、右端余白 8〜12px）→ 変更なし |
| 種カード和名切れ | **再現せず**（119枚すべて `scrollWidth <= clientWidth`）→ 変更なし |
| フィルタチップ切れ | **再現せず**（21個すべて）→ 変更なし |
| 写真なしカード | 12件あるが「写真を準備中」プレースホルダが正常動作。**欠陥ではない**→ 変更なし |
| トップのブランドラベル重複 | **再現**。ナビロゴ「KAME LIFE」と `.h12-brand` が二重 → `.h12-brand` を非表示（DOM・文言は保持） |
| Care Module の絵文字 | **再現**（🐢🔬🌿📏🧒 の5件）→ SVG へ置換 |
| 「案内人に相談」の💬 | **再現** → SVG へ置換 |
| `Trouble Shooting` 表記 | **再現**。英語として誤り（正しくは1語）→ `Troubleshooting` へ（10ファイル） |

**検証**: 390 / 750 / 1440 / 1920px × 16ページ（トップ・種一覧・species2・guide・ranking・review2・compare・trouble・shindan・Kids5）で
横スクロール0 / はみ出し0 / 文字切れ0 / 異常折返し0 / 画像失敗0 / SVG欠落0 / ナビ重なり0 / JSエラー0。
全 generator 冪等（再実行で書き込み0）。回帰ゲート species→guides **113/113 維持**。

### VISUAL SYSTEM Phase 2 / DESIGN CLOSEOUT（2026-08-29 / 本PR）

Phase 1（54→78点）の残課題をCSS側で解消した。
**SEO・分類・CITES・内部リンク・本文内容・著者情報は変更していない。**

| 項目 | 実測（前 → 後） |
|------|----------------|
| 11.4px未満のテキスト | species 113ページで **16種類・1ページあたり最大93個 → 0** |
| species ヒーロー高さ | 370〜904px（中央値429） → **300〜700px（中央値355）** |
| 写真がFVに入らないページ | 1 → **0** |
| stats-bar 列数 | 4列（元から統一。前回の「2/3/4列」は表示上の誤認） |

**タイポグラフィは機械的な一律15px化をしていない。** 用途を確認し、
識別情報（学名・サイズ・法規制）／購入判断（必須・推奨バッジ・価格注記）／
FAQ分類タグなど「読ませる必要があるもの」だけ引き上げた。
装飾的な eyebrow は小さいままとし、下限 11.5px に揃えただけ。
**Kids は対象読者が違うため対象外**（M PLUS Rounded と独自サイズを維持）。

**修正は正本CSSで行った** — `css/system.css` の後に読まれる
`starter-kit.css` `quick-facts.css` `life-preview.css` `species.css`、
および実行時にCSSを注入する `js/comparison-cta.js` が上書きしていたため、
それぞれの定義元を直した（`!important` での押し切りはしていない）。

**species ファーストビューは CSS のみで解決した。**
リード文の削除・要約は一切していない。hero の padding、行間、
hero 内 note-box の圧縮、stats-bar の行高・文字サイズ統一で
高さのばらつきを圧縮した。

**残りUI**: species-list の生息環境フィルタに右端フェードを追加して
横スクロール可能であることを示した。Photo Credits を
「写真の出典を見る」のアウトラインボタンにし、信頼設計の一部として
埋没させないようにした。

#### 作業中に自己検出して修正した回帰

**`scripts/gen_related_links.py` が自動生成リンクを絵文字へ差し戻していた。**
Phase 1 で rel-btn を SVG 化したが、generator 内のラベル定義は絵文字のままだったため、
再実行するたびに ⚖️🔰🔄☀️ に戻っていた。
ラベルを `[[icon-id]] テキスト` 形式に変え、出力時に SVG へ展開するようにして修正。
**これで generator は冪等になり、Phase 1 の成果を壊さない。**

### VISUAL SYSTEM Phase 1（2026-08-29 / 本PR）

見た目監査 54/100 の最大原因「デザインシステム不統一」を一工程で解消した。
**SEO・分類・CITES・本文内容・著者情報は変更していない。**

| 項目 | 実測（前 → 後） |
|------|----------------|
| ナビの種類 | mini-nav / site-header / なし の3系統（7ページはナビ皆無） → **klg-nav 1種類**（Kids は専用バンド） |
| 主要ボタンの角丸 | 0 / 7 / 8 / 10 / 24 / 9999px の6種 → **pill 1種**（トークン化） |
| 主要ボタンの色 | ゴールド / forest / 白 / 透明 / **Amazonオレンジ** の5種 → **ブランドゴールド 1色** |
| species ヒーロー配色 | 種ごとにバラバラ（濃緑/濃赤/茶橙/紺…） → **6生態カテゴリ配色に集約** |
| species ヒーローのアイコン | 🔬顕微鏡 / 🦏サイ / 🔴赤丸 など69種類の絵文字 → **カテゴリ6種のSVG** |
| UI絵文字→SVG | 0 → **rel-btn / species-nav 774箇所** ＋ shindanルート5 ＋ トップカード4 ＋ compareバッジ |

**新規ファイル**: `css/system.css`（トークン・共通ナビ・アイコン）／
`tools/gen_visual_system.py`（冪等generator）

**アイコン仕様**: 独自に描いた単色ラインSVG20種。ロゴ・型番は使っていない。
`currentColor` 着色でブランドゴールドに追従。インラインスプライト＋`<use>`で参照。

**判定はhrefで行う**: rel-btn の置換は絵文字の見た目ではなくリンク先URLから
意味を判定しているため、誤対応が起きにくい。対応先が無い場合は
無理にアイコンを当てず、絵文字を外してテキストのみにする。

**本文中の意味補助絵文字は残している**（FAQタグ・比較表・Life Preview 等）。
機械的な全廃はしていない。

**Kids は世界観を維持**。本体と同じ濃色ナビは入れず、
細いブランドバンド（KAME LIFE GUIDE ロゴ＋「おとなのページへ」）のみ追加した。

**数字矛盾の解消**: `index.html` の信頼バー 118→**119** 掲載種 / 112→**113** 種別ページ、
`species-list.html` の filter-apply-n 118→**119**。
（119種化の際に文字列「118種」だけを置換し、単独数字を取りこぼしていた）

#### 作業中に自己検出して修正した回帰

**共通ナビが `scripts/gen_related_links.py` を壊していた。**
klg-nav は全ページに `guides/` `trouble/` へのリンクを持つため、
generator が「既に手書きリンクがある」と誤判定し、
**PR #103 で結線した species→guides 112本を削除していた**（113→2ページに後退）。
generator の判定からナビを除外するよう修正し、**113/113 に復旧済み**。
このPRに修正を含めている。

### CLOSEOUT COMPLETE（2026-08-29 / 本PR）

#### D3 オプストヒラセガメの亜種ページを新規作成（写真なし・A案）

`species/obsti-hirase-turtle.html` を新規作成。**旧候補写真（iNat photo 134512961 / Chris Oldnall）は使用していない。**
`CLAUDE.md`（2026-08-24 調査クローズ）が「産地20.20N は本亜種の分布域から約400km北の基亜種分布域、腹甲もほぼ無地で識別形質と不一致 → 亜種同定を証明できない」と確定しているため、写真なしで公開した。**この判断を再検討しない。**

**ページに書いた内容の根拠範囲を明示している** ―― 確定事実として使ったのは分類（Fritz et al. 1998・TTWG承認）／分布（トゥアティエン＝フエ 16.3N〜ダクラク 12.7N・移行帯はクアンチ〜ゲアン付近）／識別形質（腹甲の放射状黒斑・基亜種はほぼ無地）／CITES II（親種からの種単位継承）のみ。**飼育情報はすべて「親種ヒラセガメに準じる」と明記**し、親種の UNPROVEN 値（最大甲長・寿命）を亜種固有の事実として書いていない。**運営者は本亜種を飼育していない旨もページ内に明記した。**

**同一工程で同期した全層:**

| 層 | 内容 |
|----|------|
| ページ | `species/obsti-hirase-turtle.html` 新規 |
| `shindan/species.js` | `forest` ルートへ1件追加（`all` は連結で自動反映）。`availability: 'reference_only'`、`match` は常に false（診断で推薦しない） |
| `data/species-master.json` | 121件へ。`photo` に不採用理由を記録 |
| `data/species-identification.json` | 114件へ。`photo_chuui` に「本亜種として掲載しないこと」を明記 |
| `tools/taxonomy.js`（**掲載区分の正本**） | `REFERENCE_ONLY` に追加 → generator 経由で `species-list.html` へ反映。**species-list.html を手編集していない** |
| `sitemap.xml` | 195 URL へ |
| 相互リンク | 親種 `species/hirase-turtle.html` → 新ページ、新ページ → 親種 |
| 内部リンク generator | `scripts/gen_related_links.py` が新ページを自動で結線（species→ 117→118本） |

#### 119種化の全面同期

新規追加により **118種 → 119種**。固定値を残さないため機械抽出して一括同期した。

- 公開層の `118種` **151ファイル / 349箇所 → 119種**。**`118種` の残存 0ファイル**
- `tools/gen-species-list.js` `gen-category-ui.js` `taxonomy.js` および `species-list.html` のコメント内 `118件` も `119件` へ（説明が実態と食い違う状態を残さない）
- 内訳は **通常一覧 115 ＋ 参考掲載 4**（参考掲載＝国内で流通している個体を確認できなかった種。「法的に飼えない」意味ではない）
- generator 再実行で件数バー初期値 119 / noscript 119件を確認

#### D7 スペングラーヤマガメの写真 → B案（自前写真へ差し替え）

候補5枚を実画像で確認し、**`face-close.jpg` を採用**。

| 候補 | 判定 |
|------|------|
| **face-close.jpg**（1599×1600） | **採用**。頭部が鮮明で目にピントが合い、甲も判別できる。自然な姿勢（自分のテラリウム内）。4:3 トリミング後もカードサイズ160px相当で亀と判別できることを実測 |
| water-dish.jpg（1201×1600） | 甲は見えるが頭部が小さい。縦位置で 800×600 への切り出し損失が大きい |
| hiding-cork.jpg / rock-cave.jpg | 個体が暗所・遮蔽で判別しにくい。メイン写真に不適 |
| setup-full.jpg | 環境全体のカット。個体がほぼ見えずメイン写真に不適 |
| 旧・Commons 画像（Viva.Chelonia） | 個体は最も鮮明だが**人の手に持たれた構図**。`CLAUDE.md`「採用する写真＝自然な姿勢」に照らして不採用 |

800×600 WebP（75KB）へ変換して差し替え、**クレジット4層を自前写真へ更新**（`credits_map.json` ／ `pc_parsed.json` ／ `photo-credits.html` ／ 種ページ figcaption）。出典は Real Setup 記事へリンク。**外部ライセンス依存が1件減り、E-E-A-T の一次性が上がった。**

#### PR #35 → close 済み

写真とクレジットの救出は PR #105 で完了済み。コードは merge せず GitHub 上で close し、CITES の論点は BLOCKED B6 へ引き継いだ旨をコメントで残した。

### DECISION CLOSEOUT（2026-08-29 / 本PR）

DECISION 9件を確定処理した。**CLOSE したものは UNRESOLVED に残していない。**

| ID | 確定 | 内容 |
|----|------|------|
| **D1 PR #35** | **CLOSE**（写真救出完了 → #35 は close 可） | N13 の写真候補を **PR #35 のブランチ `claude/konnichiha-fnoxtn`（`a38ee76`）から救出**。`assets/species-photos/canton-reeves-turtle.webp`（800×600 / Greg Hume / Wikimedia Commons / CC BY-SA 4.0）と**クレジット4層**（`credits_map.json` ／ `pc_parsed.json` ／ `photo-credits.html` ／ 種ページ figcaption）を同期。**これで H9／B5 も同時に解消**（別種 *M. reevesii* 写真の流用が解消され、観察ID共用も解消）。**CITES・分類は一切触っていない**（B6 の BLOCKED を侵さないため） |
| **D2 テキサスチズガメ** | **CLOSE**（現状維持） | 通常一覧のまま。sitemap 掲載済・被リンク3で破綻なし。**再判断しない** |
| **D6 カントンクサガメの `legal`** | **CLOSE**（変更しない） | `legal: null` のまま。立てても種一覧の表示は変わらず、影響は診断の注意文だけで価値が小さい。**D1/B5 の写真差し替えとは別件**（写真は上記で解決済み、`legal` は据え置き） |
| **D8 species→compare 15/112** | **CLOSE**（仕様として確定） | 15 は構造上の上限。**被覆率を上げる目的だけの compare 新規作成は禁止**。今後この数値を欠陥として再指摘しない |

### CLOSEOUT PHASE — 残件棚卸しと一括クローズ（2026-08-29 / 本PR）

`.claude/rules/closeout-gate.md` に従い、全残件を CLOSE NOW / BLOCKED / DECISION / DROP に分類し、
CLOSE NOW を同一工程内で実装・検証まで完了した。**以下は再監査しない。**

| CLOSE した項目 | 内容 | 実測 |
|---------------|------|------|
| **guides→species 逆方向結線** | 機材ガイド4本に代表種カードを自動生成。対象種は恣意的に選ばず、サイト自身のランキング掲載種 × 生態カテゴリ一致で決定 | リンク有 **8/17 → 12/17**、中央値 **0 → 3**、総数 **47 → 59** |
| **N27 テンプレの「100種」8件** | `_template-monetized` 4 / `hermann-dry-template` 2 / `three-toed-box-template` 2 を 118種へ | サイト全体の `100種` 残存 **0ファイル** |
| **N7 `ouachita-map-turtle-sp` の表示名ゆれ** | `northern-map-turtle` 2件＋`alabama-map-turtle` 1件の「オウアチタチズガメ」を、正本 master・当該ページ title/h1 と一致する **フトマユチズガメ** へ統一。**学名の三名法/二名法 HOLD とは独立**（和名表示のみ・学名は一切触れていない） | 表記ゆれ残存 **0ファイル** |
| **320px 横スクロール** | 真因は `species-list.html` の `.sp-cat .sp-cat-count{white-space:nowrap}`。件数＋注記が 315px に伸び、ページ全体が 9px 横スクロールしていた。既存の `@media(max-width:360px)` 内で折り返しを許可 | `scrollWidth` **329 → 320**（clientWidth 320 と一致）。360/390px も回帰なし |
| **N24 `index.html` の meta「100種」** | PR #102（`5a16951`）で 118種へ統一済み。UNRESOLVED に残っていたのは記載漏れ | 解消済み・リストから削除 |

**guides のうち species リンクを意図的に付けなかった5ページ**（未完了ではなく設計判断）:
`guides/index.html`（ハブ）／`turtle-not-eating` `turtle-runny-nose` `turtle-shell-white` `turtle-trouble-guide`
の症状4ページは**全種共通の症状解説**であり、特定種へのリンクは関連性が無い。
同様に `compare/index.html` `trouble/index.html` もハブのため対象外。**これらを「0件」として再指摘しない。**

以下は結論が確定している。**再調査・再監査・再実装しない。**
再開できるのは「重複作業防止ゲート」の4条件を満たす場合のみ。

### TOP DESIGN — トップページ「引き算の再設計」（2026-08-28）

| Phase | 作業 | 状態 | 確定した結論 |
|-------|------|------|-------------|
| Phase 2 | 現行トップの全構造棚卸しと KEEP/MERGE/MOVE/REMOVE-FROM-HOME 判定 | 設計のみ（ファイル変更0） | `index.html` の可視コンテンツブロック **22**・固定UI 2・hidden 1・章見出し4・`<details>` 3 を表示順に全件棚卸しし、**KEEP 9 / MERGE 9 / MOVE 6 / REMOVE-FROM-HOME 7** に判定。新トップ骨格（主要8ブロック＋Header＋Footer）を確定。**この棚卸しと判定は再実行しない** |
| Phase 3 | 新骨格への一括再構成 | **PR #95 / merge `412e23b`** | `index.html` **1ファイル・+344/−2,861行**。旧22ブロック → **①Header ②Hero ③信頼表示 ④3目的入口 ⑤写真付き種探索 ⑥飼う前に知っておきたいこと ⑦飼育情報入口 ⑧著者・編集方針 ⑨Final CTA ⑩Footer** へ再構成。**title / meta description / og: / twitter: / JSON-LD 3ノードは1バイトも変更していない**（diff 0 を機械確認） |

| Phase 4 | MOVE 7件を移設先ページへ実装 | **PR #96 / merge `f9b5be0`** | 移設先**4ファイル・+1,181/−0行（純粋な追加）**。移設元の正本は `54bd27b:index.html`。`index.html` は1バイトも変更していない |

| N25 修正 | 診断開始画面の可視「100種」を正本 118 へ | **PR #97 / merge `cd6f086`** | `shindan/index.html` **2行のみ**（`.species-count`「100種対応」→「118種対応」／`.jp-step-copy`「100種から…」→「118種から…」）。**`<script>` 6ブロック・CSS・`title`/`meta`/OG/twitter/JSON-LD はすべて差分0。** 診断5ルートを実操作して全て結果画面へ到達（JSエラー0）。**ただし `shindan/routes.js:169` の `全100種・8問で診断` は本工程の変更禁止指定に含まれていたため未修正 → `UNRESOLVED` の N26 へ** |

| 種数表記の統一 | 公開UIの掲載種数を全ページ 118 へ | **PR #98 / merge `c4f2542`** | **143ファイル・319行**（`100種` → `118種`）。repo 全体を機械抽出して分類（総計334件 = 公開本文/UI 323 ／ SEO層 7 ／ 未公開テンプレート 4）。**公開本文/UIの「100種」は0件になった。** 差分は数字の置換のみで、319行すべて「`100種`→`118種`」以外の変化がないことを機械照合済み |

### ② species-list.html の再設計（2026-08-28）

| 工程 | 作業 | 状態 | 確定した結論 |
|------|------|------|-------------|
| 監査 | 現状棚卸しと新デザイン案 | 完了（ファイル変更0） | 実測: 全長 64,175px ／ カード526px ／ フィルタバーが ≤480px で `position:static`（sticky無効）／ 見出し62個（6大分類6・属40・種グループ16）で**40属中20属が1種のみ**／ 実写真107・絵文字フォールバック11 ／ カード内絵文字118個（`species.js` の `emoji`・ユニーク78種類）。**この棚卸しは再実行しない** |
| 実装1 | 監査結果の実装 | **PR #99 / merge `4e2b584`**（commit `223481a`） | `species-list.html` **1ファイル・+287/−119行**。下表のとおり |

**実装1で確定し、再実行しない事実:**

| 項目 | before | after |
|------|--------|-------|
| ページ全長（390px） | 64,175px | **19,243px（−70%）** |
| ページ全長（360px / 1280px） | — | 18,600px / 20,905px |
| カード1枚の高さ | 526px | **202px** |
| ≤480px の列数 | 1列 | **2列** |
| 操作バー | ≤480px で sticky 解除 | **全幅で sticky 維持**（12,000px 地点でも画面内・top=0） |
| 一覧開始Y | 1,035px | **569px** |
| 属見出し | 40 | **20**（1種しかない属は出さない） |
| カード内の絵文字 | 118 | **0** |
| `sp-reason`（3行説明） | 118 | **0**（詳細ページで読む） |
| 全幅の `sp-link` ボタン | 118 | **0**（カード全体を `<a>` 化） |
| 写真なし11種 | 絵文字フォールバック | **深緑のプレースホルダ「写真を準備中」** |

- **カードの表示情報は「実写真 / 和名 / 学名 / 難易度 / 甲長（最大◯cm）」の5点＋法規制ラベルで確定。**
  実装1で 118種すべてに出ていた CITES バッジ（`legalBadge()`）は削除した。**その代わり、
  `legal` フラグを持つ14種にだけ出る法規制ラベルを PR #99 の2コミット目で入れた**（下の「法規制表示の回帰修正」）。
  CITES II / III の一般表示（95種）には戻していない。
- **N29 解消**: 個別ページを持たない6種（エジプトリクガメ / インドホシガメ / ビルマホシガメ /
  マダガスカルクモノスガメ / ヒラタニオイガメ / テキサスチズガメ）は、カード内に
  **「飼育ガイドへ」**を小さく表示する。遷移先は `guide-dry.html` / `guide-semi.html` /
  `guide-water-full.html` の3本。残り112件は `species/*.html`。**全118件の遷移先が実在することを確認済み。**
- **難易度・サイズ・KLGクイックは絞り込みシート（bottom sheet）の中**。生息環境6ボタンは
  操作バーに1行の横スクロールで残す（`BEGIN:hab-buttons` の生成領域はそのまま）。
- **適用中の条件はチップで表示し、× で1条件だけ外せる。** シートには「条件をすべて外す」と
  「◯種を見る」を置いた。
- **単独の種は連続するぶんを1つのグリッドにまとめる**（種ごとにグリッドを分けると
  カード1枚で1行を使ってしまい、これが全長の主因だった）。亜種を持つ種だけ小見出し＋専用グリッド。
- サムネイルは **3:2**（元画像は 800×600 の 4:3 なので上下がわずかに切れる）。
  全身と識別点は詳細ページの 4:3 写真で見せる。
- **生成領域4つ（`hab-buttons` / `taxonomy-data` / `wamei-alias` / `species-index`）は
  変更前後で完全一致。** `title` / `meta` / OG / twitter / canonical / JSON-LD も差分0。

### archive・reference_only 8種の掲載仕様監査 ＋ 法規制表示の回帰修正（2026-08-28）

| 工程 | 作業 | 状態 | 確定した結論 |
|------|------|------|-------------|
| 履歴調査 | エジプトリクガメはいつ消え、いつ戻ったか | 完了（ファイル変更0） | `2589573`(06-19) 初回追加 → **`200dc03`(06-22) 削除** → **`d150d66`(06-24) CITES I / `hasPage:false` として意図的に再追加** → `d57594a`(06-24) `availability:'archive'` → `a38ee76`(08-22) `match:()=>false` → **`512ebc2`(08-25) 一覧の自動生成化で初めて一覧に出現**。`512ebc2` の親 `cdc1de1` の手書き `species-list.html` には出現数**0**。**一覧掲載は編集判断ではなく自動生成化の副作用**。再調査しない |
| 掲載仕様監査 | archive 6種・reference_only 2種を1件ずつ判定 | 完了（ファイル変更0） | **NORMAL 4 / REFERENCE 3 / HOLD 1**（下表）。再監査しない |
| 回帰修正 | 実装1で消えた法規制表示の復旧 | **PR #99 / merge `4e2b584`**（commit `872cdfd`） | `species-list.html` 1ファイル。`legal` を持つ**14種だけ**にラベルを出す |

**8種の判定（流通は実測。再調査しない）:**

| 種 | CITES / 国内法 | 流通の実測 | 判定 |
|----|---------------|-----------|------|
| パンケーキリクガメ | CITES I（CoP18・2019）／国際希少野生動植物種・登録票で国内譲渡可（master に official 出典） | 複数の専門店で登録票付き 19.8〜49.8万円 | **NORMAL** |
| インドホシガメ | CITES I（CoP18・2019） | 国内CB＋マイクロチップ登録票付き 29.8〜89.8万円・複数店在庫 | **NORMAL** |
| ビルマホシガメ | CITES I（2013） | 自家繁殖を含む国内CB 20〜80万円・複数店在庫 | **NORMAL** |
| ミスジハコガメ | CITES II（`cites_ii_cb_only`）／国内法規制なし | 一般ペットショップに中国CB 10.8〜16.8万円 | **NORMAL** |
| モエギハコガメ | CITES I（CoP19・2023-02-23発効）／登録票必要 | 販売実績は EUCB 2022・49.9万円の1件のみで SOLD OUT。I化後の在庫は確認できず | **REFERENCE** |
| エジプトリクガメ | CITES I（1995-02-16・CoP9） | 専門店の在庫0。二次情報も「事実上市場から消えた」で一致 | **REFERENCE** |
| マダガスカルクモノスガメ | CITES I（master は LIKELY・原文未確認） | 販売実績を確認できず。二次情報が互いに矛盾しており根拠に使えない | **REFERENCE** |
| テキサスチズガメ | CITES III（2006-06-14・米国の Graptemys 属一括）／**国内法規制なし・`legal:null`** | 日本の販売記録を確認できず。archive 設定の個別根拠も repo に無い | **HOLD** |

**「CITES I だから除外」は成り立たない。** NORMAL 4種のうち3種が CITES I で、HOLD 1種は CITES 規制の外。
`availability` / CITES / 入手性は**三者とも別概念**として扱う。

**法規制表示の回帰修正で確定し、再実装しない事実:**

- **`legal` フラグを持つのは 118種中 14種だけ**（`cites_i` 6 ／ `cites_ii_cb_only` 4 ／
  `conditional_invasive` 3 ／ `unknown_hold` 1）。**残り104種にはラベルを出さない。**
- ラベルは4種類。文言は `shindan/index.html` の確定済み法規制文を一覧カード用に短縮したもので、
  新しい法解釈は足していない。**「CITES I ＝ 購入不可」とは書いていない。**

| `legal` | 件数 | 表示（2行） | 種 |
|---------|------|------------|-----|
| `conditional_invasive` | 3 | 条件付特定外来 ／ **新規購入不可** | ミシシッピアカミミガメ・キバラガメ・カンバーランドスライダー |
| `unknown_hold` | 1 | 特定外来生物 ／ **新規購入不可** | ハナガメ |
| `cites_i` | 6 | CITES I ／ **登録票が必要** | パンケーキ・インドホシ・ビルマホシ・エジプト・マダガスカルクモノス・モエギ |
| `cites_ii_cb_only` | 4 | CITES II ／ **CB個体・要書類確認** | ヒラセガメ・タイワンセマル・チュウゴクセマル・ミスジ |

- **区分と帰結を2行に分けている。** 狭いカードで語の途中から折り返るのを防ぎ、帰結の行を読み落としにくくするため。
  14件すべて 2行・高さ40px で揃い、はみ出し0（360/390/480/768/1200px で確認）。
- **色は薄めない。** `opacity:.85` は doc 系のコントラストを 4.04 まで落として AA を割るため採用しなかった。
  実測 **stop 6.09 / doc 5.50**（いずれも AA 4.5 超）。区分と帰結の差は字送りと太さで付けている。
- **CITES II / III の一般表示（95種）には戻さない。** `sp-reason` も絵文字も戻していない。
- 390px の全長は 19,243px → **19,720px**（+477px / +2.5%）。21,000px の上限内。

### ③ species-list.html の掲載区分 — 通常一覧115種 ＋ 参考掲載3種（2026-08-28）

| 工程 | 作業 | 状態 | 確定した結論 |
|------|------|------|-------------|
| 掲載区分の実装 | 参考データを通常一覧から分離 | **PR #100 / merge `d81ccc7`**（commit `36dc057`） | 5ファイル。**通常一覧115 / 参考掲載3 / 合計118**。`shindan/species.js` は1バイトも触っていない |

**再実装・再測定しない事実:**

- **掲載区分の正本は `tools/taxonomy.js` の `REFERENCE_ONLY`**（エジプトリクガメ / マダガスカルクモノスガメ /
  モエギハコガメ の3件）。`tools/gen-species-list.js` が `BEGIN:taxonomy-data` へ焼き込み、
  ページ内 JS はその写しを読む。**生成物は手で編集していない**（generator を実行して生成した）。
- **`splitListing()` は `REFERENCE_ONLY` に `species.js` へ無い和名が混ざると例外で止まる。**
  和名が変わったときに参考掲載が静かに0件へ落ちるのを防ぐため。
- **診断への影響はゼロ。** 診断は `shindan/species.js` の `availability` と `match` だけを見ており
  （`shindan/index.html` L1413 / L2700）、`REFERENCE_ONLY` を参照しない。
  `availability` / `match` / `score` は無変更。
- **絞り込みは118件全体にかけてから通常／参考に分ける。** 参考掲載3種も検索・絞り込みの対象に残す。
  和名・別名（ソマリア）・学名（`kleinmanni` / `Pyxis`）・slug（`indochinese`）のすべてでヒットを確認済み。
- **通常一覧の分類件数はリクガメ25 / ヤマガメ・ハコガメ21 / 半水棲18 / 水棲（淡水）29 / 汽水6 /
  スッポン・曲頸16 ＝ 115。** 生息環境ボタンは掲載区分で絞らないので、
  ボタンのマークアップ（`BEGIN:hab-buttons`）は無変更。
- **件数バーは「118 種」＋「通常一覧 115 / 参考掲載 3」の2行。**
  1行に並べると390pxで並び替えが折り返り sticky バーが縦に伸びるため分けた（バー高 148px → 152px）。
  参考掲載が0件になる絞り込みでは内訳行を隠す。**総数118は減らないので「118種」表記は変更していない。**
- **noscript の `species-index` は118件のまま。** 通常一覧の6分類のあとに「参考掲載（3種）」の見出しと
  説明文を置き、クローラー向けリンクは1本も減らしていない。
- **参考掲載セクションの文言**: 「国内で流通している個体を確認できなかった種です。記録として残していますが、
  これから飼う種を選ぶときの候補には入れていません。」**「飼育禁止」「購入不可」とは書いていない**
  （監査の実測は「流通を確認できなかった」であって禁止ではないため）。
- **PR #99 で確定した legal 14種のラベルは無変更。** 参考掲載3種はいずれも `cites_i` なので
  「CITES I ／ 登録票が必要」を保持したまま参考セクションへ移った（通常11 ＋ 参考3 ＝ 14）。
- **テキサスチズガメは HOLD のまま通常一覧に残した。** 除外根拠がないため動かしていない。
- 390px の全長は 19,720px → **19,837px**（+117px）。21,000px の上限内。

### ④ species-list.html —「暮らしから選ぶ」6大分類の写真タイル（2026-08-28）

| 工程 | 作業 | 状態 | 確定した結論 |
|------|------|------|-------------|
| 写真タイルの実装 | 操作バーと一覧の間に6分類の写真タイルを置く | 本PR | `species-list.html` **1ファイル・+111/−0行**。**② species-list の再設計はこれで完了。** |

**採用した6写真（1枚ずつ実物を目視して選んだ。再選定しない）:**

| 分類 | 通常一覧の件数 | 写真 slug | 写っている種 | 採用理由 |
|------|--------------|-----------|-------------|---------|
| リクガメ | 25 | `hermann-tortoise` | ヘルマンリクガメ | 草地を歩く健全個体。頭と四肢が出ており甲の模様も出ている。国内で最も多く飼われるリクガメ |
| ヤマガメ・ハコガメ | 21 | `three-toed-box-turtle` | ミツユビハコガメ | 下草を歩く健全個体。人の手が写らず、ドーム状の甲とヒンジが見える。亀好きさんの飼育種 |
| 半水棲 | 18 | `musk-turtle` | ミシシッピニオイガメ | 水際の倒木でバスキング中。水と陸場という半水棲の要件がそのまま写っている |
| 水棲（淡水） | 29 | `reeves-turtle` | クサガメ | 頭部を出した健全個体。首の黄条線という識別点が明瞭で、写真の出所も一次データで証明済み（KEEP 2件のうち1件） |
| 汽水 | 6 | `ornate-diamondback-terrapin` | オルナータダイヤモンドバックテラピン | 正面から。斑点のある頭部と淡色の顎という識別点が出ている。枝の上に乗っており「埋もれて閉じ込められた構図」には当たらない |
| スッポン・曲頸 | 16 | `pig-nosed-turtle` | スッポンモドキ | 遊泳中の全身。ヒレ状の四肢と豚鼻という他に似ないシルエットが1枚で伝わる |

**目視して不採用にしたもの（再確認しない）:** `eastern-box-turtle`（人の手＋背景に赤いピックアップトラック）／
`spotted-turtle`（人の手の上）／`painted-turtle`（背景に黄色いプラ製フェンス）／
`northern-diamondback-terrapin`（板の上の真上からの構図・頭部と四肢が引っ込み気味）／
`japanese-pond-turtle`（逆光でピントが甘く甲が白飛び）。

**再実装・再測定しない事実:**

- **分類と順序の正本は `CAT_ORDER`**（`BEGIN:taxonomy-data` の生成値）。タイルは `CAT_ORDER` を回して描く。
  `HAB_PHOTO` が持つのは「どの分類にどの写真を使うか」だけで、分類を定義していない。
  写真が未定の分類はタイルを出さない。
- **件数は描画時に通常一覧から数える**（`habCount()`）。数字を焼き込んでいないので、
  種が増減しても generator を回さずに追随する。参考掲載3種は数に入れない。
- **新しい絞り込みロジックは足していない。** タップは既存の `#hab-btns .fbtn` を `click()` するだけ。
  選択中の分類をもう一度タップすると「すべて」へ戻る。
- **選択状態は `render()` から `syncHabTiles()` を呼んで同期する。** タイル・生息環境ボタン・
  条件チップの ×・条件リセット・URLパラメータのどこから変えても表示が食い違わない（実測で確認済み）。
- **`img` に `height:auto` が要る。** 書かないと `height="600"` 属性が UA スタイル経由で効いて
  `aspect-ratio:3/2` が無視され、タイル1枚が672pxになる（実装中に踏んで修正した）。
- 写真は `alt=""`（ボタン自体がラベルを持つ装飾画像）。ただし**写っている種名はキャプションに出す**ので、
  どの亀の写真かは隠れない。
- 390px の全長は 19,837px → **20,506px**（+669px）。21,000px の上限内。タイル部の高さは 669px。
- **320px の横スクロール（328 > 320）は本変更の前から出ている。** 原因は `.filter-btns`（生息環境チップの行）で、
  main の時点で同じ 328 > 320。本PRでは触っていない。

**公開UIの掲載種数について、今後は再調査しない事実:**

- **公開画面に出る掲載種数は「118種」で確定。** 正本は `shindan/species.js`（118件）／
  `hasPage:true` = 112／6大分類 27・22・18・29・6・16 = 118。
- **`title` / `meta description` / `og:` / `twitter:` / JSON-LD の「100種」7件は意図的に据え置き**
  （`index.html` 3 ／ `shindan/index.html` 4）。**H8（SEO運用HOLD）** の対象で、
  GSC/GA4 の実測がトリガーを引いたときにだけ扱う。**取りこぼしではない。**
- **未公開テンプレート3ファイルの「100種」8件も意図的に据え置き**
  （`species/_template-monetized.html` 4 ／ `species/hermann-dry-template.html` 2 ／
  `species/three-toed-box-template.html` 2）。いずれも **sitemap 未掲載・被リンク0** で
  公開画面には出ない。ただし**このテンプレートから新しい species ページを作ると 100種 が復活する**
  ため、次に species ページを新規作成する工程の冒頭で直すこと（→ `UNRESOLVED` の N27）。
- **`trouble/` 6ページの「全種一覧（100種以上）」は「全種一覧（118種）」にした。**
  実数が118で確定しているため「以上」を落とした。これが唯一「数字以外」に手を入れた箇所。
- `shindan/routes.js:169` の `desc`（ルートカードの説明文）と `js/annainin.js` の
  連携ラベル・bot応答文も 118 へ。**どちらも表示文字列のみで、`qCount` や判定ロジックは無変更。**

**Phase 4 で確定し、再実行しない事実（MOVE 7件は完了。移設元は二度と参照しなくてよい）:**

| 移設元（`54bd27b:index.html`） | 移設先 | 実装の要点 |
|------------------------------|--------|-----------|
| `lead-in` L3745-3750 | `guides/index.html`（hero 直下 `.gh-lead`） | 本文2段落を逐語 |
| `discover` 8カード L3752-3819 | `guides/index.html`「飼育環境 — 種類別ガイド」の冒頭 `.gh-hab-grid` | **リンクは重複させていない**。8本の `guide-*.html` へのリンクは直下の生成カード（`BEGIN:guides-hub-env`）が既に持つため、移設先に無かった情報（生態の説明文・代表種・英字ラベル）だけを置いた。生成領域は1バイトも変更していない |
| `gear-index` 7カード L4417-4433 | `guides/index.html`「まず揃えるべき飼育用品ガイド」内 `.gh-gear-grid` | best10 7本は移設先に未掲載だったので実追加。既存4枚（`*-guide.html`）とリンク先が重ならない |
| `live-compare` 3枚 L4037-4150 | `compare/index.html` の**既存 ch-card 3枚の中**（`.lc-badge` + `.lc-metrics`） | **カードを増やしていない**。3ペアとも移設先に既存のため、移設先に無かった数値（難易度・初期費用・においリスク等）とバッジだけを既存カードへ足した |
| `compare-engine` 表 L4151-4261 | `compare/index.html` の `ch-bottom` 直前 `#compare-engine` | 表を**逐語**移設。`<th>難易度</th>` と `<th>はじめての方向け</th>` は**別軸のまま**（H5 確定・統合も改名もしていない）。末尾にあった `ce-cta-box`（診断CTA）は直下の `ch-bottom` と同義のため持ち込まず、caveat だけ `.ce-note` として残した |
| `journey-preview` L4527-4572 | `shindan/index.html` の `#screen-start` 内 `.jp-block` | 文言は逐語。**`<script>` 6ブロックは変更前後で完全一致**（診断ロジック無変更）。CSS は移設先のダークテーマに合わせて配色のみ書き下ろした |
| `readiness-score` L4585-4758 ＋ JS L4935-5170 | `before-keeping.html`（チェックリスト直後・「すべて確認できたら」の直前） | 質問5・選択肢15・配点列 `210210210210210`・バンド境界 `0-3 / 4-7 / 8-10`・`TOTAL_Q=5` が移設元と**完全一致**。本診断と別物であることを `.trs-scope` で明示 |

**Phase 4 で加えた必要な変更（推測ではなく、移設先の事情による確定事項）:**

- Readiness Score の高得点バンドの CTA リンク先を `#top-gear-picks` → **`./shindan/`** に変更した。
  `#top-gear-picks` は `index.html` にあったアンカーで、`before-keeping.html` には存在せず**リンク切れになる**ため。
  Starter Kit は診断結果の機能なので `./shindan/` が実体と一致する。**質問・配点・判定ロジックは無変更。**
- `before-keeping.html` の汎用 `h2`（下線）と `a`（下線）のスタイルが移設ブロックへ漏れていたのを
  `.trs-heading` / `.trs-result-cta` で打ち消した（移設元には無かった装飾のため）。
- **`guides/index.html` の `.gh-featured-*` に CSS が1つも無く、素のリンク列として描画されていた既存不具合を是正した**
  （main の時点からの不具合。移設した機材カードの直上にあたるため同Phase内で修正）。
  配色・角丸・余白は同ページの `.gh-card` 系に合わせた。**HTML は1行も変えていない。**

**Phase 3 で確定し、二度と問い直さない事実:**

- **トップの `<details>`（もっと見る）は 0。** 実写真グリッドは `<details>` の外＝**初期表示**になった
  （実測: スマホ390px で開始Y **7,626px → 1,383px**）
- **固定UIは `mini-nav` の1本だけ。** `#sticky-diagnosis-cta` は markup / CSS / JS を撤去済み
- **診断への導線は 12本 → 6本**（mini-nav リンク・mini-nav CTA・Hero・④の①カード・⑥・⑨）
- **Kids のトップ露出は 4箇所 → 1箇所**（⑦ Care Module 05 ＋ 同ブロック内の `kids/otona.html` 副リンク）。
  `kids/` 本体と `assets/kids/` の画像は**削除していない**
- **公開UIの種数は 118 に統一**（可視「100種」は 0 件）。6大分類チップは正本
  （`tools/taxonomy.js` × `shindan/species.js`）の実数 **27 / 22 / 18 / 29 / 6 / 16 = 118** と一致
- **「10K+ Data Points」「98 Care Pages」はトップから除外**（根拠不明・正本不一致）。
  信頼表示に載せるのは正本と一致する **118 掲載種 / 112 種別ページ / 6 暮らしタイプ** のみ
- **ページ全長: スマホ390px 12,418px → 8,736px（−29.6%）／PC1280px 9,990px → 7,098px（−29.0%）**
- **`index.html` のインライン CSS から、今回の撤去で孤立した 340ルールを削除**した。
  削除は「旧ファイルでは使われていて、新ファイルで未使用になったセレクタ」に限定し、
  **旧ファイル時点ですでに孤立していた 79ルールには触れていない**（機械判定・再スキャンで新規孤立 0 を確認）

### 和名↔学名↔分類階級 監査の是正（2026-08-26）

| PR | 作業 | merge | 確定した結論 |
|----|------|-------|-------------|
| #87 | 監査で誤り確定した3件のうち **1件だけを是正** | `93ee426` | `stripe-necked-musk-turtle` のクレジット層 `gakumei` を `Sternotherus minor` → **`Sternotherus peltifer`**（`data/pc_parsed.json` / `data/credits_map.json` 各1エントリ）。これで **master・`photo-credits.html`・species HTML・クレジットJSON2本の全層が `Sternotherus peltifer` で一致**。残る2件は着手前に**指示と main の矛盾**が判明したため STOP（UNRESOLVED 参照） |
| #16 | 旧PRを **merge せず CLOSE** | close のみ | 「旧PRを merge せず、最新 main 上で必要差分を救出実装し **PR #80** で反映済み」を理由として記録。**ブランチ `claude/kame-life-guide-elementary-gidu7i` は無変更**（merge / rebase / push なし・head `863ee7c` のまま）。close 前に現 main で救出実装を実測確認: kids リンク **167ページ** / `site_kids_click` **168** / `index.html` Care Module 05 の CTA と `gl-sub-link` / `guide-*` は `END:guide-nav` の外側 / generator 4本 差分0 |
| #88 | `amazon-matamata` の和名を **オリノコマタマタ** へ完全統一 | `d4c30c7` | 12ファイル・14行。上流 3本（`shindan/species.js` の `name`／`shindan/equipment.js` の辞書キー／`species-list.html` の `CAT_OVERRIDE` キー）を同時改名し、生成領域2箇所は generator で再生成。**「アマゾンマタマタ」は `Chelus fimbriata` 側を指す名称として扱い、`orinocensis` の alias には残さない**（`wamei_aliases` は `null` のまま） |
| #89 | カントンクサガメの分類を **独立種 Mauremys nigricans** へ確定 | `9b31cec` | 旧 PR #35 は merge/rebase せず、現 main へ必要差分だけを新規実装。`Mauremys reevesii`（広東型・rank=regional_form・CITES附属書III）という扱いを廃止し、**`Mauremys nigricans` / rank=species / CITES附属書II** へ全層統一。クサガメ（`reeves-turtle`）は1バイトも変更していない。**写真だけは差し替えていない**（下記 FIXED_FACTS と H9 を参照） |
| #90 | 和名118件監査で **B判定＝修正確定の9件**を実装 | `3ddbf65` | 43ファイル・+334/−334行。`shindan/species.js` の `name` を正とし、`equipment.js` の辞書キー・`species-list.html` の `CAT_OVERRIDE` キーを同時改名（PR #88 の3点セット）。master／identification／`photo-credits.html`／`pc_parsed`／`credits_map`／`SHINDAN-SPECIES.md`／対象 species HTML も追従し、生成領域は generator 出力と一致。**和名が変わったのは B9 の9件だけで、A74・C17・D12・E1・F5 は全件不変**。`latin` は118件すべて不変 |
| #91 | 和名118件監査の **C判定17件**に `wamei_aliases` を実装 | `46efe39` | `data/species-master.json` **1ファイル・+55行/−0行**（純粋な追加）。16レコードに `wamei_aliases` を新設し、1件（`narrow-bridged-mud-turtle`）は既存値を保持。**primary 和名（`wamei`）は120レコードすべて不変**、学名・`cites`・`slug`・`page` も不変で、値が変化したキーは `wamei_aliases` だけ。公開ページ・`shindan/`・生成物は1バイトも変えていない |
| #92 | **N21 解消** — 登録済みの別名を `species-list.html` の検索で引けるようにした | `0e8449e` | `tools/gen-species-list.js` が `data/species-master.json` の `wamei_aliases` を読み、`species-list.html` の新マーカー `BEGIN:wamei-alias` へ `WAMEI_ALIAS` を焼き込む。`haystack()` は `name + 別名 + latin + slug` を見る。**正本は master の1箇所のまま**で、`shindan/species.js` に別名を二重登録していない。別名33件すべてで検索到達を確認し、既存の検索（primary和名118 / 学名118 / slug112）は**1件も減っていない** |

### 直近の連続作業（difficulty ／「初心者」表現）

| PR | 作業 | merge | 確定した結論 |
|----|------|-------|-------------|
| #51 | 難易度体系5段階化 STEP 1 | `e4b3992` | `species-list.html` の難易度UIを正本5値へ。`LEGACY_DIFF` で旧URL互換。`?diff=初心者向け`=18件を維持 |
| #52 | 「初心者」公開表現 Phase B-1（B分類） | `eae8d6e` | 冬眠まわり37件を修正。**HOLD 15件**（内訳は UNRESOLVED） |
| #53 | 「初心者」公開表現 Phase B-2（E分類） | `5fa7c9c` | CTA・関連リンク・ナビ37件を「はじめての亀」系へ。**HOLD 1件** |
| #54 | difficulty 公開表現整合 Gate | `61ceb48` | 既知5件を**すべて判定A（正本が正しい）**で確定。「非推奨」を廃止 |
| #55 | difficulty 表示層の完全同期 | `e51fc09` | badge/stat-item の不一致28件を解消。**公開difficulty表示249箇所の不一致0** |
| #56 | AI引継ぎ・重複作業防止システムの整備 | `4fc0952` | 本ファイルを現在状態の単一正本として新設。`CLAUDE.md` と `.claude/rules/chatgpt-handoff.md` に読取ゲート・更新義務・NEXT HANDOFF ブロック・プロンプト生成規則を追加 |
| #57 | AI-HANDOFF の CURRENT_BASE を同期 | `ed14074` | 本ファイル自身を merge 後の main へ同期 |
| #58 | A-1 quick-facts のラベル置換 | PR #58 | species 26ページの `初心者向き？` → **`飼育難易度`**。値・理由文・色・アイコンは無変更。HOLD 0件。`compare/hermann-vs-greek.html` の「どっちが初心者向き？」3件（title / OG / hero-sub）は `<strong>` 形ではなく**対象外**として維持 |
| #59 | A-4 FAQ問いの可視・JSON-LD同期 | PR #59 | 5ページの `初心者向けですか？` → **`はじめて飼う亀に向きますか？`**。可視 `<summary>` と JSON-LD `"name"` を同一commitで完全一致。回答本文は無変更。HOLD 0件。**可視FAQとJSON-LDの同時修正を初めて適用し、成立を確認した** |
| #60 | H1 B分類の JSON-LD複製14件を同期 | PR #60 | 可視FAQ（`faq-body` / `h3`）と JSON-LD（`acceptedAnswer.text` / `"name"`）を同一commitで完全一致。14件×2箇所=28箇所。意味・安全性・推奨強度は不変。HOLD 0件。**B分類は 51/52 に到達**（残る B18 は A-5 と不可分のため NEXT へ） |
| #61 | A-5 見出し3件 ＋ B18 本文1件 | PR #61 | `<h2>初心者に向くか</h2>` → **`はじめての1頭に向くか`**（3件）と、`むしろ初心者と相性の良い面があります` → **`むしろはじめての1頭として相性の良い面があります`**（1件）。JSON-LD複製なし。HOLD 0件。**B分類 52/52 完了** |
| #62 | H2 shindan の「初心者TOP3」＋説明文を同時処理 | PR #62 | `初心者TOP3` → **`はじめての亀 TOP3`** と、それを名指しする `ec-text-sub`「初心者向けTOP3や比較ページも…」→ **`はじめての亀 TOP3や比較ページも…`** を同一commitで変更。JSON-LD複製なし。`href`・`id`・GA4・診断ロジックは無変更。**未処理HOLDが0になった** |
| #63 | N1 AI_CHANGELOG の欠落補完 | PR #63 | `AI_CHANGELOG.md` に **Merge済み PR 47件（#13〜#62）** を1エントリ1件で追記。既存2エントリは1文字も変更していない（append-only）。**想定の「#44〜#62 の19件」ではなく47件が欠落**していた（既存2エントリは PR ではなく branch commit を指していた）。Automation 31件・直push 5件は merge ではないため §9.3-R1 の対象外と判断 |
| #64 | C分類22件「初心者におすすめ」系の置換 | PR #64 | 22件 / 15ファイルを「はじめて飼う方」系へ。推薦強度・意味は不変。HOLD 0件。`species/mississippi-map-turtle.html` の1件のみ JSON-LD 複製があり可視と同一commitで同期（可視1 + LD1） |
| #65 | D分類24件「初心者には難しい」の理由明示化 | PR #65 | 24件 / 22ファイル。抽象的な警告を**その種で実際に難しい理由**へ書き換え。理由は各ページ本文・`species.js` の reason・「向いていない人」欄から取得（推測なし）。警告強度は不変。HOLD 0件。JSON-LD複製2件（`hermann-dry-template` / `three-toed-box-template`）は可視と同一commitで同期 |
| #66 | F分類12件（読者層・採点基準・UI例文） | PR #66 | 12件中 **11件を置換・1件を HOLD**。F1 3件は「初心者向けに解説します」→「はじめて飼う方に向けて解説します」、F2 6件は「初心者が〜」→「はじめて飼う方が〜」（1件のみ「初心者には見逃しやすい」→「飼育経験が浅いうちは見逃しやすい」）、F3 は `annainin` の placeholder のみ置換。**JSON-LD複製は0件**（4ファイルの JSON-LD に `初心者` は残るが、すべて `headline`/`description`/`name` = SEO②領域で F の対象文ではない）。**HOLD 1件 = F3-2 `annainin/index.html:74` の topic-btn 可視ラベル「初心者向け」**（理由は FIXED_FACTS 参照） |
| #68 | annainin の語彙統一（H4 + N2） | PR #68 | `annainin` 内の公開語彙を**「はじめての方向け」系へ統一**し、**H4 と N2 を同時に解消**。可視ラベル / `data-quick-reply` / `TOPIC_QUICK_REPLIES` / bot応答本文2件の**計4箇所**を同一commitで整合。`INTENT_RULES` の beginner キーワード `['初心者','はじめて','初めて','入門']` は**1文字も変更していない**（「初心者」と手入力するユーザーは beginner のまま）。`annainin` 配下の公開表示から「初心者」は**0件**になり、リポジトリに残るのは非表示の分類キーワード1件のみ |
| #69 | A分類28件の着手ゲート → **STOP（サイト変更0）** | PR #69 | `NEXT` の「A分類の残り28件」を現mainから再抽出しようとしたが、**28件を機械的に特定できないことが判明**して STOP した。原因は **Phase A の per-item 分類リストがリポジトリのどこにも保存されていない**こと（残っているのは分類ごとの件数だけ）。28件を確定するには Phase A の分類をやり直すしかなく、それは `DO_NOT_REPEAT` で禁止されている。**公開HTMLの「初心者」155行の分布を実測して記録し、代わりに機械判定できる `NEXT` を再設定した。** サイトファイルの変更は0件 |
| #70 | A-6 難易度の軸ラベル18行 | PR #70 | 機械条件で18行を再抽出し**行番号まで完全一致**。1件ずつ文脈確認し、**compare の `<td>初心者適性</td>` 6件を `<td>飼育難易度</td>` へ**。**セルの値は1文字も変更していない**（各ファイルで変化した `<td>` はラベル1個のみ）。**残り12件は HOLD**（内訳は UNRESOLVED の H5〜H7）。JSON-LD複製0件。`species/` の difficulty 表示227件は変更前後で完全一致、`species/` `shindan/` の変更0 |
| #71 | H7 解消 — スコア表の軸名を表と導入文で統一 | PR #71 | 5行を再抽出して完全一致を確認し、`初心者向け度`／`初心者向き度` → **`はじめての方向け度`**、`<th>初心者向け</th>` → **`<th>はじめての方向け</th>`** へ。同一ページの導入文と `<th>` を同一commitで揃えた。**`score-dots` の `filled` 数は前後で完全一致**（低臭 152/48・小型 80/20）＝値は無変更。`method-sub`「情報量・飼育データの豊富さ」と他の列ラベルも無変更。**対象2ファイルの「初心者」は0件**になった。`index.html:4156` の同一文字列は H5 のため無変更 |
| #72 | E-2 `shindan/index.html` の関連リンクカード15行 | PR #72 | 15行を再抽出して行番号まで一致を確認し、**`name: '初心者向け亀'` → `'はじめての亀'`（11件）／`name: '初心者向け亀比較'` → `'はじめての亀比較'`（1件）／`desc: '初心者おすすめ比較'` → `'はじめて飼う方におすすめ'`（3件）／`desc: '丈夫で初心者向き'` → `'丈夫ではじめてでも飼える'`（3件）**。**`url:` 66件の並びは完全一致**、キー名の並び・カード総数66も不変。`COMPARE_MAP`（17 slug）と `ROUTE_FALLBACK`（5キー）を構造比較し **url / 件数 / 順序の差分0・ラベル変化15**。5ルート＋変更カードを含む4シナリオを実描画し href・件数・順序が一致、JSエラー 0/0 |
| #73 | E-3 `shindan/index.html` の可視6行 | PR #73 | バッジ2件 `'🎯 初心者向き'` → **`'🎯 はじめての方向け'`**／生成文2件 `初心者向けの回答…` → **`はじめての方向けの回答…`**／`reason:` 2件 `初心者に最も適した` → **`はじめての1頭に最も適した`**。**`shindan/index.html` の「初心者」はコメント8件のみ**になった。変数名・キー名・`url` 66件・`difficulty`・`beginner` 識別子45件は不変。**新発見: `shindan/species.js` の `reason` に可視の「初心者」が3件残っている**（変更禁止指定のため対象外。詳細は `N4`） |
| #74 | N4 解消 — `shindan/species.js` の `reason` 3件 | PR #74 | **安全ゲート通過**（`species.js` 内に `reason` 参照0件＝`match()`/`score()` 未使用。消費は表示3箇所のみ）。ロシアリクガメ `初心者にも人気` → **`はじめて飼う方にも人気`**／クサガメ `初心者にも飼いやすい` → **`はじめてでも飼いやすい`**／トウブドロガメ `初心者にも向く` → **`はじめての1頭にも向く`**。**difficulty 118件と分布（入門11 / 入門〜中級7 / 中級23 / 中〜上級38 / 上級39）は完全不変**、`reason` 以外の全フィールド（name/latin/slug/cites/size/match/score/priority/availability/emoji/legal/hasPage）も不変。**`shindan/` の公開表示から「初心者」が0件**になった（残るのは `index.html` のコメント8件のみ） |
| #75 | N5 解消 — `js/` 配下の共有スクリプト8件 | PR #75 | **安全ゲート PASS・HOLD 0件**（8件とも比較・分岐 / GA4 / href / キー参照のいずれにも未使用）。8件すべてを **`はじめての方向け`** に統一。`js/quick-facts.js` 2（CTA・111ページ）／`js/starter-kit.js` 2（`🔰` tierバッジ・113ページ）／`js/comparison-cta.js` 2（`points` 配列・12ページ）／`js/ranking-engine.js` 2（ランキング名）。キー名・`icon`・`tier`/`cat` 判定条件・`weights`・`comparePage`・配列要素数・`href` はすべて不変。**`js/` 配下の「初心者」は `annainin.js:127` の非表示キーワード1件のみ**になった |
| #76 | 最終フェーズ — U2 + H5 + H6 + N3 | PR #76 | **「初心者」表記整理プロジェクトを CLOSED**。U1 は変更しないと決定してクローズ（★の71ページ再割り当ては実施しない）。U2 = `CLAUDE.md` に「公開語彙ルール — 「初心者」」を新設（18行の最小差分）。H5 6件 = 難易度軸へ統合せず別軸のまま `はじめての方向け` / `はじめての1頭◎` へ。**既存の「飼育難易度」行は無変更**。H6 3件 = E扱いで一般公開コピーとして置換（勝者バッジ / hero-stat / gh-card-tag）。N3 29件 = **変更17 / 内部互換HOLD 1 / SEO不可分HOLD 11** に分類し、17件を同工程で実装。**公開HTMLの「初心者」は 123 → 97 行になり、説明不能な公開表示は0件** |
| #78 | 商品スニペット無効108件の解消 | `34889c0` | GSC 実測エラー「offers、review、または aggregateRating を指定する必要があります」の解消。`*-best10.html` 7ファイルの JSON-LD `@graph` から **`ItemList` ノードのみ削除**（108アイテム）。`Article` / `BreadcrumbList` は1バイトも変更せず、**JSON-LD 以外の全文が7ファイルとも完全一致**。実描画で Amazon リンク109本・アフィリID付き109本・本文長・h1 が変更前と一致、JSエラー 0/0。**削除のみ（683行削除 / 追加0行）** |
| #79 | sitemap.xml の lastmod 194件を実態へ同期 | `12346ed` | `<lastmod>` は**新規ページ追加時にしか書かれていなかった**（sitemap.xml を触った commit は 190 中 **12** で、すべて種ページ追加の `feat(species)`）。既存ページを編集しても更新されず陳腐化していた。194件すべてを対応HTMLの `git log -1 --format=%cs` へ一致させ、**189件を更新 / 5件は既に一致 / 日付が古くなったものは0件**。`<loc>` の追加・削除・変更・順序変更なし、sitemap.xml 以外の変更なし。生成日は8種類（07-26 17 / 08-14 2 / 08-18 23 / 08-22 7 / 08-23 7 / 08-24 10 / 08-25 73 / 08-26 55）で、**全件同日への一括書き換えではない**。generator 4本 `--check` 差分0 |
| #77 | PR #67 救出 — agent 定義の新規追加と種名誤混入5箇所の修正 | `2cebce4` | `.github/agents/kame-life-guide.agent.md` を新規追加（状態は毎回 `docs/AI-HANDOFF.md` を読む設計）。`species/razorback-musk-turtle.html` の別種「ミスジドロガメ」誤混入5箇所を「カブトニオイガメ」へ。main 上で誤混入0件を確認。**PR #67 は merge せず close 済み**（内容は #68 と #77 に移植済み） |
| #80 | PR #16 救出 — カメふしぎ島への導線を全公開ページへ | `e81be51` | 旧ブランチを merge/rebase せず、現 main へ必要差分だけを実装し直した。**167ページに1本ずつ導線を追加**（hub-links 150 / related-links 9 / フッター6 / hint-links 1 / 404 1）＋ `index.html` の Care Module 05 を更新（8ページ版の説明文・CTA・`kids/otona.html` への副リンク新設）。新規GA4イベント `site_kids_click`。**対象外36ページ**（kids本体9 / 商品レビュー6 / 規約・運営者4 / 診断 / 相談窓口 / kid/ / 実飼育記録3 / テンプレート4 / リダイレクトスタブ3 / before-keeping・photo-credits・updates）。検証は全PASS（Scope外差分0・漏れ0・重複0・リンク切れ0・開閉収支不変・SEO7項目不変・ItemList 0維持・「初心者」97行と「はじめての方向け」24行が不変・generator 4本 --check 差分0・実描画と実クリックでJSエラー0） |
| #81 | パンケーキリクガメの写真差し替え | `5c25a1e` | HOLD 解消。**候補C採用**（photo 263266953 / Julien Lepage / CC BY 4.0 / スイス・飼育個体）。casual grade を許容する判断で決着 |
| #82 | タイワンセマルハコガメの写真差し替え | `6efbba6` | HOLD 解消。**臺北翡翠水庫管理局 / 台北市政府許諾**（CC ではない。出典明記のみで商用可・継承なし・撤回不可）。原寸 2400×1800。産地は出典機関からの推定 |
| #83 | ニカラグアクジャクガメの写真差し替え | `5f70b8d` | HOLD 解消。**Tornadohalt / CC BY-SA 3.0**（File:RPincisa-02c.jpg）。ファイル名と説明の両方に `incisa` が明記され亜種を特定できた。飼育個体 |
| #84 | クロコブチズガメの写真差し替え | `484f93b` | HOLD 外の改善。**OpenCage / CC BY-SA 2.5**。旧写真は川の遠景に2匹が豆粒大で識別点が皆無だった。種レベル同定のため delticola は未解消 |
| #85 | ニシキマゲクビガメの写真差し替え | `1a6ed76` | HOLD 外の改善。**Petra Karstedt / CC BY-SA 2.0 DE**。腹甲の橙色（アカハラの由来）が現行写真に写っていなかった。**原寸 780×520 で 800×600 基準に未達のため、亀好きさん判断で本件に限り基準を緩和**（1.15倍拡大）。種レベル同定のため worrelli は未解消 |

**PR #54 / #55 で確定し、二度と問い直さない判定:**

- `yellow-bellied-slider` = **入門**（公開側の「入門〜中級」が誤りだった）
- `hirase-turtle` = **中〜上級**（公開側の「上級」「非推奨」が誤りだった）
- `matamata` / `sulcata-tortoise` = **上級**（「非推奨」は難易度値ではなかった）
- **「非推奨」「最上級」は難易度値として廃止。** 正本5値以外を公開難易度欄に置かない
- 括弧付き難易度（`中級（入手性は上級並み）` 等）4件は削除済み。補足は既存本文がカバー
- `SHINDAN-SPECIES.md` の *Cuora mouhotii* 二重登録は**解消済み**。
  「モンホットハコガメ」はヒラセガメの**別名**（`species-master.json` の `wamei_aliases`）

### その前の連続作業（種一覧・分類・ガイド同期）

| PR | 作業 | merge |
|----|------|-------|
| #41〜#44 | PR監査／内部リンク残件／species一覧のグループ化／ガイド9本のspecies同期 | `c3b00c1` `1e86385` `07fbd28` `cdc1de1` |
| #45 | 種一覧の4重管理を解消し `species.js` から自動生成 | `f917ebe` |
| #46 | ガイド相互ナビを8本×7リンクの完全メッシュに | `e2126d2` |
| #47 | `species-list` のSEO件数表記を実態に合わせる | `ae54182` |
| #48 | `guides/index.html` のカテゴリを 3/8 → 8/8 に | `9ffbb9d` |
| #49 | 生息環境フィルタを6大分類へ統一（Phase 1C・`LEGACY_HAB` 互換） | `4aed4f0` |
| #50 | 6大分類UIを生成管理へ（Phase 1D） | `838c79f` |

### CLAUDE.md にクローズ記録がある完了プロジェクト（**ここに複製しない**）

- **亜種PROJECT**（Phase A/B/C）… 2026-08-24 正式クローズ。候補集合を使い切り未判定ゼロ
- **生体写真の監査・差し替え**… 2026-08-23 完了。出典URL重複0・MD5重複0
- **HOLD 4件の写真素材**… 2026-08-24 調査クローズ。能動的な再探索を行わない

---

## FIXED_FACTS — 固定入力。**再検証しない**

### 種データ

- **difficulty 正本5値**（正本は `shindan/species.js` の `difficulty`）
  `入門 11 / 入門〜中級 7 / 中級 23 / 中〜上級 38 / 上級 39` = **118**、正本外の値 0
- 掲載種 **118**、うち個別ページを持つ種 **112**
- **6大分類**（正本は `tools/taxonomy.js` の `GENUS_CAT` / `CAT_ORDER`）
  `リクガメ 27 / ヤマガメ・ハコガメ 22 / 半水棲 18 / 水棲（淡水）29 / 汽水 6 / スッポン・曲頸 16` = 118
- **公開difficulty表示は正本と完全同期済み**
  `diff-badge 112 / quick-facts 26 / stat-item 111` = **249箇所・不一致0**
- badge の★は `入門★1 / 入門〜中級★2 / 中級★3 / 中〜上級★3 / 上級★4`
  （中級と中〜上級が★3で重なっている。UNRESOLVED を参照）

- **生成物の上流は `shindan/species.js`。`data/species-master.json` ではない**
  `tools/gen-species-list.js` / `gen-guide-species.js` はいずれも `shindan/species.js` の
  `name` / `latin` を唯一の入力とする（`gen-guide-species.js` 冒頭に明記）。
  したがって **master の `wamei` を変えても生成領域の表示名は変わらない**。
  公開表示の和名を変えるには `shindan/species.js` を変える必要があり、
  `shindan/equipment.js` は**その `name` 文字列を辞書キーにしている**ため、
  片方だけ変えると推奨機材のマッピングが壊れる。**和名変更は master 単独では完結しない。**
- **`species/stripe-necked-musk-turtle.html:195` の `Sternotherus minor` は誤りではない**
  「かつて *S. minor* の亜種 *S. minor peltifer* として扱われた」という**沿革の説明**であり、
  同ページは `Sternotherus peltifer` 5箇所・`minor` 1箇所。**この1箇所は残すのが正しい。**
  監査報告の「該当HTML箇所」は **false positive**。**再指摘しない。**
- **`loggerhead-musk-turtle` の `Sternotherus minor` は正しい**（別種）。
  クレジット層の `オオアタマヒメニオイガメ / Sternotherus minor / obs 203020925` を
  `peltifer` に巻き込んで置換してはならない。

- **マタマタ属の和名は確定した。再議論しない**
  `Chelus orinocensis`（slug `amazon-matamata`）= **オリノコマタマタ**、
  `Chelus fimbriata`（slug `matamata`）= **マタマタ／アマゾンマタマタ**。
  「アマゾンマタマタ」は fimbriata 側を指す名称であり、orinocensis の alias には残さない。
  `data/species-identification.json` の slug `matamata` = `マタマタ（アマゾンマタマタ）` は
  **正しいので変更しない**。`species/matamata.html` の `.latin` は
  `Chelus fimbriata — Amazon Mata Mata` のままで正しい。
  なお **slug は `amazon-matamata` のまま**（URL 互換のため変更しない。
  slug と和名がねじれている件は `data/species-identification.json:77` に記録済み）。
- **和名を変えるときに必ず同時に直す3箇所**（PR #88 で実証）
  ① `shindan/species.js` の `name`（生成領域の唯一の入力）
  ② `shindan/equipment.js` の `SPECIES_EQUIPMENT_MAP` のキー
     （`getEquipment(speciesName)` が `SPECIES_EQUIPMENT_MAP[speciesName]` で引く）
  ③ `species-list.html` の `CAT_OVERRIDE` のキー（`CAT_OVERRIDE[sp.name]` で引く手書きJS）
  この3つは同じ和名文字列で連結しており、**片方だけ変えると機能が壊れる**。
  生成領域（`BEGIN:species-index` / `BEGIN:guide-species`）は上流を直して
  generator を実行する。**生成物を手修正しない。**
- **`docs/phase2/baselines/*.json` は凍結スナップショット。追随させない**
  commit `0bb3185` 時点の Phase2 評価結果の記録であり、現在のデータと一致しなくてよい。
  和名変更で古い名前が残るが、**過去の評価記録を書き換えないため無変更が正しい**。
- **`tools/validate_species.py` は main の時点で既に落ちる**
  `SHINDAN-SPECIES.md` の CITES 列が `None` の行で `TypeError` → exit 1。
  **これは既存の不具合であり、個々の作業の失敗ではない。**
  検証では「変更前後で出力が完全一致すること」を確認すれば足りる。修正は別工程。
- **`scripts/verify_all.py` / `verify_credits.py` はこの実行環境では動かない**
  iNaturalist API へ到達できない（egress ポリシー）。**毎回試さない。**

- **カントンクサガメの実体は確定した。再議論・再調査しない**
  slug `canton-reeves-turtle` = **独立種 *Mauremys nigricans*** / `rank=species` /
  **CITES附属書II**（2026-08-26 亀好きさん確定・分類根拠は外部確認済み）。
  和名「カントンクサガメ」は維持。slug も維持（URL 互換）。
  旧扱い「クサガメ *Mauremys reevesii* の広東型・`rank=regional_form`・附属書III」は**廃止**。
  クサガメ（slug `reeves-turtle` / *Mauremys reevesii* / `rank=species` / **附属書III**）は
  **別種**であり、片方を直すときにもう片方を巻き込まない。
- **カントンクサガメの写真とクレジット4層は、いま書き換えてはいけない**
  掲載写真 `assets/species-photos/canton-reeves-turtle.webp` は iNaturalist photo 233939363
  （mami_t_t / CC BY 4.0 / 2022-09-30・東京都）で、***Mauremys reevesii* としてクレジットされている**。
  *M. nigricans* の写真ではない。クレジット4層（figcaption / `photo-credits.html` /
  `pc_parsed.json` / `credits_map.json`）は**写真の実体を正しく述べている**ので、
  学名を `Mauremys nigricans` に書き換えると**虚偽のクレジットになる**。
  公開ページには「この写真は *M. reevesii* のもの」と明記済み。
  **写真そのものを差し替えたときに、初めて4層を nigricans へ更新する。**
- **`docs/SPECIES-ID-ASSIGNMENTS.md` は古い。真として読まない**
  同ファイルは識別タスクの**担当割り当て記録**であり、
  「reeves と canton-reeves は同一学名 M. reevesii」「canton-reeves(M. reevesii 広東型)」と
  書かれているが、これは PR #89 で**廃止された旧扱い**。歴史的記録として残しているだけ。

- **B判定9件の和名は実装済み。再調査・再判定しない**（PR #90）
  `セオレガメ（ホメアナ）`→**ホームセオレガメ**／`アジアコガシラドロガメ`→**ホオジロクロガメ**／
  `コウキバラガメ`→**リバークーター**／`フロリダレッドベリータートル`→**フロリダアカハラガメ**／
  `スパイニースッポン`→**トゲスッポン**／`スムーススッポン`→**スベスッポン**／
  `ヘビクビガメ`→**オーストラリアナガクビガメ**／`アフリカヨコクビガメ`→**アフリカヌマヨコクビガメ**／
  `セグロヘビクビガメ`→**コウホソナガクビガメ**。slug・URL・学名は1つも変えていない。
- **「ヘビクビガメ」は文脈で意味が変わる。一括置換してはいけない**
  種名 *Chelodina longicollis* としての用法は PR #90 で オーストラリアナガクビガメ へ移した。
  残る50箇所は**すべて意図的残存**であり、次の12パターンのいずれかに当たる:
  `スッポン・ヘビクビガメ`（guide-softshell のカテゴリ名。nav／title／meta／h1／パンくず／
  `shindan/species.js` の links ラベル／`tools/gen-guide-nav.js` のラベル表）／`ヘビクビガメ科`（科名）／
  `ニシキヘビクビガメ`（*Chelodina mccordi* の旧表記・別種）／`ライマンヘビクビガメ`（別種）／
  `水棲のヘビクビガメ`・`水棲ヘビクビガメ`・`背腹二色型ヘビクビガメ`・
  `「ヘビクビガメはヒーターなしでも大丈夫」`（いずれも科レベルの総称）／
  `ヘビクビガメ・ナガクビガメ`・`ヘビクビガメ</span><span>ナガクビガメ`・
  `スッポン類・ヘビクビガメ`・`マタマタ・ヘビクビガメ`（分類群の並記）。
- **B9のうち equipment キーを持つのは4件だけ**（トゲスッポン／スベスッポン／
  オーストラリアナガクビガメ／アフリカヌマヨコクビガメ）。残る5件は**変更前から未マッピング**で、
  `getEquipment` の未解決46件に元から含まれる。**PR #90 は新しいキーを足していない**（劣化ゼロ）。

- **`wamei_aliases` の仕様（PR #91 で確認・確定）**
  所在は `data/species-master.json` **のみ**。形式は文字列配列で、`wamei` の直後に置く。
  **読んでいるコードは1つもない**（master を読むのは `tools/validate_species.py` だけで、
  それも `wamei_aliases` を参照しない）。つまり **FACT-CHECK 正本内の記録項目**であり、
  表示・検索・診断のどれにも接続されていない。
  `species-list.html` の検索は `haystack() = sp.name + sp.latin + sp.slug` で
  **`shindan/species.js` を入力**としており、master も alias も見ない。
  値に `（標準和名）`『（種の別名）』のような**注記を括弧で付ける先例がある**
  （`オオアタマドロガメ（当サイト旧表記・使用実績確認できず）`）。
- **C判定17件の alias は実装済み。再調査・再判定しない**（PR #91）
  保有レコード 7 → **23**、alias 総数 10 → **33**。
  `ロシアリクガメ`＝ヨツユビリクガメ（標準和名）/ホルスフィールドリクガメ、
  `フチゾリリクガメ`＝マルギナータリクガメ、`ヒョウモンガメ`＝ヒョウモンリクガメ、
  `インプレッサムツアシガメ`＝ベッコウムツアシガメ、`パンケーキリクガメ`＝パンケーキガメ、
  `ミシシッピアカミミガメ`＝アカミミガメ（条件付特定外来生物の指定名）、
  `サラドロガメ`＝メキシコドロガメ、`カンバーランドスライダー`＝カンバーランドキミミガメ、
  `ハナナガドロガメ`＝タバスコドロガメ（**既存。今回無変更**）、
  `オオアタマヒメニオイガメ`＝ヒメニオイガメ（種の和名）、
  `マンヤマガメ`＝コスタリカアカスジヤマガメ、
  ダイヤモンドバックテラピン5亜種＝キスイガメ（種の和名）/ダイヤモンドガメ（種の別名）、
  うち `オルナータ` のみ ニシキダイヤモンドガメ を追加、
  `ジーベンロックナガクビガメ`＝チリメンナガクビガメ。

- **別名検索のデータフロー（PR #92 で確立。二重管理しない）**
  正本 `data/species-master.json` の `wamei_aliases`
   → `tools/gen-species-list.js` が読む（キーは **`wamei`**。`slug` を持たない種があるため）
   → `species-list.html` の `// BEGIN:wamei-alias … // END:wamei-alias` へ `WAMEI_ALIAS` を焼き込む
   → `haystack()` が `sp.name + WAMEI_ALIAS[sp.name] + sp.latin + sp.slug` を返す。
  `species-list.html` は外部JSを増やさない方針なので、`taxonomy-data` と同じく**値を焼き込む**。
  **別名を追加したら master だけ直して `node tools/gen-species-list.js` を実行する。**
  `shindan/species.js` には別名を持たせない（二重管理をしない）。
  master の値は**加工せずそのまま**連結する。`（標準和名）` のような注記も一緒に入るが、
  部分一致検索なので注記を除いた別名そのものでもヒットする。
  master に別名があるのに `species.js` に該当種が無い場合、generator は**書き込みを中止する**
  （別名が検索から静かに消えるのを防ぐため）。
- **`キスイガメ` / `ダイヤモンドガメ` が5件ヒットするのは誤ヒットではない**
  どちらも種 *Malaclemys terrapin* の和名で、5亜種すべての別名として登録されているため。

### ゴールデンギリシャリクガメの写真素材（2026-08-27・探索クローズ）

`species/golden-greek-tortoise.html` は **land 27種でただ1つ生体写真を持たないページ**
（`img` タグ0件・`species-photo` ブロック無し・`css/species-photo.css` 未読込・
`og:image` は `images/hero/eastern-box-turtle-hero.jpg` を流用中）。
候補探索を2回実施して**打ち止めまで到達した**。以下は一次データの実測値であり推論ではない。
**同じ探索をやり直さない。**

- ***Testudo graeca* 系の taxon は 20件**（種1＋亜種19。うち active 11）。
  シノニム `floweri`(40026) / `perses`(889772) / `anamurensis`(40027) / `pallasi`(116209) /
  `lamberti`(116206) / `nikolskii`(40025) / `soussensis`(40024) / `graeca`(40031) は
  **すべて active=false かつ観察0件**。掘る先はもう無い。
- **terrestris 固有域の箱 = lat 28.0–36.0 / lon 32.5–42.0**。
  `observations.csv.gz` から *T. graeca* 系 7,148観察を抽出して亜種別レンジを実測し、
  **他亜種が1件も入らない最大の範囲**として確定した。箱の中身は
  種レベル(40023) research 880 / casual 10 / needs_id 1、terrestris 166、他亜種 **0**。
  最寄りの他亜種（ibera）は箱の外 45km。
- **照合した写真は累計 606枚**（terrestris 同定 280 ＋ 固有域 research 309 ＋ 固有域 casual/needs_id 17）。
  **商用可（CC0 / CC-BY / CC-BY-SA）は 21枚のみ**で、残る **585枚（96.5%）が CC-BY-NC 系**。
  ボトルネックは**ライセンスであって素材の総量ではない**。
- **解像度は制約になっていない。** 商用可21枚は**全部が 800×600 以上**。
  「あと少しで届かない」写真は0枚。**基準を下げても候補は増えない。**
- **21枚すべてを原寸取得して1枚ずつ目視済み**（推論による判定は0件）。
  候補ボード → https://claude.ai/code/artifact/f7554b86-cdce-4e53-b65b-4512543fb7f6
- **研究グレードの範囲に、採用基準を完全に満たす写真は無い。**
  自然な姿勢の成体は1枚（photo 10249391）だけで、それも甲が暗色で「ゴールデン」に見えない。
  黄金色が明瞭なもの（photo 229122899 / 5361707）は**頭も四肢も引っ込んでいる**。
- **casual grade に、21枚中もっとも状態のよい写真がある**（photo 30155234 / obs c66eee0a /
  Hila Taylor / CC BY 4.0 / 2048×2048）。頭を完全に出し目が開き、甲は黄金色。
  ただし **quality grade が casual** で、当サイト基準（research grade）の外側。
  **Open Data の公開項目に captive フラグは無く、casual の理由は断定できない**
  （日付・座標・種同定が揃っているため飼育個体フラグの可能性が高い、までしか言えない）。
- **第1次の最上位候補 photo 229122899（obs 302e6a4f）はトルコ南東部ディヤルバクル産**で、
  流通名「ゴールデンギリシャ」が指すレバント個体群から**約700km北**。
  半径150km内の亜種同定つき terrestris はわずか2件。第1次では把握していなかった弱点。

### 「初心者」公開表現（Phase A の分類・**再分類しない**）

- 公開表示 **239件 / 87ファイル**（基準 `6bb2fb0`）
  `A 難易度 62 / B 飼育経験 52 / C おすすめ 22 / D 注意・警告 24 / E 見出し・CTA・ナビ 67 / F その他 12`
- 処理済 183件（B-1 37 + B-2 37 + A-1 26 + A-4 5 + H1 14 + A-5 3 + B18 1 + H2 2 + C 22 + D 24 + F 11 + H4 1）→ **残 56件**
- **A-1 は完了。** species 個別ページの quick-facts ラベルは `飼育難易度`。
  `初心者向き？` は species/ 配下に残っていない
- **B分類（飼育経験）52件は 52/52 完了・未処理0。** 冬眠まわりの可視文とJSON-LDは同期済み。
  **B分類はクローズ。再監査しない**
- **A-5 は完了。** 見出しは `はじめての1頭に向くか`。
  `初心者に向くか` はリポジトリ内に残っていない
- **C分類（おすすめ・選び方）22件は完了・未処理0。** 「初心者におすすめ／人気／飼いやすい」は
  「はじめて飼う方」「はじめてでも」「はじめての1頭」系へ置換済み。推薦強度は変えていない。
  **C分類はクローズ。再監査しない**
- **D分類（注意・警告）24件は完了・未処理0。** 抽象的な「初心者には難しい」を
  難所を名指しする文へ書き換え済み。難所の内訳は
  湿度・温度の同時管理9 / 情報・流通の乏しさ3 / 汽水・塩分管理2 / 終生サイズ2 /
  給餌・取り扱い1 / 除外リストの条件化2 / 冬眠4 / 主語削除1。
  **D分類はクローズ。再監査しない**
- **F分類（その他）12件は 12/12 完了・未処理0。** 残っていた H4 は PR #68 で解消済み。 読者層の指定・採点基準の説明・UI例文を
  「はじめて飼う方」「飼育経験が浅いうちは」系へ置換済み。**F分類はクローズ。再監査しない**
- **残る未処理は A分類の残り28件（62 − A-1 26 − A-4 5 − A-5 3）と
  E分類の残り28件（67 − B-2 37 − H2 2）の合計56件。**
  （旧記述の「E 30件」は内訳と合っていなかったため、固定入力どうしの差し引きで訂正した。
  Phase A の分類そのものはやり直していない）
- **`annainin` の公開表示から「初心者」は0件。** `js/annainin.js` に残る1件は
  `INTENT_RULES` の分類キーワードで**非表示・変更禁止**（N2 は解消済み）
- **未処理の HOLD は 0。** Phase B-1 / B-2 由来の HOLD 16件（JSON-LD複製14 + B18 1 + H2 1）は
  すべて解消済み。以後、これらを HOLD として扱わない
- **`shindan/index.html` の exit-capture カードは `はじめての亀 TOP3` 系で統一済み。**
  `ec-btn-guide` の `href` / `id` / GA4イベント（`exit_capture_click` / `target_type`）は無変更
- **A-4 は完了。** 対象5ページのFAQ問いは `はじめて飼う亀に向きますか？`。
  可視 `<summary>` と JSON-LD `"name"` は一致している。
  残る「初心者向けですか？」2件は**複合質問で対象外**
  （`guide-beginner.html`「リクガメと水棲ガメ、どちらが初心者向けですか？」／
  `species/razorback-musk-turtle.html`「ニオイガメとカブトニオイガメ、どちらが初心者向けですか？」。
  いずれも Phase A では E分類）
- **「初心者向け」→「入門向け」の一律置換は禁止。** 「入門」は既に難易度値として
  公開HTML内で128件使われており、件数の異なる集合が同じ語になる
- **商品スニペット（Product リッチリザルト）はサイトとして出さない方針**（PR #78）。
  本サイトは商品を販売しておらず Amazon へ送客する比較記事のため、Google の Product
  構造化データが想定する「自サイトの商品ページ」に当たらない。
  `offers`（価格・在庫）の追加は **Amazon アソシエイト規約リスクのため恒久的に禁止**。
  GSC 実測でも商品スニペットは **有効0**（一度もリッチリザルト表示に至っていない）
- **`*-best10.html` 7ファイルの JSON-LD は `Article` + `BreadcrumbList` の2ノードで確定**（PR #78）。
  `ItemList` は再追加しない。best10 の商品リンクは `js/affiliate-track-static.js` が
  イベント委譲で計測しており、**静的HTMLに Amazon リンクは0本**（JSが生成）。
  したがって JSON-LD の変更は可視リンク・計測に一切影響しない
- **構造化データの実測（PR #78 の調査で確定・再走査しない）**
  Product は `*-review.html` 6ファイルのみ（`name` + `brand` + `review` のみで
  `image`/`offers`/`aggregateRating`/`sku` なし）／microdata 0 ／JSによる JSON-LD 動的注入 0 ／
  `offers`・`aggregateRating`・`price`・`sku`・`gtin` はサイト全体で 0 件
- **「初心者」表記整理プロジェクトは CLOSED**（PR #76）。**新しい調査フェーズを作らない。**
  公開HTMLに残る97行は全件が次のいずれかで説明できる（PR #76 で全件走査・再調査しない）:
  **SEO運用HOLD 80**（`title` 6 / `meta`・OG 33 / JSON-LD 26 /
  可視FAQ×JSON-LD 1対1 の3 / 見出し h1-h6 9 / パンくず 3）／
  **内部互換 5**（`?diff=初心者向け` の `href` 2 / `<option value="beginner">` 1 /
  GA4 `page_title` 1 / `species-list.html` の `LEGACY_DIFF` キー 1）／
  **明示HOLD 2**（`aria-label`（h1と対）1 / `compare/hermann-vs-greek.html` の `hero-sub`（title・OGと対）1）／
  **非表示コメント 10**
- **SEO系（`title`/`meta`/OG/JSON-LD/見出し/パンくず）80行は GSC/GA4 の実測トリガーなしに変更しない。**
  `CLAUDE.md` の「公開語彙ルール — 「初心者」」と `docs/operations/DECISION_RULE.md` が正本
- **U1 は「変更しない」で決着**（PR #76）。badge★の71ページ再割り当ては実施しない。
  ★・difficulty・色・アイコンは現状のまま**変更禁止**
- **H5 の6件は難易度軸へ統合しない**と決着（PR #76）。別軸として `はじめての方向け` を維持し、
  同じ表・カードの「飼育難易度」「難易度」行はそのまま残す
- **`js/` 配下の共有スクリプトの公開語彙は `はじめての方向け` で確定**（PR #75）。
  `quick-facts.js` の Sticky CTA（`isEasy` = difficulty に「入門」で長文/短文を出し分け）／
  `starter-kit.js` の `🔰` tierバッジ（food×budget と enclosure の既定）／
  `comparison-cta.js` の `points` 配列（比較の観点名）／`ranking-engine.js` の `label`。
  **`js/` に残る「初心者」は `annainin.js:127` の `INTENT_RULES` 1件のみで、非表示・恒久的に変更禁止**
- **`js/` 配下の共有スクリプトの影響範囲**（PR #75 実測・再調査しない）。
  `quick-facts.js` **111ページ** / `starter-kit.js` **113ページ** / `comparison-cta.js` **12ページ** /
  `ranking-engine.js` **0ページ**（どのHTMLからも読み込まれていない）
- **`shindan/species.js` の `reason` は表示専用フィールド**（PR #74 で全走査して確定・再調査しない）。
  `species.js` 内に `reason` の参照は0件で、`match(scores)` / `score(scores)` は
  スコアオブジェクトしか見ていない。消費するのは表示3箇所だけ:
  `shindan/index.html:2895`（`textContent`）／`shindan/index.html:3854`（`runnerup-desc`・48文字スライス）／
  **`species-list.html:677`（`<p class="sp-reason">`・118件）**。
  → `reason` を1箇所直すと診断結果と種一覧の両方に反映される
- **`shindan/` 配下の公開表示から「初心者」は0件**（PR #74）。
  `species.js` 0 / `index.html` 可視0 / `routes.js` 0 / `equipment.js` 0。
  `index.html` に残る8件はすべてコメントで画面に出ない（恒久的に対象外）
- **診断結果のメイン説明文（`#res-reason`）は `shindan/species.js` の `reason` を描画している**
  （PR #73 の実描画で確定・再調査しない）。`shindan/index.html` 側の `reason:` 2件
  （`:2668` の exotic 安全 fallback / `:2860` の fallback 種）は**通常経路では表示されない**
- **`shindan/index.html` の可視文字列は確定**（PR #73）。バッジ `🎯 はじめての方向け`／
  生成文 `はじめての方向けの回答…`／fallback `はじめての1頭に最も適した`。
  **`shindan/index.html` に残る「初心者」8件はすべてコメントで画面に出ない。恒久的に対象外**
- **バッジは3系統**（PR #73 で実行時に確認）。`BARRIER_BADGE_ADVANCED`（difficulty に「上級」）/
  `BARRIER_BADGE_MAP`（8キー・equipKey 一致）/ `BARRIER_BADGE_BEGINNER`（difficulty に「入門」）。
  **変数名・キー名は互換のため変更しない**（`beginner` を含む識別子は45件あり、いずれも内部識別子）
- **`shindan/index.html` の関連リンクカードは2つのマップで定義されている**（PR #72 で確定・再調査しない）。
  `COMPARE_MAP`（種 slug 別・**17 slug**）と `ROUTE_FALLBACK`（`land` / `aquatic` / `forest` /
  `exotic` / `all` の5キー）。**カード定義は合計66件**で、描画は
  `res-compare-card-name` / `-desc` / `-btn`（`href`）の単純な文字列連結。
  `.res-compare-card-name` / `-desc` に**省略（ellipsis / line-clamp）や固定幅はない**ため、
  ラベルの文字数が増えても折り返すだけで切れない
- **診断の関連リンクカードの語彙は確定**（PR #72）。`はじめての亀` / `はじめての亀比較` /
  `はじめて飼う方におすすめ` / `丈夫ではじめてでも飼える`。**`url:` は1件も変更していない**
- **スコア表（`cmp-table` + `score-dots`）の列は「ドットが多いほど良い」向きで統一されている**
  （PR #71 で確定・再確認しない）。ニオイ管理／排泄量少なさ／掃除頻度少なさ／ニオイ管理しやすさ／
  **はじめての方向け**。**この軸に `飼育難易度` を使わない** — 使うと多いほど難しい＝悪い、と読めて
  列の向きが反転する。値（`dot filled` の数）は変更禁止なので、ラベル側を反転させない語に揃える
- **スコア表の軸名は `はじめての方向け`（表の `<th>`）/ `はじめての方向け度`（導入文・`method-label`）で確定**（PR #71）。
  導入文と `<th>` は**常に同一commitで揃える**
- **compare 系の★は「多いほどやさしい」**（PR #70 で全 compare ページを実測して確定・再調査しない）。
  `飼育難易度 ★★★★★ 入門向き` / `★★★★☆ 初中級` / `★★★☆☆ 中級` /
  `★★☆☆☆（中〜上級者向け）`。**species 個別ページの diff-badge とは向きが逆**なので、
  compare の★を species の★と同じ規則で読み替えない（★の統一は U1 の範囲）
- **compare の比較表の難易度軸ラベルは `飼育難易度` で統一済み**（PR #70）。
  値（★・◎・○・―・括弧の補足）は一切変更していない
- **Phase A の per-item 分類リストは repo に存在しない**（PR #69 で確定・再探索しない）。
  残っているのは分類ごとの件数（A62 / B52 / C22 / D24 / E67 / F12）だけで、
  「どの行がA分類か」の一覧は `docs/` にも `AI_CHANGELOG.md` にも `CLAUDE.md` にも無い。
  **したがって「A分類の残り28件」は機械的に再現できない。** 件数からの差し引き（62−26−5−3=28）は
  合計としては正しいが、対象行を一意に決めるだけの情報がない
- **公開HTMLの「初心者」分布（main `3e84381` 実測・155行）**
  変更禁止 66行（`title` 6 / `meta`・OG 33 / JSON-LD の `headline`・`description`・`name` 21 /
  パンくず 2 / `href` 2 / `<option value="beginner">` 1 / GA4 `page_title` 1）／
  E分類側の見出し（h1-h6）9行／**本文・ラベル 80行**
- **本文・ラベル80行のうち、難易度の軸ラベルとして機械判定できるのは18行**（PR #69 で実測）。
  `<td>` 9 / `<th>` 3 / `.wb-badge` 1 / `.rank-badge-pill` 1 / `.gh-card-tag` 1 /
  `.method-label` 1 / `.stat-label` 1 / `index.html` の hero-stat 1。
  残る62行は A（難易度）か C（おすすめ）か D（警告）か E（見出し・CTA）かを
  **文脈判断しないと分けられない** = Phase A の再分類にあたる
- 採用する語彙（サイトに既に定着しているもののみ。新語を作らない）
  UI・見出し・CTA →「はじめての」／散文 →「はじめて飼う方」「飼育経験が浅いうちは」／
  条件・除外 →「飼育経験が中級までの方」／警告 → 難所を名指しする

### 構造上の制約（**再確認しない**）

- **JSON-LD の `FAQPage` が可視の `faq-body` / `h3` を1文字違わず複製している。**
  可視側だけを直すと構造化データと表示内容が乖離する。
  可視FAQを直すときは**同一commitでJSON-LDと完全同期**させる（PR #54 で条件付き許可済み）。
  **PR #59 / #60 でこの手順の成立を確認済み。**
  #59 は `"name"`、#60 は `acceptedAnswer.text` に適用。いずれも可視とJSON-LDを
  同時置換し、置換箇所以外に差分0・JSONパース成功を確認している
- 互換のため変更しない: `sort=beginner` / `?diff=初心者向け` / GA4イベント名 /
  `s.beginner` / beginner を含むURL・slug・ファイル名
- generator 5本（マーカー方式・`--check` で差分検出）
  `tools/taxonomy.js`（分類SSoT）/ `gen-category-ui.js` / `gen-species-list.js` /
  `gen-guide-species.js` / `gen-guide-nav.js`
- 本番URLの確認は本実行環境から不可（EGRESS_BLOCKED）。GitHub Pages 反映確認は亀好きさん側

#### `annainin`（亀の案内人チャット）の実測構造 — PR #66 / #68 で確定・**再調査しない**

- `js/annainin.js:347-349` のハンドラは `getAttribute('data-quick-reply')` **だけ**を読む。
  `.an-topic-btn` の可視ラベルは**一切読まれない**
- `submitUserText()` は送信テキストを**そのままユーザー発言バブルとして画面に描画**する。
  → 可視ラベルと `data-quick-reply` は**必ず同じ語彙に揃える**（PR #68 で揃えた）
- `TOPIC_QUICK_REPLIES`（`js/annainin.js`）は `data-quick-reply` と `textContent` の
  **両方**に同じ文字列を入れる。bot の返信ボタンは**可視表示**である
- bot 応答本文2件（`capability` / `unknown`）は **topic-btn 10個の可視ラベルを順に列挙**している。
  ラベルを変えたらこの2件も必ず同時に変える
- **`INTENT_RULES`（`js/annainin.js:127` 付近）は公開表示ではない分類語彙。**
  beginner キーワード `['初心者','はじめて','初めて','入門']` は**恒久的に変更しない**。
  「初心者」を削ると「初心者」と手入力したユーザーが `unknown` に落ちる
- **annainin の公開語彙は「はじめての方向け」で確定**（PR #68）。
  topic-btn 可視 `はじめての方向け` / `data-quick-reply` と `TOPIC_QUICK_REPLIES[0]` は
  `はじめての方向けの亀は？`。**この4箇所は今後ばらばらに変更しない**
- GA4 は `annainin_view` / `annainin_message_sent` / `annainin_intent_classified` /
  `annainin_feature_link_click` の4種。イベント名・パラメータ名は無変更。
  `message_length` は送信文の長さそのものなので、文言を変えれば値は変わる（9→12）。
  これは仕様どおりで、GA4 定義の変更ではない

#### sitemap.xml の運用構造（PR #79 で実測確定・**再調査しない**）

| 事実 | 実測値 |
|------|--------|
| `<url>` / `<loc>` / `<lastmod>` 件数 | いずれも **194**（1 URL = 1 loc = 1 lastmod） |
| URL → 実体の対応 | `https://kamelifeguide.com/<path>`。末尾 `/` は `<path>index.html`、ルートは `index.html`。**194件すべて実在ファイルへ解決する（欠損0）** |
| sitemap.xml を触った commit | 190 commit 中 **12**。すべて `feat(species): …追加` 系＝**新規 `<loc>` 追加時のみ** |
| sitemap.xml を書き出す generator / CI | **存在しない**（`tools/` `scripts/` `.github/` に sitemap を扱うコードなし）。手動更新のみ |
| 陳腐化の原因 | 上記2点の帰結。**既存ページを編集しても `<lastmod>` が更新されない**構造だった（PR #79 時点で 189/194 が実態より古かった） |

**再発防止は「提案のみ」で、今回は自動化していない。** 推奨は A案（generator 化）:
`tools/gen-sitemap.js --check` を追加し、`<loc>` の集合と順序を現行のまま固定したうえで
`<lastmod>` だけを `git log -1 --format=%cs` から生成・照合する。既存 generator 4本と同じ
`--check` 契約に揃えれば、PR ごとに差分0を確認できる。**実装は未着手。**

#### kids 導線と generator 管理領域（PR #80 で実測確定・**再調査しない**）

| 事実 | 実測値 |
|------|--------|
| 導線を入れた対象 | **167ページ**（hub-links 150 / related-links 9 / フッター 6 / hint-links 1 / 404 1）＋ `index.html` |
| 対象外 | **36ページ**。kids本体9 / 商品レビュー6（`*-review.html`）/ 規約・運営者4 / `shindan/` / `annainin/` / `kid/` / 実飼育記録3 / テンプレート4 / リダイレクトスタブ3（`meta refresh` + `noindex`）/ `before-keeping` `photo-credits` `updates` |
| 新規GA4イベント | `site_kids_click`（`from`: `hub` / `related` / `hub_footer` / `explore` / `404` / `guide_module_otona`）。既存イベント名・件数は不変 |
| **`guide-*.html` 8本の `hub-links` は generator 管理領域** | `tools/gen-guide-nav.js` が `<!-- BEGIN:guide-nav -->` 〜 `<!-- END:guide-nav -->` を丸ごと再生成する。**内側を手で編集すると `--check` が差分を出す。** マーカーの外に独立した `hub-links` を置くこと |
| `guides/index.html` の「カテゴリから探す」も同様 | `<!-- BEGIN:guides-hub-env -->` 〜 `<!-- END:guides-hub-env -->` が生成対象 |
| `.gl-cta`（`index.html`） | `::after` が `"→"` を付与する。**CTA本文に矢印を書くと二重になる。** 5枚とも本文に矢印なし |
| リダイレクトスタブ3件 | `species/ornate-cuora.html` / `species/hime-nioi-turtle.html` / `species/ouachita-map-turtle.html` |
| テンプレート4件 | `species/_template-monetized.html` / `hermann-dry-template` / `pink-bellied-template` / `three-toed-box-template` |

`explore.html` の `.hint-links` は既存3リンクとも**タップ高27px**で、追加した1本も同値。
`guides/index.html` のフッターは既存リンク14pxに対し追加分は34px。いずれも既存設計に合わせた結果で、
PR #80 が持ち込んだ劣化ではない。

#### 写真の出典・和名（2026-08-26 実測確定・**再調査しない**）

**Wikimedia Commons 経路が使えるようになった。** この実行環境から Commons・Wikipedia・
fws.gov・nps.gov・GBIF・Flickr はすべて egress proxy で遮断（CONNECT 403）されており、
到達できるのは `inaturalist-open-data.s3.amazonaws.com` のみ。
**亀好きさんがファイルページのスクリーンショットと画像を送る形で運用が成立した。**
必要なのは ①ファイル名 ②説明（学名・亜種名）③ライセンス ④著者 ⑤原寸 ⑥画像本体 の6点。

| 対象 | 確定した出典 |
|------|-------------|
| `pancake-tortoise` | photo 263266953 / Julien Lepage / CC BY 4.0 / 飼育個体 |
| `taiwan-box-turtle` | File:Chineseboxturtle 2006.jpg / 臺北翡翠水庫管理局 / **台北市政府許諾（CC ではない）** / 帰属表示「台北市政府」 |
| `nicaragua-wood-turtle` | File:RPincisa-02c.jpg / Tornadohalt / CC BY-SA 3.0 / 飼育個体 |
| `black-knobbed-map-turtle` | File:Graptemys_nigrinoda_by_OpenCage.jpg / OpenCage / CC BY-SA 2.5 / 飼育個体 |
| `pink-bellied-side-necked-turtle` | File:Rotbauchspitzkopfschildkroete-07.jpg / Petra Karstedt / CC BY-SA 2.0 DE / 飼育個体 |
| `carolina-diamondback-terrapin` | **現状維持で決着**（Simon Tonge / CC0 / obs 9822014） |

**解像度基準の運用**: 800×600 は原則維持。PR #85 で **1.15倍拡大を1件だけ許容**した
（識別上もっとも重要な形質が旧写真に写っていなかったため）。
Commons の obsti 候補（500×349・1.72倍拡大が必要）は**基準未達として不採用**。
緩和は自動適用しない。拡大率と得られる情報を都度天秤にかける。

**私（Agent）が誤っていた和名 — 正本は `data/species-master.json`:**

| 学名 | 誤 | 正 |
|------|----|----|
| `Cuora mouhotii obsti` | ~~オオヤマガメ~~ | 親種 = **ヒラセガメ**（`hirase-turtle`・別名モンホットハコガメ） |
| `Graptemys nigrinoda delticola` | ~~デルタコクロスジチズガメ~~ | 親種 = **クロコブチズガメ**（`black-knobbed-map-turtle`） |
| `Emydura subglobosa worrelli` | ~~ジーベンロックナガクビガメ近縁~~ | 親種 = **ニシキマゲクビガメ**（`pink-bellied-side-necked-turtle`） |

`ジーベンロックナガクビガメ` はサイトに実在する**別種** *Chelodina rugosa*（`siebenrocks-snake-necked-turtle`）。
`Malaclemys terrapin tequesta` の和名は **ヒガシフロリダキスイガメ**（2026-08-26 亀好きさん決定・A案）。

**`scripts/verify_credits.py` は元から FATAL。** `pc_parsed.json` を cwd 直下で探す設計だが
実体は `data/` にあり、加えて iNaturalist への通信が必要。本セッションの変更とは無関係。

### 変更履歴（AI_CHANGELOG）

- **`AI_CHANGELOG.md` は Merge済み PR #13〜#62 を全件記録済み**（PR #63 で補完）。
  §9.3-R2 の7項目（Date / Actor / Change / Reason / PR・Commit / Approver / Conforms）を
  47/47 で満たし、記載した merge commit は 47/47 が実在する
- **記録対象は「Merge済み変更」＝PR merge のみ。** Automation（rakuten 価格更新・main 直 push）と
  直 push は §9.3-R1 の「Merge 済み変更」に当たらないため記録しない
- 欠番 **#14 / #16 / #35** は main に Merge されていない
- 各エントリの Change / Reason は Git 履歴（merge commit・PRブランチのコミット本文・変更統計）から
  取った事実のみ。**推測で補っていない**

### 正本ファイルの所在

| 対象 | 正本 |
|------|------|
| difficulty・種データ | `shindan/species.js` |
| 学名・CITES・難易度の参照表 | `SHINDAN-SPECIES.md` |
| 分類（属→6大分類） | `tools/taxonomy.js` |
| 種のメタデータ・出典 | `data/species-master.json` |
| 恒久ルール | `CLAUDE.md` |
| 規範 | `DEVELOPMENT_CONSTITUTION.md` |
| 変更履歴（append-only） | `AI_CHANGELOG.md` |

---

## UNRESOLVED — 本当に未解決のものだけ

> **2026-08-29 CLOSEOUT COMPLETE 後の実態。**
> **DECISION は0件。** 判断待ちで止まっている作業はもう無い。
> 残っているのは、外部データ・外部一次資料・新しい写真素材が無いと
> **物理的に進められない BLOCKED だけ**。

### DECISION

| ID | 内容 | 判断材料 |
|----|------|---------|
| **R1 food_hikari_turtle の実体確認** | name「カメのごはん（ウーパールーパー用？）」と term/why が別商品を指す。ASIN B0043UN3X4 の実体確認は Owner の実物確認が必要 | 確認できたら name/term を同期し `rakutenIdentityHold` を外す。確認できるまで楽天昇格から恒久除外（HOLD） |
| **R2 food_reptomin_tetra の統合/削除** | food_aquatic_premium と同一商品ライン（テトラ レプトミン）の重複。EQUIPMENT_MAP 未参照の孤児レコード | 削除しても参照切れは起きないことを Phase 0 で確認済み。統合 or 削除は Owner 判断（HOLD） |
| **R3 food_tortoise_herbs の昇格可否** | Phase 2 で Owner が△非承認（180g/400g併記出品）とした商品が、Phase 3 の日次レガシーゲートの正規条件（identity STRONG＋スコア9.1≧8.0＋成果対象URL）を満たして available 化された。商品自体はマルベリックドライで正しい | 非承認を維持するなら `rakutenIdentityHold: true` を1行付与（次回日次で自動降格）。昇格を認めるなら現状のまま。**Owner 判断** |

**旧 D1〜D9 はすべて CLOSE または BLOCKED へ着地済み**（COMPLETED 参照）。

### 判断待ちではないが未完了（次に楽天系工程を立てるときに拾う）

- **承認済みだが未昇格の2件**（Phase 5 で `shelter_small` と `basking_100w` は解消済み）:
  `food_tortoise_staple`（本適用時だけ候補を確保できない状態が**4回連続**。dry-run では毎回
  STRONG に到達するため、次回 `identity_promote` 実行で再挑戦する価値はある）／
  `heater_aqua_100w`（**SH55 も PT2752 も楽天の検索キーとして機能しないことが実測確定**。
  主クエリ「水中ヒーター 100W 亀 水槽」が汎用商品しか返さないため、
  **rakutenSearchTerm を商品名側へ寄せない限り自動救出は不可**）／
  `substrate_cypress`（PT2752 が使えないため型番ルートなし。別の識別手段がない限り救出不可）
- 楽天 △5件（basking_dual_150 / basking_hid_70w / food_aquatic_staple / food_tortoise_herbs /
  substrate_bottom_sand）は **Owner 非承認で search 維持が確定**。再提案しない。
- `ranking-beginner-top10.html` の 10位不整合（PR #115〜#117・#120）と guides の rel 未付与12本
  （PR #118）は**すべて解消済み**。9位（モンキヨコクビガメ）の species ページ不在だけが残るが、
  これは修正ではなく**新規コンテンツ制作**であり、CTA は species-list.html への一般導線として
  機能している（リンク切れではない）。**推測でデータを作らない**方針のため着手しない。
- **`scripts/gen_related_links.py` の乖離有無は未確認。** `--check` の出力
  （追加予定118 / 現状 species→guides 227・species→compare 15）から差分の有無を断定できなかった。
  **「差分なし」と書いてはならない。** 次に関連リンク工程を立てるときに、出力の意味から確認する。

### BLOCKED — 外部入力待ち。**受領したら即再開できる**

| ID | 不足しているもの | 受領後にすること |
|----|----------------|-----------------|
| **B1 GSC 成長分析** | Search Console → 検索パフォーマンス → エクスポート。**期間 直近3か月 / 検索タイプ ウェブ / フィルタなし**。①Pages.csv ②Queries.csv ③**ページ×クエリの組み合わせ**（最重要。ページタブでURL絞り込み→クエリタブでエクスポート、または Looker Studio で ディメンション=ページ+クエリ）。①②が別々だと紐付けできない | 成長候補TOP10を選定。優先度A=順位11〜20かつ表示上位／B=順位1〜10なのにCTRが期待値以下（title・meta の書換で伸びる）／C=3クエリ以上で表示が立ち始め。**species に限定せず guides / ranking / trouble / compare も同条件で評価**。<br>`shindan/index.html` の静的本文984字 / noscript なしの扱いもここで判断する（被リンク491本・159ページのサイト最大ハブだが、Google は JS を実行するため即時の順位影響は限定的） |
| **B10 GSC 5xx 未登録の対象URL** | Search Console の該当レポートに出ている**実URL一覧**（メール本文には URL が無く、**推測しない**）。加えて URL 検査ツールのライブテスト結果 | リポジトリ側の原因は7観点で除外済み（**判定C**）。本番へは egress ポリシーで到達できないため、**ローカル200を「本番5xxなし」の証拠にはしない／本番未確認で「現在5xxなし」と断定しない**。URL一覧を受領した時点で、そのURLだけを対象に再調査する |
| **B2 beginner TOP10 の2URL競合** | 同上（B1 の③で同時に解ける） | `guides/beginner-top10-turtles.html` と `ranking-beginner-top10.html` は title・h1・想定クエリが同型で両方とも自己 canonical。**構造上は黒に近いが GSC の実クエリを見るまで確定しない**。重複が実証されたら統合または canonical 集約 |
| **B3 H8「初心者」SEO運用 80行** | 同上 | `title` 6 / `meta`・OG 33 / JSON-LD 26 / 可視FAQ×JSON-LD 3 / 見出し 9 / パンくず 3。**トリガーが引いたページのみ・週最大3ページ。一斉置換は禁止。能動的に着手しない**。N10（`canton-reeves-turtle.html` の meta description 破損）もここに含む |
| **B9 species メイン写真の品質（12件）** | **種同定・商用可ライセンス・出典が確認できる代替写真**。本実行環境から iNaturalist / Commons へは到達できないため取得不可。**B4/B5/B7 の HOLD 4件とは別件**（それらは再探索しない） | 全107枚をコンタクトシートで目視した結果、以下がメイン写真として品質を落としている。差し替え候補が確認できた時点で 800×600 WebP 化し、クレジット4層（`credits_map.json` / `pc_parsed.json` / `photo-credits.html` / 種ページ figcaption）を同期する。<br>**最優先** `eastern-box-turtle`（手持ち＋背景に赤いピックアップトラックと人物）<br>**手持ち** `alabama-map-turtle` / `amazon-matamata` / `guerrero-wood-turtle` / `herrera-mud-turtle`（背景に車両）/ `loggerhead-musk-turtle` / `tunisian-greek-tortoise` / `spotted-turtle` / `stripe-necked-musk-turtle`<br>**被写体が判別しにくい** `chinese-stripe-necked-turtle`（濁った水中）/ `white-lipped-mud-turtle`（暗所）/ `ringed-map-turtle`（被写体が小さい）<br>**人工物が主役** `painted-turtle`（黄色い金網が画面を占める）<br>※**AIアップスケールによる「高解像度化」は禁止**。元画像が存在する場合のみ再書き出しする |
| **B4 写真HOLD 3件** | 亀好きさんが候補画像を見つけた時点。**能動的な定期探索は行わない**（`CLAUDE.md` 2026-08-24 恒久方針） | `Emydura subglobosa worrelli`（商用可3枚が全て同一個体の死骸）／`Malaclemys terrapin tequesta`（**入ればテラピン7亜種が完備＝掲載価値は最優先**）／`Graptemys nigrinoda delticola`（10枚全て CC-BY-NC。加えて Ennen et al. 2014 が形態的診断性を否定しており**亜種ページを作る価値から再判断が要る**） |
| **B5 オプストヒラセガメの生体写真** | **腹甲の放射状黒斑が写り、かつ産地が本亜種の分布域（トゥアティエン＝フエ〜ダクラク）と一致する**商用可・800×600以上の写真。両方そろわない限り亜種同定は成立しない | `species/obsti-hirase-turtle.html` は写真なしで公開済み。写真が入手できたら、ページの「写真を掲載していません」注記とFAQ「なぜ写真がないのですか？」を差し替え、クレジット4層を追加する。**旧候補 photo 134512961 は不採用で確定（再検討しない）** |
| **B6 カントンクサガメの CITES 区分** | CITES Species+ または EU規則 1332/2005 の確認（本実行環境は egress ポリシーで到達不可） | 現在 **附属書II** で全層統一済み。close した PR #35 は出典付きで **III** を主張しており、同日付の記録が食い違っている。**III が正しい場合に直すのは4箇所**（`species-master.json` の `cites.appendix.value` ／ `species-identification.json` の `houkisei` ／ `shindan/species.js` の `cites` ／ `SHINDAN-SPECIES.md` の CITES列）＋公開本文の「附属書II」3箇所 |
| **B7 ゴールデンギリシャリクガメの写真** | **良質な確定写真**（research grade × 商用可 × 800×600以上 × 自然な姿勢 × 種同定が証明できる）。**探索は打ち止め済**（FIXED_FACTS）。能動的に探しに行かない | 現候補は Owner 判断で不採用が確定。`species/golden-greek-tortoise.html` は写真なしのまま運用する |
| **B8 `ouachita-map-turtle-sp` の三名法/二名法** | **TTWG 第9版(2021)本文で *Graptemys ouachitensis sabinensis* の階級を確認できる資料**。本実行環境からは到達不可 | `data/species-identification.json:378` の HOLD を維持。**根拠が確定するまでどちらへも統一しない。** 解除する場合は identification だけでなく `species/ouachita-map-turtle-sp.html` の**4箇所**（meta description / og:description / JSON-LD description / `.latin`）も同時に直さないと不整合が増える（うち3箇所は SEO 層で B3 に触れる） |

### DROP — 今後やらない。**未解決リストから外す**

| 対象 | 理由 |
|------|------|
| **N23 `index.html` の孤立CSS 79ルール** | 価値ゼロに対し、JS が動的付与するクラスを誤削除する回帰リスクが実在。リスクがベネフィットを上回る |
| **N20 孤児キー（equipment 8 / CAT_OVERRIDE 3）** | 動作影響のない死にデータ。PR #90 の前から同数。触る利得がない |
| **テンプレ内のリンク切れ8件** | `_template-monetized.html` の `SLUG2/3/4.html` プレースホルダ等。**noindex・sitemap未掲載で公開画面に出ない**。テンプレとして正しい状態 |
| 旧 D1 / D2 / D3 / D4 / D5 / D6 / D7 / D8 / D9 | すべて CLOSE または BLOCKED へ着地済み |
| ~~N7~~ / ~~N24~~ / ~~N25~~ / ~~N26~~ / ~~N21~~ / ~~N27~~ / ~~N29~~ / 320px横スクロール / 旧H9 / 旧H3のobsti | 解消済み |

---

## NEXT — 次に実行する工程（**1つだけ**）

### CLAUDE.md 整理 PR-2 — ルール統合・リネーム・EVIDENCE GATE 追加

Owner 決定（2026-09-03）。PR-1 に続く整理の第2段。**3点をまとめて1PRで行う。**

1. **重複の統合** — 再調査4条件が CLAUDE.md「重複作業防止ゲート」・
   同「NO-REWORK GATE」・`.claude/rules/closeout-gate.md` の3箇所にほぼ同文で存在する。
   **CLAUDE.md の NO-REWORK GATE に一本化**し、他2箇所は参照に落とす。
   あわせて「引き継ぎ文書の役割」の表に `docs/AI-HANDOFF.md` が無い不整合を直す。
2. **リネーム** — `.claude/rules/chatgpt-handoff.md` → `.claude/rules/pm-handoff.md`。
   PM担当AIの交代が決まっているため、ChatGPT 名指しの記述を PM 非依存の表現に改める。
   CLAUDE.md 内の参照箇所も同時に修正する。
3. **EVIDENCE GATE の追加** — リネーム後の `pm-handoff.md` に §3-4 として追加する。
   実装側は raw URL と merge 後の実測 commit SHA を必ず添える。
   PM側は URL を開いてから VERIFIED / UNVERIFIED を明示し、
   開かずに「確認しました」と書かない。取り込み済みスナップショットを判定根拠にしない。

**ルールの内容判断はしない。** 既存ルールは追認済み（Owner 決定）であり、
統合・移動・表現の PM 非依存化のみを行う。ルールの新設・削除・意味変更をしない。

---

### （保留中）B1 — GSC 実測データの受領

> **B1 は 2026-08-30 に実測を試み、7経路すべてで取得不能を確認して STOP した（判定C）。**
> 加えて **要求された「直近3か月」の期間は存在しない**（データ収集開始は 2026-07-17）。
> 再取得を Claude 側で試行し直さない。**Owner が CSV をエクスポートして渡す**のが唯一の再開条件。
>
> **Species Scores の 119種拡張・6軸再設計は NEXT に置かない。** Phase 0 の判定Cのとおり、
> cost の価格根拠と「そもそも拡張する価値があるか」の Owner 判断が先に要る。

**デザイン工程は Phase 2 で CLOSE した。** CSSで解決できる視覚課題は残っていない。
再採点は **78 → 88/100**。90に届かない残り2点は、
**写真差し替え（B9）と写真の高解像度化**という素材待ちの項目に集約されている。
これらは AI 側の判断だけでは進められない。

次の一手は **B1（GSC 実測データの受領）**。B1 が解ければ B2 と B3 のトリガーも同時に決まる。
必要なものと受領後の処理は UNRESOLVED の B1 に固定済み。

**GSC が用意できない場合の代替工程は置かない。**
`docs/operations/DECISION_RULE.md`（実測がトリガーを引いたページのみ・週最大3ページ）に反するため。

---

## 更新ルール（作業終了時に必ず実施）

Claude Code は各作業の完了後、**同じPRの中で**本ファイルを更新する。

1. **CURRENT_BASE** — 基準・**サイトファイルの状態**・最終更新日を書き換える。
   merge commit は本ファイルを書く時点では確定しないため、**直前に merge 済みの commit を書く**
   （自分の merge commit は書けない。表が tip と1 commit ずれるのは正常）。
   **`docs/AI-HANDOFF.md` だけを変える同期PRでは「サイトファイルの状態」の行を動かさない。**
   次に作業する側は `git log --oneline -1 origin/main` で実測し、
   差が本ファイルだけなら BASE のズレとして扱わない
2. **COMPLETED** — 完了した NEXT を移す。PR番号・merge commit・**確定した結論**を必ず書く
3. **FIXED_FACTS** — 新たに確定し、今後は入力として使う事実を追記する
4. **UNRESOLVED** — 本当に未解決のものだけ残す。判断待ち / HOLD / 新発見 を区別する。
   解決したものは削除する
5. **NEXT** — 次の工程を**1つだけ**設定する。対象 / Scope / 変更禁止 / 完了条件を書く。
   複数工程の詰め合わせにしない
6. **古くなった状態記述を残さない。** 本ファイルは履歴ではなく現在状態。
   経緯は `AI_CHANGELOG.md` に、恒久ルールは `CLAUDE.md` に置く

**禁止事項**

- COMPLETED と NEXT に同じ作業を同時に置かない
- FIXED_FACTS に書いた事項を NEXT で再調査させる構造にしない
- 「たぶん終わっている」ものを COMPLETED に書かない。PR番号か merge commit で裏付ける
