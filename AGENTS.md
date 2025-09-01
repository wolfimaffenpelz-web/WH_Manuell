# Agent Instructions

- Extract user-facing strings into `js/translations.js` to support multiple languages (de, en, fr, ru).
- Keep German strings as placeholders for other languages.
- Remember to add new keys for any new user-visible text and use `t(key)` for lookups.
- Organize `css/style.css` with variables for fonts, colors, and sizes at the top and group rules by segment.
- Centralize adjustable properties like fonts, colors, and font sizes using CSS variables.
- Ensure table rows and columns have explicit height/width definitions; allow wrap and dynamic height for `Name`, `Fähigkeit`, `Talent`, `Eintrag`, `Mutation`, `Notizen`, `Qualitäten`, and `Kommentar` columns.
- Run available tests after changes.
- Maintain calculation fields for values and keep debt entries automatically negative.
- Keep delete columns consistently narrow across dynamic tables and let `Name`, `Qualitäten`, and `Notizen` columns expand.
- Preserve attribute marker functionality with three crosses, one skull, and one shield.

