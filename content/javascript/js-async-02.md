---
title: Promise
date: 2026-04-06
tags: [JavaScript]
---

## Promise

### What is a Promise?

A **Promise** is an object representing the eventual completion or failure of an asynchronous operation. It can be in one of three states:

- **Pending**: Initial state
- **Fulfilled**: Operation completed successfully
- **Rejected**: Operation failed

### Creating Promises

#### Form 1: Promise Constructor

```js
const promise = new Promise((resolve, reject) => {
  // Async operation
  setTimeout(() => {
    const success = true
    if (success) {
      resolve('Data loaded')
    } else {
      reject(new Error('Failed to load'))
    }
  }, 1000)
})
```

#### Form 2: Promise.resolve / reject

```js
// Create resolved promise
const resolved = Promise.resolve(42)

// Create rejected promise
const rejected = Promise.reject(new Error('Oops'))
```

### Consuming Promises

#### Form 1: then / catch / finally

```js
fetchData()
  .then(data => {
    console.log('Success:', data)
    return processData(data)
  })
  .then(processed => {
    console.log('Processed:', processed)
  })
  .catch(error => {
    console.error('Error:', error)
  })
  .finally(() => {
    console.log('Cleanup') // Always runs
  })
```

#### Form 2: Chaining

```js
getUser(1)
  .then(user => getOrders(user.id))
  .then(orders => getProducts(orders[0].id))
  .then(product => console.log(product))
  .catch(error => console.error(error))
```

**Important**: Always return in then() to pass value to next chain.

```js
// ❌ Broken chain
promise.then(data => {
  fetchMoreData(data) // Return value not used
}).then(result => {
  // result is undefined!
})

// ✅ Proper chaining
promise.then(data => {
  return fetchMoreData(data)
}).then(result => {
  // result is from fetchMoreData
})
```

### Promise Static Methods

#### Promise.all

Waits for all promises to resolve.

```js
const promises = [
  fetch('/api/users'),
  fetch('/api/posts'),
  fetch('/api/comments')
]

Promise.all(promises)
  .then(([users, posts, comments]) => {
    console.log('All loaded')
  })
  .catch(error => {
    console.error('One failed:', error)
  })
```

#### Promise.race

Returns when first promise settles.

```js
const timeout = new Promise((_, reject) => {
  setTimeout(() => reject(new Error('Timeout')), 5000)
})

Promise.race([fetchData(), timeout])
  .then(data => console.log(data))
  .catch(err => console.error(err))
```

#### Promise.allSettled

Waits for all, regardless of success/failure.

```js
Promise.allSettled([
  Promise.resolve('success'),
  Promise.reject('error'),
  Promise.resolve('another success')
])
.then(results => {
  results.forEach(result => {
    if (result.status === 'fulfilled') {
      console.log('Value:', result.value)
    } else {
      console.log('Reason:', result.reason)
    }
  })
})
```

#### Promise.any

Returns first fulfilled promise.

```js
Promise.any([
  fetchFromMirror1(),
  fetchFromMirror2(),
  fetchFromMirror3()
])
.then(data => console.log('First success:', data))
.catch(error => console.log('All failed:', error.errors))
```

### Error Handling

```js
// Catch at end of chain
fetchData()
  .then(processData)
  .then(saveData)
  .catch(error => {
    // Catches rejection from any step
    console.error(error)
  })

// Or handle specific errors
fetchData()
  .then(data => {
    if (!data.valid) {
      throw new ValidationError('Invalid data')
    }
    return data
  })
  .catch(error => {
    if (error instanceof ValidationError) {
      // Handle validation error
    } else {
      // Handle other errors
    }
  })
```

### Promise Implementation

Basic Promise implementation for understanding:

```js
class MyPromise {
  constructor(executor) {
    this.state = 'pending'
    this.value = undefined
    this.handlers = []
    
    const resolve = (value) => {
      if (this.state === 'pending') {
        this.state = 'fulfilled'
        this.value = value
        this.handlers.forEach(h => h.onFulfilled(value))
      }
    }
    
    const reject = (reason) => {
      if (this.state === 'pending') {
        this.state = 'rejected'
        this.value = reason
        this.handlers.forEach(h => h.onRejected(reason))
      }
    }
    
    try {
      executor(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }
  
  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      if (this.state === 'fulfilled') {
        resolve(onFulfilled(this.value))
      } else if (this.state === 'rejected') {
        reject(onRejected(this.value))
      } else {
        this.handlers.push({ onFulfilled, onRejected })
      }
    })
  }
}
```

### Common Gotchas

1. **Not returning in then()**
   ```js
   getData().then(data => {
     processData(data) // Missing return
   }).then(result => {
     // result is undefined
   })
   ```

2. **Forgetting catch()**
   ```js
   // Unhandled promise rejection
   Promise.reject(new Error('Oops'))
   
   // Always add catch
   Promise.reject(new Error('Oops')).catch(console.error)
   ```

3. **Nested promises instead of chaining**
   ```js
   // ❌ Nested
   fetchUser().then(user => {
     fetchOrders(user.id).then(orders => {
       console.log(orders)
     })
   })
   
   // ✅ Chained
   fetchUser()
     .then(user => fetchOrders(user.id))
     .then(orders => console.log(orders))
   ```

#### Quick Decision Guide
```typescript
Multiple async operations?
  └── All must succeed? → Promise.all
  └── First to complete? → Promise.race
  └── All results needed? → Promise.allSettled
  └── First success? → Promise.any

Error handling?
  └── End of chain? → .catch()
  └── Specific recovery? → .then(null, handler)
  └── Always cleanup? → .finally()
```
