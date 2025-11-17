// repo/authorRepo.js
const Author = require('../model/Author');
const Blog = require('../model/Blog'); // --- ADD THIS LINE ---

const createAuthor = async (data) => new Author(data).save();

// --- FIX: Populate 'articles' to get the count for the table ---
const getAllAuthors = async () =>
  Author.find().sort({ name: 1 }).populate("articles", "_id");

const getAuthorById = async (id) =>
  Author.findById(id).populate('articles', 'title slug createdAt');

const updateAuthor = async (id, data) =>
  Author.findByIdAndUpdate(id, data, { new: true });

const deleteAuthor = async (id) => Author.findByIdAndDelete(id);

const addArticleToAuthor = async (authorId, blogId) => {
  return Author.findByIdAndUpdate(authorId, { $addToSet: { articles: blogId } });
};

const removeArticleFromAuthor = async (authorId, blogId) => {
  return Author.findByIdAndUpdate(authorId, { $pull: { articles: blogId } });
};

module.exports = {
  createAuthor,
  getAllAuthors,
  getAuthorById,
  updateAuthor,
  deleteAuthor,
  addArticleToAuthor,
  removeArticleFromAuthor,
};