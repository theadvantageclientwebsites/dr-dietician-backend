-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('ONE_ON_ONE_CONSULTATION', 'LAB_REPORT_ANALYSIS');

-- CreateEnum
CREATE TYPE "ServiceBookingStatus" AS ENUM ('PAID', 'AWAITING_SCHEDULE', 'SCHEDULED', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN "checkoutMeta" JSONB;

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN "serviceBookingId" TEXT;

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "type" "ServiceType" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "durationMinutes" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceBooking" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "status" "ServiceBookingStatus" NOT NULL DEFAULT 'PAID',
    "patientNotes" TEXT,
    "doctorNotes" TEXT,
    "preferredDateTime" TIMESTAMP(3),
    "appointmentType" "AppointmentType" NOT NULL DEFAULT 'ONLINE',
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceBooking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ServiceBooking_orderId_key" ON "ServiceBooking"("orderId");

-- CreateIndex
CREATE INDEX "ServiceBooking_patientId_status_idx" ON "ServiceBooking"("patientId", "status");

-- CreateIndex
CREATE INDEX "ServiceBooking_doctorId_status_idx" ON "ServiceBooking"("doctorId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_serviceBookingId_key" ON "Appointment"("serviceBookingId");

-- AddForeignKey
ALTER TABLE "ServiceBooking" ADD CONSTRAINT "ServiceBooking_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceBooking" ADD CONSTRAINT "ServiceBooking_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceBooking" ADD CONSTRAINT "ServiceBooking_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceBooking" ADD CONSTRAINT "ServiceBooking_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_serviceBookingId_fkey" FOREIGN KEY ("serviceBookingId") REFERENCES "ServiceBooking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Seed catalog (consult price is a placeholder until client sends the real amount)
INSERT INTO "Service" ("id", "type", "name", "description", "price", "durationMinutes", "isActive", "createdAt", "updatedAt")
VALUES
  (
    'a1b2c3d4-e5f6-7890-abcd-111111111111',
    'ONE_ON_ONE_CONSULTATION',
    'One-on-One Diet Consultation',
    '60-minute 1:1 consultation. Pay in full at booking. A doctor is assigned automatically.',
    799,
    60,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    'a1b2c3d4-e5f6-7890-abcd-222222222222',
    'LAB_REPORT_ANALYSIS',
    'Lab Report Analysis',
    'Dietitian reviews your lab/blood reports and shares notes. Pay in full at booking.',
    499,
    NULL,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  );
