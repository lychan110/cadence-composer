# Cadence — InviteFlow Standalone Composer

**Date:** 2026-08-01  
**Status:** revised draft  
**Goal:** Single-page React app that lets users compose HTML templates from blocks, inject tagged image pools, preview live, bulk-render from an arbitrary CSV, and export raw HTML or PDF. Template state serializes to a single JSON file for save/resume. Deployed as static files on GitHub Pages.

**Repo name:** `cadence-composer`  
**Short name:** Cadence  
**Name rationale:** Cadence is the rhythmic flow that ties a composition together. It's accessible, musical, and describes what the tool actually does: users compose a piece, set its rhythm and structure, then iterate.

## Core flows

1. **Composer** — Add/reorder/delete blocks. Each block is an HTML snippet containing `{{tag}}` placeholders. Reorder via up/down controls; no drag-drop dependency.
2. **Tag registry** — Auto-extracted from block text on every edit, or manually maintained. Drives later CSV mapping.
3. **Image pool** — Labeled entries `{id, label, sourceType: 'url' | 'base64', data?}`. Unlimited count in UI, but hard-cap at 20 entries / 10MB total in-memory. Base64 kept in React state only; warn on entry and block save if approaching limit.
4. **Live preview** — Right pane. Renders blocks with image sources resolved. Unmapped tags stay as `{{tag}}` literal placeholders. All rendered HTML passes through DOMPurify.
5. **CSV upload + mapping** — Papa Parse via npm. User maps uploaded CSV columns to tags. No fixed schema; mapping UI is mandatory. Show detected headers, exact-match suggestions, and required/unmapped tag warnings.
6. **Batch render** — Per CSV row, substitute `{{tag}}` values into blocks, resolve images, emit complete HTML strings. Row-level error reporting: failed rows return error reason, not silent blank output.
7. **Export**
   - Raw HTML: blob download per rendered row, or zip via `JSZip` for batch.
   - PDF: `@media print` CSS + `window.print()` as the **manual per-row path**. Explicitly label this as manual. Do not present it as batch. Canvas-based PDF (`jsPDF` + `html2canvas`) is v2 if needed.
8. **Save/resume** — Serialize template config (blocks, tags, images metadata) to `.inviteflow.json`. Base64 images are **excluded by default** from save file; user opts in with a confirmation dialog showing estimated file size. Re-upload restores state. Images must be re-added or re-uploaded after resume unless user explicitly saved them inline.

## Repo layout

```
~/projects/cadence-composer/
  docs/plans/YYYY-MM-DD-composer-cadence.md
  src/
    components/
      BlockComposer.jsx
      TagRegistry.jsx
      ImagePool.jsx
      CsvMapper.jsx
      Preview.jsx
      Toolbar.jsx
    lib/
      csv.js
      template.js
      pdf.js
      serialization.js
      sanitize.js
    __tests__/
      template.test.js
      csv.test.js
      serialization.test.js
    App.jsx
    main.jsx
    index.css
  index.html
  package.json
  vite.config.js
```

## Deployment

- Build `dist/` via `vite build`.
- Push to `gh-pages` branch.
- `vite.config.js` must set `base: '/cadence-composer/'` for correct asset paths on GitHub Pages.
- No backend. No server logic. No persistence beyond what the user downloads.

## Dependencies

- React + Vite.
- Papa Parse (npm).
- DOMPurify (npm).
- JSZip (npm, for batch HTML download as zip).
- State: `useReducer` sufficient.

## Out of scope for v1

- User accounts.
- Cloud storage.
- Template sharing.
- Multi-user collaboration.
- Batch PDF generation.
- Drag-drop reordering.

## Adversarial review — resolved items

| # | Issue | Resolution |
|---|-------|------------|
| 1 | Base64 images in JSON = time bomb | Excluded from save by default. Opt-in with size confirmation. |
| 2 | PDF via window.print() is not batch | Explicitly labeled manual per-row. Batch PDF moved to v2. |
| 3 | dangerouslySetInnerHTML preview = XSS | DOMPurify added. All rendered HTML sanitized, including substituted CSV values. |
| 4 | Unlimited images will crash browser | Hard cap: 20 entries, 10MB total. Live counter in UI. |
| 5 | No CSV validation or error handling | Row-level error reporting. Papa Parse handles edge cases; mapping UI shows warnings. |
| 6 | react-draggable is overkill | Up/down controls only. Zero drag-drop dependency. |
| 7 | State shape + serialization coupling | Version field in saved JSON. Validate structure before hydrate. |
| 8 | Vite base config for GitHub Pages | `base: '/cadence-composer/'` in vite.config.js. |
| 9 | No testing strategy | `__tests__/` with vitest. Template engine, CSV parsing, serialization round-trip. |
| 10 | Component count vs simplicity | 6 components retained; props via context to reduce drilling. |
| 11 | Papa Parse via CDN vs npm | npm. |
| 12 | No accessibility plan | ARIA labels, keyboard handlers for block reorder, focus management in mapping UI. |
