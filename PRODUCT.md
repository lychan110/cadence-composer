# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

General invite and card makers — anyone who needs HTML-based invitations, announcements, or card-style messages with per-recipient personalization. The tool is public and makes no assumption of technical skill: it is aimed at people who want the output to look like a designed invite, not a spreadsheet mail merge. No accounts, no onboarding funnel; a visitor lands, composes, renders, downloads.

## Product Purpose

Cadence is a single-page composer for HTML invite and card templates. A user assembles reusable blocks containing `{{tag}}` placeholders, registers an image pool, previews the result live, optionally uploads a CSV to render personalized copies per row, and exports raw HTML, a zip of HTML files, or per-row print output. The purpose is to let one well-crafted template become many finished invites without touching a design tool or an email platform.

## Positioning

Template reuse across events is the core mechanism. A finished composition serializes to a single `.cadence.json` file that can be re-uploaded and resumed; the same template can be re-tagged, re-mapped to new CSV data, and re-rendered for the next occasion. What a generic HTML editor cannot truthfully copy: a durable, data-parameterized template asset that survives the event and gets reused, plus a batch render path that turns an arbitrary CSV into personalized output with row-level error reporting.

## Operating Context

- Fully static single-page app deployed to GitHub Pages; no backend, no server logic, no cloud persistence.
- Everything runs client-side in the browser; nothing is uploaded anywhere.
- Users bring their own assets: images by URL or base64, and CSV files with arbitrary columns.
- Save/resume is the primary persistence loop: download `.cadence.json`, re-upload later to restore state. Base64 images are excluded from save by default (opt-in with a size confirmation) because they bloat the JSON.
- PDF export is intentionally manual: per-row `window.print()` opening the browser print dialog — not batch PDF.

## Capabilities and Constraints

- Block composer with add/reorder/delete; reorder via up/down controls, no drag-drop.
- Tag registry auto-extracted from block text on every edit; drives CSV column mapping.
- Image pool of labeled entries (`url` or `base64`), hard-capped at 20 entries / 10MB total in-memory; live counter in the UI.
- Live preview pane; all rendered HTML passes through DOMPurify, including substituted CSV values — no unsanitized `innerHTML`.
- CSV upload parsed with Papa Parse; mandatory column-to-tag mapping UI with detected headers, exact-match suggestions, and warnings for required/unmapped tags.
- Batch render per CSV row with row-level error reporting: a failed row returns an error reason, never silent blank output.
- Export: single-row HTML blob download, batch zip via JSZip (`row-{index}.html`), per-row print. No batch PDF in v1.
- Saved JSON carries a version field; state is validated before hydration.
- Constraint: static-only deployment (GitHub Pages), Vite `base: '/cadence-composer/'` for asset paths.

## Brand Commitments

- Name: **Cadence** — the rhythmic flow that ties a composition together; musical, accessible, and descriptive of composing a piece, setting its rhythm and structure, then iterating.
- No invented claims: there are no testimonials, customers, benchmarks, pricing, or deployment commitments to preserve.

## Evidence on Hand

- `README.md` — product summary and scripts.
- `DESIGN.md` — full visual design system (warm literary minimalism; see the design record for tokens, typography, motion).
- `docs/plans/2026-08-01-composer-cadence.md` — original product plan with core flows, repo layout, deployment, and adversarial-review resolutions.
- `docs/plans/2026-08-01-next-pass.md` — batch render/export pipeline, image resolution, save/load, a11y gaps.
- `docs/audits/2026-08-01-cadence-composer-consolidated-ux-audit.md` — consolidated UX audit.
- Absent: no user research, no testimonials, no real usage data. Future work must not fabricate these.

## Product Principles

1. **The template is the asset.** Composition survives the event; save/resume and re-render for the next occasion are first-class, not export afterthoughts.
2. **Batch without blindness.** Every rendered row is verifiable — row-level errors are surfaced with reasons, never swallowed into blank output.
3. **No backend, no lock-in.** Static, client-side, file-based persistence: the user owns their JSON, CSV, and HTML. Nothing is uploaded, nothing requires an account.
4. **Sanitize everything.** All rendered HTML — including substituted CSV values and image sources — passes through DOMPurify before it touches the DOM.
5. **Manual where honesty demands it.** Print-per-row is labeled as manual; the tool never presents a browser print dialog as batch PDF.

## Accessibility & Inclusion

- Keyboard-operable composer: up/down reorder controls with `aria-label` and Enter/Space handling.
- `aria-live` region announcing block reorder events.
- Focus management in the CSV mapping UI (first mapping select focused after upload).
- Design system targets WCAG AA (4.5:1 minimum contrast) and respects `prefers-reduced-motion` and `prefers-color-scheme`.
