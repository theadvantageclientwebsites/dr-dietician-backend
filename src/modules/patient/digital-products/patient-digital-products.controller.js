const patientDigitalProductsService = require("./patient-digital-products.service");

const getDigitalProducts = async (req, res, next) => {
  try {
    const data = await patientDigitalProductsService.getDigitalProducts(req.query);

    res.status(200).json({
      success: true,
      message: "Digital products fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getDigitalProductById = async (req, res, next) => {
  try {
    const data = await patientDigitalProductsService.getDigitalProductById(req.params.id);

    res.status(200).json({
      success: true,
      message: "Digital product fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDigitalProducts,
  getDigitalProductById,
};
