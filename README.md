# Cadence

Standalone HTML template composer for invite and card-style messages.

- Compose templates from composable blocks with `{{tag}}` placeholders.
- Add labeled images by URL or base64.
- Preview live in the side pane.
- Upload a CSV whose column names match your `{{tags}}`; map columns to tags; render and download batch HTML or print-per-row.
- Save the template as `.cadence.json`; reupload to resume instantly.
- Deployed automatically to GitHub Pages from `main`.

## Scripts

- `pnpm dev` — local dev server
- `pnpm build` — production build to `dist/`
- `pnpm test` — vitest
