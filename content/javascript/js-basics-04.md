---
title: Control Flow
date: 2026-04-06
tags: [JavaScript]
---

## Control Flow

### What is Control Flow?

**Control flow** determines the order in which statements are executed in a program. JavaScript provides various control structures for conditional execution and iteration.

### Conditional Statements

#### Form 1: if...else — Basic Conditional

When to use: Execute code based on a condition.

```js
const age = 20

if (age >= 18) {
  console.log('Adult')
} else {
  console.log('Minor')
}

// Multiple conditions
const score = 85
if (score >= 90) {
  console.log('A')
} else if (score >= 80) {
  console.log('B')
} else if (score >= 70) {
  console.log('C')
} else {
  console.log('D')
}
```

**Truthy and Falsy Values:**

| Falsy | Truthy |
|-------|--------|
| `false` | `true` |
| `0` | Non-zero numbers |
| `""` (empty string) | Non-empty strings |
| `null` | Objects |
| `undefined` | Arrays |
| `NaN` | Functions |

```js
// Condition is coerced to boolean
const name = ''
if (name) {
  console.log('Has name')
} else {
  console.log('No name') // This runs
}
```

#### Form 2: switch — Multiple Branch Selection

When to use: Compare a value against multiple possible matches.

```js
const day = 3
let dayName

switch (day) {
  case 1:
    dayName = 'Monday'
    break
  case 2:
    dayName = 'Tuesday'
    break
  case 3:
    dayName = 'Wednesday'
    break
  case 4:
    dayName = 'Thursday'
    break
  case 5:
    dayName = 'Friday'
    break
  default:
    dayName = 'Weekend'
}

console.log(dayName) // Wednesday
```

**Multiple cases with same result:**

```js
const grade = 'B'

switch (grade) {
  case 'A':
  case 'B':
  case 'C':
    console.log('Passed')
    break
  case 'D':
  case 'F':
    console.log('Failed')
    break
  default:
    console.log('Invalid grade')
}
```

**switch vs if-else:**

| switch | if-else |
|--------|---------|
| Equality comparison only | Any condition |
| More readable for many cases | More flexible |
| Uses strict equality (===) | Any comparison |
| Falls through without break | No fall-through |

#### Form 3: Ternary Operator — Concise Conditional

When to use: Simple conditional assignment.

```js
const age = 20
const status = age >= 18 ? 'adult' : 'minor'

// Nested ternary (use sparingly)
const category = age < 13 ? 'child' :
                 age < 20 ? 'teenager' :
                 age < 65 ? 'adult' : 'senior'

// Multiple operations with comma operator
const result = condition
  ? (console.log('true'), 'yes')
  : (console.log('false'), 'no')
```

### Loops

#### Form 1: for — Classic Loop

When to use: Known iteration count, array iteration.

```js
// Basic for loop
for (let i = 0; i < 5; i++) {
  console.log(i) // 0, 1, 2, 3, 4
}

// Iterate array
const fruits = ['apple', 'banana', 'cherry']
for (let i = 0; i < fruits.length; i++) {
  console.log(fruits[i])
}

// Multiple variables
for (let i = 0, j = 10; i < j; i++, j--) {
  console.log(i, j)
}

// Skip increment (custom logic)
for (let i = 0; i < 10;) {
  if (i % 2 === 0) {
    console.log(i)
  }
  i++
}
```

#### Form 2: while — Pre-condition Loop

When to use: Unknown iteration count, condition-based.

```js
let count = 0

while (count < 5) {
  console.log(count)
  count++
}

// User input simulation
let input = ''
while (input !== 'quit') {
  input = getUserInput() // hypothetical function
  processInput(input)
}
```

#### Form 3: do...while — Post-condition Loop

When to use: Execute at least once, then check condition.

```js
let num

do {
  num = Math.floor(Math.random() * 10)
  console.log(num)
} while (num !== 5)

// Menu system
let choice
do {
  showMenu()
  choice = getUserChoice()
  handleChoice(choice)
} while (choice !== 'exit')
```

#### Form 4: for...of — Iterate Iterable

When to use: Iterate over arrays, strings, Maps, Sets.

```js
// Array
const colors = ['red', 'green', 'blue']
for (const color of colors) {
  console.log(color)
}

// String
for (const char of 'Hello') {
  console.log(char)
}

// With index using entries()
for (const [index, color] of colors.entries()) {
  console.log(`${index}: ${color}`)
}

// Destructuring objects in array
const users = [
  { name: 'John', age: 30 },
  { name: 'Jane', age: 25 }
]
for (const { name, age } of users) {
  console.log(`${name} is ${age}`)
}
```

#### Form 5: for...in — Iterate Object Properties

When to use: Iterate over object keys (not recommended for arrays).

```js
const user = {
  name: 'John',
  age: 30,
  city: 'NYC'
}

for (const key in user) {
  console.log(`${key}: ${user[key]}`)
}

// ⚠️ for...in includes inherited properties
// Use hasOwnProperty to filter
for (const key in user) {
  if (user.hasOwnProperty(key)) {
    console.log(key)
  }
}
```

**for...of vs for...in:**

| for...of | for...in |
|----------|----------|
| Iterates values | Iterates keys |
| Works on iterables | Works on objects |
| Recommended for arrays | Not recommended for arrays |
| Does not include prototype | Includes inherited properties |

### Loop Control

#### Form 1: break — Exit Loop

When to use: Stop iteration early when condition is met.

```js
// Find first match
const numbers = [1, 2, 3, 4, 5, 6]
let found = null

for (const num of numbers) {
  if (num > 3) {
    found = num
    break // Exit loop immediately
  }
}
console.log(found) // 4

// break with label (nested loops)
outerLoop: for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (i === 1 && j === 1) {
      break outerLoop // Exit both loops
    }
    console.log(i, j)
  }
}
```

#### Form 2: continue — Skip Iteration

When to use: Skip current iteration and continue to next.

```js
// Skip even numbers
for (let i = 0; i < 10; i++) {
  if (i % 2 === 0) {
    continue // Skip to next iteration
  }
  console.log(i) // 1, 3, 5, 7, 9
}

// Process only valid items
const items = [1, null, 2, undefined, 3]
for (const item of items) {
  if (item == null) continue
  console.log(item * 2) // 2, 4, 6
}
```

### Exception Handling

#### Form 1: try...catch — Basic Error Handling

When to use: Handle expected errors gracefully.

```js
try {
  const result = riskyOperation()
  console.log(result)
} catch (error) {
  console.error('Operation failed:', error.message)
}

// Specific error types
function parseJSON(jsonString) {
  try {
    return JSON.parse(jsonString)
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error('Invalid JSON:', error.message)
      return null
    }
    throw error // Re-throw unexpected errors
  }
}
```

#### Form 2: try...catch...finally — Cleanup

When to use: Always execute cleanup code.

```js
const file = openFile('data.txt')

try {
  const content = file.read()
  processContent(content)
} catch (error) {
  console.error('Read failed:', error)
} finally {
  file.close() // Always execute
  console.log('File closed')
}
```

#### Form 3: throw — Custom Errors

When to use: Create application-specific errors.

```js
function divide(a, b) {
  if (b === 0) {
    throw new Error('Division by zero')
  }
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('Arguments must be numbers')
  }
  return a / b
}

// Custom error class
class ValidationError extends Error {
  constructor(field, message) {
    super(message)
    this.name = 'ValidationError'
    this.field = field
  }
}

function validateUser(user) {
  if (!user.email) {
    throw new ValidationError('email', 'Email is required')
  }
}
```

#### Error Types

```js
// Built-in error types
new Error('General error')
new TypeError('Type mismatch')
new RangeError('Value out of range')
new SyntaxError('Invalid syntax')
new ReferenceError('Variable not defined')
new URIError('URI malformed')
```

### Common Gotchas

1. **Off-by-one errors**
   ```js
   // ❌ Common mistake
   for (let i = 0; i <= array.length; i++) {
     console.log(array[i]) // undefined at last iteration
   }
   
   // ✅ Correct
   for (let i = 0; i < array.length; i++)
   ```

2. **Modifying array while iterating**
   ```js
   // ❌ Unexpected behavior
   const arr = [1, 2, 3, 4, 5]
   for (let i = 0; i < arr.length; i++) {
     if (arr[i] === 3) {
       arr.splice(i, 1) // Skips next element!
     }
   }
   
   // ✅ Filter creates new array
   const filtered = arr.filter(x => x !== 3)
   ```

3. **var in loop creates shared variable**
   ```js
   // ❌ All functions log 5
   for (var i = 0; i < 5; i++) {
     setTimeout(() => console.log(i), 100)
   }
   
   // ✅ Use let for block-scoped variable
   for (let i = 0; i < 5; i++) {
     setTimeout(() => console.log(i), 100) // 0, 1, 2, 3, 4
   }
   ```

4. **for...in with arrays includes indices as strings**
   ```js
   const arr = ['a', 'b', 'c']
   for (const i in arr) {
     console.log(typeof i) // 'string', not 'number'
   }
   ```

5. **Not handling all cases in switch**
   ```js
   switch (value) {
     case 'a':
       handleA()
       // Missing break!
     case 'b':
       handleB() // Also executes when value is 'a'
       break
   }
   ```

#### Quick Decision Guide
```typescript
Need conditional execution?
  └── Simple true/false? → if...else
  └── Multiple exact matches? → switch
  └── Simple value selection? → ternary

Need iteration?
  └── Known count / array index? → for
  └── Condition-based? → while / do...while
  └── Array values? → for...of
  └── Object keys? → for...in (with hasOwnProperty check)

Need to control loop flow?
  └── Exit early? → break
  └── Skip iteration? → continue

Need error handling?
  └── Expected errors? → try...catch
  └── Cleanup required? → try...catch...finally
  └── Custom error? → throw / Error class
```

### Best Practices

```js
// 1. Prefer for...of over for loop for arrays
const items = [1, 2, 3]
for (const item of items) {
  console.log(item)
}

// 2. Use array methods instead of loops when possible
const doubled = items.map(x => x * 2)
const evens = items.filter(x => x % 2 === 0)
const sum = items.reduce((a, b) => a + b, 0)

// 3. Early return instead of nested if
function processUser(user) {
  if (!user) return null
  if (!user.active) return null
  
  return processActiveUser(user)
}

// 4. Don't suppress errors silently
try {
  riskyOperation()
} catch (error) {
  // ❌ Empty catch hides bugs
}

// ✅ Log or handle meaningfully
try {
  riskyOperation()
} catch (error) {
  logger.error('Operation failed', error)
  showUserFriendlyMessage()
}
```

---

## Chapter Summary

- Use `if...else` for general conditions, `switch` for multiple exact matches
- Prefer `for...of` for array iteration, avoid `for...in` for arrays
- Use `break` and `continue` to control loop flow
- Always handle errors with `try...catch`, use `finally` for cleanup
- Create custom error classes for application-specific errors
- Use array methods (map, filter, reduce) instead of manual loops when possible
