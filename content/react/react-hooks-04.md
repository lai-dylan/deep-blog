---
title: React 18+ Features & Patterns 04
date: 2026-04-04
tags: [React]
---

## React 18 Concurrent Features

### Automatic Batching

React 18 **automatically batches state updates** in all event handlers, not just React event handlers. Reduces re-renders and improves performance.

**Core behavior:**
- **Multiple setState calls** — batched into single re-render
- **All event handlers** — including setTimeout, promises, native events
- **Automatic** — no code changes needed
- **Opt-out available** — flushSync for synchronous updates

#### Form 1: Automatic batching — Multiple state updates

When to use: Multiple related state changes.

```jsx
function Form() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleSubmit = async () => {
    // All these updates batched into single re-render
    setIsSubmitting(true)
    setName('')
    setEmail('')
    
    await submitForm()
    
    // These also batched
    setIsSubmitting(false)
  }
  
  return <form onSubmit={handleSubmit}>...</form>
}
```

#### Form 2: Batching in setTimeout/Promise

When to use: State updates in async callbacks (new in React 18).

```jsx
function Counter() {
  const [count, setCount] = useState(0)
  const [flag, setFlag] = useState(false)
  
  const handleClick = () => {
    setTimeout(() => {
      // In React 18, these are batched
      // In React 17, would cause 2 re-renders
      setCount(c => c + 1)
      setFlag(f => !f)
    }, 1000)
  }
  
  console.log('Render:', count, flag)
  return <button onClick={handleClick}>Update</button>
}
```

#### Form 3: Opt-out with flushSync — When you need sync updates

When to use: Rare cases requiring immediate DOM update.

```jsx
import { flushSync } from 'react-dom'

function Component() {
  const [count, setCount] = useState(0)
  const ref = useRef()
  
  const handleClick = () => {
    // Force synchronous update
    flushSync(() => {
      setCount(c => c + 1)
    })
    
    // DOM is updated immediately
    console.log(ref.current.textContent) // Shows new count
  }
  
  return <div ref={ref}>{count}</div>
}
```

#### Common Gotchas

1. **Reading state immediately** — still shows old value
   ```jsx
   const handleClick = () => {
     setCount(c => c + 1)
     setFlag(f => !f)
     // Both updates batched, but count still shows old value
     console.log(count) // Old value
   }
   ```

2. **flushSync performance impact** — use sparingly
   ```jsx
   // ❌ Don't batch manually unless necessary
   flushSync(() => setCount(1))
   flushSync(() => setCount(2))
   flushSync(() => setCount(3))
   ```

---

### createRoot API

React 18 introduces the **new createRoot API** replacing ReactDOM.render. Enables concurrent features.

**Core behavior:**
- **Entry point for concurrent features** — required for React 18 features
- **hydrateRoot for SSR** — replaces hydrate
- **Automatic batching** — only works with createRoot
- **Graceful degradation** — works without concurrent features too

#### Form 1: Basic createRoot — Client-side rendering

When to use: Standard React 18 application entry point.

```jsx
// React 17 (legacy)
import ReactDOM from 'react-dom'
ReactDOM.render(<App />, document.getElementById('root'))

// React 18
import { createRoot } from 'react-dom/client'

const container = document.getElementById('root')
const root = createRoot(container)
root.render(<App />)
```

#### Form 2: Hydration — SSR applications

When to use: Server-side rendered applications.

```jsx
// React 17
import ReactDOM from 'react-dom'
ReactDOM.hydrate(<App />, document.getElementById('root'))

// React 18
import { hydrateRoot } from 'react-dom/client'

const container = document.getElementById('root')
const root = hydrateRoot(container, <App />)
```

#### Form 3: Unmounting — Programmatic unmount

When to use: Testing, micro-frontends, dynamic apps.

```jsx
const root = createRoot(container)
root.render(<App />)

// Later: unmount
root.unmount()
```

#### Common Gotchas

1. **Warnings in React 18** — using old API shows warnings
   ```jsx
   // React 18 shows warning with old API
   ReactDOM.render(<App />, container)
   // Warning: ReactDOM.render is no longer supported in React 18
   ```

2. **StrictMode behavior change** — components unmount/remount in development
   ```jsx
   root.render(
     <StrictMode>
       <App />
     </StrictMode>
   )
   // Components mount, unmount, then mount again (dev only)
   ```

---

## React Server Components (RSC)

### Server Component Basics

**Server Components** render exclusively on the server, sending only serialized UI to the client. Reduce bundle size, improve performance.

**Core behavior:**
- **Zero client JS** — component code doesn't ship to browser
- **Direct backend access** — can access databases, file system
- **No hooks** — can't use useState, useEffect, etc.
- **Can import client components** — but not vice versa

#### Form 1: Basic Server Component — Data fetching

When to use: Components that only need data display.

```jsx
// NoteUser.server.js - Server Component
import db from './database'

// Runs only on server!
export default async function NoteUser({ userId }) {
  // Direct database access
  const user = await db.users.get(userId)
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  )
}
```

#### Form 2: Server + Client composition — Mixing component types

When to use: Combining server data with client interactivity.

```jsx
// PostList.server.js - Server Component
import { Suspense } from 'react'
import PostListItem from './PostListItem' // Server Component
import LikeButton from './LikeButton' // Client Component

export default async function PostList() {
  const posts = await fetchPosts() // Server-side fetch
  
  return (
    <div>
      {posts.map(post => (
        <article key={post.id}>
          <PostListItem post={post} />
          <LikeButton postId={post.id} /> {/* Client Component */}
        </article>
      ))}
    </div>
  )
}
```

#### Form 3: 'use client' directive — Marking Client Components

When to use: Components that need React hooks or browser APIs.

```jsx
// LikeButton.client.js
'use client'

import { useState } from 'react'

export default function LikeButton({ postId }) {
  const [likes, setLikes] = useState(0)
  
  const handleLike = () => {
    setLikes(l => l + 1)
    // Call API...
  }
  
  return <button onClick={handleLike}>♥ {likes}</button>
}
```

#### Server vs Client Components Comparison

| Feature | Server Component | Client Component |
|---------|------------------|------------------|
| Render location | Server only | Client (and server) |
| Bundle size | Zero | Included |
| useState/useEffect | ❌ No | ✅ Yes |
| Database access | ✅ Direct | ❌ Via API |
| Browser APIs | ❌ No | ✅ Yes |
| Event handlers | ❌ No | ✅ Yes |

#### Common Gotchas

1. **Can't import server components in client components**
   ```jsx
   // ❌ Can't do this
   'use client'
   import ServerComponent from './ServerComponent'
   
   export default function ClientComponent() {
     return <ServerComponent /> // Error!
   }
   
   // ✅ Pass as children
   'use client'
   export default function ClientComponent({ children }) {
     return <div>{children}</div>
   }
   
   // Parent (Server Component)
   import ClientComponent from './ClientComponent'
   import ServerComponent from './ServerComponent'
   
   export default function Page() {
     return (
       <ClientComponent>
         <ServerComponent />
       </ClientComponent>
     )
   }
   ```

2. **No hooks in Server Components**
   ```jsx
   // ❌ Error
   export default function ServerComponent() {
     const [count, setCount] = useState(0) // Error!
     return <div>{count}</div>
   }
   ```

3. **async components** — Server Components can be async
   ```jsx
   // ✅ Server Component can be async
   export default async function PostPage({ params }) {
     const post = await fetchPost(params.id)
     return <article>{post.content}</article>
   }
   ```

---

## TypeScript with React

### Basic TypeScript Setup

```tsx
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx", // React 17+ transform
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

### Typing Props

#### Form 1: Interface approach — Object type for props

```tsx
interface ButtonProps {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
  children?: React.ReactNode
}

function Button({ 
  label, 
  onClick, 
  variant = 'primary',
  disabled = false,
  children 
}: ButtonProps) {
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {label}
      {children}
    </button>
  )
}
```

#### Form 2: Type alias approach — Alternative to interface

```tsx
type UserCardProps = {
  user: {
    id: number
    name: string
    email: string
    avatar?: string
  }
  onEdit: (userId: number) => void
  onDelete: (userId: number) => void
}

const UserCard: React.FC<UserCardProps> = ({ user, onEdit, onDelete }) => {
  return (
    <div className="user-card">
      <img src={user.avatar || '/default-avatar.png'} alt={user.name} />
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <button onClick={() => onEdit(user.id)}>Edit</button>
      <button onClick={() => onDelete(user.id)}>Delete</button>
    </div>
  )
}
```

#### Form 3: Generic components — Reusable typed components

```tsx
interface ListProps<T> {
  items: T[]
  renderItem: (item: T) => React.ReactNode
  keyExtractor: (item: T) => string | number
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map(item => (
        <li key={keyExtractor(item)}>
          {renderItem(item)}
        </li>
      ))}
    </ul>
  )
}

// Usage with type inference
interface User {
  id: number
  name: string
}

<List 
  items={users}
  renderItem={(user) => <span>{user.name}</span>}
  keyExtractor={(user) => user.id}
/>
```

### Typing Hooks

#### Form 1: useState — Generic type inference

```tsx
// TypeScript infers type from initial value
const [count, setCount] = useState(0) // number

// Explicit type when initial value is null/undefined
const [user, setUser] = useState<User | null>(null)

// Type for complex objects
interface FormState {
  name: string
  email: string
  errors: Record<string, string>
}

const [form, setForm] = useState<FormState>({
  name: '',
  email: '',
  errors: {}
})
```

#### Form 2: useRef — Element refs and mutable refs

```tsx
// DOM element ref
const inputRef = useRef<HTMLInputElement>(null)

useEffect(() => {
  inputRef.current?.focus()
}, [])

// Mutable ref (not for DOM)
const timerRef = useRef<number | null>(null)

timerRef.current = window.setTimeout(() => {}, 1000)
if (timerRef.current) {
  clearTimeout(timerRef.current)
}
```

#### Form 3: useContext — Typed context

```tsx
interface ThemeContextType {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Custom hook with type safety
function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

// Usage - fully typed
const { theme, toggleTheme } = useTheme()
```

#### Form 4: Custom hooks — Return type inference

```tsx
interface UseCounterReturn {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
}

function useCounter(initialValue = 0): UseCounterReturn {
  const [count, setCount] = useState(initialValue)
  
  const increment = useCallback(() => setCount(c => c + 1), [])
  const decrement = useCallback(() => setCount(c => c - 1), [])
  const reset = useCallback(() => setCount(initialValue), [initialValue])
  
  return { count, increment, decrement, reset }
}

// Usage
const { count, increment } = useCounter(10)
```

### Typing Events

```tsx
// Form events
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
}

// Input/change events
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log(e.target.value)
}

// Click events
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  console.log(e.clientX, e.clientY)
}

// Keyboard events
const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'Enter') {
    handleSubmit()
  }
}

// Generic event handler
const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  setValue(e.target.value)
}
```

### Typing forwardRef

```tsx
import { forwardRef } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <div>
        <label>{label}</label>
        <input ref={ref} {...props} />
        {error && <span className="error">{error}</span>}
      </div>
    )
  }
)

Input.displayName = 'Input'
```

---

## React Patterns

### Compound Component Pattern

Compound components work together to form a complete UI, sharing state implicitly.

```jsx
// Compound Tabs Component
function Tabs({ children, defaultIndex = 0 }) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex)
  
  return (
    <TabsContext.Provider value={{ activeIndex, setActiveIndex }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  )
}

function TabList({ children }) {
  return <div className="tab-list" role="tablist">{children}</div>
}

function Tab({ index, children }) {
  const { activeIndex, setActiveIndex } = useContext(TabsContext)
  const isActive = index === activeIndex
  
  return (
    <button
      role="tab"
      aria-selected={isActive}
      className={isActive ? 'tab active' : 'tab'}
      onClick={() => setActiveIndex(index)}
    >
      {children}
    </button>
  )
}

function TabPanels({ children }) {
  return <div className="tab-panels">{children}</div>
}

function TabPanel({ index, children }) {
  const { activeIndex } = useContext(TabsContext)
  if (index !== activeIndex) return null
  
  return <div role="tabpanel">{children}</div>
}

// Attach sub-components
Tabs.List = TabList
Tabs.Tab = Tab
Tabs.Panels = TabPanels
Tabs.Panel = TabPanel

// Usage
function App() {
  return (
    <Tabs defaultIndex={0}>
      <Tabs.List>
        <Tabs.Tab index={0}>Account</Tabs.Tab>
        <Tabs.Tab index={1}>Security</Tabs.Tab>
        <Tabs.Tab index={2}>Notifications</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panels>
        <Tabs.Panel index={0}><AccountSettings /></Tabs.Panel>
        <Tabs.Panel index={1}><SecuritySettings /></Tabs.Panel>
        <Tabs.Panel index={2}><NotificationSettings /></Tabs.Panel>
      </Tabs.Panels>
    </Tabs>
  )
}
```

### Render Props Pattern

A component receives a function prop that returns React elements, enabling code reuse.

```jsx
// Mouse tracker with render prop
class MouseTracker extends React.Component {
  state = { x: 0, y: 0 }
  
  handleMouseMove = (event) => {
    this.setState({
      x: event.clientX,
      y: event.clientY
    })
  }
  
  render() {
    return (
      <div onMouseMove={this.handleMouseMove}>
        {this.props.render(this.state)}
      </div>
    )
  }
}

// Usage
function App() {
  return (
    <MouseTracker render={({ x, y }) => (
      <p>Mouse position: {x}, {y}</p>
    )} />
  )
}

// Different usage with same tracker
function App2() {
  return (
    <MouseTracker render={({ x, y }) => (
      <div style={{
        position: 'absolute',
        left: x,
        top: y
      }}>
        Following cursor
      </div>
    )} />
  )
}
```

### Higher-Order Component (HOC) Pattern

A function that takes a component and returns a new component with enhanced behavior.

```jsx
// withAuth HOC - Protects routes
function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const { user, loading } = useAuth()
    
    if (loading) return <LoadingSpinner />
    if (!user) return <Navigate to="/login" />
    
    return <Component {...props} user={user} />
  }
}

// Usage
function Dashboard({ user }) {
  return <div>Welcome, {user.name}</div>
}

export default withAuth(Dashboard)

// withLoading HOC
function withLoading(Component, LoadingComponent = Spinner) {
  return function WithLoadingComponent({ isLoading, ...props }) {
    if (isLoading) return <LoadingComponent />
    return <Component {...props} />
  }
}

// withErrorHandling HOC
function withErrorHandling(Component) {
  return class extends React.Component {
    state = { hasError: false }
    
    static getDerivedStateFromError() {
      return { hasError: true }
    }
    
    render() {
      if (this.state.hasError) {
        return <ErrorFallback />
      }
      return <Component {...this.props} />
    }
  }
}
```

### Container/Presentational Pattern

Separates data fetching (container) from UI rendering (presentational).

```jsx
// Presentational Component - Pure UI
function UserList({ users, onSelect, selectedId }) {
  return (
    <ul className="user-list">
      {users.map(user => (
        <li 
          key={user.id}
          className={user.id === selectedId ? 'selected' : ''}
          onClick={() => onSelect(user.id)}
        >
          <img src={user.avatar} alt={user.name} />
          <span>{user.name}</span>
        </li>
      ))}
    </ul>
  )
}

// Container Component - Data and logic
function UserListContainer() {
  const [users, setUsers] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetchUsers()
      .then(data => {
        setUsers(data)
        setLoading(false)
      })
  }, [])
  
  if (loading) return <LoadingSpinner />
  
  return (
    <UserList 
      users={users}
      onSelect={setSelectedId}
      selectedId={selectedId}
    />
  )
}
```

### State Reducer Pattern

Gives users full control over state changes via reducer function.

```jsx
// useToggle with state reducer
function useToggle({ 
  initialOn = false, 
  reducer = (state, action) => {
    // Default reducer
    switch (action.type) {
      case 'toggle': return { on: !state.on }
      case 'on': return { on: true }
      case 'off': return { on: false }
      default: throw new Error(`Unknown action: ${action.type}`)
    }
  }
} = {}) {
  const [state, dispatch] = useReducer(reducer, { on: initialOn })
  
  const toggle = () => dispatch({ type: 'toggle' })
  const setOn = () => dispatch({ type: 'on' })
  const setOff = () => dispatch({ type: 'off' })
  
  return { on: state.on, toggle, setOn, setOff, dispatch }
}

// Usage with default behavior
function App() {
  const { on, toggle } = useToggle()
  return <button onClick={toggle}>{on ? 'On' : 'Off'}</button>
}

// Usage with custom reducer
function AppWithValidation() {
  const { on, dispatch } = useToggle({
    reducer: (state, action) => {
      const changes = {
        toggle: { on: !state.on },
        on: { on: true },
        off: { on: false }
      }
      
      // Custom logic: prevent turning off if condition not met
      if (action.type === 'off' && !action.force) {
        if (hasUnsavedChanges()) {
          alert('Save changes first!')
          return state
        }
      }
      
      return changes[action.type] || state
    }
  })
  
  return <button onClick={() => dispatch({ type: 'off' })}>Off</button>
}
```

### Provider Pattern (Context Composition)

Composing multiple providers without pyramid of doom.

```jsx
// ComposeProviders component
function ComposeProviders({ providers, children }) {
  return providers.reduceRight(
    (acc, Provider) => <Provider>{acc}</Provider>,
    children
  )
}

// Or with array syntax
function AppProviders({ children }) {
  return (
    <ComposeProviders providers={[
      AuthProvider,
      ThemeProvider,
      LocaleProvider,
      QueryProvider
    ]}>
      {children}
    </ComposeProviders>
  )
}

// Alternative: flat composition
function AppProviders({ children }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LocaleProvider>
          <QueryProvider>
            {children}
          </QueryProvider>
        </LocaleProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}
```

### Controlled vs Uncontrolled Components

#### Uncontrolled (React manages less)

```jsx
function UncontrolledForm() {
  const inputRef = useRef()
  
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(inputRef.current.value) // Read DOM directly
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input ref={inputRef} defaultValue="Initial" />
      <button type="submit">Submit</button>
    </form>
  )
}
```

#### Controlled (React manages all state)

```jsx
function ControlledForm() {
  const [value, setValue] = useState('Initial')
  
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(value) // Read from React state
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={value} 
        onChange={e => setValue(e.target.value)} 
      />
      <button type="submit">Submit</button>
    </form>
  )
}
```

#### Hybrid Pattern

```jsx
function HybridInput({ defaultValue, onChange, ...props }) {
  const [value, setValue] = useState(defaultValue)
  const isControlled = props.value !== undefined
  
  const handleChange = (e) => {
    if (!isControlled) {
      setValue(e.target.value)
    }
    onChange?.(e)
  }
  
  return (
    <input
      {...props}
      value={isControlled ? props.value : value}
      onChange={handleChange}
    />
  )
}
```

---

## Performance Optimization Patterns

### Virtualization (react-window)

Render only visible items for long lists.

```jsx
import { FixedSizeList as List } from 'react-window'

function VirtualizedList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style} className="list-item">
      {items[index].name}
    </div>
  )
  
  return (
    <List
      height={400}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </List>
  )
}
```

### Memoization Strategies

```jsx
// Component memoization
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* expensive render */}</div>
})

// Value memoization
const processedData = useMemo(() => {
  return expensiveTransform(rawData)
}, [rawData])

// Callback memoization
const handleSubmit = useCallback((values) => {
  submitForm(values)
}, [])

// Context value memoization
const contextValue = useMemo(() => ({
  user,
  login,
  logout
}), [user])
```

### Code Splitting Patterns

```jsx
// Route-based splitting
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Settings = lazy(() => import('./pages/Settings'))

// Component-based splitting
const HeavyChart = lazy(() => import('./components/HeavyChart'))

// Conditional splitting
function App() {
  const [showAdvanced, setShowAdvanced] = useState(false)
  
  return (
    <div>
      <BasicFeatures />
      {showAdvanced && (
        <Suspense fallback={<Loading />}>
          <AdvancedFeatures />
        </Suspense>
      )}
    </div>
  )
}
```

---

## Testing Patterns

### Component Testing (React Testing Library)

```jsx
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Basic render test
test('renders greeting', () => {
  render(<Greeting name="John" />)
  expect(screen.getByText('Hello, John!')).toBeInTheDocument()
})

// Interaction test
test('increments counter on click', async () => {
  const user = userEvent.setup()
  render(<Counter />)
  
  const button = screen.getByRole('button', { name: /increment/i })
  await user.click(button)
  
  expect(screen.getByText('Count: 1')).toBeInTheDocument()
})

// Async test
test('loads user data', async () => {
  render(<UserProfile userId="1" />)
  
  expect(screen.getByText(/loading/i)).toBeInTheDocument()
  
  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })
})
```

### Hook Testing

```jsx
import { renderHook, act } from '@testing-library/react'

// Custom hook test
test('useCounter', () => {
  const { result } = renderHook(() => useCounter(0))
  
  expect(result.current.count).toBe(0)
  
  act(() => {
    result.current.increment()
  })
  
  expect(result.current.count).toBe(1)
})

// Hook with context
test('useAuth', () => {
  const wrapper = ({ children }) => (
    <AuthProvider>{children}</AuthProvider>
  )
  
  const { result } = renderHook(() => useAuth(), { wrapper })
  
  expect(result.current.user).toBeNull()
})
```

---

## Quick Reference Tables

### Lifecycle Methods vs Hooks

| Class Component | Hooks |
|-----------------|-------|
| constructor | useState initial value |
| componentDidMount | useEffect with [] |
| componentDidUpdate | useEffect with deps |
| componentWillUnmount | useEffect cleanup |
| shouldComponentUpdate | React.memo |
| getDerivedStateFromProps | useState + useEffect |
| getSnapshotBeforeUpdate | useLayoutEffect |
| componentDidCatch | Error Boundary class |

### When to Use Each Hook

| Hook | Use When |
|------|----------|
| useState | Simple component state |
| useReducer | Complex state logic, multiple related values |
| useEffect | Side effects, subscriptions, data fetching |
| useLayoutEffect | DOM measurements, preventing flicker |
| useContext | Accessing shared data (theme, auth, locale) |
| useRef | DOM access, storing mutable values |
| useMemo | Expensive computations, reference stability |
| useCallback | Passing callbacks to memoized children |
| useImperativeHandle | Exposing imperative API to parent |
| useId | Accessibility IDs |
| useTransition | Keeping UI responsive during updates |
| useDeferredValue | Deferring non-urgent UI updates |
| useSyncExternalStore | Subscribing to external stores |

### React 18 vs 17 Differences

| Feature | React 17 | React 18 |
|---------|----------|----------|
| createRoot | ReactDOM.render | createRoot().render() |
| Automatic batching | In React events only | All events, setTimeout, promises |
| Concurrent features | No | Yes (with createRoot) |
| Suspense on server | No | Yes |
| useId | No | Yes |
| useTransition/useDeferredValue | No | Yes |
| StrictMode double mount | No | Yes (dev only) |

---

## Common Anti-Patterns to Avoid

### 1. Index as Key
```jsx
// ❌ Bad
{items.map((item, index) => <li key={index}>{item}</li>)}

// ✅ Good
{items.map(item => <li key={item.id}>{item.name}</li>)}
```

### 2. Direct State Mutation
```jsx
// ❌ Bad
const [items, setItems] = useState([1, 2, 3])
items.push(4) // Mutates!
setItems(items)

// ✅ Good
setItems([...items, 4])
```

### 3. Stale Closures in Effects
```jsx
// ❌ Bad
useEffect(() => {
  setInterval(() => {
    console.log(count) // Always initial value
  }, 1000)
}, [])

// ✅ Good
useEffect(() => {
  setInterval(() => {
    setCount(c => c + 1) // Functional update
  }, 1000)
}, [])
```

### 4. Unnecessary useMemo/useCallback
```jsx
// ❌ Over-optimization
const doubled = useMemo(() => count * 2, [count])

// ✅ Let React handle it
const doubled = count * 2
```

### 5. Missing Dependency Arrays
```jsx
// ❌ Missing dependencies
useEffect(() => {
  fetchUser(userId)
}, []) // userId missing!

// ✅ Include all dependencies
useEffect(() => {
  fetchUser(userId)
}, [userId])
```

### 6. Conditional Hook Calls
```jsx
// ❌ Conditional hook
if (condition) {
  useEffect(() => {}, [])
}

// ✅ Conditional inside hook
useEffect(() => {
  if (condition) {
    // logic
  }
}, [condition])
```

### 7. Inline Object/Array Props
```jsx
// ❌ New reference every render
<MemoComponent config={{ theme: 'dark' }} />

// ✅ Stable reference
const config = useMemo(() => ({ theme: 'dark' }), [])
<MemoComponent config={config} />
```

### 8. Large Context Values
```jsx
// ❌ Everything in one context
<AppContext.Provider value={{ theme, user, locale, settings }}>

// ✅ Split contexts
<ThemeContext.Provider value={theme}>
  <UserContext.Provider value={user}>
```

### 9. Not Cleaning Up Effects
```jsx
// ❌ Memory leak
useEffect(() => {
  const subscription = subscribe()
  // No cleanup!
}, [])

// ✅ Cleanup
useEffect(() => {
  const subscription = subscribe()
  return () => subscription.unsubscribe()
}, [])
```

### 10. Race Conditions in Effects
```jsx
// ❌ Race condition
useEffect(() => {
  fetch(`/api/user/${userId}`).then(res => res.json()).then(setUser)
}, [userId])

// ✅ Cleanup
useEffect(() => {
  let cancelled = false
  fetch(`/api/user/${userId}`)
    .then(res => res.json())
    .then(data => {
      if (!cancelled) setUser(data)
    })
  return () => { cancelled = true }
}, [userId])
```
