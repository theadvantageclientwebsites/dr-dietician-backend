const prisma = require("../../../lib/prisma");

const getMyPatients = async (doctorId, query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  // Get unique patients who had appointments with this doctor
  const patientGroups = await prisma.appointment.groupBy({
    by: ["patientId"],
    where: { doctorId },
  });

  const patientIds = patientGroups.map((g) => g.patientId);

  if (patientIds.length === 0) {
    return {
      items: [],
      pagination: { page, limit, totalItems: 0, totalPages: 0 },
    };
  }

  const where = { id: { in: patientIds } };

  if (query.search) {
    where.OR = [
      { fullName: { contains: query.search, mode: "insensitive" } },
      { email: { contains: query.search, mode: "insensitive" } },
    ];
  }

  const totalItems = await prisma.user.count({ where });

  const items = await prisma.user.findMany({
    where,
    skip,
    take: limit,
    orderBy: { fullName: "asc" },
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
          bloodGroup: true,
          location: true,
          heightCm: true,
          weightKg: true,
        },
      },
    },
  });

  // Attach last appointment info to each patient
  const itemsWithLastAppointment = await Promise.all(
    items.map(async (patient) => {
      const lastAppointment = await prisma.appointment.findFirst({
        where: { doctorId, patientId: patient.id },
        orderBy: { dateTime: "desc" },
        select: { id: true, dateTime: true, status: true, type: true },
      });
      return { ...patient, lastAppointment };
    })
  );

  return {
    items: itemsWithLastAppointment,
    pagination: { page, limit, totalItems, totalPages: Math.ceil(totalItems / limit) },
  };
};

const getPatientById = async (doctorId, patientId) => {
  // Verify this patient has had an appointment with this doctor
  const hasAppointment = await prisma.appointment.findFirst({
    where: { doctorId, patientId },
  });

  if (!hasAppointment) throw new Error("Patient not found or not associated with you");

  const patient = await prisma.user.findUnique({
    where: { id: patientId },
    select: {
      id: true,
      fullName: true,
      email: true,
      profilePhotoUrl: true,
      createdAt: true,
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
  });

  if (!patient) throw new Error("Patient not found");

  // Get appointment history with this doctor
  const appointmentHistory = await prisma.appointment.findMany({
    where: { doctorId, patientId },
    orderBy: { dateTime: "desc" },
    select: {
      id: true,
      dateTime: true,
      type: true,
      status: true,
      notes: true,
    },
  });

  return { ...patient, appointmentHistory };
};

module.exports = { getMyPatients, getPatientById };
