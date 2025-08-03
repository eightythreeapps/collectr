#!/bin/bash

echo "🚀 Starting Collectr Development Environment"

# Kill any existing processes on our ports
echo "📋 Cleaning up existing processes..."
pkill -f "firebase emulators" || true
pkill -f "next dev" || true
pkill -f "3001" || true

# Start Firebase emulators in background
echo "🔥 Starting Firebase emulators..."
cd firebase
firebase emulators:start --project=demo-collectr --config firebase-emulator.json &
EMULATOR_PID=$!

# Wait for emulators to start
echo "⏳ Waiting for emulators to initialize..."
sleep 10

# Start API server in background
echo "🖥️  Starting API server..."
cd ../
pnpm --filter @collectr/api dev &
API_PID=$!

# Wait for API to start
sleep 5

# Start web app
echo "🌐 Starting web application..."
pnpm --filter @collectr/web dev &
WEB_PID=$!

echo ""
echo "✅ Development environment started!"
echo ""
echo "🔗 Available services:"
echo "   Web App:          http://localhost:3000"
echo "   API Server:       http://localhost:3001"
echo "   Firebase UI:      http://localhost:4000"
echo "   Firestore:        http://localhost:8080"
echo "   Auth Emulator:    http://localhost:9099"
echo "   Storage Emulator: http://localhost:9199"
echo ""
echo "📋 To stop all services, press Ctrl+C"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping development servers..."
    kill $EMULATOR_PID $API_PID $WEB_PID 2>/dev/null
    pkill -f "firebase emulators" || true
    pkill -f "next dev" || true
    echo "✅ All services stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for all background processes
wait