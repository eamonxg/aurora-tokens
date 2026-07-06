import { test } from "node:test";
import assert from "node:assert/strict";
import { createResolver } from "../resolve.js";

// A minimal two-mode spec exercising every operator, aliasing, and
// derived-from-derived chaining.
const SPEC = {
  light: {
    text_muted: ["mix", "text", "bg", 0.6],
    surface_sunken: ["shade", "bg", -0.02],
    accent_surface: ["set", "accent", 0.94, 0.05],
    hairline: ["alpha", "text", 0.13],
    accent_end: ["const", "var:accent"],
    scrim: ["const", "oklch(0 0 0 / 0.6)"],
    accent_subtle: ["mix", "accent", "bg", 0.12],
    accent_subtle_hover: ["shade", "accent_subtle", -0.04],
  },
  dark: {
    text_muted: ["mix", "text", "bg", 0.5],
    surface_sunken: ["shade", "bg", 0.02],
    accent_surface: ["set", "accent", 0.32, 0.05],
    hairline: ["alpha", "text", 0.1],
    accent_end: ["const", "var:accent"],
    scrim: ["const", "oklch(0 0 0 / 0.6)"],
    accent_subtle: ["mix", "accent", "bg", 0.16],
    accent_subtle_hover: ["shade", "accent_subtle", 0.04],
  },
};

const INPUTS = {
  bg: "oklch(0.97 0.003 264)",
  text: "oklch(0.21 0.02 264)",
  accent: "oklch(0.58 0.14 233)",
};

const resolveTokens = createResolver(SPEC);

test("resolves every derived token to a flat oklch literal", () => {
  const out = resolveTokens("light", { ...INPUTS });
  for (const key of Object.keys(SPEC.light)) {
    assert.ok(out[key], `missing ${key}`);
    assert.ok(
      !out[key].includes("color-mix") && !out[key].includes("var("),
      `${key} not flat: ${out[key]}`,
    );
  }
});

test("'const','var:x' aliases another token verbatim", () => {
  const out = resolveTokens("light", { ...INPUTS });
  assert.equal(out.accent_end, out.accent);
});

test("derived tokens may depend on other derived tokens", () => {
  const out = resolveTokens("light", { ...INPUTS });
  assert.notEqual(out.accent_subtle_hover, out.accent_subtle);
});

test("inputs pass through untouched", () => {
  const out = resolveTokens("light", { ...INPUTS });
  assert.equal(out.bg, INPUTS.bg);
});

test("modes resolve independently", () => {
  const light = resolveTokens("light", { ...INPUTS });
  const dark = resolveTokens("dark", { ...INPUTS });
  assert.notEqual(light.surface_sunken, dark.surface_sunken);
});

test("unknown mode and unknown token throw", () => {
  assert.throws(() => resolveTokens("sepia", { ...INPUTS }), /unknown mode/);
  const broken = createResolver({ light: { x: ["const", "var:missing"] } });
  assert.throws(() => broken("light", {}), /unknown derived token/);
});
