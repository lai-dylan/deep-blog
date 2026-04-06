---
title: Operating System Basics
date: 2026-04-06
tags: [Linux, OS]
---

## Operating System Basics

### What is an OS?

An **operating system (OS)** is the software layer between applications and hardware. It manages CPU, memory, disks, network, and devices so programs can run safely and efficiently.

**Core responsibilities:**
- **Process management** - start, schedule, and stop programs
- **Memory management** - allocate RAM and isolate processes
- **File system management** - organize and protect files
- **Device management** - talk to keyboard, disk, network, etc.
- **Security** - users, permissions, and isolation

#### OS vs Application

| OS | Application |
|----|-------------|
| Manages hardware | Uses hardware through OS APIs |
| Runs in kernel/user space | Runs in user space |
| Controls scheduling and memory | Requests resources |
| Must be stable and secure | Can be restarted freely |

#### User Space vs Kernel Space

- **User space**: where normal programs run, like Node.js, browsers, editors
- **Kernel space**: privileged part of the OS, controls hardware and resources
- **System call**: the bridge from user space into the kernel

```js
// Node.js is a user-space program.
// It asks the OS for services through APIs like fs, net, child_process.
import fs from 'node:fs/promises'

const text = await fs.readFile('./package.json', 'utf8')
console.log(text.length)
```

---

## Processes & Threads

### Process

A **process** is a running program with its own memory and resources.

**Core behavior:**
- Has its own address space
- Can own files, sockets, and environment variables
- Is isolated from other processes
- May contain one or more threads

#### Form 1: View the current process - `process`

When to use: Inspect the running Node.js process.

```js
console.log(process.pid)
console.log(process.platform)
console.log(process.memoryUsage())
console.log(process.cwd())
```

#### Form 2: Spawn a child process - `child_process`

When to use: Run another program from Node.js.

```js
import { spawn } from 'node:child_process'

const child = spawn('node', ['-v'])

child.stdout.on('data', (chunk) => {
  console.log(String(chunk))
})
```

#### Form 3: Create a separate process - `fork`

When to use: Offload work to another Node.js process.

```js
import { fork } from 'node:child_process'

const child = fork('./worker.js')

child.send({ task: 'build' })
child.on('message', (msg) => {
  console.log('child says:', msg)
})
```

#### Thread

A **thread** is the execution unit inside a process.

**Core behavior:**
- Threads share the same process memory
- Cheaper than processes
- Need synchronization when sharing data

#### Form 4: CPU work in parallel - `worker_threads`

When to use: CPU-heavy work that would block the event loop.

```js
import { Worker } from 'node:worker_threads'

const worker = new Worker(`
  const { parentPort } = require('node:worker_threads')
  parentPort.postMessage('done')
`, { eval: true })

worker.on('message', (msg) => {
  console.log(msg)
})
```

#### Common Gotchas

1. **Process != thread** - processes isolate memory, threads share it
2. **Node.js main thread** - CPU-heavy loops block requests unless offloaded
3. **More workers is not always better** - too many threads add overhead

#### Quick Decision Guide
```typescript
Need isolation? → process
Need shared memory? → thread
Need CPU parallelism in Node.js? → worker_threads
Need to run a CLI tool? → child_process
```

---

## Scheduling

### CPU Scheduling

The OS decides which process gets CPU time next.

**Goals:**
- Fairness
- Responsiveness
- Throughput
- Low latency

#### Preemptive vs Cooperative

| Type | Meaning | Example |
|------|---------|---------|
| Preemptive | OS can interrupt a running task | Modern Linux scheduling |
| Cooperative | Task must yield on its own | Some single-threaded runtimes |

#### Node.js analogy

Node.js is single-threaded for JavaScript execution, so long tasks block other work.

```js
// Bad: blocks the event loop
function blockCpu() {
  const start = Date.now()
  while (Date.now() - start < 3000) {}
}

setTimeout(() => console.log('timer fired'), 0)
blockCpu()
console.log('done')

// Timer is delayed because the event loop was blocked
```

#### Fix blocking work

```js
// Split work into small chunks
function processInChunks(items, chunkSize = 1000) {
  let index = 0

  function nextChunk() {
    const end = Math.min(index + chunkSize, items.length)
    for (; index < end; index++) {
      doWork(items[index])
    }

    if (index < items.length) {
      setImmediate(nextChunk)
    }
  }

  nextChunk()
}
```

### Context Switching

The OS saves one task's state and restores another's.

**What gets saved:**
- CPU registers
- Program counter
- Stack state
- Scheduling info

**Cost:** context switches are necessary, but not free.

---

## Memory

### Virtual Memory

Each process sees its own virtual address space. The OS maps that space to physical RAM.

**Why it matters:**
- Process isolation
- Easier programming model
- Memory overcommit and paging

#### Form 1: Inspect memory usage - `process.memoryUsage()`

```js
console.log(process.memoryUsage())
// {
//   rss, heapTotal, heapUsed, external, arrayBuffers
// }
```

#### Form 2: Allocate memory in chunks

```js
const buffers = []

for (let i = 0; i < 100; i++) {
  buffers.push(Buffer.alloc(1024 * 1024))
}

console.log(process.memoryUsage())
```

### Stack vs Heap

| Stack | Heap |
|------|------|
| Small, fast | Larger, flexible |
| Function calls, local values | Objects, buffers, dynamic data |
| Auto-managed | GC-managed in JS |

#### Node.js example

```js
function demo() {
  const count = 1 // stack-like local value
  const user = { name: 'Ada' } // object on heap
  return { count, user }
}
```

### Garbage Collection

JavaScript memory is reclaimed automatically when objects are no longer reachable.

**Common leak sources:**
- Global caches that never shrink
- Event listeners not removed
- Timers left running
- Large arrays retained by closures

#### Leak example

```js
const cache = new Map()

export function saveUser(id, user) {
  cache.set(id, user) // never cleared = grows forever
}
```

#### Better pattern

```js
const cache = new Map()

export function saveUser(id, user) {
  cache.set(id, user)
  if (cache.size > 1000) {
    cache.clear()
  }
}
```

#### Common Gotchas

1. **Memory leak != high memory only** - stale references keep data alive
2. **GC is automatic, not magic** - you still need to release references
3. **Buffer and native memory** - not everything lives in JS heap

#### Quick Decision Guide
```typescript
Need per-process isolation? → virtual memory
Need fast temporary values? → stack-style local values
Need large dynamic data? → heap
Need to avoid leaks? → release references and timers
```

---

## File System

### File Descriptor

A **file descriptor** is a small integer used by the OS to represent an open file, socket, or pipe.

**Examples:**
- `0` stdin
- `1` stdout
- `2` stderr

```js
process.stdin.on('data', (chunk) => {
  process.stdout.write(`input: ${chunk}`)
})
```

### Inode

An **inode** stores metadata about a file: owner, permissions, timestamps, and where the data lives.

**Important:** file name is separate from file data. Multiple names can point to the same inode.

### Path and File APIs

#### Form 1: Read a file - `fs/promises`

```js
import fs from 'node:fs/promises'

const text = await fs.readFile('./notes.txt', 'utf8')
console.log(text)
```

#### Form 2: Watch a file - `fs.watch`

```js
import fs from 'node:fs'

const watcher = fs.watch('./notes.txt', (eventType) => {
  console.log('changed:', eventType)
})

// watcher.close()
```

#### Form 3: Stream large files - `createReadStream`

```js
import fs from 'node:fs'

const stream = fs.createReadStream('./large.log', { encoding: 'utf8' })

stream.on('data', (chunk) => {
  console.log(chunk)
})
```

### Links

| Type | Meaning |
|------|---------|
| Hard link | Another name for the same inode |
| Symbolic link | A path that points to another path |

```js
import fs from 'node:fs/promises'

await fs.symlink('./target.txt', './link.txt')
```

#### Common Gotchas

1. **Deleting a file name does not always delete the data** - hard links can keep the inode alive
2. **Watching files is platform-dependent** - behavior differs across OSes
3. **Use streams for big files** - avoid reading huge files into memory

---

## I/O

### Blocking vs Non-blocking

The OS can handle I/O in a blocking or asynchronous way.

**Blocking I/O:** caller waits until operation finishes.
**Non-blocking I/O:** caller continues, gets notified later.

#### Node.js example

```js
import fs from 'node:fs'

// Blocking
const text = fs.readFileSync('./data.txt', 'utf8')
console.log(text)

// Non-blocking
fs.readFile('./data.txt', 'utf8', (err, data) => {
  if (err) throw err
  console.log(data)
})
```

### Event Loop

Node.js uses an **event loop** to handle asynchronous I/O efficiently.

**Core idea:**
- JS runs on one main thread
- I/O happens outside the JS thread
- callbacks run when work completes

#### Event loop example

```js
console.log('A')

setTimeout(() => console.log('B'), 0)

Promise.resolve().then(() => console.log('C'))

console.log('D')

// Output: A D C B
```

### Pipes and Redirects

The OS lets processes communicate through stdin/stdout/stderr.

```js
import { spawn } from 'node:child_process'

const grep = spawn('grep', ['node'])

process.stdin.pipe(grep.stdin)
grep.stdout.pipe(process.stdout)
```

#### Common Gotchas

1. **I/O is often the bottleneck** - not CPU
2. **Async does not mean parallel CPU work** - just non-blocking waiting
3. **Streams beat buffers for large data**

#### Quick Decision Guide
```typescript
Need to wait for disk/network? → async I/O
Need to process huge data? → streams
Need CPU parallelism? → worker_threads or processes
Need simplest code and file is small? → readFile
```

---

## Networking

### Socket

A **socket** is an endpoint for network communication.

**Core behavior:**
- Identified by IP + port
- Can be TCP or UDP
- Managed by the kernel

#### Form 1: TCP server - `net`

```js
import net from 'node:net'

const server = net.createServer((socket) => {
  socket.write('hello\n')
  socket.on('data', (data) => {
    console.log('client:', String(data))
  })
})

server.listen(3000)
```

#### Form 2: Inspect open ports

```bash
lsof -i :3000
```

#### Form 3: HTTP server - `http`

```js
import http from 'node:http'

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('ok')
})

server.listen(3000)
```

### Common Gotchas

1. **Ports can be busy** - another process may already be using the port
2. **Socket lifetime matters** - close connections when done
3. **Backpressure** - network writes can be slower than your app expects

---

## User & Permissions

### Users and Groups

Linux uses users and groups to control access.

**Common ideas:**
- Each process runs as a user
- Files have an owner and group
- Permissions decide who can read/write/execute

#### Node.js example: see user info

```js
console.log(process.getuid?.())
console.log(process.getgid?.())
```

### Permissions

| Bit | Meaning |
|-----|---------|
| r | read |
| w | write |
| x | execute |

```bash
ls -l
chmod 755 script.sh
```

### Root

The root user has broad system privileges.

**Rule:** avoid running apps as root unless you must.

#### Common Gotchas

1. **Permission denied** often means user/group mismatch
2. **Root can damage the system fast** - use carefully
3. **Least privilege** is the safer default

---

## System Calls

### System Call

A **system call** is how a user-space program asks the kernel to do privileged work.

**Examples:**
- open a file
- create a process
- allocate memory
- send network data

#### Node.js analogy

```js
import fs from 'node:fs/promises'

// JS calls fs API, which calls into the OS kernel
await fs.writeFile('./hello.txt', 'hello')
```

### Interrupts

An **interrupt** is a signal that tells the CPU something needs attention.

**Examples:**
- keyboard input
- network packet arrives
- timer expires

The kernel handles interrupts, then resumes work.

### Common Gotchas

1. **System call is not the same as a library call** - the call crosses into the kernel
2. **Interrupts are asynchronous** - they can happen while other work is running
3. **Too many system calls** can hurt performance

---

## Observability

### Inspecting a Running System

#### Useful commands

```bash
ps aux
top
free -h
df -h
uptime
```

#### Node.js process info

```js
console.log({
  pid: process.pid,
  uptime: process.uptime(),
  rss: process.memoryUsage().rss,
  cpu: process.cpuUsage()
})
```

### Logs

Logs are usually the first place to debug OS or app issues.

```bash
tail -f /var/log/syslog
journalctl -f
```

#### Common Gotchas

1. **Symptoms can be misleading** - high CPU might be GC, busy loop, or I/O wait
2. **Check process and system together** - one app can affect the whole machine
3. **Logs + metrics + command line** give the full picture

---

## Quick Reference

### What to use when

| Problem | Best tool |
|---------|-----------|
| CPU-heavy work in Node.js | `worker_threads` |
| Running another program | `child_process` |
| Large file read | streams |
| Simple file read | `fs/promises` |
| Shared state across app parts | process + message passing |
| Need OS-level isolation | separate process |

### Mental Model

```typescript
App
  └── asks OS for services
        ├── CPU scheduling
        ├── memory allocation
        ├── files and disks
        ├── network sockets
        └── security and permissions
```

### One-line summary

The OS is the traffic controller for hardware, and Node.js is one of the programs that relies on it for files, processes, memory, and network I/O.
