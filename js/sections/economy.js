// Vermögen und Schulden
const economySections = [
  {
    id: "vermoegen",
    title: t('wealth') + ' & ' + t('debts'),
    content: `
      <h3>${t('coin_possession')}</h3>
      <table id="vermoegen-table">
        <tr><th><span class="coin gold"></span> GK</th><th><span class="coin silver"></span> S</th><th><span class="coin copper"></span> G</th></tr>
        <tr>
          <td><input type="number" id="verm-gk"></td>
          <td><input type="number" id="verm-s"></td>
          <td><input type="number" id="verm-g"></td>
        </tr>
      </table>

      <div id="nettovermoegen-block" style="margin-top:10px;">
        <h3>${t('net_worth')}</h3>
        <table>
          <tr><th><span class="coin gold"></span> GK</th><th><span class="coin silver"></span> S</th><th><span class="coin copper"></span> G</th></tr>
          <tr>
            <td><input type="number" id="netto-gk" readonly></td>
            <td><input type="number" id="netto-s" readonly></td>
            <td><input type="number" id="netto-g" readonly></td>
          </tr>
        </table>
      </div>

      <h3 id="finanzen-toggle"><span id="finanzen-arrow">▶</span> ${t('finances_expand')}</h3>
      <div id="finanzen-extra" style="display:none;">
        <h3>${t('debts')}</h3>
        <table class="full-width" id="schulden-table">
          <tr>
            <th><span class="coin gold"></span> GK</th>
            <th><span class="coin silver"></span> S</th>
            <th><span class="coin copper"></span> G</th>
            <th class="text-left">Notizen</th>
            <th class="delete-col"></th>
          </tr>
        </table>

        <h3>${t('savings')}</h3>
        <table class="full-width" id="spar-table">
          <tr>
            <th><span class="coin gold"></span> GK</th>
            <th><span class="coin silver"></span> S</th>
            <th><span class="coin copper"></span> G</th>
            <th class="text-left">Notizen</th>
            <th class="delete-col"></th>
          </tr>
        </table>
      </div>

      <div class="section-divider"></div>
    `
  }
];
