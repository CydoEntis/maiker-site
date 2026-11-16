// The wait clock: it starts at 00:47:12 on page load and counts up each second.
const clock = document.querySelector<HTMLElement>("[data-clock]");
if (clock) {
  const start = Date.now();
  const hh = (n: number) => String(n).padStart(2, "0");
  const tick = () => {
    const s = 47 * 60 + 12 + Math.floor((Date.now() - start) / 1000);
    clock.textContent = `${hh(Math.floor(s / 3600))}:${hh(Math.floor(s / 60) % 60)}:${hh(s % 60)}`;
  };
  setInterval(() => { if (!document.hidden) tick(); }, 1000);
}
