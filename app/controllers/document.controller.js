// app/controllers/document.controller.js
import { Document } from '../models/document.model';
import { User } from '../models/user.model';

// Create and Save a new Document associated with a User
export const createDocument = async (req, res) => {
    try {
        const { user_id, documenttype, filepath } = req.body;

        // Validate request
        if (!user_id || !documenttype || !filepath) {
            return res.status(400).send({ message: "User ID, Document Type, and File Path cannot be empty!" });
        }

        const document = await Document.create({
            user_id,
            documenttype,
            filepath,
        });
        res.status(201).json(document);
    } catch (error) {
        res.status(500).send({ message: error.message || "Some error occurred while creating the Document." });
    }
};

// Retrieve all Documents from the database, including User details
export const findAllDocuments = async (req, res) => {
    try {
        const documents = await Document.findAll({
            include: User, // Include associated User details
        });
        res.status(200).json(documents);
    } catch (error) {
        res.status(500).send({ message: error.message || "Some error occurred while retrieving documents." });
    }
};

// Find a single Document by ID, including User details
export const findDocumentById = async (req, res) => {
    try {
        const id = req.params.id;

        const document = await Document.findByPk(id, {
            include: User, // Include associated User details
        });
        if (document) {
            res.status(200).json(document);
        } else {
            res.status(404).send({ message: `Cannot find Document with id=${id}.` });
        }
    } catch (error) {
        res.status(500).send({ message: "Error retrieving Document with id=" + req.params.id });
    }
};

// Update a Document by ID
export const updateDocument = async (req, res) => {
    try {
        const id = req.params.id;

        const [updated] = await Document.update(req.body, {
            where: { documentid: id },
        });

        if (updated) {
            const updatedDocument = await Document.findByPk(id, {
                include: User, // Include associated User details
            });
            res.status(200).json(updatedDocument);
        } else {
            res.status(404).send({ message: `Cannot update Document with id=${id}. Maybe Document was not found or req.body is empty!` });
        }
    } catch (error) {
        res.status(500).send({ message: "Error updating Document with id=" + id });
    }
};

// Delete a Document by ID
export const deleteDocument = async (req, res) => {
    try {
        const id = req.params.id;

        const deleted = await Document.destroy({
            where: { documentid: id },
        });

        if (deleted) {
            res.status(204).send(); // No content to send back
        } else {
            res.status(404).send({ message: `Cannot delete Document with id=${id}. Maybe Document was not found!` });
        }
    } catch (error) {
        res.status(500).send({ message: "Could not delete Document with id=" + id });
    }
};

// Delete all Documents from the database
export const deleteAllDocuments = async (req, res) => {
    try {
        const nums = await Document.destroy({
            where: {},
            truncate: false,
        });
        res.send({ message: `${nums} Documents were deleted successfully!` });
    } catch (error) {
        res.status(500).send({ message: error.message || "Some error occurred while removing all documents." });
    }
};