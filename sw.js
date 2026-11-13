/* Service worker do Peneira: guarda o app para abrir offline.
   Ao publicar uma nova versão, altere CACHE (ex.: peneira-v24) para forçar a atualização. */
const CACHE = "peneira-v24";
const FILES = ["./", "./index.html", "./manifest.webmanifest", "./politica.html", "./icons/icon.svg", "./icons/favicon-32.png",
  "./icons/apple-touch-180.png", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/icon-maskable-512.png"];

self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
// Rede primeiro (recebe atualizações); cópia guardada se estiver offline
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
    return res;
  }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match("./index.html"))));
});
