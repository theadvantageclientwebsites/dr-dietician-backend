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

const getPatients = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where = {
    role: "PATIENT",
  };

  const totalItems = await prisma.user.count({ where });

  const items = await prisma.user.findMany({
    where,
    skip,
    take: limit,
    select: {
      id: true,
      fullName: true,
      email: true,
      accountStatus: true,
      createdAt: true,
      profilePhotoUrl: true,
      patientProfile: {
        select: {
          phoneNumber: true,
          whatsappNumber: true,
          gender: true,
          age: true,
          bloodGroup: true,
          location: true,
          heightCm: true,
          weightKg: true,
          socialHandle: true,
          isDefencePersonnel: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
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

const getPatientById = async (patientId) => {
  const patient = await prisma.user.findFirst({
    where: {
      id: patientId,
      role: "PATIENT",
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      accountStatus: true,
      createdAt: true,
      updatedAt: true,
      profilePhotoUrl: true,
      patientProfile: {
        select: {
          phoneNumber: true,
          whatsappNumber: true,
          gender: true,
          age: true,
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

  if (!patient) {
    throw new Error("Patient not found");
  }

  return patient;
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

const updatePatient = async (patientId, updateData) => {
  const patient = await prisma.user.findFirst({
    where: {
      id: patientId,
      role: "PATIENT",
    },
  });

  if (!patient) {
    throw new Error("Patient not found");
  }

  const { fullName, email, accountStatus, profilePhotoUrl, patientProfile } = updateData;

  const userUpdateData = {};
  if (fullName !== undefined) userUpdateData.fullName = fullName;
  if (email !== undefined) userUpdateData.email = email;
  if (accountStatus !== undefined) userUpdateData.accountStatus = accountStatus;
  if (profilePhotoUrl !== undefined) userUpdateData.profilePhotoUrl = profilePhotoUrl;

  const profileUpdateData = {};
  if (patientProfile) {
    if (patientProfile.gender !== undefined) profileUpdateData.gender = patientProfile.gender;
    if (patientProfile.location !== undefined) profileUpdateData.location = patientProfile.location;
    if (patientProfile.phoneNumber !== undefined) profileUpdateData.phoneNumber = patientProfile.phoneNumber;
    if (patientProfile.whatsappNumber !== undefined) profileUpdateData.whatsappNumber = patientProfile.whatsappNumber;
    if (patientProfile.age !== undefined) profileUpdateData.age = patientProfile.age;
    if (patientProfile.heightCm !== undefined) profileUpdateData.heightCm = patientProfile.heightCm;
    if (patientProfile.weightKg !== undefined) profileUpdateData.weightKg = patientProfile.weightKg;
    if (patientProfile.bloodGroup !== undefined) profileUpdateData.bloodGroup = patientProfile.bloodGroup;
    if (patientProfile.socialHandle !== undefined) profileUpdateData.socialHandle = patientProfile.socialHandle;
    if (patientProfile.isDefencePersonnel !== undefined) profileUpdateData.isDefencePersonnel = patientProfile.isDefencePersonnel;
  }

  const updatedPatient = await prisma.user.update({
    where: {
      id: patientId,
    },
    data: {
      ...userUpdateData,
      ...(Object.keys(profileUpdateData).length > 0 && {
        patientProfile: {
          update: profileUpdateData,
        },
      }),
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      accountStatus: true,
      profilePhotoUrl: true,
      createdAt: true,
      updatedAt: true,
      patientProfile: {
        select: {
          phoneNumber: true,
          whatsappNumber: true,
          gender: true,
          age: true,
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

  return updatedPatient;
};

const deletePatient = async (patientId) => {
  const patient = await prisma.user.findFirst({
    where: {
      id: patientId,
      role: "PATIENT",
    },
  });

  if (!patient) {
    throw new Error("Patient not found");
  }

  await prisma.user.delete({
    where: {
      id: patientId,
    },
  });

  return { message: "Patient deleted successfully" };
};

module.exports = {
  getDashboardSummary,
  getDoctors,
  approveDoctor,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  getInterns,
  getAppointments,
};