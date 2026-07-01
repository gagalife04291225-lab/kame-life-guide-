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

  enclosure_wood_90: {
    id: 'enclosure_wood_90',
    name: '木製リクガメケージ 90cm',
    category: 'enclosure',
    tier: 'standard',
    priceRange: '¥15,000–30,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B00BF91SU6?tag=kamelife09-22',
    asin: 'B00BF91SU6',
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'リクガメ ケージ 90cm 木製',
    image: '/assets/products/placeholder.webp',
    why: 'リクガメに必要な広さと保温性を両立した定番ケージ',
    rating: 4.3,
    badge: 'Best Overall',
    recommendedFor: ['tortoise_dry_small', 'tortoise_forest'],
  },

  enclosure_tortoise_120: {
    id: 'enclosure_tortoise_120',
    name: '木製リクガメケージ 120cm',
    category: 'enclosure',
    tier: 'premium',
    priceRange: '¥25,000–50,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B0CDLG5XF3?tag=kamelife09-22',
    asin: 'B0CDLG5XF3',
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'リクガメ ケージ 120cm 木製',
    image: '/assets/products/placeholder.webp',
    why: '成体になっても手狭にならない広さ。90cmから買い替えるならこのサイズが目安',
    rating: 4.5,
    badge: 'Premium',
    recommendedFor: ['tortoise_dry_large'],
  },

  tank_60: {
    id: 'tank_60',
    name: '水槽 60cm規格',
    category: 'enclosure',
    tier: 'budget',
    priceRange: '¥3,000–8,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B09TF6B5P4?tag=kamelife09-22',
    asin: 'B09TF6B5P4',
    rakutenUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00pyjhn.nhbnncfa.g00pyjhn.nhbnodd2/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fchanet%2F59306%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fchanet%2Fi%2F10092671%2F&rafcid=wsc_i_is_fa8391ab-300d-4c4c-be83-ca2ddfdc47be',
    rakutenStatus: 'available',
    rakutenSearchTerm: '水槽 60cm 亀',
    image: '/assets/products/placeholder.webp',
    why: '小型水棲ガメの基本飼育容器。水換えしやすい横長タイプ',
    rating: 4.1,
    badge: 'Budget Pick',
    recommendedFor: ['semi_aquatic_small', 'japanese_pond'],
    rakutenPrice: 5600,
    rakutenShop: 'charm 楽天市場店',
    rakutenConfidence: 8.2,
    rakutenLastUpdated: '2026-06-30',
  },

  tank_90: {
    id: 'tank_90',
    name: '水槽 90cm',
    category: 'enclosure',
    tier: 'standard',
    priceRange: '¥8,000–18,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B004J2G6XK?tag=kamelife09-22',
    asin: 'B004J2G6XK',
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: '水槽 90cm 亀',
    rakutenPrice: 16800,
    rakutenShop: 'charm 楽天市場店',
    rakutenConfidence: 7.7,
    rakutenLastUpdated: '2026-06-30',
    image: '/assets/products/placeholder.webp',
    why: '中型水棲ガメの単独飼育や、幼体の複数飼育を始めるならこのサイズから',
    rating: 4.4,
    badge: 'Best Overall',
    recommendedFor: ['semi_aquatic_medium', 'fully_aquatic'],
    rakutenConfidence: 7.7,
    rakutenLastUpdated: '2026-06-28',
  },

  enclosure_kayuso_90: {
    id: 'enclosure_kayuso_90',
    name: 'KAYUSO 爬虫類ケージ 90cm',
    category: 'enclosure',
    tier: 'standard',
    priceRange: '¥20,000–35,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B09DNYMXTP?tag=kamelife09-22',
    asin: 'B09DNYMXTP',
    image: '/assets/products/placeholder.webp',
    why: '前開き扉で管理しやすく、通気性と保温性を兼ね備えた専用ケージ',
    rating: 4.5,
    badge: 'Best Overall',
    recommendedFor: ['tortoise_forest', 'box_turtle'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'リクガメ ケージ 90cm 前開き',
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
    name: 'ガラスケージ 45cm',
    category: 'enclosure',
    tier: 'budget',
    priceRange: '¥4,000–9,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B00E0GLJAK?tag=kamelife09-22',
    asin: 'B00E0GLJAK',
    image: '/assets/products/placeholder.webp',
    why: '幼体や小型種なら十分な広さ。横からもよく見えるガラス製で観察しやすい',
    rating: 4.0,
    badge: null,
    recommendedFor: ['beginner', 'small_aquatic'],
    rakutenUrl: null,
    rakutenStatus: 'search', // Phase 28-HOTFIX: chanet/49751 item page not resolvable (reported 404), reverted to search fallback
    rakutenSearchTerm: 'ガラスケージ 45cm 爬虫類',
    rakutenPrice: 8900,
    rakutenShop: 'charm 楽天市場店',
    rakutenConfidence: 3.9,
    rakutenLastUpdated: '2026-06-30',
    rakutenConfidence: 3.9,
    rakutenLastUpdated: '2026-06-28',
  },

  enclosure_tortoise_150: {
    id: 'enclosure_tortoise_150',
    name: '木製リクガメケージ 150cm',
    category: 'enclosure',
    tier: 'premium',
    priceRange: '¥45,000–80,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B09DP2X997?tag=kamelife09-22',
    asin: 'B09DP2X997',
    image: '/assets/products/placeholder.webp',
    why: 'ケヅメリクガメ等の大型種成体に対応できる最大級サイズ',
    rating: 4.7,
    badge: 'Premium',
    recommendedFor: ['tortoise_dry_large', 'advanced'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'リクガメ ケージ 150cm 木製',
  },

  tank_120_aqua: {
    id: 'tank_120_aqua',
    name: 'コトブキ アクアリスト KC-1200LT 120cm ガラス水槽',
    category: 'enclosure',
    tier: 'premium',
    priceRange: '¥18,000–35,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B004HH8HDY?tag=kamelife09-22',
    asin: 'B004HH8HDY',
    image: '/assets/products/placeholder.webp',
    why: '大型水棲ガメ・スッポン・マタマタの本格飼育に。120×45×45cm・約205Lの大容量。傷に強いガラス製で長期飼育でも透明感を維持しやすい',
    rating: 4.6,
    badge: 'Premium',
    recommendedFor: ['fully_aquatic', 'advanced'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'アクリル水槽 120cm 爬虫類',
  },

  enclosure_outdoor_panel: {
    id: 'enclosure_outdoor_panel',
    name: 'アウトドアエンクロージャーパネル',
    category: 'enclosure',
    tier: 'standard',
    priceRange: '¥8,000–20,000',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '屋外飼育・日光浴スペースの仕切りに。DIY組み立て式',
    rating: 4.1,
    badge: null,
    recommendedFor: ['outdoor', 'tortoise_dry_small'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'アウトドアケージ パネル 爬虫類',
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
    affiliateUrl: 'https://www.amazon.co.jp/dp/B00JZFJ5R0?tag=kamelife09-22',
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
    affiliateUrl: 'https://www.amazon.co.jp/dp/B00JZFJ5LQ?tag=kamelife09-22',
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
    name: 'コンパクトUVBランプ 26W',
    category: 'lighting_uvb',
    tier: 'budget',
    priceRange: '¥1,500–3,500',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B00BF91Q1W?tag=kamelife09-22',
    asin: 'B00BF91Q1W',
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'コンパクトUVBランプ 爬虫類',
    image: '/assets/products/placeholder.webp',
    why: '小型ケージや補助UVBとして使いやすいコンパクトタイプ',
    rating: 3.9,
    badge: 'Budget Pick',
    recommendedFor: ['beginner', 'semi_aquatic_small'],
    rakutenConfidence: 4.5,
    rakutenLastUpdated: '2026-06-30',
  },

  // ── Task2 追加 ──

  uvb_t5_tropical_6: {
    id: 'uvb_t5_tropical_6',
    name: 'Arcadia T5 HO 6% UVB',
    category: 'lighting_uvb',
    tier: 'standard',
    priceRange: '¥4,000–8,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B09T96TPHJ?tag=kamelife09-22',
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
    affiliateUrl: 'https://www.amazon.co.jp/dp/B00BF91PYA?tag=kamelife09-22',
    asin: 'B00BF91PYA',
    image: '/assets/products/placeholder.webp',
    why: '砂漠・サバンナ系リクガメ向け高強度UVB。ケヅメ・ヒョウモンなど高UV要求種の甲羅形成と代謝維持に重要',
    rating: 4.8,
    badge: 'Premium',
    recommendedFor: ['tortoise_dry_large', 'advanced'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'Arcadia T5 HO 12% UVB 爬虫類',
  },

  uvb_mvb_100: {
    id: 'uvb_mvb_100',
    name: 'MVB 自発光UVBランプ 100W',
    category: 'lighting_uvb',
    tier: 'premium',
    priceRange: '¥6,000–12,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B07BBMVJ6H?tag=kamelife09-22',
    asin: 'B07BBMVJ6H',
    rakutenUrl: null,
    rakutenStatus: 'search', // Phase 28-HOTFIX: chanet/51200 confirmed sold out (売り切れ) at merchant, reverted to search fallback
    rakutenSearchTerm: 'MVB 自発光 UVBランプ 爬虫類',
    rakutenPrice: 9800,
    rakutenShop: 'charm 楽天市場店',
    rakutenConfidence: 8.4,
    rakutenLastUpdated: '2026-06-29',
    image: '/assets/products/placeholder.webp',
    why: 'UVB＋バスキング一体型。ランプ1本で照明コストを削減できる上級者向け',
    rating: 4.4,
    badge: 'Premium',
    recommendedFor: ['advanced', 'tortoise_dry_large'],
  },

  uvb_led_bar: {
    id: 'uvb_led_bar',
    name: 'UVB LED バー 60cm',
    category: 'lighting_uvb',
    tier: 'budget',
    priceRange: '¥2,500–5,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B08W2ZMX45?tag=kamelife09-22',
    asin: 'B08W2ZMX45',
    image: '/assets/products/placeholder.webp',
    why: '省電力で長寿命のLEDタイプ。初心者の入門用に手頃',
    rating: 3.7,
    badge: 'Budget Pick',
    recommendedFor: ['beginner'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'UVB LED ライト バー 爬虫類',
    rakutenConfidence: 3.9,
    rakutenLastUpdated: '2026-06-30',
  },

  uvb_t8_30w: {
    id: 'uvb_t8_30w',
    name: 'UVB T8 蛍光管 30W',
    category: 'lighting_uvb',
    tier: 'budget',
    priceRange: '¥1,000–2,500',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '低コストで入手しやすい旧来型。90cm以内のケージで有効',
    rating: 3.6,
    badge: 'Budget Pick',
    recommendedFor: ['beginner', 'semi_aquatic_small'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'UVB 蛍光管 T8 30W 爬虫類',
  },

  uvb_t5_desert_alt: {
    id: 'uvb_t5_desert_alt',
    name: 'Zilla Desert 50 T5 UVB',
    category: 'lighting_uvb',
    tier: 'standard',
    priceRange: '¥3,500–7,000',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '乾燥系リクガメ向けのミドルレンジUVB。価格と出力のバランスが良く、定番品からの買い替えにも',
    rating: 4.3,
    badge: null,
    recommendedFor: ['tortoise_dry_small'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'Zilla T5 Desert 50 UVB 爬虫類',
  },

  /* ══════════════════════════════════════════
     LIGHTING_BASKING（バスキングライト）  9商品
     ══════════════════════════════════════════ */

  basking_50w: {
    id: 'basking_50w',
    name: 'バスキングランプ 50W',
    category: 'lighting_basking',
    tier: 'budget',
    priceRange: '¥800–2,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B0043B3ZJ0?tag=kamelife09-22',
    asin: 'B0043B3ZJ0',
    image: '/assets/products/placeholder.webp',
    why: '小型ケージのホットスポット形成に適した出力',
    rating: 4.2,
    badge: 'Budget Pick',
    recommendedFor: ['semi_aquatic_small', 'box_turtle', 'japanese_pond'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'バスキングランプ 50W 爬虫類',
    rakutenConfidence: 5,
    rakutenLastUpdated: '2026-06-30',
  },

  basking_75w: {
    id: 'basking_75w',
    name: 'バスキングランプ 75W',
    category: 'lighting_basking',
    tier: 'standard',
    priceRange: '¥800–2,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B004LE7HWK?tag=kamelife09-22',
    asin: 'B004LE7HWK',
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'バスキングランプ 75W 爬虫類',
    image: '/assets/products/placeholder.webp',
    why: '標準的な60〜90cmケージのホットスポット形成に最適',
    rating: 4.4,
    badge: 'Best Overall',
    recommendedFor: ['tortoise_dry_small', 'semi_aquatic_medium'],
    rakutenConfidence: 5,
    rakutenLastUpdated: '2026-06-30',
  },

  basking_100w: {
    id: 'basking_100w',
    name: 'バスキングランプ 100W',
    category: 'lighting_basking',
    tier: 'standard',
    priceRange: '¥800–2,500',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B0043AYZL8?tag=kamelife09-22',
    asin: 'B0043AYZL8',
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'バスキングランプ 100W 爬虫類',
    image: '/assets/products/placeholder.webp',
    why: '大型ケージや熱帯性リクガメの高温ホットスポット維持に',
    rating: 4.3,
    badge: null,
    recommendedFor: ['tortoise_dry_large'],
    rakutenConfidence: 5.7,
    rakutenLastUpdated: '2026-06-30',
  },

  // ── Task2 追加 ──

  basking_halogen_35w: {
    id: 'basking_halogen_35w',
    name: 'ハロゲンバスキング 35W',
    category: 'lighting_basking',
    tier: 'budget',
    priceRange: '¥500–1,200',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B0043B0EAI?tag=kamelife09-22',
    asin: 'B0043B0EAI',
    image: '/assets/products/placeholder.webp',
    why: '幼体・小型種の補助バスキングに。安価で交換しやすい',
    rating: 3.9,
    badge: 'Budget Pick',
    recommendedFor: ['beginner'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'ハロゲン バスキングランプ 35W 爬虫類',
  },

  basking_halogen_50w: {
    id: 'basking_halogen_50w',
    name: 'ハロゲンバスキング 50W',
    category: 'lighting_basking',
    tier: 'budget',
    priceRange: '¥600–1,500',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B0043B3ZJ0?tag=kamelife09-22',
    asin: 'B0043B3ZJ0',
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'ハロゲンバスキングランプ 50W',
    image: '/assets/products/placeholder.webp',
    why: 'スポット照射が強く、小〜中型種のホットスポットを効率よく作れる',
    rating: 4.0,
    badge: 'Budget Pick',
    recommendedFor: ['beginner', 'semi_aquatic_small'],
  },

  basking_dual_150: {
    id: 'basking_dual_150',
    name: 'ダブルバスキングランプ 150W',
    category: 'lighting_basking',
    tier: 'premium',
    priceRange: '¥3,000–6,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B00E0GLQPI?tag=kamelife09-22',
    asin: 'B00E0GLQPI',
    image: '/assets/products/placeholder.webp',
    why: '大型ケージで広い日向エリアを確保。UVBランプと分けて設置するプロ仕様',
    rating: 4.5,
    badge: 'Premium',
    recommendedFor: ['tortoise_dry_large', 'advanced'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'バスキングランプ 150W ダブル 爬虫類',
  },

  basking_hid_70w: {
    id: 'basking_hid_70w',
    name: 'ゼンスイ ソーラーラプター HIDランプ 70W',
    category: 'lighting_basking',
    tier: 'premium',
    priceRange: '¥12,000–20,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B0858Y7XJX?tag=kamelife09-22',
    asin: 'B0858Y7XJX',
    image: '/assets/products/placeholder.webp',
    why: '太陽光に近い演色性が特長。大型リクガメの高温バスキングとUVB照射を1台でまかなえる',
    rating: 4.8,
    badge: 'Premium',
    recommendedFor: ['advanced', 'tortoise_dry_large'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'HID ランプ 爬虫類 メタルハライド',
    rakutenConfidence: 7.7,
    rakutenLastUpdated: '2026-06-30',
  },

  basking_ceramic_100w: {
    id: 'basking_ceramic_100w',
    name: 'セラミックヒートランプ 100W（夜間用）',
    category: 'lighting_basking',
    tier: 'standard',
    priceRange: '¥1,500–3,500',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B0BMKZGZQ1?tag=kamelife09-22',
    asin: 'B0BMKZGZQ1',
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'セラミックヒートランプ 100W 爬虫類',
    image: '/assets/products/placeholder.webp',
    why: '光を出さずに熱だけ供給。夜間加温・視覚刺激なしで自然なサイクルを維持',
    rating: 4.4,
    badge: null,
    recommendedFor: ['tortoise_dry_small', 'tortoise_dry_large'],
    rakutenConfidence: 7.3,
    rakutenLastUpdated: '2026-06-30',
  },

  basking_infrared_red: {
    id: 'basking_infrared_red',
    name: '赤外線バスキングランプ 75W',
    category: 'lighting_basking',
    tier: 'budget',
    priceRange: '¥700–1,800',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B0042L2I58?tag=kamelife09-22',
    asin: 'B0042L2I58',
    image: '/assets/products/placeholder.webp',
    why: '赤色光で夜間も使いやすい。水棲ガメの乾燥スポット加温に',
    rating: 3.8,
    badge: 'Budget Pick',
    recommendedFor: ['semi_aquatic_small', 'semi_aquatic_medium'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: '赤外線 バスキングランプ 75W 爬虫類',
    rakutenConfidence: 3.2,
    rakutenLastUpdated: '2026-06-30',
  },

  /* ══════════════════════════════════════════
     HEATING（ヒーター）  9商品
     ══════════════════════════════════════════ */

  heater_panel_30w: {
    id: 'heater_panel_30w',
    name: 'パネルヒーター 30W',
    category: 'heating',
    tier: 'budget',
    priceRange: '¥2,000–4,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B004IH1VOK?tag=kamelife09-22',
    asin: 'B004IH1VOK',
    image: '/assets/products/placeholder.webp',
    why: '夜間の底面加温に。ケージ下に設置するタイプで省スペース',
    rating: 4.0,
    badge: 'Budget Pick',
    recommendedFor: ['beginner', 'tortoise_dry_small'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'パネルヒーター 30W 爬虫類',
    rakutenConfidence: 5.9,
    rakutenLastUpdated: '2026-06-30',
  },

  heater_panel_45: {
    id: 'heater_panel_45',
    name: 'パネルヒーター 45W',
    category: 'heating',
    tier: 'standard',
    priceRange: '¥3,000–6,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B004IH1VRC?tag=kamelife09-22',
    asin: 'B004IH1VRC',
    image: '/assets/products/placeholder.webp',
    why: '中型ケージの夜間・冬季保温。サーモスタット併用推奨',
    rating: 4.2,
    badge: 'Best Overall',
    recommendedFor: ['tortoise_dry_small', 'tortoise_forest'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'パネルヒーター 45W 爬虫類',
    rakutenConfidence: 5.9,
    rakutenLastUpdated: '2026-06-30',
  },

  heater_aqua_100w: {
    id: 'heater_aqua_100w',
    name: 'GEX カメ元気 オートヒーター SH55',
    category: 'heating',
    tier: 'standard',
    priceRange: '¥1,500–3,500',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B07PD2PCMK?tag=kamelife09-22',
    asin: 'B07PD2PCMK',
    image: '/assets/products/placeholder.webp',
    why: '水棲ガメの水温維持に必須。オートカットつきが安心',
    rating: 4.3,
    badge: 'Best Overall',
    recommendedFor: ['semi_aquatic_small', 'semi_aquatic_medium'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: '水中ヒーター 100W 亀 水槽',
    rakutenConfidence: 5.9,
    rakutenLastUpdated: '2026-06-30',
  },

  thermostat: {
    id: 'thermostat',
    name: 'サーモスタット（アナログ）',
    category: 'heating',
    tier: 'budget',
    priceRange: '¥2,500–5,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B00BKULMIS?tag=kamelife09-22',
    asin: 'B00BKULMIS',
    image: '/assets/products/placeholder.webp',
    why: 'ヒーターの過昇温を防ぎ、安全な温度管理を自動化',
    rating: 4.0,
    badge: 'Budget Pick',
    recommendedFor: ['beginner'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'サーモスタット 爬虫類 アナログ',
  },

  // ── Task2 追加 ──

  heater_aqua_200w: {
    id: 'heater_aqua_200w',
    name: '水中ヒーター 200W',
    category: 'heating',
    tier: 'standard',
    priceRange: '¥2,500–5,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B00GN5RFWM?tag=kamelife09-22',
    asin: 'B00GN5RFWM',
    image: '/assets/products/placeholder.webp',
    why: '90cm以上の大容量水槽の安定した水温維持に',
    rating: 4.4,
    badge: null,
    recommendedFor: ['semi_aquatic_medium', 'fully_aquatic'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: '水中ヒーター 200W 亀',
    rakutenConfidence: 5.9,
    rakutenLastUpdated: '2026-06-30',
  },

  thermostat_digital: {
    id: 'thermostat_digital',
    name: 'デジタルサーモスタット（プログラム式）',
    category: 'heating',
    tier: 'premium',
    priceRange: '¥6,000–15,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B0CG93Z4VW?tag=kamelife09-22',
    asin: 'B0CG93Z4VW',
    image: '/assets/products/placeholder.webp',
    why: '昼夜の温度スケジュールを自動制御。複数機器の同時管理に対応',
    rating: 4.7,
    badge: 'Premium',
    recommendedFor: ['advanced'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'デジタル サーモスタット 爬虫類',
    rakutenPrice: 8800,
    rakutenShop: 'charm 楽天市場店',
    rakutenConfidence: 6.3,
    rakutenLastUpdated: '2026-06-30',
    rakutenConfidence: 6.3,
    rakutenLastUpdated: '2026-06-28',
  },

  heater_radiant_panel: {
    id: 'heater_radiant_panel',
    name: 'みどり商会 暖突 Lサイズ',
    category: 'heating',
    tier: 'premium',
    priceRange: '¥8,000–18,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B00BBRG4YW?tag=kamelife09-22',
    asin: 'B00BBRG4YW',
    image: '/assets/products/placeholder.webp',
    why: 'ケージ天井に取り付けて全体を均一に温めるタイプ。大型リクガメの広いケージで温度ムラが気になる人に',
    rating: 4.6,
    badge: 'Premium',
    recommendedFor: ['tortoise_dry_large', 'advanced'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: '輻射熱パネルヒーター 爬虫類 天井',
  },

  heater_cord_20w: {
    id: 'heater_cord_20w',
    name: 'ZOOMED レプティヒートケーブル 25W',
    category: 'heating',
    tier: 'budget',
    priceRange: '¥1,500–3,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B001OVBEEK?tag=kamelife09-22',
    asin: 'B001OVBEEK',
    image: '/assets/products/placeholder.webp',
    why: 'ケージ側面・底面に這わせて使う万能タイプ。湿度の高い環境でも使用可',
    rating: 3.9,
    badge: 'Budget Pick',
    recommendedFor: ['beginner', 'tortoise_forest'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'ヒーティングコード 20W 爬虫類',
  },

  heater_panel_60: {
    id: 'heater_panel_60',
    name: 'パネルヒーター 60W',
    category: 'heating',
    tier: 'standard',
    priceRange: '¥4,000–8,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B004IGXYX2?tag=kamelife09-22',
    asin: 'B004IGXYX2',
    image: '/assets/products/placeholder.webp',
    why: '120cm以上の大型木製ケージの保温補助に。薄型で設置場所を選ばない',
    rating: 4.2,
    badge: null,
    recommendedFor: ['tortoise_dry_large'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'パネルヒーター 60W 爬虫類',
    rakutenConfidence: 3.9,
    rakutenLastUpdated: '2026-06-30',
  },

  /* ══════════════════════════════════════════
     FILTER（フィルター）  9商品
     ══════════════════════════════════════════ */

  filter_small: {
    id: 'filter_small',
    name: '水中フィルター（小型）',
    category: 'filter',
    tier: 'budget',
    priceRange: '¥1,500–4,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B0012UO6Q6?tag=kamelife09-22',
    asin: 'B0012UO6Q6',
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: '水中フィルター 小型 亀',
    image: '/assets/products/placeholder.webp',
    why: '小型水棲ガメの水質維持に。カメは水を汚しやすいため必須',
    rating: 4.1,
    badge: 'Budget Pick',
    recommendedFor: ['semi_aquatic_small', 'japanese_pond'],
  },

  filter_canister_medium: {
    id: 'filter_canister_medium',
    name: '外部フィルター（中型）',
    category: 'filter',
    tier: 'standard',
    priceRange: '¥8,000–20,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B004FZ99HG?tag=kamelife09-22',
    asin: 'B004FZ99HG',
    rakutenUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00plman.nhbnn536.g00plman.nhbnoef3/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fminatodenk%2Feheim-2213%2F&rafcid=wsc_i_is_fa8391ab-300d-4c4c-be83-ca2ddfdc47be',
    rakutenStatus: 'available',
    rakutenSearchTerm: '外部フィルター 60cm 亀',
    rakutenPrice: 12800,
    rakutenShop: 'ミナトワークス',
    rakutenConfidence: 8.6,
    rakutenLastUpdated: '2026-06-29',
    image: '/assets/products/placeholder.webp',
    why: '水量の多い大型水槽向け。ろ過能力が高く水換え頻度を削減',
    rating: 4.5,
    badge: 'Best Overall',
    recommendedFor: ['semi_aquatic_medium', 'fully_aquatic'],
  },

  filter_canister_large: {
    id: 'filter_canister_large',
    name: '外部フィルター（大型）',
    category: 'filter',
    tier: 'premium',
    priceRange: '¥15,000–35,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B07F42H865?tag=kamelife09-22',
    asin: 'B07F42H865',
    rakutenUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00plman.nhbnn536.g00plman.nhbnoef3/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fminatodenk%2Feheim-2215%2F&rafcid=wsc_i_is_fa8391ab-300d-4c4c-be83-ca2ddfdc47be',
    rakutenStatus: 'available',
    rakutenSearchTerm: '外部フィルター 大型 亀',
    rakutenPrice: 17800,
    rakutenShop: 'ミナトワークス',
    rakutenConfidence: 8.5,
    rakutenLastUpdated: '2026-06-29',
    image: '/assets/products/placeholder.webp',
    why: '大型半水棲・完全水棲ガメの90cm以上水槽に対応',
    rating: 4.7,
    badge: 'Premium',
    recommendedFor: ['fully_aquatic', 'advanced'],
  },

  // ── Task2 追加 ──

  filter_hang_on: {
    id: 'filter_hang_on',
    name: '外掛け式フィルター',
    category: 'filter',
    tier: 'budget',
    priceRange: '¥2,000–5,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B003A2JS76?tag=kamelife09-22',
    asin: 'B003A2JS76',
    image: '/assets/products/placeholder.webp',
    why: '水槽縁に掛けるだけで設置完了。初心者に使いやすい入門フィルター',
    rating: 3.8,
    badge: 'Budget Pick',
    recommendedFor: ['beginner'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: '外掛け フィルター 爬虫類 亀',
    rakutenPrice: 3280,
    rakutenShop: 'charm 楽天市場店',
    rakutenConfidence: 3.2,
    rakutenLastUpdated: '2026-06-30',
    rakutenConfidence: 3.2,
    rakutenLastUpdated: '2026-06-28',
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
    affiliateUrl: 'https://www.amazon.co.jp/dp/B002SGX79U?tag=kamelife09-22',
    asin: 'B002SGX79U',
    rakutenUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00plman.nhbnn536.g00plman.nhbnoef3/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fminatodenk%2Feheim-2217-new%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fminatodenk%2Fi%2F10093001%2F&rafcid=wsc_i_is_fa8391ab-300d-4c4c-be83-ca2ddfdc47be',
    rakutenStatus: 'available',
    rakutenSearchTerm: 'エーハイム クラシック 2217',
    image: '/assets/products/placeholder.webp',
    why: '外部フィルターの定番モデル。ろ過能力と静音性が高く、長期間使い続けるユーザーが多い',
    rating: 4.9,
    badge: 'Premium',
    recommendedFor: ['fully_aquatic', 'advanced'],
    rakutenPrice: 24600,
    rakutenShop: 'ミナトワークス',
    rakutenConfidence: 8.4,
    rakutenLastUpdated: '2026-06-30',
  },

  filter_canister_xl: {
    id: 'filter_canister_xl',
    name: 'GEX メガパワー 6090 外部フィルター',
    category: 'filter',
    tier: 'premium',
    priceRange: '¥20,000–40,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B00BJQ50HC?tag=kamelife09-22',
    asin: 'B00BJQ50HC',
    image: '/assets/products/placeholder.webp',
    why: 'カメの糞や食べ残しで汚れやすい水槽でも、大容量でろ過が追いつきやすい外部フィルター',
    rating: 4.8,
    badge: 'Premium',
    recommendedFor: ['fully_aquatic', 'advanced'],
    rakutenUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00pyjhn.nhbnncfa.g00pyjhn.nhbnodd2/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fchanet%2F45364%2F&rafcid=wsc_i_is_fa8391ab-300d-4c4c-be83-ca2ddfdc47be',
    rakutenStatus: 'available',
    rakutenSearchTerm: 'Fluval FX フィルター 亀 大型水槽',
  },

  filter_submersible_medium: {
    id: 'filter_submersible_medium',
    name: '水中フィルター（中型）',
    category: 'filter',
    tier: 'standard',
    priceRange: '¥3,000–7,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B004PQMP44?tag=kamelife09-22',
    asin: 'B004PQMP44',
    image: '/assets/products/placeholder.webp',
    why: '60〜90cm水槽に対応。省スペースで強力なろ過を発揮',
    rating: 4.2,
    badge: null,
    recommendedFor: ['semi_aquatic_medium'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: '水中フィルター 亀 中型',
  },

  filter_turtle_clean: {
    id: 'filter_turtle_clean',
    name: 'テトラ レプトフィルター 10i',
    category: 'filter',
    tier: 'standard',
    priceRange: '¥4,000–9,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B000NGQZU0?tag=kamelife09-22',
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

  /* ══════════════════════════════════════════
     SUBSTRATE（床材）  9商品
     ══════════════════════════════════════════ */

  substrate_soil: {
    id: 'substrate_soil',
    name: '赤玉土（小粒）14L',
    category: 'substrate',
    tier: 'budget',
    priceRange: '¥500–1,500',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B0CJM4TL3Q?tag=kamelife09-22',
    asin: 'B0CJM4TL3Q',
    rakutenUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00pyjhn.nhbnncfa.g00pyjhn.nhbnodd2/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fchanet%2F97957%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fchanet%2Fi%2F10179240%2F&rafcid=wsc_i_is_fa8391ab-300d-4c4c-be83-ca2ddfdc47be',
    rakutenStatus: 'available',
    rakutenSearchTerm: '赤玉土 小粒 爬虫類',
    image: '/assets/products/placeholder.webp',
    why: 'リクガメの定番床材。保湿性と排水性のバランスが良く経済的',
    rating: 4.3,
    badge: 'Budget Pick',
    recommendedFor: ['tortoise_dry_small', 'tortoise_dry_large'],
    rakutenPrice: 350,
    rakutenShop: 'charm 楽天市場店',
    rakutenConfidence: 8.5,
    rakutenLastUpdated: '2026-06-30',
  },

  substrate_coco: {
    id: 'substrate_coco',
    name: 'ヤシガラ（ブリック）',
    category: 'substrate',
    tier: 'budget',
    priceRange: '¥800–2,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B005J94WEM?tag=kamelife09-22',
    asin: 'B005J94WEM',
    image: '/assets/products/placeholder.webp',
    why: '高湿度を好む森林性カメに最適。保湿力が高く蒸れにくい',
    rating: 4.4,
    badge: 'Best Overall',
    recommendedFor: ['tortoise_forest', 'box_turtle'],
    rakutenUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00tfofn.nhbnnfd1.g00tfofn.nhbno9c2/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fb-faith%2Fhasukuchip5%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fb-faith%2Fi%2F10001472%2F&rafcid=wsc_i_is_fa8391ab-300d-4c4c-be83-ca2ddfdc47be',
    rakutenStatus: 'available', // Phase 28-HOTFIX: b-faith/hasukuchip5 not resolvable; merchant's current Rakuten/Yahoo slug differs (b-faith01), reverted to search fallback
    rakutenSearchTerm: 'ヤシガラ 爬虫類 床材',
    rakutenPrice: 1098,
    rakutenShop: '雑貨イズム',
    rakutenConfidence: 8.3,
    rakutenLastUpdated: '2026-06-30',
  },

  substrate_sand_mix: {
    id: 'substrate_sand_mix',
    name: '砂・土ミックス床材',
    category: 'substrate',
    tier: 'standard',
    priceRange: '¥1,000–3,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B06XC8YK4Y?tag=kamelife09-22',
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

  // ── Task2 追加 ──

  substrate_grassland_mix: {
    id: 'substrate_grassland_mix',
    name: 'GEX EXOTERRA デザートベース 細目 3L',
    category: 'substrate',
    tier: 'standard',
    priceRange: '¥1,500–3,500',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B08W314BWC?tag=kamelife09-22',
    asin: 'B08W314BWC',
    image: '/assets/products/placeholder.webp',
    why: '国産天然素材100%の細粒床材。通気性が高く地中海系リクガメの乾燥環境を再現しやすい。軽く掘れるため自然な行動も促しやすい',
    rating: 4.3,
    badge: 'Best Overall',
    recommendedFor: ['tortoise_dry_small'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: '草原系ブレンド床材 リクガメ',
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

  substrate_sand_river: {
    id: 'substrate_sand_river',
    name: '川砂（白砂）5kg',
    category: 'substrate',
    tier: 'budget',
    priceRange: '¥600–1,500',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B00XVP3TPO?tag=kamelife09-22',
    asin: 'B00XVP3TPO',
    image: '/assets/products/placeholder.webp',
    why: '水棲ガメ水槽の底砂に。自然な雰囲気を出しつつ清掃しやすい',
    rating: 3.9,
    badge: 'Budget Pick',
    recommendedFor: ['semi_aquatic_small', 'japanese_pond'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: '川砂 白砂 爬虫類 床材',
  },

  substrate_forest_blend: {
    id: 'substrate_forest_blend',
    name: 'フォレストブレンド床材 10L',
    category: 'substrate',
    tier: 'standard',
    priceRange: '¥1,800–4,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B07PGZN9CF?tag=kamelife09-22',
    asin: 'B07PGZN9CF',
    image: '/assets/products/placeholder.webp',
    why: 'ヤシガラ・腐葉土・バークチップをブレンドした床材。森林性ハコガメの生息環境に近づけたい人に',
    rating: 4.4,
    badge: null,
    recommendedFor: ['box_turtle', 'tortoise_forest'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: '爬虫類 床材 フォレスト ブレンド',
  },

  substrate_cypress: {
    id: 'substrate_cypress',
    name: 'GEX EXOTERRA フォレストバーク 8.8L',
    category: 'substrate',
    tier: 'premium',
    priceRange: '¥1,200–2,500',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B07PGZN9CF?tag=kamelife09-22',
    asin: 'B07PGZN9CF',
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'Zoo Med サイプレスマルチ',
    image: '/assets/products/placeholder.webp',
    why: '天然ベイマツ樹皮の崩れにくい床材。高い保湿・調湿効果で森林系リクガメやハコガメに。チップが大きく通気性も保ちやすい',
    rating: 4.6,
    badge: 'Premium',
    recommendedFor: ['tortoise_forest', 'box_turtle', 'advanced'],
  },

  substrate_soil_plain: {
    id: 'substrate_soil_plain',
    name: '培養土（無肥料）5L',
    category: 'substrate',
    tier: 'budget',
    priceRange: '¥300–800',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: 'ホームセンターで入手可能な最安値床材。無肥料タイプを選ぶこと',
    rating: 3.7,
    badge: 'Budget Pick',
    recommendedFor: ['beginner'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: '培養土 無肥料 爬虫類 リクガメ',
  },

  /* ══════════════════════════════════════════
     SHELTER（シェルター）  8商品
     ══════════════════════════════════════════ */

  shelter_small: {
    id: 'shelter_small',
    name: 'ロックシェルター SS/S',
    category: 'shelter',
    tier: 'budget',
    priceRange: '¥800–1,800',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B07F3Q7L3Y?tag=kamelife09-22',
    asin: 'B07F3Q7L3Y',
    image: '/assets/products/placeholder.webp',
    why: 'ストレス軽減に必須の隠れ家。出入りしやすいサイズ選びが重要',
    rating: 4.2,
    badge: 'Budget Pick',
    recommendedFor: ['beginner', 'semi_aquatic_small'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'ロックシェルター SS S 爬虫類',
  },

  shelter_medium: {
    id: 'shelter_medium',
    name: 'ロックシェルター M/L',
    category: 'shelter',
    tier: 'standard',
    priceRange: '¥1,500–3,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B07F3L16ZR?tag=kamelife09-22',
    asin: 'B07F3L16ZR',
    image: '/assets/products/placeholder.webp',
    why: '成長して今までのシェルターが窮屈になった個体に。サイズアップの目安として',
    rating: 4.3,
    badge: 'Best Overall',
    recommendedFor: ['tortoise_dry_small', 'tortoise_forest'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'ロックシェルター M L 爬虫類',
  },

  // ── Task2 追加 ──

  shelter_bark_hide: {
    id: 'shelter_bark_hide',
    name: 'コルクバーク（丸太）',
    category: 'shelter',
    tier: 'standard',
    priceRange: '¥1,500–4,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B01F654UHM?tag=kamelife09-22',
    asin: 'B01F654UHM',
    image: '/assets/products/placeholder.webp',
    why: '自然素材のシェルター。湿度を保持しカメが潜り込みやすい形状',
    rating: 4.5,
    badge: 'Best Overall',
    recommendedFor: ['tortoise_forest', 'box_turtle'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'コルクバーク 爬虫類 シェルター',
  },

  shelter_moist_hide: {
    id: 'shelter_moist_hide',
    name: 'モイストハイド（湿潤シェルター）',
    category: 'shelter',
    tier: 'standard',
    priceRange: '¥2,000–4,500',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B08W2ZKT94?tag=kamelife09-22',
    asin: 'B08W2ZKT94',
    image: '/assets/products/placeholder.webp',
    why: '内部に水苔を詰めて高湿度空間を作る。脱水防止と脱皮補助に効果的',
    rating: 4.4,
    badge: null,
    recommendedFor: ['box_turtle', 'tortoise_forest'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: '湿潤 シェルター モイスト 爬虫類',
  },

  shelter_slate_flat: {
    id: 'shelter_slate_flat',
    name: 'スレートフラットシェルター',
    category: 'shelter',
    tier: 'budget',
    priceRange: '¥800–2,000',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '薄型で低く這いつくばるタイプのカメに最適。上に乗ることもできる',
    rating: 3.9,
    badge: 'Budget Pick',
    recommendedFor: ['semi_aquatic_small', 'japanese_pond'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'スレート フラット シェルター 爬虫類',
  },

  shelter_cave_lg: {
    id: 'shelter_cave_lg',
    name: 'ラージケーブシェルター',
    category: 'shelter',
    tier: 'standard',
    priceRange: '¥3,000–6,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B00E0GM8JG?tag=kamelife09-22',
    asin: 'B00E0GM8JG',
    image: '/assets/products/placeholder.webp',
    why: '成体リクガメが余裕で入れる大型シェルター。安全感を与えストレスを防ぐ',
    rating: 4.3,
    badge: null,
    recommendedFor: ['tortoise_dry_large'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'ケーブ シェルター 大型 爬虫類',
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
    affiliateUrl: 'https://www.amazon.co.jp/dp/B00O0QMK2Q?tag=kamelife09-22',
    asin: 'B00O0QMK2Q',
    image: '/assets/products/placeholder.webp',
    why: '水面に浮かせる陸場兼シェルター。バスキングと隠れ場を兼用できる',
    rating: 4.1,
    badge: 'Budget Pick',
    recommendedFor: ['semi_aquatic_small', 'japanese_pond', 'beginner'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: '亀 浮島 ドック 水棲',
    rakutenPrice: 2180,
    rakutenShop: 'charm 楽天市場店',
    rakutenConfidence: 3.2,
    rakutenLastUpdated: '2026-06-30',
    rakutenConfidence: 3.2,
    rakutenLastUpdated: '2026-06-28',
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
    affiliateUrl: 'https://www.amazon.co.jp/dp/B07TYN8584?tag=kamelife09-22',
    asin: 'B07TYN8584',
    image: '/assets/products/placeholder.webp',
    why: '温度・湿度の同時監視が可能。設置場所の環境管理に必須',
    rating: 4.2,
    badge: 'Budget Pick',
    recommendedFor: ['beginner'],
    rakutenUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00uaxan.nhbnn474.g00uaxan.nhbno5bc/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fpalpito%2F0012-2%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fpalpito%2Fi%2F10000133%2F&rafcid=wsc_i_is_fa8391ab-300d-4c4c-be83-ca2ddfdc47be',
    rakutenStatus: 'available', // Phase 28-HOTFIX: palpito/0012-2 is mapped to wrong merchant (palpito sells women's apparel, not pet supplies); reverted to search fallback
    rakutenSearchTerm: 'デジタル 温湿度計 爬虫類',
    rakutenPrice: 1470,
    rakutenShop: 'Palpito 楽天市場店',
    rakutenConfidence: 9.9,
    rakutenLastUpdated: '2026-06-30',
  },

  thermometer_aqua: {
    id: 'thermometer_aqua',
    name: '水温計（デジタル）',
    category: 'thermometer',
    tier: 'budget',
    priceRange: '¥800–2,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B09KLRGC1Y?tag=kamelife09-22',
    asin: 'B09KLRGC1Y',
    image: '/assets/products/placeholder.webp',
    why: '水棲ガメの水温管理に。アナログ式より数値を読み取りやすく細かい変化に気づきやすい',
    rating: 4.1,
    badge: 'Budget Pick',
    recommendedFor: ['semi_aquatic_small', 'semi_aquatic_medium', 'fully_aquatic'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: '水温計 デジタル 亀',
    rakutenConfidence: 7.3,
    rakutenLastUpdated: '2026-06-30',
  },

  // ── Task2 追加 ──

  thermometer_dual_probe: {
    id: 'thermometer_dual_probe',
    name: 'デジタル温度計（デュアルプローブ）',
    category: 'thermometer',
    tier: 'standard',
    priceRange: '¥2,500–5,500',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B01KLHZOWA?tag=kamelife09-22',
    asin: 'B01KLHZOWA',
    image: '/assets/products/placeholder.webp',
    why: 'ホットスポットとクールゾーンを同時計測。温度勾配の確認に便利',
    rating: 4.5,
    badge: 'Best Overall',
    recommendedFor: ['tortoise_dry_small', 'tortoise_dry_large'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'デジタル温度計 デュアルプローブ 爬虫類',
  },

  thermometer_infrared: {
    id: 'thermometer_infrared',
    name: '非接触型赤外線温度計',
    category: 'thermometer',
    tier: 'standard',
    priceRange: '¥2,000–5,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B09VCJP5SK?tag=kamelife09-22',
    asin: 'B09VCJP5SK',
    image: '/assets/products/placeholder.webp',
    why: 'カメに触れずに体表温度や床材温度を瞬時に測定。バスキング調整に活用',
    rating: 4.6,
    badge: 'Best Overall',
    recommendedFor: ['tortoise_dry_large', 'advanced'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: '赤外線 温度計 非接触 爬虫類',
    rakutenConfidence: 7.2,
    rakutenLastUpdated: '2026-06-30',
  },

  thermometer_wifi: {
    id: 'thermometer_wifi',
    name: 'SwitchBot 温湿度計 WiFi対応',
    category: 'thermometer',
    tier: 'premium',
    priceRange: '¥4,000–10,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B0CZ42FLXM?tag=kamelife09-22',
    asin: 'B0CZ42FLXM',
    image: '/assets/products/placeholder.webp',
    why: 'スマホで24時間リモート監視・アラート機能付き。外出時も離れた場所から状態を確認できる',
    rating: 4.8,
    badge: 'Premium',
    recommendedFor: ['advanced'],
    rakutenUrl: null,
    rakutenStatus: 'search', // Phase 28-HOTFIX: duplicate rakutenUrl key (data bug) + chanet/264058 not verifiable (chanet is a pet store, unlikely SwitchBot stockist); reverted to search fallback
    rakutenSearchTerm: 'WiFi 温湿度 ロガー 爬虫類',
  },

  thermometer_analog: {
    id: 'thermometer_analog',
    name: 'アナログ温湿度計',
    category: 'thermometer',
    tier: 'budget',
    priceRange: '¥500–1,500',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B00CX9G5DM?tag=kamelife09-22',
    asin: 'B00CX9G5DM',
    image: '/assets/products/placeholder.webp',
    why: '電池不要で壁掛けが可能。バックアップ用や屋外飼育スペースに',
    rating: 3.7,
    badge: 'Budget Pick',
    recommendedFor: ['beginner'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'アナログ 温湿度計 爬虫類',
    rakutenConfidence: 7.7,
    rakutenLastUpdated: '2026-06-30',
  },

  /* ══════════════════════════════════════════
     FOOD（フード）  9商品
     ══════════════════════════════════════════ */

  food_aquatic_staple: {
    id: 'food_aquatic_staple',
    name: 'カメプロス（テトラ）',
    category: 'food',
    tier: 'budget',
    priceRange: '¥600–1,500',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B00E0GMQAM?tag=kamelife09-22',
    asin: 'B00E0GMQAM',
    image: '/assets/products/placeholder.webp',
    why: '水棲ガメの基本人工飼料。栄養バランスに優れ食いつきが良い',
    rating: 4.4,
    badge: 'Best Overall',
    recommendedFor: ['semi_aquatic_small', 'semi_aquatic_medium', 'japanese_pond'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'カメプロス テトラ 亀 餌',
  },

  food_tortoise_staple: {
    id: 'food_tortoise_staple',
    name: 'リクガメフード（Zoo Med）',
    category: 'food',
    tier: 'standard',
    priceRange: '¥1,200–2,500',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B0DF2SJMCJ?tag=kamelife09-22',
    asin: 'B0DF2SJMCJ',
    image: '/assets/products/placeholder.webp',
    why: '植物性主体のリクガメ専用フード。野草の補助として活用',
    rating: 4.5,
    badge: 'Best Overall',
    recommendedFor: ['tortoise_dry_small', 'tortoise_dry_large', 'tortoise_forest'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'リクガメフード Zoo Med 乾燥草',
  },

  // ── Task2 追加 ──

  food_aquatic_premium: {
    id: 'food_aquatic_premium',
    name: 'レプトミン（テトラ）',
    category: 'food',
    tier: 'budget',
    priceRange: '¥500–1,200',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B0F31WW4Q2?tag=kamelife09-22',
    asin: 'B0F31WW4Q2',
    image: '/assets/products/placeholder.webp',
    why: '水棲ガメ定番の人工飼料。スティックタイプで食べさせやすく価格も手頃',
    rating: 4.2,
    badge: 'Budget Pick',
    recommendedFor: ['semi_aquatic_small', 'beginner'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'レプトミン テトラ 亀 餌',
    rakutenConfidence: 3.9,
    rakutenLastUpdated: '2026-06-30',
  },

  food_aqua_turtle_pellet: {
    id: 'food_aqua_turtle_pellet',
    name: 'カメの主食（GEX）',
    category: 'food',
    tier: 'budget',
    priceRange: '¥400–1,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B08XBQDYM2?tag=kamelife09-22',
    asin: 'B08XBQDYM2',
    image: '/assets/products/placeholder.webp',
    why: '国内で入手しやすいコスパ良好なペレット。半水棲ガメの日常食に',
    rating: 4.0,
    badge: 'Budget Pick',
    recommendedFor: ['beginner', 'semi_aquatic_small'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'カメの主食 GEX 亀 フード',
    rakutenConfidence: 5.3,
    rakutenLastUpdated: '2026-06-30',
  },

  food_box_turtle_omnivore: {
    id: 'food_box_turtle_omnivore',
    name: 'ボックスタートルフード（Zoo Med）',
    category: 'food',
    tier: 'standard',
    priceRange: '¥1,500–3,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B0F6JWRMSL?tag=kamelife09-22',
    asin: 'B0F6JWRMSL',
    image: '/assets/products/placeholder.webp',
    why: '雑食性ハコガメ向けの動植物混合フード。昆虫・果実成分を配合',
    rating: 4.5,
    badge: 'Best Overall',
    recommendedFor: ['box_turtle'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'ボックスタートル フード Zoo Med',
    rakutenConfidence: 5.7,
    rakutenLastUpdated: '2026-06-30',
  },

  food_dried_shrimp: {
    id: 'food_dried_shrimp',
    name: '乾燥エビ（ひかりFD）',
    category: 'food',
    tier: 'budget',
    priceRange: '¥300–800',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B0CKBKF2ZH?tag=kamelife09-22',
    asin: 'B0CKBKF2ZH',
    image: '/assets/products/placeholder.webp',
    why: 'たんぱく質補給のおやつ。水棲・半水棲ガメが好んで食べる',
    rating: 4.1,
    badge: 'Budget Pick',
    recommendedFor: ['semi_aquatic_small', 'beginner'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: '乾燥エビ 亀 おやつ ひかり',
    rakutenConfidence: 4.3,
    rakutenLastUpdated: '2026-06-30',
  },

  food_tortoise_gel: {
    id: 'food_tortoise_gel',
    name: 'Repashy Veggie Burger 170g',
    category: 'food',
    tier: 'premium',
    priceRange: '¥2,000–4,500',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B00TJ3O1HC?tag=kamelife09-22',
    asin: 'B00TJ3O1HC',
    image: '/assets/products/placeholder.webp',
    why: '水で溶かしてゲル状にする高栄養フード。偏食ガメや療養中の個体に',
    rating: 4.7,
    badge: 'Premium',
    recommendedFor: ['advanced', 'tortoise_forest'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'リパシー ベジーバーガー リクガメ',
  },

  food_hikari_turtle: {
    id: 'food_hikari_turtle',
    name: 'ひかりウーパールーパー（タートル用）',
    category: 'food',
    tier: 'standard',
    priceRange: '¥700–1,800',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B0043UN3X4?tag=kamelife09-22',
    asin: 'B0043UN3X4',
    image: '/assets/products/placeholder.webp',
    why: 'カルシウムを強化配合した国産フード。甲羅の健康を意識して選びたい人に',
    rating: 4.3,
    badge: null,
    recommendedFor: ['semi_aquatic_medium', 'japanese_pond'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'ひかり タートル 亀 フード',
    rakutenConfidence: 6.3,
    rakutenLastUpdated: '2026-06-30',
  },

  food_tortoise_herbs: {
    id: 'food_tortoise_herbs',
    name: 'キョーリン マルベリックドライ 400g',
    category: 'food',
    tier: 'premium',
    priceRange: '¥1,500–3,500',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B09M2LVBYG?tag=kamelife09-22',
    asin: 'B09M2LVBYG',
    image: '/assets/products/placeholder.webp',
    why: '桑葉主体の植物葉フード。野草に近い繊維質で、野草採取が難しい冬季の補完食に最適',
    rating: 4.6,
    badge: 'Premium',
    recommendedFor: ['tortoise_dry_small', 'tortoise_dry_large'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: '乾燥野草 リクガメ グラスランドサラダ',
  },

  /* ══════════════════════════════════════════
     SUPPLEMENTS（サプリメント）  9商品
     旧 calcium カテゴリを拡張
     ══════════════════════════════════════════ */

  supplement_calcium_d3: {
    id: 'supplement_calcium_d3',
    name: 'カルシウムパウダー（D3入り）',
    category: 'supplements',
    tier: 'budget',
    priceRange: '¥800–2,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B0851DNPXX?tag=kamelife09-22',
    asin: 'B0851DNPXX',
    image: '/assets/products/placeholder.webp',
    why: '甲羅の形成・維持に不可欠。野菜にダスティングして与える',
    rating: 4.3,
    badge: 'Best Overall',
    recommendedFor: ['tortoise_dry_small', 'tortoise_dry_large', 'beginner'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'カルシウム パウダー D3 爬虫類',
    rakutenConfidence: 6.3,
    rakutenLastUpdated: '2026-06-30',
  },

  // ── Task2 追加 ──

  calcium_no_d3: {
    id: 'calcium_no_d3',
    name: 'カルシウムパウダー（D3なし）',
    category: 'supplements',
    tier: 'budget',
    priceRange: '¥600–1,500',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B084ZY19Q3?tag=kamelife09-22',
    asin: 'B084ZY19Q3',
    image: '/assets/products/placeholder.webp',
    why: '屋外飼育・UVBランプ完備の環境向け。D3過剰投与リスクを避けたい場合に',
    rating: 4.2,
    badge: 'Budget Pick',
    recommendedFor: ['outdoor', 'advanced'],
    rakutenUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00pyjhn.nhbnncfa.g00pyjhn.nhbnodd2/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fchanet%2F12443%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fchanet%2Fi%2F10018518%2F&rafcid=wsc_i_is_fa8391ab-300d-4c4c-be83-ca2ddfdc47be',
    rakutenStatus: 'available',
    rakutenSearchTerm: 'カルシウム パウダー 爬虫類 サプリ',
    rakutenPrice: 508,
    rakutenShop: 'charm 楽天市場店',
    rakutenConfidence: 8,
    rakutenLastUpdated: '2026-06-30',
  },

  supplement_calcium_plus: {
    id: 'supplement_calcium_plus',
    name: 'Rep-Cal カルシウムサプリ',
    category: 'supplements',
    tier: 'standard',
    priceRange: '¥1,500–3,500',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B09YYPLCV3?tag=kamelife09-22',
    asin: 'B09YYPLCV3',
    image: '/assets/products/placeholder.webp',
    why: '純度の高いカルシウム炭酸塩。リン不使用でカルシウム：リン比を適正に保つ',
    rating: 4.6,
    badge: 'Best Overall',
    recommendedFor: ['tortoise_dry_large', 'advanced'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'Rep-Cal カルシウム 爬虫類',
  },

  supplement_multivitamin: {
    id: 'supplement_multivitamin',
    name: 'マルチビタミン（爬虫類用）',
    category: 'supplements',
    tier: 'standard',
    priceRange: '¥1,200–3,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B004OHL3QK?tag=kamelife09-22',
    asin: 'B004OHL3QK',
    image: '/assets/products/placeholder.webp',
    why: 'ビタミンA・E・B群を補給。人工飼料のみの飼育では週1回のダスティングが推奨',
    rating: 4.4,
    badge: null,
    recommendedFor: ['tortoise_dry_small', 'box_turtle'],
    rakutenUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00pyjhn.nhbnncfa.g00pyjhn.nhbnodd2/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fchanet%2F79635%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fchanet%2Fi%2F10137810%2F&rafcid=wsc_i_is_fa8391ab-300d-4c4c-be83-ca2ddfdc47be',
    rakutenStatus: 'available',
    rakutenSearchTerm: 'マルチビタミン 爬虫類 サプリ',
    rakutenPrice: 525,
    rakutenShop: 'charm 楽天市場店',
    rakutenConfidence: 8.1,
    rakutenLastUpdated: '2026-06-30',
  },

  supplement_iodine: {
    id: 'supplement_iodine',
    name: 'ヨウ素サプリ（亀専用）',
    category: 'supplements',
    tier: 'standard',
    priceRange: '¥1,500–3,500',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B09M65FBTD?tag=kamelife09-22',
    asin: 'B09M65FBTD',
    image: '/assets/products/placeholder.webp',
    why: '甲状腺機能維持に必要なヨウ素を補給。リクガメの長期飼育に有効',
    rating: 4.3,
    badge: null,
    recommendedFor: ['tortoise_dry_large', 'advanced'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'ヨウ素 サプリ 亀 甲状腺',
  },

  supplement_electrolyte: {
    id: 'supplement_electrolyte',
    name: 'エレクトロライト（電解質補給）',
    category: 'supplements',
    tier: 'premium',
    priceRange: '¥1,800–4,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B000N5O6WA?tag=kamelife09-22',
    asin: 'B000N5O6WA',
    image: '/assets/products/placeholder.webp',
    why: '脱水・拒食・回復期のカメの電解質補充に。温浴水や直接投与で使用',
    rating: 4.5,
    badge: null,
    recommendedFor: ['advanced'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'エレクトロライト 爬虫類 電解質',
  },

  supplement_mineral_block: {
    id: 'supplement_mineral_block',
    name: 'カトルボーン（甲イカの骨）',
    category: 'supplements',
    tier: 'budget',
    priceRange: '¥300–800',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B0BDD1V7G5?tag=kamelife09-22',
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
    affiliateUrl: 'https://www.amazon.co.jp/dp/B01BXVIHRM?tag=kamelife09-22',
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

  supplement_spirulina: {
    id: 'supplement_spirulina',
    name: 'スピルリナパウダー',
    category: 'supplements',
    tier: 'standard',
    priceRange: '¥800–2,000',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: 'タンパク質・ミネラル・クロロフィルを含む天然サプリ。野菜に混ぜて与える',
    rating: 4.3,
    badge: null,
    recommendedFor: ['tortoise_forest', 'box_turtle'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'スピルリナ パウダー 爬虫類 サプリ',
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
    lighting_basking: { budget: 'basking_halogen_50w',   standard: 'basking_75w',            premium: 'basking_ceramic_100w' },
    heating:          { budget: 'heater_panel_30w',      standard: 'heater_panel_45',       premium: 'heater_radiant_panel' },
    substrate:        { budget: 'substrate_soil',        standard: 'substrate_grassland_mix',premium: 'substrate_cypress' },
    shelter:          { budget: 'shelter_small',         standard: 'shelter_medium',         premium: 'shelter_wood_premium' },
    thermometer:      { budget: 'thermometer_digital',   standard: 'thermometer_dual_probe', premium: 'thermometer_wifi' },
    food:             { budget: 'food_aquatic_premium',         standard: 'food_tortoise_staple',          premium: 'food_tortoise_herbs' },
    supplements:      { budget: 'supplement_calcium_d3',        standard: 'supplement_calcium_plus',      premium: null },
  },

  // ── 乾燥系リクガメ（大型：ヘルマン・チャコ・ヒョウモン等）
  tortoise_dry_large: {
    enclosure:        { budget: 'enclosure_wood_90',     standard: 'enclosure_tortoise_120',     premium: 'enclosure_tortoise_150' },
    lighting_uvb:     { budget: 'uvb_t5_desert_std',         standard: 'uvb_t5_desert_12',      premium: 'uvb_mvb_100' },
    lighting_basking: { budget: 'basking_100w',          standard: 'basking_dual_150',      premium: 'basking_hid_70w' },
    heating:          { budget: 'heater_panel_45',      standard: 'heater_panel_60',       premium: 'heater_radiant_panel' },
    substrate:        { budget: 'substrate_soil',        standard: 'substrate_sand_mix',     premium: 'substrate_cypress' },
    shelter:          { budget: 'shelter_medium',        standard: 'shelter_cave_lg',     premium: 'shelter_wood_premium' },
    thermometer:      { budget: 'thermometer_digital',   standard: 'thermometer_infrared',   premium: 'thermometer_wifi' },
    food:             { budget: 'food_tortoise_staple',         standard: 'food_tortoise_herbs',   premium: null },
    supplements:      { budget: 'supplement_calcium_d3',        standard: 'supplement_calcium_plus',      premium: 'supplement_iodine' },
  },

  // ── 森林系リクガメ（エロンガータ・アカアシ・インプレッサ等）
  tortoise_forest: {
    enclosure:        { budget: 'enclosure_glass_45',    standard: 'enclosure_kayuso_90',    premium: 'enclosure_tortoise_120' },
    lighting_uvb:     { budget: 'uvb_compact',           standard: 'uvb_t5_forest_std',          premium: 'uvb_t5_tropical_6' },
    lighting_basking: { budget: 'basking_50w',           standard: 'basking_75w',            premium: 'basking_ceramic_100w' },
    heating:          { budget: 'heater_cord_20w',       standard: 'heater_panel_45',       premium: 'thermostat_digital' },
    substrate:        { budget: 'substrate_coco',        standard: 'substrate_forest_blend', premium: 'substrate_cypress' },
    shelter:          { budget: 'shelter_small',         standard: 'shelter_bark_hide',      premium: 'shelter_moist_hide' },
    thermometer:      { budget: 'thermometer_digital',   standard: 'thermometer_dual_probe', premium: 'thermometer_wifi' },
    food:             { budget: 'food_tortoise_staple',         standard: 'food_tortoise_gel',  premium: null },
    supplements:      { budget: 'supplement_calcium_d3',        standard: 'supplement_multivitamin',premium: null },
  },

  // ── 半水棲・小型（ニオイガメ・ドロガメ・ミスクガメ等）
  semi_aquatic_small: {
    enclosure:        { budget: 'tank_60',               standard: 'tank_90',                premium: 'tank_120_aqua' },
    lighting_uvb:     { budget: 'uvb_compact',           standard: 'uvb_t5_forest_std',          premium: 'uvb_t5_tropical_6' },
    lighting_basking: { budget: 'basking_50w',           standard: 'basking_75w',            premium: null },
    heating:          { budget: 'thermostat',            standard: 'heater_aqua_100w',       premium: 'thermostat_digital' },
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
    enclosure:        { budget: 'tank_60',               standard: 'tank_90',                premium: null },
    lighting_uvb:     { budget: 'uvb_compact',           standard: 'uvb_t5_forest_std',          premium: null },
    lighting_basking: { budget: 'basking_50w',           standard: 'basking_75w',            premium: null },
    heating:          { budget: 'thermostat',            standard: 'heater_aqua_100w',       premium: null },
    filter:           { budget: 'filter_small',          standard: 'filter_turtle_clean',    premium: 'filter_canister_medium' },
    thermometer:      { budget: 'thermometer_aqua',      standard: 'thermometer_dual_probe', premium: null },
    food:             { budget: 'food_aquatic_staple',         standard: 'food_aquatic_premium',          premium: null },
    supplements:      { budget: 'supplement_mineral_block', standard: 'supplement_calcium_d3',         premium: null },
  },

  // ── 水陸両用ハコガメ（ミツユビ・トウブ・サバンナ等）
  box_turtle: {
    enclosure:        { budget: 'enclosure_glass_45',    standard: 'enclosure_kayuso_90',    premium: 'enclosure_tortoise_120' },
    lighting_uvb:     { budget: 'uvb_compact',           standard: 'uvb_t5_forest_std',          premium: 'uvb_t5_tropical_6' },
    lighting_basking: { budget: 'basking_50w',           standard: 'basking_75w',            premium: null },
    heating:          { budget: 'heater_cord_20w',       standard: 'heater_panel_45',       premium: 'thermostat_digital' },
    filter:           { budget: 'filter_small',          standard: 'filter_submersible_medium',premium: null },
    substrate:        { budget: 'substrate_coco',        standard: 'substrate_forest_blend', premium: 'substrate_cypress' },
    shelter:          { budget: 'shelter_small',         standard: 'shelter_bark_hide',      premium: 'shelter_moist_hide' },
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
