# Accessibility Baseline Report

Date: 2026-03-16  
Scope: `src/components/PdfViewer.vue`, `src/components/PdfToolbar.vue`, `src/style.css`, playground usage paths

## Automated

- Unit a11y checks (`axe` via Vitest): `npm run test:a11y`
- CI regression step: `.github/workflows/ci.yml` and `ci-pnpm.yml`
- Lighthouse (manual run in playgrounds): pending artifact capture per release

## Manual

- Keyboard-only interaction audit: see `docs/accessibility/keyboard-matrix.md`
- Screen reader audit (VoiceOver + NVDA): see `docs/accessibility/screen-reader-matrix.md`
- Contrast audit (light, dark, auto): see `docs/accessibility/contrast-audit.md`

## Findings Summary

- Critical: 0 open (within current scoped flows)
- Serious: 0 open (within current scoped flows)
- Moderate/Minor: documented limitations and follow-ups in matrices/reports

## Known Limitations

- PDF page canvas output is visual; semantic text extraction is not currently exposed as accessible document structure.
- External legal/certification claims require third-party accessibility audit.

## Repro Commands

```bash
npm run lint
npm run typecheck
npm test
npm run test:a11y
```
