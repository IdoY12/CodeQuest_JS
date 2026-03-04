import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { authMiddleware } from "../middleware/auth.js";
import { comparePassword, hashPassword } from "../lib/auth.js";
export const userRouter = Router();
userRouter.use(authMiddleware);
userRouter.get("/profile", async (req, res) => {
    const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
        include: { progress: true, duelRating: true },
    });
    if (!user)
        return res.status(404).json({ error: "User not found" });
    return res.json(user);
});
userRouter.patch("/profile", async (req, res) => {
    const parsed = z.object({ username: z.string().min(2).optional(), avatarId: z.string().min(2).optional() }).safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    const user = await prisma.user.update({
        where: { id: req.user.userId },
        data: parsed.data,
    });
    return res.json({ id: user.id, username: user.username, avatarId: user.avatarId });
});
userRouter.get("/progress-summary", async (req, res) => {
    const progress = await prisma.userProgress.findUnique({ where: { userId: req.user.userId } });
    return res.json(progress);
});
userRouter.post("/onboarding", async (req, res) => {
    const parsed = z
        .object({
        goal: z.enum(["JOB", "WORK", "FUN", "PROJECT"]),
        experienceLevel: z.enum(["BEGINNER", "BASICS", "INTERMEDIATE", "ADVANCED"]),
        dailyCommitmentMinutes: z.number().int().min(5).max(60),
    })
        .safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    const assignedPathKey = parsed.data.experienceLevel === "BEGINNER" || parsed.data.experienceLevel === "BASICS"
        ? "BEGINNER"
        : "ADVANCED";
    const assignedPath = await prisma.learningPath.findUnique({ where: { key: assignedPathKey } });
    if (!assignedPath)
        return res.status(400).json({ error: "Assigned learning path not found" });
    const updated = await prisma.userProgress.update({
        where: { userId: req.user.userId },
        data: {
            goal: parsed.data.goal,
            experienceLevel: parsed.data.experienceLevel,
            dailyCommitmentMinutes: parsed.data.dailyCommitmentMinutes,
            onboardingCompleted: true,
            pathId: assignedPath.id,
        },
        include: { path: true },
    });
    return res.json({
        onboardingCompleted: updated.onboardingCompleted,
        pathKey: updated.path.key,
        goal: updated.goal,
        experienceLevel: updated.experienceLevel,
        dailyCommitmentMinutes: updated.dailyCommitmentMinutes,
    });
});
userRouter.get("/streak-history", async (req, res) => {
    const logs = await prisma.streakLog.findMany({
        where: { userId: req.user.userId },
        orderBy: { date: "desc" },
        take: 90,
    });
    return res.json(logs);
});
userRouter.post("/change-password", async (req, res) => {
    const parsed = z
        .object({ currentPassword: z.string().min(6), newPassword: z.string().min(6) })
        .safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user)
        return res.status(404).json({ error: "User not found" });
    const valid = await comparePassword(parsed.data.currentPassword, user.hashedPassword);
    if (!valid)
        return res.status(401).json({ error: "Current password is incorrect" });
    await prisma.user.update({
        where: { id: user.id },
        data: { hashedPassword: await hashPassword(parsed.data.newPassword) },
    });
    return res.json({ ok: true });
});
userRouter.delete("/account", async (req, res) => {
    await prisma.user.delete({ where: { id: req.user.userId } });
    return res.json({ ok: true });
});
