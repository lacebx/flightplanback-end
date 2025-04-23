const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const db = require("../models/index");

// Get all users
router.get("/", userController.findAll);

// Update user role
router.put("/:id/role", userController.updateRole);

// Create or update a user
router.post("/", userController.createOrUpdate);

// Get user profile by email
router.get("/profile/:email", userController.findProfileByEmail);

module.exports = router; 