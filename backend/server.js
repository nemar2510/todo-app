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
      const token =
        "dErcvjUS80_LfDMs0CER-a:APA91bEDBbisOJLCCCkW_cY_YwpS0TGCP_wWfNIjOgQwQPbHfvZnmpizfB65FWhegxgETYHwPv41ZpxWxzViJuPYObdqOeQIDd9JIuxWS3iLepA6OinfGGs";

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
      "dErcvjUS80_LfDMs0CER-a:APA91bEDBbisOJLCCCkW_cY_YwpS0TGCP_wWfNIjOgQwQPbHfvZnmpizfB65FWhegxgETYHwPv41ZpxWxzViJuPYObdqOeQIDd9JIuxWS3iLepA6OinfGGs";

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