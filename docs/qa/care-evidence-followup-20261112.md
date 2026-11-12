# Care evidence follow-up — 2026-11-12

Status: 検証完了・PR/merge待ち。Base 0bc29360579461b90c3ddaf095a083671d8ded54; implementation 75e966c. No publication or merge is claimed.

## Scope and evidence
Nine HTML pages (two beginner rankings and musk, wood, malayan-box, red-footed, brown-wood-manni, nicaragua-wood, painted-wood), master, two diagnostic size/sizeNote entries, and regression tests. Old candidate533982a was selectively reconciled, not applied wholesale. B architecture and /kid/#growth unchanged. Ranking scores/order, scripts, onclick, affiliate URLs and visible CITES unchanged in all nine HTML (implementation-side comparison). Increased raw CITES count comes only from the VKM source URL.

Musk: RVC2024 previously verified water24–26C, basking32C, UVB; direct refetch this time returned403, so no new full-fetch claim. Tree of Life Exotics directly read this time: water24–27C, UVB, dry land, water quality. Adult60cm is site guidance, not a scientific minimum; Fishkeeper100cm is distinguished and45cm start is optional.
Cuora2011 original PDF confirms25cm SCL. COSEWIC wood16–25cm is adult range, not world record; same animal2019 SCL24 versus MCL25.1 distinguished; master max remains null/UNPROVEN. VKM2024 p39 redfoot male60/female44.2cm maximum SCL differs from ordinary size; master60 remains LIKELY.
Removed fixed one-/ten-year size/weight forecasts in six species plus musk, and unsupported wood22/25C illness thresholds without inventing replacement water targets.

## Tests
- Desktop Python unittest discover:41/41 PASS. Initial39 PASS/2 ERROR was missing America/Los_Angeles timezone data; standard tzdata installed only in isolated dependency folder, then all41 passed. No dependency/private files added to repo.
- Implementation-side results:12 new tests PASS (oldmain10 FAIL/12); growth8, size4, annainin21, KID145 PASS. Validator mismatch0/unparseable0; enclosure110/0; compare378/0, existing2 no-master and10 unparseable retained. Independent review two rounds, final BLOCKER0.
- Exact full site reconstructed from public main clone plus internally shared source text patch. All13 changed-file SHA256 matched author manifest. Windows Library xattr transfer failed and incomplete bytes were not used. Cloud Chromium EPERM/localhost failure not counted as browser success.

## Actual browser QA
Chrome loaded full local candidate with actual relative assets/JS, not self-contained mocked HTML.
- All9 pages at375/1280: DOM scrollWidth equals clientWidth360/1265, no page horizontal overflow.
- All7 species kits loaded; FAQ open states checked. Rankings have no details FAQ.
- Visual screenshots inspected for representative mobile views of all9, and critical musk environment cards plus wood/redfoot long size notes at mobile and desktop. Clean wrapping, no observed overlapping or cut text.
- Musk water-change FAQ mobile expanded screenshot inspected; desktop open state verified through DOM (screenshot caught pre-animation state).
- Musk essential-kit tab selection and mobile rendering verified. No merchant clicks.
- All9 growth hrefs checked; direct navigation to KID#growth rendered its body, then returned by navigation. Link-click and browser-history-back success were not established.
- Console count, screen reader, every section screenshot, diagnostic results flow and public production were NOT MEASURED. Do not claim those PASS.

## Retained limitations
Public baseline already had45–60cm body versus90cm standard-kit recommendation. Shared kit's daily-small-water-change ideal wording remains unchanged. Product ruler, whole-lifespan data, other species unresolved values, KID dimensions/multipliers remain separate. Not a119-species verification.

## Publication gate update
PR #219 created after explicit Owner authorization to send and merge. GitHub reports MERGEABLE/CLEAN with no registered status checks; exact16-file diff checked, no deletes/renames or unrelated files. Python41/41 rerun PASS. Production verification remains pending until merge.
