---
title: Functional Programming Basics
date: 2026-04-06
tags: [JavaScript]
---

## Functional Programming Basics

### What is Functional Programming?

**Functional Programming (FP)** is a paradigm based on:
- Pure functions
- Immutability
- Function composition
- Avoiding side effects

### Pure Functions

Same input always produces same output, with no side effects.

```js
// Pure
function add(a, b) {
  return a + b
}

// Impure - side effect
let total = 0
function addToTotal(x) {
  total += x // Mutates external state
}

// Impure - external dependency
function getTime() {
  return Date.now() // Different output each call
}
```

### Immutability

Data cannot be changed after creation.

```js
// Mutable (bad)
const arr = [1, 2, 3]
arr.push(4) // Modifies original

// Immutable (good)
const arr = [1, 2, 3]
const newArr = [...arr, 4] // Creates new array

// Immutable objects
const user = { name: 'John', age: 30 }
const updated = { ...user, age: 31 }
```

### First-Class Functions

Functions are values that can be:
- Assigned to variables
- Passed as arguments
- Returned from functions
- Stored in data structures

```js
const operations = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b
}

const execute = (fn, a, b) => fn(a, b)
execute(operations.add, 2, 3) // 5
```

### Higher-Order Functions

Functions that take functions as arguments or return functions.

```js
// Takes function
function map(array, fn) {
  const result = []
  for (const item of array) {
    result.push(fn(item))
  }
  return result
}

// Returns function
function greaterThan(n) {
  return m => m > n
}

const greaterThan10 = greaterThan(10)
greaterThan10(11) // true
```

### Function Composition

Combine simple functions to build complex ones.

```js
const compose = (f, g) => x => f(g(x))
const pipe = (f, g) => x => g(f(x))

const toUpper = s => s.toUpperCase()
const exclaim = s => s + '!'

const shout = compose(exclaim, toUpper)
shout('hello') // HELLO!

// Modern: pipeline operator (proposal)
// 'hello' |> toUpper |> exclaim
```

### Common FP Array Methods

```js
const numbers = [1, 2, 3, 4, 5]

// map - transform each element
numbers.map(x => x * 2) // [2, 4, 6, 8, 10]

// filter - keep elements matching predicate
numbers.filter(x => x % 2 === 0) // [2, 4]

// reduce - accumulate to single value
numbers.reduce((sum, x) => sum + x, 0) // 15

// find - first matching element
numbers.find(x => x > 3) // 4

// some/every - test elements
numbers.some(x => x > 4) // true
numbers.every(x => x > 0) // true
```

### Common Gotchas

1. **Mutating in place**
   ```js
   // ❌ Mutates
   arr.sort()
   arr.reverse()
   
   // ✅ Returns new array
   const sorted = [...arr].sort()
   ```

2. **Side effects in map**
   ```js
   // ❌ Side effect
   items.map(item => {
     saveToDatabase(item)
     return item
   })
   
   // ✅ Use forEach for side effects
   items.forEach(saveToDatabase)
   ```

#### Quick Decision Guide
```typescript
Need transformation?
  └── Array elements? → map
  └── Filter elements? → filter
  └── Single value? → reduce
  └── Complex pipeline? → compose/pipe

FP vs OOP?
  └── Data + behavior? → OOP
  └── Data transformation? → FP
  └── Modern JS? → Mix both
```
