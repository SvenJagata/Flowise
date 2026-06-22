# BNI Hauptpräsentation – „Die KI-Show“ (KK Hannover)

Eine **self-contained, offline-fähige** HTML-Präsentation mit **echten Live-Effekten** direkt im Browser.
Kein Internet, keine Installation, **kein Video nötig** – die KI spricht und tippt live.

## ▶️ Starten
Doppelklick auf **`index.html`** → Browser öffnet sich → `F` für Vollbild → `Leertaste` startet die Show.

**Empfehlung:** Chrome oder Edge (beste Sprachausgabe).

## 🔊 WICHTIG vor dem Auftritt testen
Auf Folie 3 **spricht der Browser wirklich**. Damit das klappt:

1. **Lautstärke** am Präsentations-Rechner/Beamer aufdrehen.
2. **Deutsche Stimme** installiert haben:
   - **Windows:** Einstellungen → Zeit & Sprache → Sprache & Region → Deutsch-Sprachpaket inkl. Sprachausgabe.
   - **macOS:** Systemeinstellungen → Bedienungshilfen → Gesprochene Inhalte → Systemstimme (Deutsch laden).
   - Ohne deutsche Stimme liest die KI mit englischem Akzent – funktioniert, klingt aber besser mit DE-Stimme.
3. Einmal komplett durchspielen (Anruf + Tippen).

> Die Live-Demos werden per **Button-Klick** ausgelöst (volle Kontrolle, kein Auto-Start) – ideal fürs Timing auf der Bühne.

## ⌨️ Steuerung
| Taste | Funktion |
|-------|----------|
| `→` / `Leertaste` | weiter |
| `←` | zurück |
| `F` | Vollbild an/aus |
| `N` | **Sprechernotizen** ein/aus (nur für dich) |
| `Esc` | **Übersicht** aller Folien (Klick = hinspringen) |

## ✨ Die Live-WOW-Effekte
- **Folie 3 – KI-Anruf:** Button „📞 Anruf annehmen“ → es klingelt (Web-Audio), dann führt die KI einen **gesprochenen, witzigen Dialog** mit einem Anrufer und bucht den Termin. „↻ Nochmal“ wiederholt.
- **Folie 4 – KI schreibt:** Button „✨ KI schreiben lassen“ → ein Angebot wird **live getippt** (Streaming), am Ende der Stempel „4 Sek. statt 25 Min.“.
- **Folie 5 – Fallbeispiele:** Zahlen **zählen automatisch hoch**, sobald die Folie erscheint.
- **Folie 6 – Bandbreite:** die Möglichkeiten **leuchten nacheinander auf**.
- **Folie 7 – Vorher/Nachher:** **Regler live ziehen** (Maus/Touch), um „heute“ vs. „mit KI“ zu vergleichen.
- **Folie 9 – Finale:** **Konfetti** 🎉.
- **Titelfolie:** animiertes neuronales Partikel-Netz im Hintergrund.

## 🗣️ Sprechzettel
Kompletter Redetext mit Timing, Pointen und Mini-Spickzettel: **`sprechzettel.md`**.
Notizen lassen sich auch live mit `N` einblenden.

## 📦 Export (optional)
PDF: im Browser `Strg/Cmd + P` → „Als PDF speichern“ (Querformat, Hintergrundgrafiken aktivieren).
Hinweis: Im PDF sind die Live-Effekte naturgemäß nicht animiert – für den Auftritt **immer den Browser** nutzen.

## 🎨 Anpassen
Alles in `index.html`:
- **Dialog des Anrufs:** die `dialogue`-Liste im `<script>` (Texte, Reihenfolge, Stimme).
- **Angebotstext:** die Variable `offer`.
- **Fallbeispiel-Zahlen:** `data-to` / `data-suffix` an den `.num`-Elementen.
- **Farben:** `:root { ... }` ganz oben.
- **Notizen:** `data-notes="..."` je Folie.

Viel Erfolg am Freitag – Bühne frei für deinen Mitarbeiter aus Strom! 🚀⚡
