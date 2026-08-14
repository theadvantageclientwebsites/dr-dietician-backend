-- AlterEnum
ALTER TYPE "PackageDuration" ADD VALUE IF NOT EXISTS 'TWELVE_MONTHS';

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('PENDING_ASSIGNMENT', 'ACTIVE', 'EXPIRED', 'CANCELLED');

-- AlterTable Package: 1 month -> 12 months
ALTER TABLE "Package" ADD COLUMN "price12Months" DOUBLE PRECISION NOT NULL DEFAULT 0;
UPDATE "Package" SET "price12Months" = ROUND(("price6Months" * 1.8)::numeric, 0);
ALTER TABLE "Package" DROP COLUMN "price1Month";
ALTER TABLE "Package" ALTER COLUMN "price12Months" DROP DEFAULT;

-- AlterTable Order
ALTER TABLE "Order" ADD COLUMN "isDummy" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "doctorId" TEXT,
    "duration" "PackageDuration" NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'PENDING_ASSIGNMENT',
    "meetingsPerMonth" INTEGER NOT NULL DEFAULT 4,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "assignedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Subscription_orderId_key" ON "Subscription"("orderId");
CREATE INDEX "Subscription_patientId_status_idx" ON "Subscription"("patientId", "status");
CREATE INDEX "Subscription_doctorId_idx" ON "Subscription"("doctorId");

ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
