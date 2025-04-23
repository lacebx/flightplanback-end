const express = require('express');
const router = express.Router();
const formidable = require('formidable'); // Import formidable
const documentController = require('../controllers/document.controller');

// File upload route using formidable
router.post('/upload', (req, res) => {
  const form = new formidable.IncomingForm(); // Create a new form object
  
  form.uploadDir = './app/uploads';  // Set the directory where files will be uploaded
  form.keepExtensions = true;    // Keep the file extension
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to upload file' });
    }

    try {
      const doc = await documentController.uploadFile(fields, files);
      res.status(201).json(doc);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
});

// CRUD Routes for documents
router.post('/', documentController.create);
router.get('/', documentController.findAll);
router.get('/:id', documentController.findOne);
router.put('/:id', documentController.update);
router.delete('/:id', documentController.delete);

module.exports = router;
