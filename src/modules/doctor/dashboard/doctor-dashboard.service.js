const prisma = require("../../../lib/prisma");

const getDoctorDashboard = async (doctorId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [doctor, todayAppointments, upcomingAppointment, totalPatients, pendingAppointments, completedAppointments] =
    await Promise.all([
      // Doctor profile
      prisma.user.findUnique({
        where: { id: doctorId },
        select: {
          id: true,
          fullName: true,
          email: true,
          profilePhotoUrl: true,
          lastLoginAt: true,
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
      }),

      // Today's appointments
      prisma.appointment.count({
        where: {
          doctorId,
          dateTime: { gte: today, lt: tomorrow },
          status: { in: ["PENDING", "CONFIRMED"] },
        },
      }),

      // Next upcoming appointment
      prisma.appointment.findFirst({
        where: {
          doctorId,
          dateTime: { gte: new Date() },
          status: { in: ["PENDING", "CONFIRMED"] },
        },
        orderBy: { dateTime: "asc" },
        select: {
          id: true,
          dateTime: true,
          type: true,
          status: true,
          notes: true,
          patient: {
            select: {
              id: true,
              fullName: true,
              profilePhotoUrl: true,
              patientProfile: {
                select: {
                  phoneNumber: true,
                  age: true,
                  gender: true,
                  bloodGroup: true,
                },
              },
            },
          },
        },
      }),

      // Total unique patients (who ever booked with this doctor)
      prisma.appointment.groupBy({
        by: ["patientId"],
        where: { doctorId },
      }),

      // Pending appointments
      prisma.appointment.count({
        where: { doctorId, status: "PENDING" },
      }),

      // Completed appointments
      prisma.appointment.count({
        where: { doctorId, status: "COMPLETED" },
      }),
    ]);

  if (!doctor) throw new Error("Doctor not found");

  return {
    doctor,
    stats: {
      todayAppointments,
      totalPatients: totalPatients.length,
      pendingAppointments,
      completedAppointments,
    },
    upcomingAppointment: upcomingAppointment || null,
  };
};

module.exports = { getDoctorDashboard };
