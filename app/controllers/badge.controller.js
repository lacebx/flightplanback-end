// app/controllers/badge.controller.js
import { Badge, User } from '../models/index.js';


// Create and Save a new Badge associated with a User
export const createBadge = async (req, res) => {
    try {
        const { user_id, name, description, type, points } = req.body;

        // Validate request
        if (!user_id || !name) {
            return res.status(400).send({ message: "User ID and Badge Name cannot be empty!" });
        }

        const badge = await Badge.create({
            user_id,
            name,
            description,
            type,
            points,
        });
        res.status(201).json(badge);
    } catch (error) {
        res.status(500).send({ message: error.message || "Some error occurred while creating the Badge." });
    }
};

// Retrieve all Badges from the database, including User details
export const findAllBadges = async (req, res) => {
    try {
        const { userId, minPoints } = req.query; // Example of query parameters

        const condition = {};
        if (userId) {
            condition.user_id = userId; // Filter by user_id if provided
        }
        if (minPoints) {
            condition.points = { $gte: minPoints }; // Filter by points if provided (using a different syntax)
        }

        const badges = await Badge.findAll({
            where: condition,
            include: User, // Include associated User details
        });
        res.status(200).json(badges);
    } catch (error) {
        res.status(500).send({ message: error.message || "Some error occurred while retrieving badges." });
    }
};

// Find a single Badge by ID, including User details
export const findBadgeById = async (req, res) => {
    try {
        const id = req.params.id;

        const badge = await Badge.findByPk(id, {
            include: User, // Include associated User details
        });
        if (badge) {
            res.status(200).json(badge);
        } else {
            res.status(404).send({ message: `Cannot find Badge with id=${id}.` });
        }
    } catch (error) {
        res.status(500).send({ message: "Error retrieving Badge with id=" + req.params.id });
    }
};

// Update a Badge by ID
export const updateBadge = async (req, res) => {
    try {
        const id = req.params.id;

        const [updated] = await Badge.update(req.body, {
            where: { badgeid: id },
        });

        if (updated) {
            const updatedBadge = await Badge.findByPk(id, {
                include: User, // Include associated User details
            });
            res.status(200).json(updatedBadge);
        } else {
            res.status(404).send({ message: `Cannot update Badge with id=${id}. Maybe Badge was not found or req.body is empty!` });
        }
    } catch (error) {
        res.status(500).send({ message: "Error updating Badge with id=" + id });
    }
};

// Delete a Badge by ID
export const deleteBadge = async (req, res) => {
    try {
        const id = req.params.id;

        const deleted = await Badge.destroy({
            where: { badgeid: id },
        });

        if (deleted) {
            res.status(204).send(); // No content to send back
        } else {
            res.status(404).send({ message: `Cannot delete Badge with id=${id}. Maybe Badge was not found!` });
        }
    } catch (error) {
        res.status(500).send({ message: "Could not delete Badge with id=" + id });
    }
};

// Delete all Badges from the database
export const deleteAllBadges = async (req, res) => {
    try {
        const nums = await Badge.destroy({
            where: {},
            truncate: false,
        });
        res.send({ message: `${nums} Badges were deleted successfully!` });
    } catch (error) {
        res.status(500).send({ message: error.message || "Some error occurred while removing all badges." });
    }
};