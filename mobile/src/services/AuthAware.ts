import axios from "axios";
import { apiRequest } from "@/services/api";

/** Domain services extend this; shared HTTP helpers stay here (via `apiRequest` + direct axios for external URLs). */
export abstract class AuthAware {
  constructor(protected getAccessToken: () => string | null) {}

  hasToken(): boolean {
    return Boolean(this.getAccessToken());
  }

  private requireToken(): string {
    const t = this.getAccessToken();
    if (!t) throw new Error("Not authenticated");
    return t;
  }

  protected getJson<T>(path: string) {
    return apiRequest<T>(path, { token: this.requireToken() });
  }

  protected postJson<T>(path: string, body: object) {
    return apiRequest<T>(path, { method: "POST", token: this.requireToken(), body: JSON.stringify(body) });
  }

  protected patchJson<T>(path: string, body: object) {
    return apiRequest<T>(path, { method: "PATCH", token: this.requireToken(), body: JSON.stringify(body) });
  }

  protected deleteJson<T>(path: string, body?: object) {
    return apiRequest<T>(path, {
      method: "DELETE",
      token: this.requireToken(),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  protected postPublicJson<T>(path: string, body: object) {
    return apiRequest<T>(path, { method: "POST", body: JSON.stringify(body) });
  }

  protected postWithOptionalAuthToken<T>(path: string, body: object, token: string | null) {
    return apiRequest<T>(path, { method: "POST", ...(token ? { token } : {}), body: JSON.stringify(body) });
  }

  protected putBinaryToUrl(url: string, blob: Blob, contentType: string) {
    return axios
      .put(url, blob, { headers: { "Content-Type": contentType }, validateStatus: () => true })
      .then((r) => r.status >= 200 && r.status < 300);
  }

  protected getBlobFromUri(uri: string) {
    return axios.get<Blob>(uri, { responseType: "blob" }).then((r) => r.data);
  }
}
