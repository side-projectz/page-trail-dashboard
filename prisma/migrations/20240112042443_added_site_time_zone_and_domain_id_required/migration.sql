/*
  Warnings:

  - Made the column `domainId` on table `Site` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Site" DROP CONSTRAINT "Site_domainId_fkey";

-- AlterTable
ALTER TABLE "Site" ADD COLUMN     "timeZone" TEXT,
ALTER COLUMN "domainId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Site" ADD CONSTRAINT "Site_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "Domain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
