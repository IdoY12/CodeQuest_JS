-- AlterTable
ALTER TABLE "CodePuzzle" RENAME CONSTRAINT "DailyPuzzle_pkey" TO "CodePuzzle_pkey";

-- RenameIndex
ALTER INDEX "DailyPuzzle_orderIndex_key" RENAME TO "CodePuzzle_orderIndex_key";
