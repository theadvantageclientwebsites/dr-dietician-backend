const express = require("express");
const authRoutes = require("../modules/auth/auth.routes");

const router = express.Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running fine",
  });
});

router.use("/auth", authRoutes);

module.exports = router;