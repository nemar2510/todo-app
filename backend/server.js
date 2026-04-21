const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// load environment variables
require("dotenv").config({ path: "./.env" });

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.log("❌ Mongo Error:", err.message);
    process.exit(1); // stop app if DB fails
  });

// test route
app.get("/", (req, res) => {
  res.send("Server is working");
});

// routes (uncomment when needed)
// app.use("/api/auth", require("./routes/authRoutes"));
// app.use("/api/tasks", require("./routes/taskRoutes"));

// start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});