const patientServicesService = require("./patient-services.service");

const getServices = async (req, res, next) => {
  try {
    const data = await patientServicesService.getServices(req.query);
    res.status(200).json({ success: true, message: "Services fetched successfully", data });
  } catch (error) {
    next(error);
  }
};

const getServiceById = async (req, res, next) => {
  try {
    const data = await patientServicesService.getServiceById(req.params.id);
    res.status(200).json({ success: true, message: "Service fetched successfully", data });
  } catch (error) {
    next(error);
  }
};

const getMyBookings = async (req, res, next) => {
  try {
    const patientId = req.user.userId || req.user.id;
    const data = await patientServicesService.getMyBookings(patientId, req.query);
    res.status(200).json({ success: true, message: "Service bookings fetched successfully", data });
  } catch (error) {
    next(error);
  }
};

const getMyBookingById = async (req, res, next) => {
  try {
    const patientId = req.user.userId || req.user.id;
    const data = await patientServicesService.getMyBookingById(patientId, req.params.id);
    res.status(200).json({ success: true, message: "Service booking fetched successfully", data });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getServices,
  getServiceById,
  getMyBookings,
  getMyBookingById,
};
