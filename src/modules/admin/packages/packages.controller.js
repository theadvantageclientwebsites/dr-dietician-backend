const packagesService = require("./packages.service");

const createPackage = async (req, res, next) => {
  try {
    const data = await packagesService.createPackage(req.body);

    res.status(201).json({
      success: true,
      message: "Package created successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getPackages = async (req, res, next) => {
  try {
    const data = await packagesService.getPackages(req.query);

    res.status(200).json({
      success: true,
      message: "Packages fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getPackageById = async (req, res, next) => {
  try {
    const data = await packagesService.getPackageById(req.params.id);

    res.status(200).json({
      success: true,
      message: "Package fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const updatePackage = async (req, res, next) => {
  try {
    const data = await packagesService.updatePackage(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "Package updated successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const togglePackageStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;

    if (isActive === undefined) {
      return res.status(400).json({
        success: false,
        message: "isActive field is required",
      });
    }

    const data = await packagesService.togglePackageStatus(req.params.id, isActive);

    res.status(200).json({
      success: true,
      message: `Package ${data.isActive ? "activated" : "deactivated"} successfully`,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const deletePackage = async (req, res, next) => {
  try {
    const data = await packagesService.deletePackage(req.params.id);

    res.status(200).json({
      success: true,
      message: "Package deleted successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPackage,
  getPackages,
  getPackageById,
  updatePackage,
  togglePackageStatus,
  deletePackage,
};
