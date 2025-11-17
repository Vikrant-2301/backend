// model/Author.js
const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  image: { 
    type: String, 
    required: false, // Image is optional
    default: ''
  },
  description: { 
    type: String, 
    required: false,
    trim: true,
    default: ''
  },
  // Link to articles written by this author
  articles: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }
  ],
  // Optional: Link to a user account if the author is also a user
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Auth',
    required: false 
  }
}, { timestamps: true });

module.exports = mongoose.models.Author || mongoose.model('Author', authorSchema);