'use strict';
// routes.js - ルート定義・質問データ（PHASE 1 分離版）
// 種データは species.js の SPECIES オブジェクトを参照

const ROUTES = [
  {
    id: 'land', emoji: '🏔️', name: 'リクガメルート',
    desc: 'ロシア・ヘルマン・ケヅメ・アカアシなど', qCount: 5,
    get species(){ return SPECIES.land; },
    questions: [
      { text: '飼育スペースはどのくらいを想定していますか？', choices: [
        { label: '60cm水槽程度（〜0.4㎡）', scores: { compact: 3, medium: 0, large: 0 } },
        { label: '90cm水槽相当（〜0.8㎡）', scores: { compact: 1, medium: 3, large: 0 } },
        { label: '120cm以上または屋外（1㎡超）', scores: { compact: 0, medium: 1, large: 3 } }
      ]},
      { text: '温度・湿度の管理はどこまでできますか？', choices: [
        { label: 'サーモスタット＋バスキング程度', scores: { dry: 3, humid: 0 } },
        { label: 'ミスト・加湿器も使える', scores: { dry: 1, humid: 3 } },
        { label: 'どちらでも対応できる', scores: { dry: 2, humid: 2 } }
      ]},
      { text: '草食中心の管理（毎日の野菜・草の準備）ができますか？', choices: [
        { label: 'はい、毎日準備できます', scores: { herbivore: 3 } },
        { label: '週に数回なら可能', scores: { herbivore: 1 } },
        { label: 'フード中心にしたい', scores: { herbivore: 0 } }
      ]},
      { text: '飼育経験はどのくらいありますか？', choices: [
        { label: 'はじめて（爬虫類も初）', scores: { beginner: 3, intermediate: 0, advanced: 0 } },
        { label: '爬虫類や魚の飼育経験あり', scores: { beginner: 1, intermediate: 3, advanced: 0 } },
        { label: '亀・リクガメの飼育経験あり', scores: { beginner: 0, intermediate: 1, advanced: 3 } }
      ]},
      { text: 'リクガメを選ぶ際に最も重視することは？', choices: [
        { label: '欧州産CB・定番地中海系を確実に入手したい', scores: { eu_cb: 3, charisma: 0, small_form: 0, asia_land: 0 } },
        { label: 'アフリカ・南米など個性的な大型種に挑戦したい', scores: { eu_cb: 0, charisma: 3, small_form: 0, asia_land: 0 } },
        { label: 'なるべく小型・コンパクトな種を長く飼いたい', scores: { eu_cb: 0, charisma: 0, small_form: 3, asia_land: 0 } },
        { label: 'アジア産の独特な多湿環境の種を楽しみたい', scores: { eu_cb: 0, charisma: 0, small_form: 0, asia_land: 3 } }
      ]}
    ]
  },
  {
    id: 'aquatic', emoji: '🏊', name: '水棲ガメルート',
    desc: 'ニオイガメ・チズガメ・スライダーなど', qCount: 8,
    get species(){ return SPECIES.aquatic; },
    questions: [
      { text: '水槽・水場のサイズはどのくらい用意できますか？', choices: [
        { label: '30〜60cm水槽', scores: { small_tank: 3, medium_tank: 0, large_tank: 0 } },
        { label: '60〜90cm水槽', scores: { small_tank: 1, medium_tank: 3, large_tank: 0 } },
        { label: '90cm以上', scores: { small_tank: 0, medium_tank: 1, large_tank: 3 } }
      ]},
      { text: '水替えやフィルター管理はどのくらいできますか？', choices: [
        { label: '週1〜2回は水替えできる', scores: { maintenance: 3 } },
        { label: '外部フィルターで月1回程度', scores: { maintenance: 2 } },
        { label: 'なるべく手間を減らしたい', scores: { maintenance: 0 } }
      ]},
      { text: '飼育スタイルの好みは？', choices: [
        { label: '小型でじっくり観察したい', scores: { observational: 3, active: 0, ambush: 0 } },
        { label: '元気よく泳ぐ姿を見たい', scores: { observational: 0, active: 3, ambush: 0 } },
        { label: '底に潜む神秘的な種が好き', scores: { observational: 2, active: 0, ambush: 3 } }
      ]},
      { text: '飼育経験はどのくらいありますか？', choices: [
        { label: 'はじめて（爬虫類も初）', scores: { beginner: 3, intermediate: 0, advanced: 0 } },
        { label: '魚や爬虫類の飼育経験あり', scores: { beginner: 1, intermediate: 3, advanced: 0 } },
        { label: '水棲ガメの飼育経験あり', scores: { beginner: 0, intermediate: 1, advanced: 3 } }
      ]},
      { text: '飼育したい水棲ガメのキャラクターは？', choices: [
        { label: '丈夫で入手しやすい定番種がいい', scores: { mainstream: 3, beauty: 0, japan_native: 0, rare_water: 0 } },
        { label: '美しい模様・キールにこだわりたい（チズガメ系等）', scores: { mainstream: 0, beauty: 3, japan_native: 0, rare_water: 0 } },
        { label: '日本固有・アジア産の種を飼いたい', scores: { mainstream: 0, beauty: 0, japan_native: 3, rare_water: 0 } },
        { label: '流通の少ない希少なドロガメ・ニオイガメが好み', scores: { mainstream: 0, beauty: 0, japan_native: 0, rare_water: 3 } }
      ]},
      { text: '水棲ガメの行動スタイルの好みは？', choices: [
        { label: '活発に泳ぎ回る姿を楽しみたい', scores: { swimmer: 3, bottom_dweller: 0, mud_lover: 0 } },
        { label: '底・シェルターでじっとしている観察向きが好き', scores: { swimmer: 0, bottom_dweller: 0, mud_lover: 3 } },
        { label: '水面〜中層をゆったり漂う（チズガメ・イシガメ系）', scores: { swimmer: 0, bottom_dweller: 3, mud_lover: 0 } }
      ]},
      { text: '原産地・産地へのこだわりは？', choices: [
        { label: '北米産（北アメリカ産が好み）', scores: { na_water: 3, asia_water: 0, eu_water: 0, sa_water: 0 } },
        { label: 'アジア・日本産（国産・アジア産が好み）', scores: { na_water: 0, asia_water: 3, eu_water: 0, sa_water: 0 } },
        { label: '南米・アフリカ・欧州など珍しい産地', scores: { na_water: 0, asia_water: 0, eu_water: 3, sa_water: 0 } }
      ]},
      { text: '飼育したいカメの生息地の気候は？', choices: [
        { label: '温帯・涼しい環境産が好き（北米北部・日本等）', scores: { cool_climate: 3, warm_climate: 0, tropical_climate: 0 } },
        { label: '亜熱帯・暖かい環境産が好き（北米南部・東南アジア等）', scores: { cool_climate: 0, warm_climate: 3, tropical_climate: 0 } },
        { label: '熱帯・高温多湿産が好き（中米・南米・アフリカ等）', scores: { cool_climate: 0, warm_climate: 0, tropical_climate: 3 } }
      ]}
    ]
  },
  {
    id: 'forest', emoji: '🍂', name: 'ヤマガメ・ハコガメルート',
    desc: 'スペングラー・ハコガメ・半水棲など', qCount: 5,
    get species(){ return SPECIES.forest; },
    questions: [
      { text: '温度・湿度の管理環境はどのくらい整えられますか？', choices: [
        { label: '温度管理のみ（エアコン＋バスキング）', scores: { basic_env: 3, advanced_env: 0, cooling: 0 } },
        { label: '湿度も管理（ミスト・保湿床材）', scores: { basic_env: 1, advanced_env: 3, cooling: 0 } },
        { label: '夏の冷却管理もできる（保冷剤・クーラー）', scores: { basic_env: 0, advanced_env: 3, cooling: 3 } }
      ]},
      { text: '陸棲〜半陸棲ガメへの希望は？', choices: [
        { label: '陸場メインで水場は少な目でいい', scores: { terrestrial: 3, semi_aquatic: 0 } },
        { label: '水場もしっかり設けたい', scores: { terrestrial: 0, semi_aquatic: 3 } },
        { label: 'どちらでも設計できる', scores: { terrestrial: 1, semi_aquatic: 1 } }
      ]},
      { text: '希望するカメのサイズは？', choices: [
        { label: 'S（〜15cm）の小型種', scores: { s_size: 3, m_size: 0 } },
        { label: 'M（15〜25cm）の中型種', scores: { s_size: 0, m_size: 3 } },
        { label: 'どちらでもよい', scores: { s_size: 1, m_size: 1 } }
      ]},
      { text: '飼育経験はどのくらいありますか？', choices: [
        { label: 'はじめて（爬虫類も初）', scores: { beginner: 3, intermediate: 0, advanced: 0 } },
        { label: '爬虫類や魚の飼育経験あり', scores: { beginner: 1, intermediate: 3, advanced: 0 } },
        { label: 'カメや爬虫類の飼育経験あり', scores: { beginner: 0, intermediate: 1, advanced: 3 } }
      ]},
      { text: '特に気になる系統は？', choices: [
        { label: '北米産ハコガメ（トウブ・フロリダ・ニシキ等）', scores: { na_box: 3, asia_box: 0, ya_ma: 0 } },
        { label: 'アジア産ハコガメ（セマル・マレー・モエギ等）', scores: { na_box: 0, asia_box: 3, ya_ma: 0 } },
        { label: 'ヤマガメ・イシガメ系（半水棲・森林棲）', scores: { na_box: 0, asia_box: 0, ya_ma: 3 } }
      ]}
    ]
  },
  {
    id: 'exotic', emoji: '🌀', name: 'マニアック・特殊ルート',
    desc: 'ソフトシェル・汽水・曲頸類など', qCount: 4,
    get species(){ return SPECIES.exotic; },
    questions: [
      { text: '特に興味がある系統は？', choices: [
        { label: 'スッポン・ソフトシェル系', scores: { softshell: 3, brackish: 0, snakeneck: 0, rare_asian: 0, large_mud: 0 } },
        { label: '汽水・テラピン系', scores: { softshell: 0, brackish: 3, snakeneck: 0, rare_asian: 0, large_mud: 0 } },
        { label: '曲頸類（ナガクビ・マゲクビ）', scores: { softshell: 0, brackish: 0, snakeneck: 3, rare_asian: 0, large_mud: 0 } },
        { label: 'アジア産ハコガメの希少種', scores: { softshell: 0, brackish: 0, snakeneck: 0, rare_asian: 3, large_mud: 0 } },
        { label: '大型ドロガメ・スジオオニオイガメ系', scores: { softshell: 0, brackish: 0, snakeneck: 0, rare_asian: 0, large_mud: 3 } }
      ]},
      { text: '設備投資の覚悟は？', choices: [
        { label: '2〜3万円程度で抑えたい', scores: { budget_low: 3, budget_high: 0 } },
        { label: '5万円以上かけられる', scores: { budget_low: 0, budget_high: 3 } },
        { label: '10万円以上、本格的にやりたい', scores: { budget_low: 0, budget_high: 3, budget_max: 3 } }
      ]},
      { text: '飼育経験はどのくらいありますか？', choices: [
        { label: '爬虫類・水棲生物の経験あり', scores: { intermediate: 3, advanced: 0 } },
        { label: 'カメ・爬虫類の飼育経験豊富', scores: { intermediate: 1, advanced: 3 } },
        { label: '希少種・マニアック種を飼育したことがある', scores: { intermediate: 0, advanced: 3, expert: 3 } }
      ]},
      { text: '希少種への情熱はどのくらいですか？', choices: [
        { label: 'まずは入手しやすい流通種から始めたい', scores: { accessible: 3, collector_grade: 0, ultra_rare: 0 } },
        { label: '多少高価でも珍しい種を積極的に求めたい', scores: { accessible: 0, collector_grade: 3, ultra_rare: 0 } },
        { label: '価格を問わず国内屈指の希少種を目指す', scores: { accessible: 0, collector_grade: 0, ultra_rare: 3 } }
      ]}
    ]
  },
  {
    id: 'all', emoji: '❓', name: '全カテゴリ診断',
    desc: '全81種・6問で総合マッチング', qCount: 6,
    get species(){ return SPECIES.all; },
    questions: [
      { text: '飼育環境の主な環境タイプを選んでください。', choices: [
        { label: '水槽・水中メイン', scores: { aquatic: 4 } },
        { label: '陸場メイン・半陸棲', scores: { terrestrial: 4 } },
        { label: 'リクガメ専用ケージ', scores: { land_tortoise: 4 } }
      ]},
      { text: '希望するカメのサイズは？', choices: [
        { label: '小型（〜15cm）', scores: { small: 3 } },
        { label: '中型（15〜30cm）', scores: { medium: 3 } },
        { label: '大型（30cm〜）', scores: { large: 3 } }
      ]},
      { text: '温度・湿度管理はどこまでできますか？', choices: [
        { label: '乾燥〜普通（温度管理のみ）', scores: { dry_env: 3 } },
        { label: '保湿〜多湿（ミスト使用可）', scores: { humid_env: 3 } },
        { label: '夏の保冷も対応できる', scores: { cool_env: 3 } }
      ]},
      { text: '日本の法規制について事前に調べましたか？', choices: [
        { label: '完全に把握している', scores: { legal_aware: 3 } },
        { label: 'なんとなく知っている', scores: { legal_aware: 1 } },
        { label: 'これから調べる', scores: { legal_aware: 0 } }
      ]},
      { text: 'どんな飼育体験をしたいですか？', choices: [
        { label: '手から餌を食べさせたい・なつかせたい', scores: { interactive: 3 } },
        { label: '自然な生態を観察したい', scores: { observational: 3 } },
        { label: '希少種・マニアック種で差をつけたい', scores: { collector: 3 } }
      ]},
      { text: '飼育経験について教えてください。', choices: [
        { label: 'はじめて（爬虫類も初）', scores: { beginner: 3, intermediate: 0, advanced: -1 } },
        { label: '爬虫類や魚の飼育経験あり', scores: { beginner: 1, intermediate: 3, advanced: 0 } },
        { label: 'カメ・爬虫類の本格的な飼育経験あり', scores: { beginner: 0, intermediate: 1, advanced: 3 } }
      ]}
    ]
  }
];
