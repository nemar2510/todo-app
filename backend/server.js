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

/* =========================
   🔥 TOKEN STORAGE
========================= */
let tokens = []; // temporary storage

app.post("/save-token", (req, res) => {
  const { token } = req.body;

  if (!tokens.includes(token)) {
    tokens.push(token);
    console.log("📱 Token saved:", token);
  }

  res.send("Token stored");
});

/* =========================
   DATABASE
========================= */
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

    const now = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata"
    });

    const date = new Date(now);

    const currentTime =
      date.getHours().toString().padStart(2, "0") +
      ":" +
      date.getMinutes().toString().padStart(2, "0");

    console.log("⏰ IST TIME:", currentTime);

    const tasks = await Task.find({ time: currentTime });

    for (let task of tasks) {
      console.log("📌 Task time:", task.time);
      console.log("🟢 Current time:", currentTime);

      // 🔥 SEND TO ALL DEVICES
      for (let t of tokens) {
        try {
          const response = await admin.messaging().send({
            token: t,
            notification: {
              title: "⏰ Task Reminder",
              body: task.title,
            },
          });

          console.log("✅ Notification sent to:", t);
        } catch (err) {
          console.log("❌ Error sending to token:", t, err.message);
        }
      }
    }
  } catch (err) {
    console.log("❌ Cron FULL ERROR:", err);
  }
});

/* =========================
   🔥 SEND NOTIFICATION API
========================= */
app.post("/send-notification", async (req, res) => {
  const { token, title, body } = req.body;

  try {
    const response = await admin.messaging().send({
      token,
      notification: {
        title,
        body,
      },
    });

    console.log("✅ Notification sent:", response);
    res.json({ success: true });

  } catch (err) {
    console.log("❌ Send Notification Error:", err);
    res.status(500).send(err.message);
  }
});

/* =========================
   TEST ROUTES
========================= */

app.get("/", (req, res) => {
  res.send("Server is working");
});

// 🔥 TEST NOTIFICATION → SEND TO ALL DEVICES
app.get("/test-notification", async (req, res) => {
  try {
    for (let t of tokens) {
      await admin.messaging().send({
        token: t,
        notification: {
          title: "🔥 Notification Working!",
          body: "Your app can now send reminders 🎉",
        },
      });
    }

    console.log("✅ SUCCESS: Notifications sent to all devices");
    res.send("Notification sent to all devices");

  } catch (err) {
    console.log("❌ FULL ERROR:", err);
    res.send(err.message);
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