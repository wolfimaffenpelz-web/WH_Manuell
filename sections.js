const sections = [

  // 🧑‍🎓 Grunddaten
  {
    id: "basic",
    html: `
    <section>
      <h2 id="section_basic">Grunddaten</h2>
      <div class="grid">
        <div><label id="label_name">Name</label><input id="name"></div>
        <div><label id="label_volk">Volk</label><input id="volk"></div>
        <div><label id="label_klasse">Klasse</label><input id="klasse"></div>
        <div><label id="label_karriere">Karriere</label><input id="karriere"></div>
        <div><label id="label_karrierestufe">Karrierestufe</label><input id="karrierestufe"></div>
        <div><label id="label_status">Status</label><input id="status"></div>
        <div><label id="label_alter">Alter</label><input id="alter"></div>
        <div><label id="label_koerpergroesse">Körpergröße</label><input id="koerpergroesse"></div>
        <div><label id="label_haare">Haare</label><input id="haare"></div>
        <div><label id="label_augen">Augen</label><input id="augen"></div>
      </div>
    </section>`
  },

  // 📊 Attribute
  {
    id: "attributes",
    html: `
<section>
  <h2 id="section_attributes">Spielwerte</h2>
  <table>
    <tr>
      <th></th>
      <th>KG</th>
      <th>BF</th>
      <th>ST</th>
      <th>WI</th>
      <th>I</th>
      <th>GW</th>
      <th>GS</th>
      <th>IN</th>
      <th>WK</th>
      <th>CH</th>
    </tr>
    <tr>
      <th id="label_attr_anfang">Anfang</th>
      <td><input id="kg_anfang"></td>
      <td><input id="bf_anfang"></td>
      <td><input id="st_anfang"></td>
      <td><input id="wi_anfang"></td>
      <td><input id="i_anfang"></td>
      <td><input id="gw_anfang"></td>
      <td><input id="gs_anfang"></td>
      <td><input id="in_anfang"></td>
      <td><input id="wk_anfang"></td>
      <td><input id="ch_anfang"></td>
    </tr>
    <tr>
      <th id="label_attr_steiger">Steigerungen</th>
      <td><input id="kg_steiger"></td>
      <td><input id="bf_steiger"></td>
      <td><input id="st_steiger"></td>
      <td><input id="wi_steiger"></td>
      <td><input id="i_steiger"></td>
      <td><input id="gw_steiger"></td>
      <td><input id="gs_steiger"></td>
      <td><input id="in_steiger"></td>
      <td><input id="wk_steiger"></td>
      <td><input id="ch_steiger"></td>
    </tr>
    <tr>
      <th id="label_attr_aktuell">Aktuell</th>
      <td><input id="kg_aktuell" readonly></td>
      <td><input id="bf_aktuell" readonly></td>
      <td><input id="st_aktuell" readonly></td>
      <td><input id="wi_aktuell" readonly></td>
      <td><input id="i_aktuell" readonly></td>
      <td><input id="gw_aktuell" readonly></td>
      <td><input id="gs_aktuell" readonly></td>
      <td><input id="in_aktuell" readonly></td>
      <td><input id="wk_aktuell" readonly></td>
      <td><input id="ch_aktuell" readonly></td>
    </tr>
  </table>
    </section>`
  },

  // 🏃‍♂️ Bewegung
  {
    id: "movement",
    html: `
    <section>
      <h2 id="section_movement">Bewegung</h2>
      <div class="grid">
        <div><label id="label_bewegung">Bewegung</label><input id="bewegung"></div>
        <div><label id="label_gehen">Gehen</label><input id="gehen"></div>
        <div><label id="label_rennen">Rennen</label><input id="rennen"></div>
      </div>
    </section>`
  },
    // 📚 Grundfertigkeiten
  {
    id: "skills",
    html: `
    <section>
      <h2 id="section_skills">Grundfähigkeiten</h2>
      <table>
        <tr>
          <th id="label_skill_name">Name</th>
          <th id="label_skill_sw">Spielwert</th>
          <th id="label_skill_st">Steigerung</th>
          <th id="label_skill_w">Wert</th>
        </tr>
        <tr><td>Anführen</td><td><input id="anführen_sw"></td><td><input id="anführen_st"></td><td><input id="anführen_w" readonly></td></tr>
        <tr><td>Athletik</td><td><input id="athletik_sw"></td><td><input id="athletik_st"></td><td><input id="athletik_w" readonly></td></tr>
        <tr><td>Ausdauer</td><td><input id="ausdauer_sw"></td><td><input id="ausdauer_st"></td><td><input id="ausdauer_w" readonly></td></tr>
        <tr><td>Ausweichen</td><td><input id="ausweichen_sw"></td><td><input id="ausweichen_st"></td><td><input id="ausweichen_w" readonly></td></tr>
        <tr><td>Besonnenheit</td><td><input id="besonnenheit_sw"></td><td><input id="besonnenheit_st"></td><td><input id="besonnenheit_w" readonly></td></tr>
        <tr><td>Bestechen</td><td><input id="bestechen_sw"></td><td><input id="bestechen_st"></td><td><input id="bestechen_w" readonly></td></tr>
        <tr><td>Charme</td><td><input id="charme_sw"></td><td><input id="charme_st"></td><td><input id="charme_w" readonly></td></tr>
        <tr><td>Einschüchtern</td><td><input id="einsch_sw"></td><td><input id="einsch_st"></td><td><input id="einsch_w" readonly></td></tr>
        <tr><td>Fahren</td><td><input id="fahren_sw"></td><td><input id="fahren_st"></td><td><input id="fahren_w" readonly></td></tr>
        <tr><td>Feilschen</td><td><input id="feilschen_sw"></td><td><input id="feilschen_st"></td><td><input id="feilschen_w" readonly></td></tr>
        <tr><td>Glücksspiel</td><td><input id="gluecksspiel_sw"></td><td><input id="gluecksspiel_st"></td><td><input id="gluecksspiel_w" readonly></td></tr>
        <tr><td>Intuition</td><td><input id="intuition_sw"></td><td><input id="intuition_st"></td><td><input id="intuition_w" readonly></td></tr>
        <tr><td>Klatsch</td><td><input id="klatsch_sw"></td><td><input id="klatsch_st"></td><td><input id="klatsch_w" readonly></td></tr>
        <tr><td>Klettern</td><td><input id="klettern_sw"></td><td><input id="klettern_st"></td><td><input id="klettern_w" readonly></td></tr>
        <tr><td>Kunst</td><td><input id="kunst_sw"></td><td><input id="kunst_st"></td><td><input id="kunst_w" readonly></td></tr>
        <tr><td>Nahkampf</td><td><input id="nahkampf_sw"></td><td><input id="nahkampf_st"></td><td><input id="nahkampf_w" readonly></td></tr>
        <tr><td>Navigation</td><td><input id="navigation_sw"></td><td><input id="navigation_st"></td><td><input id="navigation_w" readonly></td></tr>
        <tr><td>Reiten</td><td><input id="reiten_sw"></td><td><input id="reiten_st"></td><td><input id="reiten_w" readonly></td></tr>
        <tr><td>Rudern</td><td><input id="rudern_sw"></td><td><input id="rudern_st"></td><td><input id="rudern_w" readonly></td></tr>
        <tr><td>Schleichen</td><td><input id="schleichen_sw"></td><td><input id="schleichen_st"></td><td><input id="schleichen_w" readonly></td></tr>
        <tr><td>Tiere bezirzen</td><td><input id="tiere_sw"></td><td><input id="tiere_st"></td><td><input id="tiere_w" readonly></td></tr>
        <tr><td>Überleben</td><td><input id="ueberleben_sw"></td><td><input id="ueberleben_st"></td><td><input id="ueberleben_w" readonly></td></tr>
        <tr><td>Unterhalten</td><td><input id="unterhalten_sw"></td><td><input id="unterhalten_st"></td><td><input id="unterhalten_w" readonly></td></tr>
        <tr><td>Wahrnehmung</td><td><input id="wahrn_sw"></td><td><input id="wahrn_st"></td><td><input id="wahrn_w" readonly></td></tr>
        <tr><td>Zechen</td><td><input id="zechen_sw"></td><td><input id="zechen_st"></td><td><input id="zechen_w" readonly></td></tr>
      </table>
    </section>`
  },

  // 🧩 Gruppierte & Ausbaufähigkeiten
  {
    id: "grouped_skills",
    html: `
    <section>
      <h2 id="section_grouped_skills">Gruppierte & Ausbaufähigkeiten</h2>
      <table id="groupedSkillsTable">
        <tr>
          <th id="label_gskill_name">Name</th>
          <th id="label_gskill_attr">Attribut</th>
          <th id="label_gskill_attrval">Attr.-Wert</th>
          <th id="label_gskill_st">Steigerung</th>
          <th id="label_gskill_w">Wert</th>
        </tr>
        <tr>
          <td><input id="gskill1_name"></td>
          <td><input id="gskill1_attr" placeholder="z.B. IN"></td>
          <td><input id="gskill1_attrval" readonly></td>
          <td><input id="gskill1_st"></td>
          <td><input id="gskill1_w" readonly></td>
        </tr>
      </table>
      <button type="button" onclick="addGroupedSkillRow()">+ Zeile hinzufügen</button>
    </section>`
  },

  // 🎲 Talente
  {
    id: "talents",
    html: `
    <section>
      <h2 id="section_talents">Talente</h2>
      <table>
        <tr>
          <th id="label_talent_name">Name</th>
          <th id="label_talent_stufe">Stufe</th>
          <th id="label_talent_desc">Beschreibung</th>
        </tr>
        <tr>
          <td><input id="talent1_name"></td>
          <td><input id="talent1_stufe"></td>
          <td><input id="talent1_desc"></td>
        </tr>
      </table>
    </section>`
  },

  // ⚔ Waffen
  {
    id: "weapons",
    html: `
    <section>
      <h2 id="section_weapons">Waffen</h2>
      <table>
        <tr>
          <th id="label_weapon_name">Name</th>
          <th id="label_weapon_group">Gruppe</th>
          <th id="label_weapon_tp">TP</th>
          <th id="label_weapon_rw">Reichweite/Länge</th>
          <th id="label_weapon_schaden">Schaden</th>
          <th id="label_weapon_qual">Qualitäten</th>
        </tr>
        <tr>
          <td><input id="waffe1_name"></td>
          <td><input id="waffe1_gruppe"></td>
          <td><input id="waffe1_tp"></td>
          <td><input id="waffe1_rw"></td>
          <td><input id="waffe1_schaden"></td>
          <td><input id="waffe1_qual"></td>
        </tr>
      </table>
    </section>`
  },
  // 🛡 Rüstung
  {
    id: "armor",
    html: `
    <section>
      <h2 id="section_armor">Rüstung</h2>
      <table>
        <tr>
          <th id="label_armor_zone">Trefferzone</th>
          <th id="label_armor_tp">TP</th>
          <th id="label_armor_rp">RP</th>
          <th id="label_armor_qual">Qualitäten</th>
        </tr>
        <tr><td>Kopf</td><td><input id="ruestung_kopf_tp"></td><td><input id="ruestung_kopf_rp"></td><td><input id="ruestung_kopf_q"></td></tr>
        <tr><td>Rechter Arm</td><td><input id="ruestung_ra_tp"></td><td><input id="ruestung_ra_rp"></td><td><input id="ruestung_ra_q"></td></tr>
        <tr><td>Linker Arm</td><td><input id="ruestung_la_tp"></td><td><input id="ruestung_la_rp"></td><td><input id="ruestung_la_q"></td></tr>
        <tr><td>Körper</td><td><input id="ruestung_koerper_tp"></td><td><input id="ruestung_koerper_rp"></td><td><input id="ruestung_koerper_q"></td></tr>
        <tr><td>Rechtes Bein</td><td><input id="ruestung_rb_tp"></td><td><input id="ruestung_rb_rp"></td><td><input id="ruestung_rb_q"></td></tr>
        <tr><td>Linkes Bein</td><td><input id="ruestung_lb_tp"></td><td><input id="ruestung_lb_rp"></td><td><input id="ruestung_lb_q"></td></tr>
        <tr><td>Schild</td><td><input id="ruestung_schild_tp"></td><td><input id="ruestung_schild_rp"></td><td><input id="ruestung_schild_q"></td></tr>
      </table>
    </section>`
  },

  // 🎒 Ausrüstung
  {
    id: "equipment",
    html: `
    <section>
      <h2 id="section_equipment">Ausrüstung</h2>
      <textarea id="equipment"></textarea>
    </section>`
  },

  // 💰 Vermögen
  {
    id: "wealth",
    html: `
    <section>
      <h2 id="section_wealth">Vermögen</h2>
      <div class="grid">
        <div><label id="label_gold">Gold</label><input id="gold"></div>
        <div><label id="label_silber">Silber</label><input id="silber"></div>
        <div><label id="label_kupfer">Kupfer</label><input id="kupfer"></div>
      </div>
    </section>`
  },

  // ❤️ Lebenspunkte
  {
    id: "hp",
    html: `
    <section>
      <h2 id="section_hp">Lebenspunkte</h2>
      <div class="grid">
        <div><label id="label_lp_stb">STB</label><input id="lp_stb"></div>
        <div><label id="label_lp_wib2">WIB × 2</label><input id="lp_wib2"></div>
        <div><label id="label_lp_wkb">WKB</label><input id="lp_wkb"></div>
        <div><label id="label_lp_robu">Robustheit</label><input id="lp_robu"></div>
        <div><label id="label_lp_gesamt">LP</label><input id="lp_gesamt"></div>
      </div>
    </section>`
  },
  // ✨ Zauber & Gebete
  {
    id: "spells",
    html: `
    <section>
      <h2 id="section_spells">Zauber und Gebete</h2>
      <table>
        <tr>
          <th id="label_spell_name">Name</th>
          <th id="label_spell_zw">ZW</th>
          <th id="label_spell_rw">Reichweite</th>
          <th id="label_spell_ziel">Ziel</th>
          <th id="label_spell_dauer">Dauer</th>
          <th id="label_spell_effekt">Effekt</th>
        </tr>
        <tr>
          <td><input id="zauber1_name"></td>
          <td><input id="zauber1_zw"></td>
          <td><input id="zauber1_rw"></td>
          <td><input id="zauber1_ziel"></td>
          <td><input id="zauber1_dauer"></td>
          <td><input id="zauber1_effekt"></td>
        </tr>
      </table>
    </section>`
  },

  // ☠ Korrumpierung & Mutation
  {
    id: "corruption",
    html: `
    <section>
      <h2 id="section_corruption">Korrumpierung & Mutation</h2>
      <textarea id="korrumpierung"></textarea>
    </section>`
  }
];
