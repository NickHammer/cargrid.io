/**
 * Validates a make/model against the NHTSA vehicle database and generates
 * a car record template with all fields pre-structured and TODO-marked.
 *
 * Spec data (HP, engine layout, etc.) must be manually researched from
 * Wikipedia, manufacturer spec sheets, or enthusiast references.
 *
 * Requires Node 18+ (built-in fetch).
 *
 * Usage:
 *   node scripts/fetch-car-specs.mjs "<make>" "<model>"
 *
 * Examples:
 *   node scripts/fetch-car-specs.mjs "subaru" "crosstrek"
 *   node scripts/fetch-car-specs.mjs "ford" "mustang"
 */

import { deriveDecades, derivePowerRanges } from "./derive-fields.mjs";

const [, , make, model] = process.argv;

if (!make || !model) {
  console.error('Usage: node scripts/fetch-car-specs.mjs "<make>" "<model>"');
  process.exit(1);
}

const NHTSA = "https://vpic.nhtsa.dot.gov/api/vehicles";

// Confirm make exists
const makesRes = await fetch(`${NHTSA}/getallmakes?format=json`);
const makesData = await makesRes.json();
const matchedMake = makesData.Results.find(
  (m) => m.Make_Name.toLowerCase() === make.toLowerCase()
);

if (!matchedMake) {
  console.error(`Make "${make}" not found in NHTSA database. Check spelling.`);
  process.exit(1);
}

// Confirm model exists under that make
const modelsRes = await fetch(
  `${NHTSA}/GetModelsForMake/${encodeURIComponent(matchedMake.Make_Name)}?format=json`
);
const modelsData = await modelsRes.json();
const matchedModel = modelsData.Results.find(
  (m) => m.Model_Name.toLowerCase() === model.toLowerCase()
);

if (!matchedModel) {
  const similar = modelsData.Results
    .filter((m) => m.Model_Name.toLowerCase().includes(model.toLowerCase()))
    .map((m) => m.Model_Name);
  console.error(`Model "${model}" not found under ${matchedMake.Make_Name}.`);
  if (similar.length) console.error(`Did you mean: ${similar.join(", ")}?`);
  process.exit(1);
}

const canonicalMake = matchedMake.Make_Name
  .split(" ")
  .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
  .join(" ");
const canonicalModel = matchedModel.Model_Name;
const slug = `${canonicalMake}-${canonicalModel}`.toLowerCase().replace(/\s+/g, "-");

console.log(`\n✓ Confirmed: ${canonicalMake} ${canonicalModel} (NHTSA ID: ${matchedModel.Model_ID})\n`);
console.log("// ---- Paste into data/cars.json and fill in all TODO fields ----");
console.log("// Spec reference: Wikipedia first gen specs, manufacturer press kits, or");
console.log("// enthusiast databases (motortrend.com, car and driver archives)\n");

const template = {
  id: `${slug}-g1`,
  make: canonicalMake,
  model: canonicalModel,
  generation: "TODO — integer (1, 2, 3, ...)",
  brands: [`TODO — ["${canonicalMake}"] or add rebadge brands`],
  country_of_origin: "TODO — American | German | Japanese | Italian | British | French | Swedish | Korean | ...",
  production_start: "TODO — first gen start year (integer)",
  production_end: "TODO — first gen end year (integer), or null if still in first gen",
  decades: ["TODO — run derive-fields.mjs after setting production years"],
  engine_layouts: ["TODO — V8 | V12 | V10 | V6 | Inline-6 | Inline-4 | Flat-6 | Flat-4 | Rotary | Electric | ..."],
  body_style: "TODO — Sedan | Coupe | Convertible | Hatchback | Wagon | SUV | Pickup Truck | Minivan",
  drivetrain: ["TODO — RWD | FWD | AWD | 4WD (array — include all offered options)"],
  car_class: "TODO — Muscle Car | Sports Car | Supercar | Hypercar | Hot Hatch | SUV | Off-Road | Pickup Truck | Sedan | Coupe | Hatchback | Wagon | Minivan",
  power_output_hp_min: "TODO — integer, weakest engine option at first gen launch",
  power_output_hp_max: "TODO — integer, strongest engine option at first gen launch",
  power_output_ranges: ["TODO — run derive-fields.mjs after setting hp values"],
  transmission: ["TODO — Manual | Automatic | CVT (array — include all offered options)"],
  fuel_type: ["TODO — Gasoline | Diesel | Electric | Hybrid | Plug-in Hybrid (array)"],
  pop_culture: "TODO — array of movie/TV/game titles, or null",
  price_at_launch_usd: "TODO — integer, nominal USD at first gen launch, or null",
  manufacturer_still_active: "TODO — boolean, is the brand still producing cars?",
  image_url: "",
};

console.log(JSON.stringify(template, null, 2));
