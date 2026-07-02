const prisma = require("../../../lib/prisma");
const { hashPassword } = require("../../../utils/hash");
const crypto = require("crypto");

const generateRandomPassword = () => {
  return crypto.randomBytes(8).toString("hex"); // Generates 16-character password
};

const createPatient = async (patientData) => {
  const {
    fullName,
    email,
    gender,
    location,
    phoneNumber,
    whatsappNumber,
    age,
    heightCm,
    weightKg,
    bloodGroup,
    socialHandle,
    isDefencePersonnel,
  } = patientData;

  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  // Generate random password
  const plainPassword = generateRandomPassword();
  const passwordHash = await hashPassword(plainPassword);

  // Create user with patient profile
  const newPatient = await prisma.user.create({
    data: {
      fullName,
      email,
      passwordHash,
      role: "PATIENT",
      accountStatus: "ACTIVE",
      registrationStatus: "COMPLETED",
      patientProfile: {
        create: {
          gender: gender || null,
          location: location || null,
          phoneNumber: phoneNumber || null,
          whatsappNumber: whatsappNumber || null,
          age: age ? Number(age) : null,
          heightCm: heightCm ? Number(heightCm) : null,
          weightKg: weightKg ? Number(weightKg) : null,
          bloodGroup: bloodGroup || null,
          socialHandle: socialHandle || null,
          isDefencePersonnel: isDefencePersonnel !== undefined ? Boolean(isDefencePersonnel) : false,
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

  // Return the patient data with the generated password
  return {
    ...newPatient,
    generatedPassword: plainPassword, // Return plain password to share with patient
  };
};

const getPatients = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  // Build where clause with filters
  const where = {
    role: "PATIENT",
  };

  // Search filter - searches in fullName, email, and phone number
  if (query.search) {
    where.OR = [
      {
        fullName: {
          contains: query.search,
          mode: "insensitive", // Case-insensitive search
        },
      },
      {
        email: {
          contains: query.search,
          mode: "insensitive",
        },
      },
      {
        patientProfile: {
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

  // Blood Group filter
  if (query.bloodGroup) {
    where.patientProfile = {
      ...where.patientProfile,
      bloodGroup: query.bloodGroup.toUpperCase(),
    };
  }

  // Gender filter
  if (query.gender) {
    where.patientProfile = {
      ...where.patientProfile,
      gender: query.gender.toUpperCase(),
    };
  }

  // Location filter
  if (query.location) {
    where.patientProfile = {
      ...where.patientProfile,
      location: {
        contains: query.location,
        mode: "insensitive",
      },
    };
  }

  // Defence Personnel filter
  if (query.isDefencePersonnel !== undefined) {
    where.patientProfile = {
      ...where.patientProfile,
      isDefencePersonnel: query.isDefencePersonnel === "true",
    };
  }

  // Age range filter
  if (query.minAge || query.maxAge) {
    where.patientProfile = {
      ...where.patientProfile,
      ...(query.minAge && { age: { gte: Number(query.minAge) } }),
      ...(query.maxAge && { age: { ...where.patientProfile?.age, lte: Number(query.maxAge) } }),
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
    filters: {
      search: query.search || null,
      status: query.status || null,
      bloodGroup: query.bloodGroup || null,
      gender: query.gender || null,
      location: query.location || null,
      isDefencePersonnel: query.isDefencePersonnel || null,
      minAge: query.minAge || null,
      maxAge: query.maxAge || null,
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
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
};
