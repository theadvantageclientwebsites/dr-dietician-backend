const prisma = require("../../../lib/prisma");
const { hashPassword } = require("../../../utils/hash");
const crypto = require("crypto");

const generateRandomPassword = () => {
  return crypto.randomBytes(8).toString("hex"); // Generates 16-character password
};

const createIntern = async (internData) => {
  const { fullName, email, phoneNumber, universityName, specialization, semester, year } = internData;

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

  // Create user with intern profile
  const newIntern = await prisma.user.create({
    data: {
      fullName,
      email,
      passwordHash,
      role: "INTERN",
      accountStatus: "ACTIVE",
      registrationStatus: "COMPLETED",
      internProfile: {
        create: {
          phoneNumber: phoneNumber || null,
          universityName: universityName || null,
          specialization: specialization || null,
          semester: semester || null,
          year: year || null,
          isApproved: true, // Auto-approve admin-created interns
        },
      },
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
  });

  // Return the intern data with the generated password
  return {
    ...newIntern,
    generatedPassword: plainPassword, // Return plain password to share with intern
  };
};

const getInternsSummary = async () => {
  const totalInterns = await prisma.user.count({
    where: {
      role: "INTERN",
    },
  });

  const approved = await prisma.internProfile.count({
    where: {
      isApproved: true,
    },
  });

  const pending = await prisma.user.count({
    where: {
      role: "INTERN",
      accountStatus: "PENDING_APPROVAL",
    },
  });

  const completedCourses = await prisma.internProfile.count({
    where: {
      isApproved: true,
      // You can add more criteria here for completed courses if needed
    },
  });

  return {
    totalInterns,
    approved,
    pending,
    completedCourses,
  };
};

const getInterns = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  // Build where clause with filters
  const where = {
    role: "INTERN",
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
        internProfile: {
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
    where.internProfile = {
      ...where.internProfile,
      isApproved: query.isApproved === "true",
    };
  }

  // University filter
  if (query.university) {
    where.internProfile = {
      ...where.internProfile,
      universityName: {
        contains: query.university,
        mode: "insensitive",
      },
    };
  }

  // Specialization filter
  if (query.specialization) {
    where.internProfile = {
      ...where.internProfile,
      specialization: {
        contains: query.specialization,
        mode: "insensitive",
      },
    };
  }

  // Semester filter
  if (query.semester) {
    where.internProfile = {
      ...where.internProfile,
      semester: Number(query.semester),
    };
  }

  // Year filter
  if (query.year) {
    where.internProfile = {
      ...where.internProfile,
      year: Number(query.year),
    };
  }

  // Semester range filter
  if (query.minSemester || query.maxSemester) {
    where.internProfile = {
      ...where.internProfile,
      ...(query.minSemester && { semester: { gte: Number(query.minSemester) } }),
      ...(query.maxSemester && { semester: { ...where.internProfile?.semester, lte: Number(query.maxSemester) } }),
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
      university: query.university || null,
      specialization: query.specialization || null,
      semester: query.semester || null,
      year: query.year || null,
      minSemester: query.minSemester || null,
      maxSemester: query.maxSemester || null,
    },
  };
};

const getInternById = async (internId) => {
  const intern = await prisma.user.findFirst({
    where: {
      id: internId,
      role: "INTERN",
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      accountStatus: true,
      createdAt: true,
      updatedAt: true,
      profilePhotoUrl: true,
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
  });

  if (!intern) {
    throw new Error("Intern not found");
  }

  return intern;
};

const updateIntern = async (internId, updateData) => {
  const intern = await prisma.user.findFirst({
    where: {
      id: internId,
      role: "INTERN",
    },
  });

  if (!intern) {
    throw new Error("Intern not found");
  }

  const { fullName, email, accountStatus, profilePhotoUrl, internProfile } = updateData;

  const userUpdateData = {};
  if (fullName !== undefined) userUpdateData.fullName = fullName;
  if (email !== undefined) userUpdateData.email = email;
  if (accountStatus !== undefined) userUpdateData.accountStatus = accountStatus;
  if (profilePhotoUrl !== undefined) userUpdateData.profilePhotoUrl = profilePhotoUrl;

  const profileUpdateData = {};
  if (internProfile) {
    if (internProfile.phoneNumber !== undefined) profileUpdateData.phoneNumber = internProfile.phoneNumber;
    if (internProfile.universityName !== undefined) profileUpdateData.universityName = internProfile.universityName;
    if (internProfile.specialization !== undefined) profileUpdateData.specialization = internProfile.specialization;
    if (internProfile.semester !== undefined) profileUpdateData.semester = internProfile.semester;
    if (internProfile.year !== undefined) profileUpdateData.year = internProfile.year;
    if (internProfile.isApproved !== undefined) profileUpdateData.isApproved = internProfile.isApproved;
  }

  const updatedIntern = await prisma.user.update({
    where: {
      id: internId,
    },
    data: {
      ...userUpdateData,
      ...(Object.keys(profileUpdateData).length > 0 && {
        internProfile: {
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
  });

  return updatedIntern;
};

const deleteIntern = async (internId) => {
  const intern = await prisma.user.findFirst({
    where: {
      id: internId,
      role: "INTERN",
    },
  });

  if (!intern) {
    throw new Error("Intern not found");
  }

  await prisma.user.delete({
    where: {
      id: internId,
    },
  });

  return { message: "Intern deleted successfully" };
};

module.exports = {
  createIntern,
  getInternsSummary,
  getInterns,
  getInternById,
  updateIntern,
  deleteIntern,
};
