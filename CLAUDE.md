# CLAUDE.md

Guidance for agents working in this repository.

## What it is

`string-interpolation-parser` is a tiny, **isomorphic** (browser + Node >= 12)
single-function library. Given a map of parameters and a context object, it
returns the map with every `{{ token }}` placeholder replaced by the matching
context value. Zero runtime dependencies; bundled types.

## Commands

- `npm test` — the suite (Vitest). `npm run test:watch` for watch mode.
- `npm run test:coverage` — tests + coverage (v8), enforced at 100%.
- `npm run lint` — ESLint (flat config) + typescript-eslint.
- `npm run format` — Prettier (`format:check` to check only).
- `npm run typecheck` — `tsc --noEmit`.
- `npm run build` — tsup produces `dist/` (ESM `index.js`, CJS `index.cjs`, `.d.ts`), ES2015 target.
- `npm run docs:dev` / `docs:build` — the VitePress site under `website/`.

## Architecture

- Source is split into three files:
  - `src/types.ts` — public types (`Context`, `Params`, `ParsedResult`).
  - `src/parser.ts` — the `parser` function plus pure helpers (`parseToken`
    parses a token into path/filters/fallback, `resolveValue` walks a path through
    the context, `applyFilters` runs the pipe chain, `renderToken`/`resolveToken`
    produce the string/raw result, `interpolate` replaces every `{{ token }}`).
  - `src/index.ts` — the entry point; re-exports `parser` (default + named) and
    the types (`Context`, `Params`, `ParsedResult`, `Options`, `Transform`).
- Stable public API: `parser(params, context)`; `default` and named exports;
  `require('string-interpolation-parser')` returns the function (a footer in
  `tsup.config.ts` reassigns `module.exports = parser` and re-attaches `.parser`
  and `.default`, preserving v1 behaviour).
- **Compatibility:** use universal JavaScript only (no Node-only APIs). Write
  modern TS; tsup transpiles to ES2015.

## Behaviour

Defaults (no `options`, no new syntax) are frozen and match v1:

- Only `string` and `number` parameter values survive into the result.
- Numbers pass through untouched; strings are interpolated.
- Tokens are `{{ path }}`; whitespace inside the braces is ignored.
- Paths support dot and bracket notation (`a.b[0].c`).
- A missing or falsy step resolves to an empty string; nothing throws.

Additive, opt-in features (only active when their syntax/option is used):

- **Fallbacks** — `{{ path || literal }}` fills an otherwise-empty render
  (quote the literal to keep spaces).
- **Filters** — `{{ path | name: arg }}`, chainable, resolved from
  `options.transforms`; an unregistered transform throws.
- **Escaping** — `\{{ ... }}` emits the braces literally.
- **`options.passthrough`** — keep non-string/number params instead of dropping them.
- **`options.raw`** — a whole-string single token resolves to its real-typed value.

Any change to the default behaviour is breaking — version via semver. New options
and token syntax must stay additive with defaults that preserve current output.

## Conventions

- Conventional Commits.
- Strict TypeScript; keep the public types in sync with behaviour.
- All committed content (docs, comments, commit messages) is written in
  Australian English (en-AU).

## Release

- CI runs on every branch push and PR (Node 20/22 matrix: lint, format check,
  typecheck, test + coverage, build). The dev toolchain needs Node 20+; the
  published library still targets ES2015 / Node >= 12.
- Publishing = create a GitHub Release; the `release.yml` workflow publishes to
  npm via `NPM_TOKEN` with provenance. Bump the version in `package.json` first.
- The docs site deploys to GitHub Pages via `pages.yml` on push to `master`.
- Repository secrets required: `NPM_TOKEN` (publish) and `CODECOV_TOKEN` (coverage).
