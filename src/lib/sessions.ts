// The nine made-up sessions the page's demos share. Claude, Codex and Gemini
// only: those are the agents Maiker names.
export type SessionState = "working" | "needs" | "done" | "idle";

export interface Session {
  id: string;
  name: string;
  agent: "claude" | "codex" | "gemini";
  mark: string;
  project: string;
  branch: string;
  machine?: string;
  state: SessionState;
  ask: string;
}

export const SESSIONS: Session[] = [
  { id: "a", name: "bold-puffin", agent: "claude", mark: "✻", project: "acme-store", branch: "fix/lockfile", state: "needs", ask: "Allow Bash(pnpm install --frozen-lockfile=false)?" },
  { id: "b", name: "swift-otter", agent: "codex", mark: "◆", project: "billing-api", branch: "feat/refunds", state: "working", ask: "Run the migration on the local database?" },
  { id: "c", name: "calm-heron", agent: "gemini", mark: "✦", project: "docs-site", branch: "docs/quickstart", state: "working", ask: "Delete 3 pages that no longer exist?" },
  { id: "d", name: "brisk-wren", agent: "claude", mark: "✻", project: "billing-api", branch: "perf/export", machine: "build-box", state: "working", ask: "Allow Bash(cargo bench --all)?" },
  { id: "e", name: "quiet-lynx", agent: "codex", mark: "◆", project: "scratch", branch: "main", state: "done", ask: "Overwrite notes.md?" },
  { id: "f", name: "amber-finch", agent: "claude", mark: "✻", project: "mobile-app", branch: "feat/push", state: "working", ask: "Add firebase-admin to dependencies?" },
  { id: "g", name: "steady-ibis", agent: "codex", mark: "◆", project: "data-jobs", branch: "fix/backfill", machine: "build-box", state: "working", ask: "Run the backfill against staging?" },
  { id: "h", name: "keen-marten", agent: "gemini", mark: "✦", project: "web", branch: "feat/search", state: "working", ask: "Allow Edit(.github/workflows/ci.yml)?" },
  { id: "i", name: "mild-gecko", agent: "claude", mark: "✻", project: "infra", branch: "chore/tf-upgrade", state: "idle", ask: "Allow Bash(terraform plan)?" },
];

export const GLYPH: Record<SessionState, string> = { working: "⠋", needs: "!", done: "✓", idle: "○" };
export const WORD: Record<SessionState, string> = { working: "working", needs: "needs you", done: "done", idle: "idle" };
export const ORDER: Record<SessionState, number> = { needs: 0, working: 1, done: 2, idle: 3 };

export const sorted = (list: Session[]) => [...list].sort((a, b) => ORDER[a.state] - ORDER[b.state]);
