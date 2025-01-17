const axios = require('axios'); // Axios for making HTTP requests
const certificationRepository = require('../repo/certificationsRepo');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const uploadFileToS3 = async (file) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `certifications/${Date.now()}_${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  const s3Response = await s3.upload(params).promise();
  return s3Response.Location;
};

const getUserIdByEmail = async (email) => {
  try {
    const response = await axios.get(`http://localhost:8000/api/v1/auth/users/${email}`);
    return response.data._id; // Extract userId from the response
  } catch (error) {
    throw new Error(`Error fetching user details: ${error.response?.data?.message || error.message}`);
  }
};

const createCertification = async (data, file) => {
  const { email, certificateSerialNumber } = data;

  // Get the userId from the external API
  const userId = await getUserIdByEmail(email);

  // Upload the file to S3
  const fileUrl = await uploadFileToS3(file);

  // Save the certification to the database
  return certificationRepository.createCertification({
    email,
    certificateSerialNumber,
    userId,
    fileUrl,
    fileName: file.originalname,
  });
};

module.exports = {
  createCertification,
  getAllCertifications: certificationRepository.getCertifications,
  getCertificationsByEmail: certificationRepository.getCertificationByEmail,
  getCertificationsBySerialNumber: certificationRepository.getCertificationBySerialNumber,
  deleteCertificationById: async (id) => {
    const certification = await certificationRepository.getCertificationById(id);
    if (!certification) {
      throw new Error('Certification not found');
    }
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: certification.fileUrl.split('.amazonaws.com/')[1],
    };
    await s3.deleteObject(params).promise();
    return certificationRepository.deleteCertificationById(id);
  },
};
