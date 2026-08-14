const prisma = require("../../../lib/prisma");
const {
  subscriptionSelect,
  withMeetingUsage,
} = require("../../patient/subscriptions/subscriptions.service");

const getSubscriptions = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where = {};
  if (query.status) where.status = query.status.toUpperCase();
  if (query.packageId) where.packageId = query.packageId;
  if (query.doctorId) where.doctorId = query.doctorId;

  if (query.search) {
    where.OR = [
      { patient: { fullName: { contains: query.search, mode: "insensitive" } } },
      { patient: { email: { contains: query.search, mode: "insensitive" } } },
      { package: { name: { contains: query.search, mode: "insensitive" } } },
    ];
  }

  const totalItems = await prisma.subscription.count({ where });

  const items = await prisma.subscription.findMany({
    where,
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
    select: {
      ...subscriptionSelect,
      patientId: true,
      patient: {
        select: {
          id: true,
          fullName: true,
          email: true,
          profilePhotoUrl: true,
          patientProfile: {
            select: {
              phoneNumber: true,
              age: true,
              gender: true,
            },
          },
        },
      },
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
  };
};

const getSubscriptionById = async (subscriptionId) => {
  const subscription = await prisma.subscription.findUnique({
    where: { id: subscriptionId },
    select: {
      ...subscriptionSelect,
      patientId: true,
      patient: {
        select: {
          id: true,
          fullName: true,
          email: true,
          profilePhotoUrl: true,
          patientProfile: {
            select: {
              phoneNumber: true,
              whatsappNumber: true,
              age: true,
              gender: true,
              location: true,
            },
          },
        },
      },
    },
  });

  if (!subscription) throw new Error("Subscription not found");
  return withMeetingUsage(subscription);
};

const assignDoctor = async (subscriptionId, doctorId) => {
  if (!doctorId) throw new Error("doctorId is required");

  const subscription = await prisma.subscription.findUnique({
    where: { id: subscriptionId },
  });
  if (!subscription) throw new Error("Subscription not found");
  if (subscription.status === "CANCELLED") throw new Error("Cannot assign a doctor to a cancelled package");
  if (subscription.status === "EXPIRED" || new Date(subscription.endsAt) <= new Date()) {
    throw new Error("Cannot assign a doctor to an expired package");
  }

  const doctor = await prisma.user.findFirst({
    where: {
      id: doctorId,
      role: "DOCTOR",
      accountStatus: "ACTIVE",
    },
    include: { doctorProfile: true },
  });

  if (!doctor) throw new Error("Doctor not found or not available");
  if (!doctor.doctorProfile?.isApproved) throw new Error("Doctor is not approved yet");

  const updated = await prisma.subscription.update({
    where: { id: subscriptionId },
    data: {
      doctorId,
      assignedAt: new Date(),
      status: "ACTIVE",
    },
    select: {
      ...subscriptionSelect,
      patientId: true,
      patient: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
    },
  });

  return withMeetingUsage(updated);
};

module.exports = {
  getSubscriptions,
  getSubscriptionById,
  assignDoctor,
};
