-- CreateTable
CREATE TABLE "DailyPuzzle" (
    "id" SERIAL NOT NULL,
    "prompt" TEXT NOT NULL,
    "acceptedAnswers" TEXT[],
    "orderIndex" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyPuzzle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DailyPuzzle_orderIndex_key" ON "DailyPuzzle"("orderIndex");
