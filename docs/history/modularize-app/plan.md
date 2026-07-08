---
artifact_contract: bee-plan/v1
artifact_readiness: implementation-ready
mode: standard
---

# Modularize src/App.jsx — Plan

## Mode gate (mechanical)

Risk flags counted: **2** — `existing covered behavior` (all app behavior must be
preserved), `weak proof around the area` (no tests today). No hard-gate flag (no auth,
data-loss, security, external provider, validation removal). → **standard**.

Why not smaller: >3 files change and it touches all existing user-visible behavior, so
`tiny`/`small` understate the regression surface. Why not high-risk: no hard-gate flag
and no 4th flag.

## Shape — phased pipeline

Six phases, each one cell = one commit, executed **in order** (hard sequential
dependency: each layer imports the layer below). The same smoke test is the gate after
every phase.

| Phase | Cell delivers | Verify |
|-------|---------------|--------|
| **A — Net** (current slice) | Vitest + jsdom + @testing-library wired; `lessons.smoke.test.jsx` renders all 15 lessons on the **current monolith**, green. `npm run build` still clean. | `npx vitest run` green + `npm run build` clean |
| **B — lib** | `src/lib/`: `colors.js` (C), `num.js`, `geometry.js`, `icons.js`, **`styles.js` (`inputBox`, `btnPrimary`, `btnGhost` — shared by blocks AND shell; MUST live below blocks to keep imports acyclic — validating finding)**. App imports from them; inline copies removed. | build clean + smoke green |
| **C — shared components** | `src/components/`: `Frac.jsx`, `RichText.jsx`, `NumberLine.jsx`, `ui/{Card,Pill,HowTo,StationShell}.jsx`. | build clean + smoke green |
| **D — blocks** | `src/components/Figure.jsx`, `src/components/blocks/*` (10 blocks) + `renderBlock`. | build clean + smoke green |
| **E — data** | `src/data/lessons/bai-01..15.js` + `index.js` exporting `LESSONS` (each `import { C }`); no content change (D2). | build clean + smoke green |
| **F — shell** | `src/App.jsx` reduced to shell + navigation + default export, importing all layers. | build clean + smoke green + manual click-through of a few lessons |

Locked-decision coverage: D1 (only `src/`, no `static/`), D2 (data → JS modules, keep
`C`, no content edit — Phase E), D3 (tests first — Phase A precedes all extraction),
D4 (role-based layout — Phases B–F build exactly that tree).

## Test matrix (smoke net, against the 12 edge dimensions)

- **Happy path:** all 15 lessons render without throwing; every station `type` in the
  dispatch switch renders at least once (the 15 lessons collectively exercise all 10
  block types).
- **Rendering/state:** `<App/>` mounts under jsdom; lesson-switch nav updates content.
- **Boundaries:** first (BAI_1) and last (BAI_15) lesson render.
- **Regression invariant:** the *identical* test file passes unchanged after each of
  Phases B–F — that is the no-behavior-change proof (D3).
- Out of scope for this net: interaction correctness of each block (drag math, quiz
  scoring). This is a *move-only* refactor; behavior logic is not touched, so a render
  smoke net + build is the honest gate. Deep interaction tests are deferred.

## Current slice for prep

**Phase A only.** It is the prerequisite net every later phase depends on, and it is
the honest first shippable chunk. Phases B–F cells are created slice-by-slice as
execution reaches them (future-slice cells prohibited now).

### Cells (current slice)

- `modularize-app-1` — Phase A: test tooling + smoke net on the current monolith.

Files bounded: `package.json`, `vite.config.js`, `src/__tests__/lessons.smoke.test.jsx`,
and a possible `src/App.jsx` one-line change to export `LESSONS` for the test (decided
at validating — the export is additive and behavior-neutral). Verification command:
`npx vitest run` (green) and `npm run build` (clean).

## Deferred to validating

- Prove the smoke render runs green on the current monolith (jsdom + `window` guard).
- Confirm `npm run build` baseline is clean.
- Pick the "render all 15" shape: drive `<App/>` nav vs. render lessons directly.
