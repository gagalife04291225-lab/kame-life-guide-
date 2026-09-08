# 水質検査薬 2 件 — 測定項目・対応水・亀飼育での位置づけ（2026-09-08 監査・P1）

> Amazon identity は 2026-09-08 に `/dp/<ASIN>` を URL 照合済み（固定入力・再検索なし）。
> メーカー公式（spectrumbrands.jp）は egress 遮断のため、仕様は公式ページの検索抜粋と販売店（charm / rva / yodobashi / joyfulhonda / askul）転載値で確認した。

## 1. 役割分離（混同しない）

| 商品 | 役割 | 測れるもの | 測れないもの |
|---|---|---|---|
| テトラ テスト試験紙 NH3/NH4+（アンモニア）25回 | **アンモニア確認** | 総アンモニア（NH3＋NH4+） | NO2 / NO3 / pH / GH / KH / Cl2 |
| テトラ テスト 6in1 試験紙（淡水用）25枚 | **日常的な複数項目の監視** | pH・KH・GH・NO2・NO3・Cl2 | **アンモニア** |

- 6in1 をアンモニア検査の代用にしない。「6 項目測れるから水質は全部 OK」とは書かない。
- 総アンモニア値の毒性は pH・水温で変わる（pH が高く水温が高いほど NH3 の割合が増える）。数値は pH・水温と合わせて読む。
- 「亀は ○ mg/L まで安全」「魚用基準をそのまま亀へ転用」は禁止。メーカーの「0.25 mg/L 以上で魚などの生物に有害」は**魚を対象にした一般値**として扱い、亀の閾値としては示さない。

## 2. 商品ごとの確定事項

### テトラ テスト試験紙 NH3/NH4+（B0GN1MFFPD）

| 項目 | 確認結果 | 状態 |
|---|---|---|
| 測定対象 | 総アンモニア（NH3/NH4+）。NH3 単独ではない | MEASUREMENT_ITEMS（項目）VERIFIED |
| 測定範囲・単位 | 公式ページが egress 遮断・販売店抜粋にも段階値なし | **PARTIAL**（未取得） |
| 方式 | 試験紙＋付属アクティベーター・シリンジ・検査チューブ。1 秒浸漬・1 分後比色 | VERIFIED |
| 回数 | 25 回 | VERIFIED |
| 淡水 | 公式・販売店とも対応 | VERIFIED |
| 海水 | 公式ページ名は「淡水・海水用」、charm / yodobashi / rva / joyfulhonda / ugpet は「淡水用」表記で**不一致** | PARTIAL |
| 汽水 | どの資料にも記載なし | UNVERIFIED |
| pH・水温の注意 | メーカー説明に「NH3 か NH4+ かは pH で決まる」旨あり | VERIFIED |
| **compatibility** | **COMPATIBILITY_PARTIAL**（淡水以外と測定範囲が未確定）→ `linkHold: true`・導線に出さない | — |
| useCase | USE_CASE_VERIFIED（アンモニア確認） | — |

### テトラ テスト 6in1 試験紙（淡水用）（B002FBISEC）

| 項目 | 確認結果 | 状態 |
|---|---|---|
| 測定項目・範囲 | pH 6.4〜8.4／KH 0〜20°dH／GH <3〜>16°dH／NO2 0〜10 mg/L／NO3 0〜250 mg/L／Cl2 0〜3 mg/L（公式抜粋） | MEASUREMENT_ITEMS_VERIFIED |
| 方式・判定 | 試験紙 1 秒浸漬・60 秒後比色。25 枚（5 枚版も別 SKU） | VERIFIED |
| 淡水 | 公式・販売店とも「淡水用」で一致 | VERIFIED |
| 海水 | 製品区分外（淡水用） | NOT_SUPPORTED |
| 汽水 | 記載なし | UNVERIFIED |
| Cl2 | 0〜3 mg/L。水道水の残留塩素確認に使える可能性はあるが**検出下限が未確認** | PARTIAL（用途） |
| **compatibility** | **COMPATIBILITY_VERIFIED**（淡水用という製品区分の範囲で）。ただし導線は今回出さない（`linkHold: true`・Owner 判断） | — |
| useCase | USE_CASE_VERIFIED（NO2/NO3 で生物ろ過と換水時期、pH/GH/KH は補助指標） | — |

## 3. 亀飼育での使いどころ（記事用の骨子）

- **アンモニア**: 立ち上げ初期／フィルター交換後／大量給餌後／水が臭う／白濁／排泄量が多い／ろ過能力不足の疑い
- **NO2 / NO3**: 生物ろ過の状態、換水時期、慢性的な汚れの蓄積
- **pH / GH / KH**: 種・飼育水・汽水条件に応じた補助指標
- **Cl2**: 水道水使用時の残留塩素の目安（検出下限が未確認のため断定しない）

## 4. 導線候補（今回は未設置・Owner 判断）

| ページ | 既存の記述 | 候補 |
|---|---|---|
| `species/giant-musk-turtle.html`（L154 JSON-LD / L457 FAQ） | 「…アンモニア試薬でこまめにチェック」 | NH3/NH4+ 試験紙（PARTIAL 解消後） |
| `species/florida-mud-turtle.html`（L270） | 「水質チェック」 | 6in1（淡水） |
| `guides/filter-guide.html` L523 | 「生物ろ過の立ち上げ」 | NH3/NH4+ ＋ 6in1（立ち上げ期の説明に添える） |
| `water-filter-best10.html` L682 | 「カメは魚よりも大量にアンモニアを排出」 | NH3/NH4+ |
| `guide-water-full.html` / `guide-semi.html` | 水換え・ろ過の節 | 6in1 |
| `guide-brackish.html` | 汽水管理の節 | **保留**（汽水対応が両商品とも UNVERIFIED） |

導線は「実際に水質検査が必要と書いているページ」優先。全 species への一斉配線はしない。

## 5. 欠落の確認（追加探索はしない）

| 項目 | 既存 2 商品でのカバー | 判定 |
|---|---|---|
| アンモニア（淡水） | NH3/NH4+ 試験紙（測定範囲未確認） | 機能的にカバー。PARTIAL 解消待ち |
| アンモニア（汽水・テラピン） | 両商品とも汽水は記載なし | **P1_MISSING_WATER_TEST**（汽水対応のアンモニア検査。液体試薬「テトラ テスト アンモニア試薬（淡水・海水用）」が存在するが、汽水の明記と ASIN は未確認・今回は探索しない） |
| 亜硝酸・硝酸塩（淡水） | 6in1 | NO ADD |
| pH / GH / KH（淡水） | 6in1 | NO ADD |
| 残留塩素 | 6in1 の Cl2（検出下限未確認） | NO ADD（PARTIAL のまま） |
