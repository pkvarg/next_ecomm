/*
  Warnings:

  - You are about to drop the column `productId` on the `Order` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_productId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "productId",
ADD COLUMN     "products" JSONB,
ADD COLUMN     "userInfo" JSONB;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "countInStock" INTEGER,
ALTER COLUMN "filePath" DROP NOT NULL,
ALTER COLUMN "imagePath" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;
