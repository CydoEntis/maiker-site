// The header button switches the page between Night and Day and remembers the
// choice. Its label is the theme it switches to.
const root = document.documentElement;
const button = document.querySelector<HTMLElement>("[data-theme-toggle]")!;

type Theme = "night" | "day";

const REVEAL_MS = 600;
const REVEAL_EASE = "cubic-bezier(.2, .7, .2, 1)";

const current = (): Theme => (root.dataset.theme === "day" ? "day" : "night");

function sync() {
  const next = current() === "night" ? "Day" : "Night";
  button.setAttribute("aria-label", `Switch to ${next} theme`);
  button.querySelector("[data-theme-word]")!.textContent = next;
}

function apply(theme: Theme) {
  root.dataset.theme = theme;
  document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')!.content = theme === "day" ? "#f3f3f0" : "#0a0a0b";
  try { localStorage.setItem("maiker-theme", theme); } catch { /* storage blocked: the choice lasts this visit */ }
  sync();
}

// The new theme grows as a circle from the top-right corner, where the toggle sits.
function reveal() {
  const radius = Math.hypot(innerWidth, innerHeight);
  root.animate(
    { clipPath: ["circle(0 at 100% 0)", `circle(${radius}px at 100% 0)`] },
    { duration: REVEAL_MS, easing: REVEAL_EASE, pseudoElement: "::view-transition-new(root)" },
  );
}

const isSkipped = (e: unknown) => e instanceof DOMException && e.name === "AbortError";

function setTheme(theme: Theme) {
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (still || !document.startViewTransition) {
    // Without the reveal, switch every colour at once: reading a style flushes the change while transitions are off.
    root.toggleAttribute("data-theme-switching", true);
    apply(theme);
    void getComputedStyle(root).color;
    root.removeAttribute("data-theme-switching");
    return;
  }
  // Colour transitions would fade inside the new snapshot; data-theme-switching turns them off.
  const transition = document.startViewTransition(() => {
    root.toggleAttribute("data-theme-switching", true);
    apply(theme);
  });
  transition.ready.then(reveal, (e) => { if (!isSkipped(e)) throw e; });
  transition.finished.finally(() => root.removeAttribute("data-theme-switching"));
}

button.addEventListener("click", () => setTheme(current() === "night" ? "day" : "night"));
sync();
