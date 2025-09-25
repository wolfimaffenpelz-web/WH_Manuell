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

  color: var(--color-text, #111);
  --game-deck-slider-fill: var(--color-highlight, #9E9E9E);
}

@media (min-width: 768px) {
  .game-deck {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }
}

.game-deck__card {
  background: var(--color-bg, #FAF0E6);
  border: none;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
  color: var(--color-text, #111);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.game-deck__card--dice {
  align-items: center;
  text-align: center;
}

.game-deck__label {
  margin: 0;
  font-weight: 600;
  font-family: var(--font-heading, 'UnifrakturMaguntia', cursive);
  font-size: 1rem;
  text-align: center;
  width: 100%;
}

.game-deck__label--dice {
  font-size: 1.3rem;
  margin-top: 1rem;
}

.game-deck__dice-button {
  align-self: center;
  background: var(--color-highlight, #9E9E9E);
  color: var(--color-bg, #FAF0E6);
  border: none;
  border-radius: 999px;
  padding: 0.75rem 1.5rem;
  font-family: var(--font-heading, 'UnifrakturMaguntia', cursive);
  font-size: 2.2rem;
  line-height: 1;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
  margin-bottom: 1rem;
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
  border: 2px solid var(--color-table-line, #000);
  font-size: 2.2rem;
  font-weight: 700;
  font-family: var(--font-heading, 'UnifrakturMaguntia', cursive);
  background: var(--color-bg, #FAF0E6);

  color: var(--color-text, #111);
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: box-shadow 0.3s ease;
}

.game-deck__dice-display.is-flashing {
  animation: game-deck-blood-flash 0.9s ease-out;
  color: var(--color-negative, #8b0000);
}

.game-deck__dice-display.is-flashing .game-deck__dice-number {
  text-shadow: 0 0 12px rgba(139, 0, 0, 0.75);
}

.game-deck__dice-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 3ch;
  font-family: var(--font-heading, 'UnifrakturMaguntia', cursive);

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
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
}

.game-deck__slider-value {
  font-family: var(--font-main, 'Podkova', serif);
  font-size: 1.1rem;
  font-weight: 600;
  text-align: center;
}

.game-deck__slider-track {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 52px;
}

.game-deck__slider-track input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  width: min(100%, 360px);
  height: 52px;
  border-radius: 999px;
  background: linear-gradient(
    to right,
    var(--game-deck-slider-fill, var(--color-highlight, #9E9E9E)) 0%,
    var(--game-deck-slider-fill, var(--color-highlight, #9E9E9E)) calc(var(--game-deck-slider-progress, 0.5) * 100%),
    rgba(var(--color-text-rgb, 17, 17, 17), 0.2) calc(var(--game-deck-slider-progress, 0.5) * 100%),
    rgba(var(--color-text-rgb, 17, 17, 17), 0.2) 100%
  );
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 10px;
  cursor: pointer;
  margin: 0 auto;
  transition: box-shadow 0.2s ease;
}

.game-deck__slider-track input[type="range"]:focus-visible {
  outline: 2px solid var(--color-highlight, #9E9E9E);
  outline-offset: 4px;
}

.game-deck__slider-track input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: transparent url("data:image/svg+xml,${TALENT_THUMB_SVG}") no-repeat center/95%;
  border: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

.game-deck__slider-track input[type="range"]::-moz-range-thumb {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: transparent url("data:image/svg+xml,${TALENT_THUMB_SVG}") no-repeat center/95%;
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
  background: var(--color-field, rgba(255, 255, 255, 0.92));
  color: var(--color-text, #111);
  cursor: pointer;
}
.game-deck__total,
.game-deck__stat {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  gap: 0.35rem;
  padding: 0.75rem 0.85rem;
  border-radius: 8px;
  background: var(--color-bg, #FAF0E6);
  border: none;
  color: var(--color-text, #111);

  font-family: var(--font-main, 'Podkova', serif);
  font-size: 1rem;
}

.game-deck__stat-line {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.5rem;
}

.game-deck__stat-label {
  font-weight: 600;
}

.game-deck__total-value,
.game-deck__stat-value {
  font-weight: 700;
  font-size: 1.25rem;
}

.game-deck__stat-value.is-positive {
  color: var(--color-positive, #2e7d32);
}

.game-deck__stat-value.is-negative {
  color: var(--color-negative, #c62828);
}

.game-deck__stat-subtext {
  font-size: 0.85rem;
  color: var(--color-text, #111);
  opacity: 0.75;

}

.game-deck__dice-feedback {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  margin-top: 0.75rem;
}

.game-deck__dice-feedback-text {
  font-family: var(--font-heading, 'UnifrakturMaguntia', cursive);
  font-size: 1.4rem;
  font-weight: 700;
}

.game-deck__dice-feedback-note {
  font-size: 0.95rem;
  font-family: var(--font-main, 'Podkova', serif);
  color: var(--color-text, #111);
}

.game-deck__dice-feedback--success .game-deck__dice-feedback-text {
  color: var(--color-positive, #2e7d32);
}

.game-deck__dice-feedback--failure .game-deck__dice-feedback-text {
  color: var(--color-negative, #c62828);
}

.game-deck__dice-feedback--pending .game-deck__dice-feedback-text {
  color: var(--color-text, #111);
}

.game-deck__empty {
  font-style: italic;
  color: var(--color-text, #111);
  opacity: 0.7;

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

  // Zusätzliche Tabellen lassen sich anbinden, indem optionGroups mit
  // { id, label, value, breakdown } in renderGameDeckComponent übergeben
  // werden. GameDeck nutzt diese Daten automatisch für Auswahl & Anzeige.

  const ROLL_INTERVAL_MS = 70;
  const ROLL_DURATION_MS = 1100;
  const FLASH_DURATION_MS = 900;

  const randomDiceValue = () => Math.floor(Math.random() * 100) + 1;
  const formatModifier = value => (value > 0 ? `+${value}` : `${value}`);
  const toNumber = value => {
    if (typeof value === "number") {
      return Number.isNaN(value) ? 0 : value;
    }
    const parsed = parseInt(value, 10);
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  const GameDeck = ({ optionGroups = [] }) => {
    const t = useMemo(() => getTranslator(), []);
    const flatOptions = useMemo(() => {
      if (!Array.isArray(optionGroups)) return [];
      const aggregated = [];
      optionGroups.forEach((group, groupIndex) => {
        if (!group || !Array.isArray(group.options)) {
          return;
        }
        const groupLabel = group.label || "";
        group.options.forEach((option, optionIndex) => {
          if (!option) return;
          const optionId =
            option && option.id != null && String(option.id).length > 0
              ? String(option.id)
              : `group-${groupIndex}-option-${optionIndex}`;
          aggregated.push({
            ...option,
            id: optionId,
            groupId:
              group && group.id != null && String(group.id).length > 0
                ? String(group.id)
                : `group-${groupIndex}`,
            groupLabel,
          });
        });
      });
      return aggregated;
    }, [optionGroups]);

    const [selectedOptionId, setSelectedOptionId] = useState(() => flatOptions[0]?.id || "");
    const [diceValue, setDiceValue] = useState(null);
    const [isRolling, setIsRolling] = useState(false);
    const [isFlashing, setIsFlashing] = useState(false);
    const [sliderValue, setSliderValue] = useState(0);

    const sliderBaseId = useId();
    const sliderInputId = `${sliderBaseId}-input`;
    const sliderLabelId = `${sliderBaseId}-label`;
    const sliderValueId = `${sliderBaseId}-value`;
    const dropdownBaseId = useId();
    const dropdownSelectId = `${dropdownBaseId}-select`;
    const dropdownLabelId = `${dropdownBaseId}-label`;
    const diceLabelId = useId();
    const diceFeedbackId = useId();
    const totalLabelId = useId();
    const successLabelId = useId();

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

    useEffect(() => {
      if (flatOptions.length === 0) {
        if (selectedOptionId !== "") {
          setSelectedOptionId("");
        }
        return;
      }
      const match = flatOptions.some(option => option.id === selectedOptionId);
      if (!match) {
        setSelectedOptionId(flatOptions[0].id);
      }
    }, [flatOptions, selectedOptionId]);

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

    const handleOptionChange = event => {
      setSelectedOptionId(event.target.value);
    };

    const hasOptions = flatOptions.length > 0;
    const selectedOption = flatOptions.find(option => option.id === selectedOptionId) || null;
    const hasSelection = Boolean(selectedOption);

    const modifierValue = sliderValue;
    const modifierDisplay = formatModifier(modifierValue);
    const targetValue = hasSelection ? toNumber(selectedOption.value) : 0;
    const adjustedTargetValue = hasSelection ? targetValue + modifierValue : null;
    const diceDisplay =
      diceValue == null
        ? t("game_deck_no_result")
        : String(diceValue).padStart(diceValue === 100 ? 3 : 2, "0");

    const diceDisplayClassName = [
      "game-deck__dice-display",
      isFlashing ? "is-flashing" : "",
    ].filter(Boolean).join(" ");

    const diceNumberClassName = [
      "game-deck__dice-number",
      isRolling ? "is-rolling" : "",
    ].filter(Boolean).join(" ");

    const optionElements = hasOptions
      ? optionGroups
          .map((group, groupIndex) => {
            if (!group || !Array.isArray(group.options) || group.options.length === 0) {
              return null;
            }
            const groupLabel = group.label || t("game_deck_dropdown_label");
            const children = group.options.map((option, optionIndex) => {
              if (!option) return null;
              const value =
                option && option.id != null && String(option.id).length > 0
                  ? String(option.id)
                  : `group-${groupIndex}-option-${optionIndex}`;
              return h(
                "option",
                {
                  key: value,
                  value,
                },
                option.label || value
              );
            }).filter(Boolean);
            if (children.length === 0) return null;
            const optgroupKey =
              group && group.id != null && String(group.id).length > 0
                ? String(group.id)
                : group.label || `group-${groupIndex}`;
            return h(
              "optgroup",
              {
                key: optgroupKey,
                label: group.label || t("game_deck_dropdown_label"),
              },
              children
            );
          })
          .filter(Boolean)
      : [h("option", { value: "" }, t("game_deck_no_options"))];

    const selectedBreakdown = hasSelection && selectedOption.breakdown ? selectedOption.breakdown : null;
    const breakdownSubtext = selectedBreakdown
      ? `${selectedBreakdown.baseLabel || t("game_deck_attribute_base_label")}: ${toNumber(
          selectedBreakdown.base
        )} · ${selectedBreakdown.increaseLabel || t("game_deck_attribute_increase_label")}: ${toNumber(
          selectedBreakdown.increase
        )}`
      : null;

    const totalLabelParts = [t("game_deck_total_label")];
    if (selectedOption && selectedOption.groupLabel) {
      totalLabelParts.push(selectedOption.groupLabel);
    }
    if (selectedOption && selectedOption.label) {
      totalLabelParts.push(selectedOption.label);
    }
    const totalLabelContent = totalLabelParts.join(" – ");

    const targetValueDisplay = hasSelection
      ? String(targetValue)
      : hasOptions
      ? t("game_deck_no_target")
      : t("game_deck_no_options");

    const adjustedTargetDisplay =
      adjustedTargetValue == null
        ? hasSelection
          ? t("game_deck_no_comparison")
          : hasOptions
          ? t("game_deck_no_selection")
          : t("game_deck_no_options")
        : String(adjustedTargetValue);

    const successLevels =
      diceValue == null || adjustedTargetValue == null
        ? null
        : Math.trunc((adjustedTargetValue - diceValue) / 10);
    const successValueDisplay = successLevels == null ? "–" : successLevels > 0 ? `+${successLevels}` : String(successLevels);
    const successValueClassName = [
      "game-deck__stat-value",
      successLevels != null && successLevels > 0 ? "is-positive" : "",
      successLevels != null && successLevels < 0 ? "is-negative" : "",
    ].filter(Boolean).join(" ");

    const successSubtext = (() => {
      if (!hasOptions) return t("game_deck_no_options");
      if (!hasSelection) return t("game_deck_no_selection");
      if (diceValue == null) return t("game_deck_no_comparison");
      const parts = [
        `${t("game_deck_result_label")}: ${diceDisplay}`,
        `${t("game_deck_target_value_label")}: ${targetValueDisplay}`,
        `${t("game_deck_slider_label")}: ${modifierDisplay}`,
      ];
      if (modifierValue !== 0 && adjustedTargetValue != null) {
        parts.push(`${t("game_deck_adjusted_target_label")}: ${adjustedTargetDisplay}`);
      }
      return parts.join(" · ");
    })();

    const isDouble = typeof diceValue === "number" && diceValue > 0 && diceValue < 100 && diceValue % 11 === 0;
    const isSuccessfulRoll =
      diceValue != null && adjustedTargetValue != null ? diceValue <= adjustedTargetValue : false;
    const isAutoSuccess = diceValue === 1;
    const isAutoFailure = diceValue === 100;

    const diceFeedback = (() => {
      if (isRolling || diceValue == null) {
        return null;
      }
      if (isAutoSuccess) {
        return {
          message: t("game_deck_critical_success_label"),
          tone: "success",
          note: t("game_deck_auto_success_note"),
        };
      }
      if (isAutoFailure) {
        return {
          message: t("game_deck_patzer_label"),
          tone: "failure",
          note: t("game_deck_auto_failure_note"),
        };
      }
      if (!isDouble) {
        return null;
      }
      if (!hasSelection) {
        return {
          message: hasOptions ? t("game_deck_no_selection") : t("game_deck_no_options"),
          tone: "pending",
        };
      }
      return isSuccessfulRoll
        ? { message: t("game_deck_critical_success_label"), tone: "success" }
        : { message: t("game_deck_patzer_label"), tone: "failure" };
    })();

    const diceFeedbackClassName = [
      "game-deck__dice-feedback",
      diceFeedback && diceFeedback.tone ? `game-deck__dice-feedback--${diceFeedback.tone}` : "",
    ]
      .filter(Boolean)
      .join(" ");

    const diceDisplayProps = {
      className: diceDisplayClassName,
      role: "status",
      "aria-live": "polite",
      "aria-atomic": "true",
    };

    if (diceFeedback && diceFeedback.message) {
      diceDisplayProps["aria-describedby"] = diceFeedbackId;
    }

    return h(
      "div",
      { className: "game-deck" },
      h(
        "section",
        { className: "game-deck__card game-deck__card--dice", "aria-labelledby": diceLabelId },
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
            className: "game-deck__label game-deck__label--dice",
          },
          t("game_deck_result_label")
        ),
        h(
          "div",
          diceDisplayProps,
          h(
            "span",
            { className: diceNumberClassName },
            diceDisplay
          )
        ),
        diceFeedback && diceFeedback.message
          ? h(
              "div",
              {
                id: diceFeedbackId,
                className: diceFeedbackClassName,
                role: "status",
                "aria-live": "polite",
              },
              h("span", { className: "game-deck__dice-feedback-text" }, diceFeedback.message),
              diceFeedback.note
                ? h("span", { className: "game-deck__dice-feedback-note" }, diceFeedback.note)
                : null
            )
          : null
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
              "aria-label": `${t("game_deck_slider_value_label")}: ${modifierDisplay}`,
              title: `${t("game_deck_slider_value_label")}: ${modifierDisplay}`,
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
            value: selectedOptionId,
            onChange: handleOptionChange,
            disabled: !hasOptions,
          },
          optionElements
        ),
        hasOptions
          ? h(
              "div",
              {
                className: "game-deck__stat game-deck__stat--target",
                role: "status",
                "aria-live": "polite",
                "aria-labelledby": totalLabelId,
              },
              h(
                "div",
                { className: "game-deck__stat-line" },
                h(
                  "span",
                  {
                    id: totalLabelId,
                    className: "game-deck__stat-label",
                  },
                  totalLabelContent
                ),
                h(
                  "span",
                  { className: "game-deck__stat-value" },
                  targetValueDisplay
                )
              ),
              breakdownSubtext
                ? h(
                    "span",
                    { className: "game-deck__stat-subtext" },
                    breakdownSubtext
                  )
                : null
            )
          : h(
              "p",
              {
                className: "game-deck__empty",
                role: "status",
                "aria-live": "polite",
              },
              t("game_deck_no_options")
            ),
        h(
          "div",
          {
            className: "game-deck__stat game-deck__stat--success",
            role: "status",
            "aria-live": "polite",
            "aria-labelledby": successLabelId,
          },
          h(
            "div",
            { className: "game-deck__stat-line" },
            h(
              "span",
              {
                id: successLabelId,
                className: "game-deck__stat-label",
              },
              t("game_deck_success_label")
            ),
            h(
              "span",
              { className: successValueClassName },
              successValueDisplay
            )
          ),
          h(
            "span",
            { className: "game-deck__stat-subtext" },
            successSubtext
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
