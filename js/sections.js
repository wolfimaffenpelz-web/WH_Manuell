const sections = [
  {
    id: "grunddaten",
    title: "Grunddaten",
    collapsible: true,
    content: `
      <div class="section-divider"></div>

      <div id="grunddaten-section">
        <!-- Identität -->
        <h2>Identität</h2>
        <table>
          <tr>
            <th class="fixed text-left">Name</th>
            <td><input type="text" id="name" class="text-left"></td>
          </tr>
          <tr>
            <th class="fixed text-left">Volk</th>
            <td><input type="text" id="volk" class="text-left"></td>
          </tr>
          <tr>
            <th class="fixed text-left">Geschlecht</th>
            <td><input type="text" id="geschlecht" class="text-left"></td>
          </tr>
        </table>

        <!-- Karriere -->
        <h2>Karriere</h2>
        <table>
          <tr>
            <th class="fixed text-left">Karriere</th>
            <td><input type="text" id="karriere" class="text-left"></td>
          </tr>
          <tr>
            <th class="fixed text-left">Karrierestufe</th>
            <td><input type="number" id="karrierestufe"></td>
          </tr>
          <tr>
            <th class="fixed text-left">Karriereweg</th>
            <td><input type="text" id="karriereweg" class="text-left"></td>
          </tr>
          <tr>
            <th class="fixed text-left">Status</th>
            <td><input type="text" id="status" class="text-left"></td>
          </tr>
        </table>

        <!-- Erscheinung -->
        <h2>Erscheinung</h2>
        <table>
          <tr>
            <th class="fixed text-left">Alter</th>
            <td><input type="number" id="alter"></td>
          </tr>
          <tr>
            <th class="fixed text-left">Körpergröße</th>
            <td><input type="number" id="groesse"></td>
          </tr>
          <tr>
            <th class="fixed text-left">Haare</th>
            <td><input type="text" id="haare" class="text-left"></td>
          </tr>
          <tr>
            <th class="fixed text-left">Augen</th>
            <td><input type="text" id="augen" class="text-left"></td>
          </tr>
        </table>
      </div>
    `
  }
];
sections.push({
  id: "spielwerte",
  title: "Spielwerte",
  collapsible: false,
  content: `
    <div class="section-divider"></div>

    <div id="spielwerte-section">
      <table id="attribute-table">
        <tr>
          <th class="fixed"></th>
          <th class="fixed">KG<br><button class="mark-btn" data-attr="KG">◯</button></th>
          <th class="fixed">BF<br><button class="mark-btn" data-attr="BF">◯</button></th>
          <th class="fixed">ST<br><button class="mark-btn" data-attr="ST">◯</button></th>
          <th class="fixed">WI<br><button class="mark-btn" data-attr="WI">◯</button></th>
          <th class="fixed">I<br><button class="mark-btn" data-attr="I">◯</button></th>
          <th class="fixed">GW<br><button class="mark-btn" data-attr="GW">◯</button></th>
          <th class="fixed">GS<br><button class="mark-btn" data-attr="GS">◯</button></th>
          <th class="fixed">IN<br><button class="mark-btn" data-attr="IN">◯</button></th>
          <th class="fixed">WK<br><button class="mark-btn" data-attr="WK">◯</button></th>
          <th class="fixed">CH<br><button class="mark-btn" data-attr="CH">◯</button></th>
        </tr>
        <tr>
          <th class="fixed text-left">Anfang</th>
          <td><input type="number" id="KG_start"></td>
          <td><input type="number" id="BF_start"></td>
          <td><input type="number" id="ST_start"></td>
          <td><input type="number" id="WI_start"></td>
          <td><input type="number" id="I_start"></td>
          <td><input type="number" id="GW_start"></td>
          <td><input type="number" id="GS_start"></td>
          <td><input type="number" id="IN_start"></td>
          <td><input type="number" id="WK_start"></td>
          <td><input type="number" id="CH_start"></td>
        </tr>
        <tr>
          <th class="fixed text-left">Steig.</th>
          <td><input type="number" id="KG_steig"></td>
          <td><input type="number" id="BF_steig"></td>
          <td><input type="number" id="ST_steig"></td>
          <td><input type="number" id="WI_steig"></td>
          <td><input type="number" id="I_steig"></td>
          <td><input type="number" id="GW_steig"></td>
          <td><input type="number" id="GS_steig"></td>
          <td><input type="number" id="IN_steig"></td>
          <td><input type="number" id="WK_steig"></td>
          <td><input type="number" id="CH_steig"></td>
        </tr>
        <tr>
          <th class="fixed text-left">Aktuell</th>
          <td><input type="number" id="KG_aktuell" class="readonly" readonly></td>
          <td><input type="number" id="BF_aktuell" class="readonly" readonly></td>
          <td><input type="number" id="ST_aktuell" class="readonly" readonly></td>
          <td><input type="number" id="WI_aktuell" class="readonly" readonly></td>
          <td><input type="number" id="I_aktuell" class="readonly" readonly></td>
          <td><input type="number" id="GW_aktuell" class="readonly" readonly></td>
          <td><input type="number" id="GS_aktuell" class="readonly" readonly></td>
          <td><input type="number" id="IN_aktuell" class="readonly" readonly></td>
          <td><input type="number" id="WK_aktuell" class="readonly" readonly></td>
          <td><input type="number" id="CH_aktuell" class="readonly" readonly></td>
        </tr>
      </table>
    </div>
  `
});
