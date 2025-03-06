// app/controllers/flightplan.controller.js
import { Flightplan, Task, Event, User } from '../models/index.js';

// Create and Save a new Flightplan associated with a User
export const createFlightplan = async (req, res) => {
    try {
        const { user_id, Semester, SemestersFromGraduation, Status } = req.body;

        // Validate request
        if (!user_id || !Semester || SemestersFromGraduation === undefined || !Status) {
            return res.status(400).send({ message: "User ID, Semester, Semesters From Graduation, and Status cannot be empty!" });
        }

        const flightplan = await Flightplan.create({
            user_id,
            Semester,
            SemestersFromGraduation,
            Status,
        });
        res.status(201).json(flightplan);
    } catch (error) {
        res.status(500).send({ message: error.message || "Some error occurred while creating the Flightplan." });
    }
};

// Retrieve all Flightplans from the database, including User and associated Task and Event details
export const findAllFlightplans = async (req, res) => {
    try {
        const flightplans = await Flightplan.findAll({
            include: [
                { model: User, attributes: ['userID', 'name'] }, // Include User details
                { model: Task }, // Include associated Task details
                { model: Event }  // Include associated Event details
            ],
        });
        res.status(200).json(flightplans);
    } catch (error) {
        res.status(500).send({ message: error.message || "Some error occurred while retrieving flightplans." });
    }
};

// Find a single Flightplan by ID, including User, Tasks, and Events details
export const findFlightplanById = async (req, res) => {
    try {
        const id = req.params.id;

        const flightplan = await Flightplan.findByPk(id, {
            include: [
                { model: User, attributes: ['userID', 'name'] }, // Include User details
                { model: Task }, // Include associated Task details
                { model: Event }  // Include associated Event details
            ],
        });
        if (flightplan) {
            res.status(200).json(flightplan);
        } else {
            res.status(404).send({ message: `Cannot find Flightplan with id=${id}.` });
        }
    } catch (error) {
        res.status(500).send({ message: "Error retrieving Flightplan with id=" + req.params.id });
    }
};

// Update a Flightplan by ID
export const updateFlightplan = async (req, res) => {
    try {
        const id = req.params.id;

        const [updated] = await Flightplan.update(req.body, {
            where: { flightplanID: id },
        });

        if (updated) {
            const updatedFlightplan = await Flightplan.findByPk(id, {
                include: [
                    { model: User, attributes: ['userID', 'name'] }, // Include User details
                    { model: Task }, // Include associated Task details
                    { model: Event }  // Include associated Event details
                ],
            });
            res.status(200).json(updatedFlightplan);
        } else {
            res.status(404).send({ message: `Cannot update Flightplan with id=${id}. Maybe Flightplan was not found or req.body is empty!` });
        }
    } catch (error) {
        res.status(500).send({ message: "Error updating Flightplan with id=" + id });
    }
};

// Delete a Flightplan by ID
export const deleteFlightplan = async (req, res) => {
    try {
        const id = req.params.id;

        const deleted = await Flightplan.destroy({
            where: { flightplanID: id },
        });

        if (deleted) {
            res.status(204).send(); // No content to send back
        } else {
            res.status(404).send({ message: `Cannot delete Flightplan with id=${id}. Maybe Flightplan was not found!` });
        }
    } catch (error) {
        res.status(500).send({ message: "Could not delete Flightplan with id=" + id });
    }
};

// Delete all Flightplans from the database
export const deleteAllFlightplans = async (req, res) => {
    try {
        const nums = await Flightplan.destroy({
            where: {},
            truncate: false,
        });
        res.send({ message: `${nums} Flightplans were deleted successfully!` });
    } catch (error) {
        res.status(500).send({ message: error.message || "Some error occurred while removing all flightplans." });
    }
};