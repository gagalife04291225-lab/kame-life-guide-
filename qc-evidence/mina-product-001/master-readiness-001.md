# MINA_MASTER 受入検証 — mina-product-001

案件側の検証記録。`brand/` のルール本文は変更していない。

- 最終検証日: 2026-09-10
- 対象: `brand/assets/mina/mina-master.png`
- 修復 PR: **#172**（merge commit `657dc615936cf33f454f711f4d1ca43fe0d8eea4`）
- 基準 main: `657dc61`
- 案件branch: `claude/mina-product-selection-dhfz0i`

## 判定

**PASS — 画像生成を開始できる。**

正本は canonical path に実在し、PNG として完全に復号でき、実際にミナが写っている。
`brand/mina-fixed-rules.md` §2 の人物ID参照として機能する。

## 現行正本の実測値

| 項目 | 実測結果 | 判定 |
|------|---------|------|
| パス | `brand/assets/mina/mina-master.png` | 実在 |
| git blob SHA | `fa9bb85ba10b8bc4be19d2a070840c064f64ffbb` | — |
| 内容 SHA-256 | `763ba75f0259ce71c9a53f2493a80d1fcecec0d9172862fac204698fcda30dd4` | — |
| サイズ | 1,253,769 bytes | — |
| 実体形式 | **PNG**（署名一致 / 8-bit RGB / non-interlaced） | PASS |
| 画像サイズ | **864 × 1536**（9:16） | PASS |
| デコードエラー | **0**（警告をエラー化した状態で `load()` 完走） | PASS |
| チャンク列 | `IHDR / iCCP / IDAT×21 / IEND` — **IEND まで正常** | PASS |
| 内容 | 縦10帯の平均色が10種すべて異なる（`(190,168,148)` 〜 `(233,213,203)`）。均一グレーではなく実際にミナが写っている | PASS |
| main blob と作業ツリーの一致 | main blob の SHA-256 と Owner 提供ファイルの SHA-256 が完全一致 | PASS |
| `brand/assets/mina/` の MASTER 画像枚数 | **1枚のみ**（他は `README.md` / `reference-manifest.md`） | PASS |
| 旧破損 blob の参照 | canonical path は新 blob を指す。旧 `0989576d…` は参照しない | PASS |

## 必須8項目の再実測（2026-09-10・Owner 指示による確認）

Owner から「main の同名ファイルは破損済みなので置換せよ」との指示を受けたが、
**実測したところ破損は PR #172 で既に解消しており、main の正本は Owner 承認画像そのものだった。**
置換すべき破損ファイルは存在しない。以下は指定された8項目を独立に測り直した結果である。

| # | 検証項目 | 実測方法 | 実測結果 | 判定 |
|---|---------|---------|---------|------|
| 1 | 実体形式 = PNG | 先頭8バイトを直接読む | `89 50 4E 47 0D 0A 1A 0A` — PNG 署名と完全一致 | **PASS** |
| 2 | デコード成功 | Pillow で `load()` まで完走 | 例外なし。`format=PNG / mode=RGB / size=(864,1536)` | **PASS** |
| 3 | PNG IEND あり | 末尾12バイトを直接読む | `00 00 00 00 49 45 4E 44 AE 42 60 82` — `IEND` ＋ CRC で正常終端 | **PASS** |
| 4 | 均一グレーではない | 24点サンプル＋全画素の標準偏差 | ユニーク色 **24/24**。RGB(128,128,128) は **0個**。標準偏差 R/G/B = **50.57 / 54.18 / 57.46** | **PASS** |
| 5 | 実際にミナ本人が写っている | 画像を開いて目視 | ベージュのニット・低い位置でまとめた暗髪・白い小型シーラーを右手に持つ女性。室内。FIXED CORE と一致 | **PASS** |
| 6 | canonical path に MASTER は1枚だけ | `ls` ＋ repo 全体を `find -iname '*mina*master*'` | ヒットは `brand/assets/mina/mina-master.png` の **1件のみ**。同ディレクトリの他2件は `README.md` / `reference-manifest.md` | **PASS** |
| 7 | Git blob と作業ツリーの SHA 一致 | `git hash-object` と `git ls-tree` を突き合わせ | 両方 `fa9bb85ba10b8bc4be19d2a070840c064f64ffbb`。内容 SHA-256 `763ba75f…a30dd4` も main の blob と一致 | **PASS** |
| 8 | 旧破損 blob を参照していない | `grep -rn "0989576" --exclude-dir=.git .` | **参照ゼロ**。旧 blob `0989576d…` は履歴（`5ec4ac9`）にのみ残り、現行ツリーのどこからも指されていない | **PASS** |

**8項目すべて PASS。** 判定は FAIL ではなく、最初から PASS の状態を再確認したものである。

### PNG 再エンコードは実施しない（理由）

指示には「可能なら PNG として正常に再エンコードして保存する」とあったが、**実施しなかった。**

- 正本は既に**正常な PNG** であり（項目1・2・3）、再エンコードで直る欠陥が存在しない。
- 再エンコードすると blob SHA と SHA-256 が変わる。`shot-plan-001.md` を含む下流の記録が
  すべて現在の SHA を指しているため、**利得ゼロで参照整合だけを壊す。**
- `mina-fixed-rules.md` §2.2 は「正本を差し替えるのは Owner が明示的に更新を指示したときだけ」と定める。
  ここでの差し替えは**破損の修復ではなく無意味なバイト変更**にあたる。

**Owner 承認画像をそのまま正本として維持している。** 別画像の生成も行っていない。

## 修復前の状態（記録として残す・SUPERSEDED）

| 項目 | 旧値 |
|------|------|
| blob SHA | `0989576d49ebc2df2b4dfbbcee9ce4540d24e463` |
| サイズ | 15,009 bytes |
| 実体形式 | JPEG（拡張子は `.png`） |
| 末尾 | `ff` のみ。EOI（`ff d9`）なし＝途中終端 |
| デコード | `OSError: broken data stream when reading image file` |
| 部分デコード | 全10帯が RGB(128,128,128) の均一グレー。人物を含まない |

破損は checkout 側ではなく main の blob 自体にあった（`.gitattributes` なし / `core.autocrlf` 未設定 /
blob と作業ツリーの SHA-256 完全一致 / LFS ポインタでもない）。
**この調査は完了済み。再調査しない。**

## 補助参照

`brand/assets/mina/reference-manifest.md` が挙げる `mina-product-hold-reference.jpg` は
**`NOT_FOUND_EXACT_MATCH`**（git 管理下に存在しない）。

`git ls-files brand/assets/mina/` の結果は `README.md` / `mina-master.png` /
`reference-manifest.md` の3件のみ。

指示のとおり、この不在は画像生成の BLOCKER として扱わない。
商品持ちカットの構図・ポーズ参照が必要な場合は、正本と SHOT PLAN の記述で代替する。

## Owner 判断待ちの記録（BLOCKER ではない）

正本は今後すべての生成の参照元になるため、次の2点を記録に残す。
**本作業ではルール本文も正本も変更していない。**

1. **目元** — `mina-fixed-rules.md` §3 は FIXED CORE に「一重」と定めているが、正本の目元は
   写真上では奥二重〜二重寄りにも見える。生成後QC は毎回「一重が維持されているか」を照合するため、
   正本と文言が食い違うと判定がぶれる。文言を正本に合わせるか、正本を差し替えるかは Owner 判断。
2. **ネックライン** — `mina-image-rules.md` の WARDROBE は「不自然な露出に依存した構図」を禁止している。
   正本の V ネックは胸元の開きがやや大きく、正本を参照した派生が同傾向へ寄る可能性がある。
   SHOT PLAN の WARDROBE は「シンプルTシャツ（白〜ベージュ系）」を指定しており、
   生成時はそちらが優先される。

## 案件側の準備状況（すべて PASS）

| 項目 | 状態 |
|------|------|
| MINA_MASTER | **PASS**（本ファイル上部） |
| 商品確定 | `selected-product.json` / `evidence.md` |
| 仕様・操作確定 | `product-spec-001.md`（125×40×63mm / 175g / 密封口 最大95mm / 差し込む→押す→離す） |
| 台本確定 | `script-001.md`（9.0秒 / 5カット / 字幕 / ナレーション / CTA / 撮影GATE） |
| SHOT PLAN 確定 | `shot-plan-001.md`（5カット / 顔向き5種 / 距離5種 / カメラ目線は CUT5 のみ） |
| brand ルール | main `657dc61` と全ファイル一致 |

**画像生成のブロッカーは解消した。** 次工程は CUT1〜CUT5 の画像生成。

---

## 次工程で使う I2V 安全域（2026-09-10 Owner 確定・実測由来）

MASTER 復旧が PASS したため、**第1号の動画生成 BLOCKER は解除**。
動画化する場合は、実測で確定した次の安全域を運用値として使う。

| 区間 | 扱い |
|------|------|
| **0 〜 1.6 秒** | production 推奨。そのまま使う |
| **1.7 〜 1.9 秒** | 要目視QC。商品と手が保持されているか全フレーム確認してから使う |
| **2.0 秒以降** | **使用禁止。** 商品が溶けて消失し、手が崩壊する |

**限界を延ばすテスト・別ツールの再探索は行わない。** この安全域は固定入力とする。
