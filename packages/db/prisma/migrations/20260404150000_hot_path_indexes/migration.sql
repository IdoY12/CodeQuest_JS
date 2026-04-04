-- Hot-path lookup indexes for learning, progress, duels, and badges
CREATE INDEX IF NOT EXISTS "Chapter_pathId_idx" ON "Chapter"("pathId");
CREATE INDEX IF NOT EXISTS "Lesson_chapterId_idx" ON "Lesson"("chapterId");
CREATE INDEX IF NOT EXISTS "Exercise_lessonId_idx" ON "Exercise"("lessonId");
CREATE INDEX IF NOT EXISTS "ExerciseOption_exerciseId_idx" ON "ExerciseOption"("exerciseId");
CREATE INDEX IF NOT EXISTS "UserExerciseHistory_userId_idx" ON "UserExerciseHistory"("userId");
CREATE INDEX IF NOT EXISTS "UserExerciseHistory_exerciseId_idx" ON "UserExerciseHistory"("exerciseId");
CREATE INDEX IF NOT EXISTS "DailyPracticeLog_userId_idx" ON "DailyPracticeLog"("userId");
CREATE INDEX IF NOT EXISTS "DuelQuestion_category_idx" ON "DuelQuestion"("category");
CREATE INDEX IF NOT EXISTS "DuelSession_player1Id_idx" ON "DuelSession"("player1Id");
CREATE INDEX IF NOT EXISTS "DuelSession_player2Id_idx" ON "DuelSession"("player2Id");
CREATE INDEX IF NOT EXISTS "StreakLog_userId_idx" ON "StreakLog"("userId");
CREATE INDEX IF NOT EXISTS "UserBadge_userId_idx" ON "UserBadge"("userId");
