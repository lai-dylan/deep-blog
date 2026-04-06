---
title: Meta Programming - Proxy, Reflect, Symbol
date: 2026-04-06
tags: [JavaScript]
---

## Meta Programming

### Symbol

Unique, immutable primitive values.

```js
const sym1 = Symbol('description')
const sym2 = Symbol('description')
console.log(sym1 === sym2) // false

// Global symbols
const global = Symbol.for('app.id')
const same = Symbol.for('app.id')
console.log(global === same) // true

// Well-known symbols
Symbol.iterator
Symbol.toStringTag
Symbol.hasInstance
```

### Proxy

Intercept object operations.

```js
const handler = {
  get(target, prop) {
    console.log('Getting', prop)
    return target[prop]
  },
  set(target, prop, value) {
    console.log('Setting', prop, value)
    target[prop] = value
    return true
  }
}

const proxy = new Proxy({}, handler)
proxy.name = 'John' // Setting name John
console.log(proxy.name) // Getting name
```

#### Form 1: Validation

```js
const validator = {
  set(target, prop, value) {
    if (prop === 'age' && typeof value !== 'number') {
      throw new TypeError('Age must be number')
    }
    target[prop] = value
    return true
  }
}

const person = new Proxy({}, validator)
person.age = 30 // OK
// person.age = '30' // Error
```

#### Form 2: Private Properties

```js
const withPrivate = (obj) => {
  const privateProps = new Set(['_password'])
  
  return new Proxy(obj, {
    get(target, prop) {
      if (privateProps.has(prop)) {
        throw new Error('Private property')
      }
      return target[prop]
    }
  })
}
```

### Reflect

Programmatic object manipulation.

```js
const obj = { name: 'John' }

Reflect.get(obj, 'name') // John
Reflect.set(obj, 'age', 30) // true
Reflect.has(obj, 'name') // true
Reflect.deleteProperty(obj, 'name') // true
Reflect.getPrototypeOf(obj) // Object.prototype
Reflect.apply(Math.max, null, [1, 2, 3]) // 3
Reflect.construct(Date, []) // Date instance
```

### Common Gotchas

1. Proxies are transparent - obj === proxy is false
2. Performance overhead for heavy use
3. Not all operations can be trapped

#### Quick Decision Guide
```typescript
Need unique keys? → Symbol
Need to intercept operations? → Proxy
Need to introspect objects? → Reflect
```
