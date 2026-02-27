#!/bin/bash

echo "🚀 Starting UrbanBUNK Server..."
echo "========================="
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo ""
    echo "Please run setup.sh first or create .env file:"
    echo "1. Copy .env.example to .env"
    echo "2. Edit .env with your MongoDB Atlas credentials"
    echo ""
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "❌ Dependencies not installed!"
    echo ""
    echo "Please run: npm install"
    echo "Or run setup.sh for complete setup"
    echo ""
    exit 1
fi

echo "✅ Configuration checked"
echo "🌐 Starting server..."
echo ""
echo "Server will be available at: http://localhost:8080"
echo "Press Ctrl+C to stop the server"
echo ""

# Start the server
node app.js
