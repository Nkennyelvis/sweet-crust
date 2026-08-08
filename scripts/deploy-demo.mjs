/**
 * Builds the static preview and publishes it to the `gh-pages` branch.
 *
 *   npm run demo:deploy
 *
 * Steps:
 *   1. seed the catalogue + sample orders so the admin walkthrough has content
 *   2. `next build` with DEMO_EXPORT=1 → out/
 *   3. commit out/ to `gh-pages` (via a scratch worktree, so your working tree
 *      is never touched) and push
 *
 * Cross-platform on purpose — setting DEMO_EXPORT inline in an npm script
 * doesn't work on Windows without adding a dependency.
 */
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, rmSync, writeFileSync, readdirSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "out");
const WORKTREE = path.join(ROOT, "..", ".sweet-crust-gh-pages");
const BRANCH = "gh-pages";

const run = (cmd, args, opts = {}) =>
  execFileSync(cmd, args, { stdio: "inherit", shell: process.platform === "win32", ...opts });

const capture = (cmd, args, opts = {}) =>
  execFileSync(cmd, args, { encoding: "utf8", shell: process.platform === "win32", ...opts }).trim();

console.log("\n1/3  Seeding catalogue and demo data…");
run("npx", ["tsx", "prisma/seed.ts"]);
run("npx", ["tsx", "prisma/seed-demo.ts"]);

console.log("\n2/3  Building static export…");
rmSync(OUT, { recursive: true, force: true });
run("npx", ["next", "build"], { env: { ...process.env, DEMO_EXPORT: "1" } });
if (!existsSync(path.join(OUT, "index.html"))) {
  console.error("Build produced no out/index.html — aborting.");
  process.exit(1);
}

console.log("\n3/3  Publishing to gh-pages…");
rmSync(WORKTREE, { recursive: true, force: true });
try {
  run("git", ["worktree", "remove", "--force", WORKTREE]);
} catch {
  // No stale worktree registered — fine.
}

const branchExists = (() => {
  try {
    capture("git", ["rev-parse", "--verify", BRANCH]);
    return true;
  } catch {
    return false;
  }
})();

run("git", ["worktree", "add", ...(branchExists ? [] : ["--orphan"]), "-B", BRANCH, WORKTREE]);

// Clear whatever the branch held, then drop the fresh build in its place.
for (const entry of readdirSync(WORKTREE)) {
  if (entry === ".git") continue;
  rmSync(path.join(WORKTREE, entry), { recursive: true, force: true });
}
cpSync(OUT, WORKTREE, { recursive: true });

// Without this, Pages runs Jekyll, which ignores any directory starting with
// an underscore — i.e. all of _next/, so every script and stylesheet 404s.
writeFileSync(path.join(WORKTREE, ".nojekyll"), "");

run("git", ["add", "-A"], { cwd: WORKTREE });
const dirty = capture("git", ["status", "--porcelain"], { cwd: WORKTREE });
if (dirty) {
  run("git", ["commit", "-m", `chore: publish static preview (${new Date().toISOString().slice(0, 16)})`], {
    cwd: WORKTREE,
  });
  run("git", ["push", "-u", "origin", BRANCH], { cwd: WORKTREE });
} else {
  console.log("No changes to publish.");
}

run("git", ["worktree", "remove", "--force", WORKTREE]);
console.log("\nDone → https://nkennyelvis.github.io/sweet-crust/");
