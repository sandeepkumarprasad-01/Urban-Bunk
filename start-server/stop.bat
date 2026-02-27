@echo off
title Stop UrbanBUNK Server
echo 🛑 Stopping UrbanBUNK Server...
echo =========================
echo.

REM Check if Node.js processes are running
tasklist /fi "imagename eq node.exe" | find /i "node.exe" >nul
if %errorlevel% neq 0 (
    echo ✅ No Node.js processes found - server is already stopped
    echo.
    pause
    exit /b 0
)

echo 🔄 Found running Node.js processes...
echo.

REM Stop all Node.js processes
echo 🛑 Terminating Node.js processes...
taskkill /f /im node.exe

if %errorlevel% equ 0 (
    echo ✅ Server stopped successfully!
    echo 📍 Port 8080 is now free
) else (
    echo ❌ Failed to stop server processes
    echo 💡 You may need to manually stop processes in Task Manager
)

echo.
echo Server status: STOPPED
echo.
echo To start server again, run: start.bat
echo.
pause
