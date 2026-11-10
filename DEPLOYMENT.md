# Deployment

## Current public host

- Repository: `varunjakkampudi-tech/godavari-dairy-farm-guide`.
- Branch: `main`.
- Host: GitHub Pages via GitHub Actions workflow `.github/workflows/deploy.yml`.
- Build: `npm run build`; output `dist/`.
- Install locked development tools: `npm ci`.
- Checks: `npm test`, `npm run audit:content`, and `npm run test:e2e` (Chromium).
- Pages workflow uses the repository variable `PUBLISH_PAGES=true` and GitHub's Pages environment.

## Release procedure

1. Inspect `git status --short --untracked-files=all`, current `HEAD` and `git ls-remote origin refs/heads/main`.
2. Fetch and reconcile remote main without force-push; preserve other contributors' commits.
3. Run `npm ci`, `npm run build`, `npm test`, `npm run audit:content`, `npm run test:e2e`, and `git diff --check` locally. Install Chromium with `npx playwright install chromium` if needed.
4. Review generated files and the complete diff, especially generated pages/search index and the static `dist/` artifact contents.
5. Commit to `main` only after local checks pass; push only if remote HEAD is unchanged/reconciled.
6. Verify GitHub Actions for the exact pushed SHA, including build/test, Pages deployment, and post-deploy route/asset smoke. `npm run smoke:pages` requires `SITE_URL` at the deployed Pages root.
7. Check the live route and critical changed interactions. A green build is not proof of a complete farm guide.

## Rollback

Do not rewrite public history or force-push. Revert a faulty commit on `main`, run checks, and verify the new Pages deployment. Keep user data in the local browser separate from deployed static assets.
