/* Service worker do Peneira: guarda o app para abrir offline.
   Ao publicar uma nova versão, altere CACHE (ex.: peneira-v28) para forçar a atualização. */
const CACHE = "peneira-v43";
const CFG = "peneira-cfg";
const FILES = ["./", "./index.html", "./manifest.webmanifest", "./politica.html", "./icons/icon.svg", "./icons/favicon-32.png",
  "./icons/apple-touch-180.png", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/icon-maskable-512.png"];

self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE && k !== CFG).map(k => caches.delete(k)))));
  self.clients.claim();
});
// Rede primeiro (recebe atualizações); cópia guardada se estiver offline
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(new Request(e.request.url, { cache: "no-cache", credentials: "same-origin" })).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
    return res;
  }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match("./index.html"))));
});

// Alertas na tela bloqueada: o aviso chega vazio; buscamos na ponte quem mandou e o resumo.
self.addEventListener("push", e => {
  e.waitUntil((async () => {
    let titulo = "Peneira", texto = "Nova mensagem importante no WhatsApp.";
    try {
      const r = await (await caches.open(CFG)).match("/__ponte");
      const c = r ? await r.json() : null;
      if (c && c.url && c.tok) {
        const u = await fetch(c.url.replace(/\/+$/, "") + "/ultimo", { headers: { authorization: "Bearer " + c.tok } }).then(x => x.json());
        if (u && u.titulo) { titulo = u.titulo; texto = u.texto || texto; }
      }
    } catch (err) {}
    await self.registration.showNotification(titulo, { body: texto, icon: "./icons/icon-192.png", badge: "./icons/icon-192.png", tag: "peneira-" + Date.now(), data: { url: "./#importantes" } });
  })());
});
self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil((async () => {
    const ws = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const w of ws) { if ("focus" in w) { w.navigate && w.navigate("./#importantes"); return w.focus(); } }
    return self.clients.openWindow("./#importantes");
  })());
});
