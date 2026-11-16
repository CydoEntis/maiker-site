// "Hear the alert": the two rising notes the app plays when an agent needs
// you, E5 then B5, made with Web Audio so the page ships no sound file.
import { announce } from "../../lib/announce";

const NOTES: [number, number][] = [[659.25, 0], [987.77, 0.16]];

document.querySelector("[data-chime]")?.addEventListener("click", () => {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    for (const [freq, at] of NOTES) {
      const osc = ctx.createOscillator(), gain = ctx.createGain(), t = ctx.currentTime + at;
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.18, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.45);
    }
  } catch { /* no audio available: the live region still says what would have played */ }
  announce("Played the needs-you alert");
});
