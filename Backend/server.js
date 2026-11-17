const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, ".env")
});

const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const { protect } = require("./middleware/authMiddleware");
const userDataRoutes = require("./routes/userDataRoutes");

const app = express();
const PORT = process.env.PORT || 5000;


if (!process.env.MONGODB_URI) {
  console.error("Missing MONGODB_URI in .env");
  process.exit(1);
}
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error("JWT_SECRET must be set and contain at least 32 characters.");
  process.exit(1);
}

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Frontend files: public/index.html, style.css and script.js
app.use(express.static(path.join(__dirname, "../Frontend/public")));

// Original ExamPrepAI application
app.use(
  "/app",
  protect,
  express.static(path.join(__dirname, "../Frontend/app"))
);


app.use("/api/auth", authRoutes);
app.use("/api/user-data", userDataRoutes);

// Protected demo page. Keep dashboard.html outside the public folder.
app.get("/dashboard", protect, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "dashboard.html"));
});

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "ExamPrepAI API is running" });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`ExamPrepAI server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Could not connect to MongoDB:", error.message);
    process.exit(1);
  }
}

startServer();
