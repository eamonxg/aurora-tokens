/**
 * Copyright (C) 2025 eamonxg <eamonxiong@gmail.com>
 * Licensed under the Apache License, Version 2.0.
 */

import { mix, shade, set, alpha, konst, toOklch } from "./engine.js";

// Bind a theme's derivation spec ({ light: {token: rule}, dark: {...} }) to a
// resolver. Rules: ['mix',a,b,p] ['shade',a,dl] ['set',a,L,C] ['alpha',a,p]
// ['const',str] -- 'const','var:x' aliases token x. Rules may reference inputs
// or other derived tokens; dependencies resolve recursively.
export function createResolver(derivations) {
  // inputs: {name: colorString}. Returns flat {name: oklchString} values.
  return function resolveTokens(mode, inputs) {
    const derivs = derivations[mode];
    if (!derivs) throw new Error(`unknown mode: ${mode}`);
    const resolved = { ...inputs };

    const ref = (name) => {
      if (resolved[name] === undefined) compute(name);
      return resolved[name];
    };

    function compute(name) {
      const rule = derivs[name];
      if (!rule) throw new Error(`unknown derived token: ${name}`);
      const [op, ...args] = rule;
      let color;
      switch (op) {
        case "mix":
          color = mix(ref(args[0]), ref(args[1]), args[2]);
          break;
        case "shade":
          color = shade(ref(args[0]), args[1]);
          break;
        case "set":
          color = set(ref(args[0]), args[1], args[2]);
          break;
        case "alpha":
          color = alpha(ref(args[0]), args[1]);
          break;
        case "const":
          if (args[0].startsWith("var:")) {
            resolved[name] = ref(args[0].slice(4));
            return;
          }
          color = konst(args[0]);
          break;
        default:
          throw new Error(`unknown op: ${op}`);
      }
      resolved[name] = toOklch(color);
    }

    for (const name of Object.keys(derivs)) compute(name);
    return resolved;
  };
}
