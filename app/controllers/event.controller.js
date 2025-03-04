// app/controllers/event.controller.js
import { Event } from '../models/event.model';
import { Flightplan } from '../models/flightplan.model';

// Create and Save a new Event associated with a Flightplan
export const createEvent = async (req, res) => {
    try {
        const { flightplan_id, name, description, eventtype, date, starttime, endtime, location, attendancetype } = req.body;

        // Validate request
        if (!flightplan_id || !name || !date) {
            return res.status(400).send({ message: "Flightplan ID, Event Name, and Date cannot be empty!" });
        }

        const event = await Event.create({
            flightplan_id,
            name,
            description,
            eventtype,
            date,
            starttime,
            endtime,
            location,
            attendancetype,
        });
        res.status(201).json(event);
    } catch (error) {
        res.status(500).send({ message: error.message || "Some error occurred while creating the Event." });
    }
};

// Retrieve all Events from the database, including Flightplan details
export const findAllEvents = async (req, res) => {
    try {
        const events = await Event.findAll({
            include: Flightplan, // Include associated Flightplan details
        });
        res.status(200).json(events);
    } catch (error) {
        res.status(500).send({ message: error.message || "Some error occurred while retrieving events." });
    }
};

// Find a single Event by ID, including Flightplan details
export const findEventById = async (req, res) => {
    try {
        const id = req.params.id;

        const event = await Event.findByPk(id, {
            include: Flightplan, // Include associated Flightplan details
        });
        if (event) {
            res.status(200).json(event);
        } else {
            res.status(404).send({ message: `Cannot find Event with id=${id}.` });
        }
    } catch (error) {
        res.status(500).send({ message: "Error retrieving Event with id=" + req.params.id });
    }
};

// Update an Event by ID
export const updateEvent = async (req, res) => {
    try {
        const id = req.params.id;

        const [updated] = await Event.update(req.body, {
            where: { eventid: id },
        });

        if (updated) {
            const updatedEvent = await Event.findByPk(id, {
                include: Flightplan, // Include associated Flightplan details
            });
            res.status(200).json(updatedEvent);
        } else {
            res.status(404).send({ message: `Cannot update Event with id=${id}. Maybe Event was not found or req.body is empty!` });
        }
    } catch (error) {
        res.status(500).send({ message: "Error updating Event with id=" + id });
    }
};

// Delete an Event by ID
export const deleteEvent = async (req, res) => {
    try {
        const id = req.params.id;

        const deleted = await Event.destroy({
            where: { eventid: id },
        });

        if (deleted) {
            res.status(204).send(); // No content to send back
        } else {
            res.status(404).send({ message: `Cannot delete Event with id=${id}. Maybe Event was not found!` });
        }
    } catch (error) {
        res.status(500).send({ message: "Could not delete Event with id=" + id });
    }
};

// Delete all Events from the database
export const deleteAllEvents = async (req, res) => {
    try {
        const nums = await Event.destroy({
            where: {},
            truncate: false,
        });
        res.send({ message: `${nums} Events were deleted successfully!` });
    } catch (error) {
        res.status(500).send({ message: error.message || "Some error occurred while removing all events." });
    }
};