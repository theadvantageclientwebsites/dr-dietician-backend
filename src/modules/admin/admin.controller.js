const adminService = require("./admin.service");

const getDashboardSummary = async (req, res, next) => {
  try {
    const data = await adminService.getDashboardSummary();

    res.status(200).json({
      success: true,
      message: "Admin dashboard summary fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getDoctors = async (req, res, next) => {
  try {
    const data = await adminService.getDoctors();

    res.status(200).json({
      success: true,
      message: "Doctors fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const approveDoctor = async (req, res, next) => {
  try {
    const data = await adminService.approveDoctor(req.params.id);

    res.status(200).json({
      success: true,
      message: "Doctor approved successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getAppointments = async (req, res, next) => {
  try {
    const data = await adminService.getAppointments();

    res.status(200).json({
      success: true,
      message: "Appointments fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardSummary,
  getDoctors,
  approveDoctor,
  getAppointments,
};