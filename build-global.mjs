// Build dist/tokens.global.js: the aurora spec + token engine bundled as the
// browser global `AuroraTokens`, with colorjs.io aliased to the page's global
// `Color`. Runs on prepublishOnly; luci-app-aurora-config vendors the result
// by pinned package version.
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildSync } from "esbuild";

const here = dirname(fileURLToPath(import.meta.url));
const { name, version } = JSON.parse(
  readFileSync(resolve(here, "package.json"), "utf8"),
);

buildSync({
  entryPoints: [resolve(here, "global.js")],
  bundle: true,
  format: "iife",
  globalName: "AuroraTokens",
  target: "es2020",
  alias: { "colorjs.io": resolve(here, "shim-color-global.js") },
  outfile: resolve(here, "dist/tokens.global.js"),
  banner: {
    js: `/**
 * ${name} v${version} -- GENERATED, DO NOT EDIT.
 * Aurora design-token engine (browser global). Built from spec.js/defaults.js
 * + engine.js by build-global.mjs. Depends on the global \`Color\`
 * (utils/color.global.js in luci-app-aurora-config); load that first.
 */`,
  },
});

console.log(`build-global: dist/tokens.global.js (${name} v${version})`);
