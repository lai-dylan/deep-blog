---
title: Operators and Expressions
date: 2026-04-06
tags: [JavaScript]
---

## Operators and Expressions

### Operators Overview

Operators perform operations; expressions are code fragments composed of operators and operands.

#### Operator Categories

| Type | Operators |
|------|-----------|
| Arithmetic | `+` `-` `*` `/` `%` `**` |
| Comparison | `==` `===` `!=` `!==` `<` `>` `<=` `>=` |
| Logical | `&&` `\|\|` `!` |
| Bitwise | `&` `\|` `^` `~` `<<` `>>` `>>>` |
| Assignment | `=` `+=` `-=` `*=` `/=` `%=` `**=` etc. |
| Other | `?:` `??` `?.` `typeof` `instanceof` `in` `delete` `void` |

### Arithmetic Operators

#### Form 1: Basic Arithmetic — Addition, Subtraction, Multiplication, Division

```js
const a = 10
const b = 3

console.log(a + b) // 13
console.log(a - b) // 7
console.log(a * b) // 30
console.log(a / b) // 3.3333333333333335
console.log(a % b) // 1 (remainder)
console.log(a ** b) // 1000 (10 to the power of 3)
```

#### Form 2: Increment and Decrement — ++ and --

```js
let x = 5

// Prefix: increment first, then use
console.log(++x) // 6
console.log(x) // 6

// Postfix: use first, then increment
let y = 5
console.log(y++) // 5
console.log(y) // 6

// Practical application
let count = 0
function increment() {
  return ++count
}
```

#### Form 3: Unary Plus and Minus — + and -

```js
const str = '42'
console.log(+str) // 42 (convert to number)
console.log(-str) // -42
console.log(+'') // 0
console.log(+'hello') // NaN

// Concise number conversion
const num = +'123' // Equivalent to Number('123')
```

#### Floating Point Precision Issues

```js
console.log(0.1 + 0.2) // 0.30000000000000004
console.log(0.1 + 0.2 === 0.3) // false

// Solution
function add(a, b) {
  return Math.round((a + b) * 100) / 100
}
console.log(add(0.1, 0.2)) // 0.3

// Or use toFixed (returns string)
console.log((0.1 + 0.2).toFixed(2)) // '0.30'
```

### Comparison Operators

#### Form 1: Strict Equality — === and !==

```js
console.log(5 === 5) // true
console.log(5 === '5') // false (different types)
console.log(true === 1) // false
console.log(null === undefined) // false
console.log([] === []) // false (different references)
```

#### Form 2: Loose Equality — == and !=

```js
// Type conversion rules (avoid using)
console.log(5 == '5') // true (string to number)
console.log(0 == false) // true
console.log('' == false) // true
console.log(null == undefined) // true
console.log([1, 2] == '1,2') // true (array to string)
```

#### Form 3: Size Comparison

```js
console.log(5 > 3) // true
console.log(5 >= 5) // true
console.log('apple' < 'banana') // true (dictionary order)

// String comparison uses Unicode code points
console.log('2' > '12') // true ('2' Unicode is greater than '1')
```

#### Special Comparison Values

```js
console.log(NaN === NaN) // false
console.log(Object.is(NaN, NaN)) // true

console.log(+0 === -0) // true
console.log(Object.is(+0, -0)) // false

console.log(Object.is(null, undefined)) // false
```

### Logical Operators

#### Form 1: Logical AND — &&

```js
// If first value is falsy, return first value
// If first value is truthy, return second value

console.log(true && false) // false
console.log(true && 'hello') // 'hello'
console.log(0 && 'hello') // 0
console.log('' && 'world') // ''

// Short-circuit evaluation
const user = null
const userName = user && user.name // null (won't access user.name)

// Optional chaining alternative
const name = user && user.name // Equivalent to user?.name
```

#### Form 2: Logical OR — ||

```js
// If first value is truthy, return first value
// If first value is falsy, return second value

console.log(true || false) // true
console.log('hello' || 'default') // 'hello'
console.log('' || 'default') // 'default'
console.log(0 || 100) // 100

// Default value setting
const port = process.env.PORT || 3000
const userName = input || 'Guest'
```

#### Form 3: Logical NOT — !

```js
// Convert to boolean and negate

console.log(!true) // false
console.log(!false) // true
console.log(!0) // true
console.log(!'') // true
console.log(!null) // true
console.log(!undefined) // true
console.log(!NaN) // true

// Double negation to boolean
console.log(!!'hello') // true
console.log(!!0) // false
console.log(!!{}) // true
console.log(!![]) // true
```

#### Form 4: Nullish Coalescing — ??

```js
// Only use default when null or undefined
// Difference from ||: ?? only checks null/undefined, not other falsy values

console.log(0 ?? 100) // 0 (not null/undefined)
console.log('' ?? 'default') // '' (not null/undefined)
console.log(null ?? 'default') // 'default'
console.log(undefined ?? 'default') // 'default'

// Practical application
const config = {
  timeout: 0, // Explicitly set to 0
  retries: null // Not set
}

const timeout = config.timeout ?? 5000 // 0
const retries = config.retries ?? 3 // 3
```

#### Logical Assignment Operators

```js
let a = null
let b = 0
let c = 'hello'

a ??= 'default' // a = a ?? 'default' → 'default'
b ||= 100       // b = b || 100 → 100
b &&= 200       // b = b && 200 → 200 (because b is truthy)

// Practical application: Config object
function createConfig(options) {
  options.timeout ??= 5000
  options.retries ??= 3
  options.debug ??= false
  return options
}
```

### Bitwise Operators

#### Form 1: Bitwise AND, OR, XOR

```js
const a = 5 // Binary: 101
const b = 3 // Binary: 011

console.log(a & b) // 1  (001) - Both 1 to be 1
console.log(a | b) // 7  (111) - Either 1 to be 1
console.log(a ^ b) // 6  (110) - Different to be 1
console.log(~a)    // -6 (two's complement) - Bitwise NOT
```

#### Form 2: Bit Shifting

```js
const num = 8 // Binary: 1000

console.log(num << 1)  // 16 (10000) - Left shift 1, equivalent to multiply by 2
console.log(num >> 1)  // 4  (100)   - Right shift 1, equivalent to divide by 2
console.log(num >>> 1) // 4  (unsigned right shift)

// Fast multiply/divide by powers of 2
const x = 10
console.log(x << 3) // 80 (x * 8)
console.log(x >> 2) // 2  (x / 4)
```

#### Practical Application: Permission System

```js
// Use bitwise operations for permission flags
const Permissions = {
  READ: 1 << 0,   // 0001 = 1
  WRITE: 1 << 1,  // 0010 = 2
  EXECUTE: 1 << 2,// 0100 = 4
  DELETE: 1 << 3  // 1000 = 8
}

// Combine permissions
const userPermissions = Permissions.READ | Permissions.WRITE // 0011 = 3

// Check permission
function hasPermission(userPerms, perm) {
  return (userPerms & perm) === perm
}

console.log(hasPermission(userPermissions, Permissions.READ)) // true
console.log(hasPermission(userPermissions, Permissions.DELETE)) // false

// Add permission
userPermissions |= Permissions.EXECUTE

// Remove permission
userPermissions &= ~Permissions.WRITE
```

### Assignment Operators

#### Form 1: Basic and Compound Assignment

```js
let x = 10

x += 5  // x = x + 5  → 15
x -= 3  // x = x - 3  → 12
x *= 2  // x = x * 2  → 24
x /= 4  // x = x / 4  → 6
x %= 4  // x = x % 4  → 2
x **= 3 // x = x ** 3 → 8
```

#### Form 2: Destructuring Assignment

```js
// Array destructuring
const [a, b, c] = [1, 2, 3]
const [first, ...rest] = [1, 2, 3, 4, 5]
const [, second, , fourth] = [1, 2, 3, 4]

// Object destructuring
const user = { name: 'John', age: 30, city: 'NYC' }
const { name, age } = user
const { name: userName, age: userAge } = user // Rename
const { country = 'USA' } = user // Default value

// Nested destructuring
const person = {
  info: { name: 'John', address: { city: 'NYC' } }
}
const { info: { address: { city } } } = person

// Function parameter destructuring
function greet({ name, age = 18 }) {
  return `Hello ${name}, you are ${age}`
}
```

### Conditional (Ternary) Operator

#### Form 1: Basic Usage

```js
const age = 20
const status = age >= 18 ? 'adult' : 'minor'

// Equivalent to
let status
if (age >= 18) {
  status = 'adult'
} else {
  status = 'minor'
}
```

#### Form 2: Nested Ternary (Avoid Overuse)

```js
const score = 85
const grade = score >= 90 ? 'A' :
              score >= 80 ? 'B' :
              score >= 70 ? 'C' :
              score >= 60 ? 'D' : 'F'

// Complex logic better uses if-else or lookup table
const gradeMap = { 90: 'A', 80: 'B', 70: 'C', 60: 'D' }
function getGrade(score) {
  for (const [min, grade] of Object.entries(gradeMap)) {
    if (score >= min) return grade
  }
  return 'F'
}
```

### Optional Chaining Operator

#### Form 1: Property Access

```js
const user = {
  profile: {
    name: 'John',
    address: {
      city: 'NYC'
    }
  }
}

// Traditional approach
const city = user && user.profile && user.profile.address && user.profile.address.city

// Optional chaining
const city = user?.profile?.address?.city // 'NYC'

// Returns undefined if intermediate property doesn't exist
const zip = user?.profile?.address?.zip // undefined (no error)
```

#### Form 2: Method Calls

```js
const user = {
  greet() {
    return 'Hello!'
  }
}

console.log(user.greet?.()) // 'Hello!'
console.log(user.sayGoodbye?.()) // undefined (no error)

// Combine with nullish coalescing for default
const greeting = user.greet?.() ?? 'Hi there'
```

#### Form 3: Arrays and Function Calls

```js
const users = [
  { name: 'John', hobbies: ['reading', 'gaming'] }
]

console.log(users[0]?.hobbies?.[0]) // 'reading'
console.log(users[1]?.hobbies?.[0]) // undefined

// Dynamic property
const key = 'name'
console.log(user?.[key]) // 'John'
```

### Other Operators

#### Form 1: typeof — Type Detection

```js
console.log(typeof 'hello') // 'string'
console.log(typeof 42) // 'number'
console.log(typeof true) // 'boolean'
console.log(typeof undefined) // 'undefined'
console.log(typeof Symbol()) // 'symbol'
console.log(typeof 123n) // 'bigint'
console.log(typeof {}) // 'object'
console.log(typeof []) // 'object'
console.log(typeof function() {}) // 'function'
console.log(typeof null) // 'object' (historical bug)
```

#### Form 2: instanceof — Prototype Detection

```js
const arr = []
const date = new Date()

console.log(arr instanceof Array) // true
console.log(date instanceof Date) // true
console.log(arr instanceof Object) // true (inheritance chain)
```

#### Form 3: in — Property Detection

```js
const user = { name: 'John', age: 30 }

console.log('name' in user) // true
console.log('toString' in user) // true (inherited from prototype)
console.log('salary' in user) // false

// Array index
const arr = ['a', 'b', 'c']
console.log(0 in arr) // true
console.log(3 in arr) // false
```

#### Form 4: delete — Delete Property

```js
const user = { name: 'John', age: 30 }

delete user.age
console.log(user) // { name: 'John' }
console.log('age' in user) // false

// Cannot delete variables (error in strict mode)
let x = 10
// delete x // ❌ SyntaxError in strict mode

// Cannot delete non-configurable properties
delete Object.prototype // false (won't delete)
```

#### Form 5: void — Returns undefined

```js
// void expression always returns undefined
console.log(void 0) // undefined
console.log(void (1 + 2)) // undefined

// Traditional usage: javascript: pseudo-protocol
// <a href="javascript:void(0)">Click</a>

// Modern alternative: use event.preventDefault()
```

### Operator Precedence

```text
Highest precedence (executed first):
  1. Grouping ()
  2. Member access . []
  3. new (with argument list)
  4. Function call ()
  5. Optional chaining ?.
  6. new (without argument list)
  7. Postfix increment/decrement ++ --
  8. Logical NOT !, Bitwise NOT ~, typeof, void, delete
  9. Unary plus/minus + -
  10. Exponentiation **
  11. Multiplication/division/modulo * / %
  12. Addition/subtraction + -
  13. Bitwise shift << >> >>>
  14. Comparison < <= > >= in instanceof
  15. Equality == != === !==
  16. Bitwise AND &
  17. Bitwise XOR ^
  18. Bitwise OR |
  19. Logical AND &&
  20. Logical OR ||
  21. Nullish coalescing ??
  22. Conditional ?:
  23. Assignment = += -= etc.
  24. yield, yield*
  25. Comma ,
Lowest precedence (executed last)
```

#### Precedence Examples

```js
// Ambiguous code
const result = 1 + 2 * 3 // 7 or 9?
// Multiplication has higher precedence: 1 + (2 * 3) = 7

// Use parentheses to clarify intent
const result = (1 + 2) * 3 // 9

// Complex expression
const value = a + b * c ** d - e / f
// Equivalent to: a + (b * (c ** d)) - (e / f)

// Logical operator precedence
const x = a || b && c
// Equivalent to: a || (b && c)
// If you need (a || b) && c, must use parentheses
```

### Common Gotchas

1. **+ Operator's Dual Role**
   ```js
   console.log(1 + 2) // 3 (addition)
   console.log('1' + 2) // '12' (string concatenation)
   console.log(1 + '2') // '12' (string concatenation)
   console.log(1 + 2 + '3') // '33' (add then concatenate)
   console.log('1' + 2 + 3) // '123' (all concatenated)
   ```

2. **== vs === Pitfalls**
   ```js
   console.log('' == false) // true
   console.log('' == 0) // true
   console.log(0 == '0') // true
   console.log(false == '0') // true
   
   // Always use ===
   ```

3. **NaN Comparison**
   ```js
   console.log(NaN == NaN) // false
   console.log(NaN === NaN) // false
   console.log(NaN != NaN) // true
   
   // Correct detection
   console.log(Number.isNaN(NaN)) // true
   ```

4. **Logical Operators Return Operands**
   ```js
   // Not returning boolean, but returning one of the operands
   console.log('hello' && 'world') // 'world'
   console.log(0 || 'default') // 'default'
   console.log(null ?? 'fallback') // 'fallback'
   ```

5. **Bitwise Operation Traps**
   ```js
   // Bitwise operations convert operands to 32-bit integers
   console.log(1 << 31) // -2147483648 (overflow)
   console.log((1 << 31) >>> 0) // 2147483648 (unsigned conversion)
   
   // Floating points are truncated
   console.log(3.7 | 0) // 3
   console.log(-3.7 | 0) // -3 (truncate toward zero)
   ```

#### Quick Decision Guide
```typescript
Arithmetic operations?
  └── Integer operations? → Normal + - * /
  └── Floating point precision sensitive? → Use integers or library
  └── Fast multiply/divide powers of 2? → Bitwise << >>

Comparison operations?
  └── Always use → === and !==
  └── Need type conversion? → Explicit conversion then compare

Logical operations?
  └── Short-circuit default values? → || (when falsy)
  └── Only null/undefined default? → ??
  └── Conditional execution? → &&

Bitwise operations?
  └── Permission flags? → | & ^
  └── Performance optimization? → Use cautiously, modern engines optimize well
  └── Readability priority? → Avoid complex bitwise operations

Optional chaining?
  └── Deep property access may not exist? → ?.
  └── Provide default value? → ?. ?? default
```

---

## Chapter Summary

- Arithmetic operators: `+` `-` `*` `/` `%` `**`, watch floating point precision
- Comparison operators: Always use `===` and `!==`
- Logical operators: `&&` `||` `!`, support short-circuit evaluation
- Nullish coalescing `??` only works for null/undefined, different from `||`
- Optional chaining `?.` safely accesses deep properties
- Destructuring assignment simplifies variable extraction
- Understand operator precedence, use parentheses for complex expressions
