// app/controllers/user.controller.js
import { User } from '../models/user.model';
import { Document } from '../models/document.model';
import { Badge } from '../models/badge.model';
import { Experience } from '../models/experience.model';
import { Award } from '../models/award.model';
import { Flightplan } from '../models/flightplan.model';

// Create and Save a new User
export const createUser = async (req, res) => {
    try {
        const { name, email, graduationdate, major, pointsawarded, pointsused, pointavailable, badgesreceived, role } = req.body;

        // Validate request
        if (!name || !email || !role) {
            return res.status(400).send({ message: "Name, Email, and Role cannot be empty!" });
        }

        const user = await User.create({
            name,
            email,
            graduationdate,
            major,
            pointsawarded,
            pointsused,
            pointavailable,
            badgesreceived,
            role,
        });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).send({ message: error.message || "Some error occurred while creating the User." });
    }
};

// Retrieve all Users from the database, including their relationships
export const findAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            include: [
                Document,
                Badge,
                Experience,
                Award,
                Flightplan // Include all associated models
            ],
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).send({ message: error.message || "Some error occurred while retrieving users." });
    }
};

// Find a single User by ID, including their relationships
export const findUserById = async (req, res) => {
    try {
        const id = req.params.id;

        const user = await User.findByPk(id, {
            include: [
                Document,
                Badge,
                Experience,
                Award,
                Flightplan // Include all associated models
            ],
        });
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).send({ message: `Cannot find User with id=${id}.` });
        }
    } catch (error) {
        res.status(500).send({ message: "Error retrieving User with id=" + req.params.id });
    }
};

// Update a User by ID
export const updateUser = async (req, res) => {
    try {
        const id = req.params.id;

        const [updated] = await User.update(req.body, {
            where: { userID: id },
        });

        if (updated) {
            const updatedUser = await User.findByPk(id, {
                include: [
                    Document,
                    Badge,
                    Experience,
                    Award,
                    Flightplan // Include all associated models
                ],
            });
            res.status(200).json(updatedUser);
        } else {
            res.status(404).send({ message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!` });
        }
    } catch (error) {
        res.status(500).send({ message: "Error updating User with id=" + id });
    }
};

// Delete a User by ID
export const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;

        const deleted = await User.destroy({
            where: { userID: id },
        });

        if (deleted) {
            res.status(204).send(); // No content to send back
        } else {
            res.status(404).send({ message: `Cannot delete User with id=${id}. Maybe User was not found!` });
        }
    } catch (error) {
        res.status(500).send({ message: "Could not delete User with id=" + id });
    }
};

// Delete all Users from the database
export const deleteAllUsers = async (req, res) => {
    try {
        const nums = await User.destroy({
            where: {},
            truncate: false,
        });
        res.send({ message: `${nums} Users were deleted successfully!` });
    } catch (error) {
        res.status(500).send({ message: error.message || "Some error occurred while removing all users." });
    }
};