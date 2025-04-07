const express = require("express");
const router = express.Router();
const db = require("../models");
const User = db.user;

// Middleware to check admin role
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};

// Get all users
router.get("/users", isAdmin, async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user points
router.put("/users/:id/points", isAdmin, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.points = req.body.points;
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 