import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isReplit = !!process.env.REPL_ID;
const port = Number(process.env.PORT) || 3000;
const basePath = process.env.BASE_PATH || "/";

const suppressSourcemapWarnings = {
  name: "suppress-sourcemap-warnings",
  enforce: "pre" as const,
  configResolved(config: { logger: { warn: (...args: unknown[]) => void } }) {
    const original = config.logger.warn.bind(config.logger);
    config.logger.warn = (msg: unknown, ...args: unknown[]) => {
      if (
        typeof msg === "string" &&
        msg.includes("Can't resolve original location of error")
      )
        return;
      original(msg, ...args);
    };
  },
};

const replitPlugins = isReplit
  ? await Promise.all([
      import("@replit/vite-plugin-runtime-error-modal").then((m) =>
        m.default()
      ),
      import("@replit/vite-plugin-cartographer").then((m) =>
        m.cartographer({ root: path.resolve(__dirname, "..") })
      ),
      import("@replit/vite-plugin-dev-banner").then((m) => m.devBanner()),
    ])
  : [];

export default defineConfig({
  base: basePath,
  plugins: [suppressSourcemapWarnings, react(), tailwindcss(), ...replitPlugins],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(__dirname),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === "SOURCEMAP_ERROR") return;
        warn(warning);
      },
    },
  },
  server: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
