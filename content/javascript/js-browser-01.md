---
title: DOM Manipulation and Events
date: 2026-04-06
tags: [JavaScript]
---

## DOM Manipulation and Events

### The DOM

The **Document Object Model** represents the page structure as a tree of nodes.

```
Document
  └── html
      ├── head
      └── body
          ├── div
          │   ├── h1
          │   └── p
          └── script
```

### Selecting Elements

```js
// Single element
const header = document.getElementById('header')
const firstBtn = document.querySelector('.btn')

// Multiple elements
const buttons = document.querySelectorAll('.btn') // NodeList
const items = document.getElementsByClassName('item') // HTMLCollection
const inputs = document.getElementsByTagName('input')

// Query selectors
const nav = document.querySelector('nav ul li:first-child')
const cards = document.querySelectorAll('[data-card]')
```

### Modifying Elements

#### Form 1: Content

```js
const element = document.querySelector('#app')

// Text content (no HTML parsing)
element.textContent = 'Hello World'

// HTML content (parses HTML)
element.innerHTML = '<strong>Bold</strong>'

// Insert adjacent HTML
element.insertAdjacentHTML('beforebegin', '<div>Before</div>')
element.insertAdjacentHTML('afterbegin', '<span>First</span>')
element.insertAdjacentHTML('beforeend', '<span>Last</span>')
element.insertAdjacentHTML('afterend', '<div>After</div>')
```

#### Form 2: Attributes and Classes

```js
const link = document.querySelector('a')

// Attributes
link.setAttribute('href', 'https://example.com')
link.getAttribute('href')
link.hasAttribute('target')
link.removeAttribute('title')

// Data attributes
console.log(link.dataset.userId) // data-user-id
link.dataset.status = 'active' // sets data-status

// Classes
element.classList.add('active')
element.classList.remove('hidden')
element.classList.toggle('visible')
element.classList.contains('active')
element.classList.replace('old', 'new')
```

#### Form 3: Styles

```js
// Inline styles (avoid for static styles)
element.style.backgroundColor = 'red'
element.style.fontSize = '16px'
element.style.cssText = 'color: red; font-size: 16px;'

// Computed styles (read-only)
const styles = getComputedStyle(element)
console.log(styles.width)
```

### Creating and Removing Elements

```js
// Create
const div = document.createElement('div')
div.textContent = 'New element'
div.className = 'container'
div.id = 'unique'

// Add to DOM
parent.appendChild(div)
parent.insertBefore(div, referenceNode)
parent.append(div, 'text', anotherElement)
parent.prepend(div)

// Remove
div.remove() // Modern
parent.removeChild(div) // Legacy

// Replace
parent.replaceChild(newNode, oldNode)
```

### Event Handling

#### Form 1: addEventListener

```js
const button = document.querySelector('#btn')

button.addEventListener('click', handleClick)

function handleClick(event) {
  console.log('Clicked!')
  console.log(event.target) // Element that triggered event
  console.log(event.currentTarget) // Element with listener
}

// Remove listener (need same reference)
button.removeEventListener('click', handleClick)
```

#### Form 2: Event Object

```js
element.addEventListener('click', (e) => {
  e.preventDefault() // Prevent default action
  e.stopPropagation() // Stop bubbling
  
  console.log(e.type) // 'click'
  console.log(e.clientX, e.clientY) // Mouse position
  console.log(e.key) // For keyboard events
})
```

#### Form 3: Event Delegation

```js
// Instead of attaching to each item
document.querySelectorAll('.item').forEach(item => {
  item.addEventListener('click', handleClick) // ❌ Memory heavy
})

// Attach to parent, check target
document.querySelector('#list').addEventListener('click', (e) => {
  if (e.target.matches('.item')) {
    handleClick(e.target)
  }
})
```

### Event Phases

```
Capturing Phase (root → target)
  ↓
Target Phase
  ↓
Bubbling Phase (target → root)
```

```js
element.addEventListener('click', handler, {
  capture: true, // Capture phase
  once: true,    // Auto-remove after one call
  passive: true  // Won't call preventDefault()
})
```

### Performance

#### Form 1: Document Fragments

```js
// ❌ Reflows on each append
items.forEach(item => {
  document.body.appendChild(createElement(item))
})

// ✅ Single reflow
const fragment = document.createDocumentFragment()
items.forEach(item => {
  fragment.appendChild(createElement(item))
})
document.body.appendChild(fragment)

// Or use template
const template = document.querySelector('#item-template')
```

#### Form 2: Batch DOM Reads/Writes

```js
// ❌ Interleaving reads and writes (forces reflow)
element.style.width = '100px'
console.log(element.offsetHeight) // Read forces layout
element.style.height = '100px'
console.log(element.offsetWidth) // Another layout

// ✅ Read all, then write all
const height = element.offsetHeight
const width = element.offsetWidth

element.style.width = '100px'
element.style.height = '100px'
```

### React/Vue DOM

#### React: Virtual DOM

```jsx
// JSX describes what UI should look like
function App() {
  return (
    <div className="app">
      <h1>Hello</h1>
    </div>
  )
}

// React diffs and updates real DOM efficiently
```

#### Vue: Template Compilation

```vue
<template>
  <div class="app">
    <h1>{{ message }}</h1>
  </div>
</template>

<script>
export default {
  data() {
    return { message: 'Hello' }
  }
}
</script>
```

### Common Gotchas

1. **Live vs Static NodeLists**
   ```js
   const live = document.getElementsByClassName('item') // Updates live
   const static = document.querySelectorAll('.item') // Snapshot
   ```

2. **this in event handlers**
   ```js
   button.addEventListener('click', function() {
     console.log(this) // button element
   })
   
   button.addEventListener('click', () => {
     console.log(this) // outer this (window/class)
   })
   ```

3. **Memory leaks**
   ```js
   // Remove elements but keep references
   const elements = []
   
   function create() {
     const div = document.createElement('div')
     elements.push(div) // Memory leak!
     document.body.appendChild(div)
   }
   ```

#### Quick Decision Guide
```typescript
Select elements?
  └── Single? → querySelector
  └── Multiple? → querySelectorAll
  └── By ID? → getElementById (fastest)

Modify?
  └── Text only? → textContent
  └── With HTML? → innerHTML
  └── Multiple elements? → DocumentFragment

Events?
  └── Single element? → addEventListener
  └── Multiple similar? → Event delegation
  └── React/Vue? → Use framework's event system
```
