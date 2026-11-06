const fs = require("fs");
const c = fs.readFileSync("components/threeui-integration/star-portal/shader-buttons/sources/button-index.html", "utf8");
const i = c.indexOf('data-index="4"');
console.log("--- context around row 4 ---");
console.log(c.slice(i - 400, i + 700).replace(/\s+/g, " "));
// find CSS for .stage
const cssIdx = c.indexOf(".stage {");
console.log("--- .stage css ---");
console.log(c.slice(cssIdx, cssIdx + 400));
const frame = c.indexOf(".stage-frame {");
if (frame > -1) console.log("--- .stage-frame css ---\n" + c.slice(frame, frame + 400));
const btn = c.indexOf(".button-list {");
console.log("--- button-list css ---\n" + c.slice(btn, btn + 300));
