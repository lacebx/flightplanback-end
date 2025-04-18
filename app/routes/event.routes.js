const express = require("express");
const router = express.Router();
const db = require("../models");
const Event = db.event;

// Create a new event
router.post("/", async (req, res) => {
    try {
        const event = await Event.create(req.body);
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all events
router.get("/", async (req, res) => {
    try {
        const events = await Event.findAll();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get an event by ID
router.get("/:id", async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (event) {
            res.status(200).json(event);
        } else {
            res.status(404).json({ message: "Event not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update an event by ID
router.put("/:id", async (req, res) => {
    try {
        const [updated] = await Event.update(req.body, {
            where: { eventid: req.params.id }
        });
        if (updated) {
            const updatedEvent = await Event.findByPk(req.params.id);
            res.status(200).json(updatedEvent);
        } else {
            res.status(404).json({ message: "Event not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete an event by ID
router.delete("/:id", async (req, res) => {
    try {
        const deleted = await Event.destroy({
            where: { eventid: req.params.id }
        });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: "Event not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Register for an event
router.post('/:id/register', async (req, res) => {
    try {
        const { name, email, isVisible } = req.body;
        const eventId = req.params.id;

        
        
       

    } catch (error) {
        console.error('Error registering for event:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router; 