---
title: React Hooks 02
date: 2026-04-04
tags: [React]
---

## React Hooks - Context & Refs

### useContext

`useContext()` is a **Hook for consuming React context** without nesting Consumer components. Provides way to share values between components without explicit prop drilling.

**Core behavior:**
- **Subscribe to context** — re-renders when context value changes
- **No Provider wrapping** — cleaner than Context.Consumer
- **Performance** — component re-renders whenever context value changes
- **Multiple contexts** — can use multiple useContext calls

#### Form 1: Basic usage — `useContext(MyContext)`

When to use: Accessing context values in deeply nested components.

```jsx
import { createContext, useContext } from 'react'

// Create context
const ThemeContext = createContext('light')

// Provider component
function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Toolbar />
    </ThemeContext.Provider>
  )
}

// Consumer component
function Toolbar() {
  const theme = useContext(ThemeContext)
  return <div className={`theme-${theme}`}>Current theme: {theme}</div>
}
```

#### Form 2: With default value — `createContext(defaultValue)`

When to use: Providing fallback when no Provider exists.

```jsx
const UserContext = createContext({ name: 'Guest', isLoggedIn: false })

function UserProfile() {
  const user = useContext(UserContext)
  
  return (
    <div>
      {user.isLoggedIn ? (
        <span>Welcome, {user.name}</span>
      ) : (
        <span>Please log in</span>
      )}
    </div>
  )
}

// Without Provider, uses default value
function App() {
  return <UserProfile /> // Shows "Please log in"
}
```

#### Form 3: Multiple contexts — Combining providers

When to use: Using multiple contexts in one component.

```jsx
const ThemeContext = createContext('light')
const UserContext = createContext(null)

function Header() {
  const theme = useContext(ThemeContext)
  const user = useContext(UserContext)
  
  return (
    <header className={`theme-${theme}`}>
      {user ? <span>Hello, {user.name}</span> : <span>Welcome</span>}
    </header>
  )
}

// Provider nesting
function App() {
  return (
    <ThemeContext.Provider value="dark">
      <UserContext.Provider value={{ name: 'John' }}>
        <Header />
      </UserContext.Provider>
    </ThemeContext.Provider>
  )
}
```

#### Form 4: Custom hook pattern — Encapsulating context usage

When to use: Creating reusable hooks that wrap useContext.

```jsx
// contexts/ThemeContext.js
import { createContext, useContext } from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({ children, theme }) {
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  )
}

// Custom hook with error handling
export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === null) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

// Usage in component
import { useTheme } from './contexts/ThemeContext'

function ThemedButton() {
  const theme = useTheme() // Clean API, built-in error handling
  return <button className={theme}>Click me</button>
}
```

#### Form 5: Context with state — Combining useState and context

When to use: Sharing state and updater functions through context.

```jsx
const CountContext = createContext(null)

function CountProvider({ children }) {
  const [count, setCount] = useState(0)
  
  // Memoize value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    count,
    increment: () => setCount(c => c + 1),
    decrement: () => setCount(c => c - 1)
  }), [count])
  
  return (
    <CountContext.Provider value={value}>
      {children}
    </CountContext.Provider>
  )
}

function Counter() {
  const { count, increment, decrement } = useContext(CountContext)
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={decrement}>-</button>
      <button onClick={increment}>+</button>
    </div>
  )
}
```

#### Common Gotchas

1. **Performance issues** — all consumers re-render when context changes
   ```jsx
   // ❌ Problem: frequent updates cause all consumers to re-render
   const AppContext = createContext({ user: null, theme: 'light' })
   
   function App() {
     const [user, setUser] = useState(null)
     const [theme, setTheme] = useState('light')
     
     // Both user and theme in same context
     return (
       <AppContext.Provider value={{ user, theme }}>
         <UserProfile /> {/* Re-renders when theme changes too */}
         <ThemeToggle /> {/* Re-renders when user changes too */}
       </AppContext.Provider>
     )
   }
   
   // ✅ Solution: Split contexts
   const UserContext = createContext(null)
   const ThemeContext = createContext('light')
   ```

2. **Missing Provider** — context returns default value
   ```jsx
   const MyContext = createContext() // No default
   
   function Component() {
     const value = useContext(MyContext)
     console.log(value) // undefined if no Provider!
     return <div>{value.name}</div> // Error: Cannot read property of undefined
   }
   
   // ✅ Always provide default or check for undefined
   const MyContext = createContext({ name: 'Default' })
   // OR
   if (!value) throw new Error('MyContext.Provider missing')
   ```

3. **Context value reference** — new object every render causes re-renders
   ```jsx
   // ❌ Bad: new object every render
   function Provider({ children }) {
     const [user, setUser] = useState(null)
     return (
       <UserContext.Provider value={{ user, setUser }}>
         {children}
       </UserContext.Provider>
     )
   }
   
   // ✅ Good: memoize value
   function Provider({ children }) {
     const [user, setUser] = useState(null)
     const value = useMemo(() => ({ user, setUser }), [user])
     return (
       <UserContext.Provider value={value}>
         {children}
       </UserContext.Provider>
     )
   }
   ```

4. **Stale context values** — context doesn't update synchronously
   ```jsx
   function Component() {
     const { value, setValue } = useContext(MyContext)
     
     const handleClick = () => {
       setValue('new')
       console.log(value) // Still old value!
     }
     // Value updates on next render cycle
   }
   ```

#### Quick Decision Guide
```typescript
Need to share data across component tree?
  └── Props drilling through 3+ levels? → useContext
       └── Data changes frequently? → Consider state management library (Redux, Zustand)
       └── Static/config data? → Context is perfect
  └── Only parent-child communication? → Props (keep it simple)
  └── Multiple unrelated contexts? → Split into separate contexts
```

---

### useRef

`useRef()` is a **Hook for referencing values that persist across renders** without causing re-renders when changed. Commonly used for DOM element access.

**Core behavior:**
- **Mutable reference** — `.current` property can be modified
- **No re-render on change** — changing ref doesn't trigger component update
- **Persists across renders** — same object reference throughout component lifecycle
- **DOM access** — attach to elements via `ref` attribute

#### Form 1: DOM reference — `useRef()` for element access

When to use: Accessing DOM elements for imperative operations.

```jsx
import { useRef, useEffect } from 'react'

function TextInput() {
  const inputRef = useRef(null)
  
  useEffect(() => {
    // Focus input on mount
    inputRef.current.focus()
  }, [])
  
  const handleClick = () => {
    // Access input value directly
    console.log(inputRef.current.value)
    inputRef.current.select()
  }
  
  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={handleClick}>Get Value</button>
    </div>
  )
}
```

#### Form 2: Previous value reference — Tracking previous state

When to use: Comparing current and previous props/state.

```jsx
function Counter() {
  const [count, setCount] = useState(0)
  const prevCountRef = useRef()
  
  useEffect(() => {
    // Store current value for next render
    prevCountRef.current = count
  })
  
  const prevCount = prevCountRef.current
  
  return (
    <div>
      <p>Now: {count}, Before: {prevCount}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  )
}
```

#### Form 3: Mutable value container — Non-DOM persistent values

When to use: Storing values that shouldn't trigger re-renders.

```jsx
function Timer() {
  const [seconds, setSeconds] = useState(0)
  const intervalRef = useRef(null)
  const startTimeRef = useRef(Date.now())
  
  const start = () => {
    // Store interval ID in ref (not state - would cause re-render)
    intervalRef.current = setInterval(() => {
      setSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000))
    }, 1000)
  }
  
  const stop = () => {
    // Access interval ID from ref
    clearInterval(intervalRef.current)
  }
  
  useEffect(() => {
    return () => clearInterval(intervalRef.current) // Cleanup
  }, [])
  
  return (
    <div>
      <p>Elapsed: {seconds}s</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  )
}
```

#### Form 4: Tracking mounted state — Preventing setState after unmount

When to use: Avoiding memory leaks with async operations.

```jsx
function useIsMounted() {
  const isMountedRef = useRef(true)
  
  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])
  
  return isMountedRef
}

function UserProfile({ userId }) {
  const [user, setUser] = useState(null)
  const isMountedRef = useIsMounted()
  
  useEffect(() => {
    fetchUser(userId).then(data => {
      // Only update if component still mounted
      if (isMountedRef.current) {
        setUser(data)
      }
    })
  }, [userId])
  
  return <div>{user?.name}</div>
}
```

#### Form 5: Force re-render workaround — When you really need it

When to use: Rare cases where you need to trigger re-render without state.

```jsx
function useForceUpdate() {
  const ref = useRef(0)
  const [, setTick] = useState(0)
  
  return () => {
    ref.current++
    setTick(ref.current) // Force re-render
  }
}
```

#### Comparison: useRef vs useState

| Aspect | useRef | useState |
|--------|--------|----------|
| Triggers re-render | No | Yes |
| Use case | DOM access, mutable values | UI state |
| Update method | `.current = value` | Setter function |
| Persistence | Across renders | Across renders |
| Immutable | No (mutable) | Yes (immutable) |

#### Common Gotchas

1. **Ref updates don't trigger re-renders** — UI won't reflect ref changes
   ```jsx
   const countRef = useRef(0)
   
   const increment = () => {
     countRef.current++
     console.log(countRef.current) // Increases
     // But component doesn't re-render, UI stays same!
   }
   
   return <div>{countRef.current}</div> // Always shows 0
   ```

2. **Ref is undefined on first render** — DOM element not yet mounted
   ```jsx
   function Component() {
     const ref = useRef()
     
     console.log(ref.current) // undefined on first render
     
     useEffect(() => {
       console.log(ref.current) // DOM element available here
     }, [])
     
     return <div ref={ref}>Content</div>
   }
   ```

3. **Callback refs for dynamic behavior** — useRef can't handle all cases
   ```jsx
   // ❌ useRef doesn't work well with conditional refs
   const ref = useRef()
   
   // ✅ Use callback ref for dynamic cases
   const setRef = useCallback((node) => {
     if (node) {
       // Do something with node
       node.scrollIntoView()
     }
   }, [])
   
   return <div ref={setRef}>Content</div>
   ```

4. **Ref forwarding with components** — need forwardRef
   ```jsx
   // ❌ Regular component can't receive ref
   const MyInput = (props) => <input {...props} />
   <MyInput ref={inputRef} /> // Warning!
   
   // ✅ Use forwardRef
   const MyInput = forwardRef((props, ref) => (
     <input {...props} ref={ref} />
   ))
   ```

#### Quick Decision Guide
```typescript
Need persistent value across renders?
  └── Accessing DOM element? → useRef
  └── Storing interval ID, subscription? → useRef (not state)
  └── Tracking previous value? → useRef
  └── Value that triggers UI update? → useState (not useRef)
  └── Avoiding re-render on change? → useRef
```

---

### useImperativeHandle

`useImperativeHandle()` customizes the **instance value exposed when using ref** with `forwardRef`. Controls what parent components can access via ref.

**Core behavior:**
- **Customize ref value** — expose specific methods/properties
- **Used with forwardRef** — required for ref forwarding
- **Encapsulation** — hide internal implementation details
- **Imperative API** — for parent to call child methods

#### Form 1: Exposing methods — Custom component API

When to use: Creating component with imperative methods (like focusing).

```jsx
import { useRef, useImperativeHandle, forwardRef } from 'react'

const FancyInput = forwardRef((props, ref) => {
  const inputRef = useRef()
  
  useImperativeHandle(ref, () => ({
    // Only expose these methods, not the entire input element
    focus: () => {
      inputRef.current.focus()
    },
    clear: () => {
      inputRef.current.value = ''
    },
    getValue: () => {
      return inputRef.current.value
    }
  }), [])
  
  return <input ref={inputRef} {...props} />
})

// Usage
function Parent() {
  const fancyInputRef = useRef()
  
  return (
    <div>
      <FancyInput ref={fancyInputRef} />
      <button onClick={() => fancyInputRef.current.focus()}>Focus</button>
      <button onClick={() => fancyInputRef.current.clear()}>Clear</button>
    </div>
  )
}
```

#### Form 2: With dependencies — Dynamic imperative handle

When to use: Exposing methods that depend on component state/props.

```jsx
const Counter = forwardRef(({ step }, ref) => {
  const [count, setCount] = useState(0)
  
  useImperativeHandle(ref, () => ({
    increment: () => setCount(c => c + step),
    decrement: () => setCount(c => c - step),
    reset: () => setCount(0),
    getCount: () => count
  }), [step, count]) // Update handle when dependencies change
  
  return <div>Count: {count}</div>
})
```

#### Form 3: Animation control — Exposing animation methods

When to use: Controlling animations from parent component.

```jsx
const AnimatedBox = forwardRef((props, ref) => {
  const elementRef = useRef()
  
  useImperativeHandle(ref, () => ({
    shake: () => {
      elementRef.current.classList.add('shake')
      setTimeout(() => {
        elementRef.current.classList.remove('shake')
      }, 500)
    },
    pulse: () => {
      elementRef.current.classList.add('pulse')
    },
    stop: () => {
      elementRef.current.classList.remove('shake', 'pulse')
    }
  }), [])
  
  return <div ref={elementRef} className="animated-box" {...props} />
})

// Parent can trigger animations
function Form() {
  const boxRef = useRef()
  
  const handleError = () => {
    boxRef.current.shake()
  }
  
  return (
    <div>
      <AnimatedBox ref={boxRef} />
      <button onClick={handleError}>Trigger Error</button>
    </div>
  )
}
```

#### Common Gotchas

1. **Prefer declarative over imperative** — React favors props over refs
   ```jsx
   // ❌ Imperative approach
   const modalRef = useRef()
   <Modal ref={modalRef} />
   <button onClick={() => modalRef.current.open()}>Open</button>
   
   // ✅ Declarative approach (preferred)
   const [isOpen, setIsOpen] = useState(false)
   <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} />
   <button onClick={() => setIsOpen(true)}>Open</button>
   ```

2. **Ref doesn't auto-update** — imperative handle needs dependencies
   ```jsx
   useImperativeHandle(ref, () => ({
     getValue: () => value // Always returns initial value!
   }), []) // ❌ Missing dependency
   
   // ✅ Include all dependencies
   useImperativeHandle(ref, () => ({
     getValue: () => value
   }), [value])
   ```

3. **forwardRef required** — must wrap component
   ```jsx
   // ❌ Won't work
   const MyComponent = (props) => { ... }
   
   // ✅ Required wrapper
   const MyComponent = forwardRef((props, ref) => { ... })
   ```

#### Quick Decision Guide
```typescript
Need parent to call child methods?
  └── Can it be done declaratively with props? → Use props (preferred)
  └── Must use imperative approach?
       └── Focus, selection, media control? → useImperativeHandle
       └── Animation triggers? → useImperativeHandle
       └── Complex component API? → useImperativeHandle
```

---

## React Hooks - Debug & Advanced

### useDebugValue

`useDebugValue()` displays a **label for custom hooks in React DevTools**. Helps debugging by showing meaningful hook state.

**Core behavior:**
- **DevTools display** — shows in React DevTools hook tree
- **Deferred formatting** — expensive formatting only runs when DevTools open
- **Custom hooks only** — no effect in components

#### Form 1: Basic label — `useDebugValue(value)`

When to use: Adding debug info to custom hooks.

```jsx
import { useState, useEffect, useDebugValue } from 'react'

function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  
  useDebugValue(isOnline ? 'Online' : 'Offline')
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])
  
  return isOnline
}
```

#### Form 2: Deferred formatting — `useDebugValue(value, formatFn)`

When to use: Expensive formatting that should only run when DevTools open.

```jsx
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null)
  
  // Format function only runs when DevTools inspects this hook
  useDebugValue(friendID, friendID => {
    return `Friend ${friendID}: ${isOnline ? 'Online' : 'Offline'}`
  })
  
  useEffect(() => {
    // Subscribe to friend status...
  }, [friendID])
  
  return isOnline
}
```

#### Common Gotchas

1. **Production no-op** — has no effect in production
2. **Only for custom hooks** — doesn't work in components
3. **Don't overuse** — only for hooks where state isn't obvious

---

### useId

`useId()` generates **unique IDs for accessibility attributes** that are stable across server and client rendering.

**Core behavior:**
- **Unique ID generation** — consistent between SSR and client
- **Stable across renders** — same ID on every render
- **Prefix support** — can generate related IDs
- **Accessibility use** — for `htmlFor`, `aria-labelledby`, etc.

#### Form 1: Basic ID — Form label association

When to use: Connecting labels to form inputs.

```jsx
import { useId } from 'react'

function PasswordField() {
  const passwordId = useId()
  const hintId = useId()
  
  return (
    <>
      <label htmlFor={passwordId}>Password:</label>
      <input 
        id={passwordId}
        type="password"
        aria-describedby={hintId}
      />
      <p id={hintId}>Password must be at least 8 characters</p>
    </>
  )
}
// Generates: id=":r0:", hintId=":r1:"
```

#### Form 2: Multiple related IDs — Component with multiple fields

When to use: Complex form components with multiple inputs.

```jsx
function ShippingForm() {
  const id = useId()
  
  return (
    <form>
      <label htmlFor={`${id}-name`}>Name:</label>
      <input id={`${id}-name`} type="text" />
      
      <label htmlFor={`${id}-address`}>Address:</label>
      <input id={`${id}-address`} type="text" />
      
      <label htmlFor={`${id}-city`}>City:</label>
      <input id={`${id}-city`} type="text" />
    </form>
  )
}
// Generates: :r2:-name, :r2:-address, :r2:-city
```

#### Form 3: List items — Unique IDs for repeated components

When to use: Generating IDs for list items.

```jsx
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  )
}

function TodoItem({ todo }) {
  const id = useId()
  
  return (
    <li>
      <input 
        id={`${id}-checkbox`}
        type="checkbox" 
        checked={todo.completed}
      />
      <label htmlFor={`${id}-checkbox`}>{todo.text}</label>
    </li>
  )
}
```

#### Comparison: useId vs Math.random()

| Aspect | useId | Math.random() |
|--------|-------|---------------|
| SSR safe | Yes | No (hydration mismatch) |
| Stable | Yes | No (different each render) |
| Unique | Component-scoped | Globally random |
| Use case | Accessibility IDs | Not recommended |

#### Common Gotchas

1. **Don't use for keys** — useId is not for React keys
   ```jsx
   // ❌ Wrong use
   {items.map((item, index) => (
     <div key={useId()}>{item}</div> // New ID every render!
   ))}
   
   // ✅ Correct
   {items.map(item => (
     <div key={item.id}>{item}</div>
   ))}
   ```

2. **Not for CSS selectors** — IDs are not meant for styling
   ```jsx
   // ❌ Don't style with useId
   <style>{`#${id} { color: red; }`}</style>
   
   // ✅ Use CSS classes or data attributes
   <div className="my-component">
   ```

#### Quick Decision Guide
```typescript
Need unique identifier?
  └── For accessibility (aria-*, htmlFor)? → useId
  └── For CSS styling? → Use classes, not IDs
  └── For React keys? → Use data IDs, not useId
  └── SSR environment? → useId (not Math.random())
```

---

### useTransition

`useTransition()` marks state updates as **non-urgent** to keep UI responsive during expensive re-renders.

**Core behavior:**
- **Concurrent feature** — React 18+ concurrent mode
- **isPending flag** — indicates transition in progress
- **Non-blocking** — urgent updates (like typing) aren't blocked
- **startTransition** — wrap expensive state updates

#### Form 1: Basic transition — Keeping input responsive

When to use: Expensive list filtering that shouldn't block typing.

```jsx
import { useState, useTransition } from 'react'

function FilterList({ items }) {
  const [filter, setFilter] = useState('')
  const [filteredItems, setFilteredItems] = useState(items)
  const [isPending, startTransition] = useTransition()
  
  const handleChange = (e) => {
    const value = e.target.value
    
    // Urgent: update input immediately
    setFilter(value)
    
    // Non-urgent: filter list without blocking UI
    startTransition(() => {
      const filtered = items.filter(item =>
        item.name.toLowerCase().includes(value.toLowerCase())
      )
      setFilteredItems(filtered)
    })
  }
  
  return (
    <div>
      <input 
        value={filter} 
        onChange={handleChange}
        style={{ 
          // Visual feedback during transition
          opacity: isPending ? 0.7 : 1 
        }}
      />
      {isPending && <span>Updating...</span>}
      <ul>
        {filteredItems.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  )
}
```

#### Form 2: Tab switching — With loading state

When to use: Switching between heavy tab panels.

```jsx
function TabContainer() {
  const [tab, setTab] = useState('home')
  const [isPending, startTransition] = useTransition()
  
  const selectTab = (nextTab) => {
    startTransition(() => {
      setTab(nextTab)
    })
  }
  
  return (
    <div>
      <div className="tabs">
        {['home', 'profile', 'settings'].map(t => (
          <button
            key={t}
            onClick={() => selectTab(t)}
            className={tab === t ? 'active' : ''}
          >
            {t}
          </button>
        ))}
      </div>
      
      {isPending && <div className="spinner" />}
      
      <div className={`tab-content ${isPending ? 'loading' : ''}`}>
        {tab === 'home' && <HomePanel />}
        {tab === 'profile' && <ProfilePanel />}
        {tab === 'settings' && <SettingsPanel />}
      </div>
    </div>
  )
}
```

#### Common Gotchas

1. **Not for all updates** — only for truly non-urgent updates
   ```jsx
   // ❌ Don't wrap everything
   startTransition(() => {
     setCount(count + 1) // Simple update, no benefit
   })
   
   // ✅ Only for expensive updates
   startTransition(() => {
     setFilteredList(heavyFilter(largeList))
   })
   ```

2. **No guaranteed delay** — transition may complete immediately
   ```jsx
   // Don't rely on isPending always being true for a while
   // If update is fast, isPending may be false immediately
   ```

3. **React 18+ only** — requires concurrent features enabled

#### Quick Decision Guide
```typescript
State update causing UI lag?
  └── Large list filtering/sorting? → useTransition
  └── Heavy component switching (tabs)? → useTransition
  └── Simple state updates? → Direct setState (no transition)
  └── User input must stay responsive? → useTransition for expensive updates
```

---

### useDeferredValue

`useDeferredValue()` defers updating a **part of the UI** to keep it responsive. Similar to useTransition but for values, not state setters.

**Core behavior:**
- **Defer re-render** — delays re-rendering with new value
- **Show stale value** — keeps showing old value during deferral
- **Automatic catching up** — eventually shows latest value
- **Like debouncing** — but integrated with React scheduling

#### Form 1: Deferred search results — Keeping search input fast

When to use: Search that filters large results list.

```jsx
import { useState, useDeferredValue, memo } from 'react'

function SearchPage() {
  const [query, setQuery] = useState('')
  
  // Defer the query for expensive components
  const deferredQuery = useDeferredValue(query)
  
  return (
    <div>
      {/* Input stays responsive */}
      <input 
        value={query} 
        onChange={e => setQuery(e.target.value)}
      />
      
      {/* SearchResults receives deferred value */}
      <SearchResults query={deferredQuery} />
    </div>
  )
}

// Expensive component that re-renders with deferred value
const SearchResults = memo(function SearchResults({ query }) {
  const results = useMemo(() => {
    return heavySearch(query) // Expensive operation
  }, [query])
  
  return (
    <ul>
      {results.map(item => <li key={item.id}>{item.name}</li>)}
    </ul>
  )
})
```

#### Form 2: With isPending — Show loading state

When to use: Visual feedback during deferred update.

```jsx
function Chart({ data }) {
  const deferredData = useDeferredValue(data)
  const isStale = deferredData !== data
  
  return (
    <div style={{ opacity: isStale ? 0.5 : 1 }}>
      <ExpensiveChart data={deferredData} />
      {isStale && <div>Updating chart...</div>}
    </div>
  )
}
```

#### Comparison: useDeferredValue vs useTransition

| Hook | Controls | Best for |
|------|----------|----------|
| useTransition | State updates | When you control the state setter |
| useDeferredValue | Prop values | When value comes from parent/props |

```jsx
// useTransition: you call setState
const [value, setValue] = useState('')
startTransition(() => setValue(newValue))

// useDeferredValue: value comes from outside
const deferredValue = useDeferredValue(valueFromParent)
```

#### Common Gotchas

1. **Component must be memoized** — otherwise no benefit
   ```jsx
   // ❌ No benefit without memo
   function SlowComponent({ value }) { ... }
   
   // ✅ Must be memoized
   const SlowComponent = memo(function SlowComponent({ value }) { ... })
   ```

2. **Not for critical UI** — user sees stale data temporarily
   ```jsx
   // ❌ Don't defer critical data
   const deferredBalance = useDeferredValue(accountBalance)
   
   // ✅ OK for non-critical display
   const deferredChartData = useDeferredValue(chartData)
   ```

#### Quick Decision Guide
```typescript
Need to defer expensive re-render?
  └── Value comes from props/parent? → useDeferredValue
       └── Component is memoized? → useDeferredValue (required)
       └── Component not memoized? → Memoize first
  └── You control the state setter? → useTransition
  └── Must show latest data immediately? → Don't defer
```

---

### useSyncExternalStore

`useSyncExternalStore()` subscribes to an **external data store** with built-in support for concurrent rendering and snapshot-based updates.

**Core behavior:**
- **External store integration** — Redux, Zustand, browser APIs
- **Snapshot-based** — consistent reads during concurrent rendering
- **Server rendering support** — getServerSnapshot for SSR
- **Automatic subscription** — handles subscribe/unsubscribe

#### Form 1: Browser API — Online status

When to use: Subscribing to browser events.

```jsx
import { useSyncExternalStore } from 'react'

function useOnlineStatus() {
  return useSyncExternalStore(
    // Subscribe function
    (callback) => {
      window.addEventListener('online', callback)
      window.addEventListener('offline', callback)
      return () => {
        window.removeEventListener('online', callback)
        window.removeEventListener('offline', callback)
      }
    },
    // Get snapshot (client)
    () => navigator.onLine,
    // Get snapshot (server)
    () => true // Assume online on server
  )
}

function StatusIndicator() {
  const isOnline = useOnlineStatus()
  return <div>{isOnline ? 'Online' : 'Offline'}</div>
}
```

#### Form 2: External store — Redux/Zustand integration

When to use: Connecting to state management libraries.

```jsx
// Simple external store
const store = {
  state: { count: 0 },
  listeners: new Set(),
  subscribe(callback) {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  },
  getSnapshot() {
    return this.state
  },
  increment() {
    this.state = { count: this.state.count + 1 }
    this.listeners.forEach(cb => cb())
  }
}

function useStore() {
  return useSyncExternalStore(
    (callback) => store.subscribe(callback),
    () => store.getSnapshot(),
    () => ({ count: 0 }) // Server snapshot
  )
}

function Counter() {
  const state = useStore()
  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => store.increment()}>Increment</button>
    </div>
  )
}
```

#### Form 3: LocalStorage sync — Cross-tab state

When to use: Syncing state across browser tabs.

```jsx
function useLocalStorage(key, initialValue) {
  const getSnapshot = () => {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : initialValue
  }
  
  const subscribe = (callback) => {
    const handleStorage = (e) => {
      if (e.key === key) callback()
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }
  
  return useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => initialValue
  )
}

// Updates from other tabs automatically reflect
function SyncedCounter() {
  const count = useLocalStorage('counter', 0)
  
  const increment = () => {
    localStorage.setItem('counter', JSON.stringify(count + 1))
  }
  
  return (
    <div>
      <p>Count (synced): {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  )
}
```

#### Common Gotchas

1. **Snapshot must be immutable** — don't mutate returned value
   ```jsx
   // ❌ Mutating snapshot
   const state = useSyncExternalStore(subscribe, getSnapshot)
   state.count++ // Mutation!
   
   // ✅ Treat as immutable
   const state = useSyncExternalStore(subscribe, getSnapshot)
   const newCount = state.count + 1 // New value
   ```

2. **Snapshot must be referentially stable** — same value = same reference
   ```jsx
   // ❌ New object every call
   const getSnapshot = () => ({ count: store.count })
   
   // ✅ Return same reference if unchanged
   const getSnapshot = () => store.getState()
   ```

3. **Server snapshot required for SSR** — prevents hydration mismatch
   ```jsx
   useSyncExternalStore(
     subscribe,
     getClientSnapshot,
     getServerSnapshot // Required for SSR!
   )
   ```

#### Quick Decision Guide
```typescript
Subscribing to external data source?
  └── Browser API (online, geolocation)? → useSyncExternalStore
  └── State management library? → useSyncExternalStore
  └── localStorage/sessionStorage? → useSyncExternalStore
  └── Simple React state? → useState/useReducer (prefer built-in)
```

---

## Custom Hooks Patterns

### Pattern 1: Data fetching hook — useFetch

```jsx
function useFetch(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    const controller = new AbortController()
    
    fetch(url, { signal: controller.signal })
      .then(res => res.json())
      .then(data => {
        setData(data)
        setLoading(false)
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          setError(err)
          setLoading(false)
        }
      })
    
    return () => controller.abort()
  }, [url])
  
  return { data, loading, error }
}

// Usage
function UserProfile({ userId }) {
  const { data: user, loading, error } = useFetch(`/api/users/${userId}`)
  
  if (loading) return <Spinner />
  if (error) return <Error message={error.message} />
  return <div>{user.name}</div>
}
```

### Pattern 2: Form handling hook — useForm

```jsx
function useForm(initialValues, onSubmit) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setValues(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await onSubmit(values)
      setErrors({})
    } catch (err) {
      setErrors(err.errors || {})
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return { values, errors, isSubmitting, handleChange, handleSubmit }
}
```

### Pattern 3: LocalStorage hook — useLocalStorage

```jsx
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })
  
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])
  
  return [value, setValue]
}

// Usage
function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage('theme', 'light')
  
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Toggle Theme
    </button>
  )
}
```

### Pattern 4: Debounced value hook — useDebounce

```jsx
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    
    return () => clearTimeout(timer)
  }, [value, delay])
  
  return debouncedValue
}

// Usage
function SearchInput() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 500)
  
  useEffect(() => {
    // Only search after user stops typing
    searchAPI(debouncedQuery)
  }, [debouncedQuery])
  
  return <input value={query} onChange={e => setQuery(e.target.value)} />
}
```

### Pattern 5: Previous value hook — usePrevious

```jsx
function usePrevious(value) {
  const ref = useRef()
  
  useEffect(() => {
    ref.current = value
  })
  
  return ref.current
}

// Usage
function Counter() {
  const [count, setCount] = useState(0)
  const prevCount = usePrevious(count)
  
  return (
    <div>
      <p>Now: {count}, Before: {prevCount}</p>
      <button onClick={() => setCount(c => c + 1)}>+</button>
    </div>
  )
}
```

### Pattern 6: Toggle hook — useToggle

```jsx
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue)
  
  const toggle = useCallback(() => setValue(v => !v), [])
  const setTrue = useCallback(() => setValue(true), [])
  const setFalse = useCallback(() => setValue(false), [])
  
  return { value, toggle, setTrue, setFalse, setValue }
}

// Usage
function Modal() {
  const { value: isOpen, toggle, setFalse: close } = useToggle(false)
  
  return (
    <>
      <button onClick={toggle}>Toggle Modal</button>
      {isOpen && (
        <div className="modal">
          <button onClick={close}>Close</button>
        </div>
      )}
    </>
  )
}
```

### Pattern 7: Media query hook — useMediaQuery

```jsx
function useMediaQuery(query) {
  const [matches, setMatches] = useState(false)
  
  useEffect(() => {
    const media = window.matchMedia(query)
    setMatches(media.matches)
    
    const listener = (e) => setMatches(e.matches)
    media.addEventListener('change', listener)
    
    return () => media.removeEventListener('change', listener)
  }, [query])
  
  return matches
}

// Usage
function ResponsiveComponent() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)')
  
  return (
    <div>
      {isMobile && <MobileLayout />}
      {isTablet && <TabletLayout />}
      {!isMobile && !isTablet && <DesktopLayout />}
    </div>
  )
}
```
