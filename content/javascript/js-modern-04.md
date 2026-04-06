---
title: Iterators and Generators
date: 2026-04-06
tags: [JavaScript]
---

## Iterators and Generators

### Iteration Protocols

**Iterable**: Has Symbol.iterator method
**Iterator**: Returns { value, done } from next()

```js
const arr = [1, 2, 3]
const iterator = arr[Symbol.iterator]()

console.log(iterator.next()) // { value: 1, done: false }
console.log(iterator.next()) // { value: 2, done: false }
console.log(iterator.next()) // { value: 3, done: false }
console.log(iterator.next()) // { value: undefined, done: true }
```

### Custom Iterator

```js
class Range {
  constructor(start, end) {
    this.start = start
    this.end = end
  }
  
  [Symbol.iterator]() {
    let current = this.start
    const end = this.end
    
    return {
      next() {
        if (current <= end) {
          return { value: current++, done: false }
        }
        return { done: true }
      }
    }
  }
}

for (const num of new Range(1, 5)) {
  console.log(num) // 1, 2, 3, 4, 5
}
```

### Generator Functions

Functions that can pause and resume execution.

```js
function* countUp() {
  let count = 0
  while (true) {
    yield count++
  }
}

const counter = countUp()
console.log(counter.next()) // { value: 0, done: false }
console.log(counter.next()) // { value: 1, done: false }
```

#### Form 1: yield Values

```js
function* fibonacci() {
  let a = 0, b = 1
  while (true) {
    yield a
    [a, b] = [b, a + b]
  }
}

const fib = fibonacci()
console.log(fib.next().value) // 0
console.log(fib.next().value) // 1
console.log(fib.next().value) // 1
console.log(fib.next().value) // 2
```

#### Form 2: yield Delegation

```js
function* generator1() {
  yield 1
  yield 2
}

function* generator2() {
  yield* generator1()
  yield 3
}

const gen = generator2()
console.log([...gen]) // [1, 2, 3]
```

#### Form 3: Two-way Communication

```js
function* greeting() {
  const name = yield 'What is your name?'
  yield `Hello, ${name}!`
}

const gen = greeting()
console.log(gen.next()) // { value: 'What is your name?', done: false }
console.log(gen.next('John')) // { value: 'Hello, John!', done: false }
```

#### Form 4: Async Generators

```js
async function* fetchPages() {
  let page = 1
  while (page <= 5) {
    const data = await fetch(`/api/data?page=${page}`)
    yield data.json()
    page++
  }
}

for await (const page of fetchPages()) {
  console.log(page)
}
```

### Common Gotchas

1. Generators are lazy - values computed on demand
2. return() ends generator early
3. throw() injects error into generator

#### Quick Decision Guide
```typescript
Need custom iteration? → Iterator protocol
Need lazy evaluation? → Generator
Need async iteration? → Async generator
```
