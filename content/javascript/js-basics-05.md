---
title: Functions
date: 2026-04-06
tags: [JavaScript]
---

## Functions

### What are Functions?

**Functions** are reusable blocks of code that perform a specific task. In JavaScript, functions are first-class citizens—they can be assigned to variables, passed as arguments, and returned from other functions.

### Function Declaration vs Expression

#### Form 1: Function Declaration

When to use: Named functions that need hoisting.

```js
function greet(name) {
  return `Hello, ${name}!`
}

console.log(greet('John')) // Hello, John!

// Hoisting works
console.log(sayHi()) // Hi!
function sayHi() {
  return 'Hi!'
}
```

**Characteristics:**
- Function name is required
- Hoisted to top of scope
- Creates a function object with `name` property

#### Form 2: Function Expression

When to use: Anonymous functions, callbacks, IIFEs.

```js
const greet = function(name) {
  return `Hello, ${name}!`
}

// Named function expression (better stack traces)
const factorial = function fact(n) {
  if (n <= 1) return 1
  return n * fact(n - 1) // Can reference itself
}

// Anonymous function expression
const numbers = [1, 2, 3]
const doubled = numbers.map(function(x) {
  return x * 2
})
```

**Declaration vs Expression:**

| Feature | Declaration | Expression |
|---------|-------------|------------|
| Hoisting | Yes | No |
| Name | Required | Optional |
| Self-reference | Automatic | Requires named expression |
| Use case | Standalone functions | Callbacks, assignments |

#### Form 3: Arrow Functions

When to use: Short callbacks, preserving outer `this`.

```js
// Basic syntax
const add = (a, b) => a + b

// Single parameter (parentheses optional)
const square = x => x * x

// Multiple statements (requires braces and return)
const greet = (name) => {
  const message = `Hello, ${name}!`
  return message
}

// Returning object (wrap in parentheses)
const makeUser = (name, age) => ({ name, age })

// No parameters
const getTime = () => new Date().toISOString()
```

**Arrow Function Characteristics:**
- Concise syntax
- No own `this`, `arguments`, `super`, `new.target`
- Cannot be used as constructor
- Cannot use `yield` (not generator functions)

**Arrow Functions and `this`:**

```js
const obj = {
  name: 'Object',
  
  // Traditional function has its own this
  traditionalMethod: function() {
    setTimeout(function() {
      console.log(this.name) // undefined (this is window/global)
    }, 100)
  },
  
  // Arrow function inherits this from outer scope
  arrowMethod: function() {
    setTimeout(() => {
      console.log(this.name) // 'Object' (inherits this)
    }, 100)
  }
}
```

### Function Parameters

#### Form 1: Default Parameters

When to use: Provide fallback values.

```js
function greet(name = 'Guest', greeting = 'Hello') {
  return `${greeting}, ${name}!`
}

console.log(greet()) // Hello, Guest!
console.log(greet('John')) // Hello, John!
console.log(greet('John', 'Hi')) // Hi, John!

// Default parameters can use expressions
function createId(prefix = 'ID', counter = getCounter()) {
  return `${prefix}-${counter}`
}

// Previous parameters in defaults
function greet(name, greeting = `Hello, ${name}`) {
  return greeting
}
```

#### Form 2: Rest Parameters

When to use: Accept variable number of arguments.

```js
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0)
}

console.log(sum(1, 2, 3)) // 6
console.log(sum(1, 2, 3, 4, 5)) // 15

// Combine with regular parameters
function formatDate(separator, ...parts) {
  return parts.join(separator)
}

console.log(formatDate('/', 2024, 1, 15)) // 2024/1/15
```

**Rest vs arguments:**

```js
// Old way using arguments object
function oldSum() {
  let total = 0
  for (let i = 0; i < arguments.length; i++) {
    total += arguments[i]
  }
  return total
}

// Modern way with rest parameters
function newSum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0)
}

// Rest parameters advantages:
// - Real array (has map, filter, etc.)
// - Can be combined with named parameters
// - Works with arrow functions
```

#### Form 3: Destructuring Parameters

When to use: Extract specific properties from objects/arrays.

```js
// Object destructuring
function createUser({ name, age, role = 'user' }) {
  return {
    id: generateId(),
    name,
    age,
    role
  }
}

createUser({ name: 'John', age: 30 })

// Array destructuring
function formatCoordinates([x, y, z = 0]) {
  return `X: ${x}, Y: ${y}, Z: ${z}`
}

formatCoordinates([10, 20]) // X: 10, Y: 20, Z: 0

// Nested destructuring
function processConfig({ server: { host, port }, debug = false }) {
  return { host, port, debug }
}
```

### First-Class Functions

Functions in JavaScript can be:

#### 1. Assigned to Variables

```js
const multiply = function(a, b) {
  return a * b
}

const operations = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply,
  divide: (a, b) => a / b
}

console.log(operations.add(2, 3)) // 5
```

#### 2. Passed as Arguments (Callbacks)

```js
function fetchData(url, callback) {
  // Simulate async operation
  setTimeout(() => {
    const data = { id: 1, name: 'John' }
    callback(data)
  }, 1000)
}

fetchData('/api/user', (user) => {
  console.log(user.name)
})

// Array methods with callbacks
const numbers = [1, 2, 3, 4, 5]
const evens = numbers.filter(n => n % 2 === 0)
const doubled = numbers.map(n => n * 2)
const sum = numbers.reduce((a, b) => a + b, 0)
```

#### 3. Returned from Functions (Higher-Order)

```js
function createMultiplier(factor) {
  return function(number) {
    return number * factor
  }
}

const double = createMultiplier(2)
const triple = createMultiplier(3)

console.log(double(5)) // 10
console.log(triple(5)) // 15

// Practical example: Logger with prefix
function createLogger(prefix) {
  return function(message) {
    console.log(`[${prefix}] ${message}`)
  }
}

const info = createLogger('INFO')
const error = createLogger('ERROR')

info('Server started') // [INFO] Server started
error('Connection failed') // [ERROR] Connection failed
```

### IIFE (Immediately Invoked Function Expression)

When to use: Create private scope, avoid polluting global namespace.

```js
// Basic IIFE
(function() {
  const privateVar = 'I am private'
  console.log(privateVar)
})()

// With parameters
(function(name) {
  console.log(`Hello, ${name}!`)
})('World')

// Arrow function IIFE
(() => {
  console.log('Arrow IIFE')
})()

// Named IIFE (for recursion)
(function factorial(n) {
  if (n <= 1) return 1
  return n * factorial(n - 1)
})(5) // 120
```

**Modern alternatives to IIFE:**

```js
// Module scope (preferred in modern JS)
// user.js
const privateData = new WeakMap()

export class User {
  constructor(name) {
    privateData.set(this, { name })
  }
}

// Block scope with let/const
{
  const privateVar = 'private'
  console.log(privateVar)
}
// console.log(privateVar) // ReferenceError
```

### Recursion

When to use: Problems with recursive structure (trees, factorial, Fibonacci).

```js
// Factorial
function factorial(n) {
  if (n <= 1) return 1
  return n * factorial(n - 1)
}

// Fibonacci (inefficient without memoization)
function fibonacci(n) {
  if (n <= 1) return n
  return fibonacci(n - 1) + fibonacci(n - 2)
}

// Tree traversal
function traverseTree(node, callback) {
  callback(node)
  if (node.children) {
    node.children.forEach(child => traverseTree(child, callback))
  }
}

// Memoized Fibonacci
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

const fastFib = memoize(fibonacci)
```

### Common Gotchas

1. **Function hoisting differences**
   ```js
   console.log(declared()) // Works
   console.log(expressed()) // TypeError
   
   function declared() { return 'declared' }
   const expressed = function() { return 'expressed' }
   ```

2. **Arrow functions don't have arguments**
   ```js
   const arrow = () => {
     console.log(arguments) // ReferenceError
   }
   
   // Use rest parameters instead
   const arrow = (...args) => {
     console.log(args)
   }
   ```

3. **this binding in callbacks**
   ```js
   const obj = {
     value: 42,
     getValue: function() {
       return this.value
     }
   }
   
   // ❌ this is lost
   setTimeout(obj.getValue, 100) // undefined
   
   // ✅ Solutions
   setTimeout(() => obj.getValue(), 100)
   setTimeout(obj.getValue.bind(obj), 100)
   setTimeout(function() { obj.getValue() }, 100)
   ```

4. **Default parameters are evaluated at call time**
   ```js
   function append(value, array = []) {
     array.push(value)
     return array
   }
   
   append(1) // [1]
   append(2) // [2], not [1, 2] - new array each time
   ```

5. **Rest parameters must be last**
   ```js
   // ❌ SyntaxError
   function wrong(a, ...rest, b) {}
   
   // ✅ Correct
   function right(a, b, ...rest) {}
   ```

#### Quick Decision Guide
```typescript
Function declaration vs expression?
  └── Need hoisting? → Function declaration
  └── Callback / IIFE? → Function expression
  └── Modern codebase? → Prefer const + arrow for brevity

Arrow function vs regular?
  └── Need this from outer scope? → Arrow
  └── Need function-specific this? → Regular
  └── Method in object/class? → Regular
  └── Short callback? → Arrow

Parameters?
  └── Optional with default? → Default parameters
  └── Variable arguments? → Rest parameters
  └── Object/array input? → Destructuring parameters

Higher-order functions?
  └── Callback pattern? → Pass function as argument
  └── Factory pattern? → Return function from function
```

### Best Practices

```js
// 1. Use meaningful names
// ❌ Bad
const fn = (a, b) => a + b

// ✅ Good
const calculateTotal = (price, quantity) => price * quantity

// 2. Keep functions small and focused (Single Responsibility)
// ❌ Bad: Does too much
function processUser(user) {
  validateUser(user)
  saveToDatabase(user)
  sendEmail(user)
  updateCache(user)
}

// ✅ Good: Separate concerns
async function processUser(user) {
  validateUser(user)
  await saveUser(user)
  await notifyUser(user)
}

// 3. Use default parameters instead of || for falsy values
// ❌ 0 would trigger default
function multiply(a, b) {
  b = b || 1
  return a * b
}

// ✅ Only undefined triggers default
function multiply(a, b = 1) {
  return a * b
}

// 4. Return early to reduce nesting
// ❌ Deep nesting
function processUser(user) {
  if (user) {
    if (user.active) {
      return doSomething(user)
    }
  }
}

// ✅ Early returns
function processUser(user) {
  if (!user) return null
  if (!user.active) return null
  return doSomething(user)
}

// 5. Document with JSDoc
/**
 * Calculates the area of a rectangle
 * @param {number} width - The width of the rectangle
 * @param {number} height - The height of the rectangle
 * @returns {number} The calculated area
 */
function calculateArea(width, height) {
  return width * height
}
```

---

## Chapter Summary

- Function declarations are hoisted, expressions are not
- Arrow functions provide concise syntax and lexical `this` binding
- Use default parameters, rest parameters, and destructuring for flexible APIs
- Functions are first-class citizens—can be assigned, passed, and returned
- IIFEs create private scope (less needed with ES modules)
- Recursion solves tree-structured problems but watch for stack overflow
- Keep functions small, focused, and well-named
