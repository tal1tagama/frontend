/* eslint-disable no-restricted-globals */
const CACHE_NAME = "obralink-v1";
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/favicon.ico",
];

// Instala — pré-cacheia assets estáticos essenciais
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Ativa — limpa caches antigos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch — estratégia por tipo de recurso
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Requisições para API: network-first (tenta rede, cai no cache se offline)
  if (url.pathname.startsWith("/api")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok && request.method === "GET") {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Assets estáticos (JS, CSS, imagens, fontes): cache-first
  if (
    request.destination === "script" ||
    request.destination === "style" ||
    request.destination === "image" ||
    request.destination === "font"
  ) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            if (response.ok) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            }
            return response;
          })
      )
    );
    return;
  }

  // Navegação (HTML): network-first com fallback para index.html (SPA)
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match("/index.html"))
    );
    return;
  }

  // Demais requisições: network-first
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});
