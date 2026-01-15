-- AlterTable
ALTER TABLE "TestSession" ADD COLUMN     "checkoutAbandonedAt" TIMESTAMP(3),
ADD COLUMN     "checkoutStartedAt" TIMESTAMP(3),
ADD COLUMN     "emailSentHistory" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "emailSequenceType" TEXT,
ADD COLUMN     "lastRetentionEmailSentAt" TIMESTAMP(3),
ADD COLUMN     "personalizationData" JSONB,
ADD COLUMN     "retentionEmailStage" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "stripeCheckoutSessionId" TEXT,
ADD COLUMN     "unsubscribedAt" TIMESTAMP(3),
ADD COLUMN     "unsubscribedFromEmails" BOOLEAN NOT NULL DEFAULT false;
