-- Align "Difficulty" with Prisma (JUNIOR / MID / SENIOR).
-- Upgrades databases created from older baselines that used BEGINNER / INTERMEDIATE / ADVANCED.
-- Safe if values are already JUNIOR / MID / SENIOR (columns are recast via text).

ALTER TABLE "Exercise" ALTER COLUMN "difficulty" TYPE TEXT USING ("difficulty"::TEXT);
ALTER TABLE "DuelQuestion" ALTER COLUMN "difficulty" TYPE TEXT USING ("difficulty"::TEXT);

DROP TYPE "Difficulty";

CREATE TYPE "Difficulty" AS ENUM ('JUNIOR', 'MID', 'SENIOR');

ALTER TABLE "Exercise" ALTER COLUMN "difficulty" TYPE "Difficulty" USING (
  CASE "difficulty"
    WHEN 'BEGINNER' THEN 'JUNIOR'::"Difficulty"
    WHEN 'INTERMEDIATE' THEN 'MID'::"Difficulty"
    WHEN 'ADVANCED' THEN 'SENIOR'::"Difficulty"
    WHEN 'JUNIOR' THEN 'JUNIOR'::"Difficulty"
    WHEN 'MID' THEN 'MID'::"Difficulty"
    WHEN 'SENIOR' THEN 'SENIOR'::"Difficulty"
    ELSE 'JUNIOR'::"Difficulty"
  END
);

ALTER TABLE "DuelQuestion" ALTER COLUMN "difficulty" TYPE "Difficulty" USING (
  CASE "difficulty"
    WHEN 'BEGINNER' THEN 'JUNIOR'::"Difficulty"
    WHEN 'INTERMEDIATE' THEN 'MID'::"Difficulty"
    WHEN 'ADVANCED' THEN 'SENIOR'::"Difficulty"
    WHEN 'JUNIOR' THEN 'JUNIOR'::"Difficulty"
    WHEN 'MID' THEN 'MID'::"Difficulty"
    WHEN 'SENIOR' THEN 'SENIOR'::"Difficulty"
    ELSE 'JUNIOR'::"Difficulty"
  END
);
