const CACHE_NAME = "my-tasks-v1";

const filesToCache = [
    "./",
    "./index.html",
    "./login.html",
    "./register.html",
    "./style.css",
    "./script.js",
    "./login.js",
    "./register.js",
    "./manifest.json",
    "./icons/icon-192.png",
    "./icons/icon-512.png"
];

self.addEventListener("install", function (event) {

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll(filesToCache);
            })
    );

});


self.addEventListener("fetch", function (event) {

    event.respondWith(
        fetch(event.request)
            .catch(function () {
                return caches.match(event.request);
            })
    );

});