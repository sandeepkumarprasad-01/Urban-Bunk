# UrbanBUNK

A modern property listing web application built with Express.js, MongoDB, and Passport authentication.

## 🚀 Quick Start

### 📦 **One-Command Installation**

```bash
# Clone and install everything in one command
git clone <your-repo-url> UrbanBUNK && cd UrbanBUNK && npm install
```

That's it! All dependencies will be installed automatically.

### ⚙️ **Setup MongoDB Atlas**

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create free account and M0 Sandbox cluster
   - Click "Connect" → "Connect your application"
   - Copy the connection string

2. **Configure Environment**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your Atlas credentials:
   ```
   MONGO_URL=mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/wanderlust?retryWrites=true&w=majority
   SESSION_SECRET=your-secret-key-change-this-in-production
   ```

3. **Start the Application**
   
   **Option A: Easy Scripts (Recommended)**
   ```bash
   # Windows: Double-click start-server/setup.bat then start-server/start.bat
   # Mac/Linux: Run chmod +x start-server/setup.sh && ./start-server/setup.sh
   # Then: ./start-server/start.sh
   ```
   
   **Option B: Manual Commands**
   ```bash
   npm start
   # OR
   node app.js
   ```

4. **Add Sample Data** (Optional)
   ```bash
   # Visit http://localhost:8080/seed in browser
   # This adds 10 sample properties to your database
   ```

5. **Access the App**
   Open http://localhost:8080 in your browser

## 📁 Project Structure

```
UrbanBUNK/
├── app.js                 # Main application file (minimal)
├── package.json           # Dependencies and scripts
├── .env.example           # Environment template
├── config/                # Configuration files
│   ├── database.js        # MongoDB connection
│   ├── middleware.js      # Express middleware
│   ├── auth-setup.js      # Passport authentication
│   └── routes.js          # Route registration
├── routes/                # Route handlers
│   ├── auth.js            # Authentication routes
│   ├── home.routes.js     # Home page
│   ├── index.routes.js    # Property listings
│   ├── favorites.routes.js # Favorites management
│   └── search.routes.js   # Search functionality
├── models/                # Database models
├── views/                 # EJS templates
└── public/                # Static assets
```

## 🌟 Features

- **User Authentication**: Register, login, logout with Passport.js
- **Property Listings**: Create, read, update, delete properties
- **Search Functionality**: Search properties by location, dates, guests
- **Favorites System**: Save and manage favorite properties
- **Protected Routes**: Owner-only permissions for editing/deleting
- **Cloud Database**: MongoDB Atlas for data persistence
- **Responsive Design**: Modern UI with TailwindCSS

## 🔧 Available Scripts

```bash
npm start          # Start the application
npm install        # Install all dependencies
```

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGO_URL` | MongoDB Atlas connection string | ✅ |
| `SESSION_SECRET` | Secret for session encryption | ✅ |

## 📋 Dependencies Included

All required packages are pre-configured in `package.json`:

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **passport** - Authentication
- **ejs** - Template engine
- **dotenv** - Environment variables
- **bcrypt** - Password hashing
- **connect-flash** - Flash messages
- **express-session** - Session management
- **method-override** - HTTP method override

## 🐛 Troubleshooting

### Database Connection Issues
If you see "❌ DB Error", check:
1. MongoDB Atlas cluster is running
2. IP address is whitelisted in Atlas (allow 0.0.0.0/0)
3. Username/password are correct in `.env`
4. Connection string format is correct

### Common Issues
- **Module not found**: Run `npm install`
- **Permission denied**: Check MongoDB Atlas IP whitelist
- **Server not starting**: Verify `.env` file exists and is configured
- **Port in use**: Stop any existing Node.js processes

### Quick Fix Commands
```bash
# Kill existing Node.js processes (Windows)
taskkill /f /im node.exe

# Restart server
npm start
```

## 📝 License

This project is licensed under the MIT License.