---
title: Linux Filesystem Basics
date: 2026-04-06
tags: [Linux, Filesystem]
---

## Linux Filesystem Basics

### What is the Filesystem?

The Linux filesystem is how the OS organizes files, directories, permissions, and storage.

**Core responsibilities:**
- store file contents
- keep metadata like permissions and timestamps
- map file paths to underlying data
- cache reads and writes for speed

### Path Structure

Linux uses one tree rooted at `/`.

```text
/
  home/
  etc/
  var/
  usr/
  tmp/
```

### File vs Directory

- **File**: a sequence of bytes
- **Directory**: a map from name to file metadata

### Inode

An inode stores metadata about a file.

**Includes:**
- owner
- permissions
- size
- timestamps
- data location

#### Node.js example: read file metadata

```js
import fs from 'node:fs/promises'

const stat = await fs.stat('./package.json')
console.log({
  size: stat.size,
  isFile: stat.isFile(),
  isDirectory: stat.isDirectory(),
  mtime: stat.mtime
})
```

### Common Directories

| Path | Purpose |
|------|---------|
| `/home` | user files |
| `/etc` | config files |
| `/var` | logs and data |
| `/tmp` | temporary files |
| `/proc` | process and kernel info |
| `/dev` | device files |

### Read and Write Files

#### Form 1: Small file read

```js
import fs from 'node:fs/promises'

const text = await fs.readFile('./notes.txt', 'utf8')
console.log(text)
```

#### Form 2: Write file

```js
await fs.writeFile('./output.txt', 'hello\n')
```

#### Form 3: Append file

```js
await fs.appendFile('./output.txt', 'more\n')
```

### Streams

Use streams for large files.

```js
import fs from 'node:fs'

const stream = fs.createReadStream('./big.log', { encoding: 'utf8' })

stream.on('data', (chunk) => {
  process.stdout.write(chunk)
})
```

### Links

- **Hard link**: another name for the same inode
- **Symlink**: a path that points to another path

```bash
ln file.txt hardlink.txt
ln -s file.txt symlink.txt
```

### Permissions

Linux permissions use read, write, execute.

```bash
ls -l
chmod 644 file.txt
chmod +x script.sh
```

### Mounting

Mounting attaches a filesystem to a directory.

```bash
mount
df -h
```

### Cache

Linux caches file data in memory.

**Effect:** second reads are often faster.

### Common Commands

```bash
pwd
ls -la
find . -name "*.js"
du -sh .
df -h
```

### Common Gotchas

1. **File name is not the data** - a file name points to an inode
2. **Large files should use streams** - avoid loading everything into memory
3. **Permissions errors are usually ownership or mode issues**
4. **Deleted file may still exist** - if another hard link still points to it

#### Quick Decision Guide
```typescript
Need to inspect file info? → stat
Need to read small file? → readFile
Need to handle big file? → stream
Need to change permissions? → chmod
Need to understand path lookup? → inode + directory
```

---

## Storage and Devices

### Block Device

A block device reads and writes data in chunks.

### Mount Point

A mount point is the directory where a filesystem becomes available.

### Common Gotchas

1. **Disk full vs inode full** - both can stop writes
2. **Path permissions and disk permissions are different issues**
3. **Symlink loops can confuse tools**

---

## One-line summary

The Linux filesystem is a tree of paths over inodes, permissions, and cached disk data, and Node.js filesystem APIs map cleanly onto that model.
