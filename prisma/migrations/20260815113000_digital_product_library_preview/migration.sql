-- AlterTable
ALTER TABLE "DigitalProduct" ADD COLUMN "previewUrl" TEXT;

-- CreateTable
CREATE TABLE "_PackageTwelveMonthFreebies" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

CREATE UNIQUE INDEX "_PackageTwelveMonthFreebies_AB_unique" ON "_PackageTwelveMonthFreebies"("A", "B");
CREATE INDEX "_PackageTwelveMonthFreebies_B_index" ON "_PackageTwelveMonthFreebies"("B");

ALTER TABLE "_PackageTwelveMonthFreebies" ADD CONSTRAINT "_PackageTwelveMonthFreebies_A_fkey" FOREIGN KEY ("A") REFERENCES "DigitalProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_PackageTwelveMonthFreebies" ADD CONSTRAINT "_PackageTwelveMonthFreebies_B_fkey" FOREIGN KEY ("B") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;
