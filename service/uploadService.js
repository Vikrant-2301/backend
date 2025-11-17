// service/uploadService.js
const ImageKit = require('imagekit');
const Image = require('../model/Image');
const User = require('../model/authModel'); // Assuming 'Auth' is your User model

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

const uploadImage = async (file, userId) => {
  if (!file) {
    throw new Error('No file provided for upload.');
  }

  try {
    // 1. Upload to ImageKit
    const uploadResponse = await imagekit.upload({
      file: file.buffer, // Use buffer from multer
      fileName: file.originalname,
      folder: 'blog_images', // Optional: organize in ImageKit
    });

    if (!uploadResponse) {
      throw new Error('ImageKit upload failed.');
    }

    // 2. Save a record to our local database
    const imageRecord = new Image({
      fileName: file.originalname,
      url: uploadResponse.url,
      fileId: uploadResponse.fileId,
      uploadedBy: userId || null,
    });
    
    await imageRecord.save();

    // 3. Return the essential data to the frontend
    return {
      url: uploadResponse.url,
      fileId: uploadResponse.fileId,
      dbId: imageRecord._id,
    };
  } catch (error) {
    console.error("Error during image upload service:", error);
    // Attempt to delete from ImageKit if DB save fails (optional cleanup)
    if (error.dbError && error.fileId) {
      await imagekit.deleteFile(error.fileId);
    }
    throw new Error(error.message || 'Image upload failed.');
  }
};

module.exports = {
  uploadImage,
};