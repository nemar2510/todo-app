const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: String,
  completed: { type: Boolean, default: false },
  userId: String,
  time: String // ⏰ for reminder
});

module.exports = mongoose.model("Task", taskSchema);