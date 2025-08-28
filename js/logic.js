function renderSections() {
  const main = document.getElementById("main-content");
  sections.forEach(sec => {
    const sectionDiv = document.createElement("section");
    sectionDiv.id = sec.id;

    const header = document.createElement("h2");
    header.textContent = sec.title;
    sectionDiv.appendChild(header);

    const contentDiv = document.createElement("div");
    contentDiv.innerHTML = sec.content;

    // collapsible
    if (sec.collapsible) {
      header.style.cursor = "pointer";
      contentDiv.style.display = localStorage.getItem(sec.id + "_collapsed") === "true" ? "none" : "block";
      header.addEventListener("click", () => {
        const collapsed = contentDiv.style.display !== "none";
        contentDiv.style.display = collapsed ? "none" : "block";
        localStorage.setItem(sec.id + "_collapsed", collapsed);
      });
    }

    sectionDiv.appendChild(contentDiv);
    main.appendChild(sectionDiv);
  });
}

// Speicherung der Eingaben
function saveData() {
  let data = {};
  document.querySelectorAll("input, select, textarea").forEach(el => {
    data[el.id] = el.value;
  });
  localStorage.setItem("charData", JSON.stringify(data));
}

function loadData() {
  const data = JSON.parse(localStorage.getItem("charData") || "{}");
  for (const id in data) {
    const el = document.getElementById(id);
    if (el) el.value = data[id];
  }
}

// Events für Speicherung
document.addEventListener("input", saveData);
document.addEventListener("DOMContentLoaded", () => {
  renderSections();
  loadData();
});
