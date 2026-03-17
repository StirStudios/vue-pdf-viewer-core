# Contrast Audit

Date: 2026-03-16  
Scope: default `light`, `dark`, and `auto` themes in `src/style.css`

## Target States

- Toolbar text and icon controls
- Buttons: default, hover, focus, disabled
- Status UI: loading and error
- Menu panel and menu item focus/hover
- Tooltip text and border

## Summary

- Default text/icon combinations in light/dark themes meet WCAG AA for normal UI text/icons in scoped controls.
- Focus-visible styling uses high-contrast ring against panel/background.
- Error styles use distinct color + role-based announcement (not color alone).

## Notes for Theme Overrides

- If consumers override tokens, they must preserve minimum contrast:
  - 4.5:1 for normal text
  - 3:1 for large text and non-text UI components/boundaries
- Highest-risk tokens for regressions:
  - `--lpv-text`
  - `--lpv-toolbar-text`
  - `--lpv-icon-color`
  - `--lpv-panel`
  - `--lpv-border`
  - `--lpv-error`

## Validation Procedure

1. Open both playgrounds in light and dark mode.
2. Capture contrast checks for target states with browser tooling.
3. Record any token override combinations that fail AA and document mitigation guidance in release notes.
