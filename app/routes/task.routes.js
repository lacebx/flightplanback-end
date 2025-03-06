// app/routes/task.routes.js
import express from 'express';
import {
    createTask,
    findAllTasks,
    findTaskById,
    updateTask,
    deleteTask,
    deleteAllTasks
} from '../controllers/task.controller.js';

export const taskRouter = express.Router();

taskRouter.post('/', createTask);               // Create a new task
taskRouter.get('/', findAllTasks);               // Retrieve all tasks
taskRouter.get('/:id', findTaskById);           // Retrieve a task by ID
taskRouter.put('/:id', updateTask);             // Update a task by ID
taskRouter.delete('/:id', deleteTask);          // Delete a task by ID
taskRouter.delete('/', deleteAllTasks);          // Delete all tasks

