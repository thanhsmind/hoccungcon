# Validation Report — modularize-app, slice: Phase A (test net)

**Date:** 2026-07-08 · **Mode:** standard · **Verdict:** READY WITH CONSTRAINTS

## Reality Gate

| Check | Result | Evidence |
|-------|--------|----------|
| MODE FIT | PASS | 2 risk flags (existing covered behavior, weak proof); standard is proportionate. No hard-gate flag. |
| REPO FIT | PASS | Vite 5.4.21 + React 18.3.1 present; `npm run build` clean (1500 modules, ✓ built in 1.67s). |
| ASSUMPTIONS | PASS | All blocking assumptions proven by spike (below), not asserted. |
| SMALLER PATH | PASS | Phase A is a single cell; cannot be smaller and still gate B–F. |
| PROOF SURFACE | PASS | Runnable spike under `.spikes/modularize-app/` renders all 15 lessons green. |

## Feasibility Matrix

| Assumption | Risk | Proof required | Evidence | Result |
|-----------|------|----------------|----------|--------|
| `npm run build` baseline is clean | LOW | build command | `✓ built in 1.67s`, 1500 modules | PASS |
| Vitest ^2 + jsdom + @testing-library render `<App/>` headlessly | MEDIUM | actual test run | spike ran `1 passed` | PASS |
| App's `window`/observer usage survives jsdom | MEDIUM | run + inspect failures | Found & fixed 2 real gaps: `scrollTo` (App.jsx:2159) and `ResizeObserver` (App.jsx:167) throw under jsdom → stubbed in setup; test then green | PASS |
| A strong net (not vacuous) is feasible | MEDIUM | run with per-lesson assertions | Strengthened spike asserts each lesson ≥3 stations, total ≥100 → measured **150 stations across 15 lessons**, `1 passed` | PASS |
| No LESSONS export / no App.jsx edit needed | LOW | nav-driven render works | spike drives all 15 via nav buttons, App.jsx untouched | PASS |

## Discovered Constraints (folded into the cell)

1. jsdom stubs required in `src/test/setup.js`: `window.scrollTo`, global `ResizeObserver`, `window.matchMedia`.
2. Vitest `include: ['src/**/*.test.jsx']` so the disposable `.spikes/` test is not collected.
3. Strong assertion: per-lesson station count ≥3 and total ≥100 — makes a dropped lesson/station in Phases D/E fail.
4. `npm install` after editing package.json (cold clone has no node_modules); pin vitest ^2.

## Plan-Checker (adversarial) — findings

- **[BLOCKER → resolved, forward phases]** `inputBox`/`btnPrimary`/`btnGhost` (App.jsx:252-254) are shared by blocks (Phase D) AND shell (Phase F). Leaving them in App.jsx would force an upward import (cycle). **Fix recorded:** extract to `src/lib/styles.js` in Phase B. approach.md + plan.md updated. Does not affect Phase A.
- **[BLOCKER → resolved, current slice]** Original smoke net asserted only total `textContent.length > 50` once — could pass with only BAI_1 rendered. **Fixed:** cell now mandates per-lesson station-count assertions, proven at 150 total.
- Decision coverage, cell completeness, scope sanity (6 phases proportionate for a 2232-line bisectable move): PASS.

## Cell Review (cold pickup) — modularize-app-1

Verdict **READY**; 4 MINOR items all folded into the cell action: explicit `npm install`, vitest `include` scoping, import path `../App.jsx`, `defineConfig` from `"vite"`. No CRITICAL flags.

## Approval Block

- Current slice: **Phase A only** (`modularize-app-1`). Approval covers this slice only; Phases B–F return to planning/validating per slice.
- Verify command: `npx vitest run && npm run build`.
- Constraints for later slices recorded (styles module in Phase B).
