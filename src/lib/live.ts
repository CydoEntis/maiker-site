// The shared live sessions behind the close-window, other-machines and
// theme-preview demos. Every [data-sess="id"] element wears the session's
// state in data-state; a row's [data-glyph] and [data-word] follow it.
import { GLYPH, ORDER, SESSIONS, WORD, type SessionState } from "./sessions";
import { onTick, reduced } from "./ticker";

const state = new Map<string, SessionState>(SESSIONS.map((s) => [s.id, s.state]));
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];

function paint() {
  document.querySelectorAll<HTMLElement>("[data-sess]").forEach((el) => {
    const st = state.get(el.dataset.sess!)!;
    el.dataset.state = st;
    const g = el.querySelector<HTMLElement>("[data-glyph]");
    if (g) {
      g.toggleAttribute("data-spin", st === "working" && !reduced);
      g.textContent = st === "working" ? (reduced ? "●" : GLYPH.working) : GLYPH[st];
    }
    const w = el.querySelector("[data-word]");
    if (w) w.textContent = WORD[st];
  });
  document.querySelectorAll<HTMLElement>("[data-sorted]").forEach((list) => {
    const limit = Number(list.dataset.limit) || 99;
    const rows = [...list.children] as HTMLElement[];
    rows.sort((a, b) => ORDER[state.get(a.dataset.sess!)!] - ORDER[state.get(b.dataset.sess!)!]);
    rows.forEach((r, i) => { r.hidden = i >= limit; list.append(r); });
  });
}

function step() {
  const by = (st: SessionState) => SESSIONS.filter((s) => state.get(s.id) === st);
  const W = by("working"), N = by("needs"), D = by("done"), I = by("idle");
  const r = Math.random();
  let id: string | null = null, to: SessionState = "working";
  if (N.length === 0 && W.length) { id = pick(W).id; to = "needs"; }
  else if (N.length < 2 && r < 0.22 && W.length > 3) { id = pick(W).id; to = "needs"; }
  else if (r < 0.55 && W.length > 3) { id = pick(W).id; to = "done"; }
  else if (r < 0.78 && D.length) { id = pick(D).id; to = "idle"; }
  else if (I.length) { id = pick(I).id; to = "working"; }
  if (!id) return;
  state.set(id, to);
  paint();
}

if (!reduced) onTick(document.documentElement, step, 38);
paint();
