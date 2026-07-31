#!/usr/bin/env python3
"""
TITAN AI Director — 解析結果から診断と改善提案を生成する。

方式: **ルールエンジン（決定的）**。LLMは必須にしない。
理由:
  1. 追加課金なし・オフラインで動く経路を必ず残すため
  2. 同じ入力なら必ず同じ提案になる（再現性。監査できる）
  3. 提案の根拠が必ずルールIDに紐づく（「AIが考えた」にしない）

しきい値の出所: tiktok/DESIGN-SYSTEM.md（さらにその根拠は research/RESEARCH-REPORT.md）
LLMを使いたい場合は ollama が入っていれば narrative() が文章化する。無ければ箇条書きのまま。
"""
import json, shutil, subprocess, os, sys

# ルール: (id, 判定関数, 重大度, 指摘, 改善指示, 根拠)
RULES = [
    ("R01", lambda m: (m.get("longest_static_sec") or 0) > 1.5, "BLOCKER",
     "同じ画面が {longest_static_sec} 秒続く箇所がある",
     "静止を1.5秒以内に抑える。細い線の動きは平均差分に出ないので、大面積（背景・被写体全体）を動かす",
     "D1/D2 視聴者は1.5-2.0秒ごとに継続可否を再判断する"),
    ("R02", lambda m: (m.get("cuts_per_10sec") or 0) < 2.5, "BLOCKER",
     "カット密度が 10秒あたり {cuts_per_10sec} 回しかない",
     "カットを増やして10秒あたり2.5回以上にする",
     "D3 ジャンプカット導入で完走率+26%"),
    ("R03", lambda m: (m.get("shot_median") or 0) > 2.0, "HIGH",
     "カット長の中央値が {shot_median} 秒（2.0秒超）",
     "長いカットを分割する。特に中盤の説明カットを2つに割る",
     "D1 画面変化の推奨間隔は1.5-2.0秒"),
    ("R04", lambda m: (m.get("over_2sec_ratio_pct") or 0) > 35, "MEDIUM",
     "2秒を超えるカットが {over_2sec_ratio_pct}% を占める",
     "2秒超カットを35%以下にする",
     "D1"),
    ("R05", lambda m: (m.get("change_per_sec") or 0) < 0.8, "HIGH",
     "有意な画面変化が {change_per_sec} 回/秒しかない",
     "各カット内でも動きを持続させる（拡大・進行描画・スキャン）",
     "D1/D4 単一固定ショット比で平均視聴時間+10-15pt"),
    ("R06", lambda m: (m.get("open_3s_cuts") or 0) < 2, "BLOCKER",
     "冒頭3秒のカットが {open_3s_cuts} 回",
     "冒頭3秒に2回以上のカットを入れる。1.5秒以内に最低1回",
     "A3 伸びない動画の約90%が冒頭3秒で失敗（n=34,635）"),
    ("R07", lambda m: (m.get("open_0_5s_change") or 0) < (m.get("mean_frame_diff") or 0), "HIGH",
     "冒頭0.5秒の変化量({open_0_5s_change})が全体平均({mean_frame_diff})を下回る",
     "冒頭の寄り・回転の速度を上げ、0.5秒以内にテロップ1行目を出し切る",
     "A1/A2 配信判断も視聴判断も約1.5-1.7秒で終わる"),
    ("R08", lambda m: (m.get("duration_sec") or 0) > 60, "MEDIUM",
     "尺が {duration_sec} 秒（60秒超）",
     "38-45秒に収める。完走率は尺より重い",
     "F1/F4/F5 教育系は45-60秒が適正・90秒未満がバイラル条件・完走率>尺"),
    ("R09", lambda m: (m.get("duration_sec") or 0) < 15, "MEDIUM",
     "尺が {duration_sec} 秒（15秒未満）",
     "情報密度が足りず保存されにくい。30秒以上を検討する",
     "B2/C1 教育系の強みは『後で見返す価値』"),
    ("R10", lambda m: (m.get("bottom_band_pct") or 0) > 8, "HIGH",
     "画面最下部（TikTokキャプション帯）に要素が {bottom_band_pct}% ある",
     "下部22%とサイド12%を空ける。テロップは中央〜下3分の1に置く",
     "E8 + プラットフォームUIとの重なり回避"),
    ("R11", lambda m: (m.get("has_audio") or 0) == 0, "HIGH",
     "音声トラックが無い",
     "肉声ナレーションを録音し、80-100BPMのBGMを重ねる",
     "G1 + 音は保持率の実証済み要因"),
    ("R12", lambda m: (m.get("loop_gap") is not None and m["loop_gap"] > 12.0), "MEDIUM",
     "最終フレームと冒頭フレームの差が {loop_gap}（ループしにくい）",
     "最終カットの構図を冒頭カットに着地させる",
     "C3 ループ・再視聴もランキング信号"),
    ("R13", lambda m: (m.get("contrast") or 99) < 8, "MEDIUM",
     "画面コントラストが {contrast} と低い",
     "テロップに濃色の縁取りを入れ、背景と文字の輝度差を広げる",
     "E7 明色文字＋濃色縁取りが最強コントラスト"),
    ("R14", lambda m: (m.get("zoom_events") or 0) == 0 and (m.get("pan_events") or 0) == 0, "MEDIUM",
     "ズーム・パンが1回も検出されない",
     "被写体への寄り／引きを最低3回入れる",
     "D4 単一固定ショットは平均視聴時間が落ちる"),
]

SEV_ORDER = {"BLOCKER": 0, "HIGH": 1, "MEDIUM": 2}

def diagnose(m):
    """m: db.flatten() 相当の平坦な辞書"""
    hits = []
    for rid, fn, sev, msg, fix, why in RULES:
        try:
            ok = fn(m)
        except Exception:
            ok = False
        if ok:
            hits.append(dict(rule=rid, severity=sev,
                             finding=msg.format(**{k: m.get(k) for k in m}),
                             fix=fix, evidence=why))
    hits.sort(key=lambda h: SEV_ORDER[h["severity"]])
    score = 100
    for h in hits:
        score -= {"BLOCKER": 20, "HIGH": 10, "MEDIUM": 5}[h["severity"]]
    return dict(score=max(0, score), findings=hits,
                verdict=("公開可" if max(0, score) >= 80 and
                         not any(h["severity"] == "BLOCKER" for h in hits) else "要修正"),
                note="スコアは DESIGN-SYSTEM v1.0 の数値要件からの減点方式。BLOCKERが1つでもあれば公開不可。")

def diagnose_with_evidence(con, m, sha1=None):
    """Phase16: 指摘1件ずつに Evidence ID を付ける。
    **Evidence の無い提案は返さない。** 付けられない指摘は落とす。"""
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    import evidence as EV
    import memory_engine as ME
    d = diagnose(m)
    sha1 = sha1 or m.get("sha1")
    if sha1:
        d["findings"] = EV.attach_to_findings(con, d["findings"], sha1, m)
    d["findings"] = [f for f in d["findings"] if f.get("evidence_id")]
    # Phase15: 修正案が過去の失敗・却下と衝突しないか照会する
    for f in d["findings"]:
        chk = ME.check_before_action(con, f.get("fix") or "")
        f["memory_check"] = dict(verdict=chk["verdict"],
                                 conflicts=[c["mid"] + " " + c["title"] for c in chk["conflicts"]])
    d["evidence_policy"] = "すべての指摘に Evidence ID を付与済み。根拠のない提案は返さない。"
    return d

def plan(m, topic="カメの誤解 #N", sufficiency=None, con=None, sha1=None):
    """企画〜投稿計画を生成する。

    **Phase7 のゲート**: sufficiency が与えられ、かつ不足している場合は
    台本・編集方針・字幕・CTA・投稿戦略を **生成しない**。
    データが足りないのに戦略を出すことは、推測を事実として渡すことになるため。

    ただし `quality`（診断）は常に返す。診断は実測値としきい値の照合であって、
    予測ではないから。この区別が ODIN の設計上の核心。
    """
    d = diagnose_with_evidence(con, m, sha1) if con is not None else diagnose(m)
    if sufficiency is not None and not sufficiency.get("sufficient"):
        return dict(
            topic=topic,
            generation="withheld",
            reason="データ不足のため台本・編集方針・字幕・CTA・投稿戦略は生成しない",
            missing=sufficiency.get("missing"),
            required=sufficiency.get("required"),
            note=("診断（quality）は実測値としきい値の照合なので提示する。"
                  "戦略の生成は統計的裏づけが必要なため保留する。"),
            quality=d,
        )
    return dict(
        topic=topic,
        generation="allowed",
        structure=["1 フック前半 0-1.0s（何の動画かを画で示す＋テロップ1行目）",
                   "2 フック後半 -1.9s（同じ被写体へ寄る／ハードカット）",
                   "3 否定 -3.3s", "4 実演 -6.3s", "5 視覚的証明 -15s",
                   "6 中盤リフック 40-50%地点", "7 深掘り -27s", "8 結論＋例外 -31s",
                   "9 コメント誘導→まとめ（保存）→CTA -41s"],
        edit_directions=[h["fix"] for h in d["findings"]] or ["現状の編集はDS要件を満たしている"],
        subtitle_rules=["1行3-7語 / 最低1.5秒表示", "中央〜下3分の1", "縁取り4-5px濃色",
                        "強調色は1画面1箇所"],
        bgm=dict(bpm_range="80-100", trend_audio="使わない", narration="肉声（AI音声不可）"),
        cta=dict(position="最後2-3秒", words="2-3語", example="プロフィールへ"),
        posting=dict(frequency="週2-5本", rhythm="一定", time_of_day="自アカウントの実測が出るまで固定しない"),
        quality=d,
    )

def narrative(obj):
    """ollama があれば文章化する。無ければそのまま返す（必須にしない）。"""
    if not shutil.which("ollama"):
        return None
    try:
        prompt = ("次のJSONは動画解析の診断結果です。事実だけを使い、"
                  "数値を創作せず、日本語で簡潔に要約してください。\n" + json.dumps(obj, ensure_ascii=False))
        p = subprocess.run(["ollama", "run", "llama3.2", prompt], capture_output=True, timeout=120)
        return p.stdout.decode(errors="ignore").strip() or None
    except Exception:
        return None
