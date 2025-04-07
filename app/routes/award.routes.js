// app/routes/award.routes.js
import express from 'express';
import {
    createAward,
    findAllAwards,
    findAwardById,
    updateAward,
    deleteAward,
    deleteAllAwards
} from '../controllers/award.controller.js';

export const awardRouter = express.Router();

awardRouter.post('/', createAward);                // Create a new award
awardRouter.get('/', findAllAwards);                // Retrieve all awards
awardRouter.get('/:id', findAwardById);            // Retrieve an award by ID
awardRouter.put('/:id', updateAward);              // Update an award by ID
awardRouter.delete('/:id', deleteAward);           // Delete an award by ID
awardRouter.delete('/', deleteAllAwards);           // Delete all awards

