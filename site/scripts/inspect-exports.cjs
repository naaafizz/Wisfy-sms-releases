const fs = require("fs");
const c = fs.readFileSync("components/threeui-integration/star-portal/neuform-isolated/NeuformIsolatedEffects.tsx", "utf8");
console.log("=== exports ===");
console.log([...c.matchAll(/export\s+(?:function|const)\s+(\w+)/g)].map(m => m[1]).join(" | "));
const names = [...c.matchAll(/export\s+(?:function|const)\s+(\w+)/g)].map(m => m[1]);
for (const w of ["StarPortal", "IgnitionButton", "InductionButton", "PlasmaButton", "TactileButton", "ThinkingButton"]) {
  const hay = [...c.matchAll(new RegExp("\\b" + w + "\\b", "g"))].length;
  console.log(w, "occurrences:", hay);
}
