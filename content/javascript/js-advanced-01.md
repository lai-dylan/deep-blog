---
title: V8 Engine and Performance
date: 2026-04-06
tags: [JavaScript]
---

## V8 Engine and Performance

### What is V8?

**V8** is Google's open-source JavaScript engine, used in Chrome and Node.js. It compiles JavaScript to native machine code for fast execution.

### How V8 Works

```
Source Code
    ↓
Parser → AST (Abstract Syntax Tree)
    ↓
Ignition (Bytecode interpreter)
    ↓
TurboFan (Optimizing compiler) → Machine Code
```

### Compilation Pipeline

1. **Parsing**: Source → AST
2. **Ignition**: AST → Bytecode (fast startup)
3. **TurboFan**: Hot code → Optimized machine code

### Hidden Classes

V8 creates hidden classes for object shapes.

```js
// Same shape → same hidden class
const obj1 = { x: 1, y: 2 }
const obj2 = { x: 3, y: 4 } // Same hidden class

// Different shape → different hidden class
const obj3 = { x: 1 } // Different hidden class
const obj4 = { y: 2 } // Different hidden class

// Monomorphic (fast)
function getX(obj) {
  return obj.x // One hidden class
}

// Polymorphic (slower)
// Called with many different shapes
```

### Inline Caching

V8 caches property lookup results.

```js
function getName(user) {
  return user.name // Cached after first call
}

const user1 = { name: 'John' }
const user2 = { name: 'Jane' }

getName(user1) // Cache miss, then cached
getName(user2) // Cache hit (same hidden class)
```

### Optimization Tips

#### Form 1: Object Shape Consistency

```js
// ✅ Good: Consistent property order
function Point(x, y) {
  this.x = x
  this.y = y
}

// ❌ Bad: Different property orders
const obj1 = { x: 1, y: 2 }
const obj2 = { y: 3, x: 4 } // Different shape
```

#### Form 2: Avoid Hidden Class Changes

```js
// ❌ Bad: Adding properties later
const user = { name: 'John' }
user.age = 30 // Changes hidden class
user.email = 'john@example.com' // Changes again

// ✅ Good: Define all upfront
const user = {
  name: 'John',
  age: 30,
  email: 'john@example.com'
}
```

#### Form 3: Type Stability

```js
// ❌ Bad: Type changes cause deoptimization
function add(x, y) {
  return x + y // First numbers, then strings
}

add(1, 2) // Optimized for numbers
add('a', 'b') // Deoptimized! Different types
```

### Performance Profiling

```js
// Console time
console.time('operation')
// ... do work
console.timeEnd('operation')

// Performance API
const start = performance.now()
// ... do work
const end = performance.now()
console.log(`Took ${end - start}ms`)

// Node.js profiling
// node --prof app.js
// node --prof-process isolate-*.log > profile.txt
```

### Common Gotchas

1. **try-catch deoptimization**
   ```js
   // ❌ Function with try-catch is harder to optimize
   function process(data) {
     try {
       return JSON.parse(data)
     } catch {
       return null
     }
   }
   
   // ✅ Extract try-catch
   function parseJson(data) {
     try {
       return JSON.parse(data)
     } catch {
       return null
     }
   }
   
   function process(data) {
     return parseJson(data) // Optimizable
   }
   ```

2. **Arguments object**
   ```js
   // ❌ Arguments is slow
   function slow() {
     console.log(arguments)
   }
   
   // ✅ Use rest parameters
   function fast(...args) {
     console.log(args)
   }
   ```

3. **With statement**
   ```js
   // ❌ Never use 'with'
   with (obj) {
     console.log(x) // Cannot optimize
   }
   ```

#### Quick Decision Guide
```typescript
Optimize for V8?
  └── Consistent object shapes
  └── Stable types in hot functions
  └── Monomorphic call sites
  └── Avoid arguments, with, eval

Profile first?
  └── Always measure before optimizing
  └── Use DevTools Performance tab
  └── Use Node.js --prof
```
