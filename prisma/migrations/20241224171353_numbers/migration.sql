/*
  Warnings:

  - Added the required column `postage` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productTotalsPrice` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `pricePaidInCents` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "postage" INTEGER NOT NULL,
ADD COLUMN     "productTotalsPrice" INTEGER NOT NULL,
DROP COLUMN "pricePaidInCents",
ADD COLUMN     "pricePaidInCents" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
