// service/authorService.js
const authorRepo = require('../repo/authorRepo');
const blogRepo = require('../repo/blogRepo');
const mongoose = require('mongoose');
const Author = require('../model/Author'); // --- ADD THIS LINE ---
const Blog = require('../model/Blog'); // --- ADD THIS LINE ---

const createAuthor = async (data) => authorRepo.createAuthor(data);

const getAllAuthors = async () => authorRepo.getAllAuthors();

// --- FIX: Perform reverse lookup to ensure all articles are found ---
const getAuthorById = async (id) => {
  // 1. Get the author's main details
  const authorDoc = await Author.findById(id);
  if (!authorDoc) return null;
  
  const author = authorDoc.toObject(); // Convert to plain object

  // 2. Find all blogs that list this author
  const blogs = await blogRepo.findBlogsByAuthor(id);
  
  // 4. Return the author, replacing 'articles' with the complete list
  author.articles = blogs.map(blog => ({
    _id: blog._id,
    title: blog.title,
    slug: blog.slug,
    createdAt: blog.createdAt,
  }));
  
  return author;
};
// --- END FIX ---

const updateAuthor = async (id, data) => authorRepo.updateAuthor(id, data);

const deleteAuthor = async (id) => {
  // Check if id is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid Author ID');
  }
  const authorId = new mongoose.Types.ObjectId(id);
  
  const blogs = await blogRepo.findBlogsByAuthor(authorId);
  
  const blogIdsToUpdate = blogs.map(b => b._id);
  
  // This unsets the 'author' field from all associated blogs
  if (blogIdsToUpdate.length > 0) {
    await blogRepo.unsetAuthorForBlogs(blogIdsToUpdate);
  }

  return authorRepo.deleteAuthor(id);
};

module.exports = {
  createAuthor,
  getAllAuthors,
  getAuthorById,
  updateAuthor,
  deleteAuthor
};