# Variables
COMPOSE = docker compose

.PHONY: help up down restart build logs ps clean

# Default target shows help
help:
	@echo "Available commands:"
	@echo "  make up       - Build and start all services in the background"
	@echo "  make down     - Stop and remove all containers and networks"
	@echo "  make restart  - Stop and restart all services"
	@echo "  make build    - Rebuild the Docker images without starting them"
	@echo "  make logs     - View real-time logs from all services"
	@echo "  make ps       - List running containers"
	@echo "  make clean    - Stop services and remove unused Docker data/volumes"

# Core commands
up:
	@ $(COMPOSE) up --build -d

down:
	$(COMPOSE) down

restart: down up

build:
	@ $(COMPOSE) build

start:
	@ $(COMPOSE) up -d

logs:
	@ $(COMPOSE) logs -f

ps:
	@ $(COMPOSE) ps

clean:
	@ $(COMPOSE) down --volumes --rmi local
	@ docker system prune -f
