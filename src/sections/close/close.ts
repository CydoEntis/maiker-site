// Close the window and the sessions carry on: the window shrinks to the
// taskbar, and `maitty ls` shows the same sessions still moving.
import { announce } from "../../lib/announce";

const demo = document.querySelector<HTMLElement>("[data-close-demo]");
if (demo) {
  const tray = demo.querySelector<HTMLElement>("[data-tray]")!;
  const set = (closed: boolean) => {
    demo.toggleAttribute("data-closed", closed);
    tray.hidden = !closed;
    announce(closed ? "Window closed. Agents keep running in the service." : "Maiker reopened. Every session is where you left it.");
  };
  demo.querySelector("[data-close]")!.addEventListener("click", () => set(true));
  demo.querySelectorAll("[data-open]").forEach((b) => b.addEventListener("click", () => set(false)));

  const hm = demo.querySelector("[data-hm]")!;
  const clock = () => { hm.textContent = new Date().toTimeString().slice(0, 5); };
  clock();
  setInterval(clock, 20000);
}
