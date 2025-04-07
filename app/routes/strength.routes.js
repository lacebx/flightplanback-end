const express = require("express");
const router = express.Router();
const strengthController = require("../controllers/strength.controller");

// Get all strengths for a user
router.get("/user/:userId", strengthController.findAllByUser);

// Add or update a strength
router.post("/", strengthController.addOrUpdate);

module.exports = router; 