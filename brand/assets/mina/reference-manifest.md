# Mina Visual Reference Manifest

## Canonical identity

- `mina-master.png` — single source of truth for Mina identity.
- **This is the sole active master/reference.** No secondary reference is active.

現行の MASTER は **product-free presenter master**（商品・device・packaging・logo を一切持たない）であり、
商品の有無を問わずすべての生成の人物基準として使う。

## 商品を持った旧画像は現行資産ではない（2026-09-18・Owner 決定）

商品（device / packaging / logo を含む）を手に持った旧 master および商品保持用の副参照は、
**現行資産として保持しない。**

- 別名コピー・副参照・active evidence・workflow 参照・prompt 参照のいずれとしても残さない。
- 差し替え前の commit が git 履歴に存在するのは通常の git の性質にすぎず、
  **資産として保持・再利用する意味を持たない。**
- 実測（本ブランチ）: `brand/assets/mina/` の画像は `mina-master.png` の1枚のみ。
  商品保持参照の payload（`.b64` / placeholder `.txt`）と、それを画像として実体化し
  生成時の補助参照としてルール本文へ追記する bootstrap workflow は、**本PRで削除した**
  （実行された形跡はなく、ルール本文への追記も発生していないことを実測済み）。

## Generation bootstrap

When generating Mina in a new session:

1. Read `brand/mina-fixed-rules.md` and `brand/mina-image-rules.md` from latest `main`.
2. Use `brand/assets/mina/mina-master.png` as the identity reference.
3. **商品を持たせる場合も、この product-free master を人物基準にする。** 商品保持の副参照は使わない。
4. Keep the MASTER face, age impression, monolid eyes, natural skin, dark hair, and non-AI-beauty appearance.
5. MASTER は人物同一性のための参照であり、同じ顔角度・同じ構図をコピーするためのものではない。
6. If the current image-generation interface cannot ingest GitHub binary images as visual references, do not silently regenerate from text. Report the limitation instead of producing a different Mina.
