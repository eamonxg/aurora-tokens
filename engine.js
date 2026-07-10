/**
 * Copyright (C) 2025 eamonxg <eamonxiong@gmail.com>
 * Licensed under the Apache License, Version 2.0.
 */

import Color from "colorjs.io";

const C = (v) => (v instanceof Color ? v : new Color(v));

// color-mix(in oklab, a p%, b) => position toward b is (1 - p)
export const mix = (a, b, p) =>
  Color.mix(C(a), C(b), 1 - p, { space: "oklab", outputSpace: "oklch" });

export const shade = (a, dl) => {
  const c = C(a).to("oklch");
  c.coords[0] += dl;
  return c;
};

export const set = (a, L, Ch) => {
  const c = C(a).to("oklch");
  c.coords[0] = L;
  // An achromatic base (chroma ~0) has no meaningful hue: forcing chroma onto
  // it would invent a pink cast, so achromatic in stays achromatic out.
  const achromatic = c.coords[1] < 0.001 || Number.isNaN(c.coords[2]);
  c.coords[1] = achromatic ? 0 : Ch;
  return c;
};

export const alpha = (a, p) => {
  const c = C(a).to("oklch");
  c.alpha = p;
  return c;
};

export const konst = (s) => C(s).to("oklch");

// Serialize a Color (or string) to an oklch() literal -- no color-mix / var().
export const toOklch = (v) =>
  C(v).to("oklch").toString({ precision: 4, format: "oklch" });
