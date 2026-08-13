const prisma = require("../../../lib/prisma");

const getMyAppointments = async (doctorId, query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where = { doctorId };

  if (query.status) where.status = query.status.toUpperCase();
  if (query.type) where.type = query.type.toUpperCase();

  if (query.upcoming === "true") {
    where.dateTime = { gte: new Date() };
    where.status = { in: ["PENDING", "CONFIRMED"] };
  }

  if (query.today === "true") {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    where.dateTime = { gte: today, lt: tomorrow };
  }

  if (query.search) {
    where.patient = {
      fullName: { contains: query.search, mode: "insensitive" },
    };
  }

  const totalItems = await prisma.appointment.count({ where });

  const items = await prisma.appointment.findMany({
    where,
    skip,
    take: limit,
    orderBy: { dateTime: "asc" },
    select: {
      id: true,
      dateTime: true,
      type: true,
      status: true,
      notes: true,
      createdAt: true,
      patient: {
        select: {
          id: true,
          fullName: true,
          profilePhotoUrl: true,
          patientProfile: {
            select: {
              phoneNumber: true,
              age: true,
              gender: true,
              bloodGroup: true,
              location: true,
              heightCm: true,
              weightKg: true,
            },
          },
        },
      },
    },
  });

  return {
    items,
    pagination: { page, limit, totalItems, totalPages: Math.ceil(totalItems / limit) },
  };
};

const getAppointmentById = async (doctorId, appointmentId) => {
  const appointment = await prisma.appointment.findFirst({
    where: { id: appointmentId, doctorId },
    select: {
      id: true,
      dateTime: true,
      type: true,
      status: true,
      notes: true,
      createdAt: true,
      updatedAt: true,
      patient: {
        select: {
          id: true,
          fullName: true,
          email: true,
          profilePhotoUrl: true,
          patientProfile: {
            select: {
              phoneNumber: true,
              whatsappNumber: true,
              age: true,
              gender: true,
              bloodGroup: true,
              location: true,
              heightCm: true,
              weightKg: true,
              socialHandle: true,
              isDefencePersonnel: true,
            },
          },
        },
      },
    },
  });

  if (!appointment) throw new Error("Appointment not found");
  return appointment;
};

const updateAppointment = async (doctorId, appointmentId, data) => {
  const { dateTime, type, notes } = data;

  if (dateTime === undefined && type === undefined && notes === undefined) {
    throw new Error("At least one field is required: dateTime, type, or notes");
  }

  const appointment = await prisma.appointment.findFirst({
    where: { id: appointmentId, doctorId },
  });

  if (!appointment) throw new Error("Appointment not found");

  if (appointment.status === "COMPLETED") {
    throw new Error("Cannot update a completed appointment");
  }

  if (appointment.status === "CANCELLED") {
    throw new Error("Cannot update a cancelled appointment");
  }

  const updateData = {};

  if (dateTime !== undefined) {
    const appointmentDate = new Date(dateTime);
    if (Number.isNaN(appointmentDate.getTime())) {
      throw new Error("Invalid dateTime format. Use ISO 8601");
    }
    if (appointmentDate <= new Date()) {
      throw new Error("Appointment date must be in the future");
    }

    const conflict = await prisma.appointment.findFirst({
      where: {
        doctorId,
        dateTime: appointmentDate,
        status: { in: ["PENDING", "CONFIRMED"] },
        id: { not: appointmentId },
      },
    });

    if (conflict) {
      throw new Error("Doctor already has an appointment at this time. Please choose another slot.");
    }

    updateData.dateTime = appointmentDate;
  }

  if (type !== undefined) {
    const normalizedType = type.toUpperCase();
    if (!["ONLINE", "IN_PERSON"].includes(normalizedType)) {
      throw new Error("Invalid type. Use ONLINE or IN_PERSON");
    }
    updateData.type = normalizedType;
  }

  if (notes !== undefined) updateData.notes = notes;

  return prisma.appointment.update({
    where: { id: appointmentId },
    data: updateData,
    select: {
      id: true,
      dateTime: true,
      type: true,
      status: true,
      notes: true,
      updatedAt: true,
      patient: {
        select: {
          id: true,
          fullName: true,
          email: true,
          profilePhotoUrl: true,
          patientProfile: {
            select: {
              phoneNumber: true,
              age: true,
              gender: true,
            },
          },
        },
      },
    },
  });
};

const updateAppointmentStatus = async (doctorId, appointmentId, status, notes) => {
  const appointment = await prisma.appointment.findFirst({
    where: { id: appointmentId, doctorId },
  });

  if (!appointment) throw new Error("Appointment not found");

  const validStatuses = ["CONFIRMED", "COMPLETED", "CANCELLED"];
  if (!validStatuses.includes(status.toUpperCase())) {
    throw new Error(`Invalid status. Doctor can set: ${validStatuses.join(", ")}`);
  }

  const updateData = { status: status.toUpperCase() };
  if (notes !== undefined) updateData.notes = notes;

  return prisma.appointment.update({
    where: { id: appointmentId },
    data: updateData,
    select: {
      id: true,
      dateTime: true,
      type: true,
      status: true,
      notes: true,
      updatedAt: true,
      patient: {
        select: { id: true, fullName: true, email: true },
      },
    },
  });
};

module.exports = {
  getMyAppointments,
  getAppointmentById,
  updateAppointment,
  updateAppointmentStatus,
};
