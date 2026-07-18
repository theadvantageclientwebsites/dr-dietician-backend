const digitalProductsService = require("./digital-products.service");

const createDigitalProduct = async (req, res, next) => {
  try {
    const data = await digitalProductsService.createDigitalProduct(req.body);

    res.status(201).json({
      success: true,
      message: "Digital product created successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getDigitalProducts = async (req, res, next) => {
  try {
    const data = await digitalProductsService.getDigitalProducts(req.query);

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
    const data = await digitalProductsService.getDigitalProductById(req.params.id);

    res.status(200).json({
      success: true,
      message: "Digital product fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const updateDigitalProduct = async (req, res, next) => {
  try {
    const data = await digitalProductsService.updateDigitalProduct(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "Digital product updated successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const updateProductStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const validStatuses = ["DRAFT", "PUBLISHED", "UNPUBLISHED"];
    if (!validStatuses.includes(status.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const data = await digitalProductsService.updateProductStatus(req.params.id, status);

    res.status(200).json({
      success: true,
      message: `Digital product status updated to ${data.status}`,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const deleteDigitalProduct = async (req, res, next) => {
  try {
    const data = await digitalProductsService.deleteDigitalProduct(req.params.id);

    res.status(200).json({
      success: true,
      message: "Digital product deleted successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDigitalProduct,
  getDigitalProducts,
  getDigitalProductById,
  updateDigitalProduct,
  updateProductStatus,
  deleteDigitalProduct,
};
