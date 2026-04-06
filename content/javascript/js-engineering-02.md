---
title: Testing
date: 2026-04-06
tags: [JavaScript]
---

## Testing

### Why Test?

- Catch bugs early
- Prevent regressions
- Document expected behavior
- Enable confident refactoring

### Test Types

| Type | Scope | Speed |
|------|-------|-------|
| Unit | Single function/component | Fast |
| Integration | Multiple units together | Medium |
| E2E | Full application flow | Slow |

### Jest Basics

```js
// math.js
export const add = (a, b) => a + b

// math.test.js
import { add } from './math'

describe('add', () => {
  test('adds two positive numbers', () => {
    expect(add(1, 2)).toBe(3)
  })
  
  test('adds negative numbers', () => {
    expect(add(-1, -2)).toBe(-3)
  })
})
```

### Common Matchers

```js
// Equality
expect(value).toBe(exact) // ===
expect(value).toEqual(object) // Deep equality

// Truthiness
expect(value).toBeTruthy()
expect(value).toBeFalsy()
expect(value).toBeNull()

// Numbers
expect(value).toBeGreaterThan(10)
expect(value).toBeCloseTo(0.3, 5) // Precision

// Strings
expect(str).toMatch(/pattern/)
expect(str).toContain('substring')

// Arrays
expect(arr).toContain(item)
expect(arr).toHaveLength(3)

// Functions
expect(fn).toThrow()
expect(fn).toThrow('specific error')
```

### Async Testing

```js
test('fetches user', async () => {
  const user = await fetchUser(1)
  expect(user).toHaveProperty('name')
})

test('fails on invalid id', async () => {
  await expect(fetchUser(-1)).rejects.toThrow('Invalid ID')
})
```

### Mocking

```js
// Mock function
const mockFn = jest.fn()
mockFn.mockReturnValue('mocked')
mockFn.mockResolvedValue({ data: [] })

// Mock module
jest.mock('./api', () => ({
  fetchUser: jest.fn().mockResolvedValue({ id: 1 })
}))

// Spy on method
const spy = jest.spyOn(console, 'log')
expect(spy).toHaveBeenCalledWith('message')
spy.mockRestore()
```

### Testing React Components

```jsx
import { render, screen, fireEvent } from '@testing-library/react'
import Button from './Button'

test('button click', () => {
  const handleClick = jest.fn()
  render(<Button onClick={handleClick}>Click me</Button>)
  
  fireEvent.click(screen.getByText('Click me'))
  expect(handleClick).toHaveBeenCalledTimes(1)
})
```

### Testing Vue Components

```js
import { mount } from '@vue/test-utils'
import Counter from './Counter.vue'

test('increments counter', async () => {
  const wrapper = mount(Counter)
  
  await wrapper.find('button').trigger('click')
  
  expect(wrapper.text()).toContain('1')
})
```

### Best Practices

```js
// AAA Pattern
 test('validates user input', () => {
   // Arrange
   const validator = new Validator()
   const input = { email: 'invalid' }
   
   // Act
   const result = validator.validate(input)
   
   // Assert
   expect(result.isValid).toBe(false)
 })
```

### Common Gotchas

1. **Test isolation**
   ```js
   beforeEach(() => {
     // Reset state before each test
   })
   ```

2. **Async timeouts**
   ```js
   test('slow operation', async () => {
     // ...
   }, 10000) // 10 second timeout
   ```

#### Quick Decision Guide
```typescript
What to test?
  └── Pure functions? → Unit tests
  └── API integration? → Integration tests
  └── User workflows? → E2E tests

Testing strategy?
  └── TDD? → Write test first
  └── Existing code? → Add tests for bugs first
  └── Coverage goal? → 80% is good target
```
