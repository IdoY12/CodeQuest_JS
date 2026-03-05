const DEFAULT_API_BASE_URL = __DEV__
  ? "http://localhost:4000/api"
  : "https://api.questcodejs.com/api";
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL;

interface ApiOptions extends RequestInit {
  token?: string;
}

export async function apiRequest<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  if (!response.ok) {
    let message = "API request failed";
    try {
      const json = (await response.json()) as { error?: unknown };
      if (typeof json.error === "string") {
        message = json.error;
      } else if (json.error) {
        message = JSON.stringify(json.error);
      }
    } catch {
      const text = await response.text();
      message = text || message;
    }
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}
