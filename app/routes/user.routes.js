const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

// Get all users
router.get("/", userController.findAll);

// Update user role
router.put("/:id/role", userController.updateRole);

// Create or update a user
router.post("/", userController.createOrUpdate);

module.exports = router; 