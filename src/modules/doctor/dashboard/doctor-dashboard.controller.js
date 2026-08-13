const { getDoctorDashboard } = require("./doctor-dashboard.service");

const getDashboard = async (req, res, next) => {
  try {
    const doctorId = req.user.userId || req.user.id;
    const data = await getDoctorDashboard(doctorId);

    res.status(200).json({
      success: true,
      message: "Doctor dashboard fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboard };
