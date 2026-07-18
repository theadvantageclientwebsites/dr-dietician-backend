const patientDashboardService = require("./patient-dashboard.service");

const getPatientDashboard = async (req, res, next) => {
  try {
    const patientId = req.user.userId || req.user.id;
    const data = await patientDashboardService.getPatientDashboard(patientId);

    res.status(200).json({
      success: true,
      message: "Patient dashboard fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPatientDashboard,
};
