---
title: async/await
date: 2026-04-06
tags: [JavaScript]
---

## async/await

### What is async/await?

`async/await` is syntactic sugar over Promises, making asynchronous code look and behave more like synchronous code.

### async Functions

#### Form 1: Declaration

```js
async function fetchUser(id) {
  const response = await fetch(`/api/users/${id}`)
  const user = await response.json()
  return user
}
```

#### Form 2: Arrow Function

```js
const fetchUser = async (id) => {
  const response = await fetch(`/api/users/${id}`)
  return response.json()
}
```

#### Form 3: Class Methods

```js
class API {
  async getUser(id) {
    const response = await fetch(`/users/${id}`)
    return response.json()
  }
}
```

**Key points:**
- `async` makes a function return a Promise
- `await` pauses execution until Promise resolves
- `await` can only be used inside `async` functions

### Error Handling

#### Form 1: try/catch

```js
async function loadData() {
  try {
    const user = await fetchUser(1)
    const orders = await fetchOrders(user.id)
    return orders
  } catch (error) {
    console.error('Failed to load:', error)
    throw error // Re-throw or return default
  }
}
```

#### Form 2: Multiple Operations

```js
async function loadAllData() {
  try {
    const [users, posts] = await Promise.all([
      fetchUsers(),
      fetchPosts()
    ])
    return { users, posts }
  } catch (error) {
    console.error('One failed:', error)
  }
}
```

#### Form 3: Selective Error Handling

```js
async function loadWithFallbacks() {
  let user
  
  try {
    user = await fetchUserFromPrimary(1)
  } catch {
    try {
      user = await fetchUserFromBackup(1)
    } catch {
      user = { id: 1, name: 'Default User' }
    }
  }
  
  return user
}
```

### Sequential vs Parallel

#### Sequential (One after another)

```js
async function sequential() {
  const user = await fetchUser(1)      // Wait
  const posts = await fetchPosts(user) // Wait
  const comments = await fetchComments(posts) // Wait
  return { user, posts, comments }
}
// Total time: sum of all requests
```

#### Parallel (All at once)

```js
async function parallel() {
  const [users, posts, comments] = await Promise.all([
    fetchUsers(),
    fetchPosts(),
    fetchComments()
  ])
  return { users, posts, comments }
}
// Total time: slowest request
```

#### Mixed Approach

```js
async function mixed() {
  // Sequential for dependent operations
  const user = await fetchUser(1)
  
  // Parallel for independent operations
  const [posts, friends] = await Promise.all([
    fetchPosts(user.id),
    fetchFriends(user.id)
  ])
  
  return { user, posts, friends }
}
```

### async/await with Loops

#### For...of (Sequential)

```js
async function processUsers(userIds) {
  const results = []
  
  for (const id of userIds) {
    const user = await fetchUser(id) // One at a time
    results.push(user)
  }
  
  return results
}
```

#### map + Promise.all (Parallel)

```js
async function processUsersParallel(userIds) {
  const promises = userIds.map(id => fetchUser(id))
  return Promise.all(promises)
}

// Or with async arrow
async function processUsersParallel(userIds) {
  return Promise.all(userIds.map(async id => {
    const user = await fetchUser(id)
    return processUser(user)
  }))
}
```

### Top-Level await

Modern environments support await at module level:

```js
// data.js
const response = await fetch('/api/config')
export const config = await response.json()

// main.js
import { config } from './data.js'
console.log(config) // Already loaded
```

### Converting Callbacks to Promises

```js
// Promisify utility
function promisify(fn) {
  return function(...args) {
    return new Promise((resolve, reject) => {
      fn(...args, (error, result) => {
        if (error) reject(error)
        else resolve(result)
      })
    })
  }
}

// Usage
const readFile = promisify(fs.readFile)
const data = await readFile('file.txt', 'utf8')
```

### Common Gotchas

1. **Not awaiting**
   ```js
   async function load() {
     const user = fetchUser(1) // Returns Promise, not user!
     console.log(user.name) // undefined
   }
   
   // ✅ Correct
   const user = await fetchUser(1)
   ```

2. **Await in non-async function**
   ```js
   function regular() {
     const data = await fetchData() // SyntaxError
   }
   
   // ✅ Must be async
   async function asyncFn() {
     const data = await fetchData()
   }
   ```

3. **Forgetting to catch errors**
   ```js
   // Unhandled rejection
   async function risky() {
     await fetchData() // May throw
   }
   risky()
   
   // ✅ Handle errors
   risky().catch(console.error)
   // Or wrap in try/catch inside function
   ```

4. **Creating unnecessary async functions**
   ```js
   // ❌ Unnecessary
   async function getData() {
     return await fetchData() // Redundant await
   }
   
   // ✅ Just return Promise
   function getData() {
     return fetchData()
   }
   ```

#### Quick Decision Guide
```typescript
Async operation?
  └── Single operation? → await
  └── Multiple independent? → Promise.all + await
  └── Error handling? → try/catch
  └── Loop? → for...of (sequential) or map + Promise.all (parallel)

Convert from callbacks?
  └── Use promisify or promisify from util (Node.js)
  └── Or manually wrap in new Promise
```

### Best Practices

```js
// 1. Always handle errors
async function safeFetch() {
  try {
    return await fetchData()
  } catch (error) {
    console.error('Fetch failed:', error)
    return defaultData
  }
}

// 2. Don't overuse await (parallel when possible)
async function loadDashboard() {
  const [user, stats, notifications] = await Promise.all([
    fetchUser(),
    fetchStats(),
    fetchNotifications()
  ])
  return { user, stats, notifications }
}

// 3. Use try/finally for cleanup
async function withCleanup() {
  const connection = await createConnection()
  try {
    return await connection.query('SELECT *')
  } finally {
    await connection.close()
  }
}
```
