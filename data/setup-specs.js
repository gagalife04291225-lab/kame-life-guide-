/**
 * Kame Life Guide - Setup Product Specs（飼育環境イメージ図 → 用品選定仕様）
 *
 * 目的:
 *   assets/setup/ の飼育環境イメージ図10種それぞれについて
 *   「この環境を実際に作るには何が必要か」を、商品名より先に
 *   選定条件（必要性能・サイズ・安全条件・避けるべき仕様）で定義する。
 *
 * 原則:
 *   - 画像内に描かれた機材と紹介商品は同一製品ではない（完全分離）。
 *   - 商品は data/products.js（実在確認済み・楽天毎日同期）と
 *     EQUIPMENT_MAP のみから解決する。ここに新しい商品IDを直接書かない。
 *   - 該当する適切な商品がDBに無いカテゴリは missing に条件だけを記録し、
 *     架空の候補で埋めない。
 *   - 優先順位: カメの安全 > 環境適合 > 必要性能 > 入手性 > メンテ性 > コスト > 紹介可否
 *
 * スキーマ:
 *   equipmentKey : EQUIPMENT_MAP のキー（既存 starter-kit と共通）
 *   categories[] : { cat, need('must'|'recommended'|'optional'),
 *                    tier(第一候補のtier), altTier(代替候補・省略可),
 *                    note(選定根拠・1行), avoid(選んではいけない仕様・省略可) }
 *   extras[]     : EQUIPMENT_MAP外だがこの環境に必要な既存商品 { productId, need, note }
 *   missing[]    : 適切な候補がDBに無い必需品 { label, spec }（表示は条件のみ・リンク無し）
 */

'use strict';

const SETUP_SPECS = {

  musk: {
    label: 'ミシシッピニオイガメ（小型半水棲）',
    equipmentKey: 'semi_aquatic_small',
    categories: [
      { cat: 'enclosure', need: 'must', tier: 'budget', altTier: 'standard',
        note: '最大14cmの単独飼育なら60cm規格から。水量に余裕を持つなら90cm',
        avoid: '30cm未満のプラケースでの終生飼育' },
      { cat: 'filter', need: 'must', tier: 'standard', altTier: 'premium',
        note: '水位を下げて使うため水中フィルターが基本。長期・楽したいなら小型外部式',
        avoid: '外掛け式（低水位では揚程不足で吸えず、動作不安定になる）' },
      { cat: 'heating', need: 'must', tier: 'standard',
        note: '26℃前後の自動保温。小型水槽用の55W帯で足りる' },
      { cat: 'lighting_uvb', need: 'recommended', tier: 'budget',
        note: '中程度UVB。無くても飼育例はあるが設置で代謝が安定（サイト飼育ページ準拠）' },
      { cat: 'lighting_basking', need: 'recommended', tier: 'budget',
        note: '陸場直上28〜32℃。小型水槽なら50Wで十分', avoid: '100W以上（過加熱）' },
      { cat: 'thermometer', need: 'must', tier: 'budget',
        note: '水温の常時監視。夏の28℃超え検知が主目的' },
    ],
    extras: [
      { productId: 'shelter_turtle_dock', need: 'must',
        note: '甲羅干し用の浮島。体全体が乾ける面積を' },
    ],
    missing: [
      { label: '脱走防止フタ', spec: '全面を覆うメッシュ。ニオイガメは登坂力が高く隙間があると脱走する' },
    ],
  },

  reeves: {
    label: 'クサガメ（中型半水棲）',
    equipmentKey: 'semi_aquatic_medium',
    // guide-japan.html は site-policy.html で「商品リンクを置いていないページ」（保全に関わるため）と
    // 公開約束しているため、このセットアップは選定条件のみ表示し商品リンクを描画しない。
    noLinks: true,
    categories: [
      { cat: 'enclosure', need: 'must', tier: 'standard', altTier: 'premium',
        note: '成体メス（25cm）には90cm以上。幼体から見越して選ぶ',
        avoid: '成体を60cm以下で終生飼育する前提の購入' },
      { cat: 'filter', need: 'must', tier: 'standard', altTier: 'budget',
        note: '深めの水位で泳がせるため外部式が本命。水位低めの飼い方なら水中式でも',
        avoid: '' },
      { cat: 'heating', need: 'must', tier: 'budget',
        note: '20〜28℃管理。冬眠させない場合は必須' },
      { cat: 'lighting_uvb', need: 'must', tier: 'standard',
        note: '甲羅干しが好きな種。UVB5.0相当を陸場上に' },
      { cat: 'lighting_basking', need: 'must', tier: 'standard',
        note: '陸場直上30〜35℃で完全に乾かせること' },
      { cat: 'thermometer', need: 'must', tier: 'budget',
        note: '水温監視。夏の30℃超は危険（サイト飼育ページ準拠）' },
    ],
    extras: [
      { productId: 'shelter_turtle_dock', need: 'must',
        note: '浮島タイプの陸場。成長後も全身が乗れるサイズを選ぶ' },
    ],
    missing: [],
  },

  snakeneck: {
    label: 'ナガクビガメ（遊泳型・深水）',
    equipmentKey: 'fully_aquatic',
    categories: [
      { cat: 'enclosure', need: 'must', tier: 'standard',
        note: '遊泳力が高く深い水を使う。90cm以上・水深を取れる高さのある水槽' },
      { cat: 'filter', need: 'must', tier: 'standard', altTier: 'premium',
        note: '水量が多く汚れも多い。外部式2215クラス以上', avoid: '水槽適合水量ぎりぎりの選定' },
      { cat: 'heating', need: 'must', tier: 'standard',
        note: '熱帯種。26〜28℃を安定維持。水量に見合うW数を' },
      { cat: 'thermometer', need: 'must', tier: 'budget', note: '水温の常時監視' },
    ],
    extras: [
      { productId: 'shelter_turtle_dock', need: 'optional',
        note: '甲羅干しは頻繁ではないが、上がれる場所があると安心' },
    ],
    missing: [],
  },

  terrapin: {
    label: 'ダイヤモンドバックテラピン（汽水）',
    equipmentKey: 'semi_aquatic_medium',
    pageNote: '人工海水の素と作り方は、このページの「汽水の作り方」の商品欄を参照（塩分0.5〜1.5%・比重1.005〜1.015）。',
    categories: [
      { cat: 'enclosure', need: 'must', tier: 'standard', altTier: 'premium',
        note: 'メスは90cm以上（サイト飼育ページ準拠）' },
      { cat: 'filter', need: 'must', tier: 'standard',
        note: '汽水対応を確認のうえ外部式。塩分で金属部が傷むため定期点検',
        avoid: '金属露出部の多い機材' },
      { cat: 'heating', need: 'must', tier: 'budget',
        note: '汽水で使えることを確認。樹脂カバー系が安心' },
      { cat: 'lighting_uvb', need: 'must', tier: 'standard', note: '甲羅干しを長くする種' },
      { cat: 'lighting_basking', need: 'must', tier: 'standard', note: '乾ける陸場の直上に' },
      { cat: 'thermometer', need: 'must', tier: 'budget', note: '水温監視' },
    ],
    extras: [
      { productId: 'shelter_turtle_dock', need: 'must', note: '乾ける浮島。塩水に強い樹脂製' },
      { productId: 'hydrometer_tetra', need: 'must', label: '比重計',
        note: '汽水管理の基本計器。比重1.005〜1.015の維持に。±0.001目盛・汽水測定対応（販売元表記）' },
    ],
    missing: [],
  },

  softshell: {
    label: 'スッポン（砂底・水中生活）',
    equipmentKey: 'semi_aquatic_medium',
    categories: [
      { cat: 'enclosure', need: 'must', tier: 'standard', altTier: 'premium',
        note: '最終25〜35cm。90cm以上を最初から', avoid: '60cm以下での終生飼育前提' },
      { cat: 'filter', need: 'must', tier: 'standard', altTier: 'premium',
        note: '大食で水を汚す。外部式2213クラス以上・吸水口は砂から離して設置',
        avoid: '砂を直接吸う位置への吸水口設置' },
      { cat: 'heating', need: 'must', tier: 'standard',
        note: '噛む力が強い種。保護カバー一体型（プロテクト系）を選ぶ',
        avoid: 'ガラス管むき出しのヒーター（咬傷・火傷・破損事故）' },
      { cat: 'thermometer', need: 'must', tier: 'budget', note: '水温監視' },
      { cat: 'lighting_uvb', need: 'optional', tier: 'budget',
        note: '浮かんで日光浴する程度。優先度は水質・砂に劣る' },
    ],
    extras: [
      { productId: 'substrate_bottom_sand', need: 'must',
        note: '角のない細目の天然砂を8cm以上。皮膚が弱いため大磯砂・砂利は不可' },
    ],
    missing: [
      { label: '脱走防止フタ', spec: '力が強く脱走名人。全面を確実に固定できるフタ（条件を満たすメーカー品を確認中）' },
    ],
  },

  matamata: {
    label: 'マタマタ（止水・ブラックウォーター）',
    equipmentKey: 'fully_aquatic',
    categories: [
      { cat: 'enclosure', need: 'must', tier: 'standard',
        note: '最終40cm級。横幅と底面積を優先し、水深は浅めで使う' },
      { cat: 'filter', need: 'must', tier: 'budget', altTier: 'standard',
        note: '流れを嫌う種。外部式を流量を絞って使い、排水は壁に当てて殺す',
        avoid: '水流の強い上部式・水中ポンプ直流' },
      { cat: 'heating', need: 'must', tier: 'standard',
        note: '26〜30℃の高水温を安定維持' },
      { cat: 'thermometer', need: 'must', tier: 'budget', note: '高水温管理のため必須' },
    ],
    extras: [
      { productId: 'substrate_bottom_sand', need: 'must',
        note: '細かい天然砂を薄く敷き、落ち葉と合わせて止水の底を作る' },
    ],
    missing: [
      { label: '落ち葉（アク抜き済み広葉樹）', spec: 'タンニンで弱酸性の水を作る。園芸用の未処理落ち葉は農薬リスクがあるため不可' },
    ],
  },

  'redfoot-a': {
    label: 'アカアシリクガメ（多湿ビバリウム）',
    equipmentKey: 'tortoise_forest',
    categories: [
      { cat: 'enclosure', need: 'must', tier: 'standard', altTier: 'premium',
        note: '最終30cm超の大型。90cm以上・保湿しやすい前開き型' },
      { cat: 'substrate', need: 'must', tier: 'budget', altTier: 'standard',
        note: '湿らせて使えるヤシガラ系。乾燥系の砂・赤玉土単用は不適',
        avoid: '常時乾燥する床材・針葉樹チップ' },
      { cat: 'lighting_uvb', need: 'must', tier: 'standard', note: '森林種向けの中程度UVB' },
      { cat: 'lighting_basking', need: 'must', tier: 'budget',
        note: '穏やかな暖点。砂漠種ほどの強光は不要', avoid: '高ワットの強烈なスポット' },
      { cat: 'heating', need: 'must', tier: 'standard',
        note: '26〜30℃帯の底上げ。パネル/上部ヒーターで夜間も保温' },
      { cat: 'shelter', need: 'must', tier: 'premium', altTier: 'standard',
        note: '湿度を保てるモイスト系シェルターが最適' },
      { cat: 'thermometer', need: 'must', tier: 'budget',
        note: '温度と湿度の両方を測れるものを（湿度70%前後の管理）' },
    ],
    extras: [
      { productId: 'waterdish_sanko_dish', need: 'must',
        note: '全身が入る浅い水入れ。この種はよく水に浸かる' },
    ],
    missing: [],
  },

  'redfoot-b': {
    label: 'アカアシリクガメ（種ページ版）',
    equipmentKey: 'tortoise_forest',
    speciesLinkOnly: true,
    categories: [], extras: [], missing: [],
  },

  'forest-terrarium': {
    label: 'スペングラーヤマガメ（森林テラリウム）',
    equipmentKey: 'tortoise_forest',
    categories: [
      { cat: 'enclosure', need: 'must', tier: 'standard',
        note: '通気と保湿を両立できる前開き型。夏の熱こもりを避ける' },
      { cat: 'substrate', need: 'must', tier: 'budget', altTier: 'standard',
        note: '湿らせたヤシガラ＋落ち葉。乾燥は大敵' },
      { cat: 'lighting_uvb', need: 'recommended', tier: 'budget',
        note: '弱めで十分。薄暗い森の床の種', avoid: '強UVB・強光（この種の最大ストレス要因）' },
      { cat: 'shelter', need: 'must', tier: 'standard', altTier: 'premium',
        note: 'コルクバーク等の低い隠れ家。隠れられないことがストレスになる' },
      { cat: 'thermometer', need: 'must', tier: 'budget',
        note: '夏の保冷が最大課題。高温側の監視を最優先（サイト飼育ページ準拠）' },
      { cat: 'heating', need: 'optional', tier: 'budget',
        note: '低温に強く高温に弱い。保温より夏の冷却（エアコン・ファン）を優先',
        avoid: 'バスキングスポットの常設（強光・高温はこの種に不適）' },
    ],
    extras: [
      { productId: 'waterdish_sanko_dish', need: 'must',
        note: '歩いて入れる浅い水場。深さ2〜3cmまで' },
    ],
    missing: [],
  },

  'tortoise-dry': {
    label: 'ロシアリクガメ（乾燥ケージ）',
    equipmentKey: 'tortoise_dry_small',
    categories: [
      { cat: 'enclosure', need: 'must', tier: 'standard', altTier: 'premium',
        note: '90cm以上。歩き回る種なので底面積を最優先' },
      { cat: 'substrate', need: 'must', tier: 'budget',
        note: '赤玉土（小粒）が定番。乾燥を保ち、掘れる深さに',
        avoid: '常時湿る床材・針葉樹チップ' },
      { cat: 'lighting_uvb', need: 'must', tier: 'standard',
        note: '乾燥系リクガメは強めのUVB（10.0相当）。メッシュ越しは減衰するため距離に注意' },
      { cat: 'lighting_basking', need: 'must', tier: 'budget',
        note: 'ホットスポット35℃前後と涼しい側の温度勾配を作る' },
      { cat: 'heating', need: 'recommended', tier: 'standard',
        note: '冬の底上げ用パネルヒーター。ケージ面積の1/3以下に敷く',
        avoid: '全面加温（逃げ場がなくなる）' },
      { cat: 'shelter', need: 'must', tier: 'standard', note: '涼しい側に隠れ家を' },
      { cat: 'thermometer', need: 'must', tier: 'budget', note: '暖点と涼点の2点管理が理想' },
    ],
    extras: [
      { productId: 'waterdish_zoomed_ramp_bowl', need: 'must',
        note: '縁の低い浅型水入れ。地面に埋めるかスロープ付きで転倒を防ぐ' },
    ],
    missing: [],
  },
};

// EQUIPMENT_MAP に無いが setup-specs から参照する既存商品IDの一覧（検証用）
const SETUP_SPECS_EXTRA_IDS = ['shelter_turtle_dock', 'waterdish_sanko_dish', 'waterdish_zoomed_ramp_bowl', 'substrate_bottom_sand', 'hydrometer_tetra'];
