/* main.js — Essays in Bloom
   Single source of truth for the shared header + footer (rendered into the
   empty <header>/<footer> on each page) plus the light/dark theme toggle.
   Loaded with `defer` on every content page. */
(function () {
  "use strict";

  /* ----- Site structure: edit here once, applies to every page ----- */
  var NAV = [
    { href: "index.html", label: "Home" },
    { href: "about.html", label: "About" },
    { href: "approach.html", label: "Approach" },
    { href: "coaching.html", label: "Coaching" },
    { href: "workshops.html", label: "Workshops" },
    { href: "testimonials.html", label: "Testimonials" }
  ];
  var CONTACT = { href: "contact.html", label: "Contact" };
  var FOOTER_LINKS = [
    { href: "terms.html", label: "Terms of Service" },
    { href: "privacy.html", label: "Privacy Policy" },
    { href: "accessibility.html", label: "Accessibility Statement" }
  ];

  var current = location.pathname.split("/").pop() || "index.html";

  function link(item, className) {
    var cls = className ? ' class="' + className + '"' : "";
    var active = item.href === current ? ' aria-current="page"' : "";
    return '<a href="' + item.href + '"' + cls + active + ">" + item.label + "</a>";
  }

  function renderHeader(el) {
    el.innerHTML =
      '<div class="header-inner">' +
        '<a class="brand" href="index.html" aria-label="Essays in Bloom — home">' +
          '<span class="brand__logo" role="img" aria-hidden="true"></span>' +
        "</a>" +
        '<nav class="tabs" aria-label="Primary">' +
          NAV.map(function (i) { return link(i); }).join("") +
        "</nav>" +
        link(CONTACT, "tab tab--contact") +
      "</div>" +
      '<button class="theme-toggle" type="button" data-theme-toggle aria-pressed="false">' +
        "<span data-theme-label>Dark</span>" +
      "</button>";
  }

  function renderFooter(el) {
    el.innerHTML =
      FOOTER_LINKS.map(function (i) { return link(i); }).join("") +
      "<p>&copy; 2026 Essays in Bloom</p>";
  }

  var headerEl = document.querySelector("header");
  var footerEl = document.querySelector("footer");
  if (headerEl) renderHeader(headerEl);
  if (footerEl) renderFooter(footerEl);

  /* ----- Theme toggle ----- */
  var KEY = "eib-theme";
  var root = document.documentElement;

  function applyTheme(theme) {
    if (theme === "dark") root.setAttribute("data-theme", "dark");
    else root.removeAttribute("data-theme");
    var isDark = theme === "dark";
    document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(isDark));
      var label = btn.querySelector("[data-theme-label]");
      if (label) label.textContent = isDark ? "Light" : "Dark";
    });
  }

  var stored = localStorage.getItem(KEY);
  var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(stored || (prefersDark ? "dark" : "light"));

  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-theme-toggle]");
    if (!btn) return;
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    localStorage.setItem(KEY, next);
    applyTheme(next);
  });
})();
