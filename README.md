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

Der Schiebeschalter zeigt nur den aktiven Modus als Überschrift an:
„Modus: Einzelsteigerung“ oder „Modus: Steigerung 5“. Über das Info-Symbol daneben
öffnet sich die Kostentabelle für den aktiven Modus in einem separaten Popup;
die aktuelle Kaufplanung bleibt dabei erhalten.

Talente werden außerhalb des Level-Up-Dialogs manuell verwaltet. Die abgeleiteten
Talentwirkungen und Erwerbsgrenzen werden weiterhin im Charakterbogen angezeigt.
In 5e enthält der Punkteabschnitt ausschließlich Schicksal und Glück. Das
Glücksmaximum wird unabhängig von Schicksal eingetragen. 4e behält zusätzlich
Zähigkeit und Mut.

Ambitionen, Hintergrund, Beziehungen und Notizen sowie Verletzungen und
Krankheiten werden manuell geführt. Es gibt keine automatische Heilung, EP-Vergabe,
Karriereprüfung oder Vorteilsverwaltung.

### Zustände in 5e

5e verwendet eigene Regeltexte für alle 13 Zustände, einschließlich Besudelt
(Besmirched), mit dem bereitgestellten PNG unter `img/bismerched.png`.
Besudelt, Niedergestreckt, Überrascht und Bewusstlos sind An/Aus;
die übrigen Zustände sind zählbar, auch über neun hinaus. Die blau hinterlegten
Zähler sind schreibgeschützt und lassen sich über die Pfeile bearbeiten. 4e behält die bisherige Liste und Zählergrenze.

Die Zustände sind alphabetisch sortiert. Kompakte Zahlenfelder und Pfeile stehen
wieder rechts neben dem Icon; das Info-Symbol bleibt separat am rechten Rand.
Beide Editionen verwenden eine gemeinsame Tabelle mit ein Pixel breiten
inneren Trennlinien, ohne Außenrahmen oder einzelne Statusboxen. Zustandsnamen
und Bedienelemente sind normal gewichtet. Der letzte einzelne 5e-Zustand steht
links mit oberer und rechter Trennlinie. Die obere Linie trennt auch den letzten
rechten Zustand der vorherigen Reihe ab. Freie Flächen haben die allgemeine
Hintergrundfarbe. Der 5e-Punkteabschnitt ist bei gleicher Feldbreite
zentriert.

Die Übersicht zeigt die gleiche Bulletpoint-Liste mit Ursachen wie das
Info-Popup und nur geltende Wirkungen: höchste passende SL-Mali statt
Addition verschiedener Zustände, zusammengefassten Vorteil/Nachteil und die
strengste relevante Handlungseinschränkung. Teilweise überlappende Bereiche wie
Bewegung und Rennen/Verstecken bleiben getrennt berücksichtigt. Schaden und
verpflichtende Proben bleiben eigenständige Folgen. Bei Bewusstlosigkeit werden
noch eingetragene Betäubt-Zustände nicht als geltender Malus berücksichtigt;
ein Hinweis erinnert daran, sie manuell zu entfernen.

Das Info-Symbol der Übersicht erklärt Ursachen und überdeckte Wirkungen.
Jeder Zustand hat ein eigenes Popup mit Wirkung, Zeitpunkt/Dauer, Entfernung
und Sonderfällen. Gefesselt enthält zusätzlich die Materialstärkentabelle.
Niedergestreckt folgt der konkreten Beschreibung mit Nachteil auf
bewegungsbezogene Proben; das widersprüchliche allgemeine Beispiel mit −2 SL
wird nicht zusätzlich verwendet.

Hinweise bei 0 LP, Betäubt über WI-Bonus oder bewusstloser Vergiftung aktualisieren
sich mit den eingegebenen Werten. Beim Entfernen des letzten Vergiftet- oder
Betäubt-Zustands erinnert die App an Erschöpft. Diese Entfernungshinweise tragen
links ein rotes Ausrufezeichen und lassen sich rechts über ein rotes Kreuz einzeln
schließen. Sie werden beim Laden eines Charakters zurückgesetzt. Beim Erhalt
eines Zustands geht Momentum verloren; das steht als Hinweis in den Popups.
Es gibt keine automatische Rundenverwaltung, Würfe, LP-Verluste, Todesentscheidung
oder Änderung weiterer Zustände. Die Karten behalten ihre manuell gesetzten Werte.

Die Korruptionsübersicht zeigt in beiden Editionen untereinander den aktuellen
Wert, WIB (Widerstandsbonus), WKB (Willenskraftbonus), Pure-Soul-Zuschlag und die
maximale Korruption. Die drei Bestandteile sind kursiv und werden automatisch
berechnet; die editionsabhängige Schwelle bleibt unverändert.

### Zustände in 4e

Die zwölf 4e-Zustände verwenden die bereitgestellten Regeltexte in separaten
Berechnungen. Die Übersicht zeigt wie in 5e Bulletpoints mit den höchsten
passenden Prozentmodifikatoren, eigenständigen Schadensfolgen und Quellen.
Das Info-Symbol erklärt überdeckte Wirkungen; die Zustands-Popups gliedern
Wirkung, Zeitpunkt, Entfernung und Sonderfälle. Beim Erhalt eines Zustands geht
sämtlicher Vorteil verloren, nicht Momentum.

Blutend führt bei 0 LP sofort zu Bewusstlosigkeit und am Rundenende zu 10 %
Todesrisiko je Zustand; ein Pasch entfernt einen Blutend-Zustand. Die App zeigt
Hinweise, würfelt und verändert LP oder Todesstatus aber nicht automatisch.
Brennend verursacht nach Reduktion mindestens 1 LP Verlust. Bei bewusstloser
Vergiftung nennt der Text eine Todesprobe nach WI-Bonus Runden; die 5e-Wiederholung
alle WI-Bonus Runden wird nicht übernommen. Betäubt verbietet Aktionen, erlaubt
Verteidigung außer mit Sprache (Magick), gewährt dem Nahkampfangreifer einmal
+1 Vorteil und wird nicht automatisch bei Bewusstlosigkeit entfernt.

Entfernungshinweise erinnern bei Blutend, Demoralisiert und Vergiftet an Erschöpft,
bei Betäubt nur wenn noch kein Erschöpft besteht. Beim Erwachen erinnern sie an
Niedergestreckt und Erschöpft. Alle Folgen bleiben manuell. Niedergestreckt folgt
der konkreten Beschreibung mit −20 auf bewegungsbezogene Proben, nicht dem
abweichenden allgemeinen Beispiel für alle aktiven Proben.

## Offline und Updates

Die App und ihre lokalen Bilder werden einschließlich relativer Pfade für eine
Installation im Unterverzeichnis vorab zwischengespeichert. Externe Schriftarten
benötigen eine Verbindung; offline werden Ersatzschriften verwendet. Ein Update
wartet auf Bestätigung, speichert vorher den Bogen und lädt anschließend neu.
Eine abgelehnte Aktualisierung kann beim nächsten Öffnen erneut angeboten werden.
