const subscriptionsService = require("./subscriptions.service");

const getSubscriptions = async (req, res, next) => {
  try {
    const data = await subscriptionsService.getSubscriptions(req.query);
    res.status(200).json({
      success: true,
      message: "Subscriptions fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getSubscriptionById = async (req, res, next) => {
  try {
    const data = await subscriptionsService.getSubscriptionById(req.params.id);
    res.status(200).json({
      success: true,
      message: "Subscription fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const assignDoctor = async (req, res, next) => {
  try {
    const data = await subscriptionsService.assignDoctor(req.params.id, req.body.doctorId);
    res.status(200).json({
      success: true,
      message: "Doctor assigned to package successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSubscriptions,
  getSubscriptionById,
  assignDoctor,
};
