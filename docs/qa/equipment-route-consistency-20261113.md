# 全種表示と通常ルートの用品候補を統一（2026-11-13）

## 原因と修正
species.jsに equipmentKey / equipment_key は存在しない。resolveEquipmentKey の all 分岐が名前とサイズから通常ルートとは別の推測をしていた。all getter は元4ルートの同じオブジェクトを concat するため、その参照から元ルートを回収して既存の判定を使う。未知オブジェクトは従来のfallbackを維持。種別マップの新設、通常ルートや商品の追加・削除はない。

## 影響
全119件中、全種表示の46件が変わる（land6 / aquatic12 / forest6 / exotic22）。通常ルート119件は不変。46件のslugとキー差分は同名JSON。

森林6件（ヒラセ、obsti、ニカラグア、ソノラ、ゲレーロ、ノコヘリ）は dry_small から forest へ。standardの具体例：
- 容器 enclosure_wood_90 → enclosure_kayuso_90
- UVB uvb_t5_desert_std → uvb_t5_forest_std
- 床材 substrate_grassland_mix → substrate_gex_terrarium_soil
- 隠れ家 shelter_medium → shelter_bark_hide
- 餌 food_tortoise_staple → food_tortoise_gel
- 補助 supplement_calcium_plus → supplement_multivitamin
- water_dish枠はforestセットにないため候補からなくなる（10件→9件）。水場不要という意味ではなく、種別条件文で必要性を別に説明する。
budgetは加温と床材、premiumはUVB・加温等も切り替わる。候補は既存通常画面と完全一致するが、当該商品が種別に適合することを新しく保証する修正ではない。

## 検証
- test-equipment-route-consistency:119件×3tier=357組、通常キー/候補ID/順序/価格不変、all候補内容/順序/価格/件数が通常と一致。
- 参照閲覧 commerce抑止のrefOnly行は基準mainと完全一致。
- 旧コードでall/native一致テスト失敗、新コード通過。
- shared-products-round3:714組を元の通常ルート基準と比較してPASS。all変更を意図的変更と明記。
- git diff --check PASS。
