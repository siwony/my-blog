#!/bin/bash

# Docker deployment script for Jekyll blog with Caddy

set -e  # Exit on any error

echo "🚀 Starting Docker deployment for Jekyll blog..."

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if bundle is available
if ! command -v bundle &> /dev/null; then
    echo "❌ Bundler is not installed. Please install bundler first:"
    echo "   gem install bundler"
    exit 1
fi

# Build Jekyll site locally first
echo "🔨 Building Jekyll site locally..."
if [ ! -f "Gemfile" ]; then
    echo "❌ Gemfile not found. Are you in the correct directory?"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "vendor/bundle" ] && [ ! -d ".bundle" ]; then
    echo "📦 Installing Jekyll dependencies..."
    bundle install
fi

# Build the site
bundle exec jekyll build

# Check if _site directory exists
if [ ! -d "_site" ]; then
    echo "❌ Jekyll build failed. _site directory not found."
    exit 1
fi

echo "✅ Jekyll site built successfully!"

# Build and start the container
echo "📦 Building Docker image..."
docker-compose build

echo "🔄 Starting container..."
docker-compose up -d

# Wait a moment for the container to start
sleep 5

# Check if container is healthy
echo "🔍 Checking container health..."
if docker-compose ps | grep -q "Up (healthy)"; then
    echo "✅ Container is running and healthy!"
    echo "🌐 Your blog is now accessible at: http://localhost:8081"
elif docker-compose ps | grep -q "Up"; then
    echo "⚠️  Container is running but health check is pending..."
    echo "🌐 Your blog should be accessible at: http://localhost:8081"
else
    echo "❌ Container failed to start. Checking logs..."
    docker-compose logs
    exit 1
fi

echo ""
echo "📋 Useful commands:"
echo "  View logs:     docker-compose logs -f"
echo "  Stop service:  docker-compose down"
echo "  Rebuild:       ./deploy.sh"
echo "  Shell access:  docker-compose exec blog sh"
echo ""
echo "📁 Local development:"
echo "  Build site:    bundle exec jekyll build"
echo "  Serve locally: bundle exec jekyll serve"