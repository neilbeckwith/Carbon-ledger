import { RESIDUAL_LABEL, SOURCE_LABEL, type Citation, type FluxSourcing, type SourceId } from "@/lib/sources";

export function SourceMark({ id }: { id: SourceId }) {
  return (
    <a className="cite" href={`#bib-${id}`}>
      {SOURCE_LABEL[id]}
    </a>
  );
}

export function Cite({ cite }: { cite: Citation }) {
  return (
    <>
      <SourceMark id={cite.source} />
      <span className="cite-note"> — {cite.note}</span>
    </>
  );
}

export function ResidualLabel() {
  return <span className="cite-note">{RESIDUAL_LABEL}</span>;
}

export function Sourcing({ sourcing }: { sourcing: FluxSourcing | null }) {
  if (sourcing === null) return null;
  if (sourcing === "residual") return <ResidualLabel />;
  return <Cite cite={sourcing} />;
}

export function Bibliography() {
  return (
    <section className="section bibliography" id="bibliography" aria-label="Bibliography">
      <h2>Bibliography / Sources</h2>
      <p className="section-note">
        Each marker above names its source type and links here. Cropland drawdown, and the split of the land
        residual into ecosystems and non-crop soils, are a working estimate carved from the land residual. They
        are not a GCP line and they are not additional, so they have no external source.
      </p>
      <ol className="bib-list">
        <li id="bib-gcp">
          <span className="bib-kind">{SOURCE_LABEL.gcp}.</span> Friedlingstein, P. et al. (2026). Global Carbon
          Budget 2026. Earth System Science Data Discussions. Preprint under review.{" "}
          <a href="https://doi.org/10.5194/essd-2026-895">https://doi.org/10.5194/essd-2026-895</a>. Data: Global
          Carbon Project,{" "}
          <a href="https://doi.org/10.18160/GCP-2026">https://doi.org/10.18160/GCP-2026</a>.
        </li>
        <li id="bib-noaa">
          <span className="bib-kind">{SOURCE_LABEL.noaa}.</span> NOAA Global Monitoring Laboratory. Trends in
          Atmospheric Carbon Dioxide (Mauna Loa). Lan, X., Tans, P., Thoning, K. &amp; Keeling, R.{" "}
          <a href="https://gml.noaa.gov/ccgg/trends/">https://gml.noaa.gov/ccgg/trends/</a>.
        </li>
        <li id="bib-ipcc">
          <span className="bib-kind">{SOURCE_LABEL.ipcc}.</span> IPCC (2021). Chapter 5: Global Carbon and Other
          Biogeochemical Cycles and Feedbacks. Climate Change 2021: The Physical Science Basis. Contribution of
          Working Group I.{" "}
          <a href="https://doi.org/10.1017/9781009157896.007">https://doi.org/10.1017/9781009157896.007</a>.
        </li>
        <li id="bib-ice">
          <span className="bib-kind">{SOURCE_LABEL.ice}.</span> Etheridge, D. M. et al. (1996). Natural and
          anthropogenic changes in atmospheric CO₂ over the last 1000 years from air in Antarctic ice and firn.
          Journal of Geophysical Research 101(D2):4115–4128.{" "}
          <a href="https://doi.org/10.1029/95JD03410">https://doi.org/10.1029/95JD03410</a>.
        </li>
      </ol>
    </section>
  );
}
