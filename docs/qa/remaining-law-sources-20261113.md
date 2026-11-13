# Remaining law sources: 2026-11-13

Base: fde885bd1485ae74ce9527bb63f432e400c80008. Read-only source verification; implementation is separate.

## Scope and evidence

This matrix covers all 121 master records and the current CITES appendix category, not every historical effective date or every local ordinance. Completed PR #236/#237 records are fixed inputs, not repeated individual investigations. Kinosternon II categories are retained and their already-fixed effective-date audit is not repeated.

S1: https://zoek.officielebekendmakingen.nl/trb-2026-100.html (Netherlands official treaty publication, 7 September 2026; consolidated CITES appendices valid from 5 March 2026). TESTUDINES section, lines 1232–1363 in fetched text. Columns I / II / III must be distinguished. Species absence is checked against genus and family coverage; not a mere failed name search.

S2: https://www.env.go.jp/press/101740.html (Japan Ministry of Environment, 2015-12-03; Japanese pond turtle export-advice conditions).

S3: https://www.env.go.jp/content/000395814.pdf (Japan Ministry of Environment decree tables; international endangered species and applicable dates, page 31 in extracted PDF).

## Confirmed findings

- Mauremys sinensis: null -> III, China nominating party (S1 line 1293). Do not confuse this with Japanese invasive-species restrictions.
- Chelodina colliei, Chelodina rugosa, Phrynops hilarii: null -> not_listed. S1 CHELIDAE lists C. mccordi, Chelus fimbriata, C. orinocensis and Pseudemydura umbrina only; no genus/family blanket listing.
- Mauremys reevesii remains III (China), not II (S1 line 1292); Mauremys nigricans remains II (line 1291).
- Chrysemys picta and its subspecies remain not_listed. No Chrysemys or EMYDIDAE blanket listing in S1. Pseudemys gorzugi likewise remains not_listed.
- Japanese pond turtle II is correct, but its master note claiming a zero export quota for all commercially traded wild specimens is unsupported and conflicts with S2. S1 line 1289 has no zero-quota annotation; S2 distinguishes wild individuals below 8 cm from those at/above 8 cm and captive-bred specimens. Remove the blanket zero-quota assertion; do not claim export is unrestricted.
- Archive Testudo kleinmanni, Geochelone elegans, G. platynota, Pyxis arachnoides: I confirmed directly in S1; corresponding Japanese international endangered-species entries confirmed S3. Cuora galbinifrons likewise I and Japanese entry confirmed. CITES category alone does not mean all existing domestic keeping is prohibited.

## 121-record comparison

not_listed means CITES appendix non-listing, NOT absence of Japanese or foreign legal restrictions. Country in III parentheses denotes listing party unless an explicit population restriction is written (Emys has such a restriction).

| slug | scientific name | base appendix | confirmed category | method / scope |
|---|---|---|---|---|
| japanese-pond-turtle | Mauremys japonica | II | II | S1 explicit species entry (includes subspecies) |
| yaeyama-pond-turtle | Mauremys mutica kami | II | II | S1 explicit species entry (includes subspecies) |
| west-african-mud-turtle | Pelusios nanus | not_listed | not_listed | S1 full TESTUDINES: species/genus/higher-taxon coverage absent |
| reeves-turtle | Mauremys reevesii | III | III | S1 explicit species entry (includes subspecies) |
| russian-tortoise | Testudo horsfieldii | II | II | S1 TESTUDINIDAE spp II, explicit I exceptions |
| hermann-tortoise | Testudo hermanni | II | II | S1 TESTUDINIDAE spp II, explicit I exceptions |
| greek-tortoise | Testudo graeca | II | II | S1 TESTUDINIDAE spp II, explicit I exceptions |
| musk-turtle | Sternotherus odoratus | II | II | S1 genus spp listing with explicit species/subspecies exceptions |
| razorback-musk-turtle | Sternotherus carinatus | II | II | S1 genus spp listing with explicit species/subspecies exceptions |
| podocnemis-unifilis | Podocnemis unifilis | II | II | S1 genus spp listing with explicit species/subspecies exceptions |
| eastern-mud-turtle | Kinosternon subrubrum subrubrum | II | II | S1 genus spp listing with explicit species/subspecies exceptions; effective date uses completed prior audit |
| mississippi-mud-turtle | Kinosternon subrubrum hippocrepis | II | II | S1 genus spp listing with explicit species/subspecies exceptions; effective date uses completed prior audit |
| florida-mud-turtle | Kinosternon steindachneri | II | II | S1 genus spp listing with explicit species/subspecies exceptions; effective date uses completed prior audit |
| striped-mud-turtle | Kinosternon baurii | II | II | S1 genus spp listing with explicit species/subspecies exceptions; effective date uses completed prior audit |
| red-cheeked-mud-turtle | Kinosternon cruentatum | II | II | S1 genus spp listing with explicit species/subspecies exceptions; effective date uses completed prior audit |
| mexican-mud-turtle | Kinosternon integrum | II | II | S1 genus spp listing with explicit species/subspecies exceptions; effective date uses completed prior audit |
| yellow-mud-turtle | Kinosternon flavescens | II | II | S1 genus spp listing with explicit species/subspecies exceptions; effective date uses completed prior audit |
| herrera-mud-turtle | Kinosternon herrerai | II | II | S1 genus spp listing with explicit species/subspecies exceptions; effective date uses completed prior audit |
| white-lipped-mud-turtle | Kinosternon leucostomum | II | II | S1 genus spp listing with explicit species/subspecies exceptions; effective date uses completed prior audit |
| scorpion-mud-turtle | Kinosternon scorpioides | II | II | S1 genus spp listing with explicit species/subspecies exceptions; effective date uses completed prior audit |
| narrow-bridged-mud-turtle | Kinosternon acutum | II | II | S1 genus spp listing with explicit species/subspecies exceptions; effective date uses completed prior audit |
| red-eared-slider | Trachemys scripta elegans | not_listed | not_listed | completed fixed input; current S1 table compatible |
| yellow-bellied-slider | Trachemys scripta scripta | not_listed | not_listed | completed fixed input; current S1 table compatible |
| cumberland-slider | Trachemys scripta troostii | not_listed | not_listed | completed fixed input; current S1 table compatible |
| mississippi-map-turtle | Graptemys pseudogeographica kohnii | III | III | S1 genus spp listing with explicit species/subspecies exceptions |
| false-map-turtle | Graptemys pseudogeographica pseudogeographica | III | III | S1 genus spp listing with explicit species/subspecies exceptions |
| ouachita-map-turtle-sp | Graptemys ouachitensis | III | III | S1 genus spp listing with explicit species/subspecies exceptions |
| black-knobbed-map-turtle | Graptemys nigrinoda | III | III | S1 genus spp listing with explicit species/subspecies exceptions |
| ringed-map-turtle | Graptemys oculifera | III | III | S1 genus spp listing with explicit species/subspecies exceptions |
| northern-map-turtle | Graptemys geographica | III | III | S1 genus spp listing with explicit species/subspecies exceptions |
| alabama-map-turtle | Graptemys pulchra | II | II | completed fixed input; current S1 table compatible |
| graptemys-versa | Graptemys versa | III | III | S1 genus spp listing with explicit species/subspecies exceptions |
| graptemys-flavimaculata | Graptemys flavimaculata | III | III | S1 genus spp listing with explicit species/subspecies exceptions |
| spiny-softshell-turtle | Apalone spinifera | II | II | completed fixed input; current S1 table compatible |
| smooth-softshell-turtle | Apalone mutica | II | II | S1 genus spp listing with explicit species/subspecies exceptions |
| florida-softshell-turtle | Apalone ferox | II | II | S1 genus spp listing with explicit species/subspecies exceptions |
| northern-diamondback-terrapin | Malaclemys terrapin terrapin | II | II | S1 Malaclemys terrapin II includes subspecies |
| carolina-diamondback-terrapin | Malaclemys terrapin centrata | II | II | S1 Malaclemys terrapin II includes subspecies |
| ornate-diamondback-terrapin | Malaclemys terrapin macrospilota | II | II | S1 Malaclemys terrapin II includes subspecies |
| giant-musk-turtle | Staurotypus triporcatus | II | II | S1 explicit species entry (includes subspecies) |
| giant-musk-turtle-mx | Staurotypus salvinii | II | II | S1 explicit species entry (includes subspecies) |
| three-toed-box-turtle | Terrapene triunguis | II | II | S1 genus spp listing with explicit species/subspecies exceptions |
| eastern-box-turtle | Terrapene carolina carolina | II | II | S1 genus spp listing with explicit species/subspecies exceptions |
| gulf-coast-box-turtle | Terrapene carolina major | II | II | S1 genus spp listing with explicit species/subspecies exceptions |
| florida-box-turtle | Terrapene carolina bauri | II | II | S1 genus spp listing with explicit species/subspecies exceptions |
| ornate-box-turtle | Terrapene ornata | II | II | S1 genus spp listing with explicit species/subspecies exceptions |
| desert-box-turtle | Terrapene ornata | II | II | S1 genus spp listing with explicit species/subspecies exceptions |
| hirase-turtle | Cuora mouhotii | II | II | S1 genus spp listing with explicit species/subspecies exceptions |
| obsti-hirase-turtle | Cuora mouhotii obsti | II | II | S1 genus spp listing with explicit species/subspecies exceptions |
| taiwan-box-turtle | Cuora flavomarginata flavomarginata | II | II | S1 genus spp listing with explicit species/subspecies exceptions |
| chinese-box-turtle | Cuora flavomarginata | II | II | S1 genus spp listing with explicit species/subspecies exceptions |
| malayan-box-turtle | Cuora amboinensis sensu lato | II | II | S1 genus spp listing with explicit species/subspecies exceptions |
| three-striped-box-turtle | Cuora trifasciata | II | II | S1 genus spp listing with explicit species/subspecies exceptions |
| indochinese-box-turtle | Cuora galbinifrons | I | I | S1 genus spp listing with explicit species/subspecies exceptions |
| chinese-stripe-necked-turtle | Mauremys sinensis | None | III | S1 explicit species entry (includes subspecies) |
| yellow-pond-turtle | Mauremys mutica | II | II | S1 explicit species entry (includes subspecies) |
| canton-reeves-turtle | Mauremys nigricans | II | II | S1 explicit species entry (includes subspecies) |
| aldabra-tortoise | Aldabrachelys gigantea | II | II | S1 TESTUDINIDAE spp II, explicit I exceptions |
| sulcata-tortoise | Centrochelys sulcata | II | II | S1 TESTUDINIDAE spp II, explicit I exceptions |
| red-footed-tortoise | Chelonoidis carbonarius | II | II | S1 TESTUDINIDAE spp II, explicit I exceptions |
| cherry-head-tortoise | Chelonoidis carbonarius | II | II | S1 TESTUDINIDAE spp II, explicit I exceptions |
| chaco-tortoise | Chelonoidis chilensis | II | II | S1 TESTUDINIDAE spp II, explicit I exceptions |
| bowsprit-tortoise | Chersina angulata | II | II | S1 TESTUDINIDAE spp II, explicit I exceptions |
| elongated-tortoise | Indotestudo elongata | II | II | S1 TESTUDINIDAE spp II, explicit I exceptions |
| bell-hinge-back-tortoise | Kinixys belliana | II | II | S1 TESTUDINIDAE spp II, explicit I exceptions |
| home-hinge-back-tortoise | Kinixys homeana | I | I | completed fixed input; current S1 table compatible |
| impressed-tortoise | Manouria impressa | II | II | S1 TESTUDINIDAE spp II, explicit I exceptions |
| leopard-tortoise | Stigmochelys pardalis | II | II | S1 TESTUDINIDAE spp II, explicit I exceptions |
| iberian-greek-tortoise | Testudo graeca ibera | II | II | S1 TESTUDINIDAE spp II, explicit I exceptions |
| marginated-tortoise | Testudo marginata | II | II | S1 TESTUDINIDAE spp II, explicit I exceptions |
| archive-testudo-kleinmanni | Testudo kleinmanni | I | I | S1 TESTUDINIDAE spp II, explicit I exceptions |
| pancake-tortoise | Malacochersus tornieri | I | I | completed fixed input; current S1 table compatible |
| archive-geochelone-elegans | Geochelone elegans | I | I | S1 TESTUDINIDAE spp II, explicit I exceptions |
| archive-geochelone-platynota | Geochelone platynota | I | I | S1 TESTUDINIDAE spp II, explicit I exceptions |
| archive-pyxis-arachnoides | Pyxis arachnoides | I | I | S1 TESTUDINIDAE spp II, explicit I exceptions |
| spotted-turtle | Clemmys guttata | II | II | S1 explicit species entry (includes subspecies) |
| blandings-turtle | Emydoidea blandingii | II | II | S1 explicit species entry (includes subspecies) |
| wood-turtle | Glyptemys insculpta | II | II | S1 explicit species entry (includes subspecies) |
| mccords-snake-necked-turtle | Chelodina mccordi | II | II | S1 explicit species entry (includes subspecies) |
| pig-nosed-turtle | Carettochelys insculpta | II | II | S1 explicit species entry (includes subspecies) |
| matamata | Chelus fimbriata | II | II | S1 explicit species entry (includes subspecies) |
| amazon-matamata | Chelus orinocensis | II | II | S1 explicit species entry (includes subspecies) |
| pink-bellied-side-necked-turtle | Emydura subglobosa | not_listed | not_listed | S1 full TESTUDINES: species/genus/higher-taxon coverage absent |
| eastern-long-necked-turtle | Chelodina longicollis | not_listed | not_listed | S1 full TESTUDINES: species/genus/higher-taxon coverage absent |
| collier-snake-necked-turtle | Chelodina colliei | None | not_listed | S1 full TESTUDINES: species/genus/higher-taxon coverage absent |
| siebenrocks-snake-necked-turtle | Chelodina rugosa | None | not_listed | S1 full TESTUDINES: species/genus/higher-taxon coverage absent |
| hilaire-side-necked-turtle | Phrynops hilarii | None | not_listed | S1 full TESTUDINES: species/genus/higher-taxon coverage absent |
| african-helmeted-turtle | Pelomedusa subrufa | not_listed | not_listed | S1 full TESTUDINES: species/genus/higher-taxon coverage absent |
| painted-turtle | Chrysemys picta | not_listed | not_listed | S1 full TESTUDINES: species/genus/higher-taxon coverage absent |
| river-cooter | Pseudemys concinna | not_listed | not_listed | S1 full TESTUDINES: species/genus/higher-taxon coverage absent |
| rio-grande-cooter | Pseudemys gorzugi | not_listed | not_listed | S1 full TESTUDINES: species/genus/higher-taxon coverage absent |
| florida-red-bellied-turtle | Pseudemys nelsoni | not_listed | not_listed | S1 full TESTUDINES: species/genus/higher-taxon coverage absent |
| peninsula-cooter | Pseudemys peninsularis | not_listed | not_listed | S1 full TESTUDINES: species/genus/higher-taxon coverage absent |
| european-pond-turtle | Emys orbicularis | III | III | completed fixed input; current S1 table compatible |
| chinese-softshell-turtle | Pelodiscus sinensis | not_listed | not_listed | S1 full TESTUDINES: species/genus/higher-taxon coverage absent |
| albino-chinese-softshell | Pelodiscus sinensis | not_listed | not_listed | S1 full TESTUDINES: species/genus/higher-taxon coverage absent |
| spenglers-leaf-turtle | Geoemyda spengleri | II | II | S1 explicit species entry (includes subspecies) |
| asian-leaf-turtle | Cyclemys dentata | II | II | S1 genus spp listing with explicit species/subspecies exceptions |
| asian-black-marsh-turtle | Siebenrockiella crassicollis | II | II | S1 explicit species entry (includes subspecies) |
| annulated-wood-turtle | Rhinoclemmys annulata | II | II | S1 genus spp listing with explicit species/subspecies exceptions |
| painted-wood-turtle | Rhinoclemmys pulcherrima | II | II | S1 genus spp listing with explicit species/subspecies exceptions |
| nicaragua-wood-turtle | Rhinoclemmys pulcherrima incisa | II | II | S1 genus spp listing with explicit species/subspecies exceptions |
| brown-wood-turtle-manni | Rhinoclemmys pulcherrima manni | II | II | S1 genus spp listing with explicit species/subspecies exceptions |
| hime-nioi-turtle | Sternotherus depressus | II | II | S1 genus spp listing with explicit species/subspecies exceptions |
| loggerhead-musk-turtle | Sternotherus minor | II | II | S1 genus spp listing with explicit species/subspecies exceptions |
| stripe-necked-musk-turtle | Sternotherus peltifer | II | II | S1 genus spp listing with explicit species/subspecies exceptions |
| western-painted-turtle | Chrysemys picta bellii | not_listed | not_listed | S1 full TESTUDINES: species/genus/higher-taxon coverage absent |
| eastern-painted-turtle | Chrysemys picta picta | not_listed | not_listed | S1 full TESTUDINES: species/genus/higher-taxon coverage absent |
| mississippi-diamondback-terrapin | Malaclemys terrapin pileata | II | II | S1 Malaclemys terrapin II includes subspecies |
| texas-diamondback-terrapin | Malaclemys terrapin littoralis | II | II | S1 Malaclemys terrapin II includes subspecies |
| tunisian-greek-tortoise | Testudo graeca nabeulensis | II | II | S1 TESTUDINIDAE spp II, explicit I exceptions |
| eastern-hermann-tortoise | Testudo hermanni boettgeri | II | II | S1 TESTUDINIDAE spp II, explicit I exceptions |
| western-hermann-tortoise | Testudo hermanni hermanni | II | II | S1 TESTUDINIDAE spp II, explicit I exceptions |
| golden-greek-tortoise | Testudo graeca terrestris | II | II | S1 TESTUDINIDAE spp II, explicit I exceptions |
| moroccan-greek-tortoise | Testudo graeca graeca | II | II | S1 TESTUDINIDAE spp II, explicit I exceptions |
| midland-painted-turtle | Chrysemys picta marginata | not_listed | not_listed | S1 full TESTUDINES: species/genus/higher-taxon coverage absent |
| suwannee-cooter | Pseudemys concinna suwanniensis | not_listed | not_listed | S1 full TESTUDINES: species/genus/higher-taxon coverage absent |
| sonora-wood-turtle | Rhinoclemmys pulcherrima rogerbarbouri | II | II | S1 genus spp listing with explicit species/subspecies exceptions |
| guerrero-wood-turtle | Rhinoclemmys pulcherrima pulcherrima | II | II | S1 genus spp listing with explicit species/subspecies exceptions |
| mangrove-diamondback-terrapin | Malaclemys terrapin rhizophorarum | II | II | S1 Malaclemys terrapin II includes subspecies |
| libyan-greek-tortoise | Testudo graeca cyrenaica | II | II | S1 TESTUDINIDAE spp II, explicit I exceptions |

## Limits

This source comparison does not certify legal provenance of an individual animal, permission to collect/export/import, local protected-area rules, or all historical listing dates. The S3 domestic table includes dates for domestic application; do not automatically reuse them as first-ever CITES listing dates. No production or repository data was changed by this evidence artifact.
