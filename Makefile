# Makefile for Jekyll Blog with Docker & Caddy
.PHONY: help build up down logs shell clean rebuild test status health homeserver-build homeserver-up homeserver-down homeserver-logs homeserver-status

# Default target
help: ## Show this help message
	@echo "Jekyll Blog Docker Management"
	@echo "============================="
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) }' $(MAKEFILE_LIST)

##@ Development Commands
build: ## Build the Docker image
	@echo "🔨 Building Docker image..."
	docker-compose build

up: ## Start the blog container
	@echo "🚀 Starting blog container..."
	docker-compose up -d
	@echo "✅ Blog is running at http://localhost:8080"

down: ## Stop and remove containers
	@echo "🛑 Stopping containers..."
	docker-compose down

logs: ## Show container logs
	@echo "📋 Showing logs..."
	docker-compose logs -f

shell: ## Access container shell
	@echo "🐚 Accessing container shell..."
	docker-compose exec blog sh

##@ Maintenance Commands
rebuild: ## Rebuild and restart containers
	@echo "🔄 Rebuilding and restarting..."
	docker-compose down
	docker-compose build --no-cache
	docker-compose up -d
	@echo "✅ Blog restarted at http://localhost:8080"

clean: ## Remove containers, images, and volumes
	@echo "🧹 Cleaning up Docker resources..."
	docker-compose down -v --rmi all

status: ## Show container status
	@echo "📊 Container status:"
	docker-compose ps

health: ## Check container health
	@echo "🔍 Checking container health..."
	@docker-compose ps | grep "Up (healthy)" && echo "✅ Container is healthy!" || echo "⚠️ Container may not be healthy"

##@ Jekyll Commands
jekyll-build: ## Build Jekyll site locally (without Docker)
	@echo "🔨 Building Jekyll site locally..."
	bundle exec jekyll build

jekyll-serve: ## Serve Jekyll site locally (without Docker)
	@echo "🚀 Serving Jekyll site locally..."
	bundle exec jekyll serve

jekyll-clean: ## Clean Jekyll build artifacts
	@echo "🧹 Cleaning Jekyll artifacts..."
	bundle exec jekyll clean

##@ Quick Actions
deploy: jekyll-build build up ## Build Jekyll site, then build and deploy Docker container
	@echo "🎉 Deployment complete! Visit http://localhost:8081"

restart: down up ## Restart containers quickly

dev: ## Start development mode (local Jekyll server)
	@echo "🛠️ Starting development server..."
	bundle exec jekyll serve --watch --drafts

##@ Homeserver Deployment
homeserver-deploy: ## Deploy to homeserver (full process)
	@echo "🏠 Deploying to homeserver..."
	./deploy-homeserver.sh

homeserver-build: ## Build Jekyll site for homeserver
	@echo "🔨 Building Jekyll site for homeserver..."
	./deploy-homeserver.sh --build-only

homeserver-up: ## Start homeserver containers
	@echo "🚀 Starting homeserver containers..."
	./deploy-homeserver.sh --deploy-only

homeserver-down: ## Stop homeserver containers
	@echo "🛑 Stopping homeserver containers..."
	./deploy-homeserver.sh --stop

homeserver-restart: ## Restart homeserver containers
	@echo "🔄 Restarting homeserver containers..."
	./deploy-homeserver.sh --restart

homeserver-logs: ## Show homeserver logs
	@echo "📋 Showing homeserver logs..."
	./deploy-homeserver.sh --logs

homeserver-status: ## Check homeserver status
	@echo "📊 Checking homeserver status..."
	./deploy-homeserver.sh --status