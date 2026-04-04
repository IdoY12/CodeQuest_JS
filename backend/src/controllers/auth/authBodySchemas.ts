import { z } from "zod";

export const registerBodySchema = z.object({
  email: z.email(),
  username: z.string().min(2),
  password: z.string().min(6),
});

export const loginBodySchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});
