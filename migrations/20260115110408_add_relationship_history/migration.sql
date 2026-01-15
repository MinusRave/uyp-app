-- AlterTable
ALTER TABLE "TestSession" ADD COLUMN     "hasChildren" BOOLEAN,
ADD COLUMN     "livingTogether" BOOLEAN,
ADD COLUMN     "majorLifeTransition" TEXT,
ADD COLUMN     "previousMarriage" BOOLEAN,
ADD COLUMN     "previousRelationships" TEXT,
ADD COLUMN     "relationshipDuration" TEXT;
