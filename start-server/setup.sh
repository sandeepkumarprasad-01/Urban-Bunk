#!/bin/bash

echo "🚀 UrbanBUNK Setup Script"
echo "========================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "📥 Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js is installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created!"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env file with your MongoDB Atlas credentials:"
    echo "   1. Go to https://www.mongodb.com/atlas"
    echo "   2. Create free cluster and get connection string"
    echo "   3. Update MONGO_URL in .env file"
    echo ""
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your MongoDB Atlas credentials"
echo "2. Run: npm start"
echo "3. Visit: http://localhost:8080"
echo "4. Optional: Visit http://localhost:8080/seed to add sample data"
