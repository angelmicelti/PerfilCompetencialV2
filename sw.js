/* =====================================================================
   Perfil Competencial LOMLOE · Service Worker (GitHub Pages / hosting)
   v2.7 · La app es un único index.html (CSS y JS incluidos)
   - Precachea el shell completo (todo es local, sin CDNs)
   - Navegaciones: red primero, caché como respaldo (offline)
   - Estáticos: caché primero + actualización en segundo plano
   - Las peticiones a Firebase (cross-origin) pasan directas a la red
   ===================================================================== */
var VERSION = "perfil-competencial-v2.7";
var SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-192.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png",
  "./icons/favicon-32.png"
];

self.addEventListener("install", function (e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(VERSION).then(function (c) {
      // allSettled: si un archivo falla, el resto del shell se cachea igualmente
      return Promise.allSettled(SHELL.map(function (url) {
        return c.add(new Request(url, { cache: "reload" }));
      }));
    })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (claves) {
      return Promise.all(claves.map(function (k) {
        return k === VERSION ? null : caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  if (url.origin !== location.origin) return; // Firebase REST → red directa

  // Navegación (abrir la app): red primero, caché de respaldo
  if (req.mode === "navigate" || (req.headers.get("accept") || "").indexOf("text/html") >= 0) {
    e.respondWith(
      fetch(req).then(function (res) {
        var copia = res.clone();
        caches.open(VERSION).then(function (c) { c.put("./index.html", copia); });
        return res;
      }).catch(function () {
        return caches.match("./index.html").then(function (r) { return r || caches.match("./"); });
      })
    );
    return;
  }

  // Estáticos del mismo origen: caché primero + refresco en segundo plano
  e.respondWith(
    caches.match(req).then(function (cacheada) {
      var red = fetch(req).then(function (res) {
        if (res && res.ok) {
          var copia = res.clone();
          caches.open(VERSION).then(function (c) { c.put(req, copia); });
        }
        return res;
      }).catch(function () { return cacheada; });
      return cacheada || red;
    })
  );
});
