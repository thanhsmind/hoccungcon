# Modularize src/App.jsx — Approach

**Feature:** modularize-app · **Mode:** standard · **Discovery:** L1

## Chosen path

A **safety-net-first, layered pipeline extraction**. Because the change must preserve
behavior with no existing tests (per D3), we add a smoke-test net that renders all 15
lessons against the *current monolith*, then extract one dependency layer at a time —
bottom-up so every intermediate state still builds and the same smoke test stays green.

Extraction order follows the one-directional dependency graph (verified by scout):

```
lib  →  ui  →  blocks(+Figure)  →  data  →  App shell
```

Each layer is one cell = one commit, smoke test green after each. No layer imports a
layer above it, so no circular imports arise.

### Layer contents (from scout of src/App.jsx)

| Layer | Symbols | Current lines |
|-------|---------|---------------|
| `lib/colors` | `C` | 51-54 |
| `lib/num` | `gcd, simplify, decToFrac, nearestFrac, parseNum, decimalInfo` | 57-95 |
| `lib/geometry` | `RAD, P, arc` | 97-104 |
| `lib/icons` | `ICON` (lucide map) | 255 |
| `lib/styles` | `inputBox`, `btnPrimary`, `btnGhost` | 252-254 |
| `lib` components | `Frac` (107), `RichText` (125), `NumberLine` (162) | — |
| `components/ui` | `Card` (237), `Pill` (240), `HowTo` (244), `StationShell` (257) | — |
| `components/Figure` | `Figure` (888) | — |
| `components/blocks` | 10 `*Block` + `renderBlock` switch | 277-1032 |
| `data/lessons` | `BAI_1..15`, `LESSONS` | 1037-2102 |
| `App.jsx` | `App` shell + `btnGhost` style + default export | 2107-2232 |

Per the D4 note, `RichText` and `NumberLine` are React components — they go under
`src/components/` (not `lib/`); `lib/` holds only pure helpers (`C`, num, geometry,
icons). This is planning's call, consistent with D4.

**Shared style consts (validating finding, must land in Phase B):** `inputBox`,
`btnPrimary`, `btnGhost` (App.jsx:252-254) are used by BOTH block renderers (Phase D:
lines 308,313,321,373,453,456,491,496,520,521,524,636,655,706,707,854) AND the App
shell (Phase F: lines 2161,2174). They must be extracted to `src/lib/styles.js` in
**Phase B**, below the blocks layer — NOT left in App.jsx. Leaving them in the shell
would force blocks to import upward (blocks → shell) and create an import cycle. The
adversarial plan-checker flagged this; extraction order stays acyclic once styles live
in `lib/`.

## Rejected alternatives

- **Big-bang move (all files at once, one commit):** rejected — no per-step
  verification, a broken import anywhere fails the whole thing with no bisect point.
- **Convert data to JSON:** rejected per D2 (would break `C.*` color references).
- **Refactor without a test net first:** rejected per D3.
- **Parallel swarm across layers:** rejected — layers are a hard sequential pipeline
  (each extraction depends on the layer below already existing). One worker, in order.

## Risk map

| Component | Risk | Proof needed |
|-----------|------|--------------|
| Smoke test can render all 15 lessons | MEDIUM | Validating: prove a Vitest + jsdom + @testing-library render of `<App/>` walking all 15 lesson buttons runs green on the current monolith. |
| Vitest adds cleanly to Vite 5 / React 18 | LOW | Vitest is Vite-native; jsdom env + @testing-library/react is the standard combo. Confirm at validating with an actual `npx vitest run`. |
| Hidden shared state / import cycle after split | LOW | Dependency graph is one-directional (scout-verified); smoke test after each layer catches regressions. |
| `import { C }` re-wiring across data + components | LOW | Mechanical; build + smoke test catch typos. |

## Likely files & order

1. `package.json`, `vite.config.js` (test config), `src/__tests__/lessons.smoke.test.jsx` — net.
2. `src/lib/*` — colors, num, geometry, icons.
3. `src/components/ui/*`, `src/components/RichText.jsx`, `src/components/NumberLine.jsx`, `src/components/Frac.jsx`.
4. `src/components/Figure.jsx`, `src/components/blocks/*`.
5. `src/data/lessons/bai-01..15.js`, `src/data/lessons/index.js`.
6. `src/App.jsx` slimmed to shell.

## Open questions for validating

- Does `<App/>` render headlessly under jsdom without hitting `window`-only APIs that
  throw? (App reads `window.innerWidth` with a guard at line ~2110 — verify.)
- Cleanest way to drive "render all 15 lessons": click each nav button vs. export
  `LESSONS` and render each lesson's stations directly. Validating picks the shape.
- Confirm `npm run build` is clean on the current tree as the extraction baseline.

## Relevant learnings

None captured yet (`critical-patterns.md` empty; no prior decisions for this area).
