# Modularize src/App.jsx — Context

**Feature slug:** modularize-app
**Date:** 2026-07-08
**Exploring session:** complete
**Scope:** Standard
**Domain types:** ORGANIZE (primary), SEE (behavior must be preserved)

## Feature Boundary

Split the single 2232-line `src/App.jsx` into reusable modules — lesson data, block
renderers, UI primitives, and utilities in separate files — **without changing any
runtime behavior**. The feature ends when the app builds and renders identically to
today, backed by a smoke-test safety net. It does not touch `static/`, does not
redesign UI, and does not change lesson content.

## Locked Decisions

These are fixed. Planning must implement them exactly — cited, never reinterpreted.
Changing one requires the user, a new D-ID or an explicit supersession note, never
a silent edit.

| ID | Decision | Rationale |
|----|----------|-----------|
| D1 | Scope is `src/` only (`src/App.jsx`). `static/` (legacy standalone `khung-bai-giang.jsx`, not part of the Vite build) is left untouched. | Keeps scope tight; `static/` is dead code w.r.t. the deployed build (`index.html` → `/src/main.jsx`). |
| D2 | Lesson data `BAI_1..15` moves to JS modules (one file per lesson), keeping `import { C }` for color tokens. Not a single character of lesson content changes. | Data references JS color constants (`color: C.teal`, etc.); JSON would force lossy hex conversion and break the color-token link. |
| D3 | Write automated smoke tests that render all 15 lessons **first**, then perform the split. Tests are the regression net. | Repo has no tests; a refactor of this size needs a mechanical safety net before moving code. |
| D4 | Role-based folder layout (see below). | User wants clearly reusable components; role separation is familiar and durable for React. |

### D4 target layout

```
src/
  App.jsx            (shell + navigation only)
  data/lessons/      bai-01.js … bai-15.js, index.js (LESSONS aggregate)
  components/
    ui/              Card, Pill, HowTo, StationShell
    blocks/          TextBlock, QuizBlock, CalculatorBlock, RevealBlock,
                     WhyBlock, RealLifeBlock, NumberLineBlock, FillInBlock,
                     DecimalBlock, AnglesBlock (block granularity is planning's call)
    Figure.jsx
  lib/               colors (C), geometry (P, arc), RichText, NumberLine
```

Note: `RichText` and `NumberLine` are React components (not pure helpers); planning
decides consciously whether they land in `lib/` or `components/`. Not a blocker.

## Existing Code Context

From the quick scout only. Downstream agents read these before planning.

### Reusable Assets

- `src/App.jsx` — the whole app. Already internally decomposed into named components
  (Card, Pill, HowTo, StationShell, ~10 `*Block` renderers, Figure) and utilities
  (P, Frac, RichText, NumberLine). The work is extraction, not rewriting.

### Established Patterns

- Block dispatch is a `switch (s.type)` at `src/App.jsx:1019` mapping station `type`
  → block component. This is the seam between data and renderers.
- Color tokens live in a `C` object referenced across both data and components.
- Lesson data is plain nested objects; RichText content uses data descriptors
  (`{ b }`, `{ frac }`, `{ hl }`, `{ br }`, `{ step }`) — data, not JSX.

### Integration Points

- `src/main.jsx` imports the default `App` export — this public surface must stay
  identical (default export named `App`).
- `LESSONS = [BAI_1..BAI_15]` at `src/App.jsx:2102` — the aggregate the App consumes.

## Canonical References

- `src/App.jsx:1019-1032` — block dispatch switch (the data↔renderer contract).
- `src/App.jsx:1037-2100` — the 15 lesson data objects to extract.
- `.github/workflows/deploy.yml` — builds `dist` from the Vite `src/` entry; confirms
  `static/` is outside the deployed build.

## Outstanding Questions

### Deferred To Planning

- [ ] Block-renderer granularity (one file per block vs grouped) — planning decides.
- [ ] Test tooling/setup — repo has no test runner yet; planning picks the framework
      (e.g. Vitest, already Vite-native) and the smoke-test shape.
- [ ] Extraction order and how many cells (data / ui / blocks / lib / shell).

## Deferred Ideas

- Touching or removing `static/` legacy files — out of scope per D1, revisit as
  separate cleanup.
- Converting lesson data to non-dev-editable JSON/CMS format — rejected per D2.

## Handoff Note

CONTEXT.md is the source of truth. Decision IDs are stable. Planning reads locked
decisions, code context, canonical references, and deferred-to-planning questions.
Validating and reviewing use locked decisions for coverage and UAT.
