import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [
    vue(),
    {
      name: "playground-loading-endpoint",
      configureServer(server) {
        server.middlewares.use("/__loading.pdf", (_req, _res, next) => {
          // Keep the request pending so the viewer remains in loading state.
          if (server.config.command !== "serve") {
            next();
            return;
          }
        });
      },
    },
  ],
  base: "./",
  resolve: {
    alias: [
      {
        find: "vue-pdf-viewer-core/style.css",
        replacement: fileURLToPath(
          new URL("../src/style.css", import.meta.url),
        ),
      },
      {
        find: "vue-pdf-viewer-core",
        replacement: fileURLToPath(new URL("../src/index.ts", import.meta.url)),
      },
    ],
  },
});
