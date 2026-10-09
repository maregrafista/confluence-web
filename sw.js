// Confluence · service worker (gerado por build_site.py). Abre sem internet; com internet busca a versão nova.
const CACHE = 'confluence-6.9.0-alpha.3-41d3568a9783bffa';
const BASE = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png', './favicon-32.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(BASE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('confluence-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET') return;
  if (r.mode === 'navigate') {   // página: rede primeiro (versão nova), cache se estiver sem internet
    e.respondWith(fetch(r.url, { cache: 'no-store' }).then(res => { const c = res.clone(); caches.open(CACHE).then(k => k.put('./index.html', c)); return res; }).catch(() => caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(r).then(m => m || fetch(r).then(res => { if (res.ok && (r.url.startsWith(self.location.origin) || /fonts\.(googleapis|gstatic)\.com|cdnjs|jsdelivr/.test(r.url))) { const c = res.clone(); caches.open(CACHE).then(k => k.put(r, c)); } return res; })));
});
