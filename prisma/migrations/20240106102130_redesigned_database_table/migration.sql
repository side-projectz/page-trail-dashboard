/*
  Warnings:

  - You are about to drop the column `dateId` on the `Site` table. All the data in the column will be lost.
  - You are about to drop the column `meta_description` on the `Site` table. All the data in the column will be lost.
  - You are about to drop the column `meta_title` on the `Site` table. All the data in the column will be lost.
  - You are about to drop the column `page` on the `Site` table. All the data in the column will be lost.
  - You are about to drop the `Date` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[pageId,userId]` on the table `Site` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `endDateTime` to the `Site` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pageId` to the `Site` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDateTime` to the `Site` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Site" DROP CONSTRAINT "Site_dateId_fkey";

-- DropForeignKey
ALTER TABLE "Site" DROP CONSTRAINT "Site_domainId_fkey";

-- DropIndex
DROP INDEX "Site_userId_dateId_domainId_page_key";

-- AlterTable
ALTER TABLE "Site" DROP COLUMN "dateId",
DROP COLUMN "meta_description",
DROP COLUMN "meta_title",
DROP COLUMN "page",
ADD COLUMN     "endDateTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "pageId" TEXT NOT NULL,
ADD COLUMN     "startDateTime" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "domainId" DROP NOT NULL;

-- DropTable
DROP TABLE "Date";

-- CreateTable
CREATE TABLE "Page" (
    "domainId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "meta_title" TEXT,
    "meta_description" TEXT,
    "meta_image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Page_url_key" ON "Page"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Site_pageId_userId_key" ON "Site"("pageId", "userId");

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "Domain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Site" ADD CONSTRAINT "Site_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Site" ADD CONSTRAINT "Site_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "Domain"("id") ON DELETE SET NULL ON UPDATE CASCADE;
