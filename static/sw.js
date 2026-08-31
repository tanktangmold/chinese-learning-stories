const CACHE = "xiaoxue-tablet-v8";
const CORE = [
    "./",
    "./index.html",
    "./app.js",
    "./picture.js",
    "./games.js",
    "./styles.css",
    "./manifest.json",
    "./favicon.svg",
    "./apple-touch-icon.png",
    "./data/course.json",
    "./data/games.json",
    "./data/voices.json",
];
const DEDICATED = [1, 2, 3, 4, 5, 6, 7, 8].flatMap((n) => {
    const k = String(n).padStart(2, "0");
    return [`./pictures/ghibli/d03-l${k}.webp`, `./pictures/ghibli/d04-l${k}.webp`];
});
const IMAGES = [
    "academy", "book", "daily", "firstkick", "intro", "island",
    "park", "preview", "puppy", "star", "starry",
].flatMap((name) => ["comic", "picturebook", "realistic"].map((style) => `./images/${style}/${name}.webp`));

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE).then((cache) => cache.addAll(CORE.concat(IMAGES, DEDICATED))).then(() => self.skipWaiting())
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
