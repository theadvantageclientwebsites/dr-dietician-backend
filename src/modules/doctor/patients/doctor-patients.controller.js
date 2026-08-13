const doctorPatientsService = require("./doctor-patients.service");

const getMyPatients = async (req, res, next) => {
  try {
    const doctorId = req.user.userId || req.user.id;
    const data = await doctorPatientsService.getMyPatients(doctorId, req.query);
    res.status(200).json({ success: true, message: "Patients fetched successfully", data });
  } catch (error) { next(error); }
};

const getPatientById = async (req, res, next) => {
  try {
    const doctorId = req.user.userId || req.user.id;
    const data = await doctorPatientsService.getPatientById(doctorId, req.params.id);
    res.status(200).json({ success: true, message: "Patient fetched successfully", data });
  } catch (error) { next(error); }
};

module.exports = { getMyPatients, getPatientById };
