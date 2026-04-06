---
title: Async Patterns and Concurrency
date: 2026-04-06
tags: [JavaScript]
---

## Async Patterns and Concurrency

### Async Iteration

#### Form 1: for await...of

Iterate over async iterables.

```js
async function* fetchPages() {
  let page = 1
  while (page <= 5) {
    yield await fetch(`/api/data?page=${page}`)
    page++
  }
}

for await (const page of fetchPages()) {
  console.log(page)
}
```

#### Form 2: Async Generators

```js
async function* generateNumbers() {
  let i = 0
  while (i < 10) {
    await delay(100)
    yield i++
  }
}

const gen = generateNumbers()
console.log(await gen.next()) // { value: 0, done: false }
```

### Concurrency Control

#### Form 1: Rate Limiting / Throttling

Limit concurrent operations.

```js
async function limitConcurrency(tasks, maxConcurrent) {
  const results = []
  const executing = []
  
  for (const task of tasks) {
    const promise = task().then(result => {
      executing.splice(executing.indexOf(promise), 1)
      return result
    })
    
    results.push(promise)
    executing.push(promise)
    
    if (executing.length >= maxConcurrent) {
      await Promise.race(executing)
    }
  }
  
  return Promise.all(results)
}

// Usage
const urls = [/* 100 URLs */]
const tasks = urls.map(url => () => fetch(url))
const responses = await limitConcurrency(tasks, 5)
```

#### Form 2: Semaphore Pattern

```js
class Semaphore {
  constructor(maxConcurrency) {
    this.maxConcurrency = maxConcurrency
    this.currentCount = 0
    this.queue = []
  }
  
  async acquire() {
    if (this.currentCount < this.maxConcurrency) {
      this.currentCount++
      return
    }
    
    await new Promise(resolve => this.queue.push(resolve))
  }
  
  release() {
    this.currentCount--
    if (this.queue.length > 0) {
      this.currentCount++
      const next = this.queue.shift()
      next()
    }
  }
}

// Usage
const sem = new Semaphore(3)

async function limitedOperation() {
  await sem.acquire()
  try {
    return await expensiveOperation()
  } finally {
    sem.release()
  }
}
```

### AbortController

Cancel async operations.

```js
const controller = new AbortController()
const signal = controller.signal

// Fetch with abort
fetch('/api/data', { signal })
  .then(response => response.json())
  .catch(err => {
    if (err.name === 'AbortError') {
      console.log('Request cancelled')
    }
  })

// Cancel after 5 seconds
setTimeout(() => controller.abort(), 5000)
```

### Caching Async Results

#### Memoize Async Functions

```js
function memoizeAsync(fn, ttl = 60000) {
  const cache = new Map()
  
  return async function(...args) {
    const key = JSON.stringify(args)
    const cached = cache.get(key)
    
    if (cached && Date.now() - cached.time < ttl) {
      return cached.value
    }
    
    const result = await fn.apply(this, args)
    cache.set(key, { value: result, time: Date.now() })
    return result
  }
}

const fetchUserMemoized = memoizeAsync(fetchUser)
```

### Retry Logic

```js
async function retry(fn, maxAttempts = 3, delay = 1000) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      if (attempt === maxAttempts) throw error
      await sleep(delay * attempt) // Exponential backoff
    }
  }
}

// Usage
const data = await retry(() => fetchData(), 5)
```

### Timeout Wrapper

```js
function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Timeout')), ms)
  })
  return Promise.race([promise, timeout])
}

// Usage
const data = await withTimeout(fetchData(), 5000)
```

### State Management

#### React Query Pattern

```js
// useQuery hook concept
function useQuery(queryFn, options = {}) {
  const [state, setState] = useState({
    data: null,
    error: null,
    isLoading: true
  })
  
  useEffect(() => {
    let cancelled = false
    
    const fetch = async () => {
      setState(s => ({ ...s, isLoading: true }))
      try {
        const data = await queryFn()
        if (!cancelled) {
          setState({ data, error: null, isLoading: false })
        }
      } catch (error) {
        if (!cancelled) {
          setState({ data: null, error, isLoading: false })
        }
      }
    }
    
    fetch()
    return () => { cancelled = true }
  }, [])
  
  return state
}
```

### VueUse Pattern

```js
// useAsyncState
export function useAsyncState(promise) {
  const state = reactive({
    isLoading: true,
    error: null,
    data: null
  })
  
  promise
    .then(data => { state.data = data })
    .catch(error => { state.error = error })
    .finally(() => { state.isLoading = false })
  
  return state
}

// Usage
const { data, error, isLoading } = useAsyncState(fetchUser(1))
```

### Common Gotchas

1. **Not handling cancellation**
   ```js
   useEffect(() => {
     fetchData() // May set state after unmount
   }, [])
   
   // ✅ Use cancellation token
   useEffect(() => {
     const controller = new AbortController()
     fetchData({ signal: controller.signal })
     return () => controller.abort()
   }, [])
   ```

2. **Race conditions**
   ```js
   // Request A starts, B starts, B finishes first, A finishes last
   // UI shows A's data (stale)
   
   // ✅ Track latest request
   let latestRequest = 0
   async function fetch(query) {
     const requestId = ++latestRequest
     const result = await api.search(query)
     if (requestId === latestRequest) {
       setData(result)
     }
   }
   ```

#### Quick Decision Guide
```typescript
Multiple concurrent operations?
  └── All must complete? → Promise.all
  └── First wins? → Promise.race
  └── Limited concurrency? → Semaphore / Queue

Need to cancel?
  └── Fetch requests? → AbortController
  └── Custom logic? → Cancellation tokens

Optimization?
  └── Prevent duplicate requests? → Memoization
  └── Handle failures? → Retry logic
  └── Prevent staleness? → Request IDs / Timestamps
```
