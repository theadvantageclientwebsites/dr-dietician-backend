const prisma = require("../../../lib/prisma");

const getAppointmentsSummary = async () => {
  const total = await prisma.appointment.count();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayCount = await prisma.appointment.count({
    where: {
      dateTime: {
        gte: today,
        lt: tomorrow,
      },
    },
  });

  const pending = await prisma.appointment.count({
    where: { status: "PENDING" },
  });

  const confirmed = await prisma.appointment.count({
    where: { status: "CONFIRMED" },
  });

  const completed = await prisma.appointment.count({
    where: { status: "COMPLETED" },
  });

  const cancelled = await prisma.appointment.count({
    where: { status: "CANCELLED" },
  });

  return {
    total,
    today: todayCount,
    pending,
    confirmed,
    completed,
    cancelled,
  };
};

const getAppointments = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where = {};

  // Status filter
  if (query.status) {
    where.status = query.status.toUpperCase();
  }

  // Type filter
  if (query.type) {
    where.type = query.type.toUpperCase();
  }

  // Search by patient or doctor name
  if (query.search) {
    where.OR = [
      {
        patient: {
          fullName: {
            contains: query.search,
            mode: "insensitive",
          },
        },
      },
      {
        doctor: {
          fullName: {
            contains: query.search,
            mode: "insensitive",
          },
        },
      },
    ];
  }

  // Filter by specific doctor
  if (query.doctorId) {
    where.doctorId = query.doctorId;
  }

  // Filter by specific patient
  if (query.patientId) {
    where.patientId = query.patientId;
  }

  // Date range filter
  if (query.fromDate || query.toDate) {
    where.dateTime = {};
    if (query.fromDate) {
      where.dateTime.gte = new Date(query.fromDate);
    }
    if (query.toDate) {
      const toDate = new Date(query.toDate);
      toDate.setHours(23, 59, 59, 999);
      where.dateTime.lte = toDate;
    }
  }

  // Today filter
  if (query.today === "true") {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    where.dateTime = {
      gte: todayStart,
      lte: todayEnd,
    };
  }

  const totalItems = await prisma.appointment.count({ where });

  const items = await prisma.appointment.findMany({
    where,
    skip,
    take: limit,
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
          email: true,
          profilePhotoUrl: true,
          patientProfile: {
            select: {
              phoneNumber: true,
            },
          },
        },
      },
      doctor: {
        select: {
          id: true,
          fullName: true,
          email: true,
          profilePhotoUrl: true,
          doctorProfile: {
            select: {
              phoneNumber: true,
              specialization: true,
            },
          },
        },
      },
    },
    orderBy: {
      dateTime: "desc",
    },
  });

  return {
    items,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    },
    filters: {
      search: query.search || null,
      status: query.status || null,
      type: query.type || null,
      doctorId: query.doctorId || null,
      patientId: query.patientId || null,
      fromDate: query.fromDate || null,
      toDate: query.toDate || null,
      today: query.today || null,
    },
  };
};

const getAppointmentById = async (appointmentId) => {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
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
              gender: true,
              age: true,
              bloodGroup: true,
              location: true,
            },
          },
        },
      },
      doctor: {
        select: {
          id: true,
          fullName: true,
          email: true,
          profilePhotoUrl: true,
          doctorProfile: {
            select: {
              phoneNumber: true,
              specialization: true,
              qualification: true,
              hospitalName: true,
            },
          },
        },
      },
    },
  });

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  return appointment;
};

const updateAppointmentStatus = async (appointmentId, status) => {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
  });

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  const updated = await prisma.appointment.update({
    where: { id: appointmentId },
    data: { status: status.toUpperCase() },
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
        },
      },
      doctor: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
    },
  });

  return updated;
};

const deleteAppointment = async (appointmentId) => {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
  });

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  await prisma.appointment.delete({
    where: { id: appointmentId },
  });

  return { message: "Appointment deleted successfully" };
};

module.exports = {
  getAppointmentsSummary,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  deleteAppointment,
};
