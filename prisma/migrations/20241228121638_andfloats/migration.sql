/*
  Warnings:

  - You are about to alter the column `postage` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `productTotalsPrice` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "postage" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "productTotalsPrice" SET DATA TYPE DOUBLE PRECISION;
