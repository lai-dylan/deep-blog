---
title: Classes and Inheritance (ES6+)
date: 2026-04-06
tags: [JavaScript]
---

## Classes and Inheritance (ES6+)

### What are Classes?

ES6 introduced `class` syntax as syntactic sugar over JavaScript's prototype-based inheritance. Classes provide a cleaner, more familiar syntax for creating objects and handling inheritance.

### Class Basics

#### Form 1: Class Declaration

```js
class Person {
  constructor(name, age) {
    this.name = name
    this.age = age
  }
  
  greet() {
    return `Hello, I'm ${this.name}`
  }
}

const john = new Person('John', 30)
console.log(john.greet()) // Hello, I'm John
```

#### Form 2: Class Expression

```js
const Animal = class {
  constructor(name) {
    this.name = name
  }
  
  speak() {
    console.log(`${this.name} makes a sound`)
  }
}
```

### Class Components

#### Constructor

```js
class User {
  constructor(name, email) {
    this.name = name
    this.email = email
    this.createdAt = new Date()
  }
}
```

#### Instance Methods

```js
class Calculator {
  constructor() {
    this.result = 0
  }
  
  add(value) {
    this.result += value
    return this
  }
  
  getResult() {
    return this.result
  }
}
```

#### Static Methods

```js
class MathUtils {
  static PI = 3.14159
  
  static circleArea(radius) {
    return this.PI * radius * radius
  }
}
```

### Inheritance

```js
class Animal {
  constructor(name) {
    this.name = name
  }
  
  speak() {
    console.log(`${this.name} makes a sound`)
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name)
    this.breed = breed
  }
  
  speak() {
    console.log(`${this.name} barks`)
  }
}
```

### Private Fields

```js
class BankAccount {
  #balance = 0 // Private field
  
  deposit(amount) {
    if (amount > 0) {
      this.#balance += amount
    }
  }
  
  getBalance() {
    return this.#balance
  }
}
```

### Common Gotchas

1. **Classes are not hoisted**
2. **Must use new with classes**
3. **Methods are writable by default**

#### Quick Decision Guide
```typescript
Creating objects?
  └── Simple one-off? → Object literal
  └── Multiple instances? → Class
  └── Inheritance needed? → Class with extends
```
