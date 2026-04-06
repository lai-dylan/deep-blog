---
title: this and Binding
date: 2026-04-06
tags: [JavaScript]
---

## this and Binding

### What is `this`?

The `this` keyword refers to the context in which a function is executed. Its value depends on **how** the function is called, not where it's defined.

### The Four Binding Rules

#### Rule 1: Default Binding (Global)

When a function is called standalone, `this` defaults to the global object (or undefined in strict mode).

```js
function sayName() {
  console.log(this.name)
}

// Non-strict mode
var name = 'Global'
sayName() // Global (this is window/global)

// Strict mode
'use strict'
function sayNameStrict() {
  console.log(this?.name) // undefined
}
sayNameStrict()
```

#### Rule 2: Implicit Binding (Object Method)

When a function is called as a method, `this` is the object before the dot.

```js
const user = {
  name: 'John',
  greet() {
    return `Hello, ${this.name}`
  }
}

console.log(user.greet()) // Hello, John (this is user)

// Losing implicit binding
const greet = user.greet
console.log(greet()) // Hello, undefined (this is global)
```

**The this-losing problem:**
```js
const user = {
  name: 'John',
  greet() {
    console.log(this.name)
  }
}

setTimeout(user.greet, 100) // undefined (this is lost)

// Solutions:
// 1. Arrow function preserves this
setTimeout(() => user.greet(), 100)

// 2. bind()
setTimeout(user.greet.bind(user), 100)

// 3. Wrapper function
setTimeout(function() {
  user.greet()
}, 100)
```

#### Rule 3: Explicit Binding (call, apply, bind)

Use `call()`, `apply()`, or `bind()` to explicitly set `this`.

```js
function introduce(greeting) {
  return `${greeting}, I'm ${this.name}`
}

const john = { name: 'John' }
const jane = { name: 'Jane' }

// call - invoke with this and arguments
console.log(introduce.call(john, 'Hello')) // Hello, I'm John

// apply - invoke with this and array of arguments
console.log(introduce.apply(jane, ['Hi'])) // Hi, I'm Jane

// bind - return new function with bound this
const johnIntro = introduce.bind(john)
console.log(johnIntro('Hey')) // Hey, I'm John

// bind with partial application (currying)
const sayHello = introduce.bind(null, 'Hello')
console.log(sayHello.call(john)) // Hello, I'm John
```

**call vs apply vs bind:**

| Method | Invokes? | Arguments | Returns |
|--------|----------|-----------|---------|
| call | Yes | Individual | Function result |
| apply | Yes | Array | Function result |
| bind | No | Individual | New function |

#### Rule 4: new Binding (Constructor)

When a function is called with `new`, `this` is the newly created object.

```js
function Person(name) {
  this.name = name
  this.greet = function() {
    return `Hello, I'm ${this.name}`
  }
}

const john = new Person('John')
console.log(john.greet()) // Hello, I'm John
```

**What `new` does:**
1. Creates new empty object
2. Sets object's prototype to constructor's prototype
3. Binds `this` to the new object
4. Executes constructor
5. Returns the new object (unless constructor returns object)

### Arrow Functions and `this`

Arrow functions don't have their own `this`. They inherit `this` from the enclosing scope (lexical scoping).

```js
const team = {
  name: 'Engineering',
  members: ['John', 'Jane', 'Bob'],
  
  // ❌ Regular function loses this
  showTeamBroken: function() {
    this.members.forEach(function(member) {
      console.log(`${member} is in ${this.name}`) // this.name is undefined
    })
  },
  
  // ✅ Arrow function preserves this
  showTeamFixed: function() {
    this.members.forEach(member => {
      console.log(`${member} is in ${this.name}`) // Works!
    })
  }
}

team.showTeamFixed()
// John is in Engineering
// Jane is in Engineering
// Bob is in Engineering
```

**Arrow functions are not suitable when:**
```js
// ❌ Object methods that need their own this
const obj = {
  value: 42,
  getValue: () => this.value // this is not obj!
}

// ❌ Event handlers
button.addEventListener('click', () => {
  this.classList.toggle('active') // this is not button
})

// ✅ Use regular function instead
button.addEventListener('click', function() {
  this.classList.toggle('active') // this is button
})
```

### Common Gotchas

1. **setTimeout/setInterval loses this**
   ```js
   const obj = {
     count: 0,
     increment() {
       this.count++
     },
     start() {
       // ❌ this becomes window
       setTimeout(this.increment, 1000)
       
       // ✅ Solutions:
       setTimeout(() => this.increment(), 1000)
       setTimeout(this.increment.bind(this), 1000)
     }
   }
   ```

2. **React class components**
   ```jsx
   class Counter extends React.Component {
     constructor(props) {
       super(props)
       this.state = { count: 0 }
       
       // Bind in constructor
       this.handleClick = this.handleClick.bind(this)
     }
     
     handleClick() {
       this.setState({ count: this.state.count + 1 })
     }
     
     // Or use class fields (arrow function)
     handleClickArrow = () => {
       this.setState({ count: this.state.count + 1 })
     }
     
     render() {
       // ❌ Loses this
       return <button onClick={this.handleClick}>Click</button>
       
       // ✅ Arrow in render
       return <button onClick={() => this.handleClick()}>Click</button>
     }
   }
   ```

3. **Event listeners**
   ```js
   const handler = {
     message: 'Hello',
     handleClick() {
       alert(this.message)
     }
   }
   
   // ❌ this is the button element
   button.addEventListener('click', handler.handleClick)
   
   // ✅ Bind this to handler object
   button.addEventListener('click', handler.handleClick.bind(handler))
   ```

4. **Prototype methods**
   ```js
   const obj = {
     value: 42,
     getValue: function() {
       return this.value
     }
   }
   
   // Extracting method loses this
   const getValue = obj.getValue
   console.log(getValue()) // undefined
   ```

### Preserving this with bind

```js
const user = {
  name: 'John',
  greet() {
    console.log(`Hello, ${this.name}`)
  }
}

// Bind creates new function with fixed this
const boundGreet = user.greet.bind(user)
boundGreet() // Hello, John

// Common pattern: bind in constructor
class EventHandler {
  constructor() {
    this.handleClick = this.handleClick.bind(this)
  }
  
  handleClick() {
    // this is always the instance
  }
}
```

### Quick Decision Guide
```typescript
What does this refer to?
  └── Function called standalone? → global (undefined in strict)
  └── Method called on object? → the object
  └── call/apply/bind used? → first argument
  └── new operator used? → new instance
  └── Arrow function? → this from enclosing scope

Need to preserve this?
  └── Inside callback? → Arrow function
  └── Extracting method? → bind()
  └── Event handler? → bind() or arrow in class field

React class components?
  └── Constructor binding
  └── Class field arrow functions
  └── Arrow function in render (performance cost)
```

---

## Chapter Summary

- `this` is determined by how a function is called, not where it's defined
- Four binding rules: default, implicit, explicit, new
- Arrow functions inherit `this` lexically (no own this)
- Use `bind()`, arrow functions, or wrappers to preserve `this`
- Common issues in callbacks, event handlers, and method extraction
