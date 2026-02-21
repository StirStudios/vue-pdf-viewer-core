import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: './',
  resolve: {
    alias: [
      {
        find: 'vue-pdf-viewer-core/style.css',
        replacement: resolve(__dirname, '../src/style.css'),
      },
      {
        find: 'vue-pdf-viewer-core',
        replacement: resolve(__dirname, '../src/index.ts'),
      },
    ],
  },
})
