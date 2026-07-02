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

const getDoctors = async () => {
  const doctors = await prisma.user.findMany({
    where: {
      role: "DOCTOR",
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      accountStatus: true,
      createdAt: true,
      doctorProfile: {
        select: {
          phoneNumber: true,
          specialization: true,
          qualification: true,
          licenseNumber: true,
          yearsOfExperience: true,
          hospitalName: true,
          clinicAddress: true,
          isApproved: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return doctors;
};

const approveDoctor = async (doctorId) => {
  const doctor = await prisma.user.findFirst({
    where: {
      id: doctorId,
      role: "DOCTOR",
    },
    include: {
      doctorProfile: true,
    },
  });

  if (!doctor) {
    throw new Error("Doctor not found");
  }

  const updatedDoctor = await prisma.user.update({
    where: {
      id: doctorId,
    },
    data: {
      accountStatus: "ACTIVE",
      doctorProfile: {
        update: {
          isApproved: true,
        },
      },
    },
    include: {
      doctorProfile: true,
    },
  });

  return updatedDoctor;
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
  getDoctors,
  approveDoctor,
  getAppointments,
};