/**
 * Typed HTTP client for the REST API using axios (no global fetch).
 *
 * Responsibility: JSON requests, bearer auth, logging, and ApiError on failure.
 * Layer: mobile services
 * Depends on: axios, API_BASE_URL, logger
 * Consumers: hooks, screens, utils that call the backend
 */

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
    if (typeof err === "string") {
      message = err;
    } else if (err !== undefined) {
      message = JSON.stringify(err);
    }
  } else if (typeof data === "string" && data.trim()) {
    message = data;
  }
  return message;
}

export async function apiRequest<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const method = (options.method ?? "GET").toUpperCase();
  const url = `${API_BASE_URL}${path}`;
  const startedAt = Date.now();
  const bodyForLog =
    typeof options.body === "string"
      ? options.body
      : options.body
        ? JSON.stringify(options.body)
        : undefined;
  if (__DEV__) {
    console.log(`[Request] URL: ${url} | Method: ${method} | Body: ${bodyForLog ?? "<empty>"}`);
  }
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
      if (__DEV__) {
        console.log(`[Response] Status: ${response.status} | Data:`, response.data);
      }
      logApi("request:fail", {
        method,
        path,
        url,
        status: response.status,
        durationMs: Date.now() - startedAt,
        message,
      });
      throw new ApiError(message, response.status);
    }

    if (response.status === 204) {
      return undefined as T;
    }
    const rawContentLength = response.headers["content-length"];
    if (rawContentLength === "0") {
      return undefined as T;
    }

    const data = response.data as T;
    if (__DEV__) {
      console.log(`[Response] Status: ${response.status} | Data:`, data);
    }
    logApi("request:success", {
      method,
      path,
      url,
      status: response.status,
      durationMs: Date.now() - startedAt,
    });
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (__DEV__) {
      console.log("[Error] Full Error Object:", error);
    }
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
