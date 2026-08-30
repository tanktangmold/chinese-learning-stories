const CACHE = "xiaoxue-tablet-v2";
const CORE = [
    "./",
    "./index.html",
    "./app.js",
    "./picture.js",
    "./styles.css",
    "./manifest.json",
    "./favicon.svg",
    "./apple-touch-icon.png",
    "./data/course.json",
    "./data/games.json",
    "./data/voices.json",
];
const IMAGES = [
    "academy", "book", "daily", "firstkick", "intro", "island",
    "park", "preview", "puppy", "star", "starry",
].flatMap((name) => ["comic", "picturebook", "realistic"].map((style) => `./images/${style}/${name}.webp`));

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE).then((cache) => cache.addAll(CORE.concat(IMAGES))).then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))
        ).then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") return;
    const url = new URL(event.request.url);
    if (url.origin !== self.location.origin) return;
    event.respondWith(
        caches.match(event.request).then((hit) => {
            if (hit) return hit;
            return fetch(event.request).then((res) => {
                if (res.ok) {
                    const copy = res.clone();
                    caches.open(CACHE).then((cache) => cache.put(event.request, copy));
                }
                return res;
            });
        })
    );
});
