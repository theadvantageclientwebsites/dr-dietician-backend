const doctorsService = require("./doctors.service");

const createDoctor = async (req, res, next) => {
  try {
    const data = await doctorsService.createDoctor(req.body);

    res.status(201).json({
      success: true,
      message: "Doctor created successfully. Please share the credentials with the doctor.",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getDoctors = async (req, res, next) => {
  try {
    const data = await doctorsService.getDoctors(req.query);

    res.status(200).json({
      success: true,
      message: "Doctors fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getDoctorById = async (req, res, next) => {
  try {
    const data = await doctorsService.getDoctorById(req.params.id);

    res.status(200).json({
      success: true,
      message: "Doctor fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const updateDoctor = async (req, res, next) => {
  try {
    const data = await doctorsService.updateDoctor(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "Doctor updated successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const updateDoctorStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const data = await doctorsService.updateDoctorStatus(req.params.id, status);

    res.status(200).json({
      success: true,
      message: "Doctor status updated successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const approveDoctor = async (req, res, next) => {
  try {
    const data = await doctorsService.approveDoctor(req.params.id);

    res.status(200).json({
      success: true,
      message: "Doctor approved successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const deleteDoctor = async (req, res, next) => {
  try {
    const data = await doctorsService.deleteDoctor(req.params.id);

    res.status(200).json({
      success: true,
      message: "Doctor deleted successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  updateDoctorStatus,
  approveDoctor,
  deleteDoctor,
};
