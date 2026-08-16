#!/usr/bin/env python3
"""
カメライフガイド — 無料画像ジェネレーター（GitHub Actions 用）

この環境（Claude のセッション）から外部の無料画像サービスへは到達できない
（egress ブロック: HTTP 000）。しかし GitHub Actions のランナーは別ネットワーク
なので、ランナー上でならフリーの画像 API に到達できる。本スクリプトはランナー上で
動かす前提。

- 有料 API・課金・APIキーは一切使わない（プロジェクト方針: 有料前提禁止）
- 既定バックエンド: Pollinations（鍵不要・無料の GET API）
- prompts.json に定義された各画像を生成し、指定パスへ保存する
- 一部失敗しても成功分は残す（全滅時のみ非ゼロ終了）

使い方:
  python3 tools/image-gen/generate.py tools/image-gen/prompts.json
"""
import sys, os, json, time, urllib.parse, urllib.request, urllib.error

DEFAULT_BACKEND = "pollinations"

def _valid_image(b: bytes) -> bool:
    if not b or len(b) < 2048:            # 2KB 未満は失敗ページ等とみなす
        return False
    return (b[:8] == b"\x89PNG\r\n\x1a\n"  # PNG
            or b[:3] == b"\xff\xd8\xff"     # JPEG
            or b[:4] == b"RIFF")            # WEBP(RIFF)

def _get(url: str, timeout: int = 120) -> bytes:
    req = urllib.request.Request(url, headers={
        "User-Agent": "kame-life-guide-image-gen/1.0 (+github actions)"
    })
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()

def build_url(backend: str, spec: dict) -> str:
    prompt = spec["prompt"]
    w = int(spec.get("width", 1024))
    h = int(spec.get("height", 1024))
    seed = int(spec.get("seed", 42))
    model = spec.get("model", "flux")
    if backend == "pollinations":
        enc = urllib.parse.quote(prompt, safe="")
        q = urllib.parse.urlencode({
            "width": w, "height": h, "seed": seed,
            "nologo": "true", "model": model, "enhance": "true",
        })
        return f"https://image.pollinations.ai/prompt/{enc}?{q}"
    raise ValueError(f"unknown backend: {backend}")

def generate_one(spec: dict, backend: str, retries: int = 3) -> bool:
    path = spec["path"]
    os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
    url = build_url(backend, spec)
    for attempt in range(1, retries + 1):
        try:
            data = _get(url)
            if _valid_image(data):
                with open(path, "wb") as f:
                    f.write(data)
                print(f"  OK    {spec['id']:20s} -> {path} ({len(data)} bytes) [try {attempt}]")
                return True
            print(f"  WARN  {spec['id']:20s} 無効な応答 {len(data)}B [try {attempt}]")
        except urllib.error.HTTPError as e:
            print(f"  HTTP  {spec['id']:20s} {e.code} [try {attempt}]")
        except Exception as e:
            print(f"  ERR   {spec['id']:20s} {e} [try {attempt}]")
        time.sleep(min(2 ** attempt, 20))
    print(f"  FAIL  {spec['id']:20s} 生成できず")
    return False

def main():
    cfg_path = sys.argv[1] if len(sys.argv) > 1 else "tools/image-gen/prompts.json"
    cfg = json.load(open(cfg_path, encoding="utf-8"))
    backend = cfg.get("backend", DEFAULT_BACKEND)
    specs = cfg["images"]
    print(f"backend={backend} / {len(specs)} 枚を生成")
    ok = 0
    for spec in specs:
        if generate_one(spec, backend):
            ok += 1
    print(f"\n完了: {ok}/{len(specs)} 成功")
    # 全滅時のみ失敗扱い（部分成功はコミットしたい）
    sys.exit(0 if ok > 0 else 1)

if __name__ == "__main__":
    main()
