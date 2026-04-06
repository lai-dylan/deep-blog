---
title: Performance Optimization and Debugging
date: 2026-04-06
tags: [JavaScript]
---

## Performance Optimization and Debugging

### Performance Metrics

| Metric | Description | Target |
|--------|-------------|--------|
| FP | First Paint | < 1s |
| FCP | First Contentful Paint | < 1.8s |
| LCP | Largest Contentful Paint | < 2.5s |
| CLS | Cumulative Layout Shift | < 0.1 |
| TTFB | Time to First Byte | < 600ms |
| FID | First Input Delay | < 100ms |

### Chrome DevTools

```js
// Console methods
console.log('Info')
console.warn('Warning')
console.error('Error')
console.table([{ name: 'John', age: 30 }])
console.time('operation')
console.timeEnd('operation')

// debugger statement
function process(data) {
  debugger // Pauses execution
  return data
}

// Performance marks
performance.mark('start')
performance.mark('end')
performance.measure('operation', 'start', 'end')
```

### Optimization Techniques

#### Debouncing

```js
function debounce(fn, delay) {
  let timeoutId
  return function(...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), delay)
  }
}

// Usage
window.addEventListener('resize', debounce(() => {
  console.log('Resized!')
}, 250))
```

#### Throttling

```js
function throttle(fn, limit) {
  let inThrottle
  return function(...args) {
    if (!inThrottle) {
      fn.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Usage
window.addEventListener('scroll', throttle(() => {
  console.log('Scrolled!')
}, 100))
```

#### Lazy Loading

```js
// Images
<img loading="lazy" src="image.jpg" alt="">

// Dynamic import
button.addEventListener('click', async () => {
  const { heavyFunction } = await import('./heavy.js')
  heavyFunction()
})
```

### Memory Management

```js
// Memory leaks to avoid:
// 1. Event listeners not removed
button.removeEventListener('click', handler)

// 2. Closures holding references
function createLeak() {
  const bigData = new Array(1000000)
  return () => bigData // Keeps reference
}

// 3. Detached DOM nodes
// Remove from DOM AND remove references
element.remove()
element = null
```

### Common Gotchas

1. **Forced synchronous layout**
   ```js
   // ❌ Read and write interleaved
   element.style.width = '100px'
   const height = element.offsetHeight // Forces reflow
   element.style.height = '100px'
   
   // ✅ Batch reads and writes
   const height = element.offsetHeight
   element.style.width = '100px'
   element.style.height = '100px'
   ```

2. **Memory profiling**
   - Use DevTools Memory tab
   - Take heap snapshots
   - Compare before/after

#### Quick Decision Guide
```typescript
Optimize?
  └── Frequent events? → Debounce/throttle
  └── Large imports? → Lazy load
  └── Images? → Lazy loading, optimize
  └── Memory leak? → Check detached DOM, closures
```
