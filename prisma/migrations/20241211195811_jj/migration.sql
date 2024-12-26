/*
  Warnings:

  - Changed the type of `products` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userInfo` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "products",
ADD COLUMN     "products" JSONB NOT NULL,
DROP COLUMN "userInfo",
ADD COLUMN     "userInfo" JSONB NOT NULL;
