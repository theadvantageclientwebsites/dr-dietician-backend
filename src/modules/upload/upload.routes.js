const express = require("express");
const multer = require("multer");
const path = require("path");
const { uploadProfilePhoto } = require("./upload.controller");
const authMiddleware = require("../../middlewares/auth.middleware");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.post(
  "/profile-photo",
  authMiddleware,
  upload.single("photo"),
  uploadProfilePhoto
);

module.exports = router;