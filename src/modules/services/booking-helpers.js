const prisma = require("../../lib/prisma");

const SERVICE_TYPES = ["ONE_ON_ONE_CONSULTATION", "LAB_REPORT_ANALYSIS"];

const doctorPublicSelect = {
  id: true,
  fullName: true,
  profilePhotoUrl: true,
  doctorProfile: {
    select: {
      specialization: true,
      qualification: true,
      hospitalName: true,
      phoneNumber: true,
    },
  },
};

const patientPublicSelect = {
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
};

const serviceSelect = {
  id: true,
  type: true,
  name: true,
  description: true,
  price: true,
  durationMinutes: true,
  isActive: true,
};

const bookingInclude = {
  service: { select: serviceSelect },
  doctor: { select: doctorPublicSelect },
  appointment: {
    select: {
      id: true,
      dateTime: true,
      type: true,
      status: true,
    },
  },
  order: {
    select: {
      id: true,
      amount: true,
      status: true,
      isDummy: true,
      paidAt: true,
    },
  },
};

const buildCheckoutMeta = (data = {}) => {
  const appointmentType = data.appointmentType
    ? String(data.appointmentType).toUpperCase()
    : "ONLINE";

  if (!["ONLINE", "IN_PERSON"].includes(appointmentType)) {
    throw new Error("Invalid type. Use ONLINE or IN_PERSON");
  }

  let preferredDateTime = null;
  if (data.preferredDateTime) {
    const dt = new Date(data.preferredDateTime);
    if (Number.isNaN(dt.getTime())) {
      throw new Error("Invalid dateTime format. Use ISO 8601");
    }
    if (dt <= new Date()) {
      throw new Error("Appointment date must be in the future");
    }
    preferredDateTime = dt.toISOString();
  }

  return {
    preferredDateTime,
    notes: data.notes || null,
    appointmentType,
  };
};

const pickLeastBusyDoctor = async () => {
  const doctors = await prisma.user.findMany({
    where: {
      role: "DOCTOR",
      accountStatus: "ACTIVE",
      doctorProfile: { isApproved: true },
    },
    select: { id: true },
  });

  if (doctors.length === 0) {
    throw new Error("No approved doctor is available to assign");
  }

  const loads = await Promise.all(
    doctors.map(async (doctor) => {
      const [openAppointments, openBookings] = await Promise.all([
        prisma.appointment.count({
          where: {
            doctorId: doctor.id,
            status: { in: ["PENDING", "CONFIRMED"] },
          },
        }),
        prisma.serviceBooking.count({
          where: {
            doctorId: doctor.id,
            status: { in: ["PAID", "AWAITING_SCHEDULE", "SCHEDULED"] },
          },
        }),
      ]);
      return { id: doctor.id, load: openAppointments + openBookings };
    })
  );

  loads.sort((a, b) => a.load - b.load);
  return loads[0].id;
};

const assertApprovedDoctor = async (doctorId) => {
  if (!doctorId) throw new Error("doctorId is required");

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
  return doctor;
};

const hasDoctorConflict = async (doctorId, dateTime, excludeAppointmentId) => {
  return prisma.appointment.findFirst({
    where: {
      doctorId,
      dateTime,
      status: { in: ["PENDING", "CONFIRMED"] },
      ...(excludeAppointmentId ? { id: { not: excludeAppointmentId } } : {}),
    },
    select: { id: true },
  });
};

const createConsultAppointment = async ({
  patientId,
  doctorId,
  dateTime,
  type,
  notes,
  serviceBookingId,
}) => {
  const conflict = await hasDoctorConflict(doctorId, dateTime);
  if (conflict) return null;

  return prisma.appointment.create({
    data: {
      patientId,
      doctorId,
      dateTime,
      type,
      status: "PENDING",
      notes: notes || null,
      serviceBookingId,
    },
  });
};

const fulfillServiceOrder = async (order) => {
  const existing = await prisma.serviceBooking.findUnique({
    where: { orderId: order.id },
    include: bookingInclude,
  });
  if (existing) return existing;

  const service = await prisma.service.findFirst({
    where: { id: order.itemId, isActive: true },
  });
  if (!service) throw new Error("Service not found or inactive");

  const meta = order.checkoutMeta || {};
  const doctorId = await pickLeastBusyDoctor();
  const isConsult = service.type === "ONE_ON_ONE_CONSULTATION";
  const preferredDateTime = meta.preferredDateTime ? new Date(meta.preferredDateTime) : null;
  const appointmentType = meta.appointmentType === "IN_PERSON" ? "IN_PERSON" : "ONLINE";

  let status = "PAID";
  if (isConsult) {
    status = preferredDateTime ? "SCHEDULED" : "AWAITING_SCHEDULE";
  }

  const booking = await prisma.serviceBooking.create({
    data: {
      patientId: order.patientId,
      serviceId: service.id,
      orderId: order.id,
      doctorId,
      status,
      patientNotes: meta.notes || null,
      preferredDateTime,
      appointmentType,
    },
  });

  if (isConsult && preferredDateTime) {
    const appointment = await createConsultAppointment({
      patientId: order.patientId,
      doctorId,
      dateTime: preferredDateTime,
      type: appointmentType,
      notes: meta.notes,
      serviceBookingId: booking.id,
    });

    if (!appointment) {
      await prisma.serviceBooking.update({
        where: { id: booking.id },
        data: { status: "AWAITING_SCHEDULE" },
      });
    }
  }

  return prisma.serviceBooking.findUnique({
    where: { id: booking.id },
    include: bookingInclude,
  });
};

const syncServiceBookingFromAppointment = async (appointment, status) => {
  if (!appointment?.serviceBookingId) return;

  if (status === "COMPLETED") {
    await prisma.serviceBooking.update({
      where: { id: appointment.serviceBookingId },
      data: { status: "COMPLETED", completedAt: new Date() },
    });
  }

  if (status === "CANCELLED") {
    await prisma.serviceBooking.update({
      where: { id: appointment.serviceBookingId },
      data: { status: "CANCELLED" },
    });
  }
};

module.exports = {
  SERVICE_TYPES,
  doctorPublicSelect,
  patientPublicSelect,
  serviceSelect,
  bookingInclude,
  buildCheckoutMeta,
  pickLeastBusyDoctor,
  assertApprovedDoctor,
  hasDoctorConflict,
  createConsultAppointment,
  fulfillServiceOrder,
  syncServiceBookingFromAppointment,
};
