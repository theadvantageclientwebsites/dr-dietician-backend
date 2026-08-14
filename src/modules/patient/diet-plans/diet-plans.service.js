const prisma = require("../../../lib/prisma");
const { dietPlanSelect, withMeta } = require("../../diet-plans/diet-plan.helpers");

const getMyDietPlan = async (patientId) => {
  const subscription = await prisma.subscription.findFirst({
    where: {
      patientId,
      status: { in: ["PENDING_ASSIGNMENT", "ACTIVE"] },
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      status: true,
      assignedAt: true,
      doctor: { select: { id: true, fullName: true, profilePhotoUrl: true } },
      package: { select: { id: true, name: true, category: true } },
    },
  });

  if (!subscription) {
    return {
      visible: false,
      patientStatus: "NO_PACKAGE",
      message: "Buy a package to get a personal diet plan",
      plan: null,
    };
  }

  if (subscription.status === "PENDING_ASSIGNMENT" || !subscription.assignedAt) {
    return {
      visible: false,
      patientStatus: "WAITING_FOR_DOCTOR_ASSIGNMENT",
      message: "Admin will assign a doctor, then your diet plan will be prepared",
      plan: null,
    };
  }

  const plan = await prisma.dietPlan.findUnique({
    where: { subscriptionId: subscription.id },
    select: dietPlanSelect,
  });

  if (plan?.status === "APPROVED") {
    return {
      visible: true,
      patientStatus: "APPROVED",
      message: "Your diet plan is ready",
      plan: withMeta(plan),
    };
  }

  return {
    visible: false,
    patientStatus,
    message,
    plan: null,
  };
};

module.exports = {
  getMyDietPlan,
};
