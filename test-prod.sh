#!/bin/bash

# Quick production test with Python server
# Builds production site and serves with Python HTTP server

set -e

echo "🚀 Quick production test..."

# Build production
echo "🔨 Building production site..."
npm run build:prod

# Start server
echo "🌐 Starting server at http://localhost:8080"
echo "   Press Ctrl+C to stop"
cd _site && python3 -m http.server 8080