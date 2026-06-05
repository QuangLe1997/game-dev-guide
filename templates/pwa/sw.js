/* ============================================================
   Service Worker — offline shell + CACHE-BUSTING.
   ⚠️ BẮT BUỘC: bump CACHE_VERSION mỗi lần deploy có đổi
   index.html / JS / CSS. Không bump = người chơi kẹt bản cũ
   (đây là cạm bẫy stale-deploy phổ biến nhất của PWA).

   Chiến lược:
   - HTML/JS/CSS: network-first (luôn cố lấy bản mới, fallback cache khi offline)
   - ảnh/asset:   cache-first (nhanh, ít đổi)
   - activate:    xoá mọi cache version cũ
   ============================================================ */
const CACHE_VERSION = 'v1';                         // ← BUMP mỗi deploy đổi code (v1→v2→…)
const CACHE = `game-${CACHE_VERSION}`;
const CORE = [ './', './index.html', './manifest.webmanifest' ];

self.addEventListener('install', e => {
  self.skipWaiting();                                // bản mới chiếm quyền ngay
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).catch(()=>{}));
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));  // dọn cache cũ
    await self.clients.claim();
  })());
});

const isAsset = url => /\.(png|jpe?g|webp|gif|svg|woff2?|mp3|ogg)$/i.test(url);

self.addEventListener('fetch', e => {
  const { request } = e;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  if (isAsset(url.pathname)) {
    // cache-first cho asset
    e.respondWith(caches.match(request).then(hit => hit || fetch(request).then(res => {
      const copy = res.clone(); caches.open(CACHE).then(c => c.put(request, copy)); return res;
    })));
  } else {
    // network-first cho HTML/JS/CSS (tránh stale)
    e.respondWith(fetch(request).then(res => {
      const copy = res.clone(); caches.open(CACHE).then(c => c.put(request, copy)); return res;
    }).catch(() => caches.match(request).then(hit => hit || caches.match('./index.html'))));
  }
});
