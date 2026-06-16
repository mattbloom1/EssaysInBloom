/* main.js — Essays in Bloom */
(function () {
  "use strict";

  var KEY = "eib-theme";
  var root = document.documentElement;

  function apply(theme) {
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
    } else {
      root.removeAttribute("data-theme");
    }
    var isDark = theme === "dark";
    document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(isDark));
      var label = btn.querySelector("[data-theme-label]");
      if (label) label.textContent = isDark ? "Light" : "Dark";
    });
  }

  // Initial theme: saved preference, else the OS setting.
  var stored = localStorage.getItem(KEY);
  var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  apply(stored || (prefersDark ? "dark" : "light"));

  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-theme-toggle]");
    if (!btn) return;
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    localStorage.setItem(KEY, next);
    apply(next);
  });
})();
