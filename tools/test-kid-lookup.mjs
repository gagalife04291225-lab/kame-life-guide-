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
check("衣装ケース（陸）L区分は10〜12cm", fit("tote-land-juv", "L").includes("甲長10〜12cm"), fit("tote-land-juv", "L"));
check("素焼き鉢 S区分は3〜6cm", fit("hide-terracotta", "S").includes("甲長3〜6cm"), fit("hide-terracotta", "S"));
check("衣装ケース（水）M区分は全域対応", fit("tote-water-juv", "M") === "", fit("tote-water-juv", "M"));
check("レンガ XXL は全域対応", fit("bask-brick", "XXL") === "");

// 3. 未確認容器は型番・実内寸・適合甲長を推定しない。
for (const id of ["tub-toro-80", "hospital-container"]) {
  const e = KID.equipment.find(x => x.id === id);
  const c = T.cardHtml(e);
  check(`${id} 用途未確認を安全評価にしない`, e.safety_label === "UNKNOWN" && e.kscore === null && !c.includes('class="kscore"'));
  check(`${id} 実内寸に型番不明の値を置かない`, !e.dim_internal.w && !e.dim_internal.d && !e.dim_internal.h);
  check(`${id} 外寸を汎用品の寸法として流用しない`, !e.dim_external.w && !e.dim_external.d && !e.dim_external.h);
  check(`${id} 購入先の同一型番確認までCTAを生成しない`, e.cta_enabled === false && T.ctaHtml(e) === "");
  check(`${id} 保留中も既存URLを捏造・削除しない`, e.affiliate.amazon === ({ "tub-toro-80": "https://amzn.to/4p0SGUV", "hospital-container": "https://amzn.to/3RcHBDP" })[id]);
  check(`${id} 未確認範囲の色帯がない`, !c.includes('class="gauge-track"') && !c.includes('class="gauge-band"'));
  check(`${id} 詳細の対応甲長も未確認`, /<dt>対応甲長<\/dt><dd>未確認。/.test(c));
  check(`${id} メーカー資料の型番限定を表示`, c.includes("型番を限定した寸法資料") && c.includes(e.dimension_reference.url.replace(/&/g, "&amp;")));
  check(`${id} 倍率から適合甲長を算出しない`, !/甲長×[35]|甲長(?:16|17)cm/.test(c));
}
const toro = KID.equipment.find(x => x.id === "tub-toro-80");
check("トロ舟の807×500は底面外寸と明記", toro.dimension_reference.text.includes("底面外寸 約807×500mm") && toro.dimension_reference.text.includes("内寸ではありません"));
check("トロ舟のメーカー用途制限を隠さない", toro.dimension_reference.text.includes("亀用の推薦例にはできません"));
const hospital = KID.equipment.find(x => x.id === "hospital-container");
check("530M寸法を他モデル・購入先に当てはめない", hospital.dimension_reference.text.includes("購入リンクの商品") && hospital.dimension_reference.text.includes("確認できていません"));
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
check("未確認カードは対応甲長を『めやす』と断定しない", toroCard.includes("対応甲長：未確認") && !toroCard.includes("対応甲長めやす"));
for (const e of KID.equipment) {
  const c = T.cardHtml(e);
  check(`${e.id} 甲長表示に「〜〜」がない`, !c.includes("〜〜"));
}
// 読み上げ名（aria-label）と表示: 未確認2件は数値を含めず「未確認」を伝える。確認済みは従来どおり
const UNV = "対応甲長：未確認。下のサイズ条件を確認してください。";
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
  } else {
    check(`${e.id} 確認済みの読み上げ名は従来どおり`, label === EXPECT_VERIFIED[e.id], label);
    check(`${e.id} 確認済みの表示は「めやす」`, note.startsWith("対応甲長めやす："), note);
  }
}
check("未確認は2件", KID.equipment.filter((e) => e.size_check && e.size_check.status === "unverified").length === 2);
// 上限なし・上限あり・未確認の3種類で、読み上げ名と表示の意味をそろえる
const gaugeOf = (e) => {
  const c = T.cardHtml(e);
  return { label: c.match(/class="gauge" role="img" aria-label="([^"]*)"/)[1], note: c.match(/gauge-note">([^<]*)/)[1] };
};
for (const e of KID.equipment) {
  const { label, note } = gaugeOf(e);
  check(`${e.id} 読み上げ名に「0〜cm」「〜cm」だけの不完全な範囲がない`, !/\d〜cm|^対応甲長 〜/.test(label), label);
  if (e.size_check && e.size_check.status === "unverified") continue;
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
  check(`${d.id} alternative is not UNKNOWN`, !alternative || alternative.safety_label !== "UNKNOWN");
}

console.log("──────────────────────────────");
console.log(`PASS ${pass} / FAIL ${fail}`);
process.exit(fail ? 1 : 0);
