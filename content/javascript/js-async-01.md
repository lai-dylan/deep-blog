---
title: Callbacks and Event Loop
date: 2026-04-06
tags: [JavaScript]
---

## Callbacks and Event Loop

### Synchronous vs Asynchronous

**Synchronous** code executes line by line, blocking until complete.
**Asynchronous** code allows other operations to run while waiting.

```js
// Synchronous
console.log('1')
console.log('2')
console.log('3')
// Output: 1, 2, 3

// Asynchronous
console.log('1')
setTimeout(() => console.log('2'), 0)
console.log('3')
// Output: 1, 3, 2
```

### Callbacks

A **callback** is a function passed as an argument to another function, executed after an operation completes.

#### Form 1: Basic Callback

```js
function greet(name, callback) {
  console.log(`Hello, ${name}`)
  callback()
}

greet('John', () => {
  console.log('Callback executed')
})
```

#### Form 2: Error-First Callback

Node.js convention: (error, result) => {}

```js
function readFile(path, callback) {
  try {
    const data = fs.readFileSync(path)
    callback(null, data)
  } catch (error) {
    callback(error, null)
  }
}

readFile('file.txt', (err, data) => {
  if (err) {
    console.error('Error:', err)
    return
  }
  console.log('Data:', data)
})
```

#### Form 3: Callback Hell

Nested callbacks become unmanageable.

```js
getData(function(a) {
  getMoreData(a, function(b) {
    getMoreData(b, function(c) {
      getMoreData(c, function(d) {
        console.log(d) // Deep nesting!
      })
    })
  })
})
```

### The Event Loop

JavaScript is single-threaded but achieves concurrency through the **event loop**.

```
Call Stack -> Web APIs -> Callback Queue -> Event Loop -> Call Stack
```

#### How It Works

1. **Call Stack**: Executes synchronous code
2. **Web APIs**: Handle async operations (timers, HTTP, DOM)
3. **Task Queue**: Holds callback functions
4. **Event Loop**: Moves tasks from queue to stack when stack is empty

#### Execution Order Example

```js
console.log('1') // Stack: log 1

setTimeout(() => { // Web API starts timer
  console.log('2')
}, 0)

Promise.resolve().then(() => { // Microtask
  console.log('3')
})

console.log('4') // Stack: log 4

// Output: 1, 4, 3, 2
```

### Macro Tasks vs Micro Tasks

**Macro Tasks**: setTimeout, setInterval, I/O, UI rendering
**Micro Tasks**: Promise callbacks, queueMicrotask, MutationObserver

```js
console.log('start')

setTimeout(() => console.log('timeout'), 0)

Promise.resolve().then(() => {
  console.log('promise 1')
  Promise.resolve().then(() => console.log('promise 2'))
})

console.log('end')

// Output: start, end, promise 1, promise 2, timeout
```

**Rule**: Micro tasks execute before the next macro task.

### setTimeout and setInterval

```js
// Execute once after delay
const timeoutId = setTimeout(() => {
  console.log('Executed after 1 second')
}, 1000)

clearTimeout(timeoutId) // Cancel

// Execute repeatedly
const intervalId = setInterval(() => {
  console.log('Every 2 seconds')
}, 2000)

clearInterval(intervalId) // Cancel
```

#### setTimeout Gotchas

```js
// Minimum delay is ~4ms in modern browsers
setTimeout(fn, 0) // Not actually 0ms

// Inactive tabs may throttle to 1000ms+

// String evaluation (bad practice)
setTimeout('console.log("eval")', 1000)
```

### Common Gotchas

1. **this in callbacks**
   ```js
   const obj = {
     name: 'John',
     greet() {
       setTimeout(function() {
         console.log(this.name) // undefined
       }, 100)
       
       setTimeout(() => {
         console.log(this.name) // John (arrow preserves this)
       }, 100)
     }
   }
   ```

2. **Variable scope in loops**
   ```js
   for (var i = 0; i < 3; i++) {
     setTimeout(() => console.log(i), 100) // 3, 3, 3
   }
   
   for (let i = 0; i < 3; i++) {
     setTimeout(() => console.log(i), 100) // 0, 1, 2
   }
   ```

3. **Blocking the event loop**
   ```js
   // Long-running task blocks everything
   while (true) {} // Never do this!
   
   // Solution: Break into chunks or use worker
   ```

#### Quick Decision Guide
```typescript
Async operation?
  └── One-time delay? → setTimeout
  └── Repeated interval? → setInterval (or setTimeout loop)
  └── Immediate after current? → queueMicrotask / Promise
  └── Next event loop tick? → setImmediate (Node.js) or setTimeout(fn, 0)

Callback issues?
  └── Too nested? → Promise or async/await
  └── Error handling? → Error-first convention
  └── this binding? → Arrow function or bind()
```
