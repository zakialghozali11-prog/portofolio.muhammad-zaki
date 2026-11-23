/* ==========================================================================
   MZ Studio & Finance — Service Worker
   Strategi: Network-First dengan Cache Fallback.
   - Saat online : selalu ambil file terbaru (perubahan di VS Code langsung terlihat).
   - Saat offline: pakai salinan terakhir dari cache, jadi aplikasi tetap bisa dibuka.
   Semua path relatif (./) agar aman di sub-folder GitHub Pages.
   ========================================================================== */

const CACHE_VERSION = "mz-app-v4";

const CORE_FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./icon-mz.svg",
  "./icon-192.png",
  "./icon-512.png",
];

/* === INSTALL: simpan file inti ke cache === */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      // add satu per satu: satu file yang gagal tidak membatalkan seluruh instalasi
      .then((cache) => Promise.all(CORE_FILES.map((url) => cache.add(url).catch(() => null))))
      .then(() => self.skipWaiting())
  );
});

/* === ACTIVATE: bersihkan cache versi lama === */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

/* === FETCH: Network-First, cadangan ke cache === */
self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.protocol !== "http:" && url.protocol !== "https:") return;

  const isGoogleFont = url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";

  // Font Google: tampilkan cache dulu, perbarui diam-diam di belakang layar
  if (isGoogleFont) {
    event.respondWith(
      caches.open(CACHE_VERSION).then(async (cache) => {
        const cached = await cache.match(request);
        const fresh = fetch(request)
          .then((response) => {
            if (response && (response.ok || response.type === "opaque")) cache.put(request, response.clone());
            return response;
          })
          .catch(() => cached);
        return cached || fresh;
      })
    );
    return;
  }

  // Sumber luar lain dibiarkan lewat apa adanya
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(request, { ignoreSearch: true });
        if (cached) return cached;
        if (request.mode === "navigate") {
          const shell = (await caches.match("./index.html")) || (await caches.match("./"));
          if (shell) return shell;
        }
        return new Response("Offline", { status: 503, statusText: "Offline" });
      })
  );
});