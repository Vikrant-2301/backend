const certificationRepository = require('../repo/certificationsRepo');
const { fetchUserByEmail } = require('./authService'); // Import authService directly
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const uploadFileToS3 = async (file) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `certifications/${Date.now()}_${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  const s3Response = await s3.upload(params).promise();
  return s3Response.Location;
};

const createCertification = async (data, file) => {
  const { email, certificateSerialNumber } = data;

  // FIX: Call the authService directly instead of making an HTTP request
  const user = await fetchUserByEmail(email);
  if (!user) {
      throw new Error(`User with email ${email} not found.`);
  }
  const userId = user._id;

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
    return certificationRepository.deleteCertificationById(id);
  },
};