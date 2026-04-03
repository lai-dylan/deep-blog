---
title: Vue3 APIs
date: 2026-04-03
tags: [Vue]
---
## Reactivity API

### reactive

`reactive()` creates a **deeply reactive proxy** of an object. All nested properties become reactive.

**Core behavior:**
- Returns a **proxy** (no `.value` needed — access properties directly)
- **Deep reactivity** — nested objects are automatically reactive
- **Only works with objects** — cannot wrap primitives
- **Cannot destructure** without losing reactivity

#### Form 1: Basic object — `reactive(obj)`

When to use: Most common form. Making a plain object reactive.

```js
const state = reactive({ count: 0, user: { name: 'John' } })
state.count++
state.user.name = 'Jane'  // nested still reactive
```

#### Form 2: Destructuring with `toRef` / `toRefs` — Preserve reactivity

When to use: When you need to extract/destructure reactive properties while keeping them reactive.

```js
const state = reactive({ count: 0, name: 'John' })

// ❌ Bad: loses reactivity
const { count } = state
count = 5  // won't update state.count

// ✅ Good: use toRef/toRefs
const { count } = toRefs(state)
count.value = 5  // state.count is now 5

// Or single property with toRef
const count = toRef(state, 'count')
```

#### Form 3: Read-only reactive — `readonly(reactive(obj))`

When to use: Preventing mutations from child components or external sources.

```js
const original = reactive({ count: 0 })
const readOnly = readonly(original)

readOnly.count = 5  // ❌ Warning: cannot modify readonly
original.count = 5  // ✅ works
```

#### Common Gotchas

1. **Replacing the entire object** — breaks reactivity
   ```js
   let state = reactive({ count: 0 })
   state = reactive({ count: 10 })  // ❌ reactivity lost
   ```
2. **Destructuring** — always loses reactivity, use `toRefs` or `toRef`
3. **Arrays in reactive** — arrays are reactive but replacing them requires reassignment
4. **Primitive values** — reactive only works for objects, use `ref()` for primitives

#### Quick Decision Guide
```typescript
Need to make an OBJECT reactive?
  └── Yes → reactive(obj)
       └── Need to destructure it?
            └── Yes → use toRef/toRefs
            └── No → reactive(obj) directly
```

---

### ref

`ref()` creates a **reactive wrapper** for any value (including primitives). Access wrapped values via `.value`.

**Core behavior:**
- Returns a **ref-like object** (access value via `.value`)
- Works with **any type** — primitives, objects, arrays, DOM elements
- **Unwraps** primitives when used in templates (no `.value` needed)
- Objects/arrays are wrapped with `reactive()` internally

#### Form 1: Primitive ref — `ref(value)`

When to use: Most common form. Wrapping a single primitive value.

```js
const count = ref(0)
count.value++
console.log(count.value) // 1
```

#### Form 2: Object/Array ref — `ref(obj)`

When to use: When you need to wrap a complex value. The internal object becomes deeply reactive.

```js
const user = ref({ name: 'John', age: 30 })
user.value.name = 'Jane'  // nested reactivity preserved
```

#### Form 3: Ref with getter/setter — `{ get, set }`

When to use: Creating a computed-like ref that reads/writes to a specific source.

```js
const count = ref(0)
const proxy = ref({
  get: () => count.value,
  set: (val) => { count.value = val }
})

proxy.value = 10  // count.value is now 10
```

#### Common Gotchas

1. **`.value` in script vs template** — use `.value` in `<script>`, omit in templates
   ```js
   const count = ref(0)
   {{ count }}        // ✅ template auto-unwraps
   {{ count.value }}  // ❌ don't do this in template
   ```
2. **Destructuring** — refs CAN be destructured and keep reactivity
   ```js
   const { count } = someRefObject  // ✅ still reactive
   ```
3. **Replacing `.value`** — breaks reactivity if you replace the entire object
   ```js
   let arr = ref([1, 2, 3])
   arr.value = [4, 5, 6]  // ✅ works
   arr.value.push(7)      // ✅ works
   ```
4. **Ref inside reactive** — auto-unwrapped, no `.value` needed
   ```js
   const count = ref(0)
   const state = reactive({ count })
   console.log(state.count) // 0 (auto-unwrapped)
   state.count = 5          // works
   ```

#### Quick Decision Guide
```typescript
Need to wrap a value reactively?
  └── Primitive (string, number, boolean) → ref(value)
       └── Need to write back via custom logic?
            └── Yes → ref({ get, set })
            └── No → ref(value)
  └── Object/Array → ref(obj) (or reactive(obj) if no .value needed)
```

---

### readonly

`readonly()` creates a **deeply readonly proxy** of a reactive object. Attempts to modify it will throw a warning.

**Core behavior:**
- **Deep readonly** — nested properties are also readonly
- **Original still reactive** — modifications to original work, only proxy is blocked
- **Works with any object** — refs, reactive objects, plain objects
- **No `.value` needed** — like reactive, access properties directly

#### Form 1: Wrap reactive — `readonly(reactive(obj))`

When to use: Preventing mutations from child components while allowing parent modifications.

```js
const state = reactive({ count: 0, nested: { value: 1 } })
const readOnly = readonly(state)

state.count = 5     // ✅ Original is still mutable
readOnly.count = 5  // ❌ Warning: cannot modify readonly
readOnly.nested.value = 5  // ❌ Warning: nested also readonly
```

#### Form 2: Wrap ref — `readonly(ref)`

When to use: Exposing a ref as readonly to prevent external modifications.

```js
const count = ref(0)
const readOnlyCount = readonly(count)

count.value = 5      // ✅ Original still mutable
readOnlyCount.value = 5  // ❌ Warning: cannot modify readonly
```

#### Form 3: Readonly vs shallowReadonly

```js
const state = reactive({ nested: { value: 1 } })

const deep = readonly(state)
deep.nested.value = 5  // ❌ Warning: cannot modify readonly

const shallow = shallowReadonly(state)
shallow.nested.value = 5  // ✅ Works! Only top-level is readonly
shallow.value = 5  // ❌ Warning: cannot modify readonly
```

#### Common Gotchas

1. **Readonly is not frozen** — nested reactive objects remain reactive, just can't be reassigned
   ```js
   const state = reactive({ items: [1, 2, 3] })
   const readOnly = readonly(state)
   
   readOnly.items.push(4)  // ⚠️ Works! Array is still reactive
   readOnly.items = []     // ❌ Warning: cannot modify readonly
   ```
2. **Original vs proxy** — readonly only affects the proxy, original can still change
   ```js
   const state = reactive({ count: 0 })
   const readOnly = readonly(state)
   
   state.count = 10  // ✅ Original changes
   console.log(readOnly.count) // 10 — proxy reflects original change
   ```
3. **Deep nesting** — use `shallowReadonly` if you only want top-level protection
4. **Readonly refs** — when wrapping a ref, access via `.value`

#### Quick Decision Guide
```typescript
Need to PREVENT modifications to state?
  └── Deep protection (nested too)? → readonly(reactive(obj))
  └── Shallow protection (top-level only)? → shallowReadonly(obj)
  └── Just a ref? → readonly(ref)
```

---

### computed

`computed()` creates a **reactive, cached value** derived from other reactive data (refs or reactive objects).

**Core behavior:**
- Returns a **ref-like object** (access value via `.value`)
- **Caches** its result — only recalculates when dependencies change
- **Lazy** — doesn't compute until actually accessed


#### Form 1: Read-only (Getter-only) — `() => value`

When to use: Most common form. Deriving a value from other state.

```js
const count = ref(1)
const doubled = computed(() => count.value * 2)
```

#### Form 2: Writable (Get + Set) — { get, set }

When to use: Two-way binding between computed and underlying sources. Common for:
- v-model bindings
- Syncing with props/emits
- Creating a "virtual" ref that writes to different sources

```js
const fullName = computed({
  get: () => `${first.value} ${last.value}`,
  set: (val) => {
    const [f, l] = val.split(' ')
    first.value = f
    last.value = l
  }
})

fullName.value = 'Jane Doe'  // updates first & last
```

#### Form 3: Two-way derived ref — { get, set } with external Syncing

When to use: Same pattern as Form 2, but the computed acts as a proxy to another ref. Often used to avoid prop/emit chaining or to normalize access to a value.

```js
const localCount = computed({
  get: () => count.value,
  set: (val) => { count.value = val }
})
```

#### Common Gotchas

1. **Don't mutate refs inside getter** — side effects belong in `watch`/`watchEffect`
2. **Computed returning objects** — the object itself is cached, but its contents are reactive
   ```js
   const obj = computed(() => ({ ...someData })) // returns new ref each access
   ```
3. **Writable computed without getter** — not allowed
4. **Async in computed** — not supported (use `watch` instead)

#### Quick Decision Guide
```typescript
Need to DERIVE a value from state?
  └── Yes → computed(() => ...)
       └── Need to WRITE back to those sources?
            └── Yes → computed({ get, set })
            └── No → computed(() => ...)
```
### watch

`watch()` **reactively watches** changes to reactive sources (refs, reactive objects, or getters) and executes a callback when they change.

**Core behavior:**
- **Lazy** — only triggers after the watched value changes (not on initial render)
- **Per-source** — watches specific sources you declare
- **Access to old/new values** — callback receives previous and current values
- **Supports multiple sources** — watch multiple refs or an array of sources
- **Cleanup** — returns a stopper function to remove the watcher

#### Form 1: Single source — `watch(source, callback)`

When to use: Watching a single ref, reactive object property, or getter return value.

```js
const count = ref(0)

// Watch a ref
watch(count, (newVal, oldVal) => {
  console.log(`count changed: ${oldVal} -> ${newVal}`)
})

// Watch a getter
watch(() => count.value * 2, (newVal, oldVal) => {
  console.log(`doubled changed: ${oldVal} -> ${newVal}`)
})

// Watch a reactive object property
const state = reactive({ count: 0 })
watch(() => state.count, (newVal, oldVal) => {
  console.log(`state.count changed: ${oldVal} -> ${newVal}`)
})
```

#### Form 2: Multiple sources — `watch([source1, source2], callback)`

When to use: When you need to react to changes in any of several sources.

```js
const firstName = ref('')
const lastName = ref('')

watch([firstName, lastName], ([newFirst, newLast], [oldFirst, oldLast]) => {
  console.log(`Name changed: ${oldFirst} ${oldLast} -> ${newFirst} ${newLast}`)
}, { immediate: false })
```

#### Form 3: With options — `{ immediate, deep, flush, onTrigger }`

When to use: Fine-tuning watch behavior for specific needs.

```js
const options = {
  immediate: false,     // Run callback immediately on mount (default: false)
  deep: false,        // Deep watch nested properties (default: false)
  flush: 'pre',       // 'pre' | 'post' | 'sync' — when callback runs
  onTrigger: null     // Debugging hook for dependencies
}

// Deep watch a reactive object
const state = reactive({ nested: { count: 0 } })
watch(state, (newVal) => {
  console.log('state changed deeply')
}, { deep: true })

// Immediate watch (runs on mount)
watch(name, (newVal) => {
  fetchUser(newVal)
}, { immediate: true })
```

#### Common Gotchas

1. **Watch vs watchEffect** — `watch` is lazy (doesn't run on mount unless `immediate: true`), `watchEffect` runs immediately and auto-tracks dependencies
2. **Deep watching performance** — `deep: true` can be expensive; consider using computed properties instead
3. **Reactive object vs getter** — watching a reactive object directly only triggers on reference change, not nested changes (unless `deep: true`)
   ```js
   const state = reactive({ count: 0 })
   watch(state, ...)           // Only triggers when state = newObject
   watch(() => state.count, ...) // ✅ Triggers on nested change
   ```
4. **Old value in immediate watch** — `oldVal` is `undefined` on the first call with `immediate: true`
5. **Async watchers** — use `async` callback, but be aware of race conditions (use cancellation tokens or `watchEffect` with `onInvalidate`)

#### Quick Decision Guide
```typescript
Need to REACT to state changes with side effects?
  └── Need OLD and NEW values access? → watch(source, cb)
       └── Multiple sources? → watch([source1, source2], cb)
       └── Run on mount too? → watch(source, cb, { immediate: true })
  └── Don't need old/new values? → watchEffect(cb)
```

---

### watchEffect

`watchEffect()` executes a **side effect immediately** while **automatically tracking its dependencies**. Re-runs whenever any dependency changes.

**Core behavior:**
- **Eager** — runs immediately on mount
- **Auto-tracking** — automatically discovers which reactive data it uses
- **No old/new values** — callback doesn't receive previous values
- **Cleanup** — register cleanup logic via `onInvalidate` callback

#### Form 1: Basic usage — `watchEffect(() => { ... })`

When to use: Most common form. Running side effects that depend on reactive state.

```js
const count = ref(0)
const name = ref('John')

watchEffect(() => {
  console.log(`Count is: ${count.value}, Name is: ${name.value}`)
})
// Runs immediately, then again whenever count or name changes
```

#### Form 2: With cleanup — `watchEffect(async (onInvalidate) => { ... })`

When to use: When the effect initiates async operations that need cancellation/cleanup.

```js
const userId = ref(1)

watchEffect(async (onInvalidate) => {
  const controller = new AbortController()
  
  onInvalidate(() => controller.abort())  // Cleanup on stop or re-run
  
  const response = await fetch(`/api/user/${userId.value}`, {
    signal: controller.signal
  })
  const user = await response.json()
  console.log(user)
})
```

#### Form 3: Flushed timing — `{ flush: 'pre' | 'post' | 'sync' }`

When to use: Controlling when the effect runs relative to component updates.

```js
// 'pre' (default): runs before DOM update
watchEffect(() => {
  console.log(count.value)  // runs before re-render
}, { flush: 'pre' })

// 'post': runs after DOM update
watchEffect(() => {
  console.log(document.querySelector('div').textContent)  // safe to access DOM
}, { flush: 'post' })

// 'sync': runs synchronously on every dependency change
watchEffect(() => {
  console.log(count.value)  // runs immediately
}, { flush: 'sync' })
```

#### Common Gotchas

1. **No old value access** — if you need previous values, use `watch()`
2. **Auto-tracking scope** — only tracks dependencies accessed synchronously during execution
   ```js
   watchEffect(() => {
     setTimeout(() => {
       console.log(count.value)  // ⚠️ NOT tracked!
     }, 1000)
   })
   ```
3. **Conditional access** — dependencies inside conditional branches may not track correctly
4. **Mutations vs reassignments** — watching computed properties that derive from the same source may behave unexpectedly
5. **Stop function** — call the returned function to stop watching
   ```js
   const stop = watchEffect(() => console.log(count.value))
   stop()  // stops the watcher
   ```

#### Quick Decision Guide
```typescript
Need to RUN side effects when dependencies change?
  └── Need OLD and NEW values? → watch(source, cb)
  └── Don't need old/new values? → watchEffect(cb)
       └── Need cleanup for async ops? → watchEffect(async (onInvalidate) => {})
       └── Need specific timing? → watchEffect(cb, { flush: 'post' })
```

---

### effect (Advanced)

`effect()` is a **low-level reactivity primitive** that runs a side effect function **synchronously** whenever its dependencies change. It's the building block that powers `watchEffect` internally.

**Core behavior:**
- **Low-level** — rarely used directly in application code
- **Synchronous** — runs immediately on dependency change
- **Global tracking** — uses Vue's internal dependency tracking system
- **Does not auto-stop** — must be manually stopped with the returned function

#### Form 1: Basic effect — `effect(() => { ... })`

When to use: Low-level reactivity work, Vue internals, or libraries.

```js
import { effect, ref } from 'vue'

const count = ref(0)

const stop = effect(() => {
  console.log('Effect triggered:', count.value)
})

count.value = 1  // logs: "Effect triggered: 1"
count.value = 2  // logs: "Effect triggered: 2"

stop()  // stop the effect
```

#### Form 2: Effect with scheduler — `effect(() => {}, { scheduler })`

When to use: Fine-grained control over when the effect runs.

```js
import { effect, ref } from 'vue'

const count = ref(0)

effect(() => {
  console.log('Count:', count.value)
}, {
  scheduler: (job) => {
    // Runs instead of the effect when count changes
    console.log('Scheduled:', count.value)
  }
})

count.value = 1  // logs: "Scheduled: 1" (not the effect itself)
```

#### Common Gotchas

1. **Prefer `watch` / `watchEffect`** — `effect()` is a low-level API; most application code should use `watch` or `watchEffect`
2. **No automatic cleanup** — always store and call the `stop` function
3. **Debugging only** — `onTrack` / `onTrigger` options are useful for debugging dependency tracking
   ```js
   effect(() => {
     console.log(count.value)
   }, {
     onTrack: (event) => console.log('Tracking:', event),
     onTrigger: (event) => console.log('Triggering:', event)
   })
   ```
4. **Nested effects** — nested `effect()` calls are supported but can cause infinite loops if effects trigger each other

#### Quick Decision Guide
```typescript
Building a LIBRARY or working with Vue INTERNALS?
  └── Yes → effect(() => ...)
  └── No → Use watch() or watchEffect() instead
```

---

### watchPostEffect

`watchPostEffect()` is a **syntactic sugar** for `watchEffect()` with `{ flush: 'post' }`. It runs the effect **after** the component's DOM updates.

**Core behavior:**
- **Alias for** `watchEffect(() => {}, { flush: 'post' })`
- **Runs after DOM update** — safe to access DOM elements
- **Eager** — runs immediately on mount and re-runs on dependency changes

#### When to use: DOM access after state change

```js
const count = ref(0)

// ✅ Safe: access DOM after update
watchPostEffect(() => {
  console.log(document.querySelector('.count')?.textContent)  // DOM is updated
})

count.value++  // Effect runs AFTER DOM updates
```

**Comparison with other flush options:**
| API | Flush | Use case |
|-----|-------|----------|
| `watchEffect()` | `'pre'` (default) | Most cases, before DOM update |
| `watchPostEffect()` | `'post'` | Need DOM access after update |
| `watchSyncEffect()` | `'sync'` | Need immediate synchronous response |

---

### watchSyncEffect

`watchSyncEffect()` is a **syntactic sugar** for `watchEffect()` with `{ flush: 'sync' }`. It runs the effect **synchronously** on every dependency change.

**Core behavior:**
- **Alias for** `watchEffect(() => {}, { flush: 'sync' })`
- **Synchronous** — runs immediately when dependencies change
- **No batching** — unlike `watchPostEffect` or default `watchEffect`
- **Eager** — runs immediately on mount

#### When to use: Immediate synchronous updates

```js
const count = ref(0)

// ⚠️ Use sparingly — runs synchronously on EVERY change
watchSyncEffect(() => {
  console.log('Sync:', count.value)
})

count.value++  // logs immediately
count.value++  // logs immediately (no batching)
```

**Warning:** Can cause performance issues if the effect is expensive. Prefer `watchEffect()` or `watchPostEffect()` unless you specifically need synchronous behavior.

---

### onWatcherCleanup

`onWatcherCleanup()` registers a **cleanup function** that's called when the watcher is invalidated (stopped or re-run). It's the modern replacement for the `onInvalidate` callback in `watchEffect`.

**Core behavior:**
- **Called on cleanup** — when watcher stops or runs again
- **Works with `watch()` and `watchEffect()`** — register cleanup inside the callback
- **Can be called multiple times** — register multiple cleanup handlers

#### Form 1: With watchEffect — `onWatcherCleanup(cleanupFn)`

```js
const userId = ref(1)

watchEffect(() => {
  const controller = new AbortController()
  
  onWatcherCleanup(() => controller.abort())
  
  fetch(`/api/user/${userId.value}`, { signal: controller.signal })
    .then(res => res.json())
    .then(data => console.log(data))
})

// When userId changes or watcher stops, controller.abort() is called
```

#### Form 2: With watch — `onWatcherCleanup(cleanupFn)`

```js
const searchQuery = ref('')

watch(searchQuery, async (query) => {
  const controller = new AbortController()
  
  onWatcherCleanup(() => controller.abort())
  
  if (!query) return
  
  const results = await fetch(`/api/search?q=${query}`, {
    signal: controller.signal
  }).then(res => res.json())
  
  console.log(results)
}, { immediate: true })

// When searchQuery changes, previous fetch is cancelled
```

#### Common Gotchas

1. **Must be called synchronously** — inside the watcher callback, not in async handlers
   ```js
   // ❌ Wrong
   watch(count, async (val) => {
     onWatcherCleanup(() => cleanup())  // Cannot be called here
   })
   
   // ✅ Correct
   watch(count, (val) => {
     const controller = new AbortController()
     onWatcherCleanup(() => controller.abort())
     // Now safe to do async work
   })
   ```
2. **Old pattern vs new** — `onInvalidate` (callback param) vs `onWatcherCleanup` (registered function)
   ```js
   // Old way (still works)
   watchEffect(async (onInvalidate) => {
     onInvalidate(() => cleanup())
   })
   
   // New way (cleaner)
   watchEffect(() => {
     onWatcherCleanup(() => cleanup())
   })
