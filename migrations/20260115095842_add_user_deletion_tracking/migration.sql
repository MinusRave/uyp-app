-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deletionDate" TIMESTAMP(3),
ADD COLUMN     "scheduledForDeletion" BOOLEAN NOT NULL DEFAULT false;
