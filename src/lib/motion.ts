// Page-level motion: the hero entrance, reveal-on-scroll, the scroll effects
// (plane parallax, demo tilt, clock slide, progress bar) and pausing the
// sections that are off screen. Everything is off for reduced motion, and the
// page is whole without it: CSS hides content only under .js (boot.js).
import { reduced } from "./ticker";

const root = document.documentElement;
root.dataset.ready = "";

if ("IntersectionObserver" in window) {
  const pause = new IntersectionObserver((entries) => entries.forEach((en) => en.target.toggleAttribute("data-paused", !en.isIntersecting)));
  document.querySelectorAll("main > section").forEach((s) => pause.observe(s));
}

const show = (el: Element, delay: number) => {
  (el as HTMLElement).style.transitionDelay = `${delay}ms`;
  el.setAttribute("data-in", "");
  setTimeout(() => ((el as HTMLElement).style.transitionDelay = ""), 1500 + delay);
};

if (!reduced) {
  // Hero entrance. setTimeout, not requestAnimationFrame, so a background tab never leaves the hero hidden.
  const rise = [...document.querySelectorAll("[data-rise]")];
  setTimeout(() => rise.forEach((el, i) => show(el, i * 95)), 60);

  // Sections reveal their blocks at 12% visible; a grid with 3 to 20 children reveals child by child.
  const groups = [...document.querySelectorAll<HTMLElement>("main > section:not(:first-child)")].map((sec) => {
    const items: Element[] = [];
    sec.querySelectorAll("[data-rv]").forEach((el) => items.push(el));
    sec.querySelectorAll("[data-rv-kids]").forEach((el) => items.push(...el.children));
    return { sec, items, done: false };
  });
  const reveal = (g: (typeof groups)[number]) => { g.done = true; g.items.forEach((el, i) => show(el, i * 90)); };
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    const g = groups.find((x) => x.sec === en.target);
    if (en.isIntersecting && g && !g.done) { reveal(g); io.unobserve(en.target); }
  }), { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  groups.forEach((g) => io.observe(g.sec));
  // Anything already on screen after 1.5s comes in regardless.
  setTimeout(() => groups.forEach((g) => { if (!g.done && g.sec.getBoundingClientRect().top < innerHeight) reveal(g); }), 1500);

  const tilt = document.querySelector<HTMLElement>("[data-tilt]");
  const par = document.querySelector<HTMLElement>("[data-par]");
  const slide = document.querySelector<HTMLElement>("[data-slide]");
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      const y = scrollY, vh = innerHeight;
      if (tilt) {
        const p = Math.max(0, Math.min(1, (vh - tilt.getBoundingClientRect().top) / (vh * 0.75)));
        tilt.style.transform = `rotateX(${((1 - p) * 16).toFixed(2)}deg) scale(${(0.93 + 0.07 * p).toFixed(4)})`;
      }
      if (par) par.style.transform = `translate3d(0,${(y * 0.18).toFixed(1)}px,0)`;
      if (slide) {
        const r = slide.parentElement!.getBoundingClientRect();
        const p = Math.max(0, Math.min(1, 1 - (r.top + r.height / 2) / vh));
        slide.style.transform = `translate3d(${((0.5 - p) * 12).toFixed(2)}%,0,0)`;
      }
    });
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

// The progress bar is information, not decoration, so it runs for everyone.
const bar = document.querySelector<HTMLElement>("[data-progress]");
if (bar) {
  let t = false;
  const upd = () => {
    if (t) return;
    t = true;
    requestAnimationFrame(() => {
      t = false;
      const max = root.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
    });
  };
  addEventListener("scroll", upd, { passive: true });
  upd();
}
