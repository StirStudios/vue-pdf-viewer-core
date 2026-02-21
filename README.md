# vue-pdf-viewer-core

![CI](https://github.com/StirStudios/vue-pdf-viewer-core/actions/workflows/ci.yml/badge.svg)
![Playground](https://github.com/StirStudios/vue-pdf-viewer-core/actions/workflows/deploy-playground.yml/badge.svg)
![Nuxt Playground](https://github.com/StirStudios/vue-pdf-viewer-core/actions/workflows/deploy-playground-nuxt.yml/badge.svg)

Fast, lightweight PDF viewer for Vue 3 and Nuxt 4 powered by pdf.js. Built for easy setup, strong performance, and clean TypeScript.

## Features

- Virtualized page rendering
- Zoom in/out and fit-to-width
- Pagination controls
- Download and print
- Fullscreen toggle
- TypeScript-first API

## Install

```bash
npm i vue-pdf-viewer-core pdfjs-dist
```

## Vue 3 Usage

```vue
<script setup lang="ts">
import { PdfViewer } from 'vue-pdf-viewer-core'
import 'vue-pdf-viewer-core/style.css'

const pdfUrl = 'https://example.com/my.pdf'
</script>

<template>
  <PdfViewer :src="pdfUrl" />
</template>
```

## Nuxt 4 Usage

1) Add the module:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['vue-pdf-viewer-core/nuxt'],
})
```

2) Use the component with client-only rendering:

```vue
<script setup lang="ts">
const pdfUrl = 'https://example.com/my.pdf'
</script>

<template>
  <ClientOnly>
    <PdfViewer :src="pdfUrl" />
  </ClientOnly>
</template>
```

## Props

`PdfViewer` props (defaults in parentheses):

- `src` (required)
- `withCredentials` (`false`)
- `initialPage` (`1`)
- `initialScale` (`1`)
- `fitToWidth` (`true`)
- `minScale` (`0.5`)
- `maxScale` (`3`)
- `zoomStep` (`0.1`)
- `maxConcurrentRenders` (`2`)
- `virtualWindowSize` (`2`)
- `showToolbar` (`true`)

## Events

- `page-change` (page number)
- `load-error` (error)
- `action-error` (error)

## Theming

You can override CSS variables to match your app theme:

```css
:root {
  --lpv-bg: #f6f6f6;
  --lpv-panel: #e9e9e9;
  --lpv-border: #d1d1d1;
  --lpv-text: #1f1f1f;
}
```

## Playgrounds

- Vite playground: `playground/`
- Nuxt playground: `playground-nuxt/`

```bash
npm -C playground install
npm -C playground run dev

npm -C playground-nuxt install
npm -C playground-nuxt run dev
```

### GitHub Pages URLs

- Vite playground: `/vue-pdf-viewer-core/playground/`
- Nuxt playground: `/vue-pdf-viewer-core/nuxt/`

## License

MIT
