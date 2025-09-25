// Magie, Korruption und Mutationen
const magicSections = [
  {
    id: "zauber",
    title: t('spells'),
    content: `
      <table class="full-width" id="zauber-table">
        <tr>
          <th>Name</th>
          <th>ZW</th>
          <th>RW</th>
          <th>Ziel</th>
          <th>⏳</th>
          <th class="text-left">${t('effect')}</th>
          <th class="delete-col"></th>
        </tr>
      </table>
      <table class="sin-table" id="sin-table">
        <tr><td>${t('sin')}</td><td><input type="number" id="sin-value" class="tiny-field"></td></tr>
      </table>
      <div class="section-divider"></div>
    `
  },
  {
    id: "korruption",
    title: t('corruption') + ' & ' + t('mutations'),
    content: `
      <h3>Korruptionspunkte</h3>
      <table id="korruption-table">
        <tr><th class="text-center">${t('max')}</th><th>${t('current')}</th></tr>
        <tr>
          <td class="text-center"><input type="number" id="korruption-max" readonly></td>
          <td><input type="number" id="korruption-akt"></td>
        </tr>
      </table>
     <h3>Vorhandene Mutationen</h3>
      <table class="full-width" id="mutationen-table">
        <tr>
          <th>Mutation</th>
          <th>${t('affects')}</th>
          <th class="text-left">${t('notes')}</th>
          <th class="delete-col"></th>
        </tr>
      </table>
      <div class="section-divider"></div>
    `
  }
];
