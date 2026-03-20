# URBAN-B

A Web-Based Accommodation Booking Platform

## 🚀 How to Run the Project (For Friends/Collaborators)

If you downloaded or cloned this project from GitHub, you **must set up the environment variables** before running the server. For security reasons, the `.env` file containing database passwords is not uploaded to GitHub.

### Step 1: Install Dependencies
Open your terminal in the project folder and run:
```bash
npm install
```

### Step 2: Set Up Environment Variables (`.env`)
1. In the project folder, create a new file named exactly `.env`.
2. Open `.env.example` in your code editor.
3. Copy all the contents from `.env.example` and paste them into your new `.env` file.
4. **Important**: Ask the project owner for the correct `MONGO_URL` to connect to the shared database, and replace the placeholder in your `.env` file with it.

Your `.env` file should look something like this:
```env
MONGO_URL=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/wanderlust?retryWrites=true&w=majority
SESSION_SECRET=your-secret-key-here
```

### Step 3: Start the Server
Now you can start the application by running:
```bash
npm start
```
The server will connect to MongoDB and start on `http://localhost:8080`.

---
*Note: If you are seeing a "DATABASE CONNECTION ERROR", it means your `.env` file is missing, misnamed, or has an incorrect `MONGO_URL`.*