// The install commands are exact: do not change them.
export type Os = "win" | "nix";

export const COMMANDS: Record<Os, { tab: string; shell: string; prompt: string; cmd: string; short: string }> = {
  win: { tab: "Windows", shell: "PowerShell", prompt: "PS>", cmd: "irm https://raw.githubusercontent.com/CydoEntis/maitty/main/install.ps1 | iex", short: "irm …/maitty/main/install.ps1 | iex" },
  nix: { tab: "macOS · Linux", shell: "sh, bash or zsh", prompt: "$", cmd: "curl -fsSL https://raw.githubusercontent.com/CydoEntis/maitty/main/install.sh | sh", short: "curl -fsSL …/maitty/main/install.sh | sh" },
};

export const OSES = Object.keys(COMMANDS) as Os[];
