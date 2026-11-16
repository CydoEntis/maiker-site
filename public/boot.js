// Runs before first paint, so a Day visitor never sees a Night flash and the
// install block opens on the right OS. A ?theme= link wins, then the saved
// choice, then the system preference. The js class lets CSS hide
// [data-rv] content only when a script will reveal it again.
(() => {
  const root = document.documentElement;
  let theme = new URLSearchParams(location.search).get("theme");
  if (theme !== "night" && theme !== "day") {
    try { theme = localStorage.getItem("maiker-theme"); } catch (e) { theme = null; /* storage blocked: fall back to the system */ }
  }
  if (theme !== "night" && theme !== "day") theme = matchMedia("(prefers-color-scheme: light)").matches ? "day" : "night";
  root.dataset.theme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = theme === "day" ? "#f3f3f0" : "#0a0a0b";
  const platform = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || navigator.userAgent || "";
  root.dataset.os = /win/i.test(platform) ? "win" : "nix";
  root.dataset.osName = /win/i.test(platform) ? "Windows" : /mac/i.test(platform) ? "macOS" : /linux/i.test(platform) ? "Linux" : "";
  if ("IntersectionObserver" in window) {
    root.classList.add("js");
    // If the page script never starts, show everything rather than leave it hidden.
    setTimeout(() => { if (!("ready" in root.dataset)) root.classList.remove("js"); }, 4000);
  }
})();
