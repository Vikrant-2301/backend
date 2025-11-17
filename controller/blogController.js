const blogService = require('../service/blogService');

// Create new blog post (Admin)
const createBlog = async (req, res) => {
  try {
    const post = await blogService.createBlog(req.body);
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all posts (Admin - includes drafts)
const getAllBlogsAdmin = async (req, res) => {
  try {
    const posts = await blogService.getAllBlogsAdmin();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all PUBLISHED posts (Public)
const getAllBlogsPublic = async (req, res) => {
  try {
    const posts = await blogService.getAllBlogsPublic();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single post by SLUG (Public)
const getBlogBySlugPublic = async (req, res) => {
  try {
    const post = await blogService.getBlogBySlugPublic(req.params.slug);
    if (!post) return res.status(404).json({ error: 'Blog post not found' });
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single post by ID (Admin - for editing)
const getBlogById = async (req, res) => {
  try {
    const post = await blogService.getBlogById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Blog post not found' });
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update blog post (Admin)
const updateBlog = async (req, res) => {
  try {
    const post = await blogService.updateBlog(req.params.id, req.body);
    if (!post) return res.status(404).json({ error: 'Blog post not found' });
    res.status(200).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete blog post (Admin)
const deleteBlog = async (req, res) => {
  try {
    const post = await blogService.deleteBlog(req.params.id);
    if (!post) return res.status(404).json({ error: 'Blog post not found' });
    res.status(200).json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- NEW CONTROLLERS ---

// Like/Unlike a post (Authenticated User)
const likePostController = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id; // From authMiddleware
    const updatedPost = await blogService.likePost(postId, userId);
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Increment share count (Authenticated User)
const sharePostController = async (req, res) => {
  try {
    const { postId } = req.params;
    const updatedPost = await blogService.incrementShareCount(postId);
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// --- END NEW CONTROLLERS ---

module.exports = {
  createBlog,
  getAllBlogsAdmin,
  getAllBlogsPublic,
  getBlogBySlugPublic,
  getBlogById,
  updateBlog,
  deleteBlog,
  likePostController, // <-- EXPORT NEW
  sharePostController, // <-- EXPORT NEW
};