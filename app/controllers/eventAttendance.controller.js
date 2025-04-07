const db = require("../models");
const EventAttendance = db.eventAttendance;

// Mark event as attended
exports.markAttended = async (req, res) => {
  try {
    const { userId, eventId } = req.body;
    const eventAttendance = await EventAttendance.findOrCreate({
      where: { userId, eventId },
      defaults: { attended: true },
    });
    res.status(200).json(eventAttendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 