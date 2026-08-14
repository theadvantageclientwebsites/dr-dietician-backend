const dietPlansService = require("./diet-plans.service");

const upsertPlan = async (req, res, next) => {
  try {
    const doctorId = req.user.userId || req.user.id;
    const data = await dietPlansService.upsertPlan(doctorId, req.body);
    res.status(200).json({ success: true, message: "Diet plan saved as draft", data });
  } catch (error) { next(error); }
};

const submitPlan = async (req, res, next) => {
  try {
    const doctorId = req.user.userId || req.user.id;
    const data = await dietPlansService.submitPlan(doctorId, req.params.id);
    res.status(200).json({ success: true, message: "Diet plan submitted for admin approval", data });
  } catch (error) { next(error); }
};

const getMyPlans = async (req, res, next) => {
  try {
    const doctorId = req.user.userId || req.user.id;
    const data = await dietPlansService.getMyPlans(doctorId, req.query);
    res.status(200).json({ success: true, message: "Diet plans fetched successfully", data });
  } catch (error) { next(error); }
};

const getPlanById = async (req, res, next) => {
  try {
    const doctorId = req.user.userId || req.user.id;
    const data = await dietPlansService.getPlanById(doctorId, req.params.id);
    res.status(200).json({ success: true, message: "Diet plan fetched successfully", data });
  } catch (error) { next(error); }
};

const getPlanForPatient = async (req, res, next) => {
  try {
    const doctorId = req.user.userId || req.user.id;
    const data = await dietPlansService.getPlanForPatient(doctorId, req.params.patientId);
    res.status(200).json({ success: true, message: "Patient diet plan fetched successfully", data });
  } catch (error) { next(error); }
};

module.exports = {
  upsertPlan,
  submitPlan,
  getMyPlans,
  getPlanById,
  getPlanForPatient,
};
