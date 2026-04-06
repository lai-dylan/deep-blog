---
title: Higher-Order Functions and Composition
date: 2026-04-06
tags: [JavaScript]
---

## Higher-Order Functions and Composition

### Higher-Order Functions

Functions that take functions as arguments or return functions.

#### Form 1: Array Method Callbacks

```js
const numbers = [1, 2, 3, 4, 5]

// map - transform
const doubled = numbers.map(x => x * 2)

// filter - select
const evens = numbers.filter(x => x % 2 === 0)

// reduce - accumulate
const sum = numbers.reduce((acc, x) => acc + x, 0)

// sort with comparator
const sorted = [...numbers].sort((a, b) => b - a)
```

#### Form 2: Custom Higher-Order Functions

```js
// once - execute only once
function once(fn) {
  let called = false
  let result
  
  return function(...args) {
    if (!called) {
      called = true
      result = fn.apply(this, args)
    }
    return result
  }
}

const initialize = once(() => {
  console.log('Initializing...')
  return { status: 'ready' }
})

initialize() // Initializing...
initialize() // (no output, returns cached result)
```

#### Form 3: Currying

Transform function with multiple arguments into sequence of single-argument functions.

```js
// Regular
const add = (a, b, c) => a + b + c

// Curried
const curriedAdd = a => b => c => a + b + c

console.log(curriedAdd(1)(2)(3)) // 6

// Partial application
const add5 = curriedAdd(5)
const add5and10 = add5(10)
console.log(add5and10(3)) // 18
```

### Function Composition

Combine functions where output of one is input of next.

```js
// Compose (right to left)
const compose = (...fns) => x =>
  fns.reduceRight((v, f) => f(v), x)

// Pipe (left to right)
const pipe = (...fns) => x =>
  fns.reduce((v, f) => f(v), x)

// Usage
const toUpper = s => s.toUpperCase()
const exclaim = s => s + '!'
const repeat = s => s + s

const shout = compose(repeat, exclaim, toUpper)
shout('hello') // HELLO!HELLO!

const shoutPipe = pipe(toUpper, exclaim, repeat)
shoutPipe('hello') // HELLO!HELLO!
```

#### Form 1: Practical Composition

```js
const users = [
  { name: 'John', age: 30, active: true },
  { name: 'Jane', age: 25, active: false },
  { name: 'Bob', age: 35, active: true }
]

// Composed pipeline
const getActiveUserNames = pipe(
  arr => arr.filter(u => u.active),
  arr => arr.map(u => u.name),
  arr => arr.sort()
)

console.log(getActiveUserNames(users)) // ['Bob', 'John']
```

#### Form 2: Function Decorators

```js
// Timing decorator
function time(fn) {
  return function(...args) {
    const start = performance.now()
    const result = fn.apply(this, args)
    const end = performance.now()
    console.log(`${fn.name} took ${end - start}ms`)
    return result
  }
}

// Memoization decorator
function memoize(fn) {
  const cache = new Map()
  return function(...args) {
    const key = JSON.stringify(args)
    if (cache.has(key)) return cache.get(key)
    const result = fn.apply(this, args)
    cache.set(key, result)
    return result
  }
}

const fib = memoize(function fibonacci(n) {
  if (n <= 1) return n
  return fib(n - 1) + fib(n - 2)
})

console.log(fib(40)) // Fast, even for large n
```

### Partial Application

Fix some arguments, return function for remaining.

```js
// Manual partial
function partial(fn, ...presetArgs) {
  return function(...laterArgs) {
    return fn(...presetArgs, ...laterArgs)
  }
}

// Using bind
const multiply = (a, b, c) => a * b * c
const double = multiply.bind(null, 2)
const multiplyBy6 = multiply.bind(null, 2, 3)

double(5) // 10
multiplyBy6(4) // 24

// Practical: Event handlers
function handleClick(event, id) {
  console.log('Clicked', id)
}

button.addEventListener('click', partial(handleClick, itemId))
```

### React/Vue FP Patterns

#### React: Custom Hooks

```jsx
// useLocalStorage hook
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : initialValue
  })
  
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])
  
  return [value, setValue]
}
```

#### Vue: Composables

```js
// useCounter composable
export function useCounter(initial = 0) {
  const count = ref(initial)
  const double = computed(() => count.value * 2)
  
  const increment = () => count.value++
  const decrement = () => count.value--
  
  return { count, double, increment, decrement }
}
```

### Common Gotchas

1. **Composition order matters**
   ```js
   compose(f, g) !== compose(g, f)
   ```

2. **Side effects break composition**
   ```js
   // Functions with side effects can't be composed freely
   let count = 0
   const increment = () => ++count
   ```

3. **Arity mismatch**
   ```js
   // Composing functions with different arities
   const badCompose = compose(
     x => x + 1, // expects number
     s => s.toUpperCase() // returns string
   )
   ```

#### Quick Decision Guide
```typescript
Need to transform data?
  └── One operation? → map/filter/reduce directly
  └── Multiple operations? → Compose/pipe

Need to reuse function with preset args?
  └── Partial application
  └── Currying

Need to add behavior?
  └── Decorators (timing, logging, memoization)

React/Vue?
  └── Shared logic? → Hooks/Composables (FP pattern)
```
