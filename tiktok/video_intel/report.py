#!/usr/bin/env python3
"""TITAN レポート出力 — JSON / CSV / HTML（PDFはブラウザの印刷でHTMLから生成する）"""
import json, csv, io, html, os

FIELDS = ["label", "duration_sec", "width", "height", "fps", "has_audio",
          "cuts", "cuts_per_10sec", "shot_mean", "shot_median", "shot_variance", "shot_stdev",
          "over_2sec_ratio_pct", "change_per_sec", "longest_static_sec", "mean_frame_diff",
          "zoom_ratio", "zoom_events", "pan_events", "brightness", "contrast", "saturation",
          "color_temp", "dominant_band", "bottom_band_pct", "thirds_ratio", "center_weight",
          "open_0_5s_change", "open_1s_changes", "open_3s_cuts", "loop_gap",
          "bpm", "onset_per_sec", "silence_ratio", "genre", "source"]

JA = {"label": "動画", "duration_sec": "尺(秒)", "cuts": "カット数", "cuts_per_10sec": "カット/10秒",
      "shot_mean": "カット長 平均", "shot_median": "カット長 中央値", "shot_variance": "カット長 分散",
      "shot_stdev": "カット長 標準偏差", "over_2sec_ratio_pct": "2秒超カット%",
      "change_per_sec": "画面変化/秒", "longest_static_sec": "最長静止(秒)",
      "mean_frame_diff": "平均フレーム差分", "zoom_ratio": "ズーム比", "zoom_events": "ズーム回数",
      "pan_events": "パン回数", "brightness": "平均輝度", "contrast": "コントラスト",
      "saturation": "彩度", "color_temp": "色温度(R/B)", "dominant_band": "文字図 主帯",
      "bottom_band_pct": "最下帯%", "thirds_ratio": "三分割構図比", "center_weight": "中央重心比",
      "open_0_5s_change": "0.5秒変化量", "open_1s_changes": "1秒 有意変化", "open_3s_cuts": "3秒カット",
      "loop_gap": "ループ差分", "bpm": "BGM BPM", "onset_per_sec": "SE/秒",
      "silence_ratio": "無音率", "genre": "ジャンル", "source": "出所",
      "width": "幅", "height": "高", "fps": "fps", "has_audio": "音声"}

def to_json(rows):
    return json.dumps(rows, ensure_ascii=False, indent=2)

def to_csv(rows):
    buf = io.StringIO()
    w = csv.DictWriter(buf, fieldnames=FIELDS, extrasaction="ignore")
    w.writeheader()
    for r in rows:
        w.writerow({k: r.get(k) for k in FIELDS})
    return buf.getvalue()

def to_html(rows, title="TITAN 解析レポート", extra_sections=None):
    th = "".join("<th>%s</th>" % html.escape(JA.get(k, k)) for k in FIELDS)
    trs = []
    for r in rows:
        tds = "".join("<td>%s</td>" % html.escape("" if r.get(k) is None else str(r.get(k))) for k in FIELDS)
        trs.append("<tr>%s</tr>" % tds)
    extra = ""
    for name, body in (extra_sections or []):
        extra += "<h2>%s</h2>\n<pre>%s</pre>\n" % (html.escape(name), html.escape(body))
    return """<!doctype html><html lang="ja"><head><meta charset="utf-8">
<title>%s</title><style>
:root{--bg:#0d1f1a;--fg:#f4efe2;--ac:#d4a96a;--line:#2f4a3c}
body{background:var(--bg);color:var(--fg);font-family:system-ui,"Noto Sans JP",sans-serif;margin:24px}
h1{color:var(--ac);border-bottom:2px solid var(--ac);padding-bottom:8px}
h2{color:var(--ac);margin-top:32px}
.wrap{overflow-x:auto}
table{border-collapse:collapse;font-size:13px;min-width:100%%}
th,td{border:1px solid var(--line);padding:6px 10px;white-space:nowrap}
th{background:var(--line);position:sticky;top:0}
tr:nth-child(even){background:rgba(255,255,255,.03)}
pre{background:#06100d;padding:14px;border-radius:8px;overflow-x:auto;font-size:12px}
.note{color:#c9c2b0;font-size:13px}
@media print{body{background:#fff;color:#000}th{background:#eee}}
</style></head><body>
<h1>%s</h1>
<p class="note">解析エンジン: titan-engine/1.0 ／ 空欄は<strong>未測定</strong>（推測値は入れていない）</p>
<div class="wrap"><table><thead><tr>%s</tr></thead><tbody>%s</tbody></table></div>
%s
<p class="note">PDFが必要な場合はブラウザの「印刷 → PDFとして保存」を使う（追加ライブラリ不要）。</p>
</body></html>""" % (html.escape(title), html.escape(title), th, "".join(trs), extra)

def write_all(rows, outdir, basename="report", title="TITAN 解析レポート", extra_sections=None):
    os.makedirs(outdir, exist_ok=True)
    paths = {}
    for ext, data in (("json", to_json(rows)), ("csv", to_csv(rows)),
                      ("html", to_html(rows, title, extra_sections))):
        p = os.path.join(outdir, "%s.%s" % (basename, ext))
        open(p, "w", encoding="utf-8").write(data)
        paths[ext] = p
    return paths
