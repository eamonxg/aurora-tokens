# @eamonxg/aurora-tokens

Aurora design-token model in one package:

- **engine.js** — five OKLCH operators (`mix` / `shade` / `set` / `alpha` / `const`) and `createResolver` (import via `@eamonxg/aurora-tokens/engine` to reuse the mechanism with your own spec)
- **spec.js / defaults.js** — the Aurora derivation rules and default palette (the single source of truth)
- **resolve.js** — `resolveTokens(mode, inputs)` / `resolveMode(mode)` bound to the Aurora spec
- **dist/tokens.global.js** — prebuilt browser IIFE (`AuroraTokens` global; expects a `Color` global from colorjs.io), built on publish

## Consumers

- [luci-theme-aurora](https://github.com/eamonxg/luci-theme-aurora) imports the ESM model at build time to generate its CSS variables.
- [luci-app-aurora-config](https://github.com/eamonxg/luci-app-aurora-config) vendors `dist/tokens.global.js` by pinned version (`scripts/sync-tokens.mjs`).

## Versioning

Independent semver. Removing/renaming a token or changing derivation semantics is **major**; adding a token is **minor**; value tweaks are **patch**.

## Release

Tag `vX.Y.Z` (matching package.json) and push — CI tests and publishes with the repo's `NPM_TOKEN` secret.
