/**
 * Resolves Socket.IO CORS options from node-config (`io.cors.*`).
 *
 * Responsibility: share identical origin parsing between backend preview and io service.
 * Layer: @project/server-kit/cors
 * Depends on: parseCommaSeparatedOrigin.ts, config package
 * Consumers: io/src/index.ts
 */

import config from "config";
import { parseCommaSeparatedOrigin } from "./parseCommaSeparatedOrigin.js";

export function resolveSocketIoCors(): { origin: string | string[]; methods: string[] } {
  const raw = config.get<string>("io.cors.origin");

  return {
    origin: parseCommaSeparatedOrigin(raw),
    methods: config.get<string[]>("io.cors.methods"),
  };
}
