/*
  Warnings:

  - You are about to drop the column `date` on the `Site` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,dateId,domainId,page]` on the table `Site` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dateId` to the `Site` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Site_userId_date_domainId_page_key";

-- AlterTable
ALTER TABLE "Site" DROP COLUMN "date",
ADD COLUMN     "dateId" DATE NOT NULL;

-- CreateTable
CREATE TABLE "Date" (
    "date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Date_date_key" ON "Date"("date");

-- CreateIndex
CREATE UNIQUE INDEX "Site_userId_dateId_domainId_page_key" ON "Site"("userId", "dateId", "domainId", "page");

-- AddForeignKey
ALTER TABLE "Site" ADD CONSTRAINT "Site_dateId_fkey" FOREIGN KEY ("dateId") REFERENCES "Date"("date") ON DELETE RESTRICT ON UPDATE CASCADE;
