// Fähigkeiten und Talente
const skillSections = [
  {
    id: "grundfaehigkeiten",
    title: t('grundskills'),
    content: `
        <table class="full-width" id="grund-table">
        <tr>
          <th>Fähigkeit</th>
          <th class="wsg" colspan="2">Spielwert</th>
          <th class="wsg">Steig.</th>
          <th class="wsg">Gesamt</th>
          <th class="delete-col"></th>
        </tr>
      </table>
      <div class="section-divider"></div>
    `
  },
  {
    id: "gruppfaehigkeiten",
    title: t('groupskills'),
    content: `
      <table class="full-width" id="grupp-table">
        <tr>
          <th>Fähigkeit</th>
          <th>${t('attribute')}</th>
          <th class="wsg">Basis</th>
          <th class="wsg">Steig.</th>
          <th class="wsg">Gesamt</th>
          <th class="delete-col"></th>
        </tr>
      </table>
      <div class="section-divider"></div>
    `
  },
  {
    id: "talente",
    title: t('talents'),
    content: `
      <table class="full-width" id="talent-table">
        <tr>
          <th>Talent</th>
          <th class="wsg">Lvl.</th>
          <th class="text-left">${t('note')}</th>
          <th class="delete-col"></th>
        </tr>
      </table>
      <div class="section-divider"></div>
    `
  }
];
