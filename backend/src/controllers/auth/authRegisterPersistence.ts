import { prisma } from "@project/db";
import type { User } from "@prisma/client";
import { hashPassword } from "../../utils/passwordHashing.js";

type RegisterInput = { email: string; username: string; password: string };

export async function createRegisteredUserWithDefaults(input: RegisterInput): Promise<User> {
  return prisma.$transaction(async (transaction) => {
    const createdUser = await transaction.user.create({
      data: {
        email: input.email,
        username: input.username,
        hashedPassword: await hashPassword(input.password),
        activeExperienceLevel: "JUNIOR",
      },
    });
    await transaction.userProgress.create({
      data: {
        userId: createdUser.id,
        experienceLevel: "JUNIOR",
        notificationsEnabled: true,
        dailyCommitmentMinutes: 15,
      },
    });
    await transaction.duelRating.create({ data: { userId: createdUser.id } });

    return createdUser;
  });
}
