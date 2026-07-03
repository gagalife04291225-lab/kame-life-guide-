/* ============================================================
   data/kid.js — Keeper Intelligence Database (KID) v1
   Phase 29-D. Static data module. No build tooling.
   Exposes: window.KID = { buckets, equipment, failures, contested }

   RULES ENCODED IN DATA:
   - affiliate URLs are null (TODO). Never fabricated.
   - image.ok=false everywhere in v1 → renderer must not draw images.
   - UNSAFE items: cta_enabled=false (renderer generates NO CTA DOM).
   - dims marked 要確認 where not verified. Never fabricated.
   ============================================================ */
(function () {
  "use strict";

  var buckets = {
    S:   { min: 0,  max: 6,   label: "ハッチ 0–6cm" },
    M:   { min: 6,  max: 10,  label: "幼体 6–10cm" },
    L:   { min: 10, max: 15,  label: "亜成体 10–15cm" },
    XL:  { min: 15, max: 25,  label: "成体 15–25cm" },
    XXL: { min: 25, max: 999, label: "大型 25cm+" }
  };

  // K-SCORE: 0-3 (◯=3, △=2, ✕/弱=1, 0=不可)。null = 非該当 → UI非表示。
  // metrics: swim 遊泳 / turn 方向転換 / bask 陸場 / shelter 隠れ・掘り
  //          / secure 脱走耐性 / climate 環境維持

  var equipment = [
    {
      id: "tub-toro-80", name_ja: "トロ舟／プラ舟 80型", category: "aquatic",
      turtle_type_tags: ["aquatic", "semi-aquatic"],
      shell_min_cm: 6, shell_max_cm: 25, shell_buckets: ["M", "L", "XL"],
      life_stage: ["juvenile", "adult"], adult_suitability: "conditional", duration: "permanent",
      dim_external: { w: 911, d: 602, h: 207, unit: "mm", src: "価格.com" },
      dim_internal: { w: 807, d: 500, h: 207, unit: "mm" },
      dim_usable: { note: "内傾のため底面基準。要確認", w: null, d: null, h: null },
      dim_confidence: "要確認",
      water_depth: { rule: "甲長×1〜2、種で調整", note: "底棲系は浅めに" },
      substrate_depth: null, animal_count: "area_additive",
      kscore: { swim: 3, turn: 3, bask: 2, shelter: 1, secure: 1, climate: 2 },
      drown_badge: false, safety_label: "CONDITIONAL",
      conditions: ["逃走防止フタ必須", "長辺＝甲長×5以上で判定", "屋外設置時は日陰を確保"],
      risk_warnings: [
        { text: "屋外直射下は高水温になり致命的", sev: "high" },
        { text: "横から観察できない", sev: "low" }
      ],
      linked_failures: ["fail-overheat", "fail-escape"], linked_contested: [],
      cta_enabled: true, cta_channel_hint: "rakuten_pref",
      affiliate: { amazon: null, rakuten: null }, // TODO: affiliate URL
      evidence: [{ url: "https://www.metalcontrol.work/entry/2022/08/16/194842", type: "blog", region: "JP" }],
      image: { path: null, license: null, author: null, ok: false },
      confidence: 9, unresolved: ["dims", "affiliate"], last_reviewed: "2026-07-03"
    },
    {
      id: "nest-tote-soil", name_ja: "深型衣装ケース＋黒土/川砂", category: "nesting",
      turtle_type_tags: ["aquatic", "semi-aquatic", "box", "tortoise"],
      shell_min_cm: 6, shell_max_cm: 25, shell_buckets: ["M", "L", "XL"],
      life_stage: ["adult"], adult_suitability: "yes", duration: "permanent",
      dim_external: { w: null, d: null, h: null, unit: "mm", src: null },
      dim_internal: { w: null, d: null, h: null, unit: "mm" },
      dim_usable: { note: "床材を入れた実効深で判定。要確認", w: null, d: null, h: null },
      dim_confidence: "要確認",
      water_depth: null, substrate_depth: { min: "甲長×1〜1.5", rule: "後肢が底に当たらない深さ" },
      animal_count: "single",
      kscore: { swim: null, turn: 2, bask: null, shelter: 3, secure: 2, climate: 2 },
      drown_badge: false, safety_label: "SAFE",
      conditions: ["用途は抱卵メスの産卵床に限定", "床材深＝甲長×1〜1.5以上"],
      risk_warnings: [
        { text: "深さ不足は産み渋り→卵詰まりの主因", sev: "high" },
        { text: "産卵期は徘徊が増え脱走リスク上昇", sev: "med" }
      ],
      linked_failures: ["fail-egg-binding", "fail-escape"], linked_contested: ["contest-sand"],
      cta_enabled: true, cta_channel_hint: "rakuten_pref",
      affiliate: { amazon: null, rakuten: null }, // TODO: affiliate URL
      evidence: [{ url: "https://tortoiseforum.org/threads/indoor-nesting-box-for-leopard.209010/", type: "forum", region: "US" }],
      image: { path: null, license: null, author: null, ok: false },
      confidence: 9, unresolved: ["dims", "affiliate"], last_reviewed: "2026-07-03"
    },
    {
      id: "hide-terracotta", name_ja: "素焼き植木鉢（横倒し／半割り）", category: "shelter",
      turtle_type_tags: ["semi-aquatic", "box", "forest", "tortoise"],
      shell_min_cm: 3, shell_max_cm: 25, shell_buckets: ["S", "M", "L", "XL"],
      life_stage: ["hatchling", "juvenile", "adult"], adult_suitability: "yes", duration: "permanent",
      dim_external: { w: null, d: null, h: null, unit: "mm", src: null },
      dim_internal: { w: null, d: null, h: null, unit: "mm" },
      dim_usable: { note: "口径＝号数×約3cm（6号≒18cm）。内径は要確認", w: null, d: null, h: null },
      dim_confidence: "要確認",
      water_depth: null, substrate_depth: null, animal_count: "area_additive",
      kscore: { swim: null, turn: 2, bask: null, shelter: 3, secure: null, climate: 2 },
      drown_badge: false, safety_label: "SAFE",
      conditions: ["口径（入口）＝甲幅×1.3以上の号数を選ぶ", "床材に少し埋めて転がり防止"],
      risk_warnings: [
        { text: "割り口のバリは必ずヤスリで丸める（裂傷防止）", sev: "med" },
        { text: "甲幅ぎりぎりの鉢は成長後にはまり込む", sev: "med" }
      ],
      linked_failures: [], linked_contested: [],
      cta_enabled: true, cta_channel_hint: "homecenter_pref",
      affiliate: { amazon: null, rakuten: null }, // TODO: affiliate URL
      evidence: [{ url: "https://tortoiseforum.org/threads/tortoise-habitat-container.172204/", type: "forum", region: "US" }],
      image: { path: null, license: null, author: null, ok: false },
      confidence: 9, unresolved: ["dims", "affiliate"], last_reviewed: "2026-07-03"
    },
    {
      id: "bask-brick", name_ja: "レンガ・平板タイル", category: "basking",
      turtle_type_tags: ["aquatic", "semi-aquatic"],
      shell_min_cm: 0, shell_max_cm: 999, shell_buckets: ["S", "M", "L", "XL", "XXL"],
      life_stage: ["hatchling", "juvenile", "adult"], adult_suitability: "yes", duration: "permanent",
      dim_external: { w: 210, d: 100, h: 60, unit: "mm", src: "標準レンガ・要確認" },
      dim_internal: null,
      dim_usable: { note: "天面合計が甲長×1.2以上になる組み方", w: null, d: null, h: null },
      dim_confidence: "要確認",
      water_depth: { rule: "天面が水面から1〜2cm出る高さ", note: "水位変動を見込む" },
      substrate_depth: null, animal_count: "area_additive",
      kscore: { swim: null, turn: null, bask: 3, shelter: 1, secure: null, climate: null },
      drown_badge: false, safety_label: "SAFE",
      conditions: ["ガラス水槽の底は保護マット必須（点荷重で割れる）", "面で安定する組み方に限る"],
      risk_warnings: [
        { text: "積んだだけの段は崩れて四肢・頸部を挟む", sev: "high" },
        { text: "壁との隙間に潜り込む閉じ込め事故に注意", sev: "med" }
      ],
      linked_failures: [], linked_contested: [],
      cta_enabled: true, cta_channel_hint: "homecenter_pref",
      affiliate: { amazon: null, rakuten: null }, // TODO: affiliate URL
      evidence: [{ url: "https://tortoiseforum.org/threads/diy-in-tank-basking-platform.29230/", type: "forum", region: "US" }],
      image: { path: null, license: null, author: null, ok: false },
      confidence: 9, unresolved: ["dims", "affiliate"], last_reviewed: "2026-07-03"
    },
    {
      id: "light-stand", name_ja: "ライトスタンド（フロア式）", category: "light",
      turtle_type_tags: ["aquatic", "semi-aquatic", "box", "forest", "tortoise"],
      shell_min_cm: 0, shell_max_cm: 999, shell_buckets: ["S", "M", "L", "XL", "XXL"],
      life_stage: ["hatchling", "juvenile", "adult"], adult_suitability: "yes", duration: "permanent",
      dim_external: { w: null, d: null, h: null, unit: "mm", src: null },
      dim_internal: null,
      dim_usable: { note: "高さ・アーム長が可変。器具指定の照射距離を守る", w: null, d: null, h: null },
      dim_confidence: "要確認",
      water_depth: null, substrate_depth: null, animal_count: "single",
      kscore: { swim: null, turn: null, bask: null, shelter: null, secure: null, climate: 3 },
      drown_badge: false, safety_label: "SAFE",
      conditions: ["クリップライトの代替として使う", "MVBは垂直設置"],
      risk_warnings: [
        { text: "クリップライト直付けは落下・火災の実例あり。スタンド化推奨", sev: "high" }
      ],
      linked_failures: ["fail-clamp-fire"], linked_contested: [],
      cta_enabled: true, cta_channel_hint: "amazon_pref",
      affiliate: { amazon: null, rakuten: null }, // TODO: affiliate URL
      evidence: [{ url: "https://tortoiseforum.org/threads/basking-lamp-fixture-recomendations.192734/", type: "forum", region: "US" }],
      image: { path: null, license: null, author: null, ok: false },
      confidence: 9, unresolved: ["affiliate"], last_reviewed: "2026-07-03"
    },
    {
      id: "filter-sponge", name_ja: "フィルター吸込スポンジ／プレフィルター", category: "escape",
      turtle_type_tags: ["aquatic", "semi-aquatic"],
      shell_min_cm: 0, shell_max_cm: 999, shell_buckets: ["S", "M", "L", "XL", "XXL"],
      life_stage: ["hatchling", "juvenile", "adult"], adult_suitability: "yes", duration: "permanent",
      dim_external: { w: null, d: null, h: null, unit: "mm", src: null },
      dim_internal: null,
      dim_usable: { note: "吸込口の径に合うスポンジ径を選ぶ。要確認", w: null, d: null, h: null },
      dim_confidence: "要確認",
      water_depth: null, substrate_depth: null, animal_count: "single",
      kscore: { swim: null, turn: null, bask: null, shelter: null, secure: 3, climate: null },
      drown_badge: false, safety_label: "SAFE",
      conditions: ["幼体の吸込・はまり込み防止に装着", "流量も併せて絞る"],
      risk_warnings: [
        { text: "強い吸込は幼体を吸着・溺水させる（実例あり）", sev: "high" }
      ],
      linked_failures: ["fail-filter-intake"], linked_contested: [],
      cta_enabled: true, cta_channel_hint: "amazon_pref",
      affiliate: { amazon: null, rakuten: null }, // TODO: affiliate URL
      evidence: [{ url: "http://www.redearslider.com/forum/viewtopic.php?f=4&t=34009", type: "forum", region: "US" }],
      image: { path: null, license: null, author: null, ok: false },
      confidence: 9, unresolved: ["affiliate"], last_reviewed: "2026-07-03"
    },
    {
      id: "tote-land-juv", name_ja: "衣装ケース（陸・幼体用）", category: "forest",
      turtle_type_tags: ["box", "forest", "tortoise"],
      shell_min_cm: 3, shell_max_cm: 12, shell_buckets: ["S", "M", "L"],
      life_stage: ["hatchling", "juvenile"], adult_suitability: "no", duration: "permanent",
      dim_external: { w: null, d: null, h: null, unit: "mm", src: null },
      dim_internal: { w: null, d: null, h: null, unit: "mm" },
      dim_usable: { note: "底面内寸で判定（外寸−約5cmがめやす）。要確認", w: null, d: null, h: null },
      dim_confidence: "要確認",
      water_depth: null, substrate_depth: { min: "甲長と同程度", rule: "潜る種は深めに" },
      animal_count: "single",
      kscore: { swim: null, turn: 2, bask: 1, shelter: 3, secure: 2, climate: 3 },
      drown_badge: false, safety_label: "CONDITIONAL",
      conditions: ["甲長12cm以下の幼体向け（成体には不可）", "密閉禁止（蒸れ）／壁高−床材15cm以上残す"],
      risk_warnings: [
        { text: "フタ密閉で呼吸器・皮膚疾患リスク", sev: "high" },
        { text: "保温球を縁に掛けると樹脂変形・発火", sev: "high" },
        { text: "成長後は90cm以上のケージへ移行", sev: "med" }
      ],
      linked_failures: ["fail-sealed-humid", "fail-size-outgrow"], linked_contested: ["contest-humidity", "contest-closed-chamber"],
      cta_enabled: true, cta_channel_hint: "rakuten_pref",
      affiliate: { amazon: null, rakuten: null }, // TODO: affiliate URL
      evidence: [{ url: "https://ikimono-media.com/whichcage", type: "blog", region: "JP" }],
      image: { path: null, license: null, author: null, ok: false },
      confidence: 8, unresolved: ["dims", "affiliate"], last_reviewed: "2026-07-03"
    },
    {
      id: "tote-water-juv", name_ja: "衣装ケース（水・幼体用）", category: "aquatic",
      turtle_type_tags: ["aquatic", "semi-aquatic"],
      shell_min_cm: 3, shell_max_cm: 10, shell_buckets: ["S", "M"],
      life_stage: ["hatchling", "juvenile"], adult_suitability: "no", duration: "temporary",
      dim_external: { w: null, d: null, h: null, unit: "mm", src: null },
      dim_internal: { w: null, d: null, h: null, unit: "mm" },
      dim_usable: { note: "水は容器の1/3以下（変形防止）。要確認", w: null, d: null, h: null },
      dim_confidence: "要確認",
      water_depth: { rule: "容器の1/3以下", note: "満水厳禁" }, substrate_depth: null,
      animal_count: "single",
      kscore: { swim: 1, turn: 2, bask: 1, shelter: 1, secure: 2, climate: 2 },
      drown_badge: false, safety_label: "CONDITIONAL",
      conditions: ["甲長10cm以下の幼体向け（成体には不可）", "水は1/3以下・満水厳禁"],
      risk_warnings: [
        { text: "満水は側面変形→破損・水漏れ", sev: "high" },
        { text: "ヒーターが樹脂面に接触すると溶融・火災", sev: "high" },
        { text: "成長後は長辺＝甲長×5以上の水槽/トロ舟へ", sev: "med" }
      ],
      linked_failures: ["fail-size-outgrow"], linked_contested: [],
      cta_enabled: true, cta_channel_hint: "rakuten_pref",
      affiliate: { amazon: null, rakuten: null }, // TODO: affiliate URL
      evidence: [{ url: "https://www.aquarium-favorite.com/entry/turtle-breeding-space/", type: "blog", region: "JP" }],
      image: { path: null, license: null, author: null, ok: false },
      confidence: 8, unresolved: ["dims", "affiliate"], last_reviewed: "2026-07-03"
    },
    {
      id: "hide-pvc", name_ja: "塩ビ管（VU/VP）水中シェルター", category: "shelter",
      turtle_type_tags: ["aquatic", "semi-aquatic"],
      shell_min_cm: 3, shell_max_cm: 25, shell_buckets: ["S", "M", "L", "XL"],
      life_stage: ["hatchling", "juvenile", "adult"], adult_suitability: "conditional", duration: "permanent",
      dim_external: { w: null, d: null, h: null, unit: "mm", src: null },
      dim_internal: { w: null, d: null, h: null, unit: "mm", note: "呼び径と実内径は異なる" },
      dim_usable: { note: "内径＝甲幅×1.5以上が絶対条件。要確認", w: null, d: null, h: null },
      dim_confidence: "要確認",
      water_depth: { rule: "上端から水面まで浮上空間を残す", note: null }, substrate_depth: null,
      animal_count: "single",
      kscore: { swim: null, turn: 1, bask: null, shelter: 3, secure: null, climate: null },
      drown_badge: true, safety_label: "CONDITIONAL",
      conditions: ["内径＝甲幅×1.5以上を厳守", "両端開放（袋小路にしない）", "月1回は体格と径を照合"],
      risk_warnings: [
        { text: "はまり込みは溺死に直結（最重要）。甲幅ぎりぎりの径は使わない", sev: "high" },
        { text: "成長で通れた径が通れなくなる", sev: "high" }
      ],
      linked_failures: ["fail-hide-entrap"], linked_contested: [],
      cta_enabled: true, cta_channel_hint: "homecenter_pref",
      affiliate: { amazon: null, rakuten: null }, // TODO: affiliate URL
      evidence: [{ url: "http://www.redearslider.com/forum/viewtopic.php?t=6716", type: "forum", region: "US" }],
      image: { path: null, license: null, author: null, ok: false },
      confidence: 8, unresolved: ["dims", "affiliate"], last_reviewed: "2026-07-03"
    },
    {
      id: "hospital-container", name_ja: "頑丈コンテナ（天馬ロックス530M等）", category: "hospital",
      turtle_type_tags: ["aquatic", "semi-aquatic", "box", "forest", "tortoise"],
      shell_min_cm: 0, shell_max_cm: 18, shell_buckets: ["S", "M", "L", "XL"],
      life_stage: ["hatchling", "juvenile", "adult"], adult_suitability: "conditional", duration: "temporary",
      dim_external: { w: 390, d: 530, h: 243, unit: "mm", src: "爬虫類.jp 実例" },
      dim_internal: { w: null, d: null, h: null, unit: "mm", note: "リブで表記より狭い" },
      dim_usable: { note: "内寸長辺≧甲長×3（一時利用）。要確認", w: null, d: null, h: null },
      dim_confidence: "要確認",
      water_depth: null, substrate_depth: { min: "簡易床で可", rule: "隔離・観察目的" },
      animal_count: "single",
      kscore: { swim: null, turn: 2, bask: null, shelter: 2, secure: 3, climate: 2 },
      drown_badge: false, safety_label: "TEMPORARY",
      conditions: ["一時飼育・隔離・通院・薬浴用に限る", "ロック付きフタは通気孔を確保", "常設化しない"],
      risk_warnings: [
        { text: "フタ閉め切りは酸欠の危険。通気必須", sev: "high" },
        { text: "一時のつもりが常設化する失敗が最多", sev: "med" }
      ],
      linked_failures: [], linked_contested: [],
      cta_enabled: true, cta_channel_hint: "amazon_pref",
      affiliate: { amazon: null, rakuten: null }, // TODO: affiliate URL
      evidence: [{ url: "https://hachurui.jp/310", type: "blog", region: "JP" }],
      image: { path: null, license: null, author: null, ok: false },
      confidence: 8, unresolved: ["dims", "affiliate"], last_reviewed: "2026-07-03"
    }
  ];

  var failures = [
    {
      id: "fail-hatchling-drown", title_ja: "幼体が溺れる", severity: "fatal", urgency: "emergency_vet",
      symptoms: ["底で不動", "浮上できずもがく"],
      cause: "水深過多×水面近くの休息場なし。ニオイガメ・Reevesなど弱泳ぎ種で特に多い。",
      warning_signs: ["浮上に苦労している", "疲れて沈む", "常に流されている"],
      prevention: ["幼体は甲長程度の水深から始める", "水面近くの休息場を必ず用意", "緩いスロープで入水させる"],
      related_equipment: ["tote-water-juv", "filter-sponge"], related_type: ["aquatic", "semi-aquatic"],
      related_buckets: ["S", "M"], related_contested: [],
      evidence: [{ url: "https://www.reptileforums.co.uk/threads/very-young-reeves-turtle-drowning.1086317/", type: "forum" }],
      owner_note: null, owner_note_flag: false,
      cta_opportunity: { safe: true, equipment_id: "filter-sponge" }
    },
    {
      id: "fail-filter-intake", title_ja: "フィルター吸込による溺水", severity: "fatal", urgency: "emergency_vet",
      symptoms: ["吸込口付近で動けない", "繰り返し吸着される"],
      cause: "強い吸込口に幼体が張り付く／吸い込まれる。",
      warning_signs: ["吸込口近くで停止", "泳ぐたび引き寄せられる"],
      prevention: ["吸込口にスポンジ/プレフィルターを装着", "流量を絞る", "外部式で吸込を分散"],
      related_equipment: ["filter-sponge"], related_type: ["aquatic", "semi-aquatic"],
      related_buckets: ["S", "M"], related_contested: [],
      evidence: [{ url: "http://www.redearslider.com/forum/viewtopic.php?t=6716", type: "forum" }],
      owner_note: null, owner_note_flag: false,
      cta_opportunity: { safe: true, equipment_id: "filter-sponge" }
    },
    {
      id: "fail-adult-flip-drown", title_ja: "成体が浅水で裏返り溺れる", severity: "fatal", urgency: "emergency_vet",
      symptoms: ["仰向けで停止", "起き上がれない"],
      cause: "浅すぎる水で裏返ると起き上がれず、呼吸できずに溺れる。",
      warning_signs: ["水中で仰向けになりやすい構造", "登坂・立体物がない"],
      prevention: ["成体は起き上がれる深さを確保", "登坂できる構造物を入れる"],
      related_equipment: ["bask-brick"], related_type: ["aquatic"],
      related_buckets: ["XL"], related_contested: [],
      evidence: [{ url: "https://www.allturtles.com/can-a-turtle-drown/", type: "article" }],
      owner_note: null, owner_note_flag: false,
      cta_opportunity: { safe: false, equipment_id: null }
    },
    {
      id: "fail-hide-entrap", title_ja: "水中シェルターにはまり込む", severity: "fatal", urgency: "emergency_vet",
      symptoms: ["シェルター内で停止", "抜け出せない"],
      cause: "甲幅ぎりぎりの塩ビ管/ブロック空洞にはまり、抜けられず溺れる。",
      warning_signs: ["くぐるがきつそう", "成長して径が窮屈"],
      prevention: ["内径＝甲幅×1.5以上を厳守", "両端開放で袋小路を作らない", "月1回体格と径を照合"],
      related_equipment: ["hide-pvc"], related_type: ["aquatic", "semi-aquatic"],
      related_buckets: ["S", "M", "L", "XL"], related_contested: [],
      evidence: [{ url: "https://www.allturtles.com/can-a-turtle-drown/", type: "article" }],
      owner_note: null, owner_note_flag: false,
      cta_opportunity: { safe: false, equipment_id: null }
    },
    {
      id: "fail-size-outgrow", title_ja: "成体でサイズが破綻する", severity: "serious", urgency: "adjust_setup",
      symptoms: ["常に壁沿いを徘徊", "甲羅・鼻先の擦り傷"],
      cause: "幼体基準で容器を選び、成長して床面積・水量が不足する。",
      warning_signs: ["方向転換が窮屈", "壁を登ろうとする"],
      prevention: ["成体甲長で最終環境を逆算", "卒業サイズを最初から把握"],
      related_equipment: ["tote-land-juv", "tote-water-juv"], related_type: ["aquatic", "box", "forest", "tortoise"],
      related_buckets: ["L", "XL", "XXL"], related_contested: [],
      evidence: [{ url: "https://tortoiseforum.org/threads/largest-plastic-box-we-can-buy-from-walmart-home-deopt-amazon-for-tortoise-enclosure.187820/", type: "forum" }],
      owner_note: null, owner_note_flag: false,
      cta_opportunity: { safe: false, equipment_id: null }
    },
    {
      id: "fail-escape", title_ja: "脱走", severity: "serious", urgency: "adjust_setup",
      symptoms: ["容器の外にいる", "縁に前肢が掛かる"],
      cause: "壁高−床材の残りが不足、縁が低い、返し・フタがない。",
      warning_signs: ["壁登りが増える", "床材を高く盛りすぎ"],
      prevention: ["壁高−床材面で15cm以上残す", "返し/フタ/ネット+バンドで固定"],
      related_equipment: ["tub-toro-80", "tote-land-juv"], related_type: ["aquatic", "box", "forest", "tortoise"],
      related_buckets: ["S", "M", "L", "XL"], related_contested: [],
      evidence: [{ url: "https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q12278951642", type: "qa" }],
      owner_note: null, owner_note_flag: false,
      cta_opportunity: { safe: false, equipment_id: null }
    },
    {
      id: "fail-clamp-fire", title_ja: "クリップライトの落下・火災", severity: "fatal", urgency: "adjust_setup",
      symptoms: ["ライトが傾く/落ちる", "焦げ臭"],
      cause: "クランプが外れる／樹脂縁が溶ける／落下。複数の飼育者が火災・死亡を報告。",
      warning_signs: ["クランプが緩む", "縁が熱で変形"],
      prevention: ["フロアスタンド化または天吊り", "樹脂縁への直付けをやめる"],
      related_equipment: ["light-stand"], related_type: ["aquatic", "semi-aquatic", "box", "forest", "tortoise"],
      related_buckets: ["S", "M", "L", "XL", "XXL"], related_contested: [],
      evidence: [{ url: "https://tortoiseforum.org/threads/whats-the-difference-in-reptile-heat-lamps.112732/", type: "forum" }],
      owner_note: null, owner_note_flag: false,
      cta_opportunity: { safe: true, equipment_id: "light-stand" }
    },
    {
      id: "fail-overheat", title_ja: "屋外トロ舟の過熱", severity: "fatal", urgency: "adjust_setup",
      symptoms: ["過度なバスキング回避", "ぐったりする"],
      cause: "直射日光下でトロ舟の水温が致命的に上昇する。",
      warning_signs: ["水温が高い", "日陰がない"],
      prevention: ["必ず日陰を確保", "水量を多めに", "夏季は特に注意"],
      related_equipment: ["tub-toro-80"], related_type: ["aquatic", "semi-aquatic"],
      related_buckets: ["M", "L", "XL"], related_contested: [],
      evidence: [{ url: "https://www.metalcontrol.work/entry/2022/08/16/194842", type: "blog" }],
      owner_note: null, owner_note_flag: false,
      cta_opportunity: { safe: false, equipment_id: null }
    },
    {
      id: "fail-egg-binding", title_ja: "産卵床不足による産み渋り（卵詰まり）", severity: "fatal", urgency: "emergency_vet",
      symptoms: ["後肢で掘るが産まない", "徘徊・食欲低下が数日続く"],
      cause: "産卵床の深さ・質が不足し、産み渋りから卵塞（卵詰まり）に至る。",
      warning_signs: ["産卵の気配があるのに数日産まない", "掘っては崩れる"],
      prevention: ["床材深＝甲長×1〜1.5以上", "黒土：川砂で崩れにくい坑を作る", "産まなければ爬虫類対応の病院へ"],
      related_equipment: ["nest-tote-soil"], related_type: ["aquatic", "semi-aquatic", "box", "tortoise"],
      related_buckets: ["M", "L", "XL"], related_contested: ["contest-sand"],
      evidence: [{ url: "https://www.allturtles.com/turtle-nesting-box/", type: "article" }],
      owner_note: null, owner_note_flag: false,
      cta_opportunity: { safe: true, equipment_id: "nest-tote-soil" }
    },
    {
      id: "fail-sealed-humid", title_ja: "密閉蒸れによる呼吸器リスク", severity: "serious", urgency: "adjust_setup",
      symptoms: ["結露過多", "鼻水・開口呼吸"],
      cause: "無換気で密閉すると蒸れ、温度が伴わないと呼吸器感染のリスクが上がる。",
      warning_signs: ["容器内が常に結露", "悪臭"],
      prevention: ["通気孔を必ず確保", "密閉しない", "湿度を上げるなら温度を切らさない"],
      related_equipment: ["tote-land-juv"], related_type: ["box", "forest", "tortoise"],
      related_buckets: ["S", "M", "L"], related_contested: ["contest-humidity", "contest-closed-chamber"],
      evidence: [{ url: "https://tortoiseforum.org/threads/current-consensus-on-humidity.226076/", type: "forum" }],
      owner_note: null, owner_note_flag: false,
      cta_opportunity: { safe: false, equipment_id: null }
    }
  ];

  // Dangerous products live in equipment with safety_label UNSAFE.
  // Renderer generates NO CTA DOM for these.
  var dangerous = [
    {
      id: "danger-clamp-direct", name_ja: "クリップライトの樹脂縁直付け",
      safety_label: "UNSAFE", cta_enabled: false,
      reason: "クランプ外れ・樹脂溶け・落下による火災/死亡が複数報告されている。",
      alternative_id: "light-stand",
      evidence: [{ url: "https://tortoiseforum.org/threads/basking-lamp-fixture-recomendations.192734/", type: "forum" }]
    },
    {
      id: "danger-tight-water-hide", name_ja: "甲幅ぎりぎりの水中シェルター",
      safety_label: "UNSAFE", cta_enabled: false,
      reason: "はまり込み→溺死。成長で径が合わなくなる。内径＝甲幅×1.5以上のルールなしに使わない。",
      alternative_id: "hide-pvc",
      evidence: [{ url: "https://www.allturtles.com/can-a-turtle-drown/", type: "article" }]
    },
    {
      id: "danger-sealed-chamber", name_ja: "密閉／無換気のクローズドチャンバー",
      safety_label: "UNSAFE", cta_enabled: false,
      reason: "蒸れ・酸欠・呼吸器/皮膚疾患。通気の確保が必須。",
      alternative_id: null,
      evidence: [{ url: "https://tortoiseforum.org/threads/current-consensus-on-humidity.226076/", type: "forum" }]
    },
    {
      id: "danger-calci-sand", name_ja: "カルシウムサンド（床材）",
      safety_label: "UNSAFE", cta_enabled: false,
      reason: "誤飲で clumping→腸閉塞、粉塵で気道刺激。獣医・多数の飼育者が否定。",
      alternative_id: "nest-tote-soil",
      evidence: [{ url: "https://www.wwvhcares.com/tortoise-care-and-husbandry", type: "vet" }]
    },
    {
      id: "danger-full-water-tote", name_ja: "満水の衣装ケース（水棲）",
      safety_label: "UNSAFE", cta_enabled: false,
      reason: "側面が変形し破損・水漏れ。水は容器の1/3以下に。",
      alternative_id: "tub-toro-80",
      evidence: [{ url: "https://www.aquarium-favorite.com/entry/turtle-breeding-space/", type: "blog" }]
    },
    {
      id: "danger-hemp-cedar-pine", name_ja: "ヘンプ／シダー／パイン系床材",
      safety_label: "UNSAFE", cta_enabled: false,
      reason: "ヘンプはリクガメ死亡例、シダー/パインは揮発する油分が有害。",
      alternative_id: "nest-tote-soil",
      evidence: [{ url: "https://www.moonvalleyreptiles.com/enclosures/top-5-worst-reptile-substrates", type: "article" }]
    }
  ];

  var contested = [
    {
      id: "contest-sand", topic_ja: "砂床材は腸閉塞（impaction）を起こすか",
      claim_a: "砂・カルシウムサンドは誤飲が蓄積し腸閉塞を起こす（獣医・多数の飼育者）。",
      claim_b: "根本原因は食餌・温度の不備で、砂は二次的要因（Tortoise Trust等）。砂質の自然生息種も存在する。",
      safe_side_default: "カルシウムサンドは避ける。砂単体も避け、黒土：川砂の配合が無難。根本は食餌と温度を整えること。",
      who_should_care: "リクガメ・ハコガメ幼体の床材／産卵床を選ぶ人",
      what_not_to_say: ["砂なら絶対安全", "砂は必ず腸閉塞になる"],
      field_confidence: "genuinely_open",
      linked_equipment: ["nest-tote-soil"], linked_failures: ["fail-egg-binding"]
    },
    {
      id: "contest-humidity", topic_ja: "高湿度は呼吸器感染を起こすか",
      claim_a: "高湿度が呼吸器感染（RI）の原因になる（俗説寄り）。",
      claim_b: "主因は低温・温度変動で、湿度は温度が不適なときの寄与因子（forum/獣医の合意寄り）。",
      safe_side_default: "湿度を上げるなら温度を切らさない。温度が保てない時期は湿度を下げる。",
      who_should_care: "幼体を高湿度で立ち上げる人（pyramiding予防目的）",
      what_not_to_say: ["湿度が高いと必ずRIになる", "湿度さえ高ければ安全"],
      field_confidence: "leaning",
      linked_equipment: ["tote-land-juv"], linked_failures: ["fail-sealed-humid"]
    },
    {
      id: "contest-closed-chamber", topic_ja: "密閉チャンバーと換気",
      claim_a: "幼体のpyramiding予防に、高湿度の密閉チャンバー（無換気運用も）が有効という実践がある。",
      claim_b: "無換気の100%湿度運用は蒸れ・病気の温床でありTortoise Trust等が強く批判。",
      safe_side_default: "湿度は保ちつつ通気を確保する。完全密閉はしない。温度を高く安定させることが前提。",
      who_should_care: "リクガメ幼体をチャンバーで育てる人",
      what_not_to_say: ["穴は一切不要", "密閉すれば甲羅が滑らかになる"],
      field_confidence: "genuinely_open",
      linked_equipment: ["tote-land-juv"], linked_failures: ["fail-sealed-humid"]
    }
  ];

  window.KID = {
    buckets: buckets,
    equipment: equipment,
    failures: failures,
    dangerous: dangerous,
    contested: contested
  };
})();
