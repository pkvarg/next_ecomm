/*
  Warnings:

  - Made the column `countInStock` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "countInStock" SET NOT NULL,
ALTER COLUMN "countInStock" SET DEFAULT 0;
