// The version of the cache.
const VERSION = "v1.5";

// The name of the cache
const CACHE_NAME = `local-totp-${VERSION}`;

// The static resources that the app needs to function.
const APP_STATIC_RESOURCES = [
  "/",
  "/index.html",
  "/index.js",
  "/jquery.js",
  "/manifest.json",
  "/output.css",
  "/assets/72.png",
  "/assets/128.png",
  "/assets/256.png",
  "/assets/512.png",
  "/assets/favicon.ico",
  "/assets/account-unlock.png",
  "/assets/totp-create.png",
  "/assets/totp-list.png",
  "/pkg/totp_db_bg.wasm",
  "/pkg/totp_db_bg.wasm.d.ts",
  "/pkg/totp_db.d.ts",
  "/pkg/totp_db.js",
  "/pkg/package.json",
];

// On install, cache the static resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      cache.addAll(APP_STATIC_RESOURCES);
    })()
  );
});

// delete old caches on activate
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
      await clients.claim();
    })()
  );
});

// On fetch, intercept server requests
// and respond with cached responses instead of going to network
self.addEventListener("fetch", (event) => {
  // As a single page app, direct app to always go to cached home page.
  if (event.request.mode === "navigate") {
    event.respondWith(caches.match("/"));
    return;
  }

  // For all other requests, go to the cache first, and then the network.
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(event.request);
      if (cachedResponse) {
        // Return the cached response if it's available.
        return cachedResponse;
      }
      // If resource isn't in the cache, return a 404.
      return new Response(null, { status: 404 });
    })()
  );
});
