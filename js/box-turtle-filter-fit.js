/* Applies only to the exact AT-50 row, when opted in by a species page or quiz result. */
function applyKlgBoxTurtleFilterFit() {
  'use strict';
  if (typeof PRODUCTS === 'undefined' || !PRODUCTS.filter_small ||
      PRODUCTS.filter_small.asin !== 'B0012UO6Q6') return;
  PRODUCTS.filter_small = {
    ...PRODUCTS.filter_small,
    why: '浅い水入れだけなら、このフィルターは不要です。別に水槽を設ける場合は、メーカー適合の幅40〜51cmで、水面をモーターの最低水位線より上に保てることを確認してください。'
  };
}
// Species pages load the product catalog first. Diagnosis calls again after its lazy load.
applyKlgBoxTurtleFilterFit();
