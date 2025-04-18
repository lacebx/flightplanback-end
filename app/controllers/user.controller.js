const db = require("../models");
const User = db.user;

// Get all users
exports.findAll = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user role
exports.updateRole = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.role = req.body.role;
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create or update a user
exports.createOrUpdate = async (req, res) => {
  try {
    const { idNumber, firstName, lastName, major, role } = req.body;
    const [user, created] = await User.findOrCreate({
      where: { idNumber },
      defaults: { firstName, lastName, major, role },
    });

    if (!created) {
      user.firstName = firstName;
      user.lastName = lastName;
      user.major = major;
      user.role = role;
      await user.save();
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user profile by email
exports.findProfileByEmail = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.params.email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 