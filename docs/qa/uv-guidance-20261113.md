# UVB guidance QA — 2026-11-13
Base: ee222b930a4b9bcc118249c9276999a5fa7689ef

## Sources and limits
- Zoo Med lighting-uvb-education-additional-information/ and lighting-uvb-education-what-is-uvb/: direct full text; distance/reflector/mesh, UV gradient, retreat, UVI meter, glass/plastic blocking and overheating.
- VCA turtles-aquatic-housing: retrieved search content; supervised outdoor exposure, shade, manufacturer guidance. Aquatic turtle scope, not a universal numerical prescription.
- RVC musk turtle 2024 care PDF: direct request 403, indexed content only. Not used as an added visible citation.
- Color card model sensitivity/calibration not verified. No false claim that a color change proves sufficient UVB. No assertion that it detects only UVA.

## Validation
- Python unittest discover tools test_*.py: 125 PASS (PYTHONUTF8=1 and existing QA tzdata dependency). Initial Windows encoding/tzdata failures were environment problems; corrected run passed.
- Five focused UV guidance tests PASS: forbidden claims, conditions, unchanged head/scripts, ASIN+existing href invariance, IDs/markup/JSON-LD.
- Old base fails both safety-content tests (2 failures, 0 errors).
- git diff --check PASS.
- Local Chrome via Playwright: 320/390/1280 widths, no overflow or JS errors, source details opens; Amazon buttons 16. Screenshot at390 visually inspected: readable/no clipping.
- External requests blocked in local UI test to avoid GA traffic. Rakuten links were not rendered in this isolated check (0); no claim of live retail destination verification. Scripts and existing links unchanged by hashes/list comparison.
- Independent husbandry reviewer: initial safety direction appropriate; flagged LED contact/juvenile blanket recommendation and UVB200 equivalence/fixed distance. All removed in follow-up.

## Scope
No head, scripts, ASIN, image, product ordering, affiliate settings changed. Product identity/ASIN pairing audit belongs to the separate commerce task. No production verification before merge. This is not a veterinary review or an all-products performance certification.

PR: #242 (Draft, not merged).

- 公開実測: PR #242 merge 183ffb5587f1e23e1b4ecb65e4b1237dcdd1ed83、Pages run43356117469 success。本番HTTP200、Chrome320/390/1280で横はみ出し/JSエラー0・出典開閉OK。実測者: UVB担当。https://github.com/gagalife04291225-lab/kame-life-guide-/pull/242#issuecomment-6842531365
