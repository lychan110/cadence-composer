---
version: alpha
name: Cadence Composer
description: A calm, competent template composer. Warm neutrals, restrained indigo accent, clear hierarchy through weight and spacing rather than color.
colors:
  page: "#F7F7F5"
  surface: "#FFFFFF"
  border: "#E3E3DF"
  border-subtle: "#EEEEEC"
  text: "#1A1A1A"
  text-secondary: "#5C5C58"
  text-tertiary: "#8A8A85"
  accent: "#4F46E5"
  accent-hover: "#4338CA"
  accent-soft: "#EEF2FF"
  error: "#C42B1C"
  error-soft: "#FEF2F2"
  success: "#15803D"
  success-soft: "#F0FDF4"
typography:
  display:
    fontFamily: Inter
    fontSize: "1.75rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  h1:
    fontFamily: Inter
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  h2:
    fontFamily: Inter
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "0em"
  body:
    fontFamily: Inter
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0em"
  body-small:
    fontFamily: Inter
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0em"
  mono:
    fontFamily: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0em"
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  "2xl": "48px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: "10px 16px"
    height: "44px"
    typography: "{typography.body}"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: "10px 16px"
    height: "44px"
    typography: "{typography.body}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
    height: "44px"
    borderColor: "{colors.border}"
    typography: "{typography.body}"
  button-secondary-hover:
    backgroundColor: "{colors.page}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
    height: "44px"
    borderColor: "{colors.border}"
    typography: "{typography.body}"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
    typography: "{typography.body}"
  input:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "10px 12px"
    height: "44px"
    borderColor: "{colors.border}"
    typography: "{typography.body}"
  input-focus:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "10px 12px"
    height: "44px"
    borderColor: "{colors.accent}"
    typography: "{typography.body}"
  section:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
    typography: "{typography.body}"
  muted-text:
    textColor: "{colors.text-secondary}"
    typography: "{typography.body-small}"
  error-text:
    textColor: "{colors.error}"
    typography: "{typography.body-small}"
  success-badge:
    backgroundColor: "{colors.success-soft}"
    textColor: "{colors.success}"
    rounded: "{rounded.sm}"
    padding: "4px 10px"
    typography: "{typography.body-small}"

---

## Overview

Cadence Composer is a client-side template authoring tool: assemble blocks, tag them, attach images, map CSV rows, render batches, and export HTML or ZIP. The design should feel like a well-organized workbench — calm surfaces, clear hierarchy, generous touch targets, and zero decorative noise.

## Colors

- **Page (#F7F7F5):** Warm off-white. Reduces eye strain vs pure white, still reads as white.
- **Surface (#FFFFFF):** Cards, panels, preview areas.
- **Border (#E3E3DF):** Warm grey, visible but not loud.
- **Text (#1A1A1A):** Near-black. Maximum readability for primary content.
- **Text-secondary (#5C5C58):** Labels, helper text, timestamps.
- **Text-tertiary (#8A8A85):** Placeholder states, disabled hints.
- **Accent (#4F46E5):** Indigo. Sole interactive driver. Used on primary buttons, focus rings, active tabs.
- **Error (#C42B1C):** Warm red. Reserved for validation failures and destructive actions.

## Typography

Inter at every level. The system is weight- and size-driven, not color-driven.

- **Display (1.75rem / 700):** App title only.
- **H1 (1.5rem / 600):** Panel titles, major section headers.
- **H2 (1.125rem / 600):** Subsections inside panels.
- **Body (0.9375rem / 400 / 1.6):** Default reading text, form labels, button text.
- **Body-small (0.8125rem / 400 / 1.5):** Helper text, timestamps, counts.
- **Mono:** Code snippets, CSV headers, JSON previews.

Line length target: 65ch max on reading panels. The editor column should constrain to this measure.

## Layout

Desktop: two-column grid. Left = authoring stack. Right = live preview. Gap: 24px.
Mobile (<768px): single column. Preview moves below the authoring stack. Stack order: Toolbar → BlockComposer → TagRegistry → ImagePool → CsvMapper → Preview.

Spacing scale: 4pt base. All padding, gaps, and margins reference `--space-*` tokens.

## Elevation & Depth

Two surfaces only: page background and raised card/panel. Depth comes from a single `box-shadow` value, not from multiple grey layers. No glassmorphism. No glow effects.

## Shapes

Buttons and inputs share `--rounded-md` (8px). Cards and panels use `--rounded-lg` (12px). Badges and chips use `--rounded-sm` (6px).

## Components

The project needs four primitives to replace inline styles:

- **Button** — primary and secondary variants. Minimum height 44px. Full hover/focus/active/disabled states.
- **Card/Section** — white surface, warm border, subtle shadow. Used for every panel.
- **Field** — labeled input with `:focus-visible` ring in accent color. Minimum height 44px.
- **MutedText** — secondary/tertiary text utility.

## Motion

Minimal. Use `transform` and `opacity` only. Durations: 150ms hover, 200ms expand/collapse. Respect `prefers-reduced-motion: reduce` by disabling all transitions.

## Do's and Don'ts

- Do use weight and size for hierarchy.
- Do use the accent color only on interactive elements and focus rings.
- Do keep surfaces to page + card only.
- Don't invent new colors inline.
- Don't use italic headers.
- Don't wrap every element in a card.
- Don't nest cards inside cards.
- Don't re-draw fake browser chrome or phone frames.
