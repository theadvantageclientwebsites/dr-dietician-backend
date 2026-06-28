const prisma = require("../../lib/prisma");
const { hashPassword, comparePassword } = require("../../utils/hash");
const { generateToken } = require("../../utils/token");

const registerPatient = async (payload) => {
  const {
    fullName,
    email,
    password,
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
  } = payload;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      passwordHash,
      role: "PATIENT",
      accountStatus: "ACTIVE",
      registrationStatus: "COMPLETED",
      patientProfile: {
        create: {
          gender,
          location,
          phoneNumber,
          whatsappNumber,
          age: age ? Number(age) : null,
          heightCm: heightCm ? Number(heightCm) : null,
          weightKg: weightKg ? Number(weightKg) : null,
          bloodGroup,
          socialHandle,
          isDefencePersonnel: Boolean(isDefencePersonnel),
        },
      },
    },
    include: {
      patientProfile: true,
    },
  });

  return user;
};

const registerDoctor = async (payload) => {
  const {
    fullName,
    email,
    password,
    phoneNumber,
    specialization,
    qualification,
    licenseNumber,
    yearsOfExperience,
    hospitalName,
    clinicAddress,
  } = payload;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      passwordHash,
      role: "DOCTOR",
      accountStatus: "PENDING_APPROVAL",
      registrationStatus: "COMPLETED",
      doctorProfile: {
        create: {
          phoneNumber,
          specialization,
          qualification,
          licenseNumber,
          yearsOfExperience: yearsOfExperience
            ? Number(yearsOfExperience)
            : null,
          hospitalName,
          clinicAddress,
          isApproved: false,
        },
      },
    },
    include: {
      doctorProfile: true,
    },
  });

  return user;
};

const registerIntern = async (payload) => {
  const {
    fullName,
    email,
    password,
    phoneNumber,
    universityName,
    specialization,
    semester,
    year,
  } = payload;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      passwordHash,
      role: "INTERN",
      accountStatus: "ACTIVE",
      registrationStatus: "COMPLETED",
      internProfile: {
        create: {
          phoneNumber,
          universityName,
          specialization,
          semester: semester ? Number(semester) : null,
          year: year ? Number(year) : null,
          isApproved: true,
        },
      },
    },
    include: {
      internProfile: true,
    },
  });

  return user;
};

const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  if (user.accountStatus === "PENDING_APPROVAL") {
    throw new Error("Your account is pending approval");
  }

  if (user.accountStatus !== "ACTIVE") {
    throw new Error("Your account is not active");
  }

  const isPasswordValid = await comparePassword(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      lastLoginAt: new Date(),
    },
  });

  return {
    token,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      accountStatus: user.accountStatus,
    },
  };
};

module.exports = {
  registerPatient,
  registerDoctor,
  registerIntern,
  loginUser,
};