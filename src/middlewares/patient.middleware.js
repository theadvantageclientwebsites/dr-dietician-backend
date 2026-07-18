const patientMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== "PATIENT") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Patient role required.",
    });
  }
  next();
};

module.exports = patientMiddleware;
