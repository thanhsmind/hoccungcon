# Critical Patterns

Mandatory pre-planning / pre-execution context for this repository.
bee-compounding appends hard-won patterns here; keep it short and current.

## Move-only refactor of a large file (proven on modularize-app, 2026-07-08)

Splitting a 2232-line `src/App.jsx` into modules with **zero behavior change**, in order:

1. **Net first (D3).** Add a Vitest+jsdom smoke test that drives the real `<App/>`
   default export and renders all 15 lessons *before* moving any code. The identical
   test file staying green after each extraction is the no-behavior-change proof.
2. **Extract by exact line-slice, not by retyping.** For byte-for-byte fidelity, read
   the block boundaries programmatically (`grep -n` the `const X =` starts), slice the
   exact ranges with a Node script, and prepend only the `import`/`export` scaffolding.
   Retyping large data blocks smuggles edits.
3. **Diff-verify every extracted file** against `git show main:src/App.jsx` (or the
   original slice) before deleting the source — assert the moved body is identical modulo
   the added import + `export` keyword.
4. **Layer imports downward, acyclic:** `data → lib` only; `ui → lib`; `blocks → lib/ui/components`;
   `App → everything`. Shared style constants (`styles.js`) must sit **below** blocks or
   the graph cycles (validating finding).
5. **Keep the public surface:** `App` stays the sole default export consumed by `src/main.jsx`.

### Known net gap (backlog bl-modularize-app-1, P2)
The smoke net counts `StationShell` `<section id>` elements, which mount regardless of
whether the inner block rendered (`renderBlock` has `default: return null`). So it catches a
*dropped lesson* (nav count) and *render throws*, but NOT a block renderer wired to the wrong
`type`. Before trusting it as a renderer-wiring gate, assert per-block-type output
(e.g. a `data-block-type` marker) — not just section counts.
