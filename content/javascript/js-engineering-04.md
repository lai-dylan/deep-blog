---
title: Design Patterns and Architecture
date: 2026-04-06
tags: [JavaScript]
---

## Design Patterns and Architecture

### MVC (Model-View-Controller)

Separates data, UI, and control logic.

```js
// Model
class UserModel {
  constructor() {
    this.users = []
  }
  
  addUser(user) {
    this.users.push(user)
  }
  
  getUsers() {
    return this.users
  }
}

// View
class UserView {
  render(users) {
    return users.map(u => `<li>${u.name}</li>`).join('')
  }
}

// Controller
class UserController {
  constructor(model, view) {
    this.model = model
    this.view = view
  }
  
  displayUsers() {
    const users = this.model.getUsers()
    return this.view.render(users)
  }
}
```

### MVVM (Model-View-ViewModel)

Used by Vue and Angular.

```js
// Vue-like reactive system
class ViewModel {
  constructor(data) {
    this.data = reactive(data)
  }
  
  computed(getter) {
    return computed(getter.bind(this))
  }
}

// Template (View) binds to ViewModel
// <input v-model="message">
// <p>{{ message }}</p>
```

### Component-Based Architecture

```js
// React component example
function Button({ onClick, children, variant = 'primary' }) {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

// Composition
function App() {
  return (
    <Card>
      <Button variant="primary">Save</Button>
      <Button variant="secondary">Cancel</Button>
    </Card>
  )
}
```

### Micro-Frontends

Split large applications into independent deployments.

```js
// Container app
const App = () => (
  <div>
    <Header />
    <MicroFrontend name="catalog" />
    <MicroFrontend name="cart" />
    <Footer />
  </div>
)

// Load remote module
const Catalog = React.lazy(() => import('catalog/App'))
```

### Clean Architecture

```
Entities (Business logic)
  ↑
Use Cases (Application rules)
  ↑
Interface Adapters (Controllers, presenters)
  ↑
Frameworks (UI, database, external)
```

### SSR vs SSG vs CSR

| Approach | Rendering | Use Case |
|----------|-----------|----------|
| CSR (Client-Side) | Browser | SPAs, dashboards |
| SSR (Server-Side) | Server per request | Dynamic content |
| SSG (Static) | Build time | Blogs, marketing |
| ISR (Incremental) | Hybrid | Large sites |

```js
// Next.js - SSR
export async function getServerSideProps() {
  const data = await fetchData()
  return { props: { data } }
}

// Next.js - SSG
export async function getStaticProps() {
  const data = await fetchData()
  return { props: { data } }
}

// Next.js - ISR
export async function getStaticProps() {
  return {
    props: { data },
    revalidate: 60 // Regenerate every 60s
  }
}
```

### Common Gotchas

1. **Over-engineering**
   - Start simple, add complexity when needed
   - YAGNI principle (You Aren't Gonna Need It)

2. **State management**
   - Local state first
   - Lift up when needed
   - Global state (Redux/Pinia) for truly shared data

3. **Tight coupling**
   ```js
   // ❌ Component knows too much
   function UserCard() {
     const users = useUsersFromAPI() // Tight coupling
   }
   
   // ✅ Props interface
   function UserCard({ user }) {
     // Pure component, testable
   }
   ```

#### Quick Decision Guide
```typescript
Architecture?
  └── Full page reloads OK? → Multi-page app
  └── App-like experience? → SPA with routing
  └── SEO critical? → SSR (Next.js, Nuxt)
  └── Content-heavy? → SSG (Jamstack)

State management?
  └── Local component? → useState / ref
  └── Parent-child? → Props / emits
  └── Cross-component? → Context / Provide-Inject
  └── App-wide? → Redux / Pinia

Splitting code?
  └── By route? → Lazy loading
  └── By feature? → Micro-frontends
```
