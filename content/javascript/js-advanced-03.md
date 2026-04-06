---
title: Security
date: 2026-04-06
tags: [JavaScript]
---

## Security

### XSS (Cross-Site Scripting)

Injecting malicious scripts into web pages.

#### Types:
- **Stored XSS**: Malicious script stored on server
- **Reflected XSS**: Script in URL/parameters
- **DOM-based XSS**: Client-side JavaScript manipulation

#### Prevention:

```js
// ❌ Never insert untrusted HTML
element.innerHTML = userInput

// ✅ Use textContent (escapes HTML)
element.textContent = userInput

// ✅ Sanitize HTML
import DOMPurify from 'dompurify'
element.innerHTML = DOMPurify.sanitize(userInput)

// ✅ Template literals with React/Vue
// Automatically escaped
function Component({ userInput }) {
  return <div>{userInput}</div> // Safe
}
```

### CSP (Content Security Policy)

Restrict resource loading to prevent XSS.

```http
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' cdn.example.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' api.example.com;
```

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self'">
```

### CSRF (Cross-Site Request Forgery)

Unauthorized actions on authenticated sessions.

#### Prevention:

```js
// CSRF Token
const csrfToken = generateToken()

fetch('/api/transfer', {
  method: 'POST',
  headers: {
    'X-CSRF-Token': csrfToken
  },
  credentials: 'same-origin'
})

// SameSite cookies
Set-Cookie: session=abc123; SameSite=Strict
```

### Secure Coding Practices

#### Form 1: Input Validation

```js
// ✅ Validate all input
function createUser(input) {
  if (!input.name || typeof input.name !== 'string') {
    throw new Error('Invalid name')
  }
  
  if (input.name.length > 100) {
    throw new Error('Name too long')
  }
  
  // Sanitize
  const sanitized = {
    name: input.name.trim(),
    email: input.email?.toLowerCase().trim()
  }
  
  return sanitized
}
```

#### Form 2: Secrets Management

```js
// ❌ Never commit secrets
const API_KEY = 'sk-1234567890abcdef'

// ✅ Use environment variables
const API_KEY = process.env.API_KEY

// .env file (gitignored)
API_KEY=sk-1234567890abcdef

// Load with dotenv
import 'dotenv/config'
```

#### Form 3: Dependency Security

```bash
# Audit dependencies
npm audit

# Fix automatically
npm audit fix

# Update packages
npm update

# Check for known vulnerabilities
npx audit-ci
```

### HTTPS Everywhere

```js
// Redirect HTTP to HTTPS (Express)
app.use((req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(`https://${req.headers.host}${req.url}`)
  }
  next()
})

// HSTS header
res.setHeader('Strict-Transport-Security', 
  'max-age=31536000; includeSubDomains')
```

### Common Gotchas

1. **eval() is dangerous**
   ```js
   // ❌ Never use eval with user input
   eval(userInput)
   
   // ❌ Function constructor same issue
   new Function(userInput)()
   
   // ✅ Use JSON.parse for JSON
   const data = JSON.parse(userInput)
   ```

2. **InnerHTML with user data**
   ```js
   // Even attribute values can be dangerous
   element.innerHTML = `<img src="${userUrl}">`
   // User can inject: x" onerror="alert('xss')
   ```

3. **Prototype pollution**
   ```js
   // Prevent in Object creation
   const obj = Object.create(null)
   // No prototype chain, safe from pollution
   ```

#### Quick Decision Guide
```typescript
User input?
  └── Always validate
  └── Never trust
  └── Escape when displaying
  └── Sanitize if HTML needed

Dependencies?
  └── Regular audit (npm audit)
  └── Minimal dependencies
  └── Check for maintenance

Headers?
  └── Content-Security-Policy
  └── X-Frame-Options
  └── Strict-Transport-Security
  └── X-Content-Type-Options
```
