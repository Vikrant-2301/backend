// controller/authorController.js
const authorService = require('../service/authorService');

const createAuthor = async (req, res) => {
  try {
    const author = await authorService.createAuthor(req.body);
    res.status(201).json(author);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllAuthors = async (req, res) => {
  try {
    const authors = await authorService.getAllAuthors();
    res.status(200).json(authors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAuthorById = async (req, res) => {
  try {
    const author = await authorService.getAuthorById(req.params.id);
    if (!author) return res.status(404).json({ error: 'Author not found' });
    res.status(200).json(author);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateAuthor = async (req, res) => {
  try {
    const author = await authorService.updateAuthor(req.params.id, req.body);
    if (!author) return res.status(404).json({ error: 'Author not found' });
    res.status(200).json(author);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteAuthor = async (req, res) => {
  try {
    const author = await authorService.deleteAuthor(req.params.id);
    if (!author) return res.status(404).json({ error: 'Author not found' });
    res.status(200).json({ message: 'Author deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createAuthor,
  getAllAuthors,
  getAuthorById,
  updateAuthor,
  deleteAuthor
};
