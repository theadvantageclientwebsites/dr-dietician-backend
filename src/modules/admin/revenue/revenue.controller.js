const revenueService = require("./revenue.service");

const getRevenueSummary = async (req, res, next) => {
  try {
    const data = await revenueService.getRevenueSummary(req.query);

    res.status(200).json({
      success: true,
      message: "Revenue summary fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const data = await revenueService.getAllOrders(req.query);

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
  getRevenueSummary,
  getAllOrders,
};
