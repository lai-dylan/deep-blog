---
title: Linux Kernel Basics
date: 2026-04-06
tags: [Linux, OS]
---

## Linux Kernel Basics

### What is the Kernel?

The **kernel** is the core of Linux. It manages CPU scheduling, memory, devices, files, and network access.

**Core responsibilities:**
- **Process scheduling** - decide which task runs next
- **Memory management** - map virtual memory to RAM
- **System calls** - handle requests from user programs
- **Device drivers** - talk to hardware
- **Security and isolation** - permissions, namespaces, cgroups

### User Space vs Kernel Space

- **User space**: apps like Node.js, browsers, editors
- **Kernel space**: privileged code inside the OS
- **System call**: safe entry point from user space to kernel space

```js
import fs from 'node:fs/promises'

// User-space code asks the kernel to read a file
const text = await fs.readFile('./package.json', 'utf8')
console.log(text.length)
```

#### Why the separation matters

- A crash in user space usually kills one program
- A crash in kernel space can bring down the whole machine
- The kernel must be small, careful, and fast

---

## Processes

### Process Basics

A **process** is a running program with its own memory and resources.

**Process state usually includes:**
- PID
- open files
- memory mappings
- environment variables
- current working directory

#### Form 1: Inspect the current Node.js process

```js
console.log({
  pid: process.pid,
  ppid: process.ppid,
  cwd: process.cwd(),
  platform: process.platform,
  arch: process.arch
})
```

#### Form 2: Run another process

```js
import { spawn } from 'node:child_process'

const child = spawn('node', ['-v'])

child.stdout.on('data', (chunk) => {
  process.stdout.write(chunk)
})
```

### Process Lifecycle

```text
created -> ready -> running -> waiting -> terminated
```

- **ready**: waiting for CPU
- **running**: currently on CPU
- **waiting**: blocked on I/O or another event

### Context Switch

The kernel saves one process state and restores another.

**Saved data includes:**
- registers
- instruction pointer
- stack pointer
- scheduling metadata

**Cost:** context switching is useful, but not free.

### Zombie and Orphan

- **Zombie**: child has exited, parent has not reaped it yet
- **Orphan**: parent exited first, child is adopted by init/systemd

#### Common Gotchas

1. **More processes are not always better** - they consume memory and scheduling overhead
2. **Zombie processes still have entries** - they need parent cleanup
3. **Node.js `spawn` vs `fork`** - use `fork` for Node-to-Node IPC

#### Quick Decision Guide
```typescript
Need isolation? → process
Need shared memory? → thread
Need to run external CLI? → spawn
Need Node IPC? → fork
```

---

## Scheduling

### CPU Scheduling

The scheduler decides which process or thread gets CPU time.

**Goals:**
- fairness
- responsiveness
- throughput
- low latency

### Time Slice

Each task gets a small CPU window before the kernel may switch away.

#### Node.js example: blocking the event loop

```js
setTimeout(() => {
  console.log('timer fired')
}, 0)

const start = Date.now()
while (Date.now() - start < 3000) {
  // busy loop blocks the JS thread
}

console.log('done')
```

### Preemption

Linux can interrupt a running task and give CPU to another one.

#### Why this matters for Node.js

Node.js runs your JavaScript on one main thread. If you do heavy CPU work there, requests wait.

```js
function cpuHeavyTask() {
  let sum = 0
  for (let i = 0; i < 1e9; i++) {
    sum += i
  }
  return sum
}

// Better: move CPU work off the main thread
import { Worker } from 'node:worker_threads'
```

### Offload CPU work

```js
import { Worker } from 'node:worker_threads'

const worker = new Worker(`
  const { parentPort } = require('node:worker_threads')
  let sum = 0
  for (let i = 0; i < 1e8; i++) sum += i
  parentPort.postMessage(sum)
`, { eval: true })

worker.on('message', (result) => {
  console.log('result:', result)
})
```

### Load Average

`load average` shows how many tasks are runnable or waiting on CPU over time.

```bash
uptime
top
```

**Interpretation:**
- high load with high CPU = CPU bound
- high load with low CPU = often I/O wait or blocked tasks

### Common Gotchas

1. **CPU-bound vs I/O-bound** - different bottlenecks need different fixes
2. **Node.js async does not mean parallel CPU** - it mostly means non-blocking I/O
3. **Too many workers can hurt performance** - scheduling overhead adds up

---

## Threads

### Thread Basics

Threads share the same process memory.

**Good for:**
- parallel CPU work
- shared data structures
- lightweight concurrency

**Risk:**
- shared memory bugs
- race conditions
- locking complexity

#### Node.js worker threads

```js
import { Worker } from 'node:worker_threads'

const worker = new Worker(`
  const { parentPort } = require('node:worker_threads')
  parentPort.postMessage({ ok: true })
`, { eval: true })

worker.on('message', (msg) => {
  console.log(msg)
})
```

### Mutex Idea

A mutex ensures only one thread enters a critical section.

```text
lock -> read/update shared state -> unlock
```

Node.js usually avoids shared-memory threading in app code, but native addons and workers may need it.

#### Common Gotchas

1. **Shared state is dangerous** - two threads writing at once can corrupt data
2. **Locks can deadlock** - be careful with lock ordering
3. **Worker threads are not free** - creating many workers has overhead

---

## Memory Management

### Virtual Memory

Each process gets its own virtual address space.

**The kernel maps:**
- virtual addresses
- to physical RAM
- through page tables

**Benefits:**
- isolation
- simpler programming model
- protection

### Stack and Heap

| Stack | Heap |
|------|------|
| Function calls, local values | Dynamic objects and buffers |
| Fast allocation | Flexible size |
| Automatically managed | GC or manual management |

#### Node.js example

```js
function makeUser() {
  const id = 1
  const user = { name: 'Ada', id }
  return user
}
```

### Paging

Linux manages memory in fixed-size pages.

**Why paging helps:**
- only needed pages are loaded
- unused memory can be swapped out
- process memory stays isolated

### Page Fault

A page fault happens when a process accesses memory that is not currently mapped or not present in RAM.

Not all page faults are bad. Many are normal and handled by the kernel.

### Swap

Swap is disk space used when RAM is under pressure.

**Trade-off:**
- prevents immediate out-of-memory issues
- but disk is much slower than RAM

#### Observe memory

```bash
free -h
vmstat 1
top
```

#### Node.js memory usage

```js
console.log(process.memoryUsage())
```

### Buffer Pressure

Node.js Buffers may use memory outside the JS heap.

```js
const chunks = []

for (let i = 0; i < 50; i++) {
  chunks.push(Buffer.alloc(1024 * 1024))
}

console.log(process.memoryUsage())
```

### Garbage Collection

JavaScript memory is reclaimed when objects are no longer reachable.

#### Leak example

```js
const cache = new Map()

function addItem(id, item) {
  cache.set(id, item)
}
```

#### Better pattern

```js
const cache = new Map()

function addItem(id, item) {
  cache.set(id, item)
  if (cache.size > 1000) cache.clear()
}
```

### Common Gotchas

1. **GC does not fix leaks** - it only cleans unreachable objects
2. **Heap growth is not always a leak** - it may be normal caching
3. **Swap is a fallback, not a solution** - if you hit it often, the machine is under memory pressure

#### Quick Decision Guide
```typescript
Need to reduce memory usage? → remove references, shrink caches
Need to inspect current usage? → process.memoryUsage(), free, top
Need large temporary data? → stream it
Need parallel CPU work? → worker_threads, not more heap
```

---

## File Cache

### Page Cache

Linux keeps recently used file data in memory.

**Effect:** repeated reads can be much faster after the first access.

#### Node.js example: repeated reads

```js
import fs from 'node:fs/promises'

const a = await fs.readFile('./large.txt', 'utf8')
const b = await fs.readFile('./large.txt', 'utf8')

console.log(a.length, b.length)
```

### Inode Cache and Dentry Cache

- **inode cache** stores file metadata
- **dentry cache** stores directory lookup results

This is why repeated path lookups can become cheaper over time.

### Stream vs Buffer

**Buffer whole file:** simpler, but uses more memory.
**Stream file:** better for large files and long-running services.

```js
import fs from 'node:fs'

const stream = fs.createReadStream('./big.log', { encoding: 'utf8' })

stream.on('data', (chunk) => {
  process.stdout.write(chunk)
})
```

#### Common Gotchas

1. **Fast second read may be cache, not disk** - the page cache is helping
2. **Large buffers can hurt memory** - use streams for big files
3. **Cache is shared system-wide** - one app can benefit from another app's reads

---

## System Calls

### System Call Path

User program -> syscall -> kernel -> hardware or kernel service.

**Examples:**
- `open`
- `read`
- `write`
- `fork`
- `exec`
- `mmap`

#### Node.js analogy

```js
import fs from 'node:fs/promises'

await fs.writeFile('./hello.txt', 'hello')
```

### Blocking vs Non-blocking I/O

```js
import fs from 'node:fs'

// Blocking
const text = fs.readFileSync('./hello.txt', 'utf8')

// Non-blocking
fs.readFile('./hello.txt', 'utf8', (err, data) => {
  if (err) throw err
  console.log(data)
})
```

### Common Gotchas

1. **Too many syscalls can be expensive** - batch work when possible
2. **Blocking calls freeze the event loop** - avoid sync APIs in servers
3. **Async does not mean parallel** - it means the current thread can keep doing other work

---

## Kernel Observability

### Useful Commands

```bash
ps aux
top
vmstat 1
free -h
cat /proc/meminfo
```

### Per-process view

```bash
ps -o pid,ppid,stat,%cpu,%mem,cmd -p <pid>
```

### Node.js process info

```js
console.log({
  pid: process.pid,
  uptime: process.uptime(),
  rss: process.memoryUsage().rss,
  heapUsed: process.memoryUsage().heapUsed
})
```

### /proc

Linux exposes a lot of kernel and process information through `/proc`.

```bash
cat /proc/loadavg
cat /proc/meminfo
cat /proc/<pid>/status
```

#### Common Gotchas

1. **High CPU is not the only problem** - memory pressure and I/O wait matter too
2. **Always check both system and process level** - a single process may cause the bottleneck
3. **/proc values are live** - they reflect current kernel state

---

## Quick Reference

### When to use what

| Problem | Likely cause | First check |
|---------|--------------|-------------|
| Slow API | CPU bound | top, worker_threads |
| Random crashes | memory leak / OOM | process.memoryUsage(), free -h |
| High load, low CPU | I/O wait | vmstat, iostat |
| Many open files | file descriptor leak | lsof |
| Port already used | stuck process | lsof -i :PORT |

### Mental Model

```text
App
  -> syscall
  -> kernel
  -> scheduler / memory manager / VFS / network stack
  -> hardware
```

### One-line summary

The Linux kernel is the resource manager beneath every app, and understanding scheduling plus memory makes it much easier to debug performance problems.
