// Service Worker for Nalanda College Attendance & ERP System (v2 - Instant Fresh Load)
const CACHE_NAME = "nalanda-erp-v2";
const STATIC_ASSETS = [
  "/logo.png",
  "/favicon.svg",
  "/manifest.webmanifest",
];

// Install Event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate Event - Purge all old caches immediately
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[ServiceWorker] Purging outdated cache:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event - Network-First for HTML/Navigations, Cache-First for static icons
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // APIs are always direct network
  if (url.pathname.startsWith("/api/")) {
    return;
  }

  // HTML pages & Navigations: Always Network-first so users get instant fresh updates!
  if (
    event.request.mode === "navigate" ||
    url.pathname === "/" ||
    url.pathname.endsWith(".html")
  ) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          return networkResponse;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
    return;
  }

  // Static assets: cache-first with network fallback
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        return networkResponse;
      });
    })
  );
});
