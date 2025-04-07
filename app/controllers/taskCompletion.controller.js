const db = require("../models");
const TaskCompletion = db.taskCompletion;

// Mark task as completed
exports.markCompleted = async (req, res) => {
  try {
    const { userId, taskId } = req.body;
    const taskCompletion = await TaskCompletion.findOrCreate({
      where: { userId, taskId },
      defaults: { completed: true },
    });
    res.status(200).json(taskCompletion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 