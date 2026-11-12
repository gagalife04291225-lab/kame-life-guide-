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
      id: "tub-toro-80", name_ja: "赤長 DIYトロ舟 ブラック80L", category: "aquatic",
      turtle_type_tags: ["aquatic", "semi-aquatic"],
      shell_min_cm: 6, shell_max_cm: 25, shell_buckets: ["M", "L", "XL"],
      life_stage: ["juvenile", "adult"], adult_suitability: "unknown", duration: "unknown",
      dim_external: { w: null, d: null, h: null, unit: "mm", src: null },
      dim_internal: { w: null, d: null, h: null, unit: "mm" },
      dim_usable: {"note": "赤長80Lの型番と外寸は確認済みです。確認したメーカー商品ページには内寸の掲載なし。底面外寸を内寸に読み替えません。", "w": null, "d": null, "h": null},
      dimension_reference: {"model": "藤原産業 赤長 DIYトロ舟 ブラック80L（JAN 4977292117821）", "text": "リンク先はASIN B00N3MTF8Aです。公式の上部外寸 約911×602mm、底面外寸 約807×500mm、高さ外寸 約207mmは内寸ではありません。メーカーの掲載用途は壁材・コンクリート混ぜ、野菜洗いで、表示用途以外は使用しない旨の注意があります。これはメーカーの用途表示であり、飼育者による転用実例の有無とは別です。", "url": "https://www.fujiwarasangyo-markeweb2.com/DispDetail.do?itemID=t000100090592&volumeName=00017", "reviewed": "2026-11-12"},
      product_verification: { asin: "B00N3MTF8A", model: "赤長 DIYトロ舟 ブラック80L", amazon_url: "https://www.amazon.co.jp/dp/B00N3MTF8A", identity_status: "verified", observed_affiliate_tag: "kamelife09-22", affiliate_tag_status: "owner_confirmation_required", reviewed: "2026-11-12" },
      dim_confidence: "要確認",
      water_depth: null,
      substrate_depth: null, animal_count: "用途・個体・配置ごとに判断",
      kscore: null,
      drown_badge: false, safety_label: "UNKNOWN",
      conditions: ["床材を敷く使い方：赤長80Lでヨツユビリクガメを飼う本人の記録があります。ヒロ氏も動画でトロ舟のリクガメ飼育への転用を勧めていますが、こちらは型番未特定です。いずれも個人の飼育経験・見解で、全種類・全個体への適合保証ではありません", "注水する使い方：80Lトロ舟でニホンイシガメを飼う実例もありますが、その記事では赤長の同一型番までは確認できません", "実際の底面内寸、床材や設備を置いた残りの空間、脱走対策、温度管理を別々に確認してください。外寸や容量だけから対応甲長は決めません"],
      size_check: {"status": "unverified", "note": "型番・外寸と飼育者の使用例は確認できました。床材を敷く利用と注水利用は区別し、この型番の内寸や対応甲長は推定しません。購入リンクは確認中のため停止を維持しています。"},
      risk_warnings: [
        { text: "屋外直射下は高水温になり致命的", sev: "high" },
        { text: "横から観察できない", sev: "low" }
      ],
      linked_failures: ["fail-overheat", "fail-escape"], linked_contested: [],
      cta_enabled: false, cta_channel_hint: "rakuten_pref",
      affiliate: { amazon: "https://amzn.to/4p0SGUV", rakuten: null }, // TODO: affiliate URL
      evidence: [{"url": "https://note.com/kimihideura/n/n8955edb6a915", "type": "keeper", "region": "JP", "label": "赤長80L・ヨツユビリクガメの床材飼育例"}, {"url": "https://turtle.sueyoshitk.com/torobune80l/", "type": "keeper", "region": "JP", "label": "80Lトロ舟・イシガメの注水例（メーカー未特定）"}, {"url": "https://www.youtube.com/watch?v=QliTKh5nSMc&t=122s", "type": "keeper", "region": "JP", "label": "生物ハンター協会ヒロちゃんねる・トロ舟の推薦例（型番未特定）"}],
      image: { path: null, license: null, author: null, ok: false },
      confidence: null, unresolved: ["manufacturer_internal_dimensions", "affiliate_tag_owner"], last_reviewed: "2026-11-12",
    },
    {
      id: "nest-tote-soil", name_ja: "深型衣装ケースの床材飼育・産卵床（写真は天馬530L）", category: "nesting",
      turtle_type_tags: ["aquatic", "semi-aquatic", "box", "tortoise"],
      shell_min_cm: 6, shell_max_cm: 25, shell_buckets: ["M", "L", "XL"],
      life_stage: ["juvenile", "young", "adult"], adult_suitability: "conditional", duration: "depends_on_setup",
      dim_external: { w: null, d: null, h: null, unit: "mm", src: null },
      dim_internal: { w: null, d: null, h: null, unit: "mm" },
      dim_usable: { note: "産卵床は床材の実効深で、幼体〜ヤング飼育は底面積で判定。要確認", w: null, d: null, h: null },
      dim_confidence: "manufacturer_documented",
      water_depth: null, substrate_depth: {"rule": "種と個体に合う産卵床の深さ・湿り気・掘りやすさを確認。全種共通の甲長倍率では決めない"},
      animal_count: "種・個体・配置ごとに判断",
      kscore: null,
      drown_badge: false, safety_label: "CONDITIONAL",
      conditions: ["写真は運営者による天馬530Lの床材を敷いた単独飼育例です。全種類・全成長段階への適合保証ではありません", "産卵床と日常の飼育容器は別用途です。産卵用の床材、落ち着ける場所、温湿度を種ごとに整えます", "天馬は収納用品への注水を認めていません。床材飼育の例を水槽としての使用許可に読み替えないでください"],
      risk_warnings: [{"text": "産卵困難には環境・栄養・脱水・卵や個体の状態など複数の原因があります。床材を深くするだけで解決すると考えず、異常時は爬虫類を診る獣医師へ相談してください", "sev": "high"}, {"text": "床材や設備を足すと足場が高くなります。フタ・通気と脱走対策を確認してください", "sev": "med"}],
      linked_failures: ["fail-egg-binding", "fail-escape"], linked_contested: ["contest-sand"],
      cta_enabled: true, cta_channel_hint: "rakuten_pref",
      affiliate: { amazon: "https://amzn.to/4eKxFKU", rakuten: null }, // TODO: affiliate URL
      evidence: [{"url": "https://tenmafitsworld.com/SHOP/rox.html", "type": "manufacturer", "label": "天馬公式・530Lの収納寸法", "region": "JP"}, {"url": "https://tenmafitsworld.com/hpgen/HPB/entries/8.html", "type": "manufacturer", "label": "天馬公式・水使用の注意", "region": "JP"}, {"url": "https://vcahospitals.com/apex/know-your-pet/reptiles---dystocia", "type": "vet", "label": "VCA・産卵困難の複合要因", "region": "International"}],
      image: {"path": "../assets/kid/nest-tote-soil-530l.webp", "license": "owner", "author": "亀好きさん", "caption": "運営者が天馬530Lに床材を敷き、幼体〜ヤングを単独飼育している実例です。種・体格・設置条件が異なる環境への適合を保証する写真ではありません。", "ok": true},
      confidence: null, unresolved: ["species_specific_nesting_setup"], last_reviewed: "2026-11-12",
      size_check: {"status": "unverified", "note": "リンク先530Lの型番とメーカー寸法は確認済みです。写真は運営者の使用例ですが、産卵床や日常飼育での適合は種・個体・配置で変わります。対応甲長を一律の数値では示しません。"},
      dimension_reference: {"model": "天馬 ロックス530L（ASIN B001OCBJX0）", "text": "購入リンクは530Lで、530Mとは別型番です。公式外寸は幅390×奥行530×高さ320mm。有効内寸A（凸部分を含まない）は幅302×奥行416×高さ275mm、B（凸部分を含む）は幅327×奥行441×高さ296mmです。収納用品の寸法であり、床材・設備を置いた空間や産卵床としての適合とは別です。", "url": "https://tenmafitsworld.com/SHOP/rox.html", "reviewed": "2026-11-12"},
      product_verification: {"asin": "B001OCBJX0", "model": "天馬ロックス530L", "identity_status": "verified", "reviewed": "2026-11-12"},
    },
    {
      id: "hide-terracotta", name_ja: "素焼き植木鉢（横倒し／半割り）", category: "shelter",
      turtle_type_tags: ["semi-aquatic", "box", "forest", "tortoise"],
      shell_min_cm: 3, shell_max_cm: 25, shell_buckets: ["S", "M", "L", "XL"],
      life_stage: ["hatchling", "juvenile", "adult"], adult_suitability: "conditional", duration: "depends_on_setup",
      dim_external: { w: null, d: null, h: null, unit: "mm", src: null },
      dim_internal: { w: null, d: null, h: null, unit: "mm" },
      dim_usable: {"note": "号数や外径を入口幅・内部空間に読み替えず、実際の開口部と内部を測ってください", "w": null, "d": null, "h": null},
      dim_confidence: "要確認",
      water_depth: null, substrate_depth: null, animal_count: "種・個体・配置ごとに判断",
      kscore: null,
      drown_badge: false, safety_label: "CONDITIONAL",
      conditions: ["全身が収まり、無理なく出入りできる開口部と内部空間を確保してください。甲幅の一律倍率では判定しません", "転がり・崩れを防ぎ、清掃できるようにします。切断面の鋭い部分は残さないでください"],
      risk_warnings: [
        { text: "割り口のバリは必ずヤスリで丸める（裂傷防止）", sev: "med" },
        { text: "甲幅ぎりぎりの鉢は成長後にはまり込む", sev: "med" }
      ],
      linked_failures: [], linked_contested: [],
      cta_enabled: true, cta_channel_hint: "homecenter_pref",
      affiliate: { amazon: null, rakuten: null }, // TODO: affiliate URL
      evidence: [{"url": "https://www.rspca.org.uk/adviceandwelfare/pets/other/hides", "type": "welfare", "label": "RSPCA・隠れ家の出入りと安定性", "region": "International"}, {"url": "https://vcahospitals.com/know-your-pet/turtles-box-housing", "type": "vet", "label": "VCA・ハコガメの横倒し植木鉢の利用例", "region": "International"}],
      image: { path: null, license: null, author: null, ok: false },
      confidence: null, unresolved: ["dims", "affiliate"], last_reviewed: "2026-11-12",
      size_check: {"status": "unverified", "note": "一般的な用品の種類として掲載しています。型番・実寸・個体の体格と設置条件を照合して選び、検索区分を対応甲長の保証にしないでください。"},
    },
    {
      id: "bask-brick", name_ja: "レンガ・平板タイル", category: "basking",
      turtle_type_tags: ["aquatic", "semi-aquatic"],
      shell_min_cm: 0, shell_max_cm: 999, shell_buckets: ["S", "M", "L", "XL", "XXL"],
      life_stage: ["hatchling", "juvenile", "adult"], adult_suitability: "conditional", duration: "depends_on_setup",
      dim_external: {"w": null, "d": null, "h": null, "unit": "mm", "src": null},
      dim_internal: null,
      dim_usable: {"note": "レンガやタイルは製品ごとに寸法が異なります。上陸でき、全身を水から出して乾かせる配置を確認してください", "w": null, "d": null, "h": null},
      dim_confidence: "要確認",
      water_depth: {"rule": "水位の変化も含めて、陸場が水没せず無理なく上り下りできることを確認"},
      substrate_depth: null, animal_count: "種・個体・配置ごとに判断",
      kscore: null,
      drown_badge: false, safety_label: "CONDITIONAL",
      conditions: ["崩れ・転倒・はさまりを防ぐ安定した構造にし、飼育容器の許容荷重と設置条件を確認します", "全身が乗る面積と経路を実際の個体に合わせます。甲長倍率や枚数だけで安全とは判定しません"],
      risk_warnings: [
        { text: "積んだだけの段は崩れて四肢・頸部を挟む", sev: "high" },
        { text: "壁との隙間に潜り込む閉じ込め事故に注意", sev: "med" }
      ],
      linked_failures: [], linked_contested: [],
      cta_enabled: true, cta_channel_hint: "homecenter_pref",
      affiliate: { amazon: null, rakuten: null }, // TODO: affiliate URL
      evidence: [{"url": "https://vcahospitals.com/know-your-pet/turtles-aquatic-housing", "type": "vet", "label": "VCA・水棲ガメの乾ける陸場と上陸路", "region": "International"}],
      image: { path: null, license: null, author: null, ok: false },
      confidence: null, unresolved: ["dims", "affiliate"], last_reviewed: "2026-11-12",
      size_check: {"status": "unverified", "note": "一般的な用品の種類として掲載しています。型番・実寸・個体の体格と設置条件を照合して選び、検索区分を対応甲長の保証にしないでください。"},
    },
    {
      id: "light-stand", name_ja: "GEX ライトスタンド（ライトドーム専用）", category: "light",
      turtle_type_tags: ["aquatic", "semi-aquatic", "box", "forest", "tortoise"],
      shell_min_cm: 0, shell_max_cm: 999, shell_buckets: ["S", "M", "L", "XL", "XXL"],
      life_stage: ["hatchling", "juvenile", "adult"], adult_suitability: "conditional", duration: "depends_on_setup",
      dim_external: { w: null, d: null, h: null, unit: "mm", src: null },
      dim_internal: null,
      dim_usable: {"note": "ライトドーム用の器具です。高さ調節53〜89cm。甲長ではなく灯具・ケージ・設置方法との適合を確認します", "w": null, "d": null, "h": null},
      dim_confidence: "要確認",
      water_depth: null, substrate_depth: null, animal_count: "種・個体・配置ごとに判断",
      kscore: null,
      drown_badge: false, safety_label: "CONDITIONAL",
      conditions: ["GEXライトドーム専用です。グラステラリウムやレプテリアの底面に土台を差し込み、取扱説明に沿って固定します", "ランプを容器から5cm以上離し、プラスチックへ直射させないでください。この5cmは亀への照射距離やUVB量の基準ではありません", "土台・固定ネジ・ゴムリング・コードホルダーを正しく使い、転倒とコードの熱源接触を防ぎます。生体への照射距離は使用ランプの説明を確認します"],
      risk_warnings: [
        { text: "クリップライト直付けは落下・火災の実例あり。スタンド化推奨", sev: "high" }
      ],
      linked_failures: ["fail-clamp-fire"], linked_contested: [],
      cta_enabled: true, cta_channel_hint: "amazon_pref",
      affiliate: { amazon: "https://amzn.to/44Ie9IR", rakuten: null }, // TODO: affiliate URL
      evidence: [{"url": "https://product.gex-fp.co.jp/exoterra/index.php?cid=405&id=1699&m=ProductListDetail", "type": "manufacturer", "label": "GEX公式・対応灯具と固定手順", "region": "JP"}],
      image: { path: null, license: null, author: null, ok: false },
      confidence: null, unresolved: [], last_reviewed: "2026-11-12",
      size_check: {"status": "not_applicable", "note": "甲長では判定しません。対応灯具・ケージ・設置条件を確認してください。"},
      product_verification: {"asin": "B07FHM2YKH", "model": "GEXライトスタンド", "identity_status": "verified", "reviewed": "2026-11-12"},
    },
    {
      id: "filter-sponge", name_ja: "GEX ストレーナースポンジ フィルターGD", category: "escape",
      turtle_type_tags: ["aquatic", "semi-aquatic"],
      shell_min_cm: 0, shell_max_cm: 999, shell_buckets: ["S", "M", "L", "XL", "XXL"],
      life_stage: ["hatchling", "juvenile", "adult"], adult_suitability: "conditional", duration: "depends_on_setup",
      dim_external: { w: null, d: null, h: null, unit: "mm", src: null },
      dim_internal: null,
      dim_usable: {"note": "グランデ600シリーズ・デュアルクリーンシリーズ用。パッケージ寸法をスポンジ本体の寸法として使いません", "w": null, "d": null, "h": null},
      dim_confidence: "要確認",
      water_depth: null, substrate_depth: null, animal_count: "種・個体・配置ごとに判断",
      kscore: null,
      drown_badge: false, safety_label: "CONDITIONAL",
      conditions: ["リンク先はGDの2個入り×4セットです。GEXグランデ600シリーズ・デュアルクリーンシリーズに対応し、任意のフィルターに使える汎用品ではありません", "メーカー用途はモーター保護・稚魚の吸込防止です。亀の脱走防止や溺水を防ぎ切る保証ではありません", "正しく装着し、外れ・目詰まり・流量と個体の泳ぎ方を点検します。フィルター自体の説明書にも従ってください"],
      risk_warnings: [
        { text: "強い吸込は幼体を吸着・溺水させる（実例あり）", sev: "high" }
      ],
      linked_failures: ["fail-filter-intake"], linked_contested: [],
      cta_enabled: true, cta_channel_hint: "amazon_pref",
      affiliate: { amazon: "https://amzn.to/4eGAqga", rakuten: null }, // TODO: affiliate URL
      evidence: [{"url": "https://product.gex-fp.co.jp/fish/index.php?cid=341&id=250&m=ProductListDetail", "type": "manufacturer", "label": "GEX公式・GDの対応フィルターと用途", "region": "JP"}],
      image: { path: null, license: null, author: null, ok: false },
      confidence: null, unresolved: [], last_reviewed: "2026-11-12",
      size_check: {"status": "not_applicable", "note": "甲長では判定しません。使用フィルターの型番と適合を確認してください。"},
      product_verification: {"asin": "B0B4CBBXP6", "model": "GEXストレーナースポンジフィルターGD 2個入×4セット", "identity_status": "verified", "reviewed": "2026-11-12"},
    },
    {
      id: "tote-land-juv", name_ja: "衣装ケースの床材飼育（型番ごとに確認）", category: "forest",
      turtle_type_tags: ["box", "forest", "tortoise"],
      shell_min_cm: 3, shell_max_cm: 12, shell_buckets: ["S", "M", "L"],
      life_stage: ["hatchling", "juvenile"], adult_suitability: "conditional", duration: "depends_on_setup",
      dim_external: { w: null, d: null, h: null, unit: "mm", src: null },
      dim_internal: { w: null, d: null, h: null, unit: "mm" },
      dim_usable: {"note": "底面内寸・最小幅・高さは型番ごとに確認します。外寸から一定幅を引いて推定しません", "w": null, "d": null, "h": null},
      dim_confidence: "要確認",
      water_depth: null, substrate_depth: {"rule": "種の掘る習性、床材の性質、温湿度と容器の有効高さに合わせて調整"},
      animal_count: "種・個体・配置ごとに判断",
      kscore: null,
      drown_badge: false, safety_label: "CONDITIONAL",
      conditions: ["床材・水入れ・隠れ家・温度勾配を確保したうえで、個体が動ける空間を確認します。12cm以下なら使えるという共通基準はありません", "通気を確保し、床材や設備を足場に脱走できない構造にします。壁の残り高さを一律15cmとする保証はありません"],
      risk_warnings: [{"text": "熱源の距離・対応材質を守り、プラスチックへの直接照射や接触を避けてください", "sev": "high"}, {"text": "成長や配置の変化に合わせて見直します。成体なら一律90cmで足りるとは判断しません", "sev": "med"}],
      linked_failures: ["fail-sealed-humid", "fail-size-outgrow"], linked_contested: ["contest-humidity", "contest-closed-chamber"],
      cta_enabled: true, cta_channel_hint: "rakuten_pref",
      affiliate: { amazon: null, rakuten: null }, // TODO: affiliate URL
      evidence: [{"url": "https://vcahospitals.com/know-your-pet/turtles-box-housing", "type": "vet", "label": "VCA・ハコガメの温度勾配・熱源・構造物", "region": "International"}, {"url": "https://note.com/ikimonooki/n/nc0ff66dcebdc", "type": "keeper", "label": "天馬530L程度・排水穴と湿潤床材のスペングラー屋外例", "region": "International"}],
      image: { path: null, license: null, author: null, ok: false },
      confidence: null, unresolved: ["dims", "affiliate"], last_reviewed: "2026-11-12",
      size_check: {"status": "unverified", "note": "一般的な用品の種類として掲載しています。型番・実寸・個体の体格と設置条件を照合して選び、検索区分を対応甲長の保証にしないでください。"},
    },
    {
      id: "tote-water-juv", name_ja: "衣装ケース（水棲ガメの飼育実例）", category: "aquatic",
      turtle_type_tags: ["aquatic", "semi-aquatic"],
      shell_min_cm: 3, shell_max_cm: 10, shell_buckets: ["S", "M"],
      life_stage: ["hatchling", "juvenile"], adult_suitability: "conditional", duration: "depends_on_setup",
      dim_external: { w: null, d: null, h: null, unit: "mm", src: null },
      dim_internal: { w: null, d: null, h: null, unit: "mm" },
      dim_usable: {"note": "型番ごとの注水可否・耐荷重・実内寸を確認します。容量の1/3なら変形しないという基準はありません", "w": null, "d": null, "h": null},
      dim_confidence: "要確認",
      water_depth: null, substrate_depth: null,
      animal_count: "種・個体・配置ごとに判断",
      kscore: null,
      drown_badge: false, safety_label: "CONDITIONAL",
      conditions: ["衣装ケースは、複数の飼育者が水棲ガメの飼育に利用している方法です。iNLOCK350Mで約15年飼育後にROX740-3Lへ移した記録や、衣装ケースで約5年飼育したという記録があります", "長く使えた例だけでなく、取っ手の破損やケースを2回壊した経験も報告されています。飼育年数は同じケースの耐用年数や全製品の保証ではありません", "メーカー・型番・置き場所・水量・経年変化で条件は異なります。天馬FAQの注水不可という案内を他社の全製品へ広げず、対象商品の表示を確認してください", "注水非対応と明記された製品は、その注意に従います。少量なら適合する、一律に幼体専用・成体不可といった決め方はしません", "必要な広さ・水深・上陸路を種と個体に合わせ、ひび・変形・水漏れ・熱源との接触を点検します。異常があれば別の容器へ移してください"],
      risk_warnings: [
        { text: "注水非対応の製品や劣化したケースでは、変形・破損・水漏れのおそれがあります", sev: "high" },
        { text: "ヒーターが樹脂面に接触すると溶融・火災", sev: "high" },
        { text: "成長に合わせ、その種の成体サイズ・床面積・水場・設備配置に合う飼育容器へ移行", sev: "med" }
      ],
      linked_failures: ["fail-size-outgrow"], linked_contested: [],
      cta_enabled: true, cta_channel_hint: "rakuten_pref",
      affiliate: { amazon: null, rakuten: null }, // TODO: affiliate URL
      evidence: [{"url": "https://nao-yoshi.seesaa.net/article/503217155.html", "type": "keeper", "label": "iNLOCK350Mで約15年、その後ROX740-3Lへ移行した実例", "region": "International"}, {"url": "https://growthvest1.com/turtle-costumecase-usability/", "type": "keeper", "region": "JP", "label": "衣装ケースで約5年飼育・取っ手破損も記録（型番未特定）"}, {"url": "https://sato000000.net/suisei-kame-siikukesu", "type": "keeper", "region": "JP", "label": "衣装ケースを2回壊した本人の経験（型番未特定）"}, {"url": "https://tenmafitsworld.com/hpgen/HPB/entries/8.html", "type": "manufacturer", "label": "天馬公式の注水注意（天馬収納用品の案内。全メーカー共通ではない）", "region": "JP"}],
      image: { path: null, license: null, author: null, ok: false },
      confidence: null, unresolved: ["dims", "affiliate"], last_reviewed: "2026-11-12",
      size_check: {"status": "unverified", "note": "衣装ケースでの飼育は複数の実例があります。ここは製品を一つに限定した紹介ではないため、共通の内寸や対応甲長は設定せず、実際に使うケースと個体を照合します。"},
    },
    {
      id: "hide-pvc", name_ja: "塩ビ管（VU/VP）水中シェルター", category: "shelter",
      turtle_type_tags: ["aquatic", "semi-aquatic"],
      shell_min_cm: 3, shell_max_cm: 25, shell_buckets: ["S", "M", "L", "XL"],
      life_stage: ["hatchling", "juvenile", "adult"], adult_suitability: "conditional", duration: "depends_on_setup",
      dim_external: { w: null, d: null, h: null, unit: "mm", src: null },
      dim_internal: { w: null, d: null, h: null, unit: "mm", note: "呼び径と実内径は異なる" },
      dim_usable: {"note": "呼び径だけでなく、実際の内径・長さ・出入口・個体の甲幅や高さを照合します", "w": null, "d": null, "h": null},
      dim_confidence: "要確認",
      water_depth: { rule: "上端から水面まで浮上空間を残す", note: null }, substrate_depth: null,
      animal_count: "種・個体・配置ごとに判断",
      kscore: null,
      drown_badge: true, safety_label: "CONDITIONAL",
      conditions: ["甲幅×1.5という一律基準では判定しません。成長を含めて、無理なく出入りできるか確認します", "水中では閉じ込め・はまり込み・浮上経路の妨げを避け、両端をふさがず、動かないように設置します", "切断面を滑らかにし、窮屈になったら使用を中止します。危険な狭さを実際に通らせて試さないでください"],
      risk_warnings: [
        { text: "はまり込みは溺死に直結（最重要）。甲幅ぎりぎりの径は使わない", sev: "high" },
        { text: "成長で通れた径が通れなくなる", sev: "high" }
      ],
      linked_failures: ["fail-hide-entrap"], linked_contested: [],
      cta_enabled: true, cta_channel_hint: "homecenter_pref",
      affiliate: { amazon: null, rakuten: null }, // TODO: affiliate URL
      evidence: [{"url": "https://www.rspca.org.uk/adviceandwelfare/pets/other/hides", "type": "welfare", "label": "RSPCA・一般的な隠れ家の開口・安定性（PVC水中用途の保証ではない）", "region": "International"}],
      image: { path: null, license: null, author: null, ok: false },
      confidence: null, unresolved: ["dims", "affiliate"], last_reviewed: "2026-11-12",
      size_check: {"status": "unverified", "note": "一般的な用品の種類として掲載しています。型番・実寸・個体の体格と設置条件を照合して選び、検索区分を対応甲長の保証にしないでください。"},
    },
    {
      id: "hospital-container", name_ja: "天馬ロックス530M（収納ケースの転用）", category: "hospital",
      turtle_type_tags: ["aquatic", "semi-aquatic", "box", "forest", "tortoise"],
      shell_min_cm: 0, shell_max_cm: 18, shell_buckets: ["S", "M", "L", "XL"],
      life_stage: ["hatchling", "juvenile", "adult"], adult_suitability: "unknown", duration: "unknown",
      dim_external: { w: null, d: null, h: null, unit: "mm", src: null },
      dim_internal: { w: null, d: null, h: null, unit: "mm" },
      dim_usable: { note: "リンク先はロックス530Mです。公式の有効内寸は下記資料に記載しますが、動物が使える範囲や飼育適合を意味しません。", w: null, d: null, h: null },
      dimension_reference: {"model": "天馬 ロックス530M（確認したリンク先の型番）", "text": "リンク先はASIN B001OC9MJSです。公式の外寸は幅390×奥行530×高さ243mm、有効内寸A（凸部分を含まない）は幅307×奥行421×高さ197mm、B（凸部分を含む）は幅332×奥行446×高さ218mmです。530Mだけの収納寸法で、飼育適合や使用できる甲長を示しません。", "url": "https://tenmafitsworld.com/SHOP/rox.html", "reviewed": "2026-11-12"},
      product_verification: { asin: "B001OC9MJS", model: "天馬 ロックス530M", amazon_url: "https://www.amazon.co.jp/dp/B001OC9MJS", identity_status: "verified", observed_affiliate_tag: "kamelife09-22", affiliate_tag_status: "owner_confirmation_required", reviewed: "2026-11-12" },
      dim_confidence: "manufacturer_documented",
      water_depth: null, substrate_depth: null,
      animal_count: "用途・個体・配置ごとに判断",
      kscore: null,
      drown_badge: false, safety_label: "UNKNOWN",
      conditions: ["床材を敷く使い方：排水穴を付けた天馬530L程度のケースに湿った床材を入れ、屋外でスペングラーヤマガメを飼う実例があります。少量の水が残る構造で、乾いたケースの例ではなく、530Mとは高さなどが異なる別型番です", "注水する使い方：iNLOCK350MからROX740-3Lへ移行してクサガメを飼う記録があります。530Mでの実績とは区別します", "メーカーの収納用品FAQでは、水を入れる用途では使用しないよう明記しています。転用実例があっても、メーカーが認めた用途や耐水保証にはなりません", "乾いた状態の移送・隔離も、通気・温度・個体の状態を別途検討します。収納寸法だけで薬浴や通院向けと判断しません"],
      size_check: {"status": "unverified", "note": "530Mの型番と収納寸法は確認済みです。別型番の飼育例はありますが、530Mそのものの飼育条件と対応甲長は確認できていません。購入リンクは停止を維持しています。"},
      risk_warnings: [{"text": "密閉したまま動物を入れず、通気と温度を確保してください", "sev": "high"}, {"text": "天馬FAQは注水時の変形・破損を注意しています。少量・短時間なら適合するとする根拠は確認できません", "sev": "high"}],
      linked_failures: [], linked_contested: [],
      cta_enabled: false, cta_channel_hint: "amazon_pref",
      affiliate: { amazon: "https://amzn.to/3RcHBDP", rakuten: null }, // TODO: affiliate URL
      evidence: [{"url": "https://tenmafitsworld.com/hpgen/HPB/entries/8.html", "type": "manufacturer", "region": "JP", "label": "天馬公式FAQ・収納用品の水使用について"}, {"url": "https://nao-yoshi.seesaa.net/article/503217155.html", "type": "keeper", "region": "JP", "label": "iNLOCK350M・ROX740-3Lの注水飼育例（530Mとは別）"}, {"url": "https://note.com/ikimonooki/n/nc0ff66dcebdc", "type": "keeper", "region": "JP", "label": "天馬530L程度・排水穴と湿潤床材の屋外例（530Mとは別）"}],
      image: { path: null, license: null, author: null, ok: false },
      confidence: null, unresolved: ["dry_animal_transport_suitability", "affiliate_tag_owner"], last_reviewed: "2026-11-12",
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
      prevention: ["個体が無理なく出入りできる内径・高さと浮上経路を確保", "両端開放で袋小路を作らない", "月1回体格と径を照合"],
      related_equipment: ["hide-pvc"], related_type: ["aquatic", "semi-aquatic"],
      related_buckets: ["S", "M", "L", "XL"], related_contested: [],
      evidence: [{ url: "https://www.allturtles.com/can-a-turtle-drown/", type: "article" }],
      owner_note: null, owner_note_flag: false,
      cta_opportunity: { safe: false, equipment_id: null }
    },
    {
      id: "fail-size-outgrow", title_ja: "成体でサイズが破綻する", severity: "serious", urgency: "adjust_setup",
      symptoms: ["壁沿いの徘徊が続く", "甲羅・鼻先の擦り傷"],
      cause: "幼体基準で容器を選び、成長して床面積・水量が不足する。",
      warning_signs: ["方向転換が窮屈", "壁を登ろうとする", "壁沿いの徘徊は、ほかのサインと合わせて判断する"],
      prevention: ["成体甲長で最終環境を逆算", "卒業サイズを最初から把握", "擦り傷があれば、ぶつかる角や設備をすぐ見直す"],
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
      prevention: ["床材・設備を足場に縁へ届かない構造と、通気を保つフタを確認", "返し/フタ/ネット+バンドで固定"],
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
      vet_note: "ぐったりしている、反応が鈍いときは、早めに爬虫類を診られる動物病院へ相談してください。",
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
      cause: "不適切な産卵場所は産卵困難の要因の一つです。温湿度・栄養・脱水や卵・個体の状態なども関わります。",
      warning_signs: ["産卵の気配があるのに数日産まない", "掘っては崩れる"],
      prevention: ["種と個体に合う産卵床の深さ・質・温湿度を確認", "黒土：川砂で崩れにくい坑を作る", "産まなければ爬虫類対応の病院へ"],
      related_equipment: ["nest-tote-soil"], related_type: ["aquatic", "semi-aquatic", "box", "tortoise"],
      related_buckets: ["M", "L", "XL"], related_contested: ["contest-sand"],
      evidence: [{ url: "https://www.allturtles.com/turtle-nesting-box/", type: "article" }],
      owner_note: null, owner_note_flag: false,
      cta_opportunity: { safe: true, equipment_id: "nest-tote-soil" }
    },
    {
      id: "fail-sealed-humid", title_ja: "密閉蒸れによる呼吸器リスク", severity: "serious", urgency: "adjust_setup",
      symptoms: ["容器内の結露が引かない・悪臭（環境のサイン）", "鼻水・口や鼻の泡・開口呼吸（呼吸器の症状）"],
      vet_note: "鼻水、口や鼻の泡、首を伸ばした呼吸、開口呼吸、元気や食欲の低下があれば、環境を直すだけで様子を見ず、早めに爬虫類を診られる動物病院へ相談してください。",
      cause: "換気のない密閉で蒸れ、温度不足などが重なると、呼吸器のトラブルにつながるおそれがある。適した湿度は種によって違う。",
      warning_signs: ["容器内が常に結露", "悪臭"],
      prevention: ["通気孔を確保し、密閉しない", "湿度は下げればよいわけではない。その種に合う温度・湿度・換気をそろえる"],
      related_equipment: ["tote-land-juv"], related_type: ["box", "forest", "tortoise"],
      related_buckets: ["S", "M", "L"], related_contested: ["contest-humidity", "contest-closed-chamber"],
      evidence: [{ url: "https://vcahospitals.com/know-your-pet/turtles-box-diseases", type: "vet" }, { url: "https://tortoiseforum.org/threads/current-consensus-on-humidity.226076/", type: "forum" }],
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
      reason: "はまり込み→溺死。成長で径が合わなくなる。一律の甲幅倍率で安全とは判定せず、無理なく出入りできる空間を確保する。",
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
      id: "danger-full-water-tote", name_ja: "注水非対応の衣装ケースへの注水",
      safety_label: "UNSAFE", cta_enabled: false,
      reason: "注水に対応しない収納ケースは変形・破損するおそれがあります。容量の1/3以下ならよいとは判断せず、メーカーの用途表示を確認してください。",
      alternative_id: null,
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
      safe_side_default: "適した湿度は種によって違う。その種に合う温度・湿度・換気をそろえ、温度が保てないまま高湿度にしない。",
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
