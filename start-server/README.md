# 🚀 UrbanBUNK Server Control

This folder contains easy-to-use scripts for managing your UrbanBUNK server.

## 📁 Files Available

### Windows Users (.bat files)
- **`setup.bat`** - Complete setup (install dependencies, create .env)
- **`start.bat`** - Start the server
- **`stop.bat`** - Stop the server

### Mac/Linux Users (.sh files)
- **`setup.sh`** - Complete setup (install dependencies, create .env)
- **`start.sh`** - Start the server
- **`stop.sh`** - Stop the server

## 🎮 How to Use

### First Time Setup
```bash
# Windows: Double-click setup.bat
# Mac/Linux: Run chmod +x setup.sh && ./setup.sh
```

### Start Server
```bash
# Windows: Double-click start.bat
# Mac/Linux: Run ./start.sh
```

### Stop Server
```bash
# Windows: Double-click stop.bat
# Mac/Linux: Run ./stop.sh
```

## 📋 Requirements

- Node.js installed
- MongoDB Atlas account
- .env file configured with Atlas credentials

## 🔗 Quick Links

- **Main App:** http://localhost:8080
- **All Listings:** http://localhost:8080/listings
- **Sample Data:** http://localhost:8080/seed

## ⚠️ Important Notes

- Make sure MongoDB Atlas is configured before starting
- Server runs on port 8080
- All data is stored in MongoDB Atlas (cloud database)
- No local MongoDB required

## 🐛 Troubleshooting

If server doesn't start:
1. Check if .env file exists and is configured
2. Run setup.bat/setup.sh again
3. Verify MongoDB Atlas credentials
4. Make sure port 8080 is not in use
