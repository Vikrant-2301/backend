// repo/blogRepo.js
const Blog = require('../model/Blog');

// Create a new blog post
const createBlog = async (data) => new Blog(data).save();

// Get all posts (for admin, includes drafts)
const getAllBlogsAdmin = async () => {
  // --- MODIFICATION: Added 'description' ---
  return Blog.find()
    .sort({ createdAt: -1 })
    .populate('author', 'name image description'); // Populate from Author
  // --- END MODIFICATION ---
};

// Get all PUBLISHED posts (for public)
const getAllBlogsPublic = async () => {
  // --- MODIFICATION: Added 'description' ---
  return Blog.find({ status: 'published' })
    .sort({ createdAt: -1 })
    .populate('author', 'name image description'); // Populate from Author
  // --- END MODIFICATION ---
};

// Get a single public post by its slug
const getBlogBySlugPublic = async (slug) => {
  // --- MODIFICATION: Added 'description' ---
  return Blog.findOne({ slug, status: 'published' })
    .populate('author', 'name image description'); // Populate from Author
  // --- END MODIFICATION ---
};

// Get a single post by ID (for admin editing)
const getBlogById = async (id) => {
  // --- MODIFICATION: Added 'description' ---
  return Blog.findById(id).populate('author', 'name image description'); // Populate from Author
  // --- END MODIFICATION ---
};

// Update a post by ID
const updateBlog = async (id, data) => Blog.findByIdAndUpdate(id, data, { new: true });

// Delete a post by ID
const deleteBlog = async (id) => Blog.findByIdAndDelete(id);

// --- NEW METHODS ---

// Find all blogs for a specific author
const findBlogsByAuthor = async (authorId) => {
  return Blog.find({ author: authorId });
};

// Set author to null for a list of blogs (when an author is deleted)
const unsetAuthorForBlogs = async (blogIds) => {
  return Blog.updateMany({ _id: { $in: blogIds } }, { $set: { author: null } });
};
// --- END NEW METHODS ---

// --- METHODS from previous state (unchanged) ---
const incrementViewCount = async (slug) => {
  return Blog.findOneAndUpdate({ slug }, { $inc: { viewCount: 1 } });
};

const incrementShareCount = async (postId) => {
  return Blog.findByIdAndUpdate(postId, { $inc: { shareCount: 1 } }, { new: true });
};

const likePost = async (postId, userId) => {
  return Blog.findByIdAndUpdate(
    postId,
    {
      $addToSet: { likes: userId },
      $inc: { likeCount: 1 }
    },
    { new: true }
  );
};

const unlikePost = async (postId, userId) => {
  return Blog.findByIdAndUpdate(
    postId,
    {
      $pull: { likes: userId },
      $inc: { likeCount: -1 }
    },
    { new: true }
  );
};
// --- END UNCHANGED METHODS ---

module.exports = {
  createBlog,
  getAllBlogsAdmin,
  getAllBlogsPublic,
  getBlogBySlugPublic,
  getBlogById,
  updateBlog,
  deleteBlog,
  findBlogsByAuthor, // <-- EXPORT NEW
  unsetAuthorForBlogs, // <-- EXPORT NEW
  incrementViewCount,
  incrementShareCount,
  likePost,
  unlikePost
};