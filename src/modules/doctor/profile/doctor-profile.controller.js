const doctorProfileService = require("./doctor-profile.service");

const getProfile = async (req, res, next) => {
  try {
    const doctorId = req.user.userId || req.user.id;
    const data = await doctorProfileService.getProfile(doctorId);
    res.status(200).json({ success: true, message: "Profile fetched successfully", data });
  } catch (error) { next(error); }
};

const updateProfile = async (req, res, next) => {
  try {
    const doctorId = req.user.userId || req.user.id;
    const data = await doctorProfileService.updateProfile(doctorId, req.body);
    res.status(200).json({ success: true, message: "Profile updated successfully", data });
  } catch (error) { next(error); }
};

module.exports = { getProfile, updateProfile };
