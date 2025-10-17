#!/bin/bash
set -e  # Exit on error

echo "🔧 Installing dependencies..."
cd frontend
npm ci

echo "🏗️  Building frontend..."
npm run build

echo "✅ Build complete! Output in frontend/dist/"
