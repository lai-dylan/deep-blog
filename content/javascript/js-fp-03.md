---
title: Immutable Data and Pure Functions
date: 2026-04-06
tags: [JavaScript]
---

## Immutable Data and Pure Functions

### Why Immutability?

- Predictable state changes
- Easier debugging
- Prevents accidental mutations
- Enables structural sharing
- Thread-safe (relevant for Workers)

### Immutable Patterns

#### Form 1: Object Immutability

```js
const user = { name: 'John', age: 30 }

// ❌ Mutates
user.age = 31

// ✅ New object (shallow)
const updated = { ...user, age: 31 }

// ✅ Object.assign
const assigned = Object.assign({}, user, { age: 31 })

// Nested objects need deep copy
const userWithAddress = {
  name: 'John',
  address: { city: 'NYC', zip: '10001' }
}

// ❌ Shallow copy shares nested reference
const shallow = { ...userWithAddress }
shallow.address.city = 'LA' // Mutates original!

// ✅ Deep copy methods
const deep1 = JSON.parse(JSON.stringify(userWithAddress))
const deep2 = structuredClone(userWithAddress) // Modern
```

#### Form 2: Array Immutability

```js
const arr = [1, 2, 3]

// ❌ Mutating methods
arr.push(4)
arr.pop()
arr.splice(1, 1)
arr.sort()

// ✅ Non-mutating alternatives
const added = [...arr, 4] // push
const removed = arr.slice(0, -1) // pop
const filtered = arr.filter((_, i) => i !== 1) // splice
const sorted = [...arr].sort() // sort

// Immutable array methods
const mapped = arr.map(x => x * 2)
const filtered = arr.filter(x => x > 1)
const sliced = arr.slice(1, 3)
const concatenated = arr.concat([4, 5])
```

### Immutable Libraries

#### Form 1: Immer

```js
import produce from 'immer'

const state = {
  user: { name: 'John', todos: [{ text: 'Learn Immer' }] }
}

// Produce next state
const nextState = produce(state, draft => {
  draft.user.todos.push({ text: 'Use Immer' })
  draft.user.name = 'Jane'
})

// state unchanged, nextState is new
```

#### Form 2: Immutable.js (Facebook)

```js
import { Map, List } from 'immutable'

const map = Map({ a: 1, b: 2 })
const newMap = map.set('b', 3)

console.log(map.get('b')) // 2
console.log(newMap.get('b')) // 3

const list = List([1, 2, 3])
const newList = list.push(4)
```

### Pure Functions in Practice

```js
// Impure - depends on external state
let id = 0
function generateId() {
  return ++id
}

// Pure - all inputs explicit
function generateId(id) {
  return id + 1
}

// Impure - modifies input
function addItem(array, item) {
  array.push(item)
  return array
}

// Pure - returns new array
function addItem(array, item) {
  return [...array, item]
}
```

### State Management Immutability

#### Redux Pattern

```js
// Action
dispatch({ type: 'ADD_TODO', text: 'Learn Redux' })

// Pure reducer
function todosReducer(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return [...state, { text: action.text, done: false }]
    case 'TOGGLE_TODO':
      return state.map((todo, index) =>
        index === action.index
          ? { ...todo, done: !todo.done }
          : todo
      )
    default:
      return state
  }
}
```

#### Vue Pinia

```js
export const useStore = defineStore('main', {
  state: () => ({ count: 0 }),
  actions: {
    increment() {
      this.count++ // Vue makes this reactive
    }
  }
})
```

### Common Gotchas

1. **Shallow vs Deep**
   ```js
   const copy = { ...original }
   copy.nested.value = 'new' // Mutates original.nested!
   ```

2. **Performance concerns**
   ```js
   // Large arrays - consider mutable patterns or libraries
   // with structural sharing (Immutable.js, Immer patches)
   ```

3. **Date and special objects**
   ```js
   const obj = { date: new Date() }
   const copy = { ...obj }
   copy.date.setYear(2025) // Mutates original date!
   ```

#### Quick Decision Guide
```typescript
Need immutability?
  └── Simple objects/arrays? → Spread operator
  └── Deep nesting? → Immer or structuredClone
  └── Large state? → Immutable.js
  └── Redux state? → Immer or manual spread

Pure function?
  └── Same input → same output
  └── No side effects
  └── Doesn't mutate arguments
```
