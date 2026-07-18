const internMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== "INTERN") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Intern role required.",
    });
  }
  next();
};

module.exports = internMiddleware;
