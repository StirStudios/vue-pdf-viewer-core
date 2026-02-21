#!/usr/bin/env bash
set -euo pipefail

if ! command -v gh >/dev/null 2>&1; then
  echo "gh CLI not found. Install with: brew install gh"
  exit 1
fi

if [[ -z "${1:-}" ]]; then
  echo "Usage: scripts/release.sh vX.Y.Z"
  exit 1
fi

VERSION="$1"

npm run lint
npm run typecheck
npm run build
npm -C playground run build
npm -C playground-nuxt run build

git tag "$VERSION"
git push origin "$VERSION"

RELEASE_NOTES=$(bash scripts/release-notes.sh "$VERSION")

if [[ -z "$RELEASE_NOTES" ]]; then
  RELEASE_NOTES="Release $VERSION"
fi

gh release create "$VERSION" --title "$VERSION" --notes "$RELEASE_NOTES"
