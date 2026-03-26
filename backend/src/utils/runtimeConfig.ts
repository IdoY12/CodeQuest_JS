import config from "config";

/**
 * Express `cors` package: comma-separated origins become an allow-list.
 */
export function resolveExpressCorsOrigin(): string | string[] {
  const raw = config.get<string>("app.cors.origin");
  if (!raw.includes(",")) {
    return raw;
  }
  return raw
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

export function resolveSocketIoCors(): { origin: string | string[]; methods: string[] } {
  const raw = config.get<string>("io.cors.origin");
  const origin = raw.includes(",")
    ? raw
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean)
    : raw;
  return {
    origin,
    methods: config.get<string[]>("io.cors.methods"),
  };
}
