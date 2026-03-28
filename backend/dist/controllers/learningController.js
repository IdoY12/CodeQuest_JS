import { z } from "zod";
import { prisma } from "@project/db";
import { logError, logInfo } from "../utils/logger.js";
export async function getPaths(_req, res) {
    const paths = await prisma.learningPath.findMany();
    return res.json(paths);
}
export async function getChapters(req, res) {
    logInfo("[TASKS]", "chapters:fetch", { pathKey: req.params.pathKey });
    const path = await prisma.learningPath.findUnique({
        where: { key: req.params.pathKey },
    });
    if (!path)
        return res.status(404).json({ error: "Path not found" });
    const chapters = await prisma.chapter.findMany({
        where: { pathId: path.id },
        orderBy: { orderIndex: "asc" },
    });
    return res.json(chapters);
}
export async function getLessons(req, res) {
    logInfo("[TASKS]", "lessons:fetch", { chapterId: req.params.chapterId });
    const lessons = await prisma.lesson.findMany({
        where: { chapterId: String(req.params.chapterId) },
        orderBy: { orderIndex: "asc" },
    });
    return res.json(lessons);
}
export async function getExercises(req, res) {
    logInfo("[TASKS]", "exercises:fetch", { lessonId: req.params.lessonId });
    const exercises = await prisma.exercise.findMany({
        where: { lessonId: String(req.params.lessonId) },
        orderBy: { orderIndex: "asc" },
        include: { options: true },
    });
    return res.json(exercises);
}
export async function submitExercise(req, res) {
    logInfo("[TASKS]", "exercise:submit-attempt", { userId: req.user?.userId, exerciseId: req.body?.exerciseId });
    const parsed = z
        .object({
        exerciseId: z.string().min(3),
        answer: z.string(),
        timeTakenMs: z.number().int().positive().default(1000),
        attempts: z.number().int().positive().default(1),
    })
        .safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    const exercise = await prisma.exercise.findUnique({ where: { id: parsed.data.exerciseId } });
    if (!exercise)
        return res.status(404).json({ error: "Exercise not found" });
    const isCorrect = parsed.data.answer.trim().replace(/\s/g, "") === exercise.correctAnswer.trim().replace(/\s/g, "");
    await prisma.userExerciseHistory.create({
        data: {
            userId: req.user.userId,
            exerciseId: exercise.id,
            isCorrect,
            attempts: parsed.data.attempts,
            timeTakenMs: parsed.data.timeTakenMs,
        },
    });
    if (isCorrect) {
        const existingProgress = await prisma.userProgress.findUnique({ where: { userId: req.user.userId } });
        if (existingProgress) {
            const nextXp = existingProgress.xpTotal + exercise.xpReward;
            const nextLevel = Math.max(1, Math.floor(nextXp / 250) + 1);
            await prisma.userProgress.update({
                where: { userId: req.user.userId },
                data: {
                    xpTotal: nextXp,
                    level: nextLevel,
                },
            });
        }
    }
    return res.json({
        isCorrect,
        xpEarned: isCorrect ? exercise.xpReward : 0,
        correctAnswer: exercise.correctAnswer,
        explanation: exercise.explanation,
    });
}
export async function getLessonResults(req, res) {
    logInfo("[TASKS]", "lesson-results:fetch", { userId: req.user?.userId, lessonId: req.params.lessonId });
    const lessonId = String(req.params.lessonId);
    const history = await prisma.userExerciseHistory.findMany({
        where: {
            userId: req.user.userId,
            exercise: { lessonId },
        },
    });
    const total = history.length;
    const correct = history.filter((h) => h.isCorrect).length;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    return res.json({ total, correct, accuracy });
}
export async function getResume(req, res) {
    try {
        logInfo("[TASKS]", "resume:fetch", { userId: req.user?.userId });
        const progress = await prisma.userProgress.findUnique({ where: { userId: req.user.userId } });
        return res.json(progress);
    }
    catch (error) {
        logError("[TASKS]", error, { phase: "resume", userId: req.user?.userId });
        return res.status(500).json({ error: "Failed to fetch resume" });
    }
}
