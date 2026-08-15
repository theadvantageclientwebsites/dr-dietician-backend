module.exports = (err, req, res, next) => {
  console.error("Error:", err.message);
  console.error("Stack:", err.stack);

  // Guard: if response already sent, do nothing
  if (res.headersSent) return;

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
    "At least one field is required: dateTime, type, or notes",
    "Cannot update a completed appointment",
    "Cannot update a cancelled appointment",
    "Invalid dateTime format. Use ISO 8601",
    "Appointment date must be in the future",
    "Doctor already has an appointment at this time. Please choose another slot.",
    "Invalid type. Use ONLINE or IN_PERSON",
    "An active package is required to book an appointment",
    "Your package is waiting for admin to assign a doctor",
    "You can only book appointments with your assigned package doctor",
    "Monthly appointment limit reached",
    "You already have an active package",
    "Invalid duration",
    "duration is required for package purchase",
    "doctorId is required",
    "Cannot assign a doctor to a cancelled package",
    "Cannot assign a doctor to an expired package",
    "name, category, price3Months, price6Months and price12Months are required",
    "patientId is required",
    "duration is required. Use SEVEN_DAYS, TEN_DAYS or FIFTEEN_DAYS",
    "Patient is not assigned to you on an active package",
    "Plan is waiting for admin approval and cannot be edited",
    "Approved plan cannot be edited",
    "Only draft or rejected plans can be submitted",
    "Add at least breakfast, lunch or dinner before submitting",
    "Only plans waiting for approval can be approved",
    "Only plans waiting for approval can be rejected",
    "You already have access to this product",
    "One or more freebie digital products were not found",
  ];

  if (badRequestMessages.some((msg) => message.includes(msg))) {
    statusCode = 400;
  }

  // 404 — Not found errors
  if (message.toLowerCase().includes("not found")) {
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
    message = "Cannot delete this record because it has related data. Please remove related records first.";
  }

  if (err.code === "P2014") {
    statusCode = 400;
    message = "This record is referenced by other records and cannot be deleted.";
  }

  try {
    res.status(statusCode).json({
      success: false,
      message,
    });
  } catch (jsonErr) {
    console.error("Failed to send error response:", jsonErr);
  }
};