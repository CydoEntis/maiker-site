// The OS tabs and every copy button (the hero's and the install block's). The
// chosen OS lives on <html data-os>, so both always agree. The hero's download
// button names the visitor's OS, which boot.js worked out.
import { announce } from "../../lib/announce";
import { COMMANDS, type Os } from "./commands";

const COPIED_MS = 2000;
const root = document.documentElement;
const isMac = /mac/i.test((navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform || navigator.platform || "");
const COPY_KEY = isMac ? "⌘C" : "Ctrl+C";

const currentOs = (): Os => (root.dataset.os === "nix" ? "nix" : "win");
const text = (sel: string, value: string) => document.querySelectorAll(sel).forEach((el) => { el.textContent = value; });

function sync() {
  const os = currentOs(), c = COMMANDS[os];
  document.querySelectorAll<HTMLElement>("[data-os-tab]").forEach((t) => {
    const on = t.dataset.osTab === os;
    t.setAttribute("aria-selected", String(on));
    t.style.opacity = on ? "1" : ".7";
    t.style.borderColor = on ? "currentColor" : "transparent";
  });
  text("[data-cmd-prompt]", c.prompt);
  text("[data-cmd-short]", c.short);
  text("[data-cmd]", c.cmd);
  text("[data-shell]", c.shell);
  document.querySelectorAll("[data-cmd-block]").forEach((el) => el.setAttribute("aria-label", `Install command for ${c.shell}`));
  document.querySelectorAll("[data-copy]").forEach((el) => el.setAttribute("aria-label", `Copy the install command: ${c.cmd}`));
}

function copyWithSelection(value: string): boolean {
  const ta = document.createElement("textarea");
  ta.value = value;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  let ok = false;
  try { ok = document.execCommand("copy"); } catch { ok = false; /* the label tells the visitor to copy by hand */ }
  ta.remove();
  return ok;
}

async function copy(value: string): Promise<boolean> {
  if (!navigator.clipboard || !window.isSecureContext) return copyWithSelection(value);
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return copyWithSelection(value);
  }
}

let resetTimer: number | undefined;
function showCopied(ok: boolean) {
  text("[data-copy-label]", ok ? "Copied ✓" : `Press ${COPY_KEY}`);
  announce(ok ? "Install command copied" : `Copy failed. Select the command and press ${COPY_KEY}.`);
  window.clearTimeout(resetTimer);
  resetTimer = window.setTimeout(() => text("[data-copy-label]", "Copy"), COPIED_MS);
}

document.addEventListener("click", (e) => {
  const target = e.target as Element;
  const tab = target.closest<HTMLElement>("[data-os-tab]");
  if (tab) { root.dataset.os = tab.dataset.osTab === "nix" ? "nix" : "win"; sync(); text("[data-copy-label]", "Copy"); }
  if (target.closest("[data-copy]")) copy(COMMANDS[currentOs()].cmd).then(showCopied);
});

text("[data-dl]", `Download for ${root.dataset.osName || "your computer"}`);
sync();
