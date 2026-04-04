import { AuthAware } from "@/services/AuthAware";
import type AvatarPatchResponse from "@/models/AvatarPatchResponse";
import type AvatarPresignedUrl from "@/models/AvatarPresignedUrl";
import type ChangePasswordResponse from "@/models/ChangePasswordResponse";
import type DailyGoalStatus from "@/models/DailyGoalStatus";
import type OnboardingResponse from "@/models/OnboardingResponse";
import type PracticeLogResponse from "@/models/PracticeLogResponse";
import type ProgressSummary from "@/models/ProgressSummary";
import type UserPreferences from "@/models/UserPreferences";
import type UserPreferencesGet from "@/models/UserPreferencesGet";
import type UserProfile from "@/models/UserProfile";

export default class UserService extends AuthAware {
  getProfile() {
    return this.getJson<UserProfile>("/user/profile");
  }
  patchUsername(username: string) {
    return this.patchJson<UserProfile>("/user/profile", { username });
  }
  patchPreferences(body: {
    goal: string;
    experienceLevel: string;
    dailyCommitmentMinutes: number;
    notificationsEnabled: boolean;
  }) {
    return this.patchJson<UserPreferences>("/user/preferences", body);
  }
  getPreferencesGet() {
    return this.getJson<UserPreferencesGet>("/user/preferences");
  }
  getProgressSummary() {
    return this.getJson<ProgressSummary>("/user/progress-summary");
  }
  changePassword(currentPassword: string, newPassword: string) {
    return this.postJson<ChangePasswordResponse>("/user/change-password", { currentPassword, newPassword });
  }
  deleteAccount() {
    return this.deleteJson<void>("/user/account", { confirmation: "DELETE" });
  }
  patchAvatar(avatarUrl: string) {
    return this.patchJson<AvatarPatchResponse>("/user/avatar", { avatarUrl });
  }
  presignAvatarUpload(contentType: string, fileSize: number) {
    return this.getJson<AvatarPresignedUrl>(
      `/user/avatar/presigned-url?contentType=${encodeURIComponent(contentType)}&fileSize=${fileSize}`,
    );
  }
  postOnboarding(goal: string, experienceLevel: string, dailyCommitmentMinutes: number) {
    return this.postJson<OnboardingResponse>("/user/onboarding", { goal, experienceLevel, dailyCommitmentMinutes });
  }
  postPracticeLog(dateKey: string, practicedSeconds: number) {
    return this.postJson<PracticeLogResponse>("/user/practice-log", { dateKey, practicedSeconds });
  }
  async tryPostPracticeLog(seconds: number): Promise<boolean> {
    try {
      await this.postPracticeLog(new Date().toLocaleDateString("en-CA"), seconds);
      return true;
    } catch {
      return false;
    }
  }
  readBlobFromUri(uri: string) {
    return this.getBlobFromUri(uri);
  }
  putPresignedAvatarBlob(uploadUrl: string, blob: Blob) {
    return this.putBinaryToUrl(uploadUrl, blob, "image/jpeg");
  }
  getDailyGoalStatus(dateKey: string) {
    return this.getJson<DailyGoalStatus>(`/user/daily-goal-status/${dateKey}`);
  }
  markDailyGoalNotified(dateKey: string, type: "COMPLETE" | "INCOMPLETE") {
    return this.postJson<unknown>(`/user/daily-goal-status/${dateKey}/mark-notified`, { type });
  }
}
