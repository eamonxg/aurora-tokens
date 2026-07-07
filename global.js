// Entry for dist/tokens.global.js -- the browser-global build vendored by
// luci-app-aurora-config. Bundled by build-global.mjs with `colorjs.io`
// aliased to the page's global `Color` (utils/color.global.js), so that must
// load first. Exposed as the global `AuroraTokens`.
import { DERIVATIONS } from "./spec.js";
import { DEFAULTS } from "./defaults.js";
import { resolveTokens } from "./resolve.js";

// The editable-input order is canonically the key order of defaults.js.
export const INPUTS = Object.keys(DEFAULTS.light);
export const DERIVED_KEYS = Object.keys(DERIVATIONS.light);
export { DERIVATIONS, DEFAULTS };
export const resolve = resolveTokens;
