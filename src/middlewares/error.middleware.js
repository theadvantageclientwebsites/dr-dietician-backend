module.exports = (err, req, res, next) => {
  console.error("Error:", err.message);
  console.error("Stack:", err.stack);

  let statusCode = 500;
  let message = err.message || "Internal Server Error";

  // 400 — Business logic errors
  const badRequestMessages = [
    "Invalid credentials",
    "Your account is pending approval",
    "Your account is not active",
    "Email already exists",
    "License number already exists",
    "Already enrolled in this course",
    "Appointment is already cancelled",
    "Cannot cancel a completed appointment",
    "This product is free, no payment required",
    "Payment verification failed. Invalid signature.",
    "passed field is required (true/false)",
    "Status is required",
    "isActive field is required",
  ];

  if (badRequestMessages.some((msg) => message.includes(msg))) {
    statusCode = 400;
  }

  // 404 — Not found errors
  const notFoundMessages = [
    "not found",
    "Not found",
  ];

  if (notFoundMessages.some((msg) => message.includes(msg))) {
    statusCode = 404;
  }

  // Handle Prisma errors
  if (err.code === "P2002") {
    statusCode = 400;
    message = `Duplicate value: ${err.meta?.target?.join(", ")} already exists`;
  }

  if (err.code === "P2025") {
    statusCode = 404;
    message = "Record not found";
  }

  if (err.code === "P2003") {
    statusCode = 400;
    message = "Related record not found or cannot be deleted due to existing references";
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};