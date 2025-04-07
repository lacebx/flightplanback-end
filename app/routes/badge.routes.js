// app/routes/badge.routes.js
import express from 'express';
import {
    createBadge,
    findAllBadges,
    findBadgeById,
    updateBadge,
    deleteBadge,
    deleteAllBadges
} from '../controllers/badge.controller.js';

export const badgeRouter = express.Router();

badgeRouter.post('/', createBadge);                // Create a new badge
badgeRouter.get('/', findAllBadges);                // Retrieve all badges
badgeRouter.get('/:id', findBadgeById);            // Retrieve a badge by ID
badgeRouter.put('/:id', updateBadge);              // Update a badge by ID
badgeRouter.delete('/:id', deleteBadge);           // Delete a badge by ID
badgeRouter.delete('/', deleteAllBadges);           // Delete all badges

