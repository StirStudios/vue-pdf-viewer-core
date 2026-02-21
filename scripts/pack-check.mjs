import { existsSync } from "node:fs";
import { execFileSync } from "node:child_process";

const MAX_TARBALL_BYTES = 900000;
const requiredDistFiles = [
  "dist/index.mjs",
  "dist/index.d.ts",
  "dist/nuxt/module.js",
  "dist/nuxt/module.d.ts",
  "dist/style.css",
];

for (const file of requiredDistFiles) {
  if (!existsSync(file)) {
    console.error(`Missing required build artifact: ${file}`);
    process.exit(1);
  }
}

const raw = execFileSync("npm", ["pack", "--dry-run", "--json"], {
  encoding: "utf8",
  env: {
    ...process.env,
    NPM_CONFIG_CACHE: process.env.NPM_CONFIG_CACHE ?? "/tmp/npm-cache",
  },
});

const parsed = JSON.parse(raw);
const packInfo = Array.isArray(parsed) ? parsed[0] : parsed;

if (!packInfo || typeof packInfo.size !== "number") {
  console.error("Unable to parse npm pack output for size checks.");
  process.exit(1);
}

if (packInfo.size > MAX_TARBALL_BYTES) {
  console.error(
    `Package tarball is too large: ${packInfo.size} bytes (limit ${MAX_TARBALL_BYTES} bytes).`,
  );
  process.exit(1);
}

console.log(`Pack check passed. Tarball size: ${packInfo.size} bytes.`);
