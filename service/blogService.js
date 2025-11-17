// service/blogService.js
const blogRepo = require('../repo/blogRepo');
const authorRepo = require('../repo/authorRepo'); // <-- IMPORT AUTHOR REPO
const Blog = require('../model/Blog'); // <-- IMPORT BLOG MODEL FOR SLUG CHECK

// Helper to generate a unique slug
const generateUniqueSlug = async (title) => {
  let slug = title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  
  let existing = await Blog.findOne({ slug }); // Use Blog model directly
  let counter = 1;
  while (existing) {
    const newSlug = `${slug}-${counter}`;
    existing = await Blog.findOne({ slug: newSlug });
    if (!existing) {
      slug = newSlug;
      break;
    }
    counter++;
  }
  return slug;
};

const createBlog = async (data) => {
  const { title, content, featuredImage, author, tags, status, metaDescription } = data;
  
  if (!author) {
    throw new Error('Author is required.');
  }

  // --- FIX: Use data.slug if provided, else generate ---
  const slug = data.slug ? data.slug.toLowerCase().replace(/\s+/g, '-') : await generateUniqueSlug(title);
  
  const blogData = {
    title,
    slug,
    content,
    featuredImage,
    author, // This is now an Author ID
    tags: tags ? tags.split(',').map(tag => tag.trim().toLowerCase()) : [],
    status,
    metaDescription
  };
  
  const newBlog = await blogRepo.createBlog(blogData);
  await authorRepo.addArticleToAuthor(author, newBlog._id);
  return newBlog;
};

const updateBlog = async (id, data) => {
  const { title, content, featuredImage, author, tags, status, metaDescription, slug } = data;
  
  const updateData = {
    title,
    content,
    featuredImage,
    author,
    tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim().toLowerCase())) : [],
    status,
    metaDescription,
    slug
  };

  if (slug) {
    const existing = await blogRepo.getBlogBySlugPublic(slug);
    if (existing && existing._id.toString() !== id) {
      throw new Error('Slug is already in use by another post.');
    }
    updateData.slug = slug.toLowerCase().replace(/\s+/g, '-');
  }

  const originalBlog = await blogRepo.getBlogById(id);
  if (originalBlog && originalBlog.author && originalBlog.author.toString() !== author) {
    if (originalBlog.author) {
        await authorRepo.removeArticleFromAuthor(originalBlog.author, id);
    }
    await authorRepo.addArticleToAuthor(author, id);
  }

  return blogRepo.updateBlog(id, updateData);
};

const deleteBlog = async (id) => {
  const blog = await blogRepo.getBlogById(id);
  if (blog && blog.author) {
    await authorRepo.removeArticleFromAuthor(blog.author, id);
  }
  return blogRepo.deleteBlog(id);
};

const getBlogBySlugPublic = async (slug) => {
  await blogRepo.incrementViewCount(slug);
  return blogRepo.getBlogBySlugPublic(slug);
};

const likePost = async (postId, userId) => {
  const post = await blogRepo.getBlogById(postId);
  if (!post) throw new Error("Post not found");
  
  // --- FIX: Use Mongoose .equals() to compare ObjectId and string ---
  const userHasLiked = post.likes.some(likeId => likeId.equals(userId));

  if (userHasLiked) {
    return blogRepo.unlikePost(postId, userId);
  } else {
    return blogRepo.likePost(postId, userId);
  }
};

const incrementShareCount = async (postId) => {
  return blogRepo.incrementShareCount(postId);
};

module.exports = {
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlogsAdmin: blogRepo.getAllBlogsAdmin,
  getAllBlogsPublic: blogRepo.getAllBlogsPublic,
  getBlogBySlugPublic,
  getBlogById: blogRepo.getBlogById,
  likePost,
  incrementShareCount
};