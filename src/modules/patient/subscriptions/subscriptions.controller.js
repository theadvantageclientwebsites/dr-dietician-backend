const patientSubscriptionsService = require("./subscriptions.service");

const getMySubscriptions = async (req, res, next) => {
  try {
    const patientId = req.user.userId || req.user.id;
    const data = await patientSubscriptionsService.getMySubscriptions(patientId, req.query);
    res.status(200).json({
      success: true,
      message: "Subscriptions fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getActiveSubscription = async (req, res, next) => {
  try {
    const patientId = req.user.userId || req.user.id;
    const data = await patientSubscriptionsService.getActiveSubscription(patientId);
    res.status(200).json({
      success: true,
      message: data ? "Active package fetched successfully" : "No active package",
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMySubscriptions,
  getActiveSubscription,
};
