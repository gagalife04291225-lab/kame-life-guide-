# ケージ比較記事の根拠是正（2026-11-12）

## Scope / evidence
- Owner confirmed the claim of purchasing/using five cages was not true. Removed firsthand claim, visible score 4.8, Product/Review schema attributed to site author, unsupported ranks and superiority claims. Amazon origin of 4.8 is unconfirmed: ASIN B00BF91SQK retrieval failed, search did not establish score/count/date. No Amazon score is substituted.
- WH6045 official: https://www.sanko-wild.com/e03/ external 60.5×45.5×45cm, internal approx 59×44×42cm. Site species guides specify Russian 90cm-class and Hermann120cm-class. Removed 60cm lifetime-adult advice; no new universal minimum invented.
- DC600 official: https://product.gex-fp.co.jp/fish/index.php?cid=341&id=1877&m=ProductListDetail is an upper filter for 60cm aquarium, not an aquarium set. Aquarium not included.
- GEX6030 official: https://product.gex-fp.co.jp/exoterra/index.php?cid=395&id=935&m=ProductListDetail external61.5×46.5×33cm, front doors and mesh top. This is the original model, not PRO6030. Product-specific allowed water level must be followed.
- Old 2025-edition title replaced by undated selection guide; Article/Breadcrumb/OG/h1 aligned, actual modification date added. Unverified product short reviews removed, non-ranked lists retained. Existing33 affiliate links and GA/non-schema scripts unchanged. Other product specifications and ASIN matches are not newly validated.

## Validation
- PC latest base f84fbc2e (PR225 merged); no overlapping article change.
- Independent final review BLOCKER0; two minor findings (6030 official link, UTF8 test) fixed.
- PC site Python63/63; annainin25; KID269; Rakuten20 PASS. New regression4 included.
- Full Python80:78 pass/2 GA4 errors from missing Windows tzdata; unrelated unchanged files. Cloud80 had79pass/1 GA4 error due to /tmp/.git ancestor; neither reported as full pass.
- PC Chrome real local rendering390×844 and1280×900: no horizontal overflow, no console errors; title/list/care explanation visually checked. No actual phone/screen-reader test. QA server omitted external Google tag loading; shipped tracking code unchanged.
- JSON-LD parses; affiliate33 URLs unchanged; git diff --check PASS.
- Publication and production verification must be recorded in PR comment after merge, not assumed here.
