import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";
import tsconfig from "./tsconfig.app.json";

const alias = Object.fromEntries(
  Object.entries(tsconfig.compilerOptions.paths).map(([key, [value]]) => [
    key.replace("/*", ""),
    path.resolve(__dirname, value.replace("/*", "")),
  ]),
);

// https://vite.dev/config/
export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    alias,
    setupFiles: ["./src/tests/setup.ts", "./src/tests/__mocks__/store.ts"],
    coverage: {
      provider: "v8",
      exclude: [
        "./src/vite-env.d.ts",
        "./eslint.config.js",
        "./global.d.ts",
        "./vite.config.ts",
      ],
    },
  },
  server: {
    host: "127.0.0.1",
  },
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      "@styles": path.resolve(__dirname, "src/styles"),
    },
  },
  css: {
    modules: {
      localsConvention: "camelCase",
      generateScopedName: "[local]",
    },
    preprocessorOptions: {
      scss: {
        quietDeps: true,
      },
    },
  },
});
