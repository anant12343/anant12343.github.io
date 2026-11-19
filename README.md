# ananth.sm: portfolio

Next.js 15 (App Router) · TypeScript · Tailwind 3 · Framer Motion · static export.

```
content/            ← edit these, not components
  profile.ts          name, intro, contact, skills, education, achievements
  experience.ts       timeline
  projects.ts         every project + case-study text + image alt text
assets/raw/         ← your screenshots + headshot (inputs to the mockup script)
scripts/make-mockups/
  index.mjs           Playwright + sharp: device frames, covers, galleries, OG images
  art.py              matplotlib "illustrative" charts for projects without screenshots
public/images/      ← generated output (committed, so deploys don't need Playwright)
TODO.md             ← what's missing, by project
```

## Run locally

```bash
npm install
```

```bash
npm run dev
```

Open http://localhost:3000. In dev, every missing fact shows as a dashed orange **TODO** marker.
In a production build they are hidden (set `NEXT_PUBLIC_SHOW_TODOS=1` to show them).

```bash
npm run build && npm start
```

`build` writes a fully static site to `out/`; `start` serves it on http://localhost:3000.

## Deploy to Vercel (free)

1. Push this folder to a GitHub repo.
2. vercel.com → **Add New… → Project** → import the repo. Framework preset: **Next.js**. No settings to change.
3. Optional: **Settings → Environment Variables** → `NEXT_PUBLIC_SITE_URL=https://your-domain` (used for canonical URLs, sitemap and OG). Without it, the Vercel production URL is used automatically.

### Or GitHub Pages

```bash
NEXT_PUBLIC_BASE_PATH=/<repo-name> NEXT_PUBLIC_SITE_URL=https://<user>.github.io npm run build
```

Publish the `out/` folder (e.g. with the `actions/upload-pages-artifact` + `actions/deploy-pages` workflow) and add an empty `out/.nojekyll`.

## Swap in new screenshots and re-run the mockups

One-time setup on your machine (the script needs a headless Chromium and, for the resume preview, poppler):

```bash
npm i -D playwright && npx playwright install chromium
```

```bash
pip install matplotlib numpy
```

On macOS install poppler with `brew install poppler`; on Ubuntu, `sudo apt install poppler-utils`.

Then:

1. Drop files into `assets/raw/` named `<project-slug>__<anything>.png` (or `.jpg`/`.webp`), e.g. `pocket-scholar__home.png`.
   Phone screenshots: `<slug>__mobile-<anything>.png` → framed in an iPhone.
2. If that project currently uses generated art, delete its entry in the `SCENES` block (`buildScenes()` in `scripts/make-mockups/index.mjs`).
   Projects without an entry automatically get a tilted-laptop cover + browser-frame gallery from their screenshots.
3. Re-render:

   ```bash
   npm run mockups
   ```

   Or only some projects:

   ```bash
   npm run mockups -- pocket-scholar bayboard
   ```

4. Open `mockups-contact-sheet.html` to review every image.
5. Update the `gallery` alt text/captions for that project in `content/projects.ts` (the number of gallery entries must match the files `01.webp`, `02.webp`…).

New headshot: replace `assets/raw/headshot.png`. New resume: replace `resume.pdf` in the root. `npm run mockups` copies it to `public/` and refreshes the preview + OG image.
Illustrative charts: `npm run mockups:art` (only needed if you edit `art.py`).

## Design notes

- **Palette:** paper `#F4F3EF`, ink `#0E0E0E`, one accent: **safety orange `#FF5B1F`** (machine guards, CAD callouts, hi-vis: a nod to the mechanical-engineering start, and warm enough for a marketer). In light mode it's used for fills and large type only (orange text on paper fails WCAG), always with ink on top.
- **Type:** Archivo (variable width, set heavy at 112% width with tight tracking for the editorial headers) · Instrument Sans (body) · JetBrains Mono (labels). All self-hosted via `next/font/local`, so there are no third-party font requests.
- **Motion:** hero tiles rise in with a CSS stagger (paints without JavaScript, so it never delays LCP); sections reveal on scroll; featured cards lift and tilt toward the pointer; route changes slide the next page in. `prefers-reduced-motion` turns all of it off (`MotionConfig reducedMotion="user"` + CSS media query).
- **Honesty rules:** charts that aren't real project output are stamped *ILLUSTRATIVE*; dashboard numbers in BayBoard screenshots are labelled demo data; no logos in generated art.
