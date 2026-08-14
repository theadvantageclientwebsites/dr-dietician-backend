const patientDietPlansService = require("./diet-plans.service");

const getMyDietPlan = async (req, res, next) => {
  try {
    const patientId = req.user.userId || req.user.id;
    const data = await patientDietPlansService.getMyDietPlan(patientId);
    res.status(200).json({
      success: true,
      message: data.message,
      data,
    });
  } catch (error) { next(error); }
};

module.exports = { getMyDietPlan };
