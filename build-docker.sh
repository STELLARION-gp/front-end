#!/bin/bash

# Build script for Docker deployment
# This sets the base path to '/' for Docker/nginx deployment

echo "🐳 Building for Docker deployment..."
echo "Setting base path to '/'"

export DOCKER_BUILD=true
export VITE_BASE_PATH=/

cd frontend
npm run build

echo "✅ Build complete! Output in frontend/dist/"
