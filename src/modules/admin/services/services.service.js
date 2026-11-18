const prisma = require("../../../lib/prisma");
const {
  SERVICE_TYPES,
  bookingInclude,
  serviceSelect,
  assertApprovedDoctor,
  patientPublicSelect,
} = require("../../services/booking-helpers");

const createService = async (data) => {
  const { type, name, description, price, durationMinutes, isActive } = data;

  if (!type || !name || price === undefined) {
    throw new Error("type, name and price are required");
  }

  const normalizedType = String(type).toUpperCase();
  if (!SERVICE_TYPES.includes(normalizedType)) {
    throw new Error("Invalid service type. Use ONE_ON_ONE_CONSULTATION or LAB_REPORT_ANALYSIS");
  }

  const numericPrice = Number(price);
  if (Number.isNaN(numericPrice) || numericPrice <= 0) {
    throw new Error("Service price must be greater than 0");
  }

  return prisma.service.create({
    data: {
      type: normalizedType,
      name,
      description: description || null,
      price: numericPrice,
      durationMinutes:
        durationMinutes !== undefined
          ? durationMinutes === null
            ? null
            : Number(durationMinutes)
          : normalizedType === "ONE_ON_ONE_CONSULTATION"
            ? 60
            : null,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    },
    select: serviceSelect,
  });
};

const getServices = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;
  const where = {};

  if (query.type) where.type = String(query.type).toUpperCase();
  if (query.isActive !== undefined) where.isActive = query.isActive === "true";
  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: "insensitive" } },
      { description: { contains: query.search, mode: "insensitive" } },
    ];
  }

  const totalItems = await prisma.service.count({ where });
  const items = await prisma.service.findMany({
    where,
    skip,
    take: limit,
    orderBy: { createdAt: "asc" },
    select: serviceSelect,
  });

  return {
    items,
    pagination: { page, limit, totalItems, totalPages: Math.ceil(totalItems / limit) },
  };
};

const getServiceById = async (serviceId) => {
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    select: serviceSelect,
  });
  if (!service) throw new Error("Service not found");
  return service;
};

const updateService = async (serviceId, data) => {
  const existing = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!existing) throw new Error("Service not found");

  const updateData = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.isActive !== undefined) updateData.isActive = Boolean(data.isActive);

  if (data.type !== undefined) {
    const normalizedType = String(data.type).toUpperCase();
    if (!SERVICE_TYPES.includes(normalizedType)) {
      throw new Error("Invalid service type. Use ONE_ON_ONE_CONSULTATION or LAB_REPORT_ANALYSIS");
    }
    updateData.type = normalizedType;
  }

  if (data.price !== undefined) {
    const numericPrice = Number(data.price);
    if (Number.isNaN(numericPrice) || numericPrice <= 0) {
      throw new Error("Service price must be greater than 0");
    }
    updateData.price = numericPrice;
  }

  if (data.durationMinutes !== undefined) {
    updateData.durationMinutes = data.durationMinutes === null ? null : Number(data.durationMinutes);
  }

  return prisma.service.update({
    where: { id: serviceId },
    data: updateData,
    select: serviceSelect,
  });
};

const toggleServiceStatus = async (serviceId, isActive) => {
  const existing = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!existing) throw new Error("Service not found");

  return prisma.service.update({
    where: { id: serviceId },
    data: { isActive: Boolean(isActive) },
    select: serviceSelect,
  });
};

const deleteService = async (serviceId) => {
  const existing = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!existing) throw new Error("Service not found");

  const bookingCount = await prisma.serviceBooking.count({ where: { serviceId } });
  if (bookingCount > 0) {
    throw new Error("Cannot delete this service because it has bookings. Deactivate it instead.");
  }

  await prisma.service.delete({ where: { id: serviceId } });
  return { message: "Service deleted successfully" };
};

const getBookings = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;
  const where = {};

  if (query.status) where.status = String(query.status).toUpperCase();
  if (query.doctorId) where.doctorId = query.doctorId;
  if (query.patientId) where.patientId = query.patientId;
  if (query.type) where.service = { type: String(query.type).toUpperCase() };

  const totalItems = await prisma.serviceBooking.count({ where });
  const items = await prisma.serviceBooking.findMany({
    where,
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      ...bookingInclude,
      patient: { select: patientPublicSelect },
    },
  });

  return {
    items,
    pagination: { page, limit, totalItems, totalPages: Math.ceil(totalItems / limit) },
  };
};

const getBookingById = async (bookingId) => {
  const booking = await prisma.serviceBooking.findUnique({
    where: { id: bookingId },
    include: {
      ...bookingInclude,
      patient: { select: patientPublicSelect },
    },
  });
  if (!booking) throw new Error("Service booking not found");
  return booking;
};

const assignDoctor = async (bookingId, doctorId) => {
  const booking = await prisma.serviceBooking.findUnique({
    where: { id: bookingId },
    include: { appointment: true },
  });
  if (!booking) throw new Error("Service booking not found");
  if (booking.status === "CANCELLED") throw new Error("Cannot assign a doctor to a cancelled service booking");
  if (booking.status === "COMPLETED") throw new Error("Cannot assign a doctor to a completed service booking");

  await assertApprovedDoctor(doctorId);

  await prisma.serviceBooking.update({
    where: { id: bookingId },
    data: { doctorId },
  });

  if (booking.appointment && !["COMPLETED", "CANCELLED"].includes(booking.appointment.status)) {
    await prisma.appointment.update({
      where: { id: booking.appointment.id },
      data: { doctorId },
    });
  }

  return getBookingById(bookingId);
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
