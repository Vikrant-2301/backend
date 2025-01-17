const express = require('express');
const multer = require('multer');
const certificationController = require('../controller/certificationsController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/certifications', upload.single('file'), certificationController.createCertification);
router.get('/certifications', certificationController.getAllCertifications);
router.get('/certifications/email/:email', certificationController.getCertificationsByEmail);
router.get('/certifications/certificate/:certificateSerialNumber', certificationController.getCertificationsBySerialNumber);
router.delete('/certifications/:id', certificationController.deleteCertificationById);

module.exports = router;
