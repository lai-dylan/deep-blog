---
title: React Components & APIs 03
date: 2026-04-04
tags: [React]
---

## React Core APIs

### createElement

`createElement()` is the **core API for creating React elements**. JSX compiles to createElement calls. Rarely used directly in modern React.

**Core behavior:**
- **Returns React element** — virtual DOM node, not actual DOM
- **JSX compilation target** — JSX transforms to createElement
- **Three arguments** — type, props, children
- **Immutable** — creates new element, doesn't modify existing

#### Form 1: Basic element — `createElement('div', props, children)`

When to use: Dynamic element creation without JSX.

```jsx
import { createElement } from 'react'

// JSX
const element = <div className="container">Hello</div>

// Equivalent createElement
const element = createElement(
  'div',
  { className: 'container' },
  'Hello'
)
```

#### Form 2: Component element — `createElement(Component, props)`

When to use: Creating component elements dynamically.

```jsx
import { createElement } from 'react'

function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>
}

// JSX
const element = <Greeting name="John" />

// Equivalent createElement
const element = createElement(Greeting, { name: 'John' })
```

#### Form 3: Multiple children — Array of children

When to use: Dynamic list of children.

```jsx
const items = ['Apple', 'Banana', 'Cherry']

// JSX
const list = (
  <ul>
    {items.map(item => <li key={item}>{item}</li>)}
  </ul>
)

// Equivalent createElement
const list = createElement(
  'ul',
  null,
  items.map(item => createElement('li', { key: item }, item))
)
```

#### Form 4: Fragment — `createElement(Fragment)`

When to use: Multiple elements without wrapper.

```jsx
import { createElement, Fragment } from 'react'

// JSX
const fragment = (
  <>
    <h1>Title</h1>
    <p>Content</p>
  </>
)

// Equivalent createElement
const fragment = createElement(
  Fragment,
  null,
  createElement('h1', null, 'Title'),
  createElement('p', null, 'Content')
)
```

#### Common Gotchas

1. **Props are shallow merged** — doesn't deeply merge nested objects
   ```jsx
   // ❌ Nested props overwritten, not merged
   createElement('div', { style: { color: 'red' } })
   // If spreading props with existing style, need manual merge
   ```

2. **Children can be any value** — not just React elements
   ```jsx
   createElement('div', null, 'Text') // ✅ String
   createElement('div', null, 42) // ✅ Number
   createElement('div', null, null) // ✅ Null
   createElement('div', null, [1, 2, 3]) // ✅ Array
   ```

3. **Keys must be on elements, not createElement call**
   ```jsx
   // ✅ Key in props
   createElement('li', { key: item.id }, item.name)
   ```

---

### cloneElement

`cloneElement()` creates a **copy of a React element** with new props. Used for enhancing child components.

**Core behavior:**
- **Copies element** — creates new element based on existing
- **Merges props** — shallow merge with existing props
- **Replaces children** — optional new children
- **Preserves ref** — keeps original ref if not overridden

#### Form 1: Add props — Enhancing child elements

When to use: Injecting props into children (common in design systems).

```jsx
import { cloneElement, Children } from 'react'

function ButtonGroup({ children, size }) {
  return (
    <div className="button-group">
      {Children.map(children, (child) =>
        cloneElement(child, { size })
      )}
    </div>
  )
}

// Usage
<ButtonGroup size="large">
  <Button>Save</Button>
  <Button>Cancel</Button>
</ButtonGroup>
// Both buttons receive size="large" prop
```

#### Form 2: Event composition — Combining event handlers

When to use: Adding event handlers without overwriting child's.

```jsx
function TooltipTrigger({ children, onShow }) {
  return cloneElement(children, {
    onMouseEnter: (e) => {
      children.props.onMouseEnter?.(e)
      onShow()
    },
    onMouseLeave: (e) => {
      children.props.onMouseLeave?.(e)
      onHide()
    }
  })
}
```

#### Form 3: Style composition — Merging styles

When to use: Combining parent and child styles.

```jsx
function StyledWrapper({ children, wrapperStyle }) {
  const child = Children.only(children)
  
  return cloneElement(child, {
    style: {
      ...child.props.style,
      ...wrapperStyle
    }
  })
}
```

#### Comparison: cloneElement vs render props

| Approach | Pros | Cons |
|----------|------|------|
| cloneElement | Simple, clean JSX | Magic, harder to trace |
| Render props | Explicit, flexible | More verbose |

```jsx
// cloneElement approach
<TooltipTrigger onShow={showTooltip}>
  <Button>Hover me</Button>
</TooltipTrigger>

// Render props approach (more explicit)
<TooltipTrigger onShow={showTooltip}>
  {(props) => <Button {...props}>Hover me</Button>}
</TooltipTrigger>
```

#### Common Gotchas

1. **Breaks component encapsulation** — parent knows child's props
   ```jsx
   // ❌ Brittle: assumes child accepts these props
   cloneElement(child, { active: true })
   ```

2. **Children.only for single child** — validate single child
   ```jsx
   import { Children } from 'react'
   
   const child = Children.only(children) // Throws if not single child
   return cloneElement(child, { ... })
   ```

3. **Ref preservation** — cloneElement preserves ref
   ```jsx
   const cloned = cloneElement(child, { ref: newRef })
   // Original ref is replaced, not merged
   ```

---

### createContext

`createContext()` creates a **Context object** for sharing data through component tree without prop drilling.

**Core behavior:**
- **Returns Context object** — contains Provider and Consumer
- **Default value** — used when no Provider in tree
- **Provider/Consumer pair** — Provider sets value, Consumer reads
- **Multiple contexts** — can nest multiple context providers

#### Form 1: Basic context — `createContext(defaultValue)`

When to use: Sharing global-like data (theme, auth, locale).

```jsx
import { createContext, useContext } from 'react'

// Create context with default value
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
function ThemedButton() {
  const theme = useContext(ThemeContext)
  return <button className={theme}>Click me</button>
}
```

#### Form 2: Context with complex object — State and actions

When to use: Sharing both state and updater functions.

```jsx
const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {}
})

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  
  const value = useMemo(() => ({
    user,
    login: (userData) => setUser(userData),
    logout: () => setUser(null)
  }), [user])
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
```

#### Form 3: Multiple contexts — Combined providers

When to use: Organizing related but separate data.

```jsx
const ThemeContext = createContext('light')
const LocaleContext = createContext('en')
const UserContext = createContext(null)

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <LocaleContext.Provider value="zh-CN">
        <UserContext.Provider value={currentUser}>
          <Main />
        </UserContext.Provider>
      </LocaleContext.Provider>
    </ThemeContext.Provider>
  )
}
```

#### Common Gotchas

1. **Default value only used without Provider**
   ```jsx
   const MyContext = createContext('default')
   
   // With Provider, uses Provider's value
   <MyContext.Provider value="provided">
     <Child /> // Gets "provided"
   </MyContext.Provider>
   
   // Without Provider, uses default
   <Child /> // Gets "default"
   ```

2. **Value reference equality** — new object every render causes re-renders
   ```jsx
   // ❌ Bad: new object every render
   <MyContext.Provider value={{ theme: 'dark' }}>
   
   // ✅ Good: stable reference
   const value = useMemo(() => ({ theme }), [theme])
   <MyContext.Provider value={value}>
   ```

3. **Context splits** — too much in one context causes unnecessary re-renders
   ```jsx
   // ❌ Bad: unrelated data together
   const AppContext = createContext({ theme, user, locale })
   
   // ✅ Good: split by concern
   const ThemeContext = createContext(theme)
   const UserContext = createContext(user)
   ```

---

### forwardRef

`forwardRef()` creates a **component that forwards refs** to a child DOM element or component. Essential for reusable component libraries.

**Core behavior:**
- **Ref forwarding** — passes ref to underlying element
- **Second parameter** — receives ref as second argument
- **Required for ref access** — regular components can't receive refs
- **Common use cases** — form inputs, buttons, any focusable element

#### Form 1: DOM element forwarding — Input components

When to use: Creating reusable input components.

```jsx
import { forwardRef } from 'react'

const TextInput = forwardRef((props, ref) => {
  return <input ref={ref} {...props} />
})

// Usage
function Form() {
  const inputRef = useRef()
  
  return (
    <div>
      <TextInput ref={inputRef} placeholder="Enter name" />
      <button onClick={() => inputRef.current.focus()}>
        Focus Input
      </button>
    </div>
  )
}
```

#### Form 2: With display name — DevTools readability

When to use: Debugging and component identification.

```jsx
const FancyButton = forwardRef((props, ref) => (
  <button ref={ref} className="fancy" {...props} />
))

FancyButton.displayName = 'FancyButton'
// Shows as FancyButton in DevTools instead of ForwardRef
```

#### Form 3: Component forwarding — Higher-order component pattern

When to use: Wrapping components while preserving ref access.

```jsx
const withLoading = (Component) => {
  const WrappedComponent = forwardRef((props, ref) => {
    const { isLoading, ...rest } = props
    
    if (isLoading) {
      return <Spinner />
    }
    
    return <Component ref={ref} {...rest} />
  })
  
  WrappedComponent.displayName = `withLoading(${Component.displayName || Component.name})`
  return WrappedComponent
}
```

#### Form 4: With useImperativeHandle — Custom ref API

When to use: Exposing specific methods instead of DOM node.

```jsx
const FancyInput = forwardRef((props, ref) => {
  const inputRef = useRef()
  
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current.focus(),
    clear: () => { inputRef.current.value = '' },
    getValue: () => inputRef.current.value
  }))
  
  return <input ref={inputRef} {...props} />
})
```

#### Common Gotchas

1. **Ref is null without forwardRef**
   ```jsx
   // ❌ Regular component, ref won't work
   const MyInput = (props) => <input {...props} />
   <MyInput ref={inputRef} /> // Warning!
   
   // ✅ With forwardRef
   const MyInput = forwardRef((props, ref) => <input ref={ref} {...props} />)
   ```

2. **Destructuring breaks ref** — ref not in props
   ```jsx
   // ❌ ref not in destructured props
   const Component = forwardRef(({ ref, ...props }, forwardedRef) => ())
   
   // ✅ ref is second parameter
   const Component = forwardRef((props, ref) => ())
   ```

3. **Generic TypeScript support**
   ```tsx
   interface Props {
     label: string
   }
   
   const Input = forwardRef<HTMLInputElement, Props>(
     ({ label }, ref) => (
       <label>
         {label}
         <input ref={ref} />
       </label>
     )
   )
   ```

---

### lazy

`lazy()` enables **code-splitting** by deferring component loading until first render.

**Core behavior:**
- **Dynamic import** — uses dynamic import() syntax
- **Returns component** — can be used like regular component
- **Requires Suspense** — must wrap with Suspense boundary
- **Loading state** — shows fallback while loading

#### Form 1: Basic lazy loading — Route-based splitting

When to use: Code splitting by route.

```jsx
import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Lazy load components
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Dashboard = lazy(() => import('./pages/Dashboard'))

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
```

#### Form 2: Named exports — Loading specific exports

When to use: Lazy loading named exports from module.

```jsx
// Component file exports multiple components
export function AdminDashboard() { ... }
export function UserDashboard() { ... }

// Lazy load specific named export
const AdminDashboard = lazy(() => 
  import('./Dashboards').then(module => ({ 
    default: module.AdminDashboard 
  }))
)
```

#### Form 3: With retry logic — Handling load failures

When to use: Resilient loading with retry capability.

```jsx
const lazyWithRetry = (componentImport) => lazy(async () => {
  const pageHasAlreadyBeenForceRefreshed = JSON.parse(
    window.localStorage.getItem('page-has-been-force-refreshed') || 'false'
  )
  
  try {
    const component = await componentImport()
    window.localStorage.setItem('page-has-been-force-refreshed', 'false')
    return component
  } catch (error) {
    if (!pageHasAlreadyBeenForceRefreshed) {
      window.localStorage.setItem('page-has-been-force-refreshed', 'true')
      return window.location.reload()
    }
    throw error
  }
})

const HeavyComponent = lazyWithRetry(() => import('./HeavyComponent'))
```

#### Common Gotchas

1. **Must use Suspense** — lazy components require Suspense wrapper
   ```jsx
   // ❌ Without Suspense - error!
   const LazyComponent = lazy(() => import('./Component'))
   return <LazyComponent />
   
   // ✅ With Suspense
   <Suspense fallback={<Loading />}>
     <LazyComponent />
   </Suspense>
   ```

2. **Server-side rendering** — requires specific SSR configuration
   ```jsx
   // Use loadable-components for SSR instead
   import loadable from '@loadable/component'
   const OtherComponent = loadable(() => import('./OtherComponent'))
   ```

3. **Error boundaries** — wrap with ErrorBoundary for load failures
   ```jsx
   <ErrorBoundary>
     <Suspense fallback={<Loading />}>
       <LazyComponent />
     </Suspense>
   </ErrorBoundary>
   ```

---

### Suspense

`Suspense` is a **component for handling loading states** of lazy-loaded components and data fetching.

**Core behavior:**
- **Fallback UI** — shows while children are loading
- **Tree-level** — handles all Suspense-enabled children
- **Multiple boundaries** — can nest for granular loading states
- **Data fetching** — can suspend on promise-based data

#### Form 1: Basic Suspense — Lazy component loading

When to use: Code splitting with loading states.

```jsx
import { Suspense, lazy } from 'react'

const Profile = lazy(() => import('./Profile'))
const Dashboard = lazy(() => import('./Dashboard'))

function App() {
  return (
    <div>
      <h1>My App</h1>
      <Suspense fallback={<div>Loading profile...</div>}>
        <Profile />
      </Suspense>
      <Suspense fallback={<div>Loading dashboard...</div>}>
        <Dashboard />
      </Suspense>
    </div>
  )
}
```

#### Form 2: Nested boundaries — Granular loading

When to use: Different loading states for different parts of UI.

```jsx
function App() {
  return (
    <Layout>
      <NavBar />
      
      <Suspense fallback={<PageSkeleton />}>
        <main>
          <Suspense fallback={<SidebarSkeleton />}>
            <Sidebar />
          </Suspense>
          
          <Suspense fallback={<ContentSkeleton />}>
            <MainContent />
          </Suspense>
        </main>
      </Suspense>
    </Layout>
  )
}
```

#### Form 3: With data fetching — React Query / Relay integration

When to use: Data fetching with Suspense (experimental in React 18).

```jsx
import { Suspense } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'

function UserProfile({ userId }) {
  // This will suspend if data not ready
  const { data: user } = useSuspenseQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId)
  })
  
  return <div>{user.name}</div>
}

function App() {
  return (
    <Suspense fallback={<UserSkeleton />}>
      <UserProfile userId={1} />
    </Suspense>
  )
}
```

#### Common Gotchas

1. **Only works with Suspense-compatible libraries** — not regular promises
   ```jsx
   // ❌ Regular fetch doesn't trigger Suspense
   const data = await fetch('/api') // Won't suspend
   
   // ✅ Use Suspense-enabled data library
   const data = useSuspenseQuery({...}) // Will suspend
   ```

2. **Server components** — different Suspense behavior in RSC
   ```jsx
   // Server components can suspend during SSR
   // Client components need streaming SSR setup
   ```

3. **Error boundaries** — errors in suspended components need ErrorBoundary
   ```jsx
   <ErrorBoundary fallback={<ErrorMessage />}>
     <Suspense fallback={<Loading />}>
       <ComponentThatMightError />
     </Suspense>
   </ErrorBoundary>
   ```

---

### memo

`memo()` creates a **memoized component** that only re-renders when props change. Shallow comparison by default.

**Core behavior:**
- **Shallow prop comparison** — checks if props changed (reference equality)
- **Prevents re-renders** — skips render if props same
- **Custom comparison** — can provide custom areEqual function
- **Returns new component** — wrap existing component

#### Form 1: Basic memo — Prevent unnecessary re-renders

When to use: Expensive components with stable props.

```jsx
import { memo } from 'react'

// Regular component - re-renders whenever parent does
function UserList({ users }) {
  console.log('UserList rendered')
  return (
    <ul>
      {users.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  )
}

// Memoized - only re-renders when users prop changes
const MemoizedUserList = memo(UserList)

function Parent() {
  const [count, setCount] = useState(0)
  const users = useMemo(() => [...], []) // Stable reference
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      {/* Won't re-render when count changes because users is stable */}
      <MemoizedUserList users={users} />
    </div>
  )
}
```

#### Form 2: With custom comparison — Deep equality

When to use: Complex prop comparison needs.

```jsx
import { memo } from 'react'
import isEqual from 'lodash/isEqual'

const ComplexComponent = memo(
  function ComplexComponent({ config, data }) {
    return <div>{/* expensive render */}</div>
  },
  // Custom comparison function
  (prevProps, nextProps) => {
    // Return true if props are equal (don't re-render)
    return (
      isEqual(prevProps.config, nextProps.config) &&
      prevProps.data.id === nextProps.data.id
    )
  }
)
```

#### Form 3: With children — Memoizing wrapper components

When to use: Components that accept children.

```jsx
const Card = memo(function Card({ title, children }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <div className="content">{children}</div>
    </div>
  )
})

// Usage
function Parent() {
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      {/* Card won't re-render when count changes */}
      <Card title="Static Title">
        <p>Content that doesn't depend on count</p>
      </Card>
    </div>
  )
}
```

#### Comparison: When memo helps vs doesn't

```jsx
// ❌ Doesn't help: unstable props
const MemoizedComponent = memo(Component)
<MemoizedComponent data={{ id: 1 }} /> // New object every render
<MemoizedComponent onClick={() => {}} /> // New function every render

// ✅ Helps: stable props
const data = useMemo(() => ({ id: 1 }), [])
const handleClick = useCallback(() => {}, [])
<MemoizedComponent data={data} onClick={handleClick} />
```

#### Common Gotchas

1. **Reference equality matters** — objects/functions need useMemo/useCallback
   ```jsx
   // ❌ Still re-renders: new object every time
   <MemoComponent config={{ theme: 'dark' }} />
   
   // ✅ Stable reference
   const config = useMemo(() => ({ theme: 'dark' }), [])
   <MemoComponent config={config} />
   ```

2. **Children props** — JSX creates new elements every render
   ```jsx
   // ❌ Still re-renders: new element every time
   <MemoCard>
     <div>Content</div>
   </MemoCard>
   
   // ✅ Use useMemo for children
   const content = useMemo(() => <div>Content</div>, [])
   <MemoCard>{content}</MemoCard>
   ```

3. **Context changes** — context updates bypass memo
   ```jsx
   const MemoChild = memo(Child)
   
   function Parent() {
     const [count, setCount] = useState(0)
     return (
       <MyContext.Provider value={count}>
         {/* Will re-render when context changes, despite memo */}
         <MemoChild />
       </MyContext.Provider>
     )
   }
   ```

4. **Not always beneficial** — comparison cost vs render cost
   ```jsx
   // ❌ Overkill for simple component
   const SimpleText = memo(({ text }) => <span>{text}</span>)
   
   // ✅ Worth it for expensive components
   const ExpensiveChart = memo(({ data }) => (
     <canvas>{/* heavy computation */}</canvas>
   ))
   ```

---

## React DOM APIs

### createPortal

`createPortal()` renders children into a **DOM node outside parent hierarchy**. Useful for modals, tooltips, and overlays.

**Core behavior:**
- **Different DOM location** — renders to different container
- **Same React tree** — events bubble through React tree (not DOM tree)
- **SSR compatible** — container must exist on client
- **Multiple portals** — can render to same container

#### Form 1: Modal dialog — Rendering to document.body

When to use: Modals that need to escape overflow:hidden parents.

```jsx
import { createPortal } from 'react-dom'

function Modal({ children, onClose }) {
  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>,
    document.body // Render outside current component tree
  )
}

// Usage
function App() {
  const [showModal, setShowModal] = useState(false)
  
  return (
    <div className="container" style={{ overflow: 'hidden' }}>
      <button onClick={() => setShowModal(true)}>Open Modal</button>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <h2>Modal Content</h2>
          <p>This renders outside the container!</p>
        </Modal>
      )}
    </div>
  )
}
```

#### Form 2: Tooltip portal — Positioning relative to viewport

When to use: Tooltips that need precise positioning.

```jsx
function Tooltip({ children, content, show }) {
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const triggerRef = useRef()
  
  useEffect(() => {
    if (show && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setCoords({ x: rect.left, y: rect.bottom + 8 })
    }
  }, [show])
  
  return (
    <>
      <span ref={triggerRef}>{children}</span>
      {show && createPortal(
        <div 
          className="tooltip" 
          style={{ position: 'fixed', left: coords.x, top: coords.y }}
        >
          {content}
        </div>,
        document.body
      )}
    </>
  )
}
```

#### Form 3: Dedicated portal container — SSR-safe

When to use: Cleaner organization, SSR compatibility.

```jsx
// index.html
// <div id="root"></div>
// <div id="portal-root"></div>

function Portal({ children }) {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])
  
  if (!mounted) return null
  
  return createPortal(
    children,
    document.getElementById('portal-root')
  )
}

function Modal({ children }) {
  return (
    <Portal>
      <div className="modal">{children}</div>
    </Portal>
  )
}
```

#### Common Gotchas

1. **Event bubbling** — events bubble through React tree, not DOM
   ```jsx
   // Portal is in document.body
   // But click event bubbles up through React tree
   <div onClick={() => console.log('parent')}>
     {createPortal(
       <button onClick={() => console.log('button')}>,
       document.body
     )}
   </div>
   // Clicking button logs: 'button' then 'parent'
   ```

2. **SSR hydration** — container must exist
   ```jsx
   // ❌ Container might not exist during SSR
   const container = document.getElementById('portal')
   
   // ✅ Guard for SSR
   const [mounted, setMounted] = useState(false)
   useEffect(() => setMounted(true), [])
   if (!mounted) return null
   ```

3. **z-index context** — portal escapes parent's stacking context
   ```jsx
   // Parent has z-index: 1
   // Portal content can have higher z-index
   <div style={{ zIndex: 1 }}>
     {createPortal(
       <div style={{ zIndex: 999 }}>, // Shows above parent
       document.body
     )}
   </div>
   ```

---

### flushSync

`flushSync()` forces React to **flush pending updates synchronously**. Use sparingly as it hurts performance.

**Core behavior:**
- **Synchronous flush** — applies pending state updates immediately
- **DOM ready** — guarantees DOM is updated after call
- **Performance impact** — blocks rendering, use only when necessary
- **Callback execution** — runs passed callback, then flushes

#### Form 1: Reading DOM after update — Measure new layout

When to use: Need to read DOM immediately after state change.

```jsx
import { flushSync } from 'react-dom'

function App() {
  const [count, setCount] = useState(0)
  const ref = useRef()
  
  const handleClick = () => {
    // Flush state update synchronously
    flushSync(() => {
      setCount(c => c + 1)
    })
    
    // DOM is now updated, safe to measure
    console.log('New height:', ref.current.offsetHeight)
  }
  
  return <div ref={ref}>{count}</div>
}
```

#### Form 2: Third-party integration — Syncing with non-React code

When to use: Integrating with libraries that expect immediate DOM updates.

```jsx
import { flushSync } from 'react-dom'
import { ChartLib } from 'chart-library'

function ChartComponent({ data }) {
  const chartRef = useRef()
  const chartInstanceRef = useRef()
  
  useEffect(() => {
    // Update React state and ensure DOM is ready
    flushSync(() => {
      setChartData(data)
    })
    
    // Third-party library can now measure DOM
    chartInstanceRef.current.update()
  }, [data])
  
  return <canvas ref={chartRef} />
}
```

#### Common Gotchas

1. **Performance impact** — blocks React's concurrent features
   ```jsx
   // ❌ Don't use in loops or frequently
   items.forEach(item => {
     flushSync(() => setData(d => [...d, item])) // Very slow!
   })
   
   // ✅ Batch updates normally
   setData(d => [...d, ...items])
   ```

2. **May cause warnings** — in React 18 strict mode
   ```jsx
   // flushSync in lifecycle methods may warn
   useEffect(() => {
     flushSync(() => setState(...)) // May warn
   }, [])
   ```

3. **Not for regular use** — almost always a better solution exists
   ```jsx
   // Instead of flushSync for measurements, prefer useLayoutEffect
   useLayoutEffect(() => {
     // Measurements happen after DOM update, before paint
     console.log(ref.current.offsetHeight)
   })
   ```

---

## Error Handling

### Error Boundaries (Class Component)

Error boundaries catch **JavaScript errors in child components** and display fallback UI. Currently only class components can be error boundaries.

**Core behavior:**
- **Catch render errors** — errors during rendering, lifecycle, constructors
- **static getDerivedStateFromError** — update state for fallback UI
- **componentDidCatch** — log error details
- **Doesn't catch** — async code, event handlers, server errors

#### Basic Error Boundary

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  
  static getDerivedStateFromError(error) {
    // Update state so next render shows fallback
    return { hasError: true, error }
  }
  
  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('Error caught:', error)
    console.error('Component stack:', errorInfo.componentStack)
    
    // Send to error reporting service
    logErrorToService(error, errorInfo)
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback || <h1>Something went wrong.</h1>
    }
    
    return this.props.children
  }
}

// Usage
function App() {
  return (
    <ErrorBoundary fallback={<ErrorMessage />}>
      <MyComponent />
    </ErrorBoundary>
  )
}
```

#### Error Boundary with Reset

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  
  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo)
  }
  
  reset = () => {
    this.setState({ hasError: false, error: null })
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Something went wrong</h2>
          <details>{this.state.error?.message}</details>
          <button onClick={this.reset}>Try Again</button>
        </div>
      )
    }
    
    return this.props.children
  }
}
```

#### What Error Boundaries Catch vs Don't Catch

| Caught | Not Caught |
|--------|------------|
| Render errors | Event handlers (use try/catch) |
| Lifecycle errors | Async code (use try/catch) |
| Constructor errors | SSR errors |
| getDerivedStateFromError | Errors in error boundary itself |

```jsx
// Event handler errors need try/catch
function Component() {
  const handleClick = () => {
    try {
      riskyOperation()
    } catch (error) {
      setError(error)
    }
  }
  
  return <button onClick={handleClick}>Click</button>
}
```

---

## Component Lifecycle (Class Components)

### Mounting Phase

```jsx
class MyComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = { count: 0 }
    // Initialize state and bind methods
  }
  
  static getDerivedStateFromProps(props, state) {
    // Return object to update state, or null
    if (props.initialCount !== state.prevInitialCount) {
      return {
        count: props.initialCount,
        prevInitialCount: props.initialCount
      }
    }
    return null
  }
  
  componentDidMount() {
    // Component inserted into DOM
    // Good for: API calls, subscriptions, DOM manipulation
  }
  
  render() {
    return <div>{this.state.count}</div>
  }
}
```

### Updating Phase

```jsx
class MyComponent extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    // Return false to prevent re-render
    return nextProps.id !== this.props.id
  }
  
  getSnapshotBeforeUpdate(prevProps, prevState) {
    // Capture info before DOM updates
    // Return value passed to componentDidUpdate
    return { scrollPosition: window.scrollY }
  }
  
  componentDidUpdate(prevProps, prevState, snapshot) {
    // Component updated
    // snapshot is from getSnapshotBeforeUpdate
    if (snapshot) {
      window.scrollTo(0, snapshot.scrollPosition)
    }
  }
  
  render() {
    return <div>{this.props.value}</div>
  }
}
```

### Unmounting Phase

```jsx
class MyComponent extends React.Component {
  componentWillUnmount() {
    // Component being removed from DOM
    // Good for: cleanup subscriptions, timers, event listeners
    this.subscription.unsubscribe()
    clearInterval(this.timer)
  }
}
```

### Lifecycle Comparison: Class vs Hooks

| Class Lifecycle | Hooks Equivalent |
|-----------------|------------------|
| constructor | useState initial value |
| getDerivedStateFromProps | useState + useEffect |
| componentDidMount | useEffect with [] deps |
| shouldComponentUpdate | React.memo |
| componentDidUpdate | useEffect with deps |
| componentWillUnmount | useEffect cleanup function |
| getSnapshotBeforeUpdate | useLayoutEffect |

```jsx
// Class lifecycle
componentDidMount() {
  this.subscription = subscribe()
}

componentWillUnmount() {
  this.subscription.unsubscribe()
}

// Hooks equivalent
useEffect(() => {
  const subscription = subscribe()
  return () => subscription.unsubscribe()
}, [])
```
