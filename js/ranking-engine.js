/**
 * Kame Life Guide - Ranking Engine
 * Phase 13-A Step 3: Ranking Auto Score System
 *
 * Exposes: window.KameRankingEngine
 * Dependencies: none
 * Data source: /data/species_scores.json
 */

(function (global) {
  'use strict';

  // ── Ranking type definitions ──────────────────────────────────────────

  var FORMULAS = {
    type0: {
      name: 'ranking_hub',
      label: '初心者向け総合ランキング',
      weights: {
        beginner: 0.30,
        smell: 0.20,
        cost: 0.20,
        space: 0.15,
        maintenance: 0.15
      },
      filter: null
    },
    type1: {
      name: 'smell',
      label: '臭いが少ない亀ランキング',
      weights: {
        smell: 0.40,
        maintenance: 0.20,
        beginner: 0.20,
        space: 0.10,
        cost: 0.10
      },
      filter: null
    },
    type2: {
      name: 'small_space',
      label: '大きくならない・省スペース亀ランキング',
      weights: {
        space: 0.40,
        beginner: 0.25,
        smell: 0.15,
        maintenance: 0.10,
        cost: 0.10
      },
      filter: null
    },
    type3: {
      name: 'friendly',
      label: 'なつく亀ランキング',
      weights: {
        friendliness: 0.35,
        beginner: 0.25,
        smell: 0.20,
        space: 0.10,
        cost: 0.10
      },
      filter: null
    },
    type4: {
      name: 'easy',
      label: '飼いやすい亀ランキング',
      weights: {
        beginner: 0.35,
        maintenance: 0.25,
        smell: 0.20,
        space: 0.10,
        cost: 0.10
      },
      filter: null
    },
    type5: {
      name: 'low_cost',
      label: '初期費用が安い亀ランキング',
      weights: {
        cost: 0.40,
        space: 0.20,
        beginner: 0.20,
        maintenance: 0.10,
        smell: 0.10
      },
      filter: null
    },
    type6: {
      name: 'tortoise',
      label: '初心者向けリクガメランキング',
      weights: {
        beginner: 0.30,
        cost: 0.25,
        smell: 0.20,
        space: 0.15,
        maintenance: 0.10
      },
      // monetization added as 5% bonus after main calculation
      bonusField: 'monetization',
      bonusWeight: 0.05,
      filter: function (s) { return s.category === 'tortoise'; }
    },
    type7: {
      name: 'low_water_change',
      label: '水換えが楽な亀ランキング',
      weights: {
        maintenance: 0.40,
        smell: 0.25,
        beginner: 0.15,
        space: 0.10,
        cost: 0.10
      },
      filter: null
    },
    type8: {
      name: 'active',
      label: '観察が楽しい亀ランキング',
      weights: {
        activity: 0.40,
        friendliness: 0.25,
        beginner: 0.15,
        smell: 0.10,
        space: 0.10
      },
      filter: null
    },
    type9: {
      name: 'premium_rare',
      label: 'プレミアム・レア種ランキング',
      weights: {
        rarity: 0.40,
        activity: 0.20,
        authority: 0.20,
        friendliness: 0.10,
        monetization: 0.10
      },
      filter: null
    },
    type10: {
      name: 'long_life',
      label: '長生きする亀ランキング',
      // TODO: future - integrate lifespan field from species.js
      weights: {
        friendliness: 0.35,
        activity: 0.25,
        beginner: 0.20,
        maintenance: 0.20
      },
      filter: null
    },
    type11: {
      name: 'japanese_native',
      label: '国産・日本産の亀ランキング',
      weights: {
        beginner: 0.25,
        cost: 0.20,
        maintenance: 0.20,
        authority: 0.20,
        friendliness: 0.15
      },
      // whitelist of Japanese native species slugs
      nativeWhitelist: [
        'reeves-turtle',
        'japanese-pond-turtle',
        'yaeyama-pond-turtle',
        'unkyu'           // future: add when record exists
      ],
      filter: function (s) {
        return [
          'reeves-turtle',
          'japanese-pond-turtle',
          'yaeyama-pond-turtle',
          'unkyu'
        ].indexOf(s.slug) !== -1;
      }
    }
  };

  // ── Core engine ───────────────────────────────────────────────────────

  var _cache = null;

  /**
   * Fetch and cache species scores.
   * @returns {Promise<Array>}
   */
  function loadScores() {
    if (_cache) {
      return Promise.resolve(_cache);
    }
    return fetch('/data/species_scores.json')
      .then(function (res) {
        if (!res.ok) {
          throw new Error('Failed to load species_scores.json: ' + res.status);
        }
        return res.json();
      })
      .then(function (data) {
        _cache = data;
        return data;
      });
  }

  /**
   * Calculate ranking score for a single species.
   * @param {Object} species - species record
   * @param {string} type    - 'type0' .. 'type11'
   * @returns {number} score rounded to 2 decimals
   */
  function calculateScore(species, type) {
    var formula = FORMULAS[type];
    if (!formula) {
      throw new Error('Unknown ranking type: ' + type);
    }

    var weights = formula.weights;
    var total = 0;

    Object.keys(weights).forEach(function (field) {
      var val = species[field];
      if (typeof val !== 'number' || isNaN(val)) {
        throw new Error(
          'Invalid score for field "' + field + '" on slug "' + species.slug + '"'
        );
      }
      total += val * weights[field];
    });

    // type6: add monetization bonus (5%)
    if (formula.bonusField) {
      var bonus = species[formula.bonusField];
      if (typeof bonus === 'number' && !isNaN(bonus)) {
        total += bonus * formula.bonusWeight;
      }
    }

    return Math.round(total * 100) / 100;
  }

  /**
   * Load scores, apply formula, return sorted top N.
   * @param {string} type     - ranking type key
   * @param {number} [limit]  - default 10
   * @returns {Promise<Array>} ranked records with _score field added
   */
  function getTopByType(type, limit) {
    limit = limit || 10;
    var formula = FORMULAS[type];
    if (!formula) {
      return Promise.reject(new Error('Unknown ranking type: ' + type));
    }

    return loadScores().then(function (data) {
      var filtered = formula.filter
        ? data.filter(formula.filter)
        : data.slice();

      var scored = filtered.map(function (species) {
        var score = calculateScore(species, type);
        return Object.assign({}, species, { _score: score, _type: type });
      });

      scored.sort(function (a, b) { return b._score - a._score; });

      return scored.slice(0, limit);
    });
  }

  /**
   * Return formula metadata for a given type.
   * @param {string} type
   * @returns {Object}
   */
  function getFormula(type) {
    var formula = FORMULAS[type];
    if (!formula) {
      throw new Error('Unknown ranking type: ' + type);
    }
    return {
      type: type,
      name: formula.name,
      label: formula.label,
      weights: Object.assign({}, formula.weights),
      hasFilter: !!formula.filter
    };
  }

  // ── Public API ────────────────────────────────────────────────────────

  global.KameRankingEngine = {
    loadScores: loadScores,
    calculateScore: calculateScore,
    getTopByType: getTopByType,
    getFormula: getFormula,
    FORMULAS: FORMULAS
  };

})(typeof window !== 'undefined' ? window : global);
