// React Game Deck Integration
function disposeGameDeck() {
  if (gameDeckReactRoot && typeof gameDeckReactRoot.unmount === "function") {
    gameDeckReactRoot.unmount();
  }
  gameDeckReactRoot = null;
}

function hasGameDeckSupport() {
  return (
    typeof window !== "undefined" &&
    window.React &&
    window.ReactDOM &&
    typeof window.ReactDOM.createRoot === "function" &&
    window.GameDeck
  );
}

function collectAttributeOptions() {
  const table = document.getElementById("attribute-table");
  if (!table) return [];

  const rows = Array.from(table.rows);
  if (rows.length === 0) return [];

  const headerRow = rows[0];
  if (!headerRow) return [];

  const startRow = rows[1] || null;
  const increaseRow = rows[2] || null;
  const totalRow = rows[rows.length - 1] || null;

  const baseLabel = t("game_deck_attribute_base_label");
  const increaseLabel = t("game_deck_attribute_increase_label");

  const options = [];
  for (let col = 1; col < headerRow.cells.length; col += 1) {
    const headerCell = headerRow.cells[col];
    if (!headerCell) continue;
    const label = (headerCell.textContent || "").trim();
    if (!label) continue;

    const startCell = getTableCell(startRow, col);
    const increaseCell = getTableCell(increaseRow, col);
    const totalCell = getTableCell(totalRow, col);

    const startInput = startCell ? startCell.querySelector("input") : null;
    const increaseInput = increaseCell ? increaseCell.querySelector("input") : null;
    const totalInput = totalCell ? totalCell.querySelector("input") : null;

    const base = getNumericInputValue(startInput);
    const increase = getNumericInputValue(increaseInput);
    const total = totalInput ? getNumericInputValue(totalInput) : base + increase;

    options.push({
      id: `attribute-${col}`,
      label,
      value: total,
      breakdown: {
        base,
        increase,
        baseLabel,
        increaseLabel,
      },
    });
  }

  return options;
}

function collectGrundskillOptions() {
  const table = document.getElementById("grund-table");
  if (!table) return [];
  const rows = Array.from(table.rows).slice(1);
  if (rows.length === 0) return [];

  const baseLabel = t("game_deck_skill_base_label");
  const increaseLabel = t("game_deck_skill_increase_label");

  return rows
    .map((row, index) => {
      const nameCell = getTableCell(row, 0);
      const nameSpan = nameCell ? nameCell.querySelector("span:last-of-type") : null;
      const label = nameSpan ? nameSpan.textContent.trim() : "";
      if (!label) return null;

      const totalCellIndex = row.cells.length - 1;
      const increaseCellIndex = row.cells.length - 2;
      const baseCellIndex = row.cells.length - 3;

      const baseCell = getTableCell(row, baseCellIndex);
      const increaseCell = getTableCell(row, increaseCellIndex);
      const totalCell = getTableCell(row, totalCellIndex);

      const baseInput = baseCell ? baseCell.querySelector("input") : null;
      const increaseInput = increaseCell ? increaseCell.querySelector("input") : null;
      const totalInput = totalCell ? totalCell.querySelector("input") : null;

      const base = getNumericInputValue(baseInput);
      const increase = getNumericInputValue(increaseInput);
      const total = totalInput ? getNumericInputValue(totalInput) : base + increase;

      return {
        id: `grund-${index}`,
        label,
        value: total,
        breakdown: {
          base,
          increase,
          baseLabel,
          increaseLabel,
        },
      };
    })
    .filter(Boolean);
}

function collectGroupskillOptions() {
  const table = document.getElementById("grupp-table");
  if (!table) return [];
  const rows = Array.from(table.rows).slice(1);
  if (rows.length === 0) return [];

  const baseLabel = t("game_deck_group_base_label");
  const increaseLabel = t("game_deck_group_increase_label");

  return rows
    .map((row, index) => {
      const nameCell = getTableCell(row, 0);
      const nameField = nameCell ? nameCell.querySelector("textarea") : null;
      const label = nameField ? nameField.value.trim() : "";
      if (!label) return null;

      const totalCellIndex = row.cells.length - 2;
      const increaseCellIndex = row.cells.length - 3;
      const baseCellIndex = row.cells.length - 4;

      const baseCell = getTableCell(row, baseCellIndex);
      const increaseCell = getTableCell(row, increaseCellIndex);
      const totalCell = getTableCell(row, totalCellIndex);

      const baseInput = baseCell ? baseCell.querySelector("input") : null;
      const increaseInput = increaseCell ? increaseCell.querySelector("input") : null;
      const totalInput = totalCell ? totalCell.querySelector("input") : null;

      const base = getNumericInputValue(baseInput);
      const increase = getNumericInputValue(increaseInput);
      const total = totalInput ? getNumericInputValue(totalInput) : base + increase;

      return {
        id: `groupskill-${index}`,
        label,
        value: total,
        breakdown: {
          base,
          increase,
          baseLabel,
          increaseLabel,
        },
      };
    })
    .filter(Boolean);
}

function buildGameDeckOptionGroups() {
  const groups = [];
  const attributes = collectAttributeOptions();
  if (attributes.length > 0) {
    groups.push({
      id: "attributes",
      label: t("game_deck_category_attributes"),
      options: attributes,
    });
  }

  const grundskills = collectGrundskillOptions();
  if (grundskills.length > 0) {
    groups.push({
      id: "grundskills",
      label: t("game_deck_category_grundskills"),
      options: grundskills,
    });
  }

  const groupskills = collectGroupskillOptions();
  if (groupskills.length > 0) {
    groups.push({
      id: "groupskills",
      label: t("game_deck_category_groupskills"),
      options: groupskills,
    });
  }

  return groups;
}

function renderGameDeckComponent() {
  if (!hasGameDeckSupport()) {
    return;
  }
  const container = document.getElementById("game-deck-root");
  if (!container) {
    disposeGameDeck();
    return;
  }
  if (!gameDeckReactRoot) {
    gameDeckReactRoot = window.ReactDOM.createRoot(container);
  }
  const optionGroups = buildGameDeckOptionGroups();
  const element = window.React.createElement(window.GameDeck, {
    optionGroups,
  });
  gameDeckReactRoot.render(element);
}
