const CACHE = 'taskforge-cache-v2';
const ASSETS = [
  '/',
  '/index.html'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});
self.addEventListener('fetch', e => {
  const url = e.request.url;
  if (url.includes('firebasestorage.googleapis.com') || url.includes('storage.googleapis.com')) {
    e.respondWith(
      caches.open(CACHE).then(cache =>
        cache.match(e.request).then(r => r || fetch(e.request).then(resp => {
          cache.put(e.request, resp.clone());
          return resp;
        }))
      )
    );
    return;
  }
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
