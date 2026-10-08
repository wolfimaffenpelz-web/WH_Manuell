# Warhammer Fantasy Charakterverwaltung

Statische, lokale Charakterverwaltung für WFRP 4e (Grundregelwerk inklusive
*Up in Arms*). WFRP 5e ist zunächst eine getrennte Verwaltung für Entwürfe;
5e-Regelfelder und Umrechnungen sind noch nicht hinterlegt. Gewürfelt wird am Tisch.

## Start und Prüfung

```sh
npm ci
npm start
npm run lint
npm test
```

HTML, CSS und JavaScript werden direkt geladen; ein Build ist nicht erforderlich.
Die GitHub-Checks prüfen Lint und Tests mit Node.js 22. Für eine optionale echte
Browserprüfung siehe `tests/browser-smoke.cjs` (Playwright und Chromium erforderlich).
Die automatisierten Tests decken Migration, Speicherfehler, Import/Export,
Charakterwechsel, Status, Talente, Editionswechsel und Service Worker ab.

## Daten und Backups

Alle Daten liegen im Browser auf dem jeweiligen Telefon. Es gibt keine
Nutzerkonten oder Synchronisierung zwischen Geräten. Bei einer Installation
unter einer anderen Webadresse, einem anderen Browser oder nach dem Löschen der
Browserdaten müssen Backups importiert werden. Die bestehende Zugangssperre ist
keine Verschlüsselung der lokal gespeicherten Daten.

Vor dem ersten Update den bisherigen Charakter exportieren. Beim ersten Start
werden die alten namensbasierten Speicherstände einmalig in das Format
`wfrp-characters-v2` übernommen. Jeder Charakter erhält eine UUID und die Edition
4e. Alte `characters`-/`state-*`-Schlüssel bleiben als Rückfallmöglichkeit erhalten;
die neue App schreibt ausschließlich in das neue Format.

Exports heißen `Name_Edition_YYYY-MM-DD_HH-mm-ss_UUID.json`. Der Dateiname verwendet
Europe/Berlin; der Inhalt enthält einen UTC-Exportzeitpunkt und Formatversion 2.
Der Charaktername darf geändert werden und mehrfach vorkommen, die UUID bleibt
stabil. Felder außerhalb des Charakterbogens werden nicht exportiert.

Der Import zeigt vor jeder Übernahme eine Vorschau. Bei bekannter ID ist
Überschreiben voreingestellt; alternativ wird eine Kopie mit neuer ID angelegt.
Unbekannte IDs werden erhalten und als neue Charaktere importiert. Alte Exports
ohne UUID werden anhand des Namens zugeordnet, mit Auswahl bei mehreren Treffern.
Vor dem Überschreiben wird genau ein Wiederherstellungsstand angelegt. Der Button
„Stand vor letztem Import wiederherstellen“ setzt diesen zurück. Für eine längere
Historie die JSON-Backups aufbewahren.

Während des Ladens wird nicht gespeichert. Bei einem Ladefehler bleibt der
Bogen gesperrt; der gespeicherte Datensatz kann exportiert und das Laden erneut
versucht werden. „Verstorben“ wird dauerhaft gespeichert und sperrt die
Bearbeitung; „Als lebend markieren“ hebt die Sperre wieder auf.

## Vier automatische Talente

Die Zuordnung erfolgt über die exakten deutschen/englischen Namen, unabhängig
von manuell ausgewählten Hinweisen oder Markern. Groß-/Kleinschreibung und
überzählige Leerzeichen spielen keine Rolle.

| Talent | Zuschlag | Maximum an Erwerbungen |
| --- | --- | --- |
| Hardy / Robustheit | WI-Bonus × Erwerbungen auf maximale LP | WI-Bonus |
| Pure Soul / Reine Seele | Erwerbungen auf Korruptionsschwelle | WK-Bonus |
| Strong Back / Starker Rücken | Erwerbungen auf Traglast | ST-Bonus |
| Sturdy / Stämmig | 2 × Erwerbungen auf Traglast | ST-Bonus |

Ein vorhandenes Talent mit leerer Stufe zählt wie bisher als eine Erwerbung;
eine explizite Stufe 0 zählt nicht. Doppelte Zeilen werden addiert. Überschrittene
Erwerbsgrenzen erzeugen Hinweise, keine automatische Begrenzung. Aktuelle LP
werden beim korrigierten Hardy-Zuschlag erhalten; ein Wert über dem Maximum wird
angezeigt. Sonstige Talentwirkungen werden nicht automatisch angewendet.

## Editionswechsel und Transfer

4e und 5e haben getrennte Charakterlisten und merken sich ihre letzte Auswahl.
Der Wechsel speichert den aktuellen Bogen und konvertiert keine Werte.

„Nach 5e übertragen“ zeigt vor dem Bestätigen, welche Angaben übernommen werden
und welche noch zuzuordnen sind. Es entsteht ein unabhängiger 5e-Entwurf mit neuer
ID, Identität und Hintergrund. Sämtliche 4e-Spielwerte werden unverändert als
Quellstand im Transferbericht bewahrt und können als 4e-Backup exportiert werden.
Das 4e-Original bleibt erhalten; beide Datensätze speichern ihre Verbindung.
5e-Regelzuordnungen, manuelle Wertzuordnung und Neuberechnung folgen erst nach
Festlegung der 5e-Regelbasis.

Ambitionen, Hintergrund, Beziehungen und Notizen sowie Verletzungen und
Krankheiten werden manuell geführt. Es gibt keine automatische Heilung, EP-Vergabe,
Karriereprüfung oder Vorteilsverwaltung.

## Offline und Updates

Die App und ihre lokalen Bilder werden einschließlich relativer Pfade für eine
Installation im Unterverzeichnis vorab zwischengespeichert. Externe Schriftarten
benötigen eine Verbindung; offline werden Ersatzschriften verwendet. Ein Update
wartet auf Bestätigung, speichert vorher den Bogen und lädt anschließend neu.
Eine abgelehnte Aktualisierung kann beim nächsten Öffnen erneut angeboten werden.
