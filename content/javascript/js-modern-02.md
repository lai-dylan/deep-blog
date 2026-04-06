---
title: Modules - ESM vs CommonJS
date: 2026-04-06
tags: [JavaScript]
---

## Modules - ESM vs CommonJS

### Why Modules?

Modules help organize code into reusable, encapsulated units with clear dependencies.

### CommonJS

Node.js original module system.

```js
// Import
const fs = require('fs')
const utils = require('./utils')

// Export
module.exports = { add, subtract }
exports.multiply = multiply
```

### ES Modules

Standard JavaScript module system.

```js
// Import
import { readFile } from 'fs'
import React from 'react'
import * as utils from './utils.js'

// Export
export const PI = 3.14159
export function add(a, b) { return a + b }
export default class Component {}

// Dynamic import
const module = await import('./module.js')
```

### CJS vs ESM Comparison

| Feature | CommonJS | ES Modules |
|---------|----------|------------|
| Syntax | require/module.exports | import/export |
| Loading | Synchronous | Asynchronous |
| Tree-shaking | No | Yes |
| Browser support | No | Yes |
| Top-level await | No | Yes |

### Common Gotchas

1. File extensions required in ESM
2. Cannot require ESM from CJS
3. ESM has strict mode by default

#### Quick Decision Guide
```typescript
New project?
  └── Node.js 14+? → Use ESM
  └── Browser? → Use ESM
  └── Legacy Node.js? → CommonJS
```
