const doctorServicesService = require("./doctor-services.service");

const getMyBookings = async (req, res, next) => {
  try {
    const doctorId = req.user.userId || req.user.id;
    const data = await doctorServicesService.getMyBookings(doctorId, req.query);
    res.status(200).json({ success: true, message: "Service bookings fetched successfully", data });
  } catch (error) {
    next(error);
  }
};

const getBookingById = async (req, res, next) => {
  try {
    const doctorId = req.user.userId || req.user.id;
    const data = await doctorServicesService.getBookingById(doctorId, req.params.id);
    res.status(200).json({ success: true, message: "Service booking fetched successfully", data });
  } catch (error) {
    next(error);
  }
};

const scheduleBooking = async (req, res, next) => {
  try {
    const doctorId = req.user.userId || req.user.id;
    const data = await doctorServicesService.scheduleBooking(doctorId, req.params.id, req.body);
    res.status(200).json({ success: true, message: "Service booking scheduled successfully", data });
  } catch (error) {
    next(error);
  }
};

const completeBooking = async (req, res, next) => {
  try {
    const doctorId = req.user.userId || req.user.id;
    const data = await doctorServicesService.completeBooking(doctorId, req.params.id, req.body);
    res.status(200).json({ success: true, message: "Service booking completed successfully", data });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyBookings,
  getBookingById,
  scheduleBooking,
  completeBooking,
};
