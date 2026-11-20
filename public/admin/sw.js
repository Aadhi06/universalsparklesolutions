const CACHE = "uss-admin-v3";
const OFFLINE = "/admin/offline.html";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.add(OFFLINE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith("/admin")) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(async () => (await caches.match(OFFLINE)) || Response.error()),
    );
  }
});

self.addEventListener("push", (event) => {
  let payload = { title: "USS Admin", body: "", url: "/admin/" };
  try {
    payload = { ...payload, ...(event.data ? event.data.json() : {}) };
  } catch {
    payload.body = event.data ? event.data.text() : "";
  }

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: "/admin/icon-192.png",
      badge: "/admin/icon-192.png",
      data: { url: payload.url || "/admin/" },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = new URL(event.notification.data?.url || "/admin/", self.location.origin);
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(async (windows) => {
      const open = windows.find((client) => new URL(client.url).pathname.startsWith("/admin"));
      if (open) {
        await open.focus().catch(() => undefined);
        if (open.url === url.href) return undefined;
        // navigate() only works on windows this worker controls; fall back to openWindow.
        const moved =
          "navigate" in open ? await open.navigate(url.href).catch(() => null) : null;
        if (moved) return undefined;
      }
      return self.clients.openWindow(url.href);
    }),
  );
});
