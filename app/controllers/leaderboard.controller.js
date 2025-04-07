const db = require("../models");
const User = db.user;
const TaskCompletion = db.taskCompletion;
const EventAttendance = db.eventAttendance;

exports.getLeaderboard = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: TaskCompletion,
          where: { completed: true },
          required: false,
        },
        {
          model: EventAttendance,
          where: { attended: true },
          required: false,
        },
      ],
    });

    const leaderboard = users.map(user => ({
      userId: user.id,
      name: user.name,
      points: user.taskCompletions.length + user.eventAttendances.length,
    }));

    leaderboard.sort((a, b) => b.points - a.points);

    res.status(200).json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 