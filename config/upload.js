const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

const staticFolder = './static';
if (!fs.existsSync(staticFolder)) {
    fs.mkdirSync(staticFolder);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, staticFolder); 
    },
    filename: function (req, file, cb) {
        const randomName = crypto.randomBytes(8).toString('hex'); 
        const fileExtension = path.extname(file.originalname);
        cb(null, `${randomName}${fileExtension}`); 
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only jpeg, png, and gif are allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }
});

module.exports = upload;
