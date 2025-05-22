#!/bin/bash

set -e
set -o pipefail

echo "Starting Docker containers..."
docker compose up -d --build

wait_for_service() {
  local url=$1
  local name=$2
  local max_attempts=30
  local attempt=1

  until curl -s "$url" > /dev/null; do
    if [ $attempt -ge $max_attempts ]; then
      echo "Error: $name did not become ready in time."
      docker compose logs
      exit 1
    fi
    echo "Waiting for $name... ($attempt/$max_attempts)"
    attempt=$((attempt + 1))
    sleep 2
  done
}

echo "Waiting for backend to be ready..."
wait_for_service "http://localhost:8000/api/health/" "backend"

echo "Waiting for frontend to be ready..."
wait_for_service "http://localhost:3000" "frontend"

echo "Running Cypress tests..."
docker compose exec frontend npx cypress run --e2e

echo "Tests completed. Shutting down containers..."
docker compose down
