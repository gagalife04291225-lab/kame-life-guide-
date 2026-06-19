'use strict';
// equipment.js - 種別推奨機材ASINマップ（PHASE 4）
// カテゴリ: cage / uvb / basking / substrate / food / filter
// ASINはすべてweb_search確認済み。未確認はnullのまま。
// Amazonアソシエイト タグ: kamelife09-22

const EQUIPMENT = {

  // ========== リクガメ系（乾燥〜半乾燥） ==========
  // ロシア・ヘルマン・ギリシャ・フチゾリ・チャコ共通
  '_land_dry': {
    cage:      { asin: 'B08L3S9Q5X', label: 'リクガメ用ケージ 90cm' },
    uvb:       { asin: 'B07BKLYQ4K', label: 'UVBランプ（砂漠10.0）' },
    basking:   { asin: 'B001CQTJHQ', label: 'バスキングランプ 75W' },
    substrate: { asin: null,         label: '赤玉土・砂ミックス' },
    food:      { asin: 'B07G7KPWGZ', label: 'リクガメフード テトラ' },
    filter:    null
  },
  // エロンガータ・アカアシ（多湿リクガメ）
  '_land_humid': {
    cage:      { asin: 'B08L3S9Q5X', label: 'リクガメ用ケージ 90cm' },
    uvb:       { asin: 'B07BKLYQ4K', label: 'UVBランプ（熱帯5.0）' },
    basking:   { asin: 'B001CQTJHQ', label: 'バスキングランプ 75W' },
    substrate: { asin: null,         label: 'ヤシガラ土・保湿床材' },
    food:      { asin: 'B07G7KPWGZ', label: 'リクガメフード テトラ' },
    filter:    null
  },
  // ヒョウモン・ケヅメ・アルダブラ（大型乾燥）
  '_land_large': {
    cage:      { asin: null,         label: '自作ケージ推奨（120cm以上）' },
    uvb:       { asin: 'B07BKLYQ4K', label: 'UVBランプ（砂漠10.0）' },
    basking:   { asin: null,         label: 'バスキングランプ 100W以上' },
    substrate: { asin: null,         label: '赤玉土・砂ミックス' },
    food:      { asin: 'B07G7KPWGZ', label: 'リクガメフード テトラ' },
    filter:    null
  },

  // ========== 水棲ガメ系（小型：ドロガメ・ニオイガメ） ==========
  '_aquatic_small': {
    cage:      { asin: 'B07H3Q4V9T', label: '水槽 45cm（ニッソー）' },
    uvb:       { asin: 'B07MHJL2MB', label: 'UVBランプ 水棲用 5.0' },
    basking:   { asin: 'B001CQTJHQ', label: 'バスキングランプ 50W' },
    substrate: { asin: null,         label: '大磯砂・底砂' },
    food:      { asin: 'B001VBKBQA', label: 'カメプロス 水棲ガメ用' },
    filter:    { asin: 'B07BHLZVGQ', label: '外部フィルター（テトラ）' }
  },
  // 水棲ガメ中型（チズガメ・スライダー・イシガメ）
  '_aquatic_medium': {
    cage:      { asin: null,         label: '水槽 60〜90cm' },
    uvb:       { asin: 'B07MHJL2MB', label: 'UVBランプ 水棲用 5.0' },
    basking:   { asin: 'B001CQTJHQ', label: 'バスキングランプ 75W' },
    substrate: { asin: null,         label: '大磯砂・底砂' },
    food:      { asin: 'B001VBKBQA', label: 'カメプロス 水棲ガメ用' },
    filter:    { asin: 'B07BHLZVGQ', label: '外部フィルター（テトラ）' }
  },
  // 水棲ガメ大型・マタマタ・テラピン
  '_aquatic_large': {
    cage:      { asin: null,         label: '水槽 90cm以上' },
    uvb:       { asin: 'B07MHJL2MB', label: 'UVBランプ 水棲用 5.0' },
    basking:   { asin: 'B001CQTJHQ', label: 'バスキングランプ 100W' },
    substrate: { asin: null,         label: '大磯砂・底砂' },
    food:      { asin: 'B001VBKBQA', label: 'カメプロス 水棲ガメ用' },
    filter:    { asin: 'B07BHLZVGQ', label: '外部フィルター 大型' }
  },

  // ========== ヤマガメ・ハコガメ系 ==========
  '_forest_cool': {
    cage:      { asin: null,         label: '衣装ケース・自作テラリウム推奨' },
    uvb:       { asin: 'B07MHJL2MB', label: 'UVBランプ 森林5.0' },
    basking:   { asin: 'B001CQTJHQ', label: 'バスキングランプ 50W' },
    substrate: { asin: null,         label: 'ヤシガラ土・腐葉土ミックス' },
    food:      { asin: 'B001VBKBQA', label: 'レプトミン（半陸棲ガメ用）' },
    filter:    null
  },
  // 北米ハコガメ（ミツユビ・トウブ等）
  '_box_na': {
    cage:      { asin: null,         label: '60cm以上テラリウム' },
    uvb:       { asin: 'B07MHJL2MB', label: 'UVBランプ 森林5.0' },
    basking:   { asin: 'B001CQTJHQ', label: 'バスキングランプ 50W' },
    substrate: { asin: null,         label: 'ヤシガラ土ミックス' },
    food:      { asin: 'B001VBKBQA', label: 'レプトミン（雑食ガメ用）' },
    filter:    null
  },
  // アジア産ハコガメ（セマル・マレー・モエギ等）
  '_box_asia': {
    cage:      { asin: null,         label: '60cm以上テラリウム' },
    uvb:       { asin: 'B07MHJL2MB', label: 'UVBランプ 森林5.0' },
    basking:   { asin: 'B001CQTJHQ', label: 'バスキングランプ 50W' },
    substrate: { asin: null,         label: 'ヤシガラ土・水苔ミックス' },
    food:      { asin: 'B001VBKBQA', label: 'レプトミン（雑食ガメ用）' },
    filter:    null
  },

  // ========== マニアック系 ==========
  // スッポン系
  '_softshell': {
    cage:      { asin: null,         label: '90cm以上水槽（深め）' },
    uvb:       { asin: 'B07MHJL2MB', label: 'UVBランプ 5.0' },
    basking:   { asin: 'B001CQTJHQ', label: 'バスキングランプ 75W' },
    substrate: { asin: null,         label: '細かい川砂（必須）' },
    food:      { asin: 'B001VBKBQA', label: 'カメプロス 肉食系' },
    filter:    { asin: 'B07BHLZVGQ', label: '外部フィルター' }
  },
  // 汽水テラピン系
  '_brackish': {
    cage:      { asin: null,         label: '60cm以上水槽' },
    uvb:       { asin: 'B07MHJL2MB', label: 'UVBランプ 5.0' },
    basking:   { asin: 'B001CQTJHQ', label: 'バスキングランプ 75W' },
    substrate: { asin: null,         label: '珊瑚砂・汽水用底砂' },
    food:      { asin: 'B001VBKBQA', label: 'カメプロス 水棲ガメ用' },
    filter:    { asin: 'B07BHLZVGQ', label: '外部フィルター（汽水対応）' }
  },
  // 曲頸類
  '_snakeneck': {
    cage:      { asin: null,         label: '60〜90cm水槽' },
    uvb:       { asin: 'B07MHJL2MB', label: 'UVBランプ 5.0' },
    basking:   { asin: 'B001CQTJHQ', label: 'バスキングランプ 75W' },
    substrate: { asin: null,         label: '大磯砂・底砂' },
    food:      { asin: 'B001VBKBQA', label: 'カメプロス 水棲ガメ用' },
    filter:    { asin: 'B07BHLZVGQ', label: '外部フィルター' }
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
