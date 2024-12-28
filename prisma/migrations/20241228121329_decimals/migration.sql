/*
  Warnings:

  - You are about to alter the column `postage` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `productTotalsPrice` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `tax` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.

*/
-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "postage" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "productTotalsPrice" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "tax" SET DATA TYPE DECIMAL(65,30);
