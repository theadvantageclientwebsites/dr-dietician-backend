const prisma = require("../../../lib/prisma");

const getProfile = async (doctorId) => {
  const doctor = await prisma.user.findUnique({
    where: { id: doctorId },
    select: {
      id: true,
      fullName: true,
      email: true,
      profilePhotoUrl: true,
      isEmailVerified: true,
      lastLoginAt: true,
      createdAt: true,
      updatedAt: true,
      doctorProfile: {
        select: {
          phoneNumber: true,
          specialization: true,
          qualification: true,
          licenseNumber: true,
          yearsOfExperience: true,
          hospitalName: true,
          clinicAddress: true,
          isApproved: true,
        },
      },
    },
  });

  if (!doctor) throw new Error("Doctor not found");
  return doctor;
};

const updateProfile = async (doctorId, updateData) => {
  const doctor = await prisma.user.findUnique({ where: { id: doctorId } });
  if (!doctor) throw new Error("Doctor not found");

  const { fullName, profilePhotoUrl, doctorProfile } = updateData;

  const userUpdateData = {};
  if (fullName !== undefined) userUpdateData.fullName = fullName;
  if (profilePhotoUrl !== undefined) userUpdateData.profilePhotoUrl = profilePhotoUrl;

  const profileUpdateData = {};
  if (doctorProfile) {
    if (doctorProfile.phoneNumber !== undefined) profileUpdateData.phoneNumber = doctorProfile.phoneNumber;
    if (doctorProfile.specialization !== undefined) profileUpdateData.specialization = doctorProfile.specialization;
    if (doctorProfile.qualification !== undefined) profileUpdateData.qualification = doctorProfile.qualification;
    if (doctorProfile.yearsOfExperience !== undefined) profileUpdateData.yearsOfExperience = Number(doctorProfile.yearsOfExperience);
    if (doctorProfile.hospitalName !== undefined) profileUpdateData.hospitalName = doctorProfile.hospitalName;
    if (doctorProfile.clinicAddress !== undefined) profileUpdateData.clinicAddress = doctorProfile.clinicAddress;
  }

  return prisma.user.update({
    where: { id: doctorId },
    data: {
      ...userUpdateData,
      ...(Object.keys(profileUpdateData).length > 0 && {
        doctorProfile: { update: profileUpdateData },
      }),
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      profilePhotoUrl: true,
      updatedAt: true,
      doctorProfile: {
        select: {
          phoneNumber: true,
          specialization: true,
          qualification: true,
          licenseNumber: true,
          yearsOfExperience: true,
          hospitalName: true,
          clinicAddress: true,
          isApproved: true,
        },
      },
    },
  });
};

module.exports = { getProfile, updateProfile };
