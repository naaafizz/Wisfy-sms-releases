const fs = require("fs");
const c = fs.readFileSync("components/threeui-integration/star-portal/neuform-isolated/NeuformIsolatedEffects.tsx", "utf8");
function body(fn) {
  const idx = c.indexOf(`export function ${fn}`);
  const nexts = ["export function ", "export const "].map(k => c.indexOf(k, idx + 8)).filter(i => i > idx);
  return c.slice(idx, nexts.length ? Math.min(...nexts) : c.length);
}
for (const fn of ["StarPortal", "IgnitionButton", "InductionButton", "PlasmaButton", "TactileButton", "ThinkingButton"]) {
  const b = body(fn);
  const srcs = [...b.matchAll(/(\w+Source)\b/g)].map(m => m[1]);
  console.log("===", fn, "len", b.length, "===");
  console.log([...new Set(srcs)].join(", "));
}
