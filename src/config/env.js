require("dotenv").config();

module.exports = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5000,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || "supersecretkey",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  razorpayKeyId: process.env.RAZORPAY_KEY_ID,
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET,
};