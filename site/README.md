# Wisfy SMS Site (Next.js)

Premium animated single-page site for the Wisfy SMS release feed. Static export — the
built output in `out/` can be dropped into `web/`, GitHub Pages, or any static host.

## Commands

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static export → out/
```

## Deploy notes

- The page reads `version.json` at startup, then checks it every 60 seconds and when a
  background tab becomes active. Pushing a new release to `version.json` on `main`
  updates the published version and download links without a rebuild.
- If serving from a **sub-path** (e.g. GitHub Pages `repo.github.io/Wisfy-sms-releases/`),
  build with the base path:
  - add `basePath: "/Wisfy-sms-releases"` to `next.config.mjs`
  - build with `NEXT_PUBLIC_BASE_PATH=/Wisfy-sms-releases npm run build`
- `_refptr` / images: all images live in `public/images/`.
