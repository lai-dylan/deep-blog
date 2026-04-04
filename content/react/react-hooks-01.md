---
title: React Hooks 01
date: 2026-04-04
tags: [React]
---

## React Hooks - State Management

### useState

`useState()` is a **Hook that lets you add React state** to function components. Returns a stateful value and a function to update it.

**Core behavior:**
- Returns a **tuple** — `[state, setState]` array destructuring
- **Functional updates** — `setState(prev => next)` for dependent updates
- **Lazy initialization** — pass function to avoid expensive initial computation on re-renders
- **Batched updates** — multiple setState calls in one event handler are batched

#### Form 1: Basic state — `useState(initialValue)`

When to use: Most common form. Managing simple primitive or object state.

```jsx
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}
```

#### Form 2: Lazy initialization — `useState(() => computeInitial())`

When to use: When initial state requires expensive computation.

```jsx
function ExpensiveComponent() {
  // Function only runs on initial render, not on updates
  const [data, setData] = useState(() => {
    return heavyComputation() // Only runs once
  })
  
  return <div>{data}</div>
}
```

#### Form 3: Functional update — `setState(prev => next)`

When to use: When new state depends on previous state (especially with async operations).

```jsx
function Counter() {
  const [count, setCount] = useState(0)
  
  // ❌ Bad: count may be stale in async callbacks
  const incrementAsync = () => {
    setTimeout(() => setCount(count + 1), 1000)
  }
  
  // ✅ Good: uses latest state value
  const incrementCorrect = () => {
    setTimeout(() => setCount(prev => prev + 1), 1000)
  }
  
  return <button onClick={incrementCorrect}>+</button>
}
```

#### Form 4: Object state — `useState({ ... })`

When to use: Grouping related state together.

```jsx
function UserForm() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    age: 0
  })
  
  const updateField = (field, value) => {
    // Must spread existing state or lose other fields!
    setUser(prev => ({ ...prev, [field]: value }))
  }
  
  return (
    <form>
      <input 
        value={user.name} 
        onChange={e => updateField('name', e.target.value)} 
      />
      <input 
        value={user.email} 
        onChange={e => updateField('email', e.target.value)} 
      />
    </form>
  )
}
```

#### Common Gotchas

1. **State is immutable** — always return new object, don't mutate
   ```jsx
   // ❌ Bad: mutating state directly
   const [items, setItems] = useState([1, 2, 3])
   items.push(4)  // Mutates but won't trigger re-render!
   setItems(items) // React sees same reference, no update
   
   // ✅ Good: create new array
   setItems([...items, 4])
   ```

2. **Objects require spreading** — when updating one property, spread others
   ```jsx
   const [state, setState] = useState({ a: 1, b: 2 })
   
   // ❌ Bad: loses property 'a'
   setState({ b: 3 })
   
   // ✅ Good: preserves 'a'
   setState(prev => ({ ...prev, b: 3 }))
   ```

3. **Stale closures** — capturing state in async callbacks
   ```jsx
   const [count, setCount] = useState(0)
   
   useEffect(() => {
     const timer = setInterval(() => {
       console.log(count) // Always 0 due to closure!
     }, 1000)
     return () => clearInterval(timer)
   }, []) // Missing dependency causes stale closure
   
   // ✅ Fix: use functional update or add dependency
   ```

4. **State updates are async** — don't expect immediate change
   ```jsx
   const [count, setCount] = useState(0)
   
   const handleClick = () => {
     setCount(count + 1)
     console.log(count) // Still 0! Update is scheduled, not immediate
   }
   ```

#### Quick Decision Guide
```typescript
Need to store component state?
  └── Simple value (string, number, boolean)?
       └── Yes → useState(initialValue)
       └── Complex object with multiple fields?
            └── Fields often updated together? → useState({ ... })
            └── Fields updated independently? → Consider multiple useState calls
```

---

### useReducer

`useReducer()` is a **Hook for complex state logic** involving multiple sub-values or when next state depends on previous one. Alternative to useState.

**Core behavior:**
- Returns **state and dispatch** — `[state, dispatch]`
- **Reducer pattern** — `(state, action) => newState`
- **Action-based** — dispatch actions to trigger state changes
- **Predictable updates** — state changes are centralized in reducer

#### Form 1: Basic reducer — `useReducer(reducer, initialState)`

When to use: Complex state with multiple related values.

```jsx
import { useReducer } from 'react'

const initialState = { count: 0, step: 1 }

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + state.step }
    case 'decrement':
      return { ...state, count: state.count - state.step }
    case 'setStep':
      return { ...state, step: action.payload }
    case 'reset':
      return initialState
    default:
      throw new Error(`Unknown action: ${action.type}`)
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState)
  
  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <input 
        type="number" 
        value={state.step} 
        onChange={e => dispatch({ type: 'setStep', payload: Number(e.target.value) })}
      />
    </div>
  )
}
```

#### Form 2: Lazy initialization — `useReducer(reducer, initArg, initFn)`

When to use: Expensive initial state computation.

```jsx
function init(initialCount) {
  return { count: initialCount, history: [] }
}

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {
        count: state.count + 1,
        history: [...state.history, state.count + 1]
      }
    // ... other cases
  }
}

function Counter({ initialCount }) {
  // init function only called on initial render
  const [state, dispatch] = useReducer(reducer, initialCount, init)
  
  return (
    <div>
      <p>Count: {state.count}</p>
      <p>History: {state.history.join(', ')}</p>
    </div>
  )
}
```

#### Form 3: With immer — Immutable updates simplified

When to use: Deeply nested state updates.

```jsx
import { useImmerReducer } from 'use-immer'

function reducer(draft, action) {
  // Mutate draft directly - immer handles immutability
  switch (action.type) {
    case 'addItem':
      draft.items.push(action.payload)
      break
    case 'updateNested':
      draft.user.profile.settings.theme = action.payload
      break
  }
}

function App() {
  const [state, dispatch] = useImmerReducer(reducer, initialState)
  // No need to spread, just mutate draft
}
```

#### Comparison: useState vs useReducer

| Aspect | useState | useReducer |
|--------|----------|------------|
| Best for | Simple, independent state | Complex, related state |
| Logic location | In component | In reducer function |
| Testing | Harder (logic in component) | Easier (pure reducer) |
| TypeScript | Simpler types | Action types can be verbose |
| Performance | Same | Same |

#### Common Gotchas

1. **Don't forget return in reducer** — fall through cases cause bugs
   ```jsx
   function reducer(state, action) {
     switch (action.type) {
       case 'add':
         state.count++  // ❌ Mutates state!
       case 'subtract':  // ❌ Falls through without return above!
         return { count: state.count - 1 }
     }
   }
   
   // ✅ Always return and don't mutate
   case 'add':
     return { ...state, count: state.count + 1 }
   ```

2. **Action type typos** — use constants or TypeScript
   ```jsx
   // ❌ Prone to typos
   dispatch({ type: 'INCREMENT' }) // but reducer checks 'increment'
   
   // ✅ Use action creators
   const actions = {
     increment: () => ({ type: 'increment' }),
     setValue: (value) => ({ type: 'setValue', payload: value })
   }
   dispatch(actions.increment())
   ```

3. **State reference in reducer** — reducer must be pure
   ```jsx
   // ❌ Bad: external dependency makes impure
   let externalCount = 0
   function reducer(state, action) {
     return { count: state.count + externalCount } // Unpredictable!
   }
   
   // ✅ Good: pure function, all data in action
   function reducer(state, action) {
     return { count: state.count + action.payload }
   }
   ```

#### Quick Decision Guide
```typescript
State getting complex?
  └── Multiple related values changing together? → useReducer
       └── Deeply nested updates? → useReducer + immer
  └── Simple independent values? → useState (multiple calls)
  └── Form with many fields? → useReducer or form library
```

---

## React Hooks - Side Effects

### useEffect

`useEffect()` is a **Hook for performing side effects** in function components. Runs after render and on dependency changes.

**Core behavior:**
- **Runs after render** — scheduled after painting, doesn't block browser
- **Cleanup function** — returned function runs before unmount or re-run
- **Dependency array** — controls when effect runs (empty = mount only, omitted = every render)
- **Multiple effects** — can have multiple useEffect calls for separation of concerns

#### Form 1: Run on every render — `useEffect(fn)` (no deps)

When to use: Rarely. Only when effect must sync with every render (e.g., measuring DOM).

```jsx
import { useEffect, useRef } from 'react'

function MeasureComponent() {
  const ref = useRef()
  
  useEffect(() => {
    // Runs after every render
    const height = ref.current.getBoundingClientRect().height
    console.log('Height:', height)
  }) // No dependency array = runs every render
  
  return <div ref={ref}>Content</div>
}
```

#### Form 2: Run once on mount — `useEffect(fn, [])` (empty deps)

When to use: One-time setup like subscriptions, event listeners, or API calls.

```jsx
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId)
    connection.connect()
    
    console.log('Connected to:', roomId)
    
    // Cleanup when unmounting
    return () => {
      connection.disconnect()
      console.log('Disconnected from:', roomId)
    }
  }, []) // Empty array = run once on mount
  
  return <div>Room: {roomId}</div>
}
```

#### Form 3: Run on specific dependencies — `useEffect(fn, [dep1, dep2])`

When to use: Reacting to specific prop or state changes.

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null)
  
  useEffect(() => {
    let cancelled = false
    
    async function fetchUser() {
      const response = await fetch(`/api/users/${userId}`)
      const data = await response.json()
      
      if (!cancelled) {
        setUser(data)
      }
    }
    
    fetchUser()
    
    // Cleanup prevents setting state on unmounted component
    return () => {
      cancelled = true
    }
  }, [userId]) // Only re-run when userId changes
  
  return <div>{user?.name}</div>
}
```

#### Form 4: With cleanup — Event listeners, subscriptions

When to use: Adding/removing event listeners or subscriptions.

```jsx
function WindowSize() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight })
  
  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight })
    }
    
    window.addEventListener('resize', handleResize)
    
    // Cleanup removes listener to prevent memory leaks
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, []) // Only add listener once
  
  return <div>{size.width} x {size.height}</div>
}
```

#### Form 5: Multiple effects — Separation of concerns

When to use: Different side effects that should be managed separately.

```jsx
function Example() {
  // Effect for document title
  useEffect(() => {
    document.title = `Count: ${count}`
  }, [count])
  
  // Effect for analytics
  useEffect(() => {
    analytics.track('page_view', { userId })
  }, [userId])
  
  // Effect for subscription
  useEffect(() => {
    const subscription = subscribe(channelId)
    return () => subscription.unsubscribe()
  }, [channelId])
}
```

#### Common Gotchas

1. **Missing dependencies** — ESLint exhaustive-deps warning is usually correct
   ```jsx
   const [count, setCount] = useState(0)
   
   useEffect(() => {
     console.log(count)
   }, []) // ❌ ESLint warning: missing dependency 'count'
   
   // ✅ Include all dependencies
   useEffect(() => {
     console.log(count)
   }, [count])
   ```

2. **Stale closures** — old values captured in effect
   ```jsx
   useEffect(() => {
     const timer = setInterval(() => {
       console.log(count) // Always the initial value!
     }, 1000)
     return () => clearInterval(timer)
   }, []) // ❌ Missing dependency causes stale closure
   
   // ✅ Option 1: Include dependency
   useEffect(() => {
     const timer = setInterval(() => {
       console.log(count)
     }, 1000)
     return () => clearInterval(timer)
   }, [count])
   
   // ✅ Option 2: Use functional update
   useEffect(() => {
     const timer = setInterval(() => {
       setCount(c => c + 1) // Uses latest value via functional update
     }, 1000)
     return () => clearInterval(timer)
   }, []) // No dependency needed
   ```

3. **Async in useEffect** — effect function itself can't be async
   ```jsx
   useEffect(async () => {  // ❌ Warning: effect returns Promise
     const data = await fetchData()
   }, [])
   
   // ✅ Define async function inside
   useEffect(() => {
     async function fetchData() {
       const data = await fetchData()
       setData(data)
     }
     fetchData()
   }, [])
   ```

4. **Race conditions** — multiple rapid changes
   ```jsx
   useEffect(() => {
     fetch(`/api/user/${userId}`).then(response => {
       response.json().then(data => {
         setUser(data) // ❌ What if userId changed while fetching?
       })
     })
   }, [userId])
   
   // ✅ Use cancellation flag
   useEffect(() => {
     let cancelled = false
     fetch(`/api/user/${userId}`).then(response => {
       response.json().then(data => {
         if (!cancelled) setUser(data)
       })
     })
     return () => { cancelled = true }
   }, [userId])
   ```

#### Quick Decision Guide
```typescript
Need to perform side effects?
  └── Run after every render? → useEffect(fn)
  └── Run once on mount only? → useEffect(fn, [])
       └── Need cleanup on unmount? → return cleanup function
  └── Run when specific values change? → useEffect(fn, [dep1, dep2])
       └── Are dependencies objects/arrays? → Be careful with reference equality
```

---

### useLayoutEffect

`useLayoutEffect()` is identical to `useEffect` but fires **synchronously after all DOM mutations**. Use to read layout from DOM and re-render synchronously.

**Core behavior:**
- **Synchronous** — runs before browser paint, can block visual updates
- **Same API** — dependencies and cleanup work identically to useEffect
- **SSR caution** — warnings during server-side rendering (use useEffect instead)

#### Form 1: Measure and adjust layout — DOM measurements

When to use: Preventing visual flicker by measuring and adjusting synchronously.

```jsx
import { useLayoutEffect, useRef, useState } from 'react'

function Tooltip({ children, content }) {
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef()
  
  useLayoutEffect(() => {
    const rect = triggerRef.current.getBoundingClientRect()
    // Calculate position synchronously before paint
    setPosition({
      top: rect.bottom + 8,
      left: rect.left + rect.width / 2
    })
  }, []) // Measure once after mount
  
  return (
    <>
      <span ref={triggerRef}>{children}</span>
      <div style={{ position: 'fixed', ...position }}>
        {content}
      </div>
    </>
  )
}
```

#### Form 2: Prevent flicker — Scroll restoration

When to use: Restoring scroll position before user sees the update.

```jsx
function ChatContainer({ messages }) {
  const containerRef = useRef()
  const scrollPositionRef = useRef()
  
  // Save scroll position before update
  useLayoutEffect(() => {
    scrollPositionRef.current = containerRef.current.scrollHeight
  })
  
  // Restore scroll position after DOM update
  useLayoutEffect(() => {
    const newScrollHeight = containerRef.current.scrollHeight
    const scrollDiff = newScrollHeight - scrollPositionRef.current
    containerRef.current.scrollTop += scrollDiff
  })
  
  return (
    <div ref={containerRef}>
      {messages.map(msg => <Message key={msg.id} {...msg} />)}
    </div>
  )
}
```

#### Comparison: useEffect vs useLayoutEffect

| Aspect | useEffect | useLayoutEffect |
|--------|-----------|-----------------|
| Timing | After paint | Before paint |
| Blocking | No | Yes (can cause jank) |
| Use case | Most side effects | DOM measurements, preventing flicker |
| SSR | Safe | Causes warnings |
| Performance | Better | Use sparingly |

#### Common Gotchas

1. **Overuse causes performance issues** — blocks browser paint
   ```jsx
   // ❌ Don't use for data fetching
   useLayoutEffect(() => {
     fetchData().then(setData) // Blocks paint unnecessarily
   }, [])
   
   // ✅ Use useEffect instead
   useEffect(() => {
     fetchData().then(setData)
   }, [])
   ```

2. **SSR compatibility** — causes hydration mismatches
   ```jsx
   // ❌ Causes warning during SSR
   useLayoutEffect(() => {
     // This won't run on server
   }, [])
   
   // ✅ Guard for SSR
   useLayoutEffect(() => {
     if (typeof window !== 'undefined') {
       // Safe for SSR
     }
   }, [])
   ```

3. **Infinite loops** — synchronous updates can loop
   ```jsx
   useLayoutEffect(() => {
     setWidth(ref.current.offsetWidth)
     // If setWidth causes re-render, this loops!
   })
   
   // ✅ Add dependencies
   useLayoutEffect(() => {
     setWidth(ref.current.offsetWidth)
   }, [someDep])
   ```

#### Quick Decision Guide
```typescript
Need to interact with DOM?
  └── Read layout and adjust synchronously? → useLayoutEffect
       └── Preventing visual flicker? → useLayoutEffect
  └── Regular side effects (fetching, subscriptions)? → useEffect
  └── Animating based on measurements? → useLayoutEffect
  └── Most cases? → useEffect (prefer over useLayoutEffect)
```

---

### useInsertionEffect

`useInsertionEffect()` fires **before any DOM mutations** in React 18+. Designed for CSS-in-JS libraries to inject styles before rendering.

**Core behavior:**
- **Fires first** — before useLayoutEffect and useEffect
- **No DOM access** — layout hasn't been calculated yet
- **CSS-in-JS use** — inserting `<style>` tags dynamically

#### When to use: CSS-in-JS style injection

```jsx
import { useInsertionEffect } from 'react'

function useCSS(rule) {
  useInsertionEffect(() => {
    // Inject style before any layout effects run
    const style = document.createElement('style')
    style.textContent = rule
    document.head.appendChild(style)
    
    return () => {
      document.head.removeChild(style)
    }
  }, [rule])
}

function Component() {
  useCSS(`
    .dynamic-class {
      color: ${theme.color};
    }
  `)
  
  return <div className="dynamic-class">Content</div>
}
```

#### Common Gotchas

1. **Not for general use** — specifically for CSS-in-JS libraries
2. **No layout info** — DOM hasn't been measured yet
3. **Cannot set state** — would cause infinite loops

---

## React Hooks - Performance Optimization

### useMemo

`useMemo()` **memoizes a computed value** and only recalculates when dependencies change.

**Core behavior:**
- **Caches result** — returns cached value if dependencies unchanged
- **Expensive computations** — optimize heavy calculations
- **Reference stability** — important for object/array props to child components
- **Not a semantic guarantee** — React may discard cache

#### Form 1: Expensive computation — `useMemo(() => compute(), deps)`

When to use: Heavy calculations that shouldn't run on every render.

```jsx
import { useMemo } from 'react'

function ExpensiveList({ items, filter }) {
  // Only re-filter when items or filter changes
  const filteredItems = useMemo(() => {
    console.log('Filtering...')
    return items.filter(item => 
      item.name.toLowerCase().includes(filter.toLowerCase())
    )
  }, [items, filter])
  
  return (
    <ul>
      {filteredItems.map(item => <li key={item.id}>{item.name}</li>)}
    </ul>
  )
}
```

#### Form 2: Reference stability — Object/array props

When to use: Preventing unnecessary child re-renders.

```jsx
function Parent() {
  const [count, setCount] = useState(0)
  const user = { name: 'John', age: 30 }
  
  // ❌ Bad: new object every render, causes Child to re-render
  return <Child user={user} />
}

function BetterParent() {
  const [count, setCount] = useState(0)
  
  // ✅ Good: same object reference unless data changes
  const user = useMemo(() => ({ name: 'John', age: 30 }), [])
  
  return <Child user={user} />
}
```

#### Form 3: With expensive object creation

When to use: Complex object initialization.

```jsx
function Chart({ data, options }) {
  const chartConfig = useMemo(() => ({
    type: 'line',
    data: processData(data),
    options: {
      ...defaultOptions,
      ...options,
      plugins: setupPlugins(options.plugins)
    }
  }), [data, options])
  
  return <ChartComponent config={chartConfig} />
}
```

#### Common Gotchas

1. **Premature optimization** — adds overhead, not always beneficial
   ```jsx
   // ❌ Don't memoize simple operations
   const doubled = useMemo(() => count * 2, [count]) // Overhead > benefit
   
   // ✅ Only for expensive operations
   const sorted = useMemo(() => 
     largeArray.sort(complexComparator), 
     [largeArray]
   )
   ```

2. **Missing dependencies** — stale values
   ```jsx
   const [multiplier, setMultiplier] = useState(2)
   const [count, setCount] = useState(0)
   
   // ❌ Missing 'multiplier' dependency
   const result = useMemo(() => count * multiplier, [count])
   
   // ✅ Include all dependencies
   const result = useMemo(() => count * multiplier, [count, multiplier])
   ```

3. **Not for side effects** — use useEffect instead
   ```jsx
   // ❌ Wrong: side effect in useMemo
   const data = useMemo(() => {
     localStorage.setItem('key', value) // Side effect!
     return process(value)
   }, [value])
   
   // ✅ Separate side effect and computation
   useEffect(() => {
     localStorage.setItem('key', value)
   }, [value])
   
   const data = useMemo(() => process(value), [value])
   ```

4. **Functions as dependencies** — reference equality issues
   ```jsx
   // ❌ New function every render, memo never caches
   const process = () => { /* ... */ }
   const result = useMemo(() => process(data), [data, process])
   
   // ✅ Memoize the function too (see useCallback)
   const process = useCallback(() => { /* ... */ }, [])
   const result = useMemo(() => process(data), [data, process])
   ```

#### Quick Decision Guide
```typescript
Computing a derived value?
  └── Is the computation expensive (sorting, filtering, transforming)?
       └── Yes, and result used in render? → useMemo
       └── Result passed to child component? → useMemo (for reference stability)
       └── No, simple operation? → Don't use useMemo
  └── Creating objects/arrays for props? → useMemo (for reference equality)
```

---

### useCallback

`useCallback()` **memoizes a function definition** to maintain reference equality across renders.

**Core behavior:**
- **Caches function** — returns same function reference if deps unchanged
- **Child components** — prevents unnecessary re-renders when passing callbacks
- **Dependency array** — same rules as useEffect
- **Often paired with useMemo** — memoized values with memoized callbacks

#### Form 1: Event handlers — `useCallback(fn, deps)`

When to use: Passing callbacks to optimized child components.

```jsx
import { useCallback } from 'react'

function Parent() {
  const [count, setCount] = useState(0)
  const [text, setText] = useState('')
  
  // ❌ Bad: new function every render, causes Button to re-render
  const handleClick = () => {
    setCount(c => c + 1)
  }
  
  // ✅ Good: same function reference unless count logic changes
  const handleClick = useCallback(() => {
    setCount(c => c + 1)
  }, []) // No dependencies, stable reference
  
  return (
    <div>
      <ExpensiveButton onClick={handleClick} />
      <input value={text} onChange={e => setText(e.target.value)} />
    </div>
  )
}

const ExpensiveButton = React.memo(({ onClick }) => {
  console.log('Button rendered')
  return <button onClick={onClick}>Click</button>
})
```

#### Form 2: With dependencies — Callbacks that use props/state

When to use: Callbacks that reference component state or props.

```jsx
function UserList({ users, onDelete }) {
  const [selectedId, setSelectedId] = useState(null)
  
  // Function uses selectedId, so it's a dependency
  const handleDelete = useCallback((userId) => {
    if (userId === selectedId) {
      setSelectedId(null)
    }
    onDelete(userId)
  }, [selectedId, onDelete]) // Include all dependencies
  
  return (
    <ul>
      {users.map(user => (
        <UserItem 
          key={user.id} 
          user={user} 
          onDelete={handleDelete}
          isSelected={user.id === selectedId}
        />
      ))}
    </ul>
  )
}
```

#### Form 3: Preventing effect re-runs

When to use: Functions used as useEffect dependencies.

```jsx
function SearchComponent({ api }) {
  const [query, setQuery] = useState('')
  
  // Memoize to prevent effect from re-running unnecessarily
  const search = useCallback(async () => {
    return api.search(query)
  }, [api, query])
  
  useEffect(() => {
    search().then(results => setResults(results))
  }, [search]) // Only re-runs when search function changes
  
  return <input value={query} onChange={e => setQuery(e.target.value)} />
}
```

#### Comparison: useMemo vs useCallback

| Hook | Returns | Use case |
|------|---------|----------|
| useMemo | Cached **value** | Expensive computations, object stability |
| useCallback | Cached **function** | Event handlers, callback props |

```jsx
// These are equivalent:
const memoizedValue = useMemo(() => (a, b) => a + b, [])
const memoizedCallback = useCallback((a, b) => a + b, [])
```

#### Common Gotchas

1. **Unnecessary usage** — don't memoize everything
   ```jsx
   // ❌ Overkill for simple components
   const handleClick = useCallback(() => {}, [])
   return <button onClick={handleClick}>Click</button> // Button isn't memoized
   
   // ✅ Only when child is memoized
   const MemoChild = React.memo(Child)
   return <MemoChild onClick={handleClick} />
   ```

2. **Missing dependencies** — causes stale closures
   ```jsx
   const [count, setCount] = useState(0)
   
   // ❌ Missing 'count' dependency
   const logCount = useCallback(() => {
     console.log(count) // Always logs initial value!
   }, [])
   
   // ✅ Include all dependencies
   const logCount = useCallback(() => {
     console.log(count)
   }, [count])
   ```

3. **Complex dependency arrays** — hard to maintain
   ```jsx
   // ❌ Too many dependencies, callback changes often
   const handleSubmit = useCallback(() => {
     submit(formData, userId, settings, config)
   }, [formData, userId, settings, config, submit])
   
   // ✅ Option 1: Use ref for stable reference
   const formDataRef = useRef(formData)
   formDataRef.current = formData
   const handleSubmit = useCallback(() => {
     submit(formDataRef.current, ...) // Access via ref
   }, [])
   ```

4. **React.memo required** — useCallback alone doesn't prevent re-renders
   ```jsx
   // ❌ useCallback without React.memo
   const handleClick = useCallback(() => {}, [])
   return <Child onClick={handleClick} /> // Child still re-renders
   
   // ✅ useCallback + React.memo
   const MemoChild = React.memo(Child)
   return <MemoChild onClick={handleClick} />
   ```

#### Quick Decision Guide
```typescript
Passing function to child component?
  └── Child is wrapped in React.memo? 
       └── Yes, and function doesn't change often? → useCallback
       └── No? → Regular function (no memoization needed)
  └── Function used in useEffect dependency array?
       └── Yes → useCallback (to control effect re-runs)
       └── No → Regular function
```
