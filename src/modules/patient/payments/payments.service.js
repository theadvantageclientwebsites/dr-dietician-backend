const crypto = require("crypto");
const prisma = require("../../../lib/prisma");
const razorpay = require("../../../lib/razorpay");
const { razorpayKeyId, razorpayKeySecret } = require("../../../config/env");
const {
  DURATION_LABEL,
  PURCHASABLE_DURATIONS,
  getPackagePrice,
} = require("../../../utils/package-duration");
const { createSubscriptionFromOrder } = require("../subscriptions/subscriptions.service");
const { getProductAccess } = require("../digital-products/product-access");

const quotePurchase = async (patientId, data) => {
  const { itemType, itemId, duration } = data;

  if (!itemType || !itemId) {
    throw new Error("itemType and itemId are required");
  }

  if (itemType === "PACKAGE") {
    if (!duration) {
      throw new Error("duration is required for package purchase (THREE_MONTHS, SIX_MONTHS, TWELVE_MONTHS)");
    }
    if (!PURCHASABLE_DURATIONS.includes(duration)) {
      throw new Error("Invalid duration. Use THREE_MONTHS, SIX_MONTHS or TWELVE_MONTHS");
    }

    const pkg = await prisma.package.findFirst({
      where: { id: itemId, isActive: true },
    });
    if (!pkg) throw new Error("Package not found or inactive");

    const active = await prisma.subscription.findFirst({
      where: {
        patientId,
        status: { in: ["PENDING_ASSIGNMENT", "ACTIVE"] },
        endsAt: { gt: new Date() },
      },
    });
    if (active) {
      throw new Error("You already have an active package. Wait until it expires before buying another.");
    }

    return {
      amount: getPackagePrice(pkg, duration),
      itemName: `${pkg.name} - ${DURATION_LABEL[duration]}`,
      duration,
    };
  }

  if (itemType === "DIGITAL_PRODUCT") {
    const product = await prisma.digitalProduct.findFirst({
      where: { id: itemId, status: "PUBLISHED" },
    });
    if (!product) throw new Error("Digital product not found");
    if (product.isFree) throw new Error("This product is free, no payment required");

    const access = await getProductAccess(patientId, product);
    if (access.hasAccess) {
      throw new Error("You already have access to this product");
    }

    return {
      amount: product.price,
      itemName: product.title,
      duration: null,
    };
  }

  throw new Error("Invalid itemType. Use PACKAGE or DIGITAL_PRODUCT");
};

const fulfillPaidOrder = async (order) => {
  if (order.itemType === "DIGITAL_PRODUCT") {
    await prisma.digitalProduct.update({
      where: { id: order.itemId },
      data: { totalSales: { increment: 1 } },
    });
    return { subscription: null };
  }

  if (order.itemType === "PACKAGE") {
    const subscription = await createSubscriptionFromOrder(order);
    return { subscription };
  }

  return { subscription: null };
};

const createOrder = async (patientId, data) => {
  const quote = await quotePurchase(patientId, data);

  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(quote.amount * 100),
    currency: "INR",
    receipt: `order_${patientId}_${Date.now()}`,
    notes: {
      patientId,
      itemType: data.itemType,
      itemId: data.itemId,
      itemName: quote.itemName,
    },
  });

  const order = await prisma.order.create({
    data: {
      patientId,
      itemType: data.itemType,
      itemId: data.itemId,
      itemName: quote.itemName,
      amount: quote.amount,
      currency: "INR",
      duration: quote.duration,
      status: "PENDING",
      razorpayOrderId: razorpayOrder.id,
    },
  });

  return {
    dummy: false,
    orderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    keyId: razorpayKeyId,
    itemName: quote.itemName,
    dbOrderId: order.id,
  };
};

const verifyPayment = async (patientId, data) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = data;

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    throw new Error("razorpayOrderId, razorpayPaymentId and razorpaySignature are required");
  }

  const order = await prisma.order.findFirst({
    where: {
      razorpayOrderId,
      patientId,
      status: "PENDING",
    },
  });

  if (!order) throw new Error("Order not found or already processed");

  const expectedSignature = crypto
    .createHmac("sha256", razorpayKeySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  if (expectedSignature !== razorpaySignature) {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "FAILED" },
    });
    throw new Error("Payment verification failed. Invalid signature.");
  }

  const updatedOrder = await prisma.order.update({
    where: { id: order.id },
    data: {
      status: "PAID",
      razorpayPaymentId,
      razorpaySignature,
      paidAt: new Date(),
    },
  });

  const { subscription } = await fulfillPaidOrder(updatedOrder);

  return {
    success: true,
    dummy: false,
    orderId: updatedOrder.id,
    itemType: updatedOrder.itemType,
    itemName: updatedOrder.itemName,
    amount: updatedOrder.amount,
    paidAt: updatedOrder.paidAt,
    subscription: subscription || null,
    message: subscription
      ? "Payment successful. Admin will assign a doctor to your package."
      : "Payment successful! You now have access to your purchase.",
  };
};

const dummyCheckout = async (patientId, data) => {
  const quote = await quotePurchase(patientId, data);
  const stamp = Date.now();

  const order = await prisma.order.create({
    data: {
      patientId,
      itemType: data.itemType,
      itemId: data.itemId,
      itemName: quote.itemName,
      amount: quote.amount,
      currency: "INR",
      duration: quote.duration,
      status: "PAID",
      isDummy: true,
      razorpayOrderId: `dummy_order_${stamp}`,
      razorpayPaymentId: `dummy_pay_${stamp}`,
      paidAt: new Date(),
    },
  });

  const { subscription } = await fulfillPaidOrder(order);

  return {
    dummy: true,
    orderId: order.id,
    itemType: order.itemType,
    itemName: order.itemName,
    amount: order.amount,
    currency: order.currency,
    paidAt: order.paidAt,
    subscription: subscription || null,
    message: subscription
      ? "Dummy payment successful. Package is waiting for admin to assign a doctor."
      : "Dummy payment successful. Product unlocked.",
  };
};

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
      isDummy: true,
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
  dummyCheckout,
  getMyOrders,
  hasPurchased,
};
