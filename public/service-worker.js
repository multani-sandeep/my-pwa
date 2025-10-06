/* service-worker.js */

// --- CONFIG --- //
const CACHE_NAME = "pwa-cache-v1";
const urlsToCache = ["/", "/index.html", "/manifest.json"];

// --- INSTALL --- //
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// --- ACTIVATE --- //
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

// --- FETCH (Safari-friendly: fallback only for GET) --- //
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200) return response;
          const cloned = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned));
          return response;
        })
        .catch(() => caches.match("/index.html"));
    })
  );
});

// --- PUSH HANDLER (Safari-compatible) --- //
self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (err) {
    data = { title: "Notification", body: event.data.text() };
  }

  const title = data.title || "PWA Notification";
  const options = {
    body: data.body || "You have a new message.",
    icon: "/icon.png",
    badge: "/icon.png",
    data: data.url || "/",
  };

  // Safari needs waitUntil wrapping
  event.waitUntil(self.registration.showNotification(title, options));
});

// --- NOTIFICATION CLICK HANDLER --- //
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data || "/";

  // Safari-compatible window focus logic
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url === url && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});