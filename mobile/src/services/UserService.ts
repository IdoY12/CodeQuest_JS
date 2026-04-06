import axios from "axios";
import AuthAware from "@/services/AuthAware";
import type AvatarPatchResponse from "@/models/AvatarPatchResponse";
import type AvatarPresignedUrl from "@/models/AvatarPresignedUrl";
import type ChangePasswordResponse from "@/models/ChangePasswordResponse";
import type DailyGoalStatus from "@/models/DailyGoalStatus";
import type OnboardingResponse from "@/models/OnboardingResponse";
import type PracticeLogResponse from "@/models/PracticeLogResponse";
import type ProgressSummary from "@/models/ProgressSummary";
import type UserPreferences from "@/models/UserPreferences";
import type UserPreferencesGet from "@/models/UserPreferencesGet";
import type AuthMeResponse from "@/models/AuthMeResponse";
import type UserProfile from "@/models/UserProfile";

export default class UserService extends AuthAware {
  constructor(jwt: string) {
    super(jwt);
  }

  async getMe(): Promise<AuthMeResponse> {
    const { data } = await this.axiosInstance.get<AuthMeResponse>("/auth/me");
    return data;
  }

  async logout(refreshToken: string): Promise<{ ok: boolean }> {
    const { data } = await this.axiosInstance.post<{ ok: boolean }>("/auth/logout", { refreshToken });
    return data;
  }

  async getProfile(): Promise<UserProfile> {
    const { data } = await this.axiosInstance.get<UserProfile>("/user/profile");
    return data;
  }

  async patchUsername(username: string): Promise<UserProfile> {
    const { data } = await this.axiosInstance.patch<UserProfile>("/user/profile", { username });
    return data;
  }

  async patchPreferences(body: {
    goal: string;
    experienceLevel: string;
    dailyCommitmentMinutes: number;
    notificationsEnabled: boolean;
  }): Promise<UserPreferences> {
    const { data } = await this.axiosInstance.patch<UserPreferences>("/user/preferences", body);
    return data;
  }

  async getPreferencesGet(): Promise<UserPreferencesGet> {
    const { data } = await this.axiosInstance.get<UserPreferencesGet>("/user/preferences");
    return data;
  }

  async getProgressSummary(): Promise<ProgressSummary> {
    const { data } = await this.axiosInstance.get<ProgressSummary>("/user/progress-summary");
    return data;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<ChangePasswordResponse> {
    const { data } = await this.axiosInstance.post<ChangePasswordResponse>("/user/change-password", {
      currentPassword,
      newPassword,
    });
    return data;
  }

  async deleteAccount(): Promise<void> {
    await this.axiosInstance.delete("/user/account", { data: { confirmation: "DELETE" } });
  }

  async patchAvatar(avatarUrl: string): Promise<AvatarPatchResponse> {
    const { data } = await this.axiosInstance.patch<AvatarPatchResponse>("/user/avatar", { avatarUrl });
    return data;
  }

  async presignAvatarUpload(contentType: string, fileSize: number): Promise<AvatarPresignedUrl> {
    const { data } = await this.axiosInstance.get<AvatarPresignedUrl>(
      `/user/avatar/presigned-url?contentType=${encodeURIComponent(contentType)}&fileSize=${fileSize}`,
    );
    return data;
  }

  async postOnboarding(
    goal: string,
    experienceLevel: string,
    dailyCommitmentMinutes: number,
  ): Promise<OnboardingResponse> {
    const { data } = await this.axiosInstance.post<OnboardingResponse>("/user/onboarding", {
      goal,
      experienceLevel,
      dailyCommitmentMinutes,
    });
    return data;
  }

  async postPracticeLog(dateKey: string, practicedSeconds: number): Promise<PracticeLogResponse> {
    const { data } = await this.axiosInstance.post<PracticeLogResponse>("/user/practice-log", {
      dateKey,
      practicedSeconds,
    });
    return data;
  }

  async readBlobFromUri(uri: string): Promise<Blob> {
    const { data } = await axios.get<Blob>(uri, { responseType: "blob" });
    return data;
  }

  async putPresignedAvatarBlob(uploadUrl: string, blob: Blob): Promise<void> {
    await axios.put(uploadUrl, blob, {
      headers: { "Content-Type": "image/jpeg" },
    });
  }

  async getDailyGoalStatus(dateKey: string): Promise<DailyGoalStatus> {
    const { data } = await this.axiosInstance.get<DailyGoalStatus>(`/user/daily-goal-status/${dateKey}`);
    return data;
  }

  async markDailyGoalNotified(dateKey: string, type: "COMPLETE" | "INCOMPLETE"): Promise<void> {
    await this.axiosInstance.post(`/user/daily-goal-status/${dateKey}/mark-notified`, { type });
  }
}
