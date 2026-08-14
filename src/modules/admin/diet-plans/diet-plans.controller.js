const dietPlansService = require("./diet-plans.service");

const getDietPlans = async (req, res, next) => {
  try {
    const data = await dietPlansService.getDietPlans(req.query);
    res.status(200).json({ success: true, message: "Diet plans fetched successfully", data });
  } catch (error) { next(error); }
};

const getDietPlanById = async (req, res, next) => {
  try {
    const data = await dietPlansService.getDietPlanById(req.params.id);
    res.status(200).json({ success: true, message: "Diet plan fetched successfully", data });
  } catch (error) { next(error); }
};

const approveDietPlan = async (req, res, next) => {
  try {
    const data = await dietPlansService.approveDietPlan(req.params.id);
    res.status(200).json({ success: true, message: "Diet plan approved. Patient can now view it.", data });
  } catch (error) { next(error); }
};

const rejectDietPlan = async (req, res, next) => {
  try {
    const data = await dietPlansService.rejectDietPlan(req.params.id, req.body.reason);
    res.status(200).json({ success: true, message: "Diet plan rejected. Doctor can update and resubmit.", data });
  } catch (error) { next(error); }
};

module.exports = {
  getDietPlans,
  getDietPlanById,
  approveDietPlan,
  rejectDietPlan,
};
