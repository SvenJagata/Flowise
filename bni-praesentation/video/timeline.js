// Gemeinsame Timeline für Bild (render.js) und Ton (audio.js)
// Alle Zeiten in Sekunden. Cinematischer Trailer-Aufbau.
const fps = 30, W = 1920, H = 1080, DUR = 74;

// upper: GROSSSCHRIFT · key: Farbverlauf-Text · impact: Einschlag · line: Akzentlinie · sub: kleine Unterzeile
const cards = [
  { t: 2.0,  e: 5.0,  text: "Jeden Tag.",                          size: 118, upper: true },
  { t: 5.0,  e: 8.6,  text: "verlierst du Stunden.",               size: 96,  upper: true },
  { t: 8.7,  e: 12.3, text: "An Arbeit,\ndie keiner machen will.", size: 78 },
  // — Montage des Schmerzes (schneller) —
  { t: 12.6, e: 14.7, text: "Anrufe, die niemand annimmt.",        size: 66 },
  { t: 14.8, e: 16.9, text: "Angebote, die liegen bleiben.",       size: 66 },
  { t: 17.0, e: 19.1, text: "E-Mails. Daten. Routine.",            size: 74 },
  { t: 19.3, e: 21.6, text: "Wieder. Und wieder.",                 size: 92, upper: true },
  // — Wendepunkt —
  { t: 22.6, e: 26.3, text: "Was, wenn das ab morgen\njemand anderes macht?", size: 70 },
  { t: 26.7, e: 29.4, text: "Stell dir einen Mitarbeiter vor —",   size: 64 },
  { t: 29.5, e: 31.8, text: "der niemals schläft.",                size: 86 },
  { t: 31.9, e: 34.2, text: "niemals krank wird.",                 size: 86 },
  { t: 34.3, e: 36.6, text: "niemals Urlaub braucht.",             size: 86 },
  { t: 36.8, e: 39.9, text: "der nur EINES kostet —",              size: 84 },
  // — Einschlag —
  { t: 40.0, e: 43.8, text: "STROM.",                              size: 300, upper: true, key: true, impact: true },
  // — Hoffnung / Möglichkeiten —
  { t: 44.4, e: 47.6, text: "Er nimmt jeden Anruf an.",            size: 78 },
  { t: 47.7, e: 51.0, text: "Schreibt Angebote in Sekunden.",      size: 72 },
  { t: 51.1, e: 54.4, text: "Arbeitet, während du schläfst.",      size: 74 },
  { t: 55.0, e: 58.3, text: "Das ist keine Zukunft.",              size: 92, upper: true },
  { t: 58.4, e: 62.2, text: "Das ist Künstliche Intelligenz.\nHeute.", size: 80, key: true },
  // — Marke / Finale —
  { t: 62.9, e: 66.8, text: "KK HANNOVER",                         size: 168, key: true, line: true },
  { t: 66.9, e: 70.6, text: "Wir bauen Mitarbeiter aus Code.",     size: 80 },
  { t: 70.8, e: 74.0, text: "KI-Agentur · Hannover & Wedemark · kk-hannover.de", size: 42, sub: true },
];

module.exports = { fps, W, H, DUR, cards };
