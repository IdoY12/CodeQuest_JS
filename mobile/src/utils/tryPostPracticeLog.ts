import type UserService from "@/services/UserService";

export async function tryPostPracticeLog(user: UserService, seconds: number): Promise<boolean> {
  try {
    await user.postPracticeLog(new Date().toLocaleDateString("en-CA"), seconds);
    return true;
  } catch {
    return false;
  }
}
