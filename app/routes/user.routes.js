const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const db = require("../models/db");

// Get all users
router.get("/", userController.findAll);

// Update user role
router.put("/:userId/role", async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  try {
    const user = await db.user.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.status(200).json({ message: 'Role updated successfully' });
  } catch (err) {
    console.error('Error updating role:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create or update a user
router.post("/", userController.createOrUpdate);

// Get user profile by email
router.get("/profile/:email", userController.findProfileByEmail);

module.exports = router; 