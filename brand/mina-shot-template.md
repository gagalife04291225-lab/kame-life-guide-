# Mina SHOT PLAN Template

> **商品・投稿ごとに使い回すひな型。**
> ここには**ひな型と埋め方だけ**を置く。特定商品のCUT・寸法・台本・URL は書かない。
> 埋めた SHOT PLAN は各商品案件側（`qc-evidence/<案件>/` 等）に保存する。
>
> 人物IDの正本は [`mina-fixed-rules.md`](./mina-fixed-rules.md)。
> モジュール・カメラ・視線・CONTENT MODE の定義は [`mina-image-rules.md`](./mina-image-rules.md)。**ここへ複製しない。**

## 使い方

1. `MINA_MASTER` の正本を確認する（[`mina-fixed-rules.md`](./mina-fixed-rules.md) §2）。未配置なら SHOT PLAN は作れても生成へは進まない。
2. 今回の CONTENT MODE の並びを決める（[`mina-image-rules.md`](./mina-image-rules.md) CONTENT MODE）。
3. 投稿単位で固定するモジュールを決める — SCENE / WARDROBE / HAIR。
4. 下の表を CUT 数だけ埋める。
5. 「検証」の4項目を表の上で確認する。1つでも通らなければ生成に進まない。
6. 埋めた表を案件フォルダへ保存する。**このファイルには書き戻さない。**

## 投稿ヘッダ（表の前に置く）

```
案件:            <案件ID>
MASTER IMAGE PATH: brand/assets/mina/mina-master.png
MASTER VERSION:    <確認した正本のファイル名 / 更新日。未配置なら「未配置」と書く>
用途 / 媒体:      <TikTok / Reels / Shorts / フィード / サムネイル / プロフィール>
出力比率:         <9:16 / 1:1 / 4:5 / 16:9>
CONTENT MODE 並び: <例: PRODUCT_HOOK → PRODUCT_DEMO → RESULT → CTA>
SCENE（投稿内で固定）:    <モジュールから1つ>
WARDROBE（投稿内で固定）: <モジュールから1つ>
HAIR（投稿内で固定）:     <モジュールから1つ>
PRODUCT SCALE の前提:     <実寸確認済み / 未確認（粗い前提とその内容）>
```

## 必須テーブル

| CUT | PURPOSE | FACE ANGLE | GAZE TARGET | CAMERA | DISTANCE | PRODUCT POSITION | ACTION | BACKGROUND | SUBJECT |
|-----|---------|-----------|-------------|--------|----------|------------------|--------|------------|---------|
| 1 | | | | | | | | | |
| 2 | | | | | | | | | |
| 3 | | | | | | | | | |

各列の入力元:

| 列 | 入れるもの |
|----|-----------|
| PURPOSE | CONTENT MODE 名 |
| FACE ANGLE | CAMERA SYSTEM の顔向き母集合から |
| GAZE TARGET | GAZE / ACTION SYSTEM の対応表から。**「カメラ」は商品紹介・CTA のみ** |
| CAMERA | CAMERA SYSTEM の位置母集合から |
| DISTANCE | CAMERA SYSTEM の距離母集合から |
| PRODUCT POSITION | 画面内の商品位置（例: 手元中央 / 右下 / 卓上 / 画面外） |
| ACTION | PRODUCT INTERACTION の母集合から。商品の実際の使い方に合わせる |
| BACKGROUND | SCENE。投稿内では原則固定し、動く場合は同一空間内の移動に留める |
| SUBJECT | 顔 / 商品 / 手元 |

## 任意列（必要な案件だけ追加する）

| 列 | 用途 |
|----|------|
| `continuity` | そのCUTで前CUTから引き継ぐもの（服・髪・商品個体・照明） |
| `product scale` | 手・顔に対する商品の見え方の目安 |
| `hand interaction` | 左右どちらの手・接触位置・握り方 |
| `expression` | EXPRESSION モジュールから |
| `motion` | 動画の場合の動きの方向と速度 |
| `evidence requirement` | そのCUTで映像として証明すべき事実。証明できなければ不採用 |

`evidence requirement` を書いたCUTは、**実際にその事実が起きた素材だけを使う。**
起きなかった場合に演出・編集で成功したように見せない。

## 検証（生成前に表の上で確認する）

1. **顔向きが3種類以上に分散しているか。**
2. **隣接するCUTで、顔向き・カメラ距離・カメラ位置・主役・ポーズ・視線のうち最低2つが変わっているか。**
3. **GAZE TARGET が「カメラ」になっているCUTが、`PRODUCT_HOOK` / `CTA` / `PROFILE` / `THUMBNAIL` に限られているか。**
4. **動画の場合、SCENE・WARDROBE・HAIR・商品個体・基本照明が全CUTで一貫しているか。**

1つでも通らなければ表を直す。生成してからQCで拾わない。

## 記入例（形式を示すためのダミー。実案件のデータではない）

```
案件:            SAMPLE-000
MASTER IMAGE PATH: brand/assets/mina/mina-master.png
MASTER VERSION:    mina-master.png / 2026-09-10
用途 / 媒体:      TikTok
出力比率:         9:16
CONTENT MODE 並び: PRODUCT_HOOK → PRODUCT_DEMO → RESULT → CTA
SCENE:            デスク
WARDROBE:         シンプルTシャツ
HAIR:             低いポニーテール
PRODUCT SCALE:    未確認（片手で扱えるサイズとして扱う）
```

| CUT | PURPOSE | FACE ANGLE | GAZE TARGET | CAMERA | DISTANCE | PRODUCT POSITION | ACTION | BACKGROUND | SUBJECT |
|-----|---------|-----------|-------------|--------|----------|------------------|--------|------------|---------|
| 1 | PRODUCT_HOOK | 正面 | カメラ | 正面 | バストアップ | 胸元やや右 | 持つ | デスク | 顔＋商品 |
| 2 | PRODUCT_DEMO | 顔なし手元 | 操作点 | 俯瞰 | 手元 | 手元中央 | 押す | デスク | 手元 |
| 3 | RESULT | 左3/4 | 結果 | 左 | 上半身 | 卓上右 | 実演結果を見る | デスク | 商品 |
| 4 | CTA | 右3/4 | カメラ | 斜め | 腰上 | 手元左 | 持つ | デスク | 顔＋商品 |

この例は検証4項目を満たす: 顔向き4種類 / 隣接CUTで毎回2要素以上変化 / カメラ目線は CUT1・CUT4 のみ / SCENE・WARDROBE・HAIR が全CUTで一貫。
