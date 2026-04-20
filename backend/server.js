require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");   // ✅ ADD THIS

const app = express();

app.use(cors());                // ✅ ADD THIS
app.use(express.json());

// routes
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ Mongo Error:", err));

// test route
app.get("/", (req, res) => {
  res.send("Server is working");
});

// start server
app.listen(5000, () => {
  console.log("🚀 Server started on port 5000");
});