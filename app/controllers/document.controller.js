const db = require("../models");
const Document = db.document;

// Create a new document
exports.create = async (req, res) => {
  try {
    const document = await Document.create(req.body);
    res.status(201).json(document);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all documents
exports.findAll = async (req, res) => {
  try {
    const documents = await Document.findAll();
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a document by ID
exports.findOne = async (req, res) => {
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
};

// Update a document by ID
exports.update = async (req, res) => {
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
};

// Delete a document by ID
exports.delete = async (req, res) => {
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
};

// Handle file upload
exports.uploadFile = async (fields, files) => {
  try {
    if (!files.file) return { error: 'No file uploaded' };

    // Create a document with the file data
    const doc = await Document.create({
      title: fields.title,
      content: fields.content,
      filePath: files.file[0].filepath, // Path to uploaded file
    });

    return doc;
  } catch (err) {
    throw new Error(err.message);
  }
};
