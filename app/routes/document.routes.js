// app/routes/document.routes.js
import express from 'express';
import {
    createDocument,
    findAllDocuments,
    findDocumentById,
    updateDocument,
    deleteDocument,
    deleteAllDocuments
} from '../controllers/document.controller';

export const documentRouter = express.Router();

documentRouter.post('/', createDocument);               // Create a new document
documentRouter.get('/', findAllDocuments);               // Retrieve all documents
documentRouter.get('/:id', findDocumentById);           // Retrieve a document by ID
documentRouter.put('/:id', updateDocument);             // Update a document by ID
documentRouter.delete('/:id', deleteDocument);          // Delete a document by ID
documentRouter.delete('/', deleteAllDocuments);          // Delete all documents
