-- Exercise.xpReward was legacy; runtime XP uses shared constant only.
ALTER TABLE "Exercise" DROP COLUMN IF EXISTS "xpReward";
