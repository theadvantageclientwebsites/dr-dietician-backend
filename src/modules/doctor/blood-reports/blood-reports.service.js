const prisma = require("../../../lib/prisma");

const assertDoctorCanAccessPatient = async (doctorId, patientId) => {
  const [hasAppointment, hasPackage] = await Promise.all([
    prisma.appointment.findFirst({
      where: { doctorId, patientId },
      select: { id: true },
    }),
    prisma.subscription.findFirst({
      where: {
        doctorId,
        patientId,
        status: "ACTIVE",
      },
      select: { id: true },
    }),
  ]);

  if (!hasAppointment && !hasPackage) {
    throw new Error("Patient not found or not associated with you");
  }
};

const uploadBloodReport = async (doctorId, data) => {
  const { patientId, title, fileUrl, notes } = data;

  if (!patientId || !title || !fileUrl) {
    throw new Error("patientId, title and fileUrl are required");
  }

  await assertDoctorCanAccessPatient(doctorId, patientId);

  return prisma.bloodReport.create({
    data: {
      patientId,
      doctorId,
      title,
      fileUrl,
      notes: notes || null,
    },
    include: {
      patient: {
        select: { id: true, fullName: true, email: true, profilePhotoUrl: true },
      },
    },
  });
};

const getBloodReports = async (doctorId, query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where = { doctorId };
  if (query.patientId) where.patientId = query.patientId;
  if (query.search) {
    where.title = { contains: query.search, mode: "insensitive" };
  }

  const totalItems = await prisma.bloodReport.count({ where });

  const items = await prisma.bloodReport.findMany({
    where,
    skip,
    take: limit,
    orderBy: { uploadedAt: "desc" },
    include: {
      patient: {
        select: { id: true, fullName: true, profilePhotoUrl: true },
      },
    },
  });

  return {
    items,
    pagination: { page, limit, totalItems, totalPages: Math.ceil(totalItems / limit) },
  };
};

const getBloodReportById = async (doctorId, reportId) => {
  const report = await prisma.bloodReport.findFirst({
    where: { id: reportId, doctorId },
    include: {
      patient: {
        select: {
          id: true,
          fullName: true,
          email: true,
          profilePhotoUrl: true,
          patientProfile: {
            select: { age: true, gender: true, bloodGroup: true, phoneNumber: true },
          },
        },
      },
    },
  });

  if (!report) throw new Error("Blood report not found");
  return report;
};

const updateBloodReport = async (doctorId, reportId, data) => {
  const report = await prisma.bloodReport.findFirst({
    where: { id: reportId, doctorId },
  });

  if (!report) throw new Error("Blood report not found");

  const updateData = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.notes !== undefined) updateData.notes = data.notes;
  if (data.fileUrl !== undefined) updateData.fileUrl = data.fileUrl;

  return prisma.bloodReport.update({
    where: { id: reportId },
    data: updateData,
    include: {
      patient: {
        select: { id: true, fullName: true, profilePhotoUrl: true },
      },
    },
  });
};

const deleteBloodReport = async (doctorId, reportId) => {
  const report = await prisma.bloodReport.findFirst({
    where: { id: reportId, doctorId },
  });

  if (!report) throw new Error("Blood report not found");

  await prisma.bloodReport.delete({ where: { id: reportId } });
  return { message: "Blood report deleted successfully" };
};

// For patient side — get their own blood reports
const getPatientBloodReports = async (patientId, query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const totalItems = await prisma.bloodReport.count({ where: { patientId } });

  const items = await prisma.bloodReport.findMany({
    where: { patientId },
    skip,
    take: limit,
    orderBy: { uploadedAt: "desc" },
    include: {
      doctor: {
        select: {
          id: true,
          fullName: true,
          profilePhotoUrl: true,
          doctorProfile: {
            select: { specialization: true, hospitalName: true },
          },
        },
      },
    },
  });

  return {
    items,
    pagination: { page, limit, totalItems, totalPages: Math.ceil(totalItems / limit) },
  };
};

module.exports = {
  uploadBloodReport,
  getBloodReports,
  getBloodReportById,
  updateBloodReport,
  deleteBloodReport,
  getPatientBloodReports,
};
