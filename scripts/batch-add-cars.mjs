/**
 * Reads data/cars-to-add.json and runs fetch-car-specs.mjs for each entry.
 *
 * Usage:
 *   node scripts/batch-add-cars.mjs
 *
 * Edit data/cars-to-add.json to add make/model pairs. Already-added cars
 * are skipped automatically (duplicate check in fetch-car-specs.mjs).
 * After the batch completes, run: node scripts/derive-fields.mjs
 */

import { spawnSync } from "child_process";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const listPath = join(__dirname, "../data/cars-to-add.json");
const fetchScript = join(__dirname, "fetch-car-specs.mjs");

const entries = JSON.parse(readFileSync(listPath, "utf8"));

if (!Array.isArray(entries) || entries.length === 0) {
  console.log("data/cars-to-add.json is empty — nothing to do.");
  process.exit(0);
}

console.log(`\nBatch adding ${entries.length} car(s)…\n`);

let added = 0, skipped = 0, failed = 0;

for (let i = 0; i < entries.length; i++) {
  const { make, model } = entries[i];
  if (!make || !model) {
    console.log(`[${i + 1}/${entries.length}] ⚠ Skipping invalid entry: ${JSON.stringify(entries[i])}`);
    failed++;
    continue;
  }

  console.log(`[${i + 1}/${entries.length}] ${make} ${model}`);
  console.log("─".repeat(50));

  const result = spawnSync("node", [fetchScript, make, model], {
    encoding: "utf8",
    env: process.env,
  });

  const output = (result.stdout + result.stderr).trim();
  console.log(output.split("\n").map((l) => "  " + l).join("\n"));
  console.log();

  if (result.status === 0) {
    added++;
  } else if (output.includes("already exists")) {
    skipped++;
  } else {
    failed++;
  }
}

console.log("─".repeat(50));
console.log(`Done: ${added} added, ${skipped} skipped (already exist), ${failed} failed`);
if (added > 0) {
  console.log("\nFill in the TODO fields in data/cars.json, then run:");
  console.log("  node scripts/derive-fields.mjs");
}
