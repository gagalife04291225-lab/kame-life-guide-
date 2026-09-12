/**
 * Kame Life Guide - Product Database
 * Phase 6-C Task 1: 28 → 87 products
 * Schema v4: Rakuten search fallback
 *
 * Schema v4 additions:
 *   rakutenUrl        {string|null} - Real Rakuten affiliate URL
 *   rakutenStatus     {string}      - "pending" | "available" | "search"
 *   rakutenSearchTerm {string|null} - Search keyword for Rakuten fallback
 *
 * Rakuten CTA rendering:
 *   "available" -> real affiliate URL button
 *   "search"    -> Rakuten search URL button
 *   "pending"   -> no Rakuten CTA
 *
 * Helper functions (末尾):
 *   getProductsByCategory(category)
 *   getBestProduct(category)
 *   getBudgetProduct(category)
 *   getTierProduct(equipmentKey, category, tier)
 *   hasRakuten(product)
 *   getRakutenSearchUrl(product)
 */

'use strict';

// ─────────────────────────────────────────────
// 1. PRODUCTS
// ─────────────────────────────────────────────

const PRODUCTS = {

  /* ══════════════════════════════════════════
     ENCLOSURE（ケージ）  10商品
     ══════════════════════════════════════════ */

  // Phase 39-P4: ASIN(B00BF91SU6)の実商品をweb_searchで確認したところ「GEX EXOTERRA グラステラリウム9030」
  // （ガラス製）であり、旧名称「木製」は事実と異なっていたため是正。サイズ(91.5×46.5×33cm)は90cm帯として妥当
  enclosure_wood_90: {
    id: 'enclosure_wood_90',
    name: 'GEX EXOTERRA グラステラリウム 9030（ガラス製）',
    category: 'enclosure',
    tier: 'standard',
    priceRange: '¥15,000–30,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B00BF91SU6?tag=kamelife090e-22',
    asin: 'B00BF91SU6',
    rakutenSearchTerm: 'GEX EXOTERRA グラステラリウム 9030',
    image: '/assets/products/placeholder.webp',
    why: '両開きフロントドアで管理しやすいガラス製ケージ。リクガメに必要な広さを確保できる定番サイズ',
    rating: 4.3,
    badge: 'Best Overall',
    recommendedFor: ['tortoise_dry_small', 'tortoise_forest'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenItemCode: null,
    rakutenPrice: null,
    rakutenShop: null,
    rakutenConfidence: 6.3,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: null,
  },

  // Phase 39-P4: ASIN(B0CDLG5XF3)の実商品をweb_searchで確認したところ「Takimi 爬虫類ケージ 120cm大型
  // 飼育ボックス(120×60×60cm スライドドア)」であり、旧名称「木製」は確認できなかったため是正
  enclosure_tortoise_120: {
    id: 'enclosure_tortoise_120',
    name: '爬虫類飼育ケージ 120cm大型（スライドドア）',
    category: 'enclosure',
    tier: 'premium',
    priceRange: '¥25,000–50,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B0CDLG5XF3?tag=kamelife090e-22',
    asin: 'B0CDLG5XF3',
    rakutenSearchTerm: '爬虫類ケージ 120cm 大型 飼育ボックス',
    image: '/assets/products/placeholder.webp',
    why: '成体になっても手狭にならない広さ。90cmから買い替えるならこのサイズが目安',
    rating: 4.5,
    badge: 'Premium',
    recommendedFor: ['tortoise_dry_large'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenItemCode: null,
    rakutenPrice: null,
    rakutenShop: null,
    rakutenConfidence: 5.7,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: null,
  },

  tank_60: {
    id: 'tank_60',
    name: '水槽 60cm規格',
    category: 'enclosure',
    tier: 'budget',
    priceRange: '¥3,000–8,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B09TF6B5P4?tag=kamelife090e-22',
    asin: 'B09TF6B5P4',
    rakutenSearchTerm: '水槽 60cm 亀',
    image: '/assets/products/placeholder.webp',
    why: '小型水棲ガメの基本飼育容器。水換えしやすい横長タイプ',
    rating: 4.1,
    badge: 'Budget Pick',
    recommendedFor: ['semi_aquatic_small', 'japanese_pond'],
    rakutenUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00pyjhn.nhbnncfa.g00pyjhn.nhbnodd2/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fchanet%2F59306%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fchanet%2Fi%2F10092671%2F&rafcid=wsc_i_is_fa8391ab-300d-4c4c-be83-ca2ddfdc47be',
    rakutenStatus: 'available',
    rakutenItemCode: 'chanet:10092671',
    rakutenPrice: 5600,
    rakutenShop: 'charm 楽天市場店',
    rakutenConfidence: 8.8,
    rakutenLastUpdated: '2026-08-29',
  },

  tank_90: {
    id: 'tank_90',
    name: 'コトブキ工芸 KC-ワイド900 水槽', // Phase 39-P6: ブランド表記統一（寿工芸→コトブキ工芸）
    category: 'enclosure',
    tier: 'standard',
    priceRange: '¥8,000–18,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B004J2G6XK?tag=kamelife090e-22',
    asin: 'B004J2G6XK',
    rakutenSearchTerm: 'コトブキ工芸 KC-ワイド900 水槽',
    image: '/assets/products/placeholder.webp',
    why: '中型水棲ガメの単独飼育や、幼体の複数飼育を始めるならこのサイズから',
    rating: 4.4,
    badge: 'Best Overall',
    recommendedFor: ['semi_aquatic_medium', 'fully_aquatic'],
    rakutenUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00uirhn.nhbnn600.g00uirhn.nhbno2d9/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fpetforest%2Fpf-4972814019201%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fpetforest%2Fi%2F10027425%2F&rafcid=wsc_i_is_fa8391ab-300d-4c4c-be83-ca2ddfdc47be',
    rakutenStatus: 'available',
    rakutenItemCode: 'petforest:10027425',
    rakutenPrice: 12811,
    rakutenShop: 'ペットフォレスト 楽天市場店',
    rakutenConfidence: 5.2,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: 'https://thumbnail.image.rakuten.co.jp/@0_mall/petforest/cabinet/japell/japell-24/pf-4972814019201.jpg?_ex=128x128',
  },

  // Phase 39-P4: ASIN(B09DNYMXTP)の実商品をweb_searchで確認したところ「SANKO パンテオン ブラック BK9045」
  // であり、旧ブランド表記「KAYUSO」は誤りだったため是正
  enclosure_kayuso_90: {
    id: 'enclosure_kayuso_90',
    name: 'SANKO パンテオン ブラック BK9045',
    category: 'enclosure',
    tier: 'standard',
    priceRange: '¥20,000–35,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B09DNYMXTP?tag=kamelife090e-22',
    asin: 'B09DNYMXTP',
    image: '/assets/products/placeholder.webp',
    why: '前開き扉で管理しやすく、通気性と保温性を兼ね備えた専用ケージ',
    rating: 4.5,
    badge: 'Best Overall',
    recommendedFor: ['tortoise_forest', 'box_turtle'],
    rakutenSearchTerm: 'SANKO パンテオン ブラック BK9045',
    rakutenUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00r0znn.nhbnn37a.g00r0znn.nhbno17e/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Ffish-neos%2Fsanko20220504-20%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Ffish-neos%2Fi%2F10105101%2F&rafcid=wsc_i_is_fa8391ab-300d-4c4c-be83-ca2ddfdc47be',
    rakutenStatus: 'available',
    rakutenItemCode: 'fish-neos:10105101',
    rakutenPrice: 26750,
    rakutenShop: 'ネオス 楽天市場店',
    rakutenConfidence: 6.6,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: 'https://thumbnail.image.rakuten.co.jp/@0_mall/fish-neos/cabinet/20/sanko20220504-20_1.jpg?_ex=128x128',
  },

  // ── Task2 追加 ──

  enclosure_plastic_60: {
    id: 'enclosure_plastic_60',
    name: 'プラスチックケース 60L',
    category: 'enclosure',
    tier: 'budget',
    priceRange: '¥2,000–5,000',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '軽量・安価な入門用ケース。幼体や小型種の一時飼育に',
    rating: 3.8,
    badge: 'Budget Pick',
    recommendedFor: ['beginner'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'プラケース 60L 爬虫類 飼育',
  },

  enclosure_glass_45: {
    id: 'enclosure_glass_45',
    name: 'GEX EXOTERRA グラステラリウム 4545', // Phase 39-P4: web_search確認済みの実商品名に修正
    category: 'enclosure',
    tier: 'budget',
    priceRange: '¥4,000–9,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B00E0GLJAK?tag=kamelife090e-22',
    asin: 'B00E0GLJAK',
    image: '/assets/products/placeholder.webp',
    why: '幼体や小型種なら十分な広さ。横からもよく見えるガラス製で観察しやすい',
    rating: 4.0,
    badge: null,
    recommendedFor: ['beginner', 'small_aquatic'],
    rakutenSearchTerm: 'GEX EXOTERRA グラステラリウム 4545',
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenItemCode: null,
    rakutenPrice: null,
    rakutenShop: null,
    rakutenConfidence: 4.9,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: null,
  },

  // Phase 39-P4: ASIN(B09DP2X997)の実商品をweb_searchで確認したところ「SANKO パンテオン カノン ホワイト
  // WH9045」（型番から90×45cm相当と推定）であり、旧称「150cm」とサイズが大きく乖離していたため確定的な誤りと判断。
  // 代替の実在150cm級ケージを本フェーズでは特定できなかったため、未確認URLを入れずaffiliateUrl/asinをnull化。
  // EQUIPMENT_MAP側は tortoise_dry_large.premium を null にし standard(enclosure_tortoise_120)へフォールバック。
  enclosure_tortoise_150: {
    id: 'enclosure_tortoise_150',
    name: '大型リクガメケージ 150cm級（要商品再選定）',
    category: 'enclosure',
    tier: 'premium',
    priceRange: '¥45,000–80,000',
    affiliateUrl: null,
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: 'ケヅメリクガメ等の大型種成体に対応できる最大級サイズ',
    rating: 4.7,
    badge: 'Premium',
    recommendedFor: ['tortoise_dry_large', 'advanced'],
    rakutenUrl: null,
    rakutenStatus: 'pending',
    rakutenSearchTerm: 'リクガメ ケージ 150cm 大型',
  },

  tank_120_aqua: {
    id: 'tank_120_aqua',
    name: 'コトブキ工芸 アクアリスト KC-1200LT 120cm ガラス水槽', // Phase 39-P6: ブランド表記統一（コトブキ→コトブキ工芸）
    category: 'enclosure',
    tier: 'premium',
    priceRange: '¥18,000–35,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B004HH8HDY?tag=kamelife090e-22',
    asin: 'B004HH8HDY',
    image: '/assets/products/placeholder.webp',
    why: '大型水棲ガメ・スッポン・マタマタの本格飼育に。120×45×45cm・約205Lの大容量で、傷に強いガラス製のため長期飼育でも透明感を維持しやすい', // Phase 39-P6: 3文→2文に統一
    rating: 4.6,
    badge: 'Premium',
    recommendedFor: ['fully_aquatic', 'advanced'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'コトブキ工芸 アクアリスト KC-1200LT 120cm ガラス水槽', // Phase 39-P6: 「アクリル水槽」は誤り(実際はガラス製)だったため商品名に統一
  },

  // 2026-09-08 商品不足監査: setup-specs（musk / reeves / snakeneck / terrapin）は60cm以上の水槽を前提にしているが、
  // 既存の shelter_turtle_dock（タートルバンク S）は適合〜幅40cm水槽のため、60cm以上向けに M を追加。
  // ASIN は WebSearch("B00O0QM6H0", amazon.co.jp) で商品ページURL /dp/B00O0QM6H0 を確認済み。価格は未取得のため空欄。
  shelter_turtle_dock_m: {
    id: 'shelter_turtle_dock_m',
    name: 'GEX EXOTERRA タートルバンク M PT3801',
    category: 'shelter',
    tier: 'standard',
    priceRange: '',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B00O0QM6H0?tag=kamelife090e-22',
    asin: 'B00O0QM6H0',
    image: '/assets/products/placeholder.webp',
    why: 'マグネット式で水位に合わせて上下する浮島（約29.8×17.8cm）。幅45〜60cm水槽・甲長15cm前後までの個体向け。60cm水槽で飼うニオイガメ・クサガメ・テラピンの陸場はこのサイズから',
    rating: null,
    badge: null,
    recommendedFor: ['semi_aquatic_small', 'semi_aquatic_medium'],
    rakutenSearchTerm: 'GEX タートルバンク M PT3801',
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenItemCode: null,
    rakutenPrice: null,
    rakutenShop: null,
    rakutenConfidence: null,
    rakutenLastUpdated: null,
    rakutenImageUrl: null,
  },

  // ── Phase 39-P1 昇格候補 追加（要Amazon/楽天個別確認、amazon_status/rakuten_status未検証） ──

  enclosure_reptihabitat_40g: {
    id: 'enclosure_reptihabitat_40g',
    name: 'Zoo Med ReptiHabitat 40Gallon リクガメ幼体キット',
    category: 'enclosure',
    tier: 'standard',
    priceRange: '¥8,000–15,000',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '幼体リクガメ向けの海外定番スターターキット。ケージ・シェルター・床材が一式揃う',
    rating: 4.0,
    badge: null,
    recommendedFor: ['tortoise_dry_small', 'beginner'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'ReptiHabitat 40Gallon Zoo Med リクガメ',
  },

  enclosure_tortoise_house_zm: {
    id: 'enclosure_tortoise_house_zm',
    name: 'Zoo Med Tortoise House',
    category: 'enclosure',
    tier: 'standard',
    priceRange: '¥10,000–18,000',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '小型リクガメ向けの低床面積ケージ。海外で実績のあるモデル',
    rating: 3.9,
    badge: null,
    recommendedFor: ['tortoise_dry_small'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'Zoo Med Tortoise House リクガメ ケージ',
  },

  enclosure_wood_120_generic: {
    id: 'enclosure_wood_120_generic',
    name: '木製ケージ 120×60cm（汎用）',
    category: 'enclosure',
    tier: 'premium',
    priceRange: '¥30,000–55,000',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '大型リクガメ成体向けの木製ケージ。販売元により仕様が異なるため購入前に個別確認が必要',
    rating: 3.8,
    badge: null,
    recommendedFor: ['tortoise_dry_large', 'advanced'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: '木製ケージ 120 60 爬虫類 リクガメ',
  },

  tank_120_gex: {
    id: 'tank_120_gex',
    name: 'GEX 120cmガラス水槽',
    category: 'enclosure',
    tier: 'premium',
    priceRange: '¥15,000–28,000',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '大型水棲ガメ・複数飼育向けの大容量水槽。コトブキ製よりコストを抑えたい場合の選択肢',
    rating: 4.1,
    badge: null,
    recommendedFor: ['fully_aquatic', 'advanced'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'GEX 120cm ガラス水槽 亀',
  },


  /* ══════════════════════════════════════════
     LIGHTING_UVB（UVBライト）  9商品
     ══════════════════════════════════════════ */

  uvb_t5_desert_std: {
    id: 'uvb_t5_desert_std',
    name: 'Zoo Med ReptiSun 10.0 UVB T5',
    category: 'lighting_uvb',
    tier: 'standard',
    priceRange: '¥3,000–6,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B00JZFJ5R0?tag=kamelife090e-22',
    asin: 'B00JZFJ5R0',
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'Zoo Med ReptiSun 10.0 T5',
    image: '/assets/products/placeholder.webp',
    why: 'UV指数の高い乾燥系・リクガメ用UVBランプ。カルシウム代謝に必須',
    rating: 4.7,
    badge: 'Best Overall',
    recommendedFor: ['tortoise_dry_small', 'tortoise_dry_large'],
  },

  uvb_t5_forest_std: {
    id: 'uvb_t5_forest_std',
    name: 'Zoo Med ReptiSun 5.0 UVB T5',
    category: 'lighting_uvb',
    tier: 'standard',
    priceRange: '¥3,000–6,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B00JZFJ5LQ?tag=kamelife090e-22',
    asin: 'B00JZFJ5LQ',
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'Zoo Med ReptiSun 5.0 T5',
    image: '/assets/products/placeholder.webp',
    why: '森林・半水棲ガメ向けのUVBランプ。適度なUV量でビタミンD3生成',
    rating: 4.6,
    badge: 'Best Overall',
    recommendedFor: ['tortoise_forest', 'semi_aquatic_small', 'box_turtle'],
  },

  uvb_compact: {
    id: 'uvb_compact',
    name: 'GEX EXOTERRA レプタイルUVB100 26W', // Phase 39-P4: web_search確認済みの実商品名に修正
    category: 'lighting_uvb',
    tier: 'budget',
    priceRange: '¥1,500–3,500',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B00BF91Q1W?tag=kamelife090e-22',
    asin: 'B00BF91Q1W',
    rakutenSearchTerm: 'GEX EXOTERRA レプタイルUVB100 26W',
    image: '/assets/products/placeholder.webp',
    why: '小型ケージや補助UVBとして使いやすいコンパクトタイプ',
    rating: 3.9,
    badge: 'Budget Pick',
    recommendedFor: ['beginner', 'semi_aquatic_small'],
    rakutenUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00upqtn.nhbnn454.g00upqtn.nhbno168/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fpalette-market%2Fpab3908bfe3d%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fpalette-market%2Fi%2F10023558%2F&rafcid=wsc_i_is_fa8391ab-300d-4c4c-be83-ca2ddfdc47be',
    rakutenStatus: 'available',
    rakutenItemCode: 'palette-market:10023558',
    rakutenPrice: 2513,
    rakutenShop: 'パレットマーケット',
    rakutenConfidence: 5.6,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: 'https://thumbnail.image.rakuten.co.jp/@0_mall/palette-market/cabinet/onesell035/pab3908bfe3d_0.jpg?_ex=128x128',
  },

  // ── Task2 追加 ──

  uvb_t5_tropical_6: {
    id: 'uvb_t5_tropical_6',
    name: 'Arcadia T5 HO 6% UVB',
    category: 'lighting_uvb',
    tier: 'standard',
    priceRange: '¥4,000–8,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B09T96TPHJ?tag=kamelife090e-22',
    asin: 'B09T96TPHJ',
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'Arcadia T5 6% UVB 爬虫類',
    image: '/assets/products/placeholder.webp',
    why: '森林・湿潤系ガメに向く中強度UVB。発色が自然で観察用としても見やすい',
    rating: 4.5,
    badge: null,
    recommendedFor: ['tortoise_forest', 'box_turtle'],
  },

  uvb_t5_desert_12: {
    id: 'uvb_t5_desert_12',
    name: 'GEX EXOTERRA レプタイルUVB150 26W',
    category: 'lighting_uvb',
    tier: 'premium',
    priceRange: '¥2,500–4,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B00BF91PYA?tag=kamelife090e-22',
    asin: 'B00BF91PYA',
    image: '/assets/products/placeholder.webp',
    why: '砂漠・サバンナ系リクガメ向け高強度UVB。ケヅメ・ヒョウモンなど高UV要求種の甲羅形成と代謝維持に重要',
    rating: 4.8,
    badge: 'Premium',
    recommendedFor: ['tortoise_dry_large', 'advanced'],
    rakutenSearchTerm: 'GEX EXOTERRA レプタイルUVB150 26W', // Phase 39-P1: 旧値はArcadia表記で商品名(GEX)と不整合だったため自身の商品名に修正
    rakutenUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00upbjn.nhbnn2ac.g00upbjn.nhbnoba7/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fshopflora%2Fuec5712d09f0%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fshopflora%2Fi%2F10006299%2F&rafcid=wsc_i_is_fa8391ab-300d-4c4c-be83-ca2ddfdc47be',
    rakutenStatus: 'available',
    rakutenItemCode: 'shopflora:10006299',
    rakutenPrice: 3363,
    rakutenShop: 'ショップflora楽天市場店',
    rakutenConfidence: 5.6,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: 'https://thumbnail.image.rakuten.co.jp/@0_mall/shopflora/cabinet/onesell018/uec5712d09f0_0.jpg?_ex=128x128',
  },

  // Phase 39-P4: ASIN(B07BBMVJ6H)の実商品をweb_searchで確認したところ「GEX EXOTERRA ソーラーグローUV 80W
  // PT2334」であり、旧称「100W」は実際は80Wだったため是正
  uvb_mvb_100: {
    id: 'uvb_mvb_100',
    name: 'GEX EXOTERRA ソーラーグローUV 80W',
    category: 'lighting_uvb',
    tier: 'premium',
    priceRange: '¥6,000–12,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B07BBMVJ6H?tag=kamelife090e-22',
    asin: 'B07BBMVJ6H',
    rakutenSearchTerm: 'GEX EXOTERRA ソーラーグローUV 80W',
    image: '/assets/products/placeholder.webp',
    why: 'UVB＋バスキング一体型。ランプ1本で照明コストを削減できる上級者向け',
    rating: 4.4,
    badge: 'Premium',
    recommendedFor: ['advanced', 'tortoise_dry_large'],
    rakutenUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00upckn.nhbnnfec.g00upckn.nhbno08d/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fbeautygoodsnld%2Fb07bbmvj6h%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fbeautygoodsnld%2Fi%2F10121507%2F&rafcid=wsc_i_is_fa8391ab-300d-4c4c-be83-ca2ddfdc47be',
    rakutenStatus: 'available',
    rakutenItemCode: 'beautygoodsnld:10121507',
    rakutenPrice: 7263,
    rakutenShop: '美容と雑貨のお店 エヌエルディ',
    rakutenConfidence: 6.3,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: 'https://thumbnail.image.rakuten.co.jp/@0_mall/beautygoodsnld/cabinet/rakub155_0213/b07bbmvj6h-text.jpg?_ex=128x128',
  },

  uvb_led_bar: {
    id: 'uvb_led_bar',
    name: 'UVB LED バー 60cm',
    category: 'lighting_uvb',
    tier: 'budget',
    priceRange: '¥2,500–5,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B08W2ZMX45?tag=kamelife090e-22',
    asin: 'B08W2ZMX45',
    image: '/assets/products/placeholder.webp',
    why: '省電力で長寿命のLEDタイプ。初心者の入門用に手頃',
    rating: 3.7,
    badge: 'Budget Pick',
    recommendedFor: ['beginner'],
    rakutenSearchTerm: 'UVB LED ライト バー 爬虫類',
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenItemCode: null,
    rakutenPrice: null,
    rakutenShop: null,
    rakutenConfidence: 3.9,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: null,
  },

  // ── Phase 39-P1 昇格候補 追加（要Amazon/楽天個別確認、amazon_status/rakuten_status未検証） ──

  uvb_t5_arcadia_desert_12: {
    id: 'uvb_t5_arcadia_desert_12',
    name: 'Arcadia ProT5 Kit Desert 12%',
    category: 'lighting_uvb',
    tier: 'premium',
    priceRange: '¥15,000–25,000',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '乾燥系リクガメ向けの高UV照射キット。専門ブランドArcadia製で照射範囲が広い',
    rating: 4.3,
    badge: null,
    recommendedFor: ['tortoise_dry_large'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'Arcadia ProT5 Kit Desert 12% UVB',
  },



  /* ══════════════════════════════════════════
     LIGHTING_BASKING（バスキングライト）  9商品
     ══════════════════════════════════════════ */

  basking_50w: {
    id: 'basking_50w',
    name: 'マルカン バスキングライト 50W BL-50',
    category: 'lighting_basking',
    tier: 'budget',
    priceRange: '¥600–2,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B0043B0AU2?tag=kamelife090e-22',
    asin: 'B0043B0AU2',
    image: '/assets/products/placeholder.webp',
    why: '小型ケージのホットスポット形成に適した出力',
    rating: 4.2,
    badge: 'Budget Pick',
    recommendedFor: ['semi_aquatic_small', 'box_turtle', 'japanese_pond'],
    rakutenSearchTerm: 'マルカン バスキングライト 50W BL-50',
    rakutenUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00pyjhn.nhbnncfa.g00pyjhn.nhbnodd2/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fchanet%2F17733%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fchanet%2Fi%2F10046925%2F&rafcid=wsc_i_is_fa8391ab-300d-4c4c-be83-ca2ddfdc47be',
    rakutenStatus: 'available',
    rakutenItemCode: 'chanet:10046925',
    rakutenPrice: 2980,
    rakutenShop: 'charm 楽天市場店',
    rakutenConfidence: 5.7,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: 'https://thumbnail.image.rakuten.co.jp/@0_mall/chanet/cabinet/177/17733-1.jpg?_ex=128x128',
  },

  basking_75w: {
    id: 'basking_75w',
    name: 'GEX EXOTERRA サングロー バスキングスポットランプ 75W', // Phase 39-P3: web_search確認済みの実商品名に修正（国内GEX正規品）
    category: 'lighting_basking',
    tier: 'standard',
    priceRange: '¥800–2,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B004LE7HWK?tag=kamelife090e-22',
    asin: 'B004LE7HWK',
    rakutenSearchTerm: 'GEX EXOTERRA サングロー バスキングスポットランプ 75W',
    image: '/assets/products/placeholder.webp',
    why: '標準的な60〜90cmケージのホットスポット形成に最適',
    rating: 4.4,
    badge: 'Best Overall',
    recommendedFor: ['tortoise_dry_small', 'semi_aquatic_medium'],
    rakutenUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00uppgn.nhbnn906.g00uppgn.nhbno4ea/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fsootune%2Fhinoce53b8439b%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fsootune%2Fi%2F10014200%2F&rafcid=wsc_i_is_fa8391ab-300d-4c4c-be83-ca2ddfdc47be',
    rakutenStatus: 'available',
    rakutenItemCode: 'sootune:10014200',
    rakutenPrice: 1528,
    rakutenShop: 'SooTune',
    rakutenConfidence: 5.2,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: 'https://thumbnail.image.rakuten.co.jp/@0_mall/sootune/cabinet/onesell004/hinoce53b8439b_0.jpg?_ex=128x128',
  },

  basking_100w: {
    id: 'basking_100w',
    rakutenModelNo: 'PT2138', // GEX公式製品DB「サングロータイトビームバスキング スポットランプ100W PT2138」。100W・同一SKUを確認
    name: 'GEX EXOTERRA サングロータイトビーム バスキングスポットランプ 100W', // Phase 39-P3: web_search確認済みの実商品名に修正（国内GEX正規品）
    category: 'lighting_basking',
    tier: 'standard',
    priceRange: '¥800–2,500',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B0043AYZL8?tag=kamelife090e-22',
    asin: 'B0043AYZL8',
    rakutenSearchTerm: 'GEX EXOTERRA サングロータイトビーム バスキングスポットランプ 100W',
    image: '/assets/products/placeholder.webp',
    why: '大型ケージや熱帯性リクガメの高温ホットスポット維持に',
    rating: 4.3,
    badge: null,
    recommendedFor: ['tortoise_dry_large'],
    rakutenUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00r096n.nhbnn0fc.g00r096n.nhbnofdc/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fauc-yabumoto%2Flovely-19103-01%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fauc-yabumoto%2Fi%2F10368235%2F&rafcid=wsc_i_is_fa8391ab-300d-4c4c-be83-ca2ddfdc47be',
    rakutenStatus: 'available',
    rakutenItemCode: 'auc-yabumoto:10368235',
    rakutenPrice: 2280,
    rakutenShop: 'プロツールショップヤブモト',
    rakutenConfidence: 4.9,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: 'https://thumbnail.image.rakuten.co.jp/@0_mall/auc-yabumoto/cabinet/tatempo17/lovely-19103-r.jpg?_ex=128x128',
  },

  // ── Task2 追加 ──

  basking_halogen_35w: {
    id: 'basking_halogen_35w',
    name: 'GEX エキゾテラ サングロータイトビーム バスキングスポットランプ 50W',
    category: 'lighting_basking',
    tier: 'budget',
    priceRange: '¥1,000–2,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B0043B0EAI?tag=kamelife090e-22',
    asin: 'B0043B0EAI',
    image: '/assets/products/placeholder.webp',
    why: '昼用の集光型バスキングランプ。小〜中型ケージのホットスポット作りに',
    rating: 3.9,
    badge: 'Budget Pick',
    recommendedFor: ['beginner'],
    rakutenSearchTerm: 'エキゾテラ サングロータイトビーム 50W',
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenItemCode: null,
    rakutenPrice: null,
    rakutenShop: null,
    rakutenConfidence: 7.9,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: null,
  },

  // Phase 39-P2: このASIN(B0043B3ZJ0)はGEX EXOTERRA サングローバスキングスポットランプ50W（標準白熱球）であり
  // ハロゲンではないことをweb_searchで確認。basking_50wと実商品が重複するため、EQUIPMENT_MAPからの参照は
  // basking_50wに一本化した（tortoise_dry_smallの budget スロットを変更）。本エントリは名称のみ是正し保持。
  basking_halogen_50w: {
    id: 'basking_halogen_50w',
    name: 'GEX EXOTERRA サングロー バスキングスポットランプ 50W',
    category: 'lighting_basking',
    tier: 'standard',
    priceRange: '¥600–2,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B0043B3ZJ0?tag=kamelife090e-22',
    asin: 'B0043B3ZJ0',
    rakutenSearchTerm: 'GEX EXOTERRA サングロー バスキングスポットランプ 50W',
    image: '/assets/products/placeholder.webp',
    why: 'スポット照射が強く、小〜中型種のホットスポットを効率よく作れる',
    rating: 4.0,
    badge: 'Budget Pick',
    recommendedFor: ['beginner', 'semi_aquatic_small'],
    rakutenUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00r8a2n.nhbnnc77.g00r8a2n.nhbno0af/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fpalmyexpress%2F4972547019042%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fpalmyexpress%2Fi%2F10006123%2F&rafcid=wsc_i_is_fa8391ab-300d-4c4c-be83-ca2ddfdc47be',
    rakutenStatus: 'available',
    rakutenItemCode: 'palmyexpress:10006123',
    rakutenPrice: 1420,
    rakutenShop: 'PALMY EXPRESS',
    rakutenConfidence: 4.6,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: 'https://thumbnail.image.rakuten.co.jp/@0_mall/palmyexpress/cabinet/10614472/10614482/imgrc0104785595.jpg?_ex=128x128',
  },

  // Phase 39-P4: ASIN(B00E0GLQPI)の実商品をweb_searchで確認したところ「GEX EXOTERRA サングロー
  // バスキングスポットランプ 150W」（単灯）であり、旧称「ダブル」は事実と異なっていたため是正
  basking_dual_150: {
    id: 'basking_dual_150',
    name: 'GEX EXOTERRA サングロー バスキングスポットランプ 150W',
    category: 'lighting_basking',
    tier: 'premium',
    priceRange: '¥3,000–6,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B00E0GLQPI?tag=kamelife090e-22',
    asin: 'B00E0GLQPI',
    image: '/assets/products/placeholder.webp',
    why: '大型ケージで広い日向エリアを確保できる高出力バスキングランプ',
    rating: 4.5,
    badge: 'Premium',
    recommendedFor: ['tortoise_dry_large', 'advanced'],
    rakutenSearchTerm: 'GEX EXOTERRA サングロー バスキングスポットランプ 150W',
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenItemCode: null,
    rakutenPrice: null,
    rakutenShop: null,
    rakutenConfidence: 5.3,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: null,
  },

  // Phase 39-P4: ASIN(B0858Y7XJX)の実商品をweb_searchで確認したところ「ゼンスイ ソラリウムセット
  // （メタルハライドランプ＋灯具）50W」であり、旧称「ソーラーラプター」「70W」は実際の製品名・出力と
  // 異なっていたため是正。ブランド（ゼンスイ）自体は一致
  basking_hid_70w: {
    id: 'basking_hid_70w',
    name: 'ゼンスイ ソラリウムセット（メタルハライドランプ＋灯具）50W',
    category: 'lighting_basking',
    tier: 'premium',
    priceRange: '¥12,000–20,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B0858Y7XJX?tag=kamelife090e-22',
    asin: 'B0858Y7XJX',
    image: '/assets/products/placeholder.webp',
    why: '太陽光に近い演色性が特長。大型リクガメの高温バスキングとUVB照射を1台でまかなえる',
    rating: 4.8,
    badge: 'Premium',
    recommendedFor: ['advanced', 'tortoise_dry_large'],
    rakutenSearchTerm: 'ゼンスイ ソラリウムセット メタルハライド',
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenItemCode: null,
    rakutenPrice: null,
    rakutenShop: null,
    rakutenConfidence: 3.5,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: null,
  },

  basking_ceramic_100w: {
    id: 'basking_ceramic_100w',
    name: 'セラミックヒートランプ 100W（夜間用）',
    category: 'lighting_basking',
    tier: 'standard',
    priceRange: '¥1,500–3,500',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B0BMKZGZQ1?tag=kamelife090e-22',
    asin: 'B0BMKZGZQ1',
    rakutenSearchTerm: 'セラミックヒートランプ 100W 爬虫類',
    image: '/assets/products/placeholder.webp',
    why: '光を出さずに熱だけ供給。夜間加温・視覚刺激なしで自然なサイクルを維持',
    rating: 4.4,
    badge: null,
    recommendedFor: ['tortoise_dry_small', 'tortoise_dry_large'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenItemCode: null,
    rakutenPrice: null,
    rakutenShop: null,
    rakutenConfidence: 7.2,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: null,
  },

  basking_infrared_red: {
    id: 'basking_infrared_red',
    name: '赤外線バスキングランプ 75W',
    category: 'lighting_basking',
    tier: 'budget',
    priceRange: '¥700–1,800',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B0042L2I58?tag=kamelife090e-22',
    asin: 'B0042L2I58',
    image: '/assets/products/placeholder.webp',
    why: '赤色光で夜間も使いやすい。水棲ガメの乾燥スポット加温に',
    rating: 3.8,
    badge: 'Budget Pick',
    recommendedFor: ['semi_aquatic_small', 'semi_aquatic_medium'],
    rakutenSearchTerm: '赤外線 バスキングランプ 75W 爬虫類',
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenItemCode: null,
    rakutenPrice: null,
    rakutenShop: null,
    rakutenConfidence: 3.2,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: null,
  },

  // ── Phase 39-P1 昇格候補 追加（要Amazon/楽天個別確認、amazon_status/rakuten_status未検証） ──

  basking_exoterra_intense_spot: {
    id: 'basking_exoterra_intense_spot',
    name: 'Exo Terra Intense Basking Spot',
    category: 'lighting_basking',
    tier: 'budget',
    priceRange: '¥1,000–2,500',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '世界的定番のバスキングランプ。ホットスポット形成の基本',
    rating: 4.2,
    badge: null,
    recommendedFor: ['tortoise_dry_small', 'beginner'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'Exo Terra Intense Basking Spot バスキングランプ',
  },

  basking_exoterra_halogen: {
    id: 'basking_exoterra_halogen',
    name: 'Exo Terra Halogen Basking Spot',
    category: 'lighting_basking',
    tier: 'budget',
    priceRange: '¥1,200–2,800',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: 'リクガメ向けハロゲン式バスキングランプ。スポット照射に優れる',
    rating: 4.0,
    badge: null,
    recommendedFor: ['tortoise_dry_small', 'tortoise_dry_large'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'Exo Terra ハロゲン バスキングスポット',
  },

  basking_arcadia_deep_heat_projector: {
    id: 'basking_arcadia_deep_heat_projector',
    name: 'Arcadia Deep Heat Projector',
    category: 'lighting_basking',
    tier: 'premium',
    priceRange: '¥8,000–15,000',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '夜間・大型ケージ向けの非可視光輻射熱ランプ。専門ブランドの上位モデル',
    rating: 4.5,
    badge: null,
    recommendedFor: ['tortoise_dry_large', 'advanced'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'Arcadia Deep Heat Projector 爬虫類',
  },

  /* ══════════════════════════════════════════
     HEATING（ヒーター）  9商品
     ══════════════════════════════════════════ */

  heater_panel_30w: {
    id: 'heater_panel_30w',
    name: 'みどり商会 ピタリ適温プラス 1号', // Phase 39-P4: web_search確認済みの実商品名に修正
    category: 'heating',
    tier: 'budget',
    priceRange: '¥2,000–4,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B004IH1VOK?tag=kamelife090e-22',
    asin: 'B004IH1VOK',
    image: '/assets/products/placeholder.webp',
    why: '夜間の底面加温に。ケージ下に設置するタイプで省スペース',
    rating: 4.0,
    badge: 'Budget Pick',
    recommendedFor: ['beginner', 'tortoise_dry_small'],
    rakutenSearchTerm: 'みどり商会 ピタリ適温プラス 1号',
    rakutenUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00r8a2n.nhbnnc77.g00r8a2n.nhbno0af/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fpalmyexpress%2F3000041%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fpalmyexpress%2Fi%2F10002067%2F&rafcid=wsc_i_is_fa8391ab-300d-4c4c-be83-ca2ddfdc47be',
    rakutenStatus: 'available',
    rakutenItemCode: 'palmyexpress:10002067',
    rakutenPrice: 3080,
    rakutenShop: 'PALMY EXPRESS',
    rakutenConfidence: 6.5,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: 'https://thumbnail.image.rakuten.co.jp/@0_mall/palmyexpress/cabinet/11262572/imgrc0113317321.jpg?_ex=128x128',
  },

  heater_panel_45: {
    id: 'heater_panel_45',
    name: 'みどり商会 ピタリ適温プラス 2号', // Phase 39-P4: web_search確認済みの実商品名に修正
    category: 'heating',
    tier: 'standard',
    priceRange: '¥3,000–6,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B004IH1VRC?tag=kamelife090e-22',
    asin: 'B004IH1VRC',
    image: '/assets/products/placeholder.webp',
    why: '中型ケージの夜間・冬季保温。サーモスタット併用推奨',
    rating: 4.2,
    badge: 'Best Overall',
    recommendedFor: ['tortoise_dry_small', 'tortoise_forest'],
    rakutenSearchTerm: 'みどり商会 ピタリ適温プラス 2号',
    rakutenUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00r8a2n.nhbnnc77.g00r8a2n.nhbno0af/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fpalmyexpress%2F3000042%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fpalmyexpress%2Fi%2F10002068%2F&rafcid=wsc_i_is_fa8391ab-300d-4c4c-be83-ca2ddfdc47be',
    rakutenStatus: 'available',
    rakutenItemCode: 'palmyexpress:10002068',
    rakutenPrice: 3955,
    rakutenShop: 'PALMY EXPRESS',
    rakutenConfidence: 6.8,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: 'https://thumbnail.image.rakuten.co.jp/@0_mall/palmyexpress/cabinet/11262572/imgrc0113317322.jpg?_ex=128x128',
  },

  heater_aqua_100w: {
    id: 'heater_aqua_100w',
    name: 'GEX カメ元気 オートヒーター SH55',
    category: 'heating',
    tier: 'standard',
    priceRange: '¥1,500–3,500',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B07PD2PCMK?tag=kamelife090e-22',
    asin: 'B07PD2PCMK',
    image: '/assets/products/placeholder.webp',
    why: '水棲ガメの水温維持に必須。オートカットつきが安心',
    rating: 4.3,
    badge: 'Best Overall',
    recommendedFor: ['semi_aquatic_small', 'semi_aquatic_medium'],
    rakutenSearchTerm: '水中ヒーター 100W 亀 水槽',
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenItemCode: null,
    rakutenPrice: null,
    rakutenShop: null,
    rakutenConfidence: 5.9,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: null,
  },

  // Phase 39-P3: ASIN(B00BKULMIS)の実商品をweb_searchで特定できず、ブランド不明の汎用品だったため
  // EQUIPMENT_MAPの参照はthermostat_kotobuki_hydra（国内コトブキ工芸・実在確認済み）に差し替え。
  // 本エントリはデータとして保持のみ行う。
  thermostat: {
    id: 'thermostat',
    name: 'サーモスタット（アナログ）',
    category: 'heating',
    tier: 'budget',
    priceRange: '¥2,500–5,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B00BKULMIS?tag=kamelife090e-22',
    asin: 'B00BKULMIS',
    image: '/assets/products/placeholder.webp',
    why: 'ヒーターの過昇温を防ぎ、安全な温度管理を自動化',
    rating: 4.0,
    badge: 'Budget Pick',
    recommendedFor: ['beginner'],
    rakutenSearchTerm: 'サーモスタット 爬虫類 アナログ',
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenItemCode: null,
    rakutenPrice: null,
    rakutenShop: null,
    rakutenConfidence: 5.7,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: null,
  },

  // ── Phase 39-P3 追加（国内メーカー優先・汎用名商品の置き換え） ──
  // kakaku.com / コトブキ工芸公式サイト / charm 等、複数の国内販売サイトで実在・価格確認済み

  thermostat_kotobuki_hydra: {
    id: 'thermostat_kotobuki_hydra',
    // RAKUTEN-ID Phase4: 2026-07-04 に素の item.rakuten.co.jp URL のまま available 化されていた
    // 残置レコード（無報酬CTA）。成果対象URLを確認できないため search へ降格。
    // 正しい affiliateUrl は推測せず、日次 sync の再照合に委ねる
    name: 'コトブキ工芸 ヒュドラサーモ HT-330XD',
    category: 'heating',
    tier: 'budget',
    priceRange: '¥4,000–4,500',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B08L9JRQ2D?tag=kamelife090e-22',
    asin: 'B08L9JRQ2D',
    image: '/assets/products/placeholder.webp',
    why: 'ヒーター2W〜330Wに対応する国内定番サーモスタット。温度制御範囲15〜40℃で爬虫類・小動物・小鳥まで幅広く使える',
    rating: 4.3,
    badge: 'Budget Pick',
    recommendedFor: ['beginner', 'semi_aquatic_small', 'japanese_pond'],
    rakutenSearchTerm: 'コトブキ工芸 ヒュドラサーモ HT-330XD',
    rakutenUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00pyjhn.nhbnncfa.g00pyjhn.nhbnodd2/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fchanet%2F247595%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fchanet%2Fi%2F10974927%2F&rafcid=wsc_i_is_fa8391ab-300d-4c4c-be83-ca2ddfdc47be',
    rakutenStatus: 'available',
    rakutenItemCode: 'chanet:10974927',
    rakutenPrice: 4125,
    rakutenShop: 'charm 楽天市場店',
    rakutenConfidence: 7,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: 'https://thumbnail.image.rakuten.co.jp/@0_mall/chanet/cabinet/2475/247595-1.jpg?_ex=128x128',
  },

  // ── Task2 追加 ──

  heater_aqua_200w: {
    id: 'heater_aqua_200w',
    name: 'ニッソー プロテクトPROヒーター 200W', // Phase 39-P4: web_search確認済みの実商品名に修正
    category: 'heating',
    tier: 'standard',
    priceRange: '¥2,500–5,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B00GN5RFWM?tag=kamelife090e-22',
    asin: 'B00GN5RFWM',
    image: '/assets/products/placeholder.webp',
    why: '90cm以上の大容量水槽の安定した水温維持に',
    rating: 4.4,
    badge: null,
    recommendedFor: ['semi_aquatic_medium', 'fully_aquatic'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'ニッソー プロテクトPROヒーター 200W',
    rakutenConfidence: 5.9,
    rakutenLastUpdated: '2026-07-01',
  },

  thermostat_digital: {
    id: 'thermostat_digital',
    name: 'GEX EXOTERRA タイマーサーモ RTT-1',
    category: 'heating',
    tier: 'premium',
    priceRange: '¥6,000–15,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B00JGLKPFE?tag=kamelife090e-22',
    asin: 'B00JGLKPFE',
    image: '/assets/products/placeholder.webp',
    why: '昼夜の温度スケジュールを自動制御。複数機器の同時管理に対応',
    rating: 4.7,
    badge: 'Premium',
    recommendedFor: ['advanced'],
    rakutenSearchTerm: 'GEX エキゾテラ タイマーサーモ RTT-1',
    rakutenUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00pyjhn.nhbnncfa.g00pyjhn.nhbnodd2/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fchanet%2F186702%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fchanet%2Fi%2F10303510%2F&rafcid=wsc_i_is_fa8391ab-300d-4c4c-be83-ca2ddfdc47be',
    rakutenStatus: 'available',
    rakutenItemCode: 'chanet:10303510',
    rakutenPrice: 9300,
    rakutenShop: 'charm 楽天市場店',
    rakutenConfidence: 8.6,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: 'https://thumbnail.image.rakuten.co.jp/@0_mall/chanet/cabinet/1869/186702-1.jpg?_ex=128x128',
  },

  heater_radiant_panel: {
    id: 'heater_radiant_panel',
    name: 'みどり商会 暖突 Lサイズ',
    category: 'heating',
    tier: 'premium',
    priceRange: '¥8,000–18,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B00BBRG4YW?tag=kamelife090e-22',
    asin: 'B00BBRG4YW',
    image: '/assets/products/placeholder.webp',
    why: 'ケージ天井に取り付けて全体を均一に温めるタイプ。大型リクガメの広いケージで温度ムラが気になる人に',
    rating: 4.6,
    badge: 'Premium',
    recommendedFor: ['tortoise_dry_large', 'advanced'],
    rakutenSearchTerm: 'みどり商会 暖突 Lサイズ',
    rakutenUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00r8a2n.nhbnnc77.g00r8a2n.nhbno0af/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fpalmyexpress%2F4595988631552%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fpalmyexpress%2Fi%2F10010005%2F&rafcid=wsc_i_is_fa8391ab-300d-4c4c-be83-ca2ddfdc47be',
    rakutenStatus: 'available',
    rakutenItemCode: 'palmyexpress:10010005',
    rakutenPrice: 12300,
    rakutenShop: 'PALMY EXPRESS',
    rakutenConfidence: 5.2,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: 'https://thumbnail.image.rakuten.co.jp/@0_mall/palmyexpress/cabinet/11262572/imgrc0113317240.jpg?_ex=128x128',
  },

  heater_cord_20w: {
    id: 'heater_cord_20w',
    name: 'Zoo Med レプティヒートケーブル 25W', // Phase 39-P6: ブランド表記統一（ZOOMED→Zoo Med）
    category: 'heating',
    tier: 'budget',
    priceRange: '¥1,500–3,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B001OVBEEK?tag=kamelife090e-22',
    asin: 'B001OVBEEK',
    image: '/assets/products/placeholder.webp',
    why: 'ケージ側面・底面に這わせて使う万能タイプ。湿度の高い環境でも使用可',
    rating: 3.9,
    badge: 'Budget Pick',
    recommendedFor: ['beginner', 'tortoise_forest'],
    rakutenSearchTerm: 'Zoo Med レプティヒートケーブル 25W', // Phase 39-P6: ワット数不一致(20W→25W)も含め商品名に統一
    rakutenUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00pyjhn.nhbnncfa.g00pyjhn.nhbnodd2/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fchanet%2F177849%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fchanet%2Fi%2F10267941%2F&rafcid=wsc_i_is_fa8391ab-300d-4c4c-be83-ca2ddfdc47be',
    rakutenStatus: 'available',
    rakutenItemCode: 'chanet:10267941',
    rakutenPrice: 5980,
    rakutenShop: 'charm 楽天市場店',
    rakutenConfidence: 5.9,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: 'https://thumbnail.image.rakuten.co.jp/@0_mall/chanet/cabinet/1779/177849-1.jpg?_ex=128x128',
  },

  heater_panel_60: {
    id: 'heater_panel_60',
    name: 'みどり商会 ピタリ適温プラス 3号', // Phase 39-P4: web_search確認済みの実商品名に修正
    category: 'heating',
    tier: 'standard',
    priceRange: '¥4,000–8,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B004IGXYX2?tag=kamelife090e-22',
    asin: 'B004IGXYX2',
    image: '/assets/products/placeholder.webp',
    why: '120cm以上の大型木製ケージの保温補助に。薄型で設置場所を選ばない',
    rating: 4.2,
    badge: null,
    recommendedFor: ['tortoise_dry_large'],
    rakutenSearchTerm: 'みどり商会 ピタリ適温プラス 3号',
    rakutenUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00qk8rn.nhbnnece.g00qk8rn.nhbno36f/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Feco-guerrilla%2Flsmdph3%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Feco-guerrilla%2Fi%2F10006482%2F&rafcid=wsc_i_is_fa8391ab-300d-4c4c-be83-ca2ddfdc47be',
    rakutenStatus: 'available',
    rakutenItemCode: 'eco-guerrilla:10006482',
    rakutenPrice: 6028,
    rakutenShop: '水耕栽培専門店のエコゲリラ',
    rakutenConfidence: 7,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: 'https://thumbnail.image.rakuten.co.jp/@0_mall/eco-guerrilla/cabinet/daiichi/pitari_3_700.jpg?_ex=128x128',
  },

  // ── Phase 39-P1 昇格候補 追加（要Amazon/楽天個別確認、amazon_status/rakuten_status未検証） ──

  thermostat_nisso_generic: {
    id: 'thermostat_nisso_generic',
    name: 'Nisso 爬虫類サーモスタット',
    category: 'heating',
    tier: 'budget',
    priceRange: '¥2,000–4,500',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '国内で流通するサーモスタット。型番により機能差があるため購入前に個別確認が必要',
    rating: 3.8,
    badge: null,
    recommendedFor: ['beginner'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'ニッソー 爬虫類 サーモスタット',
  },

  thermostat_habistat_dimming: {
    id: 'thermostat_habistat_dimming',
    name: 'Habistat Dimming Thermostat',
    category: 'heating',
    tier: 'premium',
    priceRange: '¥10,000–18,000',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: 'ハロゲン・保温球向けのディマー式サーモスタット。上級者向けの精密温度制御',
    rating: 4.4,
    badge: null,
    recommendedFor: ['advanced'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'Habistat Dimming Thermostat 爬虫類',
  },

  /* ══════════════════════════════════════════
     FILTER（フィルター）  9商品
     ══════════════════════════════════════════ */

  filter_small: {
    id: 'filter_small',
    name: 'テトラ オートワンタッチフィルター AT-50', // Phase 39-P4: web_search確認済みの実商品名に修正
    category: 'filter',
    tier: 'budget',
    priceRange: '¥1,500–4,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B0012UO6Q6?tag=kamelife090e-22',
    asin: 'B0012UO6Q6',
    rakutenSearchTerm: 'テトラ オートワンタッチフィルター AT-50',
    image: '/assets/products/placeholder.webp',
    why: '小型水棲ガメの水質維持に。カメは水を汚しやすいため必須',
    rating: 4.1,
    badge: 'Budget Pick',
    recommendedFor: ['semi_aquatic_small', 'japanese_pond'],
    rakutenUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00pyjhn.nhbnncfa.g00pyjhn.nhbnodd2/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fchanet%2F12725%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fchanet%2Fi%2F10023700%2F&rafcid=wsc_i_is_fa8391ab-300d-4c4c-be83-ca2ddfdc47be',
    rakutenStatus: 'available',
    rakutenItemCode: 'chanet:10023700',
    rakutenPrice: 2095,
    rakutenShop: 'charm 楽天市場店',
    rakutenConfidence: 9.3,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: 'https://thumbnail.image.rakuten.co.jp/@0_mall/chanet/cabinet/129/12725-1.jpg?_ex=128x128',
  },

  filter_canister_medium: {
    id: 'filter_canister_medium',
    name: 'EHEIM クラシック 2213 外部フィルター', // Phase 39-P2: 旧名は汎用表記。楽天URL(minatodenk/eheim-2213)が示す実商品名に修正
    category: 'filter',
    tier: 'standard',
    priceRange: '¥8,000–20,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B002S152LG?tag=kamelife090e-22',
    asin: 'B002S152LG',
    rakutenSearchTerm: 'EHEIM クラシック 2213 外部フィルター',
    image: '/assets/products/placeholder.webp',
    why: '水量の多い大型水槽向け。ろ過能力が高く水換え頻度を削減',
    rating: 4.5,
    badge: 'Best Overall',
    recommendedFor: ['semi_aquatic_medium', 'fully_aquatic'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenItemCode: null,
    rakutenPrice: null,
    rakutenShop: null,
    rakutenConfidence: 8.8,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: null,
  },

  filter_canister_large: {
    id: 'filter_canister_large',
    name: 'EHEIM クラシック 2215 外部フィルター', // Phase 39-P2: 旧名は汎用表記。楽天URL(minatodenk/eheim-2215)が示す実商品名に修正
    category: 'filter',
    tier: 'premium',
    priceRange: '¥15,000–35,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B002OCNJXM?tag=kamelife090e-22',
    asin: 'B002OCNJXM',
    rakutenSearchTerm: 'EHEIM クラシック 2215 外部フィルター',
    image: '/assets/products/placeholder.webp',
    why: '大型半水棲・完全水棲ガメの90cm以上水槽に対応',
    rating: 4.7,
    badge: 'Premium',
    recommendedFor: ['fully_aquatic', 'advanced'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenItemCode: null,
    rakutenPrice: null,
    rakutenShop: null,
    rakutenConfidence: 8.4,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: null,
  },

  // ── Task2 追加 ──

  filter_hang_on: {
    id: 'filter_hang_on',
    name: '外掛け式フィルター',
    category: 'filter',
    tier: 'budget',
    priceRange: '¥2,000–5,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B003A2JS76?tag=kamelife090e-22',
    asin: 'B003A2JS76',
    image: '/assets/products/placeholder.webp',
    why: '水槽縁に掛けるだけで設置完了。初心者に使いやすい入門フィルター',
    rating: 3.8,
    badge: 'Budget Pick',
    recommendedFor: ['beginner'],
    rakutenSearchTerm: '外掛け フィルター 爬虫類 亀',
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenItemCode: null,
    rakutenPrice: null,
    rakutenShop: null,
    rakutenConfidence: 3.2,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: null,
  },

  filter_sponge_dual: {
    id: 'filter_sponge_dual',
    name: 'ダブルスポンジフィルター',
    category: 'filter',
    tier: 'budget',
    priceRange: '¥800–2,500',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '生物ろ過に優れたシンプル構造で清掃しやすい。水棲ガメを初めて飼う人の入門フィルターに',
    rating: 4.0,
    badge: 'Budget Pick',
    recommendedFor: ['beginner', 'semi_aquatic_small'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'スポンジフィルター ダブル 亀 水槽',
  },

  filter_canister_premium: {
    id: 'filter_canister_premium',
    name: 'EHEIM クラシック 2217',
    category: 'filter',
    tier: 'premium',
    priceRange: '¥18,000–28,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B002SGX79U?tag=kamelife090e-22',
    asin: 'B002SGX79U',
    rakutenSearchTerm: 'エーハイム クラシック 2217',
    image: '/assets/products/placeholder.webp',
    why: '外部フィルターの定番モデル。ろ過能力と静音性が高く、長期間使い続けるユーザーが多い。国内流通の 2217-NEW（2217330）はろ材別売のため、メック・サブストラット(プロ)・パッドを別途そろえる',
    rating: 4.9,
    badge: 'Premium',
    recommendedFor: ['fully_aquatic', 'advanced'],
    rakutenUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00pyjhn.nhbnncfa.g00pyjhn.nhbnodd2/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fchanet%2F45560%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fchanet%2Fi%2F10034011%2F&rafcid=wsc_i_is_fa8391ab-300d-4c4c-be83-ca2ddfdc47be',
    rakutenStatus: 'available',
    rakutenItemCode: 'chanet:10034011',
    rakutenPrice: 26997,
    rakutenShop: 'charm 楽天市場店',
    rakutenConfidence: 7.7,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: 'https://thumbnail.image.rakuten.co.jp/@0_mall/chanet/cabinet/459/45560-1.jpg?_ex=128x128',
  },

  filter_canister_xl: {
    id: 'filter_canister_xl',
    name: 'GEX メガパワー 6090 外部フィルター',
    category: 'filter',
    tier: 'premium',
    priceRange: '¥20,000–40,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B004FZ99HG?tag=kamelife090e-22',
    asin: 'B004FZ99HG',
    image: '/assets/products/placeholder.webp',
    why: 'カメの糞や食べ残しで汚れやすい水槽でも、大容量でろ過が追いつきやすい外部フィルター',
    rating: 4.8,
    badge: 'Premium',
    recommendedFor: ['fully_aquatic', 'advanced'],
    rakutenSearchTerm: 'GEX メガパワー 6090 外部フィルター', // Phase 39-P1: 旧値はFluval表記で商品名(GEX)と不整合だったため自身の商品名に修正
    rakutenUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00pyjhn.nhbnncfa.g00pyjhn.nhbnodd2/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fchanet%2F45364%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fchanet%2Fi%2F10045248%2F&rafcid=wsc_i_is_fa8391ab-300d-4c4c-be83-ca2ddfdc47be',
    rakutenStatus: 'available',
    rakutenItemCode: 'chanet:10045248',
    rakutenPrice: 8980,
    rakutenShop: 'charm 楽天市場店',
    rakutenConfidence: 9.4,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: 'https://thumbnail.image.rakuten.co.jp/@0_mall/chanet/cabinet/453/45364-1.jpg?_ex=128x128',
  },

  filter_submersible_medium: {
    id: 'filter_submersible_medium',
    name: 'GEX AQUA FILTER e-ROKA PF701', // Phase 39-P4: web_search確認済みの実商品名に修正（国内GEXブランド）
    category: 'filter',
    tier: 'standard',
    priceRange: '¥3,000–7,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B004PQMP44?tag=kamelife090e-22',
    asin: 'B004PQMP44',
    image: '/assets/products/placeholder.webp',
    why: '60〜90cm水槽に対応。省スペースで強力なろ過を発揮',
    rating: 4.2,
    badge: null,
    recommendedFor: ['semi_aquatic_medium'],
    rakutenSearchTerm: 'GEX AQUA FILTER e-ROKA PF701',
    rakutenUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00tf5pn.nhbnnc05.g00tf5pn.nhbno1cf/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fr-style-ra%2F20240606185858_67%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fr-style-ra%2Fi%2F10052769%2F&rafcid=wsc_i_is_fa8391ab-300d-4c4c-be83-ca2ddfdc47be',
    rakutenStatus: 'available',
    rakutenItemCode: 'r-style-ra:10052769',
    rakutenPrice: 2796,
    rakutenShop: 'セレクトショップ RST',
    rakutenConfidence: 7.9,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: 'https://thumbnail.image.rakuten.co.jp/@0_mall/r-style-ra/cabinet/r_2023101209/20240606185858_67_1.jpg?_ex=128x128',
  },

  filter_turtle_clean: {
    id: 'filter_turtle_clean',
    name: 'テトラ レプトフィルター 10i',
    category: 'filter',
    tier: 'standard',
    priceRange: '¥4,000–9,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B000NGQZU0?tag=kamelife090e-22',
    asin: 'B000NGQZU0',
    image: '/assets/products/placeholder.webp',
    why: 'カメ飼育専用設計。浅い水位でも稼働し物理・生物・化学の3段ろ過を実現',
    rating: 4.4,
    badge: 'Best Overall',
    recommendedFor: ['semi_aquatic_small', 'japanese_pond'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'テトラ レプトフィルター 亀 フィルター',
  },

  // ── Phase 39-P1 昇格候補 追加（要Amazon/楽天個別確認、amazon_status/rakuten_status未検証） ──

  filter_fluval_fx6: {
    id: 'filter_fluval_fx6',
    name: 'Fluval FX6 外部フィルター',
    category: 'filter',
    tier: 'premium',
    priceRange: '¥25,000–40,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B00BJQ50HC?tag=kamelife090e-22',
    asin: 'B00BJQ50HC',
    image: '/assets/products/placeholder.webp',
    why: '大型水棲ガメ・大容量水槽向けの最上位外部フィルター。海外飼育者の使用実績多数',
    rating: 4.8,
    badge: null,
    recommendedFor: ['fully_aquatic', 'advanced'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'Fluval FX6 外部フィルター',
  },

  // ── 水質検査薬（2026-09-08 商品不足監査 P1）──
  // category 'water_test' は EQUIPMENT_MAP / SK_CAT_ORDER に無い＝キット非表示。種・水質条件ごとの必要性を確認するまで自動配線しない。
  // Amazon identity は 2026-09-08 に /dp/<ASIN> を URL 照合済み（固定入力）。メーカー公式 spectrumbrands.jp は egress 遮断のため、仕様は公式ページの検索抜粋と販売店転載値で確認。
  // 役割分離: NH3/NH4+ ＝ アンモニア確認（立ち上げ初期・フィルター交換後・大量給餌後・臭い/白濁時）。6in1 ＝ NO2/NO3/pH/GH/KH/Cl2 の日常監視。**6in1 はアンモニアを測れない。**
  water_test_tetra_nh3: {
    id: 'water_test_tetra_nh3',
    name: 'テトラ テスト試験紙 NH3/NH4+（アンモニア）25回',
    category: 'water_test',
    tier: 'standard',
    priceRange: '',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B0GN1MFFPD?tag=kamelife090e-22',
    asin: 'B0GN1MFFPD',
    image: '/assets/products/placeholder.webp',
    why: '飼育水の総アンモニア（NH3＋NH4+）を確認する試験紙。立ち上げ初期・フィルター交換後・大量給餌後・水が臭う／白濁したときに使う。付属試薬を入れた水に1秒浸し、1分後に比色する。同じ総アンモニア値でも pH が高く水温が高いほど有毒な NH3 の割合が増えるため、数値は pH・水温と合わせて読む。「何 mg/L までなら亀に安全」という閾値は根拠がないため示さない',
    rating: null,
    badge: null,
    recommendedFor: [],
    amazonIdentity: 'AMAZON_IDENTITY_VERIFIED',
    compatibility: 'COMPATIBILITY_PARTIAL',
    compatibilityNote: 'メーカー: スペクトラム ブランズ ジャパン（テトラ）。総アンモニア（NH3/NH4+）を測る（NH3 単独ではない）。淡水: 公式・販売店とも対応。海水: 公式ページ名は「淡水・海水用」だが charm / yodobashi / rva / joyfulhonda は「淡水用」表記で不一致。汽水: どの資料にも記載なし。測定範囲・単位（mg/L の段階）は公式が egress 遮断で未取得。25回・判定 1分・試験紙＋付属試薬方式。淡水以外と測定範囲が未確定のため PARTIAL',
    measurementItems: ['総アンモニア（NH3+NH4+）'],
    measurementStatus: 'MEASUREMENT_ITEMS_PARTIAL',
    waterType: { freshwater: 'VERIFIED', brackish: 'UNVERIFIED', marine: 'PARTIAL' },
    testMethod: '試験紙（付属のアクティベーター・シリンジ・検査チューブで検水を調製し、1秒浸漬・1分後比色）',
    useCase: 'USE_CASE_VERIFIED',
    useCaseNote: 'アンモニア確認: 立ち上げ初期／フィルター交換後／大量給餌後／臭い・白濁／排泄量が多い／ろ過能力不足の疑い',
    linkHold: true,
    rakutenSearchTerm: 'テトラ テスト試験紙 NH3 NH4 アンモニア 25回',
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenItemCode: null,
    rakutenPrice: null,
    rakutenShop: null,
    rakutenConfidence: 4,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: null,
  },

  water_test_tetra_6in1: {
    id: 'water_test_tetra_6in1',
    name: 'テトラ テスト 6in1 試験紙（淡水用）25枚',
    category: 'water_test',
    tier: 'standard',
    priceRange: '',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B002FBISEC?tag=kamelife090e-22',
    asin: 'B002FBISEC',
    image: '/assets/products/placeholder.webp',
    why: 'pH・KH・GH・亜硝酸塩（NO2）・硝酸塩（NO3）・塩素（Cl2）の6項目を試験紙1枚・60秒で確認する日常監視用。NO2/NO3 で生物ろ過の状態と換水時期を見る。アンモニアは測れないので、アンモニア確認は NH3/NH4+ 試験紙を別に使う。淡水用（海水では使わない・汽水は記載なし）',
    rating: null,
    badge: null,
    recommendedFor: [],
    amazonIdentity: 'AMAZON_IDENTITY_VERIFIED',
    compatibility: 'COMPATIBILITY_VERIFIED',
    compatibilityNote: 'メーカー: スペクトラム ブランズ ジャパン（テトラ）。公式・販売店とも「淡水用」で一致。海水: 非対応（製品区分外）。汽水: 記載なし（UNVERIFIED）。測定範囲（公式抜粋）: pH 6.4〜8.4／KH 0〜20°dH／GH <3〜>16°dH／NO2 0〜10 mg/L／NO3 0〜250 mg/L／Cl2 0〜3 mg/L。判定 60秒・25枚。Cl2 は水道水の残留塩素確認に使える可能性があるが検出下限が未確認',
    measurementItems: ['pH', 'KH', 'GH', 'NO2', 'NO3', 'Cl2'],
    measurementStatus: 'MEASUREMENT_ITEMS_VERIFIED',
    waterType: { freshwater: 'VERIFIED', brackish: 'UNVERIFIED', marine: 'NOT_SUPPORTED' },
    testMethod: '試験紙（1秒浸漬・60秒後比色）',
    useCase: 'USE_CASE_VERIFIED',
    useCaseNote: '日常監視: NO2/NO3 で生物ろ過と換水時期、pH/GH/KH は種・飼育水に応じた補助指標。アンモニアの代用にはならない',
    linkHold: false, // 2026-09-08 Owner 採用。公開導線は guides/filter-guide.html の1箇所のみ（species への一斉配線はしない）
    publicLinkPages: ['guides/filter-guide.html'],
    rakutenSearchTerm: 'テトラ テスト 6in1 試験紙 25枚',
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenItemCode: null,
    rakutenPrice: null,
    rakutenShop: null,
    rakutenConfidence: 6.2,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: null,
  },

  // ── 灯具（2026-09-08 商品不足監査 P1）──
  // category 'fixture' は EQUIPMENT_MAP / SK_CAT_ORDER に無い＝キット非表示。UVB球・バスキング球ごとに口金・W数・耐熱適合を確認するまで自動配線しない。
  // Amazon identity は 2026-09-08 に /dp/<ASIN> を URL 照合済み（固定入力）。メーカー公式 product.gex-fp.co.jp は egress 遮断のため、仕様は販売店が転載する GEX 公表値で確認。
  fixture_exoterra_light_dome_14: {
    id: 'fixture_exoterra_light_dome_14',
    name: 'GEX エキゾテラ ライトドーム 14cm PT2055',
    category: 'fixture',
    tier: 'standard',
    priceRange: '',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B00J58ROJS?tag=kamelife090e-22',
    asin: 'B00J58ROJS',
    image: '/assets/products/placeholder.webp',
    why: 'E26 口金のアルミ反射ドーム灯具。白熱系バスキング球は 75W まで、コンパクト UVB 蛍光球は 26W まで。ソーラーグロー UV（80W/125W 水銀灯）は定格電流不足で使用不可。付属ハンガーでケージ上部から吊り下げて使う（直置き禁止）。屋内専用',
    rating: null,
    badge: null,
    recommendedFor: [],
    amazonIdentity: 'AMAZON_IDENTITY_VERIFIED',
    compatibility: 'COMPATIBILITY_PARTIAL',
    compatibilityNote: 'メーカー: GEX（エキゾテラ）／型番 PT2055／口金 E26／最大 白熱球 75W・UV 球 26W／対応: 白熱系バスキング球・コンパクト UVB 蛍光球／不可: 水銀灯（ソーラーグロー UV 80W・125W）／セラミックヒーター: GEX 公表値に記載なし（未確認）／方式: 吊り下げ（ハンガー付属・直置き禁止）／屋内専用／外径 13.8cm・内径 12.8cm・高さ 16.9cm（フック含み 22cm）／耐熱条件: 公表値なし。GEX 公式ページは BLOCKED_EGRESS。セラミックヒーター可否と耐熱条件が未確認のため PARTIAL',
    linkHold: true,
    fixtureSpec: { socket: 'E26', maxIncandescentW: 75, maxUvbCompactW: 26, mercuryVapor: false, ceramicHeater: 'UNVERIFIED', mount: 'hanging', indoorOnly: true },
    rakutenSearchTerm: 'GEX エキゾテラ ライトドーム 14cm PT2055',
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenItemCode: null,
    rakutenPrice: null,
    rakutenShop: null,
    rakutenConfidence: 6.2,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: null,
  },

  fixture_gex_light_stand: {
    id: 'fixture_gex_light_stand',
    name: 'GEX エキゾテラ ライトスタンド（ライトドーム設置用・高さ53〜89cm）',
    category: 'fixture',
    tier: 'standard',
    priceRange: '',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B07FHM2YKH?tag=kamelife090e-22',
    asin: 'B07FHM2YKH',
    image: '/assets/products/placeholder.webp',
    why: 'ライトドームを安全に吊り下げて高さ調整するための GEX 純正の専用スタンド。高さ 53〜89cm で調節でき、土台をグラステラリウム・レプテリアの底面に差し込んで使う',
    rating: null,
    badge: null,
    recommendedFor: [],
    amazonIdentity: 'AMAZON_IDENTITY_VERIFIED',
    compatibility: 'COMPATIBILITY_VERIFIED',
    compatibilityNote: 'メーカー: GEX（エキゾテラ）／GEX 公式名「ライトスタンド ライトドーム設置用スタンド」＝ライトドーム（14cm / 18cm）の吊り下げ専用と機種指定／高さ 53〜89cm／スタンド部 約幅17×高さ48cm・ベース 約45cm・土台 約25×14×4.5cm／材質 アルミ・スチール／据え置き（ケージ底面差し込み）／耐荷重は公表値なし（ライトドームを吊る用途に限る）。口金・W数は灯具側（ライトドーム）の値に従う',
    fixtureSpec: { mount: 'floor_stand', heightRangeCm: [53, 89], forFixture: ['fixture_exoterra_light_dome_14'] },
    rakutenSearchTerm: 'GEX エキゾテラ ライトスタンド ライトドーム',
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenItemCode: null,
    rakutenPrice: null,
    rakutenShop: null,
    rakutenConfidence: 6.2,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: null,
  },

  // ── 外部フィルター対応ろ材（2026-09-08 商品不足監査 P1）──
  // category 'filter_media' は EQUIPMENT_MAP / SK_CAT_ORDER に無い＝キットには出ない。water-filter-best10 の「対応ろ材」導線から参照する。
  // ASIN は WebSearch("<ASIN>", amazon.co.jp) で /dp/<ASIN> を URL 照合済み。メーカー公式（eheim.jp / gex-fp.co.jp / fluvalaquatics.com）は egress 遮断のため未読。
  // 詳細は docs/filter-media-map.md。価格は未取得のため空欄。
  media_eheim_2211_coarse: {
    id: 'media_eheim_2211_coarse',
    name: 'エーハイム 2211専用 粗目フィルターパッド 2枚入',
    category: 'filter_media',
    tier: 'standard',
    priceRange: '',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B004WI1I02?tag=kamelife090e-22',
    asin: 'B004WI1I02',
    image: '/assets/products/placeholder.webp',
    why: 'クラシック2211の純正・粗目（青）パッド。ろ材の最下段（給水側）でフンや食べ残しを先に捕る物理ろ材。弾力がなくなったら交換（目安6か月）。2213/2215用は径が違うので流用不可',
    rating: null,
    badge: null,
    recommendedFor: [],
    amazonIdentity: 'AMAZON_IDENTITY_VERIFIED',
    compatibility: 'COMPATIBILITY_VERIFIED',
    compatibilityNote: 'EHEIM Japan 品番 2616112（国際品番 2616111 と同一の 2211 用 2枚入・末尾差は市場SKU差）。JAN 4011708260760・9.5×9.5×2cm。eheim.jp 一次資料は egress 遮断のため販売店複数の型番表記で確認',
    mediaRole: 'mechanical_coarse',
    compatibleFilters: [],
    compatibleModels: ['EHEIM classic 2211'],
    rakutenSearchTerm: 'エーハイム 2211 粗目フィルターパッド',
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenItemCode: null,
    rakutenPrice: null,
    rakutenShop: null,
    rakutenConfidence: 5.9,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: null,
  },

  media_eheim_2211_fine: {
    id: 'media_eheim_2211_fine',
    name: 'エーハイム 2211専用 細目フィルターパッド 3枚入',
    category: 'filter_media',
    tier: 'standard',
    priceRange: '',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B004WI1I1G?tag=kamelife090e-22',
    asin: 'B004WI1I1G',
    image: '/assets/products/placeholder.webp',
    why: 'クラシック2211の純正・細目（白）パッド。ろ材の最上段（排水側）で細かい濁りを仕上げ捕集する。目詰まりしたら交換する消耗品',
    rating: null,
    badge: null,
    recommendedFor: [],
    amazonIdentity: 'AMAZON_IDENTITY_VERIFIED',
    compatibility: 'COMPATIBILITY_VERIFIED',
    compatibilityNote: 'EHEIM Japan 品番 2616116（国際 2616115 と同一の 2211 用 3枚入）。販売店複数の型番表記で確認',
    mediaRole: 'mechanical_fine',
    compatibleFilters: [],
    compatibleModels: ['EHEIM classic 2211'],
    rakutenSearchTerm: 'エーハイム 2211 細目フィルターパッド',
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenItemCode: null,
    rakutenPrice: null,
    rakutenShop: null,
    rakutenConfidence: 6.2,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: null,
  },

  media_eheim_2213_coarse: {
    id: 'media_eheim_2213_coarse',
    name: 'エーハイム 2213専用 粗目フィルターパッド 2枚入',
    category: 'filter_media',
    tier: 'standard',
    priceRange: '',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B004WI233I?tag=kamelife090e-22',
    asin: 'B004WI233I',
    image: '/assets/products/placeholder.webp',
    why: 'クラシック2213の純正・粗目（青）パッド。最下段（給水側）でフンや食べ残しを先に捕る。カメ水槽では汚れが多いので、生物ろ材より先にここで粗ゴミを止める構成が基本',
    rating: null,
    badge: null,
    recommendedFor: [],
    amazonIdentity: 'AMAZON_IDENTITY_VERIFIED',
    compatibility: 'COMPATIBILITY_VERIFIED',
    compatibilityNote: 'EHEIM Japan 品番 2616132（国際 2616131 と同一の 2213 用 2枚入）。yodobashi / minatodenki / aquatailors の型番表記で確認',
    mediaRole: 'mechanical_coarse',
    compatibleFilters: ['filter_canister_medium'],
    compatibleModels: ['EHEIM classic 2213'],
    rakutenSearchTerm: 'エーハイム 2213 粗目フィルターパッド',
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenItemCode: null,
    rakutenPrice: null,
    rakutenShop: null,
    rakutenConfidence: 7.2,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: null,
  },

  media_eheim_2213_fine: {
    id: 'media_eheim_2213_fine',
    name: 'エーハイム 2213専用 細目フィルターパッド 3枚入',
    category: 'filter_media',
    tier: 'standard',
    priceRange: '',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B004FLGIGK?tag=kamelife090e-22',
    asin: 'B004FLGIGK',
    image: '/assets/products/placeholder.webp',
    why: 'クラシック2213の純正・細目（白）パッド。最上段（排水側）の仕上げ用。目詰まりしたら新品に替える',
    rating: null,
    badge: null,
    recommendedFor: [],
    amazonIdentity: 'AMAZON_IDENTITY_VERIFIED',
    compatibility: 'COMPATIBILITY_VERIFIED',
    compatibilityNote: 'EHEIM Japan 品番 2616136（国際 2616135 と同一の 2213 用 3枚入）。販売店複数の型番表記で確認',
    mediaRole: 'mechanical_fine',
    compatibleFilters: ['filter_canister_medium'],
    compatibleModels: ['EHEIM classic 2213'],
    rakutenSearchTerm: 'エーハイム 2213 細目フィルターパッド',
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenItemCode: null,
    rakutenPrice: null,
    rakutenShop: null,
    rakutenConfidence: 6.8,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: null,
  },

  media_eheim_2213_carbon: {
    id: 'media_eheim_2213_carbon',
    name: 'エーハイム 2213専用 活性炭フィルターパッド 3枚入',
    category: 'filter_media',
    tier: 'standard',
    priceRange: '',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B004WI234M?tag=kamelife090e-22',
    asin: 'B004WI234M',
    image: '/assets/products/placeholder.webp',
    why: 'クラシック2213の純正・活性炭パッド。必要時のみ／薬剤使用後・立ち上げ直後の黄ばみ取りなど用途限定で最上段に入れる化学ろ材。常用必須ではなく、吸着が終わったら外す',
    rating: null,
    badge: null,
    recommendedFor: [],
    amazonIdentity: 'AMAZON_IDENTITY_VERIFIED',
    compatibility: 'COMPATIBILITY_PARTIAL',
    compatibilityNote: '「2213専用」の純正表記はあるが型番を確認できていない。用途限定品（必要時のみ／薬剤使用後・立ち上げ直後の黄ばみ取り）。常用必須ではないため購入導線には出さない',
    linkHold: true,
    mediaRole: 'chemical_carbon',
    compatibleFilters: ['filter_canister_medium'],
    compatibleModels: ['EHEIM classic 2213'],
    rakutenSearchTerm: 'エーハイム 2213 活性炭フィルターパッド',
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenItemCode: null,
    rakutenPrice: null,
    rakutenShop: null,
    rakutenConfidence: 6.6,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: null,
  },

  media_eheim_2215_coarse: {
    id: 'media_eheim_2215_coarse',
    name: 'エーハイム 2215専用 粗目フィルターパッド 2枚入',
    category: 'filter_media',
    tier: 'standard',
    priceRange: '',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B0014FKJNS?tag=kamelife090e-22',
    asin: 'B0014FKJNS',
    image: '/assets/products/placeholder.webp',
    why: 'クラシック2215の純正・粗目（青）パッド。最下段（給水側）で粗ゴミを先に捕る。2213用より大径なので機種を間違えない',
    rating: null,
    badge: null,
    recommendedFor: [],
    amazonIdentity: 'AMAZON_IDENTITY_VERIFIED',
    compatibility: 'COMPATIBILITY_VERIFIED',
    compatibilityNote: 'EHEIM 品番 2616151（Amazon 表記・国際品番一致・2215 用 2枚入）',
    mediaRole: 'mechanical_coarse',
    compatibleFilters: ['filter_canister_large'],
    compatibleModels: ['EHEIM classic 2215'],
    rakutenSearchTerm: 'エーハイム 2215 粗目フィルターパッド',
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenItemCode: null,
    rakutenPrice: null,
    rakutenShop: null,
    rakutenConfidence: 6.6,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: null,
  },

  media_eheim_2215_fine: {
    id: 'media_eheim_2215_fine',
    name: 'エーハイム 2215専用 細目フィルターパッド 3枚入',
    category: 'filter_media',
    tier: 'standard',
    priceRange: '',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B0014FIOLM?tag=kamelife090e-22',
    asin: 'B0014FIOLM',
    image: '/assets/products/placeholder.webp',
    why: 'クラシック2215の純正・細目（白）パッド。最上段（排水側）の仕上げ用',
    rating: null,
    badge: null,
    recommendedFor: [],
    amazonIdentity: 'AMAZON_IDENTITY_VERIFIED',
    compatibility: 'COMPATIBILITY_VERIFIED',
    compatibilityNote: 'EHEIM 品番 2616155（Amazon 表記・国際品番一致・2215 用 3枚入）',
    mediaRole: 'mechanical_fine',
    compatibleFilters: ['filter_canister_large'],
    compatibleModels: ['EHEIM classic 2215'],
    rakutenSearchTerm: 'エーハイム 2215 細目フィルターパッド',
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenItemCode: null,
    rakutenPrice: null,
    rakutenShop: null,
    rakutenConfidence: 6.2,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: null,
  },

  media_eheim_2217_fine: {
    id: 'media_eheim_2217_fine',
    name: 'エーハイム 2217用 細目フィルターパッド 6枚入',
    category: 'filter_media',
    tier: 'standard',
    priceRange: '',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B00E0GLA04?tag=kamelife090e-22',
    asin: 'B00E0GLA04',
    image: '/assets/products/placeholder.webp',
    why: 'クラシック2217の純正・細目（白）パッド6枚。最上段（排水側）の仕上げ用。2217用の粗目パッドは Amazon 商品ページを URL 照合できていないため未掲載',
    rating: null,
    badge: null,
    recommendedFor: [],
    amazonIdentity: 'AMAZON_IDENTITY_VERIFIED',
    compatibility: 'COMPATIBILITY_VERIFIED',
    compatibilityNote: 'EHEIM Japan 品番 2217998（2217 用 6枚入・yodobashi 同型の 2213998 と同じ命名）。国際 2616175 は 1枚入で別SKU',
    mediaRole: 'mechanical_fine',
    compatibleFilters: ['filter_canister_premium'],
    compatibleModels: ['EHEIM classic 2217'],
    rakutenSearchTerm: 'エーハイム 2217 細目フィルターパッド',
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenItemCode: null,
    rakutenPrice: null,
    rakutenShop: null,
    rakutenConfidence: 5.9,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: null,
  },

  media_eheim_substrat_pro_1l: {
    id: 'media_eheim_substrat_pro_1l',
    name: 'エーハイム サブストラットプロ レギュラー 1リットル',
    category: 'filter_media',
    tier: 'standard',
    priceRange: '',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B005G0OUSW?tag=kamelife090e-22',
    asin: 'B005G0OUSW',
    image: '/assets/products/placeholder.webp',
    why: 'クラシック共通の純正・生物ろ材（焼結ガラス・6〜11mm）。付属分の補充・部分交換用。一度に全量を替えるとバクテリアがリセットされるので、必ず半量ずつ入れ替える',
    rating: null,
    badge: null,
    recommendedFor: [],
    amazonIdentity: 'AMAZON_IDENTITY_VERIFIED',
    compatibility: 'COMPATIBILITY_PARTIAL',
    compatibilityNote: 'クラシック全機種の付属生物ろ材そのもの（適合は確実）。ただし全量交換に必要な容量（2213 で 2L 相当等）は一次資料で未確認。補充・半量交換用として保持し、購入導線には出さない',
    linkHold: true,
    mediaRole: 'biological',
    compatibleFilters: ['filter_canister_medium', 'filter_canister_large', 'filter_canister_premium'],
    compatibleModels: ['EHEIM classic 2211', 'EHEIM classic 2213', 'EHEIM classic 2215', 'EHEIM classic 2217'],
    rakutenSearchTerm: 'エーハイム サブストラットプロ レギュラー 1L',
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenItemCode: null,
    rakutenPrice: null,
    rakutenShop: null,
    rakutenConfidence: 7.6,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: null,
  },

  media_eheim_mech_1l: {
    id: 'media_eheim_mech_1l',
    name: 'エーハイム エーハイムメック 1L',
    category: 'filter_media',
    tier: 'standard',
    priceRange: '',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B075VM8C5P?tag=kamelife090e-22',
    asin: 'B075VM8C5P',
    image: '/assets/products/placeholder.webp',
    why: 'クラシック共通の純正・セラミックリング。最下段で粗目パッドと組んで大きな汚れを捕り、通水性を保つ物理ろ材。洗って繰り返し使える',
    rating: null,
    badge: null,
    recommendedFor: [],
    amazonIdentity: 'AMAZON_IDENTITY_VERIFIED',
    compatibility: 'COMPATIBILITY_PARTIAL',
    compatibilityNote: 'クラシック全機種の付属物理ろ材そのもの（適合は確実）。必要容量は一次資料で未確認。補充用として保持し、購入導線には出さない',
    linkHold: true,
    mediaRole: 'mechanical_ring',
    compatibleFilters: ['filter_canister_medium', 'filter_canister_large', 'filter_canister_premium'],
    compatibleModels: ['EHEIM classic 2211', 'EHEIM classic 2213', 'EHEIM classic 2215', 'EHEIM classic 2217'],
    rakutenSearchTerm: 'エーハイム メック 1L',
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenItemCode: null,
    rakutenPrice: null,
    rakutenShop: null,
    rakutenConfidence: 7.6,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: null,
  },

  media_gex_6090_set: {
    id: 'media_gex_6090_set',
    name: 'GEX メガパワー 6090用 交換ろ材セット',
    category: 'filter_media',
    tier: 'standard',
    priceRange: '',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B076MDP7WD?tag=kamelife090e-22',
    asin: 'B076MDP7WD',
    image: '/assets/products/placeholder.webp',
    why: 'メガパワー6090の純正交換セット（メガスポンジ・メガマット・メガバイオ・メガカーボン）。エーハイム用パッドは形が合わないので流用不可。バイオ（生物ろ材）は全量同時交換せず半量ずつ',
    rating: null,
    badge: null,
    recommendedFor: [],
    amazonIdentity: 'AMAZON_IDENTITY_VERIFIED',
    compatibility: 'COMPATIBILITY_VERIFIED',
    compatibilityNote: 'GEX 公式の機種指定「6090用」交換セット（メガマット6090用 GM-18161 / メガスポンジ6090用 / メガカーボン / メガバイオ）。投入順の図は取説 PDF が egress 遮断で未確認',
    mediaRole: 'replacement_set',
    compatibleFilters: ['filter_canister_xl'],
    compatibleModels: ['GEX メガパワー 6090'],
    rakutenSearchTerm: 'GEX メガパワー 6090 交換ろ材セット',
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenItemCode: null,
    rakutenPrice: null,
    rakutenShop: null,
    rakutenConfidence: 5.6,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: null,
  },

  media_gex_2045_set: {
    id: 'media_gex_2045_set',
    name: 'GEX メガパワー2045用 交換ろ材セット',
    category: 'filter_media',
    tier: 'standard',
    priceRange: '',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B077N2ZDLN?tag=kamelife090e-22',
    asin: 'B077N2ZDLN',
    image: '/assets/products/placeholder.webp',
    why: 'メガパワー2045の純正交換セット（メガマットダブル＝ウールマット＋スポンジマット、ほか）。6090用とはサイズが違うので機種名で選ぶ',
    rating: null,
    badge: null,
    recommendedFor: [],
    amazonIdentity: 'AMAZON_IDENTITY_VERIFIED',
    compatibility: 'COMPATIBILITY_VERIFIED',
    compatibilityNote: 'GEX 公式の機種指定「2045用」交換セット（メガマットダブル2045 / メガバイオカーボン / クリーンバイオ リングN・2/3量交換）。投入順の図は未確認',
    mediaRole: 'replacement_set',
    compatibleFilters: [],
    compatibleModels: ['GEX メガパワー 2045'],
    rakutenSearchTerm: 'GEX メガパワー 2045 交換ろ材セット',
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenItemCode: null,
    rakutenPrice: null,
    rakutenShop: null,
    rakutenConfidence: 4.2,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: null,
  },

  media_fluval_fx_biofoam: {
    id: 'media_fluval_fx_biofoam',
    name: 'Fluval FX5/FX6 Bio-Foam（A239・2枚入）',
    category: 'filter_media',
    tier: 'standard',
    priceRange: '',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B00D6DRSK8?tag=kamelife090e-22',
    asin: 'B00D6DRSK8',
    image: '/assets/products/placeholder.webp',
    why: 'Fluval FX4/FX5/FX6 純正のフォーム。本体側面の3段フォームとして粗ゴミを捕る物理ろ材。エーハイム用パッドは使えない。Biomax・ポリッシングパッド・カーボンの純正品は amazon.co.jp で商品ページを確認できていない',
    rating: null,
    badge: null,
    recommendedFor: [],
    amazonIdentity: 'AMAZON_IDENTITY_VERIFIED',
    compatibility: 'COMPATIBILITY_VERIFIED',
    compatibilityNote: 'Fluval 公式型番 A239＝FX4/FX5/FX6 用 Bio-Foam 2枚。EHEIM 用パッドは使えない',
    mediaRole: 'mechanical_coarse',
    compatibleFilters: ['filter_fluval_fx6'],
    compatibleModels: ['Fluval FX4', 'Fluval FX5', 'Fluval FX6'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'Fluval FX6 Bio-Foam A239',
  },


  /* ══════════════════════════════════════════
     SUBSTRATE（床材）  9商品
     ══════════════════════════════════════════ */

  substrate_soil: {
    id: 'substrate_soil',
    name: '赤玉土（小粒）14L',
    category: 'substrate',
    tier: 'budget',
    priceRange: '¥500–1,500',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B0CJM4TL3Q?tag=kamelife090e-22',
    asin: 'B0CJM4TL3Q',
    rakutenSearchTerm: '赤玉土 小粒 爬虫類',
    image: '/assets/products/placeholder.webp',
    why: 'リクガメの定番床材。保湿性と排水性のバランスが良く経済的',
    rating: 4.3,
    badge: 'Budget Pick',
    recommendedFor: ['tortoise_dry_small', 'tortoise_dry_large'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenItemCode: null,
    rakutenPrice: null,
    rakutenShop: null,
    rakutenConfidence: 8.1,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: null,
  },

  substrate_coco: {
    id: 'substrate_coco',
    name: 'ジクラ 万能ヤシガラマット 細目 8L',
    category: 'substrate',
    tier: 'budget',
    priceRange: '¥800–2,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B005J94WEM?tag=kamelife090e-22',
    asin: 'B005J94WEM',
    image: '/assets/products/placeholder.webp',
    why: '高湿度を好む森林性カメに最適。保湿力が高く蒸れにくい',
    rating: 4.4,
    badge: 'Best Overall',
    recommendedFor: ['tortoise_forest', 'box_turtle'],
    rakutenSearchTerm: 'ジクラ 万能ヤシガラマット 細目',
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenItemCode: null,
    rakutenPrice: null,
    rakutenShop: null,
    rakutenConfidence: null,
    rakutenLastUpdated: '2026-08-29',
  },

  substrate_sand_mix: {
    id: 'substrate_sand_mix',
    name: '砂・土ミックス床材',
    category: 'substrate',
    tier: 'standard',
    priceRange: '¥1,000–3,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B06XC8YK4Y?tag=kamelife090e-22',
    asin: 'B06XC8YK4Y',
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: '爬虫類 床材 砂 ミックス',
    image: '/assets/products/placeholder.webp',
    why: '乾燥系リクガメの穿孔行動を促す自然に近い床材',
    rating: 4.2,
    badge: null,
    recommendedFor: ['tortoise_dry_small', 'tortoise_dry_large'],
  },

  // ── Phase 39-P3 追加（standard:null解消・国内メーカー優先） ──
  // GEX公式サイト(product.gex-fp.co.jp)および複数の国内小売サイトでASIN(B016B0MXVQ)の実在を確認済み

  substrate_gex_terrarium_soil: {
    id: 'substrate_gex_terrarium_soil',
    name: 'GEX EXOTERRA テラリウムソイル 4kg', // Phase 39-P6: ブランド表記統一（GEX エキゾテラ→GEX EXOTERRA）
    category: 'substrate',
    tier: 'standard',
    priceRange: '¥1,500–3,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B016B0MXVQ?tag=kamelife090e-22',
    asin: 'B016B0MXVQ',
    image: '/assets/products/placeholder.webp',
    why: '多孔質で消臭・保湿性に優れたソイル。バチルス菌配合でフンや食べ残しの分解を促進し、熱帯・亜熱帯性の森林系ガメに適する', // Phase 39-P6: 3文→2文に統一
    rating: 4.2,
    badge: null,
    recommendedFor: ['tortoise_forest', 'box_turtle'],
    rakutenSearchTerm: 'GEX EXOTERRA テラリウムソイル 4kg',
    rakutenUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00uirhn.nhbnn600.g00uirhn.nhbno2d9/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fpetforest%2Fpf-4972547031426%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fpetforest%2Fi%2F10011895%2F&rafcid=wsc_i_is_fa8391ab-300d-4c4c-be83-ca2ddfdc47be',
    rakutenStatus: 'available',
    rakutenItemCode: 'petforest:10011895',
    rakutenPrice: 1771,
    rakutenShop: 'ペットフォレスト 楽天市場店',
    rakutenConfidence: 5.7,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: 'https://thumbnail.image.rakuten.co.jp/@0_mall/petforest/cabinet/japell/japell-15/pf-4972547031426.jpg?_ex=128x128',
  },

  // ── Task2 追加 ──

  substrate_grassland_mix: {
    id: 'substrate_grassland_mix',
    name: 'GEX EXOTERRA デザートベース 細目 3L',
    category: 'substrate',
    tier: 'standard',
    priceRange: '¥1,500–3,500',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B08W314BWC?tag=kamelife090e-22',
    asin: 'B08W314BWC',
    image: '/assets/products/placeholder.webp',
    why: '国産天然素材100%の細粒床材。通気性が高く地中海系リクガメの乾燥環境を再現でき、軽く掘れるため自然な行動も促しやすい', // Phase 39-P6: 3文→2文に統一
    rating: 4.3,
    badge: 'Best Overall',
    recommendedFor: ['tortoise_dry_small'],
    rakutenSearchTerm: 'GEX EXOTERRA デザートベース 細目 3L', // Phase 39-P6: 商品名変更に伴い検索語も統一
    rakutenUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00u2znn.nhbnn256.g00u2znn.nhbno647/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Falmeria%2F39076665955%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Falmeria%2Fi%2F14624605%2F&rafcid=wsc_i_is_fa8391ab-300d-4c4c-be83-ca2ddfdc47be',
    rakutenStatus: 'available',
    rakutenItemCode: 'almeria:14624605',
    rakutenPrice: 1994,
    rakutenShop: 'アルメリア楽天市場店',
    rakutenConfidence: 5.9,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: 'https://thumbnail.image.rakuten.co.jp/@0_mall/almeria/cabinet/item/1956/39076665955_1.jpg?_ex=128x128',
  },

  substrate_sphagnum_moss: {
    id: 'substrate_sphagnum_moss',
    name: 'スファグナムモス（水苔）',
    category: 'substrate',
    tier: 'standard',
    priceRange: '¥1,200–3,000',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '保湿性が高く、産卵床や高湿度ゾーンを作りたいときに使いやすい',
    rating: 4.5,
    badge: null,
    recommendedFor: ['box_turtle', 'tortoise_forest'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'スファグナムモス 水苔 爬虫類',
  },

  // Phase 39-P4: ASIN(B00XVP3TPO)の実商品をweb_searchで確認したところ「水作 大磯砂 2.4kg」であり、
  // 旧称「白砂」「5kg」は実際の色味・容量と異なっていたため是正
  substrate_sand_river: {
    id: 'substrate_sand_river',
    name: '水作 大磯砂 2.4kg',
    category: 'substrate',
    tier: 'budget',
    priceRange: '¥600–1,500',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B00XVP3TPO?tag=kamelife090e-22',
    asin: 'B00XVP3TPO',
    image: '/assets/products/placeholder.webp',
    why: '水棲ガメ水槽の底砂に。自然な雰囲気を出しつつ清掃しやすい',
    rating: 3.9,
    badge: 'Budget Pick',
    recommendedFor: ['semi_aquatic_small', 'japanese_pond'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: '水作 大磯砂 2.4kg',
  },

  // Phase 39-P2: このASIN(B07PGZN9CF)はsubstrate_cypressと完全に同一の実商品（GEX EXOTERRA フォレストバーク8.8L）で
  // あることをweb_searchで確認。旧名称「フォレストブレンド床材」は実商品と不一致だったため是正。
  // standard/premiumの2ティアで同一商品が重複していたため、EQUIPMENT_MAP側の参照は外し
  // （tortoise_forest / box_turtle の substrate.standard を null 化 → budgetへフォールバック）、
  // 本エントリはデータとして保持のみ行う。

  substrate_cypress: {
    id: 'substrate_cypress',
    name: 'GEX EXOTERRA フォレストバーク 8.8L',
    category: 'substrate',
    tier: 'premium',
    priceRange: '¥1,200–4,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B07PGZN9CF?tag=kamelife090e-22',
    asin: 'B07PGZN9CF',
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'GEX EXOTERRA フォレストバーク 8.8L', // Phase 39-P6: 「Zoo Med サイプレスマルチ」は誤り(ブランド不一致)だったため商品名に統一
    image: '/assets/products/placeholder.webp',
    why: '天然ベイマツ樹皮の崩れにくい床材。高い保湿・調湿効果で森林系リクガメやハコガメに向き、チップが大きく通気性も保ちやすい', // Phase 39-P6: 3文→2文に統一
    rating: 4.6,
    badge: 'Premium',
    recommendedFor: ['tortoise_forest', 'box_turtle', 'advanced'],
  },

  // ── Phase 39-P1 昇格候補 追加（要Amazon/楽天個別確認、amazon_status/rakuten_status未検証） ──

  substrate_arcadia_earthmix: {
    id: 'substrate_arcadia_earthmix',
    name: 'Arcadia EarthMix',
    category: 'substrate',
    tier: 'standard',
    priceRange: '¥1,500–3,500',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '森林性・ハコガメ向けの保湿床材。専門ブランドのブレンド土',
    rating: 4.2,
    badge: null,
    recommendedFor: ['tortoise_forest', 'box_turtle'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'Arcadia EarthMix 床材 爬虫類',
  },

  substrate_exoterra_plantation_soil: {
    id: 'substrate_exoterra_plantation_soil',
    name: 'Exo Terra Plantation Soil',
    category: 'substrate',
    tier: 'standard',
    priceRange: '¥1,200–3,000',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '湿潤系ガメ向けの保湿床材。天然素材で調湿性が高い',
    rating: 4.1,
    badge: null,
    recommendedFor: ['tortoise_forest', 'box_turtle'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'Exo Terra Plantation Soil 床材',
  },


  /* ══════════════════════════════════════════
     SHELTER（シェルター）  8商品
     ══════════════════════════════════════════ */

  shelter_small: {
    id: 'shelter_small',
    rakutenModelNo: 'RX-191', // スドー公式製品ページ（ロックシェルターSP S）。実測: 64件（run 33258859220）
    name: 'スドー ハープクラフト ロックシェルターSP S', // Phase 39-P4: web_search確認済みの実商品名に修正
    category: 'shelter',
    tier: 'budget',
    priceRange: '¥800–1,800',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B07F3Q7L3Y?tag=kamelife090e-22',
    asin: 'B07F3Q7L3Y',
    image: '/assets/products/placeholder.webp',
    why: 'ストレス軽減に必須の隠れ家。約9.3×11×高さ4.7cmの幼体専用サイズ（甲長6cm前後まで）。成体は入れないので、成長に合わせてML以上へ買い替える',
    rating: 4.2,
    badge: 'Budget Pick',
    recommendedFor: ['beginner', 'semi_aquatic_small'],
    rakutenSearchTerm: 'スドー ロックシェルターSP S',
    rakutenUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00pzvcn.nhbnnb21.g00pzvcn.nhbno140/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Ftopcreate%2F0036-00121%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Ftopcreate%2Fi%2F10021348%2F&rafcid=wsc_i_is_fa8391ab-300d-4c4c-be83-ca2ddfdc47be',
    rakutenStatus: 'available',
    rakutenItemCode: 'topcreate:10021348',
    rakutenPrice: 760,
    rakutenShop: '爬虫類用品店 トップクリエイト',
    rakutenConfidence: 7.7,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: 'https://thumbnail.image.rakuten.co.jp/@0_mall/topcreate/cabinet/0036/0036-00121.jpg?_ex=128x128',
  },

  shelter_medium: {
    id: 'shelter_medium',
    name: 'スドー ロックシェルターSP ML', // Phase 39-P4: web_search確認済みの実商品名に修正
    category: 'shelter',
    tier: 'standard',
    priceRange: '¥1,500–3,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B07F3L16ZR?tag=kamelife090e-22',
    asin: 'B07F3L16ZR',
    image: '/assets/products/placeholder.webp',
    why: '約13×17×高さ8cm。幼体〜亜成体（甲長10cm前後まで）向け。ヘルマン・ギリシャの成体や大型リクガメ・成体ハコガメには小さく、より大きな隠れ家が必要',
    rating: 4.3,
    badge: 'Best Overall',
    recommendedFor: ['tortoise_dry_small', 'tortoise_forest'],
    rakutenSearchTerm: 'スドー ロックシェルターSP ML',
    rakutenUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00qlnsn.nhbnn195.g00qlnsn.nhbnoe50/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fpetsmum%2F20008828%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fpetsmum%2Fi%2F10045671%2F&rafcid=wsc_i_is_fa8391ab-300d-4c4c-be83-ca2ddfdc47be',
    rakutenStatus: 'available',
    rakutenItemCode: 'petsmum:10045671',
    rakutenPrice: 1685,
    rakutenShop: 'ペッツマム',
    rakutenConfidence: 5.7,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: 'https://thumbnail.image.rakuten.co.jp/@0_mall/petsmum/cabinet/reptiles/4974212601934_1.jpg?_ex=128x128',
  },

  // ── Task2 追加 ──

  shelter_bark_hide: {
    id: 'shelter_bark_hide',
    name: 'Zoo Med 天然コルクバーク ラウンド M（3パック）',
    category: 'shelter',
    tier: 'standard',
    priceRange: '¥1,500–4,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B01F654UHM?tag=kamelife090e-22',
    asin: 'B01F654UHM',
    image: '/assets/products/placeholder.webp',
    why: '自然素材のシェルター。湿度を保持しカメが潜り込みやすい形状',
    rating: 4.5,
    badge: 'Best Overall',
    recommendedFor: ['tortoise_forest', 'box_turtle'],
    rakutenSearchTerm: 'Zoo Med コルクバーク ラウンド 爬虫類',
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenItemCode: null,
    rakutenPrice: null,
    rakutenShop: null,
    rakutenConfidence: 5,
    rakutenLastUpdated: '2026-09-07',
    rakutenImageUrl: null,
  },

  shelter_moist_hide: {
    id: 'shelter_moist_hide',
    name: 'モイストハイド（湿潤シェルター）',
    category: 'shelter',
    tier: 'standard',
    priceRange: '¥2,000–4,500',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B08W2ZKT94?tag=kamelife090e-22',
    asin: 'B08W2ZKT94',
    image: '/assets/products/placeholder.webp',
    why: 'GEX モイストシェルター コーナー130。入口約5×3.5cm・本体約13×13×9.5cmのヤモリ向け小型品で、カメは中に入れない。加湿用の水苔容器としてのみ有効',
    rating: 4.4,
    badge: null,
    recommendedFor: ['box_turtle', 'tortoise_forest'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: '湿潤 シェルター モイスト 爬虫類',
  },


  // Phase 39-P4: ASIN(B00E0GM8JG)の実商品をweb_searchで確認したところ「GEX EXOTERRA レプタイルケイブM
  // PT2852」（W23.5×D15×H6.5cm）であり、旧称「ラージ」「成体リクガメが余裕で入れる大型」という説明とは
  // 実サイズが大きく異なる（Mサイズ）ため、成体大型リクガメ向けの代替が見つかるまでEQUIPMENT_MAPから外し
  // （tortoise_dry_small.premium / tortoise_dry_large.standard を null化 → shelter_mediumへフォールバック）、
  // 本エントリはデータとして保持のみ行う
  shelter_cave_lg: {
    id: 'shelter_cave_lg',
    name: 'GEX EXOTERRA レプタイルケイブM（幼体〜小型種向け・成体大型リクガメ非対応）',
    category: 'shelter',
    tier: 'standard',
    priceRange: '¥3,000–6,000',
    affiliateUrl: null,
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: 'W23.5×D15×H6.5cmのMサイズ。幼体〜亜成体・小型種向けで、成体リクガメ用の大型シェルターではない（大型種向けは未選定）',
    rating: 4.3,
    badge: null,
    recommendedFor: ['tortoise_dry_large'],
    rakutenUrl: null,
    rakutenStatus: 'pending',
    rakutenSearchTerm: 'ケーブシェルター 大型 爬虫類',
  },

  shelter_wood_premium: {
    id: 'shelter_wood_premium',
    name: 'ウッドハイドハウス（プレミアム）',
    category: 'shelter',
    tier: 'premium',
    priceRange: '¥5,000–10,000',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '自然木製のシェルター。観察窓付きで中の様子を確認しやすく、ケージ内もすっきりまとまる',
    rating: 4.6,
    badge: 'Premium',
    recommendedFor: ['tortoise_dry_small', 'advanced'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'ウッドハイド シェルター 爬虫類 木製',
  },

  shelter_turtle_dock: {
    id: 'shelter_turtle_dock',
    name: '水棲ガメ用ドック（浮島タイプ）',
    category: 'shelter',
    tier: 'budget',
    priceRange: '¥1,200–3,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B00O0QMK2Q?tag=kamelife090e-22',
    asin: 'B00O0QMK2Q',
    image: '/assets/products/placeholder.webp',
    why: 'タートルバンクS（約16.6×12.4cm）。適合は幅40cmまでの水槽・幼体〜甲長8cm程度。60cm以上の水槽や大きな個体にはMサイズ以上を選ぶ',
    rating: 4.1,
    badge: 'Budget Pick',
    recommendedFor: ['semi_aquatic_small', 'japanese_pond', 'beginner'],
    rakutenSearchTerm: '亀 浮島 ドック 水棲',
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenItemCode: null,
    rakutenPrice: null,
    rakutenShop: null,
    rakutenConfidence: 3.2,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: null,
  },

  // ── Phase 39-P1 昇格候補 追加（要Amazon/楽天個別確認、amazon_status/rakuten_status未検証） ──

  shelter_exoterra_reptile_cave: {
    id: 'shelter_exoterra_reptile_cave',
    name: 'Exo Terra Reptile Cave',
    category: 'shelter',
    tier: 'budget',
    priceRange: '¥1,500–3,000',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '汎用ロックシェルター。定番ブランドの隠れ家',
    rating: 4.1,
    badge: null,
    recommendedFor: ['beginner', 'semi_aquatic_small'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'Exo Terra Reptile Cave シェルター',
  },

  shelter_sanko_rock: {
    id: 'shelter_sanko_rock',
    name: 'SANKO ロックシェルター',
    category: 'shelter',
    tier: 'budget',
    priceRange: '¥800–2,000',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '国内定番の岩型シェルター。入手性が高くコストパフォーマンスに優れる',
    rating: 4.0,
    badge: null,
    recommendedFor: ['beginner', 'semi_aquatic_small'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'SANKO ロックシェルター 爬虫類',
  },

  /* ══════════════════════════════════════════
     WATER_DISH（水入れ）  2商品
     Phase 39-P1 新設カテゴリ（要Amazon/楽天個別確認）
     ══════════════════════════════════════════ */

  waterdish_zoomed_ramp_bowl: {
    id: 'waterdish_zoomed_ramp_bowl',
    name: 'Zoo Med レプティランプボウル LG（RRB-11）',
    category: 'water_dish',
    tier: 'budget',
    priceRange: '',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B00167XQLG?tag=kamelife090e-22',
    asin: 'B00167XQLG',
    image: '/assets/products/placeholder.webp',
    why: 'スロープ付きで歩いて入れる浅型の水入れ（外寸 約25.4×20.4×高さ5.8cm・販売店表記）。用途は飲み水と浅い水浴び。内寸が未確認のため「全身が入れる最大甲長」は断定しない。成体では主に飲み水用。全身浴には個体サイズに合う別容器を用意する',
    rating: 4.0,
    badge: null,
    recommendedFor: ['tortoise_dry_small', 'box_turtle'],
    amazonIdentity: 'AMAZON_IDENTITY_VERIFIED',
    sizeStatus: 'PARTIALLY_EVALUATED',
    sizeNote: 'メーカー: Zoo Med（国内: ズーメッドジャパン）。型番 RRB-11。外寸 25.4×20.4×5.8cm（国内販売店）＝Zoo Med 公式 10×8×2.25in と一致。内寸・スロープ角は未確認のため全身が入る甲長は未確定。Zoo Med 公式の対象は「トカゲ・小型リクガメ」。XL（RRB-12・Amazon 実体は URL 照合済み）は箱亀・リクガメ向けだが外寸が資料間で不一致（33×23×6cm / 25.4×24×7cm）のため未採用',
    useCase: '飲み水・浅い水浴び（成体は飲み水用）',
    rakutenSearchTerm: 'ズーメッド レプティランプボウル LG',
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenItemCode: null,
    rakutenPrice: null,
    rakutenShop: null,
    rakutenConfidence: 3.6,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: null,
  },

  waterdish_sanko_dish: {
    id: 'waterdish_sanko_dish',
    name: '甲長に合わせた浅い水場（設備要件・商品未選定）',
    category: 'water_dish',
    tier: 'budget',
    priceRange: '',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '購入商品ではなく設備要件。「SANKO レプタイルディッシュ」という商品は存在しない（2026-09-08 確認）。アカアシ成体（甲長30cm超）や森林性種が全身で浸かれる浅い水場は市販の爬虫類用水入れでは足りず、深さ2〜3cmのトレー・衣装ケース等を甲長に合わせて用意する。既存の小型水入れを流用しない',
    rating: null,
    badge: null,
    recommendedFor: [],
    amazonIdentity: 'AMAZON_IDENTITY_UNVERIFIED',
    sizeStatus: 'NOT_FOUND_EXACT_MATCH',
    sizeNote: '候補: 三晃商会 REPTIZOO ウォーターディッシュ M（20.5×16.5×5.0cm・sanko-wild.com に公式ページあり・amazon.co.jp では NOT_FOUND_AMAZON）／スドー ハープクラフト レプタイルディッシュ L（RX-153・径10×3cm・Amazon 実体は slug 不一致で未確認・成体には小さすぎる）／ニッソー WILD PLANET レプタイルディッシュ（エサ皿＋水入れの二連・Amazon 実体は名称検索のみ・寸法未確認）。いずれも「全身が入る」用途には一致しない',
    useCase: '全身浴（種と甲長に応じた容器を別途用意）',
    requirement: true, // 設備要件。商品カード・購入ボタンとして出さない
    rakutenUrl: null,
    rakutenStatus: 'pending',
    rakutenSearchTerm: null,
  },

  /* ══════════════════════════════════════════
     THERMOMETER（温湿度計）  6商品
     ══════════════════════════════════════════ */

  thermometer_digital: {
    id: 'thermometer_digital',
    name: 'デジタル温湿度計',
    category: 'thermometer',
    tier: 'budget',
    priceRange: '¥1,500–3,500',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B07TYN8584?tag=kamelife090e-22',
    asin: 'B07TYN8584',
    image: '/assets/products/placeholder.webp',
    why: '温度・湿度の同時監視が可能。設置場所の環境管理に必須',
    rating: 4.2,
    badge: 'Budget Pick',
    recommendedFor: ['beginner'],
    rakutenSearchTerm: 'デジタル 温湿度計 爬虫類',
    rakutenUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00uaxan.nhbnn474.g00uaxan.nhbno5bc/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fpalpito%2F0012%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fpalpito%2Fi%2F10000011%2F&rafcid=wsc_i_is_fa8391ab-300d-4c4c-be83-ca2ddfdc47be',
    rakutenStatus: 'available',
    rakutenItemCode: 'palpito:10000011',
    rakutenPrice: 1000,
    rakutenShop: 'Palpito 楽天市場店',
    rakutenConfidence: 9.4,
    rakutenLastUpdated: '2026-08-29',
  },

  thermometer_aqua: {
    id: 'thermometer_aqua',
    name: 'INKBIRD 水温計（Bluetooth対応）', // Phase 39-P4: web_search確認済みの実商品名に修正
    category: 'thermometer',
    tier: 'budget',
    priceRange: '¥800–2,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B09KLRGC1Y?tag=kamelife090e-22',
    asin: 'B09KLRGC1Y',
    image: '/assets/products/placeholder.webp',
    why: '水棲ガメの水温管理に。アナログ式より数値を読み取りやすく細かい変化に気づきやすい',
    rating: 4.1,
    badge: 'Budget Pick',
    recommendedFor: ['semi_aquatic_small', 'semi_aquatic_medium', 'fully_aquatic'],
    rakutenSearchTerm: 'INKBIRD 水温計 Bluetooth',
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenItemCode: null,
    rakutenPrice: null,
    rakutenShop: null,
    rakutenConfidence: 3.5,
    rakutenLastUpdated: '2026-07-28',
  },

  // ── Task2 追加 ──

  thermometer_dual_probe: {
    id: 'thermometer_dual_probe',
    name: 'シンワ測定 デジタル温度計 73117', // Phase 39-P4: web_search確認済みの実商品名に修正
    category: 'thermometer',
    tier: 'standard',
    priceRange: '¥2,500–5,500',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B01KLHZOWA?tag=kamelife090e-22',
    asin: 'B01KLHZOWA',
    image: '/assets/products/placeholder.webp',
    why: 'ホットスポットとクールゾーンを同時計測。温度勾配の確認に便利',
    rating: 4.5,
    badge: 'Best Overall',
    recommendedFor: ['tortoise_dry_small', 'tortoise_dry_large'],
    rakutenSearchTerm: 'シンワ測定 デジタル温度計 73117',
    rakutenUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00pm62n.nhbnn77a.g00pm62n.nhbno09e/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Flamd%2F4960910731172%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Flamd%2Fi%2F10108677%2F&rafcid=wsc_i_is_fa8391ab-300d-4c4c-be83-ca2ddfdc47be',
    rakutenStatus: 'available',
    rakutenItemCode: 'lamd:10108677',
    rakutenPrice: 2300,
    rakutenShop: 'Arclands Online 楽天市場支店',
    rakutenConfidence: 7.3,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: 'https://thumbnail.image.rakuten.co.jp/@0_mall/lamd/cabinet/image70/496091073117_1.jpg?_ex=128x128',
  },

  thermometer_infrared: {
    id: 'thermometer_infrared',
    name: '非接触型赤外線温度計',
    category: 'thermometer',
    tier: 'standard',
    priceRange: '¥2,000–5,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B09VCJP5SK?tag=kamelife090e-22',
    asin: 'B09VCJP5SK',
    image: '/assets/products/placeholder.webp',
    why: 'カメに触れずに体表温度や床材温度を瞬時に測定。バスキング調整に活用',
    rating: 4.6,
    badge: 'Best Overall',
    recommendedFor: ['tortoise_dry_large', 'advanced'],
    rakutenSearchTerm: '赤外線 温度計 非接触 爬虫類',
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenItemCode: null,
    rakutenPrice: null,
    rakutenShop: null,
    rakutenConfidence: 5,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: null,
  },

  // Phase 39-P4: ASIN(B0CZ42FLXM)の実商品をweb_searchで確認したところ「INKBIRD WiFi温度計湿度計
  // IBS-TH3 PLUS」であり、旧ブランド表記「SwitchBot」は誤りだったため是正。
  // Phase 28-HOTFIXの時点で既に「chanetでSwitchBotは扱っていなそう」という疑義が記録されており、今回確定
  thermometer_wifi: {
    id: 'thermometer_wifi',
    name: 'INKBIRD WiFi温度計湿度計 IBS-TH3 PLUS',
    category: 'thermometer',
    tier: 'premium',
    priceRange: '¥4,000–10,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B0CZ42FLXM?tag=kamelife090e-22',
    asin: 'B0CZ42FLXM',
    image: '/assets/products/placeholder.webp',
    why: 'スマホで24時間リモート監視・アラート機能付き。外出時も離れた場所から状態を確認できる',
    rating: 4.8,
    badge: 'Premium',
    recommendedFor: ['advanced'],
    rakutenSearchTerm: 'INKBIRD WiFi 温湿度計 IBS-TH3',
    rakutenUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00tziwn.nhbnn12c.g00tziwn.nhbno135/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fmakana--%2Fyk2-0b429n9l2%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fmakana--%2Fi%2F10529576%2F&rafcid=wsc_i_is_fa8391ab-300d-4c4c-be83-ca2ddfdc47be',
    rakutenStatus: 'available',
    rakutenItemCode: 'makana--:10529576',
    rakutenPrice: 4088,
    rakutenShop: 'SelectSHOP 岐阜 楽天市場店',
    rakutenConfidence: 5.3,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: 'https://thumbnail.image.rakuten.co.jp/@0_mall/makana--/cabinet/root_sniper_folder/sniper_folder_00097/imgrc0144194927.jpg?_ex=128x128',
  },

  thermometer_analog: {
    id: 'thermometer_analog',
    name: 'GEX エキゾテラ アナログ温度計 PT2465',
    category: 'thermometer',
    tier: 'budget',
    priceRange: '¥500–1,500',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B00CX9G5DM?tag=kamelife090e-22',
    asin: 'B00CX9G5DM',
    image: '/assets/products/placeholder.webp',
    why: '電池不要のアナログ式。温度のみ測定（湿度は測れないため湿度計は別途）',
    rating: 3.7,
    badge: 'Budget Pick',
    recommendedFor: ['beginner'],
    rakutenSearchTerm: 'エキゾテラ アナログ温度計 爬虫類',
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenItemCode: null,
    rakutenPrice: null,
    rakutenShop: null,
    rakutenConfidence: 7.7,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: null,
  },

  /* ══════════════════════════════════════════
     FOOD（フード）  9商品
     ══════════════════════════════════════════ */

  food_aquatic_staple: {
    id: 'food_aquatic_staple',
    name: 'カメプロス（キョーリン）', // Phase 39-P1: 旧表記「テトラ」はブランド誤り。カメプロスはキョーリン(Hikari)ブランドの製品のため修正（web_search確認済み）
    category: 'food',
    tier: 'budget',
    priceRange: '¥600–1,500',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B00E0GMQAM?tag=kamelife090e-22',
    asin: 'B00E0GMQAM',
    image: '/assets/products/placeholder.webp',
    why: '水棲ガメの基本人工飼料。栄養バランスに優れ食いつきが良い',
    rating: 4.4,
    badge: 'Best Overall',
    recommendedFor: ['semi_aquatic_small', 'semi_aquatic_medium', 'japanese_pond'],
    rakutenSearchTerm: 'カメプロス キョーリン 亀 餌', // Phase 39-P1: ブランド表記修正に伴い検索語も修正
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenItemCode: null,
    rakutenPrice: null,
    rakutenShop: null,
    rakutenConfidence: 7.3,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: null,
  },

  // Phase 39-P4: ASIN(B0DF2SJMCJ)の実商品をweb_searchで確認したところ「Vivaria取扱 Rep-Cal
  // リクガメフード 907g」であり、旧ブランド表記「Zoo Med」は誤りだったため是正
  food_tortoise_staple: {
    id: 'food_tortoise_staple',
    name: 'Rep-Cal リクガメフード 907g（ビバリア取扱）',
    category: 'food',
    tier: 'standard',
    priceRange: '¥1,200–2,500',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B0DF2SJMCJ?tag=kamelife090e-22',
    asin: 'B0DF2SJMCJ',
    image: '/assets/products/placeholder.webp',
    why: '植物性主体のリクガメ専用フード。野草の補助として活用',
    rating: 4.5,
    badge: 'Best Overall',
    recommendedFor: ['tortoise_dry_small', 'tortoise_dry_large', 'tortoise_forest'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'Rep-Cal リクガメフード ビバリア',
  },

  // ── Task2 追加 ──

  food_aquatic_premium: {
    id: 'food_aquatic_premium',
    name: 'レプトミン（テトラ）',
    category: 'food',
    tier: 'budget',
    priceRange: '¥500–1,200',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B0F31WW4Q2?tag=kamelife090e-22',
    asin: 'B0F31WW4Q2',
    image: '/assets/products/placeholder.webp',
    why: '水棲ガメ定番の人工飼料。スティックタイプで食べさせやすく価格も手頃',
    rating: 4.2,
    badge: 'Budget Pick',
    recommendedFor: ['semi_aquatic_small', 'beginner'],
    rakutenSearchTerm: 'レプトミン テトラ 亀 餌',
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenItemCode: null,
    rakutenPrice: null,
    rakutenShop: null,
    rakutenConfidence: 3.9,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: null,
  },

  food_aqua_turtle_pellet: {
    id: 'food_aqua_turtle_pellet',
    name: 'カメの主食（GEX）',
    category: 'food',
    tier: 'budget',
    priceRange: '¥400–1,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B08XBQDYM2?tag=kamelife090e-22',
    asin: 'B08XBQDYM2',
    image: '/assets/products/placeholder.webp',
    why: '国内で入手しやすいコスパ良好なペレット。半水棲ガメの日常食に',
    rating: 4.0,
    badge: 'Budget Pick',
    recommendedFor: ['beginner', 'semi_aquatic_small'],
    rakutenSearchTerm: 'カメの主食 GEX 亀 フード',
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenItemCode: null,
    rakutenPrice: null,
    rakutenShop: null,
    rakutenConfidence: 5.3,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: null,
  },

  // 2026-09-08: ASIN(B0F6JWRMSL)の実商品を再確認したところ「ビバリア レップカル
  // ハコガメフード 340g」であり、旧表記「シータートルフード」は誤り（ウミガメ用と誤解させる）
  // だったため是正。本エントリは food_box_turtle_omnivore（ハコガメ用雑食枠）であり、
  // ハコガメフードで枠の用途と一致する。楽天の検索語も同時に修正した。
  // 併せて「昆虫・果実成分配合」の記述は未確認のため、確認できる範囲の説明に留める
  food_box_turtle_omnivore: {
    id: 'food_box_turtle_omnivore',
    name: 'レップカル ハコガメフード 340g（ビバリア取扱）',
    category: 'food',
    tier: 'standard',
    priceRange: '¥1,500–3,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B0F6JWRMSL?tag=kamelife090e-22',
    asin: 'B0F6JWRMSL',
    image: '/assets/products/placeholder.webp',
    why: '雑食性ハコガメ向けの栄養バランス強化フード',
    rating: 4.5,
    badge: 'Best Overall',
    recommendedFor: ['box_turtle'],
    rakutenSearchTerm: 'レップカル ハコガメフード ビバリア',
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenItemCode: null,
    rakutenPrice: null,
    rakutenShop: null,
    rakutenConfidence: 5.7,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: null,
  },

  food_dried_shrimp: {
    id: 'food_dried_shrimp',
    name: 'キョーリン カメのごほうび 乾燥川エビ 12g×3個',
    category: 'food',
    tier: 'budget',
    priceRange: '¥300–800',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B0CKBKF2ZH?tag=kamelife090e-22',
    asin: 'B0CKBKF2ZH',
    image: '/assets/products/placeholder.webp',
    why: 'たんぱく質補給のおやつ。水棲・半水棲ガメが好んで食べる',
    rating: 4.1,
    badge: 'Budget Pick',
    recommendedFor: ['semi_aquatic_small', 'beginner'],
    rakutenSearchTerm: 'キョーリン カメのごほうび 乾燥川エビ',
    rakutenUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00pyjhn.nhbnncfa.g00pyjhn.nhbnodd2/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fchanet%2F14730%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fchanet%2Fi%2F10024377%2F&rafcid=wsc_i_is_fa8391ab-300d-4c4c-be83-ca2ddfdc47be',
    rakutenStatus: 'available',
    rakutenItemCode: 'chanet:10024377',
    rakutenPrice: 210,
    rakutenShop: 'charm 楽天市場店',
    rakutenConfidence: 8.5,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: 'https://thumbnail.image.rakuten.co.jp/@0_mall/chanet/cabinet/147/14730-1.jpg?_ex=128x128',
  },

  // Phase 39-P4: 旧ASIN(B00TJ3O1HC)はweb_searchで実在確認できず誤ASINと判断。
  // 正しいASIN(B00FJDV6QU＝「レパシー ベジバーガー 6oz(170g) 牧草色」)をamazon.co.jpで確認済みのため修正
  food_tortoise_gel: {
    id: 'food_tortoise_gel',
    name: 'Repashy Veggie Burger 170g',
    category: 'food',
    tier: 'premium',
    priceRange: '¥2,000–4,500',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B00FJDV6QU?tag=kamelife090e-22',
    asin: 'B00FJDV6QU',
    image: '/assets/products/placeholder.webp',
    why: '水で溶かしてゲル状にする高栄養フード。偏食ガメや療養中の個体に',
    rating: 4.7,
    badge: 'Premium',
    recommendedFor: ['advanced', 'tortoise_forest'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'リパシー ベジバーガー リクガメ',
  },

  food_hikari_turtle: {
    id: 'food_hikari_turtle',
    // RAKUTEN-ID Phase0 HOLD: name はウーパールーパー用、term/why はタートル用フードを指しており
    // ASIN B0043UN3X4 がどちらの商品かをこの環境では検証できない。Owner確認まで identity 自動昇格から除外
    rakutenIdentityHold: true,
    name: 'キョーリン ひかりクレスト タートル 250g',
    category: 'food',
    tier: 'standard',
    priceRange: '¥700–1,800',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B0043UN3X4?tag=kamelife090e-22',
    asin: 'B0043UN3X4',
    image: '/assets/products/placeholder.webp',
    why: 'カルシウムを強化配合した国産フード。甲羅の健康を意識して選びたい人に',
    rating: 4.3,
    badge: null,
    recommendedFor: ['semi_aquatic_medium', 'japanese_pond'],
    rakutenSearchTerm: 'ひかり タートル 亀 フード',
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenItemCode: null,
    rakutenPrice: null,
    rakutenShop: null,
    rakutenConfidence: 6.3,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: null,
  },

  food_tortoise_herbs: {
    id: 'food_tortoise_herbs',
    name: 'キョーリン マルベリックドライ 400g',
    category: 'food',
    tier: 'premium',
    priceRange: '¥1,500–3,500',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B09M2LVBYG?tag=kamelife090e-22',
    asin: 'B09M2LVBYG',
    image: '/assets/products/placeholder.webp',
    why: '桑葉主体の植物葉フード。野草に近い繊維質で、野草採取が難しい冬季の補完食に最適',
    rating: 4.6,
    badge: 'Premium',
    recommendedFor: ['tortoise_dry_small', 'tortoise_dry_large'],
    // RAKUTEN-ID Phase0: 6769bc9 の再定義（グラスランドサラダ→マルベリックドライ）で
    // rakutenSearchTerm だけが旧商品のまま残っていたのを name に同期
    rakutenSearchTerm: 'キョーリン マルベリックドライ リクガメ',
    rakutenUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00ui8un.nhbnn353.g00ui8un.nhbno1b3/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fuchinomofu%2Fkyorin-maru-v%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fuchinomofu%2Fi%2F10000391%2F&rafcid=wsc_i_is_fa8391ab-300d-4c4c-be83-ca2ddfdc47be',
    rakutenStatus: 'available',
    rakutenItemCode: 'uchinomofu:10000391',
    rakutenPrice: 998,
    rakutenShop: 'ペットショップ うちのmofu',
    rakutenConfidence: 9.1,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: 'https://thumbnail.image.rakuten.co.jp/@0_mall/uchinomofu/cabinet/kyorin/maru/imgrc0098716274.jpg?_ex=128x128',
  },

  // ── Phase 39-P1 昇格候補 追加（要Amazon/楽天個別確認、amazon_status/rakuten_status未検証） ──

  food_reptomin_tetra: {
    id: 'food_reptomin_tetra',
    // RAKUTEN-ID Phase0 HOLD: food_aquatic_premium（レプトミン）と同一商品ラインの重複レコードで、
    // EQUIPMENT_MAP からも未参照（孤児）。統合/削除は Owner 判断。identity 自動昇格から除外
    rakutenIdentityHold: true,
    name: 'ReptoMin（テトラ）',
    category: 'food',
    tier: 'budget',
    priceRange: '¥500–1,200',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '水棲ガメ向けの世界的定番人工飼料。テトラ社の正規ラインナップ',
    rating: 4.3,
    badge: null,
    recommendedFor: ['semi_aquatic_small', 'japanese_pond'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'ReptoMin テトラ 亀 餌',
  },

  food_mazuri_aquatic: {
    id: 'food_mazuri_aquatic',
    name: 'Mazuri Aquatic Turtle Diet',
    category: 'food',
    tier: 'premium',
    priceRange: '¥3,000–6,000',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '水棲ガメ向けの高栄養ペレット。海外の動物園・専門施設でも採用実績あり',
    rating: 4.5,
    badge: null,
    recommendedFor: ['semi_aquatic_medium', 'fully_aquatic', 'advanced'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'Mazuri Aquatic Turtle Diet 亀 フード',
  },

  food_mazuri_tortoise: {
    id: 'food_mazuri_tortoise',
    name: 'Mazuri Tortoise Diet',
    category: 'food',
    tier: 'premium',
    priceRange: '¥3,000–6,000',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: 'リクガメ向けの高栄養ペレット。海外の専門施設で採用実績のあるブランド',
    rating: 4.4,
    badge: null,
    recommendedFor: ['tortoise_dry_large', 'advanced'],
    rakutenSearchTerm: 'Mazuri Tortoise Diet リクガメ フード',
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenItemCode: null,
    rakutenPrice: null,
    rakutenShop: null,
    rakutenConfidence: 5.7,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: null,
  },

  /* ══════════════════════════════════════════
     SUPPLEMENTS（サプリメント）  9商品
     旧 calcium カテゴリを拡張
     ══════════════════════════════════════════ */

  supplement_calcium_d3: {
    id: 'supplement_calcium_d3',
    name: 'GEX EXOTERRA カルシウム+ビタミンD3 90g', // Phase 39-P4: web_search確認済みの実商品名に修正
    category: 'supplements',
    tier: 'budget',
    priceRange: '¥800–2,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B0851DNPXX?tag=kamelife090e-22',
    asin: 'B0851DNPXX',
    image: '/assets/products/placeholder.webp',
    why: '甲羅の形成・維持に不可欠。野菜にダスティングして与える',
    rating: 4.3,
    badge: 'Best Overall',
    recommendedFor: ['tortoise_dry_small', 'tortoise_dry_large', 'beginner'],
    rakutenSearchTerm: 'GEX EXOTERRA カルシウム ビタミンD3 90g',
    rakutenUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00ulasn.nhbnned3.g00ulasn.nhbno47a/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fkankapro%2F20240616094044_138%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fkankapro%2Fi%2F10013912%2F&rafcid=wsc_i_is_fa8391ab-300d-4c4c-be83-ca2ddfdc47be',
    rakutenStatus: 'available',
    rakutenItemCode: 'kankapro:10013912',
    rakutenPrice: 1229,
    rakutenShop: '感花楽天市場店',
    rakutenConfidence: 6.3,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: 'https://thumbnail.image.rakuten.co.jp/@0_mall/kankapro/cabinet/r_2024061642/20240616094044_138_1.jpg?_ex=128x128',
  },

  // ── Task2 追加 ──

  calcium_no_d3: {
    id: 'calcium_no_d3',
    name: 'GEX EXOTERRA カルシウム 90g（D3なし）',
    category: 'supplements',
    tier: 'budget',
    priceRange: '¥600–1,500',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B084ZY19Q3?tag=kamelife090e-22',
    asin: 'B084ZY19Q3',
    image: '/assets/products/placeholder.webp',
    why: '屋外飼育・UVBランプ完備の環境向け。D3過剰投与リスクを避けたい場合に',
    rating: 4.2,
    badge: 'Budget Pick',
    recommendedFor: ['outdoor', 'advanced'],
    rakutenSearchTerm: 'GEX エキゾテラ カルシウム 90g 爬虫類',
    rakutenUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00scsrn.nhbnnad3.g00scsrn.nhbno2ac/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Frayon%2F11633%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Frayon%2Fi%2F10026318%2F&rafcid=wsc_i_is_fa8391ab-300d-4c4c-be83-ca2ddfdc47be',
    rakutenStatus: 'available',
    rakutenItemCode: 'rayon:10026318',
    rakutenPrice: 1200,
    rakutenShop: 'レヨンベールアクア楽天市場店',
    rakutenConfidence: 6.9,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: 'https://thumbnail.image.rakuten.co.jp/@0_mall/rayon/cabinet/12000/11633.jpg?_ex=128x128',
  },

  // Phase 39-P4: ASIN(B09YYPLCV3)の実商品をweb_searchで確認したところ「GEX EXOTERRA カルシウム+
  // ビタミンD3 40g PT1855」であり、旧ブランド表記「Rep-Cal」は誤りだったため是正。
  // 「リン不使用」の説明はRep-Cal固有の訴求で本製品では未確認のため、確認できる範囲の説明に変更
  supplement_calcium_plus: {
    id: 'supplement_calcium_plus',
    name: 'GEX EXOTERRA カルシウム+ビタミンD3 40g',
    category: 'supplements',
    tier: 'standard',
    priceRange: '¥1,500–3,500',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B09YYPLCV3?tag=kamelife090e-22',
    asin: 'B09YYPLCV3',
    image: '/assets/products/placeholder.webp',
    why: '甲羅の形成・維持に必要なカルシウムとビタミンD3を補給',
    rating: 4.6,
    badge: 'Best Overall',
    recommendedFor: ['tortoise_dry_large', 'advanced'],
    rakutenSearchTerm: 'GEX EXOTERRA カルシウム ビタミンD3 40g',
    rakutenUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00r0znn.nhbnn37a.g00r0znn.nhbno17e/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Ffish-neos%2Fgex20210723-2%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Ffish-neos%2Fi%2F10104113%2F&rafcid=wsc_i_is_fa8391ab-300d-4c4c-be83-ca2ddfdc47be',
    rakutenStatus: 'available',
    rakutenItemCode: 'fish-neos:10104113',
    rakutenPrice: 540,
    rakutenShop: 'ネオス 楽天市場店',
    rakutenConfidence: 7.3,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: 'https://thumbnail.image.rakuten.co.jp/@0_mall/fish-neos/cabinet/-2/gex20210723-2_1.jpg?_ex=128x128',
  },

  supplement_multivitamin: {
    id: 'supplement_multivitamin',
    name: 'GEX EXOTERRA マルチビタミン 30g', // Phase 39-P4: web_search確認済みの実商品名に修正
    category: 'supplements',
    tier: 'standard',
    priceRange: '¥1,200–3,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B004OHL3QK?tag=kamelife090e-22',
    asin: 'B004OHL3QK',
    image: '/assets/products/placeholder.webp',
    why: 'ビタミンA・E・B群を補給。人工飼料のみの飼育では週1回のダスティングが推奨',
    rating: 4.4,
    badge: null,
    recommendedFor: ['tortoise_dry_small', 'box_turtle'],
    rakutenSearchTerm: 'GEX EXOTERRA マルチビタミン 30g',
    rakutenUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00uqtyn.nhbnn1a4.g00uqtyn.nhbnoca7/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Ffortuness%2F20260804042538_110%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Ffortuness%2Fi%2F10091594%2F&rafcid=wsc_i_is_fa8391ab-300d-4c4c-be83-ca2ddfdc47be',
    rakutenStatus: 'available',
    rakutenItemCode: 'fortuness:10091594',
    rakutenPrice: 803,
    rakutenShop: 'フォーチュネスマート',
    rakutenConfidence: 5.9,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: 'https://thumbnail.image.rakuten.co.jp/@0_mall/fortuness/cabinet/r_2026080456/20260804042538_110_1.jpg?_ex=128x128',
  },

  // Phase 39-P4: ASIN(B09M65FBTD)の実商品をweb_searchで確認したところ「テトラ レプトセイフ カメの水つくり
  // 500ml」（水質調整剤）であり、ヨウ素サプリとは全く異なる商品カテゴリだったため誤ASINと判断。
  // 代替の実在ヨウ素サプリが見つかるまでEQUIPMENT_MAPから外し（tortoise_dry_large.supplements.premiumを
  // null化 → standardへフォールバック）、本エントリはデータとして保持のみ行う
  supplement_iodine: {
    id: 'supplement_iodine',
    name: 'ヨウ素サプリ（亀専用）（要商品再選定）',
    category: 'supplements',
    tier: 'standard',
    priceRange: '¥1,500–3,500',
    affiliateUrl: null,
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '甲状腺機能維持に必要なヨウ素を補給。リクガメの長期飼育に有効',
    rating: 4.3,
    badge: null,
    recommendedFor: ['tortoise_dry_large', 'advanced'],
    rakutenUrl: null,
    rakutenStatus: 'pending',
    rakutenSearchTerm: 'ヨウ素 サプリ 亀 甲状腺',
  },

  supplement_electrolyte: {
    id: 'supplement_electrolyte',
    name: 'Zoo Med レプティセーフ 水質調整剤（電解質配合）',
    category: 'supplements',
    tier: 'premium',
    priceRange: '¥1,800–4,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B000N5O6WA?tag=kamelife090e-22',
    asin: 'B000N5O6WA',
    image: '/assets/products/placeholder.webp',
    why: '飼育水・温浴水のカルキ抜き。電解質を含み、水換えのたびに水に加えて使う',
    rating: 4.5,
    badge: null,
    recommendedFor: ['advanced'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'ゾーメッド レプティセーフ 水質調整剤',
  },

  supplement_mineral_block: {
    id: 'supplement_mineral_block',
    name: 'カトルボーン（甲イカの骨）',
    category: 'supplements',
    tier: 'budget',
    priceRange: '¥300–800',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B0BDD1V7G5?tag=kamelife090e-22',
    asin: 'B0BDD1V7G5',
    image: '/assets/products/placeholder.webp',
    why: 'ケージ内に置くだけでカメが自分で削ってカルシウム補給できる。省手間',
    rating: 4.2,
    badge: 'Budget Pick',
    recommendedFor: ['beginner', 'tortoise_forest', 'box_turtle'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'カトルボーン 甲イカ 亀 カルシウム',
  },

  supplement_probiotics: {
    id: 'supplement_probiotics',
    name: '爬虫類用プロバイオティクス',
    category: 'supplements',
    tier: 'premium',
    priceRange: '¥2,500–6,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B01BXVIHRM?tag=kamelife090e-22',
    asin: 'B01BXVIHRM',
    image: '/assets/products/placeholder.webp',
    why: '腸内細菌叢を整え消化吸収を促進。拒食回復期や繁殖個体の栄養管理に',
    rating: 4.6,
    badge: 'Premium',
    recommendedFor: ['advanced'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: '爬虫類 プロバイオティクス 腸内環境',
  },

  /* ══════════════════════════════════════════
     SETUP EXTRAS（飼育環境図の用品導線・Phase 2 追加）
     ══════════════════════════════════════════ */

  // web_searchで実在確認（スドー公式サイト・2026-08-18）。底棲魚向けの角の取れた
  // 細粒天然砂で、スッポン・マタマタの潜行用底床の条件（細かい・角がない・水槽用）に適合。
  // AmazonのASINは未確認のため既存規約どおり affiliateUrl null（楽天検索のみ）。価格は推測せず未記載。
  substrate_bottom_sand: {
    id: 'substrate_bottom_sand',
    name: 'スドー ボトムサンド 5kg',
    category: 'substrate',
    tier: 'standard',
    priceRange: null,
    affiliateUrl: null,
    asin: null,
    rakutenSearchTerm: 'スドー ボトムサンド 5kg',
    image: '/assets/products/placeholder.webp',
    why: '角の取れた細粒の天然砂。砂に潜る種の皮膚を傷つけにくく、水槽用として流通が安定',
    recommendedFor: ['fully_aquatic', 'semi_aquatic_medium'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenItemCode: null,
    rakutenPrice: null,
    rakutenShop: null,
    rakutenConfidence: 3.6,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: null,
  },

  // web_searchで実在確認（スペクトラムブランズジャパン公式・Amazon実ページ B004EIAQMG・2026-08-18）。
  // ±0.001目盛の海水用比重計で、専門店の商品表記に「汽水を測定可能」とあることを確認。
  // 目盛り下限の数値仕様は公式未記載のため why には断定を書かない。
  hydrometer_tetra: {
    id: 'hydrometer_tetra',
    name: 'テトラ ハイドロメーター（比重計）',
    category: 'accessory',
    tier: 'standard',
    priceRange: null,
    affiliateUrl: 'https://www.amazon.co.jp/dp/B004EIAQMG?tag=kamelife090e-22',
    asin: 'B004EIAQMG',
    rakutenSearchTerm: 'テトラ ハイドロメーター 比重計',
    image: '/assets/products/placeholder.webp',
    why: '±0.001目盛で比重と塩分濃度を同時に読める定番比重計。汽水測定に対応（販売元表記）',
    recommendedFor: ['semi_aquatic_medium'],
    rakutenUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00scsrn.nhbnnad3.g00scsrn.nhbno2ac/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Frayon%2F41840%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Frayon%2Fi%2F10006776%2F&rafcid=wsc_i_is_fa8391ab-300d-4c4c-be83-ca2ddfdc47be',
    rakutenStatus: 'available',
    rakutenItemCode: 'rayon:10006776',
    rakutenPrice: 2250,
    rakutenShop: 'レヨンベールアクア楽天市場店',
    rakutenConfidence: 6.1,
    rakutenLastUpdated: '2026-09-12',
    rakutenImageUrl: 'https://thumbnail.image.rakuten.co.jp/@0_mall/rayon/cabinet/50000/41840.jpg?_ex=128x128',
  },
};

// ─────────────────────────────────────────────
// 2. EQUIPMENT_MAP  v2 — tier分岐対応
//
// 構造: { equipmentKey: { category: { budget, standard, premium } } }
// - budget / standard は必須。premium は省略可（nullで明示）。
// - 値はすべて PRODUCTS の有効な id。存在しないIDは使わない。
// - 旧配列形式は getTierProduct() / selectKitProducts() で不要になるが、
//   後方互換のため LEGACY_MAP を別途保持する。
// ─────────────────────────────────────────────

const EQUIPMENT_MAP = {

  // ── 乾燥系リクガメ（小〜中型：ロシア・ヘルマン・ギリシャ等）
  tortoise_dry_small: {
    enclosure:        { budget: 'enclosure_glass_45',    standard: 'enclosure_wood_90',      premium: 'enclosure_tortoise_120' },
    lighting_uvb:     { budget: 'uvb_compact',           standard: 'uvb_t5_desert_std',          premium: 'uvb_t5_desert_12' },
    lighting_basking: { budget: 'basking_50w',           standard: 'basking_75w',            premium: 'basking_ceramic_100w' }, // Phase 39-P2: basking_halogen_50wはbasking_50wとASIN重複(誤ラベル)のため差し替え
    heating:          { budget: 'heater_panel_30w',      standard: 'heater_panel_45',       premium: 'heater_radiant_panel' },
    substrate:        { budget: 'substrate_soil',        standard: 'substrate_grassland_mix',premium: 'substrate_cypress' },
    shelter:          { budget: 'shelter_small',         standard: 'shelter_medium',         premium: null }, // Phase 39-P4: shelter_cave_lgはサイズ不一致(要再選定)のため外し、standardへフォールバック
    thermometer:      { budget: 'thermometer_digital',   standard: 'thermometer_dual_probe', premium: 'thermometer_wifi' },
    food:             { budget: 'food_aquatic_premium',         standard: 'food_tortoise_staple',          premium: 'food_tortoise_herbs' },
    supplements:      { budget: 'supplement_calcium_d3',        standard: 'supplement_calcium_plus',      premium: null },
  },

  // ── 乾燥系リクガメ（大型：ヘルマン・チャコ・ヒョウモン等）
  tortoise_dry_large: {
    enclosure:        { budget: 'enclosure_wood_90',     standard: 'enclosure_tortoise_120',     premium: null }, // Phase 39-P4: enclosure_tortoise_150はサイズ不一致(要再選定)のため外し、standardへフォールバック
    lighting_uvb:     { budget: 'uvb_t5_desert_std',         standard: 'uvb_t5_desert_12',      premium: 'uvb_mvb_100' },
    lighting_basking: { budget: 'basking_100w',          standard: 'basking_dual_150',      premium: 'basking_hid_70w' },
    heating:          { budget: 'heater_panel_45',      standard: 'heater_panel_60',       premium: 'heater_radiant_panel' },
    substrate:        { budget: 'substrate_soil',        standard: 'substrate_sand_mix',     premium: 'substrate_cypress' },
    shelter:          { budget: null,                    standard: null,     premium: null }, // 2026-09-08 商品不足監査: shelter_medium(SP ML 約13×17×H8cm)は成体大型リクガメに入らないため外す。大型種向けシェルターは未選定（setup-specs の missing に明記）
    thermometer:      { budget: 'thermometer_digital',   standard: 'thermometer_infrared',   premium: 'thermometer_wifi' },
    food:             { budget: 'food_tortoise_staple',         standard: 'food_tortoise_herbs',   premium: null },
    supplements:      { budget: 'supplement_calcium_d3',        standard: 'supplement_calcium_plus',      premium: null }, // Phase 39-P4: supplement_iodineは誤ASIN(水質調整剤)のため外し、standardへフォールバック
  },

  // ── 森林系リクガメ（エロンガータ・アカアシ・インプレッサ等）
  tortoise_forest: {
    enclosure:        { budget: 'enclosure_glass_45',    standard: 'enclosure_kayuso_90',    premium: 'enclosure_tortoise_120' },
    lighting_uvb:     { budget: 'uvb_compact',           standard: 'uvb_t5_forest_std',          premium: 'uvb_t5_tropical_6' },
    lighting_basking: { budget: 'basking_50w',           standard: 'basking_75w',            premium: 'basking_ceramic_100w' },
    heating:          { budget: 'heater_cord_20w',       standard: 'heater_panel_45',       premium: 'thermostat_digital' },
    substrate:        { budget: 'substrate_coco',        standard: 'substrate_gex_terrarium_soil', premium: 'substrate_cypress' }, // Phase 39-P3: standard:nullをGEX実商品(B016B0MXVQ)で解消
    shelter:          { budget: 'shelter_small',         standard: 'shelter_bark_hide',      premium: null }, // 2026-09-08 商品不足監査: shelter_moist_hide(入口5×3.5cm・ヤモリ向け)はカメが入れないため外し、standardへフォールバック
    thermometer:      { budget: 'thermometer_digital',   standard: 'thermometer_dual_probe', premium: 'thermometer_wifi' },
    food:             { budget: 'food_tortoise_staple',         standard: 'food_tortoise_gel',  premium: null },
    supplements:      { budget: 'supplement_calcium_d3',        standard: 'supplement_multivitamin',premium: null },
  },

  // ── 半水棲・小型（ニオイガメ・ドロガメ・ミスクガメ等）
  semi_aquatic_small: {
    enclosure:        { budget: 'tank_60',               standard: 'tank_90',                premium: 'tank_120_aqua' },
    lighting_uvb:     { budget: 'uvb_compact',           standard: 'uvb_t5_forest_std',          premium: 'uvb_t5_tropical_6' },
    lighting_basking: { budget: 'basking_50w',           standard: 'basking_75w',            premium: 'basking_halogen_50w' }, // Phase 39-P7: ASIN重複解消(21a50df)によりbasking_halogen_50wを復帰
    heating:          { budget: 'thermostat_kotobuki_hydra', standard: 'heater_aqua_100w',    premium: 'thermostat_digital' }, // Phase 39-P3: thermostat(ブランド不明)→国内コトブキ実商品に差し替え
    filter:           { budget: 'filter_small',          standard: 'filter_turtle_clean',    premium: 'filter_canister_medium' },
    thermometer:      { budget: 'thermometer_aqua',      standard: 'thermometer_dual_probe', premium: 'thermometer_wifi' },
    food:             { budget: 'food_aquatic_staple',         standard: 'food_aquatic_premium',          premium: null },
    supplements:      { budget: 'supplement_calcium_d3',        standard: 'supplement_mineral_block',  premium: null },
  },

  // ── 半水棲・中型（クサガメ・アカミミ・チズガメ等）
  semi_aquatic_medium: {
    enclosure:        { budget: 'tank_90',               standard: 'tank_90',                premium: 'tank_120_aqua' },
    lighting_uvb:     { budget: 'uvb_compact',           standard: 'uvb_t5_forest_std',          premium: 'uvb_t5_tropical_6' },
    lighting_basking: { budget: 'basking_50w',           standard: 'basking_75w',            premium: 'basking_100w' },
    heating:          { budget: 'heater_aqua_100w',      standard: 'heater_aqua_200w',       premium: 'thermostat_digital' },
    filter:           { budget: 'filter_turtle_clean',   standard: 'filter_canister_medium', premium: 'filter_canister_premium' },
    thermometer:      { budget: 'thermometer_aqua',      standard: 'thermometer_dual_probe', premium: 'thermometer_wifi' },
    food:             { budget: 'food_aquatic_staple',         standard: 'food_aquatic_premium',          premium: null },
    supplements:      { budget: 'supplement_calcium_d3',        standard: 'supplement_mineral_block',  premium: null },
  },

  // ── 完全水棲（スッポン・マタマタ・ワニガメ等）
  fully_aquatic: {
    enclosure:        { budget: 'tank_90',               standard: 'tank_120_aqua',          premium: 'tank_120_aqua' },
    heating:          { budget: 'heater_aqua_100w',      standard: 'heater_aqua_200w',       premium: 'thermostat_digital' },
    filter:           { budget: 'filter_canister_medium',standard: 'filter_canister_large',  premium: 'filter_canister_premium' },
    substrate:        { budget: 'substrate_sand_river',  standard: 'substrate_sand_river',   premium: null },
    thermometer:      { budget: 'thermometer_aqua',      standard: 'thermometer_dual_probe', premium: 'thermometer_wifi' },
    food:             { budget: 'food_aquatic_staple',         standard: 'food_aquatic_premium',          premium: null },
  },

  // ── 日本産イシガメ類（ニホンイシガメ・クサガメ等）
  japanese_pond: {
    enclosure:        { budget: 'tank_60',               standard: 'tank_90',                premium: 'tank_120_aqua' },
    lighting_uvb:     { budget: 'uvb_compact',           standard: 'uvb_t5_forest_std',          premium: 'uvb_t5_tropical_6' },
    lighting_basking: { budget: 'basking_50w',           standard: 'basking_75w',            premium: 'basking_100w' },
    heating:          { budget: 'thermostat_kotobuki_hydra', standard: 'heater_aqua_100w',    premium: 'thermostat_digital' }, // Phase 39-P3: thermostat(ブランド不明)→国内コトブキ実商品に差し替え
    filter:           { budget: 'filter_small',          standard: 'filter_turtle_clean',    premium: 'filter_canister_medium' },
    thermometer:      { budget: 'thermometer_aqua',      standard: 'thermometer_dual_probe', premium: 'thermometer_wifi' },
    food:             { budget: 'food_aquatic_staple',         standard: 'food_aquatic_premium',          premium: null },
    supplements:      { budget: 'supplement_mineral_block', standard: 'supplement_calcium_d3',         premium: null },
  },

  // ── 水陸両用ハコガメ（ミツユビ・トウブ・サバンナ等）
  box_turtle: {
    enclosure:        { budget: 'enclosure_glass_45',    standard: 'enclosure_kayuso_90',    premium: 'enclosure_tortoise_120' },
    lighting_uvb:     { budget: 'uvb_compact',           standard: 'uvb_t5_forest_std',          premium: 'uvb_t5_tropical_6' },
    lighting_basking: { budget: 'basking_50w',           standard: 'basking_75w',            premium: 'basking_halogen_50w' }, // Phase 39-P7: ASIN重複解消(21a50df)によりbasking_halogen_50wを復帰
    heating:          { budget: 'heater_cord_20w',       standard: 'heater_panel_45',       premium: 'thermostat_digital' },
    filter:           { budget: 'filter_small',          standard: 'filter_submersible_medium',premium: null },
    substrate:        { budget: 'substrate_coco',        standard: 'substrate_gex_terrarium_soil', premium: 'substrate_cypress' }, // Phase 39-P3: standard:nullをGEX実商品(B016B0MXVQ)で解消
    shelter:          { budget: 'shelter_small',         standard: 'shelter_bark_hide',      premium: null }, // 2026-09-08 商品不足監査: shelter_moist_hide(入口5×3.5cm・ヤモリ向け)はカメが入れないため外し、standardへフォールバック
    thermometer:      { budget: 'thermometer_digital',   standard: 'thermometer_dual_probe', premium: null },
    food:             { budget: 'food_aquatic_staple',         standard: 'food_box_turtle_omnivore',        premium: 'food_tortoise_gel' },
    supplements:      { budget: 'supplement_mineral_block', standard: 'supplement_calcium_d3',         premium: null },
  },

};

// ─────────────────────────────────────────────
// 3. HELPER FUNCTIONS
// ─────────────────────────────────────────────

/**
 * カテゴリ名でフィルタ
 * @param {string} category
 * @returns {Object[]}
 */
function getProductsByCategory(category) {
  return Object.values(PRODUCTS).filter(p => p.category === category);
}

/**
 * カテゴリ内で rating が最も高い商品を返す
 * @param {string} category
 * @returns {Object|null}
 */
function getBestProduct(category) {
  const tierOrder = { premium: 3, standard: 2, intermediate: 2, budget: 1, beginner: 1 };
  const items = getProductsByCategory(category);
  if (!items.length) return null;
  return items.reduce((best, p) => {
    if (!best) return p;
    if (p.rating > best.rating) return p;
    if (p.rating === best.rating) {
      return (tierOrder[p.tier] || 0) > (tierOrder[best.tier] || 0) ? p : best;
    }
    return best;
  }, null);
}

/**
 * カテゴリ内で tier=budget かつ rating が最高の商品を返す
 * @param {string} category
 * @returns {Object|null}
 */
function getBudgetProduct(category) {
  const BUDGET_TIERS = new Set(['budget', 'beginner']);
  const items = getProductsByCategory(category).filter(p => BUDGET_TIERS.has(p.tier));
  if (!items.length) return null;
  return items.reduce((best, p) => {
    return (!best || p.rating > best.rating) ? p : best;
  }, null);
}

/**
 * equipmentKey × category × tier で商品を1件取得
 *
 * @param {string} equipmentKey - 例: 'tortoise_dry_small'
 * @param {string} category     - 例: 'filter'
 * @param {string} tier         - 'budget' | 'standard' | 'premium'
 * @returns {Object|null} product object、見つからなければ null
 *
 * フォールバック順:
 *   premium 要求 → premium がなければ standard へ降格
 *   standard 要求 → なければ budget へ降格
 *   budget 要求 → なければ null
 */
function getTierProduct(equipmentKey, category, tier) {
  const keyMap = EQUIPMENT_MAP[equipmentKey];
  if (!keyMap) return null;

  const catMap = keyMap[category];
  if (!catMap) return null;

  const FALLBACK = { premium: ['premium', 'standard', 'budget'],
                     standard: ['standard', 'budget'],
                     budget:   ['budget'] };
  const order = FALLBACK[tier] || ['budget'];

  for (const t of order) {
    const id = catMap[t];
    if (id && PRODUCTS[id]) return PRODUCTS[id];
  }
  return null;
}

// ─────────────────────────────────────────────
// 4. exports
// ─────────────────────────────────────────────

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PRODUCTS, EQUIPMENT_MAP, getProductsByCategory, getBestProduct, getBudgetProduct, getTierProduct };
}

// ─────────────────────────────────────────────
// Rakuten helpers (Schema v4)
// ─────────────────────────────────────────────

/**
 * 商品が実際のRakutenアフィリエイトURLを持つか判定
 * @param {Object} product
 * @returns {boolean}
 */
function hasRakuten(product) {
  return !!(
    product &&
    product.rakutenUrl &&
    typeof product.rakutenUrl === 'string' &&
    product.rakutenUrl.length > 0 &&
    product.rakutenStatus === 'available'
  );
}

/**
 * 楽天検索URLを生成 (rakutenStatus === "search" 用)
 * @param {Object} product
 * @returns {string|null}
 */
function getRakutenSearchUrl(product) {
  if (!product || !product.rakutenSearchTerm ||
      typeof product.rakutenSearchTerm !== 'string') {
    return null;
  }
  return 'https://search.rakuten.co.jp/search/mall/' +
    encodeURIComponent(product.rakutenSearchTerm) + '/';
}
