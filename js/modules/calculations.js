// Berechnungslogik für Attribute, Talente und Ressourcen
function updateAttributes() {
  const attrs = ["KG","BF","ST","WI","I","GW","GS","IN","WK","CH"];
  attrs.forEach(att => {
    const start = parseInt(document.getElementById(att+"-start").value) || 0;
    const steig = parseInt(document.getElementById(att+"-steig").value) || 0;
    const akt = start + steig;
    document.getElementById(att+"-akt").value = akt;
  });

  updateGrundfaehigkeiten();
  updateGruppierteFaehigkeiten();
  updateLebenspunkte();
  updateKorruption();
  updateRuestung();
  updateTraglast();
  updateVermoegen();
  updateErfahrung();
  renderGameDeckComponent();
  saveState();
}

function updateGrundfaehigkeiten() {
  const rows = document.querySelectorAll("#grund-table tr");
  rows.forEach((row, idx) => {
    if (idx === 0) return;
    const attCell = row.cells[1];
    if (!attCell) return;
    const att = attCell.textContent.trim();
    const attVal = parseInt(document.getElementById(att+"-akt").value) || 0;
    const steig = parseInt(row.cells[3].querySelector("input").value) || 0;
    row.cells[2].querySelector("input").value = attVal;
    row.cells[4].querySelector("input").value = attVal + steig;
  });
}

function updateGruppierteFaehigkeiten() {
  const rows = document.querySelectorAll("#grupp-table tr");
  rows.forEach((row, idx) => {
    if (idx === 0) return;
    const sel = row.cells[1]?.querySelector("select");
    const base = row.cells[2]?.querySelector("input");
    const steig = row.cells[3]?.querySelector("input");
    const ges = row.cells[4]?.querySelector("input");
    if (!sel || !base || !steig || !ges) return;
    const att = sel.value;
    const attVal = att ? (parseInt(document.getElementById(att + "-akt").value) || 0) : 0;
    base.value = att ? attVal : "";
    const steigVal = parseInt(steig.value) || 0;
    ges.value = att ? attVal + steigVal : steigVal;
  });
  renderGameDeckComponent();
}

function levenshtein(a, b) {
  const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i += 1) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j += 1) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[a.length][b.length];
}

function similarity(a, b) {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  const distance = levenshtein(a, b);
  return 1 - distance / maxLen;
}

function checkTalentEffects() {
  let hardyLevel = 0;
  document.querySelectorAll("#talent-table tr").forEach((row, idx) => {
    if (idx === 0) return;
    const nameField = row.cells[0].querySelector('input[type="text"], textarea');
    if (!nameField) return;
    const name = nameField.value.toLowerCase().trim();
    const simRob = similarity(name, "robustheit");
    const simHardy = similarity(name, "hardy");
    if (simRob >= 0.9 || simHardy >= 0.9) {
      const lvlInput = row.cells[1].querySelector("input");
      let lvl = parseInt(lvlInput.value, 10);
      if (Number.isNaN(lvl) || lvl < 1) lvl = 1;
      hardyLevel += lvl;
    }
  });
  return hardyLevel;
}

function updateLebenspunkte() {
  const ST = parseInt(document.getElementById("ST-akt").value) || 0;
  const WI = parseInt(document.getElementById("WI-akt").value) || 0;
  const WK = parseInt(document.getElementById("WK-akt").value) || 0;

  const stb = Math.floor(ST/10);
  const wib = Math.floor(WI/10);
  const wkb = Math.floor(WK/10) * 2;

  const hardyLevel = checkTalentEffects();
  const robust = wib * hardyLevel;

  document.getElementById("lp-stb").value = stb;
  document.getElementById("lp-wib").value = wib;
  document.getElementById("lp-wkb").value = wkb;
  document.getElementById("lp-robustheit").value = hardyLevel > 0 ? robust : "";

  const gesamt = stb + wib + wkb + (hardyLevel > 0 ? robust : 0);
  document.getElementById("lp-gesamt").value = gesamt;
}

function updateKorruption() {
  const WI = parseInt(document.getElementById("WI-akt").value) || 0;
  const WK = parseInt(document.getElementById("WK-akt").value) || 0;
  const max = Math.floor(WI/10) + Math.floor(WK/10);
  const akt = parseInt(document.getElementById("korruption-akt").value) || 0;

  const maxEl = document.getElementById("korruption-max");
  maxEl.value = max;

  if (akt > max) {
    document.getElementById("korruption-akt").classList.add("readonly-red");
    alert("⚠️ Korruption über Maximum – Wurf auf Mutation/Wahnsinn nötig!");
  } else {
    document.getElementById("korruption-akt").classList.remove("readonly-red");
  }
}

function updateRuestung() {
  const zones = {
    "Kopf": 0,
    "Linker Arm": 0,
    "Rechter Arm": 0,
    "Brust": 0,
    "Linkes Bein": 0,
    "Rechtes Bein": 0,
    "Schild": 0
  };

  document.querySelectorAll("#ruestung-table tr").forEach((row, idx) => {
    if (idx === 0) return;
    const zoneSel = row.cells[1].querySelector("select");
    const zone = zoneSel ? zoneSel.value : "";
    const rp = parseInt(row.cells[2].querySelector("input").value) || 0;
    const eq = row.cells[0].querySelector("input[type='hidden']")?.value === "1";
    if (eq && Object.prototype.hasOwnProperty.call(zones, zone)) zones[zone] += rp;
  });

  document.getElementById("rp-kopf").value = zones["Kopf"] || 0;
  document.getElementById("rp-larm").value = zones["Linker Arm"] || 0;
  document.getElementById("rp-rarm").value = zones["Rechter Arm"] || 0;
  document.getElementById("rp-brust").value = zones["Brust"] || 0;
  document.getElementById("rp-lbein").value = zones["Linkes Bein"] || 0;
  document.getElementById("rp-rbein").value = zones["Rechtes Bein"] || 0;

  document.getElementById("rp-box-kopf").textContent = zones["Kopf"] || 0;
  document.getElementById("rp-box-larm").textContent = zones["Linker Arm"] || 0;
  document.getElementById("rp-box-rarm").textContent = zones["Rechter Arm"] || 0;
  document.getElementById("rp-box-brust").textContent = zones["Brust"] || 0;
  document.getElementById("rp-box-lbein").textContent = zones["Linkes Bein"] || 0;
  document.getElementById("rp-box-rbein").textContent = zones["Rechtes Bein"] || 0;
  document.getElementById("rp-box-schild").textContent = zones["Schild"] || 0;
}

function updateTraglast() {
  const ST = parseInt(document.getElementById("ST-akt").value) || 0;
  const WI = parseInt(document.getElementById("WI-akt").value) || 0;
  const max = Math.floor(ST/10) + Math.floor(WI/10);

  let waffenTP = 0, ruestungTP = 0, ausrTP = 0;

  document.querySelectorAll("#waffen-table tr").forEach((row, idx) => {
    if (idx === 0) return;
    const tp = parseInt(row.cells[2].querySelector("input").value) || 0;
    const eq = row.cells[0].querySelector("input[type='hidden']")?.value === "1";
    waffenTP += Math.max(0, tp - (eq ? 1 : 0));
  });

  document.querySelectorAll("#ruestung-table tr").forEach((row, idx) => {
    if (idx === 0) return;
    const tp = parseInt(row.cells[3].querySelector("input").value) || 0;
    const eq = row.cells[0].querySelector("input[type='hidden']")?.value === "1";
    ruestungTP += Math.max(0, tp - (eq ? 1 : 0));
  });

  document.querySelectorAll("#ausruestung-table tr").forEach((row, idx) => {
    if (idx === 0) return;
    const menge = parseInt(row.cells[1].querySelector("input").value) || 0;
    const tp = parseInt(row.cells[2].querySelector("input").value) || 0;
    const eq = row.cells[0].querySelector("input[type='hidden']")?.value === "1";
    const weight = menge * tp;
    ausrTP += Math.max(0, weight - (eq ? 1 : 0));
  });

  const gesamt = waffenTP + ruestungTP + ausrTP;

  document.getElementById("trag-waffen").value = waffenTP;
  document.getElementById("trag-ruestung").value = ruestungTP;
  document.getElementById("trag-ausruestung").value = ausrTP;
  document.getElementById("trag-max").value = max;
  const gesamtEl = document.getElementById("trag-gesamt");
  gesamtEl.value = gesamt;

  if (gesamt > max) {
    gesamtEl.classList.add("readonly-red");
  } else {
    gesamtEl.classList.remove("readonly-red");
  }
}

function updateVermoegen() {
  const gk = parseInt(document.getElementById("verm-gk").value) || 0;
  const s  = parseInt(document.getElementById("verm-s").value) || 0;
  const g  = parseInt(document.getElementById("verm-g").value) || 0;

  let totalG = g + s*12 + gk*240;

  let sparG = 0;
  document.querySelectorAll("#spar-table tr").forEach((row, idx) => {
    if (idx === 0) return;
    const inputs = row.querySelectorAll("input");
    let sgk = parseInt(inputs[0].value) || 0;
    let ss  = parseInt(inputs[1].value) || 0;
    let sg  = parseInt(inputs[2].value) || 0;
    if (sgk < 0) { sgk = Math.abs(sgk); inputs[0].value = sgk; }
    if (ss < 0) { ss = Math.abs(ss); inputs[1].value = ss; }
    if (sg < 0) { sg = Math.abs(sg); inputs[2].value = sg; }
    sparG += sg + ss*12 + sgk*240;
  });

  let debtG = 0;
  document.querySelectorAll("#schulden-table tr").forEach((row, idx) => {
    if (idx === 0) return;
    const inputs = row.querySelectorAll("input");
    let dgk = parseInt(inputs[0].value) || 0;
    let ds  = parseInt(inputs[1].value) || 0;
    let dg  = parseInt(inputs[2].value) || 0;
    if (dgk > 0) { dgk = -dgk; inputs[0].value = dgk; }
    if (ds > 0) { ds = -ds; inputs[1].value = ds; }
    if (dg > 0) { dg = -dg; inputs[2].value = dg; }
    debtG += dg + ds*12 + dgk*240;
  });

  const netto = totalG + sparG + debtG;
  const gkFinal = Math.trunc(netto/240);
  const sFinal  = Math.trunc((netto%240)/12);
  const gFinal  = netto % 12;
  document.getElementById("netto-gk").value = gkFinal;
  document.getElementById("netto-s").value = sFinal;
  document.getElementById("netto-g").value = gFinal;
}

function updateExperienceView() {
  const toggle = document.getElementById("exp-toggle");
  const simpleBlock = document.getElementById("exp-simple");
  const fullBlock = document.getElementById("exp-full");
  if (!toggle || !simpleBlock || !fullBlock) return;

  if (toggle.checked) {
    simpleBlock.style.display = "none";
    fullBlock.style.display = "block";
  } else {
    simpleBlock.style.display = "block";
    fullBlock.style.display = "none";
  }

  updateErfahrung();
}

let aktWarNegativ = false;
function updateErfahrung() {
  const toggle = document.getElementById("exp-toggle");
  if (!toggle) return;

  if (!toggle.checked) {
    const akt = parseInt(document.getElementById("exp-simple-akt").value) || 0;
    const ausg = parseInt(document.getElementById("exp-simple-ausg").value) || 0;
    document.getElementById("exp-simple-gesamt").value = akt + ausg;
  } else {
    let akt = 0, ausg = 0, gesamt = 0;
    document.querySelectorAll("#exp-table tr").forEach((row, idx) => {
      if (idx === 0) return;
      const val = parseInt(row.cells[0].querySelector("input").value) || 0;
      row.classList.toggle("negative", val < 0);
      row.classList.toggle("positive", val > 0);
      akt += val;
      if (val < 0) {
        ausg += val;
      } else {
        gesamt += val;
      }
    });
    document.getElementById("exp-full-akt").value = akt;
    document.getElementById("exp-full-ausg").value = ausg;
    document.getElementById("exp-full-gesamt").value = gesamt;

    if (akt < 0 && !aktWarNegativ) {
      alert(t('current_negative_warning'));
      aktWarNegativ = true;
    } else if (akt >= 0 && aktWarNegativ) {
      aktWarNegativ = false;
    }
  }
}
