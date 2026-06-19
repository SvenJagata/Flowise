# BNI Hauptpräsentation – KK Hannover

Eine **self-contained, offline-fähige** HTML-Präsentation für deine BNI-Hauptpräsentation (7 Min).
Kein Internet, keine Installation, keine Cloud nötig – läuft in jedem modernen Browser.

## ▶️ Starten
Doppelklick auf **`index.html`** → Browser öffnet sich.
Dann `F` drücken für **Vollbild** und loslegen.

> Tipp: Vorab einmal testen – am besten auf dem Rechner/Beamer, mit dem du präsentierst.

## ⌨️ Steuerung
| Taste | Funktion |
|-------|----------|
| `→` / `Leertaste` | weiter |
| `←` | zurück |
| `F` | Vollbild an/aus |
| `N` | **Sprechernotizen** ein-/ausblenden (nur für dich) |
| `Esc` | **Übersicht** aller Folien (Klick = hinspringen) |
| Wischen | weiter/zurück (Touch/Tablet) |

## 🎬 Dein Demo-Video einbinden (Wow-Effekt)
Auf **Folie 6** ist deine Live-Voice-Agent-Demo platziert.

1. Nimm deinen KI-Anruf als Video auf (oder Screen-Recording mit Ton).
2. Speichere es als **`assets/voice-agent-demo.mp4`** (genau dieser Name/Ort).
3. Optional ein Standbild als **`assets/poster.jpg`** für die Vorschau.

Fertig – das Video erscheint automatisch und pausiert/startet mit der Folie.
Solange kein Video da ist, zeigt die Folie einen Platzhalter (sieht trotzdem sauber aus).

**Alternative:** Wirklich live anrufen – dann nutzt du Folie 6 nur als Bühne/Überschrift.
(Empfehlung: Video als Sicherheitsnetz **immer** bereithalten, falls das Live-Netz zickt.)

## 🗣️ Sprechzettel
Den kompletten Redetext mit Timing, Pointen und Übergängen findest du in **`sprechzettel.md`**.
Du kannst die Notizen auch direkt in der Präsentation mit `N` einblenden.

## 📦 Export (optional)
- **PDF:** im Browser `Strg/Cmd + P` → „Als PDF speichern“ (Querformat, Hintergrundgrafiken aktivieren).
- Die Präsentation funktioniert auch ohne Export direkt im Browser am besten (Animationen!).

## 🎨 Anpassen
Alles steckt in `index.html`:
- **Texte/Folien:** die `<section class="slide">`-Blöcke.
- **Farben:** ganz oben im `:root { ... }`-Block (CSS-Variablen).
- **Notizen:** das `data-notes="..."`-Attribut je Folie.

Viel Erfolg am Freitag! 🚀
