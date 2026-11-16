// The workflow report advances a step every 2.4s: waiting (·), working (a
// spinner), then done (✓), and loops.
import { onTick, reduced } from "../../lib/ticker";

const run = document.querySelector<HTMLElement>("[data-run]");
if (run && !reduced) {
  const steps = [...run.querySelectorAll<HTMLElement>("[data-step]")];
  let phase = 2; // the page starts with spec done and build working
  onTick(run, () => {
    phase = (phase + 1) % (steps.length + 2);
    steps.forEach((el, i) => {
      const st = i < phase - 1 ? "done" : i === phase - 1 ? "working" : "wait";
      el.dataset.state = st;
      const g = el.querySelector<HTMLElement>("[data-glyph]")!;
      g.toggleAttribute("data-spin", st === "working");
      g.textContent = st === "done" ? "✓" : st === "working" ? "⠋" : "·";
    });
  }, 30);
}
