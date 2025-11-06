#!/bin/bash

# Local production environment test script
# This script builds the site in production mode and serves it locally

set -e  # Exit on any error

echo "🚀 Starting local production environment test..."

# Check if required tools are available
if ! command -v bundle &> /dev/null; then
    echo "❌ Bundler is not installed. Please install bundler first:"
    echo "   gem install bundler"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install Node.js and npm first."
    exit 1
fi

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf _site

# Build in production mode
echo "🔨 Building site in production mode..."
npm run build:prod

# Check if _site directory exists
if [ ! -d "_site" ]; then
    echo "❌ Production build failed. _site directory not found."
    exit 1
fi

echo "✅ Production build completed successfully!"

# Show build statistics
echo ""
echo "📊 Build Statistics:"
echo "   Total files: $(find _site -type f | wc -l | tr -d ' ')"
echo "   HTML files:  $(find _site -name "*.html" | wc -l | tr -d ' ')"
echo "   CSS files:   $(find _site -name "*.css" | wc -l | tr -d ' ')"
echo "   JS files:    $(find _site -name "*.js" | wc -l | tr -d ' ')"
echo "   Site size:   $(du -sh _site | cut -f1)"

# Start local server options
echo ""
echo "🌐 Choose how to serve the production build:"
echo "   1) Python HTTP server (simple)"
echo "   2) Jekyll serve with production config"
echo "   3) Docker with Caddy (full production simulation)"
echo ""

read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo "🔄 Starting Python HTTP server..."
        echo "📍 Server running at: http://localhost:8080"
        echo "   Press Ctrl+C to stop"
        cd _site && python3 -m http.server 8080
        ;;
    2)
        echo "🔄 Starting Jekyll serve with production config..."
        echo "📍 Server running at: http://localhost:4000"
        echo "   Press Ctrl+C to stop"
        bundle exec jekyll serve --config _config.yml,_config_production.yml --skip-initial-build
        ;;
    3)
        echo "🔄 Starting Docker with Caddy..."
        if ! command -v docker &> /dev/null; then
            echo "❌ Docker is not installed. Please install Docker first."
            exit 1
        fi
        echo "📍 Server will be available at: http://localhost:8081"
        ./deploy.sh
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac