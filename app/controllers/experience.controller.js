// app/controllers/experience.controller.js
import { Experience, User } from '../models/index.js';

// Create and Save a new Experience associated with a User
export const createExperience = async (req, res) => {
    try {
        const { user_id, category, type, name, description, pointsearned, reflectionrequired, schedulingtype } = req.body;

        // Validate request
        if (!user_id || !category || !type || !name || !description || !pointsearned || !reflectionrequired || !schedulingtype) {
            return res.status(400).send({ message: "All fields are required!" });
        }

        const experience = await Experience.create({
            user_id,
            category,
            type,
            name,
            description,
            pointsearned,
            reflectionrequired,
            schedulingtype,
        });
        res.status(201).json(experience);
    } catch (error) {
        res.status(500).send({ message: error.message || "Some error occurred while creating the Experience." });
    }
};

// Retrieve all Experiences from the database, including User details
export const findAllExperiences = async (req, res) => {
    try {
        const experiences = await Experience.findAll({
            include: User, // Include associated User details
        });
        res.status(200).json(experiences);
    } catch (error) {
        res.status(500).send({ message: error.message || "Some error occurred while retrieving experiences." });
    }
};

// Find a single Experience by ID, including User details
export const findExperienceById = async (req, res) => {
    try {
        const id = req.params.id;

        const experience = await Experience.findByPk(id, {
            include: User, // Include associated User details
        });
        if (experience) {
            res.status(200).json(experience);
        } else {
            res.status(404).send({ message: `Cannot find Experience with id=${id}.` });
        }
    } catch (error) {
        res.status(500).send({ message: "Error retrieving Experience with id=" + req.params.id });
    }
};

// Update an Experience by ID
export const updateExperience = async (req, res) => {
    try {
        const id = req.params.id;

        const [updated] = await Experience.update(req.body, {
            where: { experienceid: id },
        });

        if (updated) {
            const updatedExperience = await Experience.findByPk(id, {
                include: User, // Include associated User details
            });
            res.status(200).json(updatedExperience);
        } else {
            res.status(404).send({ message: `Cannot update Experience with id=${id}. Maybe Experience was not found or req.body is empty!` });
        }
    } catch (error) {
        res.status(500).send({ message: "Error updating Experience with id=" + id });
    }
};

// Delete an Experience by ID
export const deleteExperience = async (req, res) => {
    try {
        const id = req.params.id;

        const deleted = await Experience.destroy({
            where: { experienceid: id },
        });

        if (deleted) {
            res.status(204).send(); // No content to send back
        } else {
            res.status(404).send({ message: `Cannot delete Experience with id=${id}. Maybe Experience was not found!` });
        }
    } catch (error) {
        res.status(500).send({ message: "Could not delete Experience with id=" + id });
    }
};

// Delete all Experiences from the database
export const deleteAllExperiences = async (req, res) => {
    try {
        const nums = await Experience.destroy({
            where: {},
            truncate: false,
        });
        res.send({ message: `${nums} Experiences were deleted successfully!` });
    } catch (error) {
        res.status(500).send({ message: error.message || "Some error occurred while removing all experiences." });
    }
};