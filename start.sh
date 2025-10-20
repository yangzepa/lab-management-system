#!/bin/bash

echo "🚀 Lab Management System - Starting..."
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose found"
echo ""

# Start backend with Docker Compose
echo "📦 Starting backend services (MySQL + Spring Boot)..."
docker-compose up -d

echo ""
echo "⏳ Waiting for backend to be ready..."
sleep 10

# Check if backend is running
if curl -s http://localhost:8080/api/public/lab/info > /dev/null; then
    echo "✅ Backend is running on http://localhost:8080"
else
    echo "⚠️  Backend is still starting up. Please wait a moment..."
fi

echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Install frontend dependencies if needed
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
    echo "✅ Dependencies installed"
    echo ""
fi

# Start frontend
echo "🎨 Starting frontend..."
cd frontend && npm run dev &

FRONTEND_PID=$!

echo ""
echo "=================================="
echo "🎉 Lab Management System is ready!"
echo "=================================="
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:8080"
echo "Swagger:  http://localhost:8080/api/swagger-ui.html"
echo ""
echo "Login credentials:"
echo "  Username: admin"
echo "  Password: admin123!"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for frontend process
wait $FRONTEND_PID

# Stop backend when frontend is stopped
echo ""
echo "🛑 Stopping services..."
docker-compose down
echo "✅ All services stopped"
