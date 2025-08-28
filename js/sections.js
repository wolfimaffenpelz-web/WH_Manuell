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
