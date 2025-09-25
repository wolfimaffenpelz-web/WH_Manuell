// Allgemeine Charakterinformationen
const generalSections = [
  {
    id: "grunddaten",
    title: t('grunddaten'),
    content: `
      <div class="subsection">
        <h3>Identität</h3>
        <table class="full-width two-col-table">
          <tr><td>Name</td><td><input type="text" id="char-name"></td></tr>
          <tr><td>Volk</td><td><input type="text" id="char-volk"></td></tr>
          <tr><td>Geschlecht</td><td><input type="text" id="char-geschlecht"></td></tr>
        </table>
      </div>
      <div class="subsection">
        <h3>Karriere</h3>
        <table class="full-width two-col-table">
          <tr><td>Karriere</td><td><input type="text" id="char-karriere"></td></tr>
          <tr><td>Karrierestufe</td><td><input type="text" id="char-stufe"></td></tr>
          <tr><td>Karriereweg</td><td><input type="text" id="char-weg"></td></tr>
          <tr><td>Status</td><td><input type="text" id="char-status"></td></tr>
        </table>
      </div>
      <div class="subsection">
        <h3>Erscheinung</h3>
        <table class="full-width two-col-table">
          <tr><td>Alter</td><td><input type="text" id="char-alter"></td></tr>
          <tr><td>Körpergröße</td><td><input type="text" id="char-groesse"></td></tr>
          <tr><td>Haare</td><td><input type="text" id="char-haare"></td></tr>
          <tr><td>Augen</td><td><input type="text" id="char-augen"></td></tr>
        </table>
      </div>
      <div class="subsection">
        <h3>${t('movement')}</h3>
        <table class="movement-table">
          <tr>
            <td>${t('movement')}</td><td><input type="number" id="char-bewegung" class="tiny-field" max="99" step="1"></td>
            <td>${t('walk')}</td><td><input type="number" id="char-gehen" class="tiny-field" max="99" step="1"></td>
            <td>${t('run')}</td><td><input type="number" id="char-rennen" class="tiny-field" max="99" step="1"></td>
          </tr>
        </table>
      </div>
      <div class="section-divider"></div>
    `
  },
  {
    id: "gamedeck",
    title: t('game_deck'),
    content: `
      <div class="game-deck-host">
        <div id="game-deck-root" aria-live="polite"></div>
      </div>
      <div class="section-divider"></div>
    `
  },
  {
    id: "attribute",
    title: t('attributes'),
    content: `
      <table class="full-width" id="attribute-table">
        <tr class="attr-header">
          <th></th>
          <th data-input="KG-mark">KG<input type="hidden" id="KG-mark" value="0"></th>
          <th data-input="BF-mark">BF<input type="hidden" id="BF-mark" value="0"></th>
          <th data-input="ST-mark">ST<input type="hidden" id="ST-mark" value="0"></th>
          <th data-input="WI-mark">WI<input type="hidden" id="WI-mark" value="0"></th>
          <th data-input="I-mark">I<input type="hidden" id="I-mark" value="0"></th>
          <th data-input="GW-mark">GW<input type="hidden" id="GW-mark" value="0"></th>
          <th data-input="GS-mark">GS<input type="hidden" id="GS-mark" value="0"></th>
          <th data-input="IN-mark">IN<input type="hidden" id="IN-mark" value="0"></th>
          <th data-input="WK-mark">WK<input type="hidden" id="WK-mark" value="0"></th>
          <th data-input="CH-mark">CH<input type="hidden" id="CH-mark" value="0"></th>
        </tr>
        <tr>
          <td>Anfang</td>
          <td><input type="number" id="KG-start"></td>
          <td><input type="number" id="BF-start"></td>
          <td><input type="number" id="ST-start"></td>
          <td><input type="number" id="WI-start"></td>
          <td><input type="number" id="I-start"></td>
          <td><input type="number" id="GW-start"></td>
          <td><input type="number" id="GS-start"></td>
          <td><input type="number" id="IN-start"></td>
          <td><input type="number" id="WK-start"></td>
          <td><input type="number" id="CH-start"></td>
        </tr>
        <tr>
          <td>Steig.</td>
          <td><input type="number" id="KG-steig"></td>
          <td><input type="number" id="BF-steig"></td>
          <td><input type="number" id="ST-steig"></td>
          <td><input type="number" id="WI-steig"></td>
          <td><input type="number" id="I-steig"></td>
          <td><input type="number" id="GW-steig"></td>
          <td><input type="number" id="GS-steig"></td>
          <td><input type="number" id="IN-steig"></td>
          <td><input type="number" id="WK-steig"></td>
          <td><input type="number" id="CH-steig"></td>
        </tr>
        <tr>
          <td>&Sigma;</td>
          <td><input type="number" id="KG-akt" readonly></td>
          <td><input type="number" id="BF-akt" readonly></td>
          <td><input type="number" id="ST-akt" readonly></td>
          <td><input type="number" id="WI-akt" readonly></td>
          <td><input type="number" id="I-akt" readonly></td>
          <td><input type="number" id="GW-akt" readonly></td>
          <td><input type="number" id="GS-akt" readonly></td>
          <td><input type="number" id="IN-akt" readonly></td>
          <td><input type="number" id="WK-akt" readonly></td>
          <td><input type="number" id="CH-akt" readonly></td>
        </tr>
      </table>
      <div class="section-divider"></div>
    `
  },
  {
    id: "schicksalzaehigkeit",
    title: t('fate_resilience'),
    content: `
      <div class="dual-table-wrapper">
        <div>
          <h3>${t('fate')}</h3>
          <table class="value-table">
            <tr><td>${t('fate')}</td><td><input type="number" id="fate-value" class="small-field" max="99" min="0"></td></tr>
            <tr><td>${t('luck')}</td><td><input type="number" id="luck-current" class="small-field" max="99" min="0"><span class="slash">/</span><input type="number" id="luck-max" class="small-field" max="99" min="0"></td></tr>
          </table>
        </div>
        <div>
          <h3>${t('resilience')}</h3>
          <table class="value-table">
            <tr><td>${t('resilience')}</td><td><input type="number" id="resilience-value" class="small-field" max="99" min="0"></td></tr>
            <tr><td>${t('resolve')}</td><td><input type="number" id="resolve-current" class="small-field" max="99" min="0"><span class="slash">/</span><input type="number" id="resolve-max" class="small-field" max="99" min="0"></td></tr>
          </table>
        </div>
      </div>
      <div class="section-divider"></div>
    `
  }
];
