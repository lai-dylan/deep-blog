---
title: Variables and Data Types
date: 2026-04-06
tags: [JavaScript]
---

## Variables and Data Types

### Variable Declaration

JavaScript has three ways to declare variables: `var`, `let`, and `const`.

#### Form 1: var — Function Scope (Legacy Usage)

When to use: Maintaining legacy code, avoid in new projects.

```js
function example() {
  var x = 10
  if (true) {
    var x = 20 // Same variable!
    console.log(x) // 20
  }
  console.log(x) // 20
}
```

**Problems with var:**
- Function scope, not block scope
- Variable hoisting
- Can be redeclared
- Accidentally creates global variables

#### Form 2: let — Block Scope, Reassignable

When to use: Variables that need to be reassigned.

```js
function example() {
  let x = 10
  if (true) {
    let x = 20 // Different variable!
    console.log(x) // 20
  }
  console.log(x) // 10
  
  x = 30 // ✅ Can reassign
  console.log(x) // 30
}
```

#### Form 3: const — Block Scope, Non-reassignable

When to use: Default choice unless reassignment is needed.

```js
const PI = 3.14159
const user = { name: 'John' }

// PI = 3.14 // ❌ TypeError: Assignment to constant variable

user.name = 'Jane' // ✅ Can modify object properties
user = {} // ❌ Cannot reassign reference
```

**const "immutability":**
- Binding is immutable: Cannot reassign
- Value may be mutable: Object and array contents can be modified

#### Comparison: var vs let vs const

| Feature | var | let | const |
|---------|-----|-----|-------|
| Scope | Function-level | Block-level | Block-level |
| Hoisting | Yes (initialized to undefined) | Yes (temporal dead zone) | Yes (temporal dead zone) |
| Redeclaration | ✅ Allowed | ❌ Not allowed | ❌ Not allowed |
| Reassignment | ✅ Allowed | ✅ Allowed | ❌ Not allowed |
| Recommended | ❌ No | ⚠️ Specific scenarios | ✅ Default |

#### Naming Conventions

```js
// camelCase - Variables and functions
const userName = 'john'
const getUserInfo = () => {}

// PascalCase - Classes and constructors
class UserProfile {}

// UPPER_SNAKE_CASE - Constants
const MAX_CONNECTIONS = 100
const API_BASE_URL = 'https://api.example.com'

// Private prefix (convention)
const _internalValue = 42 // Indicates internal use
```

### Data Types

JavaScript has 8 data types, divided into primitive types and reference types.

#### Primitive Types

Primitive types store the value itself and are immutable.

##### Form 1: string — Strings

```js
const single = 'Hello'
const double = "World"
const template = `Hello, ${name}!` // Template string

// String methods
const str = 'JavaScript'
console.log(str.length) // 10
console.log(str.toUpperCase()) // JAVASCRIPT
console.log(str.slice(0, 4)) // Java
```

##### Form 2: number — Numbers

```js
const integer = 42
const float = 3.14
const negative = -10
const scientific = 1.5e10 // 15000000000

// Special values
console.log(Infinity) // Positive infinity
console.log(-Infinity) // Negative infinity
console.log(NaN) // Not a Number

// Precision issues
console.log(0.1 + 0.2) // 0.30000000000000004
console.log(0.1 + 0.2 === 0.3) // false

// Solution
const sum = (0.1 * 10 + 0.2 * 10) / 10
console.log(sum) // 0.3
```

##### Form 3: bigint — Big Integers

```js
const big = 9007199254740991n // Exceeds Number.MAX_SAFE_INTEGER
const bigger = BigInt('9007199254740991999')

console.log(big + 1n) // 9007199254740992n

// Cannot mix with regular numbers
// console.log(big + 1) // ❌ TypeError
```

##### Form 4: boolean — Booleans

```js
const isActive = true
const isDeleted = false

// Boolean conversion
console.log(Boolean('')) // false
console.log(Boolean('hello')) // true
console.log(Boolean(0)) // false
console.log(Boolean(1)) // true
console.log(Boolean(null)) // false
console.log(Boolean(undefined)) // false
console.log(Boolean({})) // true
console.log(Boolean([])) // true
```

##### Form 5: undefined — Undefined

```js
let x
console.log(x) // undefined

function greet(name) {
  console.log(name) // undefined when no argument passed
}
greet()

// Distinguish undefined from undeclared
// console.log(y) // ❌ ReferenceError: y is not defined
```

##### Form 6: null — Null Value

```js
let user = null // Explicitly indicates "no value"

// typeof null bug
console.log(typeof null) // 'object' (historical bug)

// Correct null detection
function isNull(value) {
  return value === null
}
```

**undefined vs null:**
- `undefined`: Variable declared but not assigned, or function has no return value
- `null`: Explicitly indicates "empty" or "none", requires explicit assignment

##### Form 7: symbol — Unique Identifiers

```js
const sym1 = Symbol('description')
const sym2 = Symbol('description')

console.log(sym1 === sym2) // false (each Symbol is unique)

// Usage: Unique property keys for objects
const id = Symbol('id')
const user = {
  name: 'John',
  [id]: 12345 // Not enumerable in for...in
}

// Global Symbol registry
const globalSym = Symbol.for('app.id')
const sameSym = Symbol.for('app.id')
console.log(globalSym === sameSym) // true
```

#### Reference Types

Reference types store memory addresses and are mutable.

##### Form 1: object — Objects

```js
const user = {
  name: 'John',
  age: 30,
  email: 'john@example.com',
  greet() {
    return `Hello, I'm ${this.name}`
  }
}

// Property access
console.log(user.name) // John
console.log(user['age']) // 30
console.log(user.greet()) // Hello, I'm John
```

##### Form 2: array — Arrays

```js
const numbers = [1, 2, 3, 4, 5]
const mixed = [1, 'two', true, null, { a: 1 }]
const matrix = [[1, 2], [3, 4], [5, 6]]

// Array methods
console.log(numbers.length) // 5
console.log(numbers[0]) // 1
console.log(numbers[numbers.length - 1]) // 5

numbers.push(6) // Add element
numbers.pop() // Remove last
```

##### Form 3: function — Functions

```js
// Function declaration
function add(a, b) {
  return a + b
}

// Function expression
const multiply = function(a, b) {
  return a * b
}

// Arrow function
const divide = (a, b) => a / b

// Functions are first-class citizens
const operations = [add, multiply, divide]
console.log(operations[0](2, 3)) // 5
```

#### Type Detection

##### Form 1: typeof — Detect Primitive Types

```js
console.log(typeof 'hello') // 'string'
console.log(typeof 42) // 'number'
console.log(typeof true) // 'boolean'
console.log(typeof undefined) // 'undefined'
console.log(typeof Symbol()) // 'symbol'
console.log(typeof 123n) // 'bigint'
console.log(typeof null) // 'object' (historical bug)
console.log(typeof {}) // 'object'
console.log(typeof []) // 'object'
console.log(typeof function() {}) // 'function'
```

##### Form 2: instanceof — Detect Reference Types

```js
const arr = []
const obj = {}
const fn = () => {}

console.log(arr instanceof Array) // true
console.log(obj instanceof Object) // true
console.log(fn instanceof Function) // true
console.log(arr instanceof Object) // true (inheritance chain)
```

##### Form 3: Object.prototype.toString — Precise Detection

```js
function getType(value) {
  return Object.prototype.toString.call(value).slice(8, -1)
}

console.log(getType('hello')) // 'String'
console.log(getType(42)) // 'Number'
console.log(getType([])) // 'Array'
console.log(getType({})) // 'Object'
console.log(getType(null)) // 'Null'
console.log(getType(undefined)) // 'Undefined'
```

##### Form 4: Array.isArray — Array-specific

```js
console.log(Array.isArray([])) // true
console.log(Array.isArray({})) // false
console.log(Array.isArray('hello')) // false
```

### Type Conversion

#### Explicit Conversion

```js
// To string
String(123) // '123'
(123).toString() // '123'

// To number
Number('123') // 123
Number('12.34') // 12.34
Number('') // 0
Number('hello') // NaN
Number(null) // 0
Number(undefined) // NaN

// To boolean
Boolean(1) // true
Boolean(0) // false
Boolean('') // false
Boolean('hello') // true

// Parse integer/float
parseInt('123abc') // 123
parseFloat('12.34px') // 12.34
parseInt('1010', 2) // 10 (binary)
```

#### Implicit Conversion

```js
// String concatenation
console.log('5' + 3) // '53' (number to string)
console.log('5' - 3) // 2 (string to number)

// Comparison operations
console.log('5' == 5) // true (loose equality, type conversion)
console.log('5' === 5) // false (strict equality, no type conversion)

// Logical operations
console.log(0 || 'default') // 'default'
console.log('hello' && 42) // 42
console.log(null ?? 'fallback') // 'fallback'
```

#### Loose vs Strict Equality

```js
// Loose equality == (performs type conversion)
console.log(0 == false) // true
console.log('' == false) // true
console.log(null == undefined) // true
console.log([1, 2] == '1,2') // true

// Strict equality === (no type conversion)
console.log(0 === false) // false
console.log('' === false) // false
console.log(null === undefined) // false

// Recommendation: Always use === and !==
```

### Wrapper Objects

Primitive types are temporarily wrapped as objects when accessing properties.

```js
const str = 'hello'
console.log(str.length) // 5

// Actual process:
// 1. Create temporary String object: new String(str)
// 2. Access length property
// 3. Destroy temporary object

// Don't explicitly create wrapper objects
const bad = new String('hello') // ❌ Don't do this
const good = 'hello' // ✅ Recommended
```

### Common Gotchas

1. **NaN is not equal to itself**
   ```js
   console.log(NaN === NaN) // false
   console.log(Number.isNaN(NaN)) // true
   ```

2. **0 and -0**
   ```js
   console.log(0 === -0) // true
   console.log(1 / 0) // Infinity
   console.log(1 / -0) // -Infinity
   ```

3. **Object comparison**
   ```js
   const a = { x: 1 }
   const b = { x: 1 }
   const c = a
   
   console.log(a === b) // false (different references)
   console.log(a === c) // true (same reference)
   ```

4. **Array holes**
   ```js
   const arr = [1, , 3]
   console.log(arr.length) // 3
   console.log(arr[1]) // undefined
   console.log(1 in arr) // false (not actual undefined)
   ```

5. **Automatic Semicolon Insertion (ASI)**
   ```js
   return
   {
     value: 42
   }
   // Actually returns undefined because ASI inserts semicolon after return
   ```

#### Quick Decision Guide
```typescript
Variable declaration?
  └── Won't be reassigned? → const (default)
  └── Needs reassignment? → let
  └── Never use → var

Data type selection?
  └── Text? → string
  └── Numbers (integer/decimal)? → number
  └── Very large integers? → bigint
  └── true/false? → boolean
  └── Empty value? → null (explicit) / undefined (uninitialized)
  └── Unique key? → symbol
  └── Key-value collection? → object
  └── Ordered list? → array
  └── Executable code? → function

Type detection?
  └── Primitive type? → typeof
  └── Array? → Array.isArray()
  └── Precise type? → Object.prototype.toString.call()
  └── Custom class instance? → instanceof

Equality comparison?
  └── Always use → === and !==
  └── Avoid → == and != (unless you know conversion rules)
```

### Best Practice Summary

```js
// 1. Prefer const
const PI = 3.14159
const MAX_SIZE = 100

// 2. Use let only when necessary
let count = 0
count++

// 3. Explicitly handle null/undefined
function greet(user) {
  const name = user?.name ?? 'Guest'
  console.log(`Hello, ${name}`)
}

// 4. Avoid implicit type conversion
const input = '42'
const num = Number(input) // Explicit conversion

// 5. Use strict equality
if (value === null) { }
if (arr.length === 0) { }
```

---

## Chapter Summary

- Use `const` as default, `let` only when reassignment is needed, avoid `var`
- JavaScript has 8 data types: 7 primitive + object
- Primitive types passed by value, reference types passed by reference
- Always use `===` and `!==` for comparison
- Understand implicit type conversion rules but avoid relying on them
