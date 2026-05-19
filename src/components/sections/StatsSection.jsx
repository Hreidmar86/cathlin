import { CHART_COLORS } from "../../lib/stats";
import { formatNumber } from "../../lib/format";

function RingChart({ rows, total, label }) {
  let offset = 0;
  const slices = rows
    .map((row, index) => {
      const start = (offset / total) * 360;
      offset += row[1];
      const end = (offset / total) * 360;
      return `${CHART_COLORS[index % CHART_COLORS.length]} ${start}deg ${end}deg`;
    })
    .join(", ");

  return (
    <div className="stack">
      <div className="ring" style={{ background: `conic-gradient(${slices})` }}>
        <div className="ring-label">
          <strong>{label}</strong>
        </div>
      </div>
      <ul className="legend">
        {rows.map((row, index) => (
          <li key={row[0]}>
            <div className="legend-row">
              <span>
                <span className="swatch" style={{ display: "inline-block", background: CHART_COLORS[index % CHART_COLORS.length] }} />
                {row[0]}
              </span>
              <strong>{row[1]}</strong>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BarList({ rows, formatter = (label) => label }) {
  const max = Math.max(...rows.map((row) => row[1]), 1);
  return (
    <ul className="chart-list">
      {rows.map((row) => (
        <li key={row[0]}>
          <div className="list-line">
            <span>{formatter(row[0])}</span>
            <strong>{row[1]}</strong>
          </div>
          <div className="bar-track">
            <div className="bar-fill" style={{ width: `${Math.max(10, (row[1] / max) * 100)}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

function Leaderboard({ rows, keyName, unit, decimals = 0 }) {
  return (
    <ol className="leaderboard">
      {rows.map((item, index) => (
        <li key={`${item.id}-${keyName}`}>
          <div className="list-line">
            <span>{`${index + 1}. ${item.species} · ${item.angler}`}</span>
            <strong>{formatNumber(item[keyName], unit, decimals)}</strong>
          </div>
          <div className="tiny">{`${item.location || "Plats saknas"} · ${item.caughtAt}`}</div>
        </li>
      ))}
    </ol>
  );
}

function EmptyMini({ message }) {
  return (
    <div className="empty-state compact">
      <div>
        <strong>{message}</strong>
      </div>
    </div>
  );
}

export default function StatsSection({ stats }) {
  const primarySpecies = stats.species[0];

  return (
    <section className="section" id="stats">
      <div className="section-head">
        <div>
          <div className="eyebrow">Statistik</div>
          <h2>Statistik</h2>
        </div>
      </div>

      <div className="stats-grid">
        <article className="stat-card">
          <h3>Artfördelning</h3>
          {stats.species.length ? (
            <RingChart
              rows={stats.species}
              total={Math.max(stats.species.reduce((sum, row) => sum + row[1], 0), 1)}
              label={primarySpecies ? `${primarySpecies[0]}\n${primarySpecies[1]} st` : "Tomt"}
            />
          ) : (
            <EmptyMini message="Ingen artdata än" />
          )}
        </article>

        <article className="stat-card">
          <h3>Fiskare</h3>
          {stats.anglers.length ? <BarList rows={stats.anglers} /> : <EmptyMini message="Ingen fiskardata än" />}
        </article>

        <article className="stat-card">
          <h3>Tempo</h3>
          <div className="setting-row">
            <div className="list-line">
              <span>Snittlängd</span>
              <strong>{formatNumber(stats.averageLength, "cm", 1)}</strong>
            </div>
            <div className="list-line">
              <span>Snittvikt</span>
              <strong>{formatNumber(stats.averageWeight, "kg", 2)}</strong>
            </div>
            <div className="list-line">
              <span>Återutsättning</span>
              <strong>{stats.releaseRate}%</strong>
            </div>
          </div>
        </article>

        <article className="stat-card">
          <h3>Längdtopplista</h3>
          {stats.lengths.length ? <Leaderboard rows={stats.lengths} keyName="lengthCm" unit="cm" /> : <EmptyMini message="Ingen längddata än" />}
        </article>

        <article className="stat-card">
          <h3>Vikttopplista</h3>
          {stats.weights.length ? <Leaderboard rows={stats.weights} keyName="weightKg" unit="kg" decimals={1} /> : <EmptyMini message="Ingen viktdata än" />}
        </article>

        <article className="stat-card">
          <h3>Fångster per månad</h3>
          {stats.months.length ? (
            <BarList
              rows={stats.months}
              formatter={(value) => {
                const date = new Date(`${value}-01T00:00:00`);
                return new Intl.DateTimeFormat("sv-SE", { month: "short", year: "numeric" }).format(date);
              }}
            />
          ) : (
            <EmptyMini message="Ingen månadsdata än" />
          )}
        </article>

        <article className="stat-card">
          <h3>Platser</h3>
          {stats.spots.length ? <BarList rows={stats.spots} /> : <EmptyMini message="Ingen platsdata än" />}
        </article>
      </div>
    </section>
  );
}
