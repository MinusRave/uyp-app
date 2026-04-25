-- AlterTable
ALTER TABLE "TestSession" ADD COLUMN     "purchasedAddons" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Grandfather existing paid users: seed all 5 guides (they were bundled free before).
UPDATE "TestSession"
SET "purchasedAddons" = ARRAY['mental-load', 'dead-bedroom', 'narcissist-detection', 'emotional-affair', 'stay-or-go']::TEXT[]
WHERE "isPaid" = true;

-- Add workbook for anyone who previously purchased the order bump.
UPDATE "TestSession"
SET "purchasedAddons" = array_append("purchasedAddons", 'workbook')
WHERE "hasPurchasedOrderBump" = true;
