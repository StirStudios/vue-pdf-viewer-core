import { resolve } from 'node:path'
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: [resolve(__dirname, '../src/nuxt/module.ts')],
  css: [resolve(__dirname, '../src/style.css')],
  app: {
    baseURL: '/vue-pdf-viewer-core/nuxt/',
  },
  nitro: {
    preset: 'github-pages',
  },
  devtools: { enabled: false },
})
