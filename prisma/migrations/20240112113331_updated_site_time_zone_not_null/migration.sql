/*
  Warnings:

  - Made the column `timeZone` on table `Site` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Site" ALTER COLUMN "timeZone" SET NOT NULL;
