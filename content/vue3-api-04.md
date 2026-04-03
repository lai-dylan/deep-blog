---
title: Vue3 API 04
date: 2026-04-03
tags: [Vue]
---
## TypeScript Utilities

### extractPropTypes

`extractPropTypes()` extracts **prop types** from a component definition for runtime validation.

**Core behavior:**
- **Type inference** — extracts prop types from defined props
- **Runtime validation** — used by Vue to validate prop values
- **For library authors** — helps generate prop definitions

#### When to use: Generating prop type definitions

```ts
import { defineComponent, extractPropTypes } from 'vue'

const MyComponent = defineComponent({
  props: {
    title: { type: String, required: true },
    count: { type: Number, default: 0 }
  }
})

// Extract types for external use
type MyProps = extractPropTypes<typeof MyComponent.props>
```

---

### maybeRef

`maybeRef()` accepts either a **ref or plain value** and normalizes to a ref (Vue 3.4+).

**Core behavior:**
- **Auto-wrapping** — if value is not a ref, wraps it
- **TypeScript support** — full type inference
- **Consistent API** — composables can accept both

#### When to use: Composable arguments that accept refs or values

```ts
import { maybeRef, computed } from 'vue'

function useMultiplier(value: maybeRef<number>, multiplier: number) {
  return computed(() => {
    const val = isRef(value) ? value.value : value
    return val * multiplier
  })
}

// Usage
useMultiplier(5, 2)      // ✅ Works with plain value
useMultiplier(ref(5), 2) // ✅ Works with ref
```

---

### prop-types

`prop-types` is a **runtime prop validation library** used by Vue internally.

**Core behavior:**
- **Runtime validation** — validates props against definitions
- **Built-in validators** — String, Number, Boolean, Array, Object, etc.
- **Custom validators** — function-based prop validation

#### When to use: Runtime prop validation

```js
import { defineComponent, propTypes } from 'vue'

defineComponent({
  props: {
    // Basic types
    title: propTypes.string,
    count: propTypes.number,
    isActive: propTypes.bool,
    
    // Complex types
    items: propTypes.array,
    config: propTypes.object,
    
    // With validation
    email: propTypes.string.required,
    age: propTypes.number.min(0).max(120),
    url: propTypes.string.pattern(/^https?:\/\//),
    
    // Custom validator
    status: propTypes.oneOf(['pending', 'done']).def('pending')
  }
})
```

#### Common Prop Types

| Validator | Description |
|-----------|-------------|
| `string` | String value |
| `number` | Number value |
| `bool` | Boolean value |
| `array` | Array value |
| `object` | Object value |
| `function` | Function value |
| `date` | Date value |
| `symbol` | Symbol value |
| `.required` | Mark as required |
| `.def(value)` | Set default value |
| `.validator(fn)` | Custom validation function |
| `.oneOf(arr)` | Enum validation |

---

## Global API

### createApp

`createApp()` creates a **Vue application instance** that provides app-level configuration.

**Core behavior:**
- **Returns app instance** — provides app config methods
- **Root component** — first argument is the root component
- **Chained config** — app.use(), app.mount(), app.component()

#### Form 1: Basic usage — `createApp(Component)`

When to use: Standard Vue app initialization.

```js
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

app.mount('#app')
```

#### Form 2: With props — `createApp(Component, props)`

When to use: Passing props to root component.

```js
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App, {
  rootProps: 'value'
})

app.mount('#app')
```

#### Form 3: App chaining — `.use().component().mixin()`

When to use: Multiple app configurations.

```js
const app = createApp(App)
  .use(router)
  .use(pinia)
  .use(plugin, { option: true })
  .component('MyComponent', MyComponent)
  .mount('#app')
```

---

### nextTick

`nextTick()` queues a **callback to be executed after** the next DOM update cycle.

**Core behavior:**
- **Async** — returns a Promise
- **Batch updates** — waits for Vue to finish current update cycle
- **DOM access** — safe to access DOM after nextTick

#### When to use: Accessing DOM after reactive changes

```js
import { ref, nextTick } from 'vue'

const count = ref(0)

async function incrementAndLog() {
  count.value++
  
  // DOM is not yet updated here
  await nextTick()
  
  // DOM is now updated
  console.log(document.querySelector('.count').textContent)
}
```

#### Form 2: Callback form — `nextTick(callback)`

```js
count.value++
nextTick(() => {
  console.log('DOM updated:', count.value)
})
```

#### Common Gotchas

1. **Always async** — nextTick is always asynchronous
2. **Callback vs Promise** — both forms work, Promise is preferred
3. **Sequence** — each nextTick waits for next update cycle

---

### version

`version` exports Vue's **current version** as a string.

**Core behavior:**
- **Runtime constant** — available from 'vue' package
- **Version checking** — useful for conditional code

#### When to use: Version-specific features

```js
import { version } from 'vue'

console.log(`Vue version: ${version}`)

// Conditional behavior
if (version.startsWith('3.')) {
  console.log('Running Vue 3')
} else {
  console.log('Running Vue 2')
}
```

---

## App Config

### errorHandler

`errorHandler` is a **global handler** for uncaught component errors.

**Core behavior:**
- **Catches all errors** — from components, watchers, lifecycle hooks
- **Does not stop propagation** — only logs
- **Async errors** — also catches unhandled promise rejections

#### When to use: Global error logging and reporting

```js
import { createApp } from 'vue'

const app = createApp(App)

app.config.errorHandler = (err, instance, info) => {
  console.error('Global error:', err)
  console.error('Component:', instance)
  console.error('Error info:', info)
  
  // Report to error tracking service
  reportError(err, { info })
}

app.mount('#app')
```

#### Parameters

| Parameter | Description |
|-----------|-------------|
| `err` | The caught Error |
| `instance` | Component where error originated (or null) |
| `info` | Additional error info (lifecycle hook name, etc.) |

#### Common Gotchas

1. **Does not prevent errors** — only handles/catches them
2. **Async errors** — unhandled promise rejections also caught
3. **In production** — errorHandler should be set before mounting

---

### globalProperties

`globalProperties` adds **global properties** accessible in every component via `this`.

**Core behavior:**
- **Globally available** — accessible via `this` in Options API
- **Type augmentation** — extend for TypeScript
- **Composition API alternative** — prefer `provide`/`inject` in Vue 3

#### When to use: Adding app-wide utilities (Options API)

```js
import { createApp } from 'vue'

const app = createApp(App)

app.config.globalProperties.$myUtil = {
  formatDate(date) {
    return new Intl.DateTimeFormat().format(date)
  }
}

app.mount('#app')
```

```js
// In Options API component
export default {
  mounted() {
    console.log(this.$myUtil.formatDate(new Date()))
  }
}
```

#### Vue 3 Alternative: Use `provide`/`inject` instead

```js
// Plugin or main.ts
app.provide('myUtil', {
  formatDate(date) {
    return new Intl.DateTimeFormat().format(date)
  }
})
```

```vue
<!-- In component -->
<script setup>
import { inject } from 'vue'

const $myUtil = inject('myUtil')
console.log($myUtil.formatDate(new Date()))
</script>
```

#### TypeScript augmentation

```ts
// env.d.ts
declare module '@vue/runtime-core' {
  interface GlobalProperties {
    $myUtil: {
      formatDate: (date: Date) => string
    }
  }
}
```

---

### warnHandler

`warnHandler` is a **global handler** for Vue warnings during development.

**Core behavior:**
- **Dev only** — stripped in production builds
- **First warning only** — can set to handle only first occurrence
- **Custom handling** — format or suppress warnings

#### When to use: Custom warning handling in development

```js
import { createApp } from 'vue'

const app = createApp(App)

app.config.warnHandler = (msg, instance, trace) => {
  // Custom warning format
  console.warn(`[Vue Warn]: ${msg}`)
  console.warn(`Trace: ${trace}`)
  
  // Or send to logging service
  logWarning(msg, { trace })
}

app.mount('#app')
```

#### Common Gotchas

1. **Dev only** — never runs in production
2. **Does not stop warnings** — only intercepts them
3. **Performance** — can impact performance if handler is expensive

---

## Plugin API

### Plugin Overview

A plugin is an **object with an install method** that can add global functionality to Vue.

**Core behavior:**
- **install method** — receives app instance and options
- **Chained** — app.use() chains plugins
- **Multiple uses** — same plugin can be installed multiple times

#### Plugin Structure

```js
export default {
  install(app, options) {
    // Add global components
    app.component('MyPluginComponent', MyComponent)
    
    // Add global directives
    app.directive('my-directive', MyDirective)
    
    // Add global properties
    app.config.globalProperties.$myPlugin = {
      feature: () => console.log('plugin feature')
    }
    
    // Use provide/inject
    app.provide('pluginKey', { option: options })
  }
}
```

---

### Form 1: Basic Plugin — Object with install

When to use: Standard plugin creation.

```js
// my-plugin.js
export default {
  install(app, options) {
    console.log('Plugin installed with options:', options)
  }
}

// Usage
import { createApp } from 'vue'
import MyPlugin from './my-plugin'

const app = createApp(App)
app.use(MyPlugin, { option: 'value' })
```

---

### Form 2: Function Plugin — Direct function

When to use: Simple plugins that only need the install function.

```js
// If plugin only has install, can be a function
const myPlugin = (app, options) => {
  app.provide('myFeature', options.feature)
}

// Usage
app.use(myPlugin, { feature: () => console.log('hello') })
```

```vue
<!-- In component -->
<script setup>
const myFeature = inject('myFeature')
myFeature() // logs 'hello'
</script>
```

---

### Form 3: Plugin with Dependency Injection

When to use: Providing API or services to components.

```js
const apiPlugin = {
  install(app) {
    const api = {
      fetch: (url) => fetch(url).then(r => r.json()),
      post: (url, data) => fetch(url, { method: 'POST', body: JSON.stringify(data) })
    }
    
    app.provide('api', api)
  }
}
```

```vue
<script setup>
import { inject } from 'vue'

const api = inject('api')
api.fetch('/users')
</script>
```

---

### Form 4: Plugin with Components

When to use: Registering global UI components.

```js
import MyButton from './components/MyButton.vue'
import MyModal from './components/MyModal.vue'

const componentPlugin = {
  install(app) {
    app.component('MyButton', MyButton)
    app.component('MyModal', MyModal)
  }
}

// Usage in template: <MyButton /> <MyModal />
```

---

### Form 5: Plugin with Directives

When to use: Registering global custom directives.

```js
const clickOutsidePlugin = {
  install(app) {
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
  }
}

// Usage: <div v-click-outside="handleClick">Content</div>
```

---

### Common Patterns

#### Pattern 1: Composable pattern — `app.provide()` with composable

When to use: Adding reusable logic via plugin (Vue 3 pattern).

```js
// Plugin provides the utility
const i18nPlugin = {
  install(app) {
    app.provide('i18n', {
      locale: ref('en'),
      t: (key) => i18n.translate(key, this.locale.value)
    })
  }
}

// Composable to use in components
function useI18n() {
  const { locale, t } = inject('i18n')
  return { locale, t }
}
```

```vue
<script setup>
const { locale, t } = useI18n()
</script>
```

#### Pattern 2: Auto-install guard

When to use: Preventing duplicate plugin initialization.

```js
// Plugins can detect if already installed
let installed = false

export default {
  install(app) {
    if (installed) return
    installed = true
    // ... install logic
  }
}
```

---

### Common Gotchas

1. **Order matters** — plugins are applied in order of .use() calls
2. **Duplicate use** — same plugin can be used multiple times without error
3. **TypeScript** — use `Plugin` type from 'vue' for typing
4. **Prefer provide/inject over mixins** — `app.mixin()` is deprecated in Vue 3
5. **Global state** — avoid global mutable state in plugins

#### Quick Decision Guide
```typescript
Need to add app-wide FUNCTIONALITY?
  └── Global components → Plugin with app.component()
  └── Global directives → Plugin with app.directive()
  └── Global properties → Plugin with globalProperties
  └── Dependency injection → Plugin with app.provide()
  └── Multiple → Single plugin with all of above
```

---