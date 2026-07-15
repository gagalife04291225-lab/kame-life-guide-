# Phase2 保存ドキュメント一覧

このディレクトリは、Phase2（診断ランキングの normalize 方式比較）に関する確定成果物を保存したものです。
各文書の Status を正確に区別してください。DESIGN FROZEN と Draft と partial を混同しないでください。

## 文書一覧と Status

| ファイル | 内容 | Status |
|---|---|---|
| 01-phase2-objective.md | Phase2 開始時の目的（原文） | 確定原文 |
| 04-ranking-quality-spec-partial.md | Ranking Quality Specification のうち第7章・第7.7・第7.7.2 のみ | partial（第1〜6章 未収録） / 収録部分は DESIGN FROZEN |
| 05-variable-a-evaluation-plan-v1.0.md | Variable-A Evaluation Plan v1.0 | DESIGN FROZEN |
| 06-method-definition-scope-v1.0-draft.md | Method Definition Scope v1.0 | Draft |
| 07-effective-method-definition-v1.0.md | effective Method Definition（Concept / Mathematical / バリアント確定 / 凍結宣言） | DESIGN FROZEN |

## 未保存・原文不足の項目

次の3文書は、原文がチャット内にもリポジトリ内にも存在しないため作成していません。推測補完は行いません。

| 未作成ファイル | 未保存の理由 |
|---|---|
| 00-phase1-stable-baseline.md | Phase1 Stable の網羅的な固定事項の原文が確認できないため（原文不足） |
| 02-step1-golden-18.md | ゴールデン18ケースの定義本体（ケースID・入力・種別・想定上位種）の原文が確認できないため（原文不足） |
| 03-step2-constraints.md | Step2（H1〜H6・ソフト条件・6桁丸め・normalize挿入位置）の、現チャット内で完結した確定版原文が確認できないため（原文不足） |

## partial 文書について（04）

04-ranking-quality-spec-partial.md は Ranking Quality Specification v1.0 の一部です。
第1〜6章（品質定義・改善・悪化・ゴールデン18の評価方法・同点解消の位置づけ・公平比較）の全文原文は確認できないため未収録です。
収録しているのは第7章（品質判定方法）・第7.7（解釈一貫性規約）・第7.7.2（修正版）のみです。
完全な v1.0 ではないため、ファイル名を partial としています。

## 次工程

次工程は Method Definition です。
effective 方式の Method Definition（07）は DESIGN FROZEN 済みですが、
Variable-A Evaluation の実施には、未保存項目である Step1 ゴールデン18ケースと none 基準線スナップショットの原文が必要です。
これらが揃うまで Evaluation の実行はできません。

## effective 方式について

effective 方式そのもの（min-max 正規化・確定退化規則）の定義は 07 に保存済みです。
ただし、それを実際に評価するための入力（ゴールデン18ケース、none 基準線）は未保存です。
