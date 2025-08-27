// Attribute berechnen
function updateAttribute(attr) {
  const anfang = parseInt(document.getElementById(attr + "_anfang").value) || 0;
  const steiger = parseInt(document.getElementById(attr + "_steiger").value) || 0;
  document.getElementById(attr + "_aktuell").value = anfang + steiger;
}

// Skills berechnen
function updateSkill(skillId, attrId) {
  const attrVal = parseInt(document.getElementById(attrId + "_aktuell").value) || 0;
  const steiger = parseInt(document.getElementById(skillId + "_st").value) || 0;
  document.getElementById(skillId + "_w").value = attrVal + steiger;
}

// Gruppierte Fähigkeiten berechnen
function addGroupedSkillRow() {
  const table = document.getElementById("groupedSkillsTable");
  const rowCount = table.rows.length;
  const id = rowCount;

  const row = table.insertRow(-1);
  row.innerHTML = `
    <td><input id="gskill${id}_name"></td>
    <td><input id="gskill${id}_attr" placeholder="z.B. IN"></td>
    <td><input id="gskill${id}_attrval" readonly></td>
    <td><input id="gskill${id}_st"></td>
    <td><input id="gskill${id}_w" readonly></td>
  `;
  attachGroupedSkillLogic(id);
}

function updateGroupedSkill(id) {
  const attrCode = (document.getElementById("gskill" + id + "_attr").value || "").toLowerCase();
  const steiger = parseInt(document.getElementById("gskill" + id + "_st").value) || 0;

  let attrVal = 0;
  if (attrCode) {
    const attrInput = document.getElementById(attrCode + "_aktuell");
    if (attrInput) attrVal = parseInt(attrInput.value) || 0;
  }

  document.getElementById("gskill" + id + "_attrval").value = attrVal;
  document.getElementById("gskill" + id + "_w").value = attrVal + steiger;
}

function attachGroupedSkillLogic(id) {
  const attrField = document.getElementById("gskill" + id + "_attr");
  const stField = document.getElementById("gskill" + id + "_st");

  if (attrField) attrField.addEventListener("input", () => updateGroupedSkill(id));
  if (stField) stField.addEventListener("input", () => updateGroupedSkill(id));

  ["kg","bf","st","wi","i","gw","gs","in","wk","ch"].forEach(attr => {
    const input = document.getElementById(attr + "_aktuell");
    if (input) input.addEventListener("input", () => updateGroupedSkill(id));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Attribute
  ["kg","bf","st","wi","i","gw","gs","in","wk","ch"].forEach(attr => {
    ["anfang","steiger"].forEach(suffix => {
      const el = document.getElementById(attr + "_" + suffix);
      if (el) el.addEventListener("input", () => updateAttribute(attr));
    });
  });

  // Skill-Mapping
  const skillMap = {
    "anführen": "ch","athletik": "gw","ausdauer": "wi","ausweichen": "gw",
    "besonnenheit": "wk","bestechen": "ch","charme": "ch","einsch": "st",
    "fahren": "gw","feilschen": "ch","gluecksspiel": "in","intuition": "i",
    "klatsch": "ch","klettern": "st","kunst": "gs","nahkampf": "kg",
    "nahkampfstd": "kg","navigation": "i","reiten": "gw","rudern": "st",
    "schleichen": "gw","tiere": "wk","ueberleben": "in","unterhalten": "ch",
    "wahrn": "i","zechen": "wi"
  };

  Object.keys(skillMap).forEach(skillId => {
    const attrId = skillMap[skillId];
    const stInput = document.getElementById(skillId + "_st");
    const attrInput = document.getElementById(attrId + "_aktuell");
    if (stInput && attrInput) {
      stInput.addEventListener("input", () => updateSkill(skillId, attrId));
      attrInput.addEventListener("input", () => updateSkill(skillId, attrId));
    }
  });

  // Erste Gruppierte-Fähigkeit aktivieren
  attachGroupedSkillLogic(1);
});
