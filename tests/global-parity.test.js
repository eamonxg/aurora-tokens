import { test } from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFile } from "node:fs/promises";
import Color from "colorjs.io";
import { DERIVATIONS } from "../spec.js";
import { DEFAULTS } from "../defaults.js";
import { resolveTokens } from "../resolve.js";

// The published dist must behave identically to the ESM engine it was built
// from. Runs on prepublishOnly, so a broken bundle can't reach npm.
test("dist/tokens.global.js matches the ESM engine token-for-token", async () => {
  const sandbox = { Color };
  vm.createContext(sandbox);
  vm.runInContext(
    await readFile(new URL("../dist/tokens.global.js", import.meta.url), "utf8"),
    sandbox,
  );
  const global = sandbox.AuroraTokens;
  assert.ok(global, "dist exposes the AuroraTokens global");

  assert.deepEqual(Array.from(global.INPUTS), Object.keys(DEFAULTS.light));
  assert.deepEqual(
    Array.from(global.DERIVED_KEYS),
    Object.keys(DERIVATIONS.light),
  );

  for (const mode of ["light", "dark"]) {
    const fromDist = global.resolve(mode, { ...DEFAULTS[mode] });
    const fromEsm = resolveTokens(mode, { ...DEFAULTS[mode] });
    assert.deepEqual({ ...fromDist }, fromEsm, `${mode} output parity`);
  }
});
