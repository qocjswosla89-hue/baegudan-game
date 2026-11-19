// 홈 화면 앱용: 게임 파일을 폰에 저장해 두고, 인터넷이 되면 항상 새 버전을 먼저 받는다.
// 인터넷이 없을 때만 저장해 둔 것을 쓴다 (그래서 업데이트가 늦게 보이는 문제가 없다).
const CACHE = 'baegudan-v1';
const FILES = ['./', 'index.html', 'manifest.json', 'assets/brand/icon192.png', 'assets/brand/icon512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request, {cache: 'no-cache'})
      .then(r => { if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); } return r; })
      .catch(() => caches.match(e.request, {ignoreSearch: true}).then(r => r || caches.match('index.html')))
  );
});
