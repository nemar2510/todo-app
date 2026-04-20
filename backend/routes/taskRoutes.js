const express = require("express");
const router = express.Router();

const Task = require("../models/Task");
const auth = require("../middleware/auth");

// GET TASKS
router.get("/", auth, async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id });
  res.json(tasks);
});

// ADD TASK
router.post("/", auth, async (req, res) => {
  const { title, time } = req.body;

  const task = new Task({
    title,
    time, // optional
    userId: req.user.id,
    completed: false
  });

  await task.save();
  res.json(task);
});

// ✅ EDIT + DONE (SAME ROUTE)
router.put("/:id", auth, async (req, res) => {
  const updated = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

// DELETE
router.delete("/:id", auth, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;