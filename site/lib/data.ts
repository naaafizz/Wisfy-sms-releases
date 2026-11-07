/* Central site data — mirrors the repo's OTA manifest + release artifacts.
   The running page ALSO re-fetches ../version.json (same feed the Android
   app polls), so a fresh release pushed to main replaces these figures
   for every visitor without a rebuild. */

import manifestJson from "../../version.json";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const IMG = (name: string) => `${BASE}/images/${name}`;

export type Manifest = {
  versionCode: number;
  versionName: string;
  releaseNotes: string;
  downloadUrl: string;
  isMandatory: boolean;
};

export const MANIFEST: Manifest = manifestJson;

export type Release = {
  file: string;
  label: string;
  sub: string;
  size: string;
  url: string;
  latest?: boolean;
  rolling?: boolean;
};

/* Order: newest release first · the rolling "Wis-sms.apk" latest build
   always sits at the very bottom of the list. */
export const RELEASES: Release[] = [
  {
    file: "Wis-sms-v1.0.11.apk",
    label: "v1.0.11",
    sub: "Latest release · current OTA channel",
    size: "32.8 MB",
    url: "https://github.com/naaafizz/Wisfy-sms-releases/raw/main/releases/Wis-sms-v1.0.11.apk",
    latest: true,
  },
  {
    file: "Wis-sms-v1.0.10.apk",
    label: "v1.0.10",
    sub: "Archived release",
    size: "32.7 MB",
    url: "https://github.com/naaafizz/Wisfy-sms-releases/raw/main/releases/Wis-sms-v1.0.10.apk",
  },
  {
    file: "Wis-sms.apk",
    label: "Wis-sms.apk",
    sub: "Rolling latest build — always the freshest artifact",
    size: "33.2 MB",
    url: "https://github.com/naaafizz/Wisfy-sms-releases/raw/main/releases/Wis-sms.apk",
    rolling: true,
  },
];

export const ROLLING_APK = RELEASES[RELEASES.length - 1];

export const PROVIDERS = [
  { name: "bKash", img: IMG("BKASH.png") },
  { name: "Nagad", img: IMG("nAGAD.png") },
  { name: "Rocket", img: IMG("ROCKET.png") },
  { name: "Upay", img: IMG("uPAY.png") },
  { name: "Cellfin", img: IMG("cellfin.png") },
  { name: "DBBL", img: IMG("dbbl.png") },
  { name: "City Bank", img: IMG("city-bank.png") },
];

export const NOTES = (notes: string) =>
  (notes ?? "")
    .split("•")
    .map((s) => s.trim())
    .filter(Boolean);

/** Try the same candidate paths the old static pages used, so the page
    works at /web/, at the repo root, and under GitHub Pages subpaths. */
export async function fetchLiveManifest(): Promise<Manifest | null> {
  const candidates = ["../version.json", "./version.json", "/version.json"];
  for (const path of candidates) {
    try {
      const separator = path.includes("?") ? "&" : "?";
      const r = await fetch(`${path}${separator}_=${Date.now()}`, { cache: "no-store" });
      if (!r.ok) continue;
      const m = (await r.json()) as Manifest;
      if (
        m &&
        Number.isInteger(m.versionCode) &&
        m.versionName &&
        m.downloadUrl &&
        typeof m.releaseNotes === "string"
      ) {
        return m;
      }
    } catch {
      /* next candidate */
    }
  }
  return null;
}
