/** Excluded from dead-code analysis; Vitest still treats them as entry files via its plugin. */
const testFiles = "**/*.{test,spec}.{ts,tsx}";

const prismaSchemaEntry = "../packages/db/prisma/schema.prisma";

export default {
  ignore: [testFiles],
  ignoreFiles: [
    testFiles,
    "**/prisma/migrations/**",
    "**/node_modules/.prisma/**",
    "**/.expo/**",
    "**/web-build/**",
    "**/expo-env.d.ts",
    "**/dist/**",
  ],

  workspaces: {
    ".": {
      entry: [],
      project: [],
      expo: false,
    },

    backend: {
      project: ["src/**/*.ts", "prisma/seed/**/*.ts"],
      prisma: {
        entry: [prismaSchemaEntry],
      },
    },

    io: {
      project: ["src/**/*.ts"],
      prisma: {
        entry: [prismaSchemaEntry],
      },
    },

    mobile: {
      project: ["index.ts", "src/**/*.{ts,tsx}"],
      paths: {
        "@/*": ["./src/*"],
      },
    },

    "packages/db": {
      project: ["src/**/*.ts"],
      prisma: {
        entry: ["prisma/schema.prisma"],
      },
    },

    "packages/auth-jwt": {
      project: ["src/**/*.ts"],
    },

    "packages/server-kit": {
      project: ["src/**/*.ts"],
    },

    "packages/*": {
      project: ["src/**/*.ts"],
    },
  },
};
