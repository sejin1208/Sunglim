import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isReplit = !!process.env.REPL_ID;
const port = Number(process.env.PORT) || 3000;
const basePath = process.env.BASE_PATH || "/";

async function getPlugins() {
  const base = [react(), tailwindcss()];
  if (!isReplit) return base;
  const [errModal, cartographer, devBanner] = await Promise.all([
    import("@replit/vite-plugin-runtime-error-modal").then((m) => m.default()),
    import("@replit/vite-plugin-cartographer").then((m) =>
      m.cartographer({ root: path.resolve(__dirname, "..") })
    ),
    import("@replit/vite-plugin-dev-banner").then((m) => m.devBanner()),
  ]);
  return [...base, errModal, cartographer, devBanner];
}

export default defineConfig(async () => ({
  base: basePath,
  plugins: await getPlugins(),
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
    dedupe: ["react", "react-dom"],
  },
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
    proxy: { "/api": { target: "http://localhost:8080", changeOrigin: true } },
  },
  preview: { port, host: "0.0.0.0", allowedHosts: true },
}));
