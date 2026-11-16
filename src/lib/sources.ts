/** Bibliography and the claim-to-source notes.
 *
 * Citation copy is sourcing only. It does not replace a figure on the page.
 */

export type SourceId = "gcp" | "ballantyne" | "noaa" | "ipcc" | "ice";

export const SOURCE_LABEL: Record<SourceId, string> = {
  gcp: "GCP 2026 preprint",
  ballantyne: "Ballantyne et al. 2012",
  noaa: "NOAA GML observations",
  ipcc: "IPCC AR6 WGI Ch5 assessment",
  ice: "ice-core paper",
};

export type Citation = {
  source: SourceId;
  note: string;
};

export const CITE = {
  airborne: {
    source: "gcp",
    note: "an integration of the 2026 airborne gain (4.67 Gt C/yr), from the GCP 2026 projected atmospheric growth (Friedlingstein et al.).",
  },
  atmosphere: {
    source: "noaa",
    note: "Mauna Loa daily means (recent ~428.7 ppm) plus the seasonal curve and the 2.2 ppm/yr trend. Mass from ~2.12 Gt C/ppm.",
  },
  preindustrial: {
    source: "ice",
    note: "pre-industrial 278 ppm from Etheridge et al. 1996 (as used by GCP).",
  },
  total: {
    source: "gcp",
    note: "fossil & cement ~38.2 + land-use ~5.1. Friedlingstein et al. 2026.",
  },
  partition: {
    source: "gcp",
    note: "GCP 2026 partition. Ocean held at 3.20 Gt C from 2025.",
  },
  fossil: {
    source: "gcp",
    note: "coal 4.40 + oil 3.44 + gas 2.37 + cement net 0.21 Gt C.",
  },
  luc: {
    source: "gcp",
    note: "land-use ~5.1 Gt CO₂ (deforestation 0.93 + peat 0.33 + shifting 0.14 Gt C).",
  },
  ocean: {
    source: "gcp",
    note: "held from the 2025 GCP (3.20 Gt C).",
  },
  countries: {
    source: "gcp",
    note: "national estimates.",
  },
  terrestrial: {
    source: "ipcc",
    note: "rounded IPCC AR6 WGI Ch. 5 terrestrial scale.",
  },
  oceanGross: {
    source: "ipcc",
    note: "rounded IPCC AR6 ocean scales.",
  },
  geology: {
    source: "ipcc",
    note: "IPCC scale.",
  },
} as const satisfies Record<string, Citation>;

export const RESIDUAL_LABEL =
  "Working estimate carved from the land residual. Not a GCP line, and not additional.";

const TERRESTRIAL_IDS = new Set(["gpp", "ra", "rh", "litter", "fire", "harvest"]);
const OCEAN_GROSS_IDS = new Set([
  "invasion",
  "evasion",
  "bio-export",
  "bio-return",
  "downwelling",
  "upwelling",
]);
const GEOLOGY_IDS = new Set(["weathering", "volcanism", "burial"]);
const LUC_IDS = new Set(["deforestation", "peat", "ag-loss"]);
const RESIDUAL_IDS = new Set(["eco-veg", "eco-soil", "ag-draw"]);

export type FluxSourcing = Citation | "residual";

/** Sourcing for a flux arrow. Null when this flux is not in the supplied mapping. */
export function fluxSourcing(id: string): FluxSourcing | null {
  if (id === "fossil") return CITE.fossil;
  if (LUC_IDS.has(id)) return CITE.luc;
  if (RESIDUAL_IDS.has(id)) return "residual";
  if (id === "ocean" || id === "export") return CITE.ocean;
  if (TERRESTRIAL_IDS.has(id)) return CITE.terrestrial;
  if (OCEAN_GROSS_IDS.has(id)) return CITE.oceanGross;
  if (GEOLOGY_IDS.has(id)) return CITE.geology;
  return null;
}

const FOSSIL_ROWS = new Set(["coal", "oil", "gas", "cement"]);
const LUC_ROWS = new Set(["row-deforest", "row-peat", "row-ag-loss"]);
const RESIDUAL_ROWS = new Set(["row-eco-veg", "row-eco-soil", "row-ag-draw"]);

export function rowSourcing(id: string): FluxSourcing | null {
  if (FOSSIL_ROWS.has(id)) return CITE.fossil;
  if (LUC_ROWS.has(id)) return CITE.luc;
  if (id === "row-ocean") return CITE.ocean;
  if (RESIDUAL_ROWS.has(id)) return "residual";
  return null;
}
