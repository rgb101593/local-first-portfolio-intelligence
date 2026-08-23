import { useMemo, useState } from "react";
import { factsForSection } from "./ai/grounding.js";
import {
  dailyPacket,
  portfolioMetrics,
  properties,
  sampleDailyInsight,
  sampleWeeklyInsight,
  trend,
  weeklyPacket,
} from "./data/synthetic.js";
import type { Period } from "./domain/types.js";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const TrendChart = () => {
  const points = trend.map((point, index) => {
    const x = 24 + index * (552 / (trend.length - 1));
    const y = 126 - ((point.occupancy - 92.5) / 2.5) * 92;
    return { ...point, x, y };
  });
  return (
    <div className="chart-wrap">
      <svg
        viewBox="0 0 600 160"
        role="img"
        aria-label="Six-week synthetic occupancy trend"
      >
        <defs>
          <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#5ee6b7" stopOpacity=".28" />
            <stop offset="1" stopColor="#5ee6b7" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[44, 84, 124].map((y) => (
          <line key={y} x1="24" x2="576" y1={y} y2={y} className="grid-line" />
        ))}
        <path
          d={`M ${points.map((p) => `${p.x} ${p.y}`).join(" L ")} L 576 136 L 24 136 Z`}
          fill="url(#area)"
        />
        <polyline
          points={points.map((p) => `${p.x},${p.y}`).join(" ")}
          className="trend-line"
        />
        {points.map((p) => (
          <circle key={p.label} cx={p.x} cy={p.y} r="4" className="trend-dot" />
        ))}
      </svg>
      <div className="chart-labels">
        {trend.map((p) => (
          <span key={p.label}>{p.label}</span>
        ))}
      </div>
    </div>
  );
};

export const App = () => {
  const [period, setPeriod] = useState<Period>("weekly");
  const metrics = portfolioMetrics[period];
  const insight = period === "daily" ? sampleDailyInsight : sampleWeeklyInsight;
  const insightPacket = period === "daily" ? dailyPacket : weeklyPacket;
  const sortedProperties = useMemo(
    () =>
      [...properties].sort(
        (a, b) => Math.abs(b.occupancyDelta) - Math.abs(a.occupancyDelta),
      ),
    [],
  );

  return (
    <main>
      <header className="topbar">
        <a
          className="brand"
          href="#top"
          aria-label="Atlas Portfolio Intelligence home"
        >
          <span className="mark">A</span>
          <span>
            <strong>ATLAS</strong>
            <small>PORTFOLIO INTELLIGENCE</small>
          </span>
        </a>
        <span className="demo-pill">Synthetic reference implementation</span>
      </header>

      <section className="hero" id="top">
        <div>
          <p className="eyebrow">MULTIFAMILY OPERATING BRIEF</p>
          <h1>
            Portfolio intelligence,
            <br />
            without the data exhaust.
          </h1>
          <p className="lede">
            Validated operating data, canonical portfolio aggregation, and
            grounded local-AI analysis, designed around a strict privacy
            boundary.
          </p>
        </div>
        <div className="as-of">
          <span>Reporting date</span>
          <strong>August 23, 2026</strong>
          <small>Five synthetic properties · 862 units</small>
        </div>
      </section>

      <nav className="period-switch" aria-label="Reporting period">
        {(["daily", "weekly"] as const).map((value) => (
          <button
            key={value}
            className={period === value ? "active" : ""}
            aria-pressed={period === value}
            onClick={() => setPeriod(value)}
          >
            {value}
          </button>
        ))}
      </nav>

      <section className="kpi-grid" aria-label={`${period} portfolio metrics`}>
        {metrics.map((metric) => (
          <article className="kpi" key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small className={metric.favourable ? "good" : "bad"}>
              {metric.delta}
            </small>
          </article>
        ))}
      </section>

      <div className="content-grid">
        <section className="panel trend-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">DIRECTION OF TRAVEL</p>
              <h2>Physical occupancy trend</h2>
            </div>
            <span className="status">
              <i /> Improving
            </span>
          </div>
          <TrendChart />
        </section>

        <section className="panel ai-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">LOCAL AI BRIEFING</p>
              <h2>{insight.headline}</h2>
            </div>
            <span className="model-pill">Qwen3.8 · 27B</span>
          </div>
          <p className="summary">{insight.executiveSummary}</p>
          <div className="insight-list">
            {insight.sections.map((section) => (
              <article key={section.title}>
                <h3>{section.title}</h3>
                <p>{section.narrative}</p>
                <div className="fact-row">
                  {factsForSection(section, insightPacket).map((fact) => (
                    <span key={fact.id} className={fact.direction}>
                      {fact.label} <strong>{fact.displayValue}</strong>
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
          <footer>
            <span>Bundled synthetic fixture</span>
            <span>Schema constrained</span>
            <span>Fact grounded</span>
            <span>No raw records</span>
          </footer>
        </section>
      </div>

      <section className="panel property-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">PROPERTY MOVEMENT</p>
            <h2>Operating positions</h2>
          </div>
          <small>Ordered by absolute occupancy movement</small>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Property</th>
                <th>Units</th>
                <th>Physical occupancy</th>
                <th>Movement</th>
                <th>Future occupancy</th>
                <th>Gross resident A/R</th>
              </tr>
            </thead>
            <tbody>
              {sortedProperties.map((property) => (
                <tr key={property.name}>
                  <td>
                    <strong>{property.name}</strong>
                  </td>
                  <td>{property.units}</td>
                  <td>{property.occupancy.toFixed(1)}%</td>
                  <td className={property.occupancyDelta >= 0 ? "good" : "bad"}>
                    {property.occupancyDelta >= 0 ? "+" : ""}
                    {property.occupancyDelta.toFixed(1)} pp
                  </td>
                  <td>{property.futureOccupancy.toFixed(1)}%</td>
                  <td>{money.format(property.ar)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="page-footer">
        <p>
          Atlas is a synthetic engineering showcase. All properties, dates, and
          figures are fictional.
        </p>
        <p>
          Local-first · Privacy by design · Deterministic financial calculations
        </p>
      </footer>
    </main>
  );
};
