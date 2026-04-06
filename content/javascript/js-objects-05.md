---
title: Object-Oriented Design Patterns
date: 2026-04-06
tags: [JavaScript]
---

## Object-Oriented Design Patterns

### What are Design Patterns?

**Design patterns** are reusable solutions to common problems in software design. They provide a shared vocabulary and best practices for structuring code.

### Creational Patterns

#### Form 1: Factory Pattern

Creates objects without specifying the exact class.

```js
class User {
  constructor(name, role) {
    this.name = name
    this.role = role
  }
}

class Admin extends User {
  constructor(name) {
    super(name, 'admin')
  }
}

class Guest extends User {
  constructor(name) {
    super(name, 'guest')
  }
}

function createUser(type, name) {
  switch(type) {
    case 'admin': return new Admin(name)
    case 'guest': return new Guest(name)
    default: return new User(name, 'user')
  }
}
```

#### Form 2: Singleton Pattern

Ensures only one instance exists.

```js
class Database {
  static #instance = null
  
  static getInstance() {
    if (!Database.#instance) {
      Database.#instance = new Database()
    }
    return Database.#instance
  }
  
  constructor() {
    if (Database.#instance) {
      throw new Error('Use Database.getInstance()')
    }
  }
}
```

### Structural Patterns

#### Form 3: Module Pattern

Encapsulates private state.

```js
const Counter = (function() {
  let count = 0
  
  return {
    increment() {
      return ++count
    },
    getCount() {
      return count
    }
  }
})()
```

#### Form 4: Decorator Pattern

Adds behavior dynamically.

```js
function withLogging(fn) {
  return function(...args) {
    console.log(`Calling ${fn.name} with`, args)
    const result = fn.apply(this, args)
    console.log(`Result:`, result)
    return result
  }
}

const add = (a, b) => a + b
const loggedAdd = withLogging(add)
loggedAdd(2, 3)
```

### Behavioral Patterns

#### Form 5: Observer Pattern

One-to-many dependency notification.

```js
class EventEmitter {
  #listeners = new Map()
  
  on(event, callback) {
    if (!this.#listeners.has(event)) {
      this.#listeners.set(event, [])
    }
    this.#listeners.get(event).push(callback)
  }
  
  emit(event, data) {
    const callbacks = this.#listeners.get(event) || []
    callbacks.forEach(cb => cb(data))
  }
}
```

#### Form 6: Strategy Pattern

Encapsulates interchangeable algorithms.

```js
const strategies = {
  cash: (amount) => amount,
  credit: (amount) => amount * 1.02, // 2% fee
  debit: (amount) => amount * 1.01   // 1% fee
}

function calculateTotal(amount, paymentType) {
  return strategies[paymentType](amount)
}
```

### React/Vue Patterns

#### React: Higher-Order Components

```jsx
function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const isAuthenticated = useAuth()
    if (!isAuthenticated) return <Login />
    return <Component {...props} />
  }
}
```

#### Vue: Composition Pattern

```js
// useCounter.js
export function useCounter() {
  const count = ref(0)
  const increment = () => count.value++
  return { count, increment }
}
```

### Common Gotchas

1. **Over-engineering simple problems**
2. **Not following YAGNI principle**
3. **Tight coupling between patterns**

#### Quick Decision Guide
```typescript
Need object creation?
  └── Multiple similar types? → Factory
  └── Single instance? → Singleton
  └── Complex construction? → Builder

Need behavior flexibility?
  └── Algorithm variations? → Strategy
  └── State transitions? → State
  └── Event handling? → Observer
```
