import config from "config";

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
