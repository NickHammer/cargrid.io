# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CarGrid.io is a browser game idea based on [MovieGrid.io](https://moviegrid.io/).
- You have a 3x3 grid with a unique parameter corresponding to each row and each column. With the grid being 3x3, you naturally have 9 guesses to complete the grid (100% accuracy).
- The grid is blank, until you guess the cell correctly, in which point the cell will display the image of the correct car.
- The grid changes every 24 hours and the old grid get archived. These archived grids should be repeatably playable in an archive section of the website.

## Tech Stack

- **Next.js** (App Router) — primary framework, keep server usage minimal
- **React** — UI components
- **Local Storage** — user identifier, guesses, score history (no DB required initially)
- **Postgres** (optional, future) — add only if persistent server-side stats become necessary

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Lint
npm run lint

# Re-derive `decades` and `power_output_ranges` in data/cars.json
node scripts/derive-fields.mjs

# Generate a car entry template from NHTSA (Node 18+)
node scripts/fetch-car-specs.mjs "<make>" "<model>"
```

## Grid Parameters

13 confirmed parameters (Racing Heritage removed), drawn from a pool to construct each daily grid.

**Tier 1 — Identity/Attribute (high value)**
- Brand/Make, Country of Origin, Decade, Engine Layout, Body Style, Drivetrain

**Tier 2 — Good**
- Car Class, Power Output, Transmission, Fuel Type

**Tier 3 — Use sparingly**
- Pop Culture, Price at Launch, Manufacturer Still Active

### Parameter Design Rules
- Brand CAN appear on both row and column axes — rebadged cars can satisfy two brand parameters simultaneously; a car record supports multiple brands.
- Car Class definitions are kept as strict as possible; each car has an explicit, curated class tag — not inferred.
- One axis should generally favor identity-based parameters (Brand, Country, Decade) and the other attribute-based (Engine, Body Style, Class), but this is a soft guideline.
- A grid entry is **Make + Model** (e.g., "Ford Mustang") — no year, trim, or edition required when guessing. When multiple generations exist in the dataset, autocomplete disambiguates: "Subaru Crosstrek (Gen 2 · 2018–2023)".
- Each generation is a **separate entry** with its own ID (`subaru-crosstrek-g2`) and specs scoped to that generation's **launch specs only**.
- IDs always include the generation suffix (`-g1`, `-g2`, etc.) even if only one generation exists in the dataset.
- Decades, Engine Layout, Drivetrain, Transmission, and Fuel Type are **multi-value** — a car qualifies for all options it was offered with at release.
- Power Output uses **100hp buckets**: `0-100`, `101-200`, `201-300`, `301-400`, `401-500`, `501-600`, `601-700`, `701-800`, `801-900`, `901-1000`, `1000+`. A car with multiple engine options spans multiple buckets.

## Car Data Schema

```typescript
interface Car {
  id: string;                       // slug — "ford-mustang-g1", "subaru-crosstrek-g3"
  make: string;                     // "Ford"
  model: string;                    // "Mustang"
  generation: number;               // 1, 2, 3 — always included, even if only one gen exists in dataset
  brands: string[];                 // ["Ford"] or ["Subaru", "Chevrolet"] for rebadges
  country_of_origin: string;        // "American" | "German" | "Japanese" | "Italian" | "British" | ...
  production_start: number;         // first gen start year — 1964
  production_end: number | null;    // first gen end year — 1973, or null if still running
  decades: string[];                // ["1960s", "1970s"] — derived from production years, stored for lookup
  engine_layouts: string[];         // ["V8", "Inline-6"] — all options offered at release
  body_style: string;               // "Coupe" — single value
  drivetrain: string[];             // ["RWD"] or ["RWD", "AWD"] if multiple offered
  car_class: string;                // "Muscle Car" — strict, curated, single value
  power_output_hp_min: number;      // weakest engine option at release
  power_output_hp_max: number;      // strongest engine option at release
  power_output_ranges: string[];    // ["101-200", "301-400"] — derived, stored for lookup
  transmission: string[];           // ["Manual", "Automatic"]
  fuel_type: string[];              // ["Gasoline"] or ["Gasoline", "Hybrid"]
  pop_culture: string[] | null;     // ["Bullitt", "Gone in 60 Seconds"]
  price_at_launch_usd: number | null;
  manufacturer_still_active: boolean;
  image_url: string;                // one canonical image per car entry
}
```

### Parameter Matching Logic

| Parameter | Match |
|---|---|
| Brand | `car.brands.includes(param)` |
| Country of Origin | `car.country_of_origin === param` |
| Decade | `car.decades.includes(param)` |
| Engine Layout | `car.engine_layouts.includes(param)` |
| Body Style | `car.body_style === param` |
| Drivetrain | `car.drivetrain.includes(param)` |
| Car Class | `car.car_class === param` |
| Power Output | `car.power_output_ranges.includes(param)` |
| Transmission | `car.transmission.includes(param)` |
| Fuel Type | `car.fuel_type.includes(param)` |
| Pop Culture | `car.pop_culture?.includes(param)` |
| Price at Launch | range check against `price_at_launch_usd` |
| Manufacturer Still Active | boolean match |

## Car Dataset

### Storage
`data/cars.json` — flat JSON array of `Car` objects. Loaded client-side; no DB required initially.

### Scripts
```bash
# Fetch raw specs for a make/model from Car Query API (Node 18+)
node scripts/fetch-car-specs.mjs ford mustang

# Re-derive `decades` and `power_output_ranges` for all cars after editing hp or production years
node scripts/derive-fields.mjs
```

### Curation Workflow
1. Run `fetch-car-specs.mjs` — fills in drivetrain, transmission, fuel type, body style, HP from Car Query API
2. Manually fill in `TODO` fields: engine_layout config (V/Inline/Flat), car_class, pop_culture, price, image_url
3. Set `production_end` to the **first generation** end year (not the nameplate's final year)
4. Run `derive-fields.mjs` to recompute `decades` and `power_output_ranges`

### Curation Rules
- HP figures pre-1972 are gross ratings (engine on stand); post-1972 are net (SAE). Use whichever figure is commonly cited in enthusiast references for consistency.
- `body_style` is a single value — pick the primary/most iconic body for that model (e.g., Mustang → Coupe, not Fastback or Convertible)
- `manufacturer_still_active` refers to the **brand**, not the specific model

### `car_class` Enum (frozen)

**Performance**
- `Muscle Car` — American, large engine, affordable, straight-line focus
- `Sports Car` — handling-focused, typically 2-seat or 2+2
- `Supercar` — exotic manufacturer OR mainstream halo car with 500+ hp as tiebreaker
- `Hypercar` — beyond supercar tier (Bugatti, Koenigsegg, Pagani, Rimac)
- `Hot Hatch` — performance hatchback (GTI, Type R, 205 GTI)

**Utility**
- `SUV` — absorbs crossovers; unibody or body-on-frame mainstream utility
- `Off-Road` — purpose-built serious off-road capability (Wrangler, Defender, FJ40)
- `Pickup Truck` — truck bed

**Body-type defaults** (for anything not covered above)
- `Sedan` — all sedans regardless of price point, luxury level, or sport intent
- `Coupe` — absorbs Gran Turismo (DB5, Continental GT, Ferrari 456 all land here)
- `Hatchback` — non-performance hatchbacks
- `Wagon` — estates; shooting brakes deferred here for now
- `Minivan` — people carriers

**Boundary decisions**
- Muscle Car must be American — a Japanese or European performance coupe is Sports Car regardless of engine size
- Sports Car vs Supercar: exotic manufacturer = Supercar by default; use 500+ hp as tiebreaker for ambiguous cases
- Dodge Viper → Supercar (purpose-built exotic despite being American)
- Chevrolet Corvette C1 (1953 first gen) → Sports Car (no V8 at launch, not straight-line focused)
- BMW M3 E30 → Sports Car. BMW 3 Series base → Sedan
- Golf GTI → Hot Hatch. Golf base → Hatchback
- Jeep Wrangler → Off-Road. Jeep Grand Cherokee → SUV
- GT/touring cars (Aston Martin DB series, Bentley Continental GT) → Coupe

### Image Strategy
Manually curate one canonical image per car. Host in `/public/cars/`. Prefer Creative Commons or licensed stock; do not scrape automaker or auction sites.

## Architecture

The app is intentionally lightweight and mostly client-side:

- **Grid logic** — a 3x3 grid with a row parameter and column parameter per axis; players guess which car satisfies both parameters for a cell
- **Daily rotation** — grid changes every 24 hours; past grids are archived and replayable
- **State persistence** — user ID (UUID), guesses, and score history stored in `localStorage`; no login required
- **Server usage** — limit to heavier calculations (e.g., end-of-game stats aggregation); avoid server round-trips for core gameplay
