// The hero pill and the footer show the latest release; the version stays
// hidden (the pill reads "Latest release") if GitHub's API can't be reached.
// It is the only request the page makes to anyone else.
const RELEASES = "https://api.github.com/repos/CydoEntis/maitty/releases/latest";
const CACHE_KEY = "maiker-ver";

function show(tag: string) {
  document.querySelectorAll("[data-ver]").forEach((el) => { el.textContent = tag; });
  document.querySelectorAll<HTMLElement>("[data-ver-footer]").forEach((el) => { el.hidden = false; });
}

async function latestTag(): Promise<string> {
  const res = await fetch(RELEASES, { headers: { Accept: "application/vnd.github+json" } });
  if (!res.ok) throw new Error(`GitHub said ${res.status}`);
  const rel = (await res.json()) as { tag_name?: unknown };
  if (typeof rel.tag_name !== "string") throw new Error("no tag_name in the release");
  return rel.tag_name;
}

let cached: string | null = null;
try { cached = sessionStorage.getItem(CACHE_KEY); } catch { cached = null; /* storage blocked: fetch it */ }
if (cached) show(cached);
else latestTag()
  .then((tag) => {
    try { sessionStorage.setItem(CACHE_KEY, tag); } catch { /* storage blocked: fetch again next time */ }
    show(tag);
  })
  .catch((err: Error) => console.warn("Version stays hidden:", err.message));
