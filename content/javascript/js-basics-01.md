---
title: JavaScript Introduction and Environment
date: 2026-04-06
tags: [JavaScript]
---

## JavaScript Introduction and Environment

### What is JavaScript

`JavaScript` is a lightweight, interpreted programming language and one of the core technologies of web development (alongside HTML and CSS). Originally designed for web page interactivity in browsers, it has evolved into a full-stack development language.

**Core Characteristics:**
- **Dynamic typing** — Variable types are determined at runtime
- **Prototype-based inheritance** — Object-oriented programming via prototypes
- **First-class functions** — Functions can be passed as values
- **Event-driven** — Suitable for asynchronous programming models
- **Single-threaded** — Concurrency achieved through event loop

#### JavaScript History Timeline

| Year | Milestone |
|------|-----------|
| 1995 | Brendan Eich created LiveScript (later renamed JavaScript) at Netscape |
| 1997 | ECMAScript 1 released, first standardization |
| 2009 | ES5 released, introduced strict mode and JSON support |
| 2015 | ES6/ES2015 released, beginning of modern JavaScript |
| 2016+ | Annual release cycle, continuous new features |

### Runtime Environments

JavaScript can run in multiple environments:

#### Form 1: Browser Environment — Client-side Scripts

When to use: Web page interactivity, DOM manipulation, frontend applications.

```html
<!-- Inline script -->
<script>
  console.log('Hello from browser!')
</script>

<!-- External script -->
<script src="app.js" type="module"></script>
```

**Global objects provided by browser:**
- `window` — Global object
- `document` — DOM manipulation
- `console` — Debug output
- `fetch` — Network requests
- `localStorage` — Local storage

#### Form 2: Node.js Environment — Server-side Runtime

When to use: Server applications, CLI tools, build scripts.

```bash
# Run JS file
node app.js

# REPL interactive mode
node
> 1 + 1
2
```

**Global objects provided by Node.js:**
- `global` — Global object (similar to window in browser)
- `process` — Process information
- `Buffer` — Binary data handling
- `require`/`module.exports` — Module system

#### Form 3: Modern Runtimes — Deno and Bun

When to use: Exploring new features, pursuing performance or security.

```bash
# Deno - Secure TypeScript/JavaScript runtime
deno run --allow-net app.ts

# Bun - Fast JavaScript runtime
bun run app.js
```

**Comparison:**

| Feature | Node.js | Deno | Bun |
|---------|---------|------|-----|
| Module system | CommonJS + ESM | Native ESM | CommonJS + ESM |
| TypeScript | Requires compilation | Native support | Native support |
| Package manager | npm/yarn/pnpm | URL imports | Built-in package manager |
| Security | No sandbox | Permission system | No sandbox |
| Performance | Mature and stable | Medium | Extremely fast |

### Development Toolchain

#### Form 1: Code Editors

**VS Code** (Recommended):
```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

#### Form 2: Debugging Tools

**Browser DevTools:**
```js
// Use debugger statement to set breakpoints
function calculate(x) {
  debugger // Execution pauses here
  return x * 2
}
```

**Node.js Debugging:**
```bash
# Use built-in debugger
node inspect app.js

# Use Chrome DevTools
node --inspect-brk app.js
```

#### Form 3: REPL Environment

```bash
# Node.js REPL
$ node
> const x = 10
undefined
> x * 2
20
> .help  # View all commands
> .exit  # Exit
```

### First Program

#### Hello World

```js
// hello.js
console.log('Hello, World!')
```

```bash
node hello.js
# Output: Hello, World!
```

#### Interactive Example

```js
// Simple calculator
const a = 10
const b = 20
const sum = a + b

console.log(`${a} + ${b} = ${sum}`)
// Output: 10 + 20 = 30
```

### Strict Mode

`"use strict"` enables strict mode to help catch common errors.

#### Form 1: Global Strict Mode

```js
// Top of file
'use strict'

// Following code runs in strict mode
x = 10 // ❌ ReferenceError: x is not defined
```

#### Form 2: Function-level Strict Mode

```js
function strictFunction() {
  'use strict'
  // Only this function body is in strict mode
}

function normalFunction() {
  // Non-strict mode
  x = 10 // ✅ Allowed (creates global variable)
}
```

#### Form 3: Module Automatic Strict Mode

```js
// ES modules automatically enable strict mode
// No need for 'use strict'
export function greet() {
  return 'Hello'
}
```

**Main restrictions of strict mode:**
1. Must declare variables (prohibits implicit globals)
2. Prohibits deleting variables (`delete x`)
3. Prohibits duplicate parameter names
4. Prohibits octal literals (`010`)
5. `this` no longer auto-boxed to object

### Code Structure

#### Statements and Semicolons

```js
// JavaScript uses semicolons as statement separators (ASI automatic semicolon insertion)
const x = 1
const y = 2  // ASI inserts semicolon here automatically

// But recommend explicit semicolons to avoid surprises
const a = 1;
const b = 2;
```

#### Comments

```js
// Single-line comment

/*
  Multi-line comment
  Can write many lines
*/

/**
 * JSDoc comment
 * @param {number} x - Input number
 * @returns {number} Calculation result
 */
function double(x) {
  return x * 2
}
```

#### Code Blocks

```js
// Use curly braces to define code blocks
{
  const x = 10
  console.log(x) // 10
}
// console.log(x) // ❌ x is not defined

// Code blocks commonly used in control structures
if (true) {
  const y = 20
  console.log(y)
}
```

### Common Gotchas

1. **Case-sensitive** — JavaScript is case-sensitive
   ```js
   const name = 'John'
   console.log(Name) // ❌ ReferenceError: Name is not defined
   ```

2. **Character encoding** — Source files should use UTF-8
   ```js
   const message = '你好，世界！' // ✅ Supports Unicode
   ```

3. **Runtime environment differences** — Browser and Node.js have different global objects
   ```js
   // Browser
   console.log(window) // ✅
   
   // Node.js
   console.log(global) // ✅
   console.log(window) // ❌ window is not defined
   ```

4. **Module system confusion** — CommonJS and ESM cannot be mixed
   ```js
   // ❌ Error: Mixing module systems
   const fs = require('fs') // CommonJS
   export function foo() {} // ESM
   
   // ✅ Correct: Unified use of ESM
   import fs from 'fs'
   export function foo() {}
   ```

#### Quick Decision Guide
```typescript
Development environment choice?
  └── Web frontend? → Browser + DevTools
  └── Backend service? → Node.js
  └── Modern TypeScript project? → Deno or Bun
  └── Production environment? → Node.js (most mature)

Code style?
  └── New project? → Enable strict mode
  └── Module project? → Use ESM (import/export)
  └── Legacy project? → Gradually migrate to modern standards
```

### Learning Roadmap

```
Basics Stage
  ├── Variables, data types, operators
  ├── Control flow, functions
  ├── Objects, arrays
  └── Scope, closures

Intermediate Stage
  ├── Prototypes, classes
  ├── Asynchronous programming (Promise, async/await)
  ├── ES6+ new features
  └── Modules

Advanced Stage
  ├── Functional programming
  ├── Performance optimization
  ├── Design patterns
  └── Source code reading

Engineering Stage
  ├── TypeScript
  ├── Testing
  ├── Build tools
  └── Architecture design
```

### Further Reading

- **MDN Web Docs**: https://developer.mozilla.org/en-US/docs/Web/JavaScript
- **Node.js Documentation**: https://nodejs.org/docs/
- **ECMAScript Specification**: https://tc39.es/ecma262/

---

## Chapter Summary

- JavaScript is dynamic, interpreted, single-threaded language
- Can run in browser, Node.js, Deno, Bun, and other environments
- Use strict mode (`"use strict"`) to avoid common mistakes
- Choose appropriate toolchain (VS Code + Node.js is mainstream choice)
