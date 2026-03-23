// SRJahir Tech Stocks — Service Worker v6
// Aggressive cache clear + no HTML caching
const CACHE = 'srj-stocks-v21';

// On install: clear everything first, then cache only static assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => caches.open(CACHE))
      .then(c => c.addAll([
        '/assets/css/style.css',
        '/assets/js/shared.js',
        '/assets/images/favicon-bull.png',
      ]).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = e.request.url;
  // NEVER cache: HTML pages, APIs, analytics, ads, external scripts
  if (url.includes('.html') ||
      url.includes('script.google.com') ||
      url.includes('googletagmanager') ||
      url.includes('pagead') ||
      url.includes('tradingview') ||
      url.includes('allorigins') ||
      url.includes('corsproxy') ||
      url.includes('yahoo') ||
      e.request.method !== 'GET') {
    return; // Bypass SW completely
  }
  // Network first for everything - fall back to cache
  e.respondWith(
    fetch(e.request)
      .then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
