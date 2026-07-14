# species-facts スキーマ v2

3種検証（ケヅメ・スペングラー・ヒメハコ）で v1 が壊れたため改訂。

---

## 編集原則

**分からないことは分からないと書く。**

この一行がプロジェクト全体の原則。空欄を推測で埋めない。根拠のない数値を採用しない。

---

## ファイル分離

| ファイル | 内容 | 読む主体 |
|---|---|---|
| `species-facts.json` | 事実。診断エンジンが参照 | **エンジン + 人間** |
| `species-knowledge.json` | 経験・注意点・失敗談 | **人間のみ** |
| `species-breeding.json` | 繁殖。診断では使わない | **人間のみ** |

エンジンは `species-facts.json` **しか読めない**。そう作ることで、経験をスコアに混ぜる事故が構造的に起きなくなる。

---

## provenance（情報源の型。優劣ではない）

```
official           公的資料（CITES / 環境省 / IUCN）
peer_reviewed      学術文献
expert_consensus   専門書・専門獣医が一致
expert_opinion     専門家1名の見解
keeper_consensus   複数の長期飼育者が一致
keeper_observation 特定の飼育者の観察（誰が・何個体・何年を明記）
estimated          推定。根拠が乏しい
unstudied          研究がない
```

**S/A/B のランクは持たない。** 項目によって最強の根拠は違う。CITES は公的資料であり、飼育経験より強い。専門医の20年の症例は、個人の3個体より強い場面がある。一列に並べれば嘘になる。

## researchStatus

```
established  確立している
uncertain    質の高い根拠が対立している
unstudied    そもそも研究がない
```

## conflict と caution は別物

| | 意味 |
|---|---|
| `conflict` | **質の高い根拠同士**が食い違っている。多数決で潰さない |
| `caution` | **リスクが報告されている**。推奨されていても危険な場合がある |

デマは conflict に入れない。**除外する。**
（例: petpi.jp「スペングラーは青い鱗を持つ」「水を飲むことで体を温めている」→ 事実誤認が確認できるので除外）

## 独立ソースの数え方

Wikipedia を10サイトが引用しても **1**。原典を辿り、独立して観測・測定した数だけ数える。

---

## v1 からの変更

| 変更 | 理由 |
|---|---|
| `water: shallow/deep` → **`waterRequirement { preferredDepth, maximumDepth, escapeNeeded }`** | ヒメハコは水深25cmで溺れる。ただし逃げ場があれば結果は変わる。水深だけでは危険 |
| `hibernation: none/optional/required` → **`winterStrategy`** | 「冬眠しない」と「活動量が落ちるだけ」は別。繁殖のためのクーリングは第4の状態 |
| `healthSigns` → **`normalBehavior`** | **正常が分からないと異常は分からない。** スペングラーが落ち葉に潜るのは正常。急に一日中歩いたら異常 |
| `wcStatus` → **`tradeStatus`** | 流通は変わる。状態を固定しない |
| `diet` に **`feedingCue`** を追加 | 霧吹きで食欲が増す = `humidityTrigger`。何が食欲のスイッチかは飼育の実務に直結 |
| 単一値 → **`minimumRecommended` / `idealRecommended`** | 根拠のない数字を1つに固定しない |
| **`limitations.missingData`** 新設 | 「分かっていないこと」を情報として持つ |
| **`researchStatus_species`** 新設 | 種そのものが未研究であることを示す |
| **`caution`** 新設 | conflict と分離 |
| `breeding` → **別ファイル** | 診断で使わないものをエンジンが読むファイルに入れない |

## 廃止

- `requiredExperience` — **経験は種の属性ではない。** ヘルマン屋外=初心者、ヘルマンマンション=上級者。環境と掛けてエンジンが出す
- `odorLevel`（単一値） — 種だけでは決まらない。`odorRisk { wellManaged, neglected }` に
- `displayValue` / `activeHours` — **楽しさを点数化しない。** 「10時間歩く」が「2時間しか出ない」の5倍楽しいわけではない
- S/A/B ランク — 情報源の型に置換
MDEOF
