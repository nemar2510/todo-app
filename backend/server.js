const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cron = require("node-cron");

// 🔥 Firebase Admin
const admin = require("./firebaseAdmin");

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
    process.exit(1);
  });

/* =========================
   🔥 AUTO REMINDER CHECK
========================= */
cron.schedule("* * * * *", async () => {
  console.log("⏰ Checking tasks...");

  try {
    const Task = require("./models/Task");

    const now = new Date();
    const currentTime =
      now.getHours().toString().padStart(2, "0") +
      ":" +
      now.getMinutes().toString().padStart(2, "0");

    const tasks = await Task.find({ time: currentTime });

    for (let task of tasks) {
      const token =
        "dzEKp1rbB0LVTbZF903x8P:APA91bFuw47U4ZEw-v8LTVOuY6V0IqVn5yUEI8_1jhHlyHKBfJCb38ZX2zI7-p1t_JodutcwyNRwltU_egZiou_1QV0piRkEgwFqkc327D4Wv2WOkYxutao";

      const response = await admin.messaging().send({
        token,
        notification: {
          title: "⏰ Task Reminder",
          body: task.title,
        },
      });

      console.log("✅ Notification sent:", response);
    }
  } catch (err) {
    console.log("❌ Cron FULL ERROR:", err); // 🔥 full error
  }
});

/* =========================
   TEST ROUTES
========================= */

app.get("/", (req, res) => {
  res.send("Server is working");
});

// 🔥 Notification test route (UPDATED)
app.get("/test-notification", async (req, res) => {
  try {
    const token =
      "dzEKp1rbB0LVTbZF903x8P:APA91bFuw47U4ZEw-v8LTVOuY6V0IqVn5yUEI8_1jhHlyHKBfJCb38ZX2zI7-p1t_JodutcwyNRwltU_egZiou_1QV0piRkEgwFqkc327D4Wv2WOkYxutao";

    const response = await admin.messaging().send({
      token,
      notification: {
        title: "🔥 Notification Working!",
        body: "Your app can now send reminders 🎉",
      },
    });

    console.log("✅ SUCCESS:", response);
    res.send("Notification sent");
  } catch (err) {
    console.log("❌ FULL ERROR:", err); // 🔥 IMPORTANT
    res.send(err.message); // 🔥 shows real error in browser
  }
});

/* =========================
   ROUTES
========================= */

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));

/* =========================
   SERVER
========================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});