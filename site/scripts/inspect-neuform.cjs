const fs = require("fs");
const c = fs.readFileSync("components/threeui-integration/star-portal/neuform-isolated/NeuformIsolatedEffects.tsx", "utf8");
console.log(c.split("\n").slice(0, 30).join("\n"));
console.log("--- imports:", [...c.matchAll(/from\s+["']([^"']+?)["']/g)].map(m => m[1]).filter(x => !/react/.test(x)).slice(0, 12).join(" | "));
console.log("--- window/ssr guards presence:", /useEffect/.test(c), /client-only/.test(c));
