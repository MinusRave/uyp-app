-- AlterTable
ALTER TABLE "TestSession" ADD COLUMN     "fullReport" JSONB,
ADD COLUMN     "quickOverview" JSONB;

-- CreateTable
CREATE TABLE "AiLog" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "action" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "durationMs" INTEGER NOT NULL,
    "tokensUsed" INTEGER,
    "status" TEXT NOT NULL,
    "errorMessage" TEXT,
    "requestPrompt" TEXT,
    "response" TEXT,
    "sessionId" TEXT,

    CONSTRAINT "AiLog_pkey" PRIMARY KEY ("id")
);
