---
title: Vue3 API 02
date: 2026-04-03
tags: [Vue]
---
## Lifecycle Hooks

### onMounted

`onMounted()` registers a **callback to be called after** the component has been mounted (after DOM insertion).

**Core behavior:**
- **Called once** — only executes after initial render
- **DOM is ready** — safe to access template refs and DOM elements
- **Called in setup order** — respects component hierarchy (parent before child)

#### When to use: DOM access after initial render

```js
import { ref, onMounted } from 'vue'

const canvas = ref(null)

onMounted(() => {
  console.log(canvas.value)  // ✅ DOM element is ready
  const ctx = canvas.value.getContext('2d')
})
```

---

### beforeMount

`beforeMount()` registers a **callback to be called right before** the component is about to mount (before DOM insertion).

**Core behavior:**
- **Called once** — before the first render
- **DOM not ready** — document.createElement exists but not yet inserted
- **Rarely needed** — most cases use `onMounted` instead

#### When to use: Last-minute setup before DOM

```js
import { ref, beforeMount } from 'vue'

beforeMount(() => {
  console.log('About to mount, DOM not yet inserted')
})
```

---

### onUpdated

`onUpdated()` registers a **callback to be called after** the component has updated (after DOM re-render).

**Core behavior:**
- **Called after every update** — runs after each reactive change triggers re-render
- **DOM is updated** — safe to read new DOM state
- **Avoid mutating state** — could cause infinite loops

#### When to use: Reacting to DOM changes after reactive updates

```js
import { ref, onUpdated } from 'vue'

const count = ref(0)

onUpdated(() => {
  console.log('Updated, DOM reflects count:', count.value)
})
```

#### Common Gotchas

1. **Child components mount before parents** — onUpdated of child runs before parent
2. **Don't cause state changes** — updating state in onUpdated can cause infinite loops
3. **Use `watch` for precise tracking** — onUpdated doesn't tell you what changed

---

### beforeUpdate

`beforeUpdate()` registers a **callback to be called right before** the component is about to update (before DOM re-patch).

**Core behavior:**
- **Called before DOM update** — state has changed but DOM hasn't
- **Read current DOM** — useful for saving scroll position before update
- **Rarely needed** — most cases use `watch` instead

#### When to use: Last read before DOM update

```js
import { ref, beforeUpdate } from 'vue'

let scrollPosition = 0

beforeUpdate(() => {
  scrollPosition = window.scrollY  // Save position before update
})
```

---

### onUnmounted

`onUnmounted()` registers a **callback to be called after** the component has been unmounted (after DOM removal).

**Core behavior:**
- **Called once** — when component is removed from DOM
- **Cleanup time** — cancel timers, remove event listeners, disconnect WebSockets
- **Always run** — even if component never mounted

#### When to use: Cleanup when component is destroyed

```js
import { ref, onUnmounted } from 'vue'

const timer = setInterval(() => count.value++, 1000)

onUnmounted(() => {
  clearInterval(timer)  // ✅ Clean up timer
  console.log('Component unmounted')
})
```

---

### onActivated

`onActivated()` registers a **callback to be called when** a component inside a `<KeepAlive>` is activated (brought back to view).

**Core behavior:**
- **Only with KeepAlive** — component must be wrapped in `<KeepAlive>`
- **Cached component resumes** — component instance is reused, not recreated
- **First mount also triggers** — runs on initial mount of kept-alive component

#### When to use: Reactivating a cached component

```vue
<template>
  <KeepAlive>
    <Dashboard v-if="showDashboard" />
  </KeepAlive>
</template>

<script setup>
import { onActivated } from 'vue'

onActivated(() => {
  console.log('Dashboard brought back to view')
  resumeDataFetch()
})
</script>
```

---

### onDeactivated

`onDeactivated()` registers a **callback to be called when** a component inside a `<KeepAlive>` is deactivated (put into cache).

**Core behavior:**
- **Only with KeepAlive** — component must be wrapped in `<KeepAlive>`
- **Component cached** — instance is kept alive but hidden
- **Cleanup before cache** — use for pausing, not destroying

#### When to use: Pausing a cached component

```vue
<template>
  <KeepAlive>
    <Dashboard v-if="showDashboard" />
  </KeepAlive>
</template>

<script setup>
import { onDeactivated } from 'vue'

onDeactivated(() => {
  console.log('Dashboard put into cache')
  pauseDataFetch()
})
```

#### Lifecycle Flow with KeepAlive
```js
onMounted → onDeactivated → (cached) → onActivated → onUnmounted
```

---

### onErrorCaptured

`onErrorCaptured()` registers a **callback to be called when** an error from a descendant component is propagated.

**Core behavior:**
- **Error bubbling** — catches errors from child components
- **Can suppress** — return `false` to prevent propagation
- **Includes async errors** — catches errors from async callbacks too

#### When to use: Global error handling in component tree

```js
import { ref, onErrorCaptured } from 'vue'

const error = ref(null)

onErrorCaptured((err, instance, info) => {
  error.value = err
  console.error('Error captured:', err, 'Info:', info)
  return false  // Suppress further propagation
})
```

#### Parameters
| Parameter | Description |
|-----------|-------------|
| `err` | The error that was thrown |
| `instance` | The component where the error originated |
| `info` | Additional info (e.g., lifecycle hook name) |

#### Common Gotchas

1. **Only descendant errors** — doesn't catch errors in the component itself
2. **Return `false` to suppress** — otherwise error propagates to global handler
3. **Async errors** — unhandled promise rejections also propagate here

---

### onRenderTracked (Dev only)

`onRenderTracked()` registers a **debug callback** that's called when a reactive dependency is accessed during render.

**Core behavior:**
- **Dev only** — stripped in production builds
- **Dependency tracking** — shows which reactive data triggered the render
- **Debugging tool** — helps understand reactivity dependencies

#### When to use: Debugging reactivity dependencies

```js
import { ref, onRenderTracked } from 'vue'

const count = ref(0)
const name = ref('')

onRenderTracked((event) => {
  console.log('Tracked dependency:', event)
  // {
  //   target: { count: 0, name: '' },
  //   type: 'get',
  //   key: 'count'
  // }
})
```

#### Event Object
| Property | Description |
|----------|-------------|
| `target` | The reactive object being tracked |
| `type` | Operation type (`'get'`, `'add'`, `'delete'`) |
| `key` | The property being accessed |

---

### onRenderTriggered (Dev only)

`onRenderTriggered()` registers a **debug callback** that's called when a reactive dependency triggers a re-render.

**Core behavior:**
- **Dev only** — stripped in production builds
- **Trigger tracking** — shows which reactive data triggered the update
- **Debugging tool** — helps identify unnecessary re-renders

#### When to use: Debugging what causes re-renders

```js
import { ref, onRenderTriggered } from 'vue'

const count = ref(0)

onRenderTriggered((event) => {
  console.log('Triggered re-render:', event)
  // {
  //   target: { count: 1 },
  //   type: 'set',
  //   key: 'count',
  //   newValue: 1
  // }
})

count.value = 5  // Triggers re-render
```

#### Common Gotchas

1. **Production stripped** — these hooks don't exist in production
2. **Performance impact** — don't use in production code
3. **Paired usage** — use both to understand full reactivity flow

---

## Lifecycle Diagram

```js
setup()
  │
  ├─ beforeCreate (removed in composition API)
  ├─ created (removed in composition API)
  │
  ▼
beforeMount()
  │
  ▼
onMounted()
  │
  ▼ (reactive update)
beforeUpdate()
  │
  ▼
onUpdated() ◄──────────────────┐
  │                            │
  │ (KeepAlive)                 │
  ▼                             │
onDeactivated() ────────────────┤
  │                             │
onActivated() ──────────────────┤
  │                             │
  │ (unmount)                   │
  ▼                             │
beforeUnmount()                 │
  │                             │
  ▼                             │
onUnmounted() ──────────────────┘
  │
  ▼
onErrorCaptured() (at any point above)
```
## Dependency Injection

### provide

`provide()` provides a value to **descendant components** via the component tree. Values can be anything (refs, objects, primitives).

**Core behavior:**
- **Descendant access** — only components below in the tree can inject
- **Reactive** — provided refs remain reactive
- **Override** — child components can override with their own provide

#### Form 1: Basic provide — `provide(key, value)`

When to use: Most common form. Providing a simple value.

```js
import { provide, ref } from 'vue'

const count = ref(0)

// Provide a value to all descendants
provide('count', count)
provide('theme', 'dark')
provide('apiKey', 'abc123')
```

#### Form 2: Object syntax — `provide(obj)`

When to use: Providing multiple values at once.

```js
import { provide, ref } from 'vue'

const count = ref(0)
const theme = ref('dark')

provide({
  count,
  theme,
  apiKey: 'abc123'
})
```

#### Form 3: From setup — Using provide with lifecycle

```vue
<script setup>
import { provide, ref } from 'vue'

const user = ref(null)

provide('user', user)

// Provide computed for derived values
provide('userName', computed(() => user.value?.name))
</script>
```

---

### inject

`inject()` retrieves a value **provided by an ancestor component**. Used in child components to receive provided values.

**Core behavior:**
- **Parent lookup** — looks up the component tree for provided value
- **Optional** — can provide default value if not found
- **Reactive** — injected refs remain reactive to original provide

#### Form 1: Basic inject — `inject(key)`

When to use: Getting a value provided by a parent.

```js
import { inject, ref } from 'vue'

// Inject from ancestor
const count = inject('count')
const theme = inject('theme')

console.log(count.value)  // reactive
console.log(theme)       // plain value
```

#### Form 2: With default value — `inject(key, defaultValue)`

When to use: When the value might not be provided.

```js
import { inject } from 'vue'

const apiKey = inject('apiKey', 'default-key')
const timeout = inject('timeout', 5000)
```

#### Form 3: Factory function — `inject(key, () => factory)`

When to use: When you need to create a new instance per consumer.

```js
import { inject } from 'vue'

// Creates a new connection for each component
const connection = inject('connection', () => createConnection(), true)
```

---

### hasInjectionContext

`hasInjectionContext()` checks whether injection context is **currently available**. Used to avoid calling `inject()` outside of proper context.

**Core behavior:**
- **Returns boolean** — true if in valid injection context
- **Vue 3.5+** — newer API for safer inject usage
- **Useful in composables** — ensures inject is called at correct time

#### When to use: In composables or setup functions

```js
import { inject, hasInjectionContext } from 'vue'

function useConfig() {
  if (!hasInjectionContext()) {
    console.warn('useConfig() must be used within proper injection context')
    return { config: null }
  }
  
  return {
    config: inject('config')
  }
}
```

---

### typed-inject (TypeScript)

TypeScript support for `inject()` with **symbol keys** and proper type inference.

**Core behavior:**
- **Symbol keys** — use `InjectionKey` for type-safe injection
- **Type inference** — automatic type from provider
- **Generic form** — `inject<Type>(key)`

#### Form 1: With InjectionKey — Type-safe injection

```ts
import { provide, inject, InjectionKey, ref } from 'vue'

// Define the shape of your provided value
interface UserConfig {
  name: string
  theme: 'light' | 'dark'
}

// Create a typed symbol key
const ConfigKey: InjectionKey<UserConfig> = Symbol('config')

// Provider
provide(ConfigKey, {
  name: 'John',
  theme: 'dark'
})

// Injector
const config = inject(ConfigKey)
if (config) {
  console.log(config.name)  // typed as string
  console.log(config.theme) // typed as 'light' | 'dark'
}
```

#### Form 2: With generic type — Inline typing

```ts
import { inject } from 'vue'

// Direct generic typing
const apiKey = inject<string>('apiKey', '')
const count = inject<number>('count', 0)
const user = inject<User>('user')
```

#### Form 3: Composable pattern — Type-safe composable

```ts
// composables/useConfig.ts
import { inject, InjectionKey } from 'vue'

interface Config {
  apiUrl: string
  timeout: number
}

const ConfigKey: InjectionKey<Config> = Symbol('config')

export function provideConfig(config: Config) {
  provide(ConfigKey, config)
}

export function useConfig() {
  const config = inject(ConfigKey)
  if (!config) {
    throw new Error('useConfig() must be used within a provider')
  }
  return config
}
```

---

### Common Patterns

#### Pattern 1: Provide reactivity from parent

```js
// Parent component
const count = ref(0)
provide('count', count)

// Child can modify (reactive)
const count = inject('count')
count.value++  // Parent sees the change!
```

#### Pattern 2: Read-only inject (recommended)

```js
// Parent provides readonly
import { readonly } from 'vue'

provide('count', readonly(count))

// Child gets readonly view
const count = inject('count')
count.value = 5  // ❌ Warning! readonly
```

#### Pattern 3:多层 Provide / Override

```
App
  └── Parent A → provide('theme', 'dark')
        └── Parent B → provide('theme', 'light')  // overrides
              └── Child → inject('theme') // 'light'
```

#### Pattern 4: Plugin pattern — Provide in app

```js
// main.ts
import { createApp } from 'vue'

const app = createApp(App)

// Provide globally at app level
app.provide('globalConfig', { apiUrl: '...' })

app.mount('#app')
```

---

### Common Gotchas

1. **Order matters** — provide must be called before inject in ancestor chain
2. ** reactivity** — provided refs are reactive, but mutations don't auto-propagate across sibling trees
3. **TypeScript** — always use `InjectionKey` for type safety
4. **Override behavior** — closest ancestor's provide wins (Component A's child won't see App's provide if A also provides)
5. **Not for props/emits** — use props/emits for parent-child direct communication

#### Quick Decision Guide
```typescript
Need to share state with DESCENDANTS?
  └── Yes → provide(key, value)
       └── Multiple values? → provide({ key1, key2, ... })
  └── Need to receive from ANCESTORS?
       └── Yes → inject(key)
            └── Might not exist? → inject(key, defaultValue)
            └── Need type safety? → inject(Key) with InjectionKey
```

## Built-in Directives

### v-bind

`v-bind` dynamically binds one or more attributes or a component prop to an expression.

**Core behavior:**
- **One-way binding** — data flows down to attribute
- **Shorthand** — `:` (colon)
- **Boolean attrs** — removes attribute when falsy

#### Form 1: Basic binding — `:attr="value"`

When to use: Binding a single attribute to a dynamic value.

```vue
<img :src="imageUrl" :alt="description" />
<button :disabled="isLoading">Submit</button>
```

#### Form 2: Object binding — `v-bind="obj"`

When to use: Binding multiple attributes at once.

```vue
<script setup>
const attrs = {
  id: 'my-input',
  type: 'text',
  placeholder: 'Enter name',
  disabled: false
}
</script>

<input v-bind="attrs" />
```

#### Form 3: With modifiers — `.prop .camel .attr`

```vue
<!-- .attr forces attribute binding (not prop) -->
<div :data-info.attr="'value'" />

<!-- .camel converts kebab-case to camelCase -->
<svg :view-box.camel="viewBox" />
```

---

### v-model

`v-model` creates a **two-way binding** between a value and a form input.

**Core behavior:**
- **Two-way** — data flows both directions
- **Input types** — different props/events per input type
- **Modifiers** — `.lazy`, `.number`, `.trim`

#### Form 1: Basic v-model — `v-model="value"`

When to use: Two-way binding with form inputs.

```vue
<!-- Text input -->
<input v-model="name" />

<!-- Checkbox -->
<input type="checkbox" v-model="checked" />

<!-- Select -->
<select v-model="selected">
  <option value="a">A</option>
  <option value="b">B</option>
</select>
```

#### Form 2: With modifiers — `.lazy .number .trim`

```vue
<!-- Only sync on change event (not input) -->
<input v-model.lazy="name" />

<!-- Automatically cast to number -->
<input v-model.number="age" />

<!-- Trim whitespace -->
<input v-model.trim="username" />
```

#### Form 3: v-model arguments — `v-model:propName`

When to use: Custom model binding for components.

```vue
<!-- Component with custom model -->
<MyInput v-model:title="pageTitle" />
<MyInput v-model:description="pageDesc" />

<!-- Equivalent to -->
<MyInput :modelValue="pageTitle" @update:modelValue="pageTitle = $event" />
```

#### Comparison: v-model vs :value

| Aspect | `v-model` | `:value` + `@input` |
|--------|-----------|---------------------|
| Direction | Two-way | One-way (parent→child) |
| Code | Cleaner | More verbose |
| Events | Automatic | Manual |

---

### v-on

`v-on` attaches an event listener to an element or component.

**Core behavior:**
- **Event binding** — listens for DOM/component events
- **Shorthand** — `@` (at sign)
- **Modifiers** — `.stop`, `.prevent`, `.enter`, etc.

#### Form 1: Basic binding — `@event="handler"`

When to use: Binding a single event.

```vue
<button @click="handleClick">Click me</button>
<input @focus="handleFocus" />
<form @submit.prevent="handleSubmit">
```

#### Form 2: Event argument — `@event="handler($arg)"`

When to use: Passing the event or custom arguments.

```vue
<button @click="handleClick('foo', $event)">Click</button>

<script setup>
function handleClick(name, event) {
  console.log(name, event.target)
}
</script>
```

#### Form 3: Multiple events — Object syntax

When to use: Binding multiple events to different handlers.

```vue
<input
  @focus="onFocus"
  @blur="onBlur"
  @keyup.enter="onSubmit"
/>
```

#### Form 4: With modifiers

```vue
<!-- .stop — stop propagation -->
<button @click.stop="handleClick">

<!-- .prevent — prevent default -->
<form @submit.prevent="handleSubmit">

<!-- .capture — use capture mode -->
<div @click.capture="handleCapture">

<!-- .self — only if target is self -->
<div @click.self="handleSelf">

<!-- .enter — key modifier -->
<input @keyup.enter="submit">
```

#### Event Modifiers Reference
| Modifier | Description |
|----------|-------------|
| `.stop` | `event.stopPropagation()` |
| `.prevent` | `event.preventDefault()` |
| `.capture` | Use capture mode |
| `.self` | Only on target element |
| `.once` | Only trigger once |
| `.passive` | Passive event listener |
| `.enter` | Key: Enter |
| `.esc` | Key: Escape |

---

### v-for

`v-for` renders a list of items by iterating over an array or object.

**Core behavior:**
- **List rendering** — creates one element per item
- **Key binding** — always use `:key` for performance
- **Scope** — item/index available in body

#### Form 1: Array iteration — `item in items`

When to use: Iterating over an array.

```vue
<ul>
  <li v-for="item in items" :key="item.id">
    {{ item.name }}
  </li>
</ul>

<!-- With index -->
<li v-for="(item, index) in items" :key="item.id">
  {{ index }}: {{ item.name }}
</li>
```

#### Form 2: Object iteration — `(value, key) in object`

When to use: Iterating over an object's properties.

```vue
<!-- (value, key, index) -->
<div v-for="(value, key, index) in user" :key="key">
  {{ index }}. {{ key }}: {{ value }}
</div>
```

#### Form 3: Range — `n in count`

When to use: Repeating n times.

```vue
<span v-for="n in 5" :key="n">{{ n }}</span>
<!-- 1 2 3 4 5 -->
```

#### Common Gotchas

1. **Always use `:key`** — without key, Vue can't optimize DOM reuse
   ```vue
   <!-- ❌ Bad -->
   <li v-for="item in items">{{ item.name }}</li>
   
   <!-- ✅ Good -->
   <li v-for="item in items" :key="item.id">{{ item.name }}</li>
   ```
2. **Don't use index as key** — causes bugs with dynamic lists
3. **v-for with v-if** — v-if has higher priority (filtered in Vue 2, use computed in Vue 3)

---

### v-if vs v-show

Both conditionally render elements, but work differently under the hood.

**Core behavior:**
| Aspect | `v-if` | `v-show` |
|--------|--------|----------|
| Method | Add/remove DOM | Toggle CSS `display` |
| Initial render | Lazy (not rendered) | Eager (always rendered) |
| Re-render cost | Higher (DOM manipulation) | Lower (CSS toggle) |
| `<template>` | Supported | Not supported |

#### When to use v-if

```vue
<!-- Conditional rendering (expensive, rarely changes) -->
<div v-if="showModal">
  <HeavyComponent />
</div>
```

**Best for:**
- Rarely changing conditions
- Heavy components (don't render until needed)
- `v-else-if` / `v-else` chains

#### When to use v-show

```vue
<!-- Frequent show/hide (cheap toggle) -->
<div v-show="isExpanded">
  <LightweightContent />
</div>
```

**Best for:**
- Frequently toggled visibility
- Lightweight content
- Tab switching, dropdowns

#### Quick Decision Guide
```typescript
Need to conditionally show/hide?
  └── Heavy content, rarely changes? → v-if
  └── Lightweight, frequent toggle? → v-show
  └── Need v-else? → v-if (v-show has no else)
```

---

### v-slot

`v-slot` passes template content to child components (scoped slots).

**Core behavior:**
- **Template passing** — pass templates to components
- **Scoped data** — receive data from child
- **Shorthand** — `#` (hash)

#### Form 1: Named slots — `#name="slotProps"`

When to use: Multiple slot outlets in components.

```vue
<!-- Parent -->
<MyCard>
  <template #header>
    <h1>Title</h1>
  </template>
  
  <template #default="{ user, item }">
    <p>{{ user.name }}</p>
    <p>{{ item.description }}</p>
  </template>
  
  <template #footer="props">
    <p>{{ props.message }}</p>
  </template>
</MyCard>
```

#### Form 2: Dynamic slot — `#[slotName]="props"`

When to use: Dynamic slot names based on data.

```vue
<BaseLayout>
  <template #[dynamicSlotName]="props">
    {{ props.content }}
  </template>
</BaseLayout>
```

#### Form 3: Fallback content — Default slot

```vue
<!-- Child provides default, parent can override -->
<SubmitButton>
  Save changes
</SubmitButton>

<!-- Or override default -->
<SubmitButton #default>
  Custom text
</SubmitButton>
```

#### Common Gotchas

1. **# is shorthand for v-slot:** — `v-slot:header` === `#header`
2. **Dynamic slot names** — must use `v-slot:[name]` or `#[name]`
3. **`#default` for default slot** — only needed when using both named and default

---

## Custom Directives

### Custom Directive Overview

Custom directives are functions prefixed with `v-` that allow direct DOM manipulation.

**Core behavior:**
- **生命周期 hooks** — `mounted`, `updated`, `unmounted`, etc.
- **Passed values** — `binding.value`, `binding.arg`, `binding.modifiers`
- **Global/local** — register globally or per-component

#### Directive Hook Object

```ts
interface DirectiveHook {
  // Called before parent component is mounted
  beforeMount?(el: HTMLElement, binding: DirectiveBinding, vnode: VNode): void
  // Called after parent component is mounted
  mounted?(el: HTMLElement, binding: DirectiveBinding, vnode: VNode): void
  // Called before parent component updates
  beforeUpdate?(el: HTMLElement, binding: DirectiveBinding, vnode: VNode): void
  // Called after parent component updates
  updated?(el: HTMLElement, binding: DirectiveBinding, vverse: VNode): void
  // Called before parent component is unmounted
  beforeUnmount?(el: HTMLElement, binding: DirectiveBinding, vnode: VNode): void
  // Called after parent component is unmounted
  unmounted?(el: HTMLElement, binding: DirectiveBinding, vnode: VNode): void
}
```

---

### Form 1: Local directive — `directives: {}`

When to use: Component-specific directive.

```vue
<script setup>
const vFocus = {
  mounted: (el) => el.focus()
}
</script>

<template>
  <input v-focus />
</template>
```

---

### Form 2: Global directive — `app.directive()`

When to use: Application-wide directive.

```js
// main.ts
const app = createApp(App)

app.directive('focus', {
  mounted: (el) => el.focus()
})

app.directive('click-outside', {
  mounted(el, binding) {
    el._clickOutside = (event) => {
      if (!el.contains(event.target)) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el._clickOutside)
  },
  unmounted(el) {
    document.removeEventListener('click', el._clickOutside)
  }
})

app.mount('#app')
```

---

### Form 3: Directive with binding — Accessing values

```js
// Usage: <div v-color:[color]="value" />

app.directive('color', {
  mounted(el, binding) {
    // binding.arg = 'color' (the argument)
    // binding.value = 'red' (the value passed)
    el.style.setProperty(binding.arg, binding.value)
  },
  updated(el, binding) {
    el.style.setProperty(binding.arg, binding.value)
  }
})
```

#### Binding Object Properties

| Property | Description |
|----------|-------------|
| `binding.value` | The value passed (`v-dir="value"`) |
| `binding.arg` | The argument (`v-dir:arg`) |
| `binding.modifiers` | Modifiers object (`v-dir.mod.foo`) |
| `binding.instance` | The component instance |
| `binding.dir` | The directive object itself |

---

### Form 4: Functional directive — Shorthand

When to use: Simple directive that only needs `mounted` and `updated`.

```js
// v-highlight
app.directive('highlight', (el, binding) => {
  el.style.backgroundColor = binding.value
})
```

---

### Common Patterns

#### Pattern 1: Click outside

```js
app.directive('click-outside', {
  mounted(el, binding) {
    el._clickOutside = (event) => {
      if (!el.contains(event.target)) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el._clickOutside)
  },
  unmounted(el) {
    document.removeEventListener('click', el._clickOutside)
  }
})
```

#### Pattern 2: Focus management

```js
app.directive('focus', {
  mounted(el) {
    el.focus()
  }
})
```

#### Pattern 3: Scroll detection

```js
app.directive('on-scroll', {
  mounted(el, binding) {
    el._scrollHandler = () => {
      if (isInViewport(el)) {
        binding.value()
      }
    }
    window.addEventListener('scroll', el._scrollHandler)
  },
  unmounted(el) {
    window.removeEventListener('scroll', el._scrollether)
  }
})
```

---

### Common Gotchas

1. **Setup vs Options API** — In `<script setup>`, use `vFocus` (camelCase); in Options API, use `'v-focus'`
2. **Performance** — Directives run on every render; keep them lightweight
3. **Timing** — `mounted` runs after parent but before children
4. **Arguments vs Modifiers** — `v-dir:arg.mod` has arg as `binding.arg` and modifiers in `binding.modifiers`
5. **Don't misuse** — Most things directives can do, components can do better in Vue 3

#### Quick Decision Guide
```typescript
Need to MANIPULATE DOM directly?
  └── Simple, reusable behavior? → Custom directive
       └── Component-specific? → Local directive
       └── App-wide? → Global directive
  └── Complex behavior with state? → Consider a component instead
```

---