// server/models/File.js
const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  title: { type: String, required: true }, // "Meeting Notes" or "My Resume"
  
  // 'note' = text saved in DB. 'file' = anything uploaded to cloud.
  type: { 
    type: String, 
    enum: ['note', 'file'], 
    default: 'file' 
  }, 

  // Helps the UI pick the right icon (e.g., 'pdf', 'jpg', 'mp4')
  format: { type: String }, 
public_id: { type: String },
  // If it's a Note, text goes here
  content: { type: String }, 

  // If it's a File, the Firebase URL goes here
  fileUrl: { type: String },

  folderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Folder' 
  },
  
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('File', FileSchema);