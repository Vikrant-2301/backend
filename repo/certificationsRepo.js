const Certification = require('../model/certificationsModel');

const createCertification = async (certificationData) => {
  const newCertification = new Certification(certificationData);
  return newCertification.save();
};

const getCertifications = async () => {
  return Certification.find();
};

const getCertificationByEmail = async (email) => {
  return Certification.find({ email });
};

const getCertificationBySerialNumber = async (certificateSerialNumber) => {
  return Certification.find({ certificateSerialNumber });
};

const getCertificationById = async (id) => {
  return Certification.findById(id);
};

const deleteCertificationById = async (id) => {
  return Certification.findByIdAndDelete(id);
};

module.exports = {
  createCertification,
  getCertifications,
  getCertificationByEmail,
  getCertificationBySerialNumber,
  getCertificationById,
  deleteCertificationById,
};
