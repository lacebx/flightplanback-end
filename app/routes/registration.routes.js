const express = require("express");
const router = express.Router();
const registrationController = require("../controllers/registration.controller");

router.post("/:eventId/register", registrationController.registerForEvent);

module.exports = router;