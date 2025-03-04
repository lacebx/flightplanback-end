// app/controllers/award.controller.js
import { Award } from '../models/award.model';
import { User } from '../models/user.model';


// Create and Save a new Award associated with a User
export const createAward = async (req, res) => {
    try {
        const { user_id, name, description, points, redemptiontype, redemptioninfo } = req.body;

        // Validate request
        if (!user_id || !name) {
            return res.status(400).send({ message: "User ID and Award Name cannot be empty!" });
        }

        const award = await Award.create({
            user_id,
            name,
            description,
            points,
            redemptiontype,
            redemptioninfo,
        });
        res.status(201).json(award);
    } catch (error) {
        res.status(500).send({ message: error.message || "Some error occurred while creating the Award." });
    }
};

// Retrieve all Awards from the database, including User details
export const findAllAwards = async (req, res) => {
    try {
        const awards = await Award.findAll({
            include: User, // Include associated User details
        });
        res.status(200).json(awards);
    } catch (error) {
        res.status(500).send({ message: error.message || "Some error occurred while retrieving awards." });
    }
};

// Find a single Award by ID, including User details
export const findAwardById = async (req, res) => {
    try {
        const id = req.params.id;

        const award = await Award.findByPk(id, {
            include: User, // Include associated User details
        });
        if (award) {
            res.status(200).json(award);
        } else {
            res.status(404).send({ message: `Cannot find Award with id=${id}.` });
        }
    } catch (error) {
        res.status(500).send({ message: "Error retrieving Award with id=" + req.params.id });
    }
};

// Update an Award by ID
export const updateAward = async (req, res) => {
    try {
        const id = req.params.id;

        const [updated] = await Award.update(req.body, {
            where: { awardid: id },
        });

        if (updated) {
            const updatedAward = await Award.findByPk(id, {
                include: User, // Include associated User details
            });
            res.status(200).json(updatedAward);
        } else {
            res.status(404).send({ message: `Cannot update Award with id=${id}. Maybe Award was not found or req.body is empty!` });
        }
    } catch (error) {
        res.status(500).send({ message: "Error updating Award with id=" + id });
    }
};

// Delete an Award by ID
export const deleteAward = async (req, res) => {
    try {
        const id = req.params.id;

        const deleted = await Award.destroy({
            where: { awardid: id },
        });

        if (deleted) {
            res.status(204).send(); // No content to send back
        } else {
            res.status(404).send({ message: `Cannot delete Award with id=${id}. Maybe Award was not found!` });
        }
    } catch (error) {
        res.status(500).send({ message: "Could not delete Award with id=" + id });
    }
};

// Delete all Awards from the database
export const deleteAllAwards = async (req, res) => {
    try {
        const nums = await Award.destroy({
            where: {},
            truncate: false,
        });
        res.send({ message: `${nums} Awards were deleted successfully!` });
    } catch (error) {
        res.status(500).send({ message: error.message || "Some error occurred while removing all awards." });
    }
};