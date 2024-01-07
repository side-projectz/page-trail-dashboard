/*
  Warnings:

  - A unique constraint covering the columns `[pageId,userId,startDateTime,endDateTime]` on the table `Site` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Site_pageId_userId_startDateTime_key";

-- CreateIndex
CREATE UNIQUE INDEX "Site_pageId_userId_startDateTime_endDateTime_key" ON "Site"("pageId", "userId", "startDateTime", "endDateTime");
