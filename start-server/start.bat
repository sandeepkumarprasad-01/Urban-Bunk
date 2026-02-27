@echo off
title UrbanBUNK Server
echo 🚀 Starting UrbanBUNK Server...
echo =========================
echo.

REM Check if .env file exists
if not exist .env (
    echo ❌ .env file not found!
    echo.
    echo Please run setup.bat first or create .env file:
    echo 1. Copy .env.example to .env
    echo 2. Edit .env with your MongoDB Atlas credentials
    echo.
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist node_modules (
    echo ❌ Dependencies not installed!
    echo.
    echo Please run: npm install
    echo Or run setup.bat for complete setup
    echo.
    pause
    exit /b 1
)

echo ✅ Configuration checked
echo 🌐 Starting server...
echo.
echo Server will be available at: http://localhost:8080
echo Press Ctrl+C to stop the server
echo.

REM Start the server
node app.js

REM If server stops, show message
echo.
echo Server stopped.
pause
