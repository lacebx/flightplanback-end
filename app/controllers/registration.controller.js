const db = require("../models");
const Registration = db.registration;

exports.registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { name, email } = req.body;

    if (!eventId || !name || !email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const registration = await Registration.create({ eventId, name, email });
    res.status(201).json(registration);
  } catch (error) {
    console.error('Error in registerForEvent:', error);
    res.status(500).json({ message: error.message });
  }
}; 