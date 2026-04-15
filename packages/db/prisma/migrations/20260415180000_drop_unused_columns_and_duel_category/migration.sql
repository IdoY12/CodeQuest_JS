-- Drop DuelQuestion.category and enum DuelCategory (unused in runtime).
DROP INDEX IF EXISTS "DuelQuestion_category_idx";
ALTER TABLE "DuelQuestion" DROP COLUMN IF EXISTS "category";
DROP TYPE IF EXISTS "DuelCategory";

-- Exercise.difficulty was unused in API and business logic.
ALTER TABLE "Exercise" DROP COLUMN IF EXISTS "difficulty";

-- CodePuzzle.createdAt was never read by handlers.
ALTER TABLE "CodePuzzle" DROP COLUMN IF EXISTS "createdAt";
