const prisma = require("../../../lib/prisma");
const { dietPlanSelect, withMeta } = require("../../diet-plans/diet-plan.helpers");

const getDietPlans = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;
  const where = {};
  if (query.status) where.status = query.status.toUpperCase();
  if (query.doctorId) where.doctorId = query.doctorId;
  if (query.patientId) where.patientId = query.patientId;

  if (query.search) {
    where.OR = [
      { patient: { fullName: { contains: query.search, mode: "insensitive" } } },
      { doctor: { fullName: { contains: query.search, mode: "insensitive" } } },
    ];
  }

  const totalItems = await prisma.dietPlan.count({ where });
  const items = await prisma.dietPlan.findMany({
    where,
    skip,
    take: limit,
    orderBy: { updatedAt: "desc" },
    select: dietPlanSelect,
  });

  return {
    items: items.map(withMeta),
    pagination: { page, limit, totalItems, totalPages: Math.ceil(totalItems / limit) },
  };
};

const getDietPlanById = async (planId) => {
  const plan = await prisma.dietPlan.findUnique({
    where: { id: planId },
    select: dietPlanSelect,
  });
  if (!plan) throw new Error("Diet plan not found");
  return withMeta(plan);
};

const approveDietPlan = async (planId) => {
  const plan = await prisma.dietPlan.findUnique({ where: { id: planId } });
  if (!plan) throw new Error("Diet plan not found");
  if (plan.status !== "PENDING_APPROVAL") {
    throw new Error("Only plans waiting for approval can be approved");
  }

  const updated = await prisma.dietPlan.update({
    where: { id: planId },
    data: {
      status: "APPROVED",
      approvedAt: new Date(),
      rejectedAt: null,
      rejectionReason: null,
    },
    select: dietPlanSelect,
  });

  return withMeta(updated);
};

const rejectDietPlan = async (planId, reason) => {
  const plan = await prisma.dietPlan.findUnique({ where: { id: planId } });
  if (!plan) throw new Error("Diet plan not found");
  if (plan.status !== "PENDING_APPROVAL") {
    throw new Error("Only plans waiting for approval can be rejected");
  }

  const updated = await prisma.dietPlan.update({
    where: { id: planId },
    data: {
      status: "REJECTED",
      rejectedAt: new Date(),
      rejectionReason: reason || "Please update the plan",
      approvedAt: null,
    },
    select: dietPlanSelect,
  });

  return withMeta(updated);
};

module.exports = {
  getDietPlans,
  getDietPlanById,
  approveDietPlan,
  rejectDietPlan,
};
