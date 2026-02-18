-- CreateTable
CREATE TABLE "SystemConfig" (
    "id" TEXT NOT NULL,
    "enableSoftGate" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SystemConfig_pkey" PRIMARY KEY ("id")
);
