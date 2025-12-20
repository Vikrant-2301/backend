// service/blogService.js
const blogRepo = require('../repo/blogRepo');
const authorRepo = require('../repo/authorRepo');
const Blog = require('../model/Blog');

// Helper to generate a unique slug
const generateUniqueSlug = async (title) => {
  let slug = title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  
  let existing = await Blog.findOne({ slug });
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
  
  // --- MODIFICATION: Removed mandatory author check ---
  // if (!author) { throw new Error('Author is required.'); } 

  const slug = data.slug ? data.slug.toLowerCase().replace(/\s+/g, '-') : await generateUniqueSlug(title);
  
  const blogData = {
    title,
    slug,
    content,
    featuredImage,
    author: author || null, // Allow null author
    tags: tags ? tags.split(',').map(tag => tag.trim().toLowerCase()) : [],
    status,
    metaDescription
  };
  
  const newBlog = await blogRepo.createBlog(blogData);
  
  // Only link if author exists
  if (author) {
    await authorRepo.addArticleToAuthor(author, newBlog._id);
  }
  
  return newBlog;
};

const updateBlog = async (id, data) => {
  const { title, content, featuredImage, author, tags, status, metaDescription, slug } = data;

  const updateData = {};

  if (typeof title !== 'undefined') updateData.title = title;
  if (typeof content !== 'undefined') updateData.content = content;
  if (typeof featuredImage !== 'undefined') updateData.featuredImage = featuredImage;
  if (typeof status !== 'undefined') updateData.status = status;
  if (typeof metaDescription !== 'undefined') updateData.metaDescription = metaDescription;

  if (Object.prototype.hasOwnProperty.call(data, 'author')) {
    updateData.author = author || null;
  }

  if (Object.prototype.hasOwnProperty.call(data, 'tags')) {
    updateData.tags = Array.isArray(tags)
      ? tags
      : (tags ? tags.split(',').map(tag => tag.trim().toLowerCase()) : []);
  }

  if (Object.prototype.hasOwnProperty.call(data, 'slug') && slug) {
    const sanitized = slug.toLowerCase().replace(/\s+/g, '-');
    const existing = await Blog.findOne({ slug: sanitized });
    if (existing && existing._id.toString() !== id) {
      throw new Error('Slug is already in use by another post.');
    }
    updateData.slug = sanitized;
  }

  const originalBlog = await blogRepo.getBlogById(id);

  if (Object.prototype.hasOwnProperty.call(data, 'author')) {
    const oldAuthorId = originalBlog.author ? originalBlog.author._id.toString() : null;
    const newAuthorId = author ? author.toString() : null;

    if (oldAuthorId !== newAuthorId) {
      if (oldAuthorId) {
        await authorRepo.removeArticleFromAuthor(oldAuthorId, id);
      }
      if (newAuthorId) {
        await authorRepo.addArticleToAuthor(newAuthorId, id);
      }
    }
  }

  return blogRepo.updateBlog(id, updateData);
};

const deleteBlog = async (id) => {
  const blog = await blogRepo.getBlogById(id);
  if (blog && blog.author) {
    await authorRepo.removeArticleFromAuthor(blog.author._id || blog.author, id);
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
