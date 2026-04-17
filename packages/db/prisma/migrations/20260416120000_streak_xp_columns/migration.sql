-- XP-based streak: last activity / last app-open calendar keys (client local YYYY-MM-DD).
ALTER TABLE "UserProgress" ADD COLUMN IF NOT EXISTS "streakLastActivityDate" TEXT;
ALTER TABLE "UserProgress" ADD COLUMN IF NOT EXISTS "streakLastCheckedDate" TEXT;

-- Retire practice-based streak artifacts (replaced by streak-logic + new columns).
ALTER TABLE "UserProgress" DROP COLUMN IF EXISTS "streakHistoryJson";
ALTER TABLE "UserProgress" DROP COLUMN IF EXISTS "streakLongest";
ALTER TABLE "UserProgress" DROP COLUMN IF EXISTS "streakLastDate";
