const db = require("../models").default;
const Award = db.award;

// Create a new award
exports.create = async (req, res) => {
    try {
        const award = await Award.create(req.body);
        res.status(201).json(award);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all awards
exports.findAll = async (req, res) => {
    try {
        const awards = await Award.findAll();
        res.status(200).json(awards);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get an award by ID
exports.findOne = async (req, res) => {
    try {
        const award = await Award.findByPk(req.params.id);
        if (award) {
            res.status(200).json(award);
        } else {
            res.status(404).json({ message: "Award not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an award by ID
exports.update = async (req, res) => {
    try {
        const [updated] = await Award.update(req.body, {
            where: { awardid: req.params.id }
        });
        if (updated) {
            const updatedAward = await Award.findByPk(req.params.id);
            res.status(200).json(updatedAward);
        } else {
            res.status(404).json({ message: "Award not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete an award by ID
exports.delete = async (req, res) => {
    try {
        const deleted = await Award.destroy({
            where: { awardid: req.params.id }
        });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: "Award not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 