// server/models/Folder.js
const mongoose = require('mongoose');

const FolderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  
  // Link to the User model (Relationship)
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  createdAt: { type: Date, default: Date.now }
});

const folder = mongoose.model('Folder', FolderSchema);

module.exports = folder