// One clock for every moving demo, 80ms a tick. It runs only while the tab is
// visible and motion is allowed, and skips a section that is off screen.
export const TICK_MS = 80;
const SPIN = "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏";
export const STILL_SPIN = "●";

export const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

type Tick = (frame: number) => void;
const subs: { el: Element; fn: Tick }[] = [];
let frame = 0;
let timer: number | undefined;

const onScreen = (el: Element) => !el.closest("[data-paused]");

function tick() {
  frame++;
  const glyph = SPIN[frame % SPIN.length];
  document.querySelectorAll("section:not([data-paused]) [data-spin]").forEach((el) => { el.textContent = glyph; });
  for (const s of subs) if (onScreen(s.el)) s.fn(frame);
}

function run() { timer ??= window.setInterval(tick, TICK_MS); }
function stop() { window.clearInterval(timer); timer = undefined; }

/** Calls fn every `every` ticks while el's section is on screen. */
export function onTick(el: Element, fn: Tick, every = 1) {
  subs.push({ el, fn: (f) => { if (f % every === 0) fn(f); } });
}

export const frameNow = () => frame;
export const spinGlyph = () => (reduced ? STILL_SPIN : SPIN[frame % SPIN.length]);

if (reduced) {
  document.querySelectorAll("[data-spin]").forEach((el) => { el.textContent = STILL_SPIN; });
} else {
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : run()));
  run();
}
