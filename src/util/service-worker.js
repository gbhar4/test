/**
 * @author Michael Citro (WIP)
 * @summary This is the main service worker for our site. Currently we are only going to use this for local caching. In the future if we expand
 *          service works for site notifications or other features we can segment out service workers into their own files.
 */

/**
 * On install caching the application shell
 *  We can cache the HTML, CSS, JS, and any static files that make up the application shell in the install event of the service worker:
 */
self.addEventListener('install', function (event) {
  event.waitUntil(
      caches.open('tcp-static').then(function (cache) {
        return cache.addAll(
          [
            '/wcsstore/static/js/app.js'
          ]
            );
      })
    );
});

/**
 * On network response
 *  If a request doesn't match anything in the cache, get it from the network, send it to the page and add it to the cache at the same time.
 */
self.addEventListener('fetch', function (event) {
  console.log(event);
  event.respondWith(
        caches.open('tcp-static').then(function (cache) {
          return cache.match(event.request).then(function (response) {
            return response || fetch(event.request).then(function (response) {
              cache.put(event.request, response.clone());
              return response;
            });
          });
        })
    );
});

/**
 * Removing outdated caches
 *  Once a new service worker has installed and a previous version isn't being used, the new one activates, and you get an activate event.
 *  Because the old version is out of the way, it's a good time to delete unused caches.
 */

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.filter(function (cacheName) {
                    // Return true if you want to remove this cache,
                    // but remember that caches are shared across
                    // the whole origin
                }).map(function (cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});
