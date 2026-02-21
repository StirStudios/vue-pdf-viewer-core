# Release Checklist

1. Update `CHANGELOG.md` with notable changes.
2. Ensure `README.md` examples are accurate.
3. Run:
   - `npm run lint`
   - `npm run typecheck`
   - `npm run build`
4. Build playgrounds:
   - `npm -C playground run build`
   - `npm -C playground-nuxt run build`
5. Run publish dry-run:
   - `npm run publish:check`
6. Bump version in `package.json`.
7. Publish:
   - `npm publish --access public`
8. Tag release in git:
   - `git tag vX.Y.Z` and `git push --tags`
9. Verify GitHub Pages deploy for playgrounds.
