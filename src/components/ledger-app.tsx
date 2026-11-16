import { useEffect, useState } from "react";
import { CyclePlate } from "@/components/cycle-plate";
import { KeelingChart } from "@/components/keeling-chart";
import {
  AG_DRAW_GTCO2,
  AG_DRAW_GTC,
  AG_DRAW_HIGH_GTC,
  AG_DRAW_LOW_GTC,
  AIRBORNE_GTCO2,
  CERTAINTY_LABEL,
  ECO_GTCO2,
  FLUXES,
  FOSSIL_GTCO2,
  LAND_GTCO2,
  LUC_GTCO2,
  OCEAN_GTCO2,
  PREINDUSTRIAL_PPM,
  PREVIEW_MS,
  REGIONS,
  SINK_ROWS,
  SOURCE_ROWS,
  SOURCES_GTCO2,
  TICKERS,
  abovePreindustrial,
  atmosphereGtC,
  fluxVisible,
  formatBooks,
  formatGross,
  formatPpm,
  formatRate,
  formatStock,
  formatTonnes,
  formatUtc,
  globalMeanPpm,
  gtCFromCO2,
  kindLabel,
  maunaLoaPpm,
  maunaSlopePpmPerDay,
  tonnesPerSecond,
  tonnesSince,
  type FilterId,
  type Flux,
  type LedgerRow,
  type NodeId,
  type TickerId,
} from "@/lib/budget";

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "net", label: "Net budget" },
  { id: "all", label: "All fluxes" },
  { id: "biological", label: "Biological" },
  { id: "physical", label: "Physical" },
  { id: "chemical", label: "Chemical" },
];

function useSlowClock(): number {
  const [now, setNow] = useState(PREVIEW_MS);
  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

function LiveTonnes({ perYear, sink }: { perYear: number; sink: boolean }) {
  const [text, setText] = useState(() => formatTonnes(tonnesSince(PREVIEW_MS, perYear)));
  const [session, setSession] = useState(0);

  useEffect(() => {
    const opened = Date.now();
    let frame = 0;
    const loop = () => {
      const n = Date.now();
      setText(formatTonnes(tonnesSince(n, perYear)));
      setSession(tonnesPerSecond(perYear) * ((n - opened) / 1000));
      frame = window.requestAnimationFrame(loop);
    };
    frame = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(frame);
  }, [perYear]);

  return (
    <>
      <p className={sink ? "ticker is-sink" : "ticker is-source"}>{text}</p>
      <p className="session">
        {formatTonnes(session)} t since this page opened · {formatRate(tonnesPerSecond(perYear))} t CO₂ each
        second
      </p>
    </>
  );
}

function Rows({
  rows,
  selected,
  onSelect,
}: {
  rows: LedgerRow[];
  selected: string | null;
  onSelect: (row: LedgerRow) => void;
}) {
  return (
    <>
      {rows.map((row) => {
        const on = selected === row.id;
        const rate = tonnesPerSecond(row.gtCO2);
        return (
          <button
            key={row.id}
            type="button"
            className={on ? "ledger-row is-on" : "ledger-row"}
            aria-pressed={on}
            onClick={() => onSelect(row)}
          >
            <span className="cell-name">
              <span className="cell-title">{row.title}</span>
              <span className="cell-meta">
                {kindLabel(row.kinds)} · {CERTAINTY_LABEL[row.certainty]}
              </span>
            </span>
            <span className="cell-num">
              {formatBooks(gtCFromCO2(row.gtCO2))}
              <span className="unit">Gt C / yr</span>
            </span>
            <span className="cell-num hide-sm">
              {formatBooks(row.gtCO2)}
              <span className="unit">Gt CO₂ / yr</span>
            </span>
            <span className="cell-num">
              {formatRate(rate)}
              <span className="unit">t CO₂ / s</span>
            </span>
          </button>
        );
      })}
    </>
  );
}

function fluxAsDetail(flux: Flux): { title: string; note: string; gtC: number; gtCO2: number; certainty: Flux["certainty"]; kinds: Flux["kinds"] } {
  const gtCO2 = flux.gtC * (44 / 12);
  return {
    title: flux.title,
    note: flux.note,
    gtC: flux.gtC,
    gtCO2,
    certainty: flux.certainty,
    kinds: flux.kinds,
  };
}

export function LedgerApp() {
  const now = useSlowClock();
  const [filter, setFilter] = useState<FilterId>("net");
  const [nodeId, setNodeId] = useState<NodeId | null>(null);
  const [fluxId, setFluxId] = useState<string | null>("ag-draw");
  const [rowId, setRowId] = useState<string | null>("row-ag-draw");
  const [tickerId, setTickerId] = useState<TickerId>("net");

  const ticker = TICKERS.find((item) => item.id === tickerId) ?? TICKERS[0];
  const ppm = maunaLoaPpm(now);
  const globalPpm = globalMeanPpm(now);
  const slope = maunaSlopePpmPerDay(now);
  const selectedFlux = FLUXES.find((flux) => flux.id === fluxId) ?? null;
  const selectedRow = [...SOURCE_ROWS, ...SINK_ROWS].find((row) => row.id === rowId) ?? null;

  const detail = selectedRow
    ? {
        title: selectedRow.title,
        note: selectedRow.note,
        gtC: gtCFromCO2(selectedRow.gtCO2),
        gtCO2: selectedRow.gtCO2,
        certainty: selectedRow.certainty,
        kinds: selectedRow.kinds,
      }
    : selectedFlux
      ? fluxAsDetail(selectedFlux)
      : null;

  const airShare = (AIRBORNE_GTCO2 / SOURCES_GTCO2) * 100;
  const oceanShare = (OCEAN_GTCO2 / SOURCES_GTCO2) * 100;
  const landShare = (LAND_GTCO2 / SOURCES_GTCO2) * 100;

  function selectRow(row: LedgerRow) {
    setRowId(row.id);
    setFluxId(row.fluxId);
  }

  function selectFlux(id: string) {
    setFluxId(id);
    const matches = [...SOURCE_ROWS, ...SINK_ROWS].filter((item) => item.fluxId === id);
    setRowId(matches.length === 1 ? matches[0].id : null);
  }

  function selectNode(id: NodeId) {
    setNodeId((current) => (current === id ? null : id));
  }

  const grossFluxes = FLUXES.filter((flux) => flux.role === "gross");
  const slowFluxes = FLUXES.filter((flux) => flux.role === "slow");
  const hiddenCount = FLUXES.filter((flux) => !fluxVisible(flux, filter)).length;

  return (
    <main className="page">
      <header className="mast">
        <div className="brand">Carbon Ledger</div>
        <div className="live-flag">
          <span className="pip" aria-hidden="true" />
          Counting · {formatUtc(now)}
        </div>
      </header>

      <p className="lede">
        A live count of CO₂ in the air, and the fluxes that move it between rock, vegetation, soils,
        cropland, the mixed layer, and the deep ocean.
      </p>

      <section className="hero" aria-label="Live carbon count">
        <div>
          <p className="ticker-kicker">{ticker.verb}</p>
          <LiveTonnes perYear={ticker.gtCO2} sink={ticker.id === "ocean" || ticker.id === "land" || ticker.id === "ag"} />
          <p className="unit-line">tonnes of CO₂ · 2026 rates, spread evenly across the year</p>
          <div className="chips" role="group" aria-label="Which running total">
            {TICKERS.map((item) => (
              <button
                key={item.id}
                type="button"
                className="chip"
                aria-pressed={item.id === tickerId}
                onClick={() => {
                  setTickerId(item.id);
                  selectFlux(item.fluxId);
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="ppm-block">
            <div>
              <div className="ppm-value">{formatPpm(ppm)}</div>
              <span className="ppm-label">ppm · Mauna Loa, reconstructed</span>
            </div>
            <div>
              <div className="ppm-value">{formatPpm(globalPpm)}</div>
              <span className="ppm-label">ppm · global mean, for the mass</span>
            </div>
            <div>
              <div className="ppm-value">{formatStock(atmosphereGtC(now))}</div>
              <span className="ppm-label">Gt C in the atmosphere</span>
            </div>
          </div>
          <p className="unit-line">
            {formatPpm(abovePreindustrial(globalPpm) * 100, 0)}% above {PREINDUSTRIAL_PPM} ppm in 1750.
            Right now the station trace is moving {slope >= 0 ? "+" : ""}
            {formatPpm(slope, 2)} ppm/day, mostly the seasonal breath of the land, not the fossil trend.
          </p>
        </div>

        <div className="rates" aria-label="Tonnes of CO₂ each second">
          <RateButton
            num={formatRate(tonnesPerSecond(FOSSIL_GTCO2))}
            name="Fossil & cement"
            tone="source"
            on={tickerId === "fossil"}
            onClick={() => {
              setTickerId("fossil");
              selectFlux("fossil");
            }}
          />
          <RateButton
            num={formatRate(tonnesPerSecond(LUC_GTCO2))}
            name="Land-use change"
            tone="source"
            on={tickerId === "luc"}
            onClick={() => {
              setTickerId("luc");
              selectFlux("deforestation");
            }}
          />
          <RateButton
            num={`−${formatRate(tonnesPerSecond(OCEAN_GTCO2))}`}
            name="Ocean"
            tone="sink"
            on={tickerId === "ocean"}
            onClick={() => {
              setTickerId("ocean");
              selectFlux("ocean");
            }}
          />
          <RateButton
            num={`−${formatRate(tonnesPerSecond(ECO_GTCO2))}`}
            name="Land ecosystems"
            tone="sink"
            on={tickerId === "land"}
            onClick={() => {
              setTickerId("land");
              selectFlux("eco-veg");
            }}
          />
          <RateButton
            num={`−${formatRate(tonnesPerSecond(AG_DRAW_GTCO2))}`}
            name="Cropland drawdown"
            tone="sink"
            on={tickerId === "ag"}
            onClick={() => {
              setTickerId("ag");
              selectFlux("ag-draw");
            }}
          />
          <RateButton
            num={`+${formatRate(tonnesPerSecond(AIRBORNE_GTCO2))}`}
            name="Stays in the air"
            tone="net"
            on={tickerId === "net"}
            onClick={() => setTickerId("net")}
          />
        </div>
      </section>

      <section className="section" aria-label="Where the emissions go">
        <h2>Where this year's CO₂ goes</h2>
        <p className="section-note">
          Of {formatBooks(SOURCES_GTCO2)} Gt CO₂ emitted, {Math.round(airShare)}% stays airborne,{" "}
          {Math.round(oceanShare)}% enters the ocean, and {Math.round(landShare)}% is the land residual.
          Cropland drawdown, at {formatBooks(AG_DRAW_GTC)} Gt C/yr, is about{" "}
          {formatBooks((AG_DRAW_GTCO2 / SOURCES_GTCO2) * 100)}% of emissions —{" "}
          {formatRate(tonnesPerSecond(AG_DRAW_GTCO2))} tonnes a second, against{" "}
          {formatRate(tonnesPerSecond(FOSSIL_GTCO2))} from fossil carbon.
        </p>
        <div
          className="bar"
          role="img"
          aria-label={`Airborne ${formatBooks(airShare)} percent, ocean ${formatBooks(oceanShare)} percent, land ${formatBooks(landShare)} percent`}
        >
          <span className="seg-air" style={{ width: `${airShare}%` }} />
          <span className="seg-ocean" style={{ width: `${oceanShare}%` }} />
          <span className="seg-land" style={{ width: `${landShare}%` }} />
        </div>
        <div className="bar-legend">
          <span>
            <i className="swatch seg-air" /> Airborne {formatBooks(AIRBORNE_GTCO2)}
          </span>
          <span>
            <i className="swatch seg-ocean" /> Ocean {formatBooks(OCEAN_GTCO2)}
          </span>
          <span>
            <i className="swatch seg-land" /> Land {formatBooks(LAND_GTCO2)}
          </span>
        </div>
        <ul className="regions">
          {REGIONS.map((region) => (
            <li key={region.id} className="region">
              {region.name}
              <b className={region.change > 0 ? "up" : "down"}>
                {region.change > 0 ? "+" : ""}
                {region.change.toFixed(1)}%
              </b>
            </li>
          ))}
        </ul>
        <p className="section-note">
          Fossil CO₂ direction for 2026. These are changes, not shares of the total.
        </p>
      </section>

      <section className="section" aria-label="Flux plate">
        <h2>The compartments</h2>
        <p className="section-note">
          Arrow width is logarithmic, so photosynthesis does not erase fossil fuel. Ember flows into the
          air. Tide flows out of it. A click on a box keeps only the arrows that touch it.
          {hiddenCount > 0 ? ` ${hiddenCount} fluxes are hidden by this filter.` : ""}
        </p>
        <div className="chips" role="group" aria-label="Flux filter">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              className="chip"
              aria-pressed={filter === item.id}
              onClick={() => setFilter(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="plate-scroll">
          <CyclePlate
            now={now}
            filter={filter}
            nodeId={nodeId}
            fluxId={fluxId}
            onNode={selectNode}
            onFlux={selectFlux}
          />
        </div>
        {detail ? (
          <div className="detail">
            <p className="ticker-kicker">
              {kindLabel(detail.kinds)} · {CERTAINTY_LABEL[detail.certainty]}
            </p>
            <h3>{detail.title}</h3>
            <p>{detail.note}</p>
            <p className="nums">
              {detail.gtC >= 20 ? formatGross(detail.gtC) : formatBooks(detail.gtC)} Gt C/yr ·{" "}
              {formatBooks(detail.gtCO2)} Gt CO₂/yr · {formatRate(tonnesPerSecond(detail.gtCO2))} t CO₂/s
            </p>
          </div>
        ) : null}
      </section>

      <section className="section" aria-label="Source and sink ledger">
        <h2>Sources and sinks</h2>
        <p className="section-note">
          The rows close. Emissions equal the airborne gain, plus ocean, plus land. Gross turnover is listed
          underneath and is not added in.
        </p>
        <h3 className="subhead">Into the air</h3>
        <div className="ledger">
          <div className="ledger-head">
            <span>Process</span>
            <span className="head-num">Gt C / yr</span>
            <span className="head-num hide-sm">Gt CO₂ / yr</span>
            <span className="head-num">t CO₂ / s</span>
          </div>
          <Rows rows={SOURCE_ROWS} selected={rowId} onSelect={selectRow} />
          <div className="total-row">
            <span>Sources</span>
            <span>{formatBooks(SOURCES_GTCO2)} Gt CO₂</span>
          </div>
        </div>
        <h3 className="subhead">Out of the air, and what stays</h3>
        <div className="ledger">
          <div className="ledger-head">
            <span>Process</span>
            <span className="head-num">Gt C / yr</span>
            <span className="head-num hide-sm">Gt CO₂ / yr</span>
            <span className="head-num">t CO₂ / s</span>
          </div>
          <Rows rows={SINK_ROWS} selected={rowId} onSelect={selectRow} />
          <div className="ledger-row">
            <span className="cell-name">
              <span className="cell-title">Left in the atmosphere</span>
              <span className="cell-meta">Reported · +2.2 ppm in 2026</span>
            </span>
            <span className="cell-num">
              {formatBooks(gtCFromCO2(AIRBORNE_GTCO2))}
              <span className="unit">Gt C / yr</span>
            </span>
            <span className="cell-num hide-sm">
              {formatBooks(AIRBORNE_GTCO2)}
              <span className="unit">Gt CO₂ / yr</span>
            </span>
            <span className="cell-num">
              {formatRate(tonnesPerSecond(AIRBORNE_GTCO2))}
              <span className="unit">t CO₂ / s</span>
            </span>
          </div>
          <div className="total-row">
            <span>Sinks + airborne</span>
            <span>{formatBooks(SOURCES_GTCO2)} Gt CO₂</span>
          </div>
        </div>

        <h3 className="subhead">Fast cycle — do not add these to the books</h3>
        <div className="ledger">
          {grossFluxes.map((flux) => (
            <button
              key={flux.id}
              type="button"
              className={fluxId === flux.id ? "ledger-row is-on" : "ledger-row"}
              aria-pressed={fluxId === flux.id}
              onClick={() => selectFlux(flux.id)}
            >
              <span className="cell-name">
                <span className="cell-title">{flux.title}</span>
                <span className="cell-meta">
                  {kindLabel(flux.kinds)} · {CERTAINTY_LABEL[flux.certainty]}
                </span>
              </span>
              <span className="cell-num">
                {formatGross(flux.gtC)}
                <span className="unit">Gt C / yr</span>
              </span>
              <span className="cell-num hide-sm">
                {formatGross(flux.gtC * (44 / 12))}
                <span className="unit">Gt CO₂ / yr</span>
              </span>
              <span className="cell-num">
                {formatRate(tonnesPerSecond(flux.gtC * (44 / 12)))}
                <span className="unit">t CO₂ / s</span>
              </span>
            </button>
          ))}
        </div>

        <h3 className="subhead">Slow geology</h3>
        <div className="ledger">
          {slowFluxes.map((flux) => (
            <button
              key={flux.id}
              type="button"
              className={fluxId === flux.id ? "ledger-row is-on" : "ledger-row"}
              aria-pressed={fluxId === flux.id}
              onClick={() => {
                selectFlux(flux.id);
                setFilter("chemical");
              }}
            >
              <span className="cell-name">
                <span className="cell-title">{flux.title}</span>
                <span className="cell-meta">
                  {kindLabel(flux.kinds)} · {CERTAINTY_LABEL[flux.certainty]}
                </span>
              </span>
              <span className="cell-num">
                {formatBooks(flux.gtC)}
                <span className="unit">Gt C / yr</span>
              </span>
              <span className="cell-num hide-sm">
                {formatBooks(flux.gtC * (44 / 12))}
                <span className="unit">Gt CO₂ / yr</span>
              </span>
              <span className="cell-num">
                {formatRate(tonnesPerSecond(flux.gtC * (44 / 12)))}
                <span className="unit">t CO₂ / s</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="section" aria-label="Mauna Loa history">
        <h2>Since the record began</h2>
        <p className="section-note">
          Rounded Mauna Loa annual means, 1959–2025. Context only. The live figure above is the daily
          reconstruction, anchored at 428.69 ppm on 14 Nov 2026.
        </p>
        <KeelingChart />
      </section>

      <footer className="methods">
        <p>
          <strong>Not a live sensor.</strong> Mauna Loa publishes a daily mean. Between reports the ppm trace
          advances by a seasonal curve fit to May, September, and the November rise, plus the 2.2 ppm/yr
          trend. The tonne counters integrate the 2026 annual rates. They do not know whether this particular
          second was a power-plant ramp or a quiet night.
        </p>
        <p>
          <strong>Books.</strong> Global Carbon Budget 2026, preliminary (10 Nov 2026): fossil and cement 38.2
          Gt CO₂, land use 5.1, airborne gain 2.2 ppm, annual mean 427.7 ppm. Ocean is held at the 2025 sink,
          3.2 Gt C. Land is the residual, so it also absorbs the still-unpublished budget imbalance. Anchor
          concentration: NOAA Mauna Loa daily mean, 14 Nov 2026, 428.69 ppm. One ppm of the global mean is
          taken as 2.124 Gt C.
        </p>
        <p>
          <strong>Splits.</strong> Coal versus gas, and the three pieces of land use, are partitions of
          reported totals. Cropland drawdown is a working {AG_DRAW_LOW_GTC}–{AG_DRAW_HIGH_GTC} Gt C/yr range
          with {AG_DRAW_GTC} Gt C/yr drawn on the plate, taken out of the land residual rather than added on
          top. Fast-cycle arrows and stocks are IPCC AR6 orders of magnitude, rounded. The gross air–sea pair
          is set so its difference equals the ocean sink used here.
        </p>
      </footer>
    </main>
  );
}

function RateButton({
  num,
  name,
  tone,
  on,
  onClick,
}: {
  num: string;
  name: string;
  tone: "source" | "sink" | "net";
  on: boolean;
  onClick: () => void;
}) {
  return (
    <button type="button" className={on ? "rate-row is-on" : "rate-row"} aria-pressed={on} onClick={onClick}>
      <span className={`rate-num ${tone}`}>{num}</span>
      <span className="rate-name">{name}</span>
    </button>
  );
}
