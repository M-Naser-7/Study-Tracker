const Task = require("../models/Task");

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return res.json(tasks);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

const createTask = async (req, res) => {
  try {
    const { subject, topic, deadline, priority, completed } = req.body;
    if (!subject || !topic) {
      return res.status(400).json({ message: "Subject and topic are required" });
    }

    const task = await Task.create({
      userId: req.user.id,
      subject,
      topic,
      deadline: deadline ? new Date(deadline) : undefined,
      priority,
      completed: Boolean(completed),
    });

    return res.status(201).json(task);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create task" });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { subject, topic, deadline, priority, completed } = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      {
        ...(subject !== undefined && { subject }),
        ...(topic !== undefined && { topic }),
        ...(deadline !== undefined && { deadline: deadline ? new Date(deadline) : null }),
        ...(priority !== undefined && { priority }),
        ...(completed !== undefined && { completed: Boolean(completed) }),
      },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.json(task);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update task" });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOneAndDelete({ _id: id, userId: req.user.id });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.json({ message: "Task deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete task" });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
