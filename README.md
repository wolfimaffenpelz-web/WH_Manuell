# Warhammer Fantasy Charakterverwaltung

Statische, lokale Charakterverwaltung für WFRP 4e (Grundregelwerk inklusive
*Up in Arms*). WFRP 5e nutzt einen vollständigen Bogen mit getrennten Charakteren und den von
der Gruppe bereitgestellten Talent- und Steigerungsregeln. Gewürfelt wird am Tisch.

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
Bearbeitung; „Als lebend markieren“ hebt die Sperre wieder auf. Beide Aktionen befinden sich
im Popup der Charakter-Löschschaltfläche.

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

„Nach 5e übertragen“ zeigt vor dem Bestätigen die Übernahme und Anpassungen an.
Es entsteht ein unabhängiger 5e-Charakter mit neuer ID und allen bisherigen Angaben,
einschließlich Waffen, Rüstung, Ersparnissen, Verletzungen und EP-Historie. Die
Erwerbungen der vier automatisch berücksichtigten Talente werden editionsgerecht
begrenzt, auch über doppelte deutsch/englische Zeilen hinweg. Hinweise und Marker
bleiben erhalten. Abgeleitete Werte werden für 5e neu berechnet; aktuelle LP und
historisch ausgegebene EP werden beibehalten. Andere Talente und Karriereangaben
sind am Tisch auf Kompatibilität zu prüfen.

Sämtliche ursprünglichen 4e-Daten bleiben unverändert im Transferbericht erhalten
und können als 4e-Backup exportiert werden. Beide Charaktere speichern ihre
Verbindung und werden unabhängig weitergeführt. Ältere Entwürfe werden nicht
ungefragt mit ihrem Quellstand überschrieben.

### Abweichende Talentwirkungen in 5e

| Talent | Wirkung | Erwerbsgrenze |
| --- | --- | --- |
| Hardy / Robustheit | Ein zusätzlicher WI-Bonus auf maximale LP | 1 |
| Pure Soul / Reine Seele | Doppelte Korruptionsschwelle: 2 × (WI-Bonus + WK-Bonus) | 1 |
| Strong Back / Starker Rücken | +1 Traglast beim ersten, insgesamt +3 beim zweiten Erwerb | 2 |
| Sturdy / Stämmig | ST-Bonus zählt bei der Traglast doppelt | 1 |

Die Traglast ist somit ST-Bonus + WI-Bonus + Sturdy-Zuschlag + Strong-Back-Zuschlag.
Bei **mehr** Korruptionspunkten als der Schwelle erscheint der Hinweis auf die
Challenging-Ausdauerprobe (+0 SL). Probe und Mutation bleiben manuell am Tisch.
Unzulässige manuelle Talentstufen erzeugen Hinweise; ihre Wirkung wird nicht
über die angegebenen Regeln hinaus vervielfacht.

### 5e-Steigerungskäufe

Der Kaufdialog bietet +1 und +5 an; die Auswahl wird je Charakter gespeichert.
+5 ist je Attribut/Fähigkeit nur bei einem Vielfachen von fünf bisherigen
Steigerungen möglich. Für andere Werte wird zunächst +1 verwendet. Ein Wechsel
im Dialog verwirft die noch nicht bestätigte Planung. Ein Transfer startet mit +1,
um bereits vorhandene einzelne 4e-Steigerungen bearbeiten zu können.

Kosten entsprechen den bereitgestellten Tabellen, einschließlich 71+ im
Einzelschritt. Ein vollständiger +5-Block kostet fünf Einzelpunkte. Die Bereiche
beziehen sich auf gekaufte Steigerungen, nicht den Gesamtspielwert. Der jeweils
sichtbare EP-Modus (einfach/voll) wird für 5e-Käufe verwendet.

In 5e können markierte Talente mit Stufe 0 im Kaufdialog für 100 EP erstmals
erworben werden. Strong Back kann bis zur zweiten Erwerbung gekauft werden,
ebenfalls für 100 EP. Für andere Talente ist automatische Wiederholbarkeit ohne
zusätzliche Regeltexte nicht hinterlegt; ihre Verwaltung bleibt manuell möglich.

Ambitionen, Hintergrund, Beziehungen und Notizen sowie Verletzungen und
Krankheiten werden manuell geführt. Es gibt keine automatische Heilung, EP-Vergabe,
Karriereprüfung oder Vorteilsverwaltung.

## Offline und Updates

Die App und ihre lokalen Bilder werden einschließlich relativer Pfade für eine
Installation im Unterverzeichnis vorab zwischengespeichert. Externe Schriftarten
benötigen eine Verbindung; offline werden Ersatzschriften verwendet. Ein Update
wartet auf Bestätigung, speichert vorher den Bogen und lädt anschließend neu.
Eine abgelehnte Aktualisierung kann beim nächsten Öffnen erneut angeboten werden.
