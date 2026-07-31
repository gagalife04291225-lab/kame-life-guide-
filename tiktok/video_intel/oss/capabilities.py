#!/usr/bin/env python3
"""
ODIN / OSS capability 判定

**重要（provenance）**: ここで返す対応可否は、GitHub の topics と language という
**実測メタデータからの導出**であって、実際にインストールして動かした検証ではない。
topics はリポジトリ作者の自己申告なので、以下の性質がある。

  - 「true」は比較的信頼できる（作者が明示している）
  - 「false」は **「対応していない」ではなく「申告がない」**

そのため戻り値は三値にする:
    True   … 対応の申告あり（topics/language に根拠）
    False  … 非対応であることが構造的に明らか（例: GPU必須のtopicがある → CPU可はfalse）
    None   … **未測定**（申告がないだけ。非対応と断定しない）

実行検証（実際に入れて動かす）は Phase B の作業。ここでは行わない。
"""
import json, os, sys
from datetime import date

HERE = os.path.dirname(os.path.abspath(__file__))
TODAY = date(2026, 7, 31)

# topic 語彙 → capability
WIN = {"windows", "win32", "winui", "wsl", "pyinstaller", "electron", "dotnet", "csharp", "uwp"}
DOCKER = {"docker", "docker-compose", "docker-compse", "dockerfile", "containers", "kubernetes",
          "self-hosted", "docker-registry-v2"}
GPU_REQ = {"cuda", "tensorrt", "gpu", "gpu-computing", "vulkan", "mlx", "rocm", "nvidia-nim"}
CPU_OK = {"cpu", "ggml", "llamacpp", "llama-cpp", "onnx", "onnxruntime", "quantization",
          "offline", "offline-first", "ncnn", "whisper-cpp", "int8", "simd", "avx512"}
CLI = {"cli", "command-line", "terminal", "console", "shell", "downloader", "cli-tool"}
API = {"api", "rest-api", "restful-api", "graphql", "fastapi", "flask", "openai-api",
       "openai-compatible", "server", "mcp-server", "automatic-api", "web-api"}
PY = {"python", "python3", "pytorch", "tensorflow", "fastapi", "flask", "numpy", "scipy",
      "pandas", "jupyter", "jupyter-notebook", "gradio", "streamlit"}
MAC = {"macos", "mac", "swift", "coreml", "objective-c", "mlx"}
LINUX = {"linux", "ubuntu", "debian", "flatpak", "snap", "appimage", "shell"}

def _has(topics, vocab):
    return bool(topics) and bool(set(topics) & vocab)

def _days(d):
    y, m, dd = (int(x) for x in d.split("-"))
    return (TODAY - date(y, m, dd)).days

def maintenance(r):
    """保守状況（実測フィールドのみで判定）"""
    if r.get("archived"):
        return dict(status="archived", label="開発終了（アーカイブ済）", days_since_update=None)
    d = _days(r["updated"])
    if d <= 30:   s, l = "active", "活発（30日以内に更新）"
    elif d <= 90: s, l = "maintained", "維持（90日以内）"
    elif d <= 365: s, l = "slow", "低活動（1年以内）"
    else:          s, l = "stale", "停滞（1年以上更新なし）"
    return dict(status=s, label=l, days_since_update=d)

def install_difficulty(r):
    """導入難易度（代理指標。実際にインストールした計測ではない）"""
    t = r.get("topics") or []
    score = 0
    reasons = []
    if _has(t, GPU_REQ):
        score += 3; reasons.append("GPU/CUDA系のtopicがある")
    if r.get("lang") in ("C++", "C", "Rust", "Go") and not _has(t, PY):
        score += 2; reasons.append("ビルドが必要な言語（Pythonバインディング申告なし）")
    if _has(t, DOCKER):
        score -= 2; reasons.append("Docker対応の申告あり")
    if _has(t, PY):
        score -= 1; reasons.append("Python対応の申告あり")
    if _has(t, CPU_OK):
        score -= 1; reasons.append("CPU動作の申告あり")
    if (r.get("issues") or 0) > 1000:
        score += 1; reasons.append("未解決Issueが1000件超")
    lv = "低" if score <= -1 else "中" if score <= 2 else "高"
    return dict(level=lv, score=score, reasons=reasons,
                provenance="derived-from-topics（実インストール検証ではない）")

def capabilities(r):
    t = r.get("topics")
    lang = r.get("lang")
    if t is None:
        base = {k: None for k in ("windows", "docker", "gpu_required", "cpu_ok",
                                  "python", "cli", "api", "macos", "linux")}
        base["provenance"] = "未測定（topics 未取得）"
        return base
    gpu = True if _has(t, GPU_REQ) else (False if _has(t, CPU_OK) else None)
    return dict(
        windows=True if _has(t, WIN) else None,
        docker=True if _has(t, DOCKER) else None,
        gpu_required=gpu,
        cpu_ok=(False if gpu is True and not _has(t, CPU_OK) else
                (True if (_has(t, CPU_OK) or gpu is False) else None)),
        python=True if (_has(t, PY) or lang == "Python") else None,
        cli=True if _has(t, CLI) else None,
        api=True if _has(t, API) else None,
        macos=True if _has(t, MAC) else None,
        linux=True if _has(t, LINUX) else None,
        provenance="derived-from-topics/language（自己申告ベース。false ではなく None = 未測定）",
    )

def enrich(r):
    return {**r, "capabilities": capabilities(r),
            "maintenance": maintenance(r), "install_difficulty": install_difficulty(r)}

def coverage(repos):
    n = len(repos)
    have_topics = sum(1 for r in repos if r.get("topics"))
    have_license = sum(1 for r in repos if r.get("license"))
    return dict(total=n, topics_measured=have_topics,
                topics_coverage_pct=round(100*have_topics/n, 1),
                license_measured=have_license,
                license_coverage_pct=round(100*have_license/n, 1),
                note="topics 未取得のリポジトリは capability がすべて未測定になる。空欄のまま残す。")

def main():
    reg = json.load(open(os.path.join(HERE, "registry.json"), encoding="utf-8"))
    rows = [enrich(r) for r in reg["repos"]]
    cat = sys.argv[1] if len(sys.argv) > 1 else None
    if cat:
        rows = [r for r in rows if cat in r["category"]]
    rows.sort(key=lambda r: -r["stars"])
    print("| repo | Win | Docker | GPU必須 | CPU可 | Python | CLI | API | 保守 | 導入難易度 |")
    print("|------|-----|--------|---------|-------|--------|-----|-----|------|-----------|")
    def m(v): return "○" if v is True else ("×" if v is False else "—")
    for r in rows[:40]:
        c = r["capabilities"]
        print("| %s | %s | %s | %s | %s | %s | %s | %s | %s | %s |" % (
            r["full_name"], m(c["windows"]), m(c["docker"]), m(c["gpu_required"]),
            m(c["cpu_ok"]), m(c["python"]), m(c["cli"]), m(c["api"]),
            r["maintenance"]["label"], r["install_difficulty"]["level"]))
    cv = coverage(reg["repos"])
    print("\n凡例: ○=申告あり ×=構造的に非対応 —=**未測定**（申告がないだけ。非対応とは限らない）")
    print("測定カバレッジ: topics %d/%d (%.1f%%) / license %d/%d (%.1f%%)" % (
        cv["topics_measured"], cv["total"], cv["topics_coverage_pct"],
        cv["license_measured"], cv["total"], cv["license_coverage_pct"]))

if __name__ == "__main__":
    main()
