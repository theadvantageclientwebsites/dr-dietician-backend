const prisma = require("../../../lib/prisma");

const catalogSelect = {
  id: true,
  title: true,
  category: true,
  price: true,
  description: true,
  thumbnailUrl: true,
  previewUrl: true,
  author: true,
  pageCount: true,
  language: true,
  isFree: true,
  totalSales: true,
  createdAt: true,
};

const getProductAccess = async (patientId, product) => {
  if (!product) return { hasAccess: false, accessType: null };
  if (product.isFree) return { hasAccess: true, accessType: "FREE" };

  const purchased = await prisma.order.findFirst({
    where: {
      patientId,
      itemType: "DIGITAL_PRODUCT",
      itemId: product.id,
      status: "PAID",
    },
    select: { id: true },
  });
  if (purchased) return { hasAccess: true, accessType: "PURCHASED" };

  const twelveMonth = await prisma.subscription.findFirst({
    where: {
      patientId,
      duration: "TWELVE_MONTHS",
      status: { in: ["PENDING_ASSIGNMENT", "ACTIVE"] },
      endsAt: { gt: new Date() },
      package: {
        freebies: { some: { id: product.id } },
      },
    },
    select: { id: true },
  });
  if (twelveMonth) return { hasAccess: true, accessType: "PACKAGE_FREEBIE" };

  return { hasAccess: false, accessType: null };
};

const getTwelveMonthFreebieIds = async (patientId) => {
  const sub = await prisma.subscription.findFirst({
    where: {
      patientId,
      duration: "TWELVE_MONTHS",
      status: { in: ["PENDING_ASSIGNMENT", "ACTIVE"] },
      endsAt: { gt: new Date() },
    },
    select: {
      package: {
        select: { freebies: { select: { id: true } } },
      },
    },
  });

  return sub?.package?.freebies?.map((item) => item.id) || [];
};

module.exports = {
  catalogSelect,
  getProductAccess,
  getTwelveMonthFreebieIds,
};
