#!/usr/bin/env python3
"""
TITAN MCP Server — Model Context Protocol (stdio / JSON-RPC 2.0)

標準ライブラリのみで実装（SDK非導入・追加課金なし）。
Claude Code などの MCP クライアントから TITAN の解析機能を直接呼べるようにする。

設定例（.mcp.json）:
{
  "mcpServers": {
    "titan": { "command": "python3", "args": ["tiktok/video_intel/mcp_server.py"] }
  }
}

公開ツール:
  titan_analyze_video   動画を解析してDBへ登録
  titan_query_videos    条件検索（例: genre='教育' AND duration_sec<=30）
  titan_compare_groups  2群の統計比較（Welch t + FDR）
  titan_diagnose        改善提案（ルールエンジン）
  titan_oss_rank        OSSランキング（実測値のみ）
"""
import sys, os, json

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from video_intel import engine, db, stats, director
from video_intel.oss import rank as ossrank

DB = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "research", "titan.db")

TOOLS = [
    dict(name="titan_analyze_video",
         description="動画ファイルを解析してDBへ登録する。測定できない項目はnullを返す（推測しない）。",
         inputSchema=dict(type="object", required=["path"], properties=dict(
             path=dict(type="string", description="動画ファイルの絶対パス"),
             genre=dict(type="string"), source=dict(type="string")))),
    dict(name="titan_query_videos",
         description="解析済み動画をSQL条件で検索する。例: genre='教育' AND duration_sec<=30",
         inputSchema=dict(type="object", properties=dict(
             where=dict(type="string", default="1=1"),
             order=dict(type="string", default="duration_sec"),
             limit=dict(type="integer", default=50)))),
    dict(name="titan_compare_groups",
         description="2群を全指標で統計比較する（Welch t検定 + BH法FDR補正）。n<5は判定不能を返す。",
         inputSchema=dict(type="object", required=["where_a", "where_b"], properties=dict(
             where_a=dict(type="string"), where_b=dict(type="string"),
             name_a=dict(type="string"), name_b=dict(type="string")))),
    dict(name="titan_diagnose",
         description="解析済み動画の改善提案を返す（DESIGN-SYSTEM v1.0のしきい値によるルールエンジン）。",
         inputSchema=dict(type="object", required=["sha1"], properties=dict(sha1=dict(type="string")))),
    dict(name="titan_oss_rank",
         description="調査済みOSSを実測値のみでランキングする。カテゴリで絞り込み可。",
         inputSchema=dict(type="object", properties=dict(
             category=dict(type="string"), top=dict(type="integer", default=20)))),
]

def call(name, args):
    if name == "titan_analyze_video":
        r = engine.analyze(args["path"], with_adapters=False)
        con = db.connect(DB)
        db.upsert(con, r, genre=args.get("genre"), source=args.get("source"))
        con.close()
        return {k: r[k] for k in ("sha1", "label", "format", "video", "audio", "not_measured")}
    if name == "titan_query_videos":
        con = db.connect(DB)
        rows = db.query(con, args.get("where", "1=1"), (), int(args.get("limit", 50)),
                        args.get("order", "duration_sec"))
        con.close()
        for r in rows: r.pop("raw_json", None)
        return rows
    if name == "titan_compare_groups":
        con = db.connect(DB)
        a = db.query(con, args["where_a"], (), 5000, "duration_sec")
        b = db.query(con, args["where_b"], (), 5000, "duration_sec")
        con.close()
        return stats.compare_groups(a, b, args.get("name_a", "A群"), args.get("name_b", "B群"))
    if name == "titan_diagnose":
        con = db.connect(DB)
        rows = db.query(con, "v.sha1=?", (args["sha1"],), 1, "duration_sec")
        con.close()
        if not rows:
            return dict(error="該当する動画がDBにありません")
        return director.plan(rows[0], topic=rows[0].get("label") or "")
    if name == "titan_oss_rank":
        return ossrank.rank(args.get("category"), int(args.get("top", 20)))
    raise ValueError("unknown tool: %s" % name)

def reply(rid, result=None, error=None):
    msg = dict(jsonrpc="2.0", id=rid)
    if error is not None:
        msg["error"] = dict(code=-32000, message=str(error)[:400])
    else:
        msg["result"] = result
    sys.stdout.write(json.dumps(msg, ensure_ascii=False) + "\n")
    sys.stdout.flush()

def main():
    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        try:
            req = json.loads(line)
        except Exception:
            continue
        m, rid, params = req.get("method"), req.get("id"), req.get("params") or {}
        try:
            if m == "initialize":
                reply(rid, dict(protocolVersion="2024-11-05",
                                capabilities=dict(tools={}),
                                serverInfo=dict(name="titan-video-intelligence", version="1.0")))
            elif m == "tools/list":
                reply(rid, dict(tools=TOOLS))
            elif m == "tools/call":
                out = call(params["name"], params.get("arguments") or {})
                reply(rid, dict(content=[dict(type="text",
                                              text=json.dumps(out, ensure_ascii=False, indent=2))]))
            elif m in ("notifications/initialized", "initialized"):
                pass                                    # 通知には応答しない
            elif rid is not None:
                reply(rid, error="unsupported method: %s" % m)
        except Exception as e:
            if rid is not None:
                reply(rid, error=e)

if __name__ == "__main__":
    main()
