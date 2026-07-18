const patientPackagesService = require("./patient-packages.service");

const getPackages = async (req, res, next) => {
  try {
    const data = await patientPackagesService.getPackages(req.query);

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
    const data = await patientPackagesService.getPackageById(req.params.id);

    res.status(200).json({
      success: true,
      message: "Package fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPackages,
  getPackageById,
};
