import axios from "axios";
import { API_BASE_URL } from "../config/network";
import { logApi } from "./logger";

export interface ApiOptions {
  method?: string;
  token?: string;
  body?: string;
  headers?: Record<string, string>;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function extractErrorMessage(data: unknown): string {
  let message = "API request failed";
  if (data && typeof data === "object" && data !== null && "error" in data) {
    const err = (data as { error?: unknown }).error;
    message = typeof err === "string" ? err : err !== undefined ? JSON.stringify(err) : message;
  } else if (typeof data === "string" && data.trim()) message = data;
  return message;
}

export async function apiRequest<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const method = (options.method ?? "GET").toUpperCase();
  const url = `${API_BASE_URL}${path}`;
  const startedAt = Date.now();
  const bodyForLog =
    typeof options.body === "string" ? options.body : options.body ? JSON.stringify(options.body) : undefined;
  if (__DEV__) console.log(`[Request] ${method} ${url} body=${bodyForLog ?? "<empty>"}`);
  logApi("request:start", { method, path, url });
  try {
    const response = await axios.request({
      url,
      method,
      data: options.body ?? undefined,
      headers: {
        "Content-Type": "application/json",
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
        ...options.headers,
      },
      validateStatus: () => true,
    });
    if (response.status < 200 || response.status >= 300) {
      const message = extractErrorMessage(response.data);
      if (__DEV__) console.log(`[Response] ${response.status}`, response.data);
      logApi("request:fail", { method, path, url, status: response.status, durationMs: Date.now() - startedAt, message });
      throw new ApiError(message, response.status);
    }
    if (response.status === 204) return undefined as T;
    if (response.headers["content-length"] === "0") return undefined as T;
    const data = response.data as T;
    if (__DEV__) console.log(`[Response] ${response.status}`, data);
    logApi("request:success", { method, path, url, status: response.status, durationMs: Date.now() - startedAt });
    return data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (__DEV__) console.log("[Error]", error);
    logApi("request:exception", {
      method,
      path,
      url,
      durationMs: Date.now() - startedAt,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}
