// Erfahrungssystem
const experienceSections = [
  {
    id: "erfahrung",
    title: t('experience'),
    content: `
      <div style="text-align:center; margin-bottom:10px;">
        <label>${t('simple')}</label>
        <label class="switch">
          <input type="checkbox" id="exp-toggle">
          <span class="slider"></span>
        </label>
        <label>${t('full')}</label>
      </div>

      <div id="exp-simple">
        <table class="full-width">
          <tr><th>${t('current')}</th><th>${t('spent')}</th><th>${t('total_col')}</th></tr>
          <tr>
            <td><input type="number" id="exp-simple-akt"></td>
            <td><input type="number" id="exp-simple-ausg"></td>
            <td><input type="number" id="exp-simple-gesamt" readonly></td>
          </tr>
        </table>
      </div>

      <div id="exp-full" style="display:none;">
        <table class="full-width">
          <tr><th>${t('value')}</th><th class="text-left">${t('note')}</th><th class="delete-col"></th></tr>
        </table>
        <table class="full-width" id="exp-table">
          <tr><th>${t('value')}</th><th class="text-left">${t('note')}</th><th class="delete-col"></th></tr>
        </table>
        <div class="experience-summary">
          <table>
            <tr><th>${t('current')}</th><th>${t('spent')}</th><th>${t('earned')}</th></tr>
            <tr>
              <td><input type="number" id="exp-full-akt" readonly></td>
              <td><input type="number" id="exp-full-ausg" readonly></td>
              <td><input type="number" id="exp-full-gesamt" readonly></td>
            </tr>
          </table>
        </div>
      </div>

      <div class="section-divider"></div>
    `
  }
];
