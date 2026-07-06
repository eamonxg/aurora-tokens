# @eamonxg/token-engine

OKLCH design-token derivation engine shared by
[luci-theme-aurora](https://github.com/eamonxg/luci-theme-aurora) and
[luci-theme-shadcn](https://github.com/eamonxg/luci-theme-shadcn): five color
operators and a spec-driven resolver. The engine is the *mechanism*; each
theme owns its *policy* (a `spec.js` of derivation rules and a `defaults.js`
of input colors) and binds it with `createResolver`.

## Usage

```js
import { createResolver } from "@eamonxg/token-engine";
import { DERIVATIONS } from "./spec.js";
import { DEFAULTS } from "./defaults.js";

const resolveTokens = createResolver(DERIVATIONS);
const light = resolveTokens("light", { ...DEFAULTS.light });
// -> { bg: "oklch(...)", text_muted: "oklch(...)", ... } flat literals only
```

Rules: `['mix',a,b,p]` `['shade',a,dl]` `['set',a,L,C]` `['alpha',a,p]`
`['const',str]` — `'const','var:x'` aliases token `x`. Rules may reference
inputs or other derived tokens; dependencies resolve recursively.

The operators (`mix`, `shade`, `set`, `alpha`, `konst`, `toOklch`) are also
exported individually. All output is serialized to flat `oklch()` literals —
no `color-mix()` / `var()` — so it can be baked into CSS or stored in UCI.

## Consumers

- **luci-theme-aurora / luci-theme-shadcn** — `.dev/tokens/resolve.js` binds
  each theme's spec at build time (`gen:tokens` bakes `_tokens.css`).
- **@eamonxg/aurora-tokens** — published from the aurora theme repo; bundles
  this engine with the aurora spec into a browser global for
  luci-app-aurora-config.

## Release

Bump `version` in `package.json`, tag `v<version>`, push the tag — CI
publishes to npm (requires the `NPM_TOKEN` repo secret).
