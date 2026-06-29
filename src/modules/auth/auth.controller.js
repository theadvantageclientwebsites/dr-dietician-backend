const authService = require("./auth.service");

const registerPatient = async (req, res, next) => {
  try {
    const user = await authService.registerPatient(req.body);

    res.status(201).json({
      success: true,
      message: "Patient registered successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const registerDoctor = async (req, res, next) => {
  try {
    const user = await authService.registerDoctor(req.body);

    res.status(201).json({
      success: true,
      message: "Doctor registered successfully. Awaiting approval.",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const registerIntern = async (req, res, next) => {
  try {
    const user = await authService.registerIntern(req.body);

    res.status(201).json({
      success: true,
      message: "Intern registered successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.loginUser(req.body);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const result = await authService.logoutUser();

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerPatient,
  registerDoctor,
  registerIntern,
  login,
  logout,
};