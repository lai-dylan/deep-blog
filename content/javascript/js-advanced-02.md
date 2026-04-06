---
title: Memory Management
date: 2026-04-06
tags: [JavaScript]
---

## Memory Management

### Memory Lifecycle

```
Allocate → Use → Release (garbage collection)
```

JavaScript automatically manages memory through **garbage collection**.

### Garbage Collection

V8 uses **generational garbage collection**:

- **New Space**: Short-lived objects (small, fast GC)
- **Old Space**: Long-lived objects (full GC, less frequent)

#### Mark-and-Sweep

1. **Mark**: Traverse from roots, mark reachable objects
2. **Sweep**: Remove unmarked objects
3. **Compact**: Move objects to reduce fragmentation

### Memory Leaks

Common causes:

#### Form 1: Global Variables

```js
// ❌ Accidental global
function leak() {
  data = 'I am global' // No var/let/const
}

// ✅ Strict mode prevents this
'use strict'
```

#### Form 2: Event Listeners

```js
// ❌ Not removed
class Component {
  constructor() {
    window.addEventListener('resize', this.handleResize)
  }
}

// ✅ Clean up
class Component {
  constructor() {
    this.handleResize = this.handleResize.bind(this)
    window.addEventListener('resize', this.handleResize)
  }
  
  destroy() {
    window.removeEventListener('resize', this.handleResize)
  }
}
```

#### Form 3: Closures

```js
// ❌ Large array retained
function createLeak() {
  const bigData = new Array(1000000).fill('data')
  
  return function() {
    // Only uses small part but keeps all in closure
    console.log(bigData[0])
  }
}

// ✅ Only capture what's needed
function noLeak() {
  const bigData = new Array(1000000).fill('data')
  const first = bigData[0]
  
  return function() {
    console.log(first)
  }
}
```

#### Form 4: Timers

```js
// ❌ Interval keeps running
setInterval(() => {
  console.log('Still running')
}, 1000)

// ✅ Clear when done
const id = setInterval(() => { }, 1000)
clearInterval(id)
```

#### Form 5: DOM References

```js
// ❌ Detached DOM tree
const elements = []

function addElement() {
  const div = document.createElement('div')
  document.body.appendChild(div)
  elements.push(div) // Keeps reference even after removed
}

// ✅ Clean up references
function removeElement(index) {
  const div = elements[index]
  div.remove()
  elements.splice(index, 1) // Remove reference
}
```

### Memory Profiling

```js
// Check memory usage
console.log(process.memoryUsage())
// {
//   rss: 21504000,      // Resident set size
//   heapTotal: 7159808, // Total heap size
//   heapUsed: 4458376,  // Used heap
//   external: 823248    // External memory
// }
```

**Chrome DevTools:**
1. Performance tab → Memory
2. Heap snapshots
3. Allocation timeline
4. Detached DOM node detection

### WeakMap and WeakSet

Allow garbage collection of keys.

```js
// ❌ Prevents garbage collection
const cache = new Map()
const obj = { id: 1 }
cache.set(obj, 'data')
// obj cannot be garbage collected even if unused

// ✅ WeakMap allows GC
const weakCache = new WeakMap()
const obj2 = { id: 2 }
weakCache.set(obj2, 'data')
// obj2 can be garbage collected when no other references
```

**Use cases:**
- Private data for objects
- Metadata without preventing GC
- Caching without memory leaks

### Common Gotchas

1. **Console logging**
   ```js
   // Console keeps reference to logged objects
   console.log(bigObject) // May prevent GC
   ```

2. **Profiling in production**
   ```js
   // Don't expose heap snapshots in production
   // Contains sensitive data
   ```

3. **Memory growth is not always a leak**
   ```js
   // May be normal caching
   // Check if memory stabilizes or keeps growing
   ```

#### Quick Decision Guide
```typescript
Prevent memory leaks?
  └── Clean up event listeners
  └── Clear timers/intervals
  └── Remove DOM references
  └── Use WeakMap/WeakSet for metadata

Profile memory?
  └── Chrome DevTools Memory tab
  └── Heap snapshots
  └── Allocation instrumentation
  └── Watch for detached DOM nodes
```
