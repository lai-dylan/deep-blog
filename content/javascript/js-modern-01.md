---
title: ES6+ Syntax Sugar
date: 2026-04-06
tags: [JavaScript]
---

## ES6+ Syntax Sugar

### Destructuring Assignment

Extract values from arrays or objects into distinct variables.

#### Form 1: Array Destructuring

```js
const numbers = [1, 2, 3]
const [a, b, c] = numbers
console.log(a, b, c) // 1, 2, 3

// Skip elements
const [, second, , fourth] = [1, 2, 3, 4]
console.log(second, fourth) // 2, 4

// Rest pattern
const [first, ...rest] = [1, 2, 3, 4]
console.log(rest) // [2, 3, 4]

// Default values
const [x = 10, y = 20] = [5]
console.log(x, y) // 5, 20
```

#### Form 2: Object Destructuring

```js
const user = { name: 'John', age: 30, city: 'NYC' }
const { name, age } = user
console.log(name, age) // John, 30

// Rename variables
const { name: userName, age: userAge } = user
console.log(userName) // John

// Default values
const { role = 'user' } = user
console.log(role) // user

// Nested destructuring
const person = {
  info: { name: 'Jane', address: { city: 'LA' } }
}
const { info: { address: { city } } } = person
console.log(city) // LA
```

#### Form 3: Destructuring in Function Parameters

```js
function greet({ name, greeting = 'Hello' }) {
  return `${greeting}, ${name}!`
}

greet({ name: 'John' }) // Hello, John!

// Array parameters
function sum([a, b, c]) {
  return a + b + c
}
sum([1, 2, 3]) // 6
```

### Spread Operator

Expand iterable elements or object properties.

#### Form 1: Array Spread

```js
const arr1 = [1, 2, 3]
const arr2 = [...arr1, 4, 5]
console.log(arr2) // [1, 2, 3, 4, 5]

// Copy array (shallow)
const copy = [...arr1]

// Concatenate arrays
const combined = [...arr1, ...arr2]

// Convert iterable to array
const str = 'hello'
const chars = [...str] // ['h', 'e', 'l', 'l', 'o']
```

#### Form 2: Object Spread

```js
const obj1 = { a: 1, b: 2 }
const obj2 = { ...obj1, c: 3 }
console.log(obj2) // { a: 1, b: 2, c: 3 }

// Override properties
const updated = { ...obj1, b: 20 }
console.log(updated) // { a: 1, b: 20 }

// Shallow copy
const copy = { ...obj1 }

// Merge objects
const merged = { ...obj1, ...obj2 }
```

#### Form 3: Rest Parameters vs Spread

```js
// Spread: expand
const nums = [1, 2, 3]
Math.max(...nums) // 3

// Rest: collect
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0)
}
sum(1, 2, 3, 4) // 10
```

### Template Literals

#### Form 1: Basic Interpolation

```js
const name = 'John'
const age = 30

const message = `Hello, ${name}! You are ${age} years old.`
console.log(message)
```

#### Form 2: Multi-line Strings

```js
const html = `
  <div class="user">
    <h1>${name}</h1>
    <p>Age: ${age}</p>
  </div>
`
```

#### Form 3: Tagged Templates

```js
function highlight(strings, ...values) {
  return strings.reduce((result, str, i) => {
    const value = values[i] ? `**${values[i]}**` : ''
    return result + str + value
  }, '')
}

const name = 'John'
const result = highlight`Hello ${name}, welcome!`
// Hello **John**, welcome!
```

### New Data Structures

#### Form 1: Map

Key-value pairs with any type of key.

```js
const map = new Map()

// Set values
map.set('name', 'John')
map.set(123, 'number key')
map.set({ id: 1 }, 'object key')

// Get values
console.log(map.get('name')) // John

// Check existence
console.log(map.has('name')) // true

// Delete
map.delete('name')

// Size
console.log(map.size)

// Iterate
for (const [key, value] of map) {
  console.log(key, value)
}

// Convert from object
const obj = { a: 1, b: 2 }
const mapFromObj = new Map(Object.entries(obj))
```

**Map vs Object:**

| Feature | Map | Object |
|---------|-----|--------|
| Key types | Any | String/Symbol only |
| Order | Insertion order | Not guaranteed |
| Size property | Yes | No (manual count) |
| Iteration | Direct | Via keys/entries |
| Performance | Better for frequent additions | Better for fixed keys |

#### Form 2: Set

Unique values collection.

```js
const set = new Set([1, 2, 2, 3, 3, 3])
console.log(set) // Set { 1, 2, 3 }

// Add values
set.add(4)

// Check existence
console.log(set.has(2)) // true

// Delete
set.delete(2)

// Size
console.log(set.size)

// Iterate
for (const value of set) {
  console.log(value)
}
```

**Common Set operations:**

```js
// Remove duplicates from array
const unique = [...new Set([1, 2, 2, 3])]

// Set operations
const a = new Set([1, 2, 3])
const b = new Set([2, 3, 4])

// Intersection
const intersection = new Set([...a].filter(x => b.has(x)))

// Union
const union = new Set([...a, ...b])

// Difference
const difference = new Set([...a].filter(x => !b.has(x)))
```

#### Form 3: WeakMap and WeakSet

Hold "weak" references to keys/objects.

```js
// WeakMap - keys must be objects
const weakMap = new WeakMap()
const key = { id: 1 }
weakMap.set(key, 'value')

// WeakSet - values must be objects
const weakSet = new WeakSet()
const obj = { name: 'John' }
weakSet.add(obj)

// Allows garbage collection when no other references
```

**Use cases:**
- Private data for objects
- Caching without preventing GC
- Marking objects without modifying them

### Array Methods (ES6+)

```js
const arr = [1, 2, 3, 4, 5]

// find - first matching element
arr.find(x => x > 3) // 4

// findIndex - index of first match
arr.findIndex(x => x > 3) // 3

// includes - check existence
arr.includes(3) // true

// Array.from - create array from iterable
Array.from('hello') // ['h', 'e', 'l', 'l', 'o']
Array.from({ length: 5 }, (_, i) => i) // [0, 1, 2, 3, 4]

// Array.of - create array from arguments
Array.of(1, 2, 3) // [1, 2, 3]

// fill
[1, 2, 3].fill(0) // [0, 0, 0]
[1, 2, 3, 4].fill(0, 1, 3) // [1, 0, 0, 4]

// flat / flatMap
[1, [2, 3], [4, [5]]].flat() // [1, 2, 3, 4, [5]]
[1, [2, 3], [4, [5]]].flat(2) // [1, 2, 3, 4, 5]

[1, 2, 3].flatMap(x => [x, x * 2]) // [1, 2, 2, 4, 3, 6]

// at - negative indexing
arr.at(-1) // 5 (last element)
arr.at(-2) // 4
```

### Object Methods (ES6+)

```js
const obj = { a: 1, b: 2 }

// Object.assign (ES6)
Object.assign({}, obj, { c: 3 })

// Object.entries (ES2017)
Object.entries(obj) // [['a', 1], ['b', 2]]

// Object.values (ES2017)
Object.values(obj) // [1, 2]

// Object.fromEntries (ES2019)
Object.fromEntries([['a', 1], ['b', 2]]) // { a: 1, b: 2 }

// Object.hasOwn (ES2022)
Object.hasOwn(obj, 'a') // true

// Object.getOwnPropertyDescriptors (ES2017)
Object.getOwnPropertyDescriptors(obj)
```

### ES2020+ Features

```js
// Optional chaining (ES2020)
const city = user?.address?.city
const method = obj?.method?.()

// Nullish coalescing (ES2020)
const value = input ?? 'default'

// BigInt (ES2020)
const big = 9007199254740991n
const result = big + 1n

// Promise.allSettled (ES2020)
await Promise.allSettled([promise1, promise2])

// Dynamic import (ES2020)
const module = await import('./module.js')

// String.prototype.matchAll (ES2020)
const matches = 'abc'.matchAll(/[a-c]/g)

// globalThis (ES2020)
globalThis.fetch // Works in browser and Node.js

// Logical assignment (ES2021)
a ??= b // a = a ?? b
a &&= b // a = a && b
a ||= b // a = a || b

// Numeric separators (ES2021)
const million = 1_000_000
const binary = 0b1010_1010

// at() method (ES2022)
array.at(-1) // last element
string.at(-1) // last character

// Class fields and private methods (ES2022)
class Counter {
  #count = 0 // Private field
  
  get #formatted() { // Private getter
    return `Count: ${this.#count}`
  }
  
  increment() {
    return ++this.#count
  }
}

// Class static block (ES2022)
class Database {
  static #config
  
  static {
    this.#config = loadConfig()
  }
}
```

### Common Gotchas

1. **Destructuring undefined/null**
   ```js
   const { name } = undefined // TypeError
   
   // ✅ Use default
   const { name } = obj || {}
   ```

2. **Spread creates shallow copies**
   ```js
   const original = { nested: { value: 1 } }
   const copy = { ...original }
   copy.nested.value = 2
   console.log(original.nested.value) // 2
   ```

3. **Map keys are by reference for objects**
   ```js
   const map = new Map()
   map.set({ id: 1 }, 'value')
   map.get({ id: 1 }) // undefined (different object)
   
   const key = { id: 1 }
   map.set(key, 'value')
   map.get(key) // 'value'
   ```

#### Quick Decision Guide
```typescript
Extract values?
  └── Array? → Array destructuring
  └── Object? → Object destructuring
  └── Mixed/nested? → Combined destructuring

Combine/Copy?
  └── Arrays? → Spread [...arr]
  └── Objects? → Spread { ...obj }
  └── Deep clone needed? → Structured clone or library

Data structures?
  └── Any key type? → Map
  └── Unique values? → Set
  └── Private data? → WeakMap
  └── Simple string keys? → Object

Check existence?
  └── Array? → Array.prototype.includes
  └── String? → String.prototype.includes
  └── Object property? → Object.hasOwn or in operator
```
