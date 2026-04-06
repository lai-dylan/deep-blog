---
title: TypeScript Basics
date: 2026-04-06
tags: [JavaScript]
---

## TypeScript Basics

### Why TypeScript?

**TypeScript** adds static typing to JavaScript, catching errors at compile time.

**Benefits:**
- Catch errors early
- Better IDE support
- Self-documenting code
- Easier refactoring

### Basic Types

```ts
// Primitive types
let name: string = 'John'
let age: number = 30
let isActive: boolean = true
let nothing: null = null
let notDefined: undefined = undefined

// Any (avoid when possible)
let anything: any = 'could be anything'

// Unknown (safer than any)
let unknownValue: unknown = fetchData()
if (typeof unknownValue === 'string') {
  console.log(unknownValue.toUpperCase())
}

// Void (no return value)
function logMessage(msg: string): void {
  console.log(msg)
}

// Never (never returns)
function throwError(msg: string): never {
  throw new Error(msg)
}
```

### Interfaces and Types

```ts
// Interface
interface User {
  name: string
  age: number
  email?: string // Optional
  readonly id: number // Read-only
}

// Type alias
type Point = {
  x: number
  y: number
}

// Difference: interface can be extended
interface Admin extends User {
  role: 'admin'
}

// Type can use unions
type Status = 'pending' | 'approved' | 'rejected'
```

### Functions

```ts
// Function signature
function add(a: number, b: number): number {
  return a + b
}

// Arrow function
const multiply = (a: number, b: number): number => a * b

// Optional and default parameters
function greet(name: string, greeting: string = 'Hello'): string {
  return `${greeting}, ${name}!`
}

// Rest parameters
function sum(...numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0)
}
```

### Generics

```ts
// Generic function
function identity<T>(arg: T): T {
  return arg
}

// Usage
identity<string>('hello')
identity<number>(42)

// Generic with constraint
function logLength<T extends { length: number }>(arg: T): T {
  console.log(arg.length)
  return arg
}

// Generic interface
interface ApiResponse<T> {
  data: T
  status: number
}

const userResponse: ApiResponse<User> = {
  data: { name: 'John', age: 30, id: 1 },
  status: 200
}
```

### Classes

```ts
class Animal {
  protected name: string
  
  constructor(name: string) {
    this.name = name
  }
  
  move(distance: number): void {
    console.log(`${this.name} moved ${distance}m`)
  }
}

class Dog extends Animal {
  bark(): void {
    console.log(`${this.name} says woof!`)
  }
}
```

### React with TypeScript

```tsx
interface Props {
  title: string
  count?: number
  onClick: (id: number) => void
}

const Button: React.FC<Props> = ({ title, count = 0, onClick }) => {
  return <button onClick={() => onClick(1)}>{title} ({count})</button>
}
```

### Vue with TypeScript

```vue
<script setup lang="ts">
interface User {
  name: string
  age: number
}

const props = defineProps<{
  user: User
}>()

const emit = defineEmits<{
  update: [user: User]
}>()
</script>
```

### Common Gotchas

1. **Type assertions**
   ```ts
   const input = document.getElementById('input') as HTMLInputElement
   ```

2. **Strict mode**
   ```json
   // tsconfig.json
   {
     "compilerOptions": {
       "strict": true
     }
   }
   ```

3. **Declaration files**
   ```ts
   // types.d.ts
   declare module 'some-library' {
     export function doSomething(): void
   }
   ```

#### Quick Decision Guide
```typescript
New project?
  └── Team > 1 person? → Use TypeScript
  └── Library/package? → Use TypeScript
  └── Quick prototype? → JavaScript

Type vs Interface?
  └── Object shape? → Interface (preferred)
  └── Union types? → Type
  └── Need to extend? → Interface
```
