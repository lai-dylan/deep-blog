---
title: Prototypes and Prototype Chain
date: 2026-04-06
tags: [JavaScript]
---

## Prototypes and Prototype Chain

### What are Prototypes?

**Prototypes** are the mechanism by which JavaScript objects inherit features from one another. Every object has a private property that links to another object—its prototype.

### The Prototype Chain

When accessing a property, JavaScript:
1. Checks the object itself
2. If not found, checks the object's prototype
3. Continues up the chain until found or reaching null

```
myObject → MyPrototype → Object.prototype → null
```

### Accessing Prototypes

#### Form 1: __proto__ (Legacy)

```js
const animal = { speaks: true }
const dog = { sound: 'Woof' }

dog.__proto__ = animal // ❌ Don't do this in production

console.log(dog.sound) // Woof (own property)
console.log(dog.speaks) // true (inherited)
```

#### Form 2: Object.getPrototypeOf / setPrototypeOf (Modern)

```js
const animal = { speaks: true }
const dog = { sound: 'Woof' }

Object.setPrototypeOf(dog, animal) // Still not recommended
console.log(Object.getPrototypeOf(dog) === animal) // true
```

#### Form 3: Object.create (Recommended)

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

const puppy = Object.create(dog)
puppy.speak() // Woof!
```

### Constructor Functions

Before ES6 classes, constructor functions were used to create objects with shared prototypes.

```js
function Animal(name) {
  this.name = name
}

Animal.prototype.speak = function() {
  console.log(`${this.name} makes a sound`)
}

function Dog(name, breed) {
  Animal.call(this, name) // Call parent constructor
  this.breed = breed
}

// Set up inheritance
Dog.prototype = Object.create(Animal.prototype)
Dog.prototype.constructor = Dog

Dog.prototype.speak = function() {
  console.log(`${this.name} barks`)
}

const dog = new Dog('Rex', 'German Shepherd')
dog.speak() // Rex barks
console.log(dog instanceof Dog) // true
console.log(dog instanceof Animal) // true
```

### The prototype Property

Functions have a `prototype` property used when creating instances with `new`.

```js
function Person(name) {
  this.name = name
}

Person.prototype.greet = function() {
  return `Hello, I'm ${this.name}`
}

const john = new Person('John')
console.log(john.greet()) // Hello, I'm John

// Instance points to prototype
console.log(Object.getPrototypeOf(john) === Person.prototype) // true
console.log(john.__proto__ === Person.prototype) // true (legacy)
```

**Key distinction:**
- `__proto__` (or `Object.getPrototypeOf`): The prototype of an object instance
- `prototype`: The property on constructor functions, used as prototype for instances

### Property Shadowing

When an object has a property with the same name as its prototype, it "shadows" the prototype property.

```js
const parent = { name: 'Parent', value: 100 }
const child = Object.create(parent)

child.value = 200 // Shadows parent's value

console.log(child.value) // 200 (own property)
console.log(parent.value) // 100 (unchanged)

// Delete shadow to reveal prototype property
delete child.value
console.log(child.value) // 100 (from prototype)
```

### Checking Properties

```js
const obj = { own: true }
Object.setPrototypeOf(obj, { inherited: true })

// Check if property exists anywhere in chain
console.log('own' in obj) // true
console.log('inherited' in obj) // true
console.log('toString' in obj) // true (from Object.prototype)

// Check if property is own (not inherited)
console.log(obj.hasOwnProperty('own')) // true
console.log(obj.hasOwnProperty('inherited')) // false
console.log(Object.hasOwn(obj, 'own')) // ES2022, preferred
```

### instanceof Operator

```js
function Animal() {}
function Dog() {}
Dog.prototype = Object.create(Animal.prototype)

const dog = new Dog()

console.log(dog instanceof Dog) // true
console.log(dog instanceof Animal) // true
console.log(dog instanceof Object) // true
```

**How instanceof works:**
```js
function myInstanceof(obj, constructor) {
  let proto = Object.getPrototypeOf(obj)
  while (proto) {
    if (proto === constructor.prototype) return true
    proto = Object.getPrototypeOf(proto)
  }
  return false
}
```

### isPrototypeOf

```js
const animal = { eats: true }
const dog = Object.create(animal)
const puppy = Object.create(dog)

console.log(animal.isPrototypeOf(dog)) // true
console.log(animal.isPrototypeOf(puppy)) // true (in chain)
console.log(dog.isPrototypeOf(puppy)) // true
```

### Common Gotchas

1. **Modifying built-in prototypes**
   ```js
   // ❌ Bad practice
   Array.prototype.first = function() {
     return this[0]
   }
   
   // ✅ Extend with utility function
   function first(array) {
     return array[0]
   }
   ```

2. **Prototype pollution**
   ```js
   // Security vulnerability
   const obj = {}
   // Malicious input: { "__proto__": { "isAdmin": true } }
   // Can pollute all objects!
   
   // Prevention: Use Object.create(null) for maps
   const safeMap = Object.create(null)
   safeMap.key = 'value'
   ```

3. **Performance of setPrototypeOf**
   ```js
   // ❌ Avoid changing prototype after creation
   const obj = {}
   Object.setPrototypeOf(obj, otherObj)
   
   // ✅ Create with correct prototype
   const obj = Object.create(otherObj)
   ```

4. **Confusion with __proto__ and prototype**
   ```js
   function Foo() {}
   
   const foo = new Foo()
   
   console.log(foo.__proto__ === Foo.prototype) // true
   console.log(Foo.__proto__ === Function.prototype) // true
   console.log(Foo.prototype.__proto__ === Object.prototype) // true
   ```

#### Quick Decision Guide
```typescript
Creating objects with inheritance?
  └── Simple prototype chain? → Object.create()
  └── Constructor pattern? → function + prototype
  └── Modern code? → class syntax (ES6+)

Checking relationships?
  └── Is instance of class? → instanceof
  └── Is in prototype chain? → isPrototypeOf()
  └── Get prototype? → Object.getPrototypeOf()

Property access?
  └── Own property? → hasOwnProperty() / Object.hasOwn()
  └── Anywhere in chain? → in operator
```

### Best Practices

```js
// 1. Don't modify built-in prototypes
// 2. Prefer composition over inheritance
const behavior = {
  fly() { console.log('Flying') }
}

const bird = {
  name: 'Eagle',
  ...behavior
}

// 3. Use Object.create(null) for dictionaries
const map = Object.create(null)
map.key = 'value'
// No prototype pollution risk

// 4. Modern: Use classes for inheritance
class Animal {
  constructor(name) {
    this.name = name
  }
}

class Dog extends Animal {
  bark() {
    console.log('Woof!')
  }
}
```

---

## Chapter Summary

- Every object has a prototype, forming a prototype chain
- Properties are inherited through the prototype chain
- Constructor functions use the `prototype` property for instance methods
- Prefer `Object.create()` over `__proto__` or `setPrototypeOf()`
- Use `instanceof` and `isPrototypeOf()` to check relationships
- Avoid modifying built-in prototypes
- Modern JavaScript uses `class` syntax, which is syntactic sugar over prototypes
