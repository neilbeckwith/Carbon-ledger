/** 2026 carbon books for the live ledger.
 *
 * Headlines are the Global Carbon Budget 2026 preliminary release
 * (10 Nov 2026). Anything marked split, residual, held, or rounded
 * is a display partition — not an extra measurement.
 */

export const CO2_PER_C = 44 / 12;
/** 1 ppm = 2.124 Gt C. Ballantyne et al. 2012; Friedlingstein et al. 2026, Table 1. */
export const GTC_PER_PPM = 2.124;

export const YEAR_START = Date.UTC(2026, 0, 1);
export const YEAR_END = Date.UTC(2027, 0, 1);
export const YEAR_MS = YEAR_END - YEAR_START;

/** Stable instant used for the server render. The clock takes over after mount. */
export const PREVIEW_MS = Date.UTC(2026, 10, 16, 18, 56, 0);

export const FOSSIL_GTCO2 = 38.2;
export const OIL_GTCO2 = 12.6;
/** About 2% of fossil CO₂ after the cement carbonation sink. */
export const CEMENT_GTCO2 = FOSSIL_GTCO2 * 0.02;
const COAL_GAS_GTCO2 = FOSSIL_GTCO2 - OIL_GTCO2 - CEMENT_GTCO2;
/** Recent coal:gas split of the residual. Not a separate headline. */
export const COAL_GTCO2 = COAL_GAS_GTCO2 * 0.65;
export const GAS_GTCO2 = COAL_GAS_GTCO2 * 0.35;

export const LUC_GTCO2 = 5.1;
export const DEFOREST_GTCO2 = 3.4;
export const PEAT_GTCO2 = 1.2;
export const AG_LOSS_GTCO2 = LUC_GTCO2 - DEFOREST_GTCO2 - PEAT_GTCO2;

export const GROWTH_PPM = 2.2;
export const GLOBAL_MEAN_2026 = 427.7;
export const PREINDUSTRIAL_PPM = 278;

export const AIRBORNE_GTC = GROWTH_PPM * GTC_PER_PPM;
export const AIRBORNE_GTCO2 = AIRBORNE_GTC * CO2_PER_C;

/** 2025 ocean sink, held for 2026 — the new budget has not split it out yet. */
export const OCEAN_GTC = 3.2;
export const OCEAN_GTCO2 = OCEAN_GTC * CO2_PER_C;

export const LAND_GTCO2 = FOSSIL_GTCO2 + LUC_GTCO2 - AIRBORNE_GTCO2 - OCEAN_GTCO2;
export const LAND_GTC = LAND_GTCO2 / CO2_PER_C;

/** Realized cropland and agroforestry soil-carbon gain. Slice of the land residual. */
export const AG_DRAW_GTC = 0.15;
export const AG_DRAW_GTCO2 = AG_DRAW_GTC * CO2_PER_C;
export const AG_DRAW_LOW_GTC = 0.05;
export const AG_DRAW_HIGH_GTC = 0.4;

export const ECO_GTCO2 = LAND_GTCO2 - AG_DRAW_GTCO2;
export const ECO_VEG_SHARE = 0.7;
export const ECO_VEG_GTCO2 = ECO_GTCO2 * ECO_VEG_SHARE;
export const ECO_SOIL_GTCO2 = ECO_GTCO2 * (1 - ECO_VEG_SHARE);

export const MAUNA_ANCHOR_MS = Date.UTC(2026, 10, 14);
export const MAUNA_ANCHOR_PPM = 428.69;

export const SOURCES_GTCO2 = FOSSIL_GTCO2 + LUC_GTCO2;

export type NodeId = "veg" | "soil" | "ag" | "atm" | "surf" | "deep" | "geo";
export type Kind = "biological" | "physical" | "chemical";
export type Role = "budget" | "transfer" | "gross" | "slow";
export type Certainty = "stated" | "held" | "residual" | "split" | "rounded";
export type FilterId = "all" | "net" | "biological" | "physical" | "chemical";

export type Flux = {
  id: string;
  from: NodeId;
  to: NodeId;
  gtC: number;
  kinds: Kind[];
  role: Role;
  /** True only for terms that add into the atmosphere's books. */
  inBooks: boolean;
  title: string;
  short: string;
  note: string;
  certainty: Certainty;
};

export function gtCFromCO2(gtco2: number): number {
  return gtco2 / CO2_PER_C;
}

export function tonnesPerSecond(gtco2PerYear: number): number {
  return (gtco2PerYear * 1e9) / (YEAR_MS / 1000);
}

export function tonnesSince(ms: number, gtco2PerYear: number): number {
  return Math.max(0, (gtco2PerYear * 1e9 * (ms - YEAR_START)) / YEAR_MS);
}

/** Day of year, Jan 1 = 1, fractional. */
export function dayOfYearUTC(ms: number): number {
  const year = new Date(ms).getUTCFullYear();
  const start = Date.UTC(year, 0, 1);
  return (ms - start) / 86_400_000 + 1;
}

/** Mauna Loa seasonal anomaly, ppm. Tuned to May 2026, Sep 2026, and the November rise. */
export function seasonalAnomaly(dayOfYear: number): number {
  const w = (2 * Math.PI * (dayOfYear - 140)) / 365.25;
  return 2.15 * Math.cos(w) + 2.7 * Math.cos(2 * w - 1.222);
}

export function maunaLoaPpm(ms: number): number {
  const years = (ms - MAUNA_ANCHOR_MS) / YEAR_MS;
  const seasonal =
    seasonalAnomaly(dayOfYearUTC(ms)) - seasonalAnomaly(dayOfYearUTC(MAUNA_ANCHOR_MS));
  return MAUNA_ANCHOR_PPM + GROWTH_PPM * years + seasonal;
}

/** Instantaneous seasonal + trend slope, ppm per day, at Mauna Loa. */
export function maunaSlopePpmPerDay(ms: number): number {
  const day = 86_400_000;
  return (maunaLoaPpm(ms + day) - maunaLoaPpm(ms - day)) / 2;
}

/** Global-mean mole fraction. 427.7 ppm is the 2026 calendar average, so it falls at mid-year. */
export function globalMeanPpm(ms: number): number {
  const mid = YEAR_START + YEAR_MS / 2;
  return GLOBAL_MEAN_2026 + GROWTH_PPM * ((ms - mid) / YEAR_MS);
}

export function atmosphereGtC(ms: number): number {
  return globalMeanPpm(ms) * GTC_PER_PPM;
}

export function abovePreindustrial(ppm: number): number {
  return ppm / PREINDUSTRIAL_PPM - 1;
}

export const STOCKS = {
  vegetation: 450,
  soils: 1700,
  permafrost: 1400,
  surfaceOcean: 900,
  marineBiota: 3,
  deepOcean: 37200,
  fossilLeft: 1000,
  rockMillion: 65,
} as const;

const GROSS = {
  gpp: 130,
  ra: 65,
  rh: 55,
  litter: 60,
  fire: 2.5,
  harvest: 2.5,
  invasion: 80,
  evasion: 80 - OCEAN_GTC,
  bioExport: 11,
  bioReturn: 10.8,
  downwelling: 30 + (OCEAN_GTC - 0.2),
  upwelling: 30,
  weathering: 0.3,
  volcanism: 0.1,
  burial: 0.2,
} as const;

export const FLUXES: Flux[] = [
  {
    id: "fossil",
    from: "geo",
    to: "atm",
    gtC: gtCFromCO2(FOSSIL_GTCO2),
    kinds: ["chemical"],
    role: "budget",
    inBooks: true,
    title: "Fossil fuels & cement",
    short: "Fossil",
    note: "Coal, oil, gas, and cement process emissions, after cement re-absorbs a little CO₂ as it carbonates. The 2026 budget projects 38.2 Gt CO₂, 0.4% under 2025, with oil down and coal still up.",
    certainty: "stated",
  },
  {
    id: "deforestation",
    from: "veg",
    to: "atm",
    gtC: gtCFromCO2(DEFOREST_GTCO2),
    kinds: ["biological"],
    role: "budget",
    inBooks: true,
    title: "Deforestation & degradation",
    short: "Forest loss",
    note: "Indicative share of the reported 5.1 Gt CO₂ land-use source: clearing and degradation of forests. The 5.1 is the reported net land-use emission; this slice is a partition for the plate.",
    certainty: "split",
  },
  {
    id: "peat",
    from: "soil",
    to: "atm",
    gtC: gtCFromCO2(PEAT_GTCO2),
    kinds: ["biological"],
    role: "budget",
    inBooks: true,
    title: "Peat drainage & peat fire",
    short: "Peat",
    note: "Indicative share of land-use emissions. Drained peat and peat fires are mostly agricultural, and they are higher in this El Niño year. Partition of the reported 5.1 Gt CO₂, not a separate headline.",
    certainty: "split",
  },
  {
    id: "ag-loss",
    from: "ag",
    to: "atm",
    gtC: gtCFromCO2(AG_LOSS_GTCO2),
    kinds: ["biological"],
    role: "budget",
    inBooks: true,
    title: "Shifting cultivation & mineral soils",
    short: "Soil loss",
    note: "The remainder of the 5.1 Gt CO₂ land-use source after deforestation and peat: shifting cultivation and loss from mineral agricultural soils.",
    certainty: "split",
  },
  {
    id: "eco-veg",
    from: "atm",
    to: "veg",
    gtC: gtCFromCO2(ECO_VEG_GTCO2),
    kinds: ["biological"],
    role: "budget",
    inBooks: true,
    title: "Forest & ecosystem uptake",
    short: "Ecosystems",
    note: "Seventy percent of the land residual, after the cropland slice, drawn into vegetation: CO₂ fertilization, longer seasons, and regrowth that the budget counts in the land sink rather than in land-use change. The 2026 land sink is not yet its own published line — it is what is left after the airborne fraction and the ocean.",
    certainty: "residual",
  },
  {
    id: "eco-soil",
    from: "atm",
    to: "soil",
    gtC: gtCFromCO2(ECO_SOIL_GTCO2),
    kinds: ["biological"],
    role: "budget",
    inBooks: true,
    title: "Soil uptake outside cropland",
    short: "Soil sink",
    note: "The other thirty percent of that land residual, into soils that are not on the cropland arrow. Same caveat: this is a display split of a residual, and the residual absorbs whatever imbalance the final 2026 budget will show.",
    certainty: "residual",
  },
  {
    id: "ag-draw",
    from: "atm",
    to: "ag",
    gtC: AG_DRAW_GTC,
    kinds: ["biological"],
    role: "budget",
    inBooks: true,
    title: "Cropland drawdown",
    short: "Cropland",
    note: "Working estimate of carbon actually accumulating from agricultural practice — residues, cover, agroforestry — at 0.15 Gt C per year. A reasonable range is about 0.05 to 0.40 Gt C. It is carved out of the land residual so the books still close. It is not a Global Carbon Project line, and it is not additional to the land sink.",
    certainty: "residual",
  },
  {
    id: "ocean",
    from: "atm",
    to: "surf",
    gtC: OCEAN_GTC,
    kinds: ["physical", "chemical"],
    role: "budget",
    inBooks: true,
    title: "Ocean uptake",
    short: "Ocean",
    note: "Held at the 2025 ocean sink of 3.2 Gt C per year. Over 2016–2025 the ocean took up about 11.1 Gt CO₂ a year. Air–sea exchange is physical; carbonate chemistry sets how much seawater can hold. The 2026 ocean number is not separately published yet.",
    certainty: "held",
  },
  {
    id: "export",
    from: "surf",
    to: "deep",
    gtC: OCEAN_GTC,
    kinds: ["physical"],
    role: "transfer",
    inBooks: false,
    title: "Export below the mixed layer",
    short: "To depth",
    note: "The ocean sink does not stay in the mixed layer. This arrow moves the same quantity into intermediate and deep water. It is the ocean sink seen a step later — do not add it again.",
    certainty: "held",
  },
  {
    id: "gpp",
    from: "atm",
    to: "veg",
    gtC: GROSS.gpp,
    kinds: ["biological"],
    role: "gross",
    inBooks: false,
    title: "Photosynthesis",
    short: "Photosynthesis",
    note: "Gross primary production, modern order of magnitude from IPCC AR6. About 130 Gt C per year. Almost all of it returns through respiration. This loop is not a net sink.",
    certainty: "rounded",
  },
  {
    id: "ra",
    from: "veg",
    to: "atm",
    gtC: GROSS.ra,
    kinds: ["biological"],
    role: "gross",
    inBooks: false,
    title: "Plant respiration",
    short: "Plant resp.",
    note: "Autotrophic respiration. Plants return roughly half of photosynthesis to the air on their own.",
    certainty: "rounded",
  },
  {
    id: "rh",
    from: "soil",
    to: "atm",
    gtC: GROSS.rh,
    kinds: ["biological"],
    role: "gross",
    inBooks: false,
    title: "Soil respiration",
    short: "Soil resp.",
    note: "Heterotrophic respiration from litter and soils. Together with plant respiration it cancels most of photosynthesis.",
    certainty: "rounded",
  },
  {
    id: "litter",
    from: "veg",
    to: "soil",
    gtC: GROSS.litter,
    kinds: ["biological"],
    role: "gross",
    inBooks: false,
    title: "Litterfall",
    short: "Litter",
    note: "Dead leaves, wood, and roots entering the soil. An internal transfer. It does not touch the atmosphere until something respires it.",
    certainty: "rounded",
  },
  {
    id: "fire",
    from: "veg",
    to: "atm",
    gtC: GROSS.fire,
    kinds: ["biological"],
    role: "gross",
    inBooks: false,
    title: "Wildfire",
    short: "Fire",
    note: "Gross wildfire, rounded. Peat fire and managed fire that the budget counts as land-use change are already on the net arrows. Do not add this on top of those.",
    certainty: "rounded",
  },
  {
    id: "harvest",
    from: "veg",
    to: "atm",
    gtC: GROSS.harvest,
    kinds: ["biological"],
    role: "gross",
    inBooks: false,
    title: "Harvest, returned within the year",
    short: "Harvest",
    note: "Crops and forage taken off fields, then eaten, burned, or rotted. The carbon is back in the air inside about a year. Harvest is not a sink.",
    certainty: "rounded",
  },
  {
    id: "invasion",
    from: "atm",
    to: "surf",
    gtC: GROSS.invasion,
    kinds: ["physical", "chemical"],
    role: "gross",
    inBooks: false,
    title: "Air–sea invasion",
    short: "Invasion",
    note: "CO₂ dissolving into the surface ocean. Rounded gross flux, IPCC scale. The net ocean sink is invasion minus evasion.",
    certainty: "rounded",
  },
  {
    id: "evasion",
    from: "surf",
    to: "atm",
    gtC: GROSS.evasion,
    kinds: ["physical", "chemical"],
    role: "gross",
    inBooks: false,
    title: "Air–sea evasion",
    short: "Evasion",
    note: "CO₂ leaving the surface ocean. Set so that invasion minus evasion equals the 3.2 Gt C ocean sink used in the books.",
    certainty: "rounded",
  },
  {
    id: "bio-export",
    from: "surf",
    to: "deep",
    gtC: GROSS.bioExport,
    kinds: ["biological"],
    role: "gross",
    inBooks: false,
    title: "Biological pump",
    short: "Bio pump",
    note: "Sinking particles and migrating biota. About 11 Gt C per year leaves the surface. Most of it is remineralized at depth and eventually returns.",
    certainty: "rounded",
  },
  {
    id: "bio-return",
    from: "deep",
    to: "surf",
    gtC: GROSS.bioReturn,
    kinds: ["biological"],
    role: "gross",
    inBooks: false,
    title: "Remineralization return",
    short: "Return",
    note: "Deep remineralization and the upwelling of that biogenic carbon. The small difference between export and return is what gets buried.",
    certainty: "rounded",
  },
  {
    id: "downwelling",
    from: "surf",
    to: "deep",
    gtC: GROSS.downwelling,
    kinds: ["physical", "chemical"],
    role: "gross",
    inBooks: false,
    title: "Solubility pump, downward",
    short: "Downwelling",
    note: "Cold, carbon-rich water sinking at high latitudes, and the overturning that carries the anthropogenic load out of the mixed layer. Physical transport; the concentration it carries is set by chemistry.",
    certainty: "rounded",
  },
  {
    id: "upwelling",
    from: "deep",
    to: "surf",
    gtC: GROSS.upwelling,
    kinds: ["physical"],
    role: "gross",
    inBooks: false,
    title: "Upwelling",
    short: "Upwelling",
    note: "Return of deep dissolved inorganic carbon to the surface. Downwelling minus upwelling here is the physical part of the net ocean storage.",
    certainty: "rounded",
  },
  {
    id: "weathering",
    from: "atm",
    to: "geo",
    gtC: GROSS.weathering,
    kinds: ["chemical"],
    role: "slow",
    inBooks: false,
    title: "Rock weathering",
    short: "Weathering",
    note: "Silicate and carbonate weathering, about 0.3 Gt C per year. A real chemical sink, and negligible next to fossil fuel. Not part of the 2026 books.",
    certainty: "rounded",
  },
  {
    id: "volcanism",
    from: "geo",
    to: "atm",
    gtC: GROSS.volcanism,
    kinds: ["chemical"],
    role: "slow",
    inBooks: false,
    title: "Volcanoes & metamorphism",
    short: "Volcanoes",
    note: "About 0.1 Gt C per year from volcanoes and metamorphism. This is the slow geological source. Weathering more than balances it. Fossil fuel is roughly a hundred times larger.",
    certainty: "rounded",
  },
  {
    id: "burial",
    from: "deep",
    to: "geo",
    gtC: GROSS.burial,
    kinds: ["chemical"],
    role: "slow",
    inBooks: false,
    title: "Sediment burial",
    short: "Burial",
    note: "Marine carbonate and organic carbon buried in sediments, about 0.2 Gt C per year. This is the long geological sink, the net of the biological pump.",
    certainty: "rounded",
  },
];

export type LedgerRow = {
  id: string;
  fluxId: string;
  title: string;
  kinds: Kind[];
  gtCO2: number;
  certainty: Certainty;
  direction: "source" | "sink";
  note: string;
};

export const SOURCE_ROWS: LedgerRow[] = [
  {
    id: "coal",
    fluxId: "fossil",
    title: "Coal",
    kinds: ["chemical"],
    gtCO2: COAL_GTCO2,
    certainty: "split",
    direction: "source",
    note: "Share of the fossil residual after oil and cement, using a 65:35 coal-to-gas ratio typical of recent years. Coal is the only major fuel the 2026 budget has rising (+0.6%).",
  },
  {
    id: "oil",
    fluxId: "fossil",
    title: "Oil",
    kinds: ["chemical"],
    gtCO2: OIL_GTCO2,
    certainty: "stated",
    direction: "source",
    note: "12.6 Gt CO₂, down 1.9% in the 2026 projection. The drop is tied to lower oil use after the Iran conflict, and the budget treats that as a shock, not yet a trend.",
  },
  {
    id: "gas",
    fluxId: "fossil",
    title: "Natural gas",
    kinds: ["chemical"],
    gtCO2: GAS_GTCO2,
    certainty: "split",
    direction: "source",
    note: "The rest of the fossil residual after oil, cement, and the coal share. The budget has gas emissions slightly down (−0.3%). The tonne split between coal and gas is estimated.",
  },
  {
    id: "cement",
    fluxId: "fossil",
    title: "Cement, net of carbonation",
    kinds: ["chemical"],
    gtCO2: CEMENT_GTCO2,
    certainty: "split",
    direction: "source",
    note: "Process emissions from cement, about 2% of fossil CO₂ once the carbonation sink is subtracted. Calcination is a chemical release of geological carbon.",
  },
  {
    id: "row-deforest",
    fluxId: "deforestation",
    title: "Deforestation & degradation",
    kinds: ["biological"],
    gtCO2: DEFOREST_GTCO2,
    certainty: "split",
    direction: "source",
    note: FLUXES.find((f) => f.id === "deforestation")!.note,
  },
  {
    id: "row-peat",
    fluxId: "peat",
    title: "Peat drainage & peat fire",
    kinds: ["biological"],
    gtCO2: PEAT_GTCO2,
    certainty: "split",
    direction: "source",
    note: FLUXES.find((f) => f.id === "peat")!.note,
  },
  {
    id: "row-ag-loss",
    fluxId: "ag-loss",
    title: "Shifting cultivation & mineral soils",
    kinds: ["biological"],
    gtCO2: AG_LOSS_GTCO2,
    certainty: "split",
    direction: "source",
    note: FLUXES.find((f) => f.id === "ag-loss")!.note,
  },
];

export const SINK_ROWS: LedgerRow[] = [
  {
    id: "row-ocean",
    fluxId: "ocean",
    title: "Ocean",
    kinds: ["physical", "chemical"],
    gtCO2: OCEAN_GTCO2,
    certainty: "held",
    direction: "sink",
    note: FLUXES.find((f) => f.id === "ocean")!.note,
  },
  {
    id: "row-eco-veg",
    fluxId: "eco-veg",
    title: "Forest & ecosystem uptake",
    kinds: ["biological"],
    gtCO2: ECO_VEG_GTCO2,
    certainty: "residual",
    direction: "sink",
    note: FLUXES.find((f) => f.id === "eco-veg")!.note,
  },
  {
    id: "row-eco-soil",
    fluxId: "eco-soil",
    title: "Soil uptake outside cropland",
    kinds: ["biological"],
    gtCO2: ECO_SOIL_GTCO2,
    certainty: "residual",
    direction: "sink",
    note: FLUXES.find((f) => f.id === "eco-soil")!.note,
  },
  {
    id: "row-ag-draw",
    fluxId: "ag-draw",
    title: "Cropland drawdown",
    kinds: ["biological"],
    gtCO2: AG_DRAW_GTCO2,
    certainty: "residual",
    direction: "sink",
    note: FLUXES.find((f) => f.id === "ag-draw")!.note,
  },
];

export const REGIONS: { id: string; name: string; change: number }[] = [
  { id: "cn", name: "China", change: -0.9 },
  { id: "us", name: "United States", change: -1.3 },
  { id: "eu", name: "European Union", change: -1.5 },
  { id: "in", name: "India", change: 4.4 },
  { id: "jp", name: "Japan", change: -1.0 },
  { id: "av", name: "Aviation", change: -1 },
  { id: "sh", name: "Shipping", change: -1 },
  { id: "rw", name: "Rest of world", change: -0.7 },
];

/** Rounded Mauna Loa annual means for context. Not the live trace. */
export const KEELING: { year: number; ppm: number }[] = [
  { year: 1959, ppm: 316 },
  { year: 1965, ppm: 320 },
  { year: 1970, ppm: 326 },
  { year: 1975, ppm: 331 },
  { year: 1980, ppm: 339 },
  { year: 1985, ppm: 346 },
  { year: 1990, ppm: 354 },
  { year: 1995, ppm: 361 },
  { year: 2000, ppm: 370 },
  { year: 2005, ppm: 380 },
  { year: 2010, ppm: 390 },
  { year: 2015, ppm: 401 },
  { year: 2016, ppm: 404 },
  { year: 2017, ppm: 407 },
  { year: 2018, ppm: 409 },
  { year: 2019, ppm: 411 },
  { year: 2020, ppm: 414 },
  { year: 2021, ppm: 416 },
  { year: 2022, ppm: 419 },
  { year: 2023, ppm: 421 },
  { year: 2024, ppm: 425 },
  { year: 2025, ppm: 427 },
];

export type TickerId = "net" | "fossil" | "luc" | "ocean" | "land" | "ag";

export type Ticker = {
  id: TickerId;
  label: string;
  verb: string;
  gtCO2: number;
  fluxId: string;
};

export const TICKERS: Ticker[] = [
  {
    id: "net",
    label: "Stays in the air",
    verb: "Added to the atmosphere since 1 Jan 2026",
    gtCO2: AIRBORNE_GTCO2,
    fluxId: "fossil",
  },
  {
    id: "fossil",
    label: "Fossil & cement",
    verb: "Fossil and cement CO₂ since 1 Jan 2026",
    gtCO2: FOSSIL_GTCO2,
    fluxId: "fossil",
  },
  {
    id: "luc",
    label: "Land-use change",
    verb: "Land-use CO₂ since 1 Jan 2026",
    gtCO2: LUC_GTCO2,
    fluxId: "deforestation",
  },
  {
    id: "ocean",
    label: "Ocean drawdown",
    verb: "Taken up by the ocean since 1 Jan 2026",
    gtCO2: OCEAN_GTCO2,
    fluxId: "ocean",
  },
  {
    id: "land",
    label: "Land ecosystems",
    verb: "Taken up by forests and non-crop soils since 1 Jan 2026",
    gtCO2: ECO_GTCO2,
    fluxId: "eco-veg",
  },
  {
    id: "ag",
    label: "Cropland drawdown",
    verb: "Working estimate, cropland drawdown since 1 Jan 2026",
    gtCO2: AG_DRAW_GTCO2,
    fluxId: "ag-draw",
  },
];

export const CERTAINTY_LABEL: Record<Certainty, string> = {
  stated: "Reported",
  held: "Held from 2025",
  residual: "Residual",
  split: "Split of a reported total",
  rounded: "Rounded, IPCC scale",
};

export function kindLabel(kinds: Kind[]): string {
  return kinds.map((k) => k.charAt(0).toUpperCase() + k.slice(1)).join(" · ");
}

export function fluxVisible(flux: Flux, filter: FilterId): boolean {
  if (filter === "all") return true;
  if (filter === "net") return flux.role === "budget" || flux.role === "transfer";
  return flux.kinds.includes(filter);
}

export function formatPpm(n: number, digits = 2): string {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function formatTonnes(n: number): string {
  return Math.floor(Math.max(0, n)).toLocaleString("en-US");
}

export function formatBooks(n: number): string {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatGross(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 50) {
    return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
  }
  if (abs >= 10) {
    return n.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  }
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatRate(n: number): string {
  const abs = Math.abs(n);
  const digits = abs >= 100 ? 0 : abs >= 10 ? 1 : 2;
  return n.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function formatStock(n: number): string {
  return Math.round(n).toLocaleString("en-US");
}

export function formatUtc(ms: number): string {
  const formatted = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
    hourCycle: "h23",
  }).format(ms);
  return `${formatted} UTC`;
}

function assertClose(name: string, got: number, expect: number, tol = 0.03): void {
  if (Math.abs(got - expect) > tol) {
    throw new Error(`Carbon books do not close (${name}): ${got} vs ${expect}`);
  }
}

assertClose("land-use parts", DEFOREST_GTCO2 + PEAT_GTCO2 + AG_LOSS_GTCO2, LUC_GTCO2);
assertClose("fossil parts", OIL_GTCO2 + CEMENT_GTCO2 + COAL_GTCO2 + GAS_GTCO2, FOSSIL_GTCO2);
assertClose(
  "atmosphere books",
  SOURCE_ROWS.reduce((sum, row) => sum + row.gtCO2, 0),
  SINK_ROWS.reduce((sum, row) => sum + row.gtCO2, 0) + AIRBORNE_GTCO2,
);
assertClose("sources headline", SOURCE_ROWS.reduce((sum, row) => sum + row.gtCO2, 0), SOURCES_GTCO2);
assertClose("land parts", ECO_VEG_GTCO2 + ECO_SOIL_GTCO2 + AG_DRAW_GTCO2, LAND_GTCO2);
assertClose("evasion", GROSS.invasion - GROSS.evasion, OCEAN_GTC, 0.001);
assertClose("pump burial", GROSS.bioExport - GROSS.bioReturn, GROSS.burial, 0.001);
assertClose("overturning", GROSS.downwelling - GROSS.upwelling + (GROSS.bioExport - GROSS.bioReturn), OCEAN_GTC, 0.001);
