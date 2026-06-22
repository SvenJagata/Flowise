# 🎬 KK Hannover – Cinematischer KI-Trailer (BNI)

Ein **dramatisches, cinematisches Video** im Stil eines Kino-Trailers – komplett aus Code generiert.
**Keine Folien, keine Bilder, keine Stockfotos.** Nur kraftvolle Kinetic Typography auf Schwarz,
dramatischer Verlauf-Glow, Filmkorn, Vignette, Screen-Shake beim Einschlag – und eine
**selbst synthetisierte, dramatische Tonspur** (tiefer Drone → Riser → Sub-Boom → hoffnungsvolles Finale).

## ▶️ Das fertige Video
**`video/kk-hannover-trailer.mp4`** · 1920×1080 · 74 Sekunden · H.264 + Ton (18 MB)

Einfach abspielen (Doppelklick) – am besten in Vollbild auf dem Beamer, **Ton laut**. 🔊

## 🎞️ Der dramaturgische Aufbau
1. **Problem (kalt, dunkel):** „Jeden Tag verlierst du Stunden … an Arbeit, die keiner machen will.“
2. **Montage des Schmerzes:** verpasste Anrufe, liegengebliebene Angebote, Routine – „Wieder. Und wieder.“
3. **Wendepunkt + Riser:** „Was, wenn das ab morgen jemand anderes macht? … der niemals schläft, niemals krank wird … der nur EINES kostet —“
4. **Einschlag:** **„STROM.“** (Boom, Flash, Screen-Shake)
5. **Hoffnung:** „Er nimmt jeden Anruf an. Schreibt Angebote in Sekunden. Arbeitet, während du schläfst.“
6. **Reveal:** „Das ist keine Zukunft. Das ist Künstliche Intelligenz. Heute.“
7. **Marke:** **KK HANNOVER** · „Wir bauen Mitarbeiter aus Code.“ · KI-Agentur Hannover & Wedemark

## 🛠️ Neu erzeugen / anpassen
Alles ist Code – kein Schnittprogramm nötig.

```bash
cd video
npm install            # holt ffmpeg-static + @napi-rs/canvas (einmalig)
node audio.js          # erzeugt die Tonspur  -> audio.wav
node render.js         # rendert & encodiert  -> kk-hannover-trailer.mp4
```

**Was du leicht ändern kannst:**
- **`timeline.js`** – jede Zeile/Karte: Text, Einblendzeit (`t`), Ausblendzeit (`e`), Größe (`size`),
  Optionen (`upper` = Großschrift, `key` = Farbverlauf-Text, `impact` = Einschlag, `line` = Akzentlinie, `sub` = kleine Unterzeile).
- **`render.js`** – `moodStops` (Farb-/Stimmungsverlauf), Glow, Filmkorn, Vignette, Encode-Qualität (`-crf`).
- **`audio.js`** – Arrangement der Tonspur (Drone, Ticks, Riser, Boom-Zeitpunkt, Finale-Akkord).

> Bitrate/Größe: gesteuert über `-crf` und `-maxrate` in `render.js`. Aktuell ~2 Mbit/s → 18 MB.

## 💡 Einsatz beim BNI-Meeting
- Als **Opener** vor deiner Hauptpräsentation (zieht den Raum sofort rein), oder
- als **kompletter, eigenständiger Auftritt** mit kurzem Live-Schlusswort von dir
  (Empfehlungsfrage ans Chapter), oder
- als **Teaser** für Social Media / Website.

Hinweis: `node_modules/` und die Zwischendatei `audio.wav` sind bewusst nicht eingecheckt
(siehe `video/.gitignore`) – beide werden durch die Befehle oben neu erzeugt.
