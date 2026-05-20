import { formatDate, formatNumber } from "../../lib/format";

export default function HeroSection({
  teamName,
  summaryText,
  bestAngler,
  spotlight,
  releaseRate,
  totalCount,
  canCreate,
  onOpenForm,
  onNavigateFeed
}) {
  return (
    <section className="hero surface section" id="hero">
      <div className="hero-grid">
        <div className="hero-brand">
          <div className="hero-logo-wrap">
            <img className="hero-logo" src="/crpredators.png" alt="C&R Predators" />
          </div>
        </div>

        <div className="hero-copy">
          <div className="eyebrow">Säsongen</div>
          <h1>
            <span>{teamName}</span>
            <br />
            <span className="glow">Predator Log</span>
          </h1>
          <p className="hero-lead">{summaryText}</p>
          <div className="hero-actions">
            {canCreate ? (
              <button className="btn primary" type="button" onClick={onOpenForm}>
                Logga fångst
              </button>
            ) : null}
            <button className="btn soft" type="button" onClick={onNavigateFeed}>
              Se fångster
            </button>
          </div>

          <div className="hero-highlights">
            <article className="hero-tile">
              <span className="subtle">Fångster</span>
              <strong>{totalCount}</strong>
              <span className="tiny">loggade fiskar</span>
            </article>
            <article className="hero-tile">
              <span className="subtle">Release</span>
              <strong>{releaseRate}%</strong>
              <span className="tiny">släppta tillbaka</span>
            </article>
            <article className="hero-tile">
              <span className="subtle">Frontfigur</span>
              <strong>{bestAngler?.[0] || "Ingen än"}</strong>
              <span className="tiny">{bestAngler ? `${bestAngler[1].count} fångster` : "Väntar på första fisk"}</span>
            </article>
          </div>

          <div className="hero-spotlight">
            <div className="eyebrow">Top catch</div>
            {spotlight ? (
              <div className="stack">
                <div>
                  <strong className="spotlight-title">
                    {spotlight.species} · {formatNumber(spotlight.lengthCm, "cm")}
                  </strong>
                  <p className="subtle spotlight-meta">
                    {spotlight.angler} · {formatDate(spotlight.caughtAt)} · {spotlight.location || "Plats saknas"}
                  </p>
                </div>
                <div className="spec-line">
                  <span className="badge hot">{spotlight.species}</span>
                  <span className="badge">{formatNumber(spotlight.weightKg, "kg", 1)}</span>
                  <span className="badge">{spotlight.method || "Metod saknas"}</span>
                  {spotlight.personalBest ? <span className="badge">PB</span> : null}
                </div>
                <p className="feed-note">{spotlight.note || "En stark fisk som just nu definierar säsongen."}</p>
              </div>
            ) : (
              <div className="empty-state compact">
                <div>
                  <strong>Ingen spotlight än</strong>
                  <p className="subtle">När första fångsten finns dyker den upp här.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
