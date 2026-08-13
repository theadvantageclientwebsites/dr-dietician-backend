const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { uploadProfilePhoto, uploadDigitalProductFile, uploadDigitalProductThumbnail } = require("./upload.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const adminMiddleware = require("../../middlewares/admin.middleware");

const router = express.Router();

// ─── Helper: ensure directory exists ─────────────────────────────────────────
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// ─── Storage: Profile Photos ──────────────────────────────────────────────────
const profilePhotoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "uploads/";
    ensureDir(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

// ─── Storage: Digital Product PDF Files ──────────────────────────────────────
const digitalProductFileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "uploads/digital-products/files/";
    ensureDir(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueName = `dp-file-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// ─── Storage: Digital Product Thumbnails ─────────────────────────────────────
const digitalProductThumbnailStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "uploads/digital-products/thumbnails/";
    ensureDir(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueName = `dp-thumb-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// ─── Multer instances ─────────────────────────────────────────────────────────
const uploadProfilePhoto_multer = multer({ storage: profilePhotoStorage });

const uploadPDF = multer({
  storage: digitalProductFileStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max for PDFs
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  },
});

const uploadThumbnail = multer({
  storage: digitalProductThumbnailStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max for images
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG or WebP images are allowed"), false);
    }
  },
});

// ─── Routes ───────────────────────────────────────────────────────────────────

// POST /api/upload/profile-photo
router.post(
  "/profile-photo",
  authMiddleware,
  uploadProfilePhoto_multer.single("photo"),
  uploadProfilePhoto
);

// POST /api/upload/digital-product/file  (PDF upload - Admin only)
router.post(
  "/digital-product/file",
  authMiddleware,
  adminMiddleware,
  uploadPDF.single("file"),
  uploadDigitalProductFile
);

// POST /api/upload/digital-product/thumbnail  (Image upload - Admin only)
router.post(
  "/digital-product/thumbnail",
  authMiddleware,
  adminMiddleware,
  uploadThumbnail.single("thumbnail"),
  uploadDigitalProductThumbnail
);

// POST /api/upload/blood-report  (PDF upload - Doctor only)
const bloodReportStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "uploads/blood-reports/";
    ensureDir(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueName = `blood-report-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const uploadBloodReportPDF = multer({
  storage: bloodReportStorage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed for blood reports"), false);
    }
  },
});

router.post(
  "/blood-report",
  authMiddleware,
  (req, res, next) => {
    // Allow doctor or patient to upload
    if (!req.user || !["DOCTOR", "PATIENT"].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    next();
  },
  uploadBloodReportPDF.single("file"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    const filePath = `/uploads/blood-reports/${req.file.filename}`;
    return res.status(200).json({
      success: true,
      message: "Blood report uploaded successfully",
      data: {
        fileUrl: filePath,
        originalName: req.file.originalname,
        size: req.file.size,
      },
    });
  }
);

module.exports = router;