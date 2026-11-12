# Size evidence, 2026-11-12

Correction: 25 original diagnosis/master discrepancies minus Hermann, eastern Hermann, ibera (3 handled by parent) = **22 records** here, not 21. 11 straightforward records plus 11 classification-dependent records (softshell and albino counted separately).

Source: TTWG2025, https://iucn-tftsg.org/wp-content/uploads/crm.10.checklist.atlas_.v10.2025.pdf . Pages below are printed pages, physical PDF page = printed +18. Values are reported maximum straight carapace length, NOT typical adult size. Original references cited by TTWG not all independently retrieved.

|slug|diagnosis/master cm|TTWG male/female max cm|page|
|---|---|---|---|
|elongated-tortoise|33/36|38.0/31.0|336|
|bell-hinge-back-tortoise|25/22|23.0 sex unspecified|338|
|bowsprit-tortoise|25/35|35.1/21.6|325|
|home-hinge-back-tortoise|25/22|25.1/25.8|339|
|western-painted-turtle|25/26.6|20.8/26.6|159|
|chinese-stripe-necked-turtle|25/27.9|20.0/30.0|278|
|annulated-wood-turtle|20/22.6|20.2/22.6|287|
|gulf-coast-box-turtle|22/23.5|23.5/18.9|217|
|carolina-diamondback-terrapin|21/23|15.0/20.4 centrata|173|
|eastern-long-necked-turtle|28/30|24.9/28.2|53|
|mccords-snake-necked-turtle|26/24.1|20.2/24.1 species and nominate|54|

## Classification-dependent 11 records
- greek-tortoise: species max male46.0 female31.5 p355, nominate graeca male19.5 female24.9. Do not mix species/nominate scope.
- cherry-head-tortoise: regional/trade form of C. carbonarius, no form-specific maximum established here. Do not assign species maximum as form maximum.
- red-cheeked-mud-turtle: K. cruentatum male16.6 female14.8 p133. Old scorpioides cruentatum split with mexicanum; check article scope.
- three-toed-box-turtle: accepted T. triunguis p220; male14.8 female15.6, bracketed record max17.9 (Dodd2001 citing Conant/Collins1991). Current18 can be rounded; master16.5 needs comparison. T.mexicana triunguis is synonym.
- ornate-box-turtle: T.ornata male15.7 female17.0 p219.
- desert-box-turtle: luteola in T.ornata synonymy p220. Above17 is species maximum, not established desert-form maximum.
- malayan-box-turtle: narrow C.amboinensis male19.2 female20.8 p242. Old broad group split; C.couro couro21.3/25.0 and C.couro kamaroma21.9/27.8 p245. No automatic broad25→narrow20.8 change.
- three-striped-box-turtle: species C.trifasciata23.0/26.0 vs nominate21.0/23.0 p257.
- chinese-softshell-turtle: narrow P.sinensis23.0 p403 (Farkas2019); legacy broad taxonomy/farmed identity unresolved.
- albino-chinese-softshell: same species issue, albino is morph not separate species.
- collier-snake-necked-turtle: TTWG accepted C.oblonga23.3/31.0 p61; C.colliei synonym on p62. Both heading/max and synonym continuity checked; p62's40.2/48.1 belongs Elseya branderhorsti NOT this species.

All headings and surrounding text checked. Original page images checked specifically for triunguis and oblonga/colliei. No repository changes during research.


## Implementation scope
17 clear-scope records updated in master, diagnosis maximum fields, and species-page evidence paragraph. Eastern long-necked retains30cm from existing CTTC/Naturalis source rather than reducing it based on TTWG28.2cm. Typical-adult ranges are not replaced with record maxima. Classification-dependent records outside these17 retain their values pending definition of article taxon; this is a completed source review, not a claim that no evidence was found.


## Verification and closeout
- 17 records: master, coreSpecs.size and legacy maximum fields agree. TTWG page + sex-specific record noted. Generic size bands are not certified by this work.
- New regression tests cover17 values/source notes, stale maximum phrases, JSON-LD parsing, and modified FAQ equality. Existing size sync test retains only cherry-head as known divergence; 5 corrected records removed.
- Enclosure check110/0 (existing master-absent warnings2), comparison378/0/unknown10. No enclosure dimensions changed. Historical formula basis is explicitly historical, not a validated safe minimum.
- Parent/root must run visual QA: this cloud Playwright lacks its Chromium executable; no browser display result claimed.
- All Python suite has existing GA4 private-output path error due environment ancestor Git detection. This is not a passing full suite.
- No commit/push/merge performed by this worker. Parent integrates handoff/change log and independent QA.
- Classification-dependent untouched records: greek, cherry-head, red-cheeked, three-toed, ornate, desert, malayan, three-striped, chinese-softshell, albino-softshell, collier. Their evidence and exact scope issues are recorded above. Current values not certified by this review.

## Independent review correction
Removed unsupported typical-adult bands in diagnosis top-level size and species-page stat/comparison/environment cards: bell15–25, mccordi22–26, salvinii20–25, centrata13–21, white-lipped15–17cm. Replaced with explicitly labelled recorded maxima, NOT a new typical-adult range. White-lipped had no established typical range; the other four bands exceeded the adopted species/subspecies record. Added regression coverage for all5 records. Lifespan untouched in this correction.
