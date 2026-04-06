---
title: Objects
date: 2026-04-06
tags: [JavaScript]
---

## Objects

### What are Objects?

**Objects** in JavaScript are collections of key-value pairs. They are the foundation of the language—almost everything in JavaScript is an object or behaves like one.

### Creating Objects

#### Form 1: Object Literal

When to use: Most common, simple object creation.

```js
const user = {
  name: 'John',
  age: 30,
  email: 'john@example.com',
  isActive: true
}

// Trailing comma (recommended for version control)
const config = {
  host: 'localhost',
  port: 3000,
  ssl: false, // trailing comma makes diffs cleaner
}
```

#### Form 2: Object Constructor

When to use: Rarely, mainly for specific object types.

```js
const user = new Object()
user.name = 'John'
user.age = 30

// Built-in objects
const now = new Date()
const regex = new RegExp('\\d+', 'g')
const error = new Error('Something went wrong')
```

#### Form 3: Object.create()

When to use: Specify prototype explicitly.

```js
const animal = {
  speak() {
    console.log('Some sound')
  }
}

const dog = Object.create(animal)
dog.speak = function() {
  console.log('Woof!')
}

dog.speak() // Woof!
```

### Property Access

#### Dot Notation vs Bracket Notation

```js
const user = {
  name: 'John',
  'favorite color': 'blue',
  123: 'numeric key'
}

// Dot notation (preferred when possible)
console.log(user.name) // John

// Bracket notation (required for special keys)
console.log(user['favorite color']) // blue
console.log(user['name']) // John
console.log(user[123]) // numeric key

// Dynamic property access
const prop = 'name'
console.log(user[prop]) // John
console.log(user.prop) // undefined (looks for 'prop' key)
```

#### Computed Property Names

```js
const prefix = 'user'
const id = 42

const obj = {
  [`${prefix}_${id}`]: 'John',
  [Symbol('id')]: 123
}

console.log(obj.user_42) // John
```

### Property Descriptors

Every property has a descriptor controlling its behavior.

```js
const obj = {}

Object.defineProperty(obj, 'name', {
  value: 'John',
  writable: true,      // Can be changed
  enumerable: true,    // Shows in for...in
  configurable: true   // Can be deleted or reconfigured
})

// Get descriptor
const descriptor = Object.getOwnPropertyDescriptor(obj, 'name')
console.log(descriptor)
// { value: 'John', writable: true, enumerable: true, configurable: true }
```

#### Form 1: Read-Only Property

```js
const config = {}

Object.defineProperty(config, 'version', {
  value: '1.0.0',
  writable: false,
  enumerable: true,
  configurable: false
})

config.version = '2.0.0' // Silent fail (strict mode: error)
console.log(config.version) // 1.0.0
```

#### Form 2: Getter and Setter

```js
const user = {
  firstName: 'John',
  lastName: 'Doe',
  
  get fullName() {
    return `${this.firstName} ${this.lastName}`
  },
  
  set fullName(value) {
    [this.firstName, this.lastName] = value.split(' ')
  }
}

console.log(user.fullName) // John Doe
user.fullName = 'Jane Smith'
console.log(user.firstName) // Jane
```

#### Form 3: Private Fields

```js
class Counter {
  #count = 0 // Private field
  
  increment() {
    return ++this.#count
  }
  
  get #formatted() { // Private getter
    return `Count: ${this.#count}`
  }
  
  log() {
    console.log(this.#formatted)
  }
}

const counter = new Counter()
console.log(counter.increment()) // 1
// console.log(counter.#count) // SyntaxError: Private field
```

### Object Methods

#### Form 1: Object Methods

```js
const calculator = {
  value: 0,
  
  add(n) {
    this.value += n
    return this // For chaining
  },
  
  subtract(n) {
    this.value -= n
    return this
  },
  
  getValue() {
    return this.value
  }
}

calculator.add(5).subtract(2).add(10)
console.log(calculator.getValue()) // 13
```

#### Form 2: Shorthand Method Syntax

```js
const name = 'John'

const user = {
  name, // Shorthand property
  age: 30,
  
  // Shorthand method
  greet() {
    return `Hello, ${this.name}`
  },
  
  // Arrow function (no this binding)
  log: () => {
    console.log(user.name) // Must use user.name
  }
}
```

### Object Immutability

#### Form 1: Object.preventExtensions

```js
const obj = { a: 1 }
Object.preventExtensions(obj)

obj.b = 2 // Silent fail
console.log(obj.b) // undefined

obj.a = 2 // ✅ Can modify existing
console.log(obj.a) // 2
```

#### Form 2: Object.seal

```js
const obj = { a: 1 }
Object.seal(obj)

obj.b = 2 // Silent fail
delete obj.a // Silent fail
obj.a = 2 // ✅ Can modify existing

console.log(Object.isSealed(obj)) // true
```

#### Form 3: Object.freeze

```js
const obj = { a: 1, nested: { b: 2 } }
Object.freeze(obj)

obj.a = 2 // Silent fail
delete obj.a // Silent fail
obj.c = 3 // Silent fail

// Shallow freeze only!
obj.nested.b = 3 // ✅ Works (nested not frozen)

console.log(Object.isFrozen(obj)) // true
```

#### Deep Freeze

```js
function deepFreeze(obj) {
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      deepFreeze(obj[key])
    }
  })
  return Object.freeze(obj)
}

const config = deepFreeze({
  db: { host: 'localhost', port: 5432 },
  cache: { enabled: true }
})

// config.db.port = 3306 // Now fails
```

### Object Static Methods

#### Form 1: Object.keys/values/entries

```js
const user = { name: 'John', age: 30 }

console.log(Object.keys(user)) // ['name', 'age']
console.log(Object.values(user)) // ['John', 30]
console.log(Object.entries(user)) // [['name', 'John'], ['age', 30]]

// Iterate entries
for (const [key, value] of Object.entries(user)) {
  console.log(`${key}: ${value}`)
}

// Create from entries
const entries = [['a', 1], ['b', 2]]
const obj = Object.fromEntries(entries)
console.log(obj) // { a: 1, b: 2 }
```

#### Form 2: Object.assign

```js
const target = { a: 1 }
const source1 = { b: 2 }
const source2 = { c: 3 }

Object.assign(target, source1, source2)
console.log(target) // { a: 1, b: 2, c: 3 }

// Shallow copy
const original = { nested: { value: 1 } }
const copy = Object.assign({}, original)
copy.nested.value = 2
console.log(original.nested.value) // 2 (shared reference)

// Better: Spread syntax (also shallow)
const copy2 = { ...original }
```

#### Form 3: Object.prototype methods

```js
const obj = { a: 1 }

console.log(obj.hasOwnProperty('a')) // true
console.log(obj.toString()) // [object Object]
console.log(obj.valueOf()) // { a: 1 }

// Modern alternatives
console.log(Object.hasOwn(obj, 'a')) // ES2022, preferred
console.log(Object.prototype.toString.call([])) // [object Array]
```

### Property Enumeration

```js
const obj = {
  a: 1,
  b: 2,
  [Symbol('c')]: 3 // Symbol keys
}
Object.defineProperty(obj, 'd', {
  value: 4,
  enumerable: false
})

// Enumerable own properties
for (const key in obj) {
  console.log(key) // a, b (includes inherited, excludes symbols)
}

console.log(Object.keys(obj)) // ['a', 'b']
console.log(Object.getOwnPropertyNames(obj)) // ['a', 'b', 'd']
console.log(Object.getOwnPropertySymbols(obj)) // [Symbol(c)]
console.log(Reflect.ownKeys(obj)) // All keys
```

### Common Gotchas

1. **Object comparison**
   ```js
   const a = { x: 1 }
   const b = { x: 1 }
   console.log(a === b) // false (different references)
   
   // Deep equality check needed
   function deepEqual(obj1, obj2) {
     return JSON.stringify(obj1) === JSON.stringify(obj2) // Simple but limited
   }
   ```

2. **Prototype chain lookup**
   ```js
   const obj = {}
   console.log(obj.toString) // [Function: toString] (from prototype)
   console.log(obj.hasOwnProperty('toString')) // false
   ```

3. **this in object methods**
   ```js
   const obj = {
     name: 'John',
     greet() {
       return `Hello, ${this.name}`
     }
   }
   
   const greet = obj.greet
   console.log(greet()) // Hello, undefined (this is lost)
   console.log(obj.greet()) // Hello, John
   ```

4. **Deleting properties**
   ```js
   const obj = { a: 1 }
   delete obj.a // Returns true
   delete obj.b // Returns true (property doesn't exist)
   
   // Cannot delete non-configurable properties
   delete Object.prototype // false
   ```

#### Quick Decision Guide
```typescript
Object creation?
  └── Simple object? → Object literal
  └── Specific prototype? → Object.create()
  └── Complex initialization? → Class or factory function

Property access?
  └── Known key name? → Dot notation (obj.name)
  └── Dynamic key? → Bracket notation (obj[key])
  └── Computed key? → Bracket in definition ([key]: value)

Immutability?
  └── Prevent new properties? → Object.preventExtensions()
  └── Prevent add/delete? → Object.seal()
  └── Full immutability? → Object.freeze() (shallow)
  └── Deep immutability? → Deep freeze or Immutable.js

Object iteration?
  └── Keys only? → Object.keys()
  └── Values only? → Object.values()
  └── Key-value pairs? → Object.entries()
  └── All properties? → Reflect.ownKeys()
```

### Best Practices

```js
// 1. Use const for objects
const user = { name: 'John' }
user.name = 'Jane' // ✅ Allowed (mutation)
// user = {} // ❌ Assignment error

// 2. Destructure for cleaner code
const { name, age } = user

// 3. Spread for shallow copies
const copy = { ...user }

// 4. Use optional chaining
const city = user?.address?.city

// 5. Nullish coalescing for defaults
const port = config.port ?? 3000

// 6. Check property existence
if ('name' in user) { }
if (Object.hasOwn(user, 'name')) { } // Better, no prototype
```

---

## Chapter Summary

- Objects are key-value collections; almost everything in JS is an object
- Create with literals (preferred), constructors, or Object.create()
- Properties have descriptors controlling writability, enumerability, configurability
- Use getters/setters for computed properties
- Object.freeze/seal/preventExtensions provide varying levels of immutability
- Object static methods (keys, values, entries, assign) for common operations
- Always distinguish between reference equality and value equality
