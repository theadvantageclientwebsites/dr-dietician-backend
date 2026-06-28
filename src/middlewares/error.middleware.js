module.exports = (err, req, res, next) => {
  console.error("Error:", err.message);

  let statusCode = 500;

  if (
    err.message === "Invalid credentials" ||
    err.message === "Your account is pending approval" ||
    err.message === "Your account is not active" ||
    err.message === "Email already exists"
  ) {
    statusCode = 400;
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};