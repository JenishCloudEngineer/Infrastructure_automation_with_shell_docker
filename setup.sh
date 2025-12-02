#!/bin/bash

echo "==== DevOps Automation Environment Setup ===="

# WSL Docker Check
if ! command -v docker &> /dev/null
then
    echo "Docker not installed. Install Docker Desktop first."
    exit 1
fi

echo "[OK] Docker found."

# Fix Jenkins folder permissions
echo "Setting Jenkins permissions..."
sudo mkdir -p jenkins/jenkins_home
sudo chmod -R 777 jenkins/jenkins_home

echo "Starting Docker Compose services..."
docker compose up -d --build

echo "Waiting for services to initialize..."
sleep 10

echo "Showing logs..."
docker compose logs -f
