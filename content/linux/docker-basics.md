---
title: Docker Basics
date: 2026-04-03
tags: [Docker]
---

## Docker Basics

### What is Docker?

`Docker` is a platform for developing, shipping, and running applications in containers. Containers are lightweight, portable, and self-sufficient environments that package your application with all its dependencies.

#### Containerization vs Virtualization

| VMs | Containers |
|-----|------------|
| Heavy (GBs) | Lightweight (MBs) |
| Full OS per VM | Shared host OS kernel |
| Slow startup (minutes) | Fast startup (seconds) |
| Hardware-level isolation | Process-level isolation |

#### Core Concepts

- **Image**: Read-only template containing application code, runtime, libraries, and dependencies
- **Container**: Running instance of an image
- **Dockerfile**: Text file with instructions to build an image
- **Docker Compose**: Tool for defining and running multi-container applications
- **Volume**: Persistent storage for container data
- **Registry**: Service for storing and distributing images (Docker Hub, AWS ECR, etc.)

#### Why Frontend Engineers Need Docker

- **Consistent environments**: Same setup for dev, staging, and production
- **Easy onboarding**: New team members run one command to start
- **Dependency isolation**: Different projects with different Node versions
- **Deploy anywhere**: Cloud, on-premise, local - same container runs everywhere
- **CI/CD standardization**: Build once, deploy anywhere

---

## Essential Docker Commands

### Image Management

#### docker pull — Download Image

```bash
docker pull node:18-alpine
docker pull nginx:alpine
docker pull node:lts     # Latest LTS version
```

**When to use:** Get base images for your projects.

---

#### docker images — List Local Images

```bash
docker images                    # All images
docker images | grep node        # Filter by name
docker images --filter "dangling=true"  # Untagged images
```

**When to use:** Check what images you have, clean up space.

---

#### docker rmi — Remove Image

```bash
docker rmi image_id              # By ID
docker rmi node:18-alpine        # By name:tag
docker rmi $(docker images -q)   # Remove all (careful!)
```

**When to use:** Free up disk space, remove old versions.

---

#### docker build — Build Image from Dockerfile

```bash
docker build -t myapp:latest .           # Build with tag
docker build -t myapp:v1.0 . --no-cache  # No cache (fresh build)
docker build -f Dockerfile.prod .        # Specific Dockerfile
```

**When to use:** Create images for your applications.

---

### Container Lifecycle

#### docker run — Create and Start Container

```bash
# Basic run
docker run myapp:latest

# Common options
docker run -d myapp:latest              # Detached (background)
docker run -p 3000:80 myapp:latest      # Port mapping (host:container)
docker run -p 3000:80 -p 3001:443 myapp # Multiple ports
docker run --name my-container myapp    # Named container
docker run --rm myapp                   # Auto-remove when stopped
docker run -e NODE_ENV=production myapp # Environment variable
docker run -v $(pwd):/app myapp         # Volume mount
docker run -it node:18-alpine sh        # Interactive + TTY
```

**When to use:** Start containers for development, testing, or production.

---

#### docker ps — List Containers

```bash
docker ps                    # Running containers
docker ps -a                 # All containers (including stopped)
docker ps -q                 # Just IDs (useful for scripts)
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

**When to use:** Check what's running, find container IDs.

---

#### docker stop / start / restart

```bash
docker stop container_id          # Graceful shutdown (SIGTERM)
docker stop $(docker ps -q)       # Stop all running
docker start container_id         # Start stopped container
docker restart container_id       # Restart running container
docker kill container_id          # Force kill (SIGKILL)
```

**When to use:** Manage container lifecycle.

---

#### docker rm — Remove Container

```bash
docker rm container_id            # Remove stopped container
docker rm -f container_id         # Force remove (stop + remove)
docker rm $(docker ps -aq)        # Remove all containers
```

**When to use:** Clean up stopped containers.

---

### Debugging & Interaction

#### docker logs — View Container Logs

```bash
docker logs container_id          # All logs
docker logs -f container_id       # Follow (tail -f)
docker logs --tail 100 container_id  # Last 100 lines
docker logs --since 10m container_id # Last 10 minutes
```

**When to use:** Debug application errors, view output.

---

#### docker exec — Execute Commands in Container

```bash
# Interactive shell
docker exec -it container_id sh
docker exec -it container_id bash  # If bash available

# Single command
docker exec container_id ls -la
docker exec container_id cat /etc/os-release

# As different user
docker exec -u root -it container_id sh
```

**When to use:** Debug running containers, run one-off commands.

---

#### docker inspect — Detailed Container Info

```bash
docker inspect container_id       # Full JSON output
docker inspect --format='{{.NetworkSettings.IPAddress}}' container_id
```

**When to use:** Get detailed configuration, IP addresses, mounts.

---

### System Commands

#### docker system — Manage Docker

```bash
docker system df                  # Disk usage
docker system prune               # Remove unused data
docker system prune -a            # Remove all unused (images too)
```

**When to use:** Clean up disk space.

---

## Dockerfile for Vue 3 Projects

### Development Dockerfile

```dockerfile
# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for layer caching)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Expose Vite's default port
EXPOSE 5173

# Start development server
CMD ["npm", "run", "dev"]
```

**Key points:**
- `node:18-alpine` - Small, secure base (~180MB vs ~1GB for full image)
- `WORKDIR` - All subsequent commands run from this directory
- Copy `package*.json` first - Docker caches layers, only reinstalls if package.json changes
- `EXPOSE` - Documents which port the app uses

**When to use:** Local development, quick prototyping.

---

### Production Dockerfile (Multi-Stage)

```dockerfile
# ==========================================
# Stage 1: Build the Vue 3 application
# ==========================================
FROM node:18-alpine AS builder

WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source and build
COPY . .
RUN npm run build

# ==========================================
# Stage 2: Serve with Nginx
# ==========================================
FROM nginx:alpine

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config (optional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

**Why multi-stage:**
- Final image only has nginx + static files (~25MB vs ~1GB)
- Build tools (node_modules, devDependencies) not in production image
- Faster deployments, smaller attack surface
- No source code in production image

**When to use:** Production deployments, CI/CD pipelines.

---

### Nginx Config for Vue Router (History Mode)

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;

    location / {
        # Support Vue Router history mode
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets (JS, CSS, images)
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
}
```

**Key configurations:**
- `try_files` - Essential for Vue Router's history mode (no hash URLs)
- Gzip - Compress responses for faster loading
- Cache headers - Aggressive caching for static assets (hashed filenames)

**When to use:** Any Vue 3 SPA in production.

---

### Optimized Dockerfile (Best Practices)

```dockerfile
# Use specific version for reproducibility
FROM node:18.17.1-alpine AS builder

WORKDIR /app

# Security: Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S vueuser -u 1001

# Copy package files
COPY --chown=vueuser:nodejs package*.json ./

# Switch to non-root user
USER vueuser

# Install dependencies
RUN npm ci --only=production

# Copy source with correct ownership
COPY --chown=vueuser:nodejs . .

# Build application
RUN npm run build

# ==========================================
# Production stage
# ==========================================
FROM nginx:1.25-alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**Best practices included:**
- Specific version tags (not `latest`)
- Non-root user for security
- `--chown` for correct file permissions
- Health check for container orchestration
- Multi-stage build for minimal image size

---

## Docker Compose

### Basic docker-compose.yml (Development)

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    container_name: vue-frontend
    ports:
      - "5173:5173"
    volumes:
      - ./frontend:/app           # Mount source code for hot reload
      - /app/node_modules         # Anonymous volume (don't overwrite container's node_modules)
    environment:
      - NODE_ENV=development
      - CHOKIDAR_USEPOLLING=true  # Fix file watching in Docker
    command: npm run dev -- --host
    networks:
      - frontend-network

networks:
  frontend-network:
    driver: bridge
```

**Key configurations:**
- `volumes` - Mounts local code into container (enables hot reload)
- `/app/node_modules` - Anonymous volume preserves container's node_modules
- `CHOKIDAR_USEPOLLING=true` - File watching works in Docker volumes
- `--host` - Vite binds to all interfaces (required for Docker)

**When to use:** Local Vue 3 development with hot reload.

---

### Full Stack (Vue 3 + Node.js API + PostgreSQL)

```yaml
version: '3.8'

services:
  # ========================================
  # Vue 3 Frontend
  # ========================================
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        VITE_API_URL: http://localhost:3000
    container_name: vue-frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - app-network
    restart: unless-stopped

  # ========================================
  # Node.js Backend API
  # ========================================
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: node-backend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgres://user:password@db:5432/myapp
      - JWT_SECRET=${JWT_SECRET}
      - PORT=3000
    depends_on:
      db:
        condition: service_healthy
    networks:
      - app-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # ========================================
  # PostgreSQL Database
  # ========================================
  db:
    image: postgres:15-alpine
    container_name: postgres-db
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=myapp
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    networks:
      - app-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d myapp"]
      interval: 10s
      timeout: 5s
      retries: 5

  # ========================================
  # Redis Cache (optional)
  # ========================================
  redis:
    image: redis:7-alpine
    container_name: redis-cache
    volumes:
      - redis_data:/data
    networks:
      - app-network
    restart: unless-stopped

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local

networks:
  app-network:
    driver: bridge
```

**Features:**
- Service dependencies with health checks
- Named volumes for data persistence
- Environment variables from `.env` file
- Container restart policies
- Network isolation

**When to use:** Full-stack applications with database.

---

### Docker Compose Commands

```bash
# Start services
docker-compose up                    # Start in foreground
docker-compose up -d                 # Detached (background)
docker-compose up --build            # Rebuild images before starting
docker-compose up --force-recreate   # Recreate containers

# Stop services
docker-compose down                  # Stop and remove containers
docker-compose down -v               # Also remove volumes
docker-compose down --rmi all        # Also remove images

# Logs
docker-compose logs                  # All service logs
docker-compose logs -f frontend      # Follow frontend logs
docker-compose logs --tail 100 backend  # Last 100 lines

# Execute commands
docker-compose exec frontend sh      # Shell into frontend
docker-compose exec backend npm test # Run tests
docker-compose run --rm backend npm install  # One-off command

# Manage
docker-compose ps                    # List services
docker-compose top                   # Running processes
docker-compose config                # Validate and view config
docker-compose pull                  # Pull latest images
docker-compose build                 # Build images
docker-compose restart frontend      # Restart specific service
```

---

## Vue 3 Specific Patterns

### Hot Reload Development Setup

```dockerfile
# Dockerfile.dev
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Vite needs to bind to all interfaces
ENV HOST=0.0.0.0
ENV PORT=5173

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
```

```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "5173:5173"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - CHOKIDAR_USEPOLLING=true
      - NODE_ENV=development
    # For HMR (Hot Module Replacement)
    stdin_open: true
    tty: true
```

**Run development:**
```bash
docker-compose -f docker-compose.dev.yml up
```

**Key settings explained:**
- `--host` - Binds to 0.0.0.0 (required for Docker port mapping)
- `CHOKIDAR_USEPOLLING=true` - Uses polling instead of filesystem events (works in Docker volumes)
- `stdin_open: true` + `tty: true` - Keeps container running for HMR

---

### Environment Variables in Vue 3

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

ARG VITE_API_URL
ARG VITE_APP_NAME

ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_APP_NAME=${VITE_APP_NAME}

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        VITE_API_URL: ${VITE_API_URL}
        VITE_APP_NAME: ${VITE_APP_NAME}
    environment:
      - NODE_ENV=production
```

```bash
# .env file
VITE_API_URL=https://api.example.com
VITE_APP_NAME=MyVueApp
```

**Important:** Vite uses `import.meta.env.VITE_*` for client-side env vars. They must be exposed at **build time**, not runtime.

**Access in Vue 3:**
```javascript
// config.js
export const API_URL = import.meta.env.VITE_API_URL
export const APP_NAME = import.meta.env.VITE_APP_NAME
```

---

### .dockerignore

```
# Dependencies
node_modules
npm-debug.log
yarn-error.log
pnpm-debug.log

# Build output
dist
dist-ssr

# Environment files (except example)
.env
.env.local
.env.*.local
!.env.example

# IDE
.vscode
.idea
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Testing
coverage
.nyc_output

# Git
.git
.gitignore

# CI/CD
.github
.gitlab-ci.yml

# Documentation
README.md
CHANGELOG.md
LICENSE

# Docker
Dockerfile*
docker-compose*
.dockerignore
```

**Why it matters:**
- Smaller build context (faster builds)
- No sensitive data in images
- Layer caching works better

---

## Common Gotchas

### Port Binding Issues

**Problem:** App works locally but not in Docker

```bash
# Wrong - binds to localhost only (inaccessible outside container)
# vite.config.js
export default {
  server: {
    host: 'localhost'  // Only accessible inside container
  }
}

# Right - binds to all interfaces
export default {
  server: {
    host: '0.0.0.0'   // Accessible from host
  }
}
```

**Solution for Vite:**
```bash
# In Dockerfile
CMD ["npm", "run", "dev", "--", "--host"]

# Or set environment variable
ENV HOST=0.0.0.0
```

---

### Volume Permissions

**Problem:** Container creates files as root, host can't edit them

```bash
# Check file ownership
ls -la
# -rw-r--r-- 1 root root 1234 file.js

# Solutions:

# 1. Run container as current user
docker run -u $(id -u):$(id -g) -v $(pwd):/app myimage

# 2. In docker-compose
services:
  frontend:
    user: "${UID}:${GID}"
    volumes:
      - .:/app

# 3. Fix permissions in Dockerfile
RUN addgroup -g 1001 -S nodejs && \
    adduser -S vueuser -u 1001 && \
    chown -R vueuser:nodejs /app
USER vueuser
```

---

### Layer Caching Not Working

**Problem:** Docker rebuilds from scratch every time

```dockerfile
# Bad - any source change invalidates npm install
COPY . .
RUN npm ci

# Good - only reinstall if package.json changes
COPY package*.json ./
RUN npm ci
COPY . .
```

**Best practice order:**
1. Copy files that change least (package.json)
2. Run expensive operations (npm ci)
3. Copy files that change most (source code)

---

### "It Works on My Machine"

**Problem:** Different Node versions, OS-specific issues

```dockerfile
# Pin exact versions
FROM node:18.17.1-alpine

# Use lockfile
COPY package-lock.json ./
RUN npm ci

# Clean before testing
docker-compose down -v
docker system prune -a
docker-compose up --build
```

---

### Container Can't Reach Other Services

**Problem:** Frontend can't connect to backend

```yaml
# Wrong - using localhost
environment:
  - VITE_API_URL=http://localhost:3000  # localhost is container itself

# Right - using service name
environment:
  - VITE_API_URL=http://backend:3000    # backend is the service name
```

**Docker Compose networking:**
- Services can reach each other by service name
- Each service has its own localhost
- Use service names for inter-service communication

---

### Image Size Too Large

**Problem:** 1GB+ images for a simple Vue app

```dockerfile
# Bad - 1GB+
FROM node:18
RUN npm install
COPY . .
CMD npm start

# Good - 25MB
FROM node:18-alpine AS builder
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
```

**Optimization tips:**
- Use `alpine` variants
- Multi-stage builds
- Only copy what's needed
- Use `.dockerignore`

---

## Quick Decision Guide

| Scenario | Solution |
|----------|----------|
| Learning Docker basics | Docker Desktop + simple Dockerfile |
| Local Vue 3 development | `docker-compose.dev.yml` with volume mounts |
| Production deployment | Multi-stage Dockerfile + nginx |
| Multiple services (frontend + API + DB) | Docker Compose |
| Environment parity (dev/staging/prod) | Same Dockerfile, different env vars |
| CI/CD pipeline | `docker build` + push to registry |
| Kubernetes deployment | Build image → push → K8s deployment |
| Quick testing | `docker run` with `--rm` flag |

---

## Common Commands Cheat Sheet

```bash
# Development workflow
docker-compose up -d                    # Start in background
docker-compose logs -f frontend         # Watch logs
docker-compose exec frontend npm install # Add dependency
docker-compose down -v                  # Clean shutdown

# Build and test
docker build -t myapp:latest .
docker run -p 80:80 myapp:latest
docker run -it --rm myapp:latest sh     # Test and remove

# Production workflow
docker build -t registry/myapp:v1.0 .
docker push registry/myapp:v1.0

# Debugging
docker ps                               # Running containers
docker logs <container>                 # View logs
docker exec -it <container> sh          # Shell access
docker inspect <container>              # Full details
docker stats                            # Resource usage

# Cleanup
docker system prune -a                  # Remove all unused
docker volume prune                     # Remove unused volumes
```

---

## Resources

- [Docker Docs - Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Vue 3 Deployment Guide](https://vuejs.org/guide/best-practices/production-deployment.html)
- [Dockerfile Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Node.js Docker Guide](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
