const servicesService = require("./services.service");

const createService = async (req, res, next) => {
  try {
    const data = await servicesService.createService(req.body);
    res.status(201).json({ success: true, message: "Service created successfully", data });
  } catch (error) {
    next(error);
  }
};

const getServices = async (req, res, next) => {
  try {
    const data = await servicesService.getServices(req.query);
    res.status(200).json({ success: true, message: "Services fetched successfully", data });
  } catch (error) {
    next(error);
  }
};

const getServiceById = async (req, res, next) => {
  try {
    const data = await servicesService.getServiceById(req.params.id);
    res.status(200).json({ success: true, message: "Service fetched successfully", data });
  } catch (error) {
    next(error);
  }
};

const updateService = async (req, res, next) => {
  try {
    const data = await servicesService.updateService(req.params.id, req.body);
    res.status(200).json({ success: true, message: "Service updated successfully", data });
  } catch (error) {
    next(error);
  }
};

const toggleServiceStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;
    if (isActive === undefined) {
      return res.status(400).json({ success: false, message: "isActive field is required" });
    }
    const data = await servicesService.toggleServiceStatus(req.params.id, isActive);
    res.status(200).json({
      success: true,
      message: `Service ${data.isActive ? "activated" : "deactivated"} successfully`,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const deleteService = async (req, res, next) => {
  try {
    const data = await servicesService.deleteService(req.params.id);
    res.status(200).json({ success: true, message: data.message, data });
  } catch (error) {
    next(error);
  }
};

const getBookings = async (req, res, next) => {
  try {
    const data = await servicesService.getBookings(req.query);
    res.status(200).json({ success: true, message: "Service bookings fetched successfully", data });
  } catch (error) {
    next(error);
  }
};

const getBookingById = async (req, res, next) => {
  try {
    const data = await servicesService.getBookingById(req.params.id);
    res.status(200).json({ success: true, message: "Service booking fetched successfully", data });
  } catch (error) {
    next(error);
  }
};

const assignDoctor = async (req, res, next) => {
  try {
    const data = await servicesService.assignDoctor(req.params.id, req.body.doctorId);
    res.status(200).json({ success: true, message: "Doctor assigned to service booking successfully", data });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createService,
  getServices,
  getServiceById,
  updateService,
  toggleServiceStatus,
  deleteService,
  getBookings,
  getBookingById,
  assignDoctor,
};
