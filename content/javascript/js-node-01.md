---
title: Node.js Basics
date: 2026-04-06
tags: [JavaScript]
---

## Node.js Basics

### What is Node.js?

**Node.js** is a JavaScript runtime built on Chrome's V8 engine, enabling server-side JavaScript execution.

### Architecture

```
JavaScript Code
     ↓
   V8 Engine
     ↓
   libuv (async I/O)
     ↓
Operating System
```

**Key features:**
- Event-driven, non-blocking I/O
- Single-threaded with event loop
- Built-in modules (fs, http, path, etc.)
- npm package ecosystem

### Global Objects

```js
// Unlike browser window, Node has global
global.myVar = 'accessible everywhere'

// process - current process info
console.log(process.pid)
console.log(process.platform)
console.log(process.env.NODE_ENV)

// Buffer - binary data handling
const buf = Buffer.from('Hello')
console.log(buf.toString())

// __dirname - current directory
console.log(__dirname)

// __filename - current file path
console.log(__filename)
```

### Module System

#### CommonJS (Default)

```js
// Export
module.exports = { add, subtract }
exports.multiply = multiply

// Import
const math = require('./math')
const { add } = require('./math')
```

#### ES Modules

```json
// package.json
{
  "type": "module"
}
```

```js
// Export
export function add(a, b) { return a + b }
export default class Calculator {}

// Import
import { add } from './math.js'
import Calculator from './calc.js'
```

### EventEmitter

```js
import EventEmitter from 'events'

const emitter = new EventEmitter()

// Subscribe
emitter.on('message', (data) => {
  console.log('Received:', data)
})

// Emit
emitter.emit('message', 'Hello World')

// Once
emitter.once('connect', () => {
  console.log('Connected (only once)')
})
```

### Path Module

```js
import path from 'path'

// Join paths
const fullPath = path.join(__dirname, 'files', 'data.txt')

// Resolve (absolute path)
const absolute = path.resolve('files', 'data.txt')

// Parse path
const parsed = path.parse('/home/user/file.txt')
// { root: '/', dir: '/home/user', base: 'file.txt', ext: '.txt', name: 'file' }

// Check if absolute
console.log(path.isAbsolute('/usr/bin')) // true
```

### Common Gotchas

1. **File extensions in ESM**
   ```js
   import { add } from './math.js' // .js required in ESM
   ```

2. **__dirname not available in ESM**
   ```js
   import { fileURLToPath } from 'url'
   import { dirname } from 'path'
   
   const __filename = fileURLToPath(import.meta.url)
   const __dirname = dirname(__filename)
   ```

3. **Synchronous vs Asynchronous**
   ```js
   // ❌ Blocks event loop
   const data = fs.readFileSync('large.txt')
   
   // ✅ Non-blocking
   const data = await fs.readFile('large.txt')
   ```

#### Quick Decision Guide
```typescript
Node.js version?
  └── New project? → Use ESM (type: module)
  └── Legacy? → CommonJS
  └── Mixed? → .mjs for ESM, .cjs for CJS

Module choice?
  └── Built-in first
  └── Small footprint? → native modules
  └── Full featured? → popular libraries (express, lodash, etc.)
```
