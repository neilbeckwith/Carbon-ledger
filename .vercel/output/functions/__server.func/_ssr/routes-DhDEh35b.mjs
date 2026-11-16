import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DhDEh35b.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** 2026 carbon books for the live ledger.
*
* Headlines are the Global Carbon Budget 2026 preliminary release
* (10 Nov 2026). Anything marked split, residual, held, or rounded
* is a display partition — not an extra measurement.
*/
var CO2_PER_C = 44 / 12;
var GTC_PER_PPM = 2.124;
var YEAR_START = Date.UTC(2026, 0, 1);
var YEAR_MS = Date.UTC(2027, 0, 1) - YEAR_START;
/** Stable instant used for the server render. The clock takes over after mount. */
var PREVIEW_MS = Date.UTC(2026, 10, 16, 18, 56, 0);
var FOSSIL_GTCO2 = 38.2;
var OIL_GTCO2 = 12.6;
/** About 2% of fossil CO₂ after the cement carbonation sink. */
var CEMENT_GTCO2 = FOSSIL_GTCO2 * .02;
var COAL_GAS_GTCO2 = 24.836000000000002;
/** Recent coal:gas split of the residual. Not a separate headline. */
var COAL_GTCO2 = COAL_GAS_GTCO2 * .65;
var GAS_GTCO2 = COAL_GAS_GTCO2 * .35;
var LUC_GTCO2 = 5.1;
var DEFOREST_GTCO2 = 3.4;
var PEAT_GTCO2 = 1.2;
var AG_LOSS_GTCO2 = .4999999999999998;
var GROWTH_PPM = 2.2;
var GLOBAL_MEAN_2026 = 427.7;
var AIRBORNE_GTCO2 = GROWTH_PPM * GTC_PER_PPM * CO2_PER_C;
/** 2025 ocean sink, held for 2026 — the new budget has not split it out yet. */
var OCEAN_GTC = 3.2;
var OCEAN_GTCO2 = OCEAN_GTC * CO2_PER_C;
var LAND_GTCO2 = 14.433066666666669;
LAND_GTCO2 / CO2_PER_C;
/** Realized cropland and agroforestry soil-carbon gain. Slice of the land residual. */
var AG_DRAW_GTC = .15;
var AG_DRAW_GTCO2 = AG_DRAW_GTC * CO2_PER_C;
var AG_DRAW_LOW_GTC = .05;
var AG_DRAW_HIGH_GTC = .4;
var ECO_GTCO2 = 13.883066666666668;
var ECO_VEG_GTCO2 = ECO_GTCO2 * .7;
var ECO_SOIL_GTCO2 = ECO_GTCO2 * .30000000000000004;
var MAUNA_ANCHOR_MS = Date.UTC(2026, 10, 14);
var MAUNA_ANCHOR_PPM = 428.69;
var SOURCES_GTCO2 = 43.300000000000004;
function gtCFromCO2(gtco2) {
	return gtco2 / CO2_PER_C;
}
function tonnesPerSecond(gtco2PerYear) {
	return gtco2PerYear * 1e9 / (YEAR_MS / 1e3);
}
function tonnesSince(ms, gtco2PerYear) {
	return Math.max(0, gtco2PerYear * 1e9 * (ms - YEAR_START) / YEAR_MS);
}
/** Day of year, Jan 1 = 1, fractional. */
function dayOfYearUTC(ms) {
	const year = new Date(ms).getUTCFullYear();
	return (ms - Date.UTC(year, 0, 1)) / 864e5 + 1;
}
/** Mauna Loa seasonal anomaly, ppm. Tuned to May 2026, Sep 2026, and the November rise. */
function seasonalAnomaly(dayOfYear) {
	const w = 2 * Math.PI * (dayOfYear - 140) / 365.25;
	return 2.15 * Math.cos(w) + 2.7 * Math.cos(2 * w - 1.222);
}
function maunaLoaPpm(ms) {
	const years = (ms - MAUNA_ANCHOR_MS) / YEAR_MS;
	const seasonal = seasonalAnomaly(dayOfYearUTC(ms)) - seasonalAnomaly(dayOfYearUTC(MAUNA_ANCHOR_MS));
	return MAUNA_ANCHOR_PPM + GROWTH_PPM * years + seasonal;
}
/** Instantaneous seasonal + trend slope, ppm per day, at Mauna Loa. */
function maunaSlopePpmPerDay(ms) {
	const day = 864e5;
	return (maunaLoaPpm(ms + day) - maunaLoaPpm(ms - day)) / 2;
}
/** Global-mean mole fraction. 427.7 ppm is the 2026 calendar average, so it falls at mid-year. */
function globalMeanPpm(ms) {
	return GLOBAL_MEAN_2026 + GROWTH_PPM * ((ms - (YEAR_START + YEAR_MS / 2)) / YEAR_MS);
}
function atmosphereGtC(ms) {
	return globalMeanPpm(ms) * GTC_PER_PPM;
}
function abovePreindustrial(ppm) {
	return ppm / 278 - 1;
}
var STOCKS = {
	vegetation: 450,
	soils: 1700,
	permafrost: 1400,
	surfaceOcean: 900,
	marineBiota: 3,
	deepOcean: 37200,
	fossilLeft: 1e3,
	rockMillion: 65
};
var GROSS = {
	gpp: 130,
	ra: 65,
	rh: 55,
	litter: 60,
	fire: 2.5,
	harvest: 2.5,
	invasion: 80,
	evasion: 76.8,
	bioExport: 11,
	bioReturn: 10.8,
	downwelling: 33,
	upwelling: 30,
	weathering: .3,
	volcanism: .1,
	burial: .2
};
var FLUXES = [
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
		certainty: "stated"
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
		certainty: "split"
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
		certainty: "split"
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
		certainty: "split"
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
		certainty: "residual"
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
		certainty: "residual"
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
		certainty: "residual"
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
		certainty: "held"
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
		certainty: "held"
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
		certainty: "rounded"
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
		certainty: "rounded"
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
		certainty: "rounded"
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
		certainty: "rounded"
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
		certainty: "rounded"
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
		certainty: "rounded"
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
		certainty: "rounded"
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
		certainty: "rounded"
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
		certainty: "rounded"
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
		certainty: "rounded"
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
		certainty: "rounded"
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
		certainty: "rounded"
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
		certainty: "rounded"
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
		certainty: "rounded"
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
		certainty: "rounded"
	}
];
var SOURCE_ROWS = [
	{
		id: "coal",
		fluxId: "fossil",
		title: "Coal",
		kinds: ["chemical"],
		gtCO2: COAL_GTCO2,
		certainty: "split",
		direction: "source",
		note: "Share of the fossil residual after oil and cement, using a 65:35 coal-to-gas ratio typical of recent years. Coal is the only major fuel the 2026 budget has rising (+0.6%)."
	},
	{
		id: "oil",
		fluxId: "fossil",
		title: "Oil",
		kinds: ["chemical"],
		gtCO2: OIL_GTCO2,
		certainty: "stated",
		direction: "source",
		note: "12.6 Gt CO₂, down 1.9% in the 2026 projection. The drop is tied to lower oil use after the Iran conflict, and the budget treats that as a shock, not yet a trend."
	},
	{
		id: "gas",
		fluxId: "fossil",
		title: "Natural gas",
		kinds: ["chemical"],
		gtCO2: GAS_GTCO2,
		certainty: "split",
		direction: "source",
		note: "The rest of the fossil residual after oil, cement, and the coal share. The budget has gas emissions slightly down (−0.3%). The tonne split between coal and gas is estimated."
	},
	{
		id: "cement",
		fluxId: "fossil",
		title: "Cement, net of carbonation",
		kinds: ["chemical"],
		gtCO2: CEMENT_GTCO2,
		certainty: "split",
		direction: "source",
		note: "Process emissions from cement, about 2% of fossil CO₂ once the carbonation sink is subtracted. Calcination is a chemical release of geological carbon."
	},
	{
		id: "row-deforest",
		fluxId: "deforestation",
		title: "Deforestation & degradation",
		kinds: ["biological"],
		gtCO2: DEFOREST_GTCO2,
		certainty: "split",
		direction: "source",
		note: FLUXES.find((f) => f.id === "deforestation").note
	},
	{
		id: "row-peat",
		fluxId: "peat",
		title: "Peat drainage & peat fire",
		kinds: ["biological"],
		gtCO2: PEAT_GTCO2,
		certainty: "split",
		direction: "source",
		note: FLUXES.find((f) => f.id === "peat").note
	},
	{
		id: "row-ag-loss",
		fluxId: "ag-loss",
		title: "Shifting cultivation & mineral soils",
		kinds: ["biological"],
		gtCO2: AG_LOSS_GTCO2,
		certainty: "split",
		direction: "source",
		note: FLUXES.find((f) => f.id === "ag-loss").note
	}
];
var SINK_ROWS = [
	{
		id: "row-ocean",
		fluxId: "ocean",
		title: "Ocean",
		kinds: ["physical", "chemical"],
		gtCO2: OCEAN_GTCO2,
		certainty: "held",
		direction: "sink",
		note: FLUXES.find((f) => f.id === "ocean").note
	},
	{
		id: "row-eco-veg",
		fluxId: "eco-veg",
		title: "Forest & ecosystem uptake",
		kinds: ["biological"],
		gtCO2: ECO_VEG_GTCO2,
		certainty: "residual",
		direction: "sink",
		note: FLUXES.find((f) => f.id === "eco-veg").note
	},
	{
		id: "row-eco-soil",
		fluxId: "eco-soil",
		title: "Soil uptake outside cropland",
		kinds: ["biological"],
		gtCO2: ECO_SOIL_GTCO2,
		certainty: "residual",
		direction: "sink",
		note: FLUXES.find((f) => f.id === "eco-soil").note
	},
	{
		id: "row-ag-draw",
		fluxId: "ag-draw",
		title: "Cropland drawdown",
		kinds: ["biological"],
		gtCO2: AG_DRAW_GTCO2,
		certainty: "residual",
		direction: "sink",
		note: FLUXES.find((f) => f.id === "ag-draw").note
	}
];
var REGIONS = [
	{
		id: "cn",
		name: "China",
		change: -.9
	},
	{
		id: "us",
		name: "United States",
		change: -1.3
	},
	{
		id: "eu",
		name: "European Union",
		change: -1.5
	},
	{
		id: "in",
		name: "India",
		change: 4.4
	},
	{
		id: "jp",
		name: "Japan",
		change: -1
	},
	{
		id: "av",
		name: "Aviation",
		change: -1
	},
	{
		id: "sh",
		name: "Shipping",
		change: -1
	},
	{
		id: "rw",
		name: "Rest of world",
		change: -.7
	}
];
/** Rounded Mauna Loa annual means for context. Not the live trace. */
var KEELING = [
	{
		year: 1959,
		ppm: 316
	},
	{
		year: 1965,
		ppm: 320
	},
	{
		year: 1970,
		ppm: 326
	},
	{
		year: 1975,
		ppm: 331
	},
	{
		year: 1980,
		ppm: 339
	},
	{
		year: 1985,
		ppm: 346
	},
	{
		year: 1990,
		ppm: 354
	},
	{
		year: 1995,
		ppm: 361
	},
	{
		year: 2e3,
		ppm: 370
	},
	{
		year: 2005,
		ppm: 380
	},
	{
		year: 2010,
		ppm: 390
	},
	{
		year: 2015,
		ppm: 401
	},
	{
		year: 2016,
		ppm: 404
	},
	{
		year: 2017,
		ppm: 407
	},
	{
		year: 2018,
		ppm: 409
	},
	{
		year: 2019,
		ppm: 411
	},
	{
		year: 2020,
		ppm: 414
	},
	{
		year: 2021,
		ppm: 416
	},
	{
		year: 2022,
		ppm: 419
	},
	{
		year: 2023,
		ppm: 421
	},
	{
		year: 2024,
		ppm: 425
	},
	{
		year: 2025,
		ppm: 427
	}
];
var TICKERS = [
	{
		id: "net",
		label: "Stays in the air",
		verb: "Added to the atmosphere since 1 Jan 2026",
		gtCO2: AIRBORNE_GTCO2,
		fluxId: "fossil"
	},
	{
		id: "fossil",
		label: "Fossil & cement",
		verb: "Fossil and cement CO₂ since 1 Jan 2026",
		gtCO2: FOSSIL_GTCO2,
		fluxId: "fossil"
	},
	{
		id: "luc",
		label: "Land-use change",
		verb: "Land-use CO₂ since 1 Jan 2026",
		gtCO2: LUC_GTCO2,
		fluxId: "deforestation"
	},
	{
		id: "ocean",
		label: "Ocean drawdown",
		verb: "Taken up by the ocean since 1 Jan 2026",
		gtCO2: OCEAN_GTCO2,
		fluxId: "ocean"
	},
	{
		id: "land",
		label: "Land ecosystems",
		verb: "Taken up by forests and non-crop soils since 1 Jan 2026",
		gtCO2: ECO_GTCO2,
		fluxId: "eco-veg"
	},
	{
		id: "ag",
		label: "Cropland drawdown",
		verb: "Working estimate, cropland drawdown since 1 Jan 2026",
		gtCO2: AG_DRAW_GTCO2,
		fluxId: "ag-draw"
	}
];
var CERTAINTY_LABEL = {
	stated: "Reported",
	held: "Held from 2025",
	residual: "Residual",
	split: "Split of a reported total",
	rounded: "Rounded, IPCC scale"
};
function kindLabel(kinds) {
	return kinds.map((k) => k.charAt(0).toUpperCase() + k.slice(1)).join(" · ");
}
function fluxVisible(flux, filter) {
	if (filter === "all") return true;
	if (filter === "net") return flux.role === "budget" || flux.role === "transfer";
	return flux.kinds.includes(filter);
}
function formatPpm(n, digits = 2) {
	return n.toLocaleString("en-US", {
		minimumFractionDigits: digits,
		maximumFractionDigits: digits
	});
}
function formatTonnes(n) {
	return Math.floor(Math.max(0, n)).toLocaleString("en-US");
}
function formatBooks(n) {
	return n.toLocaleString("en-US", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	});
}
function formatGross(n) {
	const abs = Math.abs(n);
	if (abs >= 50) return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
	if (abs >= 10) return n.toLocaleString("en-US", {
		minimumFractionDigits: 1,
		maximumFractionDigits: 1
	});
	return n.toLocaleString("en-US", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	});
}
function formatRate(n) {
	const abs = Math.abs(n);
	const digits = abs >= 100 ? 0 : abs >= 10 ? 1 : 2;
	return n.toLocaleString("en-US", {
		minimumFractionDigits: digits,
		maximumFractionDigits: digits
	});
}
function formatStock(n) {
	return Math.round(n).toLocaleString("en-US");
}
function formatUtc(ms) {
	return `${new Intl.DateTimeFormat("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		timeZone: "UTC",
		hourCycle: "h23"
	}).format(ms)} UTC`;
}
function assertClose(name, got, expect, tol = .03) {
	if (Math.abs(got - expect) > tol) throw new Error(`Carbon books do not close (${name}): ${got} vs ${expect}`);
}
assertClose("land-use parts", 5.1, LUC_GTCO2);
assertClose("fossil parts", 38.2, FOSSIL_GTCO2);
assertClose("atmosphere books", SOURCE_ROWS.reduce((sum, row) => sum + row.gtCO2, 0), SINK_ROWS.reduce((sum, row) => sum + row.gtCO2, 0) + AIRBORNE_GTCO2);
assertClose("sources headline", SOURCE_ROWS.reduce((sum, row) => sum + row.gtCO2, 0), SOURCES_GTCO2);
assertClose("land parts", 14.433066666666669, LAND_GTCO2);
assertClose("evasion", GROSS.invasion - GROSS.evasion, OCEAN_GTC, .001);
assertClose("pump burial", GROSS.bioExport - GROSS.bioReturn, GROSS.burial, .001);
assertClose("overturning", GROSS.downwelling - GROSS.upwelling + (GROSS.bioExport - GROSS.bioReturn), OCEAN_GTC, .001);
var PORT = {
	"veg-e": {
		x: 280,
		y: 96
	},
	"veg-s": {
		x: 150,
		y: 156
	},
	"soil-e": {
		x: 280,
		y: 400
	},
	"soil-n": {
		x: 150,
		y: 330
	},
	"ag-e": {
		x: 280,
		y: 690
	},
	"atm-w1": {
		x: 480,
		y: 250
	},
	"atm-w2": {
		x: 480,
		y: 320
	},
	"atm-w3": {
		x: 480,
		y: 390
	},
	"atm-e1": {
		x: 760,
		y: 260
	},
	"atm-e2": {
		x: 760,
		y: 340
	},
	"atm-s1": {
		x: 560,
		y: 460
	},
	"atm-s2": {
		x: 640,
		y: 460
	},
	"surf-w": {
		x: 960,
		y: 96
	},
	"surf-s": {
		x: 1080,
		y: 156
	},
	"deep-w": {
		x: 960,
		y: 420
	},
	"deep-n": {
		x: 1080,
		y: 330
	},
	"geo-n2": {
		x: 640,
		y: 640
	},
	"geo-e": {
		x: 760,
		y: 720
	}
};
var LINKS = {
	fossil: {
		from: "geo-n2",
		to: "atm-s2",
		bend: 0
	},
	deforestation: {
		from: "veg-e",
		to: "atm-w1",
		bend: -48
	},
	peat: {
		from: "soil-e",
		to: "atm-w3",
		bend: -36
	},
	"ag-loss": {
		from: "ag-e",
		to: "atm-w3",
		bend: 70
	},
	"eco-veg": {
		from: "atm-w1",
		to: "veg-e",
		bend: 22
	},
	"eco-soil": {
		from: "atm-w2",
		to: "soil-e",
		bend: 28
	},
	"ag-draw": {
		from: "atm-s1",
		to: "ag-e",
		bend: -90
	},
	ocean: {
		from: "atm-e2",
		to: "surf-w",
		bend: -30
	},
	export: {
		from: "surf-s",
		to: "deep-n",
		bend: 46
	},
	gpp: {
		from: "atm-w1",
		to: "veg-e",
		bend: -90
	},
	ra: {
		from: "veg-e",
		to: "atm-w2",
		bend: 10
	},
	rh: {
		from: "soil-e",
		to: "atm-w2",
		bend: 55
	},
	litter: {
		from: "veg-s",
		to: "soil-n",
		bend: -70
	},
	fire: {
		from: "veg-e",
		to: "atm-w2",
		bend: -16
	},
	harvest: {
		from: "veg-s",
		to: "atm-w3",
		bend: 110
	},
	invasion: {
		from: "atm-e1",
		to: "surf-w",
		bend: -70
	},
	evasion: {
		from: "surf-w",
		to: "atm-e2",
		bend: 50
	},
	"bio-export": {
		from: "surf-s",
		to: "deep-n",
		bend: -50
	},
	"bio-return": {
		from: "deep-w",
		to: "surf-s",
		bend: 36
	},
	downwelling: {
		from: "surf-s",
		to: "deep-w",
		bend: 80
	},
	upwelling: {
		from: "deep-n",
		to: "surf-s",
		bend: 16
	},
	weathering: {
		from: "atm-s1",
		to: "geo-n2",
		bend: -70
	},
	volcanism: {
		from: "geo-n2",
		to: "atm-s2",
		bend: 70
	},
	burial: {
		from: "deep-n",
		to: "geo-e",
		bend: 40
	}
};
var SKIP_WHEN_ALL = /* @__PURE__ */ new Set([
	"eco-veg",
	"eco-soil",
	"ocean",
	"export"
]);
var LABEL_AT = {
	fossil: {
		x: 730,
		y: 548
	},
	deforestation: {
		x: 390,
		y: 78
	},
	peat: {
		x: 390,
		y: 300
	},
	"ag-loss": {
		x: 380,
		y: 540
	},
	"eco-veg": {
		x: 390,
		y: 170
	},
	"eco-soil": {
		x: 390,
		y: 500
	},
	"ag-draw": {
		x: 380,
		y: 600
	},
	ocean: {
		x: 860,
		y: 200
	},
	export: {
		x: 1120,
		y: 250
	}
};
var NODES = [
	{
		id: "veg",
		x: 36,
		y: 28,
		w: 244,
		h: 128,
		kicker: "SURFACE TERRESTRIAL",
		title: "Vegetation",
		sub: "Leaves, wood, roots"
	},
	{
		id: "surf",
		x: 960,
		y: 28,
		w: 230,
		h: 128,
		kicker: "OCEAN SURFACE",
		title: "Mixed layer",
		sub: "Living plankton ~3 Gt C"
	},
	{
		id: "atm",
		x: 480,
		y: 200,
		w: 280,
		h: 260,
		kicker: "ATMOSPHERE",
		title: "The air",
		sub: "Global mean, for the mass"
	},
	{
		id: "soil",
		x: 36,
		y: 330,
		w: 244,
		h: 140,
		kicker: "TERRESTRIAL DEPTH",
		title: "Soils",
		sub: "Permafrost mostly frozen"
	},
	{
		id: "deep",
		x: 960,
		y: 330,
		w: 230,
		h: 150,
		kicker: "OCEAN DEPTH",
		title: "Deep ocean",
		sub: "Intermediate water too"
	},
	{
		id: "ag",
		x: 36,
		y: 620,
		w: 244,
		h: 130,
		kicker: "CROPLAND",
		title: "Fields",
		sub: "Part of the soil stock"
	},
	{
		id: "geo",
		x: 480,
		y: 640,
		w: 280,
		h: 150,
		kicker: "GEOLOGICAL CARBON",
		title: "Rock & fossil",
		sub: "Rock carbon is vast"
	}
];
function stockLine(id, now) {
	switch (id) {
		case "atm": return `${formatStock(atmosphereGtC(now))} Gt C`;
		case "veg": return `${formatStock(STOCKS.vegetation)} Gt C`;
		case "soil": return `${formatStock(STOCKS.soils)} Gt C`;
		case "ag": return "Not a separate stock";
		case "surf": return `${formatStock(STOCKS.surfaceOcean)} Gt C`;
		case "deep": return `${formatStock(STOCKS.deepOcean)} Gt C`;
		case "geo": return `~${formatStock(STOCKS.fossilLeft)} Gt C to burn`;
	}
}
function curve(from, to, bend) {
	const a = PORT[from];
	const b = PORT[to];
	const dx = b.x - a.x;
	const dy = b.y - a.y;
	const len = Math.hypot(dx, dy) || 1;
	const cx = (a.x + b.x) / 2 + -dy / len * bend;
	const cy = (a.y + b.y) / 2 + dx / len * bend;
	return `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`;
}
function tone(flux) {
	if (flux.to === "atm") return "ember";
	if (flux.from === "atm") return "tide";
	return "mist";
}
function widthOf(flux) {
	const raw = 1.2 + Math.log10(Math.max(flux.gtC, .08)) * 1.5;
	const emphasis = flux.role === "gross" ? 1 : 1.25;
	return Math.max(1.25, Math.min(5.4, raw * emphasis));
}
function particleCount(gtC) {
	if (gtC < .25) return 1;
	if (gtC < 2) return 2;
	if (gtC < 20) return 3;
	return 4;
}
function CyclePlate({ now, filter, nodeId, fluxId, onNode, onFlux }) {
	const markerBase = (0, import_react.useId)().replace(/:/g, "");
	const shown = FLUXES.filter((flux) => {
		if (flux.id === fluxId) return true;
		if (filter === "all" && SKIP_WHEN_ALL.has(flux.id)) return false;
		if (!fluxVisible(flux, filter)) return false;
		if (nodeId && flux.from !== nodeId && flux.to !== nodeId) return false;
		return true;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		className: "plate",
		viewBox: "0 0 1220 830",
		role: "group",
		"aria-label": "Carbon compartments and fluxes",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: [
				"ember",
				"tide",
				"mist"
			].map((name) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("marker", {
				id: `${markerBase}-${name}`,
				viewBox: "0 0 8 8",
				markerWidth: "8",
				markerHeight: "8",
				refX: "7",
				refY: "4",
				orient: "auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M1 1.2 L7 4 L1 6.8",
					fill: "none",
					stroke: `var(--color-${name})`,
					strokeWidth: "1.2"
				})
			}, name)) }),
			shown.map((flux) => {
				const link = LINKS[flux.id];
				if (!link) return null;
				const d = curve(link.from, link.to, link.bend);
				const color = tone(flux);
				const selected = flux.id === fluxId;
				const opacity = fluxId !== null && !selected ? .12 : flux.role === "gross" ? .28 : .95;
				const sw = widthOf(flux) + (selected ? 1.2 : 0);
				const count = particleCount(flux.gtC);
				const dur = 7;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
					opacity,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							d,
							fill: "none",
							stroke: `var(--color-${color})`,
							strokeWidth: sw,
							markerEnd: `url(#${markerBase}-${color})`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							className: "hit",
							d,
							onClick: () => onFlux(flux.id)
						}),
						Array.from({ length: count }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							className: "particle",
							r: selected ? 3.2 : 2.2,
							fill: `var(--color-${color})`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("animateMotion", {
								dur: `${dur}s`,
								begin: `${-(i * dur) / count}s`,
								repeatCount: "indefinite",
								path: d
							})
						}, i))
					]
				}, flux.id);
			}),
			NODES.map((node) => {
				const on = nodeId === node.id;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
					role: "button",
					tabIndex: 0,
					"aria-pressed": on,
					"aria-label": `${node.title}, ${stockLine(node.id, now)}`,
					onClick: () => onNode(node.id),
					onKeyDown: (event) => {
						if (event.key === "Enter" || event.key === " ") {
							event.preventDefault();
							onNode(node.id);
						}
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							className: on ? "node-shape is-on" : "node-shape",
							x: node.x,
							y: node.y,
							width: node.w,
							height: node.h,
							rx: "10"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
							className: "kicker",
							x: node.x + 16,
							y: node.y + 26,
							children: node.kicker
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
							className: "node-title",
							x: node.x + 16,
							y: node.y + 54,
							children: node.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
							className: "node-stock",
							x: node.x + 16,
							y: node.y + 80,
							children: stockLine(node.id, now)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
							className: "node-sub",
							x: node.x + 16,
							y: node.y + 104,
							children: node.sub
						})
					]
				}, node.id);
			}),
			shown.map((flux) => {
				const show = flux.id === fluxId || filter === "net" && LABEL_AT[flux.id];
				const at = LABEL_AT[flux.id];
				if (!show || !at) return null;
				const magnitude = flux.role === "gross" || flux.role === "slow" ? "" : ` ${formatBooks(flux.gtC)}`;
				const label = `${flux.short}${magnitude}`;
				const w = Math.max(72, label.length * 6.6 + 16);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
					transform: `translate(${at.x} ${at.y})`,
					onClick: () => onFlux(flux.id),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: -w / 2,
						y: -12,
						width: w,
						height: 24,
						rx: "5",
						fill: "var(--color-ink)",
						stroke: "var(--color-line)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
						className: "flux-label",
						textAnchor: "middle",
						y: 4,
						children: label
					})]
				}, `${flux.id}-label`);
			})
		]
	});
}
function KeelingChart() {
	const [charts, setCharts] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let live = true;
		import("../_libs/recharts+[...].mjs").then((n) => n.t).then((mod) => {
			if (live) setCharts(mod);
		});
		return () => {
			live = false;
		};
	}, []);
	if (!charts) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "chart-fallback",
		"aria-hidden": "true"
	});
	const { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } = charts;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "chart-box",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
			width: "100%",
			height: "100%",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
				data: KEELING,
				margin: {
					top: 12,
					right: 8,
					left: 0,
					bottom: 0
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
						dataKey: "year",
						tick: {
							fill: "var(--color-mist)",
							fontSize: 12
						},
						axisLine: { stroke: "var(--color-line)" },
						tickLine: false,
						interval: 4
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
						domain: [300, 440],
						tick: {
							fill: "var(--color-mist)",
							fontSize: 12
						},
						axisLine: false,
						tickLine: false,
						width: 40
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
						contentStyle: {
							background: "var(--color-panel)",
							border: "1px solid var(--color-line)",
							borderRadius: 8,
							color: "var(--color-bone)"
						},
						formatter: (value) => [`${value} ppm`, "Annual mean"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
						type: "monotone",
						dataKey: "ppm",
						stroke: "var(--color-ember)",
						strokeWidth: 1.75,
						fill: "var(--color-ember)",
						fillOpacity: .14,
						dot: false
					})
				]
			})
		})
	});
}
var FILTERS = [
	{
		id: "net",
		label: "Net budget"
	},
	{
		id: "all",
		label: "All fluxes"
	},
	{
		id: "biological",
		label: "Biological"
	},
	{
		id: "physical",
		label: "Physical"
	},
	{
		id: "chemical",
		label: "Chemical"
	}
];
function useSlowClock() {
	const [now, setNow] = (0, import_react.useState)(PREVIEW_MS);
	(0, import_react.useEffect)(() => {
		setNow(Date.now());
		const id = window.setInterval(() => setNow(Date.now()), 1e3);
		return () => window.clearInterval(id);
	}, []);
	return now;
}
function LiveTonnes({ perYear, sink }) {
	const [text, setText] = (0, import_react.useState)(() => formatTonnes(tonnesSince(PREVIEW_MS, perYear)));
	const [session, setSession] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const opened = Date.now();
		let frame = 0;
		const loop = () => {
			const n = Date.now();
			setText(formatTonnes(tonnesSince(n, perYear)));
			setSession(tonnesPerSecond(perYear) * ((n - opened) / 1e3));
			frame = window.requestAnimationFrame(loop);
		};
		frame = window.requestAnimationFrame(loop);
		return () => window.cancelAnimationFrame(frame);
	}, [perYear]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: sink ? "ticker is-sink" : "ticker is-source",
		children: text
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "session",
		children: [
			formatTonnes(session),
			" t since this page opened · ",
			formatRate(tonnesPerSecond(perYear)),
			" t CO₂ each second"
		]
	})] });
}
function Rows({ rows, selected, onSelect }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: rows.map((row) => {
		const on = selected === row.id;
		const rate = tonnesPerSecond(row.gtCO2);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: on ? "ledger-row is-on" : "ledger-row",
			"aria-pressed": on,
			onClick: () => onSelect(row),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "cell-name",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "cell-title",
						children: row.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "cell-meta",
						children: [
							kindLabel(row.kinds),
							" · ",
							CERTAINTY_LABEL[row.certainty]
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "cell-num",
					children: [formatBooks(gtCFromCO2(row.gtCO2)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "unit",
						children: "Gt C / yr"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "cell-num hide-sm",
					children: [formatBooks(row.gtCO2), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "unit",
						children: "Gt CO₂ / yr"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "cell-num",
					children: [formatRate(rate), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "unit",
						children: "t CO₂ / s"
					})]
				})
			]
		}, row.id);
	}) });
}
function fluxAsDetail(flux) {
	const gtCO2 = flux.gtC * (44 / 12);
	return {
		title: flux.title,
		note: flux.note,
		gtC: flux.gtC,
		gtCO2,
		certainty: flux.certainty,
		kinds: flux.kinds
	};
}
function LedgerApp() {
	const now = useSlowClock();
	const [filter, setFilter] = (0, import_react.useState)("net");
	const [nodeId, setNodeId] = (0, import_react.useState)(null);
	const [fluxId, setFluxId] = (0, import_react.useState)("ag-draw");
	const [rowId, setRowId] = (0, import_react.useState)("row-ag-draw");
	const [tickerId, setTickerId] = (0, import_react.useState)("net");
	const ticker = TICKERS.find((item) => item.id === tickerId) ?? TICKERS[0];
	const ppm = maunaLoaPpm(now);
	const globalPpm = globalMeanPpm(now);
	const slope = maunaSlopePpmPerDay(now);
	const selectedFlux = FLUXES.find((flux) => flux.id === fluxId) ?? null;
	const selectedRow = [...SOURCE_ROWS, ...SINK_ROWS].find((row) => row.id === rowId) ?? null;
	const detail = selectedRow ? {
		title: selectedRow.title,
		note: selectedRow.note,
		gtC: gtCFromCO2(selectedRow.gtCO2),
		gtCO2: selectedRow.gtCO2,
		certainty: selectedRow.certainty,
		kinds: selectedRow.kinds
	} : selectedFlux ? fluxAsDetail(selectedFlux) : null;
	const airShare = AIRBORNE_GTCO2 / SOURCES_GTCO2 * 100;
	const oceanShare = OCEAN_GTCO2 / SOURCES_GTCO2 * 100;
	const landShare = LAND_GTCO2 / SOURCES_GTCO2 * 100;
	function selectRow(row) {
		setRowId(row.id);
		setFluxId(row.fluxId);
	}
	function selectFlux(id) {
		setFluxId(id);
		const matches = [...SOURCE_ROWS, ...SINK_ROWS].filter((item) => item.fluxId === id);
		setRowId(matches.length === 1 ? matches[0].id : null);
	}
	function selectNode(id) {
		setNodeId((current) => current === id ? null : id);
	}
	const grossFluxes = FLUXES.filter((flux) => flux.role === "gross");
	const slowFluxes = FLUXES.filter((flux) => flux.role === "slow");
	const hiddenCount = FLUXES.filter((flux) => !fluxVisible(flux, filter)).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "page",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mast",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "brand",
					children: "Carbon Ledger"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "live-flag",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "pip",
							"aria-hidden": "true"
						}),
						"Counting · ",
						formatUtc(now)
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "lede",
				children: "A live count of CO₂ in the air, and the fluxes that move it between rock, vegetation, soils, cropland, the mixed layer, and the deep ocean."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "hero",
				"aria-label": "Live carbon count",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "ticker-kicker",
						children: ticker.verb
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveTonnes, {
						perYear: ticker.gtCO2,
						sink: ticker.id === "ocean" || ticker.id === "land" || ticker.id === "ag"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "unit-line",
						children: "tonnes of CO₂ · 2026 rates, spread evenly across the year"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "chips",
						role: "group",
						"aria-label": "Which running total",
						children: TICKERS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "chip",
							"aria-pressed": item.id === tickerId,
							onClick: () => {
								setTickerId(item.id);
								selectFlux(item.fluxId);
							},
							children: item.label
						}, item.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ppm-block",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "ppm-value",
								children: formatPpm(ppm)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ppm-label",
								children: "ppm · Mauna Loa, reconstructed"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "ppm-value",
								children: formatPpm(globalPpm)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ppm-label",
								children: "ppm · global mean, for the mass"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "ppm-value",
								children: formatStock(atmosphereGtC(now))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ppm-label",
								children: "Gt C in the atmosphere"
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "unit-line",
						children: [
							formatPpm(abovePreindustrial(globalPpm) * 100, 0),
							"% above ",
							278,
							" ppm in 1750. Right now the station trace is moving ",
							slope >= 0 ? "+" : "",
							formatPpm(slope, 2),
							" ppm/day, mostly the seasonal breath of the land, not the fossil trend."
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rates",
					"aria-label": "Tonnes of CO₂ each second",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RateButton, {
							num: formatRate(tonnesPerSecond(FOSSIL_GTCO2)),
							name: "Fossil & cement",
							tone: "source",
							on: tickerId === "fossil",
							onClick: () => {
								setTickerId("fossil");
								selectFlux("fossil");
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RateButton, {
							num: formatRate(tonnesPerSecond(LUC_GTCO2)),
							name: "Land-use change",
							tone: "source",
							on: tickerId === "luc",
							onClick: () => {
								setTickerId("luc");
								selectFlux("deforestation");
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RateButton, {
							num: `−${formatRate(tonnesPerSecond(OCEAN_GTCO2))}`,
							name: "Ocean",
							tone: "sink",
							on: tickerId === "ocean",
							onClick: () => {
								setTickerId("ocean");
								selectFlux("ocean");
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RateButton, {
							num: `−${formatRate(tonnesPerSecond(ECO_GTCO2))}`,
							name: "Land ecosystems",
							tone: "sink",
							on: tickerId === "land",
							onClick: () => {
								setTickerId("land");
								selectFlux("eco-veg");
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RateButton, {
							num: `−${formatRate(tonnesPerSecond(AG_DRAW_GTCO2))}`,
							name: "Cropland drawdown",
							tone: "sink",
							on: tickerId === "ag",
							onClick: () => {
								setTickerId("ag");
								selectFlux("ag-draw");
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RateButton, {
							num: `+${formatRate(tonnesPerSecond(AIRBORNE_GTCO2))}`,
							name: "Stays in the air",
							tone: "net",
							on: tickerId === "net",
							onClick: () => setTickerId("net")
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "section",
				"aria-label": "Where the emissions go",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Where this year's CO₂ goes" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "section-note",
						children: [
							"Of ",
							formatBooks(SOURCES_GTCO2),
							" Gt CO₂ emitted, ",
							Math.round(airShare),
							"% stays airborne,",
							" ",
							Math.round(oceanShare),
							"% enters the ocean, and ",
							Math.round(landShare),
							"% is the land residual. Cropland drawdown, at ",
							formatBooks(AG_DRAW_GTC),
							" Gt C/yr, is about",
							" ",
							formatBooks(AG_DRAW_GTCO2 / SOURCES_GTCO2 * 100),
							"% of emissions —",
							" ",
							formatRate(tonnesPerSecond(AG_DRAW_GTCO2)),
							" tonnes a second, against",
							" ",
							formatRate(tonnesPerSecond(FOSSIL_GTCO2)),
							" from fossil carbon."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bar",
						role: "img",
						"aria-label": `Airborne ${formatBooks(airShare)} percent, ocean ${formatBooks(oceanShare)} percent, land ${formatBooks(landShare)} percent`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "seg-air",
								style: { width: `${airShare}%` }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "seg-ocean",
								style: { width: `${oceanShare}%` }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "seg-land",
								style: { width: `${landShare}%` }
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bar-legend",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "swatch seg-air" }),
								" Airborne ",
								formatBooks(AIRBORNE_GTCO2)
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "swatch seg-ocean" }),
								" Ocean ",
								formatBooks(OCEAN_GTCO2)
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "swatch seg-land" }),
								" Land ",
								formatBooks(LAND_GTCO2)
							] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "regions",
						children: REGIONS.map((region) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "region",
							children: [region.name, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", {
								className: region.change > 0 ? "up" : "down",
								children: [
									region.change > 0 ? "+" : "",
									region.change.toFixed(1),
									"%"
								]
							})]
						}, region.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "section-note",
						children: "Fossil CO₂ direction for 2026. These are changes, not shares of the total."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "section",
				"aria-label": "Flux plate",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "The compartments" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "section-note",
						children: ["Arrow width is logarithmic, so photosynthesis does not erase fossil fuel. Ember flows into the air. Tide flows out of it. A click on a box keeps only the arrows that touch it.", hiddenCount > 0 ? ` ${hiddenCount} fluxes are hidden by this filter.` : ""]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "chips",
						role: "group",
						"aria-label": "Flux filter",
						children: FILTERS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "chip",
							"aria-pressed": filter === item.id,
							onClick: () => setFilter(item.id),
							children: item.label
						}, item.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "plate-scroll",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CyclePlate, {
							now,
							filter,
							nodeId,
							fluxId,
							onNode: selectNode,
							onFlux: selectFlux
						})
					}),
					detail ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "detail",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "ticker-kicker",
								children: [
									kindLabel(detail.kinds),
									" · ",
									CERTAINTY_LABEL[detail.certainty]
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: detail.title }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: detail.note }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "nums",
								children: [
									detail.gtC >= 20 ? formatGross(detail.gtC) : formatBooks(detail.gtC),
									" Gt C/yr ·",
									" ",
									formatBooks(detail.gtCO2),
									" Gt CO₂/yr · ",
									formatRate(tonnesPerSecond(detail.gtCO2)),
									" t CO₂/s"
								]
							})
						]
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "section",
				"aria-label": "Source and sink ledger",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Sources and sinks" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "section-note",
						children: "The rows close. Emissions equal the airborne gain, plus ocean, plus land. Gross turnover is listed underneath and is not added in."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "subhead",
						children: "Into the air"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ledger",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "ledger-head",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Process" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "head-num",
										children: "Gt C / yr"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "head-num hide-sm",
										children: "Gt CO₂ / yr"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "head-num",
										children: "t CO₂ / s"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rows, {
								rows: SOURCE_ROWS,
								selected: rowId,
								onSelect: selectRow
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "total-row",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sources" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [formatBooks(SOURCES_GTCO2), " Gt CO₂"] })]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "subhead",
						children: "Out of the air, and what stays"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ledger",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "ledger-head",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Process" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "head-num",
										children: "Gt C / yr"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "head-num hide-sm",
										children: "Gt CO₂ / yr"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "head-num",
										children: "t CO₂ / s"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rows, {
								rows: SINK_ROWS,
								selected: rowId,
								onSelect: selectRow
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "ledger-row",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "cell-name",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "cell-title",
											children: "Left in the atmosphere"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "cell-meta",
											children: "Reported · +2.2 ppm in 2026"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "cell-num",
										children: [formatBooks(gtCFromCO2(AIRBORNE_GTCO2)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "unit",
											children: "Gt C / yr"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "cell-num hide-sm",
										children: [formatBooks(AIRBORNE_GTCO2), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "unit",
											children: "Gt CO₂ / yr"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "cell-num",
										children: [formatRate(tonnesPerSecond(AIRBORNE_GTCO2)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "unit",
											children: "t CO₂ / s"
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "total-row",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sinks + airborne" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [formatBooks(SOURCES_GTCO2), " Gt CO₂"] })]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "subhead",
						children: "Fast cycle — do not add these to the books"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "ledger",
						children: grossFluxes.map((flux) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: fluxId === flux.id ? "ledger-row is-on" : "ledger-row",
							"aria-pressed": fluxId === flux.id,
							onClick: () => selectFlux(flux.id),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "cell-name",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "cell-title",
										children: flux.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "cell-meta",
										children: [
											kindLabel(flux.kinds),
											" · ",
											CERTAINTY_LABEL[flux.certainty]
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "cell-num",
									children: [formatGross(flux.gtC), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "unit",
										children: "Gt C / yr"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "cell-num hide-sm",
									children: [formatGross(flux.gtC * (44 / 12)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "unit",
										children: "Gt CO₂ / yr"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "cell-num",
									children: [formatRate(tonnesPerSecond(flux.gtC * (44 / 12))), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "unit",
										children: "t CO₂ / s"
									})]
								})
							]
						}, flux.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "subhead",
						children: "Slow geology"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "ledger",
						children: slowFluxes.map((flux) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: fluxId === flux.id ? "ledger-row is-on" : "ledger-row",
							"aria-pressed": fluxId === flux.id,
							onClick: () => {
								selectFlux(flux.id);
								setFilter("chemical");
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "cell-name",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "cell-title",
										children: flux.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "cell-meta",
										children: [
											kindLabel(flux.kinds),
											" · ",
											CERTAINTY_LABEL[flux.certainty]
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "cell-num",
									children: [formatBooks(flux.gtC), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "unit",
										children: "Gt C / yr"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "cell-num hide-sm",
									children: [formatBooks(flux.gtC * (44 / 12)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "unit",
										children: "Gt CO₂ / yr"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "cell-num",
									children: [formatRate(tonnesPerSecond(flux.gtC * (44 / 12))), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "unit",
										children: "t CO₂ / s"
									})]
								})
							]
						}, flux.id))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "section",
				"aria-label": "Mauna Loa history",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Since the record began" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "section-note",
						children: "Rounded Mauna Loa annual means, 1959–2025. Context only. The live figure above is the daily reconstruction, anchored at 428.69 ppm on 14 Nov 2026."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeelingChart, {})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "methods",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Not a live sensor." }), " Mauna Loa publishes a daily mean. Between reports the ppm trace advances by a seasonal curve fit to May, September, and the November rise, plus the 2.2 ppm/yr trend. The tonne counters integrate the 2026 annual rates. They do not know whether this particular second was a power-plant ramp or a quiet night."] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Books." }), " Global Carbon Budget 2026, preliminary (10 Nov 2026): fossil and cement 38.2 Gt CO₂, land use 5.1, airborne gain 2.2 ppm, annual mean 427.7 ppm. Ocean is held at the 2025 sink, 3.2 Gt C. Land is the residual, so it also absorbs the still-unpublished budget imbalance. Anchor concentration: NOAA Mauna Loa daily mean, 14 Nov 2026, 428.69 ppm. One ppm of the global mean is taken as 2.124 Gt C."] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Splits." }),
						" Coal versus gas, and the three pieces of land use, are partitions of reported totals. Cropland drawdown is a working ",
						AG_DRAW_LOW_GTC,
						"–",
						AG_DRAW_HIGH_GTC,
						" Gt C/yr range with ",
						AG_DRAW_GTC,
						" Gt C/yr drawn on the plate, taken out of the land residual rather than added on top. Fast-cycle arrows and stocks are IPCC AR6 orders of magnitude, rounded. The gross air–sea pair is set so its difference equals the ocean sink used here."
					] })
				]
			})
		]
	});
}
function RateButton({ num, name, tone, on, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		className: on ? "rate-row is-on" : "rate-row",
		"aria-pressed": on,
		onClick,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `rate-num ${tone}`,
			children: num
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "rate-name",
			children: name
		})]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LedgerApp, {});
}
//#endregion
export { Home as component };
