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
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `certifications/${Date.now()}_${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  const s3Response = await s3.upload(params).promise();
  console.log("🚀🚀🚀 ~ uploadFileToS3 ~ s3Response:", s3Response)

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
  console.log("🚀 ~ Line 34 ~  :  ");

  // Get the userId from the external API
  const userId = await getUserIdByEmail(email);
  console.log("🚀🚀🚀 ~ createCertification ~ userId:", userId)


  // Upload the file to S3
  const fileUrl = await uploadFileToS3(file);
  console.log("🚀🚀🚀 ~ createCertification ~ fileUrl:", fileUrl)


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
    console.log("🚀🚀🚀 ~ deleteCertificationById: ~ certification:", certification)

    if (!certification) {
      throw new Error('Certification not found');
    }
    return certificationRepository.deleteCertificationById(id);
  },
};
