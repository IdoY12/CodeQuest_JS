import { prisma } from "@project/db";
import type { User } from "@prisma/client";
import { USERNAME_MAX_LEN, USERNAME_MIN_LEN } from "@project/user-credentials";

export class GoogleSignInBlockedError extends Error {
  constructor(m: string) {
    super(m);
    this.name = "GoogleSignInBlockedError";
  }
}

function deriveGoogleUsername(email: string, displayName?: string): string {
  const named = displayName?.trim().replace(/\s+/g, "_").slice(0, USERNAME_MAX_LEN);
  const local = (email.split("@")[0] || "user").slice(0, USERNAME_MAX_LEN);
  let u = named && named.length >= USERNAME_MIN_LEN ? named : local;
  if (u.length < USERNAME_MIN_LEN) u = `${local}_gq`.slice(0, USERNAME_MAX_LEN).padEnd(USERNAME_MIN_LEN, "_");
  return u.slice(0, USERNAME_MAX_LEN);
}

export async function findOrCreateGoogleUser(
  googleId: string,
  email: string,
  displayName?: string,
): Promise<{ user: User; isNew: boolean }> {
  const bySub = await prisma.user.findUnique({ where: { googleId } });
  if (bySub) return { user: bySub, isNew: false };
  const byEmail = await prisma.user.findUnique({ where: { email } });
  if (byEmail) {
    if (byEmail.googleId && byEmail.googleId !== googleId) {
      throw new GoogleSignInBlockedError("This email is linked to a different Google account.");
    }
    if (byEmail.hashedPassword) {
      throw new GoogleSignInBlockedError(
        "This email is already registered with a password. Sign in with email and password.",
      );
    }
    const updated = await prisma.user.update({ where: { id: byEmail.id }, data: { googleId } });
    return { user: updated, isNew: false };
  }
  const user = await prisma.$transaction(async (tx) => {
    const created = await tx.user.create({
      data: {
        email,
        googleId,
        username: deriveGoogleUsername(email, displayName),
        hashedPassword: null,
        activeExperienceLevel: "JUNIOR",
      },
    });
    await tx.userProgress.create({
      data: {
        userId: created.id,
        experienceLevel: "JUNIOR",
        notificationsEnabled: true,
        dailyCommitmentMinutes: 15,
      },
    });
    return created;
  });
  return { user, isNew: true };
}
