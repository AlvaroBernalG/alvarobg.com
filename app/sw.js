const CACHE = 'v0.0.9'

const resources = {
  offline: 'offline.html',
  home: [
    '/',
    'http://localhost:8080/',
    'https://alvarobg.com/',
    'https://alvarobg.com',
    'http://127.0.0.1:8080'
  ],
  fonts: ['https://fonts.googleapis.com/css?family=Athiti'],
  css: ['favicon.png']
}

self.addEventListener('install', evt => {
  console.log('service worker installed')

  const offlineURL = new URL(self.location.origin)
  offlineURL.pathname = resources.offline

  evt.waitUntil(
    fetch(offlineURL).then(response => {
      caches.open(CACHE).then(cache => {
        cache.put(resources.offline, response)

        console.log('offline page installed.')
      })
    })
  )
})

self.addEventListener('fetch', event => {
  event.respondWith(
    (async function (evt) {
      const { url } = evt.request

      console.log(`[Fetching] => ${url}`, evt.request)

      const cache = await caches.open(CACHE)

      if (resources.home.includes(url) && navigator.onLine === false) {
        return await cache.match(resources.offline)
      }

      const cachedResponse = await cache.match(evt.request)

      if (cachedResponse) return cachedResponse

      return fetch(evt.request).then(response => {
        cache.put(evt.request, response)
        return response
      })
    })(event)
  )
})
