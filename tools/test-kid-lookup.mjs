// KID（/kid/）の回帰テスト: 区分の境界・サイズ条件の未確認表示・購入リンクのロック・症状の案内
// 実行: node tools/test-kid-lookup.mjs
import { createRequire } from "module";
import { readFileSync } from "fs";
const require = createRequire(import.meta.url);

globalThis.window = {};
globalThis.document = {
  readyState: "complete",
  getElementById: () => null,
  querySelectorAll: () => [],
  querySelector: () => null,
  addEventListener: () => {},
};
require("../data/kid.js");
require("../js/kid-lookup.js");
const KID = window.KID;
const T = window.KIDLookupTest;

let pass = 0, fail = 0;
function check(name, cond, detail) {
  if (cond) { pass++; } else { fail++; console.log("FAIL:", name, detail || ""); }
}

// 1. 区分の境界: 区分は対応甲長と重なるものだけ、重なる区分は漏れなく
for (const e of KID.equipment) {
  for (const [k, b] of Object.entries(KID.buckets)) {
    const overlap = e.shell_min_cm < b.max && e.shell_max_cm > b.min;
    const listed = e.shell_buckets.includes(k);
    check(`${e.id} 区分${k} の掲載と対応甲長の重なり`, overlap === listed, `overlap=${overlap} listed=${listed}`);
  }
}

// 2. 区分の一部しか対応しない用品は、使える範囲を表示する
const fit = (id, k) => {
  const e = KID.equipment.find((x) => x.id === id);
  const unv = !!(e.size_check && e.size_check.status === "unverified");
  return T.fitMessage(e.shell_min_cm, e.shell_max_cm, unv, KID.buckets[k]);
};
// 数値範囲のロジックは合成データで固定。未確認の現用品を検証済み扱いにしない。
check("一部範囲の合成例10〜12cm", T.fitMessage(3, 12, false, KID.buckets.L).includes("甲長10〜12cm"));
check("一部範囲の合成例3〜6cm", T.fitMessage(3, 25, false, KID.buckets.S).includes("甲長3〜6cm"));
check("全域の合成例は注記なし", T.fitMessage(3, 10, false, KID.buckets.M) === "");
check("上限なしの合成例は注記なし", T.fitMessage(0, 999, false, KID.buckets.XXL) === "");
for (const id of ["tote-land-juv", "tote-water-juv", "hide-terracotta", "hide-pvc", "bask-brick", "nest-tote-soil"]) {
  check(`${id} 適合範囲を推定しない`, fit(id, "L").includes("未確認"));
}

// 3. 未確認容器は型番・実内寸・適合甲長を推定しない。
for (const id of ["tub-toro-80", "hospital-container"]) {
  const e = KID.equipment.find(x => x.id === id);
  const c = T.cardHtml(e);
  check(`${id} 用途制限を安全評価にしない`, e.safety_label === "UNKNOWN" && e.kscore === null && !c.includes('class="kscore"'));
  check(`${id} 実内寸に型番不明の値を置かない`, !e.dim_internal.w && !e.dim_internal.d && !e.dim_internal.h);
  check(`${id} 外寸を汎用品の寸法として流用しない`, !e.dim_external.w && !e.dim_external.d && !e.dim_external.h);
  check(`${id} 用途制限がある製品のCTAを生成しない`, e.cta_enabled === false && T.ctaHtml(e) === "");
  check(`${id} 保留中も既存URLを捏造・削除しない`, e.affiliate.amazon === ({ "tub-toro-80": "https://amzn.to/4p0SGUV", "hospital-container": "https://amzn.to/3RcHBDP" })[id]);
  check(`${id} 未確認範囲の色帯がない`, !c.includes('class="gauge-track"') && !c.includes('class="gauge-band"'));
  check(`${id} 詳細の対応甲長も未確認`, /<dt>対応甲長<\/dt><dd>未確認です。/.test(c));
  check(`${id} メーカー資料の型番限定を表示`, c.includes("型番を限定した寸法資料") && c.includes(e.dimension_reference.url.replace(/&/g, "&amp;")));
  check(`${id} 倍率から適合甲長を算出しない`, !/甲長×[35]|甲長(?:16|17)cm/.test(c));
}
const toro = KID.equipment.find(x => x.id === "tub-toro-80");
check("トロ舟の807×500は底面外寸と明記", toro.dimension_reference.text.includes("底面外寸 約807×500mm") && toro.dimension_reference.text.includes("内寸ではありません"));
check("トロ舟のメーカー用途制限を隠さない", toro.dimension_reference.text.includes("表示用途以外") && toro.dimension_reference.text.includes("メーカーが案内している用途には含まれていません"));
const hospital = KID.equipment.find(x => x.id === "hospital-container");
check("530M寸法を他モデル・購入先に当てはめない", hospital.dimension_reference.text.includes("530Mの寸法です") && hospital.dimension_reference.text.includes("どの甲長まで飼えるかは、この数字だけでは分かりません"));
check("移行先に一律の×5を戻さない", !KID.equipment.find(x => x.id === "tote-water-juv").risk_warnings.some(x => /甲長×5/.test(x.text)));
// 一般の寸法／倍率の矛盾も検知する。外寸を内寸に代用せず、倍率の妥当性は別途要出典。
for (const e of KID.equipment) {
  const text = (e.conditions || []).concat(e.dim_usable?.note || "").find(t => /長辺/.test(t) && /甲長×[0-9]/.test(t));
  if (!text) continue;
  const ratio = Number(text.match(/甲長×([0-9.]+)/)[1]);
  const inner = e.dim_internal;
  const known = inner?.unit === "mm" && inner.w > 0 && inner.d > 0;
  check(`${e.id} 内寸のない倍率判定は未確認`, known || e.size_check?.status === "unverified");
  if (known) check(`${e.id} 内寸と倍率の算術矛盾を断定しない`, e.shell_max_cm <= Math.max(inner.w, inner.d) / 10 / ratio || e.size_check?.status === "unverified");
}
check("トロ舟80型は未確認表示", fit("tub-toro-80", "XL").includes("未確認"));
check("頑丈コンテナは未確認表示", fit("hospital-container", "XL").includes("未確認"));
const toroCard = T.cardHtml(KID.equipment.find((x) => x.id === "tub-toro-80"));
check("未確認カードにサイズ条件の注記", toroCard.includes("サイズ条件は未確認"));
check("未確認カードは対応甲長を『めやす』と断定しない", toroCard.includes("使える甲長は未確認です") && !toroCard.includes("対応甲長めやす"));
for (const e of KID.equipment) {
  const c = T.cardHtml(e);
  check(`${e.id} 甲長表示に「〜〜」がない`, !c.includes("〜〜"));
}
// 読み上げ名（aria-label）と表示: 未確認2件は数値を含めず「未確認」を伝える。確認済みは従来どおり
const UNV = "使える甲長は未確認です。下のサイズ条件をご覧ください。";
const EXPECT_VERIFIED = {
  "nest-tote-soil": "対応甲長 6〜25cm", "hide-terracotta": "対応甲長 3〜25cm", "bask-brick": "対応甲長 上限なし",
  "light-stand": "対応甲長 上限なし", "filter-sponge": "対応甲長 上限なし", "tote-land-juv": "対応甲長 3〜12cm",
  "tote-water-juv": "対応甲長 3〜10cm", "hide-pvc": "対応甲長 3〜25cm",
};
for (const e of KID.equipment) {
  const c = T.cardHtml(e);
  const label = (c.match(/class="gauge" role="img" aria-label="([^"]*)"/) || [])[1];
  const note = (c.match(/gauge-note">([^<]*)/) || [])[1];
  if (e.size_check && e.size_check.status === "unverified") {
    check(`${e.id} 読み上げ名は未確認`, label === UNV, label);
    check(`${e.id} 読み上げ名に数値なし`, !/\d/.test(label), label);
    check(`${e.id} 表示と読み上げ名が一致`, note === UNV, note);
  } else if (e.size_check?.status === "not_applicable") {
    check(`${e.id} 甲長非該当の表示と読上げ名`, label === "使っている器具に合うか、設置方法とあわせて確認してください。" && note === label);
    check(`${e.id} 甲長非該当は数値ゲージなし`, !c.includes('class="gauge-track"'));
  } else {
    check(`${e.id} 確認済みの読み上げ名は従来どおり`, label === EXPECT_VERIFIED[e.id], label);
    check(`${e.id} 確認済みの表示は「めやす」`, note.startsWith("対応甲長めやす："), note);
  }
}
check("適合甲長未確認は8件", KID.equipment.filter((e) => e.size_check && e.size_check.status === "unverified").length === 8);
// 上限なし・上限あり・未確認の3種類で、読み上げ名と表示の意味をそろえる
const gaugeOf = (e) => {
  const c = T.cardHtml(e);
  return { label: c.match(/class="gauge" role="img" aria-label="([^"]*)"/)[1], note: c.match(/gauge-note">([^<]*)/)[1] };
};
for (const e of KID.equipment) {
  const { label, note } = gaugeOf(e);
  check(`${e.id} 読み上げ名に「0〜cm」「〜cm」だけの不完全な範囲がない`, !/\d〜cm|^対応甲長 〜/.test(label), label);
  if (e.size_check && ["unverified", "not_applicable"].includes(e.size_check.status)) continue;
  if (e.shell_max_cm >= 999) {
    check(`${e.id} 上限なしは読み上げも「上限なし」`, label.includes("上限なし") && note.includes("上限なし"), label + " / " + note);
  } else {
    check(`${e.id} 上限ありは読み上げに上限の数値`, label.includes(e.shell_max_cm + "cm") && note.includes(e.shell_max_cm + "cm"), label + " / " + note);
  }
}
// 下限ありで上限なしの場合の表現（現データにはないが、関数の分岐を固定する）
const synth = gaugeOf({ id: "synthetic", name_ja: "x", shell_min_cm: 5, shell_max_cm: 999, shell_buckets: [], safety_label: "SAFE", cta_enabled: false });
check("下限5cm・上限なしの読み上げ", synth.label === "対応甲長 5cm〜（上限なし）", synth.label);
check("下限5cm・上限なしの表示", synth.note === "対応甲長めやす：5cm〜（上限なし）", synth.note);

// 4. 購入リンク: 条件付き（CONDITIONAL）はロック中 href なし、data-href に実URL
for (const e of KID.equipment) {
  const html = T.ctaHtml(e);
  if (!html) continue;
  const links = [...html.matchAll(/<a [^>]*>/g)].map((m) => m[0]);
  for (const a of links) {
    const placeholder = a.includes("is-placeholder");
    const locked = a.includes("is-locked");
    if (placeholder) {
      check(`${e.id} 準備中リンクは href なし`, !/ href=/.test(a), a);
    } else if (locked) {
      check(`${e.id} ロック中は href なし`, !/ href=/.test(a), a);
      check(`${e.id} ロック中は data-href に実URL`, /data-href="https:\/\//.test(a), a);
      check(`${e.id} ロック中は aria-disabled`, a.includes('aria-disabled="true"'), a);
    } else {
      check(`${e.id} 通常リンクは href あり`, /href="https:\/\//.test(a), a);
    }
  }
}
const src = readFileSync(new URL("../js/kid-lookup.js", import.meta.url), "utf8");
check("ロック中・準備中のクリックは preventDefault", /is-locked"\) \|\| !a\.getAttribute\("href"\)\) \{ e\.preventDefault\(\)/.test(src));
check("解除時に data-href を href へ戻す", /setAttribute\("href", h\)/.test(src));

// 5. 症状の案内: 呼吸器症状・ぐったりは獣医相談を併記し、「環境を調整」だけにしない
for (const f of KID.failures) {
  const sym = (f.symptoms || []).join(" ");
  if (/鼻水|開口呼吸|ぐったり/.test(sym) && f.urgency !== "emergency_vet") {
    check(`${f.id} は獣医相談の案内あり`, !!f.vet_note && /動物病院/.test(f.vet_note));
    check(`${f.id} の描画に獣医相談`, T.failHtml(f).includes("動物病院"));
  }
}
const humid = KID.contested.find((c) => c.id === "contest-humidity");
check("湿度を一律に下げる表現をしない", !/湿度を下げる。?$/.test(humid.safe_side_default), humid.safe_side_default);

for (const d of KID.dangerous) {
  const alternative = KID.equipment.find(e => e.id === d.alternative_id);
  check(`${d.id} alternative is not UNKNOWN or UNSAFE`, !alternative || !["UNKNOWN", "UNSAFE"].includes(alternative.safety_label));
}

for (const [id, asin] of [["tub-toro-80", "B00N3MTF8A"], ["hospital-container", "B001OC9MJS"]]) {
  const e = KID.equipment.find(x => x.id === id);
  check(`${id} リンク先型番は確認済み`, e.product_verification.identity_status === "verified" && e.product_verification.asin === asin && !e.unresolved.includes("model_identity"));
  check(`${id} アフィリエイトタグを勝手に承認しない`, e.product_verification.observed_affiliate_tag === "kamelife09-22" && e.product_verification.affiliate_tag_status === "owner_confirmation_required");
  check(`${id} 頭数の適合推薦を残さない`, e.animal_count === "用途・個体・配置ごとに判断");
  check(`${id} 飼育期間の推薦を残さない`, e.duration === "unknown");
}
check("ROX公式有効内寸AとBを混ぜない", hospital.dimension_reference.text.includes("幅307×奥行421×高さ197mm") && hospital.dimension_reference.text.includes("幅332×奥行446×高さ218mm"));
check("ROX水用途禁止の一次資料あり", hospital.evidence.some(x => x.url === "https://tenmafitsworld.com/hpgen/HPB/entries/8.html") && hospital.conditions.some(x => x.includes("メーカーが認めた用途や耐水保証にはなりません")));
check("ROXに薬浴推薦や簡易床の断定を残さない", hospital.substrate_depth === null && !hospital.conditions.some(x => /薬浴は目的/.test(x)));


// 全10用品の根拠と表示。数字を消すだけでなく、実際に選ぶ条件を残す。
check("用品は10件のまま", KID.equipment.length === 10);
for (const e of KID.equipment) {
  const c = T.cardHtml(e);
  check(`${e.id} 根拠なしSAFE/スコアを掲載しない`, e.safety_label !== "SAFE" && e.kscore === null && e.confidence === null);
  check(`${e.id} 実寸なしの数値ゲージを掲載しない`, !c.includes('class="gauge-track"'));
  check(`${e.id} 使用条件が残る`, e.conditions.length >= 2);
  check(`${e.id} 全出典が描画される`, e.evidence.every(x => c.includes(x.url.replace(/&/g, "&amp;"))));
}
for (const id of ["light-stand", "filter-sponge"]) {
  const c = T.cardHtml(KID.equipment.find(e => e.id === id));
  check(`${id} 非該当の検索属性`, c.includes('data-size-na="1"'));
  check(`${id} 実内寸の要確認を誤表示しない`, c.includes('<dt>器具の適合</dt>') && !c.includes('<dt>実内寸</dt>'));
}
check("メーカー資料を実飼育と誤表示しない", !T.cardHtml(hospital).includes("実飼育の参考") && T.cardHtml(hospital).includes("メーカー資料："));
check("赤長80Lの床材実例が見える", T.cardHtml(toro).includes("ヨツユビリクガメ") && T.cardHtml(toro).includes("飼育者の実例："));
check("ROX別型番を530M実績にしない", hospital.conditions.some(x => x.includes("530Mとは高さなどが異なる別型番")) && hospital.conditions.some(x => x.includes("530Mでの実績とは区別")));
check("元2商品の一律非推奨を撤回", ![toro, hospital].some(e => T.cardHtml(e).includes("推奨しません")));
const nest = KID.equipment.find(e => e.id === "nest-tote-soil");
check("530LのA/Bを混ぜない", nest.dimension_reference.text.includes("幅302×奥行416×高さ275mm") && nest.dimension_reference.text.includes("幅327×奥行441×高さ296mm"));
check("530L写真は実例として保持", nest.image.ok === true && nest.image.path === "../assets/kid/nest-tote-soil-530l.webp" && nest.image.caption.includes("実例"));
check("産卵困難の複合要因", nest.risk_warnings.some(x => x.text.includes("複数の原因")));
const stand = KID.equipment.find(e => e.id === "light-stand");
check("ライトドーム専用条件を明示", stand.conditions.some(x => x.includes("ライトドーム専用")));
check("5cmをUVB基準にしない", stand.conditions.some(x => x.includes("UVB量の基準ではありません")));
const sponge = KID.equipment.find(e => e.id === "filter-sponge");
check("GDは対応フィルターを限定", sponge.conditions.some(x => x.includes("グランデ600シリーズ・デュアルクリーンシリーズ")));
check("GDの魚類用途を亀溺水防止保証にしない", sponge.conditions.some(x => x.includes("モーターの保護と稚魚の吸い込み防止") && x.includes("吸い込みの強さや泳ぐ様子を見てください")) && sponge.risk_warnings.some(x => x.text.includes("溺水")));
check("標準レンガの寸法を汎用に流用しない", KID.equipment.find(e => e.id === "bask-brick").dim_external.w === null);
check("依存警告に旧倍率保証なし", !KID.failures.some(e => JSON.stringify(e).includes("甲幅×1.5以上") || JSON.stringify(e).includes("甲長×1〜1.5")));
check("満水警告に1/3以下なら可を残さない", KID.dangerous.find(e => e.id === "danger-full-water-tote").reason.includes("1/3以下ならよいとは判断せず"));
const activeIds = KID.equipment.filter(e => e.cta_enabled && e.affiliate?.amazon && !["UNKNOWN", "UNSAFE"].includes(e.safety_label)).map(e => e.id);
check("有効な既存購入導線3件を条件確認付きで保持", JSON.stringify(activeIds) === JSON.stringify(["nest-tote-soil", "light-stand", "filter-sponge"]));
for (const e of KID.equipment.filter(e => activeIds.includes(e.id))) {
 check(`${e.id} 新規の安全認定なし・条件確認ロック`, e.safety_label === "CONDITIONAL" && !/ href="https/.test(T.ctaHtml(e)) && T.ctaHtml(e).includes('data-href="https'));
}
// 数値ゲージの従来分岐も合成例で維持。
for (const [min, max, label] of [[0,999,"対応甲長 上限なし"],[3,12,"対応甲長 3〜12cm"]]) {
 const g = gaugeOf({id:"fixture",name_ja:"fixture",shell_min_cm:min,shell_max_cm:max,shell_buckets:[],safety_label:"UNKNOWN",cta_enabled:false});
 check(`合成ゲージ${min}/${max}`,g.label===label,g.label);
}

for (const e of [hospital, nest]) {
 check(`${e.id} 確認済みメーカー寸法を未確認としない`, T.cardHtml(e).includes('<dt>メーカー寸法</dt>') && !T.cardHtml(e).includes('<dt>実内寸</dt>'));
}
for (const e of [stand, sponge]) check(`${e.id} 器具に頭数を割り当てない`, !T.cardHtml(e).includes('<dt>頭数</dt>'));
check("ヒロ氏の推薦例を型番未特定と明示", toro.evidence.some(e => e.url.includes("QliTKh5nSMc") && e.label.includes("型番未特定")) && toro.conditions.some(x => x.includes("その人の亀に合わせた使い方") && x.includes("そのまま当てはめない")));
const waterCase = KID.equipment.find(e => e.id === "tote-water-juv");
check("衣装ケース利用を複数の実践例として掲載", waterCase.conditions.some(x => x.includes("複数の飼育者")));
check("5年飼育を同一ケースの寿命にしない", waterCase.conditions.some(x => x.includes("同じケースを何年使ったかまでは分かりません") && x.includes("別の製品でも同じように使えるとは限らない")));
check("長期利用と破損例の両方を掲載", waterCase.evidence.some(x => x.url.includes("growthvest1.com")) && waterCase.evidence.some(x => x.url.includes("sato000000.net")));
check("天馬注意を全衣装ケースへ一般化しない", waterCase.conditions.some(x => x.includes("製品ごとに確かめてください") && x.includes("天馬のFAQ")));
check("危険カードは注水非対応製品に限定", KID.dangerous.find(x => x.id === "danger-full-water-tote").name_ja === "注水非対応の衣装ケースへの注水");
check("Owner未許可のナフコ体験を公開しない", !JSON.stringify(KID).includes("ナフコ"));
check("衣装ケース破損の断定を製品条件に限定", waterCase.risk_warnings[0].text.includes("注水非対応の製品や劣化したケース") && waterCase.risk_warnings[0].text.includes("おそれ"));
// 文体改善でも、未確認・用途条件・購入導線の意味を変えない。
const kidPage = readFileSync(new URL("../kid/index.html", import.meta.url), "utf8");
check("根拠未確認の運営者失敗談を作らない", !kidPage.includes("私自身も") && !kidPage.includes("環境を組み直した失敗"));
check("初期表示と再描画案内を同期", kidPage.includes("まずはすべての用品を表示しています") && readFileSync(new URL("../js/kid-lookup.js", import.meta.url), "utf8").includes("まずはすべての用品を表示しています"));
check("素材転用の未知の適合を確定しない", KID.equipment.filter(e=>e.size_check?.status === "unverified").every(e=>T.cardHtml(e).includes("未確認")));
check("530Lの注水に関するメーカー注意を維持", nest.conditions.some(x=>x.includes("水を入れて使わないよう案内")));
check("旧修正理由の無意味な数値を再掲しない", !KID.equipment.some(e=>(e.conditions||[]).join(" ").match(/12cm以下なら|一律15cm|甲幅×1.5という/)));
check("冒頭で甲長だけを事故原因にしない", kidPage.includes("亀が動ける広さや水深、床材・設備") && !kidPage.includes("亀の甲長に合っていないと"));
console.log("──────────────────────────────");
console.log(`PASS ${pass} / FAIL ${fail}`);
process.exit(fail ? 1 : 0);
