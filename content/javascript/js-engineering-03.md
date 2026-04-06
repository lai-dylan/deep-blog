---
title: Build Tools
date: 2026-04-06
tags: [JavaScript]
---

## Build Tools

### Why Build Tools?

- Bundle modules for browsers
- Transpile modern JS for older browsers
- Optimize and minify code
- Handle CSS, images, and assets
- Enable hot module replacement (HMR)

### Package Managers

#### npm (Node Package Manager)

```bash
# Initialize project
npm init -y

# Install dependencies
npm install react react-dom

# Install dev dependencies
npm install --save-dev webpack webpack-cli

# Install globally
npm install -g typescript

# Scripts (package.json)
{
  "scripts": {
    "build": "webpack",
    "dev": "webpack-dev-server",
    "test": "jest"
  }
}

# Run scripts
npm run build
npm run dev
```

#### pnpm (Faster, disk space efficient)

```bash
pnpm install
pnpm add react
pnpm add -D webpack
```

### Webpack

Module bundler for JavaScript applications.

```js
// webpack.config.js
const path = require('path')

module.exports = {
  entry: './src/index.js',
  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    })
  ],
  
  devServer: {
    port: 3000,
    hot: true
  }
}
```

### Vite (Modern Alternative)

Fast, opinionated build tool.

```bash
# Create project
npm create vite@latest my-app

# Templates: vanilla, vanilla-ts, vue, react, react-ts, etc.
npm create vite@latest my-react-app -- --template react-ts
```

```js
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  build: {
    outDir: 'dist'
  }
})
```

### Babel

Transpile modern JavaScript for older browsers.

```js
// babel.config.js
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: '> 0.25%, not dead' }],
    '@babel/preset-react',
    '@babel/preset-typescript'
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties'
  ]
}
```

### ESLint and Prettier

```js
// .eslintrc.js
module.exports = {
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  parser: '@typescript-eslint/parser',
  rules: {
    'no-console': 'warn',
    'semi': ['error', 'never']
  }
}

// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "es5"
}
```

### Monorepo Tools

#### npm workspaces

```json
// package.json
{
  "workspaces": ["packages/*"]
}

// packages/app/package.json
{
  "name": "@myorg/app",
  "dependencies": {
    "@myorg/utils": "*"
  }
}
```

#### Turborepo

```json
// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["build"]
    }
  }
}
```

### Common Gotchas

1. **Tree shaking requires ESM**
   ```js
   // Use ES modules for better tree shaking
   export { add } from './math'
   ```

2. **Polyfills increase bundle size**
   ```js
   // Only polyfill what's needed
   import 'core-js/es/promise'
   ```

3. **Source maps in production**
   ```js
   // Don't expose source maps in production
   devtool: process.env.NODE_ENV === 'production' ? false : 'source-map'
   ```

#### Quick Decision Guide
```typescript
Build tool?
  └── Modern project? → Vite (fast, simple)
  └── Complex needs? → Webpack (flexible)
  └── Library? → Rollup (tree-shaking)
  └── Zero config? → Parcel

Monorepo?
  └── Small project? → npm/yarn workspaces
  └── Large project? → Turborepo / Nx

Linting?
  └── ESLint + Prettier (standard)
```
