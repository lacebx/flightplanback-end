const db = require("../models");
const Strength = db.strength;

// Get all strengths for a user
exports.findAllByUser = async (req, res) => {
  try {
    const strengths = await Strength.findAll({ where: { userId: req.params.userId } });
    res.status(200).json(strengths);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add or update a strength
exports.addOrUpdate = async (req, res) => {
  try {
    const { userId, name, description, score } = req.body;
    const [strength, created] = await Strength.findOrCreate({
      where: { userId, name },
      defaults: { description, score },
    });

    if (!created) {
      strength.description = description;
      strength.score = score;
      await strength.save();
    }

    res.status(200).json(strength);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 