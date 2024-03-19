const multer = require('multer');

const multerStorage = multer.memoryStorage();

const fileSizeLimit = 5 * 1024 * 1024; // 5 MB

const upload = multer({
  storage: multerStorage,
  limits: { fileSize: fileSizeLimit }
});

module.exports = upload;
