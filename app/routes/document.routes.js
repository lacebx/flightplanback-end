const express = require("express");
const router = express.Router();
const db = require("../models");
const Document = db.document;

// Create a new document
router.post("/", async (req, res) => {
    try {
        const document = await Document.create(req.body);
        res.status(201).json(document);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all documents
router.get("/", async (req, res) => {
    try {
        const documents = await Document.findAll();
        res.status(200).json(documents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a document by ID
router.get("/:id", async (req, res) => {
    try {
        const document = await Document.findByPk(req.params.id);
        if (document) {
            res.status(200).json(document);
        } else {
            res.status(404).json({ message: "Document not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a document by ID
router.put("/:id", async (req, res) => {
    try {
        const [updated] = await Document.update(req.body, {
            where: { documentid: req.params.id }
        });
        if (updated) {
            const updatedDocument = await Document.findByPk(req.params.id);
            res.status(200).json(updatedDocument);
        } else {
            res.status(404).json({ message: "Document not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a document by ID
router.delete("/:id", async (req, res) => {
    try {
        const deleted = await Document.destroy({
            where: { documentid: req.params.id }
        });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: "Document not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 