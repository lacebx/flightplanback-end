const express = require("express");
const router = express.Router();
const db = require("../models").default;
const Badge = db.badge;

// Create a new badge
router.post("/", async (req, res) => {
    try {
        const badge = await Badge.create(req.body);
        res.status(201).json(badge);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all badges
router.get("/", async (req, res) => {
    try {
        const badges = await Badge.findAll();
        res.status(200).json(badges);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a badge by ID
router.get("/:id", async (req, res) => {
    try {
        const badge = await Badge.findByPk(req.params.id);
        if (badge) {
            res.status(200).json(badge);
        } else {
            res.status(404).json({ message: "Badge not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a badge by ID
router.put("/:id", async (req, res) => {
    try {
        const [updated] = await Badge.update(req.body, {
            where: { badgeid: req.params.id }
        });
        if (updated) {
            const updatedBadge = await Badge.findByPk(req.params.id);
            res.status(200).json(updatedBadge);
        } else {
            res.status(404).json({ message: "Badge not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a badge by ID
router.delete("/:id", async (req, res) => {
    try {
        const deleted = await Badge.destroy({
            where: { badgeid: req.params.id }
        });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: "Badge not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 