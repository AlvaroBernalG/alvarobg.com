const CACHE = 'v0.3.0'

const resources = {
  offline: ['offline.html', '/images/favicon_offline.png'],
  home: [
    '/',
    'http://localhost:8080/',
    'https://alvarobg.com/',
    'https://alvarobg.com',
    'http://127.0.0.1:8080'
  ]
}

self.addEventListener('install', evt => {
  console.log('service worker installed')

  const offlineRequests = resources.offline.map(resource => {
    const offlineURL = new Request(resource)
    return offlineURL
  })

  console.log('Offline resources urls ', offlineRequests)

  evt.waitUntil(
    Promise.all(
      offlineRequests.map(offlineRequest =>
        fetch(offlineRequest).then(async response => {
          const cache = await caches.open(CACHE)
          await cache.put(offlineRequest, response)
          console.log('offline page installed.')
          return response
        })
      )
    )
  )
})

self.addEventListener('fetch', event => {
  if (event.request.url.match('chrome-extension://')) {
    console.log(
      'cancelling the fetch of teh followign resource',
      event.request.url
    )

    return
  }
  event.respondWith(
    (async function (evt) {
      const { url } = evt.request

      console.log(`[Fetching] => ${url}`, evt.request)

      const cache = await caches.open(CACHE)

      if (resources.home.includes(url) && navigator.onLine === false) {
        return await cache.match('offline.html')
      }

      const cachedResponse = await cache.match(evt.request)

      if (cachedResponse) return cachedResponse

      return fetch(evt.request)
        .then(response => {
          cache.put(evt.request, response)
          return response
        })
        .catch(console.log)
    })(event)
  )
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(async dbs => {
      dbs.forEach(db => {
        if (db !== CACHE) caches.delete(db)
      })
    })
  )
})
