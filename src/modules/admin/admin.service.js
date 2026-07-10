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

module.exports = {
  getDashboardSummary,
};