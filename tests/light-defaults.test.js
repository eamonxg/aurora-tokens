import { test } from "node:test";
import assert from "node:assert/strict";
import Color from "colorjs.io";
import { resolveMode, resolveTokens } from "../index.js";
import { DEFAULTS } from "../defaults.js";

const lch = (s) => {
  const c = new Color(s).to("oklch");
  return { L: c.coords[0], C: c.coords[1], H: c.coords[2] || 0, a: c.alpha };
};

test("light neutrals are the snow-blue family (hue ~235, bg L >= 0.98)", () => {
  const l = resolveMode("light");
  assert.equal(l.bg, "oklch(0.984 0.004 235)");
  assert.equal(l.surface, "oklch(1 0 0)");
  assert.equal(l.text, "oklch(0.215 0.02 250)");
});

test("light status inputs are the purified cool set", () => {
  const l = resolveMode("light");
  assert.equal(l.info, "oklch(0.45 0.12 250)");
  assert.equal(l.warning, "oklch(0.4 0.09 72)");
  assert.equal(l.success, "oklch(0.38 0.1 172)");
  assert.equal(l.danger, "oklch(0.42 0.15 22)");
});

test("light recessed surfaces carry a visible icy tint (not grey)", () => {
  const l = resolveMode("light");
  const sunken = lch(l.surface_sunken);
  assert.ok(Math.abs(sunken.L - 0.975) < 0.002 && Math.abs(sunken.C - 0.005) < 0.002, `sunken: ${l.surface_sunken}`);
  const hover = lch(l.hover_faint);
  assert.ok(Math.abs(hover.L - 0.95) < 0.002 && Math.abs(hover.C - 0.006) < 0.002, `hover: ${l.hover_faint}`);
});

test("light mega-menu: icy opaque panel, cool blue-black scrim", () => {
  const l = resolveMode("light");
  const panel = lch(l.mega_menu_bg);
  assert.ok(Math.abs(panel.L - 0.972) < 0.002, `panel L: ${l.mega_menu_bg}`);
  assert.ok(Math.abs(panel.C - 0.008) < 0.002, `panel C: ${l.mega_menu_bg}`);
  assert.ok(Math.abs(panel.H - 235) < 4, `panel H: ${l.mega_menu_bg}`);
  assert.equal(panel.a, 1, "panel must stay opaque");
  const scrim = lch(l.mega_menu_scrim);
  assert.ok(scrim.C > 0.02, `scrim must be cool-tinted: ${l.mega_menu_scrim}`);
  assert.ok(Math.abs(scrim.a - 0.38) < 0.01, `scrim alpha: ${l.mega_menu_scrim}`);
});

test("control_bg aliases the per-mode recessed fill (no component-level dark forks)", () => {
  const l = resolveMode("light");
  const d = resolveMode("dark");
  assert.equal(l.control_bg, l.surface_overlay);
  assert.equal(d.control_bg, d.surface_sunken);
});

test("brand family and dark mode are untouched by the relight", () => {
  const l = resolveMode("light");
  assert.equal(l.brand, "oklch(0.58 0.14 233)");
  assert.equal(l.link, l.brand);
  const d = resolveMode("dark");
  assert.equal(d.bg, "oklch(0.13 0.018 264)");
  assert.equal(d.mega_menu_scrim, "oklch(0% 0 0 / 0.5)");
});

test("set on an achromatic base stays achromatic (no invented pink hue)", () => {
  const l = resolveTokens("light", { ...DEFAULTS.light, bg: "oklch(0.99 0 0)" });
  const sunken = lch(l.surface_sunken);
  assert.equal(sunken.C, 0, `achromatic bg must not gain chroma: ${l.surface_sunken}`);
});
