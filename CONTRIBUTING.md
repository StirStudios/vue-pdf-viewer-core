# Contributing

Thanks for contributing to `vue-pdf-viewer-core`.

## Local Setup

```bash
npm install
npm run dev
```

Useful checks before opening a PR:

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run smoke
```

## Project Areas

- Library source: `src/`
- Nuxt integration: `src/nuxt/`
- Unit tests: `tests/`
- Example apps: `playground/`, `playground-nuxt/`

## Pull Requests

- Keep PRs focused and small when possible.
- Include a clear summary of user-facing behavior changes.
- Add screenshots/GIFs for UI or toolbar changes.
- Add or update tests for behavior changes.
- For viewer/toolbar/style changes, run accessibility checks:
  - `npm run test:a11y`
  - keyboard-only validation for impacted flows
  - screen reader spot-check (VoiceOver or NVDA)
- Ensure CI passes before requesting review.

## Commit Messages

Use short, imperative messages. Prefixes are recommended when relevant, for example:

- `feat: add ...`
- `fix: handle ...`
- `docs: update ...`
- `chore: ...`

## Performance and UX Expectations

- Preserve zero-config usage for Vue 3 and Nuxt 4.
- Avoid changes that add required manual worker setup.
- For rendering changes, prefer measurable improvements and include tests.
