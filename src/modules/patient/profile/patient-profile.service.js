const prisma = require("../../../lib/prisma");

const getProfile = async (patientId) => {
  const patient = await prisma.user.findUnique({
    where: { id: patientId },
    select: {
      id: true,
      fullName: true,
      email: true,
      profilePhotoUrl: true,
      isEmailVerified: true,
      lastLoginAt: true,
      createdAt: true,
      updatedAt: true,
      patientProfile: {
        select: {
          gender: true,
          location: true,
          phoneNumber: true,
          whatsappNumber: true,
          age: true,
          heightCm: true,
          weightKg: true,
          bloodGroup: true,
          socialHandle: true,
          isDefencePersonnel: true,
        },
      },
    },
  });

  if (!patient) throw new Error("Patient not found");

  // Calculate BMI
  let bmi = null;
  let bmiStatus = null;
  if (patient.patientProfile?.heightCm && patient.patientProfile?.weightKg) {
    const heightM = patient.patientProfile.heightCm / 100;
    bmi = parseFloat((patient.patientProfile.weightKg / (heightM * heightM)).toFixed(1));
    if (bmi < 18.5) bmiStatus = "Underweight";
    else if (bmi < 25) bmiStatus = "Normal";
    else if (bmi < 30) bmiStatus = "Overweight";
    else bmiStatus = "Obese";
  }

  return {
    ...patient,
    patientProfile: patient.patientProfile
      ? { ...patient.patientProfile, bmi, bmiStatus }
      : null,
  };
};

const updateProfile = async (patientId, updateData) => {
  const patient = await prisma.user.findUnique({
    where: { id: patientId },
  });

  if (!patient) throw new Error("Patient not found");

  const { fullName, profilePhotoUrl, patientProfile } = updateData;

  const userUpdateData = {};
  if (fullName !== undefined) userUpdateData.fullName = fullName;
  if (profilePhotoUrl !== undefined) userUpdateData.profilePhotoUrl = profilePhotoUrl;

  const profileUpdateData = {};
  if (patientProfile) {
    if (patientProfile.gender !== undefined) profileUpdateData.gender = patientProfile.gender;
    if (patientProfile.location !== undefined) profileUpdateData.location = patientProfile.location;
    if (patientProfile.phoneNumber !== undefined) profileUpdateData.phoneNumber = patientProfile.phoneNumber;
    if (patientProfile.whatsappNumber !== undefined) profileUpdateData.whatsappNumber = patientProfile.whatsappNumber;
    if (patientProfile.age !== undefined) profileUpdateData.age = Number(patientProfile.age);
    if (patientProfile.heightCm !== undefined) profileUpdateData.heightCm = Number(patientProfile.heightCm);
    if (patientProfile.weightKg !== undefined) profileUpdateData.weightKg = Number(patientProfile.weightKg);
    if (patientProfile.bloodGroup !== undefined) profileUpdateData.bloodGroup = patientProfile.bloodGroup;
    if (patientProfile.socialHandle !== undefined) profileUpdateData.socialHandle = patientProfile.socialHandle;
    if (patientProfile.isDefencePersonnel !== undefined) profileUpdateData.isDefencePersonnel = Boolean(patientProfile.isDefencePersonnel);
  }

  const updated = await prisma.user.update({
    where: { id: patientId },
    data: {
      ...userUpdateData,
      ...(Object.keys(profileUpdateData).length > 0 && {
        patientProfile: {
          update: profileUpdateData,
        },
      }),
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      profilePhotoUrl: true,
      isEmailVerified: true,
      updatedAt: true,
      patientProfile: {
        select: {
          gender: true,
          location: true,
          phoneNumber: true,
          whatsappNumber: true,
          age: true,
          heightCm: true,
          weightKg: true,
          bloodGroup: true,
          socialHandle: true,
          isDefencePersonnel: true,
        },
      },
    },
  });

  // Recalculate BMI after update
  let bmi = null;
  let bmiStatus = null;
  if (updated.patientProfile?.heightCm && updated.patientProfile?.weightKg) {
    const heightM = updated.patientProfile.heightCm / 100;
    bmi = parseFloat((updated.patientProfile.weightKg / (heightM * heightM)).toFixed(1));
    if (bmi < 18.5) bmiStatus = "Underweight";
    else if (bmi < 25) bmiStatus = "Normal";
    else if (bmi < 30) bmiStatus = "Overweight";
    else bmiStatus = "Obese";
  }

  return {
    ...updated,
    patientProfile: updated.patientProfile
      ? { ...updated.patientProfile, bmi, bmiStatus }
      : null,
  };
};

module.exports = {
  getProfile,
  updateProfile,
};
