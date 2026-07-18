const patientProfileService = require("./patient-profile.service");

const getProfile = async (req, res, next) => {
  try {
    const patientId = req.user.userId || req.user.id;
    const data = await patientProfileService.getProfile(patientId);

    res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const patientId = req.user.userId || req.user.id;
    const data = await patientProfileService.updateProfile(patientId, req.body);

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
