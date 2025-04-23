const db = require("../models");
const EventAttendance = db.eventAttendance;
const User = db.user;
const Event = db.event;

// Mark event as attended
exports.markAttended = async (req, res) => {
  try {
    const { userId, eventId } = req.body;
    
    // Find the event to get its earnable points
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Find or create the attendance record
    const [eventAttendance, created] = await EventAttendance.findOrCreate({
      where: { userId, eventId },
      defaults: { attended: true },
    });

    // If the attendance record already existed and wasn't marked as attended
    if (!created && !eventAttendance.attended) {
      eventAttendance.attended = true;
      await eventAttendance.save();
    }

    // If the attendance is being marked as attended (either new or updated)
    if (eventAttendance.attended) {
      // Find the user and add the points
      const user = await User.findByPk(userId);
      if (user) {
        user.points += event.earnablepoints;
        await user.save();
      }
    }

    res.status(200).json(eventAttendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 