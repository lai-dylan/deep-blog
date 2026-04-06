---
title: Browser APIs
date: 2026-04-06
tags: [JavaScript]
---

## Browser APIs

### Storage APIs

#### Form 1: localStorage

Persistent storage (no expiration).

```js
// Store
localStorage.setItem('username', 'john')
localStorage.setItem('settings', JSON.stringify({ theme: 'dark' }))

// Retrieve
const username = localStorage.getItem('username')
const settings = JSON.parse(localStorage.getItem('settings'))

// Remove
localStorage.removeItem('username')
localStorage.clear() // Clear all

// Storage event (other tabs)
window.addEventListener('storage', (e) => {
  console.log(e.key, e.oldValue, e.newValue)
})
```

#### Form 2: sessionStorage

Session-only storage (cleared when tab closes).

```js
sessionStorage.setItem('temp', 'data')
```

#### Form 3: IndexedDB

Structured, transactional database.

```js
const request = indexedDB.open('MyDatabase', 1)

request.onupgradeneeded = (e) => {
  const db = e.target.result
  const store = db.createObjectStore('users', { keyPath: 'id' })
  store.createIndex('name', 'name', { unique: false })
}

request.onsuccess = (e) => {
  const db = e.target.result
  // Use database
}
```

### Network APIs

#### Form 1: Fetch API

Modern HTTP requests.

```js
// GET
fetch('/api/users')
  .then(response => {
    if (!response.ok) throw new Error('Failed')
    return response.json()
  })
  .then(data => console.log(data))

// POST with options
fetch('/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token'
  },
  body: JSON.stringify({ name: 'John' })
})

// async/await
async function getUser(id) {
  const response = await fetch(`/api/users/${id}`)
  if (!response.ok) throw new Error('Not found')
  return response.json()
}
```

#### Form 2: WebSocket

Real-time bidirectional communication.

```js
const ws = new WebSocket('wss://example.com/socket')

ws.onopen = () => {
  console.log('Connected')
  ws.send(JSON.stringify({ type: 'join', room: 'general' }))
}

ws.onmessage = (event) => {
  const data = JSON.parse(event.data)
  console.log('Received:', data)
}

ws.onclose = () => console.log('Disconnected')
ws.onerror = (error) => console.error('Error:', error)

// Close connection
ws.close()
```

### Workers

#### Form 1: Web Workers

Background JavaScript execution.

```js
// main.js
const worker = new Worker('worker.js')

worker.postMessage({ numbers: [1, 2, 3, 4, 5] })

worker.onmessage = (e) => {
  console.log('Result:', e.data.result)
}

// worker.js
self.onmessage = (e) => {
  const { numbers } = e.data
  const sum = numbers.reduce((a, b) => a + b, 0)
  self.postMessage({ result: sum })
}
```

#### Form 2: Service Workers

Proxy for network requests, enables offline/PWA.

```js
// Register
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(reg => console.log('SW registered'))
}

// sw.js
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('v1').then(cache => {
      return cache.addAll([
        '/',
        '/styles.css',
        '/app.js'
      ])
    })
  )
})

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request)
    })
  )
})
```

### Other APIs

#### Form 1: Geolocation

```js
navigator.geolocation.getCurrentPosition(
  (position) => {
    const { latitude, longitude } = position.coords
    console.log(latitude, longitude)
  },
  (error) => console.error(error),
  { enableHighAccuracy: true, timeout: 5000 }
)
```

#### Form 2: Notifications

```js
// Request permission
Notification.requestPermission().then(permission => {
  if (permission === 'granted') {
    new Notification('Hello!', { body: 'You have a message' })
  }
})
```

#### Form 3: File API

```js
const input = document.querySelector('input[type="file"]')

input.addEventListener('change', (e) => {
  const file = e.target.files[0]
  
  const reader = new FileReader()
  reader.onload = (e) => {
    console.log(e.target.result) // File content
  }
  reader.readAsText(file)
})
```

### Common Gotchas

1. **Storage limits**
   - localStorage: ~5-10MB
   - IndexedDB: Much larger, depends on browser

2. **CORS with fetch**
   ```js
   // Fetch to different origin needs CORS headers
   fetch('https://api.example.com/data') // May fail
   ```

3. **Service Worker scope**
   - Can only control pages in its directory or below

#### Quick Decision Guide
```typescript
Need storage?
  └── Simple key-value? → localStorage
  └── Session only? → sessionStorage
  └── Large data / search? → IndexedDB

Network?
  └── HTTP requests? → Fetch API
  └── Real-time? → WebSocket
  └── Background sync? → Service Worker

Heavy computation?
  └── Web Workers
```
