// The three changed files in the review demo, and their diffs.
// h hunk header, space context, + added, - removed.
export interface DiffFile { path: string; add: string; del: string; diff: [string, string][] }

export const FILES: DiffFile[] = [
  { path: "pnpm-lock.yaml", add: "+412", del: "−388", diff: [["h", "@@ -1402,7 +1402,7 @@"], [" ", "  /zod@3.22.4:"], ["-", "    resolution: {integrity: sha512-iC+8Io…}"], ["+", "  /zod@3.23.8:"], ["+", "    resolution: {integrity: sha512-XBx9A…}"], [" ", "    dev: false"]] },
  { path: "package.json", add: "+1", del: "−1", diff: [["h", "@@ -18,7 +18,7 @@"], [" ", "  \"dependencies\": {"], [" ", "    \"react\": \"^19.0.0\","], ["-", "    \"zod\": \"^3.22.4\""], ["+", "    \"zod\": \"^3.23.8\""], [" ", "  }"]] },
  { path: "src/cart/total.ts", add: "+6", del: "−2", diff: [["h", "@@ -9,8 +9,12 @@ export function total(items)"], [" ", "  const sum = items.reduce("], ["-", "    (a, i) => a + i.price, 0)"], ["+", "    (a, i) => a + i.price * i.qty, 0)"], ["+", "  if (sum < 0) {"], ["+", "    throw new RangeError(\"negative total\")"], ["+", "  }"], [" ", "  return round(sum)"]] },
];

export const prefix = (k: string) => (k === "h" ? "" : k === " " ? "  " : `${k} `);
export const cls = (k: string) => ({ h: "lh", " ": "lc", "+": "la", "-": "ld" }[k] ?? "lc");
