# Review Report — modularize-app (Gate 4)

**Date:** 2026-07-08
**Branch:** modularize-app (5 cells capped: A–E, commits 57e3979…56af041)
**Diff:** `git diff main...HEAD` — 59 files, +4426 / −2078. Move-only extraction of a
2232-line `src/App.jsx` into `src/lib/`, `src/components/{ui,blocks}`, `src/components/Figure.jsx`,
and `src/data/lessons/`. App.jsx reduced to 192-line shell + navigation + default export.

## Verdict: **No P1 findings. Merge-safe.** One P2 + four P3 (all non-blocking → backlog).

## Fresh gate output
- `npx vitest run` → **1 passed** (all 15 lessons render via the real `<App/>` path; ≥3 stations/lesson, ~128 total).
- `npm run build` → **clean**, 1540 modules, `dist/assets/index-*.js` 296.25 kB (== baseline).

## Reviewers (isolated context: diff + CONTEXT.md + plan.md only)

### code-quality — MERGE-READY, no P1/P2
- Every import across App.jsx + all 30 modules resolves to a real export; default-vs-named correct (`App` sole default, consumed by `src/main.jsx:3`).
- **Byte-faithful:** diffed every non-import/non-comment line of `main:src/App.jsx` against the union of new files — **zero logic/JSX/data lines differ** (D2 honored). `renderBlock` switch character-identical to the original.
- No dropped/duplicated definitions; no circular imports; JSX automatic runtime active.

### architecture — APPROVE, no P1/P2
- Final tree matches locked **D4** exactly.
- Import DAG acyclic, strictly downward: `data → lib` only; `blocks → lib/ui/components`; `ui → lib`; `App → everything`; `styles.js` sits below blocks (validating finding respected).
- App.jsx genuinely shell+nav only (`grep bai- src/App.jsx` → none); public surface unchanged.
- **D1** respected — `git diff --stat main...HEAD -- static/` empty.

### test-coverage — 1 P2 + 2 P3
- Confirms the net is a **real integration test** (imports production `../App.jsx`, drives real `renderBlock`), and honestly catches the two loudest move-only failure modes: a whole lesson vanishing (nav `>=15` assertion) and any renderer that throws / fails to import.

## Findings (all non-blocking)

### P2 — smoke net counts station *shells*, not block *renders*
`lessons.smoke.test.jsx:38` counts `<section id>` elements, but `StationShell.jsx` emits that
section above `{children}` regardless of whether the block rendered anything; `renderBlock` has
`default: return null`. So a mis-wired/dropped block case (e.g. `quiz` → `TextBlock`, or falling to
`default`) leaves the section count unchanged → **test stays green**. Not a bug in this diff (the move
is byte-identical), but the net would not catch a *future* Phase-D-style mis-wire.
*Fix:* assert per-type block output (e.g. a `data-block-type` marker on each block root; assert the
observed set covers all 10 types and matches the section count).

### P3 — slack thresholds
`>=3`/lesson and `>=100` total vs actuals of 7 and ~128. A partial station loss inside one lesson
(7→5) passes green. For a move-only refactor the counts are known constants → pin exact per-lesson
counts and `total === 128`.

### P3 — content integrity (D2) unprotected by the net
The net never inspects rendered text, so garbled/swapped lesson content that preserves station count
is invisible. Cheap guard: snapshot each lesson's `meta.title` / first-station text.

### P3 — dead `React` default import in 13 files
Unused under the automatic JSX runtime (also flagged by tsserver on `App.jsx:1`). Faithful to the
original monolith, not a regression. Drop the `React` token for lint-clean files.

### P3 — `renderBlock.jsx` centralizes all 10 block types
Deliberate dispatch seam (CONTEXT.md), not a defect. Noted so a future auto-register idea has a home.

## Artifact verification (EXISTS / SUBSTANTIVE / WIRED)
Every artifact D4/plan promised — `src/lib/*`, `src/components/ui/*`, `src/components/blocks/*` (10 +
`renderBlock`), `Figure.jsx`, `src/data/lessons/bai-01..15.js` + `index.js` — verified present,
substantive (no stubs), and wired on the render path (architecture reviewer + green build). **All OK.**

## Verification-evidence gate
All 5 cells are `behavior_change: false` (pure move). Gate satisfied by definition; each cell recorded
a passing `npx vitest run && npm run build`.
