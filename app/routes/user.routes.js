// app/routes/user.routes.js
import express from 'express';
import {
    createUser,
    findAllUsers,
    findUserById,
    updateUser,
    deleteUser,
    deleteAllUsers
} from '../controllers/user.controller.js';

export const userRouter = express.Router();

userRouter.post('/', createUser);               // Create a new user
userRouter.get('/', findAllUsers);               // Retrieve all users
userRouter.get('/:id', findUserById);           // Retrieve a user by ID
userRouter.put('/:id', updateUser);             // Update a user by ID
userRouter.delete('/:id', deleteUser);          // Delete a user by ID
userRouter.delete('/', deleteAllUsers);          // Delete all users

