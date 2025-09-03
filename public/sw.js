// Service Worker for WeddingLK
console.log('🎉 Service Worker script loaded successfully!')
console.log('🔧 Service Worker version: 2.0 - Enhanced with proper event listeners')

const CACHE_NAME = 'weddinglk-v1'
const STATIC_CACHE = 'weddinglk-static-v1'
const DYNAMIC_CACHE = 'weddinglk-dynamic-v1'

// Static assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico'
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Install event triggered')
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static assets')
        // Cache assets one by one to avoid blocking
        return Promise.all(
          STATIC_ASSETS.map(asset => 
            cache.add(asset).catch(err => {
              console.warn(`Service Worker: Failed to cache ${asset}:`, err)
              return null
            })
          )
        )
      })
      .then(() => {
        console.log('Service Worker: Installation complete, skipping waiting')
        return self.skipWaiting()
      })
      .catch(err => {
        console.error('Service Worker: Installation failed:', err)
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activate event triggered')
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        console.log('Service Worker: Found caches:', cacheNames)
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('Service Worker: Activation complete, claiming clients')
        return self.clients.claim()
      })
      .catch(err => {
        console.error('Service Worker: Activation failed:', err)
      })
  )
})

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  console.log('Service Worker: Fetch event for:', url.pathname)

  // Skip non-GET requests and non-HTTP requests
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    console.log('Service Worker: Skipping non-GET or non-HTTP request')
    return
  }

  // Only handle same-origin requests to avoid CORS issues
  if (url.origin !== location.origin) {
    console.log('Service Worker: Skipping cross-origin request')
    return
  }

  // Handle different types of requests
  if (url.pathname.startsWith('/_next/static/') || url.pathname.startsWith('/static/')) {
    // Static assets - cache first strategy
    console.log('Service Worker: Using cache-first strategy for static asset')
    event.respondWith(cacheFirst(request, STATIC_CACHE))
  } else if (url.pathname.startsWith('/api/')) {
    // API requests - network first strategy
    console.log('Service Worker: Using network-first strategy for API request')
    event.respondWith(networkFirst(request, DYNAMIC_CACHE))
  } else {
    // Page requests - network first strategy
    console.log('Service Worker: Using network-first strategy for page request')
    event.respondWith(networkFirst(request, DYNAMIC_CACHE))
  }
})

// Cache first strategy for static assets
async function cacheFirst(request, cacheName) {
  console.log('Service Worker: Cache-first strategy for:', request.url)
  const cachedResponse = await caches.match(request)
  if (cachedResponse) {
    console.log('Service Worker: Serving from cache:', request.url)
    return cachedResponse
  }

  try {
    console.log('Service Worker: Fetching from network:', request.url)
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, networkResponse.clone())
      console.log('Service Worker: Cached response for:', request.url)
    }
    return networkResponse
  } catch (error) {
    console.error('Service Worker: Cache first strategy failed:', error)
    // Return offline page for navigation requests
    if (request.destination === 'document') {
      return caches.match('/offline')
    }
    throw error
  }
}

// Network first strategy for dynamic content
async function networkFirst(request, cacheName) {
  console.log('Service Worker: Network-first strategy for:', request.url)
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, networkResponse.clone())
      console.log('Service Worker: Cached network response for:', request.url)
    }
    return networkResponse
  } catch (error) {
    console.log('Service Worker: Network failed, trying cache for:', request.url)
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      console.log('Service Worker: Serving from cache fallback:', request.url)
      return cachedResponse
    }
    
    console.error('Service Worker: Network first strategy failed:', error)
    // Return offline page for navigation requests
    if (request.destination === 'document') {
      return caches.match('/offline')
    }
    throw error
  }
}

// Message event for communication with main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker: Received message:', event.data)
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync event:', event.tag)
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  // Implement background sync logic here
  // e.g., sync offline form submissions, sync offline data
  console.log('Background sync triggered')
}

// Push notification handling
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New notification from WeddingLK',
    icon: '/placeholder-logo.png',
    badge: '/placeholder-logo.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View',
        icon: '/placeholder-logo.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/placeholder-logo.png'
      }
    ]
  }

  event.waitUntil(
    self.registration.showNotification('WeddingLK', options)
  )
})

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    )
  }
}) 