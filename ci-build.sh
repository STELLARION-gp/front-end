#!/bin/sh
set -e

echo "📦 Installing dependencies..."
cd frontend
npm install

echo "🏗️  Building application..."
npm run build

echo "✅ Build complete!"
