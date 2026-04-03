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

### effect