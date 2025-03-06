// app/routes/flightplan.routes.js
import express from 'express';
import {
    createFlightplan,
    findAllFlightplans,
    findFlightplanById,
    updateFlightplan,
    deleteFlightplan,
    deleteAllFlightplans
} from '../controllers/flightplan.controller.js';

export const flightplanRouter = express.Router();

flightplanRouter.post('/', createFlightplan);               // Create a new flightplan
flightplanRouter.get('/', findAllFlightplans);               // Retrieve all flightplans
flightplanRouter.get('/:id', findFlightplanById);           // Retrieve a flightplan by ID
flightplanRouter.put('/:id', updateFlightplan);             // Update a flightplan by ID
flightplanRouter.delete('/:id', deleteFlightplan);          // Delete a flightplan by ID
flightplanRouter.delete('/', deleteAllFlightplans);          // Delete all flightplans

