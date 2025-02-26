const express = require("express");
const router = express.Router();
const db = require("../models").default;
const Experience = db.experience;

// Create a new experience
router.post("/", async (req, res) => {
    try {
        const experience = await Experience.create(req.body);
        res.status(201).json(experience);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all experiences
router.get("/", async (req, res) => {
    try {
        const experiences = await Experience.findAll();
        res.status(200).json(experiences);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get an experience by ID
router.get("/:id", async (req, res) => {
    try {
        const experience = await Experience.findByPk(req.params.id);
        if (experience) {
            res.status(200).json(experience);
        } else {
            res.status(404).json({ message: "Experience not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update an experience by ID
router.put("/:id", async (req, res) => {
    try {
        const [updated] = await Experience.update(req.body, {
            where: { experienceid: req.params.id }
        });
        if (updated) {
            const updatedExperience = await Experience.findByPk(req.params.id);
            res.status(200).json(updatedExperience);
        } else {
            res.status(404).json({ message: "Experience not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete an experience by ID
router.delete("/:id", async (req, res) => {
    try {
        const deleted = await Experience.destroy({
            where: { experienceid: req.params.id }
        });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: "Experience not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 