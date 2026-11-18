const prisma = require("../../../lib/prisma");
const { bookingInclude, serviceSelect } = require("../../services/booking-helpers");

const getServices = async (query) => {
  const where = { isActive: true };
  if (query.type) where.type = String(query.type).toUpperCase();

  const items = await prisma.service.findMany({
    where,
    orderBy: { createdAt: "asc" },
    select: serviceSelect,
  });

  return { items };
};

const getServiceById = async (serviceId) => {
  const service = await prisma.service.findFirst({
    where: { id: serviceId, isActive: true },
    select: serviceSelect,
  });
  if (!service) throw new Error("Service not found");
  return service;
};

const getMyBookings = async (patientId, query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;
  const where = { patientId };

  if (query.status) where.status = String(query.status).toUpperCase();
  if (query.type) where.service = { type: String(query.type).toUpperCase() };

  const totalItems = await prisma.serviceBooking.count({ where });
  const items = await prisma.serviceBooking.findMany({
    where,
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
    include: bookingInclude,
  });

  return {
    items,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    },
  };
};

const getMyBookingById = async (patientId, bookingId) => {
  const booking = await prisma.serviceBooking.findFirst({
    where: { id: bookingId, patientId },
    include: {
      ...bookingInclude,
      patient: {
        select: { id: true, fullName: true, email: true },
      },
    },
  });
  if (!booking) throw new Error("Service booking not found");
  return booking;
};

module.exports = {
  getServices,
  getServiceById,
  getMyBookings,
  getMyBookingById,
};
