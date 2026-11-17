// Agenda da Anvil · service worker mínimo: sempre tenta a rede primeiro (a página nunca fica velha) e,
// sem sinal, abre a última cópia guardada. Não guarda nada do banco.
const CAIXA = "agenda-v1";
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil((async () => { for (const k of await caches.keys()) if (k !== CAIXA) await caches.delete(k); await self.clients.claim(); })()));
self.addEventListener("fetch", (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return;
  e.respondWith((async () => {
    try { const r = await fetch(e.request, { cache: "no-store" }); if (r.ok) { const c = await caches.open(CAIXA); c.put(e.request, r.clone()); } return r; }
    catch { const g = await caches.match(e.request, { ignoreSearch: true }); if (g) return g; throw new Error("sem rede e sem cópia"); }
  })());
});
