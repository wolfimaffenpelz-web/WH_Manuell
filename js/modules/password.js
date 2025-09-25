// Passwortschutz und Initialisierung
function initPasswordProtection() {
  applyTranslations();
  applySavedSettings();
  const overlay = document.getElementById("password-overlay");
  const input = document.getElementById("password-input");
  const button = document.getElementById("password-submit");

  if (localStorage.getItem("auth") === "true") {
    overlay.style.display = "none";
    initLogic();
  }

  button.addEventListener("click", () => {
    if (input.value === "1234") {
      overlay.style.display = "none";
      localStorage.setItem("auth", "true");
      initLogic();
    } else {
      alert(t('wrong_password'));
    }
  });
}

document.addEventListener("DOMContentLoaded", initPasswordProtection);
