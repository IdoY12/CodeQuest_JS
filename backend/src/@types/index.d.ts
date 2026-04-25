/**
 * Ambient / global typings for the backend.
 * Shared request shapes and config interfaces use explicit modules: `./auth.ts`, `./config.ts`.
 */
import "express-serve-static-core";

declare module "express-serve-static-core" {
  interface Request {
    validatedParams?: unknown;
    validatedQuery?: unknown;
    validatedBody?: unknown;
  }
}

export {};
