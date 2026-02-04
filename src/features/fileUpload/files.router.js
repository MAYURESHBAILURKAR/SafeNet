// server/routes/files.js
const express = require('express');
const router = express.Router();
const File = require('./files.schema');
const auth = require('../../middlewares/authMiddleware');
const cloudinary = require('../config/cloudinary');

// 1. ADD A FILE (Link or Note)
router.post('/', auth, async (req, res) => {
  try {
    // console.log("Received Body:", req.body);
    // console.log("User ID:", req.user.id);    
    const { title, type, format, content, fileUrl, folderId, public_id } = req.body;

    const newFile = new File({
      title,
      public_id,
      type,       // 'file' or 'note'
      format,     // 'pdf', 'jpg', etc.
      content,    // If note, text goes here
      fileUrl,    // If file, URL goes here
      folderId,   // Which folder does it belong to?
      owner: req.user.id
    });

    const savedFile = await newFile.save();
    res.json(savedFile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. GET FILES IN A FOLDER
// Usage: GET /api/files/65a... (folderId)
router.get('/:folderId', auth, async (req, res) => {
  try {
    // const files = await File.find({ 
    //   folderId: req.params.folderId, 
    //   owner: req.user.id 
    // });

        const files = await File.find({ 
      folderId: req.params.folderId, 
    });
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE FILE ROUTE
router.delete('/:id', auth, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ msg: 'File not found' });
// console.log(file);
    // 1. Delete from Cloudinary
    if (file.public_id) {
        // We use 'resource_type: raw' for PDFs/Docs, 'image'/'video' otherwise
        const type = file.format === 'image' ? 'image' : file.format === 'video' ? 'video' : 'raw';
        console.log(file.public_id);
        
        await cloudinary.uploader.destroy(file.public_id, { resource_type: type });
    }

    // 2. Delete from MongoDB
    await File.findByIdAndDelete(req.params.id);
    
    res.json({ msg: 'File deleted from Cloud and DB' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;