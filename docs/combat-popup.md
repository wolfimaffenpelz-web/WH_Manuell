# Kampf-Popup: Bestandsaufnahme und Regelgrenzen

## Vor der Implementierung geprüft

- Statische App: `sections.js` rendert den Bogen; `logic.js` berechnet Attribute,
  Fertigkeiten, LP und Rüstung. `edition-ui.js` wechselt vollständige Editionsansichten.
- Ressourcen sind bestehende numerische Felder (0–99); LP über dem berechneten
  Maximum sind bisher mit Warnung erlaubt. Glück und Mut haben eigene Maximalfelder.
- Waffen: Tabellenzeilen mit Name, freier Waffengruppe, TP, Reichweite, freiem
  Schaden und freien Qualitäten. Keine Schadensauswertung und keine strukturierte
  Zuordnung einer Waffengruppe zu einer Fertigkeit vorhanden.
- Fertigkeitsgesamtwerte stehen bereits im Bogen; gruppierte Fertigkeiten sind
  Freitext mit gewähltem Attribut und berechnetem Gesamtwert.
- Rüstung: `updateRuestung()` summiert die aktuellen RP ausgerüsteter Teile pro
  Zone einschließlich Beschädigungen. Qualitäten sind Freitext pro Rüstungsteil.
- `conditions4e.js` und `conditions5e.js` enthalten bereits zentrale, getestete
  Zustandsregeln. 4e verwendet den stärksten anwendbaren Abzug statt Addition.
  5e enthält SL-Abzüge und situative Nachteile, keine entsprechenden Prozentabzüge.
- Overlays, Zustandsicons, Farb-/Schriftvariablen und Übersetzungen sind vorhanden.
  Englisch verwendet bisher deutsche Platzhalter. Neue Popup-Texte erhalten Englisch.
- CharacterStore filtert gespeicherte Felder und Backups. Neue UI-Felder müssen
  sowohl im Filter als auch in den erlaubten Feldern der App registriert werden.

## Offene Punkte (vor Implementierung der betroffenen Regeln)

1. Eigenschaftentexte fehlen. Nutzerentscheidung: vorerst nur die vorhandenen
   Waffen-Notizen/Eigenschaften aus der vorletzten Spalte anzeigen. Auch bei
   Rüstung werden vorhandene Notizen mit ihren Zonen angezeigt; keine neue Regeldatenbank.
2. Nutzerentscheidung: Schadensformeln einheitlich als `STB+4`. Unterstützt werden
   `STB`, `STB+n`, `STB-n` (optional Leerzeichen) mit aktuellem Stärkebonus. Andere
   Angaben bleiben unverändert. Waffengruppen werden nur bei eindeutigem Treffer
   einem tatsächlichen Fertigkeitsnamen oder dessen Klammergruppe zugeordnet.
3. Sicht- und Bewegungsabhängigkeit von Nahkampfproben ist nicht strukturiert
   definiert. Solche Auswirkungen als vorhandene Regelhinweise zeigen; für
   Ausweichen den bestehenden Bewegungsabzug verwenden. Keine situative Annahme.
4. 5e-SL-Abzüge niemals in Prozentwerte umrechnen oder Erfolgsgrade berechnen.
   Die vorhandenen Regelhinweise bleiben zugänglich. Keine Vorteilsschalter.

## Integration

Nur `combat-weapon` und `combat-defense` werden als UI-Auswahl pro Charakter im
bestehenden State gespeichert. Alle Kampfwerte werden live aus dem Bogen gelesen.
Manuelle Modifikatoren gelten nur bis zum Schließen oder Charakterwechsel.
Die Waffenauswahl verwendet den Inhalt der Zeile und einen Duplikatindex, da das
Inventar keine IDs hat. Bearbeitete/entfernte Waffen setzen die Auswahl zurück;
inhaltlich identische Duplikate sind dadurch nicht dauerhaft unterscheidbar.

Die ursprüngliche Anforderung zu neuen Eigenschaftsregeltexten wurde vom Nutzer
zugunsten der vorhandenen Notizen zurückgestellt. Unbekannte Schadensformeln und
mehrdeutige Waffengruppen werden nicht interpretiert.
