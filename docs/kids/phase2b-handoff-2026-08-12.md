# KAME LIFE GUIDE Kids — PHASE 2B Handoff

Date: 2026-08-12
Status: continuation baseline for next chat

## Confirmed assets / design
- PH-01: real photo of user's Eastern box turtle (トウブハコガメ), adopted crop/caption: `しゃしん：うちの トウブハコガメ`.
- B1: fantasy transition uses hexagon motif via SVG/CSS; no separate image.
- BG-01 B2 `しめった もり`: approved VISUAL MASTER. 1672x941. Bright hand-painted thick-impasto storybook style.
- BG-02 B3 `みずべ`: approved. Same visual series/style.
- BG-03 B4 `かわいた ばしょ`: approved. Same visual series/style.
- Foot comparison art: water-foot / land-foot pair approved. Use as factual educational diagrams.
- Keep all 3 zones: B2 wet forest, B3 waterside, B4 dry place.

## Educational rules
- Do NOT claim shell shape alone determines habitat. Use it only as a hint/tendency.
- Feet are the stronger observation cue: webbed spreading foot vs thick terrestrial foot.
- Do NOT assert leaf-like shell coloration exists 'for camouflage' without species-specific evidence; observation only.
- Do NOT say dry-land tortoises drink little / need little water.
- B1 states once that the hexagon-marked section is a story/fantasy. B2-B4 use the hexagon visual language without repeated warning text. B5 returns to factual/reality styling.

## B0-B4 layout/compression decision
- Horizontal foot-art layout was rejected because Japanese explanatory text breaks into unreadable 4-6 line fragments.
- Preferred/adopted candidate: vertical foot illustration at 120px.
- 360px estimate with this candidate: total page height about 13,593px / 16.9 screens, versus 14,106px before compression (-513px).
- Do not sacrifice readability merely to hit the previous -640px compression target.
- Body text remains 19px; learning content, zones, and steps are not deleted.
- Re-test 360/390/412px before production adoption.

## Existing Git state reported before this handoff
- Commit `080f54a`: `fix(kids): 本文の誤字と主語の欠落を修正`, pushed; text-only changes in `kids/index.html`.
- Production CSS/JS had not yet been changed for PHASE 2B.
- PHASE 2B preview/layout/assets were still in the local working/preview area and had not yet been committed as production implementation.
- B5 not started.

## Turtle surprise story decision
Adopt candidate #2 only for now:

### `あしで ドンドン。ミミズが 出てくる！？`
- Species: Wood turtle / モリイシガメ (`Glyptemys insculpta`).
- Keep species-specific wording; never imply all turtles do this.
- Reported behavior: some wood turtles stomp/tamp the ground with the forelimbs/anterior body and then eat earthworms that emerge.
- Do NOT state a definitive reason why worms emerge. Keep: `どうして ミミズが 出てくるのかは、まだ よく わかって いません。`
- Intended placement: a compact surprise/fact card inside B2 `しめった もり`, not a new zone.
- Before production implementation, preview and measure its added height and resulting total page height.

Candidate #3, `甲羅を さわられたことが分かる`, is reserved as a possible B5 introduction rather than an independent extra card.
Candidate #1, cloacal/butt breathing, is rejected because it is too easy to generalize/misrepresent for this Kids page.

## Next action
Do NOT jump directly to B5.
First preview the adopted Wood Turtle surprise card in B2 together with the vertical-120px foot layout, then measure:
1. exact placement in B2,
2. compact card height,
3. added height at 360px,
4. total page height at 360/390/412px,
5. horizontal overflow, contrast, tap targets, and JS errors.
Only after review/approval should PHASE 2B production HTML/CSS/assets be committed.
