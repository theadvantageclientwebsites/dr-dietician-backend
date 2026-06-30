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

const getPatients = async () => {
  const patients = await prisma.user.findMany({
    where: {
      role: "PATIENT",
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      accountStatus: true,
      createdAt: true,
      patientProfile: {
        select: {
          phoneNumber: true,
          whatsappNumber: true,
          gender: true,
          age: true,
          bloodGroup: true,
          location: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return patients;
};

const getInterns = async () => {
  const interns = await prisma.user.findMany({
    where: {
      role: "INTERN",
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      accountStatus: true,
      createdAt: true,
      internProfile: {
        select: {
          phoneNumber: true,
          universityName: true,
          specialization: true,
          semester: true,
          year: true,
          isApproved: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return interns;
};

module.exports = {
  getDashboardSummary,
  getDoctors,
  approveDoctor,
  getPatients,
  getInterns,
};