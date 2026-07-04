/**
 * Kame Life Guide - Research Products Master Validator
 * Phase 39-P1-Step3
 *
 * Run: node tools/validate-products-master.js
 *
 * Validates research/products-master.sample.json against
 * research/products-master.schema.json without a JSON Schema library
 * dependency (repo has no package.json / node_modules).
 *
 * Checks:
 *  1  JSON valid (schema + sample)
 *  2  id unique
 *  3  Required fields present (no missing keys)
 *  4  No fields outside the schema (additionalProperties)
 *  5  id matches ^RM[0-9]{4}$
 *  6  category is an allowed value
 *  7  amazon_status / rakuten_status are allowed values
 *  8  price_band is an allowed value
 *  9  availability_status is an allowed value
 *  10 priority_score / quality_score / revenue_score are numbers in [0, 10]
 */

'use strict';

const fs = require('fs');
const path = require('path');

const SCHEMA_PATH = path.join(__dirname, '..', 'research', 'products-master.schema.json');
const SAMPLE_PATH = path.join(__dirname, '..', 'research', 'products-master.sample.json');

const errors = [];

function fail(message) {
  errors.push(message);
}

function loadJson(filePath, label) {
  let raw;
  try {
    raw = fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    fail(`${label}: ファイルが読み込めません (${filePath}): ${e.message}`);
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    fail(`${label}: JSONとして不正です: ${e.message}`);
    return null;
  }
}

const schema = loadJson(SCHEMA_PATH, 'schema');
const sample = loadJson(SAMPLE_PATH, 'sample');

if (schema && sample) {
  const productDef = schema.definitions && schema.definitions.product;
  if (!productDef) {
    fail('schema: definitions.product が見つかりません');
  } else {
    const requiredFields = productDef.required || [];
    const allowedFields = new Set(Object.keys(productDef.properties || {}));
    const props = productDef.properties;

    const allowedCategory = new Set(props.category.enum);
    const allowedStatus = new Set(props.amazon_status.enum);
    const allowedPriceBand = new Set(props.price_band.enum);
    const allowedAvailability = new Set(props.availability_status.enum);
    const idPattern = new RegExp(props.id.pattern);

    if (!Array.isArray(sample.products)) {
      fail('sample: products が配列ではありません');
    } else {
      const seenIds = new Set();

      sample.products.forEach((product, index) => {
        const label = `products[${index}] (id=${product && product.id})`;

        // 3. Required fields present
        requiredFields.forEach((field) => {
          if (!Object.prototype.hasOwnProperty.call(product, field)) {
            fail(`${label}: 必須項目 "${field}" がありません`);
          }
        });

        // 4. No extra fields
        Object.keys(product).forEach((key) => {
          if (!allowedFields.has(key)) {
            fail(`${label}: スキーマにないフィールド "${key}" があります`);
          }
        });

        // 2 & 5. id unique + pattern
        if (typeof product.id === 'string') {
          if (!idPattern.test(product.id)) {
            fail(`${label}: id "${product.id}" が形式 ${props.id.pattern} に一致しません`);
          }
          if (seenIds.has(product.id)) {
            fail(`${label}: id "${product.id}" が重複しています`);
          }
          seenIds.add(product.id);
        }

        // 6. category allowed
        if (product.category !== undefined && !allowedCategory.has(product.category)) {
          fail(`${label}: category "${product.category}" は許可値ではありません`);
        }

        // 7. amazon_status / rakuten_status allowed
        if (product.amazon_status !== undefined && !allowedStatus.has(product.amazon_status)) {
          fail(`${label}: amazon_status "${product.amazon_status}" は許可値ではありません`);
        }
        if (product.rakuten_status !== undefined && !allowedStatus.has(product.rakuten_status)) {
          fail(`${label}: rakuten_status "${product.rakuten_status}" は許可値ではありません`);
        }

        // 8. price_band allowed
        if (product.price_band !== undefined && !allowedPriceBand.has(product.price_band)) {
          fail(`${label}: price_band "${product.price_band}" は許可値ではありません`);
        }

        // 9. availability_status allowed
        if (product.availability_status !== undefined && !allowedAvailability.has(product.availability_status)) {
          fail(`${label}: availability_status "${product.availability_status}" は許可値ではありません`);
        }

        // 10. scores are numbers in [0, 10]
        ['priority_score', 'quality_score', 'revenue_score'].forEach((field) => {
          const value = product[field];
          if (typeof value !== 'number' || Number.isNaN(value) || value < 0 || value > 10) {
            fail(`${label}: ${field} は0〜10の数値である必要があります（実際: ${value}）`);
          }
        });
      });
    }
  }
}

// ── Report ───────────────────────────────────────────────────────────────

if (errors.length) {
  console.error(`✗ validate-products-master: ${errors.length}件のエラー`);
  errors.forEach((e) => console.error(' - ' + e));
  process.exit(1);
} else {
  const count = sample && Array.isArray(sample.products) ? sample.products.length : 0;
  console.log(`✓ validate-products-master: OK (${count}件, エラー0件)`);
  process.exit(0);
}
