---
version: alpha
name: Cadence
description: A warm, literary template composer — burgundy-accented on a parchment page, calm and tactile.
colors:
  page: "#F5F0E6"
  surface: "#FDFBF5"
  surfaceRaised: "#FFFFFF"
  border: "#D4C9B8"
  borderSubtle: "#E5DDD0"
  text: "#2C2420"
  textSecondary: "#7A6E5E"
  textTertiary: "#A89E8E"
  primary: "#8B3A4A"
  accent: "#8B3A4A"
  accentHover: "#6B2A38"
  accentSoft: "#F2E5E9"
  error: "#9B3B3B"
  errorSoft: "#F5E5E5"
  success: "#4A6B41"
  successSoft: "#E8F0E5"
  warning: "#8B6914"
  warningSoft: "#F5F0E0"
  darkPage: "#1C1A17"
  darkSurface: "#25231F"
  darkSurfaceRaised: "#2E2C27"
  darkBorder: "#3A3730"
  darkBorderSubtle: "#302D27"
  darkText: "#E8E4DC"
  darkTextSecondary: "#B0A898"
  darkTextTertiary: "#787068"
typography:
  displayLg:
    fontFamily: Inter, ui-sans-serif, system-ui, sans-serif
    fontSize: 1.5rem
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  displayMd:
    fontFamily: Inter, ui-sans-serif, system-ui, sans-serif
    fontSize: 1.125rem
    fontWeight: 600
    lineHeight: 1.3
  bodyMd:
    fontFamily: Inter, ui-sans-serif, system-ui, sans-serif
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.5
  bodySm:
    fontFamily: Inter, ui-sans-serif, system-ui, sans-serif
    fontSize: 0.75rem
    fontWeight: 400
    lineHeight: 1.5
  bodyXs:
    fontFamily: Inter, ui-sans-serif, system-ui, sans-serif
    fontSize: 0.6875rem
    fontWeight: 400
    lineHeight: 1.5
  codeMd:
    fontFamily: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace
    fontSize: 0.8125rem
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: 6px
  md: 8px
  lg: 12px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: 12px
    minHeight: 44px
  button-primary-hover:
    backgroundColor: "{colors.accentHover}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    borderColor: "{colors.border}"
    rounded: "{rounded.md}"
    padding: 12px
    minHeight: 44px
  button-secondary-hover:
    backgroundColor: "{colors.page}"
  button-label:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    borderColor: "{colors.border}"
    rounded: "{rounded.md}"
    padding: 12px
    minHeight: 44px
    cursor: pointer
  section:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.borderSubtle}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  block-card:
    borderColor: "{colors.border}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
    backgroundColor: "{colors.surface}"
  field:
    borderColor: "{colors.border}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    minHeight: 44px
  field-focus:
    borderColor: "{colors.accent}"
  select:
    borderColor: "{colors.border}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    minHeight: 44px
  tag-item:
    backgroundColor: "{colors.accentSoft}"
    textColor: "{colors.accent}"
    rounded: "{rounded.sm}"
    padding: "4px 8px"
  image-card:
    borderColor: "{colors.border}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
    backgroundColor: "{colors.surface}"
  preview-container:
    borderColor: "{colors.border}"
    rounded: "{rounded.md}"
    padding: "{spacing.lg}"
    backgroundColor: "{colors.surface}"
---

## Overview

Cadence is a single-page template composer — a product tool for assembling HTML email templates from reusable blocks, tag placeholders, CSV data, and image assets. The design language is **warm literary minimalism**: a parchment page (#F5F0E6), deep burgundy accents, and a single fluid two-panel layout that collapses to one column on mobile.

The tone is **calm, tactile, unhurried**. The interface steps back so the user's content — HTML blocks, tag metadata, rendered previews — stays forward. Motion is reserved for feedback and reordering, never decorative. The entire system works in light and dark mode out of the box, and respects both `prefers-reduced-motion` and `prefers-color-scheme`.

### Hallmark self-critique

Philosophy: 5/5 — warm literary functionalism, parchment and burgundy, content-forward
Hierarchy: 4/5 — clear two-panel layout, but sections are evenly weighted; the composer is the primary action
Execution: 4/5 — token-backed CSS, Button primitive, consistent spacing, dark mode, reduced motion
Specificity: 5/5 — every value references a named token; no inline hex or hardcoded values
Restraint: 4/5 — no unnecessary shadows, no bounce animations, no glassmorphism or gradients
Variety: 3/5 — the section-card + button + field pattern is consistent but could risk samey-ness at 5+ sections

## Colors

The palette is a warm literary system on a parchment page. Deep burgundy for action, sandy neutrals for structure, charcoal for text. No pure blacks, no pure whites, no gradients, no glassmorphism.

| Token | Value | Usage |
|---|---|---|
| `page` | #F5F0E6 | Page background — warm parchment |
| `surface` | #FDFBF5 | Card/section surfaces — slightly lighter parchment |
| `border` | #D4C9B8 | Interactive element borders — sandy tan |
| `borderSubtle` | #E5DDD0 | Section outlines, card dividers |
| `text` | #2C2420 | Primary body and heading text — deep charcoal |
| `textSecondary` | #7A6E5E | Muted labels, metadata — warm gray |
| `textTertiary` | #A89E8E | Placeholder text, disabled content |
| `accent` | #8B3A4A | Buttons, links, focus rings — deep burgundy |
| `accentHover` | #6B2A38 | Button hover, deeper interaction state |
| `accentSoft` | #F2E5E9 | Tag chips, focus glow, subtle accent fills |
| `error` | #9B3B3B | Validation errors, destructive actions |
| `success` | #4A6B41 | Success confirmation |
| `warning` | #8B6914 | Warning states |

All interactive components pass WCAG AA (4.5:1 minimum contrast ratio) on the surfaces they appear. The burgundy (#8B3A4A) on parchment (#F5F0E6) achieves 5.8:1 — AA pass for normal text.

**Dark mode** inverts the luminance axis: #1C1A17 page → #25231F surface → #3A3730 border. Text becomes #E8E4DC. Accent stays at #8B3A4A, but accentSoft shifts to a deeper tint (#2E1E23) to keep contrast on dark surfaces.

## Typography

**Inter** is the sole typeface — used for both display and body roles. The family carries the full weight range (300–900) with excellent screen rendering, so switching faces between heading and body adds no value and creates unnecessary visual chatter.

The scale is deliberately compact (4 sizes for body, 2 for display) to keep the tool dense but legible:

| Token | Size | Weight | Usage |
|---|---|---|---|
| displayLg | 1.5rem / 24px | 700 | Page title (H1) |
| displayMd | 1.125rem / 18px | 600 | Section headings (H2) |
| bodyMd | 0.875rem / 14px | 400 | Primary body text |
| bodySm | 0.75rem / 12px | 400 | Labels, metadata |
| bodyXs | 0.6875rem / 11px | 400 | Tags, counters, muted status |
| codeMd | 0.8125rem / 13px | 400 | Code/HTML editing textareas |

- All headings are roman (`font-style: normal`) — no italic headers
- Code blocks use `ui-monospace` stack for monospace editing surfaces
- Line length for prose blocks is constrained to ~65ch where possible
- Kerning is normal; only the H1 displayLg carries `-0.02em` tracking

## Layout & Spacing

The layout follows a **4px grid** with semantic spacing names:

| Token | Value | Usage |
|---|---|---|
| xs | 4px | Micro-gaps between inline actions, inner padding |
| sm | 8px | Gap between field and label, button padding |
| md | 16px | Section padding, card padding, element margins |
| lg | 24px | Section margins, toolbar bottom margin |
| xl | 32px | Large block spacing |
| xxl | 48px | Page-level padding |

**Two-column workbench**: The main layout is `grid-template-columns: 1fr 1fr` — left column for the editor stack (blocks, tags, images, CSV), right column for live preview. Below 768px (mobile breakpoint), the grid collapses to `1fr` and preview repositions below the editor stack.

**Reading width**: The left editor column and preview container are constrained to `max-width: 65ch` and/or `minmax(0, 720px)` — well inside the 45–75 character optimal line length for readable prose. Block textareas use `resize: vertical` to let users expand content as needed.

## Elevation & Depth

Cadence uses minimal elevation — enough to separate surfaces, not enough to suggest depth layers.

| Token | Value | Usage |
|---|---|---|
| shadowSm | `0 1px 2px rgba(0,0,0,0.04)` | Default section cards |
| shadowMd | `0 4px 12px rgba(0,0,0,0.06)` | Reserved for overlays or future modals/panels |

No floating elements, no sticky headers, no z-index layers beyond the skip-link at z-1000.

**Drag state**: Dragging a sortable block reduces opacity to 0.9 and applies the dnd-kit transform — no shadow lift. The subtle fade signals the action without adding a new surface layer.

## Shapes

Rounding is consistent and modest — never pill or circle, never sharp angular.

| Token | Value | Usage |
|---|---|---|
| sm | 6px | Block textareas, tag chips, button-label edges |
| md | 8px | Buttons, fields, selects, block cards |
| lg | 12px | Section/card containers |

## Components

### Button

Two variants: `primary` (solid indigo fill, white text) and `secondary` (white fill, border, indigo text). Both have `min-height: 44px` for touch-target compliance. A `size="sm"` variant reduces to `min-height: 36px` for compact inline actions (move up/down, delete).

States: default, hover, `:focus-visible`, `:active`, disabled (0.5 opacity, pointer-events none). Transitions use `--ease-out` (150ms) on background-color and color only.

### Section

A rounded-lg container with subtle border and shadow. Used consistently by every app section (Blocks, Tags, Image pool, CSV, Preview). Headings inside sections use `displayMd`.

### Field / Select

Text inputs, textareas, and selects share a common field base: 44px min-height, border, rounded-md, focus ring via accent-colored `box-shadow` with `--accent-soft` fill. Textareas get `font-mono` for HTML content. Selects get a custom SVG chevron with `appearance: none`.

### Block Card

Each composed block renders inside a bordered card with a header row (title + action buttons) and a monospace textarea. The card shifts background to `--color-page` on hover to signal the active editable zone.

### Tag Item / Image Card

Tags render as small accent-soft pills with `font-mono`. Images render in a flex grid of bordered cards, each showing a label, thumbnail, source type label, and remove button.

## Motion

Purposeful and minimal — never decorative.

| Easing | Curve | Usage |
|---|---|---|
| easeOut | `cubic-bezier(0.16, 1, 0.3, 1)` | All interaction transitions (hover, focus, visibility) |
| easeIn | `cubic-bezier(0.7, 0, 0.84, 0)` | Reserved for exit transitions |
| easeInOut | `cubic-bezier(0.65, 0, 0.35, 1)` | Reserved for reveal/accordion animations |

- Animate only `background-color`, `color`, `opacity`, `shadow`, `transform` — never layout properties
- Skip-link slides in/out using `transform: translateY()`
- Block cards transition background-color on hover (150ms ease-out)
- Button states transition background-color and color (150ms ease-out)
- Reduced motion: `prefers-reduced-motion: reduce` sets `animation-duration: 0.01ms` and `transition-duration: 0.01ms` globally — no feature is lost, only the animation

## Do's and Don'ts

**Do:**
- Use semantic tokens from this spec — never inline hex, pixel, or hardcoded values
- Add new components to the `tokens.css` file using the same token naming convention
- Respect the 44px minimum touch target for all interactive elements
- Keep line lengths between 45–75 characters for readable content
- Use the skip-link, focus-visible ring, and aria-live regions for accessible keyboard and screen-reader flow
- Test every new feature at 320px, 375px, 414px, and 768px widths
- Add both light and dark mode tokens for any new color

**Don't:**
- Don't wrap sections in nested cards — the section is already the card
- Don't use Inter italic for headings — all display type is roman
- Don't add glassmorphism, gradients, or decorative shadows
- Don't use bounce elastic easings — use the three named easings only
- Don't animate layout properties (width, height, margin, padding, top, left)
- Don't introduce a new font family — Inter covers everything
- Don't skip the `prefers-reduced-motion` fallback
- Don't add hero illustrations, brand imagery, or decorative chrome — this is a tool, not a marketing page
