(function (global) {
  const React = global && global.React;
  if (!React) {
    if (global && global.console && typeof global.console.error === "function") {
      global.console.error("GameDeck requires React to be available before loading the component script.");
    }
    return;
  }

  const { useEffect, useMemo, useRef, useState, useId } = React;
  const h = React.createElement;

  const STYLE_ELEMENT_ID = "game-deck-styles";
  const TALENT_THUMB_SVG = encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
      '<circle cx="50" cy="50" r="48" fill="#FAF0E6" stroke="#9E9E9E" stroke-width="6" />' +
      '<text x="50%" y="58%" font-size="60" text-anchor="middle" fill="#111" font-family="Podkova,serif">✠</text>' +
    "</svg>"
  );

  const STYLE_CONTENT = `
.game-deck {
  display: grid;
  gap: 1.5rem;
  width: 100%;
}

@media (min-width: 768px) {
  .game-deck {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }
}

.game-deck__card {
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid var(--color-table-line, #000);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.game-deck__label {
  margin: 0;
  font-weight: 600;
  font-family: var(--font-heading, 'UnifrakturMaguntia', cursive);
  font-size: 1rem;
}

.game-deck__dice-button {
  align-self: flex-start;
  background: var(--color-highlight, #9E9E9E);
  color: var(--color-bg, #FAF0E6);
  border: none;
  border-radius: 999px;
  padding: 0.6rem 1.4rem;
  font-family: var(--font-main, 'Podkova', serif);
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
}

.game-deck__dice-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.game-deck__dice-button:active:not(:disabled) {
  transform: translateY(1px);
}

.game-deck__dice-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.game-deck__dice-display {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 3.5rem;
  border-radius: 12px;
  border: 2px solid var(--color-highlight, #9E9E9E);
  font-size: 2.2rem;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.85);
  color: var(--color-text, #111);
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: box-shadow 0.3s ease;
}

.game-deck__dice-display.is-flashing {
  animation: game-deck-blood-flash 0.9s ease-out;
  color: #8b0000;
}

.game-deck__dice-display.is-flashing .game-deck__dice-number {
  text-shadow: 0 0 12px rgba(139, 0, 0, 0.75);
}

.game-deck__dice-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 3ch;
  transition: transform 0.2s ease, color 0.2s ease;
}

.game-deck__dice-number.is-rolling {
  animation: game-deck-number-spin 0.25s linear infinite;
}

@keyframes game-deck-number-spin {
  0% { transform: rotateX(0deg); opacity: 1; }
  50% { transform: rotateX(180deg); opacity: 0.45; }
  100% { transform: rotateX(360deg); opacity: 1; }
}

@keyframes game-deck-blood-flash {
  0% { box-shadow: 0 0 0 rgba(139, 0, 0, 0); }
  35% { box-shadow: 0 0 28px rgba(139, 0, 0, 0.8); }
  100% { box-shadow: 0 0 0 rgba(139, 0, 0, 0); }
}

.game-deck__slider-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.75rem;
}

.game-deck__slider-value {
  font-family: var(--font-main, 'Podkova', serif);
  font-size: 1.1rem;
  font-weight: 600;
}

.game-deck__slider-track {
  position: relative;
}

.game-deck__slider-track input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 10px;
  border-radius: 999px;
  background: linear-gradient(
    to right,
    var(--game-deck-slider-fill, var(--color-highlight, #9E9E9E)) 0%,
    var(--game-deck-slider-fill, var(--color-highlight, #9E9E9E)) calc(var(--game-deck-slider-progress, 0.5) * 100%),
    rgba(0, 0, 0, 0.2) calc(var(--game-deck-slider-progress, 0.5) * 100%),
    rgba(0, 0, 0, 0.2) 100%
  );
  cursor: pointer;
  transition: box-shadow 0.2s ease;
}

.game-deck__slider-track input[type="range"]:focus-visible {
  outline: 2px solid var(--color-highlight, #9E9E9E);
  outline-offset: 4px;
}

.game-deck__slider-track input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: transparent url("data:image/svg+xml,${TALENT_THUMB_SVG}") no-repeat center/85%;
  border: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

.game-deck__slider-track input[type="range"]::-moz-range-thumb {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: transparent url("data:image/svg+xml,${TALENT_THUMB_SVG}") no-repeat center/85%;
  border: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

.game-deck__slider-track input[type="range"]::-webkit-slider-runnable-track {
  height: 10px;
  border-radius: 999px;
  background: transparent;
}

.game-deck__slider-track input[type="range"]::-moz-range-track {
  height: 10px;
  border-radius: 999px;
  background: transparent;
}

.game-deck__slider-track input[type="range"]:active::-webkit-slider-thumb,
.game-deck__slider-track input[type="range"]:active::-moz-range-thumb {
  transform: scale(0.96);
}

.game-deck__select {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 1px solid var(--color-table-line, #000);
  font-family: var(--font-main, 'Podkova', serif);
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.92);
  cursor: pointer;
}

.game-deck__total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0.85rem;
  border-radius: 8px;
  background: rgba(250, 240, 230, 0.9);
  border: 1px solid var(--color-highlight, #9E9E9E);
  font-family: var(--font-main, 'Podkova', serif);
  font-size: 1rem;
}

.game-deck__total-value {
  font-weight: 700;
  font-size: 1.25rem;
}
`;

  const ensureStyles = () => {
    if (typeof document === "undefined") return;
    if (document.getElementById(STYLE_ELEMENT_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ELEMENT_ID;
    style.textContent = STYLE_CONTENT;
    document.head.appendChild(style);
  };

  const fallbackTranslate = key => key;
  const getTranslator = () => {
    if (typeof global !== "undefined" && typeof global.t === "function") {
      return global.t;
    }
    return fallbackTranslate;
  };

  // Neue Kategorien können hinzugefügt werden, indem ein Eintrag ergänzt, der
  // Übersetzungsschlüssel in translations.js angelegt und der Wert über
  // categoryTotals übergeben wird. Optionale Bezeichnungen lassen sich über
  // categoryLabels überschreiben.
  const CATEGORY_DEFINITIONS = [
    { key: "attributes", labelKey: "game_deck_category_attributes" },
    { key: "grundskills", labelKey: "game_deck_category_grundskills" },
    { key: "groupskills", labelKey: "game_deck_category_groupskills" },
  ];

  const ROLL_INTERVAL_MS = 70;
  const ROLL_DURATION_MS = 1100;
  const FLASH_DURATION_MS = 900;

  const randomDiceValue = () => Math.floor(Math.random() * 100) + 1;
  const formatModifier = value => (value > 0 ? `+${value}` : `${value}`);

  const GameDeck = ({ categoryTotals = {}, categoryLabels = {} }) => {
    const t = useMemo(() => getTranslator(), []);
    const [diceValue, setDiceValue] = useState(null);
    const [isRolling, setIsRolling] = useState(false);
    const [isFlashing, setIsFlashing] = useState(false);
    const [sliderValue, setSliderValue] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState(
      CATEGORY_DEFINITIONS[0]?.key || ""
    );

    const sliderBaseId = useId();
    const sliderInputId = `${sliderBaseId}-input`;
    const sliderLabelId = `${sliderBaseId}-label`;
    const sliderValueId = `${sliderBaseId}-value`;
    const dropdownBaseId = useId();
    const dropdownSelectId = `${dropdownBaseId}-select`;
    const dropdownLabelId = `${dropdownBaseId}-label`;
    const diceLabelId = useId();
    const totalLabelId = useId();

    const rollIntervalRef = useRef(null);
    const rollTimeoutRef = useRef(null);
    const flashTimeoutRef = useRef(null);

    useEffect(() => {
      ensureStyles();
      return () => {
        if (rollIntervalRef.current) {
          clearInterval(rollIntervalRef.current);
          rollIntervalRef.current = null;
        }
        if (rollTimeoutRef.current) {
          clearTimeout(rollTimeoutRef.current);
          rollTimeoutRef.current = null;
        }
        if (flashTimeoutRef.current) {
          clearTimeout(flashTimeoutRef.current);
          flashTimeoutRef.current = null;
        }
      };
    }, []);

    const totals = useMemo(() => {
      const base = CATEGORY_DEFINITIONS.reduce((acc, def) => {
        acc[def.key] = 0;
        return acc;
      }, {});
      return { ...base, ...categoryTotals };
    }, [categoryTotals]);

    const sliderCustomProperties = useMemo(
      () => ({ "--game-deck-slider-progress": String((sliderValue + 100) / 200) }),
      [sliderValue]
    );

    const handleRoll = () => {
      if (isRolling) return;

      setIsRolling(true);
      setIsFlashing(false);
      setDiceValue(randomDiceValue());

      if (rollIntervalRef.current) {
        clearInterval(rollIntervalRef.current);
        rollIntervalRef.current = null;
      }
      if (rollTimeoutRef.current) {
        clearTimeout(rollTimeoutRef.current);
        rollTimeoutRef.current = null;
      }
      if (flashTimeoutRef.current) {
        clearTimeout(flashTimeoutRef.current);
        flashTimeoutRef.current = null;
      }

      rollIntervalRef.current = setInterval(() => {
        setDiceValue(randomDiceValue());
      }, ROLL_INTERVAL_MS);

      rollTimeoutRef.current = setTimeout(() => {
        if (rollIntervalRef.current) {
          clearInterval(rollIntervalRef.current);
          rollIntervalRef.current = null;
        }
        const finalValue = randomDiceValue();
        setDiceValue(finalValue);
        setIsRolling(false);
        setIsFlashing(true);
        flashTimeoutRef.current = setTimeout(() => {
          setIsFlashing(false);
          flashTimeoutRef.current = null;
        }, FLASH_DURATION_MS);
      }, ROLL_DURATION_MS);
    };

    const handleSliderChange = event => {
      setSliderValue(Number(event.target.value));
    };

    const handleCategoryChange = event => {
      setSelectedCategory(event.target.value);
    };

    const currentCategory = selectedCategory || CATEGORY_DEFINITIONS[0]?.key || "";
    const categoryTotalValue = totals[currentCategory] ?? 0;
    const modifierDisplay = formatModifier(sliderValue);
    const diceDisplay = diceValue ?? t("game_deck_no_result");

    const diceDisplayClassName = [
      "game-deck__dice-display",
      isFlashing ? "is-flashing" : "",
    ].filter(Boolean).join(" ");

    const diceNumberClassName = [
      "game-deck__dice-number",
      isRolling ? "is-rolling" : "",
    ].filter(Boolean).join(" ");

    const sliderValueLabel = `${t("game_deck_slider_value_label")}: ${modifierDisplay}`;

    const optionElements = CATEGORY_DEFINITIONS.map(({ key, labelKey }) => {
      const label =
        (categoryLabels && categoryLabels[key]) ||
        (labelKey ? t(labelKey) : t(key));
      return h(
        "option",
        {
          key,
          value: key,
        },
        label
      );
    });

    const selectedDefinition = CATEGORY_DEFINITIONS.find(
      def => def.key === currentCategory
    );
    const selectedCategoryLabel =
      (categoryLabels && categoryLabels[currentCategory]) ||
      (selectedDefinition ? t(selectedDefinition.labelKey) : currentCategory);

    const totalLabelContent = selectedCategoryLabel
      ? `${t("game_deck_total_label")} – ${selectedCategoryLabel}`
      : t("game_deck_total_label");

    return h(
      "div",
      { className: "game-deck" },
      h(
        "section",
        { className: "game-deck__card", "aria-labelledby": diceLabelId },
        h(
          "button",
          {
            type: "button",
            className: "game-deck__dice-button",
            onClick: handleRoll,
            disabled: isRolling,
          },
          t("game_deck_roll_button")
        ),
        h(
          "p",
          {
            id: diceLabelId,
            className: "game-deck__label",
          },
          t("game_deck_result_label")
        ),
        h(
          "div",
          {
            className: diceDisplayClassName,
            role: "status",
            "aria-live": "polite",
            "aria-atomic": "true",
          },
          h(
            "span",
            { className: diceNumberClassName },
            diceDisplay
          )
        )
      ),
      h(
        "section",
        { className: "game-deck__card", "aria-labelledby": sliderLabelId },
        h(
          "div",
          { className: "game-deck__slider-header" },
          h(
            "label",
            {
              id: sliderLabelId,
              className: "game-deck__label",
              htmlFor: sliderInputId,
            },
            t("game_deck_slider_label")
          ),
          h(
            "output",
            {
              id: sliderValueId,
              htmlFor: sliderInputId,
              className: "game-deck__slider-value",
              "aria-live": "polite",
              "aria-label": sliderValueLabel,
              title: sliderValueLabel,
            },
            modifierDisplay
          )
        ),
        h(
          "div",
          { className: "game-deck__slider-track" },
          h("input", {
            id: sliderInputId,
            type: "range",
            min: "-100",
            max: "100",
            step: "10",
            value: sliderValue,
            onChange: handleSliderChange,
            style: sliderCustomProperties,
            "aria-valuetext": modifierDisplay,
            "aria-labelledby": `${sliderLabelId} ${sliderValueId}`,
          })
        )
      ),
      h(
        "section",
        { className: "game-deck__card", "aria-labelledby": dropdownLabelId },
        h(
          "label",
          {
            id: dropdownLabelId,
            className: "game-deck__label",
            htmlFor: dropdownSelectId,
          },
          t("game_deck_dropdown_label")
        ),
        h(
          "select",
          {
            id: dropdownSelectId,
            className: "game-deck__select",
            value: currentCategory,
            onChange: handleCategoryChange,
          },
          optionElements
        ),
        h(
          "div",
          {
            className: "game-deck__total",
            role: "status",
            "aria-live": "polite",
            "aria-labelledby": totalLabelId,
          },
          h(
            "span",
            {
              id: totalLabelId,
            },
            totalLabelContent
          ),
          h(
            "span",
            { className: "game-deck__total-value" },
            String(categoryTotalValue)
          )
        )
      )
    );
  };

  if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    module.exports = GameDeck;
    module.exports.default = GameDeck;
  }
  global.GameDeck = GameDeck;
})(typeof window !== "undefined" ? window : this);
