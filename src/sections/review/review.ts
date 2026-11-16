// The changes panel: pick a file to read its diff, commit, open the pull
// request. Each diff is a <template> already on the page.
import { announce } from "../../lib/announce";

const root = document.querySelector<HTMLElement>("[data-review]");
if (root) {
  const diff = root.querySelector<HTMLElement>("[data-diff]")!;
  const commit = root.querySelector<HTMLElement>("[data-commit]")!;
  const pr = root.querySelector<HTMLElement>("[data-pr]")!;

  root.querySelectorAll<HTMLElement>("[data-file]").forEach((btn) => btn.addEventListener("click", () => {
    root.querySelectorAll("[data-file]").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
    const tpl = document.querySelector<HTMLTemplateElement>(`[data-tpl="${btn.dataset.file}"]`)!;
    diff.replaceChildren(tpl.content.cloneNode(true));
    diff.setAttribute("aria-label", `Diff of ${btn.querySelector(".fp")!.textContent}`);
  }));

  const doCommit = () => { commit.textContent = "✓ Committed a41c9e2"; };
  commit.addEventListener("click", () => { doCommit(); announce("Committed 3 files"); });
  pr.addEventListener("click", () => { doCommit(); pr.textContent = "✓ PR #128 opened"; announce("Opened pull request 128"); });
}
