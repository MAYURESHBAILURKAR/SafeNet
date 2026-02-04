// server/routes/folders.js
const express = require('express');
const router = express.Router();
const Folder = require('./folder.schema');
const auth = require('../../middlewares/authMiddleware'); // Import the guard
const File = require('../fileUpload/files.schema'); // Import File model
const cloudinary = require('cloudinary').v2;
// 1. CREATE A FOLDER (Protected)
router.post('/', auth, async (req, res) => {
  try {
    const { name } = req.body;

    const newFolder = new Folder({
      name,
      owner: req.user.id // We get this ID from the middleware!
    });

    const savedFolder = await newFolder.save();
    res.json(savedFolder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. GET ALL FOLDERS (Only for the logged-in user)
router.get('/', auth, async (req, res) => {
  try {
    // Find folders where "owner" matches the logged-in user's ID
    // const folders = await Folder.find({ owner: req.user.id });

    // for all content user
    const folders = await Folder.find({});
    res.json(folders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// DELETE FOLDER
router.delete('/:id', auth, async (req, res) => {
  try {
    const folder = await Folder.findById(req.params.id);
    if (!folder) return res.status(404).json({ msg: 'Folder not found' });

    // 1. Find all files in this folder
    const files = await File.find({ folderId: folder._id });

    // 2. Loop and delete from Cloudinary
    for (const file of files) {
      if (file.public_id) {
         const type = file.format === 'image' ? 'image' : file.format === 'video' ? 'video' : 'raw';
         await cloudinary.uploader.destroy(file.public_id, { resource_type: type });
      }
    }

    // 3. Delete files from DB
    await File.deleteMany({ folderId: folder._id });

    // 4. Delete the folder
    await Folder.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Folder and all contents deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;