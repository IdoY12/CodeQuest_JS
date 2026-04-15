import * as Notifications from "expo-notifications";
import UserService from "@/services/UserService";
import { logApp } from "@/utils/logger";

async function fireNotification(title: string, body: string) {
  await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: null,
  });
}

export async function runDailyGoalNotificationCheck(
  accessToken: string | null | undefined,
  isAuthenticated: boolean,
  notificationsEnabled: boolean,
): Promise<void> {
  if (!isAuthenticated || !accessToken || !notificationsEnabled) return;
  const user = new UserService(accessToken);
  const now = new Date();
  const dateKey = now.toLocaleDateString("en-CA");

  try {
    logApp("daily-goal:check");
    const status = await user.getDailyGoalStatus(dateKey);

    if (status.canSendComplete) {
      await fireNotification(
        "Daily goal crushed!",
        `You practiced ${status.practicedMinutes} minutes today. See you tomorrow!`,
      );
      await user.markDailyGoalNotified(dateKey, "COMPLETE");
      return;
    }

    const hour = now.getHours();

    if (hour >= 20 && status.canSendIncomplete && status.remainingMinutes > 0) {
      await fireNotification(
        "Keep your streak alive",
        `You're ${status.remainingMinutes} minutes away from your daily goal - jump back in and finish strong!`,
      );
      await user.markDailyGoalNotified(dateKey, "INCOMPLETE");
    }
  } catch {
    // Fail quietly; this should never block the app shell.
  }
}
