import { apiRequest } from "../services/api";
import type PracticeLogResponse from "@/models/PracticeLogResponse";

export async function postPracticeLog(accessToken: string, seconds: number): Promise<boolean> {
  try {
    const dateKey = new Date().toLocaleDateString("en-CA");
    await apiRequest<PracticeLogResponse>("/user/practice-log", {
      method: "POST",
      token: accessToken,
      body: JSON.stringify({ dateKey, practicedSeconds: seconds }),
    });
    return true;
  } catch {
    return false;
  }
}
