const prisma = require("../../lib/prisma");

const getDashboardSummary = async () => {
  const totalPatients = await prisma.user.count({
    where: {
      role: "PATIENT",
    },
  });

  const totalDoctors = await prisma.user.count({
    where: {
      role: "DOCTOR",
    },
  });

  const pendingDoctors = await prisma.user.count({
    where: {
      role: "DOCTOR",
      accountStatus: "PENDING_APPROVAL",
    },
  });

  const totalInterns = await prisma.user.count({
    where: {
      role: "INTERN",
    },
  });

  return {
    totalPatients,
    totalDoctors,
    pendingDoctors,
    totalInterns,
  };
};

const getAppointments = async () => {
  const appointments = await prisma.appointment.findMany({
    select: {
      id: true,
      title: true,
      notes: true,
      date: true,
      status: true,
      createdAt: true,
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
    orderBy: {
      date: "asc",
    },
  });

  return appointments;
};

module.exports = {
  getDashboardSummary,
  getAppointments,
};