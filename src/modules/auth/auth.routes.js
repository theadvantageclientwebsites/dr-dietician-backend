const express = require("express");
const authController = require("./auth.controller");
const authMiddleware = require("../../middlewares/auth.middleware");

const router = express.Router();

router.post("/register/patient", authController.registerPatient);
router.post("/register/doctor", authController.registerDoctor);
router.post("/register/intern", authController.registerIntern);
router.post("/login", authController.login);
router.post("/logout", authMiddleware, authController.logout);

module.exports = router;