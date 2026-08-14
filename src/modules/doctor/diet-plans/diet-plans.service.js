const prisma = require("../../../lib/prisma");
const {
  VALID_DURATIONS,
  dietPlanSelect,
  withMeta,
  withDueInfo,
} = require("../../diet-plans/diet-plan.helpers");

const getAssignedSubscription = async (doctorId, patientId) => {
  return prisma.subscription.findFirst({
    where: {
      doctorId,
      patientId,
      status: "ACTIVE",
    },
    orderBy: { assignedAt: "desc" },
  });
};

const upsertPlan = async (doctorId, data) => {
  const {
    patientId,
    duration,
    calorieTarget,
    foodsToEat,
    foodsToAvoid,
    breakfast,
    lunch,
    dinner,
    snacks,
    notes,
  } = data;

  if (!patientId) throw new Error("patientId is required");
  if (!duration || !VALID_DURATIONS.includes(duration)) {
    throw new Error("duration is required. Use SEVEN_DAYS, TEN_DAYS or FIFTEEN_DAYS");
  }

  const subscription = await getAssignedSubscription(doctorId, patientId);
  if (!subscription) {
    throw new Error("Patient is not assigned to you on an active package");
  }

  const existing = await prisma.dietPlan.findUnique({
    where: { subscriptionId: subscription.id },
  });

  if (existing?.status === "PENDING_APPROVAL") {
    throw new Error("Plan is waiting for admin approval and cannot be edited");
  }
  if (existing?.status === "APPROVED") {
    throw new Error("Approved plan cannot be edited. Ask admin to reject it first if a change is needed.");
  }

  const payload = {
    patientId,
    doctorId,
    subscriptionId: subscription.id,
    duration,
    calorieTarget: calorieTarget !== undefined && calorieTarget !== null ? Number(calorieTarget) : null,
    foodsToEat: Array.isArray(foodsToEat) ? foodsToEat : [],
    foodsToAvoid: Array.isArray(foodsToAvoid) ? foodsToAvoid : [],
    breakfast: breakfast || null,
    lunch: lunch || null,
    dinner: dinner || null,
    snacks: snacks || null,
    notes: notes || null,
    status: "DRAFT",
    submittedAt: null,
    approvedAt: null,
    rejectedAt: null,
    rejectionReason: null,
  };

  const plan = existing
    ? await prisma.dietPlan.update({
        where: { id: existing.id },
        data: payload,
        select: dietPlanSelect,
      })
    : await prisma.dietPlan.create({
        data: payload,
        select: dietPlanSelect,
      });

  return withMeta(plan);
};

const submitPlan = async (doctorId, planId) => {
  const plan = await prisma.dietPlan.findFirst({
    where: { id: planId, doctorId },
    include: { subscription: { select: { assignedAt: true } } },
  });

  if (!plan) throw new Error("Diet plan not found");
  if (!["DRAFT", "REJECTED"].includes(plan.status)) {
    throw new Error("Only draft or rejected plans can be submitted");
  }
  if (!plan.breakfast && !plan.lunch && !plan.dinner) {
    throw new Error("Add at least breakfast, lunch or dinner before submitting");
  }

  const updated = await prisma.dietPlan.update({
    where: { id: planId },
    data: {
      status: "PENDING_APPROVAL",
      submittedAt: new Date(),
      rejectedAt: null,
      rejectionReason: null,
    },
    select: dietPlanSelect,
  });

  return withMeta(updated);
};

const getMyPlans = async (doctorId, query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;
  const where = { doctorId };
  if (query.status) where.status = query.status.toUpperCase();
  if (query.patientId) where.patientId = query.patientId;

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

const getPlanById = async (doctorId, planId) => {
  const plan = await prisma.dietPlan.findFirst({
    where: { id: planId, doctorId },
    select: dietPlanSelect,
  });
  if (!plan) throw new Error("Diet plan not found");
  return withMeta(plan);
};

const getPlanForPatient = async (doctorId, patientId) => {
  const subscription = await getAssignedSubscription(doctorId, patientId);
  if (!subscription) throw new Error("Patient is not assigned to you on an active package");

  const plan = await prisma.dietPlan.findUnique({
    where: { subscriptionId: subscription.id },
    select: dietPlanSelect,
  });

  return {
    subscriptionId: subscription.id,
    assignedAt: subscription.assignedAt,
    plan: plan ? withMeta(plan) : null,
    ...withDueInfo(subscription.assignedAt, plan),
  };
};

module.exports = {
  upsertPlan,
  submitPlan,
  getMyPlans,
  getPlanById,
  getPlanForPatient,
  getAssignedSubscription,
};
