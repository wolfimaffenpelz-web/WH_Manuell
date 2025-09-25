// Lebenspunkte und Traglast
const statsSections = [
  {
    id: "lebenspunkte",
    title: t('lebenspunkte'),
    content: `
      <table class="full-width" id="lp-table">
        <tr><th>Komponente</th><th>Wert</th></tr>
        <tr><td>ST-Bonus</td><td><input type="number" id="lp-stb" readonly></td></tr>
        <tr><td>WI-Bonus</td><td><input type="number" id="lp-wib" readonly></td></tr>
        <tr><td>2× WK-Bonus</td><td><input type="number" id="lp-wkb" readonly></td></tr>
        <tr><td>Robustheit*</td><td><input type="number" id="lp-robustheit" readonly></td></tr>
        <tr><td>Gesamt-LP</td><td><input type="number" id="lp-gesamt" readonly></td></tr>
        <tr><td>${t('current_lp')}</td><td><input type="number" id="lp-aktuell" min="0" max="99"></td></tr>
      </table>
      <p>* Automatisch durch Talent "Robustheit" / "Hardy"</p>
      <div class="section-divider"></div>
    `
  },
  {
    id: "traglast",
    title: t('traglast'),
    content: `
      <table class="full-width" id="traglast-table">
        <tr><th>Quelle</th><th>TP</th></tr>
        <tr><td>Waffen</td><td><input type="number" id="trag-waffen" readonly></td></tr>
        <tr><td>Rüstung</td><td><input type="number" id="trag-ruestung" readonly></td></tr>
        <tr><td>Ausrüstung</td><td><input type="number" id="trag-ausruestung" readonly></td></tr>
        <tr><td>Maximale TP</td><td><input type="number" id="trag-max" readonly></td></tr>
        <tr><td>Gesamt</td><td><input type="number" id="trag-gesamt" readonly></td></tr>
      </table>
      <div class="section-divider"></div>
    `
  }
];
