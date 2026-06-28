const express = require("express");
const authController = require("./auth.controller");

const router = express.Router();

router.post("/register/patient", authController.registerPatient);
router.post("/register/doctor", authController.registerDoctor);
router.post("/register/intern", authController.registerIntern);
router.post("/login", authController.login);

module.exports = router;