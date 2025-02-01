const express = require('express');
const multer = require('multer');
const certificationController = require('../controller/certificationsController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('file'), certificationController.createCertification);
router.get('/all', certificationController.getAllCertifications);
router.get('/email/:email', certificationController.getCertificationsByEmail);
router.get('/certificate/:certificateSerialNumber', certificationController.getCertificationsBySerialNumber);
router.delete('/delete/:id', certificationController.deleteCertificationById);

module.exports = router;
