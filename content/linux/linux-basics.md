---
title: Linux Basics
date: 2026-04-03
tags: [Linux]
---

## Linux Basics

### Linux

`Linux` is a free and open-source Unix-like operating system. It powers most web servers, cloud infrastructure, and Docker containers. As a frontend engineer, you'll often deploy to Linux servers, work with Docker containers (which run Linux), and SSH into cloud VMs.

### Linux Filesystem

The Linux filesystem is organized as a tree starting from `/` (root).

#### Key Directories

| Path | Purpose |
|------|---------|
| `/home` | User home directories |
| `/root` | Root user home directory |
| `/etc` | System configuration files |
| `/var` | Variable data (logs, caches) |
| `/usr` | User programs and libraries |
| `/tmp` | Temporary files |
| `/dev` | Device files |
| `/proc` | Process and kernel info |

#### Paths

- **Absolute path**: Starts from root, e.g., `/home/user/projects`
- **Relative path**: Relative to current directory, e.g., `./src` or `../files`

---

## File Operations

### ls — List Files

List files and directories.

```bash
ls                    # Basic listing
ls -la                # Long format with hidden files
ls -lh                # Human-readable sizes
ls -lt                # Sort by modification time
```

**When to use:** Check what files exist in a directory.

---

### cd — Change Directory

Change your current working directory.

```bash
cd /home/user/projects
cd ..                 # Go up one level
cd ~                  # Go to home directory
cd -                  # Go to previous directory
```

**When to use:** Navigate between directories.

---

### pwd — Print Working Directory

Show your current directory path.

```bash
pwd
# /home/user/projects/my-blog
```

**When to use:** When you're lost and need to know where you are.

---

### mkdir — Make Directory

Create a new directory.

```bash
mkdir my-project
mkdir -p src/components/utils  # Create nested directories
```

**When to use:** Create new project folders or organize files.

---

### rm — Remove Files/Directories

Delete files or directories.

```bash
rm file.txt
rm -r my-folder        # Remove directory and contents
rm -rf node_modules    # Force remove (no confirmation)
```

**When to use:** Delete files you no longer need. Be careful with `rm -rf`!

---

### cp — Copy Files

Copy files or directories.

```bash
cp file.txt backup.txt
cp -r src src-backup   # Copy directory recursively
```

**When to use:** Create backups or duplicate files.

---

### mv — Move/Rename Files

Move or rename files and directories.

```bash
mv oldname.txt newname.txt   # Rename
mv file.txt /path/to/dir/     # Move to directory
```

**When to use:** Organize files or rename them.

---

### touch — Create Empty File

Create an empty file or update timestamp.

```bash
touch index.html
touch README.md
```

**When to use:** Create placeholder files or empty log files.

---

### find — Find Files

Search for files by name, size, type, etc.

```bash
find . -name "*.js"           # Find all .js files
find /home -type d -name "node_modules"  # Find node_modules directories
find . -size +10M              # Files larger than 10MB
find . -mtime -7               # Files modified in last 7 days
```

**When to use:** Locate specific files in large directories, find large files.

---

### tar — Archive Files

Create/extract tar archives.

```bash
tar -czvf archive.tar.gz folder/    # Create gzip archive
tar -xzvf archive.tar.gz             # Extract archive
tar -tf archive.tar.gz               # List contents
```

**When to use:** Bundle files for deployment, extract npm packages, create backups.

---

### ln — Create Links

Create symbolic or hard links.

```bash
ln -s /path/to/file link-name       # Create symlink
ln -s $(which node) /usr/local/bin/node  # Link node binary
```

**When to use:** Create shortcuts, fix path issues, share files across locations.

---

## Viewing & Reading Files

### cat — Display File Contents

Show entire file content.

```bash
cat package.json
cat /etc/passwd
```

**When to use:** Quickly view small files.

---

### head — View First Lines

Show first lines of a file.

```bash
head -n 10 file.txt    # First 10 lines
head package.json       # Default 10 lines
```

**When to use:** Preview the start of a file.

---

### tail — View Last Lines

Show last lines of a file.

```bash
tail -n 20 error.log    # Last 20 lines
tail -f server.log      # Follow (watch) new lines
```

**When to use:** View logs, especially with `-f` to watch live output.

---

### grep — Search Within Files

Search for patterns in files.

```bash
grep "function" src/App.tsx
grep -r "TODO" src/     # Recursive search
grep -i "error" log.txt  # Case insensitive
grep -n "import" main.js # Show line numbers
```

**When to use:** Find code patterns, search in files, filter output.

---

### less — Paginated Viewing

View file content one screen at a time.

```bash
less /var/log/syslog
# Arrow keys to navigate, q to quit
```

**When to use:** View large files without loading everything into memory.

---

### wc — Word/Line Count

Count lines, words, and characters.

```bash
wc -l file.txt    # Count lines only
wc file.txt       # Lines, words, characters
```

**When to use:** Count lines of code or entries in a file.

---

## Permissions

Linux uses a permission model with three types:
- **r** (read) - 4
- **w** (write) - 2
- **x** (execute) - 1

Examples: `755` (rwxr-xr-x), `644` (rw-r--r--), `600` (rw-------)

### chmod — Change Permissions

Modify file permissions.

```bash
chmod 755 script.sh        # Full access for owner, read for others
chmod +x script.sh          # Add execute permission
chmod -R 644 public/        # Recursive: set all files to 644
```

**When to use:** Make scripts executable, restrict file access.

---

### chown — Change Ownership

Change file owner and group.

```bash
chown user:group file.txt
chown -R www-data:www-data /var/www
```

**When to use:** Fix ownership after creating files as root, set web server access.

---

### sudo — Superuser Privileges

Execute commands as superuser.

```bash
sudo apt install nginx      # Install package
sudo rm -rf /temp/bad-dir   # Remove protected directory
sudo nano /etc/nginx/nginx.conf
```

**When to use:** System administration tasks requiring root access.

---

## Process & Network

### ps — View Processes

List running processes.

```bash
ps aux                 # All processes with details
ps aux | grep node     # Find specific process
```

**When to use:** Check if a process is running.

---

### top — Task Manager

Interactive process viewer.

```bash
top                    # Interactive display
htop                   # Enhanced version (if installed)
```

**When to use:** Monitor CPU and memory usage.

---

### kill — Stop Processes

Terminate a process by ID.

```bash
kill 1234              # Graceful termination
kill -9 1234           # Force kill
pkill -f "node server"  # Kill by name
```

**When to use:** Stop a frozen process or kill a specific program.

---

### curl — HTTP Requests

Make HTTP requests.

```bash
curl https://api.example.com
curl -X POST -d "name=test" https://api.example.com
curl -H "Authorization: Bearer token" https://api.example.com
curl -o file.zip https://example.com/file.zip
```

**When to use:** Test APIs, download files, debug HTTP issues.

---

### wget — Download Files

Download files from the web.

```bash
wget https://example.com/file.zip
wget -r https://example.com/  # Recursive download
```

**When to use:** Download files, mirror websites.

---

### ssh — Remote Access

Connect to remote servers securely.

```bash
ssh user@192.168.1.100
ssh -i key.pem user@server.com
ssh user@server.com "ls -la"   # Run command remotely
```

**When to use:** Access remote servers, manage cloud VMs, deploy code.

---

### scp — Secure Copy

Copy files over SSH.

```bash
scp local.txt user@server:/remote/path/
scp -r ./dist user@server:/var/www/
```

**When to use:** Transfer files to/from remote servers.

---

### ping — Test Connectivity

Test network connection.

```bash
ping google.com
ping -c 4 192.168.1.1
```

**When to use:** Check if a server is reachable.

---

### lsof — List Open Files

List files opened by processes (including network ports).

```bash
lsof -i :3000          # What's using port 3000?
lsof -i TCP:8080       # TCP port 8080
lsof -t -i:3000        # Just the PID
```

**When to use:** Find which process is blocking a port, debugging "port already in use" errors.

---

## Environment Variables

Environment variables store configuration that programs can access. Essential for:
- API keys, secrets
- Configuration (NODE_ENV, PORT)
- PATH (where executables are found)

### View & Set Variables

```bash
echo $PATH             # View a variable
printenv               # View all variables
env                    # Another way to view all
```

### Set Variables

```bash
export NODE_ENV=production
export API_KEY="sk-abc123"
echo $NODE_ENV         # production
```

**Important:** `export` makes variables available to child processes. Without it, it's just a shell variable.

### PATH Variable

The `PATH` variable tells the shell where to find executables.

```bash
echo $PATH             # /usr/local/bin:/usr/bin:/bin
cd /usr/local/bin && ls -la  # See what's there
which node             # Where is node installed?
whereis npm            # Find npm location
```

**Add to PATH:**
```bash
export PATH="$HOME/.npm-global/bin:$PATH"
```

### Common Environment Variables

| Variable | Purpose |
|----------|---------|
| `HOME` | Your home directory |
| `USER` | Current username |
| `SHELL` | Current shell |
| `PATH` | Directories to search for commands |
| `PWD` | Current directory |
| `NODE_ENV` | Node.js environment (development/production) |
| `PORT` | Server port |

### Permanent Variables

Add to shell config to persist:
```bash
# ~/.bashrc or ~/.zshrc
export NODE_ENV=development
export PATH="$HOME/.local/bin:$PATH"
```

Then reload:
```bash
source ~/.bashrc
```

**When to use:** Configure app settings, store secrets, customize shell behavior.

---

## Disk & System

### df — Disk Space

Show disk space usage.

```bash
df -h                   # Human-readable
df -h /home
```

**When to use:** Check if disk is filling up.

---

### du — Directory Sizes

Show file/directory sizes.

```bash
du -sh *                # Size of each item
du -sh node_modules/    # Specific directory
du -h --max-depth=1     # Top-level only
```

**When to use:** Find what's taking up space.

---

### free — Memory Usage

Show memory (RAM) usage.

```bash
free -h
```

**When to use:** Check if server is running low on memory.

---

### uname — System Info

Display system information.

```bash
uname -a                # All info
uname -r                # Kernel version
```

**When to use:** Check OS version or kernel info.

---

## Port Management

Frontend engineers frequently deal with port conflicts ("Port 3000 is already in use").

### Find Process Using Port

```bash
lsof -i :3000          # What's using port 3000?
netstat -tlnp | grep 3000   # Alternative
ss -tlnp | grep 3000        # Modern alternative
```

### Kill Process on Port

```bash
kill -9 $(lsof -t -i:3000)  # Kill whatever is on port 3000
```

### Common Development Ports

| Port | Common Use |
|------|------------|
| 3000 | Next.js, Create React App |
| 3001 | Alternative dev server |
| 5173 | Vite default |
| 8080 | Generic HTTP server |
| 5000 | Flask, Python servers |
| 4200 | Angular CLI |
| 8000 | Django, SimpleHTTPServer |

### Start Server on Different Port

```bash
PORT=3001 npm start           # Express/Node
npm start -- --port 3001      # Some frameworks
vite --port 3001               # Vite
```

### Check If Port is Open

```bash
nc -zv localhost 3000     # Test if port is accessible
curl http://localhost:3000  # HTTP test
```

**When to use:** Debug "address already in use" errors, manage multiple dev servers.

---

## Common Patterns for Frontend Engineers

### Viewing Logs on Server

```bash
tail -f /var/log/nginx/access.log
grep "ERROR" /var/log/app/error.log | tail -50
```

### Checking Node.js Process

```bash
ps aux | grep node
kill $(pgrep -f "node server")
```

### Setting Up Project

```bash
mkdir project && cd project
npm init -y
touch index.js
chmod +x deploy.sh
```

### Finding Large Files

```bash
du -sh /* 2>/dev/null | sort -rh | head -10
find . -type f -size +100M
```

### Quick Server Health Check

```bash
uptime                  # Load average
free -h                 # Memory
df -h                   # Disk
ps aux | wc -l          # Process count
```

### Handling Port Conflicts

```bash
# Find and kill process on port 3000
lsof -i :3000
kill -9 $(lsof -t -i:3000)

# Or start on different port
PORT=3001 npm start
```

---

## Common Gotchas

### rm -rf Disaster Prevention

**Never do this:**
```bash
rm -rf /                # Deletes EVERYTHING
rm -rf /*               # Same thing
rm -rf ~                # Deletes home directory
```

**Use with caution:**
```bash
rm -rf node_modules/    # Safe if in correct directory
# Double-check: pwd && rm -rf node_modules/
```

### sudo npm install Permission Issues

**Wrong:**
```bash
sudo npm install -g create-react-app  # Creates root-owned files
```

**Right:**
```bash
# Use npx instead
npx create-react-app my-app

# Or fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

### Case Sensitivity

Linux is case-sensitive; macOS is case-insensitive by default:
```bash
# These are different files on Linux:
touch File.txt file.txt  # Works on Linux, error on macOS
```

**When to use:** Be consistent with casing in imports and filenames.

### Line Endings (CRLF vs LF)

Windows uses CRLF (`\r\n`), Linux uses LF (`\n`). This causes issues:
```bash
# Check line endings
file script.sh

# Convert CRLF to LF
dos2unix script.sh
sed -i 's/\r$//' script.sh
```

### Spaces in Filenames

```bash
# Wrong (will fail)
cd my documents

# Right
cd "my documents"
cd my\ documents
```

---

## Quick Reference

| Command | Purpose |
|---------|---------|
| `ls -la` | List all files |
| `cd ~` | Go home |
| `pwd` | Where am I |
| `cp -r` | Copy directory |
| `rm -rf` | Force remove |
| `find . -name` | Find files |
| `tar -xzvf` | Extract archive |
| `grep -r` | Search recursively |
| `tail -f` | Watch logs |
| `chmod +x` | Make executable |
| `curl -I` | Check headers |
| `ssh user@host` | Remote connect |
| `lsof -i :3000` | Check port usage |
| `kill -9` | Force kill |
| `du -sh` | Directory size |
| `echo $PATH` | View PATH |
| `export VAR=value` | Set environment variable |

---

## Resources

- [Explain Shell](https://explainshell.com/) - Paste commands to see what they do
- [Linux Command Library](https://linuxcommandlibrary.com/) - Searchable command reference
- [tldr-pages](https://tldr.sh/) - Simplified man pages
