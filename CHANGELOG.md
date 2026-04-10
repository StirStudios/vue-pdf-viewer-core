# Changelog

## 0.3.0

- Accessibility hardening for core viewer + toolbar flows toward best-effort WCAG 2.1/2.2 AA.
- Added semantic/ARIA improvements, keyboard menu Escape handling, focus return, and live-region announcements.
- Unified toolbar/dropdown theme surface tokens and fixed dark-mode dropdown text inheritance.
- Added automated accessibility regression checks (`test:a11y`) and contrast regression checks (`test:contrast`) in CI.
- Added accessibility baseline, keyboard matrix, screen reader matrix, and contrast audit docs.
- Updated README and contribution guidance with accessibility scope, checks, and certification caveats.

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
