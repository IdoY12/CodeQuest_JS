import { apiRequest } from "../services/api";

export async function postPracticeLog(accessToken: string, seconds: number): Promise<boolean> {
  try {
    const dateKey = new Date().toLocaleDateString("en-CA");
    await apiRequest<{ practicedSeconds: number }>("/user/practice-log", {
      method: "POST",
      token: accessToken,
      body: JSON.stringify({ dateKey, practicedSeconds: seconds }),
    });
    return true;
  } catch {
    return false;
  }
}
