const uploadService = require("./upload.service");

const uploadProfilePhoto = async (req, res, next) => {
  try {
    console.log("Upload route hit");
    console.log("req.user:", req.user);
    console.log("req.file:", req.file);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const filePath = `/uploads/${req.file.filename}`;
    const userId = req.user.userId || req.user.id;

    console.log("Resolved userId:", userId);

    const user = await uploadService.saveProfilePhoto(userId, filePath);

    return res.status(200).json({
      success: true,
      message: "Profile photo uploaded successfully",
      data: {
        profilePhotoUrl: user.profilePhotoUrl,
      },
    });
  } catch (error) {
    console.error("Upload controller error:", error);
    next(error);
  }
};

const uploadDigitalProductFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Validate file is a PDF
    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({
        success: false,
        message: "Only PDF files are allowed",
      });
    }

    const filePath = `/uploads/digital-products/files/${req.file.filename}`;

    return res.status(200).json({
      success: true,
      message: "Digital product file uploaded successfully",
      data: {
        fileUrl: filePath,
        originalName: req.file.originalname,
        size: req.file.size,
      },
    });
  } catch (error) {
    next(error);
  }
};

const uploadDigitalProductThumbnail = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Validate file is an image
    const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedMimeTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: "Only JPEG, PNG or WebP images are allowed for thumbnails",
      });
    }

    const filePath = `/uploads/digital-products/thumbnails/${req.file.filename}`;

    return res.status(200).json({
      success: true,
      message: "Thumbnail uploaded successfully",
      data: {
        thumbnailUrl: filePath,
        originalName: req.file.originalname,
        size: req.file.size,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadProfilePhoto,
  uploadDigitalProductFile,
  uploadDigitalProductThumbnail,
};