// Rendering und Toggling der statischen Abschnitte
function renderSections() {
  const main = document.getElementById("main-content");
  disposeGameDeck();
  main.innerHTML = "";
  sections.forEach(sec => {
    const sectionEl = document.createElement("section");
    sectionEl.id = sec.id;
    const header = document.createElement("h2");
    header.innerHTML = `<span id="${sec.id}-arrow" class="section-arrow">▼</span> ${sec.title}`;
    sectionEl.appendChild(header);
    const body = document.createElement("div");
    body.className = "section-body";
    body.innerHTML = sec.content;
    sectionEl.appendChild(body);
    main.appendChild(sectionEl);
  });
}

function initSectionToggle(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) return;
  const body = section.querySelector(".section-body");
  const header = section.querySelector("h2");
  const arrow = header?.querySelector(`#${sectionId}-arrow`);
  if (!body || !header || !arrow) return;
  const storageKey = `${sectionId}-collapsed`;
  const collapsed = localStorage.getItem(storageKey) === "true";
  body.style.removeProperty("display");
  const getChildren = () => Array.from(body.children);
  const applyCollapsedState = (isCollapsed, persist) => {
    getChildren().forEach(child => {
      if (child.classList && child.classList.contains("section-divider")) {
        child.style.removeProperty("display");
        return;
      }
      if (isCollapsed) {
        child.style.display = "none";
      } else {
        child.style.removeProperty("display");
      }
    });
    section.classList.toggle("collapsed", isCollapsed);
    arrow.textContent = isCollapsed ? "▶" : "▼";
    if (isCollapsed) {
      body.setAttribute("aria-hidden", "true");
      section.setAttribute("data-collapsed", "true");
    } else {
      body.removeAttribute("aria-hidden");
      section.removeAttribute("data-collapsed");
    }
    if (persist) {
      localStorage.setItem(storageKey, isCollapsed ? "true" : "false");
    }
  };

  applyCollapsedState(collapsed, false);

  header.addEventListener("click", () => {
    const nextState = !section.classList.contains("collapsed");
    applyCollapsedState(nextState, true);
  });
}

function initSectionToggles() {
  sections.forEach(sec => initSectionToggle(sec.id));
}

function initFinanzenToggle() {
  const header = document.getElementById("finanzen-toggle");
  const arrow = document.getElementById("finanzen-arrow");
  const extra = document.getElementById("finanzen-extra");
  if (!header || !arrow || !extra) return;
  header.addEventListener("click", () => {
    if (extra.style.display === "none") {
      extra.style.display = "block";
      arrow.textContent = "▼";
    } else {
      extra.style.display = "none";
      arrow.textContent = "▶";
    }
  });
}
