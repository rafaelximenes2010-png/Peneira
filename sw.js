/* Service worker do Peneira: guarda o app para abrir offline.
   Ao publicar uma nova versão, altere CACHE (ex.: peneira-v28) para forçar a atualização. */
const CACHE = "peneira-v51";
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

// Alertas na tela bloqueada, com as cores do Farol do app:
//  🔴 Agir já (alta, VIP, golpe, menção, compromisso atrasado) · 🟡 Atenção (demais importantes, compromisso na hora).
// O aviso chega vazio; buscamos na ponte a fila de alertas e mostramos só os que este aparelho ainda não viu.
const ROTULO = { vermelho: "🔴 Agir já", amarelo: "🟡 Atenção" };
async function cfgLe(k) { try { const r = await (await caches.open(CFG)).match(k); return r ? await r.json() : null; } catch (e) { return null; } }
async function cfgGrava(k, v) { try { await (await caches.open(CFG)).put(k, new Response(JSON.stringify(v), { headers: { "content-type": "application/json" } })); } catch (e) {} }
async function badge(n) { try { if (n > 0 && self.navigator.setAppBadge) await self.navigator.setAppBadge(n); else if (self.navigator.clearAppBadge) await self.navigator.clearAppBadge(); } catch (e) {} }
self.addEventListener("push", e => {
  e.waitUntil((async () => {
    const c = await cfgLe("/__ponte");
    let novos = [], fila = null;
    if (c && c.url && c.tok) {
      const base = c.url.replace(/\/+$/, ""), h = { headers: { authorization: "Bearer " + c.tok } };
      try { const j = await fetch(base + "/alertas", h).then(x => x.ok ? x.json() : null); if (j && Array.isArray(j.alertas)) fila = j.alertas; } catch (err) {}
      if (fila) {
        const vistos = (await cfgLe("/__vistos")) || [];
        novos = fila.filter(a => a && a.id && !vistos.includes(a.id));
        await cfgGrava("/__vistos", [...vistos, ...novos.map(a => a.id)].slice(-200));
        if (!novos.length && fila.length) novos = [fila[fila.length - 1]];
      } else {
        try { const u = await fetch(base + "/ultimo", h).then(x => x.json()); if (u && u.titulo) novos = [{ id: "u" + Date.now(), cor: u.alta ? "vermelho" : "amarelo", titulo: u.titulo.replace(/^(⚠️|🔴|🟡)\s*/u, ""), texto: u.texto, url: "./#importantes" }]; } catch (err) {}
      }
    }
    if (!novos.length) novos = [{ id: "p" + Date.now(), cor: "amarelo", titulo: "Peneira", texto: "Nova mensagem importante no WhatsApp.", url: "./#importantes" }];
    const verm = ((await cfgLe("/__badge")) || 0) + novos.filter(a => a.cor === "vermelho").length;
    await cfgGrava("/__badge", verm); await badge(verm);
    // até 3 avisos separados; acima disso, um resumo para não encher a tela bloqueada
    const mostra = novos.length > 3 ? [...novos.slice(-2), { id: "resumo", cor: novos.some(a => a.cor === "vermelho") ? "vermelho" : "amarelo", titulo: "Peneira", texto: "+" + (novos.length - 2) + " alertas novos. Abra o app para ver.", url: "./#inicio" }] : novos;
    for (const a of mostra) {
      const rot = ROTULO[a.cor] || "Peneira";
      await self.registration.showNotification(a.titulo === "Peneira" ? rot : rot + " · " + a.titulo, {
        body: a.texto || "", icon: "./icons/icon-192.png", badge: "./icons/icon-192.png",
        tag: "peneira-" + a.id, renotify: a.cor === "vermelho", requireInteraction: a.cor === "vermelho",
        data: { url: a.url || "./#importantes" }
      });
    }
  })());
});
self.addEventListener("notificationclick", e => {
  e.notification.close();
  const alvo = (e.notification.data && e.notification.data.url) || "./#importantes";
  e.waitUntil((async () => {
    const ws = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const w of ws) { if ("focus" in w) { w.navigate && w.navigate(alvo); return w.focus(); } }
    return self.clients.openWindow(alvo);
  })());
});
self.addEventListener("message", e => { if (e.data === "zera-badge") e.waitUntil((async () => { await cfgGrava("/__badge", 0); await badge(0); })()); });
