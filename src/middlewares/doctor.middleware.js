const doctorMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== "DOCTOR") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Doctor role required.",
    });
  }
  next();
};

module.exports = doctorMiddleware;
