# Review evidence correction: five articles (2026-11-12)

Base: f84fbc2e1894c3c878da618b5580bce0bb182ce7. Dedicated Windows checkout.
Scope: food-review.html, shelter-review.html, substrate-review.html, uvb-light-review.html, water-filter-review.html, regression tests and this record. Cage review is another task.

## Correction
- Removed five unsupported visible numerical ratings and the matching Product/Review nodes. Article and BreadcrumbList retained.
- Removed unsupported claim of using six substrates, shopping-site sales-ranking attribution, numbered ranking badges and unsubstantiated short ratings. Existing links retained; no Amazon rating substituted.
- Related absolute guarantees (safe if swallowed, fixed filter water-change savings, generic shelter fit ratio) corrected. Other pages' individual keeper experience is not inferred false or removed.
- This is an evidence/rating correction, not a validation of every older husbandry or product specification statement on these pages.

## Provenance
- Visible ratings predate July 2026. Commit 2923cb59 added structured ratings as the site author, not Amazon.
- Commit 983943e4 removed those schemas in August but is not an ancestor of this main; the body ratings were not removed there.
- The current owner explicitly denied the cage five-product usage claim. That denial is not evidence that every other personal experience is false.

## Verification
- PC Python: 81 run, 79 pass, 0 failures, 2 environment errors in GA4 timezone tests (America/Los_Angeles tzdata unavailable). No claim of full aggregate pass.
- Node: annainin 25 pass; KID 269 pass; Rakuten 20 pass. validate_species: MISMATCH 0 / WARN 0.
- All five pages: ordered href values and all executable scripts exactly match the base. Affiliate destinations/tags, GA4 code and CITES unchanged.
- Chrome local HTTP: five pages x 390/1280 px; horizontal overflow 0, h1 count 1 each, visible rating boxes 0. Candidate links 20/20/20/10/10. Mobile filter-page screenshot visually inspected.
- QA HTTP response suppresses external GA loader only; tracked files unchanged by this suppression. No affiliate purchases/clicks made.
- Production and merge are separate stages; not yet verified in this record.

Independent review: removed ranking badges/unsupported short comments, corrected food intro and frozen-bloodworm medical wording. Final additional corrections: UVB universal replacement prescription, natural-substrate safety/best-choice claim, daily-water-change-without-filter claim.

Final aggregate after #226 integration: 85 / 85 Python PASS with existing PC tzdata at care-qa-20261112-verified/deps on per-process PYTHONPATH. No package installed or system setting changed. Earlier two environment errors resolved. Final three wording changes also read back in Chrome; overflow 0, console errors on filter page 0.
