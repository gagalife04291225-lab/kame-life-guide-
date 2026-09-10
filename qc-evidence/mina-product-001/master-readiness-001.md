# MINA_MASTER 受入検証 — mina-product-001

案件側の検証記録。`brand/` のルール本文は変更していない。

- 検証日: 2026-09-10
- 対象: `brand/assets/mina/mina-master.png`
- 基準 main: `5ec4ac9fb0bbbf45903f1d202478c814b912497b`
- 案件branch: `claude/mina-product-selection-dhfz0i`

## 判定

**FAIL — 画像生成を開始できない。**

ファイルは canonical path に**実在する**が、**画像として復号できない**。
`brand/mina-fixed-rules.md` §2.2 の「正本が存在しない状態では、人物固定が必要な生成を進めない」と
同じ扱いとする（存在するが人物参照として機能しないため）。

## 実測値

| 項目 | 実測結果 |
|------|---------|
| パス | `brand/assets/mina/mina-master.png` — 実在 |
| git blob SHA | `0989576d49ebc2df2b4dfbbcee9ce4540d24e463` |
| 内容 SHA-256 | `7ba9e819ab6f458462c089dbf3ea838626579d9013ec3a4b69e23645a9500754` |
| サイズ | 15,009 bytes |
| 実際の形式 | **JPEG**（JFIF 1.01）。拡張子は `.png` だが中身は PNG ではない |
| ヘッダ上の寸法 | 1536 × 1536 |
| 先頭4バイト | `ff d8 ff e0`（JPEG SOI — 正常） |
| 末尾バイト | `ff`（**EOI `ff d9` が無い＝データが途中で終わっている**） |
| JPEG マーカー列 | APP0, APP2, DQT×2, SOF0, DHT×4, SOS —  ヘッダは揃っているが SOS 以降のデータが不足 |
| デコード結果 | `OSError: broken data stream when reading image file` |
| 部分デコード時の画素 | 画像を縦10帯に分けて平均色を測定 → **全帯が RGB(128,128,128) の均一グレー**。人物は1ピクセルも含まれていない |

## 破損箇所の切り分け（checkout 側ではなく repo 側）

| 確認 | 結果 |
|------|------|
| `.gitattributes` | 存在しない（テキスト変換なし） |
| `core.autocrlf` | 未設定 |
| `git check-attr -a` | 属性なし |
| blob サイズ vs 作業ツリー | 15,009 = 15,009（一致） |
| blob SHA-256 vs 作業ツリー | 完全一致 |
| Git LFS ポインタか | 否（実バイナリ。ICC_PROFILE を含む） |
| `origin/main` の blob を直読み | 末尾が `ff`。EOI なし |

→ **checkout やマージによる破損ではなく、main にコミットされている blob そのものが途中で切れている。**
アップロードが完了しないままコミットされた可能性が高い。

参考: 同 repo 内の正常な画像は
`images/hero/eastern-box-turtle-hero.jpg` = 102,058 bytes、
`assets/species-photos/russian-tortoise.webp` = 119,832 bytes。
1536×1536 のベースライン JPEG が 15,009 bytes というサイズ自体、内容が欠けていることと整合する。

## 補助参照

`brand/assets/mina/reference-manifest.md` が挙げる
`mina-product-hold-reference.jpg` は **`NOT_FOUND_EXACT_MATCH`**（git 管理下に存在しない）。

`git ls-files brand/assets/mina/` の結果は次の3件のみ:
`README.md` / `mina-master.png` / `reference-manifest.md`

指示のとおり、補助参照の不在は画像生成の BLOCKER として扱わない。
ただし本件では **MASTER 自体が復号不能**であるため、生成は別の理由で開始できない。

## 再開条件

次のどちらかが満たされれば、この案件は即座に画像生成へ進める。

1. **`brand/assets/mina/mina-master.png` を完全なファイルで再アップロードする。**
   - 完了判定: `od` で末尾が `ff d9`（JPEG）または PNG の `IEND` で終わること、かつデコード時に
     `broken data stream` が出ず、均一グレーでないこと。
   - 中身が JPEG のままでよいなら、拡張子と実体を一致させるか（`.jpg` へ変更してルール側の
     canonical path も併せて更新）、PNG として再エンコードして `.png` で置くか、Owner が決める。
     **本作業では canonical path も brand ルールも変更していない。**
2. Owner が別の承認済み正本を canonical path へ配置する。

**やっていないこと**: 破損ファイルの代用、別画像での差し替え、AI による新規ミナ画像の生成。
いずれも禁止事項に該当するため実施していない。

## 案件側の他の準備状況（すべて PASS）

| 項目 | 状態 |
|------|------|
| 商品確定 | `selected-product.json` / `evidence.md` |
| 仕様・操作確定 | `product-spec-001.md`（125×40×63mm / 175g / 密封口 最大95mm / 差し込む→押す→離す） |
| 台本確定 | `script-001.md`（9.0秒 / 5カット / 字幕 / ナレーション / CTA / 撮影GATE） |
| SHOT PLAN 確定 | `shot-plan-001.md`（5カット / 顔向き5種 / 距離5種 / カメラ目線は CUT5 のみ） |
| brand ルール | main `5ec4ac9` と全ファイル一致 |

**MASTER 実画像1点を除き、画像生成の準備は完了している。**
