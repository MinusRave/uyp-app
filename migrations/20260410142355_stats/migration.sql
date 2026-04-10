-- CreateTable
CREATE TABLE "QuizEvent" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "questionIndex" INTEGER,
    "deviceType" TEXT,
    "referrer" TEXT,
    "utm_source" TEXT,
    "utm_medium" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuizEvent_pkey" PRIMARY KEY ("id")
);
