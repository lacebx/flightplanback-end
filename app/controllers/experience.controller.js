const db = require("../models");
const Experience = db.experience;

// Create a new experience
exports.create = async (req, res) => {
    try {
        const experience = await Experience.create(req.body);
        res.status(201).json(experience);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all experience
exports.findAll = async (req, res) => {
    try {
        const experience = await Experience.findAll();
        res.status(200).json(experience);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get an experience by ID
exports.findOne = async (req, res) => {
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
};

// Update an experience by ID
exports.update = async (req, res) => {
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
};

// Delete an experience by ID
exports.delete = async (req, res) => {
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
}; 