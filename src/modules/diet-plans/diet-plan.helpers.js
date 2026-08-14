const PLAN_DUE_HOURS = 24;

const DURATION_DAYS = {
  SEVEN_DAYS: 7,
  TEN_DAYS: 10,
  FIFTEEN_DAYS: 15,
};

const VALID_DURATIONS = Object.keys(DURATION_DAYS);

const getDueAt = (assignedAt) => {
  if (!assignedAt) return null;
  return new Date(new Date(assignedAt).getTime() + PLAN_DUE_HOURS * 60 * 60 * 1000);
};

const isPlanSubmitted = (plan) =>
  !!plan && ["PENDING_APPROVAL", "APPROVED"].includes(plan.status);

const withDueInfo = (assignedAt, plan) => {
  const dueAt = getDueAt(assignedAt);
  const submitted = isPlanSubmitted(plan);
  const now = new Date();
  const isOverdue = !!dueAt && !submitted && now > dueAt;

  return {
    dueAt,
    isOverdue,
    hoursRemaining: dueAt && !submitted
      ? Math.max(0, Math.ceil((dueAt - now) / (1000 * 60 * 60)))
      : null,
  };
};

const dietPlanSelect = {
  id: true,
  duration: true,
  calorieTarget: true,
  foodsToEat: true,
  foodsToAvoid: true,
  breakfast: true,
  lunch: true,
  dinner: true,
  snacks: true,
  notes: true,
  status: true,
  submittedAt: true,
  approvedAt: true,
  rejectedAt: true,
  rejectionReason: true,
  createdAt: true,
  updatedAt: true,
  patientId: true,
  doctorId: true,
  subscriptionId: true,
  patient: {
    select: {
      id: true,
      fullName: true,
      email: true,
      profilePhotoUrl: true,
    },
  },
  doctor: {
    select: {
      id: true,
      fullName: true,
      profilePhotoUrl: true,
      doctorProfile: {
        select: { specialization: true, hospitalName: true },
      },
    },
  },
  subscription: {
    select: {
      id: true,
      status: true,
      assignedAt: true,
      endsAt: true,
      package: { select: { id: true, name: true, category: true } },
    },
  },
};

const withMeta = (plan) => {
  if (!plan) return null;
  const due = withDueInfo(plan.subscription?.assignedAt, plan);
  return {
    ...plan,
    durationDays: DURATION_DAYS[plan.duration] || null,
    ...due,
  };
};

module.exports = {
  PLAN_DUE_HOURS,
  DURATION_DAYS,
  VALID_DURATIONS,
  getDueAt,
  isPlanSubmitted,
  withDueInfo,
  dietPlanSelect,
  withMeta,
};
