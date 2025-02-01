const certificationService = require('../service/certificationsService');

const createCertification = async (req, res) => {
  try {
    const { email, certificateSerialNumber } = req.body;
    console.log("🚀🚀🚀 ~ createCertification ~ req.body:", req.body)
    console.log("🚀🚀🚀 ~ createCertification ~ req.file:", req.file)


    if (!req.file) {
      return res.status(400).json({ error: 'File is required' });
    }

    const newCertification = await certificationService.createCertification(
      { email, certificateSerialNumber },
      req.file
    );

    res.status(201).json(newCertification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllCertifications = async (req, res) => {
  try {
    const certifications = await certificationService.getAllCertifications();
    res.status(200).json(certifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCertificationsByEmail = async (req, res) => {
  try {
    const certifications = await certificationService.getCertificationsByEmail(req.params.email);
    res.status(200).json(certifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCertificationsBySerialNumber = async (req, res) => {
  try {
    const certifications = await certificationService.getCertificationsBySerialNumber(req.params.certificateSerialNumber);
    res.status(200).json(certifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCertificationById = async (req, res) => {
  try {
    const response = await certificationService.deleteCertificationById(req.params.id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCertification,
  getAllCertifications,
  getCertificationsByEmail,
  getCertificationsBySerialNumber,
  deleteCertificationById,
};
