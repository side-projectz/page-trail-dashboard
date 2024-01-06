/*
  Warnings:

  - A unique constraint covering the columns `[userId,date,domainId,page]` on the table `Site` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `date` to the `Site` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Site_userId_domainId_page_key";

-- AlterTable
ALTER TABLE "Site" ADD COLUMN     "date" DATE NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Site_userId_date_domainId_page_key" ON "Site"("userId", "date", "domainId", "page");
