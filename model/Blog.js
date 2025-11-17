// model/Blog.js
const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true 
  },
  slug: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    index: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  featuredImage: { 
    type: String, 
    required: true 
  },
  // --- MODIFICATION ---
  // Changed ref from 'Auth' to 'Author'
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Author', // Use the new Author model
    required: true
  },
  // --- END MODIFICATION ---
  tags: [
    { type: String, trim: true, lowercase: true }
  ],
  status: { 
    type: String, 
    enum: ['draft', 'published'], 
    default: 'draft' 
  },
  metaDescription: {
    type: String,
    trim: true,
    maxlength: 160
  },
  // --- NEW FIELDS ---
  likes: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Auth' } // Likes can still be from Users (Auth)
  ],
  likeCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  shareCount: {
    type: Number,
    default: 0
  }
  // --- END NEW FIELDS ---
}, { timestamps: true });

blogSchema.pre('validate', function(next) {
  if (this.title && !this.slug) {
    this.slug = this.title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
  next();
});

module.exports = mongoose.models.Blog || mongoose.model('Blog', blogSchema);