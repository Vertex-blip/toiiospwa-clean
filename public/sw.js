const CACHE_NAME = "toikz-v2-secure";
const PRECACHE = ["/", "/manifest.json"];

const isPrivatePath = (url) =>
  url.pathname.startsWith("/menu") ||
  url.pathname.startsWith("/admin") ||
  url.pathname.startsWith("/vendor") ||
  url.pathname.startsWith("/profile") ||
  url.pathname.startsWith("/booking");

const isFirebaseRequest = (url) =>
  url.hostname.includes("firebaseio.com") ||
  url.hostname.includes("googleapis.com") ||
  url.hostname.includes("firebaseapp.com") ||
  url.hostname.includes("firebasestorage.googleapis.com") ||
  url.hostname.includes("identitytoolkit.googleapis.com") ||
  url.hostname.includes("securetoken.googleapis.com");

const hasAuthorization = (request) => request.headers.has("Authorization");

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
      )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (url.hostname.includes("kaspersky-labs.com")) {
    return;
  }

  if (
    request.method !== "GET" ||
    hasAuthorization(request) ||
    isPrivatePath(url) ||
    isFirebaseRequest(url)
  ) {
    event.respondWith(fetch(request));
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.ok && url.origin === self.location.origin && !isPrivatePath(url)) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone)).catch(() => {});
          }
          return response;
        })
        .catch(() => caches.match(request).then((match) => match || caches.match("/")))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (
            response &&
            response.status === 200 &&
            response.type === "basic" &&
            url.origin === self.location.origin
          ) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone)).catch(() => {});
          }
          return response;
        })
        .catch(() => cached);

      return cached || network;
    })
  );
});
