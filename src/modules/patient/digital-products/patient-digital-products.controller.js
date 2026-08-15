const patientDigitalProductsService = require("./patient-digital-products.service");

const getDigitalProducts = async (req, res, next) => {
  try {
    const patientId = req.user.userId || req.user.id;
    const data = await patientDigitalProductsService.getDigitalProducts(patientId, req.query);

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
    const patientId = req.user.userId || req.user.id;
    const data = await patientDigitalProductsService.getDigitalProductById(patientId, req.params.id);

    res.status(200).json({
      success: true,
      message: "Digital product fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getMyLibrary = async (req, res, next) => {
  try {
    const patientId = req.user.userId || req.user.id;
    const data = await patientDigitalProductsService.getMyLibrary(patientId, req.query);

    res.status(200).json({
      success: true,
      message: "Library fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDigitalProducts,
  getDigitalProductById,
  getMyLibrary,
};
