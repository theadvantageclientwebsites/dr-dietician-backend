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

module.exports = {
  uploadProfilePhoto,
};