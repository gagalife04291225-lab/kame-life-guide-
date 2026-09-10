# Mina Visual Reference Manifest

## Canonical identity
- `mina-master.png` — single source of truth for Mina identity.

## Approved secondary reference
- `mina-product-hold-reference.jpg` — approved reference for product-holding pose, framing, natural presentation, wardrobe/exposure balance, and overall visual continuity.
- This secondary reference must never override `mina-master.png` for identity.

## Generation bootstrap
When generating Mina in a new session:
1. Read `brand/mina-fixed-rules.md` and `brand/mina-image-rules.md` from latest `main`.
2. Use `brand/assets/mina/mina-master.png` as the identity reference.
3. For product-holding shots, also use `brand/assets/mina/mina-product-hold-reference.jpg` as a secondary composition/pose reference.
4. Keep the MASTER face, age impression, monolid eyes, natural skin, dark hair, and non-AI-beauty appearance.
5. Secondary references may guide pose/framing only; they do not redefine Mina's identity.
6. If the current image-generation interface cannot ingest GitHub binary images as visual references, do not silently regenerate from text. Report the limitation instead of producing a different Mina.
