#!/usr/bin/env bash
set -euo pipefail

VERSION="${1:-}"
if [[ -z "$VERSION" ]]; then
  echo "Usage: scripts/release-notes.sh vX.Y.Z"
  exit 1
fi

if [[ ! -f CHANGELOG.md ]]; then
  echo "CHANGELOG.md not found"
  exit 1
fi

awk -v version="${VERSION#v}" '
  BEGIN { in_section=0 }
  $0 ~ "^## "version"" { in_section=1; next }
  /^## / { if (in_section) exit }
  { if (in_section) print }
' CHANGELOG.md
