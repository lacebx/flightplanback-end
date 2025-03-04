// app/routes/experience.routes.js
import express from 'express';
import {
    createExperience,
    findAllExperiences,
    findExperienceById,
    updateExperience,
    deleteExperience,
    deleteAllExperiences
} from '../controllers/experience.controller';

export const experienceRouter = express.Router();

experienceRouter.post('/', createExperience);                // Create a new experience
experienceRouter.get('/', findAllExperiences);                // Retrieve all experiences
experienceRouter.get('/:id', findExperienceById);            // Retrieve an experience by ID
experienceRouter.put('/:id', updateExperience);              // Update an experience by ID
experienceRouter.delete('/:id', deleteExperience);           // Delete an experience by ID
experienceRouter.delete('/', deleteAllExperiences);           // Delete all experiences

