const CACHE = 'v1'

const RESOURCES = [ 
  'http://127.0.0.1:8080/',
  '/index.html', 
  '/favicon.png', 
  '//fonts.googleapis.com/css?family=Athiti',
  'https://fonts.gstatic.com/s/athiti/v2/pe0vMISdLIZIv1wICxJXKNWyAw.woff2'
]

self.addEventListener('install', (evt) => {
  console.log('service worker installed')
})

self.addEventListener('fetch', async (event) => {

  console.log('[Fetching] => ', event.request.url);

  event.respondWith(caches.match(event.request).then((response) => {

    if (response !== undefined) return response

    return fetch(event.request).then(response => {

      const responseClose = response.clone()

      caches.open(CACHE).then( cache => {
        cache.put(event.request, responseClose)
      })

      return response

    }).catch(console.log)

  }))

})

