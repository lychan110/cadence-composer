# Cadence — Consolidated UX Audit
## Executive Summary
This is a functionally coherent template composer with a clear two-column desktop layout. The underlying logic — block management, CSV rendering, image pool, live preview — is sound. The problems are entirely in execution polish: the UI is built with inline styles and hardcoded values, buttons are unusably small, keyboard navigation is invisible, and the whole layout collapses on mobile with no fallback.

## Three-Word Verdict
Usable desktop, brittle everywhere else.

## Technology Stack
- **Framework:** React 19 (client-side only)
- **Build:** Vite 6
- **Routing:** None — single-page app
- **Styling:** Inline `style={{}}` on every component, global CSS in `src/index.css`
- **Design tokens:** None. No CSS custom properties, no DESIGN.md, no theme layer.
- **Dependencies:** @dnd-kit, DOMPurify, jszip, papaparse
- **Tests:** vitest, 3 test files (csv, serialization, template)

## Combined Scores (side-by-side)

| Module | ui-ux-suite | design-auditor | Browser | Notes |
|---|---|---|---|---|
| Typography | — | 100 | 100 | 1 family, 4 sizes, 3 line-heights |
| Colors | — | 75 | 75 | 6 unique, all contrast pass, 0% CSS vars |
| Spacing | — | 90 | 90 | 4px grid, rhythm unit 24px |
| Components | — | 63 | 63 | 3/3 buttons under 44px, no focus/hover |
| Reading Width | — | 50 | 50 | ~85 chars average, no optimal blocks |
| Breakpoints | 0 | 50 | 50 | 1 media query (`@media print` only) |
| Headings | — | 100 | 100 | H1 + 5 H2s, no skipped levels |
| Accessibility | 3 unlabeled inputs | — | confirmed | No skip link, no focus-visible |
| **Overall** | — | **80/100 B** | **80/100 B** | Same source of truth |

## Consolidated Findings by Category

### 🔴 Critical

**1. All buttons are under 44px touch target height — 100% failure rate**
Evidence: design-auditor JSON, `Save template` 89×19px, `Add block` 63×19px, `Add image` 616×19px. Browser console confirms `hasFocusStyle: false` on all three. No `cursor: pointer` set. No `:hover` rules in CSS.
Impact: Mouse users get cramped click targets. Touch/mobile users cannot reliably tap. WCAG 2.5.5 Target Size (AAA) and 2.5.8 Pointer Target Spacing (AA) both fail.
Fix: Add minimum `min-height: 44px`, `cursor: pointer`, `padding: 0.5rem 1rem`, and `:hover`/`:focus-visible` states. Files: `src/components/Toolbar.jsx:96-108`, `src/components/BlockComposer.jsx:46-62`, `src/components/CsvMapper.jsx:59`, `src/components/ImagePool.jsx:107`.
Effort: 30 minutes.

**2. No focus-visible styles — keyboard navigation is invisible**
Evidence: design-auditor reports "Focus states not found." Browser console: `hasFocusStyle: false` on all 8 tabbable elements. No `:focus-visible` in CSS anywhere.
Impact: Keyboard users cannot tell where focus is. WCAG 2.4.7 Focus Visible (AA) fails.
Fix: Add global `:focus-visible` rule in `src/index.css` (e.g., `outline: 2px solid #1a1a1a; outline-offset: 2px;`).
Effort: 5 minutes.

**3. Three form inputs lack associated labels**
Evidence: ui-ux-suite flags `src/components/CsvMapper.jsx:59`, `src/components/ImagePool.jsx:91`, `src/components/Toolbar.jsx:99`. DOM inspection confirms these inputs have no `<label for>`, `aria-label`, or `aria-labelledby`.
Impact: Screen-reader users cannot identify the field purpose. WCAG 3.3.2 Labels or Instructions (A) fails.
Fix: Wrap or associate `<label>` elements with matching `id` attributes, or add `aria-label`.
Effort: 15 minutes.

**4. No skip-to-content link**
Evidence: ui-ux-suite reports "Skip-to-content link: NO — add one." Browser DOM confirms no skip link element.
Impact: Keyboard users must tab through all controls before reaching main content. WCAG 2.4.1 Bypass Blocks (A) fails.
Fix: Add `<a href="#main" class="skip-link">Skip to main content</a>` and give `#root` or `<main>` an `id="main"`.
Effort: 5 minutes.

---

### 🟠 High

**5. Two-column grid collapses to single narrow column on mobile — no responsive breakpoint**
Evidence: `src/App.jsx:12` uses `style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}` with no `@media` override. The only media query in the project is `@media print` in `src/index.css:24`. Browser viewport at 1280px shows two equal 616px columns. At mobile widths this would create two ~160px columns — effectively unusable.
Impact: App is desktop-only despite having a viewport meta tag.
Fix: Add a mobile breakpoint, e.g. `@media (max-width: 768px) { main { grid-template-columns: 1fr; } }`, and move Preview below the editor stack.
Effort: 20 minutes.

**6. Reading width far exceeds optimal line length**
Evidence: design-auditor reports "Average line width: ~85 chars — slightly over rec. (45–75)" and "Only 0% of text blocks have optimal line width."
Impact: Long lines reduce readability and increase eye fatigue.
Fix: Constrain left column with `max-width: 65ch` or `width: min(100%, 720px)`. Same for rendered preview blocks.
Effort: 10 minutes.

**7. No CSS custom properties — all values hardcoded**
Evidence: ui-ux-suite reports "CSS variables: 0." `src/index.css` defines only `:root` tokens for `font-family`, `line-height`, `color`, `background`. Every component uses inline style objects with literal values like `'#ddd'`, `'0.5rem'`, `'crimson'`. No shared design token layer exists.
Impact: Any color/spacing change requires editing every component. Theming, dark mode, and consistency are structurally impossible without a token layer.
Fix: Define semantic tokens in `src/index.css` (`--color-text`, `--color-border`, `--space-1`, `--space-2`, etc.) and reference them in component styles.
Effort: 1–2 hours for full token extraction and replacement.

**7b. Module scores reflect absence-of-violation, not presence-of-system**
Evidence: Typography scores 100 because the tool found 1 font family, 4 sizes, and 3 line-heights with no detectable violations. Colors scores 75 because contrast passes and only 6 unique colors exist. But those 6 colors are `#1a1a1a`, `#fafafa`, `#ffffff`, `#ddd`, `#666`, and `crimson` — not a palette, just a white page with gray borders and one error color. There is no type scale, no semantic color system, no component primitives, and no DESIGN.md. The high scores measure compliance with minimum thresholds, not the presence of intentional design craft.
Impact: Stakeholders reading the score card may believe the project has functional typography and color design when it actually has none. The 80/100 overall reflects structural functionality, not design quality.
Fix: Treat the current scores as a floor, not a ceiling. Add a design token layer, semantic palette, and type scale before the next major feature pass.
Effort: 1–2 hours for token extraction and replacement.

---

### 🟡 Medium

**8. Near-duplicate background colors: `#fafafa` vs `#ffffff` vs `#efefef`**
Evidence: design-auditor flags `#efefef≈#fafafa (ΔE=3.8)` and `#ffffff≈#fafafa (ΔE=1.7)`. Used across `src/index.css:5`, `src/components/BlockComposer.jsx:38`, `src/components/Preview.jsx:37`.
Impact: Subtle inconsistency in surface treatment. Dragging state uses `#fafafa` while preview uses `#fff` — visually adjacent but semantically different.
Fix: Consolidate to two surfaces: page background and card background. Map to tokens.
Effort: 10 minutes.

**9. Drag-and-drop sortable blocks have no live region announcement for screen readers**
Evidence: `src/components/BlockComposer.jsx:149` creates `aria-live="polite"` with `position: absolute; left: -9999px`. The region is updated in `handleDragEnd` and `move`, but `onDragEnd` fires after the DOM reorder — the announcement references the old index, not the new visual position.
Impact: Screen-reader users hear "Block 3 moved to position 5" but the DOM now shows block 3 at position 5, so the announcement is actually correct. Minor risk: during drag, no live updates.
Fix: This is acceptable for v0.1.0. Flag for v1.
Effort: N/A / backlog.

**10. Inline styles bypass any future component system**
Evidence: Every component uses `style={{ ... }}` for layout, spacing, borders, colors. No shared `Card`, `Button`, `Field`, `Section` primitives exist.
Impact: Reinvents basic UI on every component. Hard to enforce consistency.
Fix: Extract 3–4 primitives (`BlockCard`, `Section`, `ToolbarRow`, `MutedText`) into `src/components/ui/`.
Effort: 1 hour.

---

### 🟢 Low

**11. No dark mode despite having print styles**
Evidence: `src/index.css` has `@media print` but no `@media (prefers-color-scheme: dark)` or `.dark` class. ui-ux-suite flags "No prefers-reduced-motion support."
Impact: Users in dark environments get a bright white page.
Fix: Add `prefers-color-scheme: dark` overrides or a manual theme toggle.
Effort: 30 minutes.

**12. Preview section shows empty placeholder when no blocks exist — no illustration or guidance**
Evidence: `src/components/Preview.jsx:24-25` returns `<p>Add blocks to see a live preview.</p>`. No visual placeholder, no example template.
Impact: First-time users see a blank right panel with minimal guidance.
Fix: Add a short empty-state with a sample block example or illustration.
Effort: 20 minutes.

**13. `@media print` styles may conflict with future responsive breakpoints**
Evidence: `src/index.css:24-52` hides `header`, `nav`, `aside`, `[data-no-print]` during print. If responsive `header`/`nav`/`aside` elements are added later, they will be hidden in print automatically — which is correct, but undocumented.
Impact: None currently. Risk if print styles grow.
Fix: Document print strategy in DESIGN.md.
Effort: 5 minutes.

---

## Accessibility Scorecard

| Check | Status | Evidence |
|---|---|---|
| Skip-to-content link | ❌ Fail | No element found in DOM |
| Focus-visible styles | ❌ Fail | 0 rules in CSS; all 8 tabbable elements show no focus outline |
| All images have alt | ✅ Pass | Image thumbnails use `alt={img.label}` |
| Form inputs labeled | ❌ Fail | 3 inputs unlabeled: CsvMapper:59, ImagePool:91, Toolbar:99 |
| Button labels / aria-labels | ✅ Pass | BlockComposer buttons have aria-label |
| Heading hierarchy | ✅ Pass | H1 → H2 only, no skipped levels |
| Single H1 | ✅ Pass | "Cadence" |
| Keyboard-operable controls | ✅ Pass | All actions reachable via keyboard |
| Tab order logical | ✅ Pass | Top-to-bottom, left-to-right |
| Live regions for dynamic updates | ⚠️ Partial | BlockComposer has aria-live, but silent on CSV render results |
| Color contrast (WCAG AA) | ✅ Pass | design-auditor confirms all checked pairs pass |
| Reduced motion support | ❌ Fail | No `prefers-reduced-motion` media query |
| Language attribute | ✅ Pass | `<html lang="en">` |
| Links have discernible text | N/A | No `<a>` links in app |
| Landmark roles | ⚠️ Partial | `<main>` present but no `<header>`, `<nav>`, `<aside>`, `<footer>` landmarks |
| Error identification | ⚠️ Partial | CSV errors shown in `<details>`, but `alert()` used for template load failure |
| Success feedback | ❌ Fail | No toast/status after save, load, render, or download |
| Responsive layout | ❌ Fail | No responsive breakpoints; grid is always 2 columns |
| Touch target size (44px) | ❌ Fail | 3/3 buttons under 44px |
| No auto-playing media | ✅ Pass | No media elements |

**Accessibility pass rate: 8/19 fully pass, 3 partial, 8 fail.**

---

## Design Token Map

No DESIGN.md exists. Tokens are inferred from `src/index.css` and inline style usage.

| Token | Source Value | Status | Used In |
|---|---|---|---|
| Text color | `#1a1a1a` | Defined | `:root` in index.css |
| Page background | `#fafafa` | Defined | `:root` in index.css |
| Border color | `#ddd` | **Undefined** | BlockComposer, Preview, ImagePool, CsvMapper |
| Muted text | `#666` | **Undefined** | CsvMapper, ImagePool |
| Error text | `crimson` | **Undefined** | CsvMapper, ImagePool |
| Drag background | `#fafafa` | Close match | BlockComposer |
| White surface | `#ffffff` | **Miss** | Preview |
| Off-white | `#efefef` | **Miss** | Not currently used |

**7 unique colors, 0 CSS variables, 4 hardcoded semantic colors without token definitions.**

---

## Remediation Plan

### Sprint 1 — Critical + High (est. 2.5 hours)

1. **Button sizing + cursor + hover/focus** — `min-height: 44px`, `cursor: pointer`, `:hover`, `:focus-visible` on all buttons. Files: Toolbar.jsx, BlockComposer.jsx, CsvMapper.jsx, ImagePool.jsx. **30 min**
2. **Global focus-visible rule** — Add to `src/index.css`. **5 min**
3. **Label 3 unlabeled inputs** — CsvMapper.jsx:59, ImagePool.jsx:91, Toolbar.jsx:99. **15 min**
4. **Skip-to-content link** — Add anchor + `id="main"` on `<main>`. **5 min**
5. **Mobile responsive breakpoint** — Single-column below 768px, reorder Preview below editor. **20 min**
6. **Reading width constraint** — `max-width: 65ch` on editor column and preview blocks. **10 min**
7. **CSS token layer** — Define 6–8 semantic tokens in `:root`, replace inline hardcoded colors. **1 hour**

### Sprint 2 — Medium (est. 1.5 hours)

8. **Consolidate near-duplicate surfaces** — Merge `#fafafa`/`#ffffff`/`#efefef` into token-backed surfaces. **10 min**
9. **Extract UI primitives** — `BlockCard`, `Section`, `ToolbarRow` from repeated inline patterns. **1 hour**
10. **Dark mode / reduced-motion support** — Add `prefers-color-scheme` and `prefers-reduced-motion`. **30 min**

### Backlog — Low (est. 1 hour)

11. **Empty-state improvement** — Visual guidance in Preview panel.
12. **Success feedback** — Toast/status after save, render, download.
13. **Landmark roles + aria-live for CSV results** — Semantic HTML + live region for render completion.
14. **DESIGN.md + DTCG tokens** — Machine-readable spec for future handoff.
15. **Print strategy documentation** — Lock `@media print` behavior in DESIGN.md.

---

## What Works

- **Heading hierarchy** is clean: single H1, sequential H2s, no skips.
- **Contrast** passes WCAG AA on all measured pairs.
- **DOM structure** is simple and semantic enough to audit — no shadow-DOM, no framework noise.
- **Core UX flow** is coherent: blocks → tags → images → CSV → preview → export. Each step is visible and actionable.
- **Error handling** in CSV parsing is surfaced in a collapsible details element.
- **Thumbnail images** correctly carry `alt` text derived from image labels.

---

*Report generated by frontend-ux-audit pipeline — ui-ux-suite, design-auditor, and manual browser heuristics.*
*Date: 2026-08-01*
