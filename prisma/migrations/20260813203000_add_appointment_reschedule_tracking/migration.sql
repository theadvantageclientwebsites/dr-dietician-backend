-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "previousDateTime" TIMESTAMP(3),
ADD COLUMN     "rescheduledAt" TIMESTAMP(3),
ADD COLUMN     "rescheduledByDoctor" BOOLEAN NOT NULL DEFAULT false;
