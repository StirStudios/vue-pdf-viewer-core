# CLAUDE.md

@AGENTS.md

## Claude Code notes

- `AGENTS.md` is the single source of truth for project rules and is shared with Codex. Add or change project rules there, not here. Keep this file for Claude-specific notes only.
- This package publishes both a framework-agnostic Vue 3 library and a Nuxt 4 module; keep core viewer logic in `src/components/` and `src/` framework-agnostic, and Nuxt-only integration isolated to `src/nuxt/`.
- Commit and push changes to the current branch by default once they're complete. Hold off and let the user review first only when actively debugging/fixing something they want to inspect, or during POC/exploratory work — ask before committing in those cases. Still never open PRs, force-push, or push to `main` without being asked.
