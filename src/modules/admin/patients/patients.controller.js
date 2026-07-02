const patientsService = require("./patients.service");

const createPatient = async (req, res, next) => {
  try {
    const data = await patientsService.createPatient(req.body);

    res.status(201).json({
      success: true,
      message: "Patient created successfully. Please share the credentials with the patient.",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getPatients = async (req, res, next) => {
  try {
    const data = await patientsService.getPatients(req.query);

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
    const data = await patientsService.getPatientById(req.params.id);

    res.status(200).json({
      success: true,
      message: "Patient fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const updatePatient = async (req, res, next) => {
  try {
    const data = await patientsService.updatePatient(req.params.id, req.body);

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
    const data = await patientsService.deletePatient(req.params.id);

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
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
};
