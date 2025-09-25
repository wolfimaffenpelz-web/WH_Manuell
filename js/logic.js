// Hauptinitialisierung der Anwendung
function initLogic() {
  renderSections();
  renderGameDeckComponent();
  initSectionToggles();
  initFinanzenToggle();
  initCharacterManagement();

  document.addEventListener("input", e => {
    if (!e.target.matches("input, textarea, select")) {
      return;
    }
    const gameDeckRoot = document.getElementById("game-deck-root");
    if (gameDeckRoot && gameDeckRoot.contains(e.target)) {
      return;
    }
    updateAttributes();
  });

  const toggle = document.getElementById("exp-toggle");
  if (toggle) {
    toggle.addEventListener("change", () => {
      updateExperienceView();
      saveState();
    });
  }

  loadState();
  updateExperienceView();
  if (!currentCharacter) {
    ensureInitialRows();
    updateAttributes();
  }
}
