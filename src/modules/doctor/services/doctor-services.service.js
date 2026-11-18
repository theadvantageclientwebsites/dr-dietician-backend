const prisma = require("../../../lib/prisma");
const {
  bookingInclude,
  patientPublicSelect,
  hasDoctorConflict,
} = require("../../services/booking-helpers");

const doctorBookingInclude = {
  ...bookingInclude,
  patient: { select: patientPublicSelect },
};

const getMyBookings = async (doctorId, query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;
  const where = { doctorId };

  if (query.status) where.status = String(query.status).toUpperCase();
  if (query.type) where.service = { type: String(query.type).toUpperCase() };

  const totalItems = await prisma.serviceBooking.count({ where });
  const items = await prisma.serviceBooking.findMany({
    where,
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
    include: doctorBookingInclude,
  });

  return {
    items,
    pagination: { page, limit, totalItems, totalPages: Math.ceil(totalItems / limit) },
  };
};

const getBookingById = async (doctorId, bookingId) => {
  const booking = await prisma.serviceBooking.findFirst({
    where: { id: bookingId, doctorId },
    include: doctorBookingInclude,
  });
  if (!booking) throw new Error("Service booking not found");
  return booking;
};

const scheduleBooking = async (doctorId, bookingId, data) => {
  const booking = await prisma.serviceBooking.findFirst({
    where: { id: bookingId, doctorId },
    include: { service: true, appointment: true },
  });
  if (!booking) throw new Error("Service booking not found");
  if (booking.service.type !== "ONE_ON_ONE_CONSULTATION") {
    throw new Error("This service does not use a time slot");
  }
  if (["COMPLETED", "CANCELLED"].includes(booking.status)) {
    throw new Error("Cannot schedule a completed or cancelled service booking");
  }
  if (!data.dateTime) throw new Error("dateTime is required");

  const dateTime = new Date(data.dateTime);
  if (Number.isNaN(dateTime.getTime())) {
    throw new Error("Invalid dateTime format. Use ISO 8601");
  }
  if (dateTime <= new Date()) {
    throw new Error("Appointment date must be in the future");
  }

  const appointmentType = data.type ? String(data.type).toUpperCase() : booking.appointmentType;
  if (!["ONLINE", "IN_PERSON"].includes(appointmentType)) {
    throw new Error("Invalid type. Use ONLINE or IN_PERSON");
  }

  const conflict = await hasDoctorConflict(doctorId, dateTime, booking.appointment?.id);
  if (conflict) {
    throw new Error("Doctor already has an appointment at this time. Please choose another slot.");
  }

  if (booking.appointment) {
    await prisma.appointment.update({
      where: { id: booking.appointment.id },
      data: {
        dateTime,
        type: appointmentType,
        previousDateTime: booking.appointment.dateTime,
        rescheduledAt: new Date(),
        rescheduledByDoctor: true,
        status: booking.appointment.status === "CANCELLED" ? "PENDING" : booking.appointment.status,
      },
    });
  } else {
    await prisma.appointment.create({
      data: {
        patientId: booking.patientId,
        doctorId,
        dateTime,
        type: appointmentType,
        status: "PENDING",
        notes: booking.patientNotes,
        serviceBookingId: booking.id,
      },
    });
  }

  await prisma.serviceBooking.update({
    where: { id: booking.id },
    data: {
      status: "SCHEDULED",
      preferredDateTime: dateTime,
      appointmentType,
    },
  });

  return getBookingById(doctorId, bookingId);
};

const completeBooking = async (doctorId, bookingId, data) => {
  const booking = await prisma.serviceBooking.findFirst({
    where: { id: bookingId, doctorId },
    include: { service: true, appointment: true },
  });
  if (!booking) throw new Error("Service booking not found");
  if (booking.status === "CANCELLED") {
    throw new Error("Cannot complete a cancelled service booking");
  }
  if (booking.status === "COMPLETED") {
    throw new Error("Service booking is already completed");
  }

  if (booking.service.type === "LAB_REPORT_ANALYSIS" && !data.doctorNotes) {
    throw new Error("doctorNotes is required to complete lab report analysis");
  }

  if (booking.appointment && !["COMPLETED", "CANCELLED"].includes(booking.appointment.status)) {
    await prisma.appointment.update({
      where: { id: booking.appointment.id },
      data: { status: "COMPLETED", notes: data.doctorNotes || booking.appointment.notes },
    });
  }

  await prisma.serviceBooking.update({
    where: { id: booking.id },
    data: {
      status: "COMPLETED",
      doctorNotes: data.doctorNotes !== undefined ? data.doctorNotes : booking.doctorNotes,
      completedAt: new Date(),
    },
  });

  return getBookingById(doctorId, bookingId);
};

module.exports = {
  getMyBookings,
  getBookingById,
  scheduleBooking,
  completeBooking,
};
