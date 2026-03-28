import { prisma } from "@project/db";
export async function listBadges(req, res) {
    const badges = await prisma.badge.findMany();
    const earned = await prisma.userBadge.findMany({ where: { userId: req.user.userId } });
    const earnedSet = new Set(earned.map((e) => e.badgeId));
    const merged = badges.map((badge) => ({
        ...badge,
        earned: earnedSet.has(badge.id),
    }));
    return res.json(merged);
}
