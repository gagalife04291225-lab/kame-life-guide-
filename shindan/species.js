'use strict';
// species.js - 全ルート種データ（PHASE 1 分離版）

const SPECIES = {

// ==================== リクガメルート ====================
land: [
  { name: 'ロシアリクガメ', latin: 'Testudo (Agrionemys) horsfieldii', emoji: '🏔️', recommendationPriority: 94, difficulty: '入門〜中級', size: 'M（15〜20cm）', cites: 'CITES II', legal: 'cites_ii',
    reason: 'リクガメ入門の定番。乾燥した環境を好み、成体は90cm級ケージ以上の床面積が目安（海外の飼育資料はさらに広い飼育場や屋外飼育を勧めています）。好奇心が旺盛でなつきやすく、はじめて飼う方にも人気。CITES IIですので国内CBのインボイス付き個体を選びましょう。',
    specs: { '最大甲長': '22cm', '主な食事': '野草・野菜', '水容量': '浅め水入れ', '温度': '25〜32℃' },
    coreSpecs: { size: '22cm', temp: '25〜32℃', lifespan: '60年以上にわたる飼育例', diet: '草食（野草・野菜中心）' },
    sizeNote: '確認された最大個体の記録（直甲長）。一般的な成体は13〜20cmでメスが大きい。28cm超の報告は原典を確認できていません。',
    lifespanEvidence: { note: 'Tortoise Trustが紹介する雌は、1960年代初頭に輸入され、2024年にも生きていました。この一頭の長期飼育記録で、平均寿命ではありません。', url: 'https://www.tortoisetrust.com/post/captive-care-of-the-russian-tortoise-testudo-horsfieldii', source: 'Tortoise Trust / A. C. Highfield（2024、更新2025）' },
    extraSpecs: {},
    links: [{ label: '乾燥系リクガメ 飼育ガイド', href: '../guide-dry.html' }], asin: null,
    slug: 'russian-tortoise', hasPage: true,
    match: function(s){ return (s.compact||0) >= 2 && (s.dry||0) >= 2; },
    score: function(s){ return (s.compact||0)+(s.dry||0)+(s.beginner||0)+(s.herbivore||0)+(s.eu_cb||0); },
    availability: 'common'
  },
  { name: 'ヘルマンリクガメ', latin: 'Testudo hermanni', emoji: '🌿', recommendationPriority: 95, difficulty: '中級', size: 'S〜M（亜種・個体差あり）', cites: 'CITES II', legal: 'cites_ii',
    reason: 'EU産CBの流通が豊富でコンディションが安定。やや湿度のある地中海環境を好み、ロシアリクガメより扱いやすいと評価する飼育者も多い。最も人気の高い地中海系リクガメ。',
    specs: { '最大甲長': '35.7cm（資料上限）', '主な食事': '野草・野菜', '水容量': '浅め水入れ', '温度': '25〜30℃' },
    coreSpecs: { size: '35.7cm（資料上限）', temp: '25〜30℃', lifespan: '数十年単位・上限は未確立', diet: '草食（野草・野菜中心）' },
    sizeNote: 'TTWG 2025 p.367 掲載の最大直線甲長（SCL）：種全体のオス31.4cm・メス35.7cm。一般的な成体サイズや将来の成長予測ではない。',
    lifespanEvidence: { note: 'IUCNの専門家資料には、野外で数十年生きる個体が紹介されています。一方、何歳まで生きるかはまだはっきりしていません。数十年先も世話を続けられるか、迎える前に考えておきたい種です。', url: 'https://iucn-tftsg.org/wp-content/uploads/file/Accounts/crm_5_059_hermanni_v1_2011.pdf', source: 'IUCN TFTSG 種アカウント（2011）' },
    extraSpecs: {},
    links: [{ label: '乾燥系リクガメ 飼育ガイド', href: '../guide-dry.html' }], asin: null,
    slug: 'hermann-tortoise', hasPage: true,
    match: function(s){ return (s.compact||0) >= 1 || (s.humid||0) >= 2 || (s.dry||0) >= 2 || (s.charisma||0) >= 2 || (s.intermediate||0) >= 1 || (s.beginner||0) >= 2; },
    score: function(s){ return (s.compact||0)+Math.floor((s.humid||0)*0.7)+(s.intermediate||0)+(s.herbivore||0)+(s.eu_cb||0)+Math.floor((s.charisma||0)*0.5)+Math.floor((s.dry||0)*0.5)+Math.floor((s.medium||0)*0.5); },
    availability: 'common'
  },
  { name: 'ギリシャリクガメ', latin: 'Testudo graeca', emoji: '🏛️', recommendationPriority: 88, difficulty: '中〜上級', size: '亜種・産地で異なる', cites: 'CITES II', legal: 'cites_ii',
    reason: '亜種が多く産地によって環境適応が大きく異なります。産地情報付きCBを選ぶことが重要で、中級以上向きです。',
    specs: { '最大甲長': '46cm（原記録に疑義あり）', '主な食事': '野草・野菜', '水容量': '浅め水入れ', '温度': '25〜33℃' },
    coreSpecs: { size: '46cm（原記録に疑義あり）', temp: '25〜33℃', lifespan: "100年に達することも（動物園の案内）", diet: '草食（野草・野菜中心）' },
    sizeNote: 'TTWG 2025は種全体のオス46cm・メス31.5cmを掲載。ただしTFTSG東側種概説2023は46cmの原記録に誤りの可能性を指摘しています。この数値を確定した上限や一般的な成体サイズと考えたり、飼育容器の大きさを決める基準にしたりすることはできません。',
    sizeLabel: '報告最大甲長（疑義あり）',
    sizeEvidenceKind: 'uncertain_report',
    lifespanEvidence: {"note": "メリーランド動物園は、100年に達することもあると案内しています。ただし、亜種や野生・飼育下の区別、具体的な個体記録はありません。平均100年と考えたり、全亜種の上限として使ったりはできません。", "url": "https://www.marylandzoo.org/animal/greek-tortoise/", "source": "メリーランド動物園"},
    extraSpecs: {},
    links: [{ label: '乾燥系リクガメ 飼育ガイド', href: '../guide-dry.html' }], asin: null,
    slug: 'greek-tortoise', hasPage: true,
    match: function(s){ return (s.intermediate||0) >= 2 || (s.advanced||0) >= 1; },
    score: function(s){ return (s.medium||0)+(s.dry||0)+(s.intermediate||0)+(s.herbivore||0)+(s.eu_cb||0); },
    availability: 'common'
  },
  { name: 'フチゾリリクガメ', latin: 'Testudo marginata', emoji: '🌊', difficulty: '中〜上級', size: 'M（25〜35cm）', cites: 'CITES II', legal: 'cites_ii',
    reason: 'ギリシャ・サルデーニャ島産の地中海リクガメ。後部甲羅が特徴的に外側に反り返る個性的な体型。ヘルマンより大型化するが乾燥管理は同様。',
    specs: { '最大甲長': '35cm', '主な食事': '野草・野菜', '水容量': '浅め水入れ', '温度': '25〜32℃' },
    coreSpecs: { size: '35cm', temp: '25〜32℃', lifespan: "成体から21年2か月の飼育記録", diet: '草食（野草・野菜中心）' },
    lifespanEvidence: {"note": "Slavensの記録集には、1976年に成体で迎えた雄を21年2か月飼育し、報告時も生きていた例があります。迎えてからの期間なので、出生からの年齢や平均寿命、長生きの限界とは別です。", "url": "https://www.pondturtle.com/lturtle.html", "source": "Slavens 飼育記録集"},
    extraSpecs: {},
    links: [{ label: '乾燥系リクガメ 飼育ガイド', href: '../guide-dry.html' }], asin: null,
    slug: 'marginated-tortoise', hasPage: true,
    match: function(s){ return (s.medium||0) >= 2 && (s.dry||0) >= 2 && (s.intermediate||0) >= 1; },
    score: function(s){ return (s.medium||0)+(s.dry||0)+(s.intermediate||0)+(s.herbivore||0)+(s.eu_cb||0); },
    availability: 'common'
  },
  { name: 'エロンガータリクガメ', latin: 'Indotestudo elongata', emoji: '🌴', difficulty: '中〜上級', size: 'M（25〜33cm）', cites: 'CITES II', legal: 'cites_ii',
    reason: '東南アジア〜インド産の森林性リクガメ。高温多湿の環境を好み、地中海系リクガメとは異なる飼育感覚が楽しい。ミスト管理がポイント。',
    specs: { '最大甲長': '38cm（資料上限）', '主な食事': '植物性・動物性の食材', '水容量': '浅め水入れ', '温度': '27〜32℃' },
    coreSpecs: { size: '38cm（資料上限）', temp: '27〜32℃', lifespan: "成体から44年間の飼育例", diet: '雑食（植物性・動物性の食材）' },
    sizeNote: 'TTWG 2025 p.336 掲載の最大直線甲長（SCL）：オス38.0cm・メス31.0cm。一般的な成体サイズや将来の成長予測ではない。',
    lifespanEvidence: {"note": "IUCNの専門家資料には、1972年に成体で迎えた雌が、2016年にも生きて産卵していた記録があります。44年は迎えてからの期間です。出生からの年齢や平均寿命ではありません。", "url": "https://iucn-tftsg.org/wp-content/uploads/file/Accounts/crm_5_096_elongata_v1_2016.pdf", "source": "IUCN TFTSG 種アカウント（2016）"},
    extraSpecs: {},
    links: [{ label: '多湿系リクガメ 飼育ガイド', href: '../guide-arid.html' }], asin: null,
    slug: 'elongated-tortoise', hasPage: true,
    match: function(s){ return (s.medium||0) >= 2 && (s.humid||0) >= 2; },
    score: function(s){ return (s.medium||0)+(s.humid||0)+(s.intermediate||0)+(s.herbivore||0)+(s.asia_land||0); },
    availability: 'common'
  },
  { name: 'アカアシリクガメ', latin: 'Chelonoidis carbonarius', emoji: '🦶', difficulty: '中〜上級', size: 'L（30〜40cm）', cites: 'CITES II', legal: 'cites_ii',
    reason: '赤い鱗模様が美しい南米産リクガメ。雑食性で果物や動物性タンパクも食べます。高温多湿の環境が必要で大型化するためスペースが必要。',
    specs: { '最大甲長': '60cm（資料値）', '主な食事': '野菜・果物・動物性タンパク', '水容量': '浅め水入れ', '温度': '28〜32℃' },
    coreSpecs: { size: '60cm（資料値）', temp: '28〜32℃', lifespan: "50年以上（動物園の案内）", diet: '雑食（植物性・動物性の食材）' },
    sizeNote: 'VKM 2024の最大直甲長（オス60.0cm・メス44.2cm）。一般的な成体サイズや成長予測ではありません。',
    lifespanEvidence: {"note": "スミソニアン国立動物園は、50歳以上に達することが多いと案内しています。野生と飼育下の区別や平均の求め方は書かれておらず、50年が上限という意味でもありません。", "url": "https://www.nationalzoo.si.edu/animals/red-footed-tortoise", "source": "スミソニアン国立動物園"},
    extraSpecs: {},
    links: [{ label: '多湿系リクガメ 飼育ガイド', href: '../guide-arid.html' }], asin: null,
    slug: 'red-footed-tortoise', hasPage: true,
    match: function(s){ return (s.large||0) >= 2 && (s.humid||0) >= 2; },
    score: function(s){ return (s.large||0)+(s.humid||0)+(s.intermediate||0)+(s.charisma||0); },
    availability: 'common'
  },
  { name: 'チャコリクガメ', latin: 'Chelonoidis chilensis', emoji: '🌵', difficulty: '上級', size: 'M（22〜27cm）', cites: 'CITES II', legal: 'cites_ii',
    reason: '南米チャコ地方の乾燥地帯産。コンパクトなサイズで本格的な乾燥管理を楽しみたい上級者向き。WCは状態が悪いことが多くCBを強く推奨。',
    specs: { '最大甲長': '27cm', '主な食事': '野草・乾草', '水容量': '浅め水入れ', '温度': '26〜33℃' },
    coreSpecs: { size: '27cm', temp: '26〜33℃', lifespan: "飼育下で50年を超える例の記述（専門書）", diet: '草食（野草・野菜中心）' },
    lifespanEvidence: {"note": "Tracchiaの爬虫類医学の専門書には、飼育下で50年を超える例があると書かれています。個体ごとの出生・取得日や追跡表はないため、平均寿命や野生での最長年齢までは分かりません。", "url": "https://www.fundacionazara.org.ar/img/libros/medicina-de-quelonios.pdf", "source": "A. C. Tracchia『Medicina en quelonios y otros reptiles』p123"},
    extraSpecs: {},
    links: [{ label: '乾燥系リクガメ 飼育ガイド', href: '../guide-dry.html' }], asin: null,
    slug: 'chaco-tortoise', hasPage: true,
    match: function(s){ return (s.compact||0) >= 1 && (s.dry||0) >= 3 && (s.advanced||0) >= 1; },
    score: function(s){ return (s.compact||0)+(s.dry||0)+(s.advanced||0)+(s.herbivore||0)+(s.small_form||0); },
    availability: 'common'
  },
  { name: 'ヒョウモンガメ', latin: 'Stigmochelys pardalis', emoji: '🐆', difficulty: '上級', size: 'L（40〜65cm）', cites: 'CITES II', legal: 'cites_ii',
    reason: 'アフリカのサバンナに生息する豹柄の大型リクガメ。広いスペースと安定した高温乾燥環境が必要。上級者のチャレンジ種として人気。',
    specs: { '最大甲長': '65cm', '主な食事': '野草・乾草中心', '水容量': '大型水入れ', '温度': '28〜35℃' },
    coreSpecs: { size: '65cm', temp: '28〜35℃', lifespan: "100年に達することも（動物園の案内）", diet: '草食（野草・野菜中心）' },
    lifespanEvidence: {"note": "オレゴン動物園は、平均寿命には幅があり、100年に達することもあると案内しています。平均で100年生きるという話ではなく、種の上限が100年と確かめられているわけでもありません。", "url": "https://www.oregonzoo.org/animals/leopard-tortoise", "source": "オレゴン動物園"},
    extraSpecs: {},
    links: [{ label: '乾燥系リクガメ 飼育ガイド', href: '../guide-dry.html' }], asin: null,
    slug: 'leopard-tortoise', hasPage: true,
    match: function(s){ return (s.large||0) >= 3 && (s.dry||0) >= 3; },
    score: function(s){ return (s.large||0)+(s.dry||0)+(s.advanced||0)+(s.charisma||0)*2; },
    availability: 'common'
  },
  { name: 'ベルセオレガメ', latin: 'Kinixys belliana', emoji: '🔒', difficulty: '上級', size: 'M（記録上限23cm）', cites: 'CITES II', legal: 'cites_ii',
    reason: 'ヒンジバック（背甲後部が可動する）という独特の構造を持つアフリカ産リクガメ。狭義の本種はアンゴラ〜ブルンジに分布する。WC個体が多く状態管理が難しい。CB個体を入手できれば中型で飼いやすい。',
    specs: { '最大甲長': '23cm（資料上限）', '主な食事': '野草・野菜・昆虫少量', '水容量': '水入れ', '温度': '26〜32℃' },
    coreSpecs: { size: '23cm（資料上限）', temp: '26〜32℃', lifespan: "旧分類で成体から26年6か月の飼育記録", diet: '草食（野草・野菜中心）' },
    sizeNote: 'TTWG 2025 p.338 掲載の最大直線甲長（SCL）：23.0cm（性別の記載なし）。一般的な成体サイズや将来の成長予測ではない。',
    lifespanEvidence: {"note": "Slavensの記録集には、成体で迎えた雄と雌をそれぞれ26年6か月飼育した例があります。ただし、当時のベルセオレガメは後に複数種へ分けられました。この2頭が現在のKinixys bellianaかは分からず、本種だけの寿命を知るには種の確認が必要です。", "url": "https://www.pondturtle.com/lturtle.html", "source": "Slavens 飼育記録集（再分類前）"},
    extraSpecs: {},
    links: [{ label: '乾燥系リクガメ 飼育ガイド', href: '../guide-dry.html' }], asin: null,
    slug: 'bell-hinge-back-tortoise', hasPage: true,
    match: function(s){ return (s.advanced||0) >= 2 && (s.humid||0) >= 1; },
    score: function(s){ return (s.advanced||0)+(s.humid||0)+(s.medium||0)+(s.charisma||0)*2; },
    availability: 'rare'
  },
  { name: 'ケヅメリクガメ（スルカタ）', latin: 'Centrochelys sulcata', emoji: '🦏', difficulty: '上級', size: 'XL（60〜86cm）', cites: 'CITES II', legal: 'cites_ii',
    reason: '亜成体は愛らしいが成体は30〜100kgになる本格派。6畳以上の屋外放し飼いを念頭に置いた長期的な計画が必要な種です。',
    specs: { '最大甲長': '86cm', '主な食事': '乾草・野草', '水容量': '大型水場', '温度': '30〜38℃' },
    coreSpecs: { size: '〜86cm', temp: '30〜38℃', lifespan: "飼育下54年以上の報告", diet: '草食（野草・野菜中心）' },
    lifespanEvidence: {"note": "IUCNの専門家資料には、飼育下で54年以上生きたという文献報告が載っています。野生での寿命は不明で、54年も平均や上限ではありません。自分だけでなく、世話を引き継ぐ人のことまで考えて迎えたい種です。", "url": "https://iucn-tftsg.org/wp-content/uploads/crm.5.110.sulcata.v1.2020.pdf", "source": "IUCN TFTSG 種アカウント（2020、Biegler 1966引用）"},
    extraSpecs: {},
    links: [{ label: '乾燥系リクガメ 飼育ガイド', href: '../guide-dry.html' }], asin: null,
    slug: 'sulcata-tortoise', hasPage: true,
    match: function(s){ return (s.large||0) >= 3 && (s.dry||0) >= 3 && (s.advanced||0) >= 2; },
    score: function(s){ return (s.large||0)+(s.dry||0)+(s.advanced||0)+(s.charisma||0); },
    availability: 'common'
  },
  { name: 'アルダブラゾウガメ', latin: 'Aldabrachelys gigantea', emoji: '🐘', difficulty: '上級', size: 'XL（80〜120cm）', cites: 'CITES II', legal: 'cites_ii',
    reason: 'セイシェル・アルダブラ島固有の巨大リクガメ。個人飼育は法的に可能だが広大なスペースと数十年の覚悟が必要。ケヅメより穏やかな性格で知られる。',
    specs: { '最大甲長': '120cm超', '主な食事': '野草・乾草', '水容量': '水浴び池必須', '温度': '28〜33℃' },
    coreSpecs: { size: '120cm超', temp: '28〜33℃', lifespan: "成体から50年間の飼育例", diet: '草食（野草・野菜中心）' },
    lifespanEvidence: {"note": "スミソニアン国立動物園では、1976年に成体で迎えた2頭が、2026年に来園50周年を迎えました。50年は来園後の飼育期間で、80〜100歳という年齢は推定です。どちらも平均寿命や種の上限ではありません。", "url": "https://nationalzoo.si.edu/animals/news/happy-50th-zooniversary-chyna-and-rulon-zoos-aldabra-giant-tortoises", "source": "スミソニアン国立動物園（2026年9月8日）"},
    extraSpecs: {},
    links: [{ label: '乾燥系リクガメ 飼育ガイド', href: '../guide-dry.html' }], asin: null,
    slug: 'aldabra-tortoise', hasPage: true,
    match: function(s){ return (s.large||0) >= 3 && (s.humid||0) >= 1 && (s.advanced||0) >= 3; },
    score: function(s){ return (s.large||0)+(s.humid||0)+(s.advanced||0)+(s.charisma||0); },
    availability: 'rare'
  },
  { name: 'インプレッサムツアシガメ', latin: 'Manouria impressa', emoji: '🏔️', difficulty: '上級', size: 'M（25〜31cm）', cites: 'CITES II', legal: 'cites_ii',
    reason: 'リクガメ科で最も飼育が難しいとされるアジア産ムツアシガメ属。高標高の多湿林にすむ種。湿った床と通気、暑さを避ける場所と冷え込んだときの保温を両立させます。長期飼育記録が少なく専門家でも難しい究極の挑戦種。',
    specs: { '最大甲長': '31cm', '主な食事': 'キノコを中心に植物性の餌', '水容量': '水浴び場必須', '温度': '場所・昼夜で調整（種ページ参照）' },
    coreSpecs: { size: '31cm', temp: '場所・昼夜で調整（種ページ参照）', lifespan: "保全評価の計算で35年を仮定", diet: '菌食中心（キノコ・植物）' },
    lifespanEvidence: {"note": "2021年のIUCN保全評価では、世代長を計算するために寿命を35年と仮定しています。35年生きた個体を観察した記録や平均寿命ではなく、計算の前提として置いた数字です。飼育期間の目安とは分けて考える必要があります。", "url": "https://www.researchgate.net/publication/356711655_Manouria_impressa_Impressed_Tortoise_Assessment_by_View_on_wwwiucnredlistorg_THE_IUCN_RED_LIST_OF_THREATENED_SPECIES", "source": "Cotaら IUCN評価（2021、著者公開全文）"},
    extraSpecs: {},
    links: [{ label: '多湿系リクガメ 飼育ガイド', href: '../guide-arid.html' }], asin: null,
    slug: 'impressed-tortoise', hasPage: true,
    match: function(s){ return (s.large||0) >= 2 && (s.humid||0) >= 2 && (s.advanced||0) >= 3; },
    score: function(s){ return (s.large||0)+(s.humid||0)+(s.advanced||0)+(s.asia_land||0); },
    availability: 'common'
  },
  { name: 'パンケーキリクガメ', latin: 'Malacochersus tornieri', emoji: '🫓', difficulty: '上級', size: 'S（14〜18cm）', cites: 'CITES I', legal: 'cites_i',
    reason: '甲羅が薄く平たいリクガメ。岩の隙間に逃げ込む独特の習性を持ち、他のリクガメとは全く異なる生態が面白い。タンザニア・ケニア原産。通気性の良い岩場環境が必要。CITES I（附属書I）へ移行済みで野生個体の商業目的の国際取引は原則禁止。国内流通は希少。',
    diagnosisNotice: '当サイトでは新しく迎える人向けの診断候補から外しています。飼育自体が一律禁止という意味ではありません。CITES附属書I・日本の国際希少野生動植物種です。国内の売買・譲渡等は原則禁止ですが、登録済み個体は有効な登録票と一緒に譲り渡せます。国内CBやインボイスだけでは登録票の代わりになりません。譲り受けた人は30日以内に届出が必要です。',
    legalNote: 'CITES附属書I・日本の国際希少野生動植物種です。国内の売買・譲渡等は原則禁止ですが、登録済み個体は有効な登録票と一緒に譲り渡せます。国内CBやインボイスだけでは登録票の代わりになりません。譲り受けた人は30日以内に届出が必要です。',
    specs: { '最大甲長': '18cm', '主な食事': '野草・乾草', '水容量': '浅め水入れ', '温度': '25〜34℃' },
    coreSpecs: { size: '18cm', temp: '25〜34℃', lifespan: "30年以上（動物園の案内）", diet: '草食（野草・乾草中心）' },
    lifespanEvidence: {"note": "スミソニアン国立動物園は、30年以上生きることがあると案内しています。野生と飼育下の区別や平均の求め方は載っておらず、30年が上限というわけでもありません。", "url": "https://nationalzoo.si.edu/animals/african-pancake-tortoise", "source": "スミソニアン国立動物園"},
    extraSpecs: {},
    links: [{ label: '乾燥系リクガメ 飼育ガイド', href: '../guide-dry.html' }], asin: null,
    slug: 'pancake-tortoise', hasPage: true,
    match: function(){ return false; }, // CITES I（CoP18で附属書I昇格）— 診断結果からは除外・参考掲載のみ
    score: function(){ return -9999; },
    availability: 'archive'
  },
  { name: 'インドホシガメ', latin: 'Geochelone elegans', emoji: '⭐', difficulty: '上級', size: 'M（20〜30cm）', cites: 'CITES I', legal: 'cites_i',
    reason: '放射状の美しい模様が宝石のように輝くリクガメ。インド・パキスタン・スリランカ原産。CITES I・商業取引禁止。現在流通する個体は国内CBのみで、乾燥と温度管理の高い技術が必要。',
    specs: { '最大甲長': '30cm', '主な食事': '野草・野菜・乾草', '水容量': '浅め水入れ', '温度': '26〜35℃' },
    coreSpecs: { size: '30cm', temp: '26〜35℃', lifespan: "25〜50年（動物園の案内）", diet: '草食（野草・野菜・乾草）' },
    lifespanEvidence: {"note": "福岡市動物園の案内では、寿命は25〜50年です。野生と飼育下の区別や平均の求め方は書かれていないため、平均寿命や50年という上限が確かめられた数字としては扱えません。", "url": "https://zoo.city.fukuoka.lg.jp/animals/detail/120", "source": "福岡市動物園"},
    extraSpecs: {},
    links: [{ label: '乾燥系リクガメ 飼育ガイド', href: '../guide-dry.html' }], asin: null,
    slug: null, hasPage: false,
    match: function(){ return false; },
    score: function(){ return -9999; },
    availability: 'archive'
  },
  { name: 'ビルマホシガメ', latin: 'Geochelone platynota', emoji: '🌟', difficulty: '上級', size: 'M（28〜35cm）', cites: 'CITES I', legal: 'cites_i',
    reason: 'ミャンマー固有のホシガメ。インドホシガメより扁平で大型になる幻の種。CITES I・商業取引禁止で国内流通はごく稀。飼育記録を持つことが保全に貢献する意義深い稀少種。',
    specs: { '最大甲長': '35cm', '主な食事': '野草・野菜', '水容量': '浅め水入れ', '温度': '26〜34℃' },
    coreSpecs: { size: '35cm', temp: '26〜34℃', lifespan: "野生では50年超の可能性（資料上の推定）", diet: '草食（野草・野菜）' },
    lifespanEvidence: {"note": "サンディエゴ動物園は、野生での寿命は十分分かっていないとしながら、50年を超える可能性を紹介しています。平均や確認済みの上限ではありません。同じ資料の飼育集団の数字とは集計条件が違うため、そのまま比べることもできません。", "url": "https://ielc.libguides.com/sdzg/factsheets/burmese-star-tortoise/reproduction", "source": "サンディエゴ動物園 Wildlife Alliance 資料（2026）"},
    extraSpecs: {},
    links: [{ label: '乾燥系リクガメ 飼育ガイド', href: '../guide-dry.html' }], asin: null,
    slug: null, hasPage: false,
    match: function(){ return false; },
    score: function(){ return -9999; },
    availability: 'archive'
  },
  { name: 'エジプトリクガメ', latin: 'Testudo kleinmanni', emoji: '🏺', difficulty: '上級', size: 'S（10〜13cm）', cites: 'CITES I', legal: 'cites_i',
    reason: '世界最小クラスのリクガメで砂漠・半乾燥地帯に生息。エジプト・リビア原産。CITES I・商業取引禁止で国内流通はほぼなし。極度の乾燥と高温管理が必要な超上級者向けの希少種。',
    specs: { '最大甲長': '13cm', '主な食事': '野草・乾草', '水容量': '極少量', '温度': '28〜38℃' },
    coreSpecs: { size: '13cm', temp: '28〜38℃', lifespan: "飼育下70〜100年（動物園の案内）", diet: '草食（乾草・砂漠植物）' },
    lifespanEvidence: {"note": "オレゴン動物園は、飼育下で70〜100年生きる可能性を案内していますが、個体の追跡記録や計算根拠は載っていません。専門施設の手引きには別の推定もあり、70〜100年を確定した平均や上限とはできません。", "url": "https://www.oregonzoo.org/animals/egyptian-tortoise", "source": "オレゴン動物園"},
    extraSpecs: {},
    links: [{ label: '乾燥系リクガメ 飼育ガイド', href: '../guide-dry.html' }], asin: null,
    slug: null, hasPage: false,
    match: function(){ return false; },
    score: function(){ return -9999; },
    availability: 'archive'
  },
  { name: 'ソリガメ', latin: 'Chersina angulata', emoji: '🔱', difficulty: '上級', size: 'M（15〜25cm）', cites: 'CITES II', legal: 'cites_ii',
    reason: '南アフリカ・ケープ地方原産のリクガメ。甲羅前端が反り上がった独特の形状が名前の由来。乾燥した低木地帯に生息し、高温・乾燥・通気性の良い環境が必要。国内流通は少なく希少。CITES II。',
    specs: { '最大甲長': '35.1cm（資料上限）', '主な食事': '野草・野菜', '水容量': '浅め水入れ', '温度': '25〜35℃' },
    coreSpecs: { size: '35.1cm（資料上限）', temp: '25〜35℃', lifespan: "飼育下で32年の記録（SANBIの案内）", diet: '草食（野草・多肉植物）' },
    sizeNote: 'TTWG 2025 p.325 掲載の最大直線甲長（SCL）：オス35.1cm・メス21.6cm。一般的な成体サイズや将来の成長予測ではない。',
    lifespanEvidence: {"note": "南アフリカ国立生物多様性研究所は、飼育下で32年の記録を紹介しています。個体の取得日などは掲載されていませんが、長期飼育の一例です。平均や寿命の限界を表す数字ではありません。", "url": "https://www.sanbi.org/gardens/hantam/wildlife-and-biodiversity-2/angulate-tortoise/", "source": "南アフリカ国立生物多様性研究所（SANBI）"},
    extraSpecs: {},
    links: [{ label: '乾燥系リクガメ 飼育ガイド', href: '../guide-dry.html' }], asin: null,
    slug: 'bowsprit-tortoise', hasPage: true,
    match: function(s){ return (s.compact||0) >= 2 && (s.dry||0) >= 2 && (s.advanced||0) >= 2; },
    score: function(s){ return (s.compact||0)+(s.dry||0)+(s.advanced||0)+(s.charisma||0)+(s.collector||0)+(s.ultra_rare||0); },
    availability: 'rare'
  },
  { name: 'ホームセオレガメ', latin: 'Kinixys homeana', emoji: '🔒', difficulty: '上級', size: 'M（18〜25cm）', cites: 'CITES I', legal: 'cites_i',
    reason: '西アフリカの熱帯雨林に生息するセオレガメ。甲羅後半がヒンジで閉じる独特の機構を持つ。高湿度・高温の環境が必要で、WC個体はストレスや寄生虫に弱い。2026年3月5日からCITES I・国際希少野生動植物種。購入・譲渡には登録等の要件を確認してください。国内CBやインボイスだけでは登録票の代わりになりません。',
    specs: { '最大甲長': '25.8cm（資料上限）', '主な食事': 'キノコ・果実・ミミズ', '水容量': '浅め水入れ', '温度': '26〜32℃' },
    coreSpecs: { size: '25.8cm（資料上限）', temp: '26〜32℃', lifespan: "飼育下60年という推定", diet: '雑食（キノコ・果実・小動物）' },
    sizeNote: 'TTWG 2025 p.339 掲載の最大直線甲長（SCL）：オス25.1cm・メス25.8cm。一般的な成体サイズや将来の成長予測ではない。',
    lifespanEvidence: {"note": "ノルウェーのVKMの評価資料では、飼育下の寿命を60年と推定しています。Luiselliら（2021）を引用した値ですが、60年間追跡した個体の記録や、平均寿命の求め方は載っていません。", "url": "https://www.vkm.no/download/18.1e9d871e18e5134f3943db3b/1710934445385/Scientific%20assessment%20of%20risk%20to%20the%20populations%20of%20tortoises%20listed%20by%20CITES%20as%20a%20result%20of%20trade_publisert%20versjon.pdf", "source": "VKM CITESリクガメ類リスク評価（2024）"},
    extraSpecs: {},
    links: [{ label: '多湿系リクガメ 飼育ガイド', href: '../guide-moist.html' }], asin: null,
    slug: 'home-hinge-back-tortoise', hasPage: true,
    match: function(){ return false; },
    score: function(){ return -9999; },
    availability: 'archive',
    diagnosisNotice: '当サイトの診断ではおすすめ候補に含めていません。飼育が一律に禁止されたという意味ではありません。2026年3月5日からCITES附属書I・国際希少野生動植物種。国内での売買・譲渡等は原則禁止され、登録を受けた個体の取引には有効な登録票の引渡し等が必要です。規制前から適法に入手した個体の継続飼育は可能です。'
  },
  { name: 'マダガスカルクモノスガメ', latin: 'Pyxis arachnoides', emoji: '🕸️', difficulty: '上級', size: 'S（12〜15cm）', cites: 'CITES I', legal: 'cites_i',
    reason: 'マダガスカル固有の超希少リクガメ。甲羅に蜘蛛の巣のような放射状模様が入る。CITES I・商業取引禁止で世界的にも飼育記録が少ない。乾燥と季節変化（乾季・雨季）の再現が飼育の鍵。',
    specs: { '最大甲長': '15cm', '主な食事': '野草・乾草', '水容量': '極少量〜なし（乾季）', '温度': '25〜35℃' },
    coreSpecs: { size: '15cm', temp: '25〜35℃', lifespan: "70年に達する可能性（動物園の推定）", diet: '草食（乾草・砂漠植物）' },
    lifespanEvidence: {"note": "スミソニアン国立動物園は、確かなデータはないものの70年に達する可能性があると紹介しています。70年間飼育した記録ではなく、平均でもありません。種全体についての推定で、各亜種を調べた結果ではない点にも注意が必要です。", "url": "https://nationalzoo.si.edu/animals/spider-tortoise", "source": "スミソニアン国立動物園"},
    extraSpecs: {},
    links: [{ label: '乾燥系リクガメ 飼育ガイド', href: '../guide-dry.html' }], asin: null,
    slug: null, hasPage: false,
    match: function(){ return false; },
    score: function(){ return -9999; },
    availability: 'archive'
  },
  { name: 'イベラギリシャリクガメ', latin: 'Testudo graeca ibera', emoji: '🪨', difficulty: '中〜上級', size: 'M（18〜25cm）', cites: 'CITES II', legal: 'cites_ii',
    reason: 'ギリシャリクガメの最大亜種。EU産CBの流通あり。地中海系リクガメの中では大型でずっしりとした体格。tortoise-style.com等国内専門店でカテゴリ掲載確認。CITES II。',
    specs: { '最大甲長': '38.9cm（資料上限）', '主な食事': '野草・野菜', '水容量': '浅め水入れ', '温度': '25〜33℃' },
    coreSpecs: { size: '38.9cm（資料上限）', temp: '25〜33℃', lifespan: "野外で55年以上との文献報告", diet: '草食（野草・野菜）' },
    sizeNote: 'TTWG 2025 p.358 掲載の最大直線甲長（SCL）：イベラ亜種のオス38.9cm・メス31.5cm。一般的な成体サイズや将来の成長予測ではない。',
    lifespanEvidence: {"note": "野外で55年以上生きるという報告が、IUCNの専門家資料に紹介されています。引用元は旧名nikolskiiの個体群を調べた学会要旨です。元の本文と年齢の調べ方は未確認で、出生から55年間追跡した記録や平均寿命としては読めません。", "url": "https://iucn-tftsg.org/wp-content/uploads/file/Accounts/crm.5.120.eastern.graeca.v1.2023.pdf", "source": "IUCN TFTSG 東部ギリシャ亜種群アカウント（2023、Galichenko1997引用）"},
    extraSpecs: {},
    links: [{ label: '乾燥系リクガメ 飼育ガイド', href: '../guide-dry.html' }], asin: null,
    slug: 'iberian-greek-tortoise', hasPage: true,
    match: function(s){ return (s.intermediate||0) >= 2 || (s.advanced||0) >= 1; },
    score: function(s){ return (s.intermediate||0)+(s.eu_cb||0)+(s.herbivore||0)+(s.dry||0)+(s.compact||0); },
    availability: 'common'
  },
  { name: 'チュニジアギリシャリクガメ', latin: 'Testudo graeca nabeulensis', emoji: '🫒', difficulty: '中〜上級', size: 'S（13〜17cm）', cites: 'CITES II', legal: 'cites_ii',
    reason: 'ギリシャリクガメの亜種で最小級。成体でも13〜17cm程度にとどまり、飼育スペースは当サイトの目安で90〜120cm級（床面積優先）。北アフリカ産で冬眠しない系統として扱う。国内流通は限られる。CITES II。',
    specs: { '最大甲長': '17cm', '主な食事': '野草・野菜', '水容量': '浅め水入れ', '温度': '26〜32℃' },
    coreSpecs: { size: '17cm', temp: '26〜32℃', lifespan: "チュニジア型に31年の飼育歴報告", diet: '草食（野草・野菜）' },
    lifespanEvidence: {"note": "Tortoise Trustの調査報告には、英国で31年飼育された個体が登場します。チュニジアの野生個体と形態が同じと判断されていますが、現在の亜種名が付く前の報告のため、本亜種かどうかは確定していません。出生年も不明で、31年は飼育期間です。平均寿命ではありません。", "url": "https://www.tortoisetrust.org/articles/tunisprelim.html", "source": "Highfield チュニジア調査報告（Tortoise Trust）"},
    extraSpecs: {},
    links: [{ label: '乾燥系リクガメ 飼育ガイド', href: '../guide-dry.html' }], asin: null,
    slug: 'tunisian-greek-tortoise', hasPage: true,
    match: function(s){ return (s.small_form||0) >= 2 && (s.dry||0) >= 1 && ((s.intermediate||0) >= 1 || (s.advanced||0) >= 1); },
    score: function(s){ return (s.small_form||0)+(s.compact||0)+(s.dry||0)+(s.herbivore||0)+(s.intermediate||0)+(s.eu_cb||0); },
    availability: 'rare'
  },
  { name: 'モロッコギリシャリクガメ', latin: 'Testudo graeca graeca', emoji: '🐪', difficulty: '中〜上級', size: 'M（15〜20cm）', cites: 'CITES II', legal: 'cites_ii',
    reason: 'ギリシャリクガメの基亜種。モロッコ・アルジェリアを中心とする北アフリカ産で、甲長15〜20cm程度。イベラ亜種より一回り小さめ。飼育スペースは当サイトの目安で90〜120cm級（床面積優先）。北アフリカ産で冬眠しない系統として扱う。CITES II。',
    specs: { '最大甲長': '20cm', '主な食事': '野草・野菜', '水容量': '浅め水入れ', '温度': '26〜32℃' },
    coreSpecs: { size: '20cm', temp: '26〜32℃', lifespan: "現在の亜種に対応する長期記録は未確認", diet: '草食（野草・野菜）' },
    lifespanEvidence: {"note": "動物園には「100年に達することもある」という案内がありますが、ギリシャリクガメ全体の話で、亜種は書かれていません。古い資料のgraecaという名前も、現在の基亜種と同じ範囲とは限りません。モロッコ亜種の平均や最長寿命を決める材料にはできません。", "url": "https://www.marylandzoo.org/animal/greek-tortoise/", "source": "メリーランド動物園（種全体の案内）"},
    extraSpecs: {},
    links: [{ label: '乾燥系リクガメ 飼育ガイド', href: '../guide-dry.html' }], asin: null,
    slug: 'moroccan-greek-tortoise', hasPage: true,
    match: function(s){ return (s.dry||0) >= 1 && ((s.intermediate||0) >= 1 || (s.advanced||0) >= 1); },
    score: function(s){ return (s.dry||0)+(s.herbivore||0)+(s.intermediate||0)+(s.compact||0)+(s.eu_cb||0); },
    availability: 'rare'
  },
  { name: 'リビアギリシャリクガメ', latin: 'Testudo graeca cyrenaica', emoji: '🏜️', difficulty: '中〜上級', size: 'S〜M（13〜18cm）', cites: 'CITES II', legal: 'cites_ii',
    reason: 'リビア・キレナイカ地方の固有亜種。ギリシャリクガメのなかでも扁平で明るい色合いになる傾向。国内流通はほぼ皆無で、記録目的の掲載。飼育情報も乏しく、迎える機会は極めて限られる。',
    specs: { '最大甲長': '18cm', 'タイプ': '乾燥系陸棲', '温度': '26〜32℃', '難易度': '中〜上級' },
    coreSpecs: { size: '18cm', temp: '26〜32℃', lifespan: "亜種固有の長期記録は未確認", diet: '草食' },
    lifespanEvidence: {"note": "ギリシャリクガメ全体には「100年に達することもある」という動物園の案内があります。ただ、キレナイカ亜種の個体記録ではありません。この亜種だと確認できる長期記録は見つかっておらず、平均や最長寿命は分かりません。", "url": "https://www.marylandzoo.org/animal/greek-tortoise/", "source": "メリーランド動物園（種全体の案内）"},
    extraSpecs: {},
    links: [{ label: '乾燥系リクガメ 飼育ガイド', href: '../guide-dry.html' }], asin: null,
    slug: 'libyan-greek-tortoise', hasPage: true,
    match: function(s){ return (s.dry||0) >= 1 && (s.collector_grade||0) >= 1 && ((s.intermediate||0) >= 1 || (s.advanced||0) >= 1); },
    score: function(s){ return (s.dry||0)+(s.intermediate||0)+(s.advanced||0)+(s.collector_grade||0)+(s.collector||0); },
    availability: 'rare'
  },
  { name: 'ヒガシヘルマンリクガメ', latin: 'Testudo hermanni boettgeri', emoji: '🌿', difficulty: '中級', size: 'M（15〜23cm・資料上限35.7cm）', cites: 'CITES II', legal: 'cites_ii',
    reason: 'ヘルマンリクガメ2亜種の東側・大型側で、日本で「ヘルマン」として流通する個体の主流。EU産CBが安定して流通し丈夫。ニシ亜種より明確に大きく育つため、成体には120cm級の床面積を前提に計画する。CITES II。',
    specs: { '最大甲長': '35.7cm（資料上限）', '主な食事': '野草・野菜', '水容量': '浅め水入れ', '温度': '25〜30℃' },
    coreSpecs: { size: '35.7cm（資料上限）', temp: '25〜30℃', lifespan: "幼体から31年8か月の飼育記録", diet: '草食（野草・野菜中心）' },
    sizeNote: 'TTWG 2025 p.369 掲載の最大直線甲長（SCL）：東亜種boettgeriのオス31.4cm・メス35.7cm。一般的な成体サイズや将来の成長予測ではない。',
    lifespanEvidence: {"note": "Slavensには、boettgeriの雄を幼体から31年8か月飼育した記録があります。生まれた年は不明なので、これは飼育期間です。亜種名は明記されていますが、総年齢や平均・最長寿命を表すものではありません。", "url": "https://www.pondturtle.com/lturtle.html", "source": "Slavens 飼育記録集"},
    extraSpecs: {},
    links: [{ label: '乾燥系リクガメ 飼育ガイド', href: '../guide-dry.html' }], asin: null,
    slug: 'eastern-hermann-tortoise', hasPage: true,
    match: function(s){ return (s.dry||0) >= 2 && ((s.intermediate||0) >= 2 || (s.advanced||0) >= 1); },
    score: function(s){ return (s.dry||0)+(s.medium||0)+(s.herbivore||0)+(s.eu_cb||0)+(s.intermediate||0)+Math.floor((s.compact||0)*0.5); },
    availability: 'common'
  },
  { name: 'ニシヘルマンリクガメ', latin: 'Testudo hermanni hermanni', emoji: '🌼', difficulty: '中級', size: 'S〜M（12〜18cm）', cites: 'CITES II', legal: 'cites_ii',
    reason: 'ヘルマンリクガメの基亜種にして西側・小型側。鮮やかな黄金色に濃い黒斑が入り、腹甲の2本の連続した黒帯が識別点。流通は少なくEUCB中心で高価なため、購入前の亜種確認が重要。CITES II。',
    specs: { '最大甲長': '18cm', '主な食事': '野草・野菜', '水容量': '浅め水入れ', '温度': '25〜30℃' },
    coreSpecs: { size: '18cm', temp: '25〜30℃', lifespan: "22年8か月の飼育記録", diet: '草食（野草・野菜中心）' },
    lifespanEvidence: {"note": "Slavensには、hermanniの雄を22年8か月飼育した記録があります。生まれた年も、迎えたときの年齢も不明です。分かるのは飼育期間で、この亜種の平均や最長寿命ではありません。", "url": "https://www.pondturtle.com/lturtle.html", "source": "Slavens 飼育記録集"},
    extraSpecs: {},
    links: [{ label: '乾燥系リクガメ 飼育ガイド', href: '../guide-dry.html' }], asin: null,
    slug: 'western-hermann-tortoise', hasPage: true,
    match: function(s){ return (s.small_form||0) >= 2 && (s.dry||0) >= 1 && ((s.intermediate||0) >= 1 || (s.advanced||0) >= 1); },
    score: function(s){ return (s.small_form||0)+(s.compact||0)+(s.dry||0)+(s.herbivore||0)+(s.eu_cb||0)+(s.intermediate||0); },
    availability: 'rare'
  },
  { name: 'ゴールデンギリシャリクガメ', latin: 'Testudo graeca terrestris', emoji: '🏜️', difficulty: '中〜上級', size: 'S〜M（13〜18cm）', cites: 'CITES II', legal: 'cites_ii',
    reason: 'ギリシャリクガメの中東（レバント）亜種。明るい黄金色〜クリーム色の小型亜種で、イベラと並ぶ定番。乾燥地出身のため「冬眠させない通年加温」が管理の基本で、イベラとは冬の育て方が変わる。CITES II。',
    specs: { '最大甲長': '18cm', '主な食事': '野草・野菜', '水容量': '浅め水入れ', '温度': '26〜33℃' },
    coreSpecs: { size: '18cm', temp: '26〜33℃', lifespan: "100年との報告書解説（個体記録なし）", diet: '草食（野草・野菜）' },
    lifespanEvidence: {"note": "Jabal Moussa生物圏保護区の報告書には、terrestrisの寿命を100年とする説明があります。どの個体の記録か、野生か飼育下か、元の資料や出生年は書かれていません。報告書の解説としては参考になりますが、平均や確認済みの最長寿命ではありません。", "url": "https://miteco-prod.adobecqms.net/content/dam/miteco/es/parques-nacionales-oapn/proyectos-de-cooperacion/biodiversidad_tcm30-287284.pdf", "source": "Jabal Moussa生物多様性評価報告書（2012、p107）"},
    extraSpecs: {},
    links: [{ label: '乾燥系リクガメ 飼育ガイド', href: '../guide-dry.html' }], asin: null,
    slug: 'golden-greek-tortoise', hasPage: true,
    match: function(s){ return (s.small_form||0) >= 2 && (s.dry||0) >= 2 && ((s.intermediate||0) >= 1 || (s.advanced||0) >= 1); },
    score: function(s){ return (s.small_form||0)+(s.dry||0)+(s.herbivore||0)+(s.compact||0)+(s.intermediate||0)+(s.advanced||0); },
    availability: 'common'
  },
  { name: 'チェリーヘッドアカアシリクガメ', latin: 'Chelonoidis carbonarius（チェリーヘッド）', emoji: '🍒', difficulty: '中〜上級', size: '地域型の上限は未確立', cites: 'CITES II', legal: 'cites_ii',
    reason: '頭部が特に赤みの強いアカアシリクガメの一部に使われる流通名。国内CB・輸入CB流通あり。通常のアカアシリクガメより観賞価値が高く人気。CITES II種のため国内CBのインボイス確認を推奨。',
    specs: { '最大甲長': '地域型の上限は未確立', '主な食事': '果実・野菜・タンパク質', '水容量': '浅め水入れ', '温度': '26〜32℃' },
    coreSpecs: { size: '地域型の上限は未確立', temp: '26〜32℃', lifespan: "種全体は50年以上（動物園の案内）", diet: '雑食（果実・野菜・小動物）' },
    sizeNote: 'チェリーヘッドはアカアシリクガメの一部に使われる販売名です。Carl May（2012）の飼育報告には直線甲長30cmの雌が登場しますが、1個体の記録です。この名前で売られる個体の平均や最大の大きさは分かっていません。',
    sizeLabel: '甲長の資料',
    lifespanEvidence: {"note": "スミソニアン国立動物園は、アカアシリクガメには50歳以上になる個体が多いと案内しています。チェリーヘッドだけを調べた記録ではなく、平均寿命の計算方法も不明です。この地域・外見上の型だけの寿命や上限は、別に考える必要があります。", "url": "https://www.nationalzoo.si.edu/animals/red-footed-tortoise", "source": "スミソニアン国立動物園（種全体の案内）"},
    extraSpecs: {},
    links: [{ label: '多湿系リクガメ 飼育ガイド', href: '../guide-arid.html' }], asin: null,
    slug: 'cherry-head-tortoise', hasPage: true,
    match: function(s){ return (s.large||0) >= 2 && (s.humid||0) >= 2; },
    score: function(s){ return (s.large||0)+(s.humid||0)+(s.intermediate||0)+(s.charisma||0)+(s.tropical_climate||0); },
    availability: 'common'
  }
],

// ==================== 水棲ガメルート ====================
aquatic: [
  { name: 'ミシシッピニオイガメ', latin: 'Sternotherus odoratus', emoji: '🔬', recommendationPriority: 100, difficulty: '入門', size: 'S（10〜14cm）', cites: 'CITES II', legal: null,
    reason: '水棲ガメ入門の定番。記録上の最大でも13.7cmの小型種で、45cm水槽から始めて成体は60cm水槽が目安。威嚇時に臭いを出しますが慣れればほぼ無臭。お手頃価格で流通も安定。',
    specs: { '最大甲長': '13.7cm', '水槽サイズ': '45cm〜（成体60cm）', '水温': '22〜28℃', '難易度': '入門' },
    coreSpecs: { size: '13.7cm', temp: '22〜28℃', lifespan: '54年以上の飼育記録（平均は不明）', diet: '雑食' },
    sizeNote: '資料に記録された上限。一般的な成体は5〜12cmで、オスとメスの大きさの差はほとんどありません。',
    lifespanEvidence: { note: 'カナダの管理計画には、飼育下で54年以上生きた記録が載っています。平均寿命は分かっておらず、54年が長生きの限界というわけでもありません。', url: 'https://www.canada.ca/en/environment-climate-change/services/species-risk-public-registry/management-plans/eastern-musk-turtle-2024.html', source: 'カナダ環境・気候変動省（2024）' },
    extraSpecs: { tankSize: '45cm〜（成体60cm）' },
    links: [{ label: '半水棲ガメ 飼育ガイド', href: '../guide-semi.html' }], asin: null,
    slug: 'musk-turtle', hasPage: true,
    match: function(s){ return (s.small_tank||0) >= 2 && (s.beginner||0) >= 2; },
    score: function(s){ return (s.small_tank||0)+(s.beginner||0)+(s.observational||0)+(s.mainstream||0)+(s.mud_lover||0)+(s.na_water||0)+(s.cool_climate||0); },
    availability: 'common'
  },
  { name: 'ヒラタニオイガメ', latin: 'Sternotherus depressus', emoji: '🔭', difficulty: '上級', size: 'S（8〜11cm）', cites: 'CITES II', legal: null,
    reason: '甲羅が強く扁平になるニオイガメ属の小型種。米国アラバマ州ブラックウォーリアー川上流域だけに分布する固有種で、IUCNは近絶滅種（CR）、米国は絶滅危惧種法で保護している。流通はほとんどなく、実際に迎えられる機会はまずない。',
    specs: { '最大甲長': '11cm', '水槽サイズ': '30cm〜', '水温': '20〜27℃', '難易度': '上級' },
    coreSpecs: { size: '11cm', temp: '20〜27℃', lifespan: "直接の長期個体記録は未確認", diet: '雑食' },
    lifespanEvidence: {"note": "資料にある30〜60年は、最大体サイズに達するまでの年齢を成長モデルで推定した数字です。「何年生きたか」という記録ではありません。実際に長く追跡した個体の記録は確認できておらず、この推定を寿命として載せることはできません。", "url": "https://iucn-tftsg.org/wp-content/uploads/file/Accounts/crm_5_013_depressus_v1_2008.pdf", "source": "IUCN TFTSG 種アカウント（2008）"},
    extraSpecs: { tankSize: '30cm〜' },
    links: [{ label: '半水棲ガメ 飼育ガイド', href: '../guide-semi.html' }], asin: null,
    slug: null, hasPage: false,
    match: function(s){ return (s.small_tank||0) >= 3 && (s.observational||0) >= 1; },
    score: function(s){ return (s.small_tank||0)+(s.beginner||0)+(s.observational||0)+(s.na_water||0)+(s.cool_climate||0); },
    availability: 'rare'
  },
  { name: 'ミシシッピドロガメ', latin: 'Kinosternon subrubrum hippocrepis', emoji: '🌿', recommendationPriority: 96, difficulty: '入門', size: 'S（10〜12cm）', cites: 'CITES II', legal: null,
    reason: '10cm程度の超小型種。陸上に上がる習性があるためシェルターと陸場の確保が必要。ニオイガメより温和な個体が多い。',
    specs: { '最大甲長': '12cm', '水槽サイズ': '30cm〜', '水温': '20〜26℃', '難易度': '入門' },
    coreSpecs: { size: '12cm', temp: '20〜26℃', lifespan: "成体から18年4か月の飼育記録", diet: '雑食' },
    lifespanEvidence: {"note": "Snider・Bowlerの記録集には、亜種Kinosternon subrubrum hippocrepisの野生由来の成体を18年4か月飼育した例があります。迎える前の年齢は含まれていないので、これは一生の長さではなく飼育期間です。", "url": "https://webapps.fhsu.edu/ksherp/bibFiles/21870.pdf", "source": "Snider・Bowler 飼育下長寿記録集（1992）"},
    extraSpecs: { tankSize: '30cm〜' },
    links: [{ label: '半水棲ガメ 飼育ガイド', href: '../guide-semi.html' }], asin: null,
    slug: 'mississippi-mud-turtle', hasPage: true,
    match: function(s){ return (s.small_tank||0) >= 2 && (s.beginner||0) >= 1; },
    score: function(s){ return (s.small_tank||0)+(s.beginner||0)+(s.observational||0)+(s.mainstream||0)+(s.mud_lover||0)+(s.na_water||0)+(s.warm_climate||0); },
    availability: 'common'
  },
  { name: 'ミスジドロガメ', latin: 'Kinosternon baurii', emoji: '〰️', difficulty: '入門〜中級', size: 'S（9〜12cm）', cites: 'CITES II', legal: null,
    reason: '甲羅に3本の明瞭な筋が走る美しいドロガメ。小型で飼育しやすく温和な性格。ニオイガメと並ぶ小型水棲ガメ入門の選択肢。',
    specs: { '最大甲長': '12cm', '水槽サイズ': '30cm〜', '水温': '20〜27℃', '難易度': '入門〜中級' },
    coreSpecs: { size: '12cm', temp: '20〜27℃', lifespan: "成体から49年7か月の飼育記録", diet: '雑食' },
    lifespanEvidence: {"note": "IUCNの専門家資料には、野生で成体として捕獲した雌を49年7か月飼育した記録があります。54歳以上という総年齢は推定です。飼育期間と推定年齢を分けて読める、長期飼育の一例です。", "url": "https://iucn-tftsg.org/wp-content/uploads/file/Accounts2/crm.5.116.baurii.v1.2021.pdf", "source": "IUCN TFTSG 種アカウント（2021、Johnson 1984引用）"},
    extraSpecs: { tankSize: '30cm〜' },
    links: [{ label: '半水棲ガメ 飼育ガイド', href: '../guide-semi.html' }], asin: null,
    slug: 'striped-mud-turtle', hasPage: true,
    match: function(s){ return (s.small_tank||0) >= 2 && (s.beginner||0) >= 1; },
    score: function(s){ return (s.small_tank||0)+(s.beginner||0)+(s.observational||0)+(s.mud_lover||0)+(s.na_water||0)+(s.warm_climate||0); },
    availability: 'common'
  },
  { name: 'カブトニオイガメ', latin: 'Sternotherus carinatus', emoji: '⛑️', difficulty: '入門〜中級', size: 'M（10〜15cm）', cites: 'CITES II', legal: null,
    reason: 'キールが目立つ個性的な甲羅が魅力。ニオイガメよりやや大型化し、単独でも60cm水槽が目安（ペアは90cm）。気性がやや荒い個体もいます。',
    specs: { '最大甲長': '17.6cm', '水槽サイズ': '60cm〜（ペア90cm）', '水温': '22〜28℃', '難易度': '入門〜中級' },
    coreSpecs: { size: '17.6cm', temp: '22〜28℃', lifespan: '29年以上の飼育記録', diet: '雑食' },
    sizeNote: '資料に記録された上限（アラバマ州の資料）。16cmとする図鑑もあります。一般的な成体は10〜12cm前後。',
    lifespanEvidence: { note: 'Slavensの記録集には、29年4か月飼育され、報告時にも生きていた雌が載っています。これは飼育された期間で、出生からの年齢や平均寿命ではありません。', url: 'https://www.pondturtle.com/lturtle.html', source: 'Slavens 飼育記録集' },
    extraSpecs: { tankSize: '60cm〜（ペア90cm）' },
    links: [{ label: '半水棲ガメ 飼育ガイド', href: '../guide-semi.html' }], asin: null,
    slug: 'razorback-musk-turtle', hasPage: true,
    match: function(s){ return (s.small_tank||0) >= 1 && (s.observational||0) >= 2; },
    score: function(s){ return (s.small_tank||0)+(s.beginner||0)+(s.observational||0)+(s.mud_lover||0)+(s.na_water||0)+(s.warm_climate||0); },
    availability: 'common'
  },
  { name: 'スジクビニオイガメ', latin: 'Sternotherus peltifer', emoji: '🎗️', difficulty: '中級', size: 'S（8〜11cm）', cites: 'CITES II', legal: null,
    reason: '首と頭部に細かいストライプが走る美しいニオイガメ系の小型種。国内CB流通が確認されており、マニアに人気。小型水槽で観察を楽しめる。',
    specs: { '最大甲長': '11cm', '水槽サイズ': '30cm〜', '水温': '20〜27℃', '難易度': '中級' },
    coreSpecs: { size: '11cm', temp: '20〜27℃', lifespan: "種単独の寿命を示す資料が不足", diet: '雑食' },
    lifespanEvidence: {"note": "BfNの報告書にある30〜50年は、Sternotherus属全体の参考値です。本種の個体を長期追跡した記録ではありません。近縁のSternotherus minorの飼育記録も、そのままスジクビニオイガメの寿命には置き換えられません。", "url": "https://bfn.bsz-bw.de/files/1987/Schrift740.pdf", "source": "ドイツ連邦自然保護庁（BfN）報告書"},
    extraSpecs: { tankSize: '30cm〜' },
    links: [{ label: '半水棲ガメ 飼育ガイド', href: '../guide-semi.html' }], asin: null,
    slug: 'stripe-necked-musk-turtle', hasPage: true,
    match: function(s){ return (s.small_tank||0) >= 2 && (s.observational||0) >= 2 && (s.intermediate||0) >= 2; },
    score: function(s){ return (s.small_tank||0)+(s.observational||0)+(s.intermediate||0)+(s.rare_water||0)+(s.mud_lover||0)+(s.na_water||0)+(s.warm_climate||0); },
    availability: 'common'
  },
  { name: 'ホオアカドロガメ', latin: 'Kinosternon cruentatum', emoji: '🔴', difficulty: '中級', size: 'M（13〜15cm）', cites: 'CITES II', legal: null,
    reason: '頬の赤みが特徴的なメキシコ〜中米産のドロガメ。温和な性格で45cm水槽から飼育可能。国内CB流通が増加しており入手しやすくなっている。',
    specs: { '最大甲長': '16.6cm（狭義種の資料記録）', '水槽サイズ': '45cm〜', '水温': '24〜29℃', '難易度': '中級' },
    coreSpecs: { size: '16.6cm（狭義種の資料記録）', temp: '24〜29℃', lifespan: "成体から24年間の飼育例", diet: '雑食' },
    sizeNote: 'TTWG 2025 p.133の狭義Kinosternon cruentatum（大西洋側）は最大SCLオス16.6cm・メス14.8cm。以前は同じ種に含まれていた太平洋側のK. mexicanumとは別の種です。以前の販売名だけでは、どちらの種か判断できません。',
    lifespanEvidence: {"note": "IUCNの専門家資料には、1987年にQuintana Rooで成体として捕獲し、2011年まで24年間飼育した個体が登場します。産地は現在の本種の分布と一致するものの、新分類での再同定は確認できていません。24年は迎えてからの期間で、出生からの年齢ではありません。", "url": "https://iucn-tftsg.org/wp-content/uploads/file/Accounts/crm_5_063_scorpioides_v1_2011.pdf", "source": "IUCN TFTSG 種アカウント（2011、当時のcruentatum亜種）"},
    extraSpecs: { tankSize: '45cm〜' },
    links: [{ label: '半水棲ガメ 飼育ガイド', href: '../guide-semi.html' }], asin: null,
    slug: 'red-cheeked-mud-turtle', hasPage: true,
    match: function(s){ return (s.small_tank||0) >= 1 && (s.intermediate||0) >= 1; },
    score: function(s){ return (s.small_tank||0)+(s.maintenance||0)+(s.intermediate||0)+(s.mud_lover||0)+(s.na_water||0)+(s.tropical_climate||0); },
    availability: 'common'
  },
  { name: 'ニシキガメ', latin: 'Chrysemys picta', emoji: '🎨', difficulty: '入門', size: 'M（13〜25cm）', cites: null, legal: null,
    reason: '甲羅の縁に赤・黄のラインが走る美しい種。泳ぎが活発で60〜90cm水槽が適切。草食傾向が強く管理しやすい。',
    specs: { '最大甲長': '25cm（メス）', '水槽サイズ': '60cm〜', '水温': '20〜28℃', '難易度': '入門' },
    coreSpecs: { size: '25cm（メス）', temp: '20〜28℃', lifespan: "ミッドランド亜種に23年11か月の飼育記録", diet: '雑食' },
    lifespanEvidence: {"note": "Slavensには、ミッドランド亜種marginataの野生由来の雄を、成体から23年11か月飼育した記録があります。出生年は不明です。ニシキガメを飼ううえで参考になる一例ですが、全亜種に共通する平均や最長寿命ではありません。", "url": "https://www.pondturtle.com/lturtle.html", "source": "Slavens 飼育記録集"},
    extraSpecs: { tankSize: '60cm〜' },
    links: [{ label: '水棲ガメ 飼育ガイド', href: '../guide-water-full.html' }], asin: null,
    slug: 'painted-turtle', hasPage: true,
    match: function(s){ return (s.medium_tank||0) >= 2 && (s.active||0) >= 2; },
    score: function(s){ return (s.medium_tank||0)+(s.active||0)+(s.beginner||0)+(s.mainstream||0)*2+(s.swimmer||0)+(s.na_water||0)+(s.cool_climate||0); },
    availability: 'common'
  },
  { name: 'セイブニシキガメ', latin: 'Chrysemys picta bellii', emoji: '🌾', difficulty: '入門', size: 'M（18〜25cm）', cites: null, legal: null,
    reason: 'ニシキガメ4亜種で最大になる西の亜種。腹甲いっぱいに広がる暗色の模様が見どころ。飼育はニシキガメと同じだがメスは25cm近くになるため90cm級を計画する。亜種を指定した国内流通は限られる。',
    specs: { '最大甲長': '26.6cm（資料上限）', '水槽サイズ': '90cm〜', '水温': '20〜28℃', '難易度': '入門' },
    coreSpecs: { size: '26.6cm（資料上限）', temp: '20〜28℃', lifespan: "50年を超える可能性（保全計画の推定）", diet: '雑食' },
    sizeNote: 'TTWG 2025 p.159 掲載の最大直線甲長（SCL）：オス20.8cm・メス26.6cm。一般的な成体サイズや将来の成長予測ではない。',
    lifespanEvidence: {"note": "カナダの管理計画では、山間・ロッキー山脈地域の個体群は50年を超えて生きる可能性があるとされています。あくまで推定で、50年以上追跡した個体の記録や平均寿命ではありません。", "url": "https://www.canada.ca/en/environment-climate-change/services/species-risk-public-registry/management-plans/western-painted-turtle-2018.html", "source": "カナダ環境・気候変動省 管理計画（2018）"},
    extraSpecs: { tankSize: '90cm〜' },
    links: [{ label: '水棲ガメ 飼育ガイド', href: '../guide-water-full.html' }], asin: null,
    slug: 'western-painted-turtle', hasPage: true,
    match: function(s){ return (s.medium_tank||0) >= 2 && (s.active||0) >= 2 && (s.na_water||0) >= 2 && ((s.intermediate||0) >= 1 || (s.advanced||0) >= 1); },
    score: function(s){ return (s.medium_tank||0)+(s.active||0)+(s.na_water||0)+(s.swimmer||0)+(s.cool_climate||0)+(s.beauty||0); },
    availability: 'rare'
  },
  { name: 'トウブニシキガメ', latin: 'Chrysemys picta picta', emoji: '🌻', difficulty: '入門', size: 'S〜M（13〜18cm）', cites: null, legal: null,
    reason: 'ニシキガメの基亜種で4亜種のうち最小。背甲の甲板の継ぎ目が左右一列に揃うのはこの亜種だけ。60cm水槽で成体まで通せる見込みが立つ。亜種を指定した国内流通は限られる。',
    specs: { '最大甲長': '18cm', '水槽サイズ': '60cm〜', '水温': '20〜28℃', '難易度': '入門' },
    coreSpecs: { size: '18cm', temp: '20〜28℃', lifespan: "野生で約50歳の雌の報告", diet: '雑食' },
    lifespanEvidence: {"note": "COSEWICの評価資料には、メリーランドで再捕獲された雌を約50歳とする報告があります。出生から年齢を確かめた記録ではなく、この数字だけで平均寿命や上限も分かりません。", "url": "https://www.canada.ca/en/environment-climate-change/services/species-risk-public-registry/cosewic-assessments-status-reports/midland-eastern-painted-turtle-2018.html", "source": "COSEWIC 評価資料（2018、Siess 2005引用）"},
    extraSpecs: { tankSize: '60cm〜' },
    links: [{ label: '水棲ガメ 飼育ガイド', href: '../guide-water-full.html' }], asin: null,
    slug: 'eastern-painted-turtle', hasPage: true,
    match: function(s){ return (s.medium_tank||0) >= 2 && (s.active||0) >= 2 && (s.na_water||0) >= 2 && (s.cool_climate||0) >= 2 && ((s.intermediate||0) >= 1 || (s.advanced||0) >= 1); },
    score: function(s){ return (s.medium_tank||0)+(s.active||0)+(s.na_water||0)+(s.cool_climate||0)+(s.swimmer||0)+(s.small_tank||0); },
    availability: 'rare'
  },
  { name: 'チュウブニシキガメ', latin: 'Chrysemys picta marginata', emoji: '🍁', difficulty: '入門', size: 'S〜M（13〜19cm）', cites: null, legal: null,
    reason: 'ニシキガメ3亜種の中間に分布する亜種。腹甲の暗色模様が中央付近に収まるのが手がかりで、セイブ亜種（腹甲全面）ともトウブ亜種（ほぼ無地）とも違う。飼育はニシキガメと同じ。亜種を指定した国内流通は限られる。',
    specs: { '最大甲長': '19cm', '水槽サイズ': '60〜90cm', '水温': '20〜28℃', '難易度': '入門' },
    coreSpecs: { size: '19cm', temp: '20〜28℃', lifespan: "成体から23年11か月の飼育記録", diet: '雑食' },
    lifespanEvidence: {"note": "Slavensには、野生由来の雄を成体から23年11か月飼育した記録があります。出生年が分からないため、総年齢ではなく迎えてからの期間です。平均や最長寿命を調べた数字ではありません。", "url": "https://www.pondturtle.com/lturtle.html", "source": "Slavens 飼育記録集"},
    extraSpecs: { tankSize: '60〜90cm' },
    links: [{ label: '水棲ガメ 飼育ガイド', href: '../guide-water-full.html' }], asin: null,
    slug: 'midland-painted-turtle', hasPage: true,
    match: function(s){ return (s.medium_tank||0) >= 2 && (s.active||0) >= 2 && (s.na_water||0) >= 2 && ((s.intermediate||0) >= 1 || (s.advanced||0) >= 1); },
    score: function(s){ return (s.medium_tank||0)+(s.active||0)+(s.na_water||0)+(s.swimmer||0)+(s.cool_climate||0)+(s.beginner||0); },
    availability: 'rare'
  },
  { name: 'クサガメ', latin: 'Mauremys reevesii', emoji: '🇯🇵', recommendationPriority: 72, difficulty: '入門', size: 'M（15〜25cm）', cites: 'CITES III', legal: null,
    reason: '昔からペットとして親しまれてきたガメ。丈夫で適応力が高くはじめてでも飼いやすい。外来起源説があるため野外への放流は厳禁。国内CB個体を選ぶこと。',
    specs: { '最大甲長': '25cm', '水槽サイズ': '60cm〜', '水温': '20〜28℃', '難易度': '入門' },
    coreSpecs: { size: '25cm', temp: '20〜28℃', lifespan: "20〜45年（動物園の案内）", diet: '雑食' },
    lifespanEvidence: {"note": "コルケアサーリ動物園は、寿命を20〜45年と案内しています。ただし、平均なのか、野生と飼育下のどちらなのかは書かれていません。45年を上限と決めることもできません。", "url": "https://korkeasaari.fi/en/animal/chinese-pond-turtle/", "source": "コルケアサーリ動物園"},
    extraSpecs: { tankSize: '60cm〜' },
    links: [{ label: '水棲ガメ 飼育ガイド', href: '../guide-water-full.html' }], asin: null,
    slug: 'reeves-turtle', hasPage: true,
    match: function(s){ return (s.medium_tank||0) >= 1 && (s.beginner||0) >= 2; },
    score: function(s){ return (s.medium_tank||0)+(s.beginner||0)+(s.active||0)+(s.mainstream||0)+(s.bottom_dweller||0)+(s.asia_water||0)+(s.cool_climate||0); },
    availability: 'common'
  },
  { name: 'キバラガメ', latin: 'Trachemys scripta scripta', emoji: '💛', difficulty: '入門', size: 'M（17〜27cm）', cites: null, legal: 'conditional_invasive',
    reason: '条件付特定外来生物（Trachemys scripta の全亜種、2023年6月1日指定）。一般家庭での飼育・捕獲・頒布に当たらない少数の相手との無償譲渡・譲受けは手続き不要。販売・購入・頒布・輸入・野外への放出等は原則禁止。逃がさず、最後まで飼えることが前提です。',
    diagnosisNotice: '当サイトでは新しく迎える人向けの診断候補から外しています。飼育自体が一律禁止という意味ではありません。条件付特定外来生物（Trachemys scripta の全亜種、2023年6月1日指定）。一般家庭での飼育・捕獲・頒布に当たらない少数の相手との無償譲渡・譲受けは手続き不要。販売・購入・頒布・輸入・野外への放出等は原則禁止。逃がさず、最後まで飼えることが前提です。',
    legalNote: '条件付特定外来生物（Trachemys scripta の全亜種、2023年6月1日指定）。一般家庭での飼育・捕獲・頒布に当たらない少数の相手との無償譲渡・譲受けは手続き不要。販売・購入・頒布・輸入・野外への放出等は原則禁止。逃がさず、最後まで飼えることが前提です。',
    specs: { '最大甲長': '27cm', '水槽サイズ': '60cm〜', '水温': '22〜28℃', '難易度': '入門' },
    coreSpecs: { size: '27cm', temp: '22〜28℃', lifespan: "24年5か月の飼育記録", diet: '雑食' },
    lifespanEvidence: {"note": "Slavensには、亜種scriptaの雌を24年5か月飼育した記録があります。出生年と迎えたときの年齢は不明です。飼育期間と総年齢は別で、平均や最長寿命もこの記録だけでは分かりません。", "url": "https://www.pondturtle.com/lturtle.html", "source": "Slavens 飼育記録集"},
    extraSpecs: { tankSize: '60cm〜' },
    links: [{ label: '水棲ガメ 飼育ガイド', href: '../guide-water-full.html' }], asin: null,
    slug: 'yellow-bellied-slider', hasPage: true,
    match: function(s){ return (s.medium_tank||0) >= 1 && (s.active||0) >= 2; },
    score: function(s){ return (s.medium_tank||0)+(s.active||0)+(s.beginner||0)+(s.mainstream||0)+(s.swimmer||0)+(s.na_water||0)+(s.warm_climate||0); },
    availability: 'rare'
  },
  { name: 'ミシシッピアカミミガメ', latin: 'Trachemys scripta elegans', emoji: '🔴', difficulty: '入門', size: 'L（20〜30cm）', cites: null, legal: 'conditional_invasive',
    reason: '条件付特定外来生物（Trachemys scripta の全亜種、2023年6月1日指定）。一般家庭での飼育・捕獲・頒布に当たらない少数の相手との無償譲渡・譲受けは手続き不要。販売・購入・頒布・輸入・野外への放出等は原則禁止。逃がさず、最後まで飼えることが前提です。',
    diagnosisNotice: '当サイトでは新しく迎える人向けの診断候補から外しています。飼育自体が一律禁止という意味ではありません。条件付特定外来生物（Trachemys scripta の全亜種、2023年6月1日指定）。一般家庭での飼育・捕獲・頒布に当たらない少数の相手との無償譲渡・譲受けは手続き不要。販売・購入・頒布・輸入・野外への放出等は原則禁止。逃がさず、最後まで飼えることが前提です。',
    legalNote: '条件付特定外来生物（Trachemys scripta の全亜種、2023年6月1日指定）。一般家庭での飼育・捕獲・頒布に当たらない少数の相手との無償譲渡・譲受けは手続き不要。販売・購入・頒布・輸入・野外への放出等は原則禁止。逃がさず、最後まで飼えることが前提です。',
    specs: { '最大甲長': '30cm', '水槽サイズ': '90cm〜', '水温': '22〜28℃', '難易度': '入門' },
    coreSpecs: { size: '30cm', temp: '22〜28℃', lifespan: "飼育下で40年に達する（専門機関の案内）", diet: '雑食' },
    lifespanEvidence: {"note": "Pennsylvania Sea Grantは、飼育下で40年に達すると案内しています。平均寿命や全個体に共通する上限ではありませんが、数十年先まで世話を続ける準備が必要です。", "url": "https://seagrant.psu.edu/resources/resource-item/red-eared-slider-ais-fact-sheet/", "source": "Pennsylvania Sea Grant（2025）"},
    extraSpecs: { tankSize: '90cm〜' },
    links: [{ label: '水棲ガメ 飼育ガイド', href: '../guide-water-full.html' }], asin: null,
    slug: 'red-eared-slider', hasPage: true,
    match: function(s){ return (s.large_tank||0) >= 1 && (s.beginner||0) >= 2 && (s.active||0) >= 2; },
    score: function(s){ return (s.large_tank||0)+(s.active||0)+(s.beginner||0)+(s.swimmer||0)+(s.na_water||0)+(s.warm_climate||0); },
    availability: 'common'
  },
  { name: 'ミシシッピチズガメ', latin: 'Graptemys pseudogeographica kohnii', emoji: '🗺️', difficulty: '中級', size: 'M（オス10cm/メス20cm）', cites: 'CITES III', legal: null,
    reason: 'チズガメ類で最も流通が多い入門種。独特の甲羅のキールと首の模様が美しい。水質に敏感なのでフィルターは必須。',
    specs: { '最大甲長': '20cm（メス）', '水槽サイズ': '60cm〜', '水温': '22〜28℃', '難易度': '中級' },
    coreSpecs: { size: '20cm（メス）', temp: '22〜28℃', lifespan: "幼体で捕獲後35年5か月の飼育記録", diet: '雑食' },
    lifespanEvidence: {"note": "Snider・Bowlerの記録集には、旧学名Graptemys kohniiとして、野生由来の幼体雄を35年5か月飼育した例が載っています。迎えてからの期間で、出生からの年齢や平均寿命、上限ではありません。", "url": "https://webapps.fhsu.edu/ksherp/bibFiles/21870.pdf", "source": "Snider・Bowler 飼育下長寿記録集（1992、p13）"},
    extraSpecs: { tankSize: '60cm〜' },
    links: [{ label: '水棲ガメ 飼育ガイド', href: '../guide-water-full.html' }], asin: null,
    slug: 'mississippi-map-turtle', hasPage: true,
    match: function(s){ return (s.medium_tank||0) >= 2 && (s.maintenance||0) >= 2; },
    score: function(s){ return (s.medium_tank||0)+(s.maintenance||0)+(s.observational||0)+(s.beauty||0)+(s.bottom_dweller||0)+(s.na_water||0)+(s.warm_climate||0); },
    availability: 'common'
  },
  { name: 'ニセチズガメ', latin: 'Graptemys pseudogeographica pseudogeographica', emoji: '🗺️', difficulty: '中級', size: 'M（オス12cm/メス22cm）', cites: 'CITES III', legal: null,
    reason: 'ミシシッピチズガメの基亜種。背中のキールがより目立ち観察の楽しさがある。チズガメを一通り揃えたい中級者向け。',
    specs: { '最大甲長': '22cm（メス）', '水槽サイズ': '60cm〜', '水温': '22〜28℃', '難易度': '中級' },
    coreSpecs: { size: '22cm（メス）', temp: '22〜28℃', lifespan: "基亜種固有の長期記録を確認できず", diet: '雑食' },
    lifespanEvidence: {"note": "原記録集の32年6か月という飼育例は、Graptemys pseudogeographicaの亜種が不明です。35年5か月という別の例もミシシッピチズガメのものです。このページの基亜種pseudogeographicaに絞った長期記録とは区別が必要です。", "url": "https://webapps.fhsu.edu/ksherp/bibFiles/21870.pdf", "source": "Snider・Bowler 飼育下長寿記録集（1992、p13）"},
    extraSpecs: { tankSize: '60cm〜' },
    links: [{ label: '水棲ガメ 飼育ガイド', href: '../guide-water-full.html' }], asin: null,
    slug: 'false-map-turtle', hasPage: true,
    match: function(s){ return (s.medium_tank||0) >= 2 && (s.maintenance||0) >= 1 && (s.intermediate||0) >= 1; },
    score: function(s){ return (s.medium_tank||0)+(s.maintenance||0)+(s.observational||0)+(s.beauty||0)+(s.bottom_dweller||0)+(s.na_water||0)+(s.warm_climate||0); },
    availability: 'common'
  },
  { name: 'ニホンイシガメ', latin: 'Mauremys japonica', emoji: '🌸', recommendationPriority: 70, difficulty: '中級', size: 'M（13〜20cm）', cites: 'CITES II', legal: null,
    reason: '日本固有種で国内CBの流通も確立。温帯産で夏の高温管理が重要。クサガメより清水を好む傾向がある。',
    specs: { '最大甲長': '20.2cm（メス）', '水槽サイズ': '60cm〜（成体90cm）', '水温': '18〜27℃', '難易度': '中級' },
    coreSpecs: { size: '20.2cm（メス）', temp: '18〜27℃', lifespan: '雄約10〜15年・雌約20〜30年（動物園の案内）', diet: '雑食' },
    sizeNote: '資料に記録された上限（メス。オスは14.5cm）。一般的な成体はオス10〜15cm・メス17〜21cm。',
    lifespanEvidence: { note: '福岡市動物園は、雄が約10〜15年、雌が約20〜30年と案内しています。統計上の平均か上限かは示されていません。個体による違いがあるため、どのカメもこの年数を生きると決められるものではありません。', url: 'https://zoo.city.fukuoka.lg.jp/animals/detail/117', source: '福岡市動物園' },
    extraSpecs: { tankSize: '60cm〜（成体90cm）' },
    links: [{ label: '日本産カメ 飼育ガイド', href: '../guide-japan.html' }], asin: null,
    slug: 'japanese-pond-turtle', hasPage: true,
    match: function(s){ return (s.medium_tank||0) >= 1 && (s.intermediate||0) >= 1; },
    score: function(s){ return (s.medium_tank||0)+(s.maintenance||0)+(s.observational||0)+(s.intermediate||0)+(s.japan_native||0)+(s.bottom_dweller||0)+(s.asia_water||0)+(s.cool_climate||0); },
    availability: 'common'
  },
  { name: 'ヤエヤマイシガメ', latin: 'Mauremys mutica kami', emoji: '🌺', difficulty: '中級', size: 'M（15〜20cm）', cites: 'CITES II', legal: null,
    reason: '台湾・中国南部および八重山諸島に分布するイシガメの亜種。宮古島では国内外来種として問題視されており飼育個体の野外放流は厳禁。国内CB入手推奨。',
    specs: { '最大甲長': '20cm', '水槽サイズ': '60cm〜', '水温': '20〜28℃', '難易度': '中級' },
    coreSpecs: { size: '20cm', temp: '20〜28℃', lifespan: "野外で50歳超の個体がいるとの解説", diet: '雑食' },
    lifespanEvidence: {"note": "日本自然保護協会は、野外の生態研究で50歳を超える個体が知られていると紹介しています。ただし、個体の情報・年齢の推定方法・元研究の引用は載っていません。出生から50年追跡した記録や平均50年ということではなく、専門家による野外研究の紹介です。", "url": "https://www.nacsj.or.jp/wp/wp-content/uploads/2013/05/No534_kyokarahajimeru.pdf", "source": "矢部隆「カメの暮らしをのぞいてみよう」自然保護534号（2013、p33）"},
    extraSpecs: { tankSize: '60cm〜' },
    links: [{ label: '日本産カメ 飼育ガイド', href: '../guide-japan.html' }], asin: null,
    slug: 'yaeyama-pond-turtle', hasPage: true,
    match: function(s){ return (s.medium_tank||0) >= 1 && (s.intermediate||0) >= 2; },
    score: function(s){ return (s.medium_tank||0)+(s.maintenance||0)+(s.intermediate||0)+(s.observational||0)+(s.japan_native||0)+(s.bottom_dweller||0)+(s.asia_water||0)+(s.warm_climate||0); },
    availability: 'common'
  },
  { name: 'ミナミイシガメ', latin: 'Mauremys mutica', emoji: '🍃', difficulty: '中級', size: 'M（15〜20cm）', cites: 'CITES II', legal: null,
    reason: '台湾・中国南部産のイシガメ属。国内CB流通あり。ニホンイシガメよりやや高温を好む傾向。コンパクトで管理しやすい。',
    specs: { '最大甲長': '20cm', '水槽サイズ': '60cm〜', '水温': '22〜29℃', '難易度': '中級' },
    coreSpecs: { size: '20cm', temp: '22〜29℃', lifespan: "成体から22年1か月の飼育記録", diet: '雑食' },
    lifespanEvidence: {"note": "原記録集には、野生由来の成体雌を22年1か月飼育した例があります。出生年と亜種は書かれていません。種全体の長期飼育例としては参考になりますが、特定亜種の平均や最長寿命を示すものではありません。", "url": "https://webapps.fhsu.edu/ksherp/bibFiles/21870.pdf", "source": "Snider・Bowler 飼育下長寿記録集（1992、p13）"},
    extraSpecs: { tankSize: '60cm〜' },
    links: [{ label: '日本産カメ 飼育ガイド', href: '../guide-japan.html' }], asin: null,
    slug: 'yellow-pond-turtle', hasPage: true,
    match: function(s){ return (s.medium_tank||0) >= 1 && (s.intermediate||0) >= 1 && (s.maintenance||0) >= 1; },
    score: function(s){ return (s.medium_tank||0)+(s.maintenance||0)+(s.intermediate||0)+(s.japan_native||0)+(s.bottom_dweller||0)+(s.asia_water||0)+(s.warm_climate||0); },
    availability: 'common'
  },
  { name: 'ニシキマゲクビガメ（ピンクベリー）', latin: 'Emydura subglobosa', emoji: '🌸', difficulty: '中〜上級', size: 'M（18〜25cm）', cites: null, legal: null,
    reason: '腹甲がピンク色の美しい曲頸類。横に首を曲げて引っ込める独特の動作が魅力。曲頸類入門として人気が高い。',
    specs: { '最大甲長': '25cm', '水槽サイズ': '60cm〜', '水温': '24〜29℃', '難易度': '中〜上級' },
    coreSpecs: { size: '25cm', temp: '24〜29℃', lifespan: "15〜20年（動物園の案内）", diet: '雑食' },
    lifespanEvidence: {"note": "Parken Zooの案内では15〜20年です。野生か飼育下か、平均か最長かは書かれておらず、個体を追跡した記録としては扱えません。", "url": "https://parkenzoo.se/en/djur/rodbukad-vandhalsskoldpadda/", "source": "Parken Zoo"},
    extraSpecs: { tankSize: '60cm〜' },
    links: [{ label: '水棲ガメ 飼育ガイド', href: '../guide-water-full.html' }], asin: null,
    slug: 'pink-bellied-side-necked-turtle', hasPage: true,
    match: function(s){ return (s.medium_tank||0) >= 2 && (s.observational||0) >= 2; },
    score: function(s){ return (s.medium_tank||0)+(s.observational||0)+(s.intermediate||0)+(s.bottom_dweller||0)+(s.sa_water||0)+(s.tropical_climate||0); },
    availability: 'common'
  },
  { name: 'ペニンシュラクーター', latin: 'Pseudemys peninsularis', emoji: '🏊', difficulty: '中級', size: 'L（25〜40cm）', cites: null, legal: null,
    reason: 'フロリダ半島産の大型スライダー系。活発な泳ぎと草食傾向で90cm以上の水槽が必要。大きくなる種を飼いたい中級者向け。',
    specs: { '最大甲長': '40cm（メス）', '水槽サイズ': '90cm〜', '水温': '22〜28℃', '難易度': '中級' },
    coreSpecs: { size: '40cm（メス）', temp: '22〜28℃', lifespan: "成体から11年4か月の飼育記録", diet: '雑食' },
    lifespanEvidence: {"note": "旧名Pseudemys floridana peninsularisで、成体から11年4か月飼育された記録があります。野生由来で、性別と出生年は不明です。飼育を始める前にも生きていた期間があるため、11年4か月を寿命と読むことはできません。平均や上限も不明です。", "url": "https://webapps.fhsu.edu/ksherp/bibFiles/21870.pdf", "source": "Snider・Bowler 飼育下長寿記録集（1992、p14）"},
    extraSpecs: { tankSize: '90cm〜' },
    links: [{ label: '水棲ガメ 飼育ガイド', href: '../guide-water-full.html' }], asin: null,
    slug: 'peninsula-cooter', hasPage: true,
    match: function(s){ return (s.large_tank||0) >= 2 && (s.active||0) >= 2; },
    score: function(s){ return (s.large_tank||0)+(s.active||0)+(s.intermediate||0)+(s.swimmer||0)+(s.na_water||0)+(s.warm_climate||0)+Math.floor((s.advanced||0)*0.5); },
    availability: 'common'
  },
  { name: 'スワニークーター', latin: 'Pseudemys concinna suwanniensis', emoji: '🌾', difficulty: '中級', size: 'L（30〜43cm）', cites: null, legal: null,
    reason: 'フロリダ半島北部のスワニー川水系を中心に分布するリバークーターの亜種。クーター類でもとくに大型で、メスは40cmに届くこともある。背甲は暗色化しやすい。成体には120cm級の水槽か屋外池が必要。',
    specs: { '最大甲長': '43cm（メス）', '水槽サイズ': '120cm〜', '水温': '22〜28℃', '難易度': '中級' },
    coreSpecs: { size: '43cm（メス）', temp: '22〜28℃', lifespan: "幼体から40年8か月の飼育記録", diet: '雑食（植物多め）' },
    lifespanEvidence: {"note": "原記録集には、Pseudemys suwanniensisの雄を幼体から40年8か月飼育した例があります。野生由来で出生年は不明です。長く飼育された一例であり、平均寿命や最長記録を確定する数字ではありません。", "url": "https://webapps.fhsu.edu/ksherp/bibFiles/21870.pdf", "source": "Snider・Bowler 飼育下長寿記録集（1992、p14）"},
    extraSpecs: { tankSize: '120cm〜' },
    links: [{ label: '水棲ガメ 飼育ガイド', href: '../guide-water-full.html' }], asin: null,
    slug: 'suwannee-cooter', hasPage: true,
    match: function(s){ return (s.large_tank||0) >= 2 && (s.active||0) >= 2; },
    score: function(s){ return (s.large_tank||0)+(s.active||0)+(s.intermediate||0)+(s.swimmer||0)+(s.na_water||0)+(s.warm_climate||0); },
    availability: 'rare'
  },
  { name: 'ブランディングガメ', latin: 'Emydoidea blandingii', emoji: '😊', difficulty: '上級', size: 'M（17〜27cm）', cites: 'CITES II', legal: null,
    reason: '黄色い喉元と半開きの口がにっこり笑っているように見える独特の風貌。温帯種で夏の高温に弱く保冷が必要。国内CB確認済み。',
    specs: { '最大甲長': '27cm', '水槽サイズ': '60cm〜', '水温': '15〜24℃', '難易度': '上級' },
    coreSpecs: { size: '27cm', temp: '15〜24℃', lifespan: "野生で推定83歳以上の雌の報告", diet: '雑食' },
    lifespanEvidence: {"note": "ミシガン大学は、1954年に成熟個体として標識し、2016年に再捕獲した雌を83歳以上と推定しています。出生年が分かる個体ではなく、平均寿命や現在の世界記録を示す数字でもありません。", "url": "https://lsa.umich.edu/eeb/news-events/all-news/archived-news/2016/05/on-u-m-gateway--oldest-well-documented-blanding-s-turtle-recaptu.html", "source": "ミシガン大学（2016）"},
    extraSpecs: { tankSize: '60cm〜' },
    links: [{ label: '半水棲ガメ 飼育ガイド', href: '../guide-semi.html' }], asin: null,
    slug: 'blandings-turtle', hasPage: true,
    match: function(s){ return (s.medium_tank||0) >= 1 && (s.advanced||0) >= 2; },
    score: function(s){ return (s.medium_tank||0)+(s.advanced||0)+(s.observational||0)+(s.na_water||0)+(s.cool_climate||0); },
    availability: 'rare'
  },
  { name: 'マタマタ', latin: 'Chelus fimbriata', emoji: '🍂', recommendationPriority: 30, difficulty: '上級', size: 'L（35〜45cm）', cites: 'CITES II', legal: 'cites_ii',
    reason: '枯れ葉のような外見で待ち伏せして魚を丸ごと吸い込む神秘的な種。水流を嫌い独特の飼育法を習得する必要がある本格派種。',
    specs: { '最大甲長': '45cm', '水槽サイズ': '90cm〜', '水温': '26〜30℃', '難易度': '上級' },
    coreSpecs: { size: '45cm', temp: '26〜30℃', lifespan: "旧分類の記録で成体から35年9か月の飼育例", diet: '肉食（待ち伏せ捕食）' },
    lifespanEvidence: {"note": "Slavensの記録集には、1961年に成体で迎えた雌を35年9か月飼育し、報告時も生きていた例があります。2020年にオリノコマタマタが別種になる前の記録で、現在のどちらの種かは不明です。出生からの年齢や、本種固有の上限を示す数字ではありません。", "url": "https://www.pondturtle.com/lturtle.html", "source": "Slavens 飼育記録集（再分類前）"},
    extraSpecs: { tankSize: '90cm〜' },
    links: [{ label: '水棲ガメ 飼育ガイド', href: '../guide-water-full.html' }], asin: null,
    slug: 'matamata', hasPage: true,
    match: function(s){ return ((s.large_tank||0) >= 2 && (s.ambush||0) >= 2) || ((s.large_tank||0) >= 2 && (s.advanced||0) >= 2); },
    score: function(s){ return (s.ambush||0)+(s.advanced||0)*1.5+(s.large_tank||0)+(s.sa_water||0)+(s.tropical_climate||0)+Math.floor((s.budget_high||0)*0.5); },
    availability: 'common'
  },
  { name: 'サラドロガメ', latin: 'Kinosternon integrum', emoji: '🟤', difficulty: '中級', size: 'M（15〜20cm）', cites: 'CITES II', legal: null,
    reason: 'メキシコ固有のドロガメ。甲長20cm程度と国内流通するドロガメ属では大型。温和な性格で60cm水槽から飼育できる。国内CB流通が増加中。',
    specs: { '最大甲長': '20cm', '水槽サイズ': '60cm〜', '水温': '24〜29℃', '難易度': '中級' },
    coreSpecs: { size: '20cm', temp: '24〜29℃', lifespan: "飼育下で33.8年の文献記録", diet: '雑食' },
    lifespanEvidence: {"note": "2026年のIUCN専門家資料は、飼育下で33.8年という文献記録を紹介しています。入手時の年齢など、引用元の詳細までは確かめられていません。同じ資料に出てくる50〜60年は計算上の推定で、その年齢まで追跡した記録とは別です。", "url": "https://iucn-tftsg.org/wp-content/uploads/file/Accounts2/crm.5.143.integrum.v1.2026.pdf", "source": "IUCN TFTSG 種アカウント（2026、Dathe 1998引用）"},
    extraSpecs: { tankSize: '60cm〜' },
    links: [{ label: '半水棲ガメ 飼育ガイド', href: '../guide-semi.html' }], asin: null,
    slug: 'mexican-mud-turtle', hasPage: true,
    match: function(s){ return (s.medium_tank||0) >= 1 && (s.intermediate||0) >= 1; },
    score: function(s){ return (s.medium_tank||0)+(s.intermediate||0)+(s.maintenance||0)+(s.rare_water||0)+(s.mud_lover||0)+(s.na_water||0)+(s.tropical_climate||0); },
    availability: 'common'
  },
  { name: 'ヨーロッパヌマガメ', latin: 'Emys orbicularis', emoji: '🌿', difficulty: '中級', size: 'M（15〜20cm）', cites: 'CITES III（ウクライナ個体群のみ）', legal: null,
    reason: 'ユーラシア大陸唯一のヌマガメ科。国内CB・EUCB流通あり。低温に強く日本の温帯気候にも馴染みやすい。甲羅と頭部の黄色い斑点が美しい。',
    legalNote: 'CITES附属書IIIはウクライナ個体群のみが対象です。本種の全個体群ではありません。個体の由来と必要な輸出入書類を確認してください。',
    specs: { '最大甲長': '20cm', '水槽サイズ': '60cm〜', '水温': '16〜26℃', '難易度': '中級' },
    coreSpecs: { size: '20cm', temp: '16〜26℃', lifespan: "50年に達することも（動物園の案内）", diet: '雑食' },
    lifespanEvidence: {"note": "パリ動物園は、基亜種Emys orbicularis orbicularisが50年に達することもあると案内しています。野生と飼育下の区別や平均の求め方は載っていません。他の亜種も含めて50年が上限という意味ではありません。", "url": "https://www.parczoologiquedeparis.fr/fr/cistude-d-europe", "source": "パリ動物園"},
    extraSpecs: { tankSize: '60cm〜' },
    links: [{ label: '水棲ガメ 飼育ガイド', href: '../guide-water-full.html' }], asin: null,
    slug: 'european-pond-turtle', hasPage: true,
    match: function(s){ return (s.medium_tank||0) >= 1 && (s.intermediate||0) >= 1; },
    score: function(s){ return (s.medium_tank||0)+(s.intermediate||0)+(s.observational||0)+(s.eu_water||0)+(s.cool_climate||0); },
    availability: 'common'
  },
  { name: 'カントンクサガメ', latin: 'Mauremys nigricans', emoji: '🟡', difficulty: '入門〜中級', size: 'M（15〜25cm）', cites: 'CITES II', legal: null,
    reason: '中国南部固有の独立種で、クサガメとは別種。成体で頸部が赤みを帯びるのが最大の特徴。ぶりくら等で国内CB流通確認済み。野外への放流は厳禁。',
    specs: { '最大甲長': '25cm', '水槽サイズ': '60cm〜', '水温': '20〜28℃', '難易度': '入門〜中級' },
    coreSpecs: { size: '25cm', temp: '20〜28℃', lifespan: "36年の飼育記録が文献で紹介される", diet: '雑食' },
    lifespanEvidence: {"note": "36年間飼育され、報告時も生きていた雌が紹介されています。IUCNの専門家資料が引用するIpserの報告で、元の全文は未確認です。迎えたときの年齢は推定のため、何歳まで生きたかは分かりません。36年は飼育期間で、平均寿命ではありません。", "url": "https://iucn-tftsg.org/wp-content/uploads/file/Accounts/crm_5_068_nigricans_v1_2012.pdf", "source": "IUCN TFTSG 種アカウント（2012、Ipser2011引用）"},
    extraSpecs: { tankSize: '60cm〜' },
    links: [{ label: '水棲ガメ 飼育ガイド', href: '../guide-water-full.html' }], asin: null,
    slug: 'canton-reeves-turtle', hasPage: true,
    match: function(s){ return (s.medium_tank||0) >= 1 && (s.beginner||0) >= 1; },
    score: function(s){ return (s.medium_tank||0)+(s.beginner||0)+(s.active||0)+(s.mainstream||0)+(s.japan_native||0)+(s.bottom_dweller||0)+(s.asia_water||0)+(s.warm_climate||0); },
    availability: 'common'
  },
  { name: 'キイロドロガメ', latin: 'Kinosternon flavescens', emoji: '💛', difficulty: '中級', size: 'M（10〜14cm）', cites: 'CITES II', legal: null,
    reason: '腹甲が黄みがかる個性的なドロガメ。テキサス〜イリノイ産。小型で管理しやすく、ドロガメ系コレクションの1種として人気。流通確認済み。',
    specs: { '最大甲長': '14cm', '水槽サイズ': '30cm〜', '水温': '20〜27℃', '難易度': '中級' },
    coreSpecs: { size: '14cm', temp: '20〜27℃', lifespan: "野外調査で推定58歳の個体を含む報告", diet: '雑食' },
    lifespanEvidence: {"note": "ネブラスカの野生個体群の研究では、2018年に調べた成体200匹の年齢は7〜58歳でした。初回捕獲時の成長輪から年齢を推定し、その後の経過年数を加えたものです。58歳は平均寿命でも、種の上限でもありません。", "url": "https://link.springer.com/article/10.1186/s12979-023-00335-x", "source": "Bronikowskiら（2023、標識再捕獲研究）"},
    extraSpecs: { tankSize: '30cm〜' },
    links: [{ label: '半水棲ガメ 飼育ガイド', href: '../guide-semi.html' }], asin: null,
    slug: 'yellow-mud-turtle', hasPage: true,
    match: function(s){ return (s.small_tank||0) >= 2 && (s.intermediate||0) >= 1; },
    score: function(s){ return (s.small_tank||0)+(s.intermediate||0)+(s.observational||0)+(s.rare_water||0)+(s.mud_lover||0)+(s.na_water||0)+(s.warm_climate||0); },
    availability: 'common'
  },
  { name: 'ハーレラドロガメ', latin: 'Kinosternon herrerai', emoji: '🔸', difficulty: '上級', size: 'M（14〜16cm）', cites: 'CITES II', legal: null,
    reason: 'メキシコ・ベラクルス州に限定分布する希少なドロガメ。ザラアシドロガメとは別種。専門店からのCB入荷が確認されており、希少ドロガメを集めるマニア向き。',
    specs: { '最大甲長': '16cm', '水槽サイズ': '45cm〜', '水温': '24〜29℃', '難易度': '上級' },
    coreSpecs: { size: '16cm', temp: '24〜29℃', lifespan: "成体から19年6か月の飼育記録", diet: '雑食' },
    lifespanEvidence: {"note": "Snider・Bowlerの記録集には、野生由来の成体雄を19年6か月飼育した例があります。迎える前にも生きていた期間があるため、死亡時の総年齢は分かりません。平均寿命ではなく、この個体の飼育記録です。", "url": "https://webapps.fhsu.edu/ksherp/bibFiles/21870.pdf", "source": "Snider・Bowler 飼育下長寿記録集（1992、p15）"},
    extraSpecs: { tankSize: '45cm〜' },
    links: [{ label: '半水棲ガメ 飼育ガイド', href: '../guide-semi.html' }], asin: null,
    slug: 'herrera-mud-turtle', hasPage: true,
    match: function(s){ return (s.small_tank||0) >= 1 && (s.advanced||0) >= 2; },
    score: function(s){ return (s.small_tank||0)+(s.advanced||0)+(s.observational||0)+(s.rare_water||0)+(s.mud_lover||0)+(s.na_water||0)+(s.tropical_climate||0); },
    availability: 'common'
  },
  { name: 'シロクチドロガメ', latin: 'Kinosternon leucostomum', emoji: '⬜', difficulty: '上級', size: 'M（記録上限21.4cm）', cites: 'CITES II', legal: null,
    reason: '白い口周りが特徴の中米産ドロガメ。ぶりくらでCB出品確認済み。ドロガメ属の中でも比較的大型で存在感がある。上級者の希少種コレクション向き。',
    specs: { '最大甲長': '21.4cm（資料上限）', '水槽サイズ': '60cm〜', '水温': '24〜30℃', '難易度': '上級' },
    coreSpecs: { size: '21.4cm（資料上限）', temp: '24〜30℃', lifespan: '成体から19年以上の飼育記録', diet: '雑食' },
    sizeNote: 'TTWG 2025 p.144 掲載の最大直線甲長（SCL）：種全体・基亜種のオス21.4cm・メス20.8cm。一般的な成体サイズや将来の成長予測ではない。旧17.5cm超は別資料の下限を伴う記録で上限ではない。postinguinaleの最大値（オス17.4cm・メス15.8cm）とは区別。一般的な成体サイズはこの最大記録から推定しない。',
    lifespanEvidence: { note: 'Slavensの記録集には、成体で迎えてから19年2か月飼育した例があります。迎える前にも生きていた期間があるため、この年数は出生からの年齢や平均寿命とは別です。', url: 'https://www.pondturtle.com/lturtle.html', source: 'Slavens 飼育記録集（Snider 1992引用）' },
    extraSpecs: { tankSize: '60cm〜' },
    links: [{ label: '半水棲ガメ 飼育ガイド', href: '../guide-semi.html' }], asin: null,
    slug: 'white-lipped-mud-turtle', hasPage: true,
    match: function(s){ return (s.small_tank||0) >= 1 && (s.advanced||0) >= 2 && (s.maintenance||0) >= 1; },
    score: function(s){ return (s.small_tank||0)+(s.advanced||0)+(s.observational||0)+(s.rare_water||0)+(s.mud_lover||0)+(s.na_water||0)+(s.tropical_climate||0); },
    availability: 'common'
  },
  { name: 'クロコブチズガメ', latin: 'Graptemys nigrinoda', emoji: '⚫', difficulty: '中〜上級', size: 'M（オス10cm/メス18cm）', cites: 'CITES III', legal: null,
    reason: '背中キールの黒いコブが印象的なチズガメ。ぶりくらCB出品確認済み。チズガメ属の中でも個性的な外見で、コレクション性が高い中上級種。',
    specs: { '最大甲長': '18cm（メス）', '水槽サイズ': '60cm〜', '水温': '22〜28℃', '難易度': '中〜上級' },
    coreSpecs: { size: '18cm（メス）', temp: '22〜28℃', lifespan: "20年3か月の飼育記録", diet: '雑食' },
    lifespanEvidence: {"note": "Slavensの記録集には、1977年に迎えた雄を20年3か月飼育し、報告時も生存していた例があります。入手時の成長段階は資料によって異なり、亜種も不明です。出生からの年齢は分かりませんが、長期飼育の一例として読めます。", "url": "https://www.pondturtle.com/lturtle.html", "source": "Slavens 飼育記録集"},
    extraSpecs: { tankSize: '60cm〜' },
    links: [{ label: '水棲ガメ 飼育ガイド', href: '../guide-water-full.html' }], asin: null,
    slug: 'black-knobbed-map-turtle', hasPage: true,
    match: function(s){ return ((s.medium_tank||0) >= 2 && (s.maintenance||0) >= 2 && (s.advanced||0) >= 1) || ((s.large_tank||0) >= 2 && (s.advanced||0) >= 2 && (s.maintenance||0) >= 1); },
    score: function(s){ return (s.medium_tank||0)+(s.large_tank||0)*0.8+(s.maintenance||0)+(s.advanced||0)*1.2+(s.observational||0)+(s.beauty||0)+(s.bottom_dweller||0)+(s.na_water||0)+(s.warm_climate||0); },
    availability: 'common'
  },
  { name: 'ワモンチズガメ', latin: 'Graptemys oculifera', emoji: '🔵', difficulty: '上級', size: 'M（オス9cm/メス18cm）', cites: 'CITES III', legal: null,
    reason: '目の後方に輪状の美麗模様が入るチズガメ屈指の美種。ぶりくら2025出品リスト記載。水質への敏感さと飼育難度から上級者向きだが所有する価値は高い。',
    specs: { '最大甲長': '18cm（メス）', '水槽サイズ': '60cm〜', '水温': '22〜28℃', '難易度': '上級' },
    coreSpecs: { size: '18cm（メス）', temp: '22〜28℃', lifespan: "野生雌で少なくとも31〜37歳との推定", diet: '雑食' },
    lifespanEvidence: {"note": "IUCNの専門家資料には、1988年に成体で標識し、2009年まで再捕獲した記録があります。初回捕獲時にすでに成熟していたことを踏まえ、雌は少なくとも31〜37歳と推定されています。出生年の分かる個体の年齢や平均寿命ではありません。", "url": "https://iucn-tftsg.org/wp-content/uploads/file/Accounts/crm_5_033_oculifera_v1_2009.pdf", "source": "IUCN TFTSG 種アカウント（2009）"},
    extraSpecs: { tankSize: '60cm〜' },
    links: [{ label: '水棲ガメ 飼育ガイド', href: '../guide-water-full.html' }], asin: null,
    slug: 'ringed-map-turtle', hasPage: true,
    match: function(s){ return (s.medium_tank||0) >= 2 && (s.maintenance||0) >= 3 && (s.advanced||0) >= 3; },
    score: function(s){ return (s.medium_tank||0)+(s.maintenance||0)+(s.advanced||0)+(s.observational||0)+(s.beauty||0)+(s.bottom_dweller||0)+(s.na_water||0)+(s.warm_climate||0); },
    availability: 'rare'
  },
  { name: 'フトマユチズガメ', latin: 'Graptemys ouachitensis', emoji: '🗺️', difficulty: '中級', size: 'M（オス10cm/メス22cm）', cites: 'CITES III', legal: null,
    reason: 'ミシシッピチズガメと並ぶ人気チズガメ。甲羅のキールがより鋭く、ミシシッピ川流域に生息。流水好みで水質管理が重要。オス・メスの体格差が大きいため飼育スペースの計画が必要。',
    specs: { '最大甲長': 'オス10cm/メス22cm', '水槽サイズ': '60〜90cm', '水温': '20〜26℃', '難易度': '中級' },
    coreSpecs: { size: 'オス10cm/メス22cm', temp: '20〜26℃', lifespan: "旧分類ouachitensisで8年5か月の飼育記録", diet: '雑食（水生無脊椎動物中心）' },
    lifespanEvidence: {"note": "原記録集には、旧学名Graptemys pseudogeographica ouachitensisの雄を8年5か月飼育した例があります。入手時の年齢は資料によって食い違い、現在の亜種も特定されていません。確かめられるのは飼育期間であり、8年5か月が寿命の限界という意味ではありません。", "url": "https://webapps.fhsu.edu/ksherp/bibFiles/21870.pdf", "source": "Snider・Bowler 飼育下長寿記録集（1992、p13）"},
    extraSpecs: { tankSize: '60〜90cm' },
    links: [{ label: '水棲ガメ 飼育ガイド', href: '../guide-water-full.html' }], asin: null,
    slug: 'ouachita-map-turtle-sp', hasPage: true,
    match: function(s){ return (s.medium_tank||0) >= 2 && (s.maintenance||0) >= 2; },
    score: function(s){ return (s.medium_tank||0)+(s.maintenance||0)+(s.beauty||0)+(s.observational||0)+(s.na_water||0)+(s.cool_climate||0); },
    availability: 'common'
  },
  { name: 'サルヴィンオオニオイガメ', latin: 'Staurotypus salvinii', emoji: '🦕', difficulty: '上級', size: 'L（記録上限20.6cm）', cites: 'CITES II', legal: null,
    reason: '太平洋岸（メキシコ〜エルサルバドル）産の大型ドロガメ科。スジオオニオイガメ（大西洋岸・最大38cm）より小型で記録最大20.6cm。3本のキールを持ち噛みつき力が非常に強く素手での取り扱い厳禁。流通名メキシカンジャイアントマスクタートル。',
    specs: { '最大甲長': '20.6cm（資料上限）', '水槽サイズ': '90cm〜', '水温': '25〜30℃', '難易度': '上級' },
    coreSpecs: { size: '20.6cm（資料上限）', temp: '25〜30℃', lifespan: "成体から26年4か月の飼育記録", diet: '雑食（肉食寄り）' },
    sizeNote: 'TTWG 2025 p.156 掲載の最大直線甲長（SCL）：オス18.6cm・メス20.6cm。一般的な成体サイズや将来の成長予測ではない。同資料は古い25cmという数値の根拠記録がないと注記。S. triporcatusとは区別。',
    lifespanEvidence: {"note": "Slavensには、野生由来の雌R71-22を成体から26年4か月飼育し、その時点でも生きていた記録があります。出生年は不明です。長く飼育された一例で、平均寿命や上限ではありません。", "url": "https://www.pondturtle.com/lturtle.html", "source": "Slavens 飼育記録集"},
    extraSpecs: { tankSize: '90cm〜' },
    links: [{ label: '半水棲ガメ 飼育ガイド', href: '../guide-semi.html' }], asin: null,
    slug: 'giant-musk-turtle-mx', hasPage: true,
    match: function(s){ return (s.large_mud||0) >= 2 && (s.advanced||0) >= 2; },
    score: function(s){ return (s.large_mud||0)+(s.advanced||0)+(s.budget_high||0)+(s.expert||0)+(s.ultra_rare||0); },
    availability: 'rare'
  },
  { name: 'ハナガメ', latin: 'Mauremys sinensis', emoji: '🌸', difficulty: '入門〜中級', size: 'M（20〜25cm）', cites: 'CITES III', legal: 'unknown_hold',
    reason: '【特定外来生物】2016年に指定され、許可なく飼育・販売・購入・輸入はできない（ニホンイシガメ等との交雑種も指定対象）。首のストライプが美しい東・東南アジア産の中型水棲ガメだが、現在は新規飼育が原則不可のため診断では案内しない。',
    specs: { '最大甲長': '30cm（資料上限）', '水槽サイズ': '60〜90cm', '水温': '20〜28℃', '難易度': '入門〜中級' },
    coreSpecs: { size: '30cm（資料上限）', temp: '20〜28℃', lifespan: "幼体から22年9か月の飼育記録", diet: '雑食' },
    sizeNote: 'TTWG 2025 p.278 掲載の最大直線甲長（SCL）：オス20.0cm・メス30.0cm。一般的な成体サイズや将来の成長予測ではない。',
    lifespanEvidence: {"note": "野生由来の雄を幼体から22年9か月飼育した記録があります。原記録では旧属名Ocadia sinensisで掲載されています。生まれた年は不明で、分かるのは迎えてからの期間です。平均や最長寿命を調べた記録ではありません。", "url": "https://webapps.fhsu.edu/ksherp/bibFiles/21870.pdf", "source": "Snider・Bowler 飼育下長寿記録集（1992、p14）"},
    extraSpecs: { tankSize: '60〜90cm' },
    links: [{ label: '水棲ガメ 飼育ガイド', href: '../guide-water-full.html' }], asin: null,
    slug: 'chinese-stripe-necked-turtle', hasPage: true,
    match: function(s){ return (s.medium_tank||0) >= 1 && (s.beginner||0) >= 1; },
    score: function(s){ return (s.medium_tank||0)+(s.beginner||0)+(s.beauty||0)+(s.active||0)+(s.asia_water||0)+(s.cool_climate||0)+(s.mainstream||0); },
    availability: 'common'
  },
  { name: 'トウブドロガメ', latin: 'Kinosternon subrubrum subrubrum', emoji: '🌊', difficulty: '入門', size: 'S（9〜12cm）', cites: 'CITES II', legal: null,
    reason: 'ニオイガメと並ぶ入門向けの小型ドロガメ。北米東部の湿地・沼地に生息し、30〜45cm水槽から飼育可能。水陸両用で活発に動く姿が愛らしい。比較的温和ではじめての1頭にも向く。',
    specs: { '最大甲長': '12cm', '水槽サイズ': '30〜45cm', '水温': '22〜27℃', '難易度': '入門' },
    coreSpecs: { size: '12cm', temp: '22〜27℃', lifespan: "野生で40年近く生きる個体がいるとの推定", diet: '雑食' },
    lifespanEvidence: {"note": "IUCNの専門家資料では、サウスカロライナの基亜種について、一部は40年近く生きると推定しています。20年間の標識再捕獲研究から作った生命表による計算で、実際に40歳を確認した記録や平均40年という意味ではありません。", "url": "https://iucn-tftsg.org/wp-content/uploads/file/Accounts/crm_5_101_subrubrum_v1_2017.pdf", "source": "IUCN TFTSG 種アカウント（2017、Frazerら1991引用）"},
    extraSpecs: { tankSize: '30〜45cm' },
    links: [{ label: '水棲ガメ 飼育ガイド', href: '../guide-water-full.html' }], asin: null,
    slug: 'eastern-mud-turtle', hasPage: true,
    match: function(s){ return (s.small_tank||0) >= 2 && (s.beginner||0) >= 1; },
    score: function(s){ return (s.small_tank||0)+(s.beginner||0)+(s.mud_lover||0)+(s.observational||0)+(s.na_water||0)+(s.warm_climate||0)+(s.mainstream||0); },
    availability: 'common'
  },
  { name: 'カンバーランドスライダー', latin: 'Trachemys scripta troostii', emoji: '🌿', difficulty: '入門', size: 'M（18〜28cm）', cites: null, legal: 'conditional_invasive',
    reason: '条件付特定外来生物（Trachemys scripta の全亜種、2023年6月1日指定）。一般家庭での飼育・捕獲・頒布に当たらない少数の相手との無償譲渡・譲受けは手続き不要。販売・購入・頒布・輸入・野外への放出等は原則禁止。逃がさず、最後まで飼えることが前提です。',
    diagnosisNotice: '当サイトでは新しく迎える人向けの診断候補から外しています。飼育自体が一律禁止という意味ではありません。条件付特定外来生物（Trachemys scripta の全亜種、2023年6月1日指定）。一般家庭での飼育・捕獲・頒布に当たらない少数の相手との無償譲渡・譲受けは手続き不要。販売・購入・頒布・輸入・野外への放出等は原則禁止。逃がさず、最後まで飼えることが前提です。',
    legalNote: '条件付特定外来生物（Trachemys scripta の全亜種、2023年6月1日指定）。一般家庭での飼育・捕獲・頒布に当たらない少数の相手との無償譲渡・譲受けは手続き不要。販売・購入・頒布・輸入・野外への放出等は原則禁止。逃がさず、最後まで飼えることが前提です。',
    specs: { '最大甲長': '28cm', '水槽サイズ': '60〜90cm', '水温': '22〜28℃', '難易度': '入門' },
    coreSpecs: { size: '28cm', temp: '22〜28℃', lifespan: "23年7か月の飼育記録", diet: '雑食（幼体肉食寄り）' },
    lifespanEvidence: {"note": "Slavensには、雌を23年7か月飼育した記録が、troostiという亜種名で載っています。出生年と迎えたときの年齢は不明です。この期間は平均寿命でも、何年まで生きられるかを示す上限でもありません。", "url": "https://www.pondturtle.com/lturtle.html", "source": "Slavens 飼育記録集"},
    extraSpecs: { tankSize: '60〜90cm' },
    links: [{ label: '水棲ガメ 飼育ガイド', href: '../guide-water-full.html' }], asin: null,
    slug: 'cumberland-slider', hasPage: true,
    match: function(s){ return (s.medium_tank||0) >= 1 && (s.active||0) >= 2; },
    score: function(s){ return (s.medium_tank||0)+(s.active||0)+(s.beginner||0)+(s.mainstream||0)+(s.swimmer||0)+(s.na_water||0)+(s.warm_climate||0); },
    availability: 'rare'
  },
  { name: 'キタチズガメ', latin: 'Graptemys geographica', emoji: '🗾', difficulty: '中級', size: 'M（オス10cm/メス28cm）', cites: 'CITES III', legal: null,
    reason: 'チズガメ属の基本種。甲羅に地図状の模様が入る美麗種で、オス・メスで体格差が大きい。水質管理が重要で、適切なフィルターと水温管理ができる中級者向け。',
    specs: { '最大甲長': 'オス10cm/メス28cm', '水槽サイズ': '60〜90cm', '水温': '20〜26℃', '難易度': '中級' },
    coreSpecs: { size: 'オス10cm/メス28cm', temp: '20〜26℃', lifespan: "野生で20年を超える生存例", diet: '雑食（水生無脊椎動物中心）' },
    lifespanEvidence: {"note": "COSEWICの評価資料には、野生で20年を超えて生存するという報告があります。平均寿命や種の上限を確定した値ではありません。また、同じ資料に出てくる世代長32年は寿命とは別の指標です。", "url": "https://www.canada.ca/en/environment-climate-change/services/species-risk-public-registry/cosewic-assessments-status-reports/northern-map-turtle-2012.html", "source": "COSEWIC 評価資料（2012）"},
    extraSpecs: { tankSize: '60〜90cm' },
    links: [{ label: '水棲ガメ 飼育ガイド', href: '../guide-water-full.html' }], asin: null,
    slug: 'northern-map-turtle', hasPage: true,
    match: function(s){ return (s.medium_tank||0) >= 2 && (s.maintenance||0) >= 2; },
    score: function(s){ return (s.medium_tank||0)+(s.maintenance||0)+(s.beauty||0)+(s.observational||0)+(s.na_water||0)+(s.cool_climate||0)+(s.bottom_dweller||0); },
    availability: 'common'
  },
  { name: 'テキサスチズガメ', latin: 'Graptemys versa', emoji: '⭐', difficulty: '中〜上級', size: 'S（オス7cm/メス12cm）', cites: 'CITES III', legal: null,
    reason: 'チズガメ属で最小クラスの小型種。テキサス州グアダルーペ川水系固有種。コンパクトな体格と美しい甲羅模様が人気。流水を好み酸素豊富な水質が必要な上級向け種。',
    specs: { '最大甲長': 'オス7cm/メス12cm', '水槽サイズ': '45〜60cm', '水温': '20〜26℃', '難易度': '中〜上級' },
    coreSpecs: { size: 'オス7cm/メス12cm', temp: '20〜26℃', lifespan: "種固有の長期記録は未確認", diet: '雑食（軟体動物・昆虫中心）' },
    lifespanEvidence: {"note": "Animal Diversity Webも、本種の寿命情報は少ないとしています。紹介されているのは他のチズガメ類の記録で、テキサスチズガメの平均や上限ではありません。本種だと確認できる個体の長期記録は、まだ確認できていません。", "url": "https://animaldiversity.org/accounts/Graptemys_versa/", "source": "Animal Diversity Web"},
    extraSpecs: { tankSize: '45〜60cm' },
    links: [{ label: '水棲ガメ 飼育ガイド', href: '../guide-water-full.html' }], asin: null,
    slug: null, hasPage: false,
    match: function(){ return false; },
    score: function(){ return -9999; },
    availability: 'archive'
  },
  { name: 'アラバマチズガメ', latin: 'Graptemys pulchra', emoji: '💎', difficulty: '中〜上級', size: 'M（オス〜12cm/メス〜27cm）', cites: 'CITES II', legal: null,
    reason: 'アラバマ州・フロリダ州西部の河川系に生息するチズガメ。メスの甲幅が特に広くなる大型個体が魅力。水質・酸素量への要求が高く、本格的な水棲ガメ飼育を楽しみたい上級者向け。',
    legalNote: 'CITES附属書II（2023年2月23日から）。輸出入には必要な許可書等を確認します。附属書IIだけで日本国内の飼育が禁止されるわけではありません。',
    specs: { '最大甲長': '27.9cm（資料上限）', '水槽サイズ': '60〜90cm', '水温': '20〜26℃', '難易度': '中〜上級' },
    coreSpecs: { size: '27.9cm（資料上限）', temp: '20〜26℃', lifespan: "旧記録の現在の種同定が不明", diet: '雑食（水生無脊椎動物中心）' },
    sizeNote: 'TTWG 2025 p.170 掲載の最大直線甲長（SCL）：オス12.2cm・メス27.9cm。一般的な成体サイズや将来の成長予測ではない。',
    lifespanEvidence: {"note": "旧名Graptemys pulchraには、成体から15年8か月飼育された記録があります。その後、この名前で扱われていたカメは複数種に分けられました。元の個体の産地や再同定の情報がないため、現在のアラバマチズガメだったかは不明です。本種の平均や上限には使えません。", "url": "https://www.pondturtle.com/lturtle.html", "source": "Slavens 飼育記録集（種の分離前）"},
    extraSpecs: { tankSize: '60〜90cm' },
    links: [{ label: '水棲ガメ 飼育ガイド', href: '../guide-water-full.html' }], asin: null,
    slug: 'alabama-map-turtle', hasPage: true,
    match: function(s){ return (s.medium_tank||0) >= 2 && (s.maintenance||0) >= 3 && (s.advanced||0) >= 2; },
    score: function(s){ return (s.medium_tank||0)+(s.maintenance||0)+(s.beauty||0)+(s.advanced||0)+(s.na_water||0)+(s.collector||0)+(s.cool_climate||0); },
    availability: 'common'
  },
  { name: 'ホオジロクロガメ', latin: 'Siebenrockiella crassicollis', emoji: '🖤', difficulty: '中〜上級', size: 'M（16〜20cm）', cites: 'CITES II', legal: 'cites_ii',
    reason: '東南アジア産の黒い水棲ガメ。全身真っ黒の独特の容姿が魅力で、低地の沼・湿地・溜池に生息。高水温と水質管理が重要。CITES II種のため国内CBの取引証明書確認が必要。',
    specs: { '最大甲長': '20cm', '水槽サイズ': '60cm〜', '水温': '24〜30℃', '難易度': '中〜上級' },
    coreSpecs: { size: '20cm', temp: '24〜30℃', lifespan: "成体から16年8か月の飼育記録", diet: '雑食（動物食強め）' },
    lifespanEvidence: {"note": "原記録集には、野生由来の雌を成体から16年8か月飼育した例があります。学名はSiebenrockiella crassicollis。生まれた年は分からないため、実際の年齢はこの期間より上です。平均や最長寿命は、この一例からは分かりません。", "url": "https://webapps.fhsu.edu/ksherp/bibFiles/21870.pdf", "source": "Snider・Bowler 飼育下長寿記録集（1992、p14）"},
    extraSpecs: { tankSize: '60cm〜' },
    links: [{ label: '水棲ガメ 飼育ガイド', href: '../guide-water-full.html' }], asin: null,
    slug: 'asian-black-marsh-turtle', hasPage: true,
    match: function(s){ return (s.medium_tank||0) >= 1 && (s.intermediate||0) >= 1 && (s.asia_water||0) >= 1; },
    score: function(s){ return (s.medium_tank||0)+(s.intermediate||0)+(s.observational||0)+(s.asia_water||0)+(s.tropical_climate||0)+(s.collector||0)+(s.beauty||0); },
    availability: 'common'
  },
  { name: 'ハナナガドロガメ', latin: 'Kinosternon acutum', emoji: '🐢', difficulty: '中級', size: 'S（11〜14cm）', cites: 'CITES II', legal: null,
    reason: '頭部が大きく独特の迫力があるドロガメ。グアテマラ〜メキシコ原産。かめぢから2023年10月EUCB入荷・完売記録あり。丈夫で飼育しやすいが水質管理が重要。',
    specs: { '最大甲長': '14cm', '水槽サイズ': '45cm〜', '水温': '24〜30℃', '難易度': '中級' },
    coreSpecs: { size: '14cm', temp: '24〜30℃', lifespan: "16年2か月の飼育記録", diet: '雑食（動物食強め）' },
    lifespanEvidence: {"note": "Snider・Bowlerの記録集には、野生由来の個体を16年2か月飼育した例があります。入手時の年齢が不明なので、何歳まで生きたかは分かりません。16年2か月はこの個体の飼育期間です。", "url": "https://webapps.fhsu.edu/ksherp/bibFiles/21870.pdf", "source": "Snider・Bowler 飼育下長寿記録集（1992、p15）"},
    extraSpecs: { tankSize: '45cm〜' },
    links: [{ label: '半水棲ガメ 飼育ガイド', href: '../guide-semi.html' }], asin: null,
    slug: 'narrow-bridged-mud-turtle', hasPage: true,
    match: function(s){ return (s.small_tank||0) >= 1 && (s.intermediate||0) >= 1; },
    score: function(s){ return (s.small_tank||0)+(s.intermediate||0)+(s.observational||0)+(s.mud_lover||0)+(s.na_water||0)+(s.warm_climate||0); },
    availability: 'common'
  },
  { name: 'フロリダドロガメ', latin: 'Kinosternon steindachneri', emoji: '🌴', difficulty: '入門〜中級', size: 'S（9〜12cm）', cites: 'CITES II', legal: null,
    reason: 'フロリダに分布する独立種。以前はトウブドロガメの亜種として扱われていました。フロリダ産CB流通あり。とんぶり市2025出品記録確認。温和で入門者にも向く小型ドロガメ。腹甲に赤みが入る個体が多い。',
    specs: { '最大甲長': '12cm', '水槽サイズ': '30〜45cm', '水温': '22〜28℃', '難易度': '入門〜中級' },
    coreSpecs: { size: '12cm', temp: '22〜28℃', lifespan: "本種と確認された長期記録が不足", diet: '雑食' },
    lifespanEvidence: {"note": "旧分類の資料に出てくる40年近い寿命は、基亜種Kinosternon subrubrum subrubrumの研究からの推定です。フロリダドロガメを調べた数字ではないため、この種の寿命を示す根拠にはなりません。", "url": "https://iucn-tftsg.org/wp-content/uploads/file/Accounts/crm_5_101_subrubrum_v1_2017.pdf", "source": "IUCN TFTSG 種アカウント（2017、旧分類）"},
    extraSpecs: { tankSize: '30〜45cm' },
    links: [{ label: '水棲ガメ 飼育ガイド', href: '../guide-water-full.html' }], asin: null,
    slug: 'florida-mud-turtle', hasPage: true,
    match: function(s){ return (s.small_tank||0) >= 2 && (s.beginner||0) >= 1; },
    score: function(s){ return (s.small_tank||0)+(s.beginner||0)+(s.mud_lover||0)+(s.observational||0)+(s.na_water||0)+(s.warm_climate||0); },
    availability: 'common'
  },
  { name: 'オオアタマヒメニオイガメ', latin: 'Sternotherus minor', emoji: '🔬', difficulty: '入門〜中級', size: 'S（10〜14cm）', cites: 'CITES II', legal: null,
    reason: '「ヒメニオイガメ」と同じ種で、頭部が大きくなる。国内CB・輸入CB流通あり。とんぶり市2025出品「2024CB・2025CB」確認。小型で飼育しやすくニオイガメ入門者に人気。',
    specs: { '最大甲長': '14cm', '水槽サイズ': '30〜45cm', '水温': '22〜27℃', '難易度': '入門〜中級' },
    coreSpecs: { size: '14cm', temp: '22〜27℃', lifespan: "幼体から23年11か月の飼育記録", diet: '雑食' },
    lifespanEvidence: {"note": "Snider・Bowlerの記録集には、野生由来の幼体雄を23年11か月飼育した例があります。旧基亜種Sternotherus minor minorの記録で、近縁のスジクビニオイガメとは別です。この期間は迎えてからの長さで、平均や最長寿命ではありません。", "url": "https://webapps.fhsu.edu/ksherp/bibFiles/21870.pdf", "source": "Snider・Bowler 飼育下長寿記録集（1992、p15）"},
    extraSpecs: { tankSize: '30〜45cm' },
    links: [{ label: '半水棲ガメ 飼育ガイド', href: '../guide-semi.html' }], asin: null,
    slug: 'loggerhead-musk-turtle', hasPage: true,
    match: function(s){ return (s.small_tank||0) >= 2 && (s.observational||0) >= 1; },
    score: function(s){ return (s.small_tank||0)+(s.beginner||0)+(s.observational||0)+(s.mud_lover||0)+(s.na_water||0)+(s.warm_climate||0)+(s.intermediate||0); },
    availability: 'common'
  },
  { name: 'リバークーター', latin: 'Pseudemys concinna', emoji: '🏞️', difficulty: '中級', size: 'L（25〜40cm）', cites: null, legal: null,
    reason: 'リバークーターとも呼ばれる北米産の大型スライダー系ガメ。国内CB・輸入CB流通あり。活発に泳ぎ回る姿が見応えある。大型水槽が必要だが丈夫で飼育しやすい。',
    specs: { '最大甲長': '40cm', '水槽サイズ': '90cm〜', '水温': '22〜28℃', '難易度': '中級' },
    coreSpecs: { size: '40cm', temp: '22〜28℃', lifespan: "基亜種に成体から14年9か月の飼育記録", diet: '雑食（植物多め）' },
    lifespanEvidence: {"note": "Slavensには、基亜種Pseudemys concinna concinnaを成体から14年9か月飼育した記録があります。野生由来で、性別と出生年は不明です。別亜種の記録とは分けて読む必要があり、リバークーター全体の平均や最長寿命ではありません。", "url": "https://www.pondturtle.com/lturtle.html", "source": "Slavens 飼育記録集"},
    extraSpecs: { tankSize: '90cm〜' },
    links: [{ label: '水棲ガメ 飼育ガイド', href: '../guide-water-full.html' }], asin: null,
    slug: 'river-cooter', hasPage: true,
    match: function(s){ return (s.large_tank||0) >= 1 && (s.active||0) >= 1; },
    score: function(s){ return (s.large_tank||0)+(s.active||0)+(s.intermediate||0)+(s.swimmer||0)+(s.na_water||0)+(s.warm_climate||0)+(s.maintenance||0); },
    availability: 'common'
  },
  { name: 'リオグランデクーター', latin: 'Pseudemys gorzugi', emoji: '🌊', difficulty: '中級', size: 'M（20〜28cm）', cites: null, legal: null,
    reason: 'テキサス州〜メキシコ北部のリオグランデ川流域産のクーター。リバークーターより小型で扱いやすい。国内流通あり。活発に泳ぎ回る姿が魅力の中型水棲ガメ。',
    specs: { '最大甲長': '28cm', '水槽サイズ': '60〜90cm', '水温': '22〜28℃', '難易度': '中級' },
    coreSpecs: { size: '28cm', temp: '22〜28℃', lifespan: "別種を参考に20〜25年と推定", diet: '雑食（植物多め）' },
    lifespanEvidence: {"note": "米国魚類野生生物局は寿命を20〜25年と推定しています。ただし、参考にしたのは別種のスライダーガメです。本種を長く追跡して求めた平均寿命ではありません。", "url": "https://www.fws.gov/species/rio-grande-cooter-pseudemys-gorzugi", "source": "米国魚類野生生物局"},
    extraSpecs: { tankSize: '60〜90cm' },
    links: [{ label: '水棲ガメ 飼育ガイド', href: '../guide-water-full.html' }], asin: null,
    slug: 'rio-grande-cooter', hasPage: true,
    match: function(s){ return (s.medium_tank||0) >= 2 && (s.active||0) >= 1; },
    score: function(s){ return (s.medium_tank||0)+(s.active||0)+(s.intermediate||0)+(s.swimmer||0)+(s.na_water||0)+(s.warm_climate||0); },
    availability: 'common'
  },
  { name: 'フロリダアカハラガメ', latin: 'Pseudemys nelsoni', emoji: '❤️', difficulty: '中級', size: 'L（25〜37cm）', cites: null, legal: null,
    reason: 'フロリダ産のクーター系大型水棲ガメ。腹甲が赤いのが特徴。国内流通あり。丈夫で飼育しやすく、活発に泳ぐ姿が見応えある。大型水槽と強力なフィルターが必要。',
    specs: { '最大甲長': '37cm', '水槽サイズ': '90cm〜', '水温': '22〜28℃', '難易度': '中級' },
    coreSpecs: { size: '37cm', temp: '22〜28℃', lifespan: "成体から26年2か月の飼育記録", diet: '雑食（植物多め）' },
    lifespanEvidence: {"note": "野生由来の雌を、成体から26年2か月飼育した記録があります。生まれた年は分からず、分かるのは迎えてからの期間です。平均や最長寿命を示す記録ではありません。", "url": "https://webapps.fhsu.edu/ksherp/bibFiles/21870.pdf", "source": "Snider・Bowler 飼育下長寿記録集（1992、p14）"},
    extraSpecs: { tankSize: '90cm〜' },
    links: [{ label: '水棲ガメ 飼育ガイド', href: '../guide-water-full.html' }], asin: null,
    slug: 'florida-red-bellied-turtle', hasPage: true,
    match: function(s){ return (s.large_tank||0) >= 1 && (s.active||0) >= 1; },
    score: function(s){ return (s.large_tank||0)+(s.active||0)+(s.intermediate||0)+(s.swimmer||0)+(s.na_water||0)+(s.warm_climate||0)+(s.maintenance||0); },
    availability: 'common'
  }
],

// ==================== ヤマガメ・ハコガメルート ====================
forest: [
  { name: 'キボシイシガメ', latin: 'Clemmys guttata', emoji: '✨', recommendationPriority: 80, difficulty: '中級', size: 'S（10〜12cm）', cites: 'CITES II', legal: null,
    reason: '黒い甲羅に黄色の水玉模様が美しい北米産。45〜60cm程度の半水棲ケージで飼育可能。低温を好む温帯種で夏の保冷管理が必要。',
    specs: { '最大甲長': '12cm', 'タイプ': '半水棲', '温度': '18〜25℃', '難易度': '中級' },
    coreSpecs: { size: '12cm', temp: '18〜25℃', lifespan: "野生で44年を超える個体の報告", diet: '雑食' },
    lifespanEvidence: {"note": "カナダのCOSEWIC評価資料には、野生で44年を超える個体の報告があります。同じ資料にある雌110年・雄65年は生存率からの計算値で、そこまで生きた個体を追跡した年齢ではありません。", "url": "https://www.canada.ca/en/environment-climate-change/services/species-risk-public-registry/cosewic-assessments-status-reports/spotted-turtle-2014.html", "source": "COSEWIC 評価資料（2014）"},
    extraSpecs: {},
    links: [{ label: '半水棲ガメ 飼育ガイド', href: '../guide-semi.html' }], asin: null,
    slug: 'spotted-turtle', hasPage: true,
    match: function(s){ return ((s.s_size||0) >= 2 && (s.semi_aquatic||0) >= 1) || (s.s_size||0) >= 2 || (s.ya_ma||0) >= 1; },
    score: function(s){ return (s.s_size||0)+(s.semi_aquatic||0)+(s.intermediate||0)+(s.na_box||0)*2+(s.ya_ma||0)+(s.cool_climate||0); },
    availability: 'common'
  },
  { name: 'モリイシガメ', latin: 'Glyptemys insculpta', emoji: '🍁', recommendationPriority: 40, difficulty: '中〜上級', size: 'M（成体16〜25cm）', cites: 'CITES II', legal: null,
    reason: '甲羅に年輪のような刻みと橙色の模様が美しい北米産。低温を好む温帯種で夏の保冷が必要。半水棲で陸場と水場を行き来する。',
    specs: { '最大甲長': '未確定（成体16〜25cm）', 'タイプ': '半水棲', '温度': '16〜24℃', '難易度': '中〜上級' },
    coreSpecs: { size: '未確定（成体16〜25cm）', temp: '16〜24℃', lifespan: "野生で46年以上生存した雌の報告", diet: '雑食' },
    sizeNote: '16〜25cmはCOSEWICの成体紹介範囲で、最大標本の記録ではありません。',
    lifespanEvidence: {"note": "COSEWICの評価資料には、ペンシルベニアで標識された雌が少なくとも46年生存したという報告があります。この個体の記録から、平均寿命や種の最長記録が決まるわけではありません。", "url": "https://www.canada.ca/en/environment-climate-change/services/species-risk-public-registry/cosewic-assessments-status-reports/wood-turtle-2018.html", "source": "COSEWIC 評価資料（2018、Ernst 2001引用）"},
    extraSpecs: {},
    links: [{ label: '半水棲ガメ 飼育ガイド', href: '../guide-semi.html' }], asin: null,
    slug: 'wood-turtle', hasPage: true,
    match: function(s){ return (s.s_size||0) >= 1 && (s.cooling||0) >= 1 && (s.semi_aquatic||0) >= 1; },
    score: function(s){ return (s.s_size||0)+(s.cooling||0)+(s.semi_aquatic||0)+(s.intermediate||0)+(s.na_box||0)+(s.ya_ma||0); },
    availability: 'rare'
  },
  { name: 'スペングラーヤマガメ', latin: 'Geoemyda spengleri', emoji: '🌿', difficulty: '中〜上級', size: 'S（7〜11cm）', cites: 'CITES II', legal: 'cites_ii',
    reason: '小型で独特の容姿が人気の森林棲ヤマガメ。夏の高温に弱く保冷管理が必須。動物性タンパクを好む雑食性で、ユニークな飼育体験ができます。著者も飼育中。',
    specs: { '最大甲長': '10.7cm', 'タイプ': '森林棲', '温度': '22〜27℃', '難易度': '中〜上級' },
    coreSpecs: { size: '10.7cm', temp: '22〜27℃', lifespan: '20年以上（動物園の案内）', diet: '雑食' },
    sizeNote: '資料に記録された上限（IUCN専門家グループの種アカウント）。13cmとする図鑑もあります。一般的な成体は7〜11cm。',
    lifespanEvidence: { note: 'シンシナティ動物園は、寿命を20年以上と案内しています。平均か上限かの説明はありませんが、長く世話を続けるつもりで環境を整えておきたいカメです。', url: 'https://cincinnatizoo.org/animals-archive/black-breasted-leaf-turtle/', source: 'シンシナティ動物園' },
    extraSpecs: {},
    links: [{ label: 'ヤマガメ・ハコガメ 飼育ガイド', href: '../guide-moist.html' }], asin: null,
    slug: 'spenglers-leaf-turtle', hasPage: true,
    match: function(s){ return (s.s_size||0) >= 2 && (s.cooling||0) >= 2; },
    score: function(s){ return (s.s_size||0)+(s.cooling||0)+(s.advanced||0)+(s.advanced_env||0)+(s.ya_ma||0); },
    availability: 'common'
  },
  { name: 'ヒラセガメ', latin: 'Cuora mouhotii', emoji: '🪨', difficulty: '中〜上級', size: 'M（15〜18cm）', cites: 'CITES II', legal: 'cites_ii_cb_only', recommendable: true, commerceAllowed: true, riskFlags: ["cites_ii", "cb_only", "high_humidity"],
    reason: '扁平な甲羅が特徴の東南アジア産ヤマガメ。夏の保冷管理と高湿度維持が重要。著者も飼育中で、落ち着いた性格が魅力。',
    specs: { '最大甲長': '18cm', 'タイプ': '森林棲', '温度': '20〜28℃', '難易度': '中〜上級' },
    coreSpecs: { size: '18cm', temp: '20〜28℃', lifespan: "基亜種は50年以上（動物園の案内）", diet: '雑食' },
    lifespanEvidence: {"note": "札幌市円山動物園は、基亜種Cuora mouhotii mouhotiiが野生・飼育下とも50年以上生きると案内しています。個体の出生年や調査方法は載っていないため、平均や最長寿命の記録ではなく、動物園の解説値として紹介します。", "url": "https://www.city.sapporo.jp/zoo/093-j.html", "source": "札幌市円山動物園"},
    extraSpecs: {},
    links: [{ label: 'ヤマガメ・ハコガメ 飼育ガイド', href: '../guide-moist.html' }], asin: null,
    slug: 'hirase-turtle', hasPage: true,
    match: function(s){ return (s.m_size||0) >= 1 && (s.cooling||0) >= 2; },
    score: function(s){ return (s.m_size||0)+(s.cooling||0)+(s.advanced||0)+(s.advanced_env||0)+(s.ya_ma||0); },
    availability: 'common'
  },
  { name: 'オプストヒラセガメ', latin: 'Cuora mouhotii obsti', emoji: '🪨', difficulty: '中〜上級', size: 'M（親種準拠）', cites: 'CITES II', legal: 'cites_ii_cb_only', riskFlags: ["cites_ii", "cb_only", "high_humidity"],
    reason: 'ヒラセガメの亜種。ベトナム中部〜南部に分布し、腹甲の放射状黒斑が基亜種との識別点。亜種固有の飼育データは未確認のため、飼育は親種ヒラセガメに準じます。国内流通はきわめて稀。',
    specs: { '最大甲長': '親種準拠（18cm前後）', 'タイプ': '森林棲', '温度': '親種準拠（20〜28℃）', '難易度': '中〜上級' },
    coreSpecs: { size: '18cm', temp: '20〜28℃', lifespan: "亜種固有の寿命記録は未確認", diet: '雑食' },
    lifespanEvidence: {"note": "保全計画では、ヒラセガメ全体の雌の寿命の中央値を50年と見積もり、計算に使っています。オブストヒラセガメだけを追跡して得た数字ではないので、この亜種固有の平均や最長寿命までは分かりません。", "url": "https://www.cpsg.org/sites/default/files/2025-01/AnnamitesRp310323_FINALDRAFT_COVERED_NoKTable.pdf", "source": "Annamites Tortoise and Freshwater Turtle Conservation Plan（2023、付録A2.1）"},
    extraSpecs: {},
    links: [{ label: 'ヒラセガメ（親種）', href: '../species/hirase-turtle.html' }], asin: null,
    slug: 'obsti-hirase-turtle', hasPage: true,
    match: function(s){ return false; },
    score: function(s){ return 0; },
    availability: 'reference_only'
  },
  { name: 'アカスジヤマガメ', latin: 'Rhinoclemmys pulcherrima', emoji: '🔴', difficulty: '中〜上級', size: 'M（17〜20cm）', cites: 'CITES II', legal: 'cites_ii',
    reason: '甲羅と頭部に鮮やかな赤いラインが走る美しい中米産ヤマガメ。半陸棲で湿度管理が必要。マンヤマガメとの区別に注意。',
    specs: { '最大甲長': '20cm', 'タイプ': '半陸棲', '温度': '24〜30℃', '難易度': '中〜上級' },
    coreSpecs: { size: '20cm', temp: '24〜30℃', lifespan: "基亜種に成体から20年5か月の飼育記録", diet: '雑食' },
    lifespanEvidence: {"note": "原記録集には、基亜種Rhinoclemmys pulcherrima pulcherrimaの野生由来の成体雄を20年5か月飼育した例があります。出生年は不明です。同じ種の長期飼育例として参考になりますが、全亜種に共通する平均や最長寿命ではありません。", "url": "https://webapps.fhsu.edu/ksherp/bibFiles/21870.pdf", "source": "Snider・Bowler 飼育下長寿記録集（1992、p14）"},
    extraSpecs: {},
    links: [{ label: 'ヤマガメ・ハコガメ 飼育ガイド', href: '../guide-moist.html' }], asin: null,
    slug: 'painted-wood-turtle', hasPage: true,
    match: function(s){ return (s.s_size||0) >= 1 && (s.cooling||0) >= 2 && (s.advanced_env||0) >= 2; },
    score: function(s){ return (s.s_size||0)+(s.cooling||0)+(s.advanced_env||0)+(s.advanced||0)+(s.ya_ma||0); },
    availability: 'common'
  },
  { name: 'ネンリンヤマガメ', latin: 'Rhinoclemmys annulata', emoji: '🌀', difficulty: '中〜上級', size: 'M（18〜20cm）', cites: 'CITES II', legal: 'cites_ii',
    reason: '甲羅に年輪のような輪状の模様が美しい中南米産ヤマガメ。半陸棲で高湿度と水場が必要。国内CB流通確認済み。',
    specs: { '最大甲長': '22.6cm（資料上限）', 'タイプ': '半陸棲', '温度': '24〜30℃', '難易度': '中〜上級' },
    coreSpecs: { size: '22.6cm（資料上限）', temp: '24〜30℃', lifespan: "飼育下で30年以上生きた個体の報告", diet: '雑食' },
    sizeNote: 'TTWG 2025 p.287 掲載の最大直線甲長（SCL）：オス20.2cm・メス22.6cm。一般的な成体サイズや将来の成長予測ではない。',
    lifespanEvidence: {"note": "IUCNの専門家資料には、パラグアイで飼育された1個体が30年以上生きた例が紹介されています。飼育者からの私信に基づくもので、出生年や取得年月日は載っていません。確定した総年齢や平均寿命ではなく、飼育者が伝えた長期飼育例です。", "url": "https://iucn-tftsg.org/wp-content/uploads/file/Accounts2/crm.5.123.annulata.v1.2023.pdf", "source": "Carrほか IUCN TFTSG 種アカウント（2023、私信の紹介）"},
    extraSpecs: {},
    links: [{ label: 'ヤマガメ・ハコガメ 飼育ガイド', href: '../guide-moist.html' }], asin: null,
    slug: 'annulated-wood-turtle', hasPage: true,
    match: function(s){ return (s.m_size||0) >= 1 && (s.advanced_env||0) >= 2 && (s.semi_aquatic||0) >= 1; },
    score: function(s){ return (s.m_size||0)+(s.advanced_env||0)+(s.semi_aquatic||0)+(s.advanced||0)+(s.ya_ma||0); },
    availability: 'common'
  },
  { name: 'マンヤマガメ', latin: 'Rhinoclemmys pulcherrima manni', emoji: '🎨', difficulty: '中〜上級', size: 'M（17〜20cm）', cites: 'CITES II', legal: 'cites_ii',
    reason: '古代民族の陶器のような鮮やかな色彩が特徴の中米産ヤマガメ。かめぢから・ぶりくら路面店での流通確認済み。果物・人工飼料なんでも食べる飼育しやすさが◎。',
    specs: { '最大甲長': '20cm', 'タイプ': '半陸棲', '温度': '24〜30℃', '難易度': '中〜上級' },
    coreSpecs: { size: '20cm', temp: '24〜30℃', lifespan: "20年の飼育記録", diet: '雑食' },
    lifespanEvidence: {"note": "Slavensの記録集には、野生由来の雌（個体番号300004）を1975年から1995年まで20年間飼育した例があります。出生年と入手時の年齢は書かれておらず、分かるのは飼育期間です。種の平均寿命ではありません。", "url": "https://www.pondturtle.com/lturtle.html", "source": "Slavens 飼育記録集"},
    extraSpecs: {},
    links: [{ label: 'ヤマガメ・ハコガメ 飼育ガイド', href: '../guide-moist.html' }], asin: null,
    slug: 'brown-wood-turtle-manni', hasPage: true,
    match: function(s){ return ((s.m_size||0) >= 1 && (s.semi_aquatic||0) >= 1 && (s.intermediate||0) >= 1) || (s.ya_ma||0) >= 2 && (s.intermediate||0) >= 1; },
    score: function(s){ return (s.m_size||0)+(s.semi_aquatic||0)+(s.intermediate||0)+(s.advanced_env||0)+(s.ya_ma||0); },
    availability: 'common'
  },
  { name: 'ニカラグアクジャクガメ', latin: 'Rhinoclemmys pulcherrima incisa', emoji: '🦚', difficulty: '中〜上級', size: 'M（15〜20cm）', cites: 'CITES II', legal: 'cites_ii',
    reason: '鮮やかな模様を持つ中米産ヤマガメ。ぶりくら2025出品リストにニカラグアクジャクガメとして記載。半陸棲で水場と陸場を行き来する。高湿度環境が必要。',
    specs: { '最大甲長': '20cm', 'タイプ': '半陸棲', '温度': '24〜29℃', '難易度': '中〜上級' },
    coreSpecs: { size: '20cm', temp: '24〜29℃', lifespan: "9年1か月の飼育記録", diet: '雑食' },
    lifespanEvidence: {"note": "バッファロー動物園では、野生由来の雄（個体番号80R50）を1980年9月から1989年11月まで飼育した記録があります。Slavensが記した期間は9年1か月です。出生年と入手時の年齢は不明で、この亜種の寿命が9年ほどという意味ではありません。", "url": "https://www.pondturtle.com/lturtle.html", "source": "Slavens 飼育記録集"},
    extraSpecs: {},
    links: [{ label: 'ヤマガメ・ハコガメ 飼育ガイド', href: '../guide-moist.html' }], asin: null,
    slug: 'nicaragua-wood-turtle', hasPage: true,
    match: function(s){ return ((s.m_size||0) >= 1 && (s.semi_aquatic||0) >= 2) || (s.ya_ma||0) >= 2 && (s.intermediate||0) >= 1; },
    score: function(s){ return (s.m_size||0)+(s.semi_aquatic||0)+(s.advanced_env||0)+(s.intermediate||0)+(s.ya_ma||0); },
    availability: 'common'
  },
  { name: 'ソノラクジャクガメ', latin: 'Rhinoclemmys pulcherrima rogerbarbouri', emoji: '🏜️', difficulty: '中〜上級', size: 'M（17〜20cm）', cites: 'CITES II', legal: 'cites_ii',
    reason: 'アカスジヤマガメ4亜種のうち最も北、メキシコ北西部の太平洋岸に分布する亜種。背甲の橙条が細く分断されがちで、マンヤマガメほど華やかにならない個体が多いとされる。飼育は同種の他亜種と同じ高湿度・半陸棲。',
    specs: { '最大甲長': '20cm', 'タイプ': '半陸棲', '温度': '24〜29℃', '難易度': '中〜上級' },
    coreSpecs: { size: '20cm', temp: '24〜29℃', lifespan: "亜種固有の長期記録は未確認", diet: '雑食' },
    lifespanEvidence: {"note": "原記録集にある20年5か月の成体飼育例は、同じ種の基亜種のものです。ソノラクジャクガメと特定された個体の記録は見つかっておらず、他の亜種の数字だけでは本亜種の平均や最長寿命は分かりません。", "url": "https://webapps.fhsu.edu/ksherp/bibFiles/21870.pdf", "source": "Snider・Bowler 飼育下長寿記録集（1992、p14）"},
    extraSpecs: {},
    links: [{ label: 'ヤマガメ・ハコガメ 飼育ガイド', href: '../guide-moist.html' }], asin: null,
    slug: 'sonora-wood-turtle', hasPage: true,
    match: function(s){ return ((s.m_size||0) >= 1 && (s.semi_aquatic||0) >= 2) || (s.ya_ma||0) >= 2 && (s.intermediate||0) >= 1; },
    score: function(s){ return (s.m_size||0)+(s.semi_aquatic||0)+(s.advanced_env||0)+(s.intermediate||0)+(s.ya_ma||0); },
    availability: 'rare'
  },
  { name: 'ゲレーロクジャクガメ', latin: 'Rhinoclemmys pulcherrima pulcherrima', emoji: '🌺', difficulty: '中〜上級', size: 'M（17〜20cm）', cites: 'CITES II', legal: 'cites_ii',
    reason: 'アカスジヤマガメという種名のもとになった基亜種。メキシコ南西部のゲレーロ州〜オアハカ州に分布する。模様の出方は個体差が大きく、基亜種がいちばん鮮やかとは限らない。飼育は同種の他亜種と同じ高湿度・半陸棲。',
    specs: { '最大甲長': '20cm', 'タイプ': '半陸棲', '温度': '24〜29℃', '難易度': '中〜上級' },
    coreSpecs: { size: '20cm', temp: '24〜29℃', lifespan: "成体から20年5か月の飼育記録", diet: '雑食' },
    lifespanEvidence: {"note": "原記録集には、Rhinoclemmys pulcherrima pulcherrimaの野生由来の雄を、成体で迎えてから20年5か月飼育した例があります。出生年は不明なので、総年齢は分かりません。本亜種の長期飼育例として紹介します。", "url": "https://webapps.fhsu.edu/ksherp/bibFiles/21870.pdf", "source": "Snider・Bowler 飼育下長寿記録集（1992、p14）"},
    extraSpecs: {},
    links: [{ label: 'ヤマガメ・ハコガメ 飼育ガイド', href: '../guide-moist.html' }], asin: null,
    slug: 'guerrero-wood-turtle', hasPage: true,
    match: function(s){ return ((s.m_size||0) >= 1 && (s.semi_aquatic||0) >= 1 && (s.intermediate||0) >= 1) || (s.ya_ma||0) >= 2 && (s.intermediate||0) >= 1; },
    score: function(s){ return (s.m_size||0)+(s.semi_aquatic||0)+(s.advanced_env||0)+(s.intermediate||0)+(s.ya_ma||0); },
    availability: 'rare'
  },
  { name: 'ミツユビハコガメ', latin: 'Terrapene triunguis', emoji: '📦', recommendationPriority: 78, difficulty: '中〜上級', size: 'M（通常11.3〜15cm）', cites: 'CITES II', legal: 'cites_ii',
    reason: '後肢が3本指の北米産ハコガメ。腹甲を完全に閉じられる独自構造が特徴。雑食性で飼育食への移行がしやすい。著者も飼育中。',
    specs: { '最大甲長': '17.9cm（標本記録）', 'タイプ': '陸棲', '温度': '22〜28℃', '難易度': '中〜上級' },
    coreSpecs: { size: '17.9cm（標本記録）', temp: '22〜28℃', lifespan: "成体から52年の飼育記録", diet: '雑食' },
    sizeNote: 'TTWG 2025とKansas Herpetofaunal Atlasに17.9cmの記録。Atlasの該当標本はメスKU218958で、通常成体は11.3〜15cmと記載。18.9cmの別報告（Daniel 2005）は、以前の広い分類でT. carolinaとされており、ミツユビハコガメかどうか分かりません。そのため、本種の最大記録には含めていません。17.9cmを超えて育たないという意味でもありません。',
    lifespanEvidence: {"note": "Slavensには、成体で迎えた野生由来の雄を52年飼育し、その時点でも生きていた記録があります。旧名Terrapene carolina triunguisで掲載されており、取得日と出生年は不明です。52年は迎えてからの期間で、平均や最長寿命ではありません。", "url": "https://www.pondturtle.com/lturtle.html", "source": "Slavens 飼育記録集"},
    extraSpecs: {},
    links: [{ label: 'ヤマガメ・ハコガメ 飼育ガイド', href: '../guide-moist.html' }], asin: null,
    slug: 'three-toed-box-turtle', hasPage: true,
    match: function(s){ return ((s.terrestrial||0) >= 2 && (s.m_size||0) >= 1) || (s.na_box||0) >= 1 || (s.beginner||0) >= 2; },
    score: function(s){ return (s.terrestrial||0)+(s.m_size||0)+(s.intermediate||0)+(s.advanced_env||0)+(s.na_box||0); },
    availability: 'common'
  },
  { name: 'トウブハコガメ', latin: 'Terrapene carolina carolina', emoji: '🍁', recommendationPriority: 73, difficulty: '中〜上級', size: 'M（15〜20cm）', cites: 'CITES II', legal: 'cites_ii',
    reason: '北米産ハコガメの基亜種。国内CBの流通も盛ん。腹甲全体を閉じられる独特の能力をもつ。雑食性で飼育食への移行も比較的容易。',
    specs: { '最大甲長': '20cm', 'タイプ': '陸棲', '温度': '22〜28℃', '難易度': '中〜上級' },
    coreSpecs: { size: '20cm', temp: '22〜28℃', lifespan: "25〜35年（動物園の案内）", diet: '雑食' },
    lifespanEvidence: {"note": "スミソニアン国立動物園のトウブハコガメのページでは、ハコガメの寿命を一般に25〜35年とし、100年を超える例も紹介しています。ただし、個体の記録や野生・飼育下の区別はありません。平均や上限が確かめられた数字ではありません。", "url": "https://nationalzoo.si.edu/animals/eastern-box-turtle", "source": "スミソニアン国立動物園"},
    extraSpecs: {},
    links: [{ label: 'ヤマガメ・ハコガメ 飼育ガイド', href: '../guide-moist.html' }], asin: null,
    slug: 'eastern-box-turtle', hasPage: true,
    match: function(s){ return (s.terrestrial||0) >= 2 && (s.m_size||0) >= 1; },
    score: function(s){ return (s.terrestrial||0)+(s.m_size||0)+(s.intermediate||0)+(s.na_box||0); },
    availability: 'common'
  },
  { name: 'ガルフコーストハコガメ', latin: 'Terrapene carolina major', emoji: '🌊', difficulty: '中〜上級', size: 'M〜L（18〜22cm）', cites: 'CITES II', legal: 'cites_ii',
    reason: 'ハコガメの中で最も大型になる亜種。やや湿度の高い環境を好む。中型〜大型の陸棲ガメを求める中上級者に適する。',
    specs: { '最大甲長': '23.5cm（資料上限）', 'タイプ': '陸棲', '温度': '22〜28℃', '難易度': '中〜上級' },
    coreSpecs: { size: '23.5cm（資料上限）', temp: '22〜28℃', lifespan: "成体から23年3か月の飼育記録", diet: '雑食' },
    sizeNote: 'TTWG 2025 p.217 掲載の最大直線甲長（SCL）：オス23.5cm・メス18.9cm。一般的な成体サイズや将来の成長予測ではない。',
    lifespanEvidence: {"note": "Slavensには、亜種majorを成体から23年3か月飼育した記録があります。野生由来で、性別と出生年は不明です。飼育を始める前の年齢は含まず、平均や最長寿命もこの記録だけでは分かりません。", "url": "https://www.pondturtle.com/lturtle.html", "source": "Slavens 飼育記録集"},
    extraSpecs: {},
    links: [{ label: 'ヤマガメ・ハコガメ 飼育ガイド', href: '../guide-moist.html' }], asin: null,
    slug: 'gulf-coast-box-turtle', hasPage: true,
    match: function(s){ return (s.terrestrial||0) >= 2 && (s.m_size||0) >= 2 && (s.advanced_env||0) >= 1; },
    score: function(s){ return (s.terrestrial||0)+(s.m_size||0)+(s.intermediate||0)+(s.advanced_env||0)+(s.na_box||0); },
    availability: 'common'
  },
  { name: 'フロリダハコガメ', latin: 'Terrapene carolina bauri', emoji: '🌴', recommendationPriority: 75, difficulty: '中〜上級', size: 'M（11〜15cm）', cites: 'CITES II', legal: 'cites_ii',
    reason: 'フロリダ産のハコガメ。甲羅に放射状の美しい模様がある。成体は甲長11〜15cm前後と小柄でも、歩き回る床面積が必要で、ケージは90cm級からが目安（床材を厚く敷き、浅い水場を置く）。冬眠させずに加温し、湿度を高めに保つ。',
    specs: { '最大甲長': '18.7cm', 'タイプ': '陸棲', '温度': '23〜29℃', '難易度': '中〜上級' },
    coreSpecs: { size: '18.7cm', temp: '23〜29℃', lifespan: '22年以上の飼育記録', diet: '雑食' },
    sizeNote: '資料に記録された上限（オス）。一般的な成体は11〜15cm。',
    lifespanEvidence: { note: 'Slavensの記録集には、フロリダハコガメ（Terrapene carolina bauri）を22年7か月飼育した記録があります。一例の飼育期間なので、平均寿命や長生きの限界はこの数字からは分かりません。', url: 'https://www.pondturtle.com/lturtle.html', source: 'Slavens 飼育記録集（Bowler 1977引用）' },
    extraSpecs: {},
    links: [{ label: 'ヤマガメ・ハコガメ 飼育ガイド', href: '../guide-moist.html' }], asin: null,
    slug: 'florida-box-turtle', hasPage: true,
    match: function(s){ return ((s.terrestrial||0) >= 2 && (s.s_size||0) >= 1 && (s.intermediate||0) >= 1) || (s.na_box||0) >= 2 && (s.intermediate||0) >= 1; },
    score: function(s){ return (s.terrestrial||0)+(s.s_size||0)+(s.intermediate||0)+(s.na_box||0); },
    availability: 'common'
  },
  { name: 'キタニシキハコガメ', latin: 'Terrapene ornata', emoji: '💎', difficulty: '中〜上級', size: 'M（11〜15cm）', cites: 'CITES II', legal: 'cites_ii',
    reason: '甲羅に黄色のニシキ模様が入る美しいハコガメ。乾燥気味の環境を好み草食傾向が強い。北米ハコガメの中でも個性的な一種。',
    specs: { '最大甲長': '17cm（種全体の記録）', 'タイプ': '陸棲', '温度': '23〜30℃', '難易度': '中〜上級' },
    coreSpecs: { size: '17cm（種全体の記録）', temp: '23〜30℃', lifespan: "野外で推定50歳以上の報告", diet: '雑食' },
    sizeNote: 'TFTSGの種概説（Hughesほか2024）とTTWG 2025では、Terrapene ornata全体の最大直線甲長がオス15.7cm・メス17.0cm。このサイトの「キタ」「ミナミ」は産地による呼び分けです。この数値はそれぞれの産地型の最大値でも、一般的な成体サイズでもありません。',
    lifespanEvidence: {"note": "1983年に成熟した雌として捕まり、2017年に再び捕まった個体が、IUCNの専門家資料に紹介されています。成体として初めて確認してから34年後にも生存が確認されています。最初の年齢を加えて少なくとも約50歳と推定されていますが、出生から50年追った記録や平均寿命ではありません。", "url": "https://www.researchgate.net/publication/385209172_Terrapene_ornata_Agassiz_1857_-_Ornate_Box_Turtle", "source": "IUCN TFTSG 種アカウント（2024、p126.17）"},
    extraSpecs: {},
    links: [{ label: 'ヤマガメ・ハコガメ 飼育ガイド', href: '../guide-moist.html' }], asin: null,
    slug: 'ornate-box-turtle', hasPage: true,
    match: function(s){ return (s.terrestrial||0) >= 3 && (s.m_size||0) >= 1 && (s.intermediate||0) >= 1; },
    score: function(s){ return (s.terrestrial||0)+(s.m_size||0)+(s.intermediate||0)+(s.advanced_env||0)+(s.na_box||0); },
    availability: 'common'
  },
  { name: 'タイワンセマルハコガメ', latin: 'Cuora flavomarginata flavomarginata', emoji: '🟠', difficulty: '中〜上級', size: 'M（14〜18cm）', cites: 'CITES II', legal: 'cites_ii_cb_only', recommendable: true, commerceAllowed: true, riskFlags: ["cites_ii", "cb_only", "high_humidity"],
    reason: '甲羅の縁がオレンジ色に縁どられた美しい台湾産ハコガメ。CB個体は流通している。沖縄産は天然記念物で全く別扱い。必ずCB証明書を確認のこと。',
    specs: { '最大甲長': '18cm', 'タイプ': '半水棲', '温度': '24〜29℃', '難易度': '中〜上級' },
    coreSpecs: { size: '18cm', temp: '24〜29℃', lifespan: "種全体では約44年間の飼育報告", diet: '雑食' },
    lifespanEvidence: {"note": "2018年の報告では、1974年に成体として購入した雄2頭が、約44年の飼育を経ても生存していました。産地・亜種・出生年は記録されていません。セマルハコガメの長期飼育例ですが、台湾の個体や亜種に限った記録ではありません。", "url": "https://ksoutdoors.gov/content/download/56514/613616/version/1/file/2018-%2BHerpetological%2BReview%2BVol%2B49%2C%2BN%2B3%2BSeptember%2B2018.pdf", "source": "Bartlett・Bartlett（2018）Herpetological Review 49(3):487–488"},
    extraSpecs: {},
    links: [{ label: 'ヤマガメ・ハコガメ 飼育ガイド', href: '../guide-moist.html' }], asin: null,
    slug: 'taiwan-box-turtle', hasPage: true,
    match: function(s){ return (s.semi_aquatic||0) >= 2 && (s.m_size||0) >= 1 && (s.intermediate||0) >= 1; },
    score: function(s){ return (s.semi_aquatic||0)+(s.m_size||0)+(s.advanced_env||0)+(s.intermediate||0)+(s.asia_box||0); },
    availability: 'common'
  },
  { name: 'マレーハコガメ', latin: 'Cuora amboinensis sensu lato', emoji: '🌊', difficulty: '中〜上級', size: '旧広義群の記録27.8cm', cites: 'CITES II', legal: 'cites_ii', recommendable: true, commerceAllowed: true, riskFlags: ["cites_ii", "iucn_en", "cb_only"],
    reason: '東南アジア広域に分布する半水棲のハコガメ。水場・陸場を行き来する。高温多湿を好みアジア的な雰囲気がある。',
    specs: { '最大甲長': '27.8cm（旧広義群の記録）', 'タイプ': '半水棲', '温度': '26〜30℃', '難易度': '中〜上級' },
    coreSpecs: { size: '27.8cm（旧広義群の記録）', temp: '26〜30℃', lifespan: "25〜30年（専門家資料の目安）", diet: '雑食' },
    sizeNote: '旧Cuora amboinensis広義群としての掲載。TTWG 2025 p.245では、旧kamaromaを含むC. couro kamaromaのメス27.8cmを記録。狭義C. amboinensisの最大（メス20.8cm）とは別で、全流通個体の将来値ではありません。',
    lifespanEvidence: {"note": "IUCNの専門家資料では寿命の目安が25〜30年とされ、飼育下で38.2年という文献記録も紹介されています。目安と個体の記録は別で、平均寿命や現在の最長記録を確定したものではありません。", "url": "https://iucn-tftsg.org/wp-content/uploads/file/Accounts/crm_5_053_amboinensis_v1_2011.pdf", "source": "IUCN TFTSG 種アカウント（2011）"},
    extraSpecs: {},
    links: [{ label: 'ヤマガメ・ハコガメ 飼育ガイド', href: '../guide-moist.html' }], asin: null,
    slug: 'malayan-box-turtle', hasPage: true,
    match: function(s){ return (s.semi_aquatic||0) >= 2 && (s.m_size||0) >= 1; },
    score: function(s){ return (s.semi_aquatic||0)+(s.m_size||0)+(s.advanced_env||0)+(s.asia_box||0); },
    availability: 'common'
  },
  { name: 'チュウゴクセマルハコガメ', latin: 'Cuora flavomarginata', emoji: '🇨🇳', difficulty: '中〜上級', size: 'M（14〜18cm）', cites: 'CITES II', legal: 'cites_ii_cb_only', recommendable: true, commerceAllowed: true, riskFlags: ["cites_ii", "cb_only"],
    reason: '中国本土産のセマルハコガメ。CB個体の流通がある。タイワン産と同様の管理で飼育できるが亜種の証明書をしっかり確認することが重要。',
    specs: { '最大甲長': '18cm', 'タイプ': '半水棲', '温度': '24〜29℃', '難易度': '中〜上級' },
    coreSpecs: { size: '18cm', temp: '24〜29℃', lifespan: "種全体では約44年間の飼育報告", diet: '雑食' },
    lifespanEvidence: {"note": "2018年の報告では、1974年に成体として購入した雄2頭が、約44年の飼育を経ても生存していました。産地・亜種・出生年は記録されていません。セマルハコガメの長期飼育例ですが、中国の個体や亜種に限った記録ではありません。", "url": "https://ksoutdoors.gov/content/download/56514/613616/version/1/file/2018-%2BHerpetological%2BReview%2BVol%2B49%2C%2BN%2B3%2BSeptember%2B2018.pdf", "source": "Bartlett・Bartlett（2018）Herpetological Review 49(3):487–488"},
    extraSpecs: {},
    links: [{ label: 'ヤマガメ・ハコガメ 飼育ガイド', href: '../guide-moist.html' }], asin: null,
    slug: 'chinese-box-turtle', hasPage: true,
    match: function(s){ return (s.semi_aquatic||0) >= 2 && (s.m_size||0) >= 1 && (s.advanced||0) >= 1; },
    score: function(s){ return (s.semi_aquatic||0)+(s.m_size||0)+(s.advanced_env||0)+(s.advanced||0)+(s.asia_box||0); },
    availability: 'common'
  },
  { name: 'モエギハコガメ', latin: 'Cuora galbinifrons', emoji: '💚', difficulty: '上級', size: 'M（15〜19cm）', cites: 'CITES I', legal: 'cites_i', recommendable: false, commerceAllowed: false, riskFlags: ["cites_i", "reference_only", "registration_required", "cb_only", "high_humidity"],
    reason: '萌黄色の甲羅が美しいアジア産ハコガメ。流通量が限られ上級者向き。湿度高め・やや低めの温度管理が必要。',
    specs: { '最大甲長': '19cm', 'タイプ': '半陸棲', '温度': '22〜26℃', '難易度': '上級' },
    coreSpecs: { size: '19cm', temp: '22〜26℃', lifespan: "保全計画では雌の寿命を50年と推定", diet: '雑食' },
    lifespanEvidence: {"note": "2023年の保全計画は、雌の寿命の中央値を50年と見積もって計算に使っています。モエギハコガメの保全を考えるための仮定で、出生から死亡まで調べた個体の平均ではありません。", "url": "https://www.cpsg.org/sites/default/files/2025-01/AnnamitesRp310323_FINALDRAFT_COVERED_NoKTable.pdf", "source": "Annamites Tortoise and Freshwater Turtle Conservation Plan（2023、付録A2.3）"},
    extraSpecs: {},
    links: [{ label: 'ヤマガメ・ハコガメ 飼育ガイド', href: '../guide-moist.html' }], asin: null,
    slug: 'indochinese-box-turtle', hasPage: true,
    match: function(s){ return (s.advanced||0) >= 2 && (s.advanced_env||0) >= 2 && (s.cooling||0) >= 1; },
    score: function(s){ return (s.advanced||0)+(s.advanced_env||0)+(s.cooling||0)+(s.m_size||0)+(s.asia_box||0); },
    availability: 'reference_only'
  },
  { name: 'ミスジハコガメ', latin: 'Cuora trifasciata', emoji: '🏆', difficulty: '上級', size: '種全体の記録26cm', cites: 'CITES II', legal: 'cites_ii_cb_only', recommendable: false, commerceAllowed: false, riskFlags: ["cites_ii", "iucn_cr", "cb_only", "rare_trade"],
    reason: '3本のラインが走る甲羅が特徴のアジア産超希少ハコガメ。高価で流通が非常に少ない。CB個体を入手できれば本格的なアジアガメ飼育の頂点。',
    specs: { '最大甲長': '26cm（種全体の資料上限）', 'タイプ': '半水棲', '温度': '22〜27℃', '難易度': '上級' },
    coreSpecs: { size: '26cm（種全体の資料上限）', temp: '22〜27℃', lifespan: "旧分類で31年9か月の飼育記録", diet: '雑食' },
    sizeNote: 'TTWG 2025 p.257–258の種全体の最大SCLはオス23cm・メス26cm。海南島の亜種luteocephalaを含み、基亜種trifasciataだけのメス23cmとは区別します。通常成体サイズではありません。',
    lifespanEvidence: {"note": "Slavensの記録集には、1966年に成体で迎えた個体を31年9か月飼育し、報告時も生存していた例があります。産地は不明で、現在では別種のCuora cyclornataも含めた旧分類の記録です。飼育期間は分かりますが、総年齢や現在のミスジハコガメの記録かどうかは確かめられません。", "url": "https://www.pondturtle.com/lturtle.html", "source": "Slavens 飼育記録集（旧分類）"},
    extraSpecs: {},
    links: [{ label: 'ヤマガメ・ハコガメ 飼育ガイド', href: '../guide-moist.html' }], asin: null,
    slug: 'three-striped-box-turtle', hasPage: true,
    match: function(s){ return (s.semi_aquatic||0) >= 1 && (s.advanced||0) >= 3 && (s.advanced_env||0) >= 3; },
    score: function(s){ return (s.semi_aquatic||0)+(s.advanced||0)+(s.advanced_env||0)+(s.cooling||0)+(s.asia_box||0); },
    availability: 'reference_only'
  },
  { name: 'ノコヘリマルガメ', latin: 'Cyclemys dentata', emoji: '🌿', difficulty: '中〜上級', size: 'M（20〜25cm）', cites: 'CITES II', legal: 'cites_ii',
    reason: '東南アジア産の半水棲ガメ。甲羅の縁が鋸歯状でノコギリのような独特の形状が特徴。若い個体はより水棲傾向が強く、成熟につれ陸棲傾向が増す興味深い種。CITES II。',
    specs: { '最大甲長': '25cm', 'タイプ': '半水棲→半陸棲', '温度': '24〜30℃', '難易度': '中〜上級' },
    coreSpecs: { size: '25cm', temp: '24〜30℃', lifespan: "旧記録の現在の種同定が不明", diet: '雑食（植物・水生昆虫）' },
    lifespanEvidence: {"note": "Slavensには、成体から14年8か月飼育された記録があります。ただし、当時Cyclemys dentataと呼ばれていたカメは、後に複数の種に分けられました。産地や分類を調べ直した情報がなく、この個体が現在のノコヘリマルガメに当たるかは不明です。", "url": "https://www.pondturtle.com/lturtle.html", "source": "Slavens 飼育記録集（分類再整理前）"},
    extraSpecs: {},
    links: [{ label: 'ヤマガメ・ハコガメ 飼育ガイド', href: '../guide-moist.html' }], asin: null,
    slug: 'asian-leaf-turtle', hasPage: true,
    match: function(s){ return (s.semi_aquatic||0) >= 2 && (s.intermediate||0) >= 1; },
    score: function(s){ return (s.semi_aquatic||0)+(s.intermediate||0)+(s.m_size||0)+(s.tropical_climate||0)+(s.asia_water||0)+(s.ya_ma||0)+(s.humid_env||0); },
    availability: 'common'
  },
  { name: 'ミナミニシキハコガメ', latin: 'Terrapene ornata', emoji: '🏵️', difficulty: '上級', size: 'M（11〜15cm）', cites: 'CITES II', legal: 'cites_ii',
    reason: 'テキサス州〜メキシコに分布するニシキハコガメの南部個体群（旧・亜種 luteola）。乾燥耐性が高く放射状の美しい甲羅模様が特徴。乾燥系環境を好むハコガメで、キタニシキハコガメよりさらに乾燥に強い。CITES II。',
    specs: { '最大甲長': '17cm（種全体の記録）', 'タイプ': '陸棲', '温度': '22〜32℃', '難易度': '上級' },
    coreSpecs: { size: '17cm（種全体の記録）', temp: '22〜32℃', lifespan: "luteolaの野外調査で40歳超との推定", diet: '雑食（昆虫・果実・草）' },
    sizeNote: 'TFTSGの種概説（Hughesほか2024）とTTWG 2025では、Terrapene ornata全体の最大直線甲長がオス15.7cm・メス17.0cm。このサイトの「キタ」「ミナミ」は産地による呼び分けです。この数値はそれぞれの産地型の最大値でも、一般的な成体サイズでもありません。',
    lifespanEvidence: {"note": "亜種Terrapene ornata luteola（ミナミニシキハコガメ）を23年間調べた研究では、40歳を超えている可能性のある個体が報告されています。年齢には推定が入り、出生から40年間追跡したわけではありません。原論文は要旨と後年の専門家解説までの確認で、平均や上限を決められる資料ではありません。", "url": "https://www.researchgate.net/publication/269793559_Activity_Growth_Reproduction_and_Population_Structure_of_Desert_Box_Turtles_Terrapene_ornata_luteola_at_the_Northern_Edge_of_the_Chihuahuan_Desert", "source": "Germano（2014、要旨）・TFTSG（2024）"},
    extraSpecs: {},
    links: [{ label: 'ヤマガメ・ハコガメ 飼育ガイド', href: '../guide-moist.html' }], asin: null,
    slug: 'desert-box-turtle', hasPage: true,
    match: function(s){ return (s.terrestrial||0) >= 2 && (s.advanced||0) >= 2; },
    score: function(s){ return (s.terrestrial||0)+(s.s_size||0)+(s.advanced||0)+(s.collector||0)+(s.na_box||0)+(s.dry_env||0); },
    availability: 'rare'
  }
],

// ==================== マニアック・特殊ルート ====================
exotic: [
  { name: 'トゲスッポン', latin: 'Apalone spinifera', emoji: '💫', recommendationPriority: 35, difficulty: '上級', size: 'L（30〜50cm）', cites: 'CITES II（atraはI）', legal: null,
    reason: '最も流通量の多いスッポン属。砂底必須・水流弱め・甲羅を傷つけないよう注意。独特の柔らかい甲羅と素早い動きが魅力。',
    legalNote: 'CITES附属書II。ただし亜種 Apalone spinifera atra は附属書Iで、日本では国際希少野生動植物種です。亜種と由来を確認し、atra の国内取引では登録票等の要件を確認してください。',
    specs: { '最大甲長': '50cm（メス）', '水槽サイズ': '90cm〜', '底床': '細かい砂必須', '水温': '24〜30℃' },
    coreSpecs: { size: '50cm（メス）', temp: '24〜30℃', lifespan: "50年を超える可能性（保全資料の推定）", diet: '肉食寄り雑食' },
    lifespanEvidence: {"note": "COSEWICの評価資料では、カナダの基亜種Apalone spinifera spiniferaは50年を超えて生きる可能性があるとされています。出生から50年以上追跡した記録ではなく推定なので、他の亜種を含めた平均寿命には置き換えられません。", "url": "https://www.canada.ca/en/environment-climate-change/services/species-risk-public-registry/cosewic-assessments-status-reports/spiny-softshell-2016.html", "source": "COSEWIC 評価資料（2016）"},
    extraSpecs: { tankSize: '90cm〜', substrate: '細かい砂必須' },
    links: [{ label: 'スッポン・ヘビクビガメ 飼育ガイド', href: '../guide-softshell.html' }], asin: null,
    slug: 'spiny-softshell-turtle', hasPage: true,
    match: function(s){ return (s.softshell||0) >= 2 && (s.advanced||0) >= 2; },
    score: function(s){ return (s.softshell||0)+(s.advanced||0)+(s.budget_high||0)+(s.accessible||0)*2; },
    availability: 'common'
  },
  { name: 'スベスッポン', latin: 'Apalone mutica', emoji: '🫧', difficulty: '上級', size: 'L（25〜35cm）', cites: 'CITES II', legal: null,
    reason: 'トゲスッポンよりキールが目立たない滑らかな甲羅を持つ。砂底必須・水流弱め。スッポン属の中でも温和な個体が多い。',
    specs: { '最大甲長': '35.6cm（メス）', '水槽サイズ': '90cm〜', '底床': '細かい砂必須', '水温': '24〜30℃' },
    coreSpecs: { size: '35.6cm（メス）', temp: '24〜30℃', lifespan: "20年を超える可能性（資料上の推定）", diet: '肉食寄り雑食' },
    lifespanEvidence: {"note": "長寿データベースAnAgeは、野生で20年を超えると推定される個体を紹介しています。最大寿命はまだ定まっておらず、この数字も確定した年齢や平均ではありません。", "url": "https://genomics.senescence.info/species/entry.php?species=Apalone_mutica", "source": "AnAge 長寿データベース"},
    extraSpecs: { tankSize: '90cm〜', substrate: '細かい砂必須' },
    links: [{ label: 'スッポン・ヘビクビガメ 飼育ガイド', href: '../guide-softshell.html' }], asin: null,
    slug: 'smooth-softshell-turtle', hasPage: true,
    match: function(s){ return (s.softshell||0) >= 2 && (s.budget_high||0) >= 1; },
    score: function(s){ return (s.softshell||0)+(s.advanced||0)+(s.budget_high||0); },
    availability: 'rare'
  },
  { name: 'フロリダスッポン', latin: 'Apalone ferox', emoji: '🐊', difficulty: '上級', size: 'L（35〜60cm）', cites: 'CITES II', legal: null,
    reason: 'スッポン属最大種のひとつ。非常に攻撃的で飼育難度が高い。本格的なソフトシェル飼育に挑戦したい経験者向け。',
    specs: { '最大甲長': '60cm（メス）', '水槽サイズ': '120cm〜', '底床': '細かい砂必須', '水温': '25〜30℃' },
    coreSpecs: { size: '60cm（メス）', temp: '25〜30℃', lifespan: "36年8か月の飼育記録", diet: '肉食寄り雑食' },
    lifespanEvidence: {"note": "Slavensの記録集には、スミソニアンの個体が1930年に迎えられ、1967年に死亡するまで36年8か月飼育された記録があります。迎えた時の年齢は不明なので、出生からの年齢や平均寿命とは別です。", "url": "https://www.pondturtle.com/lturtle.html", "source": "Slavens 飼育記録集"},
    extraSpecs: { tankSize: '120cm〜', substrate: '細かい砂必須' },
    links: [{ label: 'スッポン・ヘビクビガメ 飼育ガイド', href: '../guide-softshell.html' }], asin: null,
    slug: 'florida-softshell-turtle', hasPage: true,
    match: function(s){ return (s.softshell||0) >= 2 && (s.budget_max||0) >= 1; },
    score: function(s){ return (s.softshell||0)+(s.advanced||0)+(s.budget_max||0)+(s.expert||0)+(s.ultra_rare||0)*2; },
    availability: 'rare'
  },
  { name: 'スッポンモドキ', latin: 'Carettochelys insculpta', emoji: '🌊', difficulty: '上級', size: 'XL（成体30〜55cm・最大70cm）', cites: 'CITES II', legal: 'cites_ii',
    reason: 'ニューギニア・オーストラリア北部産の大型種。前肢がウミガメのようなヒレ状。26〜30℃の高水温と広い水槽が必須の本格飼育種。',
    specs: { '最大甲長': '70cm', '水槽サイズ': '150cm〜', '底床': '砂利〜砂', '水温': '26〜30℃' },
    coreSpecs: { size: '70cm', temp: '26〜30℃', lifespan: "飼育下で30歳台後半まで生きた例", diet: '雑食（植物多め）' },
    lifespanEvidence: {"note": "スミソニアン国立動物園は、飼育下で30歳台後半まで生きた例を紹介する一方、野生での寿命は不明としています。平均寿命や種の上限が確かめられた数字ではありません。", "url": "https://www.nationalzoo.si.edu/animals/fly-river-turtle", "source": "スミソニアン国立動物園"},
    extraSpecs: { tankSize: '150cm〜', substrate: '砂利〜砂' },
    links: [{ label: 'スッポン・ヘビクビガメ 飼育ガイド', href: '../guide-softshell.html' }], asin: null,
    slug: 'pig-nosed-turtle', hasPage: true,
    match: function(s){ return (s.softshell||0) >= 2 && (s.budget_max||0) >= 2; },
    score: function(s){ return (s.softshell||0)+(s.advanced||0)+(s.budget_max||0)+(s.expert||0)+(s.ultra_rare||0); },
    availability: 'common'
  },
  { name: 'スッポン（シナスッポン）', latin: 'Pelodiscus sinensis', emoji: '🍵', difficulty: '中〜上級', size: '狭義種の記録23cm', cites: null, legal: null,
    reason: '食用としても知られる東アジア産スッポン。ペットとしての飼育者も多く国内流通が安定している。砂底必須・嚙みつき注意。軟らかい甲羅と独特の動きが面白い。',
    specs: { '最大甲長': '23cm（狭義種の資料記録）', '水槽サイズ': '90cm〜', '底床': '細かい砂必須', '水温': '24〜30℃' },
    coreSpecs: { size: '23cm（狭義種の資料記録）', temp: '24〜30℃', lifespan: "野生で15〜20年（動物園の案内）", diet: '肉食寄り雑食' },
    sizeNote: 'TTWG 2025 p.403の狭義Pelodiscus sinensisの最大SCL記録23cm。以前は同じ種に含まれていた仲間や、養殖・販売されるすべての個体の最大値ではありません。以前掲載していた25cmは平均についての説明で、最大値ではありません。',
    lifespanEvidence: {"note": "Reptilia Zooは、野生では通常15〜20年と紹介しています。「平均寿命」の欄にある数字ですが、調査対象・計算方法・元の研究は示されていないため、動物園の案内値として紹介します。", "url": "https://reptilia.org/animal/chinese-softshell-turtle/", "source": "Reptilia Zoo"},
    extraSpecs: { tankSize: '90cm〜', substrate: '細かい砂必須' },
    links: [{ label: 'スッポン・ヘビクビガメ 飼育ガイド', href: '../guide-softshell.html' }], asin: null,
    slug: 'chinese-softshell-turtle', hasPage: true,
    match: function(s){ return (s.softshell||0) >= 2 && (s.intermediate||0) >= 1; },
    score: function(s){ return (s.softshell||0)+(s.intermediate||0)+(s.budget_high||0)+(s.accessible||0); },
    availability: 'common'
  },
  { name: 'アルビノシナスッポン', latin: 'Pelodiscus sinensis（アルビノ）', emoji: '⬜', difficulty: '中〜上級', size: '色彩型固有の記録なし', cites: null, legal: null,
    reason: '白〜クリーム色の体色が美しいシナスッポンのアルビノ個体。アクアスペースなど専門店で入荷確認済み。スッポンの迫力とアルビノの希少感を兼ね備えた観賞種。',
    specs: { '最大甲長': '色彩型固有の記録なし', '水槽サイズ': '90cm〜', '底床': '細かい砂必須', '水温': '24〜30℃' },
    coreSpecs: { size: '色彩型固有の記録なし', temp: '24〜30℃', lifespan: "アルビノ固有の長期記録は未確認", diet: '肉食寄り雑食' },
    sizeNote: 'アルビノという色彩だけでは分類・系統は決まりません。TTWG 2025の狭義P. sinensisには23cmの記録がありますが、アルビノ固有の最大記録ではありません。流通個体の来歴を確認してください。',
    sizeLabel: '甲長の資料',
    lifespanEvidence: {"note": "動物園の案内には「野生では通常15〜20年」とありますが、シナスッポン全体の話です。アルビノの飼育個体を追跡した記録ではありません。アルビノだけの長期記録は見つかっておらず、この数字で寿命を決めることはできません。", "url": "https://reptilia.org/animal/chinese-softshell-turtle/", "source": "Reptilia Zoo（種全体の野生の案内）"},
    extraSpecs: { tankSize: '90cm〜', substrate: '細かい砂必須' },
    links: [{ label: 'スッポン・ヘビクビガメ 飼育ガイド', href: '../guide-softshell.html' }], asin: null,
    slug: 'albino-chinese-softshell', hasPage: true,
    match: function(s){ return (s.softshell||0) >= 2 && (s.intermediate||0) >= 2; },
    score: function(s){ return (s.softshell||0)+(s.intermediate||0)+(s.budget_high||0)+(s.collector_grade||0); },
    availability: 'common'
  },
  { name: 'ノーザンダイヤモンドバックテラピン', latin: 'Malaclemys terrapin terrapin', emoji: '💎', difficulty: '上級', size: 'M（15〜23cm）', cites: 'CITES II', legal: null,
    reason: '汽水（海水と淡水の混合）で飼育する北米唯一の汽水ガメ。独特の菱形模様が美しく専門的な塩分管理が必要。ディープなマニア向き。',
    specs: { '最大甲長': '23cm', '水槽サイズ': '60cm〜', '塩分濃度': '0.5〜1.0%', '水温': '20〜28℃' },
    coreSpecs: { size: '23cm', temp: '20〜28℃', lifespan: "40年を超えることも（州の案内）", diet: '雑食' },
    lifespanEvidence: {"note": "ノースカロライナ州は、寿命が40年を超えることもあると案内しています。州内のノーザンとカロリナを扱う種全体の解説で、平均寿命や、どちらかの亜種の最長記録ではありません。", "url": "https://www.ncwildlife.gov/diamond-back-terrapin-species-profile/open", "source": "ノースカロライナ州野生生物資源委員会"},
    extraSpecs: { tankSize: '60cm〜', salinity: '0.5〜1.0%' },
    links: [{ label: '汽水ガメ 飼育ガイド', href: '../guide-brackish.html' }], asin: null,
    slug: 'northern-diamondback-terrapin', hasPage: true,
    match: function(s){ return (s.brackish||0) >= 3; },
    score: function(s){ return (s.brackish||0)+(s.advanced||0)+(s.budget_high||0)+(s.accessible||0)*2; },
    availability: 'common'
  },
  { name: 'カロリナダイヤモンドバックテラピン', latin: 'Malaclemys terrapin centrata', emoji: '💠', difficulty: '上級', size: 'M（記録上限20.4cm）', cites: 'CITES II', legal: null,
    reason: '最も美しいとも言われるダイヤモンドバックテラピンの亜種。甲羅の同心円模様が見事。国内CB流通が盛んになっている。',
    specs: { '最大甲長': '20.4cm（資料上限）', '水槽サイズ': '60cm〜', '塩分濃度': '0.5〜1.0%', '水温': '20〜28℃' },
    coreSpecs: { size: '20.4cm（資料上限）', temp: '20〜28℃', lifespan: "成体から14年1か月の飼育記録", diet: '雑食' },
    sizeNote: 'TTWG 2025 p.173 掲載の最大直線甲長（SCL）：亜種centrataのオス15.0cm・メス20.4cm。一般的な成体サイズや将来の成長予測ではない。旧23cmは種全体の資料であり、本亜種の最大としては採用しない。',
    lifespanEvidence: {"note": "Slavensには、野生由来の雌を成体から14年1か月飼育した例があります。生まれた年は分かりません。迎える前の年齢を含まない飼育期間で、平均や最長寿命を示すものではありません。", "url": "https://www.pondturtle.com/lturtle.html", "source": "Slavens 飼育記録集"},
    extraSpecs: { tankSize: '60cm〜', salinity: '0.5〜1.0%' },
    links: [{ label: '汽水ガメ 飼育ガイド', href: '../guide-brackish.html' }], asin: null,
    slug: 'carolina-diamondback-terrapin', hasPage: true,
    match: function(s){ return (s.brackish||0) >= 3 && (s.budget_high||0) >= 1; },
    score: function(s){ return (s.brackish||0)+(s.advanced||0)+(s.budget_high||0)+(s.expert||0)+(s.collector_grade||0); },
    availability: 'rare'
  },
  { name: 'オルナータダイヤモンドバックテラピン', latin: 'Malaclemys terrapin macrospilota', emoji: '🔶', difficulty: '上級', size: 'M（13〜20cm）', cites: 'CITES II', legal: null,
    reason: 'フロリダ産の派手な模様を持つダイヤモンドバックテラピンの亜種。国内CB流通が盛ん（アクアスペース2024年入荷確認）。汽水管理が必要だが亜種中で最も流通が多い。',
    specs: { '最大甲長': '20cm', '水槽サイズ': '60cm〜', '塩分濃度': '0.5〜1.0%', '水温': '20〜28℃' },
    coreSpecs: { size: '20cm', temp: '20〜28℃', lifespan: "亜種固有の長期記録は未確認", diet: '雑食' },
    lifespanEvidence: {"note": "ノースカロライナ州には「40年を超えることもある」という案内がありますが、扱っているのは同州のノーザンとカロリナです。オルナータ亜種の長期記録は確認できていません。種全体の案内を、そのまま本亜種の平均や上限にはできません。", "url": "https://www.ncwildlife.gov/diamond-back-terrapin-species-profile/open", "source": "ノースカロライナ州野生生物資源委員会（種全体の案内）"},
    extraSpecs: { tankSize: '60cm〜', salinity: '0.5〜1.0%' },
    links: [{ label: '汽水ガメ 飼育ガイド', href: '../guide-brackish.html' }], asin: null,
    slug: 'ornate-diamondback-terrapin', hasPage: true,
    match: function(s){ return (s.brackish||0) >= 3 && (s.budget_high||0) >= 2; },
    score: function(s){ return (s.brackish||0)+(s.budget_high||0)+(s.advanced||0)+(s.expert||0)+(s.collector_grade||0); },
    availability: 'rare'
  },
  { name: 'ミシシッピダイヤモンドバックテラピン', latin: 'Malaclemys terrapin pileata', emoji: '🐚', difficulty: '上級', size: 'M（13〜23cm）', cites: 'CITES II', legal: null,
    reason: 'メキシコ湾岸の塩性湿地に分布するダイヤモンドバックテラピンの亜種。頭頂が暗色になる個体が多いとされる。国内で亜種を指定した流通は非常に少ない。汽水管理が必須。',
    specs: { '最大甲長': '23cm', '水槽サイズ': '90cm〜', '塩分濃度': '0.5〜1.5%', '水温': '20〜26℃' },
    coreSpecs: { size: '23cm', temp: '20〜26℃', lifespan: "成体から9年1か月の飼育記録", diet: '雑食' },
    lifespanEvidence: {"note": "原記録集には、野生由来の雌を成体から9年1か月飼育した例があります。出生年は不明です。この1頭を飼った期間の話で、「9年ほどしか生きない」という意味ではありません。", "url": "https://webapps.fhsu.edu/ksherp/bibFiles/21870.pdf", "source": "Snider・Bowler 飼育下長寿記録集（1992、p13）"},
    extraSpecs: { tankSize: '90cm〜', salinity: '0.5〜1.5%' },
    links: [{ label: '汽水ガメ 飼育ガイド', href: '../guide-brackish.html' }], asin: null,
    slug: 'mississippi-diamondback-terrapin', hasPage: true,
    match: function(s){ return (s.brackish||0) >= 3 && (s.collector_grade||0) >= 1; },
    score: function(s){ return (s.brackish||0)+(s.advanced||0)+(s.expert||0)+(s.collector_grade||0)+(s.budget_high||0); },
    availability: 'rare'
  },
  { name: 'テキサスダイヤモンドバックテラピン', latin: 'Malaclemys terrapin littoralis', emoji: '🏖️', difficulty: '上級', size: 'M（13〜23cm）', cites: 'CITES II', legal: null,
    reason: 'ダイヤモンドバックテラピンの分布の西端、テキサス州沿岸の亜種。全体に白っぽい体色になる個体が多いとされる。国内で亜種を指定した流通は非常に少ない。汽水管理が必須。',
    specs: { '最大甲長': '23cm', '水槽サイズ': '90cm〜', '塩分濃度': '0.5〜1.5%', '水温': '20〜26℃' },
    coreSpecs: { size: '23cm', temp: '20〜26℃', lifespan: "40年に達する（州の案内）", diet: '雑食' },
    lifespanEvidence: {"note": "テキサス州は、この亜種が40年に達すると案内しています。個体の出生年や観察記録、計算方法は書かれていません。州の解説として紹介していますが、平均寿命や確かめられた上限ではありません。", "url": "https://tpwd.texas.gov/huntwild/wild/species/terrapin/", "source": "Texas Parks and Wildlife"},
    extraSpecs: { tankSize: '90cm〜', salinity: '0.5〜1.5%' },
    links: [{ label: '汽水ガメ 飼育ガイド', href: '../guide-brackish.html' }], asin: null,
    slug: 'texas-diamondback-terrapin', hasPage: true,
    match: function(s){ return (s.brackish||0) >= 3 && (s.collector_grade||0) >= 1; },
    score: function(s){ return (s.brackish||0)+(s.advanced||0)+(s.expert||0)+(s.collector_grade||0)+(s.accessible||0); },
    availability: 'rare'
  },
  { name: 'マングローブダイヤモンドバックテラピン', latin: 'Malaclemys terrapin rhizophorarum', emoji: '🌴', difficulty: '上級', size: 'M（13〜23cm）', cites: 'CITES II', legal: null,
    reason: 'フロリダキーズのマングローブ林に暮らす亜種。亜種名はマングローブの属名 Rhizophora に由来する。首や四肢に縦の縞が出る個体が多いとされる。国内で亜種を指定した流通はほとんどない。汽水管理が必須。',
    specs: { '最大甲長': '23cm', '水槽サイズ': '90cm〜', '塩分濃度': '0.5〜1.5%', '水温': '20〜26℃' },
    coreSpecs: { size: '23cm', temp: '20〜26℃', lifespan: "野外で少なくとも20歳との推定例", diet: '雑食' },
    lifespanEvidence: {"note": "2025年の研究では、調べた656頭のうち7頭が少なくとも20歳と推定されています。捕まえてから再び捕まえるまでの間隔をもとにした年齢で、出生年は確認されていません。平均や最長寿命を調べた数字ではありません。", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12058646/", "source": "Interpreting a Sudden Population Decline in a Long-Lived Species（2025）"},
    extraSpecs: { tankSize: '90cm〜', salinity: '0.5〜1.5%' },
    links: [{ label: '汽水ガメ 飼育ガイド', href: '../guide-brackish.html' }], asin: null,
    slug: 'mangrove-diamondback-terrapin', hasPage: true,
    match: function(s){ return (s.brackish||0) >= 3 && (s.collector_grade||0) >= 1; },
    score: function(s){ return (s.brackish||0)+(s.advanced||0)+(s.expert||0)+(s.collector_grade||0)+(s.accessible||0); },
    availability: 'rare'
  },
  { name: 'オーストラリアナガクビガメ', latin: 'Chelodina longicollis', emoji: '🐍', difficulty: '中〜上級', size: 'M（20〜28cm）', cites: null, legal: null,
    reason: 'オーストラリア産の曲頸類。首が長く蛇のように素早く動く。甲羅に引っ込めず横に曲げる独特の防御行動が印象的。',
    specs: { '最大甲長': '30cm（資料上限）', '水槽サイズ': '60cm〜', '水温': '20〜28℃', '難易度': '中〜上級' },
    coreSpecs: { size: '30cm（資料上限）', temp: '20〜28℃', lifespan: "飼育下で37年以上の文献報告", diet: '肉食（魚・エビ中心）' },
    sizeNote: 'TTWG 2025 p.53 掲載の最大直線甲長（SCL）：オス24.9cm・メス28.2cm。一般的な成体サイズや将来の成長予測ではない。CTTC・Naturalisの30cmという別資料値を保持。TTWGの28.2cmとの資料差があり、絶対的な上限とはしない。',
    lifespanEvidence: {"note": "IUCNの専門家資料には、飼育下で37年以上という文献報告があります。野外の推定年齢とは別の記録です。成体の年齢を推定するのは難しく、この例だけで平均や最長寿命は決められません。", "url": "https://iucn-tftsg.org/wp-content/uploads/file/Accounts/crm_5_031_longicollis_v1_2009.pdf", "source": "IUCN TFTSG 種アカウント（2009）"},
    extraSpecs: { tankSize: '60cm〜' },
    links: [{ label: 'スッポン・ヘビクビガメ 飼育ガイド', href: '../guide-softshell.html' }], asin: null,
    slug: 'eastern-long-necked-turtle', hasPage: true,
    match: function(s){ return (s.snakeneck||0) >= 2; },
    score: function(s){ return (s.snakeneck||0)+(s.intermediate||0)+(s.accessible||0)*2; },
    availability: 'common'
  },
  { name: 'ジーベンロックナガクビガメ', latin: 'Chelodina rugosa', emoji: '🌊', difficulty: '上級', size: 'L（25〜35cm）', cites: null, legal: null,
    reason: 'オーストラリア北部産の大型曲頸類。頑丈な甲羅と大きなサイズが特徴。水中生活が主体で大型水槽が必要な本格派。',
    specs: { '最大甲長': '35cm', '水槽サイズ': '90cm〜', '水温': '24〜30℃', '難易度': '上級' },
    coreSpecs: { size: '35cm', temp: '24〜30℃', lifespan: "30年超という推測（専門家資料）", diet: '肉食寄り雑食' },
    lifespanEvidence: {"note": "2014年の専門家資料は、北部の大型個体が30年を超える可能性に触れています。当時の学名はChelodina oblongaですが、現在のrugosaを指す記述です。野生個体群の寿命データはなく、30年間の追跡で確かめた数字ではありません。", "url": "https://iucn-tftsg.org/wp-content/uploads/file/Accounts/crm_5_077_oblonga_v1_2014.pdf", "source": "IUCN TFTSG 種アカウント（2014、当時の学名oblonga）"},
    extraSpecs: { tankSize: '90cm〜' },
    links: [{ label: 'スッポン・ヘビクビガメ 飼育ガイド', href: '../guide-softshell.html' }], asin: null,
    slug: 'siebenrocks-snake-necked-turtle', hasPage: true,
    match: function(s){ return (s.snakeneck||0) >= 2 && (s.budget_high||0) >= 2; },
    score: function(s){ return (s.snakeneck||0)+(s.advanced||0)+(s.budget_high||0)+(s.expert||0)+(s.ultra_rare||0); },
    availability: 'common'
  },
  { name: 'アフリカヌマヨコクビガメ', latin: 'Pelomedusa subrufa', emoji: '🌍', difficulty: '中〜上級', size: 'M（15〜25cm）', cites: null, legal: null,
    reason: 'アフリカ南部〜東部に分布する曲頸類。比較的安価で入手しやすくなっている。横に首を曲げる独特の行動が面白い。水棲傾向が強い。',
    specs: { '最大甲長': '25cm', '水槽サイズ': '60cm〜', '水温': '24〜29℃', '難易度': '中〜上級' },
    coreSpecs: { size: '25cm', temp: '24〜29℃', lifespan: "旧分類の飼育記録で20年以上", diet: '雑食' },
    lifespanEvidence: {"note": "2008年の専門家資料には、20年以上の飼育記録が載っています。ただし、当時Pelomedusa subrufaにまとめられていたカメは、後に複数種へ分けられました。記録の個体が現在のPelomedusa subrufaかは分からず、本種固有の寿命とは言えません。", "url": "https://iucn-tftsg.org/wp-content/uploads/file/Accounts/crm_5_007_subrufa_v1_2008.pdf", "source": "IUCN TFTSG 種アカウント（2008、再分類前）"},
    extraSpecs: { tankSize: '60cm〜' },
    links: [{ label: 'スッポン・ヘビクビガメ 飼育ガイド', href: '../guide-softshell.html' }], asin: null,
    slug: 'african-helmeted-turtle', hasPage: true,
    match: function(s){ return (s.snakeneck||0) >= 1 && (s.budget_low||0) >= 2; },
    score: function(s){ return (s.snakeneck||0)+(s.intermediate||0)+(s.budget_low||0)+(s.accessible||0)*2; },
    availability: 'common'
  },
  { name: 'ヒメハコヨコクビガメ', latin: 'Pelusios nanus', emoji: '🌊', difficulty: '中級', size: 'S（8〜12cm）', cites: null, legal: null,
    reason: 'アンゴラ・コンゴ民主共和国・ザンビアなど南中央アフリカに分布する世界最小級の曲頸類。腹甲に蝶番を持つハコヨコクビガメ属。水棲寄りだが陸場も使い、浅めの水深と陸場設計が飼育の鍵。実飼育例あり。',
    specs: { '最大甲長': '12cm', '水槽サイズ': '60cm〜', '水温': '26〜28℃', '難易度': '中級' },
    coreSpecs: { size: '12cm', temp: '26〜28℃', lifespan: "長期の個体記録を確認できず", diet: '肉食寄り雑食' },
    lifespanEvidence: {"note": "The Turtle Sourceは、群れを6年間飼育し、最後の2年に繁殖した経験を紹介しています。飼育や繁殖の例はありますが、群れを飼った年数だけでは、一頭が何年生きるかまでは分かりません。", "url": "https://theturtlesource.com/african-dwarf-mud-turtle/", "source": "The Turtle Source（飼育繁殖経験）"},
    extraSpecs: { tankSize: '60cm〜', uvb: 'UVB 1.0〜2.0' },
    links: [{ label: 'スッポン・ヘビクビガメ 飼育ガイド', href: '../guide-softshell.html' }], asin: null,
    slug: 'west-african-mud-turtle', hasPage: true,
    match: function(s){ return (s.snakeneck||0) >= 1 && (s.intermediate||0) >= 1; },
    score: function(s){ return (s.snakeneck||0)+(s.intermediate||0)+(s.budget_low||0)+(s.accessible||0); },
    availability: 'rare'
  },
  { name: 'ヒラリーカエルガメ', latin: 'Phrynops hilarii', emoji: '🐸', difficulty: '上級', size: 'L（30〜40cm）', cites: null, legal: null,
    reason: '南米産曲頸類で流通量が多く、飼育もしやすい入門的曲頸種。下顎のヒゲ状突起がユーモラス。大型になるが水質・水温への許容範囲が広い。2025CB流通確認済み。',
    specs: { '最大甲長': '40cm', '水槽サイズ': '90cm〜', '水温': '20〜28℃', '難易度': '上級' },
    coreSpecs: { size: '40cm', temp: '20〜28℃', lifespan: "成体から37年5か月の飼育記録", diet: '雑食' },
    lifespanEvidence: {"note": "Snider・Bowlerの記録集には、野生由来の成体雄を37年5か月飼育した例があります。すでに成体だったため、実際の年齢はそれより上ですが、出生年は分かりません。平均ではなく、長期飼育の一例です。", "url": "https://webapps.fhsu.edu/ksherp/bibFiles/21870.pdf", "source": "Snider・Bowler 飼育下長寿記録集（1992、p12）"},
    extraSpecs: { tankSize: '90cm〜' },
    links: [{ label: 'スッポン・ヘビクビガメ 飼育ガイド', href: '../guide-softshell.html' }], asin: null,
    slug: 'hilaire-side-necked-turtle', hasPage: true,
    match: function(s){ return (s.snakeneck||0) >= 2 && (s.budget_high||0) >= 1; },
    score: function(s){ return (s.snakeneck||0)+(s.budget_high||0)+(s.advanced||0)+(s.accessible||0); },
    availability: 'rare'
  },
  { name: 'オリノコマタマタ', latin: 'Chelus orinocensis', emoji: '🌿', difficulty: '上級', size: 'L（35〜45cm）', cites: 'CITES II', legal: 'cites_ii',
    reason: 'オリノコ川水系産のマタマタ近縁種。外見はマタマタに酷似するが別種。CITES II。究極の枯れ葉擬態カメをコレクションに加えたい上級者向き。',
    specs: { '最大甲長': '45cm', '水槽サイズ': '90cm〜', '水流': '極弱', '水温': '26〜30℃' },
    coreSpecs: { size: '45cm', temp: '26〜30℃', lifespan: "旧記録の現在の種同定が不明", diet: '肉食（待ち伏せ捕食）' },
    lifespanEvidence: {"note": "マタマタには、成体から35年9か月飼育され、報告時も生きていた雌の記録があります。ただし、2020年に種が分けられる前の記録です。産地や再同定の情報がなく、オリノコマタマタだったかは分かりません。本種の平均や最長寿命には使えない記録です。", "url": "https://www.pondturtle.com/lturtle.html", "source": "Slavens 飼育記録集（再分類前）"},
    extraSpecs: { tankSize: '90cm〜', waterFlow: '極弱' },
    links: [{ label: '水棲ガメ 飼育ガイド', href: '../guide-water-full.html' }], asin: null,
    slug: 'amazon-matamata', hasPage: true,
    match: function(s){ return (s.snakeneck||0) >= 2 && (s.budget_max||0) >= 2; },
    score: function(s){ return (s.snakeneck||0)+(s.budget_max||0)+(s.advanced||0)+(s.expert||0)+(s.ultra_rare||0); },
    availability: 'common'
  },
  { name: 'サソリドロガメ', latin: 'Kinosternon scorpioides', emoji: '🦂', difficulty: '上級', size: 'L（17〜27cm）', cites: 'CITES II', legal: null,
    reason: 'ドロガメ属最大種。中南米広域に分布し複数の亜種が知られる。噛みつき力が非常に強く取り扱いに注意が必要。大型ドロガメ系の迫力と個性を楽しみたいマニア向き。',
    specs: { '最大甲長': '27cm', '水槽サイズ': '90cm〜', '水温': '24〜30℃', '難易度': '上級' },
    coreSpecs: { size: '27cm', temp: '24〜30℃', lifespan: "旧分類の記録では現行種を特定できず", diet: '雑食' },
    lifespanEvidence: {"note": "旧分類の記録には44年8か月の飼育例がありますが、亜種と入手時の年齢が分かりません。また、26年1か月の記録は現在では別種のKinosternon abaxillareです。現在のサソリドロガメの寿命として、そのまま引用できる記録ではありません。", "url": "https://www.pondturtle.com/lturtle.html", "source": "Slavens 飼育記録集（旧分類）"},
    extraSpecs: { tankSize: '90cm〜' },
    links: [{ label: '半水棲ガメ 飼育ガイド', href: '../guide-semi.html' }], asin: null,
    slug: 'scorpion-mud-turtle', hasPage: true,
    match: function(s){ return (s.large_mud||0) >= 2 && (s.advanced||0) >= 2; },
    score: function(s){ return (s.large_mud||0)+(s.advanced||0)+(s.budget_high||0)+(s.collector_grade||0); },
    availability: 'common'
  },
  { name: 'スジオオニオイガメ', latin: 'Staurotypus triporcatus', emoji: '💪', difficulty: '上級', size: 'L（25〜38cm）', cites: 'CITES II', legal: 'cites_ii',
    reason: 'ドロガメ科最大クラス。噛みつき力が極めて強く素手での取り扱い厳禁。CITES II。大型ドロガメ系の究極形として国内での飼育者もいる本格マニア向き種。',
    specs: { '最大甲長': '38cm（メス）', '水槽サイズ': '90cm〜', '水温': '24〜30℃', '難易度': '上級' },
    coreSpecs: { size: '38cm（メス）', temp: '24〜30℃', lifespan: "34年以上の飼育記録・年齢は50歳超と推定", diet: '雑食' },
    lifespanEvidence: {"note": "1981年に成体で迎えた雄が、2016年まで34年9か月飼育された記録があります。IUCNの2026年評価によると、2023年末にも生存し、50歳を超えたとされています。この年齢には、迎えたときの大きさからの推定が入っています。50年間飼育した記録でも、出生年から数えた年齢でもありません。", "url": "https://www.researchgate.net/publication/411200383_Staurotypus_triporcatus_Northern_Giant_Musk_Turtle_Assessment", "source": "IUCN評価（2026、Iverson2016の追跡情報）"},
    extraSpecs: { tankSize: '90cm〜' },
    links: [{ label: '半水棲ガメ 飼育ガイド', href: '../guide-semi.html' }], asin: null,
    slug: 'giant-musk-turtle', hasPage: true,
    match: function(s){ return (s.large_mud||0) >= 3 && (s.advanced||0) >= 2; },
    score: function(s){ return (s.large_mud||0)+(s.advanced||0)+(s.budget_high||0)+(s.expert||0)+(s.ultra_rare||0); },
    availability: 'common'
  },
  { name: 'マッコードナガクビガメ', latin: 'Chelodina mccordi', emoji: '🌿', difficulty: '上級', size: 'M（記録上限24.1cm）', cites: 'CITES II', legal: 'cites_ii',
    reason: 'インドネシア・ロティ島固有の曲頸類。野生個体数が激減しており国内ではCB個体のみ流通。首が長い独特のシルエットが魅力。水温・水質管理が重要な上級者向け希少種。CITES II。',
    specs: { '最大甲長': '24.1cm（資料上限）', '水槽サイズ': '60〜90cm', '水温': '25〜30℃', '難易度': '上級' },
    coreSpecs: { size: '24.1cm（資料上限）', temp: '25〜30℃', lifespan: "本種の長期個体記録は未確認", diet: '雑食（動物食寄り）' },
    sizeNote: 'TTWG 2025 p.54 掲載の最大直線甲長（SCL）：オス20.2cm・メス24.1cm。一般的な成体サイズや将来の成長予測ではない。',
    lifespanEvidence: {"note": "ザグレブ動物園は、野生・動物園のどちらも寿命のデータがないと案内しています。本種の取得日や最後に生存を確認した時期が分かる長期記録は、まだ確認できていません。他のナガクビガメ類の数字で代用せず、本種の記録が必要です。", "url": "https://zoo.hr/mccordova-vijovratka-chelodina-mccordi/", "source": "ザグレブ動物園"},
    extraSpecs: { tankSize: '60〜90cm' },
    links: [{ label: 'スッポン・ヘビクビガメ 飼育ガイド', href: '../guide-softshell.html' }], asin: null,
    slug: 'mccords-snake-necked-turtle', hasPage: true,
    match: function(s){ return (s.snakeneck||0) >= 2 && (s.budget_max||0) >= 1; },
    score: function(s){ return (s.snakeneck||0)+(s.advanced||0)+(s.budget_max||0)+(s.expert||0)+(s.ultra_rare||0)*2+(s.collector||0); },
    availability: 'common'
  },
  { name: 'コウホソナガクビガメ', latin: 'Chelodina colliei', emoji: '🦎', difficulty: '中〜上級', size: 'M（通常30cm未満）', cites: null, legal: null,
    reason: '西オーストラリア南西部産の曲頸類。首が長くヘビのように動かす独特のシルエットが魅力。国内流通あり。オーストラリアナガクビガメ（Chelodina longicollis）と並ぶ人気の曲頸類。',
    specs: { '最大甲長': '約40cm（DWER記載）', '水槽サイズ': '60〜90cm', '水温': '18〜25℃', '難易度': '中〜上級' },
    coreSpecs: { size: '約40cm（DWER記載）', temp: '18〜25℃', lifespan: "40年以上（生息地の自治体の案内）", diet: '雑食（動物食強め）' },
    sizeNote: 'DWERは甲長がほぼ40cm、通常30cm未満と記載。直線甲長かどうかは明記されていません。TTWG 2025は南西オーストラリアの同種をChelodina oblonga（C. collieiは同物異名）として、最大SCLをオス23.3cm・メス31.0cmと掲載。このように資料によって数字が異なり、測り方もそろっているか分からないため、40cmを直線甲長の確定した上限と考えることはできません。',
    lifespanEvidence: {"note": "生息地のCockburn市は、本種が40年以上生きると紹介しています。個体の出生年や年齢の調べ方は書かれていません。自治体の生態紹介として参考にできますが、出生年を確かめた個体記録や平均寿命ではありません。", "url": "https://www.cockburn.wa.gov.au/Environment-and-Waste/Sustainability-and-Conservation/Native-Animals-(1)/Turtles", "source": "西オーストラリア州Cockburn市"},
    extraSpecs: { tankSize: '60〜90cm' },
    links: [{ label: 'スッポン・ヘビクビガメ 飼育ガイド', href: '../guide-softshell.html' }], asin: null,
    slug: 'collier-snake-necked-turtle', hasPage: true,
    match: function(s){ return (s.snakeneck||0) >= 2 && (s.intermediate||0) >= 1; },
    score: function(s){ return (s.snakeneck||0)+(s.intermediate||0)+(s.medium_tank||0)+(s.observational||0)+(s.cool_climate||0)+(s.collector||0); },
    availability: 'common'
  }
],

// ==================== 全カテゴリルート（動的生成） ====================
// allカテゴリは重複管理を廃止し、動的getter に変更（2026-06-24 DB構造修正）
  get all() {
    return this.land.concat(this.aquatic, this.forest, this.exotic);
  }

}; // end SPECIES


// 種別の設備条件。商品の適合・塩分・水深・照射距離を一律に確定する表ではない。
var DIAGNOSIS_EQUIPMENT_CONDITIONS = {};
var _dbtEquipmentConditions = {
  title: 'テラピンの用品を選ぶ前に',
  items: [
    '陸場は全身を水から出して甲羅を乾かせるもの。今の体格だけでなく、成体の大きさと重さも考えて選びます。',
    '室内の陸場ではUVB照明と保温の条件を確認します。ランプの照射距離は器具ごとに確認し、陸場の温度も測ります。',
    '汽水で管理する場合は、ろ過器やヒーターが汽水に対応しているか確認します。飲用の淡水も必要です。',
    '雌雄で体格差が大きいため、容器や陸場は種ページの成体サイズと照らし合わせて選びます。'
  ],
  note: '候補一覧に陸場や照明が出なくても、省略してよいという意味ではありません。下の商品がすべての成体に合うわけではないので、サイズと使用条件を確かめてください。',
  sourceNote: 'テラピン全体の資料を参照しています。ランプの出力・距離や塩分を、6亜種共通の数値として指定していません。',
  sources: [
    {label:'Animal Diversity Web：生態・甲羅干し・淡水摂取',url:'https://animaldiversity.org/accounts/Malaclemys_terrapin/'},
    {label:'Virginia Herpetological Society：ノーザンの生態',url:'https://www.virginiaherpetologicalsociety.com/reptiles/turtles/northern-diamond-back-terrapin/index.php'},
    {label:'CTTC：飼育例（1993年）',url:'https://www.tortoise.org/archives/malaclem.html'}
  ]
};
['northern','carolina','ornate','mississippi','texas','mangrove'].forEach(function(prefix) {
  DIAGNOSIS_EQUIPMENT_CONDITIONS[prefix + '-diamondback-terrapin'] = _dbtEquipmentConditions;
});
DIAGNOSIS_EQUIPMENT_CONDITIONS['west-african-mud-turtle'] = {
  title: 'ヒメハコヨコクビの用品を選ぶ前に',
  items: [
    '水場は甲長程度の浅さをひとつの目安に、体格と泳ぎ方を見て調整します。水面に出やすい足場も用意します。',
    '自分で上り下りでき、全身を乾かせる陸場を用意します。',
    '陸場にはUVB照明と保温を用意し、器具ごとの照射距離と陸場の温度を確認します。',
    '容器は底面を広く取り、ろ過器や保温器具は実際の水量・浅い水位で使えるものを選びます。'
  ],
  note: '大きな水槽や強い機器を選ぶだけでは、浅場と陸場の代わりにはなりません。下の候補とは別に、この条件を確認してください。',
  sourceNote: '飼育者の水深の記録は個別の飼育例です。固定の安全上限として扱っていません。',
  sources: [
    {label:'All About：ヒメハコヨコクビの飼育案内',url:'https://allabout.co.jp/gm/gc/70686/'},
    {label:'たなの飼育記録：3頭の観察例',url:'https://pets.tana.cc/2014-01-20-pelusios-nanus/'}
  ]
};

var _matamataEquipmentConditions = {
  title: 'マタマタの用品を選ぶ前に',
  items: [
    '底に足をつけたまま、首を伸ばして鼻先を水面へ出せる深さに調整します。',
    '水量を増やすために深くするのではなく、底を歩ける広さを確保します。',
    'ヒーターやろ過器は、その水位で使えるかを確認します。大きな水槽向けの機器でも、浅い水位で使えるとは限りません。'
  ],
  note: '候補の水槽・機器が、この条件を満たす組み合わせかは別に確認が必要です。',
  sourceNote: '2021年の分布論文はマタマタとオリノコマタマタの両種を扱います。浅場を利用する生態を参考にした選び方で、固定の水深上限や機器の適合を示すものではありません。',
  sources: [{label:'Cunhaほか（2021）：マタマタ2種の分布・生態',url:'https://www.researchgate.net/publication/352260587_Distribution_of_Chelus_fimbriata_and_Chelus_orinocensis_Testudines_Chelidae'}]
};
['matamata','amazon-matamata'].forEach(function(slug) { DIAGNOSIS_EQUIPMENT_CONDITIONS[slug] = _matamataEquipmentConditions; });
DIAGNOSIS_EQUIPMENT_CONDITIONS['pig-nosed-turtle'] = {
  title: 'スッポンモドキの用品を選ぶ前に',
  items: [
    '成体は大きくなるため、今の体格だけでなく、成長後も泳いで向きを変えられる広さを見込んで水槽を選びます。',
    '水中の隠れ場所を設けます。隠れ家も、成長後の体格に合わせて見直します。',
    '同居では傷つけ合うことがあります。広い水槽なら複数飼育できるとは限りません。'
  ],
  note: '下の水槽を、どの個体にも終生使えるものとして選んではいません。成体の体格と、設置できる広さを先に確認してください。',
  sourceNote: '種概説の飼育節を参照しています。特定の水槽寸法を終生飼育の最低基準として指定してはいません。',
  sources: [{label:'IUCN/SSC TFTSG（2008）：スッポンモドキ種概説・飼育節',url:'https://iucn-tftsg.org/wp-content/uploads/file/Accounts/crm_5_009_insculpta_v1_2008.pdf'}]
};

// 2026-11-12: Species care conditions, not endorsements of the listed products.
DIAGNOSIS_EQUIPMENT_CONDITIONS['japanese-pond-turtle'] = {
  title: 'ニホンイシガメの用品を選ぶ前に',
  items: [
    '水から上がって、全身を乾かせる陸場を用意します。子ガメには登れる高さか、成体には乗っても動かないかを確認します。',
    '屋内では陸場の保温と紫外線照明を整えます。水槽は長さだけでなく、陸場を置いた後の泳ぐ場所と奥行きも見て選びます。',
    '水換えとフィルターの掃除を続け、成長に合わせて陸場や容器を見直します。'
  ],
  note: '一覧の商品が、今の個体や成体になったときの体格に合うかは別に確認します。',
  sourceNote: '国内獣医師のイシガメ・クサガメ・アカミミガメ共通の解説と、イシガメ飼育者の陸場使用例を参考にしています。個人の使用例を全個体共通の基準にはしていません。',
  sources: [
    {label:'エキゾチックアニマル情報室：イシガメ・クサガメ・アカミミガメの飼育',url:'https://www.exoinfo.jp/care/1990/'},
    {label:'飼育者の記録：ニホンイシガメの陸場',url:'https://kame.mr-b9.net/archives/24'}
  ]
};

DIAGNOSIS_EQUIPMENT_CONDITIONS['reeves-turtle'] = {
  title: 'クサガメの用品を選ぶ前に',
  items: [
    '水から全身を出して乾かせる陸場と、そこへ登れる足場を用意します。屋内では紫外線照明と陸場の保温も整えます。',
    '子ガメ用の容器や陸場を、そのまま成体まで使えるとは限りません。体格に合わせて泳ぐ場所と陸場の広さを見直します。',
    'フィルターは水換えと掃除を続けながら使います。加温する場合は、ヒーターの水量・水位の使用条件と保護カバーを確認します。'
  ],
  note: '一覧は比較候補です。水槽の長さだけでなく、奥行き・実際の水量・陸場を置いた後の広さも確認してください。',
  sourceNote: '香港漁農自然護理署のクサガメ向け飼育案内を参考にしています。資料の水深や容器容量を、子ガメを含む全個体の固定基準にはしていません。',
  sources: [{label:'香港漁農自然護理署：クサガメの飼育',url:'https://www.pets.gov.hk/english/proper_care_of_pets/turtles.html'}]
};

DIAGNOSIS_EQUIPMENT_CONDITIONS['musk-turtle'] = {
  title: 'ミシシッピニオイガメの用品を選ぶ前に',
  items: [
    '水面近くで休める足場と、登りやすく全身を乾かせる陸場を用意します。水深は体格や泳ぎ方に合わせて調整します。',
    '屋内では陸場の保温と紫外線照明も確認します。水中で過ごす時間が長くても、陸場を使えるようにしておきます。',
    'フィルターを使っていても水換えと掃除は必要です。容器や器具は、成体の体格と実際に入れる水量に合わせて選びます。'
  ],
  note: '幼体と成体では足場や水深を見直します。掲載された水槽・浮島が、どの個体にも合うという意味ではありません。',
  sourceNote: 'Tree of Life動物病院の本種向け飼育案内を参考にしています。資料にある水深や照明の数値を、そのまま全個体・全製品へ当てはめてはいません。',
  sources: [{label:'Tree of Life動物病院：ミシシッピニオイガメの飼育',url:'https://treeoflifeexotics.vet/education-resource-center/for-clients/turtles/common-musk-turtle-care'}]
};

['red-eared-slider', 'yellow-bellied-slider', 'cumberland-slider'].forEach(function(slug) {
  DIAGNOSIS_EQUIPMENT_CONDITIONS[slug] = {
    title: 'スライダー類の用品を選ぶ前に',
    items: [
      '水中を泳ぎ回れる広さと、全身を支えて乾かせる陸場を用意します。陸場へ登れる通路と、暑い場所から離れられる場所も必要です。',
      '子ガメのときに収まる水槽でも、成長すると広げる必要があります。長辺だけでなく奥行きと実際の水量を確認し、成体になったときの容器も計画します。',
      '屋内では陸場の保温と紫外線照明を整えます。フィルターやヒーターは、水槽の商品名ではなく実際の水量と器具の使用条件を見て選びます。'
    ],
    note: 'RSPCAは甲長25cmの個体に水量400Lという例を示しています。一覧の90cm・120cm水槽が、その条件や全個体の終生飼育を満たすとは限りません。',
    sourceNote: 'アカミミ・キバラ・カンバーランドを対象とするRSPCAの共通案内です。水量の例は同団体の目安で、国内の水槽規格とは区別しています。',
    sources: [{label:'RSPCA：スライダー類の飼育',url:'https://www.rspca.org.uk/adviceandwelfare/pets/other/terrapin'}]
  };
});


// Round 3 aquatic: source-scoped conditions.
DIAGNOSIS_EQUIPMENT_CONDITIONS["eastern-painted-turtle"] = {
  "title": "トウブニシキガメの用品を選ぶ前に",
  "items": [
    "泳ぐ場所と、全身が水から出て乾く陸場を用意します。陸場は乗っても傾いたり沈んだりせず、上りやすいものを選びます。",
    "子ガメに合う容器でも、そのまま成体まで使えるとは限りません。水槽の長さだけでなく奥行きと実際の水量を見て選びます。",
    "屋内では陸場の保温とUVB照明を整えます。ろ過器を使っていても、水換えと掃除は続けます。"
  ],
  "note": "一覧は比較候補です。個体の体格と、陸場を置いた後の広さ・水量に合うかを確認してください。",
  "sourceNote": "動物病院のトウブ・セイブニシキガメ向け案内を参照しています。資料の容量や水深、照明の数値を全個体・全製品共通の基準にはしていません。",
  "sources": [
    {
      "label": "Tree of Life動物病院：トウブ・セイブニシキガメの飼育",
      "url": "https://treeoflifeexotics.vet/education-resource-center/for-clients/turtles/painted-turtle-care"
    }
  ]
};
DIAGNOSIS_EQUIPMENT_CONDITIONS["western-painted-turtle"] = {
  "title": "セイブニシキガメの用品を選ぶ前に",
  "items": [
    "泳ぐ場所と、全身が水から出て乾く陸場を用意します。陸場は乗っても傾いたり沈んだりせず、上りやすいものを選びます。",
    "子ガメに合う容器でも、そのまま成体まで使えるとは限りません。水槽の長さだけでなく奥行きと実際の水量を見て選びます。",
    "屋内では陸場の保温とUVB照明を整えます。ろ過器を使っていても、水換えと掃除は続けます。"
  ],
  "note": "一覧は比較候補です。個体の体格と、陸場を置いた後の広さ・水量に合うかを確認してください。",
  "sourceNote": "動物病院のトウブ・セイブニシキガメ向け案内を参照しています。資料の容量や水深、照明の数値を全個体・全製品共通の基準にはしていません。",
  "sources": [
    {
      "label": "Tree of Life動物病院：トウブ・セイブニシキガメの飼育",
      "url": "https://treeoflifeexotics.vet/education-resource-center/for-clients/turtles/painted-turtle-care"
    }
  ]
};
DIAGNOSIS_EQUIPMENT_CONDITIONS["razorback-musk-turtle"] = {
  "title": "カブトニオイガメの用品を選ぶ前に",
  "items": [
    "水中を動き回れる場所と、上がって休める陸場を用意します。陸場に上がる機会が少なくても、使えるようにしておきます。",
    "子ガメには水面近くで休める足場や隠れ場所を設けます。水深は体格や泳ぎ方を見ながら調整し、陸場へ移れる道も確保します。",
    "食べ残しや汚れを取り除き、ろ過器は実際の水量と水位に合うものを選びます。水換えと器具の掃除も続けます。"
  ],
  "note": "一覧は比較候補です。個体の体格と、陸場を置いた後の広さ・水量に合うかを確認してください。",
  "sourceNote": "Austin’s Turtle Pageの本種向け飼育案内を参照しています。深い水域での飼育にも言及がありますが、全幼体へ深水を勧めるものではありません。この資料だけで個々の照明製品の適合は判断していません。",
  "sources": [
    {
      "label": "Austin’s Turtle Page：カブトニオイガメの飼育案内",
      "url": "https://www.austinsturtlepage.com/Care/cs-razrbk.htm"
    }
  ]
};
DIAGNOSIS_EQUIPMENT_CONDITIONS["loggerhead-musk-turtle"] = {
  "title": "オオアタマヒメニオイガメの用品を選ぶ前に",
  "items": [
    "水中を動き回れる場所と、上がって休める陸場を用意します。陸場に上がる機会が少なくても、使えるようにしておきます。",
    "子ガメには水面近くで休める足場や隠れ場所を設けます。水深は体格や泳ぎ方を見ながら調整し、陸場へ移れる道も確保します。",
    "食べ残しや汚れを取り除き、ろ過器は実際の水量と水位に合うものを選びます。水換えと器具の掃除も続けます。"
  ],
  "note": "一覧は比較候補です。個体の体格と、陸場を置いた後の広さ・水量に合うかを確認してください。",
  "sourceNote": "Austin’s Turtle Pageの本種向け飼育案内を参照しています。深い水域での飼育にも言及がありますが、全幼体へ深水を勧めるものではありません。この資料だけで個々の照明製品の適合は判断していません。",
  "sources": [
    {
      "label": "Austin’s Turtle Page：オオアタマヒメニオイガメの飼育案内",
      "url": "https://www.austinsturtlepage.com/Care/cs-logger.htm"
    }
  ]
};
DIAGNOSIS_EQUIPMENT_CONDITIONS["mississippi-mud-turtle"] = {
  "title": "ミシシッピドロガメの用品を選ぶ前に",
  "items": [
    "陸場を広めに取り、水から上がりやすい構成にします。水中にも登ったり休んだりできる足場を用意します。",
    "特に子ガメは浅い水場から、泳ぎ方と上陸の様子を見て調整します。成体でも水深だけを増やさず、陸場へ移れる道を確保します。",
    "浅い水位でろ過器やヒーターを使えるか、器具の使用条件を確認します。陸場の保温と水換え・掃除も必要です。"
  ],
  "note": "一覧は比較候補です。個体の体格と、陸場を置いた後の広さ・水量に合うかを確認してください。",
  "sourceNote": "Austin’s Turtle Pageのミシシッピドロガメ（旧学名Kinosternon subrubrum hippocrepis）向け案内を参照しています。本文にある成体の水深例や混泳の説明は、幼体や他種へ転用していません。",
  "sources": [
    {
      "label": "Austin’s Turtle Page：ミシシッピドロガメの飼育案内",
      "url": "https://austinsturtlepage.com/Care/cs-mismud.htm"
    }
  ]
};
DIAGNOSIS_EQUIPMENT_CONDITIONS["florida-red-bellied-turtle"] = {
  "title": "フロリダアカハラガメの用品を選ぶ前に",
  "items": [
    "泳ぐための広い水域と、全身を支えて乾かせる陸場を用意します。屋内ではUVB照明と陸場の保温を整えます。",
    "メスはオスより大きく育ちます。子ガメの現在の大きさだけで決めず、成体の体格と旋回できる奥行きも考えて容器を選びます。",
    "ろ過器と、水中を加温する場合のヒーターは、実際に入れる水量と器具の使用条件に合わせます。"
  ],
  "note": "高価格帯の水槽でも、全個体の終生飼育に合うとは限りません。陸場を置いた後の水域と、成体までの飼育場所を確認してください。",
  "sourceNote": "Austin’s Turtle PageのPseudemys nelsoni向け案内を参照しています。掲載された容量は執筆者の目安で、国内の水槽規格や全個体に共通の基準ではありません。",
  "sources": [
    {
      "label": "Austin’s Turtle Page：フロリダアカハラガメの飼育案内",
      "url": "https://www.austinsturtlepage.com/Care/cs-flredbelly.htm"
    }
  ]
};
DIAGNOSIS_EQUIPMENT_CONDITIONS["peninsula-cooter"] = {
  "title": "ペニンシュラクーターの用品を選ぶ前に",
  "items": [
    "成長後も泳げる広さを確保し、全身を水から出せる陸場を用意します。陸場は亀が乗っても倒れないように設置します。",
    "子ガメ時の体格だけで決めず、成体まで使える広さを見込むか、成長に合わせて広げる計画を立てます。長辺だけでなく奥行きと実際の水量も確認します。",
    "屋内ではUVB照明と陸場の保温を整えます。ろ過器を使いながら水換えと掃除を続け、加温器具も水量・水位に合わせます。"
  ],
  "note": "一覧は比較候補です。個体の体格と、陸場を置いた後の広さ・水量に合うかを確認してください。",
  "sourceNote": "両クーターを対象一覧に含むWinter Park動物病院の水棲ガメ共通案内を参照しています。本種だけの推奨容量や水深、個別商品の適合を検証した資料ではありません。",
  "sources": [
    {
      "label": "Winter Park動物病院：水棲ガメの飼育案内",
      "url": "https://wpvet.com/exotic-pets-care-guides/aquatic-turtles/"
    }
  ]
};
DIAGNOSIS_EQUIPMENT_CONDITIONS["river-cooter"] = {
  "title": "リバークーターの用品を選ぶ前に",
  "items": [
    "成長後も泳げる広さを確保し、全身を水から出せる陸場を用意します。陸場は亀が乗っても倒れないように設置します。",
    "子ガメ時の体格だけで決めず、成体まで使える広さを見込むか、成長に合わせて広げる計画を立てます。長辺だけでなく奥行きと実際の水量も確認します。",
    "屋内ではUVB照明と陸場の保温を整えます。ろ過器を使いながら水換えと掃除を続け、加温器具も水量・水位に合わせます。"
  ],
  "note": "一覧は比較候補です。個体の体格と、陸場を置いた後の広さ・水量に合うかを確認してください。",
  "sourceNote": "両クーターを対象一覧に含むWinter Park動物病院の水棲ガメ共通案内を参照しています。本種だけの推奨容量や水深、個別商品の適合を検証した資料ではありません。",
  "sources": [
    {
      "label": "Winter Park動物病院：水棲ガメの飼育案内",
      "url": "https://wpvet.com/exotic-pets-care-guides/aquatic-turtles/"
    }
  ]
};
DIAGNOSIS_EQUIPMENT_CONDITIONS['home-hinge-back-tortoise'] = {
  title: 'ホームセオレの用品を選ぶ前に',
  items: [
    '湿った森林の環境で暮らすリクガメです。乾燥系リクガメと同じ感覚で床材を選ばず、湿り気を保てる環境を用意します。',
    '水を飲んだり浸かったりできる水場を用意します。容器は体格に合わせて選びます。',
    '床材は加温した状態でも湿り気を保てるかを確認します。下の用品欄に、必要量・水場・保温の見方をまとめています。'
  ],
  note: '用品は共通の分類から表示しています。本種の飼育条件をすべて満たすセットとして選んだものではありません。',
  sourceNote: '種概説の飼育節を参照しています。固定の湿度値や、個々の床材製品の適合を指定するものではありません。',
  sources: [{label:'IUCN/SSC TFTSG（2013）：ホームセオレ種概説・飼育節',url:'https://iucn-tftsg.org/wp-content/uploads/file/Accounts/crm_5_070_homeana_v1_2013.pdf'}]
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["eastern-long-necked-turtle"] = {
  "title": "オーストラリアナガクビの用品を選ぶ前に",
  "items": [
    "自分で上れて、全身を水から出せる陸場を用意します。",
    "室内では陸場のUVB照明と保温も確認します。照明が候補に出ていなくても、不要という意味ではありません。",
    "陸場は体格と重さ、照明は設置距離に合わせて選びます。"
  ],
  "note": "下の商品が、この条件を満たす組み合わせかは別に確認が必要です。",
  "sourceNote": "動物病院の飼育案内を参考にしています。古い器具を前提とする照射距離・交換周期は転記していません。",
  "sources": [
    {
      "label": "Inner South動物病院：カメの飼育案内",
      "url": "https://innersouthvets.com.au/wp-content/uploads/2018/05/Caring-for-your-turtle2.pdf"
    }
  ]
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["siebenrocks-snake-necked-turtle"] = {
  "title": "ジーベンロックナガクビの用品を選ぶ前に",
  "items": [
    "自分で上れて、全身を水から出せる陸場を用意します。",
    "室内では陸場のUVB照明と保温も確認します。照明が候補に出ていなくても、不要という意味ではありません。",
    "陸場は体格と重さ、照明は設置距離に合わせて選びます。"
  ],
  "note": "下の商品が、この条件を満たす組み合わせかは別に確認が必要です。",
  "sourceNote": "Chelodina rugosaのメーカー飼育案内を参考にしています。資料掲載の器具を、この一覧の商品へ置き換えて適合確認したものではありません。",
  "sources": [
    {
      "label": "Reptile One：Northern Long Neck Turtle飼育案内",
      "url": "https://reptileone.com.au/care-sheets/Northern-Long-Neck-Turtle.pdf"
    }
  ]
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["african-helmeted-turtle"] = {
  "title": "アフリカヌマヨコクビの用品を選ぶ前に",
  "items": [
    "自分で上れて、全身を水から出せる陸場を用意します。",
    "室内では陸場のUVB照明と保温も確認します。照明が候補に出ていなくても、不要という意味ではありません。",
    "陸場は体格と重さ、照明は設置距離に合わせて選びます。"
  ],
  "note": "下の商品が、この条件を満たす組み合わせかは別に確認が必要です。",
  "sourceNote": "病院の案内はPelomedusaとPelusiosをまとめて扱っています。固定の水深やUVB割合を、本種独自の基準としては採っていません。",
  "sources": [
    {
      "label": "Tree of Life動物病院：アフリカ産ヨコクビガメの飼育",
      "url": "https://treeoflifeexotics.vet/education-resource-center/for-clients/turtles/african-side-necked-turtle-care"
    }
  ]
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["hilaire-side-necked-turtle"] = {
  "title": "ヒラリーカエルガメの用品を選ぶ前に",
  "items": [
    "自分で上れて、全身を水から出せる陸場を用意します。",
    "室内では陸場のUVB照明と保温も確認します。照明が候補に出ていなくても、不要という意味ではありません。",
    "陸場は体格と重さ、照明は設置距離に合わせて選びます。"
  ],
  "note": "下の商品が、この条件を満たす組み合わせかは別に確認が必要です。",
  "sourceNote": "野外の甲羅干しの観察と、動物病院の飼育案内を区別して参照しています。個々の器具の適合を確認したものではありません。",
  "sources": [
    {
      "label": "Tree of Life動物病院：ヒラリーカエルガメの飼育",
      "url": "https://treeoflifeexotics.vet/education-resource-center/for-clients/turtles/hilaire-s-side-neck-turtle-care"
    },
    {
      "label": "2017年研究：野外の甲羅干し観察",
      "url": "https://sedici.unlp.edu.ar/bitstream/handle/10915/109403/Documento_completo.pdf-PDFA.pdf?isAllowed=y&sequence=1"
    }
  ]
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["mccords-snake-necked-turtle"] = {
  "title": "マッコードナガクビの用品を選ぶ前に",
  "items": [
    "動物園の飼育例では、休める枝から陸場へ上がれるようにしています。",
    "その飼育例ではUVB照明と保温照明も設けています。水中で過ごすことが多いからと、陸場と照明を省いた構成にはしません。",
    "陸場は体格と重さ、照明は設置距離に合わせて選びます。"
  ],
  "note": "下の商品が、この条件を満たす組み合わせかは別に確認が必要です。",
  "sourceNote": "Wrocław動物園での4成体の飼育を紹介した記事です。動物園の公式基準や、全個体共通の水深・温度の基準ではありません。",
  "sources": [
    {
      "label": "Terrarium：Wrocław動物園での飼育記述",
      "url": "https://www.terrarium.com.pl/chelodina-mccordi-zolw-wezoszyi-mccorda/"
    }
  ]
};

// 湿地・ハコガメの種別条件。数値の一律適用や商品一式の適合保証ではない。
DIAGNOSIS_EQUIPMENT_CONDITIONS["spotted-turtle"] = {
  "title": "キボシイシガメの用品を選ぶ前に",
  "items": [
    "浅い水場と、体を水から出して休める陸場を用意します。水中にも足をかけて水面へ出られる場所を作ります。",
    "ろ過器やヒーターは、実際に使う浅い水位で動かせるか確認します。水流が強すぎる場合は、向きや流量を調整します。",
    "陸場には上りやすい道を設け、室内ではUVB照明と保温の条件を確認します。"
  ],
  "note": "水槽の容量だけで選ばず、陸場を置いた後に残る水場と、歩いて休める場所も見てください。",
  "sourceNote": "動物病院の飼育案内と専門誌を参照。資料ごとの水深や陸水の比率を、全個体に共通の固定値にはしていません。",
  "sources": [
    {
      "label": "Tree of Life動物病院：キボシイシガメの飼育案内",
      "url": "https://treeoflifeexotics.vet/education-resource-center/for-clients/turtles/american-spotted-turtle-care"
    },
    {
      "label": "Reptiles Magazine：キボシイシガメの飼育案内",
      "url": "https://reptilesmagazine.com/listings/turtles-tortoises-care/spotted-turtle/"
    }
  ]
};
DIAGNOSIS_EQUIPMENT_CONDITIONS["malayan-box-turtle"] = {
  "title": "マレーハコガメの用品を選ぶ前に",
  "items": [
    "水場をよく使うハコガメです。小さな飲み水皿だけで済ませず、体格に合う広い水場と、自分で上り下りできる陸場を用意します。",
    "水場を清潔に保てる構成にし、ろ過器は水量と水位に合わせて選びます。",
    "水温と陸場の温度は別々に確認します。水中を加温する必要がある場合は、水中用の器具とその使用条件を確認してください。"
  ],
  "note": "一覧の水入れや床面ヒーターだけで、水域と水温管理までそろうとは限りません。設置する水場に合わせて必要な設備を確かめてください。",
  "sourceNote": "動物病院のハコガメ飼育案内のうち、本種の説明を参照。研究論文にも陸水を分けた飼育例がありますが、その面積比や飼育頭数を推奨値として流用していません。",
  "sources": [
    {
      "label": "Pismo Beach動物病院：マレーハコガメの水域・温度管理",
      "url": "https://pismobeachvet.com/box-turtle-care/"
    },
    {
      "label": "Heissほか（2008）：マレーハコガメ研究の飼育環境",
      "url": "https://anatomypubs.onlinelibrary.wiley.com/doi/full/10.1002/ar.20695"
    }
  ]
};
DIAGNOSIS_EQUIPMENT_CONDITIONS["ornate-box-turtle"] = {
  "title": "キタニシキハコガメの用品を選ぶ前に",
  "items": [
    "乾いた場所だけでなく、湿り気のある床材に潜れる場所も用意します。空気の湿度と、潜る場所の湿り気は分けて考えます。",
    "隠れ家と日陰、出入りしやすい浅い水場を用意します。床全体を水浸しにするのではなく、湿った場所と乾いた場所を作ります。",
    "室内ではUVB照明と保温を用意し、暖かい側と涼しい側を行き来できる広さを取ります。"
  ],
  "note": "容器に床材・隠れ家・水場を置いた状態で、歩ける床がどれだけ残るか確認してください。",
  "sourceNote": "Tortoise Trustと飼育者の案内を参照。草原の種であることを、床を常に乾かしてよいという意味にはしていません。",
  "sources": [
    {
      "label": "Tortoise Trust：キタニシキハコガメの飼育案内",
      "url": "https://www.tortoisetrust.org/care/cornata.html"
    },
    {
      "label": "Austin’s Turtle Page：キタニシキハコガメの飼育案内",
      "url": "https://www.austinsturtlepage.com/Care/cs-ornateboxie.htm"
    }
  ]
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["russian-tortoise"] = {
  "title": "ロシアリクガメの用品を選ぶ前に",
  "items": [
    "容器は体格と成体に必要な床面積で選び、隠れ家や水入れを置いても歩ける場所を残します。",
    "体を浸せて出入りできる水場と、暖かい側・涼しい側に休める場所を用意します。",
    "UVBと保温は設置距離と実際の温度を確認します。広い飼育場では設備を増やすこともあります。",
    "床材は掘れることに加え、濡れた状態が続かないことも確認します。"
  ],
  "sources": [
    {
      "label": "RVC：地中海リクガメの飼育（2024）",
      "url": "https://www.rvc.ac.uk/Media/Default/Beaumont%20Sainsbury%20Animal%20Hospital/EXOTICS/Animal%20Care%20Factsheets/Mediterranean%20tortoise%20care%202024%20jh.pdf"
    }
  ],
  "note": "候補の合計には、床材の必要な袋数や追加する設備の費用までは含まれていません。"
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["hermann-tortoise"] = {
  "title": "ヘルマンリクガメの用品を選ぶ前に",
  "items": [
    "容器は体格と成体に必要な床面積で選び、隠れ家や水入れを置いても歩ける場所を残します。",
    "体を浸せて出入りできる水場と、暖かい側・涼しい側に休める場所を用意します。",
    "UVBと保温は設置距離と実際の温度を確認します。広い飼育場では設備を増やすこともあります。",
    "特に子ガメは乾かしすぎに注意し、床の湿り気と換気を両立させます。"
  ],
  "sources": [
    {
      "label": "RVC：地中海リクガメの飼育（2024）",
      "url": "https://www.rvc.ac.uk/Media/Default/Beaumont%20Sainsbury%20Animal%20Hospital/EXOTICS/Animal%20Care%20Factsheets/Mediterranean%20tortoise%20care%202024%20jh.pdf"
    }
  ],
  "note": "候補の合計には、床材の必要な袋数や追加する設備の費用までは含まれていません。"
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["greek-tortoise"] = {
  "title": "ギリシャリクガメの用品を選ぶ前に",
  "items": [
    "容器は体格と成体に必要な床面積で選び、隠れ家や水入れを置いても歩ける場所を残します。",
    "体を浸せて出入りできる水場と、暖かい側・涼しい側に休める場所を用意します。",
    "UVBと保温は設置距離と実際の温度を確認します。広い飼育場では設備を増やすこともあります。",
    "産地や亜種で湿度や冬の管理が異なります。飼う個体の由来を確認して設備を選びます。"
  ],
  "sources": [
    {
      "label": "RVC：地中海リクガメの飼育（2024）",
      "url": "https://www.rvc.ac.uk/Media/Default/Beaumont%20Sainsbury%20Animal%20Hospital/EXOTICS/Animal%20Care%20Factsheets/Mediterranean%20tortoise%20care%202024%20jh.pdf"
    }
  ],
  "note": "候補の合計には、床材の必要な袋数や追加する設備の費用までは含まれていません。"
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["elongated-tortoise"] = {
  "title": "エロンガータの用品を選ぶ前に",
  "items": [
    "湿った床と換気を両立させ、強い光を避けて休める隠れ家を用意します。",
    "体を浸せて、無理なく出入りできる水場が必要です。用品一覧に水入れがない場合も別に用意します。",
    "成長後の広さも考えて容器を選びます。価格帯が上がれば成体まで使える、という分け方ではありません。"
  ],
  "sources": [
    {
      "label": "Tortoise Trust：エロンガータの飼育",
      "url": "https://www.tortoisetrust.org/Downloads/Elongata.pdf"
    }
  ],
  "note": "候補の合計には、床材の必要な袋数や追加する設備の費用までは含まれていません。"
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["red-footed-tortoise"] = {
  "title": "アカアシリクガメの用品を選ぶ前に",
  "items": [
    "湿り気を保てる床と換気の両方が必要です。暖かい側・涼しい側に休める場所を作ります。",
    "室内ではUVBと保温を用意し、照明から離れて休める場所も残します。",
    "成長後の床面積と体格に合う水場を確保します。植物性中心の配合飼料だけで食事全体がそろうわけではありません。"
  ],
  "sources": [
    {
      "label": "RVC：アカアシの飼育",
      "url": "https://www.rvc.ac.uk/Media/Default/small-animal/documents/Red-foot-tortoise-care-sheet%202016-1.pdf"
    }
  ],
  "note": "候補の合計には、床材の必要な袋数や追加する設備の費用までは含まれていません。"
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["sulcata-tortoise"] = {
  "title": "ケヅメリクガメの用品を選ぶ前に",
  "items": [
    "成体には既製ケージだけでなく、歩き回れる強固な飼育場が必要です。掘る力・押す力に耐える囲いも計画します。",
    "屋外でも日陰と水場を用意し、寒い時期に使える加温した屋内スペースを確保します。",
    "幼体の用品と成体の設備は分けて考えます。掲載された加温器具だけで飼育場全体を保温できるとは限りません。"
  ],
  "sources": [
    {
      "label": "Tortoise Trust：ケヅメの飼育例",
      "url": "https://www.tortoisetrust.org/Downloads/Sulcata.pdf"
    }
  ],
  "note": "候補の合計には、床材の必要な袋数や追加する設備の費用までは含まれていません。"
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["aldabra-tortoise"] = {
  "title": "アルダブラゾウガメの用品を選ぶ前に",
  "items": [
    "大きく育った個体には、歩き回れる飼育場と体格に合う出入り口・囲いが必要です。掲載ケージは成体の飼育場の代わりにはなりません。",
    "日陰と水場を用意し、容器の縁を越えて飲んだり出入りしたりできるか確認します。",
    "寒い時期の屋内スペースと加温設備も含めて計画します。工事や大型設備の費用は用品候補の合計とは別です。"
  ],
  "sources": [
    {
      "label": "Aldabra Giant Tortoises UK：飼育場の実例",
      "url": "https://www.aldabragianttortoises.co.uk/should-i-get-a-tortoise/recommendations-of-things-to-include-in-your-tortoise-house-and-pen"
    }
  ],
  "note": "候補の合計には、床材の必要な袋数や追加する設備の費用までは含まれていません。"
};

DIAGNOSIS_EQUIPMENT_CONDITIONS['leopard-tortoise'] = {
  "title": "ヒョウモンリクガメの用品を選ぶ前に",
  "items": [
    "成体には歩き回れる広さと、体が収まる隠れ家・水場を用意します。候補のケージだけで終生飼えるとは限りません。",
    "暖まる場所と涼しい場所を分け、亀がいる高さで温度を測ります。UVBランプは製品ごとの設置距離を確認してください。",
    "掘れる床材と、湿り気のある隠れ家を用意し、清潔に保ちます。水場や隠れ家を置いた後にも歩ける場所を残します。"
  ],
  "note": "広い飼育場所の整備や追加の床材・隠れ家・水場にかかる費用は、用品候補の合計に含まれていません。",
  "sourceNote": "ヒョウモンリクガメの飼育資料をもとにした確認事項です。掲載商品の適合や、必要な個数まで保証するものではありません。",
  "sources": [
    {
      "label": "RVC：Leopard tortoise care（2024）",
      "url": "https://www.rvc.ac.uk/Media/Default/Beaumont%20Sainsbury%20Animal%20Hospital/EXOTICS/Animal%20Care%20Factsheets/Leopard%20tortoise%20care%202024%20jh.pdf"
    },
    {
      "label": "Tree of Life Exotic Pet Medical Center：Leopard Tortoise Care",
      "url": "https://treeoflifeexotics.vet/education-resource-center/for-clients/tortoises/leopard-tortoise-care"
    }
  ]
};

DIAGNOSIS_EQUIPMENT_CONDITIONS['impressed-tortoise'] = {
  "title": "インプレッサムツアシガメの用品を選ぶ前に",
  "items": [
    "潜れる湿った落ち葉や床材、隠れ家、出入りしやすい浅い水場を用意します。",
    "暑さを避けられる場所だけでなく、冷え込んだときに暖まれる場所も必要です。部屋全体を冷やすだけでなく、隠れ家と活動場所の温度を測ります。",
    "キノコを中心に、野菜など植物性の餌も組み合わせます。一般的なリクガメ用フードだけで食事がそろうとは考えず、食べているものを確認します。"
  ],
  "note": "追加の床材や水場、室温管理、食材の費用は用品候補の合計に含まれていません。",
  "sourceNote": "動物園の飼育報告と欧州の幼体・亜成体の飼育記録を参考にしています。掲載商品の適合や、日本での一律の温度設定を示すものではありません。",
  "sources": [
    {
      "label": "Jason Brock（Zoo Atlanta）：Keeping and Breeding Impressed Tortoises（2009）",
      "url": "https://journals.ku.edu/reptilesandamphibians/article/download/15951/14232"
    },
    {
      "label": "Gaby Herzog：Notes on the Captive Husbandry of F1 Impressed Tortoises in Europe（2014、p.68）",
      "url": "https://colombia.wcs.org/Portals/113/TSA-Magazine-2014.pdf"
    }
  ]
};

DIAGNOSIS_EQUIPMENT_CONDITIONS['spenglers-leaf-turtle'] = {
  "title": "スペングラーの用品を選ぶ前に",
  "items": [
    "湿り気を保てる床材と、落ち葉やコルクなどの隠れ場所を用意します。床材は容器の面積と敷く厚さに合わせてそろえます。",
    "水を飲んだり体を浸したりできる、出入りしやすい浅い水場も用意します。候補に水入れがなくても、不要という意味ではありません。",
    "複数飼育では隠れ場所や水場の取り合いにも注意が必要です。参考にした飼育団体は成体・幼体を個別に飼育しています。"
  ],
  "note": "水入れや追加の隠れ家、床材の必要量によって費用は変わります。",
  "sourceNote": "theTurtleRoomの飼育例を参考にしています。個別商品の適合や一律のUVB出力を示す資料ではありません。",
  "sources": [
    {
      "label": "theTurtleRoom：Geoemyda spengleri（Captive Habitat）",
      "url": "https://theturtleroom.org/species-profile/geoemyda-spengleri/"
    }
  ]
};

DIAGNOSIS_EQUIPMENT_CONDITIONS['brown-wood-turtle-manni'] = {
  "title": "マンヤマガメの用品を選ぶ前に",
  "items": [
    "湿った床と隠れ場所に加え、体を浸せて出入りしやすい浅い水場を用意します。小さな飲み水皿だけで済ませず、体格に合わせて選びます。",
    "陸場と水場を配置した後も、歩き回れる広さを残します。種ページの90cmは当サイトの目安で、参考にした動物病院は成体1匹に120×60cm以上を案内しています。",
    "暖まる場所と日陰を分け、床の温度や湿り気を確認します。UVBランプは対応器具と照射距離を確認して設置します。"
  ],
  "note": "水場や追加の床材、広い容器への変更にかかる費用は、用品候補の合計とは別に見込んでください。",
  "sourceNote": "Rhinoclemmys pulcherrima manniを対象にした動物病院の飼育案内です。他の亜種へそのまま当てはめるものではありません。",
  "sources": [
    {
      "label": "Tree of Life Exotic Pet Medical Center：Painted Central American Wood Turtle Care",
      "url": "https://treeoflifeexotics.vet/education-resource-center/for-clients/turtles/painted-central-american-wood-turtle-care"
    }
  ]
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["marginated-tortoise"] = {
  "title": "フチゾリリクガメの用品を選ぶ前に",
  "items": [
    "ケージは長辺だけでなく床面積も見て選び、隠れ家と浅い水入れを用意します。",
    "暖まる場所と熱を避ける場所を分けます。UVBランプは設置距離を確認し、間にガラスを挟まないようにします。",
    "冬の管理は亜種や産地で異なります。名前だけで冬眠させる前提にせず、冬も使える保温設備と温度計を準備します。"
  ],
  "note": "隠れ家や水場、床材を置いた後にも歩ける広さを残します。追加設備や室温管理の費用は用品候補の合計に含まれません。",
  "sourceNote": "地中海沿岸のリクガメに共通する設備の案内を参考にしています。温湿度や冬の管理は、種類と産地に合わせて考えます。",
  "sources": [
    {
      "label": "RVC：Mediterranean tortoise care（2024）",
      "url": "https://www.rvc.ac.uk/Media/Default/Beaumont%20Sainsbury%20Animal%20Hospital/EXOTICS/Animal%20Care%20Factsheets/Mediterranean%20tortoise%20care%202024%20jh.pdf"
    },
    {
      "label": "LafeberVet：Greek tortoise",
      "url": "https://lafeber.com/vet/basic-information-sheet-greek-or-spur-thighed-tortoise/"
    }
  ]
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["iberian-greek-tortoise"] = {
  "title": "イベラギリシャリクガメの用品を選ぶ前に",
  "items": [
    "ケージは長辺だけでなく床面積も見て選び、隠れ家と浅い水入れを用意します。",
    "暖まる場所と熱を避ける場所を分けます。UVBランプは設置距離を確認し、間にガラスを挟まないようにします。",
    "冬の管理は亜種や産地で異なります。名前だけで冬眠させる前提にせず、冬も使える保温設備と温度計を準備します。"
  ],
  "note": "隠れ家や水場、床材を置いた後にも歩ける広さを残します。追加設備や室温管理の費用は用品候補の合計に含まれません。",
  "sourceNote": "地中海沿岸のリクガメに共通する設備の案内を参考にしています。温湿度や冬の管理は、種類と産地に合わせて考えます。",
  "sources": [
    {
      "label": "RVC：Mediterranean tortoise care（2024）",
      "url": "https://www.rvc.ac.uk/Media/Default/Beaumont%20Sainsbury%20Animal%20Hospital/EXOTICS/Animal%20Care%20Factsheets/Mediterranean%20tortoise%20care%202024%20jh.pdf"
    },
    {
      "label": "LafeberVet：Greek tortoise",
      "url": "https://lafeber.com/vet/basic-information-sheet-greek-or-spur-thighed-tortoise/"
    }
  ]
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["tunisian-greek-tortoise"] = {
  "title": "チュニジアギリシャリクガメの用品を選ぶ前に",
  "items": [
    "ケージは長辺だけでなく床面積も見て選び、隠れ家と浅い水入れを用意します。",
    "暖まる場所と熱を避ける場所を分けます。UVBランプは設置距離を確認し、間にガラスを挟まないようにします。",
    "寒く湿った環境が続かないようにします。冬や悪天候時に使う屋内設備も用意し、他のギリシャリクガメと同じ冬眠管理にはしません。"
  ],
  "note": "隠れ家や水場、床材を置いた後にも歩ける広さを残します。追加設備や室温管理の費用は用品候補の合計に含まれません。",
  "sourceNote": "地中海沿岸のリクガメに共通する設備の案内を参考にしています。温湿度や冬の管理は、種類と産地に合わせて考えます。",
  "sources": [
    {
      "label": "RVC：Mediterranean tortoise care（2024）",
      "url": "https://www.rvc.ac.uk/Media/Default/Beaumont%20Sainsbury%20Animal%20Hospital/EXOTICS/Animal%20Care%20Factsheets/Mediterranean%20tortoise%20care%202024%20jh.pdf"
    },
    {
      "label": "LafeberVet：Greek tortoise",
      "url": "https://lafeber.com/vet/basic-information-sheet-greek-or-spur-thighed-tortoise/"
    },
    {
      "label": "Tortoise Trust：Tunisian tortoise care（2025）",
      "url": "https://www.tortoisetrust.com/post/tunisian-tortoise-care-updated"
    }
  ]
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["moroccan-greek-tortoise"] = {
  "title": "モロッコギリシャリクガメの用品を選ぶ前に",
  "items": [
    "ケージは長辺だけでなく床面積も見て選び、隠れ家と浅い水入れを用意します。",
    "暖まる場所と熱を避ける場所を分けます。UVBランプは設置距離を確認し、間にガラスを挟まないようにします。",
    "冬の管理は亜種や産地で異なります。名前だけで冬眠させる前提にせず、冬も使える保温設備と温度計を準備します。"
  ],
  "note": "隠れ家や水場、床材を置いた後にも歩ける広さを残します。追加設備や室温管理の費用は用品候補の合計に含まれません。",
  "sourceNote": "地中海沿岸のリクガメに共通する設備の案内を参考にしています。温湿度や冬の管理は、種類と産地に合わせて考えます。",
  "sources": [
    {
      "label": "RVC：Mediterranean tortoise care（2024）",
      "url": "https://www.rvc.ac.uk/Media/Default/Beaumont%20Sainsbury%20Animal%20Hospital/EXOTICS/Animal%20Care%20Factsheets/Mediterranean%20tortoise%20care%202024%20jh.pdf"
    },
    {
      "label": "LafeberVet：Greek tortoise",
      "url": "https://lafeber.com/vet/basic-information-sheet-greek-or-spur-thighed-tortoise/"
    }
  ]
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["libyan-greek-tortoise"] = {
  "title": "リビアギリシャリクガメの用品を選ぶ前に",
  "items": [
    "ケージは長辺だけでなく床面積も見て選び、隠れ家と浅い水入れを用意します。",
    "暖まる場所と熱を避ける場所を分けます。UVBランプは設置距離を確認し、間にガラスを挟まないようにします。",
    "冬の管理は亜種や産地で異なります。名前だけで冬眠させる前提にせず、冬も使える保温設備と温度計を準備します。"
  ],
  "note": "隠れ家や水場、床材を置いた後にも歩ける広さを残します。追加設備や室温管理の費用は用品候補の合計に含まれません。",
  "sourceNote": "地中海沿岸のリクガメに共通する設備の案内を参考にしています。温湿度や冬の管理は、種類と産地に合わせて考えます。",
  "sources": [
    {
      "label": "RVC：Mediterranean tortoise care（2024）",
      "url": "https://www.rvc.ac.uk/Media/Default/Beaumont%20Sainsbury%20Animal%20Hospital/EXOTICS/Animal%20Care%20Factsheets/Mediterranean%20tortoise%20care%202024%20jh.pdf"
    },
    {
      "label": "LafeberVet：Greek tortoise",
      "url": "https://lafeber.com/vet/basic-information-sheet-greek-or-spur-thighed-tortoise/"
    }
  ]
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["eastern-hermann-tortoise"] = {
  "title": "ヒガシヘルマンリクガメの用品を選ぶ前に",
  "items": [
    "ケージは長辺だけでなく床面積も見て選び、隠れ家と浅い水入れを用意します。",
    "暖まる場所と熱を避ける場所を分けます。UVBランプは設置距離を確認し、間にガラスを挟まないようにします。",
    "冬の管理は亜種や産地で異なります。名前だけで冬眠させる前提にせず、冬も使える保温設備と温度計を準備します。"
  ],
  "note": "隠れ家や水場、床材を置いた後にも歩ける広さを残します。追加設備や室温管理の費用は用品候補の合計に含まれません。",
  "sourceNote": "地中海沿岸のリクガメに共通する設備の案内を参考にしています。温湿度や冬の管理は、種類と産地に合わせて考えます。",
  "sources": [
    {
      "label": "RVC：Mediterranean tortoise care（2024）",
      "url": "https://www.rvc.ac.uk/Media/Default/Beaumont%20Sainsbury%20Animal%20Hospital/EXOTICS/Animal%20Care%20Factsheets/Mediterranean%20tortoise%20care%202024%20jh.pdf"
    },
    {
      "label": "LafeberVet：Greek tortoise",
      "url": "https://lafeber.com/vet/basic-information-sheet-greek-or-spur-thighed-tortoise/"
    }
  ]
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["western-hermann-tortoise"] = {
  "title": "ニシヘルマンリクガメの用品を選ぶ前に",
  "items": [
    "ケージは長辺だけでなく床面積も見て選び、隠れ家と浅い水入れを用意します。",
    "暖まる場所と熱を避ける場所を分けます。UVBランプは設置距離を確認し、間にガラスを挟まないようにします。",
    "冬の管理は亜種や産地で異なります。名前だけで冬眠させる前提にせず、冬も使える保温設備と温度計を準備します。"
  ],
  "note": "隠れ家や水場、床材を置いた後にも歩ける広さを残します。追加設備や室温管理の費用は用品候補の合計に含まれません。",
  "sourceNote": "地中海沿岸のリクガメに共通する設備の案内を参考にしています。温湿度や冬の管理は、種類と産地に合わせて考えます。",
  "sources": [
    {
      "label": "RVC：Mediterranean tortoise care（2024）",
      "url": "https://www.rvc.ac.uk/Media/Default/Beaumont%20Sainsbury%20Animal%20Hospital/EXOTICS/Animal%20Care%20Factsheets/Mediterranean%20tortoise%20care%202024%20jh.pdf"
    },
    {
      "label": "LafeberVet：Greek tortoise",
      "url": "https://lafeber.com/vet/basic-information-sheet-greek-or-spur-thighed-tortoise/"
    }
  ]
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["golden-greek-tortoise"] = {
  "title": "ゴールデンギリシャリクガメの用品を選ぶ前に",
  "items": [
    "ケージは長辺だけでなく床面積も見て選び、隠れ家と浅い水入れを用意します。",
    "暖まる場所と熱を避ける場所を分けます。UVBランプは設置距離を確認し、間にガラスを挟まないようにします。",
    "冬の管理は亜種や産地で異なります。名前だけで冬眠させる前提にせず、冬も使える保温設備と温度計を準備します。"
  ],
  "note": "隠れ家や水場、床材を置いた後にも歩ける広さを残します。追加設備や室温管理の費用は用品候補の合計に含まれません。",
  "sourceNote": "地中海沿岸のリクガメに共通する設備の案内を参考にしています。温湿度や冬の管理は、種類と産地に合わせて考えます。",
  "sources": [
    {
      "label": "RVC：Mediterranean tortoise care（2024）",
      "url": "https://www.rvc.ac.uk/Media/Default/Beaumont%20Sainsbury%20Animal%20Hospital/EXOTICS/Animal%20Care%20Factsheets/Mediterranean%20tortoise%20care%202024%20jh.pdf"
    },
    {
      "label": "LafeberVet：Greek tortoise",
      "url": "https://lafeber.com/vet/basic-information-sheet-greek-or-spur-thighed-tortoise/"
    }
  ]
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["cherry-head-tortoise"] = {
  "title": "チェリーヘッドアカアシリクガメの用品を選ぶ前に",
  "items": [
    "湿り気を保てる床材と、光を避けて休める隠れ家を用意します。",
    "浅い水場は出入りしやすく、体が収まるものを選びます。水替えできる位置に置きます。",
    "暖まる場所だけでなく日陰も残します。成長後の体に合わせて、歩ける床面積と隠れ家の大きさを見直します。"
  ],
  "note": "隠れ家や水場、床材を置いた後にも歩ける広さを残します。追加設備や室温管理の費用は用品候補の合計に含まれません。",
  "sourceNote": "アカアシリクガメの飼育資料を参考にしています。チェリーヘッドだけを対象にした飼育試験ではありません。",
  "sources": [
    {
      "label": "Tortoise Library：Chelonoidis",
      "url": "https://tortoiselibrary.com/species-information-2/chelonoidis/"
    }
  ]
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["bowsprit-tortoise"] = {
  "title": "ソリガメの用品を選ぶ前に",
  "items": [
    "水はけのよい床材と、身を隠せる場所を用意します。屋外なら雨水がたまらない場所を選びます。",
    "浅い水入れは出入りしやすく置き、日なたと日陰の両方を残します。",
    "よく動くため、設備を並べた後の床面積も確認します。オス同士を同居させる前提でケージを選ばないようにします。"
  ],
  "note": "隠れ家や水場、床材を置いた後にも歩ける広さを残します。追加設備や室温管理の費用は用品候補の合計に含まれません。",
  "sourceNote": "ソリガメの飼育者の実例を参考にしています。海外での屋外飼育時期は、日本の気候にそのまま当てはめずに考えます。",
  "sources": [
    {
      "label": "Chris Leone：Angulate Tortoise（飼育記録）",
      "url": "https://reptilesmagazine.com/the-angulate-tortoise-of-south-africa/"
    }
  ]
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["pancake-tortoise"] = {
  "title": "パンケーキリクガメの用品を選ぶ前に",
  "items": [
    "登れるため、壁の高さだけでなく上部から抜け出せない構造を確認します。",
    "岩のすき間を模した隠れ家は、重い石が崩れないように固定します。",
    "浅い水場と暖まる場所、熱を避ける隠れ家を分けます。UVBランプは製品ごとの照射距離を確認します。"
  ],
  "note": "隠れ家や水場、床材を置いた後にも歩ける広さを残します。追加設備や室温管理の費用は用品候補の合計に含まれません。",
  "sourceNote": "パンケーキリクガメの飼育資料を参考にしています。",
  "sources": [
    {
      "label": "Zoo Med：Pancake Tortoise",
      "url": "https://zoomed.com/pancake-tortoise/"
    }
  ]
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["chaco-tortoise"] = {
  "title": "チャコリクガメの用品を選ぶ前に",
  "items": [
    "歩ける場所と、夜間や悪天候に退避できる屋内設備を用意します。",
    "床材を敷き、保温器具は温度を測りながら使います。古い飼育例の器具やワット数をそのまま再現する必要はありません。",
    "同居個体をひっくり返す行動が報告されています。複数飼育では分けて飼える場所も確保します。"
  ],
  "note": "隠れ家や水場、床材を置いた後にも歩ける広さを残します。追加設備や室温管理の費用は用品候補の合計に含まれません。",
  "sourceNote": "チャコリクガメの過去の飼育記録を参考にしています。古い器具や設定値を、そのまま現在の製品に当てはめてはいません。",
  "sources": [
    {
      "label": "Heinz Wermuth：Chaco tortoise飼育記録（1967、翻訳再録）",
      "url": "https://www.anapsid.org/chaco2.html"
    }
  ]
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["bell-hinge-back-tortoise"] = {
  "title": "ベルセオレガメの用品を選ぶ前に",
  "items": [
    "湿り気を残せる床材と隠れ家を用意します。乾燥系の用品候補だけで環境がそろうとは限りません。",
    "体が収まり、無理なく出入りできる水場を用意します。",
    "植物だけを食べるリクガメと同じ食事にはしません。購入時に食べていた餌と種類を確認して、食材も準備します。"
  ],
  "note": "隠れ家や水場、床材を置いた後にも歩ける広さを残します。追加設備や室温管理の費用は用品候補の合計に含まれません。",
  "sourceNote": "分類が見直される前のセオレガメ類の資料を参考にしています。現在のベルセオレガメだけの温湿度や食事の配分を示すものではありません。",
  "sources": [
    {
      "label": "Tortoise Trust：Kinixys属の飼育",
      "url": "https://www.tortoisetrust.org/care/ckinixys.html"
    }
  ]
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["wood-turtle"] = {
  "title": "モリイシガメの用品を選ぶ前に",
  "items": [
    "水中だけでなく、歩ける陸地と日陰も確保します。",
    "水場から陸へ移れる足場を作り、水温と日陰の温度を別々に確認します。"
  ],
  "note": "水場や隠れ家を置いた後の広さも確認します。追加設備や床材の費用は、用品候補の合計とは別にかかります。",
  "sourceNote": "モリイシガメの飼育資料を参考にしています。冷却が必要かどうかは、設置場所の温度を測って判断します。",
  "sources": [
    {
      "label": "Austin’s Turtle Page：モリイシガメ",
      "url": "https://www.austinsturtlepage.com/Care/cs-nawood.htm"
    }
  ]
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["hirase-turtle"] = {
  "title": "ヒラセガメの用品を選ぶ前に",
  "items": [
    "床材と隠れ家を置ける陸地を中心に組みます。",
    "水場と乾いた休み場所を用意し、登って外へ出られないか確認します。"
  ],
  "note": "水場や隠れ家を置いた後の広さも確認します。追加設備や床材の費用は、用品候補の合計とは別にかかります。",
  "sourceNote": "ヒラセガメの生態とオプストヒラセガメの飼育例を参考にしています。温度や湿度を、すべての個体に共通する数値にはしていません。",
  "sources": [
    {
      "label": "Cuora Conservation：ヒラセヤマガメ",
      "url": "https://www.cuora.org/cuora-mouhotii"
    },
    {
      "label": "theTurtleRoom：オブストヒラセの飼育記録",
      "url": "https://theturtleroom.org/blog/2014/04/25/cuora-mouhotii-obsti-acclimation-care/"
    }
  ]
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["obsti-hirase-turtle"] = {
  "title": "オプストヒラセガメの用品を選ぶ前に",
  "items": [
    "潜れる床材と暗い隠れ家を用意します。",
    "体を浸せる水場は出入りしやすくし、壁際や設備からの脱走にも気をつけます。"
  ],
  "note": "水場や隠れ家を置いた後の広さも確認します。追加設備や床材の費用は、用品候補の合計とは別にかかります。",
  "sourceNote": "オプストヒラセガメ4頭の飼育例を参考にしています。",
  "sources": [
    {
      "label": "theTurtleRoom：オブストヒラセの飼育記録",
      "url": "https://theturtleroom.org/blog/2014/04/25/cuora-mouhotii-obsti-acclimation-care/"
    },
    {
      "label": "Cuora Conservation：ヒラセヤマガメ",
      "url": "https://www.cuora.org/cuora-mouhotii"
    }
  ]
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["painted-wood-turtle"] = {
  "title": "アカスジヤマガメの用品を選ぶ前に",
  "items": [
    "陸地・隠れ家・水場を組み合わせます。",
    "クジャクガメの仲間でも水場の使い方は異なります。亜種を確かめてから、水場の広さを決めます。"
  ],
  "note": "水場や隠れ家を置いた後の広さも確認します。追加設備や床材の費用は、用品候補の合計とは別にかかります。",
  "sourceNote": "Rhinoclemmys pulcherrima全体を対象にしています。亜種によって水場の使い方が異なります。",
  "sources": [
    {
      "label": "Zierschildkröte：アカスジヤマガメ類の飼育",
      "url": "https://www.zierschildkroete.de/pracht-erdschildkroeten-rhinoclemmys-pulcherrima-incisa-manni-rogerbarbouri/"
    }
  ]
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["annulated-wood-turtle"] = {
  "title": "ネンリンヤマガメの用品を選ぶ前に",
  "items": [
    "歩ける陸地と、落葉や隠れ家で身を隠せる場所を確保します。",
    "陸棲寄りでも水を使います。水場を省かず、自分で出入りできるようにします。"
  ],
  "note": "水場や隠れ家を置いた後の広さも確認します。追加設備や床材の費用は、用品候補の合計とは別にかかります。",
  "sourceNote": "生息環境や暮らし方から、陸地・隠れ場所・水場の組み合わせを考えています。飼育設備を比較した資料ではありません。",
  "sources": [
    {
      "label": "Reptiles of Ecuador：ネンリンヤマガメ",
      "url": "https://www.reptilesofecuador.com/rhinoclemmys_annulata.html"
    }
  ]
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["nicaragua-wood-turtle"] = {
  "title": "ニカラグアクジャクガメの用品を選ぶ前に",
  "items": [
    "床材のある陸地と水場の両方を確保します。",
    "水場には滑りにくい出口を設け、陸の隠れ家まで行き来できるようにします。"
  ],
  "note": "水場や隠れ家を置いた後の広さも確認します。追加設備や床材の費用は、用品候補の合計とは別にかかります。",
  "sourceNote": "ニカラグアクジャクガメを明示した飼育案内を参考にしています。水場と陸地の比率は固定していません。",
  "sources": [
    {
      "label": "Zierschildkröte：アカスジヤマガメ類の飼育",
      "url": "https://www.zierschildkroete.de/pracht-erdschildkroeten-rhinoclemmys-pulcherrima-incisa-manni-rogerbarbouri/"
    }
  ]
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["guerrero-wood-turtle"] = {
  "title": "ゲレーロクジャクガメの用品を選ぶ前に",
  "items": [
    "床材のある陸地と水場の両方を確保します。",
    "水場には滑りにくい出口を設け、陸の隠れ家まで行き来できるようにします。"
  ],
  "note": "水場や隠れ家を置いた後の広さも確認します。追加設備や床材の費用は、用品候補の合計とは別にかかります。",
  "sourceNote": "ゲレーロクジャクガメを明示した飼育案内を参考にしています。水場と陸地の比率は固定していません。",
  "sources": [
    {
      "label": "Zierschildkröte：アカスジヤマガメ類の飼育",
      "url": "https://www.zierschildkroete.de/pracht-erdschildkroeten-rhinoclemmys-pulcherrima-incisa-manni-rogerbarbouri/"
    }
  ]
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["sonora-wood-turtle"] = {
  "title": "ソノラクジャクガメの用品を選ぶ前に",
  "items": [
    "亜種を確認したうえで、陸地・隠れ家・水場を組み合わせます。",
    "水場を使ったあと自分で陸へ戻れる出口を用意します。"
  ],
  "note": "水場や隠れ家を置いた後の広さも確認します。追加設備や床材の費用は、用品候補の合計とは別にかかります。",
  "sourceNote": "資料にソノラクジャクガメの飼育実績はないため、クジャクガメ類に共通する環境の組み合わせを参考にしています。",
  "sources": [
    {
      "label": "Zierschildkröte：アカスジヤマガメ類の飼育",
      "url": "https://www.zierschildkroete.de/pracht-erdschildkroeten-rhinoclemmys-pulcherrima-incisa-manni-rogerbarbouri/"
    }
  ]
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["three-toed-box-turtle"] = {
  "title": "ミツユビハコガメの用品を選ぶ前に",
  "items": [
    "潜れる湿った場所と、日陰の隠れ家を用意します。",
    "浅い水場へ無理なく出入りできるようにし、床全体の乾燥や過熱を避けます。"
  ],
  "note": "水場や隠れ家を置いた後の広さも確認します。追加設備や床材の費用は、用品候補の合計とは別にかかります。",
  "sourceNote": "ミツユビハコガメの飼育案内と、動物病院によるハコガメ類の案内を参考にしています。",
  "sources": [
    {
      "label": "Tortoise Trust：ミツユビハコガメ",
      "url": "https://www.tortoisetrust.org/care/ctriungis.html"
    },
    {
      "label": "VCA動物病院：ハコガメの住まい",
      "url": "https://vcahospitals.com/know-your-pet/turtles-box-housing"
    }
  ]
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["eastern-box-turtle"] = {
  "title": "トウブハコガメの用品を選ぶ前に",
  "items": [
    "陸地に隠れ家と潜れる場所を作り、水場も用意します。",
    "水皿の縁には出入りできる足場を付け、汚れた水を替えやすい配置にします。"
  ],
  "note": "水場や隠れ家を置いた後の広さも確認します。追加設備や床材の費用は、用品候補の合計とは別にかかります。",
  "sourceNote": "トウブハコガメの飼育例と、北米のハコガメ類に共通する案内を参考にしています。",
  "sources": [
    {
      "label": "California Turtle & Tortoise Club：北米ハコガメ",
      "url": "https://www.tortoise.org/archives/terrapen.html"
    },
    {
      "label": "VCA動物病院：ハコガメの住まい",
      "url": "https://vcahospitals.com/know-your-pet/turtles-box-housing"
    }
  ]
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["gulf-coast-box-turtle"] = {
  "title": "ガルフコーストハコガメの用品を選ぶ前に",
  "items": [
    "湿った隠れ場所に加え、体を浸せる水場を確保します。",
    "水をよく使う個体もいるため、出入りしやすさと水の汚れを確認します。"
  ],
  "note": "水場や隠れ家を置いた後の広さも確認します。追加設備や床材の費用は、用品候補の合計とは別にかかります。",
  "sourceNote": "ガルフコーストハコガメの飼育記録を参考にしています。水場の使い方には個体差があります。",
  "sources": [
    {
      "label": "California Turtle & Tortoise Club：北米ハコガメ",
      "url": "https://www.tortoise.org/archives/terrapen.html"
    },
    {
      "label": "VCA動物病院：ハコガメの住まい",
      "url": "https://vcahospitals.com/know-your-pet/turtles-box-housing"
    }
  ]
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["florida-box-turtle"] = {
  "title": "フロリダハコガメの用品を選ぶ前に",
  "items": [
    "隠れ家と、出入りしやすい水皿を設けます。",
    "水皿は毎日確認し、床材や隠れ家を置いても歩ける場所が残るようにします。"
  ],
  "note": "水場や隠れ家を置いた後の広さも確認します。追加設備や床材の費用は、用品候補の合計とは別にかかります。",
  "sourceNote": "北米のハコガメ類に共通する、隠れ家と水場の案内を参考にしています。",
  "sources": [
    {
      "label": "VCA動物病院：ハコガメの住まい",
      "url": "https://vcahospitals.com/know-your-pet/turtles-box-housing"
    },
    {
      "label": "California Turtle & Tortoise Club：北米ハコガメ",
      "url": "https://www.tortoise.org/archives/terrapen.html"
    }
  ]
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["taiwan-box-turtle"] = {
  "title": "タイワンセマルハコガメの用品を選ぶ前に",
  "items": [
    "陸地を中心に、身を隠せる場所と水場を組み合わせます。",
    "タイワン・中国由来の個体を区別し、別のハコガメの飼育数値をそのまま使わないようにします。"
  ],
  "note": "水場や隠れ家を置いた後の広さも確認します。追加設備や床材の費用は、用品候補の合計とは別にかかります。",
  "sourceNote": "陸上で暮らす生態をもとに、設備の組み合わせを考えています。温湿度や水深の数値を示すものではありません。",
  "sources": [
    {
      "label": "Cuora Conservation：セマルハコガメ",
      "url": "https://www.cuora.org/cuora-flavomarginata"
    }
  ]
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["chinese-box-turtle"] = {
  "title": "チュウゴクセマルハコガメの用品を選ぶ前に",
  "items": [
    "陸地を中心に、身を隠せる場所と水場を組み合わせます。",
    "タイワン・中国由来の個体を区別し、別のハコガメの飼育数値をそのまま使わないようにします。"
  ],
  "note": "水場や隠れ家を置いた後の広さも確認します。追加設備や床材の費用は、用品候補の合計とは別にかかります。",
  "sourceNote": "陸上で暮らす生態をもとに、設備の組み合わせを考えています。温湿度や水深の数値を示すものではありません。",
  "sources": [
    {
      "label": "Cuora Conservation：セマルハコガメ",
      "url": "https://www.cuora.org/cuora-flavomarginata"
    }
  ]
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["indochinese-box-turtle"] = {
  "title": "モエギハコガメの用品を選ぶ前に",
  "items": [
    "静かな隠れ場所と湿った床材を用意し、少し乾いた場所も残します。",
    "加温で床が乾きすぎないか確認し、飲水・水浴び用の水場を用意します。"
  ],
  "note": "水場や隠れ家を置いた後の広さも確認します。追加設備や床材の費用は、用品候補の合計とは別にかかります。",
  "sourceNote": "分類が見直される前のモエギハコガメ類の飼育案内を参考にしています。種類ごとの温湿度や冬の管理は分けて考えます。",
  "sources": [
    {
      "label": "Tortoise Trust：インドシナハコガメ",
      "url": "https://www.tortoisetrust.org/care/cgalb.html"
    }
  ]
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["three-striped-box-turtle"] = {
  "title": "ミスジハコガメの用品を選ぶ前に",
  "items": [
    "水場と陸地の両方を設け、陸でも休めるようにします。",
    "水中だけで完結させず、水場から陸へ上がれる出口と隠れ場所を確保します。"
  ],
  "note": "水場や隠れ家を置いた後の広さも確認します。追加設備や床材の費用は、用品候補の合計とは別にかかります。",
  "sourceNote": "古い資料には現在別種とされる種類も含まれるため、水場と陸地の組み合わせだけを参考にしています。",
  "sources": [
    {
      "label": "Naturalis：ミスジハコガメの自然史",
      "url": "https://turtles.linnaeus.naturalis.nl/linnaeus_ng/app/views/species/nsr_taxon.php?cat=TAB_DESCRIPTION&id=8054"
    },
    {
      "label": "Cuora Conservation：ミスジハコガメ",
      "url": "https://www.cuora.org/cuora-trifasciata"
    }
  ]
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["asian-leaf-turtle"] = {
  "title": "ノコヘリマルガメの用品を選ぶ前に",
  "items": [
    "水場に加えて、体を休められる陸地を確保します。",
    "水場と陸を行き来できる出口を作り、流通名だけで別種の水深を当てはめないようにします。"
  ],
  "note": "水場や隠れ家を置いた後の広さも確認します。追加設備や床材の費用は、用品候補の合計とは別にかかります。",
  "sourceNote": "分類が見直される前のマルガメ類の資料から、水場と陸地の使い方を参考にしています。",
  "sources": [
    {
      "label": "Naturalis：ノコヘリマルガメの自然史",
      "url": "https://turtles.linnaeus.naturalis.nl/linnaeus_ng/app/views/species/nsr_taxon.php?cat=TAB_DESCRIPTION&id=8060"
    }
  ]
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["desert-box-turtle"] = {
  "title": "ミナミニシキハコガメの用品を選ぶ前に",
  "items": [
    "乾燥地の仲間でも水場は省かず、浅く出入りしやすくします。",
    "日陰の隠れ場所を用意し、容器全体が熱くならないようにします。"
  ],
  "note": "水場や隠れ家を置いた後の広さも確認します。追加設備や床材の費用は、用品候補の合計とは別にかかります。",
  "sourceNote": "ニシキハコガメ類の共通条件を参考にしています。ミナミニシキハコガメ固有の温湿度は、この資料だけで決めていません。",
  "sources": [
    {
      "label": "California Turtle & Tortoise Club：北米ハコガメ",
      "url": "https://www.tortoise.org/archives/terrapen.html"
    },
    {
      "label": "VCA動物病院：ハコガメの住まい",
      "url": "https://vcahospitals.com/know-your-pet/turtles-box-housing"
    }
  ]
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["black-knobbed-map-turtle"] = {
  "items": [
    "泳ぐ場所と、腹側まで水から出て乾く陸場を用意します。陸場は体重を支えられ、甲羅をこすらず上れるものを選びます。",
    "屋内では日光浴のための保温とUVB照明を整えます。ろ過器を使っていても、水換えと掃除は続けます。",
    "メスはオスより大きくなるため、子ガメ用の容器や陸場をそのまま使い続けられるとは限りません。"
  ],
  "sources": [
    {
      "label": "参考資料（飼育条件）",
      "url": "https://www.austinsturtlepage.com/Care/cs-bkmap.htm"
    }
  ],
  "sourceNote": "本種向けの飼育案内を参考にしています。",
  "title": "クロコブチズガメの用品を選ぶ前に",
  "note": "用品は比較候補です。設置する容器・実際の水位・個体の体格に合うかを確かめてください。"
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["ouachita-map-turtle-sp"] = {
  "items": [
    "泳ぐ場所と、腹側まで水から出て乾く陸場を用意します。陸場は体重を支えられ、甲羅をこすらず上れるものを選びます。",
    "屋内では日光浴のための保温とUVB照明を整えます。ろ過器を使っていても、水換えと掃除は続けます。",
    "メスはオスより大きくなるため、子ガメ用の容器や陸場をそのまま使い続けられるとは限りません。"
  ],
  "sources": [
    {
      "label": "参考資料（飼育条件）",
      "url": "https://www.austinsturtlepage.com/Care/cs-ouamap.htm"
    }
  ],
  "sourceNote": "資料はGraptemys ouachitensis ouachitensis向け。サイトのsp表記から別種まで対象を広げません。",
  "title": "フトマユチズガメの用品を選ぶ前に",
  "note": "用品は比較候補です。設置する容器・実際の水位・個体の体格に合うかを確かめてください。"
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["northern-map-turtle"] = {
  "items": [
    "泳ぐ場所と、腹側まで水から出て乾く陸場を用意します。陸場は体重を支えられ、甲羅をこすらず上れるものを選びます。",
    "屋内では日光浴のための保温とUVB照明を整えます。ろ過器を使っていても、水換えと掃除は続けます。",
    "メスはオスより大きくなるため、子ガメ用の容器や陸場をそのまま使い続けられるとは限りません。"
  ],
  "sources": [
    {
      "label": "参考資料（飼育条件）",
      "url": "https://www.austinsturtlepage.com/Care/caresheet-northern_map.htm"
    }
  ],
  "sourceNote": "本種向けの飼育案内を参考にしています。",
  "title": "キタチズガメの用品を選ぶ前に",
  "note": "用品は比較候補です。設置する容器・実際の水位・個体の体格に合うかを確かめてください。"
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["mississippi-map-turtle"] = {
  "items": [
    "泳ぐ場所と、腹側まで水から出て乾く陸場を用意します。陸場は体重を支えられ、甲羅をこすらず上れるものを選びます。",
    "屋内では日光浴のための保温とUVB照明を整えます。ろ過器を使っていても、水換えと掃除は続けます。",
    "メスはオスより大きくなるため、子ガメ用の容器や陸場をそのまま使い続けられるとは限りません。"
  ],
  "sources": [
    {
      "label": "参考資料（飼育条件）",
      "url": "https://www.austinsturtlepage.com/Care/caresheet-mississippi_map.htm"
    }
  ],
  "sourceNote": "本種向けの飼育案内を参考にしています。",
  "title": "ミシシッピチズガメの用品を選ぶ前に",
  "note": "用品は比較候補です。設置する容器・実際の水位・個体の体格に合うかを確かめてください。"
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["false-map-turtle"] = {
  "items": [
    "泳ぐ場所と、腹側まで水から出て乾く陸場を用意します。陸場は体重を支えられ、甲羅をこすらず上れるものを選びます。",
    "屋内では日光浴のための保温とUVB照明を整えます。ろ過器を使っていても、水換えと掃除は続けます。",
    "メスはオスより大きくなるため、子ガメ用の容器や陸場をそのまま使い続けられるとは限りません。"
  ],
  "sources": [
    {
      "label": "参考資料（飼育条件）",
      "url": "https://www.zierschildkroete.de/falsche-landkarten-mississippi-hoeckerschildkroeten-graptemys-pseudogeographica-kohnii/"
    }
  ],
  "sourceNote": "ニセチズガメとミシシッピチズガメを扱う飼育案内を参考にしています。",
  "title": "ニセチズガメの用品を選ぶ前に",
  "note": "用品は比較候補です。設置する容器・実際の水位・個体の体格に合うかを確かめてください。"
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["ringed-map-turtle"] = {
  "items": [
    "泳ぐ場所と、腹側まで水から出て乾く陸場を用意します。陸場は体重を支えられ、甲羅をこすらず上れるものを選びます。",
    "屋内では日光浴のための保温とUVB照明を整えます。ろ過器を使っていても、水換えと掃除は続けます。",
    "メスはオスより大きくなるため、子ガメ用の容器や陸場をそのまま使い続けられるとは限りません。"
  ],
  "sources": [
    {
      "label": "参考資料（飼育条件）",
      "url": "https://www.zierschildkroete.de/pracht-hoeckerschildkroeten-graptemys-oculifera/"
    }
  ],
  "sourceNote": "本種向けの飼育案内を参考にしています。",
  "title": "ワモンチズガメの用品を選ぶ前に",
  "note": "用品は比較候補です。設置する容器・実際の水位・個体の体格に合うかを確かめてください。"
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["painted-turtle"] = {
  "items": [
    "泳ぐ場所と、腹側まで水から出て乾く陸場を用意します。陸場は体重を支えられ、甲羅をこすらず上れるものを選びます。",
    "屋内では日光浴のための保温とUVB照明を整えます。ろ過器を使っていても、水換えと掃除は続けます。",
    "メスはオスより大きくなるため、子ガメ用の容器や陸場をそのまま使い続けられるとは限りません。"
  ],
  "sources": [
    {
      "label": "参考資料（飼育条件）",
      "url": "https://www.zierschildkroete.de/zierschildkroeten-chrysemys-picta-bellii-marginata/"
    }
  ],
  "sourceNote": "ニシキガメのうち、トウブ・セイブ・チュウブの飼育案内を参考にしています。",
  "title": "ニシキガメの用品を選ぶ前に",
  "note": "用品は比較候補です。設置する容器・実際の水位・個体の体格に合うかを確かめてください。"
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["midland-painted-turtle"] = {
  "items": [
    "泳ぐ場所と、腹側まで水から出て乾く陸場を用意します。陸場は体重を支えられ、甲羅をこすらず上れるものを選びます。",
    "屋内では日光浴のための保温とUVB照明を整えます。ろ過器を使っていても、水換えと掃除は続けます。",
    "メスはオスより大きくなるため、子ガメ用の容器や陸場をそのまま使い続けられるとは限りません。"
  ],
  "sources": [
    {
      "label": "参考資料（飼育条件）",
      "url": "https://www.zierschildkroete.de/zierschildkroeten-chrysemys-picta-bellii-marginata/"
    }
  ],
  "sourceNote": "チュウブニシキガメを含む3亜種の飼育案内を参考にしています。",
  "title": "チュウブニシキガメの用品を選ぶ前に",
  "note": "用品は比較候補です。設置する容器・実際の水位・個体の体格に合うかを確かめてください。"
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["chinese-stripe-necked-turtle"] = {
  "items": [
    "泳ぐ場所と、腹側まで水から出て乾く陸場を用意します。陸場は体重を支えられ、甲羅をこすらず上れるものを選びます。",
    "屋内では日光浴のための保温とUVB照明を整えます。ろ過器を使っていても、水換えと掃除は続けます。",
    "メスはオスより大きくなるため、子ガメ用の容器や陸場をそのまま使い続けられるとは限りません。"
  ],
  "sources": [
    {
      "label": "参考資料（飼育条件）",
      "url": "https://www.zierschildkroete.de/chinesische-streifenschildkroeten-ocadia-mauremys-sinensis/"
    }
  ],
  "sourceNote": "ハナガメの飼育案内を参考にしています。ランプの出力や設置距離は、使う製品に合わせて確認してください。",
  "title": "ハナガメの用品を選ぶ前に",
  "note": "用品は比較候補です。設置する容器・実際の水位・個体の体格に合うかを確かめてください。"
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["striped-mud-turtle"] = {
  "items": [
    "水場だけでなく、上がって休める陸地や隠れ場所を設けます。水面と陸場へ無理なく移れるようにします。",
    "子ガメは、足場のない深い水槽に入れるのではなく、水面近くで休める足場を用意します。水深は体格と動き方を見て調整します。",
    "浅い水位では動かせないろ過器やヒーターもあります。使う水位が器具の使用条件に合うか確かめます。"
  ],
  "sources": [
    {
      "label": "参考資料（飼育条件）",
      "url": "https://www.austinsturtlepage.com/Care/caresheet-3_striped_mud.htm"
    }
  ],
  "sourceNote": "本種向けの飼育案内を参考にしています。",
  "title": "ミスジドロガメの用品を選ぶ前に",
  "note": "用品は比較候補です。設置する容器・実際の水位・個体の体格に合うかを確かめてください。"
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["stripe-necked-musk-turtle"] = {
  "items": [
    "水中を歩いたり登ったりできる足場と隠れ場所を用意します。水面まで登って息継ぎできる道も残します。",
    "上がって休める陸場を設けます。子ガメの水深は、体格と泳ぎ方を見ながら調整します。",
    "成長に合わせて、容器の長さだけでなく奥行きや、設備を置いた後に動ける広さも見直します。"
  ],
  "sources": [
    {
      "label": "参考資料（飼育条件）",
      "url": "https://www.zierschildkroete.de/nackenstreifen-moschusschildkroeten-sternotherus-minor-peltifer/"
    }
  ],
  "sourceNote": "旧名Sternotherus minor peltiferで紹介されている、スジクビニオイガメの飼育記録を参考にしています。",
  "title": "スジクビニオイガメの用品を選ぶ前に",
  "note": "用品は比較候補です。設置する容器・実際の水位・個体の体格に合うかを確かめてください。"
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["red-cheeked-mud-turtle"] = {
  "items": [
    "水中を歩いたり登ったりできる足場と隠れ場所を用意します。水面まで登って息継ぎできる道も残します。",
    "上がって休める陸場を設けます。子ガメの水深は、体格と泳ぎ方を見ながら調整します。",
    "成長に合わせて、容器の長さだけでなく奥行きや、設備を置いた後に動ける広さも見直します。"
  ],
  "sources": [
    {
      "label": "参考資料（飼育条件）",
      "url": "https://www.zierschildkroete.de/rotwangen-klappschildkroeten-kinosternon-scorpioides-cruentatum/"
    }
  ],
  "sourceNote": "ホオアカドロガメを含むサソリドロガメの仲間の飼育案内を参考にしています。水深や容器の大きさは、種類と体格で変わります。",
  "title": "ホオアカドロガメの用品を選ぶ前に",
  "note": "用品は比較候補です。設置する容器・実際の水位・個体の体格に合うかを確かめてください。"
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["scorpion-mud-turtle"] = {
  "items": [
    "水中を歩いたり登ったりできる足場と隠れ場所を用意します。水面まで登って息継ぎできる道も残します。",
    "上がって休める陸場を設けます。子ガメの水深は、体格と泳ぎ方を見ながら調整します。",
    "成長に合わせて、容器の長さだけでなく奥行きや、設備を置いた後に動ける広さも見直します。"
  ],
  "sources": [
    {
      "label": "参考資料（飼育条件）",
      "url": "https://www.zierschildkroete.de/rotwangen-klappschildkroeten-kinosternon-scorpioides-cruentatum/"
    }
  ],
  "sourceNote": "サソリドロガメの仲間を扱う飼育案内を参考にしています。水深や容器の大きさは、種類と体格で変わります。",
  "title": "サソリドロガメの用品を選ぶ前に",
  "note": "用品は比較候補です。設置する容器・実際の水位・個体の体格に合うかを確かめてください。"
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["pink-bellied-side-necked-turtle"] = {
  "items": [
    "泳ぐ場所に加え、水中で休める足場や隠れ場所を用意します。流木や岩の間に体が挟まる隙間を作らないようにします。",
    "子ガメの容器は成長に合わせて広げます。陸場や設備を置いた後の遊泳スペースも確かめます。"
  ],
  "sources": [
    {
      "label": "参考資料（飼育条件）",
      "url": "https://reptilesmagazine.com/pink-bellied-side-necked-turtle-care-sheet/"
    }
  ],
  "sourceNote": "ニシキマゲクビガメの繁殖者による飼育記事を参考にしています。",
  "title": "ニシキマゲクビガメ（ピンクベリー）の用品を選ぶ前に",
  "note": "用品は比較候補です。設置する容器・実際の水位・個体の体格に合うかを確かめてください。"
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["spiny-softshell-turtle"] = {
  "items": [
    "水中に潜って隠れられる砂場と、休める場所を用意します。皮膚や甲羅をこする鋭い装飾・ざらついた足場は避けます。",
    "使いやすい陸場も設け、体が挟まらず水面へ出られるようにします。汚れをためず、ろ過と水換えで水を清潔に保ちます。",
    "成長後、とくに大きなメスでは一般的な水槽に収まらないことがあります。横幅だけでなく奥行きと設備を置いた後の広さを考えます。"
  ],
  "sources": [
    {
      "label": "参考資料（飼育条件）",
      "url": "https://austinsturtlepage.com/Care/caresheet-spiny_softshell.htm"
    }
  ],
  "sourceNote": "本種向けの飼育案内を参考にしています。",
  "title": "トゲスッポンの用品を選ぶ前に",
  "note": "用品は比較候補です。設置する容器・実際の水位・個体の体格に合うかを確かめてください。"
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["florida-softshell-turtle"] = {
  "items": [
    "水中に潜って隠れられる砂場と、休める場所を用意します。皮膚や甲羅をこする鋭い装飾・ざらついた足場は避けます。",
    "使いやすい陸場も設け、体が挟まらず水面へ出られるようにします。汚れをためず、ろ過と水換えで水を清潔に保ちます。",
    "成長後、とくに大きなメスでは一般的な水槽に収まらないことがあります。横幅だけでなく奥行きと設備を置いた後の広さを考えます。"
  ],
  "sources": [
    {
      "label": "参考資料（飼育条件）",
      "url": "https://www.austinsturtlepage.com/Care/cs-flsoft.htm"
    }
  ],
  "sourceNote": "本種向けの飼育案内を参考にしています。",
  "title": "フロリダスッポンの用品を選ぶ前に",
  "note": "用品は比較候補です。設置する容器・実際の水位・個体の体格に合うかを確かめてください。"
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["chinese-softshell-turtle"] = {
  "items": [
    "水中に潜って隠れられる砂場と、休める場所を用意します。皮膚や甲羅をこする鋭い装飾・ざらついた足場は避けます。",
    "使いやすい陸場も設け、体が挟まらず水面へ出られるようにします。汚れをためず、ろ過と水換えで水を清潔に保ちます。",
    "成長後、とくに大きなメスでは一般的な水槽に収まらないことがあります。横幅だけでなく奥行きと設備を置いた後の広さを考えます。"
  ],
  "sources": [
    {
      "label": "参考資料（共通条件）",
      "url": "https://www.austinsturtlepage.com/Care/caresheet-chinese_softshell.htm"
    }
  ],
  "sourceNote": "分類が見直される前のシナスッポンの飼育案内から、砂場や足場などの共通点を参考にしています。",
  "title": "スッポン（シナスッポン）の用品を選ぶ前に",
  "note": "用品は比較候補です。設置する容器・実際の水位・個体の体格に合うかを確かめてください。"
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["albino-chinese-softshell"] = {
  "items": [
    "水中に潜って隠れられる砂場と、休める場所を用意します。皮膚や甲羅をこする鋭い装飾・ざらついた足場は避けます。",
    "使いやすい陸場も設け、体が挟まらず水面へ出られるようにします。汚れをためず、ろ過と水換えで水を清潔に保ちます。",
    "成長後、とくに大きなメスでは一般的な水槽に収まらないことがあります。横幅だけでなく奥行きと設備を置いた後の広さを考えます。"
  ],
  "sources": [
    {
      "label": "参考資料（共通条件）",
      "url": "https://www.austinsturtlepage.com/Care/caresheet-chinese_softshell.htm"
    }
  ],
  "sourceNote": "シナスッポンの飼育案内を参考にしています。アルビノ個体だけを対象にした資料ではありません。",
  "title": "アルビノシナスッポンの用品を選ぶ前に",
  "note": "用品は比較候補です。設置する容器・実際の水位・個体の体格に合うかを確かめてください。"
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["smooth-softshell-turtle"] = {
  "items": [
    "水中に潜って隠れられる砂場と、休める場所を用意します。皮膚や甲羅をこする鋭い装飾・ざらついた足場は避けます。",
    "使いやすい陸場も設け、体が挟まらず水面へ出られるようにします。汚れをためず、ろ過と水換えで水を清潔に保ちます。"
  ],
  "sources": [
    {
      "label": "参考資料（共通条件）",
      "url": "https://tortoisetrust.org/articles/aquatic.html"
    }
  ],
  "sourceNote": "スッポン類に共通する住まいの考え方を参考にしています。スベスッポン専用の水深や照明の数値は示していません。",
  "title": "スベスッポンの用品を選ぶ前に",
  "note": "用品は比較候補です。設置する容器・実際の水位・個体の体格に合うかを確かめてください。"
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["european-pond-turtle"] = {
  "items": [
    "水場と日光浴できる陸場を用意し、屋内では陸場の保温とUVB照明を整えます。",
    "ろ過だけに頼らず水換えを続けます。登って脱走できるため、陸場や設備から容器の縁に届かない配置にします。"
  ],
  "sources": [
    {
      "label": "参考資料（飼育条件）",
      "url": "https://www.tortoisetrust.org/articles/orbicularis.htm"
    }
  ],
  "sourceNote": "Tortoise Trustによるヨーロッパヌマガメの飼育・繁殖記録を参考にしています。",
  "title": "ヨーロッパヌマガメの用品を選ぶ前に",
  "note": "用品は比較候補です。設置する容器・実際の水位・個体の体格に合うかを確かめてください。"
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["yellow-pond-turtle"] = {
  "items": [
    "水中の隠れ場所と、上がって休める陸場を用意します。陸場へは登りやすい道を設けます。",
    "ろ過器を使っていても、汚れ方を見て水換えと容器の掃除を続けます。"
  ],
  "sources": [
    {
      "label": "参考資料（飼育条件）",
      "url": "https://www.sigs.ch/clubdesk/fileservlet?id=1000072"
    }
  ],
  "sourceNote": "スイスの飼育者によるミナミイシガメの飼育・繁殖記録を参考にしています。プールやプラスチック箱を使った例も紹介されています。",
  "title": "ミナミイシガメの用品を選ぶ前に",
  "note": "用品は比較候補です。設置する容器・実際の水位・個体の体格に合うかを確かめてください。"
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["yaeyama-pond-turtle"] = {
  "items": [
    "水中の隠れ場所と、上がって休める陸場を用意します。陸場へは登りやすい道を設けます。",
    "ろ過器を使っていても、汚れ方を見て水換えと容器の掃除を続けます。"
  ],
  "sources": [
    {
      "label": "参考資料（共通条件）",
      "url": "https://www.sigs.ch/clubdesk/fileservlet?id=1000072"
    }
  ],
  "sourceNote": "ミナミイシガメの飼育記録から共通する設備を参考にしています。ヤエヤマイシガメ固有の水深や冬の管理を示す資料ではありません。",
  "title": "ヤエヤマイシガメの用品を選ぶ前に",
  "note": "用品は比較候補です。設置する容器・実際の水位・個体の体格に合うかを確かめてください。"
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["canton-reeves-turtle"] = {
  "items": [
    "落ち着いて隠れられる場所を用意します。設備を並べすぎず、出入りできる広さを残します。",
    "同じ種でもかみ合いが起こるため、複数飼育を前提に用品を選ばず、個別に分けられる環境を用意します。"
  ],
  "sources": [
    {
      "label": "参考資料（飼育条件）",
      "url": "https://iucn-tftsg.org/wp-content/uploads/file/Accounts/crm_5_068_nigricans_v1_2012.pdf"
    }
  ],
  "sourceNote": "Mauremys nigricansの種概説にある飼育記録を参考にしています。クサガメとは別種として扱っています。",
  "title": "カントンクサガメの用品を選ぶ前に",
  "note": "用品は比較候補です。設置する容器・実際の水位・個体の体格に合うかを確かめてください。"
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["rio-grande-cooter"] = {
  "items": [
    "成体まで使うなら、大きな容器と日光浴できる陸場を置く場所を先に確保します。幼体用水槽を終生用とは考えません。",
    "水量に見合う循環とろ過を整え、陸場は成長後の体を支えられるものを選びます。"
  ],
  "sources": [
    {
      "label": "参考資料（共通条件）",
      "url": "https://iucn-tftsg.org/wp-content/uploads/file/Accounts/crm_5_100_gorzugi_v1_2016.pdf"
    }
  ],
  "sourceNote": "種概説では、クーター類に共通する飼育方法を参考にしています。本種固有の詳細な条件は、まだ十分に記載されていません。",
  "title": "リオグランデクーターの用品を選ぶ前に",
  "note": "用品は比較候補です。設置する容器・実際の水位・個体の体格に合うかを確かめてください。"
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["collier-snake-necked-turtle"] = {
  "items": [
    "皮膚や腹側をこすらず上り下りできる陸場と、水中で落ち着ける場所を用意します。",
    "ろ過器に任せきりにせず、水の汚れや温度を確認します。水中ヒーターは接触や破損を防ぐカバー付きのものを使います。"
  ],
  "sources": [
    {
      "label": "参考資料（飼育条件）",
      "url": "https://paperzz.com/doc/9451149/care-and-husbandry-of-captive-oblong-turtles"
    }
  ],
  "sourceNote": "Turtle Oblonga Networkの2013年の飼育文書（転載）を参考にしています。最新版の原文とは照合できていません。",
  "title": "コウホソナガクビガメの用品を選ぶ前に",
  "note": "用品は比較候補です。設置する容器・実際の水位・個体の体格に合うかを確かめてください。"
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["asian-black-marsh-turtle"] = {
  "items": [
    "隠れ場所のある陸地と水場を設け、水面へ登って出られる足場を用意します。",
    "ろ過器を使っていても、水換えは続けます。容器は陸地を入れた後に水中を動ける広さがあるか確認します。"
  ],
  "sources": [
    {
      "label": "参考資料（飼育条件）",
      "url": "https://www.zierschildkroete.de/schwarze-dickkopf-schildkroete-siebenrockiella-crassicollis/"
    }
  ],
  "sourceNote": "本種向けの飼育案内を参考にしています。",
  "title": "ホオジロクロガメの用品を選ぶ前に",
  "note": "用品は比較候補です。設置する容器・実際の水位・個体の体格に合うかを確かめてください。"
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["alabama-map-turtle"] = {
  "items": [
    "陸場や隠れ場所を置いた後に、動き回れる広さと水面へ出る道が残るか確認します。",
    "保温器具は体が触れたり動かしたりして破損しないように設置します。ろ過器だけに頼らず、汚れを取り除き水換えを続けます。"
  ],
  "sources": [
    {
      "label": "参考資料（共通条件）",
      "url": "https://tortoisetrust.org/articles/aquatic.html"
    }
  ],
  "sourceNote": "水棲ガメに共通する、陸場や器具の使い方を参考にしています。種類ごとの水深や温度は示していません。",
  "title": "アラバマチズガメの用品を選ぶ前に",
  "note": "用品は比較候補です。設置する容器・実際の水位・個体の体格に合うかを確かめてください。"
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["suwannee-cooter"] = {
  "items": [
    "陸場や隠れ場所を置いた後に、動き回れる広さと水面へ出る道が残るか確認します。",
    "保温器具は体が触れたり動かしたりして破損しないように設置します。ろ過器だけに頼らず、汚れを取り除き水換えを続けます。"
  ],
  "sources": [
    {
      "label": "参考資料（共通条件）",
      "url": "https://tortoisetrust.org/articles/aquatic.html"
    }
  ],
  "sourceNote": "水棲ガメに共通する、陸場や器具の使い方を参考にしています。種類ごとの水深や温度は示していません。",
  "title": "スワニークーターの用品を選ぶ前に",
  "note": "用品は比較候補です。設置する容器・実際の水位・個体の体格に合うかを確かめてください。"
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["blandings-turtle"] = {
  "items": [
    "陸場や隠れ場所を置いた後に、動き回れる広さと水面へ出る道が残るか確認します。",
    "保温器具は体が触れたり動かしたりして破損しないように設置します。ろ過器だけに頼らず、汚れを取り除き水換えを続けます。"
  ],
  "sources": [
    {
      "label": "参考資料（共通条件）",
      "url": "https://tortoisetrust.org/articles/aquatic.html"
    }
  ],
  "sourceNote": "水棲ガメに共通する、陸場や器具の使い方を参考にしています。種類ごとの水深や温度は示していません。",
  "title": "ブランディングガメの用品を選ぶ前に",
  "note": "用品は比較候補です。設置する容器・実際の水位・個体の体格に合うかを確かめてください。"
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["mexican-mud-turtle"] = {
  "items": [
    "水場に加え、上がって休める陸場や隠れ場所を用意します。体が挟まらず行き来できる配置にします。",
    "今の体格だけで容器を決めず、成長後の体格と設備を置いた後の広さで選びます。"
  ],
  "sources": [
    {
      "label": "参考資料（共通条件）",
      "url": "https://www.turtlerescues.com/mud_and_musk_turtles.htm"
    }
  ],
  "sourceNote": "ドロガメ・ニオイガメ類に共通する住まいの案内を参考にしています。種類ごとの水深や温度は示していません。",
  "title": "サラドロガメの用品を選ぶ前に",
  "note": "用品は比較候補です。設置する容器・実際の水位・個体の体格に合うかを確かめてください。"
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["yellow-mud-turtle"] = {
  "items": [
    "水場に加え、上がって休める陸場や隠れ場所を用意します。体が挟まらず行き来できる配置にします。",
    "今の体格だけで容器を決めず、成長後の体格と設備を置いた後の広さで選びます。"
  ],
  "sources": [
    {
      "label": "参考資料（共通条件）",
      "url": "https://www.turtlerescues.com/mud_and_musk_turtles.htm"
    }
  ],
  "sourceNote": "ドロガメ・ニオイガメ類に共通する住まいの案内を参考にしています。種類ごとの水深や温度は示していません。",
  "title": "キイロドロガメの用品を選ぶ前に",
  "note": "用品は比較候補です。設置する容器・実際の水位・個体の体格に合うかを確かめてください。"
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["herrera-mud-turtle"] = {
  "items": [
    "水場に加え、上がって休める陸場や隠れ場所を用意します。体が挟まらず行き来できる配置にします。",
    "今の体格だけで容器を決めず、成長後の体格と設備を置いた後の広さで選びます。"
  ],
  "sources": [
    {
      "label": "参考資料（共通条件）",
      "url": "https://www.turtlerescues.com/mud_and_musk_turtles.htm"
    }
  ],
  "sourceNote": "ドロガメ・ニオイガメ類に共通する住まいの案内を参考にしています。種類ごとの水深や温度は示していません。",
  "title": "ハーレラドロガメの用品を選ぶ前に",
  "note": "用品は比較候補です。設置する容器・実際の水位・個体の体格に合うかを確かめてください。"
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["white-lipped-mud-turtle"] = {
  "items": [
    "水場に加え、上がって休める陸場や隠れ場所を用意します。体が挟まらず行き来できる配置にします。",
    "今の体格だけで容器を決めず、成長後の体格と設備を置いた後の広さで選びます。"
  ],
  "sources": [
    {
      "label": "参考資料（共通条件）",
      "url": "https://www.turtlerescues.com/mud_and_musk_turtles.htm"
    }
  ],
  "sourceNote": "ドロガメ・ニオイガメ類に共通する住まいの案内を参考にしています。種類ごとの水深や温度は示していません。",
  "title": "シロクチドロガメの用品を選ぶ前に",
  "note": "用品は比較候補です。設置する容器・実際の水位・個体の体格に合うかを確かめてください。"
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["eastern-mud-turtle"] = {
  "items": [
    "水場に加え、上がって休める陸場や隠れ場所を用意します。体が挟まらず行き来できる配置にします。",
    "今の体格だけで容器を決めず、成長後の体格と設備を置いた後の広さで選びます。"
  ],
  "sources": [
    {
      "label": "参考資料（共通条件）",
      "url": "https://www.turtlerescues.com/mud_and_musk_turtles.htm"
    }
  ],
  "sourceNote": "ドロガメ・ニオイガメ類に共通する住まいの案内を参考にしています。種類ごとの水深や温度は示していません。",
  "title": "トウブドロガメの用品を選ぶ前に",
  "note": "用品は比較候補です。設置する容器・実際の水位・個体の体格に合うかを確かめてください。"
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["florida-mud-turtle"] = {
  "items": [
    "水場に加え、上がって休める陸場や隠れ場所を用意します。体が挟まらず行き来できる配置にします。",
    "今の体格だけで容器を決めず、成長後の体格と設備を置いた後の広さで選びます。"
  ],
  "sources": [
    {
      "label": "参考資料（共通条件）",
      "url": "https://www.turtlerescues.com/mud_and_musk_turtles.htm"
    }
  ],
  "sourceNote": "ドロガメ・ニオイガメ類に共通する住まいの案内を参考にしています。種類ごとの水深や温度は示していません。",
  "title": "フロリダドロガメの用品を選ぶ前に",
  "note": "用品は比較候補です。設置する容器・実際の水位・個体の体格に合うかを確かめてください。"
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["narrow-bridged-mud-turtle"] = {
  "items": [
    "水場に加え、上がって休める陸場や隠れ場所を用意します。体が挟まらず行き来できる配置にします。",
    "今の体格だけで容器を決めず、成長後の体格と設備を置いた後の広さで選びます。"
  ],
  "sources": [
    {
      "label": "参考資料（共通条件）",
      "url": "https://www.turtlerescues.com/mud_and_musk_turtles.htm"
    }
  ],
  "sourceNote": "ドロガメ・ニオイガメ類に共通する住まいの案内を参考にしています。種類ごとの水深や温度は示していません。",
  "title": "ハナナガドロガメの用品を選ぶ前に",
  "note": "用品は比較候補です。設置する容器・実際の水位・個体の体格に合うかを確かめてください。"
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["giant-musk-turtle-mx"] = {
  "items": [
    "水場に加え、上がって休める陸場や隠れ場所を用意します。体が挟まらず行き来できる配置にします。",
    "今の体格だけで容器を決めず、成長後の体格と設備を置いた後の広さで選びます。"
  ],
  "sources": [
    {
      "label": "参考資料（共通条件）",
      "url": "https://www.turtlerescues.com/mud_and_musk_turtles.htm"
    }
  ],
  "sourceNote": "ドロガメ・ニオイガメ類に共通する住まいの案内を参考にしています。種類ごとの水深や温度は示していません。",
  "title": "サルヴィンオオニオイガメの用品を選ぶ前に",
  "note": "用品は比較候補です。設置する容器・実際の水位・個体の体格に合うかを確かめてください。"
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["giant-musk-turtle"] = {
  "items": [
    "水場に加え、上がって休める陸場や隠れ場所を用意します。体が挟まらず行き来できる配置にします。",
    "今の体格だけで容器を決めず、成長後の体格と設備を置いた後の広さで選びます。"
  ],
  "sources": [
    {
      "label": "参考資料（共通条件）",
      "url": "https://www.turtlerescues.com/mud_and_musk_turtles.htm"
    }
  ],
  "sourceNote": "ドロガメ・ニオイガメ類に共通する住まいの案内を参考にしています。種類ごとの水深や温度は示していません。",
  "title": "スジオオニオイガメの用品を選ぶ前に",
  "note": "用品は比較候補です。設置する容器・実際の水位・個体の体格に合うかを確かめてください。"
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["インドホシガメ"] = {
  "items": [
    "暖まる場所だけでなく日陰も作り、容器全体が暑くならないようにします。",
    "飲水・水浴び用の浅い水皿を置き、清潔に保ちます。"
  ],
  "sourceNote": "インドホシガメの飼育資料から、日陰と水場の条件を確認しています。器具の出力や容器の適合を保証するものではありません。",
  "sources": [
    {
      "label": "Tortoise Trust：Indian Star Tortoises",
      "url": "https://www.tortoisetrust.org/care/celegans.html"
    }
  ],
  "title": "インドホシガメの用品を選ぶ前に",
  "note": "水場や隠れ家を置いた後の広さも確認して、必要な設備をそろえます。"
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["ビルマホシガメ"] = {
  "items": [
    "冷えたときに暖まれる場所と、いつでも飲める清潔な水を用意します。",
    "幼体の床や隠れ場所を乾かしすぎず、保温・UVBの設備を年齢と飼育環境に合わせます。"
  ],
  "sourceNote": "ビルマホシガメの種別報告にある飼育条件です。現地施設の広さや温度を、そのまま家庭の固定値にはしていません。",
  "sources": [
    {
      "label": "TFTSG：Geochelone platynota（Captive Husbandry）",
      "url": "https://iucn-tftsg.org/wp-content/uploads/file/Accounts/crm_5_057_platynota_v1_2011.pdf"
    }
  ],
  "title": "ビルマホシガメの用品を選ぶ前に",
  "note": "水場や隠れ家を置いた後の広さも確認して、必要な設備をそろえます。"
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["エジプトリクガメ"] = {
  "items": [
    "小型でも歩く場所を十分に残し、容器の通気を確保します。",
    "暖かい場所から離れられる配置にし、隠れ家と浅い飲水皿を用意します。"
  ],
  "sourceNote": "エジプトリクガメの飼育プロジェクトの方法を参考にしています。砂の安全性や特定の器具を一律に勧めるものではありません。",
  "sources": [
    {
      "label": "Kleinmanni Assurance Project：Care Guide",
      "url": "https://www.kleinmanniassuranceproject.com/care-guide"
    }
  ],
  "title": "エジプトリクガメの用品を選ぶ前に",
  "note": "水場や隠れ家を置いた後の広さも確認して、必要な設備をそろえます。"
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["マダガスカルクモノスガメ"] = {
  "items": [
    "潜って身を隠せる床材と、日陰の休み場所を用意します。",
    "飲水できる水場を確保し、乾燥した容器だけで済ませないようにします。"
  ],
  "sourceNote": "Pyxis属の飼育資料で共通して扱われる床材・日陰・水場の条件です。亜種別の温湿度や用品適合まで確認したものではありません。",
  "sources": [
    {
      "label": "Tortoise Trust：Spider Tortoises",
      "url": "https://www.tortoisetrust.org/care/pyxis.html"
    }
  ],
  "title": "マダガスカルクモノスガメの用品を選ぶ前に",
  "note": "水場や隠れ家を置いた後の広さも確認して、必要な設備をそろえます。"
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["ヒラタニオイガメ"] = {
  "scope": "species_natural_history_plus_family_guidance",
  "title": "ヒラタニオイガメの用品を選ぶ前に",
  "items": [
    "水中で身を隠せる場所を用意します。石やシェルターはぐらつかず、出入りを妨げないように置きます。",
    "水を清潔に保てるよう、ろ過と日々の掃除を組み合わせます。隠れ場所の下も掃除できる配置にします。",
    "水面へ移れる足場と、上陸して休める場所を用意します。水位は体格と実際の動き方を見て調整します。"
  ],
  "sourceNote": "本種の自然史資料にある、澄んだ水と岩の隙間を利用する生態を参考にしています。足場や陸場の案内は、ドロガメ・ニオイガメ類の共通の飼育資料を補っています。",
  "sources": [
    {
      "label": "Dodd：ヒラタニオイガメの自然史（2008）",
      "url": "https://iucn-tftsg.org/wp-content/uploads/file/Accounts/crm_5_013_depressus_v1_2008.pdf"
    },
    {
      "label": "Kirkpatrick：ドロガメ・ニオイガメ類の飼育",
      "url": "https://www.turtlerescues.com/mud_and_musk_turtles.htm"
    }
  ],
  "note": "用品は比較候補です。設置する容器・実際の水位・個体の体格に合うかを確かめてください。"
};

DIAGNOSIS_EQUIPMENT_CONDITIONS["テキサスチズガメ"] = {
  "scope": "species_keeper",
  "title": "テキサスチズガメの用品を選ぶ前に",
  "items": [
    "泳ぐ場所と、全身が水から出て乾く陸場を用意します。陸場は体重を支えられ、無理なく上れるものを選びます。",
    "屋内では日光浴のための保温とUVB照明を整え、水を清潔に保ちます。",
    "メスはオスより大きくなります。成長後の体格に合わせて、容器の広さと陸場の大きさを見直します。"
  ],
  "sourceNote": "Graptemys versaを対象とした飼育者向け資料を参照しています。雌雄で体格が違うため、小さい個体向けの用品をそのまま終生用とは考えません。",
  "sources": [
    {
      "label": "Austin’s Turtle Page：テキサスチズガメの飼育",
      "url": "https://www.austinsturtlepage.com/Care/cs-texmap.htm"
    }
  ],
  "note": "用品は比較候補です。設置する容器・実際の水位・個体の体格に合うかを確かめてください。"
};
