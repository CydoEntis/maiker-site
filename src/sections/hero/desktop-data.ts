// What each chat in the desktop demo says: u user, t tool call, s its result,
// e an error, a the agent's words. `done` is its last line when it finishes.
export type Line = ["u" | "t" | "s" | "e" | "a", string];

export interface Chat { title: string; lines: Line[]; done: string; cmd?: string; why?: string }

export const CHATS: Record<string, Chat> = {
  a: { title: "Fix the out-of-date lockfile", cmd: "pnpm install --frozen-lockfile=false", why: "Refresh pnpm-lock.yaml so CI installs cleanly",
    lines: [["u", "CI says the lockfile is stale. Fix it?"], ["t", "Bash(pnpm install --frozen-lockfile)"], ["e", "ERR_PNPM_OUTDATED_LOCKFILE"], ["t", "Read(package.json)"], ["s", "Read 48 lines"], ["a", "zod was bumped without a reinstall."]], done: "Lockfile refreshed and committed." },
  b: { title: "Retry refund webhooks", done: "Retries with backoff, 214 tests pass.",
    lines: [["u", "Retry refund webhooks with backoff."], ["t", "Read(src/webhooks/refund.rs)"], ["t", "Edit(src/webhooks/refund.rs)"], ["s", "+42 −7"], ["t", "Bash(cargo test webhooks)"], ["s", "214 passed"], ["a", "Adding an attempts column next."], ["t", "Edit(migrations/0042_attempts.sql)"]] },
  c: { title: "Rewrite the quickstart", done: "Quickstart rewritten, every sample builds.",
    lines: [["u", "Rewrite the quickstart for the new CLI."], ["t", "Read(docs/quickstart.md)"], ["t", "Edit(docs/quickstart.md)"], ["s", "+85 −83"], ["t", "Bash(npm run build)"], ["s", "Built 48 pages in 6.2s"], ["t", "Bash(npm run check-links)"], ["s", "0 broken links"]] },
  d: { title: "Profile the invoice export", done: "Export 3.1× faster.",
    lines: [["u", "Profile the invoice export."], ["t", "Bash(cargo bench export)"], ["s", "export/10k  1.84 s"], ["a", "Writes are not batched."], ["t", "Edit(src/export/writer.rs)"], ["t", "Bash(cargo bench export)"], ["s", "export/10k  0.59 s"]] },
  e: { title: "Summarise yesterday's incident", done: "Summary written to notes.md.",
    lines: [["u", "Summarise yesterday's incident."], ["t", "Read(incident-0412.log)"], ["s", "Read 1,204 lines"], ["a", "Root cause: a stale DNS cache."], ["a", "Summary written to notes.md."]] },
  f: { title: "Push notifications for orders", done: "Order pushes wired up.",
    lines: [["u", "Add push notifications for orders."], ["t", "Read(app/notifications.ts)"], ["t", "Edit(app/notifications.ts)"], ["s", "+61 −2"], ["t", "Bash(pnpm test notify)"], ["s", "12 passed"]] },
  g: { title: "Backfill skips the last day", done: "Backfill covers the full range.",
    lines: [["u", "Backfill job skips the last day."], ["t", "Read(jobs/backfill.py)"], ["a", "Off by one in the date range."], ["t", "Edit(jobs/backfill.py)"], ["t", "Bash(pytest jobs)"], ["s", "88 passed"]] },
  h: { title: "Typo-tolerant search", done: "Fuzzy search with a typo budget of 2.",
    lines: [["u", "Search should match typos."], ["t", "Read(src/search/index.ts)"], ["t", "Edit(src/search/index.ts)"], ["s", "+27 −9"], ["t", "Bash(pnpm test search)"], ["s", "31 passed"]] },
  i: { title: "Upgrade the AWS provider", done: "Provider upgraded to 5.x.",
    lines: [["u", "Upgrade the AWS provider."], ["t", "Edit(main.tf)"], ["t", "Bash(terraform validate)"], ["s", "Success! The configuration is valid."], ["a", "Provider upgraded to 5.x."]] },
};
