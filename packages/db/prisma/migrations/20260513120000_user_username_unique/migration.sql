-- Deduplicate usernames before adding unique constraint (keep earliest row per username).
UPDATE "User" u
SET username = LEFT(u.username, 17) || '_' || substring(u.id from 1 for 7)
FROM (
  SELECT id,
    ROW_NUMBER() OVER (PARTITION BY username ORDER BY "createdAt" ASC, id ASC) AS rn
  FROM "User"
) r
WHERE u.id = r.id AND r.rn > 1;

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
