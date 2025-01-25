-- CreateTable
CREATE TABLE "VisitorsCount" (
    "id" TEXT NOT NULL,
    "count" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VisitorsCount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VisitorsCount_count_key" ON "VisitorsCount"("count");
