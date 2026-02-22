# vue-pdf-viewer-core

[![CI](https://github.com/StirStudios/vue-pdf-viewer-core/actions/workflows/ci.yml/badge.svg)](https://github.com/StirStudios/vue-pdf-viewer-core/actions/workflows/ci.yml)
[![Playground Deploy](https://github.com/StirStudios/vue-pdf-viewer-core/actions/workflows/deploy-playground.yml/badge.svg)](https://stirstudios.github.io/vue-pdf-viewer-core/playground/)
[![Nuxt Playground Deploy](https://github.com/StirStudios/vue-pdf-viewer-core/actions/workflows/deploy-playground-nuxt.yml/badge.svg)](https://stirstudios.github.io/vue-pdf-viewer-core/nuxt/)

Fast, lightweight PDF viewer component for Vue 3 and Nuxt 4 powered by pdf.js. Built for zero-config setup, strong performance on large PDFs, and clean TypeScript support.

Use this package when you need a Vue PDF viewer with toolbar controls, virtualization, zoom, pagination, download, print, and Nuxt compatibility.

## Features

- Virtualized page rendering
- Zoom in/out and fit-to-width
- Pagination controls
- Download and print
- Fullscreen toggle
- Polished compact toolbar and status UI
- Light and dark mode support
- TypeScript-first API

## Install

| Package Manager  | Command                                   |
| ---------------- | ----------------------------------------- |
| pnpm (preferred) | `pnpm add vue-pdf-viewer-core pdfjs-dist` |
| npm              | `npm i vue-pdf-viewer-core pdfjs-dist`    |
| yarn             | `yarn add vue-pdf-viewer-core pdfjs-dist` |
| bun              | `bun add vue-pdf-viewer-core pdfjs-dist`  |

## 60-Second Quick Start (Vue 3)

```vue
<script setup lang="ts">
import { PdfViewer } from "vue-pdf-viewer-core";
import "vue-pdf-viewer-core/style.css";

const pdfUrl = "https://example.com/my.pdf";
</script>

<template>
  <PdfViewer :src="pdfUrl" />
</template>
```

## 60-Second Quick Start (Nuxt 4)

Recommended for Nuxt: enable the Nuxt module so component registration and base CSS are handled automatically.

1. Add the module:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ["vue-pdf-viewer-core/nuxt"],
});
```

2. Use the globally registered component:

```vue
<script setup lang="ts">
const pdfUrl = "https://example.com/my.pdf";
</script>

<template>
  <PdfViewer :src="pdfUrl" />
</template>
```

Alternative (without Nuxt module): direct component import and manual CSS import.

```vue
<script setup lang="ts">
import { PdfViewer as CorePdfViewer } from "vue-pdf-viewer-core";
import "vue-pdf-viewer-core/style.css";
const pdfUrl = "https://example.com/my.pdf";
</script>

<template>
  <CorePdfViewer :src="pdfUrl" />
</template>
```

`fitToWidth`, `showToolbar`, `withCredentials`, and `theme` already have defaults in `PdfViewer`, so you only need to pass them when overriding behavior.

If you wrap the viewer inside a Nuxt layer component, prefer forwarding `useAttrs()` (instead of re-declaring all props) so core defaults stay intact:

```vue
<script setup lang="ts">
import { useAttrs } from "vue";
import type { PdfViewerProps } from "vue-pdf-viewer-core";

const attrs = useAttrs() as Partial<PdfViewerProps>;
</script>

<template>
  <PdfViewer v-bind="attrs" />
</template>
```

## Why This Library

- Works out of the box in Vue 3 and Nuxt 4.
- Uses pdf.js with a built-in worker path (no manual worker wiring needed).
- Keeps rendering fast on large documents with virtual windowing.
- Ships typed components for TypeScript projects.

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
- `theme` (`"auto"`) accepts `"auto" | "light" | "dark"`

## Events

- `page-change` (page number)
- `load-error` (error)
- `action-error` (error)

## Theming

Set theme mode directly via prop:

```vue
<PdfViewer :src="pdfUrl" theme="dark" />
```

Use `theme="auto"` (default) to follow your app-level `.dark` class, or override CSS variables to match your app theme:

```css
:root {
  --lpv-bg: #f6f6f6;
  --lpv-panel: #e9e9e9;
  --lpv-border: #d1d1d1;
  --lpv-text: #1f1f1f;
}
```

The default UI is intentionally compact and refined; CSS variables let you re-skin colors and contrast to match your brand.

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

- Vite playground: https://stirstudios.github.io/vue-pdf-viewer-core/playground/
- Nuxt playground: https://stirstudios.github.io/vue-pdf-viewer-core/nuxt/

## Troubleshooting (Nuxt / SSR)

- If you see `window is not defined`, render the viewer in `<ClientOnly>`.
- If styles are missing, ensure `import 'vue-pdf-viewer-core/style.css'` is loaded.
- If a Nuxt layer wrapper uses `defineProps()` and forwards `v-bind="props"`, boolean props can be coerced and override core defaults. Prefer `useAttrs()` pass-through wrappers when you want PdfViewer defaults preserved.
- If PDFs require auth cookies, pass `:with-credentials="true"`.

## Project Docs

- Contributing: [`CONTRIBUTING.md`](./CONTRIBUTING.md)
- Code of Conduct: [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md)
- Security: [`SECURITY.md`](./SECURITY.md)

## License

MIT
