const prisma = require("../../../lib/prisma");
const { getActiveSubscription } = require("../subscriptions/subscriptions.service");

const patientAppointmentSelect = {
  id: true,
  dateTime: true,
  type: true,
  status: true,
  notes: true,
  previousDateTime: true,
  rescheduledAt: true,
  rescheduledByDoctor: true,
  createdAt: true,
  updatedAt: true,
  doctor: {
    select: {
      id: true,
      fullName: true,
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
};

const withRescheduleInfo = (appointment) => {
  if (!appointment) return appointment;

  const { rescheduledByDoctor, rescheduledAt, previousDateTime, doctor, ...rest } = appointment;

  return {
    ...rest,
    rescheduledByDoctor,
    rescheduledAt,
    previousDateTime,
    doctor,
    rescheduleInfo: rescheduledByDoctor
      ? {
          rescheduledByDoctor: true,
          rescheduledAt,
          previousDateTime,
          message: `Rescheduled by ${doctor?.fullName || "your doctor"}`,
        }
      : null,
  };
};

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

  if (query.upcoming === "true") {
    where.dateTime = { gte: new Date() };
    where.status = { in: ["PENDING", "CONFIRMED"] };
  }

  if (query.past === "true") {
    where.dateTime = { lt: new Date() };
  }

  const totalItems = await prisma.appointment.count({ where });

  const items = await prisma.appointment.findMany({
    where,
    skip,
    take: limit,
    orderBy: { dateTime: "desc" },
    select: patientAppointmentSelect,
  });

  return {
    items: items.map(withRescheduleInfo),
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
      patientId,
    },
    select: {
      ...patientAppointmentSelect,
      doctor: {
        select: {
          ...patientAppointmentSelect.doctor.select,
          email: true,
        },
      },
    },
  });

  if (!appointment) throw new Error("Appointment not found");

  return withRescheduleInfo(appointment);
};

const bookAppointment = async (patientId, data) => {
  const { doctorId, dateTime, type, notes } = data;

  if (!doctorId || !dateTime) {
    throw new Error("doctorId and dateTime are required");
  }

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

  const subscription = await getActiveSubscription(patientId);
  if (!subscription) {
    throw new Error("An active package is required to book an appointment");
  }
  if (subscription.status === "PENDING_ASSIGNMENT" || !subscription.doctor?.id) {
    throw new Error("Your package is waiting for admin to assign a doctor");
  }
  if (subscription.doctor.id !== doctorId) {
    throw new Error("You can only book appointments with your assigned package doctor");
  }
  if (subscription.meetingsRemainingThisMonth <= 0) {
    throw new Error("Monthly appointment limit reached (4 meetings). Try again next month.");
  }

  const appointmentDate = new Date(dateTime);
  if (appointmentDate <= new Date()) {
    throw new Error("Appointment date must be in the future");
  }

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
    select: patientAppointmentSelect,
  });

  return withRescheduleInfo(appointment);
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
    select: patientAppointmentSelect,
  });

  return withRescheduleInfo(updated);
};

const getAvailableDoctors = async (patientId, query) => {
  const subscription = await getActiveSubscription(patientId);

  if (subscription?.status === "PENDING_ASSIGNMENT" || (subscription && !subscription.doctor?.id)) {
    return [];
  }

  const where = {
    role: "DOCTOR",
    accountStatus: "ACTIVE",
    doctorProfile: {
      isApproved: true,
    },
  };

  if (subscription?.doctor?.id) {
    where.id = subscription.doctor.id;
  }

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
  withRescheduleInfo,
  patientAppointmentSelect,
};
