---
title: Vue3 API 03
date: 2026-04-03
tags: [Vue]
---
## Built-in Components

### KeepAlive

`KeepAlive` **caches** dynamic components to avoid repeated destruction and reconstruction. The cached component instance is preserved.

**Core behavior:**
- **Caching** — preserves component state when toggling
- **activated/deactivated** — lifecycle hooks for cached components
- **Include/exclude** — filter which components to cache by name

#### Form 1: Basic caching — `<KeepAlive>`

When to use: Preserving state across component switches.

```vue
<template>
  <KeepAlive>
    <component :is="currentComponent" />
  </KeepAlive>
</template>
```

#### Form 2: With include/exclude — Filter cache by name

When to use: Selective caching based on component names.

```vue
<KeepAlive include="Home,About">
  <component :is="currentComponent" />
</KeepAlive>

<!-- Regex support -->
<KeepAlive :include="/^(Home|About)$/">
  <component :is="currentComponent" />
</KeepAlive>

<!-- Array of names -->
<KeepAlive :include="['Home', 'About']">
  <component :is="currentComponent" />
</KeepAlive>
```

#### Form 3: With max — Limit cache size

When to use: Preventing memory issues from too many cached components.

```vue
<KeepAlive :max="5">
  <component :is="currentComponent" />
</KeepAlive>
```

#### Lifecycle Flow
```
onMounted → onDeactivated → (cached) → onActivated → onUnmounted
```

#### Common Gotchas

1. **v-if vs KeepAlive** — v-if destroys and recreates; KeepAlive caches
2. **Memory management** — use `:max` to limit cache size
3. **Naming required** — components need `name` option for include/exclude to work

---

### Teleport

`Teleport` **moves** a component's DOM output to a different location in the document.

**Core behavior:**
- **Target location** — moves content to any valid CSS selector or DOM element
- **Disabled** — can be conditionally disabled
- **Same component tree** — logically remains in the original tree

#### Form 1: Basic teleport — `to="body"`

When to use: Modal dialogs, tooltips that need to escape overflow contexts.

```vue
<Teleport to="body">
  <Modal v-if="showModal" />
</Teleport>
```

#### Form 2: Dynamic target — `:to="target"`

When to use: Conditionally teleporting to different containers.

```vue
<template>
  <Teleport :to="containerId">
    <Tooltip>Content</Tooltip>
  </Teleport>
</template>

<script setup>
const containerId = ref('#dynamic-container')
</script>
```

#### Form 3: With disabled — Conditional teleport

When to use: SSR where teleport should be skipped.

```vue
<Teleport to="body" :disabled="isServer">
  <Modal />
</Teleport>
```

#### Common Gotchas

1. **Target must exist** — container element must be in DOM before Teleport mounts
2. **CSS z-index** — teleported content may need z-index adjustments
3. **Multiple teleports** — multiple Teleports can target same container

---

### Transition

`Transition` applies **CSS transition effects** to single elements or components when they enter or leave the DOM.

**Core behavior:**
- **Auto classes** — Vue adds/removes classes automatically
- **Hooks available** — JavaScript hooks for complex animations
- **Mode control** — prevent simultaneous enter/leave transitions

#### Form 1: Basic transition — `name="fade"`

When to use: Simple enter/leave animations on elements.

```vue
<Transition name="fade">
  <p v-if="show">Hello</p>
</Transition>
```

```css
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
```

#### Form 2: CSS classes applied

| Class | When applied |
|-------|-------------|
| `{name}-enter-from` | Before element inserted |
| `{name}-enter-active` | During entire enter transition |
| `{name}-enter-to` | After element inserted |
| `{name}-leave-from` | Before leave transition starts |
| `{name}-leave-active` | During entire leave transition |
| `{name}-leave-to` | After leave transition completes |

#### Form 3: With JavaScript hooks — `:css="false"`

When to use: Pure JavaScript animations with anime.js, GSAP, etc.

```vue
<Transition
  @before-enter="onBeforeEnter"
  @enter="onEnter"
  @leave="onLeave"
  :css="false"
>
  <div v-if="show">Content</div>
</Transition>
```

```js
function onEnter(el, done) {
  el.animate([{ opacity: 0 }, { opacity: 1 }], {
    duration: 300,
    complete: done
  })
}
```

#### Form 4: Transition mode — `mode="out-in"`

When to use: Preventing enter/leave from happening simultaneously.

```vue
<!-- out-in: old element leaves completely before new enters -->
<Transition name="fade" mode="out-in">
  <component :is="currentView" />
</Transition>
```

#### Common Gotchas

1. **Key required** — v-if/v-show need to change for Transition to trigger
2. **CSS-first** — CSS transitions are more performant than JS hooks
3. **Mode prevents overlap** — `out-in` prevents both states existing simultaneously

---

### TransitionGroup

`TransitionGroup` applies **transition effects** to lists of elements with automatic move transitions.

**Core behavior:**
- **Renders as `<span>` by default** — use `tag` to change
- **Move transitions** — automatic animation when items change position
- **List-specific classes** — enter/leave + move classes

#### Form 1: Basic list transition — `<TransitionGroup>`

When to use: Animating list items on add/remove/reorder.

```vue
<TransitionGroup name="list">
  <span v-for="item in items" :key="item">{{ item }}</span>
</TransitionGroup>
```

```css
.list-enter-active, .list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from, .list-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
.list-move {
  transition: transform 0.3s ease;
}
```

#### Form 2: With tag — Container element

When to use: When you need a wrapper element.

```vue
<TransitionGroup name="list" tag="ul">
  <li v-for="item in items" :key="item">{{ item }}</li>
</TransitionGroup>
```

#### Form 3: With max — Limit list size

When to use: Capped lists with animations.

```vue
<TransitionGroup name="list" tag="ul" :max="10">
  <li v-for="item in items" :key="item">{{ item }}</li>
</TransitionGroup>
```

#### Common Gotchas

1. **Key required** — always use :key on items
2. **Move transitions** — .list-move class handles reordering
3. **CSS animations preferred** — TransitionGroup is optimized for CSS

---

### Suspense

`Suspense` enables **nested async dependencies** in the component tree. It renders a fallback while waiting for async components.

**Core behavior:**
- **Nested support** — waits for all nested async dependencies
- **Two templates** — #default and #fallback slots
- **Events** — resolve/reject callbacks

#### Form 1: Basic suspense — Nested async components

When to use: Loading states for nested lazy-loaded components.

```vue
<Suspense>
  <template #default>
    <AsyncComponent />
  </template>
  <template #fallback>
    <LoadingSpinner />
  </template>
</Suspense>
```

#### Form 2: With timeout — `timeout="3000"`

When to use: Showing fallback only after delay.

```vue
<Suspense :timeout="3000">
  <template #default>
    <DeepAsyncComponent />
  </template>
  <template #fallback>
    <LoadingSpinner />
  </template>
</Suspense>
```

#### Form 3: With error handling — `onErrorCaptured`

When to use: Handling async component errors.

```vue
<script setup>
import { onErrorCaptured } from 'vue'

onErrorCaptured((err) => {
  console.error('Async error:', err)
  return false
})
</script>

<Suspense>
  <template #default>
    <AsyncComponent />
  </template>
  <template #fallback>
    <ErrorComponent />
  </template>
</Suspense>
```

#### Common Gotchas

1. **Async setup** — Suspense waits for async setup() in Vue 3
2. **onResolve/onReject** — removed in Vue 3, use slots instead
3. **Teleport + Suspense** — Suspense can wrap Teleport

---

## Component API

### defineComponent

`defineComponent()` creates a component definition with proper TypeScript support.

**Core behavior:**
- **Type inference** — full TypeScript support for props, emits, etc.
- **Setup function** — Composition API or render function
- **Options** — name, props, emits, data, computed, methods, etc.

#### Form 1: Options API — Traditional component definition

When to use: Migrating from Vue 2 or prefer Options API.

```js
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MyComponent',
  props: {
    title: { type: String, required: true },
    count: { type: Number, default: 0 }
  },
  emits: ['update', 'delete'],
  data() {
    return { localCount: this.count }
  },
  computed: {
    doubled() { return this.localCount * 2 }
  },
  watch: {
    count(val) { this.localCount = val }
  },
  methods: {
    increment() {
      this.localCount++
      this.$emit('update', this.localCount)
    }
  },
  mounted() {
    console.log('mounted')
  }
})
```

#### Form 2: Composition API with setup — Reactive logic

When to use: Logic reuse via composables, complex logic.

```js
import { defineComponent, ref, computed, onMounted } from 'vue'

export default defineComponent({
  props: {
    title: String,
    initialCount: { type: Number, default: 0 }
  },
  emits: ['update'],
  setup(props, { emit, expose }) {
    const count = ref(props.initialCount)
    const doubled = computed(() => count.value * 2)

    function increment() {
      count.value++
      emit('update', count.value)
    }

    expose({ count, increment })

    onMounted(() => {
      console.log('mounted')
    })

    return { count, doubled, increment }
  }
})
```

#### Form 3: render function — Programmatic markup

When to use: Complex dynamic rendering, JSX alternative.

```js
import { defineComponent, ref, h } from 'vue'

export default defineComponent({
  props: {
    type: { type: String, default: 'info' }
  },
  setup(props, { slots }) {
    return () => h('div', { class: `alert-${props.type}` }, slots.default())
  }
})
```

#### Common Gotchas

1. **TypeScript** — defineComponent provides best TypeScript inference
2. **setup() return** — must return template refs or functions
3. **expose()** — needed for parent accessing child via ref

---

### defineAsyncComponent

`defineAsyncComponent()` creates a component that **loads lazily** only when needed.

**Core behavior:**
- **Lazy loading** — only loads when rendered
- **Loading state** — shows loading component during load
- **Error handling** — shows error component on failure

#### Form 1: Simple — `() => import()`

When to use: Code splitting for routes or heavy components.

```js
const AsyncModal = defineAsyncComponent(() => import('./Modal.vue'))
```

#### Form 2: With options — Loading/error components

When to use: Better UX with loading states and error handling.

```js
const AsyncUserProfile = defineAsyncComponent({
  loader: () => import('./UserProfile.vue'),
  loadingComponent: LoadingSpinner,
  errorComponent: ErrorMessage,
  delay: 200,
  timeout: 3000,
  suspensible: false
})
```

#### Form 3: On error retry — `onError`

When to use: Retry failed requests automatically.

```js
const AsyncData = defineAsyncComponent({
  loader: () => fetchData(),
  onError(error, retry, fail, attempts) {
    if (attempts < 3) {
      retry()
    } else {
      fail()
    }
  }
})
```

#### Common Gotchas

1. **Suspense** — can work with Suspense when `suspensible: true`
2. **Error handling** — errorComponent only catches load errors, not render errors
3. **Timeouts** — :timeout rejects if loader takes too long

---

### defineProps

`defineProps()` declares component **props** in `<script setup>`.

**Core behavior:**
- **Compile-time macro** — not imported, available automatically
- **Reactivity** — props are reactive
- **Destructuring** — can use `withDefaults` for defaults

#### Form 1: Array syntax — `['title', 'count']`

When to use: Simple props without validation.

```vue
<script setup>
defineProps(['title', 'count'])
</script>
```

#### Form 2: Object syntax — With validation

When to use: Adding type checking and default values.

```vue
<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    default: 0
  },
  items: {
    type: Array,
    default: () => []
  }
})
</script>
```

#### Form 3: TypeScript with `withDefaults` — Type inference

When to use: Full TypeScript support with type inference.

```vue
<script setup lang="ts">
interface Props {
  title?: string
  count?: number
  items: string[]
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Default Title',
  count: 0,
  items: () => []
})
</script>
```

#### Common Gotchas

1. **Defaults with objects/arrays** — must use factory function `() => []`
2. **withDefaults** — only works in `<script setup>` with lang="ts"
3. **Boolean coercion** — `default: false` vs `required: true` affects behavior

---

### defineEmits

`defineEmits()` declares component **events** in `<script setup>`.

**Core behavior:**
- **Compile-time macro** — not imported, available automatically
- **TypeScript support** — typed emit functions
- **Validation** — runtime validation with array syntax

#### Form 1: Array syntax — `['update', 'delete']`

When to use: Simple events without payload validation.

```vue
<script setup>
const emit = defineEmits(['update', 'delete'])

function handleClick() {
  emit('update', 'new value')
}
</script>
```

#### Form 2: Object syntax — With validation

When to use: Runtime validation of emit payloads.

```vue
<script setup>
const emit = defineEmits({
  update: (value) => typeof value === 'string',
  delete: (id) => typeof id === 'number'
})
</script>
```

#### Form 3: TypeScript — Typed emits

When to use: Full TypeScript support with type inference.

```vue
<script setup lang="ts">
const emit = defineEmits<{
  update: [value: string]
  delete: [id: number]
}>()

emit('update', 'hello')  // ✅ Type-safe
emit('delete', 1)       // ✅ Type-safe
</script>
```

#### Common Gotchas

1. **emit() vs emit('update:modelValue')** — for v-model, use update:modelValue
2. **Type inference** — TypeScript form gives best type safety
3. **Validation removed in prod** — object syntax validation only in dev mode

---

### defineModel

`defineModel()` creates a **two-way binding** prop (Vue 3.4+). Simplifies v-model on components.

**Core behavior:**
- **Auto modelValue** — creates modelValue prop + update:modelValue emit
- **Modifiers support** — works with v-model modifiers
- **TypeScript support** — full type inference

#### Form 1: Basic usage — `defineModel()`

When to use: Simple v-model on components.

```vue
<script setup>
const model = defineModel()
</script>

<template>
  <input v-model="model" />
</template>
```

#### Form 2: With options — Custom prop name

When to use: Multiple v-model bindings or custom prop names.

```vue
<script setup>
const title = defineModel('title', { type: String, default: '' })
const content = defineModel('content', { type: String, default: '' })
</script>

<template>
  <input v-model="title" />
  <textarea v-model="content"></textarea>
</template>
```

#### Form 3: TypeScript — Full type inference

When to use: Type-safe two-way binding.

```vue
<script setup lang="ts">
interface Props {
  title: { type: StringConstructor, required: true }
}

const title = defineModel<string>({
  type: String,
  required: true
})
</script>
```

#### Comparison: defineModel vs props + emits

| Aspect | defineModel | props + emits |
|--------|-------------|---------------|
| Boilerplate | Minimal | More code |
| Type inference | Automatic | Manual |
| Modifiers | Work automatically | Need custom handling |

---

### defineExpose

`defineExpose()` exposes properties to **parent via template refs**.

**Core behavior:**
- **Template refs only** — parent accessing child via `$refs`
- **Not reactive** — expose refs, not reactive state directly
- **Explicit** — only explicitly exposed properties are accessible

#### When to use: Parent accessing child component

```vue
<!-- Child.vue -->
<script setup>
import { ref } from 'vue'

const count = ref(0)
const message = 'Hello'

function increment() {
  count.value++
}

defineExpose({ count, message, increment })
</script>

<template>
  <div>Child</div>
</template>
```

```vue
<!-- Parent.vue -->
<script setup>
import { ref } from 'vue'
import Child from './Child.vue'

const childRef = ref(null)

function accessChild() {
  console.log(childRef.value.count)
  console.log(childRef.value.message)
  childRef.value.increment()
}
</script>

<template>
  <Child ref="childRef" />
</template>
```

#### Common Gotchas

1. **Not reactive exposure** — expose the ref, parent gets reactive access
2. **Template refs required** — only accessible via `$refs` or `ref`
3. **No prop drilling** — this is direct parent-child access

---

### defineOptions

`defineOptions()` sets component **options in `<script setup>`** (Vue 3.3+).

**Core behavior:**
- **Options in setup** — no need for separate `export default`
- **name** — for recursive components
- **inheritAttrs** — control attribute inheritance

#### When to use: Setting component options in script setup

```vue
<script setup>
defineOptions({
  name: 'MyComponent',
  inheritAttrs: false,
  components: { MyChild },
  directives: { myDirective }
})
</script>
```

#### Use Cases

| Option | Purpose |
|--------|---------|
| `name` | Recursive component references |
| `inheritAttrs: false` | Manual attribute handling |
| `components` | Local component registration |
| `directives` | Local directive registration |

---

### defineSlots

`defineSlots()` declares available **slots** with type inference (Vue 3.3+).

**Core behavior:**
- **Type inference** — slots automatically typed
- **Runtime only** — doesn't actually register slots, just for typing
- **Optional** — mostly for library authors

#### When to use: TypeScript with slot props

```vue
<script setup lang="ts">
defineSlots<{
  default: { item: string; index: number }
  header: {}
  footer: { message: string }
}>()
</script>
```

---

## SFC Features

### script setup

`<script setup>` is a **compile-time syntax** that makes Composition API simpler in Single File Components.

**Core behavior:**
- **Automatic return** — top-level variables/functions available in template
- **Module imports** — work as usual
- **Compiles to setup()** — generates setup() function

#### When to use: Composition API in SFC

```vue
<script setup>
import { ref, computed, onMounted } from 'vue'

const count = ref(0)
const doubled = computed(() => count.value * 2)

function increment() {
  count.value++
}

onMounted(() => {
  console.log('mounted')
})
</script>

<template>
  <button @click="increment">{{ doubled }}</button>
</template>
```

#### Common Gotchas

1. **Module scope** — all code is in module scope, not component scope
2. **this undefined** — can't use `this` in script setup
3. **defineProps/expose** — macros available without import

---

### Scoped CSS

`<style scoped>` limits **CSS to the current component** only.

**Core behavior:**
- **Data attribute** — Vue adds unique attribute to elements
- **Selector transformation** — selectors modified to match
- **Deep/globals** — `:deep()`, `:global()`, `:slotted()`

#### Form 1: Basic scoped — Automatic isolation

```vue
<style scoped>
.container {
  padding: 16px;
}
.title {
  font-size: 24px;
}
</style>
```

#### Form 2: Deep selector — Penetrate child components

```vue
<style scoped>
/* Target child component root */
:deep(.child-class) {
  color: red;
}

/* Target slotted content */
:slotted(.slotted-class) {
  color: blue;
}

/* Global styles */
:global(.global-class) {
  color: green;
}
</style>
```

#### Form 3: CSS Modules — Named module

```vue
<style module="styles">
.container {
  padding: 16px;
}
</style>

<template>
  <div :class="styles.container">Content</div>
</template>
```

#### Common Gotchas

1. **Child root elements** — parent styles don't pierce child root by default
2. **CSS variables** — scoped CSS variables can be passed to children
3. **Composition** — multiple `<style>` tags (scoped + global) work together

---

### v-bind in CSS

`v-bind()` in CSS **binds dynamic values** from script to styles.

**Core behavior:**
- **Reactive** — styles update when values change
- **Scoped** — works with scoped styles
- **CSS variables** — can set CSS custom properties

#### Form 1: Basic binding — Dynamic styles

```vue
<style scoped>
.container {
  background: v-bind(themeColor);
  padding: v-bind(spacing);
}
</style>

<script setup>
const themeColor = ref('#007bff')
const spacing = '16px'
</script>
```

#### Form 2: Reactive values — Animations

```vue
<style scoped>
.box {
  width: v-bind(width + 'px');
  transform: rotate(v-bind(rotation) + 'deg');
}
</style>

<script setup>
const width = ref(100)
const rotation = ref(45)
</script>
```

#### Form 3: CSS variables — Theming

```vue
<style scoped>
.container {
  --theme-color: v-bind(themeColor);
  --spacing: v-bind(spacing);
}
</style>

<template>
  <div class="container" :style="{ '--theme-color': themeColor }">
    Content
  </div>
</template>
```

#### Common Gotchas

1. **String concatenation** — `v-bind(width + 'px')` needed for units
2. **Type coercion** — Vue coerces values to strings
3. **Performance** — avoid expensive computations in v-bind

---

## Dynamic Components

### Dynamic Component Switching

`<component :is="component">` renders a component **based on a variable**.

**Core behavior:**
- **Component switching** — change component at runtime
- **State preserved** — with KeepAlive, state is cached
- **Built-in elements** — can render HTML elements too

#### Form 1: Basic switching — String component name

```vue
<script setup>
import Home from './Home.vue'
import About from './About.vue'
import Contact from './Contact.vue'

const components = { Home, About, Contact }
const current = ref('Home')
</script>

<template>
  <component :is="components[current]" />
</template>
```

#### Form 2: With KeepAlive — Preserve state

```vue
<KeepAlive>
  <component :is="currentComponent" />
</KeepAlive>
```

#### Form 3: Built-in elements — Render as HTML

```vue
<component :is="'div'" class="container">Content</component>
<component :is="'ul'">
  <li v-for="item in items" :key="item">{{ item }}</li>
</component>
```

#### Common Gotchas

1. **Component registration** — component must be registered or imported
2. **KeepAlive state** — without KeepAlive, component reinitializes on switch
3. **Async components** — can switch to async components

---

## Render Function

### h() Function

`h()` (hyperscript) creates a **virtual DOM node** programmatically.

**Core behavior:**
- **Returns VNode** — virtual node, not actual DOM
- **Children handling** — text, array, or multiple args
- **Event binding** — object syntax for listeners

#### Form 1: Element — `h('div', props, children)`

When to use: Programmatic component rendering.

```js
import { h } from 'vue'

h('div', { class: 'container', id: 'app' }, 'Hello')

h('div', { class: 'container' }, [
  h('h1', null, 'Title'),
  h('p', null, 'Description')
])
```

#### Form 2: With event handlers

```js
h('button', {
  class: 'btn',
  onClick: () => console.log('clicked'),
  onMouseenter: () => console.log('hover')
}, 'Click me')
```

#### Form 3: Component — `h(Component, props, children)`

```js
import { h } from 'vue'
import MyComponent from './MyComponent.vue'

h(MyComponent, { title: 'Hello', count: 5 }, [
  h('span', null, 'Content')
])
```

#### Form 4: In setup() — Render function

```js
export default {
  setup(props, { slots, emit, expose }) {
    const count = ref(0)
    
    return () => h('div', { class: 'counter' }, [
      h('span', null, count.value),
      h('button', {
        onClick: () => count.value++
      }, '+')
    ])
  }
}
```

#### Common Gotchas

1. **Template preferred** — templates are more readable for most cases
2. **VNode flattening** — Vue optimizes nested h() calls
3. **Key required** — for list rendering with h()

---

### withDirectives

`withDirectives()` applies **directives to VNodes** programmatically.

**Core behavior:**
- **Directive binding** — attach directive to element VNode
- **Multiple directives** — array of directive bindings
- **Conditional** — can dynamically apply directives

#### Form 1: Single directive — `withDirectives(vnode, [[directive]])`

When to use: Applying directives in render functions.

```js
import { h, withDirectives } from 'vue'
import vFocus from './directives/vFocus'

withDirectives(
  h('input'),
  [[vFocus]]
)
```

#### Form 2: With value and modifiers

```js
import { h, withDirectives } from 'vue'
import vColor from './directives/vColor'

withDirectives(
  h('div', 'Content'),
  [[vColor, 'red', { modifiers: { uppercase: true } }]]
)
```

#### Form 3: Multiple directives

```js
withDirectives(
  h('input'),
  [
    [vFocus],
    [vHighlight, { color: 'yellow' }],
    [vTooltip, 'Tooltip text']
  ]
)
```

#### Form 4: Conditional directive

```js
withDirectives(
  h('button', 'Admin'),
  hasPermission.value ? [[vPermission, 'admin']] : []
)
```

#### Common Gotchas

1. **Built-in directives** — can also apply vModel, vShow, vOn
2. **Directive hooks** — same hooks as in directive definition
3. **Priority** — directives applied in array order

---

## JSX / TSX

### JSX in Vue

Vue supports **JSX/TSX** syntax via `@vitejs/plugin-vue-jsx`.

**Core behavior:**
- **Template alternative** — JSX compiles to h() calls
- **TypeScript support** — full TSX support
- **Slight differences** — event naming, slot handling

#### Form 1: Basic JSX Component

```jsx
import { defineComponent, ref } from 'vue'

const Counter = defineComponent({
  setup() {
    const count = ref(0)
    return () => (
      <div class="counter">
        <span>{count.value}</span>
        <button onClick={() => count.value++}>+</button>
      </div>
    )
  }
})
```

#### Form 2: With Props and Emits

```tsx
interface Props {
  title: string
  count?: number
}

const MyComponent = defineComponent<Props>({
  props: {
    title: { type: String, required: true },
    count: { type: Number, default: 0 }
  },
  emits: ['update', 'delete'],
  setup(props, { emit }) {
    const handleUpdate = () => emit('update', 'new value')
    return () => (
      <div>
        <h1>{props.title}</h1>
        <button onClick={handleUpdate}>Update</button>
      </div>
    )
  }
})
```

#### Form 3: Slots in JSX

```tsx
const SlotComponent = defineComponent({
  setup(props, { slots }) {
    return () => (
      <div class="wrapper">
        <header>{slots.header?.()}</header>
        <main>{slots.default?.()}</main>
        <footer>{slots.footer?.({ message: 'Hi' })}</footer>
      </div>
    )
  }
})

// Usage
<SlotComponent>
  {{ header: () => <h1>Title</h1> }}
  <p>Main content</p>
  {{ footer: (props) => <span>{props.message}</span> }}
</SlotComponent>
```

#### Form 4: v-model in JSX

```tsx
const InputComponent = defineComponent({
  setup(props, { emit }) {
    const modelValue = ref('')
    return () => (
      <input
        value={modelValue.value}
        onInput={(e) => emit('update:modelValue', e.target.value)}
      />
    )
  }
})
```

#### Common Gotchas

1. **Event naming** — `onClick` not `@click`, `onInput` not `@input`
2. **Class vs className** — use `class` in Vue JSX
3. **Slots** — slots are functions, not template slot syntax

---