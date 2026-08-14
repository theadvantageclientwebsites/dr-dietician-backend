const prisma = require("../../../lib/prisma");
const { addMonths, getDurationMonths, monthRange } = require("../../../utils/package-duration");

const subscriptionSelect = {
  id: true,
  duration: true,
  status: true,
  meetingsPerMonth: true,
  startsAt: true,
  endsAt: true,
  assignedAt: true,
  createdAt: true,
  updatedAt: true,
  package: {
    select: {
      id: true,
      name: true,
      category: true,
      description: true,
      features: true,
    },
  },
  doctor: {
    select: {
      id: true,
      fullName: true,
      profilePhotoUrl: true,
      doctorProfile: {
        select: {
          specialization: true,
          hospitalName: true,
          phoneNumber: true,
        },
      },
    },
  },
};

const getMeetingsUsedThisMonth = async (patientId) => {
  const { start, end } = monthRange();
  return prisma.appointment.count({
    where: {
      patientId,
      status: { in: ["PENDING", "CONFIRMED", "COMPLETED"] },
      dateTime: { gte: start, lt: end },
    },
  });
};

const withMeetingUsage = async (subscription) => {
  if (!subscription) return null;

  const used = await getMeetingsUsedThisMonth(subscription.patientId);
  const remaining = Math.max(0, subscription.meetingsPerMonth - used);

  return {
    ...subscription,
    meetingsUsedThisMonth: used,
    meetingsRemainingThisMonth: remaining,
  };
};

const createSubscriptionFromOrder = async (order) => {
  if (order.itemType !== "PACKAGE") return null;

  const existing = await prisma.subscription.findUnique({
    where: { orderId: order.id },
  });
  if (existing) return existing;

  const now = new Date();
  const months = getDurationMonths(order.duration);

  return prisma.subscription.create({
    data: {
      patientId: order.patientId,
      packageId: order.itemId,
      orderId: order.id,
      duration: order.duration,
      status: "PENDING_ASSIGNMENT",
      meetingsPerMonth: 4,
      startsAt: now,
      endsAt: addMonths(now, months),
    },
    select: subscriptionSelect,
  });
};

const expireIfNeeded = async (subscription) => {
  if (!subscription) return subscription;
  if (["EXPIRED", "CANCELLED"].includes(subscription.status)) return subscription;
  if (new Date(subscription.endsAt) > new Date()) return subscription;

  return prisma.subscription.update({
    where: { id: subscription.id },
    data: { status: "EXPIRED" },
    select: { ...subscriptionSelect, patientId: true },
  });
};

const getActiveSubscription = async (patientId) => {
  const subscription = await prisma.subscription.findFirst({
    where: {
      patientId,
      status: { in: ["PENDING_ASSIGNMENT", "ACTIVE"] },
    },
    orderBy: { createdAt: "desc" },
    select: { ...subscriptionSelect, patientId: true },
  });

  const current = await expireIfNeeded(subscription);
  if (!current || current.status === "EXPIRED") return null;
  return withMeetingUsage(current);
};

const getMySubscriptions = async (patientId, query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where = { patientId };
  if (query.status) where.status = query.status.toUpperCase();

  const totalItems = await prisma.subscription.count({ where });
  const items = await prisma.subscription.findMany({
    where,
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
    select: { ...subscriptionSelect, patientId: true },
  });

  const withUsage = await Promise.all(items.map((item) => withMeetingUsage(item)));

  return {
    items: withUsage,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    },
  };
};

module.exports = {
  subscriptionSelect,
  createSubscriptionFromOrder,
  getActiveSubscription,
  getMySubscriptions,
  getMeetingsUsedThisMonth,
  withMeetingUsage,
};
