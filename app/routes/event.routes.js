// app/routes/event.routes.js
import express from 'express';
import {
    createEvent,
    findAllEvents,
    findEventById,
    updateEvent,
    deleteEvent,
    deleteAllEvents
} from '../controllers/event.controller.js';

export const eventRouter = express.Router();

eventRouter.post('/', createEvent);                // Create a new event
eventRouter.get('/', findAllEvents);                // Retrieve all events
eventRouter.get('/:id', findEventById);            // Retrieve an event by ID
eventRouter.put('/:id', updateEvent);              // Update an event by ID
eventRouter.delete('/:id', deleteEvent);           // Delete an event by ID
eventRouter.delete('/', deleteAllEvents);           // Delete all events

