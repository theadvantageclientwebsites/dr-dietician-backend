const internsService = require("./interns.service");

const createIntern = async (req, res, next) => {
  try {
    const data = await internsService.createIntern(req.body);

    res.status(201).json({
      success: true,
      message: "Intern created successfully. Please share the credentials with the intern.",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getInternsSummary = async (req, res, next) => {
  try {
    const data = await internsService.getInternsSummary();

    res.status(200).json({
      success: true,
      message: "Interns summary fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getInterns = async (req, res, next) => {
  try {
    const data = await internsService.getInterns(req.query);

    res.status(200).json({
      success: true,
      message: "Interns fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getInternById = async (req, res, next) => {
  try {
    const data = await internsService.getInternById(req.params.id);

    res.status(200).json({
      success: true,
      message: "Intern fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const updateIntern = async (req, res, next) => {
  try {
    const data = await internsService.updateIntern(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "Intern updated successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const deleteIntern = async (req, res, next) => {
  try {
    const data = await internsService.deleteIntern(req.params.id);

    res.status(200).json({
      success: true,
      message: "Intern deleted successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createIntern,
  getInternsSummary,
  getInterns,
  getInternById,
  updateIntern,
  deleteIntern,
};
