// Bewaffnung und Ausrüstung
const gearSections = [
  {
    id: "waffen",
    title: t('weapons'),
    content: `
      <table class="full-width" id="waffen-table">
        <tr>
          <th>Name</th>
          <th class="text-left">${t('weapon_group')}</th>
          <th>TP</th>
          <th>RW</th>
          <th>${t('damage')}</th>
          <th class="text-left">${t('qualities')}</th>
          <th class="delete-col"></th>
        </tr>
      </table>
      <div class="table-footnote">* ${t('mark_to_equip')}</div>
      <div class="section-divider"></div>
    `
  },
  {
    id: "ruestung",
    title: t('armor'),
    content: `
      <div class="armor-visual">
        <img src="img/silhouette.svg" alt="${t('silhouette_alt')}" class="silhouette">
        <div class="zone-box zone-head">
          <span class="zone-range">01–09</span>
          <div class="zone-rp" id="rp-box-kopf">0</div>
          <span class="zone-label">${t('head')}</span>
        </div>
        <div class="zone-box zone-left-arm">
          <span class="zone-range">10–24</span>
          <div class="zone-rp" id="rp-box-larm">0</div>
          <span class="zone-label">${t('left_arm')}</span>
        </div>
        <div class="zone-box zone-right-arm">
          <span class="zone-range">25–44</span>
          <div class="zone-rp" id="rp-box-rarm">0</div>
          <span class="zone-label">${t('right_arm')}</span>
        </div>
        <div class="zone-box zone-chest">
          <span class="zone-range">45–79</span>
          <div class="zone-rp" id="rp-box-brust">0</div>
          <span class="zone-label">${t('chest')}</span>
        </div>
        <div class="zone-box zone-left-leg">
          <span class="zone-range">80–89</span>
          <div class="zone-rp" id="rp-box-lbein">0</div>
          <span class="zone-label">${t('left_leg')}</span>
        </div>
        <div class="zone-box zone-right-leg">
          <span class="zone-range">90–100</span>
          <div class="zone-rp" id="rp-box-rbein">0</div>
          <span class="zone-label">${t('right_leg')}</span>
        </div>
        <div class="shield-display">
          <img src="img/shield.svg" alt="${t('shield_alt')}" class="shield">
          <div class="shield-rp" id="rp-box-schild">0</div>
        </div>
      </div>
      <table class="ruestung-uebersicht">
        <tr><th>${t('zone')}</th><th>${t('range')}</th><th>${t('sum_rp')}</th></tr>
        <tr><td>${t('head')}</td><td>01–09</td><td><input type="number" id="rp-kopf" readonly></td></tr>
        <tr><td>${t('left_arm')}</td><td>10–24</td><td><input type="number" id="rp-larm" readonly></td></tr>
        <tr><td>${t('right_arm')}</td><td>25–44</td><td><input type="number" id="rp-rarm" readonly></td></tr>
        <tr><td>${t('chest')}</td><td>45–79</td><td><input type="number" id="rp-brust" readonly></td></tr>
        <tr><td>${t('left_leg')}</td><td>80–89</td><td><input type="number" id="rp-lbein" readonly></td></tr>
        <tr><td>${t('right_leg')}</td><td>90–100</td><td><input type="number" id="rp-rbein" readonly></td></tr>
      </table>
      <div class="table-gap"></div>
      <h3>Rüstungsteile</h3>
      <table class="full-width" id="ruestung-table">
        <tr>
          <th>Name</th>
          <th>${t('zone_short')}</th>
          <th>RP</th>
          <th>TP</th>
          <th class="text-left">${t('qualities')}</th>
          <th class="delete-col"></th>
        </tr>
      </table>
      <div class="table-footnote">* ${t('mark_to_equip')}</div>
      <div class="section-divider"></div>
    `
  },
  {
    id: "ausruestung",
    title: t('equipment'),
    content: `
      <table class="full-width" id="ausruestung-table">
        <tr>
          <th>Name</th>
          <th>Menge</th>
          <th>TP</th>
          <th class="text-left">${t('notes')}</th>
          <th class="delete-col"></th>
        </tr>
      </table>
      <div class="table-footnote">* ${t('mark_to_equip')}</div>
      <div class="section-divider"></div>
    `
  }
];
