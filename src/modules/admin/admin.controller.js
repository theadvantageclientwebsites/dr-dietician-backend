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

const getPatients = async (req, res, next) => {
  try {
    const data = await adminService.getPatients(req.query);

    res.status(200).json({
      success: true,
      message: "Patients fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getPatientById = async (req, res, next) => {
  try {
    const data = await adminService.getPatientById(req.params.id);

    res.status(200).json({
      success: true,
      message: "Patient fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getInterns = async (req, res, next) => {
  try {
    const data = await adminService.getInterns();

    res.status(200).json({
      success: true,
      message: "Interns fetched successfully",
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

const updatePatient = async (req, res, next) => {
  try {
    const data = await adminService.updatePatient(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "Patient updated successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const deletePatient = async (req, res, next) => {
  try {
    const data = await adminService.deletePatient(req.params.id);

    res.status(200).json({
      success: true,
      message: "Patient deleted successfully",
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
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  getInterns,
  getAppointments,
};