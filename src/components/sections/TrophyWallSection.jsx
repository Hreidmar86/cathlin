import { formatDate, formatNumber } from "../../lib/format";

export default function TrophyWallSection({ items, onOpenGallery }) {
  return (
    <section className="section" id="trophy">
      <div className="section-head">
        <div>
          <div className="eyebrow">Trofévägg</div>
          <h2>Personbästa per art</h2>
        </div>
      </div>

      {!items.length ? (
        <div className="empty-state compact">
          <div>
            <strong>Inga troféer ännu</strong>
            <p className="subtle">När loggen fylls med fångster dyker de starkaste fiskarna upp här.</p>
          </div>
        </div>
      ) : (
        <div className="trophy-grid">
          {items.map((item) => (
            <article className="trophy-card" key={item.id}>
              <div className="trophy-media">
                {item.imageUrl ? (
                  <button className="trophy-image-btn" type="button" onClick={() => onOpenGallery(item.id)}>
                    <img src={item.imageUrl} alt={item.species} loading="lazy" />
                  </button>
                ) : (
                  <div className="gallery-image-fallback trophy-fallback">
                    <strong>{item.species}</strong>
                    <span className="subtle">Ingen bild uppladdad</span>
                  </div>
                )}
                <div className="feed-badges">
                  <span className="badge hot">{item.species}</span>
                  <span className="badge">PB</span>
                </div>
              </div>
              <div className="trophy-copy">
                <strong>
                  {formatNumber(item.lengthCm, "cm")}
                  {item.weightKg ? ` · ${formatNumber(item.weightKg, "kg", 1)}` : ""}
                </strong>
                <p className="subtle">
                  {item.angler} · {formatDate(item.caughtAt)}
                </p>
                <p className="subtle">{item.location || "Plats saknas"}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
