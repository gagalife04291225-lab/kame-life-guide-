#!/usr/bin/env python3
"""
TITAN Dashboard — 標準ライブラリのみのWebUI（追加課金なし・依存なし・オフライン動作）

  python3 tiktok/video_intel/cli.py serve --port 8765

機能: ドラッグ&ドロップで自動解析 / 一覧・ランキング / 比較 / 改善提案 /
      JSON・CSV・HTML 出力（PDFはブラウザ印刷）/ OSSランキング表示
"""
import json, os, sys, tempfile, urllib.parse, html
from http.server import BaseHTTPRequestHandler, HTTPServer

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from video_intel import engine, db, stats, report, director
from video_intel.oss import rank as ossrank

DB = None

PAGE = """<!doctype html><html lang="ja"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>TITAN Video Intelligence</title><style>
:root{--bg:#0d1f1a;--fg:#f4efe2;--ac:#d4a96a;--line:#2f4a3c;--warn:#e0705c}
*{box-sizing:border-box}
body{background:var(--bg);color:var(--fg);font-family:system-ui,"Noto Sans JP",sans-serif;margin:0;padding:24px}
h1{color:var(--ac);border-bottom:2px solid var(--ac);padding-bottom:10px;margin-top:0}
h2{color:var(--ac);margin-top:28px;font-size:18px}
#drop{border:2px dashed var(--ac);border-radius:14px;padding:44px;text-align:center;
  transition:.15s;cursor:pointer;background:rgba(212,169,106,.04)}
#drop.on{background:rgba(212,169,106,.16)}
.wrap{overflow-x:auto;border:1px solid var(--line);border-radius:10px}
table{border-collapse:collapse;font-size:13px;width:100%;min-width:900px}
th,td{border-bottom:1px solid var(--line);padding:7px 10px;white-space:nowrap;text-align:left}
th{background:var(--line);position:sticky;top:0}
tr:hover{background:rgba(255,255,255,.05)}
button,select,input{background:var(--line);color:var(--fg);border:1px solid var(--ac);
  border-radius:7px;padding:7px 12px;font-size:13px;cursor:pointer}
input{cursor:text;min-width:260px}
.row{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin:12px 0}
pre{background:#06100d;padding:14px;border-radius:10px;overflow-x:auto;font-size:12px;line-height:1.55}
.bad{color:var(--warn);font-weight:700}.ok{color:#8fc0a8;font-weight:700}
.note{color:#c9c2b0;font-size:12.5px}
a{color:var(--ac)}
</style></head><body>
<h1>TITAN Video Intelligence Platform v1.0</h1>
<p class="note">空欄は<strong>未測定</strong>。推測値は入れていない。／ 解析エンジン titan-engine/1.0（OSS・無料・GPU不要）</p>

<div id="drop">動画をここにドラッグ＆ドロップ（複数可）／ クリックで選択<input id="f" type="file" accept="video/*" multiple hidden></div>
<div id="prog" class="note"></div>

<h2>データベース</h2>
<div class="row">
  <input id="where" value="1=1" placeholder="例: genre='教育' AND duration_sec&lt;=30">
  <select id="order">
    <option>duration_sec</option><option>cuts_per_10sec</option><option>change_per_sec</option>
    <option>longest_static_sec</option><option>views</option><option>completion_pct</option>
  </select>
  <button onclick="load()">検索</button>
  <button onclick="location.href='/export.csv?where='+encodeURIComponent(where.value)">CSV</button>
  <button onclick="location.href='/export.json?where='+encodeURIComponent(where.value)">JSON</button>
  <button onclick="location.href='/export.html?where='+encodeURIComponent(where.value)">HTML(→印刷でPDF)</button>
</div>
<div class="wrap"><table id="t"><thead></thead><tbody></tbody></table></div>

<h2>成功/失敗パターン比較（統計）</h2>
<div class="row">
  <input id="wa" value="views>=1000000" placeholder="A群 条件">
  <input id="wb" value="views<10000" placeholder="B群 条件">
  <button onclick="cmp()">比較する</button>
</div>
<pre id="cmpout">未実行</pre>

<h2>改善提案（AI Director / ルールエンジン）</h2>
<pre id="sug">上の表の行をクリックすると表示されます</pre>

<p class="note"><a href="/research">→ ODIN Research Dashboard（会社全体の状態）</a></p>\n<h2>OSSランキング（実測値のみ）</h2>
<div class="row"><input id="cat" placeholder="カテゴリ（空欄=全件）"><button onclick="oss()">表示</button></div>
<div class="wrap"><table id="o"><thead></thead><tbody></tbody></table></div>

<script>
const d=document.getElementById('drop'),f=document.getElementById('f'),prog=document.getElementById('prog');
d.onclick=()=>f.click();
d.ondragover=e=>{e.preventDefault();d.classList.add('on')};
d.ondragleave=()=>d.classList.remove('on');
d.ondrop=e=>{e.preventDefault();d.classList.remove('on');up(e.dataTransfer.files)};
f.onchange=()=>up(f.files);
async function up(files){
  for(const file of files){
    prog.textContent='解析中: '+file.name+' ...';
    const fd=new FormData(); fd.append('file',file);
    const r=await fetch('/api/analyze',{method:'POST',body:fd});
    const j=await r.json();
    prog.textContent = j.error ? ('エラー: '+j.error) : ('完了: '+file.name+' / '+j.summary);
  }
  load();
}
function tbl(el,rows,cols,onclick){
  const t=document.getElementById(el);
  t.tHead.innerHTML='<tr>'+cols.map(c=>'<th>'+c+'</th>').join('')+'</tr>';
  t.tBodies[0].innerHTML=rows.map(r=>'<tr data-k="'+(r.sha1||'')+'">'+cols.map(c=>'<td>'+
    (r[c]===null||r[c]===undefined?'':String(r[c]))+'</td>').join('')+'</tr>').join('');
  if(onclick)[...t.tBodies[0].rows].forEach(tr=>tr.onclick=()=>onclick(tr.dataset.k));
}
async function load(){
  const r=await fetch('/api/videos?where='+encodeURIComponent(where.value)+'&order='+order.value);
  const j=await r.json();
  tbl('t',j,['label','duration_sec','cuts','cuts_per_10sec','shot_median','shot_variance',
    'change_per_sec','longest_static_sec','zoom_events','brightness','contrast','bpm',
    'views','completion_pct','genre'], sug_);
}
async function sug_(k){
  const r=await fetch('/api/suggest?sha1='+k); document.getElementById('sug').textContent=await r.text();
}
async function cmp(){
  const r=await fetch('/api/compare?a='+encodeURIComponent(wa.value)+'&b='+encodeURIComponent(wb.value));
  document.getElementById('cmpout').textContent=await r.text();
}
async function oss(){
  const r=await fetch('/api/oss?cat='+encodeURIComponent(cat.value)); const j=await r.json();
  tbl('o',j,['full_name','category','score','stars','forks','issues','updated','license','license_class']);
}
load(); oss();
</script></body></html>"""

def research_page(o):
    """Phase18 Research Dashboard（依存ゼロ・単一HTML）"""
    K, X, S, O, B = o["knowledge"], o["experiments"], o["statistics"], o["oss"], o["benchmark"]
    def pct(v): return "—（判定不能）" if v is None else "%.1f%%" % v
    cards = [
        ("知識数（確定）", K["knowledge"]), ("仮説数", K["hypothesis"]),
        ("否定済み知識", K["refuted"]), ("実験数", X["total"]),
        ("成功率", pct(X["success_rate_pct"])), ("失敗率", pct(X["failure_rate_pct"])),
        ("統計成立数", S["established"]), ("判定不能数", S["undecidable"]),
        ("採用OSS候補", O["adopt"]), ("保留OSS", O["hold"]), ("除外OSS", O["reject"]),
        ("Evidence 総数", o["evidence"]["total"]),
        ("デザイン資産", o["design"]["assets"]), ("会社の記憶", o["memory"]["total"]),
        ("解析済み動画", o["data"]["videos"]), ("実績付き動画", o["data"]["videos_with_outcome"]),
    ]
    cd = "".join('<div class="card"><div class="k">%s</div><div class="v">%s</div></div>'
                 % (html.escape(str(a)), html.escape(str(b))) for a, b in cards)
    lw = "".join("<li><b>%s</b> — %s：%s</li>" % (html.escape(w["repo"]), html.escape(w["license"] or ""),
                                                  html.escape(w["note"])) for w in O["license_warnings"]) \
         or "<li>警告なし</li>"
    bs = "".join("<tr><td>%s</td><td>%s</td><td>%s</td><td>%s</td></tr>" % (
        html.escape(s["source"]), "可" if s["reachable"] else "<b>不可</b>",
        html.escape(str(s["http"])), "必要" if s["requires_key"] else "不要") for s in B["sources"])
    lr = "".join("<li>[%s] <b>%s</b> %s — %s <span class=note>(%s)</span></li>" % (
        html.escape(r["kind"]), html.escape(r["id"]), html.escape(r["title"]),
        html.escape(str(r["status"])), html.escape(str(r["at"]))) for r in o["latest_research"]) or "<li>なし</li>"
    uh = "".join("<li><span class=note>%s</span> <b>%s</b>: %s — %s</li>" % (
        html.escape(str(h["at"])), html.escape(h["id"]), html.escape(h["title"]),
        html.escape(str(h["status"]))) for h in o["update_history"]) or "<li>なし</li>"
    sr = "".join("<li>%s — PASS %d / FAIL %d</li>" % (html.escape(str(r["reviewed_at"])), r["passed"], r["failed"])
                 for r in o["self_reviews"]) or "<li>未実施</li>"
    suf = o["data"]["sufficiency"]
    return """<!doctype html><html lang="ja"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>ODIN Research Dashboard</title><style>
:root{--bg:#0d1f1a;--fg:#f4efe2;--ac:#d4a96a;--line:#2f4a3c;--warn:#e0705c}
*{box-sizing:border-box}
body{background:var(--bg);color:var(--fg);font-family:system-ui,"Noto Sans JP",sans-serif;margin:0;padding:24px}
h1{color:var(--ac);border-bottom:2px solid var(--ac);padding-bottom:10px;margin-top:0}
h2{color:var(--ac);font-size:17px;margin-top:30px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px}
.card{border:1px solid var(--line);border-radius:12px;padding:14px;background:rgba(255,255,255,.03)}
.card .k{font-size:12px;color:#c9c2b0}.card .v{font-size:26px;color:var(--ac);font-weight:700;margin-top:4px}
table{border-collapse:collapse;width:100%%;font-size:13px}
th,td{border-bottom:1px solid var(--line);padding:7px 10px;text-align:left}
th{background:var(--line)}
ul{line-height:1.8;font-size:13.5px}
pre{background:#06100d;padding:14px;border-radius:10px;overflow-x:auto;font-size:12px}
.note{color:#c9c2b0;font-size:12px}
a{color:var(--ac)}
</style></head><body>
<h1>ODIN Research Dashboard <span class=note>%s</span></h1>
<p class="note">推測は表示しない。判定できないものは「判定不能」と出す。 / <a href="/">解析ダッシュボードへ</a></p>
<h2>会社の状態</h2><div class="grid">%s</div>
<h2>ライセンス警告</h2><ul>%s</ul>
<h2>競合監視（Benchmark）— 観測 %d件（実測 %d / 未取得 %d）</h2>
<table><thead><tr><th>ソース</th><th>到達</th><th>HTTP</th><th>APIキー</th></tr></thead><tbody>%s</tbody></table>
<h2>最新研究</h2><ul>%s</ul>
<h2>更新履歴（デザイン資産）</h2><ul>%s</ul>
<h2>自己監査の履歴</h2><ul>%s</ul>
<h2>データ充足</h2><pre>%s</pre>
</body></html>""" % (html.escape(o["generated_at"]), cd, lw,
                      B["observations"], B["measured"], B["unavailable"], bs, lr, uh, sr,
                      html.escape(json.dumps(suf, ensure_ascii=False, indent=2)))

class H(BaseHTTPRequestHandler):
    def log_message(self, *a): pass

    def _send(self, code, ctype, body, download=None):
        if isinstance(body, str): body = body.encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        if download:
            self.send_header("Content-Disposition", 'attachment; filename="%s"' % download)
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        u = urllib.parse.urlparse(self.path)
        q = urllib.parse.parse_qs(u.query)
        con = db.connect(DB)
        try:
            if u.path == "/":
                return self._send(200, "text/html; charset=utf-8", PAGE)
            if u.path == "/api/videos":
                rows = db.query(con, q.get("where", ["1=1"])[0], (), 500, q.get("order", ["duration_sec"])[0])
                for r in rows: r.pop("raw_json", None)
                return self._send(200, "application/json; charset=utf-8",
                                  json.dumps(rows, ensure_ascii=False))
            if u.path == "/api/oss":
                cat = q.get("cat", [""])[0] or None
                return self._send(200, "application/json; charset=utf-8",
                                  json.dumps(ossrank.rank(cat), ensure_ascii=False))
            if u.path == "/api/suggest":
                rows = db.query(con, "v.sha1=?", (q.get("sha1", [""])[0],), 1, "duration_sec")
                if not rows:
                    return self._send(404, "text/plain; charset=utf-8", "見つかりません")
                p = director.plan(rows[0], topic=rows[0].get("label") or "",
                                  sufficiency=db.data_sufficiency(con),
                                  con=con, sha1=rows[0].get("sha1"))
                return self._send(200, "text/plain; charset=utf-8",
                                  json.dumps(p, ensure_ascii=False, indent=2))
            if u.path == "/api/compare":
                a = db.query(con, q.get("a", ["1=0"])[0], (), 5000, "duration_sec")
                b = db.query(con, q.get("b", ["1=0"])[0], (), 5000, "duration_sec")
                res = stats.compare_groups(a, b)
                return self._send(200, "text/plain; charset=utf-8",
                                  json.dumps(res, ensure_ascii=False, indent=2))
            if u.path == "/api/company":
                sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
                import company as CO
                return self._send(200, "application/json; charset=utf-8",
                                  json.dumps(CO.overview(con), ensure_ascii=False))
            if u.path == "/research":
                sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
                import company as CO
                return self._send(200, "text/html; charset=utf-8", research_page(CO.overview(con)))
            if u.path.startswith("/export."):
                ext = u.path.split(".")[-1]
                rows = db.query(con, q.get("where", ["1=1"])[0], (), 5000, "duration_sec")
                for r in rows: r.pop("raw_json", None)
                if ext == "csv":
                    return self._send(200, "text/csv; charset=utf-8", report.to_csv(rows), "titan.csv")
                if ext == "json":
                    return self._send(200, "application/json; charset=utf-8", report.to_json(rows), "titan.json")
                return self._send(200, "text/html; charset=utf-8", report.to_html(rows))
            self._send(404, "text/plain; charset=utf-8", "not found")
        except Exception as e:
            self._send(500, "text/plain; charset=utf-8", "error: %s" % e)
        finally:
            con.close()

    def do_POST(self):
        if not self.path.startswith("/api/analyze"):
            return self._send(404, "text/plain", "not found")
        ctype = self.headers.get("Content-Type", "")
        if "boundary=" not in ctype:
            return self._send(400, "application/json", '{"error":"multipart必須"}')
        boundary = ctype.split("boundary=")[1].strip('"').encode()
        raw = self.rfile.read(int(self.headers["Content-Length"]))
        part = None
        for chunk in raw.split(b"--"+boundary):
            if b"filename=" in chunk and b"\r\n\r\n" in chunk:
                head, body = chunk.split(b"\r\n\r\n", 1)
                part = body.rstrip(b"\r\n-")
                break
        if not part:
            return self._send(400, "application/json", '{"error":"ファイルが見つからない"}')
        tmp = tempfile.NamedTemporaryFile(suffix=".mp4", delete=False)
        tmp.write(part); tmp.close()
        try:
            r = engine.analyze(tmp.name, with_adapters=False)
            con = db.connect(DB)
            db.upsert(con, r, genre=None, source="upload")
            con.close()
            v = r["video"]
            s = "尺%.1fs カット%d 中央値%.2fs 変化%.2f/秒 最長静止%.2fs" % (
                r["format"]["duration_sec"], v["cuts"]["count"], v["shot_length"]["median"] or 0,
                v["screen_change"]["per_sec"] or 0, v["screen_change"]["longest_static_run_sec"])
            self._send(200, "application/json; charset=utf-8",
                       json.dumps(dict(sha1=r["sha1"], summary=s), ensure_ascii=False))
        except Exception as e:
            self._send(200, "application/json; charset=utf-8",
                       json.dumps(dict(error=str(e)[:300]), ensure_ascii=False))
        finally:
            os.unlink(tmp.name)

def serve(port=8765, dbpath=None):
    global DB
    DB = dbpath
    print("TITAN Dashboard → http://127.0.0.1:%d  (DB: %s)" % (port, dbpath))
    HTTPServer(("127.0.0.1", port), H).serve_forever()

if __name__ == "__main__":
    serve(int(sys.argv[1]) if len(sys.argv) > 1 else 8765,
          os.path.join(os.path.dirname(__file__), "..", "research", "titan.db"))
