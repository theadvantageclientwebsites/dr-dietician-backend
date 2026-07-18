const prisma = require("../../../lib/prisma");

const getMyAppointments = async (patientId, query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where = { patientId };

  if (query.status) {
    where.status = query.status.toUpperCase();
  }

  if (query.type) {
    where.type = query.type.toUpperCase();
  }

  // upcoming filter
  if (query.upcoming === "true") {
    where.dateTime = { gte: new Date() };
    where.status = { in: ["PENDING", "CONFIRMED"] };
  }

  // past filter
  if (query.past === "true") {
    where.dateTime = { lt: new Date() };
  }

  const totalItems = await prisma.appointment.count({ where });

  const items = await prisma.appointment.findMany({
    where,
    skip,
    take: limit,
    orderBy: { dateTime: "desc" },
    select: {
      id: true,
      dateTime: true,
      type: true,
      status: true,
      notes: true,
      createdAt: true,
      doctor: {
        select: {
          id: true,
          fullName: true,
          profilePhotoUrl: true,
          doctorProfile: {
            select: {
              specialization: true,
              hospitalName: true,
              clinicAddress: true,
              phoneNumber: true,
            },
          },
        },
      },
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
  };
};

const getAppointmentById = async (patientId, appointmentId) => {
  const appointment = await prisma.appointment.findFirst({
    where: {
      id: appointmentId,
      patientId, // ensure patient can only view their own appointments
    },
    select: {
      id: true,
      dateTime: true,
      type: true,
      status: true,
      notes: true,
      createdAt: true,
      updatedAt: true,
      doctor: {
        select: {
          id: true,
          fullName: true,
          email: true,
          profilePhotoUrl: true,
          doctorProfile: {
            select: {
              specialization: true,
              qualification: true,
              hospitalName: true,
              clinicAddress: true,
              phoneNumber: true,
              yearsOfExperience: true,
            },
          },
        },
      },
    },
  });

  if (!appointment) throw new Error("Appointment not found");

  return appointment;
};

const bookAppointment = async (patientId, data) => {
  const { doctorId, dateTime, type, notes } = data;

  if (!doctorId || !dateTime) {
    throw new Error("doctorId and dateTime are required");
  }

  // Verify doctor exists and is active
  const doctor = await prisma.user.findFirst({
    where: {
      id: doctorId,
      role: "DOCTOR",
      accountStatus: "ACTIVE",
    },
    include: { doctorProfile: true },
  });

  if (!doctor) throw new Error("Doctor not found or not available");
  if (!doctor.doctorProfile?.isApproved) throw new Error("Doctor is not approved yet");

  // Validate dateTime is in the future
  const appointmentDate = new Date(dateTime);
  if (appointmentDate <= new Date()) {
    throw new Error("Appointment date must be in the future");
  }

  // Check if doctor already has an appointment at the same time
  const conflict = await prisma.appointment.findFirst({
    where: {
      doctorId,
      dateTime: appointmentDate,
      status: { in: ["PENDING", "CONFIRMED"] },
    },
  });

  if (conflict) throw new Error("Doctor already has an appointment at this time. Please choose another slot.");

  const appointment = await prisma.appointment.create({
    data: {
      patientId,
      doctorId,
      dateTime: appointmentDate,
      type: type ? type.toUpperCase() : "ONLINE",
      status: "PENDING",
      notes: notes || null,
    },
    select: {
      id: true,
      dateTime: true,
      type: true,
      status: true,
      notes: true,
      createdAt: true,
      doctor: {
        select: {
          id: true,
          fullName: true,
          profilePhotoUrl: true,
          doctorProfile: {
            select: {
              specialization: true,
              hospitalName: true,
              phoneNumber: true,
            },
          },
        },
      },
    },
  });

  return appointment;
};

const cancelAppointment = async (patientId, appointmentId) => {
  const appointment = await prisma.appointment.findFirst({
    where: {
      id: appointmentId,
      patientId,
    },
  });

  if (!appointment) throw new Error("Appointment not found");

  if (appointment.status === "CANCELLED") {
    throw new Error("Appointment is already cancelled");
  }

  if (appointment.status === "COMPLETED") {
    throw new Error("Cannot cancel a completed appointment");
  }

  const updated = await prisma.appointment.update({
    where: { id: appointmentId },
    data: { status: "CANCELLED" },
    select: {
      id: true,
      dateTime: true,
      type: true,
      status: true,
      doctor: {
        select: {
          id: true,
          fullName: true,
          doctorProfile: {
            select: { specialization: true },
          },
        },
      },
    },
  });

  return updated;
};

// Get list of available doctors for booking
const getAvailableDoctors = async (query) => {
  const where = {
    role: "DOCTOR",
    accountStatus: "ACTIVE",
    doctorProfile: {
      isApproved: true,
    },
  };

  if (query.specialization) {
    where.doctorProfile = {
      ...where.doctorProfile,
      specialization: {
        contains: query.specialization,
        mode: "insensitive",
      },
    };
  }

  if (query.search) {
    where.OR = [
      { fullName: { contains: query.search, mode: "insensitive" } },
      {
        doctorProfile: {
          specialization: { contains: query.search, mode: "insensitive" },
        },
      },
    ];
  }

  const doctors = await prisma.user.findMany({
    where,
    select: {
      id: true,
      fullName: true,
      profilePhotoUrl: true,
      doctorProfile: {
        select: {
          specialization: true,
          qualification: true,
          hospitalName: true,
          yearsOfExperience: true,
          phoneNumber: true,
        },
      },
    },
    orderBy: { fullName: "asc" },
  });

  return doctors;
};

module.exports = {
  getMyAppointments,
  getAppointmentById,
  bookAppointment,
  cancelAppointment,
  getAvailableDoctors,
};
