/*
  Warnings:

  - Changed the type of `count` on the `VisitorsCount` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "VisitorsCount" DROP COLUMN "count",
ADD COLUMN     "count" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "VisitorsCount_count_key" ON "VisitorsCount"("count");
