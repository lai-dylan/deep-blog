---
title: Scope and Closures
date: 2026-04-06
tags: [JavaScript]
---

## Scope and Closures

### What is Scope?

**Scope** determines the accessibility (visibility) of variables and functions in your code. It defines where variables can be referenced.

### Types of Scope

#### Form 1: Global Scope

When to use: Avoid when possible; use for truly global constants.

```js
// In browser
var globalVar = 'I am global'
window.globalVar // 'I am global'

// In Node.js
global.nodeGlobal = 'Node global'

// ES modules have their own scope
// Variables declared at top level are module-scoped, not global
const moduleScoped = 'Not truly global'
```

**Global scope problems:**
- Name collisions
- Hard to test
- Side effects
- Security risks

**Minimize global variables:**
```js
// ❌ Bad
var count = 0
function increment() {
  count++
}

// ✅ Better - use modules
// counter.js
let count = 0
export function increment() {
  return ++count
}
export function getCount() {
  return count
}
```

#### Form 2: Function Scope

When to use: Encapsulate logic (legacy, with `var`).

```js
function outer() {
  var functionScoped = 'Inside function'
  console.log(functionScoped) // Works
}

outer()
// console.log(functionScoped) // ReferenceError

// var is function-scoped, not block-scoped
function example() {
  if (true) {
    var x = 10
  }
  console.log(x) // 10 - accessible outside if block
}
```

#### Form 3: Block Scope

When to use: Limit variable lifetime to specific block.

```js
if (true) {
  let blockScoped = 'Inside block'
  const alsoBlockScoped = 'Me too'
  console.log(blockScoped) // Works
}

// console.log(blockScoped) // ReferenceError

// for loop with block scope
for (let i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i) // 0, 1, 2 (each iteration has own i)
  }, 100)
}

// Compare with var (function scope)
for (var j = 0; j < 3; j++) {
  setTimeout(() => {
    console.log(j) // 3, 3, 3 (all share same j)
  }, 100)
}
```

**Block scope with let/const:**
```js
{
  const private = 'secret'
  let counter = 0
  
  function increment() {
    return ++counter
  }
  
  console.log(increment()) // 1
}

// console.log(counter) // ReferenceError
// console.log(private) // ReferenceError
```

#### Form 4: Module Scope

When to use: Modern JavaScript organization (ES6 modules).

```js
// math.js
const PI = 3.14159 // Module-scoped

export function circleArea(radius) {
  return PI * radius * radius
}

export function circleCircumference(radius) {
  return 2 * PI * radius
}

// main.js
import { circleArea } from './math.js'

// PI is not accessible here
console.log(circleArea(5)) // 78.53975
```

### Scope Chain

JavaScript uses **lexical scoping**—scope is determined by where variables/functions are declared in the source code.

```js
const global = 'global'

function outer() {
  const outerVar = 'outer'
  
  function inner() {
    const innerVar = 'inner'
    console.log(innerVar)  // 'inner' - found in inner scope
    console.log(outerVar)  // 'outer' - found in outer scope
    console.log(global)    // 'global' - found in global scope
  }
  
  inner()
}

outer()
```

**Scope chain lookup:**
1. Current scope
2. Outer scope
3. Next outer scope
4. ... until global

```js
const x = 'global x'

function a() {
  const x = 'a x'
  function b() {
    // console.log(x) would find 'a x'
    function c() {
      const x = 'c x'
      console.log(x) // 'c x' - stops at nearest definition
    }
    c()
  }
  b()
}

a()
```

### Hoisting

**Hoisting** moves declarations to the top of their scope (conceptually).

#### Variable Hoisting

```js
// var hoisting
console.log(a) // undefined (hoisted, but not initialized)
var a = 10

// Equivalent to:
var a
console.log(a)
a = 10

// let/const hoisting (TDZ - Temporal Dead Zone)
console.log(b) // ReferenceError: Cannot access before initialization
let b = 20

console.log(c) // ReferenceError
const c = 30
```

#### Function Hoisting

```js
// Function declarations are hoisted
sayHello() // Works!

function sayHello() {
  console.log('Hello')
}

// Function expressions are NOT hoisted
sayGoodbye() // TypeError: sayGoodbye is not a function

var sayGoodbye = function() {
  console.log('Goodbye')
}
```

**Hoisting order:**
```js
// 1. Function declarations
// 2. var declarations
// 3. Code execution

var x = 'outer'

function example() {
  console.log(x) // undefined, not 'outer'
  var x = 'inner'
}

// Equivalent:
function example() {
  var x // hoisted
  console.log(x) // undefined
  x = 'inner'
}
```

### Closures

A **closure** is a function that remembers and accesses its lexical scope even when executed outside that scope.

#### Form 1: Basic Closure

When to use: Data encapsulation, private variables.

```js
function makeCounter() {
  let count = 0 // Private variable
  
  return {
    increment() {
      return ++count
    },
    decrement() {
      return --count
    },
    getCount() {
      return count
    }
  }
}

const counter1 = makeCounter()
const counter2 = makeCounter()

console.log(counter1.increment()) // 1
console.log(counter1.increment()) // 2
console.log(counter2.increment()) // 1 (separate closure)

console.log(counter1.getCount()) // 2
console.log(counter2.getCount()) // 1
```

#### Form 2: Factory Functions

When to use: Create objects with private state.

```js
function createUser(name) {
  // Private data
  let password = ''
  let loginAttempts = 0
  
  return {
    getName() {
      return name
    },
    setPassword(newPassword) {
      password = newPassword
    },
    login(attempt) {
      loginAttempts++
      return attempt === password
    },
    getAttempts() {
      return loginAttempts
    }
  }
}

const user = createUser('John')
user.setPassword('secret')
console.log(user.login('secret')) // true
console.log(user.getAttempts()) // 1
```

#### Form 3: Callbacks and Async

When to use: Maintain state across asynchronous operations.

```js
function setupButton(buttonId, message) {
  const button = document.getElementById(buttonId)
  
  // Closure captures message
  button.addEventListener('click', () => {
    console.log(message) // Still has access to message
  })
}

setupButton('btn1', 'Button 1 clicked')
setupButton('btn2', 'Button 2 clicked')
```

#### Form 4: Function Composition

When to use: Build complex behavior from simple functions.

```js
function makeAdder(x) {
  return function(y) {
    return x + y
  }
}

const add5 = makeAdder(5)
const add10 = makeAdder(10)

console.log(add5(2)) // 7
console.log(add10(2)) // 12

// Practical: Partial application
function partial(fn, ...presetArgs) {
  return function(...laterArgs) {
    return fn(...presetArgs, ...laterArgs)
  }
}

const multiply = (a, b, c) => a * b * c
const double = partial(multiply, 2)
const multiplyBySix = partial(multiply, 2, 3)

console.log(double(5, 10)) // 100
console.log(multiplyBySix(10)) // 60
```

### Module Pattern

The classic JavaScript module pattern uses closures for encapsulation.

#### Form 1: IIFE Module

```js
const myModule = (function() {
  // Private variables
  let privateVar = 0
  
  // Private function
  function privateMethod() {
    return privateVar
  }
  
  // Public API
  return {
    increment() {
      return ++privateVar
    },
    getValue() {
      return privateMethod()
    }
  }
})()

console.log(myModule.increment()) // 1
console.log(myModule.getValue()) // 1
// myModule.privateVar // undefined
```

#### Form 2: Revealing Module Pattern

```js
const calculator = (function() {
  let result = 0
  
  function add(x) {
    result += x
  }
  
  function subtract(x) {
    result -= x
  }
  
  function getResult() {
    return result
  }
  
  // Reveal only what we want public
  return {
    add,
    subtract,
    get: getResult
  }
})()
```

#### Form 3: ES6 Module (Modern Replacement)

```js
// counter.js
let count = 0

export function increment() {
  return ++count
}

export function getCount() {
  return count
}

// main.js
import { increment, getCount } from './counter.js'
```

### Memory Considerations

Closures keep references to outer scope variables, preventing garbage collection.

```js
// Potential memory leak
function createHeavyObject() {
  const bigData = new Array(1000000).fill('data')
  
  return {
    getLength() {
      return bigData.length // Keeps reference to bigData
    }
  }
}

// If you only need length, don't capture entire array
function createLightObject() {
  const bigData = new Array(1000000).fill('data')
  const length = bigData.length
  
  return {
    getLength() {
      return length // Only captures length
    }
  }
}
```

### Common Gotchas

1. **Loop closure trap**
   ```js
   // ❌ All buttons alert "Button 5"
   for (var i = 0; i < 5; i++) {
     document.getElementById(`btn${i}`).addEventListener('click', () => {
       alert(`Button ${i}`)
     })
   }
   
   // ✅ Solution 1: Use let (block scope)
   for (let i = 0; i < 5; i++) {
     document.getElementById(`btn${i}`).addEventListener('click', () => {
       alert(`Button ${i}`)
     })
   }
   
   // ✅ Solution 2: IIFE closure
   for (var i = 0; i < 5; i++) {
     (function(capturedI) {
       document.getElementById(`btn${capturedI}`).addEventListener('click', () => {
         alert(`Button ${capturedI}`)
       })
     })(i)
   }
   ```

2. **this in closures**
   ```js
   const obj = {
     value: 42,
     getValue: function() {
       return this.value
     },
     delayedGetValue: function() {
       setTimeout(function() {
         console.log(this.value) // undefined - this is window
       }, 100)
     },
     arrowDelayedGetValue: function() {
       setTimeout(() => {
         console.log(this.value) // 42 - arrow preserves this
       }, 100)
     }
   }
   ```

3. **Accidental global with undeclared variable**
   ```js
   function leaky() {
     leak = 'I am global' // Forgot var/let/const
   }
   leaky()
   console.log(window.leak) // 'I am global'
   
   // Use strict mode to prevent
   'use strict'
   function strictLeaky() {
     leak = 'Error' // ReferenceError
   }
   ```

4. **Closure in class methods**
   ```js
   class Counter {
     constructor() {
       this.count = 0
     }
     
     // ❌ Loses this context
     start() {
       setInterval(function() {
         this.count++ // this is window, not Counter instance
       }, 1000)
     }
     
     // ✅ Arrow function preserves this
     startFixed() {
       setInterval(() => {
         this.count++ // this is Counter instance
       }, 1000)
     }
   }
   ```

#### Quick Decision Guide
```typescript
Variable scope?
  └── Global constant? → const at module level
  └── Function-wide? → function scope (avoid var)
  └── Block-limited? → let/const in block
  └── Module-private? → not exported from module

Closure usage?
  └── Private data? → Factory function returning object
  └── Event handlers? → Arrow function or bind
  └── State preservation? → Closure over variables
  └── Data hiding? → Module pattern or ES modules

Avoiding scope issues?
  └── Use strict mode
  └── Prefer let/const over var
  └── Minimize global variables
  └── Watch for this binding in callbacks
```

### Best Practices

```js
// 1. Minimize global scope pollution
// ❌ Bad
var config = { api: 'url' }

// ✅ Good
// config.js
const config = { api: 'url' }
export default config

// 2. Use closures for data privacy
// ❌ Exposed internals
class Stack {
  constructor() {
    this.items = []
  }
  push(item) {
    this.items.push(item)
  }
}

// ✅ Private by closure
function createStack() {
  const items = [] // Private
  return {
    push(item) {
      items.push(item)
    },
    pop() {
      return items.pop()
    },
    size() {
      return items.length
    }
  }
}

// 3. Be careful with closure memory
// ❌ Captures large object
function bad() {
  const big = new Array(1000000)
  return () => big.length
}

// ✅ Capture only what's needed
function good() {
  const big = new Array(1000000)
  const length = big.length
  return () => length
}

// 4. Use block scope for temporary variables
{
  const temp = computeExpensiveValue()
  process(temp)
}
// temp is not accessible here
```

---

## Chapter Summary

- Scope determines variable accessibility: global, function, block, module
- JavaScript uses lexical (static) scoping based on code structure
- Hoisting moves declarations to top; let/const have Temporal Dead Zone
- Closures allow functions to remember and access their outer scope
- Use closures for data encapsulation, private variables, and callbacks
- Minimize global variables; prefer ES modules for organization
- Watch for memory leaks and `this` binding issues with closures
