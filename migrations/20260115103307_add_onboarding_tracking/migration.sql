-- AlterTable
ALTER TABLE "TestSession" ADD COLUMN     "downloadedFridgeSheet" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "onboardingCompletedAt" TIMESTAMP(3),
ADD COLUMN     "onboardingStep" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "savedScriptsToPhone" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "triedTranslatorTool" BOOLEAN NOT NULL DEFAULT false;
