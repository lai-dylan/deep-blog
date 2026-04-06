---
title: File System and Streams
date: 2026-04-06
tags: [JavaScript]
---

## File System and Streams

### File System (fs)

#### Form 1: Promises API

```js
import { readFile, writeFile, appendFile, unlink } from 'fs/promises'

// Read file
const data = await readFile('file.txt', 'utf8')

// Write file
await writeFile('output.txt', 'Hello World')

// Append to file
await appendFile('log.txt', 'New entry\n')

// Delete file
await unlink('old.txt')

// Check if exists
import { access } from 'fs/promises'
try {
  await access('file.txt')
  console.log('File exists')
} catch {
  console.log('File not found')
}
```

#### Form 2: Synchronous (Avoid in production)

```js
import { readFileSync, writeFileSync } from 'fs'

const data = readFileSync('file.txt', 'utf8')
writeFileSync('output.txt', 'Hello')
```

#### Form 3: Watch Files

```js
import { watch } from 'fs'

const watcher = watch('file.txt', (eventType, filename) => {
  console.log(`File ${filename} changed: ${eventType}`)
})

// Stop watching
watcher.close()
```

### Streams

Streams handle data in chunks, ideal for large files.

#### Form 1: Readable Streams

```js
import { createReadStream } from 'fs'

const stream = createReadStream('large.txt', {
  encoding: 'utf8',
  highWaterMark: 1024 // 1KB chunks
})

stream.on('data', (chunk) => {
  console.log('Received chunk:', chunk.length)
})

stream.on('end', () => {
  console.log('Finished reading')
})

stream.on('error', (err) => {
  console.error('Error:', err)
})
```

#### Form 2: Writable Streams

```js
import { createWriteStream } from 'fs'

const stream = createWriteStream('output.txt')

stream.write('Hello ')
stream.write('World\n')
stream.end('Done!')
```

#### Form 3: Piping

```js
import { createReadStream, createWriteStream } from 'fs'
import { createGzip } from 'zlib'

// Copy file
const source = createReadStream('input.txt')
const destination = createWriteStream('output.txt')

source.pipe(destination)

// Compress
const gzip = createGzip()
createReadStream('input.txt')
  .pipe(gzip)
  .pipe(createWriteStream('input.txt.gz'))
```

#### Form 4: Pipeline (Modern)

```js
import { pipeline } from 'stream/promises'
import { createReadStream, createWriteStream } from 'fs'
import { createGzip } from 'zlib'

await pipeline(
  createReadStream('input.txt'),
  createGzip(),
  createWriteStream('input.txt.gz')
)
```

### Common Gotchas

1. **Always handle stream errors**
   ```js
   stream.on('error', handleError)
   // Or use pipeline which handles errors
   ```

2. **Backpressure**
   ```js
   // When write can't keep up with read
   const canContinue = stream.write(chunk)
   if (!canContinue) {
     stream.once('drain', () => {
       // Safe to write more
     })
   }
   ```

3. **Memory usage**
   ```js
   // ❌ Loads entire file into memory
   const data = await readFile('huge.txt')
   
   // ✅ Processes in chunks
   const stream = createReadStream('huge.txt')
   ```

#### Quick Decision Guide
```typescript
File size?
  └── Small (< few MB)? → readFile/writeFile
  └── Large? → Streams

Processing?
  └── Simple copy? → pipe/pipeline
  └── Transform data? → Transform streams
  └── Multiple operations? → pipeline with async
```
