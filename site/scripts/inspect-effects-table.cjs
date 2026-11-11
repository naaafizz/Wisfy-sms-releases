const fs = require("fs");
const c = fs.readFileSync("components/threeui-integration/star-portal/neuform-isolated/NeuformIsolatedEffects.tsx", "utf8");

/* Find the EFFECTS definition table */
const tblIdx = c.indexOf("const EFFECTS");
const tbl = c.slice(tblIdx, tblIdx + 6000);
console.log(tbl.slice(0, 4600));
