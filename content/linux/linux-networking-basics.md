---
title: Linux Networking Basics
date: 2026-04-06
tags: [Linux, Networking]
---

## Linux Networking Basics

### What is Networking?

Linux networking is the part of the OS that moves data between machines and processes.

**Core responsibilities:**
- manage IP addresses and routes
- handle TCP and UDP sockets
- resolve domain names
- filter traffic with firewall rules
- expose network interfaces

### Network Stack

```text
Application
  -> Socket API
  -> TCP/UDP
  -> IP
  -> Network Interface
  -> Wire
```

### IP, Port, Socket

- **IP** identifies a machine
- **Port** identifies a service on that machine
- **Socket** is the endpoint made from IP + port + protocol

#### Node.js example: TCP server

```js
import net from 'node:net'

const server = net.createServer((socket) => {
  socket.write('hello from server\n')
  socket.on('data', (data) => {
    console.log('client:', String(data).trim())
  })
})

server.listen(3000, () => {
  console.log('listening on 3000')
})
```

### TCP vs UDP

| TCP | UDP |
|-----|-----|
| Connection-oriented | Connectionless |
| Reliable | Best effort |
| Ordered delivery | No ordering guarantee |
| Slower, safer | Faster, simpler |

#### When to use

- **TCP**: web apps, APIs, SSH, databases
- **UDP**: streaming, games, DNS, low-latency telemetry

### DNS

DNS turns domain names into IP addresses.

```js
import dns from 'node:dns/promises'

const ips = await dns.lookup('example.com', { all: true })
console.log(ips)
```

### HTTP/HTTPS

HTTP runs on top of TCP. HTTPS adds encryption through TLS.

#### Node.js example: HTTP server

```js
import http from 'node:http'

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('ok')
})

server.listen(3000)
```

#### Node.js example: fetch

```js
const response = await fetch('https://example.com')
console.log(response.status)
```

### Common Commands

```bash
ip addr
ip route
ss -tuln
lsof -i :3000
ping google.com
curl -I https://example.com
```

**When to use:** inspect addresses, routes, open ports, connectivity, and HTTP responses.

### Firewall

Firewalls filter traffic in and out of the machine.

```bash
sudo ufw status
sudo ufw allow 3000/tcp
```

### Backpressure

Network writes can be slower than your app expects.

```js
import net from 'node:net'

const socket = net.connect(3000)
const ok = socket.write('large payload')

if (!ok) {
  socket.once('drain', () => {
    console.log('safe to write again')
  })
}
```

### Common Gotchas

1. **Port in use** - another process may already be listening
2. **localhost is local only** - not reachable from other machines by default
3. **Firewall can block traffic** - even if the server is running
4. **DNS failures look like network failures** - check name resolution first

#### Quick Decision Guide
```typescript
Need to talk between machines? → TCP/UDP socket
Need a web API? → HTTP/HTTPS
Need domain to IP? → DNS
Need to inspect open ports? → ss / lsof
Need to debug reachability? → ping / curl
```

---

## Ports and Listening

### Listening Socket

A server listens on a port and accepts incoming connections.

```js
import net from 'node:net'

const server = net.createServer()
server.listen(8080, '0.0.0.0')
```

### Common Ports

| Port | Service |
|------|---------|
| 22 | SSH |
| 80 | HTTP |
| 443 | HTTPS |
| 3000 | Node.js dev servers |

### NAT

NAT lets multiple devices share one public IP.

### Common Gotchas

1. **Binding to 127.0.0.1** means only local access
2. **Binding to 0.0.0.0** means all interfaces
3. **Different environments have different firewalls and NAT rules**

---

## One-line summary

Linux networking is how the OS moves bytes across processes and machines, and the most useful mental model is IP + port + socket + protocol.
