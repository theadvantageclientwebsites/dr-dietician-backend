const prisma = require("../../../lib/prisma");
const { hashPassword } = require("../../../utils/hash");
const crypto = require("crypto");

const generateRandomPassword = () => {
  return crypto.randomBytes(8).toString("hex"); // Generates 16-character password
};

const createDoctor = async (doctorData) => {
  const {
    fullName,
    email,
    phoneNumber,
    specialization,
    qualification,
    licenseNumber,
    yearsOfExperience,
    hospitalName,
    clinicAddress,
  } = doctorData;

  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  // Check if license number already exists
  if (licenseNumber) {
    const existingLicense = await prisma.doctorProfile.findUnique({
      where: { licenseNumber },
    });

    if (existingLicense) {
      throw new Error("License number already exists");
    }
  }

  // Generate random password
  const plainPassword = generateRandomPassword();
  const passwordHash = await hashPassword(plainPassword);

  // Create user with doctor profile
  const newDoctor = await prisma.user.create({
    data: {
      fullName,
      email,
      passwordHash,
      role: "DOCTOR",
      accountStatus: "ACTIVE", // Admin-created doctors are auto-approved
      registrationStatus: "COMPLETED",
      doctorProfile: {
        create: {
          phoneNumber: phoneNumber || null,
          specialization: specialization || null,
          qualification: qualification || null,
          licenseNumber: licenseNumber || null,
          yearsOfExperience: yearsOfExperience ? Number(yearsOfExperience) : null,
          hospitalName: hospitalName || null,
          clinicAddress: clinicAddress || null,
          isApproved: true, // Auto-approve admin-created doctors
        },
      },
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      accountStatus: true,
      createdAt: true,
      profilePhotoUrl: true,
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
  });

  // Return the doctor data with the generated password
  return {
    ...newDoctor,
    generatedPassword: plainPassword, // Return plain password to share with doctor
  };
};

const getDoctors = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  // Build where clause with filters
  const where = {
    role: "DOCTOR",
  };

  // Search filter - searches in fullName, email, and phone number
  if (query.search) {
    where.OR = [
      {
        fullName: {
          contains: query.search,
          mode: "insensitive",
        },
      },
      {
        email: {
          contains: query.search,
          mode: "insensitive",
        },
      },
      {
        doctorProfile: {
          phoneNumber: {
            contains: query.search,
          },
        },
      },
    ];
  }

  // Account Status filter
  if (query.status) {
    where.accountStatus = query.status.toUpperCase();
  }

  // Approval Status filter
  if (query.isApproved !== undefined) {
    where.doctorProfile = {
      ...where.doctorProfile,
      isApproved: query.isApproved === "true",
    };
  }

  // Specialization filter
  if (query.specialization) {
    where.doctorProfile = {
      ...where.doctorProfile,
      specialization: {
        contains: query.specialization,
        mode: "insensitive",
      },
    };
  }

  // Hospital filter
  if (query.hospital) {
    where.doctorProfile = {
      ...where.doctorProfile,
      hospitalName: {
        contains: query.hospital,
        mode: "insensitive",
      },
    };
  }

  // Years of experience range filter
  if (query.minExperience || query.maxExperience) {
    where.doctorProfile = {
      ...where.doctorProfile,
      ...(query.minExperience && { yearsOfExperience: { gte: Number(query.minExperience) } }),
      ...(query.maxExperience && { yearsOfExperience: { ...where.doctorProfile?.yearsOfExperience, lte: Number(query.maxExperience) } }),
    };
  }

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
      isApproved: query.isApproved || null,
      specialization: query.specialization || null,
      hospital: query.hospital || null,
      minExperience: query.minExperience || null,
      maxExperience: query.maxExperience || null,
    },
  };
};

const getDoctorById = async (doctorId) => {
  const doctor = await prisma.user.findFirst({
    where: {
      id: doctorId,
      role: "DOCTOR",
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      accountStatus: true,
      createdAt: true,
      updatedAt: true,
      profilePhotoUrl: true,
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
  });

  if (!doctor) {
    throw new Error("Doctor not found");
  }

  return doctor;
};

const updateDoctor = async (doctorId, updateData) => {
  const doctor = await prisma.user.findFirst({
    where: {
      id: doctorId,
      role: "DOCTOR",
    },
  });

  if (!doctor) {
    throw new Error("Doctor not found");
  }

  const { fullName, email, accountStatus, profilePhotoUrl, doctorProfile } = updateData;

  const userUpdateData = {};
  if (fullName !== undefined) userUpdateData.fullName = fullName;
  if (email !== undefined) userUpdateData.email = email;
  if (accountStatus !== undefined) userUpdateData.accountStatus = accountStatus;
  if (profilePhotoUrl !== undefined) userUpdateData.profilePhotoUrl = profilePhotoUrl;

  const profileUpdateData = {};
  if (doctorProfile) {
    if (doctorProfile.phoneNumber !== undefined) profileUpdateData.phoneNumber = doctorProfile.phoneNumber;
    if (doctorProfile.specialization !== undefined) profileUpdateData.specialization = doctorProfile.specialization;
    if (doctorProfile.qualification !== undefined) profileUpdateData.qualification = doctorProfile.qualification;
    if (doctorProfile.licenseNumber !== undefined) profileUpdateData.licenseNumber = doctorProfile.licenseNumber;
    if (doctorProfile.yearsOfExperience !== undefined) profileUpdateData.yearsOfExperience = Number(doctorProfile.yearsOfExperience);
    if (doctorProfile.hospitalName !== undefined) profileUpdateData.hospitalName = doctorProfile.hospitalName;
    if (doctorProfile.clinicAddress !== undefined) profileUpdateData.clinicAddress = doctorProfile.clinicAddress;
    if (doctorProfile.isApproved !== undefined) profileUpdateData.isApproved = doctorProfile.isApproved;
  }

  const updatedDoctor = await prisma.user.update({
    where: {
      id: doctorId,
    },
    data: {
      ...userUpdateData,
      ...(Object.keys(profileUpdateData).length > 0 && {
        doctorProfile: {
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
  });

  return updatedDoctor;
};

const updateDoctorStatus = async (doctorId, accountStatus) => {
  const doctor = await prisma.user.findFirst({
    where: {
      id: doctorId,
      role: "DOCTOR",
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
      accountStatus: accountStatus.toUpperCase(),
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      accountStatus: true,
      doctorProfile: {
        select: {
          phoneNumber: true,
          specialization: true,
          qualification: true,
          isApproved: true,
        },
      },
    },
  });

  return updatedDoctor;
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

const deleteDoctor = async (doctorId) => {
  const doctor = await prisma.user.findFirst({
    where: {
      id: doctorId,
      role: "DOCTOR",
    },
  });

  if (!doctor) {
    throw new Error("Doctor not found");
  }

  await prisma.user.delete({
    where: {
      id: doctorId,
    },
  });

  return { message: "Doctor deleted successfully" };
};

module.exports = {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  updateDoctorStatus,
  approveDoctor,
  deleteDoctor,
};
