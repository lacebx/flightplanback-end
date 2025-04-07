const express = require("express");
const router = express.Router();
const taskCompletionController = require("../controllers/taskCompletion.controller");

// Mark task as completed
router.post("/complete", taskCompletionController.markCompleted);

module.exports = router; 