const appointmentsService = require("./doctor-appointments.service");

const getMyAppointments = async (req, res, next) => {
  try {
    const doctorId = req.user.userId || req.user.id;
    const data = await appointmentsService.getMyAppointments(doctorId, req.query);
    res.status(200).json({ success: true, message: "Appointments fetched successfully", data });
  } catch (error) { next(error); }
};

const getAppointmentById = async (req, res, next) => {
  try {
    const doctorId = req.user.userId || req.user.id;
    const data = await appointmentsService.getAppointmentById(doctorId, req.params.id);
    res.status(200).json({ success: true, message: "Appointment fetched successfully", data });
  } catch (error) { next(error); }
};

const updateAppointment = async (req, res, next) => {
  try {
    const doctorId = req.user.userId || req.user.id;
    const data = await appointmentsService.updateAppointment(doctorId, req.params.id, req.body);
    res.status(200).json({ success: true, message: "Appointment updated successfully", data });
  } catch (error) { next(error); }
};

const updateAppointmentStatus = async (req, res, next) => {
  try {
    const doctorId = req.user.userId || req.user.id;
    const { status, notes } = req.body;
    if (!status) return res.status(400).json({ success: false, message: "Status is required" });
    const data = await appointmentsService.updateAppointmentStatus(doctorId, req.params.id, status, notes);
    res.status(200).json({ success: true, message: "Appointment status updated", data });
  } catch (error) { next(error); }
};

module.exports = {
  getMyAppointments,
  getAppointmentById,
  updateAppointment,
  updateAppointmentStatus,
};
