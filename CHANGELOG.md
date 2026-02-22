# Changelog

## 0.1.4

- Fix single-page PDF layout by applying the viewer scroll min-height only while loading.
- Clarify Nuxt usage docs for module setup and layer wrappers (`useAttrs`) to preserve core defaults.
- Add regression coverage for Nuxt-layer wrapper forwarding behavior.

## 0.1.3

- Fix modal canvas render race in `PdfViewer` by queueing pages until canvas refs mount.
- Harden toolbar and icon colors with dedicated CSS variables for better theme consistency.

## 0.1.0

- Initial release of `vue-pdf-viewer-core`.
- Vue 3 component with zoom, paging, download, print, fullscreen, and virtualization.
- Nuxt 4 module entry.
- Vite playground.
