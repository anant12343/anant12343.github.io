#!/usr/bin/env node
/**
 * make-mockups: renders every project's cover, gallery and OG image.
 *
 *   npm run mockups:art   # (optional) regenerate illustrative matplotlib charts
 *   npm run mockups       # render everything
 *   npm run mockups -- bayboard ai-lead-routing   # only some projects
 *
 * Inputs
 *   assets/raw/<slug>__<anything>.(png|jpg|webp)  your screenshots
 *   assets/raw/<slug>__mobile-<anything>.png       phone screenshots (go in an iPhone frame)
 *   assets/raw/headshot.(png|jpg)                  headshot
 *   scripts/make-mockups/.cache/art/*.png          illustrative charts from art.py
 *
 * Outputs
 *   public/images/projects/<slug>/cover.webp  (1600×1000, 16:10, tilted device)
 *   public/images/projects/<slug>/01.webp…    (1600×1000 gallery)
 *   public/images/projects/<slug>/og.png      (1200×630)
 *   public/images/headshot.webp, public/og.png, app/apple-icon.png
 *   mockups-contact-sheet.html (+ .jpg)       review page with every image
 *
 * Projects with hand-made SCENES below use them. Any project WITHOUT scenes that has
 * screenshots in assets/raw/ gets an automatic laptop cover + browser-frame gallery.
 * Projects whose generated art you want to replace with real screenshots: delete their
 * entry in SCENES (or keep it and edit) and re-run.
 */
import { createRequire } from "node:module";
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

// Playwright: uses the project copy if installed (npm i -D playwright), else a global one.
const { chromium } = createRequire(import.meta.url)("playwright");

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");
const RAW = path.join(ROOT, "assets/raw");
const CACHE = path.join(HERE, ".cache");
const ART = path.join(CACHE, "art");
const CROPS = path.join(CACHE, "crops");
const OUT = path.join(ROOT, "public/images/projects");
fs.mkdirSync(CROPS, { recursive: true });

const C = {
  paper: "#F4F3EF",
  paper2: "#EAE8E1",
  ink: "#0E0E0E",
  ink2: "#1C1C1B",
  accent: "#FF5B1F",
  muted: "#8A877F",
  line: "#D9D6CE",
};
const url = (p) => pathToFileURL(p).href;
const font = (f) => url(path.join(ROOT, "app/fonts", f));

// ─── 1. Crops of your raw screenshots ────────────────────────────────────────
// [source file, sharp extract region]. Browser chrome / taskbars are cropped away.
const CROP_SPEC = {
  "bayboard-full": ["bayboard__dashboard.png", { left: 0, top: 28, width: 1900, height: 1038 }],
  "bayboard-kpis": ["bayboard__dashboard.png", { left: 0, top: 28, width: 1900, height: 345 }],
  "bayboard-charts": ["bayboard__dashboard.png", { left: 80, top: 386, width: 1745, height: 384 }],
  "make-full": ["ai-lead-routing__make-scenario.png", { left: 100, top: 112, width: 1817, height: 1026 }],
  "make-flow": ["ai-lead-routing__make-scenario.png", { left: 160, top: 470, width: 1690, height: 310 }],
  "make-router": ["ai-lead-routing__make-scenario.png", { left: 740, top: 470, width: 760, height: 320 }],
  "nomercy-full": ["no-mercy__setup.webp", { left: 0, top: 102, width: 1555, height: 1036 }],
  "nomercy-panel": ["no-mercy__setup.webp", { left: 832, top: 308, width: 648, height: 688 }],
  "tokamak-full": ["tokamak-lab__cutaway.webp", { left: 4, top: 102, width: 1554, height: 1036 }],
  "tokamak-panel": ["tokamak-lab__cutaway.webp", { left: 1102, top: 176, width: 440, height: 950 }],
  "tokamak-readout": ["tokamak-lab__cutaway.webp", { left: 20, top: 1012, width: 520, height: 116 }],
  "breathe-full": ["breatheride__3d-model.png", { left: 0, top: 102, width: 1522, height: 1036 }],
  "breathe-model": ["breatheride__3d-model.png", { left: 222, top: 248, width: 1058, height: 580 }],
};

// Poster PDF (assets/raw/pocket-scholar__poster.pdf) → PNG at 150 dpi (1241×1755), plus section crops.
const POSTER_CROPS = {
  "poster-full": null,
  "poster-pillars": { left: 55, top: 560, width: 1132, height: 420 },
  "poster-role": { left: 55, top: 1000, width: 1132, height: 375 },
  "poster-roadmap": { left: 55, top: 1375, width: 1132, height: 275 },
};
async function makePosterCrops(out) {
  const pdf = path.join(RAW, "pocket-scholar__poster.pdf");
  if (!fs.existsSync(pdf)) return;
  const { execFileSync } = await import("node:child_process");
  const base = path.join(CROPS, "poster");
  try {
    execFileSync("pdftoppm", ["-r", "150", "-png", "-singlefile", pdf, base]);
  } catch {
    console.warn("  ! pdftoppm (poppler) not found: poster skipped");
    return;
  }
  const meta = await sharp(`${base}.png`).metadata();
  for (const [key, region] of Object.entries(POSTER_CROPS)) {
    const dest = path.join(CROPS, `${key}.png`);
    if (region) await sharp(`${base}.png`).extract(region).png().toFile(dest);
    else fs.copyFileSync(`${base}.png`, dest);
    out[key] = { src: dest, w: region ? region.width : meta.width, h: region ? region.height : meta.height };
  }
}

async function makeCrops() {
  const out = {};
  await makePosterCrops(out);
  for (const [key, [file, region]] of Object.entries(CROP_SPEC)) {
    const src = path.join(RAW, file);
    if (!fs.existsSync(src)) continue;
    const dest = path.join(CROPS, `${key}.png`);
    await sharp(src).extract(region).png().toFile(dest);
    out[key] = { src: dest, w: region.width, h: region.height };
  }
  return out;
}

// ─── 2. Building blocks (HTML/CSS) ───────────────────────────────────────────
const BASE_CSS = `
@font-face{font-family:Archivo;src:url(${font("Archivo.woff2")}) format("woff2");font-weight:100 900;font-stretch:62% 125%}
@font-face{font-family:Inst;src:url(${font("InstrumentSans.woff2")}) format("woff2");font-weight:400 700;font-stretch:75% 100%}
@font-face{font-family:Mono;src:url(${font("JetBrainsMono.woff2")}) format("woff2");font-weight:100 800}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Inst,sans-serif;color:${C.ink};-webkit-font-smoothing:antialiased}
.disp{font-family:Archivo;font-weight:800;font-stretch:112%;letter-spacing:-.035em;line-height:.92}
.mono{font-family:Mono;text-transform:uppercase;letter-spacing:.08em;font-size:13px}
.stage{position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center}
.stage.paper{background:${C.paper};background-image:radial-gradient(${C.line} 1.2px,transparent 1.2px);background-size:28px 28px}
.stage.ink{background:${C.ink};background-image:radial-gradient(#2a2a28 1.2px,transparent 1.2px);background-size:28px 28px;color:${C.paper}}
.stage.accent{background:${C.accent}}
.corner{position:absolute;font-family:Mono;font-size:13px;letter-spacing:.1em;text-transform:uppercase;opacity:.55}
.tl{top:34px;left:40px}.br{bottom:34px;right:40px}.tr{top:34px;right:40px}.bl{bottom:34px;left:40px}
.tilt{transform:perspective(2600px) rotateX(9deg) rotateY(-16deg) rotateZ(2.5deg);transform-style:preserve-3d}
.tilt-r{transform:perspective(2600px) rotateX(9deg) rotateY(16deg) rotateZ(-2.5deg)}
.shadow{box-shadow:0 2px 4px rgba(0,0,0,.06),0 30px 60px -10px rgba(14,14,14,.28),0 80px 120px -30px rgba(14,14,14,.35)}
.screen{position:relative;overflow:hidden;background:#fff}
.screen>.native{transform-origin:0 0;position:absolute;top:0;left:0}
.browser{border-radius:14px;overflow:hidden;background:#fff}
.browser .bar{height:46px;display:flex;align-items:center;gap:9px;padding:0 18px;background:#ECEAE4;border-bottom:1px solid ${C.line}}
.browser.dark .bar{background:#1F1F1E;border-color:#2c2c2a}
.dot{width:12px;height:12px;border-radius:50%;background:#CFCBC2}
.browser.dark .dot{background:#3a3a38}
.urlbar{margin-left:18px;flex:1;max-width:520px;height:28px;border-radius:8px;background:#fff;font-family:Mono;font-size:12.5px;display:flex;align-items:center;padding:0 12px;color:${C.muted};letter-spacing:.02em}
.browser.dark .urlbar{background:#2A2A28;color:#9a958c}
.laptop .lid{background:#141413;border-radius:26px 26px 6px 6px;padding:22px 22px 30px;position:relative}
.laptop .lid:before{content:"";position:absolute;top:9px;left:50%;width:7px;height:7px;margin-left:-3px;border-radius:50%;background:#2b2b2a}
.laptop .base{height:22px;margin:0 -7%;background:linear-gradient(#d7d4cc,#a9a59c);border-radius:2px 2px 18px 18px;position:relative}
.laptop .base:before{content:"";position:absolute;left:50%;top:0;width:16%;margin-left:-8%;height:8px;background:#bdb9b0;border-radius:0 0 10px 10px}
.phone{background:#141413;border-radius:58px;padding:14px;position:relative}
.phone .screen{border-radius:46px}
.phone:after{content:"";position:absolute;top:26px;left:50%;width:110px;height:30px;margin-left:-55px;border-radius:20px;background:#141413}
.sheet{background:#fff;border-radius:6px}
`;

/** A piece of screen content with a native size; frames scale it to fit. */
const shot = (crop, opts = {}) => ({
  w: crop.w,
  h: crop.h,
  html: `<img src="${url(crop.src)}" style="display:block;width:${crop.w}px;height:${crop.h}px;${opts.style || ""}">`,
});
const native = (html, w = 1440, h = 900, bg = "#fff") => ({
  w,
  h,
  html: `<div style="width:${w}px;height:${h}px;background:${bg};position:relative;overflow:hidden">${html}</div>`,
});
function screenBox(content, width) {
  const s = width / content.w;
  const h = Math.round(content.h * s);
  return `<div class="screen" style="width:${width}px;height:${h}px"><div class="native" style="transform:scale(${s})">${content.html}</div></div>`;
}
const browser = (content, width, { title = "", dark = false } = {}) =>
  `<div class="browser shadow ${dark ? "dark" : ""}" style="width:${width}px"><div class="bar"><span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="urlbar">${title}</span></div>${screenBox(content, width)}</div>`;
const laptop = (content, width) =>
  `<div class="laptop" style="width:${width}px"><div class="lid shadow">${screenBox(content, width - 44)}</div><div class="base"></div></div>`;
const phone = (content, width) => `<div class="phone shadow" style="width:${width}px">${screenBox(content, width - 28)}</div>`;

function stage({ w = 1600, h = 1000, bg = "paper", body, label = "", fig = "" }) {
  return `<div class="stage ${bg}" style="width:${w}px;height:${h}px">
    <span class="corner tl">A·S·M — ${label}</span><span class="corner br">${fig}</span>${body}</div>`;
}

// ─── 3. Slide / diagram templates (native 1440×900) ──────────────────────────
const kick = (t, col = C.accent) => `<div class="mono" style="color:${col};font-size:16px;margin-bottom:26px">${t}</div>`;
const illus = (t = "Framework only · no findings shown") =>
  `<div class="mono" style="position:absolute;bottom:40px;right:56px;font-size:13px;color:${C.muted}">${t}</div>`;

const slides = {
  title: ({ kicker, title, sub, chips = [], bg = C.paper, fg = C.ink, size = 150 }) =>
    native(
      `<div style="padding:96px 104px;height:100%;display:flex;flex-direction:column;justify-content:space-between;color:${fg}">
        <div>${kick(kicker)}<div class="disp" style="font-size:${size}px">${title}</div></div>
        <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:40px">
          <div style="font-size:30px;max-width:820px;line-height:1.25;opacity:.8">${sub || ""}</div>
          <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:flex-end">${chips
            .map((c, i) => `<span class="mono" style="font-size:15px;padding:12px 18px;border-radius:999px;${i === 0 ? `background:${C.accent};color:${C.ink}` : `border:1.5px solid currentColor`}">${c}</span>`)
            .join("")}</div></div></div>`,
      1440,
      900,
      bg
    ),
  pillars: ({ kicker, title, items }) =>
    native(
      `<div style="padding:90px 96px">${kick(kicker)}<div class="disp" style="font-size:84px;margin-bottom:64px">${title}</div>
       <div style="display:grid;grid-template-columns:repeat(${items.length},1fr);gap:24px">${items
         .map(
           (it, i) => `<div style="border-radius:24px;padding:36px;height:420px;display:flex;flex-direction:column;justify-content:space-between;background:${i === 0 ? C.accent : i === 1 ? C.ink : "#fff"};color:${i === 1 ? C.paper : C.ink};border:${i === 2 ? `1.5px solid ${C.line}` : "none"}">
              <div class="mono" style="font-size:16px">0${i + 1}</div><div><div class="disp" style="font-size:54px;margin-bottom:16px">${it.h}</div><div style="font-size:22px;line-height:1.35;opacity:.8">${it.p || ""}</div></div></div>`
         )
         .join("")}</div></div>`,
      1440,
      900,
      C.paper
    ),
  process: ({ kicker, title, steps, note }) =>
    native(
      `<div style="padding:90px 96px">${kick(kicker)}<div class="disp" style="font-size:84px;margin-bottom:90px">${title}</div>
       <div style="display:flex;align-items:stretch;gap:0">${steps
         .map(
           (s, i) => `<div style="flex:1;display:flex;align-items:center">
             <div style="flex:1;border:2px solid ${i === steps.length - 1 ? C.accent : C.ink};background:${i === steps.length - 1 ? C.accent : "#fff"};border-radius:20px;padding:30px 26px;height:250px;display:flex;flex-direction:column;justify-content:space-between">
               <div class="mono" style="font-size:15px;color:${i === steps.length - 1 ? C.ink : C.muted}">Step 0${i + 1}</div>
               <div style="font-family:Archivo;font-weight:700;font-size:32px;line-height:1.05;letter-spacing:-.02em">${s}</div></div>
             ${i < steps.length - 1 ? `<div style="width:46px;text-align:center;font-size:36px;color:${C.ink}">→</div>` : ""}</div>`
         )
         .join("")}</div>${note ? illus(note) : ""}</div>`,
      1440,
      900,
      C.paper
    ),
  grid: ({ kicker, title, cols, rows, highlight = [] }) =>
    native(
      `<div style="padding:84px 96px">${kick(kicker)}<div class="disp" style="font-size:76px;margin-bottom:48px">${title}</div>
       <table style="width:100%;border-collapse:collapse;font-size:22px">
        <tr><th></th>${cols.map((c) => `<th class="mono" style="text-align:left;padding:0 0 16px;font-size:15px;color:${C.muted};font-weight:400">${c}</th>`).join("")}</tr>
        ${rows
          .map(
            (r, i) => `<tr style="border-top:1.5px solid ${C.line}"><td style="padding:16px 0;font-family:Archivo;font-weight:700;width:300px;${highlight.includes(i) ? `color:${C.accent}` : ""}">${r}</td>${cols
              .map(() => `<td style="padding:16px 12px 16px 0"><div style="height:16px;border-radius:8px;background:${C.paper2};width:${55 + ((i * 7 + r.length * 3) % 40)}%"></div></td>`)
              .join("")}</tr>`
          )
          .join("")}</table></div>${illus("Structure only · cells intentionally blank")}`,
      1440,
      900,
      C.paper
    ),
  twoByTwo: ({ kicker, title, x, y, quads, dots = [], note }) =>
    native(
      `<div style="padding:80px 96px;display:grid;grid-template-columns:420px 1fr;gap:64px;height:100%">
        <div>${kick(kicker)}<div class="disp" style="font-size:70px">${title}</div></div>
        <div style="position:relative;margin:20px 0 70px 40px">
          <div style="position:absolute;inset:0;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:10px">${quads
            .map((q, i) => `<div style="border-radius:18px;padding:24px;background:${i === 1 ? C.accent : i === 2 ? C.ink : "#fff"};color:${i === 2 ? C.paper : C.ink};border:1.5px solid ${i === 1 || i === 2 ? "transparent" : C.line};font-family:Archivo;font-weight:700;font-size:28px;letter-spacing:-.01em">${q}</div>`)
            .join("")}</div>
          ${dots
            .map((d) => `<div style="position:absolute;left:${d.x}%;top:${d.y}%;transform:translate(-50%,-50%);display:flex;align-items:center;gap:10px"><span style="width:30px;height:30px;border-radius:50%;background:${d.c || C.accent};border:4px solid #fff;box-shadow:0 4px 12px rgba(0,0,0,.2)"></span><span class="mono" style="font-size:18px;font-weight:700;background:#fff;padding:4px 10px;border-radius:6px">${d.t}</span></div>`)
            .join("")}
          <div class="mono" style="position:absolute;bottom:-48px;left:0;right:0;text-align:center;font-size:15px;color:${C.muted}">${x} →</div>
          <div class="mono" style="position:absolute;left:-44px;top:50%;transform:rotate(-90deg) translateX(50%);transform-origin:left;font-size:15px;color:${C.muted};white-space:nowrap">${y} →</div>
        </div></div>${illus(note)}`,
      1440,
      900,
      C.paper
    ),
  journey: ({ kicker, title, stages, lanes }) =>
    native(
      `<div style="padding:84px 96px">${kick(kicker)}<div class="disp" style="font-size:76px;margin-bottom:52px">${title}</div>
       <div style="display:grid;grid-template-columns:180px repeat(${stages.length},1fr);gap:10px;font-size:20px">
        <div></div>${stages.map((s, i) => `<div style="background:${i === stages.length - 1 ? C.accent : C.ink};color:${i === stages.length - 1 ? C.ink : C.paper};padding:18px 20px;border-radius:12px;font-family:Archivo;font-weight:700;font-size:26px">${s}</div>`).join("")}
        ${lanes
          .map(
            (l) => `<div class="mono" style="display:flex;align-items:center;font-size:15px;color:${C.muted}">${l}</div>${stages
              .map((_, j) => `<div style="height:110px;border:1.5px dashed ${C.line};border-radius:12px;background:#fff;display:flex;align-items:center;justify-content:center">${(j + l.length) % 3 === 0 ? `<span style="width:16px;height:16px;border-radius:50%;background:${C.accent}"></span>` : ""}</div>`)
              .join("")}`
          )
          .join("")}
       </div></div>${illus()}`,
      1440,
      900,
      C.paper
    ),
  stats: ({ kicker, title, stats }) =>
    native(
      `<div style="padding:88px 96px;color:${C.paper}">${kick(kicker)}<div class="disp" style="font-size:80px;margin-bottom:70px">${title}</div>
       <div style="display:grid;grid-template-columns:repeat(${stats.length},1fr);gap:20px">${stats
         .map((s, i) => `<div style="border-top:3px solid ${i === stats.length - 1 ? C.accent : C.paper};padding-top:26px"><div class="disp" style="font-size:132px;${i === stats.length - 1 ? `color:${C.accent}` : ""}">${s.v}</div><div style="font-size:24px;margin-top:16px;opacity:.75">${s.l}</div></div>`)
         .join("")}</div>
       <div class="mono" style="position:absolute;bottom:40px;right:56px;color:#7d7a72">Figures as stated on resume</div></div>`,
      1440,
      900,
      C.ink
    ),
  // Make.com-style scenario: circles + dotted links, no logos, text labels only.
  flow: ({ title }) => {
    const node = (x, y, col, t, sub) => `<div style="position:absolute;left:${x}px;top:${y}px;width:150px;text-align:center;transform:translateX(-50%)">
      <div style="width:120px;height:120px;margin:0 auto;border-radius:50%;background:${col};display:flex;align-items:center;justify-content:center;color:#fff;font-family:Archivo;font-weight:800;font-size:22px;box-shadow:0 10px 24px -6px ${col}99">${t.slice(0, 2).toUpperCase()}</div>
      <div style="margin-top:14px;font-family:Archivo;font-weight:700;font-size:21px">${t}</div><div class="mono" style="font-size:12.5px;color:${C.muted};margin-top:4px">${sub}</div></div>`;
    const dots = (x1, y1, x2, y2) => {
      const len = Math.hypot(x2 - x1, y2 - y1), a = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
      return `<div style="position:absolute;left:${x1}px;top:${y1}px;width:${len}px;height:6px;margin-top:-3px;transform-origin:0 50%;transform:rotate(${a}deg);background:radial-gradient(circle,#c9c3d6 2.6px,transparent 3px) 0 0/16px 6px"></div>`;
    };
    const G = "#1FA463", P = "#8E5CF0", R = "#7BC043", B = "#3E7BFA", E = "#E5483B";
    return native(
      `<div style="padding:80px 96px">${kick("Scenario logic · simplified")}<div class="disp" style="font-size:74px">${title}</div></div>
       ${dots(180, 560, 1120, 560)}${dots(830, 560, 1010, 400)}${dots(1120, 560, 1290, 560)}
       ${node(180, 500, G, "Sheets", "Watch / search leads")}
       ${node(415, 500, P, "Score", "Set variables")}
       ${node(650, 500, G, "Lookup", "Search members")}
       ${node(870, 500, R, "Router", "Dedupe split")}
       ${node(1060, 330, G, "Update", "Existing_Member")}
       ${node(1110, 500, B, "Gemini", "Draft outreach")}
       ${node(1300, 500, E, "Gmail", "Send + write back")}
       <div class="mono" style="position:absolute;left:930px;top:470px;font-size:12px;background:#fff;border:1px solid ${C.line};padding:3px 8px;border-radius:5px">New_Lead</div>
       <div class="mono" style="position:absolute;left:860px;top:405px;font-size:12px;background:#fff;border:1px solid ${C.line};padding:3px 8px;border-radius:5px">Existing</div>
       <div class="mono" style="position:absolute;bottom:40px;left:96px;font-size:14px;color:${C.muted}">⏱ Runs every 15 minutes · 13 modules in the full scenario</div>`,
      1440,
      900,
      "#F7F6F2"
    );
  },
  pipeline: ({ title }) =>
    native(
      `<div style="padding:84px 96px">${kick("Data pipeline")}<div class="disp" style="font-size:80px;margin-bottom:70px">${title}</div>
       <div style="display:flex;align-items:center;gap:26px">
         <div style="display:grid;grid-template-columns:repeat(2,96px);gap:12px">${Array.from({ length: 8 }, (_, i) => `<div class="mono" style="height:62px;border-radius:12px;border:1.5px solid ${C.ink};display:flex;align-items:center;justify-content:center;font-size:15px;background:#fff">SRC ${i + 1}</div>`).join("")}</div>
         ${["MySQL<br><span class='mono' style='font-size:14px;opacity:.6'>6 years · 1 schema</span>", "Random Forest<br><span class='mono' style='font-size:14px;opacity:.6'>scikit-learn</span>", "Tableau<br><span class='mono' style='font-size:14px;opacity:.6'>insights · outliers</span>"]
           .map((t, i) => `<div style="font-size:38px;color:${C.ink}">→</div><div style="flex:1;height:230px;border-radius:22px;padding:28px;display:flex;align-items:flex-end;background:${i === 1 ? C.accent : i === 2 ? C.ink : "#fff"};color:${i === 2 ? C.paper : C.ink};border:1.5px solid ${i === 0 ? C.ink : "transparent"};font-family:Archivo;font-weight:800;font-size:40px;line-height:1.05;letter-spacing:-.02em">${t}</div>`)
           .join("")}
       </div>
       <div style="display:flex;gap:60px;margin-top:70px">${[["14%", "better than competitors"]]
         .map(([v, l]) => `<div style="display:flex;align-items:baseline;gap:18px"><span class="disp" style="font-size:90px;color:${C.accent}">${v}</span><span style="font-size:24px;max-width:220px">${l}</span></div>`)
         .join("")}</div></div>
       <div class="mono" style="position:absolute;bottom:40px;right:56px;color:${C.muted}">Figures as stated on resume</div>`,
      1440,
      900,
      C.paper
    ),
  notebook: ({ title, img, code }) =>
    native(
      `<div style="height:100%;background:#fff;font-family:Inst">
        <div style="height:64px;border-bottom:1px solid #e6e3dc;display:flex;align-items:center;padding:0 32px;gap:16px"><span style="width:28px;height:28px;border-radius:7px;background:${C.accent}"></span><span style="font-size:20px;font-weight:600">${title}</span><span class="mono" style="margin-left:auto;font-size:12px;color:${C.muted}">python 3 · notebook</span></div>
        <div style="padding:30px 44px">
          <div style="display:flex;gap:16px;margin-bottom:22px"><span class="mono" style="color:${C.muted};font-size:13px;padding-top:14px">[1]</span><pre style="flex:1;background:#F6F5F1;border-radius:10px;padding:16px 20px;font-family:Mono;font-size:17px;line-height:1.6;color:#2c2b28;white-space:pre-wrap">${code}</pre></div>
          <div style="display:flex;gap:16px"><span class="mono" style="color:${C.muted};font-size:13px;padding-top:6px">[2]</span><img src="${url(img)}" style="flex:1;max-width:1250px;max-height:600px;object-fit:contain;object-position:left top"></div>
        </div></div>`,
      1440,
      900,
      "#fff"
    ),
  dashboard: ({ title, img }) =>
    native(
      `<div style="height:100%;display:grid;grid-template-columns:220px 1fr;background:#F6F5F1">
        <div style="background:${C.ink};padding:32px 24px;color:${C.paper}"><div style="width:36px;height:36px;border-radius:9px;background:${C.accent};margin-bottom:40px"></div>${["Overview", "Catalogue", "People", "Trends"].map((t, i) => `<div style="font-size:18px;padding:12px 14px;border-radius:9px;margin-bottom:6px;${i === 0 ? "background:#262624" : "opacity:.55"}">${t}</div>`).join("")}</div>
        <div style="padding:36px 40px"><div style="font-family:Archivo;font-weight:800;font-size:38px;letter-spacing:-.02em;margin-bottom:26px">${title}</div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:20px">${["Titles", "Credits", "Genres"].map((t) => `<div style="background:#fff;border-radius:14px;padding:20px"><div class="mono" style="font-size:12px;color:${C.muted}">${t}</div><div style="height:26px;width:60%;border-radius:6px;background:${C.paper2};margin-top:12px"></div></div>`).join("")}</div>
          <div style="background:#fff;border-radius:14px;padding:18px"><img src="${url(img)}" style="width:100%;max-height:520px;object-fit:contain"></div></div></div>`,
      1440,
      900
    ),
  datamodel: () => {
    const table = (name, cols, hi) => `<div style="background:#fff;border-radius:18px;border:1.5px solid ${C.ink};width:440px;overflow:hidden"><div style="background:${C.ink};color:${C.paper};padding:18px 24px;font-family:Archivo;font-weight:800;font-size:30px">${name}</div>${cols
      .map((c) => `<div class="mono" style="padding:13px 24px;border-top:1px solid ${C.line};font-size:17px;text-transform:none;${c === hi ? `background:${C.accent};font-weight:700` : ""}">${c}</div>`)
      .join("")}</div>`;
    return native(
      `<div style="padding:84px 96px">${kick("Data model")}<div class="disp" style="font-size:80px;margin-bottom:56px">Two datasets, one join.</div>
       <div style="display:flex;align-items:center;gap:40px">${table("titles", ["id", "title", "type", "release_year", "genres", "runtime", "…"], "id")}
       <div style="flex:1;text-align:center"><div class="mono" style="font-size:16px;color:${C.muted};margin-bottom:10px">join on</div><div style="height:4px;background:${C.accent};border-radius:2px"></div><div class="disp" style="font-size:40px;margin-top:14px">id</div></div>
       ${table("credits", ["person_id", "id", "name", "character", "role"], "id")}</div></div>${illus("Columns shown are a subset")}`,
      1440,
      900,
      C.paper
    );
  },
  modules: ({ title, mods }) =>
    native(
      `<div style="padding:84px 96px">${kick("Scope")}<div class="disp" style="font-size:80px;margin-bottom:60px">${title}</div>
        <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:16px">${mods
          .map((m, i) => `<div style="height:320px;border-radius:20px;padding:26px;display:flex;flex-direction:column;justify-content:space-between;background:${i === 4 ? "#F2C300" : C.ink};color:${i === 4 ? C.ink : C.paper}"><span class="mono" style="font-size:14px">M0${i + 1}</span><span style="font-family:Archivo;font-weight:800;font-size:34px;line-height:1;letter-spacing:-.02em">${m}</span></div>`)
          .join("")}</div>
        <div style="margin-top:34px;display:flex;align-items:center;gap:18px;font-size:22px"><span style="padding:10px 18px;border:1.5px solid ${C.ink};border-radius:999px" class="mono">FR + NFR document</span>→<span style="padding:10px 18px;background:${C.accent};border-radius:999px" class="mono">UAT with the buyer</span></div></div>`,
      1440,
      900,
      C.paper
    ),
};

// ─── 4. Per-project scenes ───────────────────────────────────────────────────
// Each returns { cover: html, gallery: [html…] }. Stage size 1600×1000 = 16:10.
const S = (body, bg, label, fig) => stage({ body, bg, label, fig });
const desk = (contents, bg = "paper", label = "", fig = "") =>
  S(
    `<div style="position:relative;width:1300px;height:820px">${contents
      .map((c, i) => {
        const r = [-4, 3, -1][i] || 0, x = [0, 230, 120][i] || 0, y = [0, 90, 170][i] || 0;
        return `<div class="sheet shadow" style="position:absolute;left:${x}px;top:${y}px;transform:rotate(${r}deg);padding:0;overflow:hidden">${screenBox(c, 1000)}</div>`;
      })
      .join("")}</div>`,
    bg,
    label,
    fig
  );

function buildScenes(crops) {
  const A = (f) => path.join(ART, f);
  return {
    "pocket-scholar": crops["poster-full"] ? {
      cover: S(`<div style="display:flex;align-items:center;gap:90px;margin-left:-40px">
          <div style="max-width:600px"><div class="mono" style="color:${C.accent};font-size:16px;margin-bottom:26px">Pocket Scholar · Co-founder & CPO</div>
          <div class="disp" style="font-size:120px;color:${C.paper}">Learn it.<br>Build it.<br><span style="color:${C.accent}">Ship it.</span></div></div>
          <div class="sheet shadow" style="transform:rotate(-4deg) perspective(2000px) rotateY(-10deg);overflow:hidden">${screenBox(shot(crops["poster-full"]), 560)}</div></div>`, "ink", "Pocket Scholar", "Cover"),
      gallery: [
        S(`<div class="sheet shadow" style="overflow:hidden">${screenBox(shot(crops["poster-full"]), 650)}</div>`, "paper", "Pocket Scholar", "Fig. 01 · A4 poster"),
        S(`<div class="sheet shadow" style="overflow:hidden;border-radius:14px">${screenBox(shot(crops["poster-pillars"]), 1360)}</div>`, "ink", "Pocket Scholar", "Fig. 02"),
        S(`<div class="sheet shadow" style="overflow:hidden;border-radius:14px">${screenBox(shot(crops["poster-role"]), 1360)}</div>`, "paper", "Pocket Scholar", "Fig. 03"),
        S(`<div class="sheet shadow" style="overflow:hidden;border-radius:14px">${screenBox(shot(crops["poster-roadmap"]), 1360)}</div>`, "accent", "Pocket Scholar", "Fig. 04"),
      ],
    } : {
      cover: S(`<div class="tilt">${laptop(slides.title({ kicker: "EdTech · Co-founder & CPO", title: "Pocket<br>Scholar", sub: "Skill modules, live industry projects and Edu Kits for Indian college students.", chips: ["Product", "Roadmap", "6-member team"] }), 1240)}</div>`, "ink", "Pocket Scholar", "Cover"),
      gallery: [
        S(`<div>${browser(slides.pillars({ kicker: "The offer", title: "Three ways in.", items: [{ h: "Skill modules", p: "" }, { h: "Live industry projects", p: "" }, { h: "Edu Kits", p: "" }] }), 1300, { title: "Pocket Scholar · offer" })}</div>`, "paper", "Pocket Scholar", "Fig. 01"),
        desk([slides.process({ kicker: "How decisions get made", title: "From conversations to a backlog.", steps: ["Interviews & workshops", "Documented requirements", "Prioritised backlog", "Stakeholder buy-in"] })], "paper", "Pocket Scholar", "Fig. 02"),
      ],
    },
    bayboard: crops["bayboard-full"] && {
      cover: S(`<div class="tilt">${laptop(shot(crops["bayboard-full"]), 1260)}</div>`, "paper", "BayBoard", "Cover"),
      gallery: [
        S(browser(shot(crops["bayboard-full"]), 1360, { title: "BayBoard · Expo Plaza Mart · MVP" }), "ink", "BayBoard", "Fig. 01"),
        S(`<div style="display:flex;flex-direction:column;gap:26px;align-items:center">${browser(shot(crops["bayboard-kpis"]), 1420, { title: "KPI strip · demo data" })}<div class="mono" style="font-size:15px;color:${C.muted}">Demo data inside the MVP, not results</div></div>`, "paper", "BayBoard", "Fig. 02"),
        S(browser(shot(crops["bayboard-charts"]), 1420, { title: "Occupancy & collection · demo data" }), "paper", "BayBoard", "Fig. 03"),
        S(`<div>${browser(slides.modules({ title: "Five modules, one shift.", mods: ["Floor map", "Billing", "Passes", "Maintenance", "Shift dashboard"] }), 1300, { title: "Requirements → scope" })}</div>`, "ink", "BayBoard", "Fig. 04"),
      ],
    },
    "ai-lead-routing": crops["make-full"] && {
      cover: S(`<div class="tilt">${browser(slides.flow({ title: "Score, dedupe, draft, write back." }), 1300, { title: "Make · Sheets → Router → Gemini → Gmail" })}</div>`, "accent", "AI Lead-Routing", "Cover"),
      gallery: [
        S(browser(slides.flow({ title: "Score, dedupe, draft, write back." }), 1300, { title: "Scenario · simplified" }), "paper", "AI Lead-Routing", "Fig. 01"),
        S(browser(shot(crops["make-full"]), 1380, { title: "Make · scenario editor" }), "ink", "AI Lead-Routing", "Fig. 02"),
        S(browser(shot(crops["make-router"]), 1340, { title: "Router · Existing_Member / New_Lead" }), "paper", "AI Lead-Routing", "Fig. 03"),
      ],
    },
    "indigo-recommendation": {
      cover: S(`<div class="tilt">${laptop(slides.notebook({ title: "recommend_classifier.ipynb", img: A("indigo.png"), code: "# Will a passenger recommend the airline?\ndf = load_reviews()\nX, y = prepare(df)          # target: recommend (yes / no)\nmodel = fit_classifier(X, y)\nevaluate(model)" }), 1240)}</div>`, "paper", "IndiGo", "Cover"),
      gallery: [
        S(browser(slides.process({ kicker: "Classification pipeline", title: "Recommend: yes or no?", steps: ["Passenger data", "Clean & encode", "Train classifier", "Evaluate", "Predict"], note: "Generic pipeline · illustrative" }), 1300, { title: "Pipeline" }), "ink", "IndiGo", "Fig. 01"),
        S(browser(slides.notebook({ title: "recommend_classifier.ipynb", img: A("indigo.png"), code: "evaluate(model)   # illustrative output below" }), 1300, { title: "Colab · notebook" }), "paper", "IndiGo", "Fig. 02"),
      ],
    },
    "mdae-data-science": {
      cover: S(`<div class="tilt">${laptop(slides.pipeline({ title: "Eight sources. One model." }), 1240)}</div>`, "ink", "MDAE", "Cover"),
      gallery: [
        S(browser(slides.stats({ kicker: "MDAE live project", title: "The numbers.", stats: [{ v: "8", l: "data sources" }, { v: "6y", l: "of history in MySQL" }, { v: "14%", l: "better than competitors" }] }), 1300, { title: "Results as stated", dark: true }), "paper", "MDAE", "Fig. 01"),
        S(browser(slides.dashboard({ title: "Insights & outliers", img: A("mdae.png") }), 1300, { title: "Dashboard · illustrative" }), "ink", "MDAE", "Fig. 02"),
      ],
    },
    "prime-video-eda": {
      cover: S(`<div class="tilt">${laptop(slides.dashboard({ title: "Streaming catalogue EDA", img: A("prime.png") }), 1240)}</div>`, "accent", "Prime Video EDA", "Cover"),
      gallery: [
        S(browser(slides.datamodel(), 1300, { title: "titles ⋈ credits" }), "ink", "Prime Video EDA", "Fig. 01"),
        S(browser(slides.notebook({ title: "catalogue_eda.ipynb", img: A("prime.png"), code: "titles = pd.read_csv('titles.csv')\ncredits = pd.read_csv('credits.csv')\ndf = titles.merge(credits, on='id')" }), 1300, { title: "Notebook" }), "paper", "Prime Video EDA", "Fig. 02"),
      ],
    },
    "asian-paints-imc": {
      cover: S(`<div class="tilt">${laptop(slides.title({ kicker: "IMC strategy · field study", title: "Asian Paints<br>vs Berger<br>& Nerolac", size: 128, chips: ["Marketing", "IMC", "Field study"] }), 1240)}</div>`, "paper", "IMC Strategy", "Cover"),
      gallery: [
        S(browser(slides.pillars({ kicker: "Framework", title: "One message, many touchpoints.", items: [{ h: "Above the line", p: "TV · print · OOH" }, { h: "Digital", p: "Search · social · creators" }, { h: "Retail", p: "Dealer · tinting · in-store" }] }), 1300, { title: "IMC framework" }), "ink", "IMC Strategy", "Fig. 01"),
        desk([slides.grid({ kicker: "Benchmark", title: "Three brands, side by side.", cols: ["Positioning", "Channels", "Message", "Retail"], rows: ["Asian Paints", "Berger", "Nerolac"], highlight: [0] })], "paper", "IMC Strategy", "Fig. 02"),
      ],
    },
    "hermes-cbam": {
      cover: S(`<div class="tilt">${laptop(slides.title({ kicker: "Hermes' Dialogue 7.0 · Round 2", title: "India's<br>answer to<br>the EU CBAM", size: 130, bg: C.ink, fg: C.paper, chips: ["Case study", "Trade policy"] }), 1240)}</div>`, "accent", "Hermes' Dialogue", "Cover"),
      gallery: [S(browser(slides.twoByTwo({ kicker: "Framework", title: "Where does each sector stand?", x: "Readiness to decarbonise", y: "Exposure to CBAM", quads: ["Watch", "Act now", "Opportunity", "Prepare"], note: "Framework only · no data plotted" }), 1300, { title: "Framework" }), "paper", "Hermes' Dialogue", "Fig. 01")],
    },
    "prakritik-sukoon": {
      cover: S(`<div class="tilt">${laptop(slides.grid({ kicker: "Live project · Jan 2026", title: "8+ competitors, three lenses.", cols: ["Pricing", "Offerings", "GTM channels"], rows: ["Competitor A", "Competitor B", "Competitor C", "Competitor D", "Competitor E", "Competitor F"] }), 1240)}</div>`, "ink", "Green Infra Research", "Cover"),
      gallery: [desk([slides.grid({ kicker: "Benchmark structure", title: "Finding the white space.", cols: ["Pricing", "Offerings", "GTM channels"], rows: ["A", "B", "C", "D", "E", "F", "G", "H"] }), slides.title({ kicker: "Recommendations", title: "Where to<br>compete.", size: 140, sub: "Presented to company stakeholders.", chips: ["Report"] })], "paper", "Green Infra Research", "Fig. 01")],
    },
    "third-wave-coffee": {
      cover: S(`<div class="tilt">${laptop(slides.title({ kicker: "Multichannel retail · store visit", title: "Third Wave<br>Coffee", size: 150, chips: ["Retail", "Omnichannel"] }), 1240)}</div>`, "accent", "Third Wave Coffee", "Cover"),
      gallery: [S(browser(slides.journey({ kicker: "Framework", title: "One customer, three channels.", stages: ["Discover", "Visit", "Order", "Repeat"], lanes: ["Store", "App", "Delivery"] }), 1300, { title: "Journey map" }), "ink", "Third Wave Coffee", "Fig. 01")],
    },
    markstrat: {
      cover: S(`<div class="tilt">${laptop(slides.twoByTwo({ kicker: "Markstrat simulation", title: "MOST & MOVE", x: "Performance", y: "Price", quads: ["", "", "", ""], dots: [{ x: 70, y: 30, t: "MOST" }, { x: 34, y: 66, t: "MOVE", c: C.ink }], note: "Illustrative positions · not simulation output" }), 1240)}</div>`, "paper", "Markstrat", "Cover"),
      gallery: [S(browser(slides.twoByTwo({ kicker: "Perceptual map", title: "Two brands, two positions.", x: "Performance", y: "Price", quads: ["Value", "Premium", "Budget", "Over-priced"], dots: [{ x: 72, y: 28, t: "MOST" }, { x: 30, y: 70, t: "MOVE", c: C.ink }], note: "Illustrative positions · not simulation output" }), 1300, { title: "Perceptual map" }), "ink", "Markstrat", "Fig. 01")],
    },
    "quantum-chem-sim": {
      cover: S(`<div class="tilt">${laptop(native(`<img src="${url(A("orbital.png"))}" style="width:100%;height:100%;object-fit:cover">`, 1440, 900, C.ink), 1240)}</div>`, "accent", "Quantum Sim", "Cover"),
      gallery: [S(browser(slides.notebook({ title: "quantum_sim.py", img: A("levels.png"), code: "# illustrative: textbook hydrogen levels\nlevels = energy_levels(Z=1, n_max=6)" }), 1300, { title: "Notebook · illustrative" }), "ink", "Quantum Sim", "Fig. 01")],
    },
    breatheride: crops["breathe-full"] && {
      cover: S(`<div class="tilt">${browser(shot(crops["breathe-full"]), 1300, { title: "BreatheRide · 3D concept", dark: true })}</div>`, "paper", "BreatheRide", "Cover"),
      gallery: [
        S(browser(shot(crops["breathe-full"]), 1360, { title: "BreatheRide · concept page", dark: true }), "accent", "BreatheRide", "Fig. 01"),
        S(browser(shot(crops["breathe-model"]), 1300, { title: "3D model · both products", dark: true }), "paper", "BreatheRide", "Fig. 02"),
      ],
    },
    "tokamak-lab": crops["tokamak-full"] && {
      cover: S(`<div class="tilt">${browser(shot(crops["tokamak-full"]), 1300, { title: "Tokamak Fusion Laboratory", dark: true })}</div>`, "accent", "Tokamak Lab", "Cover"),
      gallery: [
        S(browser(shot(crops["tokamak-full"]), 1360, { title: "Tokamak Fusion Laboratory · cutaway", dark: true }), "paper", "Tokamak Lab", "Fig. 01"),
        S(`<div style="display:flex;gap:60px;align-items:center">${browser(shot(crops["tokamak-panel"]), 400, { dark: true })}<div style="max-width:560px"><div class="mono" style="color:${C.accent};margin-bottom:18px">Control panel</div><div class="disp" style="font-size:84px;color:${C.paper}">Five scenarios. Seven knobs.</div></div></div>`, "ink", "Tokamak Lab", "Fig. 02"),
        S(browser(shot(crops["tokamak-readout"]), 1300, { title: "Live readout", dark: true }), "paper", "Tokamak Lab", "Fig. 03"),
      ],
    },
    "no-mercy": crops["nomercy-full"] && {
      cover: S(`<div class="tilt">${browser(shot(crops["nomercy-full"]), 1300, { title: "No Mercy · card game", dark: true })}</div>`, "paper", "No Mercy", "Cover"),
      gallery: [
        S(browser(shot(crops["nomercy-full"]), 1360, { title: "No Mercy · setup", dark: true }), "ink", "No Mercy", "Fig. 01"),
        S(`<div style="display:flex;gap:70px;align-items:center">${browser(shot(crops["nomercy-panel"]), 640, { dark: true })}<div style="max-width:560px"><div class="mono" style="color:${C.ink};margin-bottom:18px;opacity:.7">Game setup</div><div class="disp" style="font-size:96px">2–6 players. Three AI levels.</div></div></div>`, "accent", "No Mercy", "Fig. 02"),
      ],
    },
  };
}

/**
 * Finished covers you designed yourself: assets/covers/<slug>.(webp|png|jpg), 16:10.
 * Used as cover.webp unchanged (just resized to 1600×1000); the gallery gets a tilted-laptop
 * mockup and a "printed slide on a desk" mockup made from it.
 */
async function providedScenes(slug, title) {
  const file = ["webp", "png", "jpg", "jpeg"].map((e) => path.join(ROOT, "assets/covers", `${slug}.${e}`)).find(fs.existsSync);
  if (!file) return null;
  const png = path.join(CROPS, `provided-${slug}.png`);
  await sharp(file).resize(1600, 1000, { fit: "cover" }).png().toFile(png);
  const art = { src: png, w: 1600, h: 1000 };
  return {
    coverFile: file,
    gallery: [
      S(`<div class="tilt">${laptop(shot(art), 1240)}</div>`, "paper", title, "Fig. 01"),
      S(`<div class="sheet shadow" style="transform:rotate(-3deg);overflow:hidden;border-radius:6px">${screenBox(shot(art), 1240)}</div>`, "ink", title, "Fig. 02"),
    ],
  };
}

/** Auto scenes for any project that has raw screenshots but no hand-made scene. */
function autoScenes(slug, title) {
  const files = fs.readdirSync(RAW).filter((f) => f.startsWith(`${slug}__`) && /\.(png|jpe?g|webp)$/i.test(f));
  if (!files.length) return null;
  return (async () => {
    const items = [];
    for (const f of files) {
      const m = await sharp(path.join(RAW, f)).metadata();
      items.push({ f, crop: { src: path.join(RAW, f), w: m.width, h: m.height }, mobile: /__mobile/i.test(f) });
    }
    const desk = items.filter((i) => !i.mobile), mob = items.filter((i) => i.mobile);
    const hero = desk[0] || mob[0];
    const cover = hero.mobile
      ? S(`<div class="tilt">${phone(shot(hero.crop), 420)}</div>`, "paper", title, "Cover")
      : S(`<div class="tilt">${laptop(shot(hero.crop), 1260)}</div>`, "paper", title, "Cover");
    const gallery = items.slice(0, 4).map((it, i) =>
      it.mobile
        ? S(phone(shot(it.crop), 400), i % 2 ? "ink" : "paper", title, `Fig. 0${i + 1}`)
        : S(browser(shot(it.crop), 1360, { title }), i % 2 ? "ink" : "paper", title, `Fig. 0${i + 1}`)
    );
    console.log(`  ↳ ${slug}: auto scenes from ${files.length} screenshot(s). Update gallery alt text in content/projects.ts.`);
    return { cover, gallery };
  })();
}

// ─── 5. OG images ────────────────────────────────────────────────────────────
const ogHtml = (p, coverPath) => `<div style="width:1200px;height:630px;background:${C.ink};color:${C.paper};position:relative;overflow:hidden;display:flex">
  <div style="padding:64px 0 60px 68px;width:600px;background:linear-gradient(90deg,${C.ink} 88%,transparent);display:flex;flex-direction:column;justify-content:space-between;position:relative;z-index:2">
    <div class="mono" style="font-size:16px;opacity:.6">Ananth S. Madabhushini · Work</div>
    <div><div class="mono" style="display:inline-block;background:${C.accent};color:${C.ink};padding:8px 14px;border-radius:999px;font-size:14px;margin-bottom:26px">${p.category}</div>
    <div class="disp" style="font-size:${p.title.length > 34 ? 52 : p.title.length > 20 ? 62 : 80}px;max-width:520px">${p.title}</div></div>
    <div style="font-size:20px;opacity:.6">ananth · portfolio</div></div>
  <img src="${url(coverPath)}" style="position:absolute;left:640px;top:80px;width:760px;border-radius:16px;transform:rotate(-6deg);box-shadow:0 40px 80px rgba(0,0,0,.5)">
</div>`;

const homeOgHtml = (headshot) => `<div style="width:1200px;height:630px;background:${C.paper};position:relative;overflow:hidden;padding:64px 68px;display:flex;flex-direction:column;justify-content:space-between">
  <div class="mono" style="font-size:16px;display:flex;gap:14px;align-items:center"><span style="width:12px;height:12px;border-radius:50%;background:${C.accent}"></span>Open to roles · 2027</div>
  <div class="disp" style="font-size:96px;max-width:760px">Ananth S.<br>Madabhushini</div>
  <div style="font-size:28px;max-width:720px;line-height:1.25">Engineer turned data person turned marketer <b style="background:${C.accent};padding:0 6px">who builds things.</b></div>
  <img src="${url(headshot)}" style="position:absolute;right:64px;top:64px;width:300px;height:380px;object-fit:cover;border-radius:24px;filter:grayscale(1) contrast(1.05)">
</div>`;

const iconHtml = () => `<div style="width:180px;height:180px;background:${C.ink};display:flex;align-items:center;justify-content:center;position:relative"><span class="disp" style="color:${C.paper};font-size:120px;line-height:1;margin-top:-6px">a</span><span style="position:absolute;right:34px;bottom:40px;width:24px;height:24px;border-radius:50%;background:${C.accent}"></span></div>`;

// ─── 6. Render ───────────────────────────────────────────────────────────────
async function render(page, html, w, h, file, { webp = true } = {}) {
  await page.setViewportSize({ width: w, height: h });
  const doc = path.join(CACHE, "page.html");
  fs.writeFileSync(doc, `<!doctype html><meta charset="utf-8"><style>${BASE_CSS}</style><body style="width:${w}px;height:${h}px;overflow:hidden">${html}</body>`);
  await page.goto(url(doc));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => [...document.images].every((i) => i.complete));
  const png = await page.screenshot({ type: "png" });
  fs.mkdirSync(path.dirname(file), { recursive: true });
  if (webp) await sharp(png).webp({ quality: 82, effort: 5 }).toFile(file);
  else await sharp(png).png({ compressionLevel: 9, palette: false }).toFile(file);
}

async function loadProjects() {
  // Read slugs/titles/categories straight from content/projects.ts (no TS compile needed).
  const src = fs.readFileSync(path.join(ROOT, "content/projects.ts"), "utf8");
  const re = /slug:\s*"([^"]+)",\s*title:\s*"([^"]+)",[\s\S]*?category:\s*"([^"]+)"/g;
  const out = [];
  let m;
  while ((m = re.exec(src))) out.push({ slug: m[1], title: m[2], category: m[3] });
  return out;
}

async function main() {
  const only = process.argv.slice(2);
  const projects = (await loadProjects()).filter((p) => !only.length || only.includes(p.slug));
  const crops = await makeCrops();
  const scenes = buildScenes(crops);
  const browserApp = await chromium.launch();
  const page = await browserApp.newPage({ deviceScaleFactor: 1 });
  const sheet = [];

  // Headshot + site-level images
  const hs = ["headshot.png", "headshot.jpg", "headshot.jpeg", "headshot.webp"].map((f) => path.join(RAW, f)).find(fs.existsSync);
  if (hs && !only.length) {
    await sharp(hs).resize({ width: 640, height: 800, fit: "cover", position: "top" }).webp({ quality: 80 }).toFile(path.join(ROOT, "public/images/headshot.webp"));
    await render(page, homeOgHtml(hs), 1200, 630, path.join(ROOT, "public/og.png"), { webp: false });
    await render(page, iconHtml(), 180, 180, path.join(ROOT, "app/apple-icon.png"), { webp: false });
    sheet.push({ slug: "site", files: ["/og.png", "/images/headshot.webp", "/images/resume-preview.webp"] });
  }
  // Resume: copy resume.pdf into /public and render a preview image for the mobile /resume page.
  const pdf = path.join(ROOT, "resume.pdf");
  if (fs.existsSync(pdf) && !only.length) {
    fs.copyFileSync(pdf, path.join(ROOT, "public/resume.pdf"));
    try {
      const { execFileSync } = await import("node:child_process");
      execFileSync("pdftoppm", ["-r", "150", "-png", "-singlefile", "-f", "1", "-l", "1", pdf, path.join(CACHE, "resume")]);
      await sharp(path.join(CACHE, "resume.png")).resize({ width: 1240 }).webp({ quality: 85 }).toFile(path.join(ROOT, "public/images/resume-preview.webp"));
    } catch {
      console.warn("  ! pdftoppm (poppler) not found: resume preview not refreshed");
    }
  }

  for (const p of projects) {
    let sc = (await providedScenes(p.slug, p.title)) || scenes[p.slug];
    if (!sc) {
      const auto = autoScenes(p.slug, p.title);
      if (auto) sc = await auto;
    }
    if (!sc) {
      console.warn(`  ! ${p.slug}: no scenes and no screenshots, skipped`);
      continue;
    }
    const dir = path.join(OUT, p.slug);
    fs.rmSync(dir, { recursive: true, force: true });
    const files = [];
    fs.mkdirSync(dir, { recursive: true });
    if (sc.coverFile) await sharp(sc.coverFile).resize(1600, 1000, { fit: "cover" }).webp({ quality: 88 }).toFile(path.join(dir, "cover.webp"));
    else await render(page, sc.cover, 1600, 1000, path.join(dir, "cover.webp"));
    files.push(`/images/projects/${p.slug}/cover.webp`);
    // Smaller cover for grid cards (cover-800.webp)
    await sharp(path.join(dir, "cover.webp")).resize({ width: 800 }).webp({ quality: 80 }).toFile(path.join(dir, "cover-800.webp"));
    for (const [i, g] of sc.gallery.entries()) {
      const name = `${String(i + 1).padStart(2, "0")}.webp`;
      await render(page, g, 1600, 1000, path.join(dir, name));
      files.push(`/images/projects/${p.slug}/${name}`);
    }
    // OG uses a PNG copy of the cover
    const coverPng = path.join(CACHE, `${p.slug}-cover.png`);
    await sharp(path.join(dir, "cover.webp")).png().toFile(coverPng);
    await render(page, ogHtml(p, coverPng), 1200, 630, path.join(dir, "og.png"), { webp: false });
    files.push(`/images/projects/${p.slug}/og.png`);
    sheet.push({ slug: p.slug, title: p.title, files });
    console.log(`✓ ${p.slug} (${files.length} images)`);
  }

  // Contact sheet
  if (!only.length) {
    const html = `<!doctype html><meta charset="utf-8"><title>Mockups contact sheet</title>
<style>${BASE_CSS} body{background:${C.paper};padding:48px} h1{font-family:Archivo;font-weight:800;font-size:56px;letter-spacing:-.03em;margin-bottom:8px}
section{margin-top:44px} h2{font-family:Archivo;font-size:26px;margin-bottom:14px} .row{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:14px}
figure{background:#fff;border-radius:10px;padding:8px} img{width:100%;display:block;border-radius:6px} figcaption{font-family:Mono;font-size:11px;color:${C.muted};margin-top:6px}</style>
<h1>Mockups contact sheet</h1><p class="mono" style="color:${C.muted}">Generated ${new Date().toISOString().slice(0, 16).replace("T", " ")} · ${sheet.reduce((n, s) => n + s.files.length, 0)} images</p>
${sheet.map((s) => `<section><h2>${s.title || s.slug}</h2><div class="row">${s.files.map((f) => `<figure><img src="public${f}"><figcaption>${f}</figcaption></figure>`).join("")}</div></section>`).join("")}`;
    const out = path.join(ROOT, "mockups-contact-sheet.html");
    fs.writeFileSync(out, html);
    await page.setViewportSize({ width: 1600, height: 1000 });
    await page.goto(url(out));
    await page.waitForFunction(() => [...document.images].every((i) => i.complete));
    const buf = await page.screenshot({ fullPage: true, type: "jpeg", quality: 80 });
    fs.writeFileSync(path.join(ROOT, "mockups-contact-sheet.jpg"), buf);
    console.log("contact sheet → mockups-contact-sheet.html / .jpg");
  }
  await browserApp.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
