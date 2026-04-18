-- RenameEnumValue
-- Renames the ExerciseType enum value that described interaction style as "drag and drop"
-- to LINE_ORDERING, which matches the actual tap-based line-reordering interaction.
-- ALTER TYPE ... RENAME VALUE is an in-place rename in Postgres 10+; existing rows are preserved.
ALTER TYPE "ExerciseType" RENAME VALUE 'DRAG_DROP' TO 'LINE_ORDERING';
