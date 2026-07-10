// 10 editable input defaults for light/dark. Light is the "snow x blue hour"
// relight (2026-07: cool 235deg neutrals, purified status hues); dark is
// unchanged from v2 (commit 3c4c67a).
export const DEFAULTS = {
  light: {
    bg: "oklch(0.984 0.004 235)",
    surface: "oklch(1 0 0)",
    text: "oklch(0.215 0.02 250)",
    brand: "oklch(0.58 0.14 233)",
    on_brand: "oklch(1 0 0)",
    link: "oklch(0.58 0.14 233)", // intentionally equals brand
    info: "oklch(0.45 0.12 250)",
    warning: "oklch(0.4 0.09 72)",
    success: "oklch(0.38 0.1 172)",
    danger: "oklch(0.42 0.15 22)",
  },
  dark: {
    bg: "oklch(0.13 0.018 264)",
    surface: "oklch(0.21 0.02 264)",
    text: "oklch(0.985 0.002 264)",
    brand: "oklch(0.6 0.13 188.745)",
    on_brand: "oklch(1 0 0)",
    link: "oklch(0.6 0.13 188.745)", // intentionally equals brand
    info: "oklch(0.8 0.11 255)",
    warning: "oklch(0.82 0.13 80)",
    success: "oklch(0.72 0.13 158)",
    danger: "oklch(0.7 0.16 22)",
  },
};
