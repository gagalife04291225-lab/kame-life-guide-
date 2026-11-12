# Shared product specification audit (2026-11-12, read-only findings)

Scope: 142 product records inspected structurally; targeted official-source verification, NOT all 142 products externally verified. No product exclusion or implementation authorized by this report. Counts below use all 119 diagnosis species, native route and all route; slots mean route x tier occurrences, not unique species. The remaining-103 subset was not separately identified.

## Confirmed label mismatch: Shinwa 73117
- data/products.js thermometer_dual_probe (around 2573), name is correctly temperature meter.
- js/starter-kit.js category maps (around 56 and 212) say 温湿度計 for every thermometer.
- Official https://www.shinwasokutei.co.jp/products/73117/ specifies internal -5..50 C, external -50..70 C; no humidity measurement. One built-in sensor and one wired external sensor, not two external probes. IPX7 applies only to external sensor (temporary immersion), not entire unit.
- Exposure: native 116 species / all 115 species / 253 route-tier slots.
- Corrective direction: measurement-specific wording; humidity measurement may require another instrument. Keep valid temperature candidate.

## Confirmed fixture requirement; incomplete equipment-cost context
- uvb_compact (GEX UVB100 26W): official https://product.gex-fp.co.jp/exoterra/index.php?cid=402&id=957&m=ProductListDetail specifies E26 bulb and Compact Top/Light Dome fixture. Native94/all115/209 slots.
- uvb_t5_desert_12 is actually GEX UVB150 26W E26 bulb, NOT T5 or 12 percent: https://product.gex-fp.co.jp/exoterra/?cid=402&id=959&m=ProductListDetail . Current displayed name is correct; misleading legacy ID alone is not a user-visible defect. Native21/all33/54 slots.
- ReptiSun T5 5.0/10.0 require appropriate fluorescent fixtures; official PDF page1 visually read: pin installation into lampholders, match fixture to lamp size/wattage, recommended Zoo Med T5 HO fixture. https://zoomed.com/wp-content/uploads/ReptiSun_T5HO_5.0-10.0_Instructions.pdf
- SK_CAT_ORDER has no lamp-fixture category. Candidate totals should not imply lighting is operational with bulbs alone. Exact Amazon SKU contents/fixture inclusion NOT verified.
- uvb_led_bar exists in database but zero current diagnosis slots; do not inflate current reader impact.

## Quantity and dimensions, not automatic unfitness
- Desert Base3L: official https://product.gex-fp.co.jp/exoterra/index.php?cid=417&id=2184&m=ProductListDetail permits moisture management and gives 3-5cm substrate depth, species-dependent amounts/humidity. One package is not necessarily sufficient.
- 9030 official https://product.gex-fp.co.jp/exoterra/index.php?cid=395&id=938&m=ProductListDetail specifies external91.5x46.5x33cm, glass6mm, background included. Actual usable internal floor not stated; do not substitute outer measurements or naive glass subtraction for usable floor.
- Hypothetical internal90x45cm at3-5cm requires12.15-20.25L, 5-7 three-liter bags. Arithmetic illustration only, not a measured cage recommendation.
- Current calculations sum one record price per product, no required-quantity model. 14L soil,3L substrate,8.8L bark,4kg soil are not like-for-like quantities. kg cannot be converted to liters without density.

## Heater mounting conditions confirmed, current product prose already partly fixed
- https://pitateki.com/faq.html: not whole-cage air heater; thermostat not recommended (failure outside warranty); self-built wooden cage not recommended, prohibited if combustible material; styrofoam box prohibited; side mounting ineffective.
- heater_panel_30w is Pitari1: native18/all29/47 slots. heater_panel_45 Pitari2: native48/all48/138 slots. These are exposure counts, NOT confirmed unsafe combinations.
- Current why already states bottom auxiliary heat / thermostat / mounting-material check. Need exact enclosure material and mounting method before declaring incompatibility; generic120cm cage material remains unverified.

## Limits / recommended tests
- Product ASIN physical identity, current stock/price, full fixtures included, exact usable inner dimensions, species UVI targets and every manufacturer source remain outside this bounded pass.
- Test measurement labels against explicit capability fields; avoid universal humidity claim.
- Distinguish bulb type (E26 / T5HO) from legacy ID; require documented fixture prerequisites in explanatory UI, not arbitrary product replacement.
- Avoid complete-set claims and savings comparisons based on unverified package quantities.
