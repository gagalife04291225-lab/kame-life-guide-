/* Enrich existing exact Amazon JP links only. No client-side catalog credentials. */
(function () {
  'use strict';
  const meta = document.querySelector('meta[name="klg-amazon-image-service"]');
  if (!meta || meta.content !== '/api/amazon-product-images') return;
  const selector = 'a[href*="amazon.co.jp/"]';
  const asinOf = (href) => {
    try {
      const u = new URL(href, location.origin);
      if (u.protocol !== 'https:' || !['www.amazon.co.jp', 'amazon.co.jp'].includes(u.host) ||
          u.username || u.password || u.searchParams.getAll('tag').length !== 1 ||
          u.searchParams.get('tag') !== 'kamelife090e-22') return null;
      return u.pathname.match(/^\/(?:dp|gp\/product)\/([A-Z0-9]{10})\/?$/)?.[1] || null;
    } catch (_) { return null; }
  };
  const items = new Map();
  const inflight = new Set();
  const retry = new Map();
  const pending = new Set();
  const entries = new Map();
  const generation = new WeakMap();
  const maxLifetime = 18 * 60 * 60 * 1000;
  let flushing = false;
  let timer = 0;
  const contextSelectors = '.item,.diy,.gear-card,.gear,.rank-list-item,.amazon-placeholder,.amazon-cta,.info-box,.sk-card,.kid-card,[data-amazon-photo-context]';
  function route(a) {
    const ctx = a.closest(contextSelectors);
    if (!ctx || a.closest('[hidden],[inert],[aria-disabled="true"],.is-locked,.is-placeholder')) return null;
    // Do not render Amazon Program Content in a mixed retailer product card.
    if (ctx.querySelector('a[href*="rakuten"],a[data-href*="rakuten"],a[data-provider="rakuten"],a[data-retailer="rakuten"],a[data-channel="rakuten"]:not(.is-placeholder),.sk-card-media')) return null;
    const asin = asinOf(a.getAttribute('href'));
    if (!asin || (a.dataset.asin && a.dataset.asin !== asin)) return null;
    if (!a.textContent.trim() || a.querySelector('img:not(.klg-amazon-product-img)')) return null;
    return asin;
  }
  function validPhoto(row, asin) {
    if (row?.asin !== asin || typeof row.detailUrl !== 'string' ||
        !row.detailUrl.startsWith('https://www.amazon.co.jp/') || asinOf(row.detailUrl) !== asin || !Number.isSafeInteger(row.expiresAt) ||
        row.expiresAt <= Date.now() || row.expiresAt - Date.now() > maxLifetime) return false;
    try {
      const u = new URL(row.url);
      return u.protocol === 'https:' && u.host === 'm.media-amazon.com' && !u.username &&
        !u.password && !u.search && !u.hash && /^\/images\/I\/[\w%+.,-]+\.(?:jpg|jpeg|png|webp)$/i.test(u.pathname);
    } catch (_) { return false; }
  }
  function remove(a) {
    const entry = entries.get(a);
    if (!entry) return;
    if (entry.applied && a.getAttribute('href') === entry.photo.detailUrl) {
      a.setAttribute('href', entry.originalHref);
    }
    if (entry.changedTrackingUrl && a.dataset.clickUrl === entry.photo.detailUrl) {
      a.dataset.clickUrl = a.getAttribute('href') || entry.originalHref;
    }
    entry.img.removeAttribute('src');
    entry.frame.remove();
    a.classList.remove('klg-amazon-photo-link');
    entries.delete(a);
  }
  function frameSize(w, h) {
    if (!(Number.isFinite(w) && Number.isFinite(h)) || w <= 0 || h <= 0) return null;
    const ratio = w / h;
    const boxW = ratio >= 1.45 ? 260 : 200;
    const boxH = ratio <= 0.7 ? 260 : 200;
    // Natural resolution caps the size: enlarging a small source does not reveal text.
    // No upscaling, cropping or re-encoding of the provided image.
    const scale = Math.min(1, boxW / w, boxH / h);
    return [Math.max(1, Math.round(w * scale)), Math.max(1, Math.round(h * scale))];
  }
  function paint(a, asin, photo) {
    if (!validPhoto(photo, asin) || route(a) !== asin || !a.isConnected) return;
    if (entries.get(a)?.photo.url === photo.url &&
        entries.get(a).photo.detailUrl === photo.detailUrl) {
      entries.get(a).photo = photo;
      return;
    }
    remove(a);
    const revision = (generation.get(a) || 0) + 1;
    generation.set(a, revision);
    const frame = document.createElement('span');
    frame.className = 'klg-amazon-product-frame';
    frame.hidden = true;
    frame.setAttribute('aria-hidden', 'true');
    const img = document.createElement('img');
    img.className = 'klg-amazon-product-img';
    img.alt = '';
    img.width = img.height = 200;
    img.decoding = 'async';
    img.referrerPolicy = 'no-referrer';
    frame.append(img);
    a.prepend(frame);
    const linked = {frame, img, photo, asin, originalHref:a.getAttribute('href'), applied:false};
    entries.set(a, linked);
    img.addEventListener('load', () => {
      if (generation.get(a) !== revision || entries.get(a)?.frame !== frame) return;
      if (!a.isConnected || route(a) !== asin || a.getAttribute('href') !== linked.originalHref || !validPhoto(linked.photo, asin)) return remove(a);
      const size = frameSize(img.naturalWidth, img.naturalHeight);
      if (!size) return remove(a);
      frame.style.inlineSize = size[0] + 'px';
      frame.style.aspectRatio = size[0] + ' / ' + size[1];
      linked.applied = true;
      a.setAttribute('href', linked.photo.detailUrl); // preserve API attribution parameters verbatim
      linked.changedTrackingUrl = a.dataset.clickUrl === linked.originalHref;
      if (linked.changedTrackingUrl) a.dataset.clickUrl = linked.photo.detailUrl;
      a.classList.add('klg-amazon-photo-link');
      frame.hidden = false;
    }, { once: true });
    img.addEventListener('error', () => {
      if (entries.get(a)?.frame === frame) {
        remove(a);
        items.delete(asin);
        retry.set(asin, Date.now() + 300000);
      }
    }, { once: true });
    img.src = photo.url;
  }
  function scheduleFlush() {
    if (!flushing && !timer && pending.size) timer = setTimeout(flush, 40);
  }
  async function flush() {
    timer = 0;
    if (flushing || !pending.size || document.visibilityState === 'hidden') return;
    flushing = true;
    const batch = [...pending].slice(0, 20);
    batch.forEach(id => { pending.delete(id); inflight.add(id); });
    try {
      const url = new URL(meta.content, location.origin);
      url.searchParams.set('items', batch.join(','));
      const response = await fetch(url, { cache: 'no-store', redirect: 'error',
        credentials: 'omit', signal: AbortSignal.timeout(4500) });
      if (!response.ok || !/^application\/json\b/i.test(response.headers.get('Content-Type') || '')) throw Error();
      const data = await response.json();
      for (const id of batch) {
        const row = data?.photos?.[id];
        if (validPhoto(row, id)) items.set(id, row);
        else retry.set(id, Date.now() + 300000);
      }
    } catch (_) {
      batch.forEach(id => retry.set(id, Date.now() + 300000));
    } finally {
      batch.forEach(id => inflight.delete(id));
      flushing = false;
      if (document.visibilityState !== 'hidden') {
        for (const a of document.querySelectorAll(selector)) {
          const id = route(a);
          if (items.has(id)) paint(a, id, items.get(id));
        }
        scheduleFlush();
      }
    }
  }
  const observer = new IntersectionObserver(changes => {
    for (const {isIntersecting, target} of changes) if (isIntersecting) consider(target);
  }, { rootMargin: '250px 0px' });
  const watched = new Set();
  function consider(a) {
    const id = route(a);
    if (!id || document.visibilityState === 'hidden') return;
    if (validPhoto(items.get(id), id)) return paint(a, id, items.get(id));
    items.delete(id);
    if (!inflight.has(id) && (retry.get(id) || 0) <= Date.now()) {
      pending.add(id);
      scheduleFlush();
    }
  }
  function scan() {
    for (const a of watched) if (!a.isConnected || !route(a)) {
      observer.unobserve(a); watched.delete(a); remove(a);
    }
    for (const a of document.querySelectorAll(selector)) {
      if (!route(a) || watched.has(a)) continue;
      watched.add(a);
      observer.observe(a);
    }
    for (const [a, e] of entries) if (route(a) !== e.asin || !validPhoto(e.photo, e.asin) ||
      a.getAttribute('href') !== (e.applied ? e.photo.detailUrl : e.originalHref)) remove(a);
  }
  let scanTimer = 0;
  new MutationObserver(changes => {
    if (scanTimer || !changes.some(r => r.type === 'attributes' ||
      [...r.addedNodes, ...r.removedNodes].some(n => n.nodeType === 1 &&
        (n.matches('a') || n.querySelector('a'))))) return;
    scanTimer = setTimeout(() => { scanTimer = 0; scan(); }, 0);
  }).observe(document.body, { subtree: true, childList: true, attributes: true,
    attributeFilter: ['href', 'hidden', 'aria-disabled', 'inert'] });
  function clear() {
    items.clear(); pending.clear();
    for (const a of entries.keys()) remove(a);
  }
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') return clear();
    scan();
    for (const a of watched) {
      const r = a.getBoundingClientRect();
      if (r.bottom >= -250 && r.top <= innerHeight + 250) consider(a);
    }
  });
  window.addEventListener('pagehide', clear);
  window.addEventListener('pageshow', scan);
  setInterval(scan, 15000);
  scan();
}());
