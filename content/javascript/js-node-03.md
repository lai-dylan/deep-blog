---
title: Network and HTTP
date: 2026-04-06
tags: [JavaScript]
---

## Network and HTTP

### HTTP Module

#### Form 1: Create Server

```js
import http from 'http'

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`)
  
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('Hello World\n')
})

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})
```

#### Form 2: Routing

```js
import http from 'http'
import { parse } from 'url'

const server = http.createServer((req, res) => {
  const { pathname } = parse(req.url, true)
  
  if (pathname === '/') {
    res.end('Home')
  } else if (pathname === '/api/users') {
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify([{ id: 1, name: 'John' }]))
  } else {
    res.writeHead(404)
    res.end('Not Found')
  }
})
```

#### Form 3: Handling Request Body

```js
import http from 'http'

const server = http.createServer(async (req, res) => {
  if (req.method === 'POST') {
    let body = ''
    
    for await (const chunk of req) {
      body += chunk
    }
    
    const data = JSON.parse(body)
    console.log('Received:', data)
    
    res.end('Created')
  }
})
```

### Net Module (TCP)

```js
import net from 'net'

// TCP Server
const server = net.createServer((socket) => {
  console.log('Client connected')
  
  socket.on('data', (data) => {
    console.log('Received:', data.toString())
    socket.write('Echo: ' + data)
  })
  
  socket.on('end', () => {
    console.log('Client disconnected')
  })
})

server.listen(8080)

// TCP Client
const client = net.connect(8080, () => {
  client.write('Hello Server')
})

client.on('data', (data) => {
  console.log(data.toString())
  client.end()
})
```

### URL and Query String

```js
import { URL, URLSearchParams } from 'url'

const myURL = new URL('https://example.com:8080/path?name=John&age=30')

console.log(myURL.hostname) // example.com
console.log(myURL.port) // 8080
console.log(myURL.pathname) // /path
console.log(myURL.searchParams.get('name')) // John

// Build URL
const url = new URL('/api/users', 'https://example.com')
url.searchParams.append('page', '1')
console.log(url.toString()) // https://example.com/api/users?page=1
```

### Process and Cluster

```js
import cluster from 'cluster'
import http from 'http'
import os from 'os'

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length
  console.log(`Master ${process.pid} running`)
  
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }
  
  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died`)
    cluster.fork() // Replace dead worker
  })
} else {
  http.createServer((req, res) => {
    res.end('Hello from worker ' + process.pid)
  }).listen(3000)
  
  console.log(`Worker ${process.pid} started`)
}
```

### Common Gotchas

1. **Always set Content-Type**
   ```js
   res.setHeader('Content-Type', 'application/json')
   ```

2. **Handle errors**
   ```js
   server.on('error', (err) => {
     console.error('Server error:', err)
   })
   ```

3. **Don't block the event loop**
   ```js
   // ❌ Synchronous operation blocks all requests
   const data = fs.readFileSync('large.txt')
   
   // ✅ Asynchronous
   const data = await fs.readFile('large.txt')
   ```

#### Quick Decision Guide
```typescript
HTTP server?
  └── Learning/experiment? → http module
  └── Production? → Express, Fastify, or Koa
  └── Real-time? → Socket.io or ws

Scaling?
  └── Multiple CPU cores? → cluster module
  └── Multiple machines? → Load balancer (nginx, etc.)
```
