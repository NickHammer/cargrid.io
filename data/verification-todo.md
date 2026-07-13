# Verification queue — bulk curation pass (2026-07-13)

All 147 cars were filled from model knowledge in the bulk pass. Entries below
were flagged as less certain and should be checked against Wikipedia/enthusiast
references before grids using them go live. Everything not listed here was
high-confidence.

## Nameplate/generation judgment calls (decide, then verify specs)

- **ford-maverick-g1** — treated as the 2022+ compact pickup, NOT the 1970–77 compact car. If the game wants the classic Maverick, this entry needs replacing.
- **dodge-dart-g1** — treated as the 2013–16 compact, NOT the 1960s Dart. Same decision as Maverick.
- **rolls-royce-phantom-g1** — treated as the 2003 BMW-era Phantom VII, not the 1925 Phantom I.
- **aston-martin-vantage-g1** — treated as the 2005 standalone V8 Vantage (earlier Vantages were trim levels).
- **ford-f-150-g1** — F-150 nameplate began 1975 (mid sixth-gen F-Series); F-250/F-350 dated to their 1953 naming. Inconsistent gen-numbering philosophy across the F-Series — revisit.
- **mercedes-benz-e-class-g1** — treated W124 (1984) as g1 though the "E-Class" name arrived with the 1993 facelift.
- **bmw-m5-g1** — E28 M5 (1984–88), not the E34 the EPA data suggested.
- **chevrolet-impala-g1** — 1958 was a one-year generation (Bel Air Impala); verify treatment.
- **chevrolet-malibu-g1** — classed as Muscle Car via Chevelle SS association; base Malibus were ordinary. Body set to Coupe. Debatable both ways.

## Global-vs-US launch years used (verify intent)

- toyota-prius-g1 (1997 JP, not 2001 US), toyota-yaris-g1 (1999 global), honda-fit-g1 (2001 JP), audi-a3-g1 (1996 EU — never sold in US), chevrolet-cruze-g1 (2008 global), chevrolet-trax-g1 (2013 global), nissan-kicks-g1 (2016 global; US 2018 — end year set 2024 per US)

## Spec figures to double-check (HP, years, options)

- toyota-crown-g1 — 1955 Toyopet Crown, 48 hp; obscure, verify everything
- toyota-land-cruiser-g1 — 1951–55 BJ, 85 hp Type B inline-6
- toyota-yaris-g1 hp 68–106; toyota-c-hr-g1 hp 144; toyota-prius-g1 system hp 70
- honda-cr-v-g1 hp 126; honda-accord-g1 body Hatchback (sedan added 1979)
- honda-passport-g1 — Isuzu Rodeo rebadge; consider brands: ["Honda","Isuzu"]
- ford f-150/f-250/f-350 hp ranges (mid-'70s net / early-'50s gross figures approximate)
- ford-transit-g1 hp 43–85 (UK V4); body/class forced into Minivan (no Van enum value)
- ford-taurus-g1 — Manual included via rare MT-5 trim
- chevrolet-suburban-g1 — 1935 Carryall, hp ~60–85 approximate
- chevrolet-blazer-g1 — K5 gross hp 155–255
- chevrolet-silverado-g1 — launch diesel availability (fuel set Gasoline only)
- chevrolet-express-g1 — body/class forced into Minivan (full-size van)
- dodge-charger-g1 — gross hp 230–425 (318 base to 426 Hemi)
- subaru-impreza-g1 hp 110–240 includes JDM WRX; legacy-g1 160 turbo; forester-g1 165
- porsche-macan-g1 — production_end left null (ICE Macan wound down ~2024)
- nissan-frontier-g1 hp 143–170; nissan-maxima-g1 — sold as Datsun initially (brands?)
- bmw-m6-g1 hp 256 (US) – 286 (EU); bmw-x1-g1 143–258 global range; bmw-i3-g1 — REx range extender ignored (fuel Electric only)
- audi-a4/a6/a8-g1 — US-market hp used; European base engines were weaker
- audi-q7-g1 start 2006 (production late 2005)
- mercedes-benz-s-class-g1 hp 160–225 DIN; g-class-g1 72–156
- mercedes-benz-amg-gt-g1 — classed Sports Car (GT S hits 503 hp; Supercar arguable)
- acura-nsx-g1 — classed Sports Car per strict rules (mainstream brand, <500 hp); sold as Honda NSX elsewhere (brands?)
- jaguar-f-type-g1 — body Convertible (launch body; coupe came 2014)
- tesla-model-s-g1 hp 302–416 launch range; still in production (end null)
- pagani-huayra-g1 720 hp (730 PS); production years 2012–2018
- lincoln-continental-g1 — 1939–48, V12, body Coupe (also cabriolet)
- mazda-rx-7-g1 hp 100–115 (12A rotary)

## Non-enum engine layout values introduced

`Inline-5` (Colorado), `Inline-3` (i8), `V4` (Transit), `W16` (Chiron) — schema
comment says the list is open-ended, but grid parameters should only use
layouts with enough coverage.
