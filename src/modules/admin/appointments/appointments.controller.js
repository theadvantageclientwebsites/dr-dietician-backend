const appointmentsService = require("./appointments.service");

const getAppointmentsSummary = async (req, res, next) => {
  try {
    const data = await appointmentsService.getAppointmentsSummary();

    res.status(200).json({
      success: true,
      message: "Appointments summary fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getAppointments = async (req, res, next) => {
  try {
    const data = await appointmentsService.getAppointments(req.query);

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
    const data = await appointmentsService.getAppointmentById(req.params.id);

    res.status(200).json({
      success: true,
      message: "Appointment fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const validStatuses = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];
    if (!validStatuses.includes(status.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const data = await appointmentsService.updateAppointmentStatus(req.params.id, status);

    res.status(200).json({
      success: true,
      message: "Appointment status updated successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const deleteAppointment = async (req, res, next) => {
  try {
    const data = await appointmentsService.deleteAppointment(req.params.id);

    res.status(200).json({
      success: true,
      message: "Appointment deleted successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAppointmentsSummary,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  deleteAppointment,
};
