-- CreateTable
CREATE TABLE "DailyPuzzle" (
    "id" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "acceptedAnswers" JSONB NOT NULL,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "DailyPuzzle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonalizedExercise" (
    "id" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "type" "ExerciseType" NOT NULL,
    "prompt" TEXT NOT NULL,
    "codeSnippet" TEXT NOT NULL,
    "correctAnswer" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "xpReward" INTEGER NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "options" JSONB NOT NULL,

    CONSTRAINT "PersonalizedExercise_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PersonalizedExercise_level_idx" ON "PersonalizedExercise"("level");
