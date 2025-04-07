// app/controllers/task.controller.js
import { Task, Flightplan } from '../models/index.js';

// Create and Save a new Task associated with a Flightplan
export const createTask = async (req, res) => {
    try {
        const { flightplan_id, category, type, name, descripion, pointesearned, reflectionrequired, shedulingtype, completiontype } = req.body;

        // Validate request
        if (!flightplan_id || !name) {
            return res.status(400).send({ message: "Flightplan ID and Task Name cannot be empty!" });
        }

        const task = await Task.create({
            flightplan_id,
            category,
            type,
            name,
            descripion,
            pointesearned,
            reflectionrequired,
            shedulingtype,
            completiontype,
        });
        res.status(201).json(task);
    } catch (error) {
        res.status(500).send({ message: error.message || "Some error occurred while creating the Task." });
    }
};

// Retrieve all Tasks from the database, including Flightplan details
export const findAllTasks = async (req, res) => {
    try {
        const tasks = await Task.findAll({
            include: Flightplan, // Include associated Flightplan details
        });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).send({ message: error.message || "Some error occurred while retrieving tasks." });
    }
};

// Find a single Task by ID, including Flightplan details
export const findTaskById = async (req, res) => {
    try {
        const id = req.params.id;

        const task = await Task.findByPk(id, {
            include: Flightplan, // Include associated Flightplan details
        });
        if (task) {
            res.status(200).json(task);
        } else {
            res.status(404).send({ message: `Cannot find Task with id=${id}.` });
        }
    } catch (error) {
        res.status(500).send({ message: "Error retrieving Task with id=" + req.params.id });
    }
};

// Update a Task by ID
export const updateTask = async (req, res) => {
    try {
        const id = req.params.id;

        const [updated] = await Task.update(req.body, {
            where: { Taskid: id },
        });

        if (updated) {
            const updatedTask = await Task.findByPk(id, {
                include: Flightplan, // Include associated Flightplan details
            });
            res.status(200).json(updatedTask);
        } else {
            res.status(404).send({ message: `Cannot update Task with id=${id}. Maybe Task was not found or req.body is empty!` });
        }
    } catch (error) {
        res.status(500).send({ message: "Error updating Task with id=" + id });
    }
};

// Delete a Task by ID
export const deleteTask = async (req, res) => {
    try {
        const id = req.params.id;

        const deleted = await Task.destroy({
            where: { Taskid: id },
        });

        if (deleted) {
            res.status(204).send(); // No content to send back
        } else {
            res.status(404).send({ message: `Cannot delete Task with id=${id}. Maybe Task was not found!` });
        }
    } catch (error) {
        res.status(500).send({ message: "Could not delete Task with id=" + id });
    }
};

// Delete all Tasks from the database
export const deleteAllTasks = async (req, res) => {
    try {
        const nums = await Task.destroy({
            where: {},
            truncate: false,
        });
        res.send({ message: `${nums} Tasks were deleted successfully!` });
    } catch (error) {
        res.status(500).send({ message: error.message || "Some error occurred while removing all tasks." });
    }
};