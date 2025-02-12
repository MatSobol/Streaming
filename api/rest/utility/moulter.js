const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + + path.extname(file.originalname));
  },
});

const multerConfigurated = multer({
  dest: "uploads/",
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  // storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(file.mimetype);
    const mimetype = allowedTypes.test(
      file.originalname.split(".").pop().toLowerCase()
    );

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

const upload = () => {
  return multerConfigurated.single("file");
};

module.exports = { upload };
