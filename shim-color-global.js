// Build-time stand-in for the `colorjs.io` module: the browser-global build
// runs on pages where utils/color.global.js has already defined `Color`.
export default globalThis.Color;
