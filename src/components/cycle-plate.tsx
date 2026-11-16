import { useId } from "react";
import {
  FLUXES,
  STOCKS,
  atmosphereGtC,
  fluxVisible,
  formatBooks,
  formatStock,
  type FilterId,
  type Flux,
  type NodeId,
} from "@/lib/budget";

type Port =
  | "veg-e"
  | "veg-s"
  | "soil-e"
  | "soil-n"
  | "ag-e"
  | "atm-w1"
  | "atm-w2"
  | "atm-w3"
  | "atm-e1"
  | "atm-e2"
  | "atm-s1"
  | "atm-s2"
  | "surf-w"
  | "surf-s"
  | "deep-w"
  | "deep-n"
  | "geo-n2"
  | "geo-e";

const PORT: Record<Port, { x: number; y: number }> = {
  "veg-e": { x: 280, y: 96 },
  "veg-s": { x: 150, y: 156 },
  "soil-e": { x: 280, y: 400 },
  "soil-n": { x: 150, y: 330 },
  "ag-e": { x: 280, y: 690 },
  "atm-w1": { x: 480, y: 250 },
  "atm-w2": { x: 480, y: 320 },
  "atm-w3": { x: 480, y: 390 },
  "atm-e1": { x: 760, y: 260 },
  "atm-e2": { x: 760, y: 340 },
  "atm-s1": { x: 560, y: 460 },
  "atm-s2": { x: 640, y: 460 },
  "surf-w": { x: 960, y: 96 },
  "surf-s": { x: 1080, y: 156 },
  "deep-w": { x: 960, y: 420 },
  "deep-n": { x: 1080, y: 330 },
  "geo-n2": { x: 640, y: 640 },
  "geo-e": { x: 760, y: 720 },
};

const LINKS: Record<string, { from: Port; to: Port; bend: number }> = {
  fossil: { from: "geo-n2", to: "atm-s2", bend: 0 },
  deforestation: { from: "veg-e", to: "atm-w1", bend: -48 },
  peat: { from: "soil-e", to: "atm-w3", bend: -36 },
  "ag-loss": { from: "ag-e", to: "atm-w3", bend: 70 },
  "eco-veg": { from: "atm-w1", to: "veg-e", bend: 22 },
  "eco-soil": { from: "atm-w2", to: "soil-e", bend: 28 },
  "ag-draw": { from: "atm-s1", to: "ag-e", bend: -90 },
  ocean: { from: "atm-e2", to: "surf-w", bend: -30 },
  export: { from: "surf-s", to: "deep-n", bend: 46 },
  gpp: { from: "atm-w1", to: "veg-e", bend: -90 },
  ra: { from: "veg-e", to: "atm-w2", bend: 10 },
  rh: { from: "soil-e", to: "atm-w2", bend: 55 },
  litter: { from: "veg-s", to: "soil-n", bend: -70 },
  fire: { from: "veg-e", to: "atm-w2", bend: -16 },
  harvest: { from: "veg-s", to: "atm-w3", bend: 110 },
  invasion: { from: "atm-e1", to: "surf-w", bend: -70 },
  evasion: { from: "surf-w", to: "atm-e2", bend: 50 },
  "bio-export": { from: "surf-s", to: "deep-n", bend: -50 },
  "bio-return": { from: "deep-w", to: "surf-s", bend: 36 },
  downwelling: { from: "surf-s", to: "deep-w", bend: 80 },
  upwelling: { from: "deep-n", to: "surf-s", bend: 16 },
  weathering: { from: "atm-s1", to: "geo-n2", bend: -70 },
  volcanism: { from: "geo-n2", to: "atm-s2", bend: 70 },
  burial: { from: "deep-n", to: "geo-e", bend: 40 },
};

const SKIP_WHEN_ALL = new Set(["eco-veg", "eco-soil", "ocean", "export"]);
const LABEL_AT: Record<string, { x: number; y: number }> = {
  fossil: { x: 730, y: 548 },
  deforestation: { x: 390, y: 78 },
  peat: { x: 390, y: 300 },
  "ag-loss": { x: 380, y: 540 },
  "eco-veg": { x: 390, y: 170 },
  "eco-soil": { x: 390, y: 500 },
  "ag-draw": { x: 380, y: 600 },
  ocean: { x: 860, y: 200 },
  export: { x: 1120, y: 250 },
};

type NodeSpec = {
  id: NodeId;
  x: number;
  y: number;
  w: number;
  h: number;
  kicker: string;
  title: string;
  sub: string;
};

const NODES: NodeSpec[] = [
  {
    id: "veg",
    x: 36,
    y: 28,
    w: 244,
    h: 128,
    kicker: "SURFACE TERRESTRIAL",
    title: "Vegetation",
    sub: "Leaves, wood, roots",
  },
  {
    id: "surf",
    x: 960,
    y: 28,
    w: 230,
    h: 128,
    kicker: "OCEAN SURFACE",
    title: "Mixed layer",
    sub: "Living plankton ~3 Gt C",
  },
  {
    id: "atm",
    x: 480,
    y: 200,
    w: 280,
    h: 260,
    kicker: "ATMOSPHERE",
    title: "The air",
    sub: "Global mean, for the mass",
  },
  {
    id: "soil",
    x: 36,
    y: 330,
    w: 244,
    h: 140,
    kicker: "TERRESTRIAL DEPTH",
    title: "Soils",
    sub: "Permafrost mostly frozen",
  },
  {
    id: "deep",
    x: 960,
    y: 330,
    w: 230,
    h: 150,
    kicker: "OCEAN DEPTH",
    title: "Deep ocean",
    sub: "Intermediate water too",
  },
  {
    id: "ag",
    x: 36,
    y: 620,
    w: 244,
    h: 130,
    kicker: "CROPLAND",
    title: "Fields",
    sub: "Part of the soil stock",
  },
  {
    id: "geo",
    x: 480,
    y: 640,
    w: 280,
    h: 150,
    kicker: "GEOLOGICAL CARBON",
    title: "Rock & fossil",
    sub: "Rock carbon is vast",
  },
];

function stockLine(id: NodeId, now: number): string {
  switch (id) {
    case "atm":
      return `${formatStock(atmosphereGtC(now))} Gt C`;
    case "veg":
      return `${formatStock(STOCKS.vegetation)} Gt C`;
    case "soil":
      return `${formatStock(STOCKS.soils)} Gt C`;
    case "ag":
      return "Not a separate stock";
    case "surf":
      return `${formatStock(STOCKS.surfaceOcean)} Gt C`;
    case "deep":
      return `${formatStock(STOCKS.deepOcean)} Gt C`;
    case "geo":
      return `~${formatStock(STOCKS.fossilLeft)} Gt C to burn`;
  }
}

function curve(from: Port, to: Port, bend: number): string {
  const a = PORT[from];
  const b = PORT[to];
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const cx = (a.x + b.x) / 2 + (-dy / len) * bend;
  const cy = (a.y + b.y) / 2 + (dx / len) * bend;
  return `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`;
}

function tone(flux: Flux): "ember" | "tide" | "mist" {
  if (flux.to === "atm") return "ember";
  if (flux.from === "atm") return "tide";
  return "mist";
}

function widthOf(flux: Flux): number {
  const raw = 1.2 + Math.log10(Math.max(flux.gtC, 0.08)) * 1.5;
  const emphasis = flux.role === "gross" ? 1 : 1.25;
  return Math.max(1.25, Math.min(5.4, raw * emphasis));
}

function particleCount(gtC: number): number {
  if (gtC < 0.25) return 1;
  if (gtC < 2) return 2;
  if (gtC < 20) return 3;
  return 4;
}

export function CyclePlate({
  now,
  filter,
  nodeId,
  fluxId,
  onNode,
  onFlux,
}: {
  now: number;
  filter: FilterId;
  nodeId: NodeId | null;
  fluxId: string | null;
  onNode: (id: NodeId) => void;
  onFlux: (id: string) => void;
}) {
  const markerBase = useId().replace(/:/g, "");
  const shown = FLUXES.filter((flux) => {
    if (flux.id === fluxId) return true;
    if (filter === "all" && SKIP_WHEN_ALL.has(flux.id)) return false;
    if (!fluxVisible(flux, filter)) return false;
    if (nodeId && flux.from !== nodeId && flux.to !== nodeId) return false;
    return true;
  });

  return (
    <svg className="plate" viewBox="0 0 1220 830" role="group" aria-label="Carbon compartments and fluxes">
      <defs>
        {(["ember", "tide", "mist"] as const).map((name) => (
          <marker
            key={name}
            id={`${markerBase}-${name}`}
            viewBox="0 0 8 8"
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="4"
            orient="auto"
          >
            <path d="M1 1.2 L7 4 L1 6.8" fill="none" stroke={`var(--color-${name})`} strokeWidth="1.2" />
          </marker>
        ))}
      </defs>

      {shown.map((flux) => {
        const link = LINKS[flux.id];
        if (!link) return null;
        const d = curve(link.from, link.to, link.bend);
        const color = tone(flux);
        const selected = flux.id === fluxId;
        const dim = fluxId !== null && !selected;
        const opacity = dim ? 0.12 : flux.role === "gross" ? 0.28 : 0.95;
        const sw = widthOf(flux) + (selected ? 1.2 : 0);
        const count = particleCount(flux.gtC);
        const dur = 7;
        return (
          <g key={flux.id} opacity={opacity}>
            <path
              d={d}
              fill="none"
              stroke={`var(--color-${color})`}
              strokeWidth={sw}
              markerEnd={`url(#${markerBase}-${color})`}
            />
            <path className="hit" d={d} onClick={() => onFlux(flux.id)} />
            {Array.from({ length: count }, (_, i) => (
              <circle key={i} className="particle" r={selected ? 3.2 : 2.2} fill={`var(--color-${color})`}>
                <animateMotion
                  dur={`${dur}s`}
                  begin={`${-(i * dur) / count}s`}
                  repeatCount="indefinite"
                  path={d}
                />
              </circle>
            ))}
          </g>
        );
      })}

      {NODES.map((node) => {
        const on = nodeId === node.id;
        return (
          <g
            key={node.id}
            role="button"
            tabIndex={0}
            aria-pressed={on}
            aria-label={`${node.title}, ${stockLine(node.id, now)}`}
            onClick={() => onNode(node.id)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onNode(node.id);
              }
            }}
          >
            <rect
              className={on ? "node-shape is-on" : "node-shape"}
              x={node.x}
              y={node.y}
              width={node.w}
              height={node.h}
              rx="10"
            />
            <text className="kicker" x={node.x + 16} y={node.y + 26}>
              {node.kicker}
            </text>
            <text className="node-title" x={node.x + 16} y={node.y + 54}>
              {node.title}
            </text>
            <text className="node-stock" x={node.x + 16} y={node.y + 80}>
              {stockLine(node.id, now)}
            </text>
            <text className="node-sub" x={node.x + 16} y={node.y + 104}>
              {node.sub}
            </text>
          </g>
        );
      })}

      {shown.map((flux) => {
        const show = flux.id === fluxId || (filter === "net" && LABEL_AT[flux.id]);
        const at = LABEL_AT[flux.id];
        if (!show || !at) return null;
        const magnitude =
          flux.role === "gross" || flux.role === "slow" ? "" : ` ${formatBooks(flux.gtC)}`;
        const label = `${flux.short}${magnitude}`;
        const w = Math.max(72, label.length * 6.6 + 16);
        return (
          <g key={`${flux.id}-label`} transform={`translate(${at.x} ${at.y})`} onClick={() => onFlux(flux.id)}>
            <rect x={-w / 2} y={-12} width={w} height={24} rx="5" fill="var(--color-ink)" stroke="var(--color-line)" />
            <text className="flux-label" textAnchor="middle" y={4}>
              {label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
