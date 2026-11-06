const fs = require("fs");
const c = fs.readFileSync("components/threeui-integration/star-portal/neuform-isolated/NeuformIsolatedEffects.tsx", "utf8");

const imports = [...c.matchAll(/import (\w+) from "\.\/sources\/([\w-]+)\.html\?raw";/g)].map(m => ({ id: m[1], file: m[2] }));
const usage = {};
for (const { id } of imports) {
  const re = new RegExp(`\\b${id}\\b`, "g");
  const matches = [...c.matchAll(re)].length;
  usage[id] = matches - 1; // minus the import itself
}
console.log("== source usage (id: refs after import) ==");
for (const { id, file } of imports) console.log(`${id.padEnd(24)} ${String(usage[id]).padStart(2)}  ${file}`);

// Which exported function bodies reference which?
for (const fn of ["StarPortal", "IgnitionButton", "InductionButton", "PlasmaButton", "TactileButton", "ThinkingButton"]) {
  const idx = c.indexOf(`export function ${fn}`);
  if (idx === -1) { console.log(fn, "NOT FOUND"); continue; }
  const next = [...["StarPortal", "IgnitionButton", "InductionButton", "PlasmaButton", "TactileButton", "ThinkingButton", "Elixir", "Quantum"]].map(n => c.indexOf(`export function ${n}`, idx + 1)).filter(i => i > idx);
  const body = c.slice(idx, Math.min(...(next.length ? next : [c.length])));
  const used = imports.filter(({ id }) => new RegExp(`\\b${id}\\b`).test(body.slice(10))).map(i => i.file);
  console.log(fn, "-> ", used.join(", ") || "(inline)");
}

const rl = fs.readFileSync("components/threeui-integration/star-portal/shader-buttons/RakingLightPillButton.tsx", "utf8");
console.log("== RakingLightPillButton imports ==");
console.log(rl.split("\n").filter(l => /import|three|window/.test(l)).slice(0, 14).join("\n"));
console.log("frag-mono font url in threeui.css:", fs.readFileSync("components/threeui-integration/star-portal/threeui.css", "utf8").match(/\.\/fonts\/[\w-]+\.woff2/g));
