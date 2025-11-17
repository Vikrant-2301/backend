// controller/uploadController.js
const uploadService = require('../service/uploadService');

const uploadBlogImage = async (req, res) => {
  try {
    // req.user.id should be available from your authMiddleware
    const userId = req.user ? req.user.id : null; 
    
    const result = await uploadService.uploadImage(req.file, userId);
    
    res.status(201).json({
      message: 'Image uploaded successfully!',
      url: result.url,
      fileId: result.fileId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  uploadBlogImage,
};