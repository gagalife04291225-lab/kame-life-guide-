'use strict';
// equipment.js - 種別推奨機材ASINマップ（PHASE 4）
// カテゴリ: cage / uvb / basking / substrate / food / filter
// ASINはすべてweb_search実在確認済み（2026-06-19）。未確認はnullのまま。
// Amazonアソシエイト タグ: kamelife09-22
//
// 確認済みASIN一覧:
//   B00JZFJ5R0 = ビバリア スパイラルUVB デザート 26W（砂漠・リクガメ用）
//   B00JZFJ5LQ = ビバリア スパイラルUVB フォレスト 26W（森林・水棲ガメ用）
//   B0043AYZL8 = GEX EXOTERRA サングロータイトビーム バスキング 100W
//   B0043B0AU2 = マルカン バスキングライト 50W
//   B0043B2AJQ = マルカン バスキングライト 30W
//   B0DF2SJMCJ = ビバリア リクガメフード 907g
//   B00E0GMQAM = キョーリン カメプロス 200g
//   B0012UO6Q6 = テトラ オートワンタッチフィルター AT-50

const EQUIPMENT = {

  // ========== リクガメ系（乾燥〜半乾燥） ==========
  // ロシア・ヘルマン・ギリシャ・フチゾリ・チャコ共通
  '_land_dry': {
    cage:      { asin: null,         label: 'リクガメ用木製ケージ 90cm（市販品または自作）' },
    uvb:       { asin: 'B00JZFJ5R0', label: 'ビバリア スパイラルUVB デザート 26W' },
    basking:   { asin: 'B0043B0AU2', label: 'マルカン バスキングライト 50W' },
    substrate: { asin: 'B00I0MM9MC',         label: 'あかぎ園芸 赤玉土 小粒 20L' },
    food:      { asin: 'B0DF2SJMCJ', label: 'ビバリア リクガメフード 907g' },
    filter:    null
  },
  // エロンガータ・アカアシ（多湿リクガメ）
  '_land_humid': {
    cage:      { asin: null,         label: 'リクガメ用木製ケージ 90cm（市販品または自作）' },
    uvb:       { asin: 'B00JZFJ5LQ', label: 'ビバリア スパイラルUVB フォレスト 26W' },
    basking:   { asin: 'B0043B0AU2', label: 'マルカン バスキングライト 50W' },
    substrate: { asin: 'B005J94WEM',         label: 'ジクラ 爬虫類専用万能ヤシガラマット 細目 8L' },
    food:      { asin: 'B0DF2SJMCJ', label: 'ビバリア リクガメフード 907g' },
    filter:    null
  },
  // ヒョウモン・ケヅメ・アルダブラ（大型乾燥）
  '_land_large': {
    cage:      { asin: null,         label: '自作ケージ推奨（120cm以上）' },
    uvb:       { asin: 'B00JZFJ5R0', label: 'ビバリア スパイラルUVB デザート 26W' },
    basking:   { asin: 'B0043AYZL8', label: 'GEX EXOTERRA サングロータイトビーム 100W' },
    substrate: { asin: 'B00I0MM9MC',         label: 'あかぎ園芸 赤玉土 小粒 20L' },
    food:      { asin: 'B0DF2SJMCJ', label: 'ビバリア リクガメフード 907g' },
    filter:    null
  },

  // ========== 水棲ガメ系（小型：ドロガメ・ニオイガメ） ==========
  '_aquatic_small': {
    cage:      { asin: null,         label: '水槽 45cm（市販品）' },
    uvb:       { asin: 'B00JZFJ5LQ', label: 'ビバリア スパイラルUVB フォレスト 26W' },
    basking:   { asin: 'B0043B2AJQ', label: 'マルカン バスキングライト 30W' },
    substrate: { asin: 'B00XVP3TPO',         label: '水作 水槽の底砂 大磯砂 2.4kg' },
    food:      { asin: 'B00E0GMQAM', label: 'キョーリン カメプロス 200g' },
    filter:    { asin: 'B0012UO6Q6', label: 'テトラ オートワンタッチフィルター AT-50' }
  },
  // 水棲ガメ中型（チズガメ・スライダー・イシガメ）
  '_aquatic_medium': {
    cage:      { asin: null,         label: '水槽 60〜90cm（市販品）' },
    uvb:       { asin: 'B00JZFJ5LQ', label: 'ビバリア スパイラルUVB フォレスト 26W' },
    basking:   { asin: 'B0043B0AU2', label: 'マルカン バスキングライト 50W' },
    substrate: { asin: 'B00XVP3TPO',         label: '水作 水槽の底砂 大磯砂 2.4kg' },
    food:      { asin: 'B00E0GMQAM', label: 'キョーリン カメプロス 200g' },
    filter:    { asin: 'B0012UO6Q6', label: 'テトラ オートワンタッチフィルター AT-50' }
  },
  // 水棲ガメ大型・マタマタ・テラピン
  '_aquatic_large': {
    cage:      { asin: null,         label: '水槽 90cm以上（市販品）' },
    uvb:       { asin: 'B00JZFJ5LQ', label: 'ビバリア スパイラルUVB フォレスト 26W' },
    basking:   { asin: 'B0043B0AU2', label: 'マルカン バスキングライト 50W' },
    substrate: { asin: 'B00XVP3TPO',         label: '水作 水槽の底砂 大磯砂 2.4kg' },
    food:      { asin: 'B00E0GMQAM', label: 'キョーリン カメプロス 200g' },
    filter:    { asin: 'B0012UO6Q6', label: 'テトラ オートワンタッチフィルター AT-50' }
  },

  // ========== ヤマガメ・ハコガメ系 ==========
  '_forest_cool': {
    cage:      { asin: null,         label: '衣装ケース・自作テラリウム推奨' },
    uvb:       { asin: 'B00JZFJ5LQ', label: 'ビバリア スパイラルUVB フォレスト 26W' },
    basking:   { asin: 'B0043B2AJQ', label: 'マルカン バスキングライト 30W' },
    substrate: { asin: 'B005J94WEM',         label: 'ジクラ 爬虫類専用万能ヤシガラマット 細目 8L' },
    food:      { asin: 'B00E0GMQAM', label: 'キョーリン カメプロス 200g' },
    filter:    null
  },
  // 北米ハコガメ（ミツユビ・トウブ等）
  '_box_na': {
    cage:      { asin: null,         label: '60cm以上テラリウム' },
    uvb:       { asin: 'B00JZFJ5LQ', label: 'ビバリア スパイラルUVB フォレスト 26W' },
    basking:   { asin: 'B0043B2AJQ', label: 'マルカン バスキングライト 30W' },
    substrate: { asin: 'B005J94WEM',         label: 'ジクラ 爬虫類専用万能ヤシガラマット 細目 8L' },
    food:      { asin: 'B00E0GMQAM', label: 'キョーリン カメプロス 200g' },
    filter:    null
  },
  // アジア産ハコガメ（セマル・マレー・モエギ等）
  '_box_asia': {
    cage:      { asin: null,         label: '60cm以上テラリウム' },
    uvb:       { asin: 'B00JZFJ5LQ', label: 'ビバリア スパイラルUVB フォレスト 26W' },
    basking:   { asin: 'B0043B2AJQ', label: 'マルカン バスキングライト 30W' },
    substrate: { asin: 'B005J94WEM',         label: 'ジクラ 爬虫類専用万能ヤシガラマット 細目 8L' },
    food:      { asin: 'B00E0GMQAM', label: 'キョーリン カメプロス 200g' },
    filter:    null
  },

  // ========== マニアック系 ==========
  // スッポン系
  '_softshell': {
    cage:      { asin: null,         label: '90cm以上水槽（深め）' },
    uvb:       { asin: 'B00JZFJ5LQ', label: 'ビバリア スパイラルUVB フォレスト 26W' },
    basking:   { asin: 'B0043B0AU2', label: 'マルカン バスキングライト 50W' },
    substrate: { asin: 'B0C1Y1XRF5',         label: '水作 国産天然砂 川砂 1.0L' },
    food:      { asin: 'B00E0GMQAM', label: 'キョーリン カメプロス 200g' },
    filter:    { asin: 'B0012UO6Q6', label: 'テトラ オートワンタッチフィルター AT-50' }
  },
  // 汽水テラピン系
  '_brackish': {
    cage:      { asin: null,         label: '60cm以上水槽' },
    uvb:       { asin: 'B00JZFJ5LQ', label: 'ビバリア スパイラルUVB フォレスト 26W' },
    basking:   { asin: 'B0043B0AU2', label: 'マルカン バスキングライト 50W' },
    substrate: { asin: null,         label: '汽水専用底砂はショップで相談推奨' },
    food:      { asin: 'B00E0GMQAM', label: 'キョーリン カメプロス 200g' },
    filter:    { asin: 'B0012UO6Q6', label: 'テトラ オートワンタッチフィルター AT-50' }
  },
  // 曲頸類
  '_snakeneck': {
    cage:      { asin: null,         label: '60〜90cm水槽' },
    uvb:       { asin: 'B00JZFJ5LQ', label: 'ビバリア スパイラルUVB フォレスト 26W' },
    basking:   { asin: 'B0043B0AU2', label: 'マルカン バスキングライト 50W' },
    substrate: { asin: 'B00XVP3TPO',         label: '水作 水槽の底砂 大磯砂 2.4kg' },
    food:      { asin: 'B00E0GMQAM', label: 'キョーリン カメプロス 200g' },
    filter:    { asin: 'B0012UO6Q6', label: 'テトラ オートワンタッチフィルター AT-50' }
  }

};

// 種名 → 機材キー マッピング
const EQUIPMENT_MAP = {
  // リクガメ乾燥系
  'ロシアリクガメ':              '_land_dry',
  'ヘルマンリクガメ（ヒガシ亜種）': '_land_dry',
  'ヘルマンリクガメ（ニシ亜種）':  '_land_dry',
  'ギリシャリクガメ':            '_land_dry',
  'フチゾリリクガメ':            '_land_dry',
  'チャコリクガメ':              '_land_dry',
  'ソマリアリクガメ（エジプトリクガメ）': '_land_dry',
  // リクガメ多湿系
  'エロンガータリクガメ':        '_land_humid',
  'アカアシリクガメ':            '_land_humid',
  'インプレッサムツアシガメ':    '_land_humid',
  // リクガメ大型系
  'ヒョウモンガメ':              '_land_large',
  'ベルセオレガメ':              '_land_large',
  'ケヅメリクガメ（スルカタ）':  '_land_large',
  'アルダブラゾウガメ':          '_land_large',
  // 水棲小型
  'ニオイガメ':                  '_aquatic_small',
  'ヒメニオイガメ':              '_aquatic_small',
  'ミシシッピドロガメ':          '_aquatic_small',
  'ミスジドロガメ':              '_aquatic_small',
  'カブトニオイガメ':            '_aquatic_small',
  'スジクビニオイガメ':          '_aquatic_small',
  'ホオアカドロガメ':            '_aquatic_small',
  'キイロドロガメ':              '_aquatic_small',
  'ハーレラドロガメ':            '_aquatic_small',
  'シロクチドロガメ':            '_aquatic_small',
  // 水棲中型
  'ペインテッドタートル':        '_aquatic_medium',
  'クサガメ':                    '_aquatic_medium',
  'キバラガメ':                  '_aquatic_medium',
  'ミシシッピチズガメ':          '_aquatic_medium',
  'ニセチズガメ':                '_aquatic_medium',
  'フトマユチズガメ':            '_aquatic_medium',
  'ニホンイシガメ':              '_aquatic_medium',
  'ヤエヤマイシガメ':            '_aquatic_medium',
  'ミナミイシガメ':              '_aquatic_medium',
  'ニシキマゲクビガメ（ピンクベリー）': '_aquatic_medium',
  'ヨーロッパヌマガメ':          '_aquatic_medium',
  'カントンクサガメ':            '_aquatic_medium',
  'ブランディングガメ':          '_aquatic_medium',
  'クロコブチズガメ':            '_aquatic_medium',
  'ワモンチズガメ':              '_aquatic_medium',
  'サラドロガメ':                '_aquatic_medium',
  // 水棲大型
  'ミシシッピアカミミガメ':      '_aquatic_large',
  'ペニンシュラクーター':        '_aquatic_large',
  'マタマタ':                    '_aquatic_large',
  'アマゾンマタマタ':            '_aquatic_large',
  // ヤマガメ系（保冷）
  'スペングラーヤマガメ':        '_forest_cool',
  'ヒラセガメ':                  '_forest_cool',
  'キボシイシガメ':              '_forest_cool',
  'モリイシガメ':                '_forest_cool',
  'アカスジヤマガメ':            '_forest_cool',
  'ネンリンヤマガメ':            '_forest_cool',
  'マンヤマガメ':                '_forest_cool',
  'ニカラグアクジャクガメ':      '_forest_cool',
  // 北米ハコガメ
  'ミツユビハコガメ':            '_box_na',
  'トウブハコガメ':              '_box_na',
  'ガルフコーストハコガメ':      '_box_na',
  'フロリダハコガメ':            '_box_na',
  'キタニシキハコガメ':          '_box_na',
  // アジア産ハコガメ
  'タイワンセマルハコガメ':      '_box_asia',
  'マレーハコガメ':              '_box_asia',
  'チュウゴクセマルハコガメ':    '_box_asia',
  'モエギハコガメ':              '_box_asia',
  'オルナータハコガメ':          '_box_asia',
  'ミスジハコガメ':              '_box_asia',
  'ミスジハコガメ（希少コレクション）': '_box_asia',
  // スッポン系
  'スパイニースッポン':          '_softshell',
  'スムーススッポン':            '_softshell',
  'フロリダスッポン':            '_softshell',
  'スッポンモドキ':              '_softshell',
  'スッポン（シナスッポン）':    '_softshell',
  'アルビノシナスッポン':        '_softshell',
  // 汽水テラピン
  'ノーザンダイヤモンドバックテラピン':    '_brackish',
  'カロリナダイヤモンドバックテラピン':    '_brackish',
  'オルナータダイヤモンドバックテラピン':  '_brackish',
  // 曲頸類
  'ヘビクビガメ':                '_snakeneck',
  'ニシキヘビクビガメ':          '_snakeneck',
  'ジーベンロックナガクビガメ':  '_snakeneck',
  'アフリカヨコクビガメ':        '_snakeneck',
  'ヒラリーカエルガメ':          '_snakeneck',
  'パーケリーナガクビガメ':      '_snakeneck',
  // 大型ドロガメ
  'サソリドロガメ':              '_aquatic_large',
  'スジオオニオイガメ':          '_aquatic_large',
};

// 種名から機材データを取得するヘルパー
function getEquipment(speciesName) {
  var key = EQUIPMENT_MAP[speciesName];
  return key ? EQUIPMENT[key] : null;
}
