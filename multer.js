const multer = require("multer");
const mkdirp = require("mkdirp");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    let currentDate = new Date(),
      year = currentDate.getFullYear(),
      month = currentDate.getMonth() + 1,
      day = currentDate.getDay(),
      dir = `./public/uploads/images/${year}/${month}/${day}`;

    mkdirp(dir, err => callback(err, dir));
  },
  filename: (req, file, callback) => {
    callback(null, `${Date.now()}-${file.originalname}`);
  }
});

const imageFilter = (req, file, callback) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
      return callback(null, true);
    }
    return callback(null, false);
}

const uploadImage = multer({
  storage: storage,
  // fileFilter: imageFilter,
  limits: {
      fileSize: 1024 * 1024 * 10
  }
});

module.exports = uploadImage;