// The terminal demo's data and renderer. The page builds the first frame with
// it at build time; the script calls it again to repaint after a click or key.
// The agent screens are the frames the real terminal app draws.
export type TState = "needs" | "working" | "done" | "idle";

export interface TSession { name: string; mark: string; agent: string; project: string; branch: string; proj: string; machine?: string }

export const TS: Record<string, TSession> = {
  s1: { name: "fix-discount", mark: "✻", agent: "claude", project: "acme-store", branch: "fix/discount", proj: "var(--t-blue)" },
  s2: { name: "cart-tests", mark: "◆", agent: "codex", project: "acme-store", branch: "test/cart", proj: "var(--t-blue)" },
  s3: { name: "rate-limit", mark: "✦", agent: "gemini", project: "gateway", branch: "feat/rate-limit", proj: "var(--t-pink)" },
  s4: { name: "ship-email", mark: "◆", agent: "codex", project: "acme-store", branch: "feat/ship-mail", proj: "var(--t-blue)" },
  s5: { name: "scratch", mark: ">_", agent: "shell", project: "scratch", branch: "", proj: "var(--t-green)" },
  s6: { name: "quickstart", mark: "✻", agent: "claude", project: "docs-site", branch: "docs/quickstart", proj: "var(--t-cyan)", machine: "build-box" },
};
export const ORDER = ["s1", "s2", "s3", "s4", "s5", "s6"];

export interface TuiState { panes: string[]; focus: number; keys: boolean; zoom: boolean; ans: null | "yes" | "no"; t: number }
export const initialTui = (): TuiState => ({ panes: ["s2", "s3", "s1"], focus: 2, keys: false, zoom: false, ans: null, t: 0 });

export function tState(id: string, S: TuiState): TState {
  if (id === "s1") return S.ans ? "done" : "needs";
  if (id === "s2") return S.t % 420 < 320 ? "working" : "done";
  if (id === "s4") return "working";
  if (id === "s5") return "idle";
  return "done";
}

const E = "\x1b[", D = E + "2m", B = E + "1m", R = E + "31m", G = E + "32m", Y = E + "33m", BL = E + "34m", M = E + "35m", CY = E + "36m", O = E + "0m";

function screen(id: string, S: TuiState): string {
  const sec = Math.floor(S.t * 0.08);
  if (id === "s1") {
    const head = [`${D}>${O} discount codes don't change the total`, "", `● ${B}Read${O}(src/checkout/total.ts)`, "  ⎿  Read 64 lines", `● ${B}Update${O}(src/checkout/total.ts)`, "  ⎿  5 additions, 1 removal", `     ${R}26 - return subtotal + shipping;${O}`, `     ${G}26 + const off = discount(code);${O}`, `     ${G}27 + return subtotal - off + ship;${O}`, "", "● Now the tests, to be sure.", ""];
    if (S.ans === "yes") return head.concat([`● ${B}Bash${O}(pnpm test)`, "  ⎿  32 passed", "", "● Discount codes change the total now,", "  and every checkout test passes.", "", `${D}>${O} `]).join("\r\n");
    if (S.ans === "no") return head.concat([`${D}  ⎿  You said no, so I won't run them.${O}`, "", "● The fix is in total.ts, lines 26-27.", "", `${D}>${O} `]).join("\r\n");
    return head.concat([`${BL}${"─".repeat(40)}${O}`, ` ${B}${BL}Bash command${O}`, "   pnpm test", `   ${D}Run the checkout tests${O}`, "", ` ${B}Allow Bash(pnpm test)?${O}`, ` ${BL}❯ 1. Yes${O}`, "   2. Yes, don't ask again", "   3. No, tell Claude what to do"]).join("\r\n");
  }
  if (id === "s2") {
    if (tState("s2", S) === "done") return [`${D}› ${O}${B}cover the cart total with tests${O}`, "", `${G}• ${O}Ran ${BL}pnpm vitest run cart${O}`, `${D}  └ 15 passed${O}`, "", `${G}• ${O}Done. Empty carts total 0 now.`, "", `${D}Worked for 1m 12s${O}`, "", `› ${D}Ask Codex to do anything${O}`].join("\r\n");
    const s = 41 + Math.floor((S.t % 420) * 0.08);
    return [`${D}› ${O}${B}cover the cart total with tests${O}`, "", `${G}• ${O}${B}Explored${O}`, `${D}  └ ${O}Read ${CY}src/cart/total.ts${O}`, "", `${G}• ${O}${B}Edit ${O}${CY}src/cart/total.test.ts${O}`, `${G}  + it("totals an empty cart", () =>${O}`, `${G}  +   expect(total([])).toBe(0));${O}`, "", `${G}• ${O}Ran ${BL}pnpm vitest run cart${O}`, `${D}  └ 14 passed, 1 failed${O}`, "", `${Y}• ${O}Empty carts give undefined;`, "  fixing the reducer's start.", "", `${D}◦ Working (${s}s · esc to interrupt)${O}`].join("\r\n");
  }
  if (id === "s3") return [`${M}> ${O}add a per-key rate limit`, "", `${G}✓ ${O}${B}WriteFile${O} src/limit/bucket.go`, `${G}✓ ${O}${B}Edit${O} src/proxy.go`, `${G}✓ ${O}${B}Shell${O} go test ./... ${D}(ok)${O}`, "", `${M}✦ ${O}Each key gets 100 requests a`, "  minute, then a 429 with", "  Retry-After."].join("\r\n");
  if (id === "s4") return [`${D}› ${O}${B}email the buyer when it ships${O}`, "", `${G}• ${O}${B}Edit ${O}${CY}src/orders/events.ts${O}`, `${G}  + on("shipped", sendShippedMail);${O}`, `${G}• ${O}${B}Add ${O}${CY}emails/shipped.tsx${O}`, "", `${D}◦ Working (${12 + sec}s · esc to interrupt)${O}`].join("\r\n");
  if (id === "s5") return [`${D}~/code/scratch${O}`, `${G}❯${O} git status --short`, ` M notes.md`, `${G}❯${O} `].join("\r\n");
  return [`${D}>${O} write a quickstart page`, "", `● ${B}Write${O}(docs/quickstart.md)`, "  ⎿  Wrote 48 lines", "", "● It covers install, a first order", "  and the test card.", "", `${D}>${O} `].join("\r\n");
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const SGR: Record<string, string> = { "2": "var(--t-dim)", "31": "var(--t-red)", "32": "var(--t-green)", "33": "var(--t-yellow)", "34": "var(--t-blue)", "35": "var(--t-mag)", "36": "var(--t-cyan)" };

function lineHtml(line: string): { html: string; text: string } {
  let html = "", text = "", c = "var(--t-text)", w = "400", last = 0, m: RegExpExecArray | null;
  const re = /\x1b\[(\d+)m/g;
  const push = (t: string) => { if (t) { html += `<span style="color:${c};font-weight:${w}">${esc(t)}</span>`; text += t; } };
  while ((m = re.exec(line))) {
    push(line.slice(last, m.index));
    const k = m[1];
    if (k === "0") { c = "var(--t-text)"; w = "400"; }
    else if (k === "1") { w = "700"; if (c === "var(--t-text)") c = "var(--t-strong)"; }
    else c = SGR[k] ?? c;
    last = re.lastIndex;
  }
  push(line.slice(last));
  return { html: html || " ", text };
}

const mark = (st: TState) => (st === "working" ? `<span data-spin>⠋</span>` : "●");
const label = (st: TState) => (st === "needs" ? "needs you" : st);

export function renderTui(S: TuiState): { sidebar: string; panes: string; bar: string } {
  const focusId = S.panes[S.focus];
  const row = (id: string) => {
    const s = TS[id], st = tState(id, S);
    return `<button type="button" class="tr" data-open="${id}" data-st="${st}"${id === focusId ? " data-on" : ""} aria-label="${s.name}, ${label(st)}"><span class="tr1"><span class="tmk">${mark(st)}</span> <b${st === "idle" ? ' class="idle"' : ""}>${s.name}</b> <span class="tdim">${esc(s.mark)}</span></span><span class="tr2"><span style="color:${s.proj}">■</span> ${s.project} <span class="tviolet">${s.branch}</span></span></button>`;
  };
  const here = ORDER.filter((id) => !TS[id].machine), away = ORDER.filter((id) => TS[id].machine);
  const mach = (name: string, ids: string[], plus: boolean) => `<div class="tm"><div class="tmh"><span class="chip sel">${name} ${ids.length}</span>${plus ? '<span class="chip acc">+</span>' : ""}<span class="tdone" style="margin-left:auto">●</span></div>${ids.map(row).join("")}</div>`;
  const sidebar = `<span class="chip sel b" style="top:-10px;left:10px">maitty</span><span class="chip sel d" style="top:-10px;right:10px">«</span>${mach("This computer", here, true)}${mach("build-box", away, false)}<span class="chip sel t" style="bottom:-10px;left:10px">v0.77.0</span><span class="chip sel t" style="bottom:-10px;right:10px">menu</span>`;

  const hot = S.keys ? "var(--t-keys)" : "var(--t-accent)";
  const panes = S.panes.map((id, i) => {
    const s = TS[id], st = tState(id, S), on = i === S.focus;
    const stCol = `var(--t-${st === "idle" ? "dim" : st === "working" ? "work" : st})`;
    const lines = screen(id, S).split("\r\n").map((l) => {
      const { html, text } = lineHtml(l);
      const opt = id === "s1" && !S.ans && /^\s*(❯ )?[123]\. /.test(text);
      return opt ? `<div class="ln opt" data-ans="${/3\./.test(text) ? "no" : "yes"}">${html}</div>` : `<div class="ln">${html}</div>`;
    }).join("");
    return `<div class="tp" data-pane="${i}" data-i="${i}"${on ? " data-on" : ""} style="border-color:${on ? hot : "var(--t-line)"}"><span class="chip b" style="top:-10px;left:10px;background:${on ? hot : "var(--t-sel)"};color:${on ? "var(--t-on)" : stCol}">${mark(st)} ${s.name}</span><span class="chip sel d" style="top:-10px;right:10px">×</span><div class="screen">${lines}</div><span class="chip bg d" style="bottom:-10px;left:10px">${s.project}${s.machine ? " · " + s.machine : ""}</span><span class="chip bg v" style="bottom:-10px;right:10px">${s.branch || "—"}</span></div>`;
  }).join("");

  const ask = focusId === "s1" && !S.ans;
  const keys = S.keys
    ? [["tab", "pane"], ["z", "zoom"], ["1–6", "session"], ["esc", "back"]]
    : [...(ask ? [["1", "answer yes"]] : []), ["^space", "keys"], ["alt+↓/alt+↑", "sessions"]];
  const bar = `<span class="chip b" style="background:${hot};color:var(--t-on)">${S.keys ? "KEYS" : "PANE"}</span><span class="keys">${keys.map(([k, w]) => `<span><b>${k}</b> <span class="tdim">${w}</span></span>`).join("")}</span>`;
  return { sidebar, panes, bar };
}
