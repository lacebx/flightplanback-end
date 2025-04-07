const express = require("express");
const router = express.Router();
const eventAttendanceController = require("../controllers/eventAttendance.controller");

// Mark event as attended
router.post("/attend", eventAttendanceController.markAttended);

module.exports = router; 