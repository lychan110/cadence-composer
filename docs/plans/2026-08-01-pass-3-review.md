# Cadence — Pass 3 Adversarial Review

**Date:** 2026-08-01
**Plan under review:** `docs/plans/2026-08-01-pass-3.md`

## Review 1: Complexity vs Value
Drag-and-drop reorder is nice-to-have. The existing up/down buttons already solve the functional requirement. DnD adds implementation complexity, edge cases, and mobile accessibility concerns for marginal UX gain. **Recommendation:** Keep DnD optional/experimental; do not block the pass on it.

## Review 2: Technical Approach Ambiguity
The plan does not specify the DnD implementation path. Native HTML5 DnD is notoriously finicky with React (ghost images, dataTransfer limitations). A library like `@dnd-kit` adds a dependency but provides keyboard accessibility and mobile support. Pointer-based custom DnD avoids libraries but increases code surface. **Recommendation:** Pick one approach explicitly before implementation.

## Review 3: Print CSS Scope Creep
"Print CSS for per-row and batch HTML output" is open-ended. Print styles can easily balloon into a full layout rework. **Recommendation:** Define concrete print CSS requirements: page breaks, hide toolbar/preview chrome, font fallbacks, image sizing.

## Review 4: Batch PDF Print Flow Complexity
Using `@media print` for batch PDF implies a multi-page print flow. Browsers handle print pagination inconsistently, and there's no programmatic "print next row" flow without user interaction. **Recommendation:** Scope to per-row print only for this pass; batch print can be a follow-up.

## Review 5: Missing Test Coverage
The plan does not mention tests for new features. DnD behavior, print CSS rendering, and batch error states all need verification. **Recommendation:** Add test tasks to the plan.

## Review 6: Accessibility Gaps
The plan mentions `aria-live` announcements but does not address keyboard-only DnD, which is an accessibility requirement. Up/down buttons already provide keyboard support; DnD would need explicit keyboard reordering to match. **Recommendation:** Either preserve up/down buttons as keyboard fallback, or require full keyboard DnD support before merging.

## Review 7: "Polish" Vague Scope
Empty states, loading states, error states, toolbar grouping — these are valid but unbounded. **Recommendation:** Break into specific component-level tasks with acceptance criteria.

## Review 8: Dependency Risk
No new dependencies are mentioned, but DnD implementation may push toward one. **Recommendation:** State the dependency decision upfront.

## Overall Assessment
The plan is directionally correct but has scope ambiguity and technical gaps. Revise to: narrow DnD scope, define print CSS concretely, keep batch print for later, add tests, and make the dependency decision explicit.
