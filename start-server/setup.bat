@echo off
echo 🚀 UrbanBUNK Setup Script
echo =========================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo 📥 Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js is installed

REM Install dependencies
echo 📦 Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully!

REM Copy environment file if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file from template...
    copy .env.example .env >nul
    echo ✅ .env file created!
    echo.
    echo ⚠️  IMPORTANT: Edit .env file with your MongoDB Atlas credentials:
    echo    1. Go to https://www.mongodb.com/atlas
    echo    2. Create free cluster and get connection string
    echo    3. Update MONGO_URL in .env file
    echo.
) else (
    echo ✅ .env file already exists
)

echo.
echo 🎉 Setup complete!
echo.
echo Next steps:
echo 1. Edit .env file with your MongoDB Atlas credentials
echo 2. Run: npm start
echo 3. Visit: http://localhost:8080
echo 4. Optional: Visit http://localhost:8080/seed to add sample data
echo.
pause
