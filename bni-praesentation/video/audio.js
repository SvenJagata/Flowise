// Synthetisiert eine dramatische Trailer-Tonspur (audio.wav) — komplett aus Code.
// Tiefer Drone, Schmerz-Ticks, Riser, Sub-Boom-Einschlag, hoffnungsvolles Finale.
const fs = require("fs");
const { DUR } = require("./timeline");

const SR = 44100;
const N = Math.ceil(DUR * SR) + SR; // etwas Puffer am Ende
const L = new Float32Array(N);
const Rr = new Float32Array(N);

function env(t, dur, a, d, s, r) {
  if (t < 0) return 0;
  if (t < a) return t / a;
  if (t < a + d) return 1 - (1 - s) * ((t - a) / d);
  if (t < dur - r) return s;
  if (t < dur) return s * (1 - (t - (dur - r)) / r);
  return 0;
}
function tone({ freq, t0, dur, gain = 0.2, type = "sine", a = 0.02, d = 0.1, s = 0.85, r = 0.2, detune = 0, pan = 0, vibRate = 0, vibDepth = 0 }) {
  const n0 = Math.floor(t0 * SR);
  const gl = Math.cos(((pan + 1) / 2) * (Math.PI / 2));
  const gr = Math.sin(((pan + 1) / 2) * (Math.PI / 2));
  const f = freq * Math.pow(2, detune / 1200);
  for (let n = 0; n < dur * SR; n++) {
    const idx = n0 + n; if (idx < 0 || idx >= N) continue;
    const t = n / SR;
    let ph = 2 * Math.PI * f * t;
    if (vibRate) ph += vibDepth * Math.sin(2 * Math.PI * vibRate * t);
    let v;
    if (type === "tri") v = (2 / Math.PI) * Math.asin(Math.sin(ph));
    else if (type === "saw") v = 2 * (f * t - Math.floor(0.5 + f * t));
    else v = Math.sin(ph);
    v *= env(t, dur, a, d, s, r) * gain;
    L[idx] += v * gl; Rr[idx] += v * gr;
  }
}
function boom(t0, gain = 1.0) {
  const n0 = Math.floor(t0 * SR), dur = 2.0;
  let lp = 0;
  for (let n = 0; n < dur * SR; n++) {
    const idx = n0 + n; if (idx >= N) break;
    const t = n / SR;
    const f = 80 * Math.exp(-2.4 * t) + 36;          // Tonhöhe fällt
    const eBody = Math.exp(-2.6 * t);
    let v = Math.sin(2 * Math.PI * f * t) * eBody;
    // Transient-Knack am Anfang
    let nz = Math.random() * 2 - 1; lp += 0.25 * (nz - lp);
    const eHit = Math.exp(-45 * t) * 0.6;
    v += lp * eHit;
    v *= gain;
    L[idx] += v; Rr[idx] += v;
  }
}
function riser(t0, dur, gain = 0.5) {
  const n0 = Math.floor(t0 * SR); let lp = 0;
  for (let n = 0; n < dur * SR; n++) {
    const idx = n0 + n; if (idx >= N) break;
    const t = n / SR, p = t / dur;
    let nz = Math.random() * 2 - 1;
    const cut = 0.015 + 0.45 * p; lp += cut * (nz - lp);
    const hp = nz - lp;
    const f = 110 * Math.pow(9, p);                  // steigender Ton
    const sweep = Math.sin(2 * Math.PI * f * t) * 0.35;
    const eg = Math.pow(p, 1.9) * gain;
    const v = (hp * 0.85 + sweep) * eg;
    const pan = Math.sin(2 * Math.PI * 3 * t) * 0.3; // leichte Bewegung
    L[idx] += v * (1 - Math.max(0, pan));
    Rr[idx] += v * (1 + Math.min(0, pan));
  }
}
function tick(t0, gain = 0.25) {
  const n0 = Math.floor(t0 * SR), dur = 0.18;
  for (let n = 0; n < dur * SR; n++) {
    const idx = n0 + n; if (idx >= N) break;
    const t = n / SR;
    const v = Math.sin(2 * Math.PI * 140 * t) * Math.exp(-22 * t) * gain;
    L[idx] += v; Rr[idx] += v;
  }
}
function reverb(mix = 0.16) {
  const taps = [0.029, 0.047, 0.067, 0.089, 0.113].map((s) => Math.floor(s * SR));
  const fb = 0.55;
  const oL = Float32Array.from(L), oR = Float32Array.from(Rr);
  for (const dly of taps) {
    for (let n = dly; n < N; n++) {
      L[n] += oL[n - dly] * fb * mix;
      Rr[n] += oR[n - dly] * fb * mix;
    }
  }
}

// ---------- Arrangement ----------
// 1) Tiefer Grund-Drone über die Schmerz-Phase (kalt)
tone({ freq: 55, t0: 0.5, dur: 21.5, gain: 0.16, a: 3, r: 1.5, vibRate: 0.1, vibDepth: 0.4 });
tone({ freq: 82.5, t0: 1.0, dur: 21, gain: 0.07, a: 4, r: 1.5, pan: -0.3 });
tone({ freq: 110, t0: 6.0, dur: 15.5, gain: 0.04, a: 4, r: 1.5, pan: 0.3 });

// 2) Schmerz-Ticks im Takt der Montage
[12.6, 14.8, 17.0, 19.3, 20.4].forEach((t) => tick(t, 0.28));

// 3) Wendepunkt: kurze Stille, dann Spannungs-Drone + Riser bis zum Einschlag
tone({ freq: 55, t0: 22.4, dur: 17.8, gain: 0.13, a: 1.5, r: 0.3 });
tone({ freq: 73.4, t0: 26.5, dur: 13.4, gain: 0.08, a: 3, r: 0.3, pan: 0.25 }); // D
// beschleunigende Ticks Richtung Climax
for (let k = 0; k < 9; k++) { const t = 30 + k * (10 / (9 + k)); if (t < 39.9) tick(t, 0.18 + k * 0.02); }
riser(33.5, 6.5, 0.55);

// 4) EINSCHLAG bei "STROM"
boom(40.0, 1.05);
boom(40.04, 0.5);
tone({ freq: 110, t0: 40.0, dur: 3.6, gain: 0.10, a: 0.01, d: 1.5, s: 0.4, r: 1.5 });

// 5) Hoffnungsvoller Pad-Akkord ab dem Reveal (A-moll → Auflösung), warm
const padStart = 40.1, padDur = 33.9;
// A2, E3, A3, C4, E4  (warm, breit)
[[110, -0.4], [164.81, 0.3], [220, -0.2], [261.63, 0.35], [329.63, 0]].forEach(([f, pan], i) =>
  tone({ freq: f, t0: padStart + i * 0.08, dur: padDur, gain: 0.06, a: 3.5, r: 4, pan, vibRate: 0.12, vibDepth: 0.6 })
);
// sanfter Sub bleibt
tone({ freq: 55, t0: 43.5, dur: 30.5, gain: 0.10, a: 3, r: 5 });

// 6) Finale-Swell zur Marke (helle Oktave dazu)
[[440, 0.2], [329.63, -0.25], [659.25, 0]].forEach(([f, pan]) =>
  tone({ freq: f, t0: 62.5, dur: 11.5, gain: 0.045, a: 2.5, r: 5, pan })
);
boom(62.9, 0.6); // weicher Marken-Hit

// ---------- Master ----------
reverb(0.15);
// Normalisieren + sanfter Limiter
let peak = 0;
for (let n = 0; n < N; n++) { peak = Math.max(peak, Math.abs(L[n]), Math.abs(Rr[n])); }
const norm = peak > 0 ? 0.92 / peak : 1;
function softclip(x) { return Math.tanh(x * 1.05); }

// 16-bit PCM WAV schreiben
const bytesPerSample = 2, channels = 2;
const dataLen = N * channels * bytesPerSample;
const buf = Buffer.alloc(44 + dataLen);
buf.write("RIFF", 0); buf.writeUInt32LE(36 + dataLen, 4); buf.write("WAVE", 8);
buf.write("fmt ", 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20);
buf.writeUInt16LE(channels, 22); buf.writeUInt32LE(SR, 24);
buf.writeUInt32LE(SR * channels * bytesPerSample, 28);
buf.writeUInt16LE(channels * bytesPerSample, 32); buf.writeUInt16LE(16, 34);
buf.write("data", 36); buf.writeUInt32LE(dataLen, 40);
let off = 44;
for (let n = 0; n < N; n++) {
  const l = Math.max(-1, Math.min(1, softclip(L[n] * norm)));
  const r = Math.max(-1, Math.min(1, softclip(Rr[n] * norm)));
  buf.writeInt16LE((l * 32767) | 0, off); off += 2;
  buf.writeInt16LE((r * 32767) | 0, off); off += 2;
}
fs.writeFileSync(__dirname + "/audio.wav", buf);
console.log("audio.wav geschrieben:", (dataLen / 1e6).toFixed(1), "MB,", DUR, "s");
