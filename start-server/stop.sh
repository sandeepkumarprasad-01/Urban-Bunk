#!/bin/bash

echo "🛑 Stopping UrbanBUNK Server..."
echo "========================="
echo ""

# Check if Node.js processes are running
if ! pgrep -x "node" > /dev/null; then
    echo "✅ No Node.js processes found - server is already stopped"
    echo ""
    exit 0
fi

echo "🔄 Found running Node.js processes..."
echo ""

# Stop all Node.js processes
echo "🛑 Terminating Node.js processes..."
pkill -f "node"

if [ $? -eq 0 ]; then
    echo "✅ Server stopped successfully!"
    echo "📍 Port 8080 is now free"
else
    echo "❌ Failed to stop server processes"
    echo "💡 You may need to manually kill processes: killall node"
fi

echo ""
echo "Server status: STOPPED"
echo ""
echo "To start server again, run: ./start.sh"
echo ""
