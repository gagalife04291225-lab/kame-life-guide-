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

  enclosure_wood_120: {
    id: 'enclosure_wood_120',
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
    why: '中型以上のリクガメや成体に適した広さ',
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
    rakutenLastUpdated: '2026-06-28',
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
    image: '/assets/products/placeholder.webp',
    why: '中型水棲ガメや複数飼育に対応できる容量',
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
    rakutenStatus: 'pending',
    rakutenSearchTerm: null,
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
    why: '幼体・小型種に最適なコンパクトサイズ。観察しやすいガラス製',
    rating: 4.0,
    badge: null,
    recommendedFor: ['beginner', 'small_aquatic'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'ガラスケージ 45cm 爬虫類',
    rakutenConfidence: 3.9,
    rakutenLastUpdated: '2026-06-28',
  },

  enclosure_wood_150: {
    id: 'enclosure_wood_150',
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
    name: '水槽 120cm（アクリル）',
    category: 'enclosure',
    tier: 'premium',
    priceRange: '¥25,000–55,000',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '大型水棲ガメ・スッポン・マタマタの本格飼育に。軽量で割れにくいアクリル',
    rating: 4.6,
    badge: 'Premium',
    recommendedFor: ['fully_aquatic', 'advanced'],
    rakutenUrl: null,
    rakutenStatus: 'pending',
    rakutenSearchTerm: null,
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
    rakutenStatus: 'pending',
    rakutenSearchTerm: null,
  },

  /* ══════════════════════════════════════════
     LIGHTING_UVB（UVBライト）  9商品
     ══════════════════════════════════════════ */

  uvb_desert_t5: {
    id: 'uvb_desert_t5',
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

  uvb_forest_t5: {
    id: 'uvb_forest_t5',
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
    rakutenLastUpdated: '2026-06-28',
  },

  // ── Task2 追加 ──

  uvb_arcadia_t5_6: {
    id: 'uvb_arcadia_t5_6',
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
    why: '森林・湿潤系ガメに最適な中強度UVB。発色も自然で観察しやすい',
    rating: 4.5,
    badge: null,
    recommendedFor: ['tortoise_forest', 'box_turtle'],
  },

  uvb_arcadia_t5_12: {
    id: 'uvb_arcadia_t5_12',
    name: 'Arcadia T5 HO 12% UVB',
    category: 'lighting_uvb',
    tier: 'premium',
    priceRange: '¥5,000–10,000',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '乾燥系リクガメ・砂漠種向けの高強度UVB。長距離照射で広範囲をカバー',
    rating: 4.8,
    badge: 'Premium',
    recommendedFor: ['tortoise_dry_large', 'advanced'],
    rakutenUrl: null,
    rakutenStatus: 'pending',
    rakutenSearchTerm: null,
  },

  uvb_combo_mvb_100: {
    id: 'uvb_combo_mvb_100',
    name: 'MVB 自発光UVBランプ 100W',
    category: 'lighting_uvb',
    tier: 'premium',
    priceRange: '¥6,000–12,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B07BBMVJ6H?tag=kamelife09-22',
    asin: 'B07BBMVJ6H',
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'MVB 自発光 UVBランプ 爬虫類',
    image: '/assets/products/placeholder.webp',
    why: 'UVB＋バスキング一体型。ランプ1本で照明コストを削減できる上級者向け',
    rating: 4.4,
    badge: 'Premium',
    recommendedFor: ['advanced', 'tortoise_dry_large'],
  },

  uvb_led_strip: {
    id: 'uvb_led_strip',
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
    rakutenLastUpdated: '2026-06-28',
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
    rakutenStatus: 'pending',
    rakutenSearchTerm: null,
  },

  uvb_zilla_t5: {
    id: 'uvb_zilla_t5',
    name: 'Zilla Desert 50 T5 UVB',
    category: 'lighting_uvb',
    tier: 'standard',
    priceRange: '¥3,500–7,000',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '乾燥系リクガメ向けの信頼性の高いミドルレンジランプ',
    rating: 4.3,
    badge: null,
    recommendedFor: ['tortoise_dry_small'],
    rakutenUrl: null,
    rakutenStatus: 'pending',
    rakutenSearchTerm: null,
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
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '小型ケージのホットスポット形成に適した出力',
    rating: 4.2,
    badge: 'Budget Pick',
    recommendedFor: ['semi_aquatic_small', 'box_turtle', 'japanese_pond'],
    rakutenUrl: null,
    rakutenStatus: 'pending',
    rakutenSearchTerm: null,
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
    rakutenLastUpdated: '2026-06-28',
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
    rakutenLastUpdated: '2026-06-28',
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

  basking_dual_150w: {
    id: 'basking_dual_150w',
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

  basking_solar_raptor: {
    id: 'basking_solar_raptor',
    name: 'Solar Raptor HID 70W',
    category: 'lighting_basking',
    tier: 'premium',
    priceRange: '¥12,000–20,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B0858Y7XJX?tag=kamelife09-22',
    asin: 'B0858Y7XJX',
    image: '/assets/products/placeholder.webp',
    why: '太陽光に最も近い演色性。大型リクガメの高温バスキング＋UVB同時供給',
    rating: 4.8,
    badge: 'Premium',
    recommendedFor: ['advanced', 'tortoise_dry_large'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'HID ランプ 爬虫類 メタルハライド',
    rakutenConfidence: 7.7,
    rakutenLastUpdated: '2026-06-28',
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
    rakutenLastUpdated: '2026-06-28',
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
    rakutenLastUpdated: '2026-06-28',
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
    rakutenLastUpdated: '2026-06-28',
  },

  heater_panel_45w: {
    id: 'heater_panel_45w',
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
    rakutenLastUpdated: '2026-06-28',
  },

  heater_aqua_100w: {
    id: 'heater_aqua_100w',
    name: '水中ヒーター 100W',
    category: 'heating',
    tier: 'standard',
    priceRange: '¥1,500–3,500',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '水棲ガメの水温維持に必須。オートカットつきが安心',
    rating: 4.3,
    badge: 'Best Overall',
    recommendedFor: ['semi_aquatic_small', 'semi_aquatic_medium'],
    rakutenUrl: null,
    rakutenStatus: 'pending',
    rakutenSearchTerm: null,
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
    rakutenLastUpdated: '2026-06-28',
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
    rakutenConfidence: 6.3,
    rakutenLastUpdated: '2026-06-28',
  },

  heater_radiant_panel: {
    id: 'heater_radiant_panel',
    name: '輻射熱パネルヒーター（天井設置）',
    category: 'heating',
    tier: 'premium',
    priceRange: '¥8,000–18,000',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: 'ケージ天井に取り付け、ケージ全体を均一に温める。大型リクガメ飼育に最適',
    rating: 4.6,
    badge: 'Premium',
    recommendedFor: ['tortoise_dry_large', 'advanced'],
    rakutenUrl: null,
    rakutenStatus: 'pending',
    rakutenSearchTerm: null,
  },

  heater_cord_20w: {
    id: 'heater_cord_20w',
    name: 'ヒーティングコード 20W',
    category: 'heating',
    tier: 'budget',
    priceRange: '¥1,500–3,000',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: 'ケージ側面・底面に這わせて使う万能タイプ。湿度の高い環境でも使用可',
    rating: 3.9,
    badge: 'Budget Pick',
    recommendedFor: ['beginner', 'tortoise_forest'],
    rakutenUrl: null,
    rakutenStatus: 'pending',
    rakutenSearchTerm: null,
  },

  heater_panel_60w: {
    id: 'heater_panel_60w',
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
    rakutenLastUpdated: '2026-06-28',
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
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: '外部フィルター 60cm 亀',
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
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: '外部フィルター 大型 亀',
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
    why: '生物ろ過に優れシンプル構造で清掃しやすい。水棲ガメ入門に最適',
    rating: 4.0,
    badge: 'Budget Pick',
    recommendedFor: ['beginner', 'semi_aquatic_small'],
    rakutenUrl: null,
    rakutenStatus: 'pending',
    rakutenSearchTerm: null,
  },

  filter_canister_eheim_2217: {
    id: 'filter_canister_eheim_2217',
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
    why: '業界標準の外部フィルター。ろ過能力・静音性・耐久性で長年トップクラス',
    rating: 4.9,
    badge: 'Premium',
    recommendedFor: ['fully_aquatic', 'advanced'],
    rakutenPrice: 24600,
    rakutenShop: 'ミナトワークス',
    rakutenConfidence: 8.4,
    rakutenLastUpdated: '2026-06-28',
  },

  filter_fluval_fx: {
    id: 'filter_fluval_fx',
    name: 'Fluval FX シリーズ',
    category: 'filter',
    tier: 'premium',
    priceRange: '¥20,000–40,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B00BJQ50HC?tag=kamelife09-22',
    asin: 'B00BJQ50HC',
    image: '/assets/products/placeholder.webp',
    why: 'カメの糞・食べ残しによる汚濁をパワフルに処理する大容量外部フィルター',
    rating: 4.8,
    badge: 'Premium',
    recommendedFor: ['fully_aquatic', 'advanced'],
    rakutenUrl: null,
    rakutenStatus: 'search',
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
    name: 'カメ専用フィルター（テトラ）',
    category: 'filter',
    tier: 'standard',
    priceRange: '¥4,000–9,000',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: 'カメ飼育専用設計。浅い水位でも稼働し物理・生物・化学の3段ろ過を実現',
    rating: 4.4,
    badge: 'Best Overall',
    recommendedFor: ['semi_aquatic_small', 'japanese_pond'],
    rakutenUrl: null,
    rakutenStatus: 'pending',
    rakutenSearchTerm: null,
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
    rakutenLastUpdated: '2026-06-28',
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
    rakutenStatus: 'available',
    rakutenSearchTerm: 'ヤシガラ 爬虫類 床材',
    rakutenPrice: 1098,
    rakutenShop: '雑貨イズム',
    rakutenConfidence: 8.3,
    rakutenLastUpdated: '2026-06-28',
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
    name: '草原系ブレンド床材 5L',
    category: 'substrate',
    tier: 'standard',
    priceRange: '¥1,500–3,500',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '赤玉土・バーミキュライト・砂のブレンド。地中海系リクガメに最適',
    rating: 4.3,
    badge: 'Best Overall',
    recommendedFor: ['tortoise_dry_small'],
    rakutenUrl: null,
    rakutenStatus: 'pending',
    rakutenSearchTerm: null,
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
    why: '保湿性が非常に高く、産卵床・高湿度ゾーンの作成に最適',
    rating: 4.5,
    badge: null,
    recommendedFor: ['box_turtle', 'tortoise_forest'],
    rakutenUrl: null,
    rakutenStatus: 'pending',
    rakutenSearchTerm: null,
  },

  substrate_river_sand: {
    id: 'substrate_river_sand',
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
    why: 'ヤシガラ・腐葉土・バークチップのブレンド。森林性ハコガメに最適',
    rating: 4.4,
    badge: null,
    recommendedFor: ['box_turtle', 'tortoise_forest'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: '爬虫類 床材 フォレスト ブレンド',
  },

  substrate_cypress_mulch: {
    id: 'substrate_cypress_mulch',
    name: 'サイプレスマルチ（Zoo Med）',
    category: 'substrate',
    tier: 'premium',
    priceRange: '¥2,500–5,000',
    affiliateUrl: '#',
    asin: null,
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'Zoo Med サイプレスマルチ',
    image: '/assets/products/placeholder.webp',
    why: '防カビ効果があり高湿度環境でも清潔を維持。プロブリーダー御用達',
    rating: 4.6,
    badge: 'Premium',
    recommendedFor: ['tortoise_forest', 'box_turtle', 'advanced'],
  },

  substrate_top_soil: {
    id: 'substrate_top_soil',
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
    rakutenStatus: 'pending',
    rakutenSearchTerm: null,
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
    why: '中型種や成長した個体向けのシェルター',
    rating: 4.3,
    badge: 'Best Overall',
    recommendedFor: ['tortoise_dry_small', 'tortoise_forest'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'ロックシェルター M L 爬虫類',
  },

  // ── Task2 追加 ──

  shelter_cork_bark: {
    id: 'shelter_cork_bark',
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

  shelter_humid_hide: {
    id: 'shelter_humid_hide',
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
    rakutenStatus: 'pending',
    rakutenSearchTerm: null,
  },

  shelter_large_cave: {
    id: 'shelter_large_cave',
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

  shelter_premium_wood: {
    id: 'shelter_premium_wood',
    name: 'ウッドハイドハウス（プレミアム）',
    category: 'shelter',
    tier: 'premium',
    priceRange: '¥5,000–10,000',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '自然木製の高品質シェルター。観察窓付きで管理しやすく見た目も美しい',
    rating: 4.6,
    badge: 'Premium',
    recommendedFor: ['tortoise_dry_small', 'advanced'],
    rakutenUrl: null,
    rakutenStatus: 'pending',
    rakutenSearchTerm: null,
  },

  shelter_aqua_dock: {
    id: 'shelter_aqua_dock',
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
    rakutenStatus: 'available',
    rakutenSearchTerm: 'デジタル 温湿度計 爬虫類',
    rakutenPrice: 1470,
    rakutenShop: 'Palpito 楽天市場店',
    rakutenConfidence: 9.9,
    rakutenLastUpdated: '2026-06-28',
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
    why: '水棲ガメの水温管理に。アナログより精度が高くおすすめ',
    rating: 4.1,
    badge: 'Budget Pick',
    recommendedFor: ['semi_aquatic_small', 'semi_aquatic_medium', 'fully_aquatic'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: '水温計 デジタル 亀',
    rakutenConfidence: 7.3,
    rakutenLastUpdated: '2026-06-28',
  },

  // ── Task2 追加 ──

  thermometer_dual_probe: {
    id: 'thermometer_dual_probe',
    name: 'デジタル温度計（デュアルプローブ）',
    category: 'thermometer',
    tier: 'standard',
    priceRange: '¥2,500–5,500',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: 'ホットスポットとクールゾーンを同時計測。温度勾配の確認に便利',
    rating: 4.5,
    badge: 'Best Overall',
    recommendedFor: ['tortoise_dry_small', 'tortoise_dry_large'],
    rakutenUrl: null,
    rakutenStatus: 'pending',
    rakutenSearchTerm: null,
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
    rakutenLastUpdated: '2026-06-28',
  },

  thermometer_pro_wifi: {
    id: 'thermometer_pro_wifi',
    name: 'Wi-Fi 温湿度ロガー',
    category: 'thermometer',
    tier: 'premium',
    priceRange: '¥4,000–10,000',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B0CZ42FLXM?tag=kamelife09-22',
    asin: 'B0CZ42FLXM',
    image: '/assets/products/placeholder.webp',
    why: 'スマホで24時間リモート監視・アラート機能付き。外出時の安心感が段違い',
    rating: 4.8,
    badge: 'Premium',
    recommendedFor: ['advanced'],
    rakutenUrl: null,
    rakutenStatus: 'search',
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
    rakutenLastUpdated: '2026-06-28',
  },

  /* ══════════════════════════════════════════
     FOOD（フード）  9商品
     ══════════════════════════════════════════ */

  food_kamepros: {
    id: 'food_kamepros',
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

  food_tortoise: {
    id: 'food_tortoise',
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

  food_reptomin: {
    id: 'food_reptomin',
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
    rakutenLastUpdated: '2026-06-28',
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
    rakutenLastUpdated: '2026-06-28',
  },

  food_box_turtle: {
    id: 'food_box_turtle',
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
    rakutenLastUpdated: '2026-06-28',
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
    rakutenLastUpdated: '2026-06-28',
  },

  food_repashy_tortoise: {
    id: 'food_repashy_tortoise',
    name: 'Repashy Veggie Burger（ゲル状フード）',
    category: 'food',
    tier: 'premium',
    priceRange: '¥2,000–4,500',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '水で溶かしてゲル状にする高栄養フード。偏食ガメや療養中の個体に',
    rating: 4.7,
    badge: 'Premium',
    recommendedFor: ['advanced', 'tortoise_forest'],
    rakutenUrl: null,
    rakutenStatus: 'pending',
    rakutenSearchTerm: null,
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
    why: 'カルシウム強化配合。カメの甲羅健康維持に配慮した国産フード',
    rating: 4.3,
    badge: null,
    recommendedFor: ['semi_aquatic_medium', 'japanese_pond'],
    rakutenUrl: null,
    rakutenStatus: 'search',
    rakutenSearchTerm: 'ひかり タートル 亀 フード',
    rakutenConfidence: 6.3,
    rakutenLastUpdated: '2026-06-28',
  },

  food_grassland_salad: {
    id: 'food_grassland_salad',
    name: 'グラスランドサラダミックス（乾燥野草）',
    category: 'food',
    tier: 'premium',
    priceRange: '¥1,500–3,500',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '乾燥タンポポ・オオバコ・チモシー等のブレンド。野草採取が難しい冬季に',
    rating: 4.6,
    badge: 'Premium',
    recommendedFor: ['tortoise_dry_small', 'tortoise_dry_large'],
    rakutenUrl: null,
    rakutenStatus: 'pending',
    rakutenSearchTerm: null,
  },

  /* ══════════════════════════════════════════
     SUPPLEMENTS（サプリメント）  9商品
     旧 calcium カテゴリを拡張
     ══════════════════════════════════════════ */

  calcium_powder: {
    id: 'calcium_powder',
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
    rakutenLastUpdated: '2026-06-28',
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
    rakutenLastUpdated: '2026-06-28',
  },

  supplement_repcal: {
    id: 'supplement_repcal',
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
    rakutenLastUpdated: '2026-06-28',
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

  supplement_cuttlebone: {
    id: 'supplement_cuttlebone',
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
    rakutenStatus: 'pending',
    rakutenSearchTerm: null,
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
    enclosure:        { budget: 'enclosure_glass_45',    standard: 'enclosure_wood_90',      premium: 'enclosure_wood_120' },
    lighting_uvb:     { budget: 'uvb_compact',           standard: 'uvb_desert_t5',          premium: 'uvb_arcadia_t5_12' },
    lighting_basking: { budget: 'basking_halogen_50w',   standard: 'basking_75w',            premium: 'basking_ceramic_100w' },
    heating:          { budget: 'heater_panel_30w',      standard: 'heater_panel_45w',       premium: 'heater_radiant_panel' },
    substrate:        { budget: 'substrate_soil',        standard: 'substrate_grassland_mix',premium: 'substrate_cypress_mulch' },
    shelter:          { budget: 'shelter_small',         standard: 'shelter_medium',         premium: 'shelter_premium_wood' },
    thermometer:      { budget: 'thermometer_digital',   standard: 'thermometer_dual_probe', premium: 'thermometer_pro_wifi' },
    food:             { budget: 'food_reptomin',         standard: 'food_tortoise',          premium: 'food_grassland_salad' },
    supplements:      { budget: 'calcium_powder',        standard: 'supplement_repcal',      premium: null },
    rakutenUrl: null,
    rakutenStatus: 'pending',
    rakutenSearchTerm: null,
  },

  // ── 乾燥系リクガメ（大型：ヘルマン・チャコ・ヒョウモン等）
  tortoise_dry_large: {
    enclosure:        { budget: 'enclosure_wood_90',     standard: 'enclosure_wood_120',     premium: 'enclosure_wood_150' },
    lighting_uvb:     { budget: 'uvb_desert_t5',         standard: 'uvb_arcadia_t5_12',      premium: 'uvb_combo_mvb_100' },
    lighting_basking: { budget: 'basking_100w',          standard: 'basking_dual_150w',      premium: 'basking_solar_raptor' },
    heating:          { budget: 'heater_panel_45w',      standard: 'heater_panel_60w',       premium: 'heater_radiant_panel' },
    substrate:        { budget: 'substrate_soil',        standard: 'substrate_sand_mix',     premium: 'substrate_cypress_mulch' },
    shelter:          { budget: 'shelter_medium',        standard: 'shelter_large_cave',     premium: 'shelter_premium_wood' },
    thermometer:      { budget: 'thermometer_digital',   standard: 'thermometer_infrared',   premium: 'thermometer_pro_wifi' },
    food:             { budget: 'food_tortoise',         standard: 'food_grassland_salad',   premium: null },
    supplements:      { budget: 'calcium_powder',        standard: 'supplement_repcal',      premium: 'supplement_iodine' },
    rakutenUrl: null,
    rakutenStatus: 'pending',
    rakutenSearchTerm: null,
  },

  // ── 森林系リクガメ（エロンガータ・アカアシ・インプレッサ等）
  tortoise_forest: {
    enclosure:        { budget: 'enclosure_glass_45',    standard: 'enclosure_kayuso_90',    premium: 'enclosure_wood_120' },
    lighting_uvb:     { budget: 'uvb_compact',           standard: 'uvb_forest_t5',          premium: 'uvb_arcadia_t5_6' },
    lighting_basking: { budget: 'basking_50w',           standard: 'basking_75w',            premium: 'basking_ceramic_100w' },
    heating:          { budget: 'heater_cord_20w',       standard: 'heater_panel_45w',       premium: 'thermostat_digital' },
    substrate:        { budget: 'substrate_coco',        standard: 'substrate_forest_blend', premium: 'substrate_cypress_mulch' },
    shelter:          { budget: 'shelter_small',         standard: 'shelter_cork_bark',      premium: 'shelter_humid_hide' },
    thermometer:      { budget: 'thermometer_digital',   standard: 'thermometer_dual_probe', premium: 'thermometer_pro_wifi' },
    food:             { budget: 'food_tortoise',         standard: 'food_repashy_tortoise',  premium: null },
    supplements:      { budget: 'calcium_powder',        standard: 'supplement_multivitamin',premium: null },
    rakutenUrl: null,
    rakutenStatus: 'pending',
    rakutenSearchTerm: null,
  },

  // ── 半水棲・小型（ニオイガメ・ドロガメ・ミスクガメ等）
  semi_aquatic_small: {
    enclosure:        { budget: 'tank_60',               standard: 'tank_90',                premium: 'tank_120_aqua' },
    lighting_uvb:     { budget: 'uvb_compact',           standard: 'uvb_forest_t5',          premium: 'uvb_arcadia_t5_6' },
    lighting_basking: { budget: 'basking_50w',           standard: 'basking_75w',            premium: null },
    heating:          { budget: 'thermostat',            standard: 'heater_aqua_100w',       premium: 'thermostat_digital' },
    filter:           { budget: 'filter_small',          standard: 'filter_turtle_clean',    premium: 'filter_canister_medium' },
    thermometer:      { budget: 'thermometer_aqua',      standard: 'thermometer_dual_probe', premium: 'thermometer_pro_wifi' },
    food:             { budget: 'food_kamepros',         standard: 'food_reptomin',          premium: null },
    supplements:      { budget: 'calcium_powder',        standard: 'supplement_cuttlebone',  premium: null },
    rakutenUrl: null,
    rakutenStatus: 'pending',
    rakutenSearchTerm: null,
  },

  // ── 半水棲・中型（クサガメ・アカミミ・チズガメ等）
  semi_aquatic_medium: {
    enclosure:        { budget: 'tank_90',               standard: 'tank_90',                premium: 'tank_120_aqua' },
    lighting_uvb:     { budget: 'uvb_compact',           standard: 'uvb_forest_t5',          premium: 'uvb_arcadia_t5_6' },
    lighting_basking: { budget: 'basking_50w',           standard: 'basking_75w',            premium: 'basking_100w' },
    heating:          { budget: 'heater_aqua_100w',      standard: 'heater_aqua_200w',       premium: 'thermostat_digital' },
    filter:           { budget: 'filter_turtle_clean',   standard: 'filter_canister_medium', premium: 'filter_canister_eheim_2217' },
    thermometer:      { budget: 'thermometer_aqua',      standard: 'thermometer_dual_probe', premium: 'thermometer_pro_wifi' },
    food:             { budget: 'food_kamepros',         standard: 'food_reptomin',          premium: null },
    supplements:      { budget: 'calcium_powder',        standard: 'supplement_cuttlebone',  premium: null },
    rakutenUrl: null,
    rakutenStatus: 'pending',
    rakutenSearchTerm: null,
  },

  // ── 完全水棲（スッポン・マタマタ・ワニガメ等）
  fully_aquatic: {
    enclosure:        { budget: 'tank_90',               standard: 'tank_120_aqua',          premium: 'tank_120_aqua' },
    heating:          { budget: 'heater_aqua_100w',      standard: 'heater_aqua_200w',       premium: 'thermostat_digital' },
    filter:           { budget: 'filter_canister_medium',standard: 'filter_canister_large',  premium: 'filter_canister_eheim_2217' },
    substrate:        { budget: 'substrate_river_sand',  standard: 'substrate_river_sand',   premium: null },
    thermometer:      { budget: 'thermometer_aqua',      standard: 'thermometer_dual_probe', premium: 'thermometer_pro_wifi' },
    food:             { budget: 'food_kamepros',         standard: 'food_reptomin',          premium: null },
    rakutenUrl: null,
    rakutenStatus: 'pending',
    rakutenSearchTerm: null,
  },

  // ── 日本産イシガメ類（ニホンイシガメ・クサガメ等）
  japanese_pond: {
    enclosure:        { budget: 'tank_60',               standard: 'tank_90',                premium: null },
    lighting_uvb:     { budget: 'uvb_compact',           standard: 'uvb_forest_t5',          premium: null },
    lighting_basking: { budget: 'basking_50w',           standard: 'basking_75w',            premium: null },
    heating:          { budget: 'thermostat',            standard: 'heater_aqua_100w',       premium: null },
    filter:           { budget: 'filter_small',          standard: 'filter_turtle_clean',    premium: 'filter_canister_medium' },
    thermometer:      { budget: 'thermometer_aqua',      standard: 'thermometer_dual_probe', premium: null },
    food:             { budget: 'food_kamepros',         standard: 'food_reptomin',          premium: null },
    supplements:      { budget: 'supplement_cuttlebone', standard: 'calcium_powder',         premium: null },
    rakutenUrl: null,
    rakutenStatus: 'pending',
    rakutenSearchTerm: null,
  },

  // ── 水陸両用ハコガメ（ミツユビ・トウブ・サバンナ等）
  box_turtle: {
    enclosure:        { budget: 'enclosure_glass_45',    standard: 'enclosure_kayuso_90',    premium: 'enclosure_wood_120' },
    lighting_uvb:     { budget: 'uvb_compact',           standard: 'uvb_forest_t5',          premium: 'uvb_arcadia_t5_6' },
    lighting_basking: { budget: 'basking_50w',           standard: 'basking_75w',            premium: null },
    heating:          { budget: 'heater_cord_20w',       standard: 'heater_panel_45w',       premium: 'thermostat_digital' },
    filter:           { budget: 'filter_small',          standard: 'filter_submersible_medium',premium: null },
    substrate:        { budget: 'substrate_coco',        standard: 'substrate_forest_blend', premium: 'substrate_cypress_mulch' },
    shelter:          { budget: 'shelter_small',         standard: 'shelter_cork_bark',      premium: 'shelter_humid_hide' },
    thermometer:      { budget: 'thermometer_digital',   standard: 'thermometer_dual_probe', premium: null },
    food:             { budget: 'food_kamepros',         standard: 'food_box_turtle',        premium: 'food_repashy_tortoise' },
    supplements:      { budget: 'supplement_cuttlebone', standard: 'calcium_powder',         premium: null },
    rakutenUrl: null,
    rakutenStatus: 'pending',
    rakutenSearchTerm: null,
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
