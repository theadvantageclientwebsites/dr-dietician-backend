const prisma = require("../../../lib/prisma");

const getRevenueSummary = async (query) => {
  const today = new Date();

  // This month
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  // This week (Monday)
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay() + 1);
  weekStart.setHours(0, 0, 0, 0);

  const paidWhere = { status: "PAID" };

  const [
    totalRevenue,
    monthRevenue,
    weekRevenue,
    totalOrders,
    packageRevenue,
    digitalProductRevenue,
    recentOrders,
  ] = await Promise.all([
    // Total all-time revenue
    prisma.order.aggregate({
      where: paidWhere,
      _sum: { amount: true },
    }),

    // This month revenue
    prisma.order.aggregate({
      where: { ...paidWhere, paidAt: { gte: monthStart } },
      _sum: { amount: true },
    }),

    // This week revenue
    prisma.order.aggregate({
      where: { ...paidWhere, paidAt: { gte: weekStart } },
      _sum: { amount: true },
    }),

    // Total paid orders
    prisma.order.count({ where: paidWhere }),

    // Package revenue
    prisma.order.aggregate({
      where: { ...paidWhere, itemType: "PACKAGE" },
      _sum: { amount: true },
    }),

    // Digital product revenue
    prisma.order.aggregate({
      where: { ...paidWhere, itemType: "DIGITAL_PRODUCT" },
      _sum: { amount: true },
    }),

    // Recent 10 orders
    prisma.order.findMany({
      where: paidWhere,
      orderBy: { paidAt: "desc" },
      take: 10,
      select: {
        id: true,
        itemType: true,
        itemName: true,
        amount: true,
        duration: true,
        paidAt: true,
        patient: {
          select: {
            id: true,
            fullName: true,
            email: true,
            profilePhotoUrl: true,
          },
        },
      },
    }),
  ]);

  const total = totalRevenue._sum.amount || 0;
  const packageTotal = packageRevenue._sum.amount || 0;
  const digitalProductTotal = digitalProductRevenue._sum.amount || 0;

  return {
    summary: {
      totalRevenue: total,
      thisMonth: monthRevenue._sum.amount || 0,
      thisWeek: weekRevenue._sum.amount || 0,
      totalOrders,
    },
    breakdown: {
      packages: {
        revenue: packageTotal,
        percentage: total > 0 ? parseFloat(((packageTotal / total) * 100).toFixed(1)) : 0,
      },
      digitalProducts: {
        revenue: digitalProductTotal,
        percentage: total > 0 ? parseFloat(((digitalProductTotal / total) * 100).toFixed(1)) : 0,
      },
    },
    recentTransactions: recentOrders,
  };
};

const getAllOrders = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where = {};
  if (query.status) where.status = query.status.toUpperCase();
  if (query.itemType) where.itemType = query.itemType.toUpperCase();

  if (query.fromDate || query.toDate) {
    where.createdAt = {};
    if (query.fromDate) where.createdAt.gte = new Date(query.fromDate);
    if (query.toDate) {
      const toDate = new Date(query.toDate);
      toDate.setHours(23, 59, 59, 999);
      where.createdAt.lte = toDate;
    }
  }

  const totalItems = await prisma.order.count({ where });

  const items = await prisma.order.findMany({
    where,
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      itemType: true,
      itemName: true,
      amount: true,
      currency: true,
      duration: true,
      status: true,
      razorpayOrderId: true,
      razorpayPaymentId: true,
      paidAt: true,
      createdAt: true,
      patient: {
        select: {
          id: true,
          fullName: true,
          email: true,
          profilePhotoUrl: true,
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

module.exports = {
  getRevenueSummary,
  getAllOrders,
};
