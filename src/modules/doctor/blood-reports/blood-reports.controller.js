const bloodReportsService = require("./blood-reports.service");

const uploadBloodReport = async (req, res, next) => {
  try {
    const doctorId = req.user.userId || req.user.id;
    const data = await bloodReportsService.uploadBloodReport(doctorId, req.body);
    res.status(201).json({ success: true, message: "Blood report uploaded successfully", data });
  } catch (error) { next(error); }
};

const getBloodReports = async (req, res, next) => {
  try {
    const doctorId = req.user.userId || req.user.id;
    const data = await bloodReportsService.getBloodReports(doctorId, req.query);
    res.status(200).json({ success: true, message: "Blood reports fetched successfully", data });
  } catch (error) { next(error); }
};

const getBloodReportById = async (req, res, next) => {
  try {
    const doctorId = req.user.userId || req.user.id;
    const data = await bloodReportsService.getBloodReportById(doctorId, req.params.id);
    res.status(200).json({ success: true, message: "Blood report fetched successfully", data });
  } catch (error) { next(error); }
};

const updateBloodReport = async (req, res, next) => {
  try {
    const doctorId = req.user.userId || req.user.id;
    const data = await bloodReportsService.updateBloodReport(doctorId, req.params.id, req.body);
    res.status(200).json({ success: true, message: "Blood report updated successfully", data });
  } catch (error) { next(error); }
};

const deleteBloodReport = async (req, res, next) => {
  try {
    const doctorId = req.user.userId || req.user.id;
    const data = await bloodReportsService.deleteBloodReport(doctorId, req.params.id);
    res.status(200).json({ success: true, message: "Blood report deleted successfully", data });
  } catch (error) { next(error); }
};

module.exports = { uploadBloodReport, getBloodReports, getBloodReportById, updateBloodReport, deleteBloodReport };
