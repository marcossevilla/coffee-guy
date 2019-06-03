const staticCacheName = 'site-static-v3';
const dynamicCacheName = 'site-dynamic-v3';

const assets = [
    '/',
    '/index.html',
    '/js/app.js',
    '/js/ui.js',
    '/js/materialize.min.js',
    '/css/styles.css',
    '/css/materialize.min.css',
    '/img/coffee.png',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
    '/pages/fallback.html'
];

// cache limit
const limitCacheSize = (name, size) => {
    caches.open(name).then(cache => {
        cache.keys().then(keys => {
            if (keys.length > size) {
                cache.delete(keys[0]).then(limitCacheSize(name, size));
            }
        })
    })

};

// installation of SW
self.addEventListener('install', evt => {
    // console.log('service worker has been installed :D ' + evt);

    evt.waitUntil(
        caches.open(staticCacheName).then(cache => {
            console.log('caching shell assets... ');
            cache.addAll(assets);
        })
    );

});

// event activation
self.addEventListener('activate', evt => {
    // console.log('service worker has been activated :D ' + evt);

    evt.waitUntil(
        caches.keys().then(keys => {
            console.log(keys);

            return Promise.all(keys
                .filter(key => key !== staticCacheName && key !== dynamicCacheName)
                .map(key => caches.delete(key)))
        })
    );
});

// the fetch event
self.addEventListener('fetch', evt => {
    console.log('fetch event ' + evt);

    if (evt.request.url.indexOf('firestore.googleapis.com') === -1) {
        evt.respondWith(
            caches.match(evt.request).then(cacheRes => {
                return cacheRes || fetch(evt.request).then(fetchRes => {
                    return caches.open(dynamicCacheName).then(cache => {
                        cache.put(evt.request.url, fetchRes.clone());
                        // check cached items size
                        limitCacheSize(dynamicCacheName, 15);
                        return fetchRes;
                    })
                });
            }).catch(() => {
                if (evt.request.url.indexOf('.html') > -1) {
                    return caches.match('/pages/fallback.html');
                }
            })
        );
    }
});