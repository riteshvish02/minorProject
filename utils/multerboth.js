const multer = require("multer");
const path = require("path");

let fileErrors = []; // Global fileErrors array

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "image") {
      cb(null, "./public/images/uploads");
    } else if (file.fieldname === "pdf") {
      cb(null, "./public/images/pdfs");
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const uploadboth = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "image") {
      // Allow all image formats
      const allowedImageExt = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".svg"];
      if (!allowedImageExt.includes(path.extname(file.originalname).toLowerCase())) {
        fileErrors.push({
          field: file.fieldname,
          msg: "Invalid image file type. Only .jpg, .jpeg, and .png allowed!",
        });
        return cb(null, false); // Reject file
      }
    } else if (file.fieldname === "pdf") {
      // Allow PDF and DOC/DOCX formats
      const allowedDocExt = [".pdf", ".doc", ".docx"];
      if (!allowedDocExt.includes(path.extname(file.originalname).toLowerCase())) {
        fileErrors.push({
          field: file.fieldname,
          msg: "Invalid PDF file type.",
        });
        return cb(null, false); // Reject file
      }
    }
    cb(null, true); // Accept file if no issues
  },
}).fields([
  { name: "image", maxCount: 1 },
  { name: "pdf", maxCount: 1 },
]);

module.exports = {
  uploadboth,
  fileErrors,
};