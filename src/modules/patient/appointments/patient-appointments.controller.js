const patientAppointmentsService = require("./patient-appointments.service");

const getMyAppointments = async (req, res, next) => {
  try {
    const patientId = req.user.userId || req.user.id;
    const data = await patientAppointmentsService.getMyAppointments(patientId, req.query);

    res.status(200).json({
      success: true,
      message: "Appointments fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getAppointmentById = async (req, res, next) => {
  try {
    const patientId = req.user.userId || req.user.id;
    const data = await patientAppointmentsService.getAppointmentById(patientId, req.params.id);

    res.status(200).json({
      success: true,
      message: "Appointment fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const bookAppointment = async (req, res, next) => {
  try {
    const patientId = req.user.userId || req.user.id;
    const data = await patientAppointmentsService.bookAppointment(patientId, req.body);

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const cancelAppointment = async (req, res, next) => {
  try {
    const patientId = req.user.userId || req.user.id;
    const data = await patientAppointmentsService.cancelAppointment(patientId, req.params.id);

    res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getAvailableDoctors = async (req, res, next) => {
  try {
    const data = await patientAppointmentsService.getAvailableDoctors(req.query);

    res.status(200).json({
      success: true,
      message: "Available doctors fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyAppointments,
  getAppointmentById,
  bookAppointment,
  cancelAppointment,
  getAvailableDoctors,
};
