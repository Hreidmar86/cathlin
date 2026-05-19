import { formatDate, formatNumber, pluralize } from "../../lib/format";

function metricCard(label, value, detail) {
  return (
    <article className="metric" key={label}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  );
}

export default function DashboardSection({ metrics }) {
  const cards = [
    metricCard("Total fångst", metrics.total, metrics.total ? `${pluralize(metrics.total, "fisk", "fiskar")} loggade` : "Tom logg än så länge"),
    metricCard(
      "Största gädda",
      metrics.biggestPike ? formatNumber(metrics.biggestPike.length, "cm") : "Ingen än",
      metrics.biggestPike ? `${metrics.biggestPike.angler} · ${formatDate(metrics.biggestPike.date)}` : "Logga gädda för att fylla kortet"
    ),
    metricCard(
      "Största abborre",
      metrics.biggestPerch ? formatNumber(metrics.biggestPerch.length, "cm") : "Ingen än",
      metrics.biggestPerch ? `${metrics.biggestPerch.angler} · ${formatDate(metrics.biggestPerch.date)}` : "Logga abborre för att fylla kortet"
    ),
    metricCard(
      "Tyngsta fisk",
      metrics.heaviest ? formatNumber(metrics.heaviest.weight, "kg", 1) : "Ingen än",
      metrics.heaviest ? `${metrics.heaviest.species} · ${formatNumber(metrics.heaviest.length, "cm")}` : "Lägg till vikt för ranking"
    ),
    metricCard(
      "Bästa fiskare",
      metrics.bestAngler?.[0] || "Ingen än",
      metrics.bestAngler ? `${metrics.bestAngler[1].count} fångster` : "Jämförelsen startar när loggen fylls"
    ),
    metricCard(
      "Mest använda metod",
      metrics.topMethod?.[0] || "Ingen än",
      metrics.topMethod ? `${metrics.topMethod[1]} loggar` : "Metod saknas i datan"
    ),
    metricCard(
      "Bästa plats",
      metrics.bestSpot?.[0] || "Ingen än",
      metrics.bestSpot ? `${metrics.bestSpot[1]} fångster registrerade` : "Platsdata behövs"
    ),
    metricCard(
      "Senaste turen",
      metrics.latestTrip?.tripName || metrics.latestTrip?.location || metrics.latestTrip?.species || "Ingen än",
      metrics.latestTrip ? `${formatDate(metrics.latestTrip.date)} · ${metrics.latestTrip.angler}` : "Nästa fisk dyker upp här"
    )
  ];

  return (
    <section className="section" id="dashboard">
      <div className="section-head">
        <div>
          <div className="eyebrow">Översikt</div>
          <h2>Säsongen i ett svep</h2>
        </div>
      </div>
      <div className="dashboard-grid">{cards}</div>
    </section>
  );
}
