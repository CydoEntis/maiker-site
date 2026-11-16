// The hero's two demos: the tabs, the desktop app (scaled to fit, sidebar and
// the Allow/Deny card) and the terminal app (panes, key mode, answering).
// The markup is already on the page; this only toggles attributes and text.
import { announce } from "../../lib/announce";
import { onTick, reduced } from "../../lib/ticker";
import { CHATS } from "./desktop-data";
import { initialTui, ORDER, renderTui, TS, type TuiState } from "./tui-core";

/* ---- tabs ---- */
const tabs = document.querySelectorAll<HTMLElement>("[data-tab]");
function showTab(which: "gui" | "tui") {
  tabs.forEach((t) => t.setAttribute("aria-selected", String(t.dataset.tab === which)));
  document.querySelectorAll<HTMLElement>("[data-panel]").forEach((p) => { p.hidden = p.dataset.panel !== which; });
  document.querySelector<HTMLElement>("[data-hint-gui]")!.hidden = which !== "gui";
  document.querySelector<HTMLElement>("[data-hint-tui]")!.hidden = which !== "tui";
}
tabs.forEach((t) => t.addEventListener("click", () => showTab(t.dataset.tab === "tui" ? "tui" : "gui")));

/* ---- desktop app ---- */
const gui = document.querySelector<HTMLElement>("[data-gui]");
if (gui) {
  const fit = () => gui.style.setProperty("--s", String(Math.min(1, gui.clientWidth / 1280) || 1));
  new ResizeObserver(fit).observe(gui);
  fit();

  const rowOf = (id: string) => gui.querySelector<HTMLElement>(`[data-gsess="${id}"]`)!;
  const badges: Record<string, string> = { needs: "!", working: "⠋", done: "✓", idle: "" };
  const statusText: Record<string, string> = { needs: "", working: "⠋ Working", done: "✓ Finished", idle: "○ Idle" };

  function setState(id: string, st: string) {
    const row = rowOf(id);
    row.dataset.state = st;
    row.querySelector<HTMLElement>(".badge")!.innerHTML = st === "working" ? `<span data-spin>${reduced ? "●" : "⠋"}</span>` : badges[st];
    gui!.querySelector<HTMLElement>(`[data-g="${st}"] [data-glist]`)!.append(row);
    gui!.querySelectorAll<HTMLElement>("[data-g]").forEach((g) => {
      const n = g.querySelector("[data-glist]")!.children.length;
      g.hidden = n === 0;
      g.querySelector("[data-gcount]")!.textContent = String(n);
    });
    const status = gui!.querySelector<HTMLElement>(`[data-chat="${id}"] [data-status]`);
    if (status) { status.dataset.state = st; status.innerHTML = st === "working" ? `<span data-spin>${reduced ? "●" : "⠋"}</span> Working` : statusText[st]; }
  }

  const addLine = (id: string, kind: string, text: string) => {
    const inner = gui!.querySelector(`[data-chat="${id}"] .inner`)!;
    const d = document.createElement("div");
    d.className = `ln k-${kind}`;
    d.textContent = text;
    inner.append(d);
  };

  gui.addEventListener("click", (e) => {
    const t = e.target as Element;
    const row = t.closest<HTMLElement>("[data-gsess]");
    if (row) {
      gui.querySelectorAll("[data-gsess]").forEach((r) => r.removeAttribute("data-on"));
      row.setAttribute("data-on", "");
      gui.querySelectorAll<HTMLElement>("[data-chat]").forEach((c) => { c.hidden = c.dataset.chat !== row.dataset.gsess; });
      return;
    }
    const yes = t.closest("[data-allow]"), no = t.closest("[data-deny]");
    if (!yes && !no) return;
    gui.querySelector<HTMLElement>("[data-needs]")!.hidden = true;
    addLine("a", "s", yes ? "Allowed" : "Declined. Told the agent to try another way.");
    setState("a", "working");
    announce(yes ? "bold-puffin: allowed. It is refreshing the lockfile." : "bold-puffin: declined. It is trying another way.");
    setTimeout(() => {
      addLine("a", "a", CHATS.a.done);
      setState("a", "done");
      announce("bold-puffin finished.");
    }, 5000);
  });
}

/* ---- terminal app ---- */
const frame = document.querySelector<HTMLElement>("[data-tui]");
if (frame) {
  const S: TuiState = initialTui();
  const side = frame.querySelector<HTMLElement>("[data-tui-side]")!;
  const grid = frame.querySelector<HTMLElement>("[data-tui-panes]")!;
  const bar = frame.querySelector<HTMLElement>("[data-tui-bar]")!;
  let last = { sidebar: side.innerHTML, panes: grid.innerHTML, bar: bar.innerHTML };

  function paint() {
    const next = renderTui(S);
    if (next.sidebar !== last.sidebar) side.innerHTML = next.sidebar;
    if (next.panes !== last.panes) grid.innerHTML = next.panes;
    if (next.bar !== last.bar) bar.innerHTML = next.bar;
    last = next;
    frame!.toggleAttribute("data-zoom", S.zoom);
    if (reduced) frame!.querySelectorAll("[data-spin]").forEach((el) => { el.textContent = "●"; });
  }
  const focusFrame = () => frame.focus({ preventScroll: true });
  const answer = (v: "yes" | "no") => {
    if (S.ans) return;
    S.ans = v;
    announce(v === "yes" ? "fix-discount: allowed. It ran the tests and finished." : "fix-discount: declined.");
    paint();
  };
  const open = (id: string) => {
    const i = S.panes.indexOf(id);
    if (i >= 0) { S.focus = i; announce(`${TS[id].name} focused`); }
    else { S.panes[S.focus] = id; announce(`${TS[id].name} opened in the pane`); }
    paint();
  };

  frame.addEventListener("click", (e) => {
    const t = e.target as Element;
    const opt = t.closest<HTMLElement>("[data-ans]");
    const pane = t.closest<HTMLElement>("[data-pane]");
    if (pane) S.focus = Number(pane.dataset.pane);
    if (opt) { answer(opt.dataset.ans === "no" ? "no" : "yes"); focusFrame(); return; }
    const row = t.closest<HTMLElement>("[data-open]");
    if (row) { open(row.dataset.open!); focusFrame(); return; }
    if (pane) { paint(); focusFrame(); }
  });

  frame.addEventListener("keydown", (e) => {
    const n = S.panes.length;
    if (e.ctrlKey && (e.code === "Space" || e.key === " ")) {
      e.preventDefault();
      S.keys = !S.keys;
      announce(S.keys ? "Key mode" : "Back to the pane");
      paint();
      return;
    }
    if (e.altKey && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault();
      S.focus = (S.focus + (e.key === "ArrowDown" ? 1 : n - 1)) % n;
      paint();
      return;
    }
    if (S.keys) {
      if (e.key === "Escape") { S.keys = false; announce("Back to the pane"); }
      else if (e.key === "Tab") S.focus = (S.focus + (e.shiftKey ? n - 1 : 1)) % n;
      else if (e.key === "z") { S.zoom = !S.zoom; announce(S.zoom ? "Zoomed" : "Unzoomed"); }
      else if (/^[1-6]$/.test(e.key)) { open(ORDER[Number(e.key) - 1]); return; }
      else return;
      e.preventDefault();
      paint();
      return;
    }
    if (S.panes[S.focus] === "s1" && !S.ans) {
      if (e.key === "1" || e.key === "2" || e.key === "Enter") { e.preventDefault(); answer("yes"); }
      else if (e.key === "3") { e.preventDefault(); answer("no"); }
    }
  });

  // cart-tests cycles between working and done, and its seconds tick.
  if (!reduced) onTick(frame, () => { S.t++; if (S.t % 12 === 0 || S.t % 420 === 0 || S.t % 420 === 320) paint(); });
}
