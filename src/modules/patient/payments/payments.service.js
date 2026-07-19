const crypto = require("crypto");
const prisma = require("../../../lib/prisma");
const razorpay = require("../../../lib/razorpay");
const { razorpayKeyId, razorpayKeySecret } = require("../../../config/env");

// Duration label to months mapping
const DURATION_LABEL = {
  ONE_MONTH: "1 Month",
  THREE_MONTHS: "3 Months",
  SIX_MONTHS: "6 Months",
};

// Get price based on package duration
const getPackagePrice = (pkg, duration) => {
  switch (duration) {
    case "ONE_MONTH": return pkg.price1Month;
    case "THREE_MONTHS": return pkg.price3Months;
    case "SIX_MONTHS": return pkg.price6Months;
    default: throw new Error("Invalid duration. Use ONE_MONTH, THREE_MONTHS or SIX_MONTHS");
  }
};

// ─── Create Razorpay Order ────────────────────────────────────────────────────

const createOrder = async (patientId, data) => {
  const { itemType, itemId, duration } = data;

  if (!itemType || !itemId) {
    throw new Error("itemType and itemId are required");
  }

  let amount = 0;
  let itemName = "";

  if (itemType === "PACKAGE") {
    if (!duration) throw new Error("duration is required for package purchase (ONE_MONTH, THREE_MONTHS, SIX_MONTHS)");

    const pkg = await prisma.package.findFirst({
      where: { id: itemId, isActive: true },
    });

    if (!pkg) throw new Error("Package not found or inactive");

    amount = getPackagePrice(pkg, duration);
    itemName = `${pkg.name} - ${DURATION_LABEL[duration]}`;

  } else if (itemType === "DIGITAL_PRODUCT") {
    const product = await prisma.digitalProduct.findFirst({
      where: { id: itemId, status: "PUBLISHED" },
    });

    if (!product) throw new Error("Digital product not found");
    if (product.isFree) throw new Error("This product is free, no payment required");

    amount = product.price;
    itemName = product.title;

  } else {
    throw new Error("Invalid itemType. Use PACKAGE or DIGITAL_PRODUCT");
  }

  // Create Razorpay order (amount in paise — multiply by 100)
  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(amount * 100), // paise
    currency: "INR",
    receipt: `order_${patientId}_${Date.now()}`,
    notes: {
      patientId,
      itemType,
      itemId,
      itemName,
    },
  });

  // Save pending order to DB
  const order = await prisma.order.create({
    data: {
      patientId,
      itemType,
      itemId,
      itemName,
      amount,
      currency: "INR",
      duration: duration || null,
      status: "PENDING",
      razorpayOrderId: razorpayOrder.id,
    },
  });

  return {
    orderId: razorpayOrder.id,       // Send to frontend for Razorpay popup
    amount: razorpayOrder.amount,    // in paise
    currency: razorpayOrder.currency,
    keyId: razorpayKeyId,  // Frontend needs this to open popup
    itemName,
    dbOrderId: order.id,
  };
};

// ─── Verify Payment ───────────────────────────────────────────────────────────

const verifyPayment = async (patientId, data) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = data;

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    throw new Error("razorpayOrderId, razorpayPaymentId and razorpaySignature are required");
  }

  // Find the pending order
  const order = await prisma.order.findFirst({
    where: {
      razorpayOrderId,
      patientId,
      status: "PENDING",
    },
  });

  if (!order) throw new Error("Order not found or already processed");

  // Verify signature — HMAC SHA256
  const expectedSignature = crypto
    .createHmac("sha256", razorpayKeySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  if (expectedSignature !== razorpaySignature) {
    // Mark order as failed
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "FAILED" },
    });
    throw new Error("Payment verification failed. Invalid signature.");
  }

  // Mark order as PAID
  const updatedOrder = await prisma.order.update({
    where: { id: order.id },
    data: {
      status: "PAID",
      razorpayPaymentId,
      razorpaySignature,
      paidAt: new Date(),
    },
  });

  // If digital product — increment totalSales
  if (order.itemType === "DIGITAL_PRODUCT") {
    await prisma.digitalProduct.update({
      where: { id: order.itemId },
      data: { totalSales: { increment: 1 } },
    });
  }

  return {
    success: true,
    orderId: updatedOrder.id,
    itemType: updatedOrder.itemType,
    itemName: updatedOrder.itemName,
    amount: updatedOrder.amount,
    paidAt: updatedOrder.paidAt,
    message: "Payment successful! You now have access to your purchase.",
  };
};

// ─── My Orders ────────────────────────────────────────────────────────────────

const getMyOrders = async (patientId, query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where = { patientId };

  if (query.status) where.status = query.status.toUpperCase();
  if (query.itemType) where.itemType = query.itemType.toUpperCase();

  const totalItems = await prisma.order.count({ where });

  const items = await prisma.order.findMany({
    where,
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      itemType: true,
      itemId: true,
      itemName: true,
      amount: true,
      currency: true,
      duration: true,
      status: true,
      razorpayOrderId: true,
      razorpayPaymentId: true,
      paidAt: true,
      createdAt: true,
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

// ─── Check if patient has purchased an item ───────────────────────────────────

const hasPurchased = async (patientId, itemType, itemId) => {
  const order = await prisma.order.findFirst({
    where: {
      patientId,
      itemType,
      itemId,
      status: "PAID",
    },
  });
  return !!order;
};

module.exports = {
  createOrder,
  verifyPayment,
  getMyOrders,
  hasPurchased,
};
