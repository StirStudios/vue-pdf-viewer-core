# Repository Guidelines

## Project Structure & Module Organization

- `src/components/` contains Vue SFCs (`PdfViewer.vue`, `PdfToolbar.vue`, `Icon.vue`).
- `src/nuxt/` contains Nuxt module/runtime integration.
- `src/index.ts`, `src/types.ts`, and `src/style.css` define public exports and shared styles/types.
- Unit tests are in `tests/` (`*.spec.ts`) with shared test setup in `tests/setup.ts`.
- Build output goes to `dist/` (do not edit generated files).
- Example apps live in `playground/` (Vite) and `playground-nuxt/` (Nuxt 4).
- Release/publish helpers live in `scripts/`; supplementary docs are in `docs/`.

## Build, Test, and Development Commands

- `npm run dev`: run local Vite dev server.
- `npm run build`: build library bundle and Nuxt module output into `dist/`.
- `npm run lint`: run ESLint across TS/Vue files.
- `npm run typecheck`: run `vue-tsc --noEmit`.
- `npm test`: run Vitest once in `jsdom`.
- `npm -C playground run dev` / `npm -C playground-nuxt run dev`: run example apps.

## Coding Style & Naming Conventions

- Use TypeScript + Vue 3 Composition API with `<script setup lang="ts">`.
- Follow ESLint flat config in `eslint.config.js` (Vue + TypeScript recommended rules).
- Use 2-space indentation and keep imports/exports explicit.
- Vue component files use PascalCase (for example, `PdfViewer.vue`).
- Tests should mirror component/module names (for example, `PdfViewer.spec.ts`).

## Nuxt 4 & Vue 3 Best Practices

- Keep browser-only logic guarded (`import.meta.client`) and avoid unguarded `window`/`document` access in shared code.
- In Nuxt usage, render viewer components in client context when needed (`<ClientOnly>`).
- Keep Nuxt integration code isolated to `src/nuxt/`; keep core viewer logic framework-agnostic in `src/components/` and `src/`.
- Use strongly typed props/emits/public APIs; avoid `any` in exported types.
- Preserve accessibility for toolbar controls: labels, keyboard operability, and predictable focus order.
- Protect performance-sensitive behavior (virtualized rendering, zoom/page updates) with targeted tests when changing logic.

## Testing Guidelines

- Framework: Vitest with `@vue/test-utils` and `jsdom`.
- Add/update tests for viewer rendering, toolbar actions, and emitted events.
- Keep mocks and polyfills in `tests/setup.ts`; avoid duplicating setup inside test files.
- Run `npm run lint && npm run typecheck && npm test` before opening a PR.

## Commit & Pull Request Guidelines

- Use short, imperative commit messages; scoped prefixes are preferred (for example, `docs: add full GitHub Pages URLs`).
- Keep commits focused and logically grouped.
- PRs should include a clear summary, linked issue/context (when applicable), visual proof for UI changes, and confirmation that lint, typecheck, build, and tests pass locally.
