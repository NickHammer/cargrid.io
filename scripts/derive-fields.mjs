/**
 * Utility functions to derive computed fields on car records.
 * Run against cars.json after updating production_start, production_end,
 * power_output_hp_min, or power_output_hp_max.
 *
 * Usage: node scripts/derive-fields.mjs
 * Overwrites data/cars.json in place with updated derived fields.
 */

import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const carsPath = join(__dirname, "../data/cars.json");

const POWER_BUCKETS = [
  [0, 100],
  [101, 200],
  [201, 300],
  [301, 400],
  [401, 500],
  [501, 600],
  [601, 700],
  [701, 800],
  [801, 900],
  [901, 1000],
];

export function deriveDecades(start, end) {
  const endYear = end ?? new Date().getFullYear();
  const decades = new Set();
  for (let year = start; year <= endYear; year++) {
    decades.add(`${Math.floor(year / 10) * 10}s`);
  }
  return Array.from(decades).sort();
}

export function derivePowerRanges(min, max) {
  const ranges = [];
  for (const [low, high] of POWER_BUCKETS) {
    if (min <= high && max >= low) ranges.push(`${low}-${high}`);
  }
  if (max > 1000) ranges.push("1000+");
  return ranges;
}

// Run as a script to update cars.json in place
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const cars = JSON.parse(readFileSync(carsPath, "utf8"));

  const updated = cars.map((car) => ({
    ...car,
    decades: deriveDecades(car.production_start, car.production_end),
    power_output_ranges: derivePowerRanges(
      car.power_output_hp_min,
      car.power_output_hp_max
    ),
  }));

  writeFileSync(carsPath, JSON.stringify(updated, null, 2));
  console.log(`Updated derived fields for ${updated.length} cars.`);
}
