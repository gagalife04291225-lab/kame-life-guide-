# Mina Visual Reference Manifest

## Canonical identity

- `mina-master.png` — single source of truth for Mina identity.
- **This is the sole active master/reference.** No secondary reference is active.

現行の MASTER は **product-free presenter master**（商品・device・packaging・logo を一切持たない）であり、
商品の有無を問わずすべての生成の人物基準として使う。

## Retired references

- `mina-product-hold-reference.jpg` — **RETIRED（2026-09-18・Owner 決定）**。
  商品を手に持った旧 master / 副参照は、**active generation から外す**。
  過去の成果物を説明するための履歴・evidence としてのみ残し、新規生成の参照に使わない。
  なお実測上、このファイルは本ブランチのリポジトリ内に実体として存在しない。

## Generation bootstrap

When generating Mina in a new session:

1. Read `brand/mina-fixed-rules.md` and `brand/mina-image-rules.md` from latest `main`.
2. Use `brand/assets/mina/mina-master.png` as the identity reference.
3. **商品を持たせる場合も、この product-free master を人物基準にする。** 商品保持の副参照は使わない。
4. Keep the MASTER face, age impression, monolid eyes, natural skin, dark hair, and non-AI-beauty appearance.
5. MASTER は人物同一性のための参照であり、同じ顔角度・同じ構図をコピーするためのものではない。
6. If the current image-generation interface cannot ingest GitHub binary images as visual references, do not silently regenerate from text. Report the limitation instead of producing a different Mina.
