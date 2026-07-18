const prisma = require("../../../lib/prisma");

const getPatientDashboard = async (patientId) => {
  const today = new Date();

  // Run all queries in parallel for performance
  const [patient, upcomingAppointment, totalAppointments, activePackagesCount, digitalProductsCount] =
    await Promise.all([
      // 1. Patient profile + vitals
      prisma.user.findUnique({
        where: { id: patientId },
        select: {
          id: true,
          fullName: true,
          email: true,
          profilePhotoUrl: true,
          createdAt: true,
          patientProfile: {
            select: {
              gender: true,
              age: true,
              heightCm: true,
              weightKg: true,
              bloodGroup: true,
              location: true,
              phoneNumber: true,
              isDefencePersonnel: true,
            },
          },
        },
      }),

      // 2. Next upcoming appointment
      prisma.appointment.findFirst({
        where: {
          patientId,
          status: { in: ["CONFIRMED", "PENDING"] },
          dateTime: { gte: today },
        },
        orderBy: { dateTime: "asc" },
        select: {
          id: true,
          dateTime: true,
          type: true,
          status: true,
          notes: true,
          doctor: {
            select: {
              id: true,
              fullName: true,
              profilePhotoUrl: true,
              doctorProfile: {
                select: {
                  specialization: true,
                  hospitalName: true,
                  phoneNumber: true,
                },
              },
            },
          },
        },
      }),

      // 3. Total appointments count
      prisma.appointment.count({
        where: { patientId },
      }),

      // 4. Active packages count (for quick actions)
      prisma.package.count({
        where: { isActive: true },
      }),

      // 5. Published digital products count
      prisma.digitalProduct.count({
        where: { status: "PUBLISHED" },
      }),
    ]);

  if (!patient) {
    throw new Error("Patient not found");
  }

  // Calculate next checkup days
  let nextCheckupDays = null;
  let nextCheckupLabel = null;

  if (upcomingAppointment) {
    const diffMs = new Date(upcomingAppointment.dateTime) - today;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    nextCheckupDays = diffDays;

    if (diffDays === 0) {
      nextCheckupLabel = "Today";
    } else if (diffDays === 1) {
      nextCheckupLabel = "Tomorrow";
    } else {
      nextCheckupLabel = `${diffDays} days`;
    }
  }

  // Calculate BMI if height and weight available
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

  // Vitals status (simplified — Normal if all basic data is present)
  const vitalsStatus =
    patient.patientProfile?.heightCm &&
    patient.patientProfile?.weightKg &&
    patient.patientProfile?.bloodGroup
      ? "Normal"
      : "Incomplete";

  return {
    patient: {
      id: patient.id,
      fullName: patient.fullName,
      email: patient.email,
      profilePhotoUrl: patient.profilePhotoUrl,
      memberSince: patient.createdAt,
      vitals: {
        gender: patient.patientProfile?.gender || null,
        age: patient.patientProfile?.age || null,
        heightCm: patient.patientProfile?.heightCm || null,
        weightKg: patient.patientProfile?.weightKg || null,
        bloodGroup: patient.patientProfile?.bloodGroup || null,
        location: patient.patientProfile?.location || null,
        bmi,
        bmiStatus,
        vitalsStatus,
      },
    },
    upcomingAppointment: upcomingAppointment || null,
    nextCheckup: {
      days: nextCheckupDays,
      label: nextCheckupLabel,
    },
    stats: {
      totalAppointments,
    },
    quickActions: {
      availablePackages: activePackagesCount,
      availableDigitalProducts: digitalProductsCount,
    },
    // Placeholders for future features
    dietPlan: null,       // Will be added when DietPlan schema is built
    recentActivity: [],   // Will be added when Activity schema is built
  };
};

module.exports = {
  getPatientDashboard,
};
