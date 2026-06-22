// Cinematischer Kinetic-Typography-Trailer — rendert Frames und encodiert via ffmpeg zu MP4.
const { createCanvas, GlobalFonts } = require("@napi-rs/canvas");
const { spawn } = require("child_process");
const ffmpeg = require("ffmpeg-static");
const path = require("path");
const { fps, W, H, DUR, cards } = require("./timeline");

GlobalFonts.registerFromPath("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", "Trailer");

const canvas = createCanvas(W, H);
const ctx = canvas.getContext("2d");

// ---------- Easing ----------
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const easeOut = (x) => 1 - Math.pow(1 - clamp(x), 3);
const easeIn = (x) => Math.pow(clamp(x), 3);
const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const lerp = (a, b, t) => a + (b - a) * t;

// ---------- Stimmung (Glow-Farbe + Energie) ----------
const moodStops = [
  { t: 0.0,  e: 0.10, c: [20, 70, 130] },
  { t: 8.0,  e: 0.16, c: [22, 90, 150] },
  { t: 12.0, e: 0.20, c: [30, 110, 180] },
  { t: 21.0, e: 0.18, c: [46, 80, 175] },
  { t: 22.6, e: 0.26, c: [95, 70, 205] },
  { t: 36.0, e: 0.60, c: [150, 75, 235] },
  { t: 39.9, e: 0.80, c: [130, 130, 255] },
  { t: 40.0, e: 1.00, c: [190, 245, 255] },
  { t: 43.8, e: 0.52, c: [34, 211, 238] },
  { t: 54.0, e: 0.52, c: [45, 212, 191] },
  { t: 62.6, e: 0.72, c: [120, 95, 240] },
  { t: 66.8, e: 0.86, c: [140, 120, 255] },
  { t: 70.6, e: 0.45, c: [70, 80, 200] },
  { t: 74.0, e: 0.00, c: [10, 20, 40] },
];
function mood(t) {
  let a = moodStops[0], b = moodStops[moodStops.length - 1];
  for (let i = 0; i < moodStops.length - 1; i++) {
    if (t >= moodStops[i].t && t <= moodStops[i + 1].t) { a = moodStops[i]; b = moodStops[i + 1]; break; }
  }
  const k = clamp((t - a.t) / Math.max(0.0001, b.t - a.t));
  let e = lerp(a.e, b.e, k);
  const c = [0, 1, 2].map((i) => Math.round(lerp(a.c[i], b.c[i], k)));
  // kurzer Energie-Puls beim Erscheinen jeder Karte
  for (const card of cards) {
    const d = t - card.t;
    if (d >= 0 && d < 0.5) e += 0.18 * (1 - d / 0.5);
  }
  return { e: clamp(e, 0, 1.2), c };
}

// ---------- Vignette (einmal vorrendern) ----------
const vig = createCanvas(W, H), vctx = vig.getContext("2d");
const vg = vctx.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, H * 0.85);
vg.addColorStop(0, "rgba(0,0,0,0)");
vg.addColorStop(1, "rgba(0,0,0,0.78)");
vctx.fillStyle = vg; vctx.fillRect(0, 0, W, H);

// ---------- Filmkorn-Kacheln (einmal vorrendern) ----------
const grainTiles = [];
for (let g = 0; g < 5; g++) {
  const gc = createCanvas(512, 512), gx = gc.getContext("2d");
  const id = gx.createImageData(512, 512);
  for (let i = 0; i < id.data.length; i += 4) {
    const v = (Math.random() * 255) | 0;
    id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255;
  }
  gx.putImageData(id, 0, 0);
  grainTiles.push(gc);
}

// ---------- Text-Helper ----------
function drawLines(text, cx, cy, size, { alpha, glowColor, glow, key, sub, scale, line, upper }) {
  const lines = (upper ? text.toUpperCase() : text).split("\n");
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.font = `${size}px Trailer`;
  const ls = sub ? size * 0.18 : size * 0.045;        // Buchstabenabstand
  const lineH = size * 1.16;
  const totalH = (lines.length - 1) * lineH;

  lines.forEach((ln, li) => {
    // Breite messen
    let w = 0;
    for (const ch of ln) w += ctx.measureText(ch).width + ls;
    w -= ls;
    const startX = -w / 2;
    const y = -totalH / 2 + li * lineH;

    ctx.globalAlpha = alpha;
    ctx.shadowColor = `rgba(${glowColor[0]},${glowColor[1]},${glowColor[2]},${0.9 * alpha})`;
    ctx.shadowBlur = glow;

    if (key) {
      const grad = ctx.createLinearGradient(startX, 0, startX + w, 0);
      grad.addColorStop(0, "#22d3ee");
      grad.addColorStop(0.5, "#a855f7");
      grad.addColorStop(1, "#f472b6");
      ctx.fillStyle = grad;
    } else if (sub) {
      ctx.fillStyle = "rgba(200,214,240,1)";
    } else {
      ctx.fillStyle = "#f3f7ff";
    }

    let x = startX;
    for (const ch of ln) {
      ctx.fillText(ch, x, y);
      x += ctx.measureText(ch).width + ls;
    }

    // Akzentlinie (z. B. unter der Marke)
    if (line && li === lines.length - 1) {
      ctx.shadowBlur = glow * 0.5;
      const lw = w * 0.5, lx = -lw / 2, ly = y + lineH * 0.62;
      const lg = ctx.createLinearGradient(lx, 0, lx + lw, 0);
      lg.addColorStop(0, "rgba(34,211,238,0)");
      lg.addColorStop(0.5, "rgba(168,85,247," + alpha + ")");
      lg.addColorStop(1, "rgba(244,114,182,0)");
      ctx.fillStyle = lg;
      ctx.fillRect(lx, ly, lw, Math.max(2, size * 0.03));
    }
  });
  ctx.restore();
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
}

// ---------- Karten-Animation ----------
function cardState(card, t) {
  if (t < card.t || t > card.e) return null;
  const life = card.e - card.t;
  const p = t - card.t;
  const inDur = card.impact ? 0.18 : 0.5;
  const outDur = card.impact ? 0.6 : 0.45;
  const ain = easeOut(p / inDur);
  const aout = 1 - easeIn((p - (life - outDur)) / outDur);
  const alpha = clamp(Math.min(ain, p < life - outDur ? 1 : aout));
  let scale;
  if (card.impact) scale = lerp(1.28, 1.0, easeOut(p / 0.4)) + 0.015 * (p / life);
  else scale = lerp(0.955, 1.0, easeOut(p / inDur)) + 0.03 * (p / life);
  return { alpha, scale };
}

// ---------- Frame zeichnen ----------
function drawFrame(t) {
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#05070d";
  ctx.fillRect(0, 0, W, H);

  const m = mood(t);

  // Screen-Shake + Impact-Flash beim Einschlag
  let shx = 0, shy = 0, flash = 0;
  const impact = cards.find((c) => c.impact);
  if (impact) {
    const d = t - impact.t;
    if (d >= 0 && d < 0.5) { const k = 1 - d / 0.5; const amp = 26 * k * k; shx = (Math.random() - 0.5) * amp; shy = (Math.random() - 0.5) * amp; }
    if (d >= 0 && d < 0.28) flash = (1 - d / 0.28) * 0.9;
  }

  ctx.save();
  ctx.translate(shx, shy);

  // Hintergrund-Glow (zwei Schichten für Tiefe)
  const cx = W / 2, cy = H / 2 + Math.sin(t * 0.25) * 24;
  const g1 = ctx.createRadialGradient(cx, cy, 0, cx, cy, H * 0.95);
  g1.addColorStop(0, `rgba(${m.c[0]},${m.c[1]},${m.c[2]},${0.55 * m.e})`);
  g1.addColorStop(0.4, `rgba(${m.c[0]},${m.c[1]},${m.c[2]},${0.18 * m.e})`);
  g1.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g1; ctx.fillRect(-60, -60, W + 120, H + 120);

  const ox = Math.sin(t * 0.5) * W * 0.12, oy = Math.cos(t * 0.4) * H * 0.1;
  const g2 = ctx.createRadialGradient(cx + ox, cy + oy, 0, cx + ox, cy + oy, H * 0.5);
  g2.addColorStop(0, `rgba(${m.c[0]},${m.c[1]},${m.c[2]},${0.25 * m.e})`);
  g2.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g2; ctx.fillRect(-60, -60, W + 120, H + 120);

  // Text-Karten
  const glowBase = 18 + m.e * 46;
  for (const card of cards) {
    const st = cardState(card, t);
    if (!st) continue;
    const cyText = card.sub ? H * 0.84 : H / 2;
    const glow = (card.impact ? 90 : card.key ? glowBase + 24 : glowBase) * Math.max(0.4, st.alpha);
    drawLines(card.text, W / 2, cyText, card.size, {
      alpha: st.alpha, glowColor: m.c, glow, key: card.key, sub: card.sub,
      scale: st.scale, line: card.line, upper: card.upper,
    });
  }

  ctx.restore();

  // Filmkorn (alle 2 Frames wechselnd -> besser komprimierbar)
  const gf = Math.floor(t * fps / 2);
  const tile = grainTiles[gf % grainTiles.length];
  ctx.globalAlpha = 0.032;
  const gox = (gf * 73) % 200, goy = (gf * 131) % 200;
  for (let yy = -gox; yy < H; yy += 512) for (let xx = -goy; xx < W; xx += 512) ctx.drawImage(tile, xx, yy);
  ctx.globalAlpha = 1;

  // Vignette
  ctx.drawImage(vig, 0, 0);

  // Impact-Flash
  if (flash > 0) { ctx.fillStyle = `rgba(225,245,255,${flash})`; ctx.fillRect(0, 0, W, H); }

  // Globale Ein-/Ausblende (Schwarz)
  let fade = 0;
  if (t < 1.2) fade = 1 - easeOut(t / 1.2);
  if (t > DUR - 1.6) fade = easeIn((t - (DUR - 1.6)) / 1.6);
  if (fade > 0) { ctx.fillStyle = `rgba(0,0,0,${fade})`; ctx.fillRect(0, 0, W, H); }
}

// ---------- Encode ----------
const out = path.join(__dirname, "kk-hannover-trailer.mp4");
const args = [
  "-y", "-f", "rawvideo", "-pix_fmt", "rgba", "-s", `${W}x${H}`, "-r", String(fps), "-i", "pipe:0",
  "-i", path.join(__dirname, "audio.wav"),
  "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "22", "-preset", "medium",
  "-maxrate", "6M", "-bufsize", "12M",
  "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", "-shortest", out,
];
const proc = spawn(ffmpeg, args, { stdio: ["pipe", "inherit", "inherit"] });
proc.on("error", (e) => { console.error("ffmpeg-Fehler:", e); process.exit(1); });

const totalFrames = Math.round(DUR * fps);
function writeBuf(b) {
  return new Promise((res) => { if (proc.stdin.write(b)) res(); else proc.stdin.once("drain", res); });
}
(async () => {
  const t0 = Date.now();
  for (let f = 0; f < totalFrames; f++) {
    const t = f / fps;
    drawFrame(t);
    const img = ctx.getImageData(0, 0, W, H);
    await writeBuf(Buffer.from(img.data.buffer, img.data.byteOffset, img.data.byteLength));
    if (f % 150 === 0) process.stdout.write(`\rFrame ${f}/${totalFrames} (${((f / totalFrames) * 100) | 0}%) `);
  }
  proc.stdin.end();
  proc.on("close", (code) => {
    process.stdout.write(`\rFrames fertig (${totalFrames}). ffmpeg exit ${code}. Dauer ${((Date.now() - t0) / 1000).toFixed(0)}s\n`);
    process.exit(code || 0);
  });
})();
