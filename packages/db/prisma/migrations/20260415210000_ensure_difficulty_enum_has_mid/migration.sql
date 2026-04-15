-- PostgreSQL type "Difficulty" already includes MID (see 20260411000000_init:
--   CREATE TYPE "Difficulty" AS ENUM ('JUNIOR', 'MID', 'SENIOR');
-- and 20260411170000_difficulty_junior_mid_senior). Prisma `Difficulty` matches.
-- No ALTER TYPE is applied here: ADD VALUE cannot run inside a transaction on PG < 12,
-- and MID is already present on the canonical upgrade path.

SELECT 1;
