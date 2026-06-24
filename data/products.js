/**
 * Kame Life Guide - Amazon Product Database
 * Phase 6-B Task 2: 28 → 83 products
 *
 * Schema v2 additions:
 *   rating          {number}   - 5点満点レーティング
 *   badge           {string}   - "Best Overall" / "Budget Pick" / "Premium" etc.
 *   recommendedFor  {string[]} - equipmentKey or difficulty tag
 *
 * tier 統一:
 *   budget / standard / premium
 *   ※旧 beginner/intermediate は standard に読み替え（既存キー維持）
 *
 * Helper functions (末尾):
 *   getProductsByCategory(category)
 *   getBestProduct(category)
 *   getBudgetProduct(category)
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
    affiliateUrl: '#',
    asin: null,
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
    affiliateUrl: '#',
    asin: null,
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
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '小型水棲ガメの基本飼育容器。水換えしやすい横長タイプ',
    rating: 4.1,
    badge: 'Budget Pick',
    recommendedFor: ['semi_aquatic_small', 'japanese_pond'],
  },

  tank_90: {
    id: 'tank_90',
    name: '水槽 90cm',
    category: 'enclosure',
    tier: 'standard',
    priceRange: '¥8,000–18,000',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '中型水棲ガメや複数飼育に対応できる容量',
    rating: 4.4,
    badge: 'Best Overall',
    recommendedFor: ['semi_aquatic_medium', 'fully_aquatic'],
  },

  enclosure_kayuso_90: {
    id: 'enclosure_kayuso_90',
    name: 'KAYUSO 爬虫類ケージ 90cm',
    category: 'enclosure',
    tier: 'standard',
    priceRange: '¥20,000–35,000',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '前開き扉で管理しやすく、通気性と保温性を兼ね備えた専用ケージ',
    rating: 4.5,
    badge: 'Best Overall',
    recommendedFor: ['tortoise_forest', 'box_turtle'],
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
  },

  enclosure_glass_45: {
    id: 'enclosure_glass_45',
    name: 'ガラスケージ 45cm',
    category: 'enclosure',
    tier: 'budget',
    priceRange: '¥4,000–9,000',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '幼体・小型種に最適なコンパクトサイズ。観察しやすいガラス製',
    rating: 4.0,
    badge: null,
    recommendedFor: ['beginner', 'small_aquatic'],
  },

  enclosure_wood_150: {
    id: 'enclosure_wood_150',
    name: '木製リクガメケージ 150cm',
    category: 'enclosure',
    tier: 'premium',
    priceRange: '¥45,000–80,000',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: 'ケヅメリクガメ等の大型種成体に対応できる最大級サイズ',
    rating: 4.7,
    badge: 'Premium',
    recommendedFor: ['tortoise_dry_large', 'advanced'],
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
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '小型ケージや補助UVBとして使いやすいコンパクトタイプ',
    rating: 3.9,
    badge: 'Budget Pick',
    recommendedFor: ['beginner', 'semi_aquatic_small'],
  },

  // ── Task2 追加 ──

  uvb_arcadia_t5_6: {
    id: 'uvb_arcadia_t5_6',
    name: 'Arcadia T5 HO 6% UVB',
    category: 'lighting_uvb',
    tier: 'standard',
    priceRange: '¥4,000–8,000',
    affiliateUrl: '#',
    asin: null,
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
  },

  uvb_combo_mvb_100: {
    id: 'uvb_combo_mvb_100',
    name: 'MVB 自発光UVBランプ 100W',
    category: 'lighting_uvb',
    tier: 'premium',
    priceRange: '¥6,000–12,000',
    affiliateUrl: '#',
    asin: null,
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
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '省電力で長寿命のLEDタイプ。初心者の入門用に手頃',
    rating: 3.7,
    badge: 'Budget Pick',
    recommendedFor: ['beginner'],
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
    affiliateUrl: 'https://www.amazon.co.jp/dp/B0043AYZL8?tag=kamelife09-22',
    asin: 'B0043AYZL8',
    image: '/assets/products/placeholder.webp',
    why: '小型ケージのホットスポット形成に適した出力',
    rating: 4.2,
    badge: 'Budget Pick',
    recommendedFor: ['semi_aquatic_small', 'box_turtle', 'japanese_pond'],
  },

  basking_75w: {
    id: 'basking_75w',
    name: 'バスキングランプ 75W',
    category: 'lighting_basking',
    tier: 'standard',
    priceRange: '¥800–2,000',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '標準的な60〜90cmケージのホットスポット形成に最適',
    rating: 4.4,
    badge: 'Best Overall',
    recommendedFor: ['tortoise_dry_small', 'semi_aquatic_medium'],
  },

  basking_100w: {
    id: 'basking_100w',
    name: 'バスキングランプ 100W',
    category: 'lighting_basking',
    tier: 'standard',
    priceRange: '¥800–2,500',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '大型ケージや熱帯性リクガメの高温ホットスポット維持に',
    rating: 4.3,
    badge: null,
    recommendedFor: ['tortoise_dry_large'],
  },

  // ── Task2 追加 ──

  basking_halogen_35w: {
    id: 'basking_halogen_35w',
    name: 'ハロゲンバスキング 35W',
    category: 'lighting_basking',
    tier: 'budget',
    priceRange: '¥500–1,200',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '幼体・小型種の補助バスキングに。安価で交換しやすい',
    rating: 3.9,
    badge: 'Budget Pick',
    recommendedFor: ['beginner'],
  },

  basking_halogen_50w: {
    id: 'basking_halogen_50w',
    name: 'ハロゲンバスキング 50W',
    category: 'lighting_basking',
    tier: 'budget',
    priceRange: '¥600–1,500',
    affiliateUrl: '#',
    asin: null,
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
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '大型ケージで広い日向エリアを確保。UVBランプと分けて設置するプロ仕様',
    rating: 4.5,
    badge: 'Premium',
    recommendedFor: ['tortoise_dry_large', 'advanced'],
  },

  basking_solar_raptor: {
    id: 'basking_solar_raptor',
    name: 'Solar Raptor HID 70W',
    category: 'lighting_basking',
    tier: 'premium',
    priceRange: '¥12,000–20,000',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '太陽光に最も近い演色性。大型リクガメの高温バスキング＋UVB同時供給',
    rating: 4.8,
    badge: 'Premium',
    recommendedFor: ['advanced', 'tortoise_dry_large'],
  },

  basking_ceramic_100w: {
    id: 'basking_ceramic_100w',
    name: 'セラミックヒートランプ 100W（夜間用）',
    category: 'lighting_basking',
    tier: 'standard',
    priceRange: '¥1,500–3,500',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '光を出さずに熱だけ供給。夜間加温・視覚刺激なしで自然なサイクルを維持',
    rating: 4.4,
    badge: null,
    recommendedFor: ['tortoise_dry_small', 'tortoise_dry_large'],
  },

  basking_infrared_red: {
    id: 'basking_infrared_red',
    name: '赤外線バスキングランプ 75W',
    category: 'lighting_basking',
    tier: 'budget',
    priceRange: '¥700–1,800',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '赤色光で夜間も使いやすい。水棲ガメの乾燥スポット加温に',
    rating: 3.8,
    badge: 'Budget Pick',
    recommendedFor: ['semi_aquatic_small', 'semi_aquatic_medium'],
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
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '夜間の底面加温に。ケージ下に設置するタイプで省スペース',
    rating: 4.0,
    badge: 'Budget Pick',
    recommendedFor: ['beginner', 'tortoise_dry_small'],
  },

  heater_panel_45w: {
    id: 'heater_panel_45w',
    name: 'パネルヒーター 45W',
    category: 'heating',
    tier: 'standard',
    priceRange: '¥3,000–6,000',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '中型ケージの夜間・冬季保温。サーモスタット併用推奨',
    rating: 4.2,
    badge: 'Best Overall',
    recommendedFor: ['tortoise_dry_small', 'tortoise_forest'],
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
  },

  thermostat: {
    id: 'thermostat',
    name: 'サーモスタット（アナログ）',
    category: 'heating',
    tier: 'budget',
    priceRange: '¥2,500–5,000',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: 'ヒーターの過昇温を防ぎ、安全な温度管理を自動化',
    rating: 4.0,
    badge: 'Budget Pick',
    recommendedFor: ['beginner'],
  },

  // ── Task2 追加 ──

  heater_aqua_200w: {
    id: 'heater_aqua_200w',
    name: '水中ヒーター 200W',
    category: 'heating',
    tier: 'standard',
    priceRange: '¥2,500–5,000',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '90cm以上の大容量水槽の安定した水温維持に',
    rating: 4.4,
    badge: null,
    recommendedFor: ['semi_aquatic_medium', 'fully_aquatic'],
  },

  thermostat_digital: {
    id: 'thermostat_digital',
    name: 'デジタルサーモスタット（プログラム式）',
    category: 'heating',
    tier: 'premium',
    priceRange: '¥6,000–15,000',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '昼夜の温度スケジュールを自動制御。複数機器の同時管理に対応',
    rating: 4.7,
    badge: 'Premium',
    recommendedFor: ['advanced'],
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
  },

  heater_panel_60w: {
    id: 'heater_panel_60w',
    name: 'パネルヒーター 60W',
    category: 'heating',
    tier: 'standard',
    priceRange: '¥4,000–8,000',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '120cm以上の大型木製ケージの保温補助に。薄型で設置場所を選ばない',
    rating: 4.2,
    badge: null,
    recommendedFor: ['tortoise_dry_large'],
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
    affiliateUrl: '#',
    asin: null,
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
    affiliateUrl: '#',
    asin: null,
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
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '水槽縁に掛けるだけで設置完了。初心者に使いやすい入門フィルター',
    rating: 3.8,
    badge: 'Budget Pick',
    recommendedFor: ['beginner'],
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
  },

  filter_canister_eheim_2217: {
    id: 'filter_canister_eheim_2217',
    name: 'EHEIM クラシック 2217',
    category: 'filter',
    tier: 'premium',
    priceRange: '¥18,000–28,000',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '業界標準の外部フィルター。ろ過能力・静音性・耐久性で長年トップクラス',
    rating: 4.9,
    badge: 'Premium',
    recommendedFor: ['fully_aquatic', 'advanced'],
  },

  filter_fluval_fx: {
    id: 'filter_fluval_fx',
    name: 'Fluval FX シリーズ',
    category: 'filter',
    tier: 'premium',
    priceRange: '¥20,000–40,000',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: 'カメの糞・食べ残しによる汚濁をパワフルに処理する大容量外部フィルター',
    rating: 4.8,
    badge: 'Premium',
    recommendedFor: ['fully_aquatic', 'advanced'],
  },

  filter_submersible_medium: {
    id: 'filter_submersible_medium',
    name: '水中フィルター（中型）',
    category: 'filter',
    tier: 'standard',
    priceRange: '¥3,000–7,000',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '60〜90cm水槽に対応。省スペースで強力なろ過を発揮',
    rating: 4.2,
    badge: null,
    recommendedFor: ['semi_aquatic_medium'],
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
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: 'リクガメの定番床材。保湿性と排水性のバランスが良く経済的',
    rating: 4.3,
    badge: 'Budget Pick',
    recommendedFor: ['tortoise_dry_small', 'tortoise_dry_large'],
  },

  substrate_coco: {
    id: 'substrate_coco',
    name: 'ヤシガラ（ブリック）',
    category: 'substrate',
    tier: 'budget',
    priceRange: '¥800–2,000',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '高湿度を好む森林性カメに最適。保湿力が高く蒸れにくい',
    rating: 4.4,
    badge: 'Best Overall',
    recommendedFor: ['tortoise_forest', 'box_turtle'],
  },

  substrate_sand_mix: {
    id: 'substrate_sand_mix',
    name: '砂・土ミックス床材',
    category: 'substrate',
    tier: 'standard',
    priceRange: '¥1,000–3,000',
    affiliateUrl: '#',
    asin: null,
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
  },

  substrate_river_sand: {
    id: 'substrate_river_sand',
    name: '川砂（白砂）5kg',
    category: 'substrate',
    tier: 'budget',
    priceRange: '¥600–1,500',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '水棲ガメ水槽の底砂に。自然な雰囲気を出しつつ清掃しやすい',
    rating: 3.9,
    badge: 'Budget Pick',
    recommendedFor: ['semi_aquatic_small', 'japanese_pond'],
  },

  substrate_forest_blend: {
    id: 'substrate_forest_blend',
    name: 'フォレストブレンド床材 10L',
    category: 'substrate',
    tier: 'standard',
    priceRange: '¥1,800–4,000',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: 'ヤシガラ・腐葉土・バークチップのブレンド。森林性ハコガメに最適',
    rating: 4.4,
    badge: null,
    recommendedFor: ['box_turtle', 'tortoise_forest'],
  },

  substrate_cypress_mulch: {
    id: 'substrate_cypress_mulch',
    name: 'サイプレスマルチ（Zoo Med）',
    category: 'substrate',
    tier: 'premium',
    priceRange: '¥2,500–5,000',
    affiliateUrl: '#',
    asin: null,
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
  },

  /* ══════════════════════════════════════════
     SHELTER（シェルター）  9商品
     ══════════════════════════════════════════ */

  shelter_small: {
    id: 'shelter_small',
    name: 'ロックシェルター SS/S',
    category: 'shelter',
    tier: 'budget',
    priceRange: '¥800–1,800',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: 'ストレス軽減に必須の隠れ家。出入りしやすいサイズ選びが重要',
    rating: 4.2,
    badge: 'Budget Pick',
    recommendedFor: ['beginner', 'semi_aquatic_small'],
  },

  shelter_medium: {
    id: 'shelter_medium',
    name: 'ロックシェルター M/L',
    category: 'shelter',
    tier: 'standard',
    priceRange: '¥1,500–3,000',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '中型種や成長した個体向けのシェルター',
    rating: 4.3,
    badge: 'Best Overall',
    recommendedFor: ['tortoise_dry_small', 'tortoise_forest'],
  },

  // ── Task2 追加 ──

  shelter_cork_bark: {
    id: 'shelter_cork_bark',
    name: 'コルクバーク（丸太）',
    category: 'shelter',
    tier: 'standard',
    priceRange: '¥1,500–4,000',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '自然素材のシェルター。湿度を保持しカメが潜り込みやすい形状',
    rating: 4.5,
    badge: 'Best Overall',
    recommendedFor: ['tortoise_forest', 'box_turtle'],
  },

  shelter_humid_hide: {
    id: 'shelter_humid_hide',
    name: 'モイストハイド（湿潤シェルター）',
    category: 'shelter',
    tier: 'standard',
    priceRange: '¥2,000–4,500',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '内部に水苔を詰めて高湿度空間を作る。脱水防止と脱皮補助に効果的',
    rating: 4.4,
    badge: null,
    recommendedFor: ['box_turtle', 'tortoise_forest'],
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
  },

  shelter_large_cave: {
    id: 'shelter_large_cave',
    name: 'ラージケーブシェルター',
    category: 'shelter',
    tier: 'standard',
    priceRange: '¥3,000–6,000',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '成体リクガメが余裕で入れる大型シェルター。安全感を与えストレスを防ぐ',
    rating: 4.3,
    badge: null,
    recommendedFor: ['tortoise_dry_large'],
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
  },

  shelter_aqua_dock: {
    id: 'shelter_aqua_dock',
    name: '水棲ガメ用ドック（浮島タイプ）',
    category: 'shelter',
    tier: 'budget',
    priceRange: '¥1,200–3,000',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '水面に浮かせる陸場兼シェルター。バスキングと隠れ場を兼用できる',
    rating: 4.1,
    badge: 'Budget Pick',
    recommendedFor: ['semi_aquatic_small', 'japanese_pond', 'beginner'],
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
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '温度・湿度の同時監視が可能。設置場所の環境管理に必須',
    rating: 4.2,
    badge: 'Budget Pick',
    recommendedFor: ['beginner'],
  },

  thermometer_aqua: {
    id: 'thermometer_aqua',
    name: '水温計（デジタル）',
    category: 'thermometer',
    tier: 'budget',
    priceRange: '¥800–2,000',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '水棲ガメの水温管理に。アナログより精度が高くおすすめ',
    rating: 4.1,
    badge: 'Budget Pick',
    recommendedFor: ['semi_aquatic_small', 'semi_aquatic_medium', 'fully_aquatic'],
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
  },

  thermometer_infrared: {
    id: 'thermometer_infrared',
    name: '非接触型赤外線温度計',
    category: 'thermometer',
    tier: 'standard',
    priceRange: '¥2,000–5,000',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: 'カメに触れずに体表温度や床材温度を瞬時に測定。バスキング調整に活用',
    rating: 4.6,
    badge: 'Best Overall',
    recommendedFor: ['tortoise_dry_large', 'advanced'],
  },

  thermometer_pro_wifi: {
    id: 'thermometer_pro_wifi',
    name: 'Wi-Fi 温湿度ロガー',
    category: 'thermometer',
    tier: 'premium',
    priceRange: '¥4,000–10,000',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: 'スマホで24時間リモート監視・アラート機能付き。外出時の安心感が段違い',
    rating: 4.8,
    badge: 'Premium',
    recommendedFor: ['advanced'],
  },

  thermometer_analog: {
    id: 'thermometer_analog',
    name: 'アナログ温湿度計',
    category: 'thermometer',
    tier: 'budget',
    priceRange: '¥500–1,500',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '電池不要で壁掛けが可能。バックアップ用や屋外飼育スペースに',
    rating: 3.7,
    badge: 'Budget Pick',
    recommendedFor: ['beginner'],
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
  },

  // ── Task2 追加 ──

  food_reptomin: {
    id: 'food_reptomin',
    name: 'レプトミン（テトラ）',
    category: 'food',
    tier: 'budget',
    priceRange: '¥500–1,200',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '水棲ガメ定番の人工飼料。スティックタイプで食べさせやすく価格も手頃',
    rating: 4.2,
    badge: 'Budget Pick',
    recommendedFor: ['semi_aquatic_small', 'beginner'],
  },

  food_aqua_turtle_pellet: {
    id: 'food_aqua_turtle_pellet',
    name: 'カメの主食（GEX）',
    category: 'food',
    tier: 'budget',
    priceRange: '¥400–1,000',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '国内で入手しやすいコスパ良好なペレット。半水棲ガメの日常食に',
    rating: 4.0,
    badge: 'Budget Pick',
    recommendedFor: ['beginner', 'semi_aquatic_small'],
  },

  food_box_turtle: {
    id: 'food_box_turtle',
    name: 'ボックスタートルフード（Zoo Med）',
    category: 'food',
    tier: 'standard',
    priceRange: '¥1,500–3,000',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '雑食性ハコガメ向けの動植物混合フード。昆虫・果実成分を配合',
    rating: 4.5,
    badge: 'Best Overall',
    recommendedFor: ['box_turtle'],
  },

  food_dried_shrimp: {
    id: 'food_dried_shrimp',
    name: '乾燥エビ（ひかりFD）',
    category: 'food',
    tier: 'budget',
    priceRange: '¥300–800',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: 'たんぱく質補給のおやつ。水棲・半水棲ガメが好んで食べる',
    rating: 4.1,
    badge: 'Budget Pick',
    recommendedFor: ['semi_aquatic_small', 'beginner'],
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
  },

  food_hikari_turtle: {
    id: 'food_hikari_turtle',
    name: 'ひかりウーパールーパー（タートル用）',
    category: 'food',
    tier: 'standard',
    priceRange: '¥700–1,800',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: 'カルシウム強化配合。カメの甲羅健康維持に配慮した国産フード',
    rating: 4.3,
    badge: null,
    recommendedFor: ['semi_aquatic_medium', 'japanese_pond'],
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
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '甲羅の形成・維持に不可欠。野菜にダスティングして与える',
    rating: 4.3,
    badge: 'Best Overall',
    recommendedFor: ['tortoise_dry_small', 'tortoise_dry_large', 'beginner'],
  },

  // ── Task2 追加 ──

  calcium_no_d3: {
    id: 'calcium_no_d3',
    name: 'カルシウムパウダー（D3なし）',
    category: 'supplements',
    tier: 'budget',
    priceRange: '¥600–1,500',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '屋外飼育・UVBランプ完備の環境向け。D3過剰投与リスクを避けたい場合に',
    rating: 4.2,
    badge: 'Budget Pick',
    recommendedFor: ['outdoor', 'advanced'],
  },

  supplement_repcal: {
    id: 'supplement_repcal',
    name: 'Rep-Cal カルシウムサプリ',
    category: 'supplements',
    tier: 'standard',
    priceRange: '¥1,500–3,500',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '純度の高いカルシウム炭酸塩。リン不使用でカルシウム：リン比を適正に保つ',
    rating: 4.6,
    badge: 'Best Overall',
    recommendedFor: ['tortoise_dry_large', 'advanced'],
  },

  supplement_multivitamin: {
    id: 'supplement_multivitamin',
    name: 'マルチビタミン（爬虫類用）',
    category: 'supplements',
    tier: 'standard',
    priceRange: '¥1,200–3,000',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: 'ビタミンA・E・B群を補給。人工飼料のみの飼育では週1回のダスティングが推奨',
    rating: 4.4,
    badge: null,
    recommendedFor: ['tortoise_dry_small', 'box_turtle'],
  },

  supplement_iodine: {
    id: 'supplement_iodine',
    name: 'ヨウ素サプリ（亀専用）',
    category: 'supplements',
    tier: 'standard',
    priceRange: '¥1,500–3,500',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '甲状腺機能維持に必要なヨウ素を補給。リクガメの長期飼育に有効',
    rating: 4.3,
    badge: null,
    recommendedFor: ['tortoise_dry_large', 'advanced'],
  },

  supplement_electrolyte: {
    id: 'supplement_electrolyte',
    name: 'エレクトロライト（電解質補給）',
    category: 'supplements',
    tier: 'premium',
    priceRange: '¥1,800–4,000',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '脱水・拒食・回復期のカメの電解質補充に。温浴水や直接投与で使用',
    rating: 4.5,
    badge: null,
    recommendedFor: ['advanced'],
  },

  supplement_cuttlebone: {
    id: 'supplement_cuttlebone',
    name: 'カトルボーン（甲イカの骨）',
    category: 'supplements',
    tier: 'budget',
    priceRange: '¥300–800',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: 'ケージ内に置くだけでカメが自分で削ってカルシウム補給できる。省手間',
    rating: 4.2,
    badge: 'Budget Pick',
    recommendedFor: ['beginner', 'tortoise_forest', 'box_turtle'],
  },

  supplement_probiotics: {
    id: 'supplement_probiotics',
    name: '爬虫類用プロバイオティクス',
    category: 'supplements',
    tier: 'premium',
    priceRange: '¥2,500–6,000',
    affiliateUrl: '#',
    asin: null,
    image: '/assets/products/placeholder.webp',
    why: '腸内細菌叢を整え消化吸収を促進。拒食回復期や繁殖個体の栄養管理に',
    rating: 4.6,
    badge: 'Premium',
    recommendedFor: ['advanced'],
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
  },

};

// ─────────────────────────────────────────────
// 2. EQUIPMENT_MAP（変更なし）
// ─────────────────────────────────────────────

const EQUIPMENT_MAP = {

  tortoise_dry_small: [
    'enclosure_wood_90',
    'uvb_desert_t5',
    'basking_75w',
    'substrate_soil',
    'shelter_small',
    'thermometer_digital',
    'food_tortoise',
    'calcium_powder',
  ],

  tortoise_dry_large: [
    'enclosure_wood_120',
    'uvb_desert_t5',
    'basking_100w',
    'substrate_sand_mix',
    'shelter_medium',
    'thermometer_digital',
    'food_tortoise',
    'calcium_powder',
  ],

  tortoise_forest: [
    'enclosure_kayuso_90',
    'uvb_forest_t5',
    'basking_50w',
    'substrate_coco',
    'shelter_small',
    'thermometer_digital',
    'food_tortoise',
    'calcium_powder',
  ],

  semi_aquatic_small: [
    'tank_60',
    'filter_small',
    'uvb_forest_t5',
    'basking_50w',
    'heater_aqua_100w',
    'thermometer_aqua',
    'food_kamepros',
  ],

  semi_aquatic_medium: [
    'tank_90',
    'filter_canister_medium',
    'uvb_forest_t5',
    'basking_75w',
    'heater_aqua_100w',
    'thermometer_aqua',
    'food_kamepros',
  ],

  fully_aquatic: [
    'tank_90',
    'filter_canister_large',
    'heater_aqua_100w',
    'thermostat',
    'thermometer_aqua',
    'food_kamepros',
  ],

  japanese_pond: [
    'tank_60',
    'filter_small',
    'uvb_forest_t5',
    'basking_50w',
    'heater_aqua_100w',
    'thermometer_aqua',
    'food_kamepros',
  ],

  box_turtle: [
    'enclosure_kayuso_90',
    'uvb_forest_t5',
    'basking_50w',
    'filter_small',
    'substrate_coco',
    'shelter_small',
    'thermometer_digital',
    'food_kamepros',
    'calcium_powder',
  ],

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
 * 同点の場合は tier=premium → standard → budget の優先順
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

// ─────────────────────────────────────────────
// 4. exports
// ─────────────────────────────────────────────

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PRODUCTS, EQUIPMENT_MAP, getProductsByCategory, getBestProduct, getBudgetProduct };
}
