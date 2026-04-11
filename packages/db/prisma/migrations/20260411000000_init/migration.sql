-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('JUNIOR', 'MID', 'SENIOR');

-- CreateEnum
CREATE TYPE "ExerciseType" AS ENUM ('CONCEPT_CARD', 'MULTIPLE_CHOICE', 'FIND_THE_BUG', 'DRAG_DROP', 'CODE_FILL', 'TAP_TOKEN');

-- CreateEnum
CREATE TYPE "ExperienceLevel" AS ENUM ('JUNIOR', 'MID', 'SENIOR');

-- CreateEnum
CREATE TYPE "DuelCategory" AS ENUM ('OUTPUT', 'SCOPE', 'ASYNC', 'TYPES', 'METHODS');

-- CreateTable
CREATE TABLE "Exercise" (
    "id" TEXT NOT NULL,
    "experienceLevel" "ExperienceLevel" NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "sectionLabel" TEXT,
    "type" "ExerciseType" NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "prompt" TEXT NOT NULL,
    "codeSnippet" TEXT NOT NULL,
    "correctAnswer" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "xpReward" INTEGER NOT NULL,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExerciseOption" (
    "id" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ExerciseOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DuelQuestion" (
    "id" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "codeSnippet" TEXT NOT NULL,
    "correctAnswer" TEXT NOT NULL,
    "type" "ExerciseType" NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "category" "DuelCategory" NOT NULL,
    "options" JSONB,
    "explanation" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "DuelQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DuelSession" (
    "id" TEXT NOT NULL,
    "player1Id" TEXT NOT NULL,
    "player2Id" TEXT NOT NULL,
    "winnerId" TEXT,
    "player1Score" INTEGER NOT NULL DEFAULT 0,
    "player2Score" INTEGER NOT NULL DEFAULT 0,
    "roundsPlayed" INTEGER NOT NULL DEFAULT 0,
    "roundReplay" JSONB,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "DuelSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DuelRating" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 1000,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "DuelRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "experienceLevel" "ExperienceLevel" NOT NULL,
    "currentExerciseIndex" INTEGER NOT NULL DEFAULT 0,
    "streakHistoryJson" JSONB,
    "practiceLogDateKey" TEXT,
    "practiceLogSeconds" INTEGER NOT NULL DEFAULT 0,
    "practiceLogIncompleteReminders" INTEGER NOT NULL DEFAULT 0,
    "practiceLogCompleteSent" BOOLEAN NOT NULL DEFAULT false,
    "goal" TEXT,
    "dailyCommitmentMinutes" INTEGER,
    "notificationsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
    "xpTotal" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 1,
    "streakCurrent" INTEGER NOT NULL DEFAULT 0,
    "streakLongest" INTEGER NOT NULL DEFAULT 0,
    "streakLastDate" TIMESTAMP(3),
    "streakShieldAvailable" BOOLEAN NOT NULL DEFAULT false,
    "streakShieldConsumedAt" TIMESTAMP(3),

    CONSTRAINT "UserProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "avatarId" TEXT NOT NULL DEFAULT 'avatar-braces',
    "avatarUrl" TEXT,
    "tokenVersion" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastActiveAt" TIMESTAMP(3),
    "activeExperienceLevel" "ExperienceLevel",

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Exercise_experienceLevel_orderIndex_idx" ON "Exercise"("experienceLevel", "orderIndex");

-- CreateIndex
CREATE INDEX "ExerciseOption_exerciseId_idx" ON "ExerciseOption"("exerciseId");

-- CreateIndex
CREATE INDEX "DuelQuestion_category_idx" ON "DuelQuestion"("category");

-- CreateIndex
CREATE INDEX "DuelSession_player1Id_idx" ON "DuelSession"("player1Id");

-- CreateIndex
CREATE INDEX "DuelSession_player2Id_idx" ON "DuelSession"("player2Id");

-- CreateIndex
CREATE UNIQUE INDEX "DuelRating_userId_key" ON "DuelRating"("userId");

-- CreateIndex
CREATE INDEX "UserProgress_userId_idx" ON "UserProgress"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserProgress_userId_experienceLevel_key" ON "UserProgress"("userId", "experienceLevel");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "ExerciseOption" ADD CONSTRAINT "ExerciseOption_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DuelSession" ADD CONSTRAINT "DuelSession_player1Id_fkey" FOREIGN KEY ("player1Id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DuelSession" ADD CONSTRAINT "DuelSession_player2Id_fkey" FOREIGN KEY ("player2Id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DuelSession" ADD CONSTRAINT "DuelSession_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DuelRating" ADD CONSTRAINT "DuelRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProgress" ADD CONSTRAINT "UserProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

