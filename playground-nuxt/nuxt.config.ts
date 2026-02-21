import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  modules: ["vue-pdf-viewer-core/nuxt"],
  app: {
    baseURL: "/vue-pdf-viewer-core/nuxt/",
  },
  nitro: {
    preset: "github-pages",
  },
  devtools: { enabled: false },
});
