/*
  Warnings:

  - You are about to drop the column `durationMs` on the `AiLog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AiLog" DROP COLUMN "durationMs",
ADD COLUMN     "duration" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "inputTokens" INTEGER,
ADD COLUMN     "outputTokens" INTEGER;
