---
title: Linux Debugging Basics
date: 2026-04-06
tags: [Linux, Debugging]
---

## Linux Debugging Basics

### What are we debugging?

Most Linux problems fall into a few buckets:

- CPU is high
- memory is high
- disk is full or slow
- network is failing
- process is crashing

### First Checks

```bash
uptime
top
free -h
df -h
ps aux
```

### Process Debugging

#### Find a process

```bash
ps aux | grep node
pgrep -af node
lsof -i :3000
```

#### Node.js example: process info

```js
console.log({
  pid: process.pid,
  memory: process.memoryUsage(),
  cpu: process.cpuUsage(),
  uptime: process.uptime()
})
```

### Logs

Logs are usually the fastest way to find what failed.

```bash
tail -f app.log
journalctl -f
```

#### Node.js example: write logs

```js
console.log('info: server started')
console.error('error: request failed')
```

### CPU Debugging

If CPU is high, look for:
- busy loops
- expensive JSON work
- large sorts or filters
- too many concurrent tasks

```js
function blockCpu() {
  let sum = 0
  for (let i = 0; i < 1e9; i++) sum += i
  return sum
}
```

#### Fix with worker thread

```js
import { Worker } from 'node:worker_threads'

const worker = new Worker(`
  const { parentPort } = require('node:worker_threads')
  parentPort.postMessage('done')
`, { eval: true })
```

### Memory Debugging

If memory is high, look for:
- large caches
- growing arrays
- retained timers
- event listeners not removed

#### Node.js example: inspect memory

```js
console.log(process.memoryUsage())
```

#### Leak example

```js
const cache = []

function add(item) {
  cache.push(item) // grows forever
}
```

### Disk Debugging

```bash
df -h
du -sh *
```

#### Common causes

- logs growing too fast
- tmp files not cleaned
- cache directories too large

### Network Debugging

```bash
ss -tuln
curl -I https://example.com
ping google.com
```

#### Node.js example: simple request

```js
const res = await fetch('https://example.com')
console.log(res.status)
```

### File Descriptor Issues

Too many open files can break servers.

```bash
lsof -p <pid>
```

### Useful /proc Checks

```bash
cat /proc/loadavg
cat /proc/meminfo
cat /proc/<pid>/status
```

### Reading Stack Traces

Look for:
- the first app frame
- the failing line
- repeated calls indicating recursion or loops

### Common Debugging Flow

1. identify the symptom
2. check system health
3. inspect the process
4. read logs
5. reproduce with the smallest example

### Common Gotchas

1. **High load is not always CPU** - could be I/O wait
2. **Low memory does not always mean leak** - caches can be valid
3. **Logs may be incomplete** - inspect the process and the OS too
4. **Restarting can hide the cause** - check root cause first

#### Quick Decision Guide
```typescript
App slow? → top + logs + CPU profile
App crashes? → logs + memory usage + stack trace
Port busy? → lsof -i :PORT
Disk full? → df -h + du -sh
Network issue? → ss + curl + ping
```

---

## Debug Checklist

```text
1. What changed?
2. What is the symptom?
3. Is it CPU, memory, disk, or network?
4. Which process owns the problem?
5. What is the smallest reproducible case?
```

### One-line summary

Good Linux debugging is mostly disciplined observation: check the system, inspect the process, read the logs, and narrow the problem down step by step.
