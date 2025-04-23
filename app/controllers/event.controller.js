    const db = require("../models");
    const Event = db.event;

    // Create a new event
    exports.create = async (req, res) => {
        try {
            const event = await Event.create(req.body);
            res.status(201).json(event);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    // Get all events
    exports.findAll = async (req, res) => {
        try {
            const events = await Event.findAll();
            res.status(200).json(events);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    // Get an event by ID
    exports.findOne = async (req, res) => {
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
    };

    // Update an event by ID
    exports.update = async (req, res) => {
        try {
            // Check if the user is an admin
            if (req.user.role !== 'admin') {
                return res.status(403).json({ message: "Forbidden: Only admins can update events." });
            }

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
    };

    // Delete an event by ID
    exports.delete = async (req, res) => {
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
    }; 