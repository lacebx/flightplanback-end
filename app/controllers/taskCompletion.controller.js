const db = require("../models");
const TaskCompletion = db.taskCompletion;
const Task = db.task;
const User = db.user;

// Mark task as completed
exports.markCompleted = async (req, res) => {
  try {
    const { userId, taskId } = req.body;
    const taskCompletion = await TaskCompletion.findOrCreate({
      where: { userId, taskId },
      defaults: { completed: true },
    });

    // If the task is being marked as completed
    if (taskCompletion[0].completed) {
      const task = await Task.findByPk(taskId);
      const user = await User.findByPk(userId);
      if (task && user) {
        user.points += task.earnablepoints;
        await user.save();
      }
    }

    res.status(200).json(taskCompletion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 