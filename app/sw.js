
const CACHE = 'cache-and-udpate'

const RESOURCES = ['./', '//fonts.googleapis.com/css?family=Athiti']

self.addEventListener('install', (evt)=>{
  console.log('service worker installed')
  evt.waitUntil(precache())
})

self.addEventListener('fetch', (event) =>{
  console.log('fetching url', event.request.url);

  const { url } = event.request

  RESOURCES.includes(url) === false && RESOURCES.push(url)

  event.respondWith(fromCache(event.request))
  event.waitUntil(precache())

})

async function precache(){
   const mainCache = await caches.open(CACHE)
   return mainCache.addAll(RESOURCES)
}

async function fromCache(request){
   const cache = await caches.open(CACHE)
   const matching = await cache.match(request)
  if (matching) {
    return matching
  }else{
    console.log('error', request);
    return Promise.reject('no-match')
  }
}

async function update(request){
   const cache = await caches.open(CACHE)
   const response = await fetch(request)
   return cache.put(request, response)
}

