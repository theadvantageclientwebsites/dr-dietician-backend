const paymentsService = require("./payments.service");

const createOrder = async (req, res, next) => {
  try {
    const patientId = req.user.userId || req.user.id;
    const data = await paymentsService.createOrder(patientId, req.body);

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const verifyPayment = async (req, res, next) => {
  try {
    const patientId = req.user.userId || req.user.id;
    const data = await paymentsService.verifyPayment(patientId, req.body);

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const patientId = req.user.userId || req.user.id;
    const data = await paymentsService.getMyOrders(patientId, req.query);

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getMyOrders,
};
