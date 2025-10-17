# 🐳 Docker Deployment Guide

## Overview

This guide covers how to build and deploy the STELLARION frontend using Docker.

## Files

- **`Dockerfile`** - Production build with nginx
- **`Dockerfile.dev`** - Development build with Vite dev server
- **`nginx.conf`** - Nginx configuration for React Router support
- **`.dockerignore`** - Files to exclude from Docker build
- **`docker-compose.yml`** - Docker Compose configuration

---

## Production Deployment

### Build the Docker Image

```bash
cd /Users/nimnapathum/Documents/GitHub/STELLARION/front-end

# Build the image
docker build -t stellarion-frontend:latest .

# Or with specific tag
docker build -t stellarion-frontend:v1.0.0 .
```

### Run the Container

```bash
# Run on port 8080
docker run -d -p 8080:80 --name stellarion-frontend stellarion-frontend:latest

# Run with environment variables
docker run -d -p 8080:80 \
  -e VITE_API_BASE_URL=https://api.stellarion.com \
  -e VITE_BACKEND_URL=https://api.stellarion.com \
  --name stellarion-frontend \
  stellarion-frontend:latest
```

### Access the Application

Open your browser and visit: `http://localhost:8080`

---

## Using Docker Compose

### Production Mode

```bash
cd /Users/nimnapathum/Documents/GitHub/STELLARION/front-end

# Start the production container
docker-compose up -d frontend-prod

# View logs
docker-compose logs -f frontend-prod

# Stop the container
docker-compose down
```

Access at: `http://localhost:8080`

### Development Mode

```bash
# Start development container with hot reload
docker-compose --profile dev up -d frontend-dev

# View logs
docker-compose logs -f frontend-dev

# Stop
docker-compose --profile dev down
```

Access at: `http://localhost:5173`

---

## Building for Container Registry

### Build and Tag

```bash
# For Docker Hub
docker build -t yourusername/stellarion-frontend:latest .
docker push yourusername/stellarion-frontend:latest

# For GitHub Container Registry
docker build -t ghcr.io/stellarion-gp/stellarion-frontend:latest .
docker push ghcr.io/stellarion-gp/stellarion-frontend:latest

# For AWS ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ECR_URI
docker build -t YOUR_ECR_URI/stellarion-frontend:latest .
docker push YOUR_ECR_URI/stellarion-frontend:latest
```

---

## Environment Variables

Create a `.env.docker` file for environment-specific configurations:

```bash
VITE_API_BASE_URL=https://api.stellarion.com
VITE_API_ENDPOINT=/api
VITE_CHATBOT_PROVIDER=custom
VITE_BACKEND_URL=https://api.stellarion.com
VITE_CHATBOT_API_URL=https://api.stellarion.com/api
```

Then run with:

```bash
docker run -d -p 8080:80 --env-file .env.docker stellarion-frontend:latest
```

---

## Multi-Stage Build Benefits

The production Dockerfile uses multi-stage builds:

1. **Builder Stage**: Compiles TypeScript and builds with Vite
2. **Runtime Stage**: Serves static files with nginx

**Benefits:**
- ✅ Smaller final image (nginx:alpine vs node:18-alpine)
- ✅ Better security (no build tools in production)
- ✅ Faster deployment and startup
- ✅ Optimized for production workloads

---

## Fixing the Build Error

The error you encountered (`sh: tsc: not found`) was caused by:
1. Dependencies not being installed in the build context
2. Incorrect COPY sequence in the Dockerfile

**The new Dockerfile fixes this by:**
1. Copying `package*.json` first
2. Running `npm ci` to install dependencies (including TypeScript)
3. Then copying the rest of the application
4. Finally running the build

---

## Testing the Docker Build Locally

```bash
# Test production build
cd /Users/nimnapathum/Documents/GitHub/STELLARION/front-end
docker build -t stellarion-frontend:test .
docker run -d -p 8080:80 stellarion-frontend:test

# Open browser to http://localhost:8080
# Test navigation, refresh pages, check assets

# Clean up
docker stop $(docker ps -q --filter ancestor=stellarion-frontend:test)
docker rmi stellarion-frontend:test
```

---

## Troubleshooting

### Issue: `tsc: not found`
**Solution:** Fixed in the new Dockerfile by properly installing dependencies before building.

### Issue: React Router 404 errors
**Solution:** The `nginx.conf` handles this with `try_files` directive.

### Issue: Environment variables not working
**Solution:** 
- Vite bakes environment variables at build time
- Pass them during `docker build` using `--build-arg`
- Or build different images for different environments

### Issue: Large image size
**Solution:** The multi-stage build creates small images (~50MB for nginx + static files)

### Issue: Assets not loading
**Solution:** Check the `base` path in `vite.config.ts` - for Docker, you might want `base: '/'`

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Build and Push Docker Image

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Build Docker image
        run: |
          cd front-end
          docker build -t stellarion-frontend:${{ github.sha }} .
      
      - name: Push to registry
        run: |
          echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u "${{ secrets.DOCKER_USERNAME }}" --password-stdin
          docker push stellarion-frontend:${{ github.sha }}
```

### Argo Workflows Example

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Workflow
metadata:
  name: build-stellarion-frontend
spec:
  entrypoint: build
  templates:
  - name: build
    container:
      image: gcr.io/kaniko-project/executor:latest
      args:
        - --dockerfile=Dockerfile
        - --context=dir:///workspace/front-end
        - --destination=stellarion-frontend:latest
```

---

## Health Checks

The nginx configuration includes a `/health` endpoint:

```bash
curl http://localhost:8080/health
# Returns: healthy
```

Use this for:
- Docker health checks
- Kubernetes readiness/liveness probes
- Load balancer health checks

---

## Performance Optimization

The nginx configuration includes:
- ✅ Gzip compression
- ✅ Static asset caching (1 year)
- ✅ Security headers
- ✅ Access log optimization

---

## Next Steps

1. ✅ Docker files created and configured
2. ⏭️ Test the build locally
3. ⏭️ Push to container registry
4. ⏭️ Deploy to your hosting platform
5. ⏭️ Set up CI/CD pipeline

---

## Quick Commands Reference

```bash
# Build
docker build -t stellarion-frontend .

# Run
docker run -d -p 8080:80 stellarion-frontend

# Compose
docker-compose up -d

# Logs
docker logs -f <container-id>

# Stop
docker stop <container-id>

# Remove
docker rm <container-id>
docker rmi stellarion-frontend
```

---

**Your Docker setup is now complete! 🐳**
