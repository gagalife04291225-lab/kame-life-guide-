/* Used only by the verified shallow-water box-turtle species pages, before mounting their starter kits. */
(function () {
  'use strict';
  if (typeof PRODUCTS === 'undefined' || !PRODUCTS.filter_small ||
      PRODUCTS.filter_small.asin !== 'B0012UO6Q6') return;
  PRODUCTS.filter_small = {
    ...PRODUCTS.filter_small,
    why: '浅い水入れだけなら、このフィルターは不要です。別に水槽を設ける場合は、メーカー適合の幅40〜51cmで、水面をモーターの最低水位線より上に保てることを確認してください。'
  };
}());
