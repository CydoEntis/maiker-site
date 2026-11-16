// Picking a theme recolours the preview card. The palettes sit on the buttons.
const cards = document.querySelectorAll<HTMLElement>("[data-theme-card]");
const preview = document.querySelector<HTMLElement>("[data-preview]");

cards.forEach((btn) => btn.addEventListener("click", () => {
  if (!preview) return;
  const d = btn.dataset;
  cards.forEach((b) => b.setAttribute("aria-checked", String(b === btn)));
  const vars: Record<string, string> = {
    "--pv-bg": d.bg!, "--pv-text": d.text!, "--pv-dim": d.dim!, "--pv-line": d.line!, "--pv-accent": d.accent!,
    "--needs": d.needs!, "--working": d.work!, "--done": d.done!, "--dim": d.dim!,
  };
  for (const [k, v] of Object.entries(vars)) preview.style.setProperty(k, v);
  preview.querySelector("[data-pv-name]")!.textContent = d.name!;
}));
