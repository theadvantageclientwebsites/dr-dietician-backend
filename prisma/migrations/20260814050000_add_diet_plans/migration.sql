-- CreateEnum
CREATE TYPE "DietPlanDuration" AS ENUM ('SEVEN_DAYS', 'TEN_DAYS', 'FIFTEEN_DAYS');

-- CreateEnum
CREATE TYPE "DietPlanStatus" AS ENUM ('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "DietPlan" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "duration" "DietPlanDuration" NOT NULL,
    "calorieTarget" INTEGER,
    "foodsToEat" TEXT[],
    "foodsToAvoid" TEXT[],
    "breakfast" TEXT,
    "lunch" TEXT,
    "dinner" TEXT,
    "snacks" TEXT,
    "notes" TEXT,
    "status" "DietPlanStatus" NOT NULL DEFAULT 'DRAFT',
    "submittedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DietPlan_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "DietPlan_subscriptionId_key" ON "DietPlan"("subscriptionId");
CREATE INDEX "DietPlan_doctorId_status_idx" ON "DietPlan"("doctorId", "status");
CREATE INDEX "DietPlan_patientId_status_idx" ON "DietPlan"("patientId", "status");

ALTER TABLE "DietPlan" ADD CONSTRAINT "DietPlan_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DietPlan" ADD CONSTRAINT "DietPlan_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DietPlan" ADD CONSTRAINT "DietPlan_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;
