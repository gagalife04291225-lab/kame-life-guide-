# Cross-page claims rebuild — 2026-11-12

Base: 8518b01b8251a853bcbba8f19c6cfe282abfb9ee. This is a newly rebuilt candidate, not the lost earlier patch. No commit, push or publication performed here.

Scope: guide-beginner.html care claims and existing comparison rows linking to musk, razorback, Spengler or Hirase. Species' own classification records are not overwritten. The root integrator owns AI-HANDOFF/AI_CHANGELOG updates in the combined PR.

Evidence reused from the preceding verified investigation and current fixed records:
- TTWG2025 printed pp254–255: Cuora mouhotii occurs in South/Southeast Asia and China, not endemic Japan.
- TFTSG2010 Geoemyda spengleri account: 67.4–107.1 mm adult measurements, consistent with the existing 7–11 cm general-adult column. https://iucn-tftsg.org/wp-content/uploads/file/Accounts/crm_5_047_spengleri_v1_2010.pdf
- Tree of Life Exotics common musk care: stress secretion; water/filtration and resting structures, UVB. https://treeoflifeexotics.vet/education-resource-center/for-clients/turtles/common-musk-turtle-care
- Current species-master and species pages: musk record13.7 cm, razorback17.6 cm, Hermann female35.7 cm. Adult single musk/razorback60+ cm remains a site estimate, not a newly established biological minimum. Species-specific requirements still apply.
- No new source retrieval claimed in this rebuild. Earlier RVC fetch403 was not treated as reading the PDF.

Changes remove misleading no-odor, small-water=easier-cleaning, unattended-days-by-equipment, UVB-percent=UVI and fixed-wattage-by-age guarantees. FAQ visible text and JSON-LD updated together. Unchanged cost FAQ is not revalidated by this work. Other species' numbers and all existing husbandry advice are not covered by a whole-site correctness guarantee.

Validation executed on rebuild:
- Dedicated4 tests pass, including all species comparisons and FAQ7 consistency.
- Python62 tests:61 pass, one existing environment error test_private_output_repo_and_resolved_paths (OUTPUT_INSIDE_GIT_REPOSITORY_REFUSED due shared ancestor .git). This is not all-green; PC integration must rerun.
- validate_species:0 mismatch/0 warning. enclosure110/0 with existing2warnings; compare378/0/10 unassessable. annainin21 pass.
- Changed33 HTML:33 JSON-LD blocks parse, affiliate href lists and GA IDs unchanged. git diff --check passes.
- Independent prose review found initial FAQ graph traversal miss; corrected before delivery. Reviewer reread and confirmed obsolete FAQ guarantees removed, new prose natural. Full external-source independent revalidation and PC rendering remain integration checks.
